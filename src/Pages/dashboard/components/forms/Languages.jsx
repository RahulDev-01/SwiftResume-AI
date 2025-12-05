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
        // Check for both 'Languages' and 'languages' casing
        const incoming = resumeInfo?.Languages || resumeInfo?.languages;
        if (Array.isArray(incoming) && incoming.length) {
            setLanguages(incoming);
        }
    }, [resumeInfo?.Languages, resumeInfo?.languages]);

    useEffect(() => {
        if (!hasUserEdited || typeof setResumeInfo !== 'function') return;
        setResumeInfo((prev) => ({
            ...prev,
            Languages: languages,
            languages: languages,
        }));
    }, [languages, hasUserEdited, setResumeInfo]);

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

                if (!resumeInfo?.attributes) {
                    try {
                        if (isNumericId) {
                            const resp = await GlobalApi.GetResumeById(paramId);
                            current = resp?.data?.data?.attributes || {};
                        } else {
                            const resp = await GlobalApi.GetResumeByDocumentId(paramId);
                            current = resp?.data?.data || {};
                        }
                    } catch (err) {
                        console.warn('Could not fetch current resume', err);
                        current = {};
                    }
                }

                // ---------------------------------------------------------------
                // 2️⃣ Normalise Languages - strip stray `id` fields
                // ---------------------------------------------------------------
                const normalizedLanguages = languages
                    .map((l) => {
                        const { id, ...rest } = l;
                        return {
                            name: rest.name?.trim() || '',
                            proficiency: rest.proficiency?.trim() || '',
                        };
                    })
                    .filter((l) => l.name && l.name.trim() !== '');

                // ---------------------------------------------------------------
                // 3️⃣ Build a clean base object – remove system keys & strip ids from
                //    *all* other repeatable component arrays
                // ---------------------------------------------------------------
                const systemKeys = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'];
                const base = Object.fromEntries(
                    Object.entries(current || {}).filter(([k]) => !systemKeys.includes(k))
                );

                // Ensure a title exists
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
                // 4️⃣ Attach the cleaned languages data using the exact Strapi field name
                // ---------------------------------------------------------------
                base.Languages = normalizedLanguages;
                delete base.languages;

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
                toast("Languages Updated Successfully ✅");

                // Update global context immediately
                setResumeInfo(prev => ({
                    ...prev,
                    Languages: normalizedLanguages,
                    languages: normalizedLanguages,
                }));

                if (enableNext) enableNext(true);
                resolve(resp);
            } catch (err) {
                console.error('Failed to update languages', {
                    err,
                    status: err?.response?.status,
                    data: err?.response?.data,
                });
                setLoading(false);
                toast("Languages Update Failed ❌");
                reject(err);
            }
        });
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
