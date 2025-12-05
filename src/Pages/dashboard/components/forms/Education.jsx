import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useContext, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import GlobalApi from "../../../../../service/GlobalApi";
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext";

// Helper to create a blank education entry
const createEmptyField = () => ({
  universityName: "",
  degree: "",
  major: "",
  startDate: "",
  endDate: "",
  description: "",
});

/**
 * Education form component.
 * Sends only the "Education" field (capitalised as Strapi expects) and strips any stray `id` fields
 * from all repeatable components before updating the resume.
 */
const Education = forwardRef(({ enableNext }, ref) => {
  const [educationalList, setEducationalList] = useState([createEmptyField()]);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();

  // ---------------------------------------------------------------------------
  // UI handlers
  // ---------------------------------------------------------------------------
  const handleChange = (event, index) => {
    const newEntries = [...educationalList];
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationalList(newEntries);
    setHasUserEdited(true);
  };

  const AddNewEdu = () => {
    setEducationalList((prev) => [...prev, createEmptyField()]);
    setHasUserEdited(true);
  };

  const RemoveNewEdu = () => {
    setEducationalList((prev) => prev.slice(0, -1));
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

        // 1️⃣ Fetch the freshest resume data (fallback to context if present)
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
            console.warn("Could not fetch current resume", err);
            current = {};
          }
        }

        // 2️⃣ Normalise education entries – strip stray `id` fields
        const normalizedEducation = educationalList
          .map((e) => {
            const { id, ...rest } = e;
            return {
              universityName: rest.universityName?.trim() || null,
              degree: rest.degree?.trim() || null,
              major: rest.major?.trim() || null,
              startDate: rest.startDate || null,
              endDate: rest.endDate || null,
              description: (rest.description ?? "").toString(),
            };
          })
          .filter(
            (e) =>
              e.universityName ||
              e.degree ||
              e.major ||
              e.startDate ||
              e.endDate ||
              (e.description && e.description.trim() !== "")
          );

        // 3️⃣ Build a clean base object – remove system keys & strip ids from all repeatable components
        const systemKeys = ["id", "documentId", "createdAt", "updatedAt", "publishedAt"];
        const base = Object.fromEntries(
          Object.entries(current || {}).filter(([k]) => !systemKeys.includes(k))
        );

        // Ensure a title exists (Strapi requires it)
        if (!base.title) base.title = "My Resume";

        const componentKeys = [
          "education", "Education",
          "experience", "Experience",
          "skills", "Skills",
          "languages", "Languages",
          "certifications", "Certifications",
          "Projects", "projects"
        ];
        componentKeys.forEach((key) => {
          if (Array.isArray(base[key])) {
            base[key] = base[key].map(({ id, ...rest }) => rest);
          }
        });

        // 4️⃣ Attach cleaned education data using the proper Strapi field name
        base.Education = normalizedEducation;
        delete base.education; // remove any accidental lowercase key

        // 5️⃣ Send the update request
        let resp;
        if (isNumericId) {
          const locale = current?.locale;
          resp = await GlobalApi.UpdateResumeDetailWithLocale(paramId, { data: base }, locale);
        } else {
          resp = await GlobalApi.UpdateResumeByDocumentId(paramId, { data: base });
        }

        setLoading(false);
        toast("Education: Details updated ✅");
        if (enableNext) enableNext(true);
        resolve(resp);
      } catch (err) {
        console.error("Failed to update education", {
          err,
          status: err?.response?.status,
          data: err?.response?.data,
        });
        setLoading(false);
        toast("Education: Server error, please try again ❌");
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
    const incoming = resumeInfo?.education;
    if (Array.isArray(incoming) && incoming.length) {
      setEducationalList(incoming);
    }
  }, [resumeInfo?.education]);

  // ---------------------------------------------------------------------------
  // Keep the global context in sync when the user edits the form
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!hasUserEdited) return;
    setResumeInfo((prev) => ({
      ...prev,
      education: educationalList,
    }));
  }, [educationalList, hasUserEdited, setResumeInfo]);

  // ---------------------------------------------------------------------------
  // Render UI
  // ---------------------------------------------------------------------------
  return (
    <div className="glass-card mt-5">
      <h2 className="section-title">Education</h2>
      <p className="section-subtitle">Add Your Educational Details</p>
      <div>
        {educationalList.map((item, index) => (
          <div key={index} className="mb-8 last:mb-0">
            <div className="grid grid-cols-2 gap-6 border border-white/30 p-6 rounded-xl bg-white/40 backdrop-blur-sm hover:shadow-md transition-all duration-300">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">University Name</label>
                <Input
                  className="input-glass"
                  name="universityName"
                  value={item.universityName}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="e.g., Stanford University"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Degree</label>
                <Input
                  className="input-glass"
                  name="degree"
                  value={item.degree}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="e.g., B.Sc., M.Tech"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Major</label>
                <Input
                  className="input-glass"
                  name="major"
                  value={item.major}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <Input
                  className="input-glass"
                  name="startDate"
                  value={item.startDate}
                  onChange={(e) => handleChange(e, index)}
                  type="text"
                  placeholder="e.g., Jan 2021"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <Input
                  className="input-glass"
                  name="endDate"
                  value={item.endDate}
                  onChange={(e) => handleChange(e, index)}
                  type="text"
                  placeholder="e.g., Dec 2022 or Present"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Textarea
                  className="input-glass min-h-[100px]"
                  name="description"
                  value={item.description}
                  onChange={(e) => handleChange(e, index)}
                  placeholder="E.g., Coursework, GPA, awards, projects"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3">
          <Button variant="outline" className="btn-glass-outline" onClick={AddNewEdu}>
            + Add More Education
          </Button>
          {educationalList.length > 1 && (
            <Button
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200"
              onClick={RemoveNewEdu}
            >
              - Remove
            </Button>
          )}
        </div>
        <Button disabled={loading} onClick={onSave} className="btn-glass">
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
});

Education.displayName = "Education";

export default Education;