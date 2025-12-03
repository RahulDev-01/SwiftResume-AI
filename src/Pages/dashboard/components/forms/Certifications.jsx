import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import GlobalApi from "@/../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ResumeInfoContext } from "@/context/ResumeInfoContext.jsx";

const Certifications = forwardRef(({ enableNext }, ref) => {
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) || {};
    const [certifications, setCertifications] = useState([
        { title: "", issuer: "", date: "", url: "" },
    ]);
    const [hasUserEdited, setHasUserEdited] = useState(false);

    const AddNewCertification = () => {
        setCertifications([...certifications, { title: "", issuer: "", date: "", url: "" }]);
        setHasUserEdited(true);
    };

    const RemoveCertification = () => {
        setCertifications(certifications.slice(0, -1));
        setHasUserEdited(true);
    };

    const handleChange = (index, name, value) => {
        const newEntries = certifications.slice();
        newEntries[index][name] = value;
        setCertifications(newEntries);
        setHasUserEdited(true);
    };

    useEffect(() => {
        const incoming = resumeInfo?.certifications;
        if (Array.isArray(incoming) && incoming.length) {
            setCertifications(incoming);
        }
    }, [resumeInfo?.certifications]);

    useEffect(() => {
        if (!hasUserEdited || typeof setResumeInfo !== 'function') return;
        setResumeInfo((prev) => ({
            ...prev,
            certifications: certifications,
        }));
    }, [certifications, hasUserEdited, setResumeInfo]);

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

            // Normalize certifications - STRIP 'id' field
            const normalizedCertifications = certifications
                .map((c) => {
                    const { id, ...rest } = c; // Remove id field
                    return {
                        title: rest.title?.trim() || '',
                        issuer: rest.issuer?.trim() || '',
                        date: rest.date?.trim() || '',
                        url: rest.url?.trim() || '',
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

            const certificationsKey = 'Certifications';
            const updateData = { ...base, [certificationsKey]: normalizedCertifications };
            const data = { data: updateData };

            if (isNumericId) {
                await GlobalApi.UpdateResumeDetailWithLocale(paramId, data, current?.locale);
            } else {
                await GlobalApi.UpdateResumeByDocumentId(paramId, data);
            }

            setLoading(false);
            toast("Certifications Updated Successfully ✅");
        } catch (err) {
            console.error('Failed to update certifications', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setLoading(false);
            toast("Certifications Update Failed ❌");
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
                {certifications.map((cert, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3 mt-4 p-4 border border-white/30 rounded-xl bg-white/40 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                        <div>
                            <label className="text-xs font-medium text-gray-700">Project Title</label>
                            <Input className="input-glass w-full" value={cert.title || ''} onChange={(e) => handleChange(index, "title", e.target.value)} placeholder="e.g. E-commerce Website" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-700">Technologies Used</label>
                            <Input className="input-glass w-full" value={cert.issuer || ''} onChange={(e) => handleChange(index, "issuer", e.target.value)} placeholder="e.g. React, Node.js" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-700">Date</label>
                            <Input className="input-glass w-full" value={cert.date || ''} onChange={(e) => handleChange(index, "date", e.target.value)} placeholder="e.g. 2023" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-700">Project URL (Optional)</label>
                            <Input className="input-glass w-full" value={cert.url || ''} onChange={(e) => handleChange(index, "url", e.target.value)} placeholder="https://github.com/..." />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-6">
                <div className="flex gap-3">
                    <Button variant="outline" onClick={AddNewCertification} className="btn-glass-outline">
                        + Add More Project
                    </Button>
                    {certifications.length > 1 && (
                        <Button variant="outline" onClick={RemoveCertification} className="border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200">
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

Certifications.displayName = 'Certifications';

export default Certifications;
