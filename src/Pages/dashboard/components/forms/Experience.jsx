import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import RichTextEditor from "../RichTextEditor";
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext";
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import GlobalApi from '../../../../../service/GlobalApi';

// Helper to create a blank experience entry
const createEmptyField = () => ({
  title: '',
  companyName: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  workSummery: '',
});

/**
 * Experience form component.
 * Sends only the "Experience" field (capitalised as Strapi expects) and strips any stray `id` fields
 * from all repeatable components before updating the resume.
 */
const Experience = forwardRef(({ enableNext }, ref) => {
  const [experienceList, setExperienceList] = useState([createEmptyField()]);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  // ---------------------------------------------------------------------------
  // Handlers for UI interactions
  // ---------------------------------------------------------------------------
  const handleChange = (index, event) => {
    const newEntries = [...experienceList];
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
    setHasUserEdited(true);
  };

  const handleRichTextEditor = (e, name, index) => {
    const newEntries = [...experienceList];
    newEntries[index] = { ...newEntries[index], [name]: e.target.value };
    setExperienceList(newEntries);
    setHasUserEdited(true);
  };

  const AddNewExp = () => {
    setExperienceList((prev) => [...prev, createEmptyField()]);
    setHasUserEdited(true);
  };

  const RemoveNewExp = () => {
    setExperienceList((prev) => prev.slice(0, -1));
    setHasUserEdited(true);
  };

  // ---------------------------------------------------------------------------
  // Save logic – builds a minimal, clean payload for Strapi
  // ---------------------------------------------------------------------------
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
        // 2️⃣ Normalise the experience entries – strip stray `id` fields
        // ---------------------------------------------------------------
        const normalizedExperience = experienceList
          .map((e) => {
            const { id, ...rest } = e;
            return {
              title: rest.title?.trim() || null,
              companyName: rest.companyName?.trim() || null,
              city: rest.city?.trim() || null,
              state: rest.state?.trim() || null,
              startDate: rest.startDate || null,
              endDate: rest.endDate || null,
              workSummery: (rest.workSummery ?? '').toString(),
            };
          })
          .filter(
            (e) =>
              e.title ||
              e.companyName ||
              e.city ||
              e.state ||
              e.startDate ||
              e.endDate ||
              (e.workSummery && e.workSummery.trim() !== '')
          );

        // ---------------------------------------------------------------
        // 3️⃣ Build a clean base object – remove system keys & strip ids from
        //    *all* other repeatable component arrays (education, skills, …)
        // ---------------------------------------------------------------
        const systemKeys = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'];
        const base = Object.fromEntries(
          Object.entries(current || {}).filter(([k]) => !systemKeys.includes(k))
        );

        // Ensure a title exists (Strapi requires it)
        if (!base.title) base.title = 'My Resume';

        const componentKeys = [
          'education',
          'Education',
          'skills',
          'Skills',
          'languages',
          'Languages',
          'certifications',
          'Certifications',
        ];
        componentKeys.forEach((key) => {
          if (Array.isArray(base[key])) {
            base[key] = base[key].map(({ id, ...rest }) => rest);
          }
        });

        // ---------------------------------------------------------------
        // 4️⃣ Attach the cleaned experience data using the exact Strapi field name
        // ---------------------------------------------------------------
        base.Experience = normalizedExperience; // Strapi expects capitalised field
        delete base.experience; // remove any accidental lowercase key

        // ---------------------------------------------------------------
        // 5️⃣ Send the update request
        // ---------------------------------------------------------------
        let resp;
        if (isNumericId) {
          const locale = current?.locale;
          resp = await GlobalApi.UpdateResumeDetailWithLocale(paramId, { data: base }, locale);
        } else {
          resp = await GlobalApi.UpdateResumeByDocumentId(paramId, { data: base });
        }

        setLoading(false);
        toast('Experience: Details updated ✅');
        if (enableNext) enableNext(true);
        resolve(resp);
      } catch (err) {
        console.error('Failed to update experience', {
          err,
          status: err?.response?.status,
          data: err?.response?.data,
        });
        setLoading(false);
        toast('Experience: Server error, please try again ❌');
        reject(err);
      }
    });
  };

  // Expose the save method to the parent FormSection component
  useImperativeHandle(ref, () => ({ handleSave: onSave }));

  // ---------------------------------------------------------------------------
  // Hydrate from context when the component mounts / resumeInfo changes
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const incoming = resumeInfo?.experience;
    if (Array.isArray(incoming) && incoming.length) {
      setExperienceList(incoming);
    }
  }, [resumeInfo?.experience]);

  // ---------------------------------------------------------------------------
  // Keep the global context in sync when the user edits the form
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!hasUserEdited) return;
    setResumeInfo((prev) => ({
      ...prev,
      experience: experienceList,
    }));
  }, [experienceList, hasUserEdited, setResumeInfo]);

  // ---------------------------------------------------------------------------
  // Render UI
  // ---------------------------------------------------------------------------
  return (
    <div className="glass-card mt-5">
      <h2 className="section-title">Professional Experience</h2>
      <p className="section-subtitle">Add Your Previous Job Experience</p>
      <div>
        {experienceList.map((field, index) => (
          <div key={index} className="mb-8 last:mb-0">
            <div className="grid grid-cols-2 gap-6 border border-white/30 p-6 rounded-xl bg-white/40 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Position Title</label>
                <Input
                  className="input-glass"
                  type="text"
                  name="title"
                  value={field.title || ''}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="e.g., Software Engineer"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <Input
                  className="input-glass"
                  type="text"
                  name="companyName"
                  value={field.companyName || ''}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="e.g., Acme Corp"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">City</label>
                <Input
                  className="input-glass"
                  type="text"
                  name="city"
                  value={field.city || ''}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="e.g., San Francisco"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">State</label>
                <Input
                  className="input-glass"
                  type="text"
                  name="state"
                  value={field.state || ''}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="e.g., CA"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <Input
                  className="input-glass"
                  type="text"
                  name="startDate"
                  value={field.startDate || ''}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="e.g., Jan 2021"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <Input
                  className="input-glass"
                  type="text"
                  name="endDate"
                  value={field.endDate || ''}
                  onChange={(e) => handleChange(index, e)}
                  placeholder="e.g., Dec 2022 or Present"
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <RichTextEditor
                  onRichTextEditrChange={(e) => handleRichTextEditor(e, 'workSummery', index)}
                  index={index}
                  initialValue={field.workSummery || ''}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3">
          <Button variant="outline" className="btn-glass-outline" onClick={AddNewExp}>
            + Add More Experience
          </Button>
          {experienceList.length > 1 && (
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200"
              onClick={RemoveNewExp}
            >
              - Remove
            </Button>
          )}
        </div>
        <Button disabled={loading} onClick={onSave} className="btn-glass">
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
});

Experience.displayName = 'Experience';

export default Experience;