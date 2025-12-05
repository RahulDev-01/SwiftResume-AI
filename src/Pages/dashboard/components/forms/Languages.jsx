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

                // Clean up OTHER component arrays (but NOT Languages since we're replacing it)
                const componentKeys = [
                    'education', 'Education',
                    'skills', 'Skills',
                    'certifications', 'Certifications',
                    'Projects', 'projects',
                    'experience', 'Experience'
                ];
                componentKeys.forEach((key) => {
                    if (Array.isArray(base[key])) {
                        base[key] = base[key].map(({ id, ...rest }) => rest);
                    }
                });

                // Remove old Languages before setting new ones
                delete base.Languages;
                delete base.languages;

                // ---------------------------------------------------------------
                // 4️⃣ Attach the cleaned languages data using the exact Strapi field name
                // ---------------------------------------------------------------
                // Always set Languages as an array (even if empty) to ensure Strapi processes it
                base.Languages = normalizedLanguages || [];

                // Explicitly valid key is 'Languages'. Remove 'languages' to avoid duplicates/confusion.
                delete base.languages;

                // Log data structure being sent
                console.log('[Languages Save] Preparing payload:', {
                    LanguagesCount: base.Languages?.length,
                    hasTitle: !!base.title,
                    baseKeys: Object.keys(base)
                });

                // ---------------------------------------------------------------
                // 5️⃣ Send the update request
                // ---------------------------------------------------------------
                // Validate that we have data to send
                if (!normalizedLanguages || normalizedLanguages.length === 0) {
                    toast.warning("Please add at least one language with a name");
                    setLoading(false);
                    reject(new Error('No languages to save'));
                    return;
                }

                // Log payload in production for debugging
                const payloadForLog = {
                    LanguagesCount: base.Languages?.length,
                    hasTitle: !!base.title,
                    baseKeys: Object.keys(base),
                    firstLanguage: base.Languages?.[0] ? { name: base.Languages[0].name } : null
                };
                console.log('[Languages Save] Payload:', payloadForLog);

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

                // Strapi update response might not include populated Languages, so we check if response exists
                // The data is saved if we get a 200 response
                const responseData = resp?.data?.data || {};
                const responseLanguages = responseData?.attributes?.Languages || responseData?.Languages;
                
                console.log('[Languages Save] Response received:', {
                    hasData: !!resp?.data,
                    hasResponseData: !!responseData,
                    responseHasLanguages: !!responseLanguages,
                    responseKeys: Object.keys(responseData),
                    status: resp?.status
                });

                setLoading(false);
                toast("Languages Updated Successfully ✅");

                // Refresh data from server to get the latest Languages (since update response might not populate them)
                try {
                    let freshData;
                    if (isNumericId) {
                        const freshResp = await GlobalApi.GetResumeById(paramId);
                        freshData = freshResp?.data?.data?.attributes || freshResp?.data?.data || {};
                    } else {
                        const freshResp = await GlobalApi.GetResumeByDocumentId(paramId);
                        freshData = freshResp?.data?.data?.attributes || freshResp?.data?.data || {};
                    }
                    
                    // Use fresh Languages from server if available, otherwise use normalizedLanguages
                    const savedLanguages = freshData?.Languages || normalizedLanguages;
                    
                    console.log('[Languages Save] Refreshed data:', {
                        hasFreshLanguages: !!freshData?.Languages,
                        languagesCount: savedLanguages?.length
                    });

                    setResumeInfo(prev => ({
                        ...prev,
                        ...freshData,
                        Languages: savedLanguages,
                        languages: savedLanguages,
                        attributes: {
                            ...(prev?.attributes || {}),
                            ...freshData,
                            Languages: savedLanguages,
                        }
                    }));
                } catch (refreshErr) {
                    // If refresh fails, use optimistic update
                    console.warn('[Languages Save] Could not refresh, using optimistic update:', refreshErr);
                    setResumeInfo(prev => ({
                        ...prev,
                        Languages: normalizedLanguages,
                        languages: normalizedLanguages,
                        attributes: {
                            ...(prev?.attributes || {}),
                            Languages: normalizedLanguages,
                        }
                    }));
                }

                if (enableNext) enableNext(true);
                resolve(resp);
            } catch (err) {
                setLoading(false);
                const errorMsg = err?.response?.data?.error?.message || err?.message || 'Failed to update languages';
                const status = err?.response?.status;
                
                // Always log errors in production for debugging
                console.error('[Languages Save] Failed:', {
                    error: errorMsg,
                    status: status,
                    statusText: err?.response?.statusText,
                    errorDetails: err?.response?.data,
                    payloadSent: {
                        LanguagesCount: base?.Languages?.length,
                        hasTitle: !!base?.title
                    }
                });
                
                toast.error(`Languages Update Failed: ${errorMsg}${status ? ` (${status})` : ''}`);
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
