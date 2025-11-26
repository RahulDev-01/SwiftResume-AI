import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import GlobalApi from "@/../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ResumeInfoContext } from "@/context/ResumeInfoContext.jsx";

const Languages = forwardRef(({ enableNext }, ref) => {
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) || {};
    const [languages, setLanguages] = useState([
        { name: "", proficiency: "" },
    ]);
    const [hasUserEdited, setHasUserEdited] = useState(false);

    const AddNewLanguage = () => {
        setLanguages([...languages, { name: "", proficiency: "" }]);
        setHasUserEdited(true);
    };

    const RemoveLanguage = () => {
        setLanguages(languages.slice(0, -1));
        setHasUserEdited(true);
    };

    const handleChange = (index, name, value) => {
        const newEntries = languages.slice();
        newEntries[index][name] = value;
        setLanguages(newEntries);
        setHasUserEdited(true);
    };

    useEffect(() => {
        const incoming = resumeInfo?.languages;
        if (Array.isArray(incoming) && incoming.length) {
            setLanguages(incoming);
        }
    }, [resumeInfo?.languages]);

    useEffect(() => {
        if (!hasUserEdited || typeof setResumeInfo !== 'function') return;
        setResumeInfo((prev) => ({
            ...prev,
            languages: languages,
        }));
    }, [languages, hasUserEdited, setResumeInfo]);

    const onSave = async () => {
        try {
            setLoading(true);
            const paramId = params.resumeId;
            const isNumericId = /^\d+$/.test(String(paramId));

            // Normalize languages - STRIP 'id' field
            const normalizedLanguages = languages
                .map((l) => {
                    const { id, ...rest } = l; // Remove id field
                    return {
                        name: rest.name?.trim() || '',
                        proficiency: rest.proficiency?.trim() || '',
                    };
                })
                .filter((l) => l.name && l.name.trim() !== '');

            const languagesKey = 'Languages';
            const updateData = { [languagesKey]: normalizedLanguages };
            const data = { data: updateData };

            if (isNumericId) {
                await GlobalApi.UpdateResumeDetail(paramId, data);
            } else {
                await GlobalApi.UpdateResumeByDocumentId(paramId, data);
            }

            setLoading(false);
            toast("Languages Updated Successfully ✅");
        } catch (err) {
            console.error('Failed to update languages', err);
            console.error('Error details:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            setLoading(false);
            toast("Languages Update Failed ❌");
            throw err;
        }
    };

    useImperativeHandle(ref, () => ({
        handleSave: onSave
    }));

    return (
        <div className="glass-card mt-5">
            <h2 className="section-title">Languages</h2>
            <p className="section-subtitle">Add Languages You Speak</p>
            <div>
                {languages.map((language, index) => (
                    <div key={index} className="grid grid-cols-2 gap-3 mt-4 p-4 border border-white/30 rounded-xl bg-white/40 backdrop-blur-sm hover:shadow-md transition-all duration-300">
                        <div>
                            <label className="text-xs font-medium text-gray-700">Language</label>
                            <Input className="input-glass w-full" value={language.name || ''} onChange={(e) => handleChange(index, "name", e.target.value)} placeholder="e.g. English" />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-700">Proficiency</label>
                            <Input className="input-glass w-full" value={language.proficiency || ''} onChange={(e) => handleChange(index, "proficiency", e.target.value)} placeholder="e.g. Native/Fluent/Professional" />
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-6">
                <div className="flex gap-3">
                    <Button variant="outline" onClick={AddNewLanguage} className="btn-glass-outline">
                        + Add More Language
                    </Button>
                    {languages.length > 1 && (
                        <Button variant="outline" onClick={RemoveLanguage} className="border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200">
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

Languages.displayName = 'Languages';

export default Languages;
