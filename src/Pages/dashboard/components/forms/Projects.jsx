import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useContext, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import GlobalApi from "@/../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ResumeInfoContext } from "@/context/ResumeInfoContext.jsx";

const Projects = forwardRef(({ enableNext }, ref) => {
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) || {};
    const [projects, setProjects] = useState([
        { title: "", linkDisplay: "", url: "", description: "" },
    ]);
    const [hasUserEdited, setHasUserEdited] = useState(false);

    const AddNewProject = () => {
        setProjects([...projects, { title: "", linkDisplay: "", url: "", description: "" }]);
        setHasUserEdited(true);
    };

    const RemoveProject = () => {
        setProjects(projects.slice(0, -1));
        setHasUserEdited(true);
    };

    const handleChange = (index, name, value) => {
        const newEntries = projects.slice();
        newEntries[index][name] = value;
        setProjects(newEntries);
        setHasUserEdited(true);
    };

    useEffect(() => {
        // Check for 'Projects' or 'projects'
        const incoming = resumeInfo?.Projects || resumeInfo?.projects;
        if (Array.isArray(incoming) && incoming.length) {
            setProjects(incoming);
        }
    }, [resumeInfo?.Projects, resumeInfo?.projects]);

    useEffect(() => {
        if (!hasUserEdited || typeof setResumeInfo !== 'function') return;
        setResumeInfo((prev) => ({
            ...prev,
            Projects: projects,
            projects: projects,
        }));
    }, [projects, hasUserEdited, setResumeInfo]);

    const onSave = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                setLoading(true);
                const paramId = params.resumeId;
                const isNumericId = /^\d+$/.test(String(paramId));

                // ---------------------------------------------------------------
                // 1️⃣ Always fetch fresh resume data to ensure we have latest state
                // ---------------------------------------------------------------
                let current = {};
                try {
                    if (isNumericId) {
                        const resp = await GlobalApi.GetResumeById(paramId);
                        current = resp?.data?.data?.attributes || resp?.data?.data || {};
                    } else {
                        const resp = await GlobalApi.GetResumeByDocumentId(paramId);
                        // Handle both Strapi v4 and v5 response structures
                        current = resp?.data?.data?.attributes || resp?.data?.data || {};
                    }
                } catch (err) {
                    // If fetch fails, try to use context data as fallback
                    current = resumeInfo?.attributes || resumeInfo || {};
                    if (import.meta.env.DEV) {
                        console.warn('Could not fetch current resume, using context:', err);
                    }
                }

                // ---------------------------------------------------------------
                // 2️⃣ Normalise Projects - strip stray `id` fields
                // ---------------------------------------------------------------
                const normalizedProjects = projects
                    .map((e) => {
                        const { id, ...rest } = e;
                        return {
                            title: rest.title?.trim() || '',
                            linkDisplay: rest.linkDisplay?.trim() || '',
                            url: rest.url?.trim() || '',
                            description: rest.description?.trim() || '',
                        };
                    })
                    .filter((e) => e.title && e.title.trim() !== '');

                // ---------------------------------------------------------------
                // 3️⃣ Build a clean base object – remove system keys & strip ids from
                //    *all* other repeatable component arrays
                // ---------------------------------------------------------------
                const systemKeys = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'];
                const base = Object.fromEntries(
                    Object.entries(current || {}).filter(([k]) => !systemKeys.includes(k))
                );

                // Ensure a title exists (Strapi requires it)
                if (!base.title) base.title = 'My Resume';

                const componentKeys = [
                    'education', 'Education',
                    'skills', 'Skills',
                    'languages', 'Languages',
                    'Projects', 'projects',
                    'experience', 'Experience'
                ];
                componentKeys.forEach((key) => {
                    if (Array.isArray(base[key])) {
                        base[key] = base[key].map(({ id, ...rest }) => rest);
                    }
                });

                // ---------------------------------------------------------------
                // 4️⃣ Attach the cleaned projects data using the exact Strapi field name
                // ---------------------------------------------------------------
                // Always set Projects as an array (even if empty) to ensure Strapi processes it
                base.Projects = normalizedProjects || [];

                // Explicitly valid key is 'Projects'. Remove 'projects' to avoid duplicates/confusion.
                delete base.projects;

                // Log data structure being sent
                console.log('[Projects Save] Preparing payload:', {
                    ProjectsCount: base.Projects?.length,
                    hasTitle: !!base.title,
                    baseKeys: Object.keys(base)
                });

                // ---------------------------------------------------------------
                // 5️⃣ Send the update request
                // ---------------------------------------------------------------
                // Validate that we have data to send
                if (!normalizedProjects || normalizedProjects.length === 0) {
                    toast.warning("Please add at least one project with a title");
                    setLoading(false);
                    reject(new Error('No projects to save'));
                    return;
                }

                // Log payload in production for debugging (remove sensitive data)
                const payloadForLog = {
                    ProjectsCount: base.Projects?.length,
                    hasTitle: !!base.title,
                    baseKeys: Object.keys(base),
                    firstProject: base.Projects?.[0] ? { title: base.Projects[0].title } : null
                };
                console.log('[Projects Save] Payload:', payloadForLog);

                let resp;
                if (isNumericId) {
                    // Use locale from current data if available, otherwise undefined
                    const locale = current?.locale;
                    resp = await GlobalApi.UpdateResumeDetailWithLocale(paramId, { data: base }, locale);
                } else {
                    resp = await GlobalApi.UpdateResumeByDocumentId(paramId, { data: base });
                }

                // Verify the response
                if (!resp?.data) {
                    throw new Error('Invalid response from server - no data returned');
                }

                // Strapi update response might not include populated Projects, so we check if response exists
                // The data is saved if we get a 200 response
                const responseData = resp?.data?.data || {};
                const responseProjects = responseData?.attributes?.Projects || responseData?.Projects;
                
                console.log('[Projects Save] Response received:', {
                    hasData: !!resp?.data,
                    hasResponseData: !!responseData,
                    responseHasProjects: !!responseProjects,
                    responseKeys: Object.keys(responseData),
                    status: resp?.status
                });

                setLoading(false);
                toast("Projects Updated Successfully ✅");

                // Refresh data from server to get the latest Projects (since update response might not populate them)
                try {
                    let freshData;
                    if (isNumericId) {
                        const freshResp = await GlobalApi.GetResumeById(paramId);
                        freshData = freshResp?.data?.data?.attributes || freshResp?.data?.data || {};
                    } else {
                        const freshResp = await GlobalApi.GetResumeByDocumentId(paramId);
                        freshData = freshResp?.data?.data?.attributes || freshResp?.data?.data || {};
                    }
                    
                    // Use fresh Projects from server if available, otherwise use normalizedProjects
                    const savedProjects = freshData?.Projects || normalizedProjects;
                    
                    console.log('[Projects Save] Refreshed data:', {
                        hasFreshProjects: !!freshData?.Projects,
                        projectsCount: savedProjects?.length
                    });

                    setResumeInfo(prev => ({
                        ...prev,
                        ...freshData,
                        Projects: savedProjects,
                        projects: savedProjects,
                        attributes: {
                            ...(prev?.attributes || {}),
                            ...freshData,
                            Projects: savedProjects,
                        }
                    }));
                } catch (refreshErr) {
                    // If refresh fails, use optimistic update
                    console.warn('[Projects Save] Could not refresh, using optimistic update:', refreshErr);
                    setResumeInfo(prev => ({
                        ...prev,
                        Projects: normalizedProjects,
                        projects: normalizedProjects,
                        attributes: {
                            ...(prev?.attributes || {}),
                            Projects: normalizedProjects,
                        }
                    }));
                }

                if (enableNext) enableNext(true);
                resolve(resp);
            } catch (err) {
                setLoading(false);
                const errorMsg = err?.response?.data?.error?.message || err?.message || 'Failed to update projects';
                const status = err?.response?.status;
                
                // Always log errors in production for debugging
                console.error('[Projects Save] Failed:', {
                    error: errorMsg,
                    status: status,
                    statusText: err?.response?.statusText,
                    errorDetails: err?.response?.data,
                    payloadSent: {
                        ProjectsCount: base?.Projects?.length,
                        hasTitle: !!base?.title
                    }
                });
                
                toast.error(`Projects Update Failed: ${errorMsg}${status ? ` (${status})` : ''}`);
                reject(err);
            }
        });
    };

    useImperativeHandle(ref, () => ({
        handleSave: onSave
    }));

    return (
        <div className="glass-card mt-5">
            <h2 className="section-title">Projects</h2>
            <p className="section-subtitle">Add Your Professional Projects</p>
            <div>
                {projects.map((proj, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3 mt-4 p-4 border border-white/30 rounded-xl bg-white/40 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                        <div className="col-span-2">
                            <label className="text-xs font-medium text-gray-700">Project Name</label>
                            <Input className="input-glass w-full" value={proj.title || ''} onChange={(e) => handleChange(index, "title", e.target.value)} placeholder="e.g. E-commerce Website" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-700">Project Link (Display Text)</label>
                            <Input className="input-glass w-full" value={proj.linkDisplay || ''} onChange={(e) => handleChange(index, "linkDisplay", e.target.value)} placeholder="e.g. Live Demo" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-700">Project URL</label>
                            <Input className="input-glass w-full" value={proj.url || ''} onChange={(e) => handleChange(index, "url", e.target.value)} placeholder="https://..." />
                        </div>
                        <div className="col-span-2">
                            <label className="text-xs font-medium text-gray-700">Description</label>
                            <Textarea className="input-glass w-full" value={proj.description || ''} onChange={(e) => handleChange(index, "description", e.target.value)} placeholder="Describe your project..." />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-6">
                <div className="flex gap-3">
                    <Button variant="outline" onClick={AddNewProject} className="btn-glass-outline">
                        + Add More Project
                    </Button>
                    {projects.length > 1 && (
                        <Button variant="outline" onClick={RemoveProject} className="border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200">
                            - Remove
                        </Button>
                    )}
                </div>

                <Button disabled={loading} onClick={onSave} className="btn-premium">
                    {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
                </Button>
            </div>
        </div>
    );
});

Projects.displayName = 'Projects';

export default Projects;
