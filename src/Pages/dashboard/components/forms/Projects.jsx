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
        // Check for 'Projects' or 'projects' or fallback to 'certifications' (due to schema mapping)
        const incoming = resumeInfo?.Projects || resumeInfo?.projects || resumeInfo?.certifications;
        console.log('[Projects] Incoming data check:', {
            resumeInfoKeys: Object.keys(resumeInfo || {}),
            Projects: resumeInfo?.Projects,
            projects: resumeInfo?.projects,
            certifications: resumeInfo?.certifications,
            RESULT: incoming
        });

        if (Array.isArray(incoming) && incoming.length) {
            setProjects(incoming);
        }
    }, [resumeInfo?.Projects, resumeInfo?.projects, resumeInfo?.certifications]);

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
                // 1️⃣ Fetch the freshest resume data (fallback to context if present)
                // ---------------------------------------------------------------
                let current = resumeInfo?.attributes || {};
                console.log('[Projects] onSave - Context resumeInfo:', resumeInfo);

                if (!resumeInfo?.attributes) {
                    try {
                        if (isNumericId) {
                            const resp = await GlobalApi.GetResumeById(paramId);
                            current = resp?.data?.data?.attributes || {};
                        } else {
                            const resp = await GlobalApi.GetResumeByDocumentId(paramId);
                            current = resp?.data?.data || {};
                        }
                        console.log('[Projects] onSave - Fetched fresh current:', current);
                    } catch (err) {
                        console.warn('Could not fetch current resume', err);
                        current = {};
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
                    'certifications', 'Certifications',
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
                base.Projects = normalizedProjects;

                // Explicitly valid key is 'Projects'. Remove 'projects' to avoid duplicates/confusion.
                delete base.projects;
                // Remove 'certifications' if it exists in base to prevent collision since projects maps to certifications component
                // (Only if it's the SAME data; if 'Certifications' is distinct in your app, be careful. 
                // But schema says Projects uses certifications component. There is no Certifications attribute.)
                // So better to remove it to be safe.
                delete base.certifications;

                // ---------------------------------------------------------------
                // 5️⃣ Send the update request
                // ---------------------------------------------------------------
                let resp;
                if (isNumericId) {
                    let locale;
                    try {
                        const r = await GlobalApi.GetResumeById(paramId);
                        locale = r?.data?.data?.attributes?.locale;
                    } catch (e) { }

                    resp = await GlobalApi.UpdateResumeDetailWithLocale(paramId, { data: base }, locale);
                } else {
                    resp = await GlobalApi.UpdateResumeByDocumentId(paramId, { data: base });
                }

                setLoading(false);
                toast("Projects Updated Successfully ✅");

                // Update context
                setResumeInfo(prev => ({
                    ...prev,
                    Projects: normalizedProjects,
                    projects: normalizedProjects,
                }));

                if (enableNext) enableNext(true);
                resolve(resp);
            } catch (err) {
                console.error('Failed to update projects', {
                    err,
                    status: err?.response?.status,
                    data: err?.response?.data,
                });
                setLoading(false);
                toast("Projects Update Failed ❌");
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
