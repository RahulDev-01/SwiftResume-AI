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
        // Check for 'Projects' or fallback to 'certifications' if needed, but plan says 'Projects'
        const incoming = resumeInfo?.Projects || resumeInfo?.certifications;
        if (Array.isArray(incoming) && incoming.length) {
            // Map old certification fields to new project fields if necessary, or just load
            // For now, assuming fresh start or compatible data structure
            setProjects(incoming);
        }
    }, [resumeInfo]);

    useEffect(() => {
        if (!hasUserEdited || typeof setResumeInfo !== 'function') return;
        setResumeInfo((prev) => ({
            ...prev,
            Projects: projects,
        }));
    }, [projects, hasUserEdited, setResumeInfo]);

    const onSave = async () => {
        try {
            setLoading(true);
            const paramId = params.resumeId;
            const isNumericId = /^\d+$/.test(String(paramId));

            let current = {};
            try {
                if (isNumericId) {
                    const currentResp = await GlobalApi.GetResumeById(paramId);
                    current = currentResp?.data?.data?.attributes || {};
                } else {
                    const currentResp = await GlobalApi.GetResumeByDocumentId(paramId);
                    current = currentResp?.data?.data || {};
                }
            } catch (err) {
                console.warn('Could not fetch current resume', err);
                current = {};
            }

            // Normalize projects - STRIP 'id' field
            const normalizedProjects = projects
                .map((c) => {
                    const { id, ...rest } = c; // Remove id field
                    return {
                        title: rest.title?.trim() || '',
                        linkDisplay: rest.linkDisplay?.trim() || '',
                        url: rest.url?.trim() || '',
                        description: rest.description?.trim() || '',
                    };
                })
                .filter((c) => c.title && c.title.trim() !== '');

            const systemKeys = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'];
            const scalarAllowed = new Set([
                'title', 'resumeId', 'userEmail', 'userName',
                'firstName', 'lastName', 'jobTitle', 'address', 'phone', 'email',
                'summery', 'themeColor', 'color', 'templateId'
            ]);
            const base = Object.fromEntries(
                Object.entries(current || {})
                    .filter(([k, v]) => !systemKeys.includes(k))
                    .filter(([k, v]) => scalarAllowed.has(k))
                    .filter(([k, v]) => v === null || ['string', 'number', 'boolean'].includes(typeof v))
            );

            if (!base.title) {
                base.title = 'My Resume';
            }

            const projectsKey = 'Projects'; // Updated key
            const updateData = { ...base, [projectsKey]: normalizedProjects };
            const data = { data: updateData };

            if (isNumericId) {
                await GlobalApi.UpdateResumeDetailWithLocale(paramId, data, current?.locale);
            } else {
                await GlobalApi.UpdateResumeByDocumentId(paramId, data);
            }

            setLoading(false);
            toast("Projects Updated Successfully ✅");
        } catch (err) {
            console.error('Failed to update projects', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setLoading(false);
            toast("Projects Update Failed ❌");
            throw err;
        }
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
