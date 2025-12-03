import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import GlobalApi from "@/../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ResumeInfoContext } from "@/context/ResumeInfoContext.jsx";

/**
 * Skills form component.
 * Sends only the "Skills" field (capitalised as Strapi expects) and strips any stray `id` fields
 * from all repeatable components before updating the resume.
 */
const Skills = forwardRef(({ enableNext }, ref) => {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) || {};
  const [skills, setSkills] = useState([
    {
      name: "",
      rating: 0,
    },
  ]);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [shouldFocusNew, setShouldFocusNew] = useState(false);
  const lastInputRef = useRef(null);

  // ---------------------------------------------------------------------------
  // UI handlers
  // ---------------------------------------------------------------------------
  const AddNewSkills = () => {
    setSkills([...skills, { name: "", rating: 0 }]);
    setHasUserEdited(true);
    setShouldFocusNew(true);
  };

  const RemoveSkills = () => {
    setSkills(skills.slice(0, -1));
    setHasUserEdited(true);
  };

  const handleChange = (index, name, value) => {
    const newEntries = skills.slice();
    newEntries[index][name] = value;
    setSkills(newEntries);
    setHasUserEdited(true);
  };

  // ---------------------------------------------------------------------------
  // Hydrate local state from backend-loaded context once
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (hasUserEdited) return; // Don't overwrite if user has edited
    const incoming = resumeInfo?.skills;
    if (Array.isArray(incoming) && incoming.length) {
      setSkills(incoming);
    }
  }, [resumeInfo?.skills, hasUserEdited]);

  // ---------------------------------------------------------------------------
  // Push changes back to global context after user edits
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!hasUserEdited || typeof setResumeInfo !== "function") return;
    setResumeInfo((prev) => ({
      ...(prev || {}),
      skills: skills,
    }));
  }, [skills, hasUserEdited, setResumeInfo]);

  // ---------------------------------------------------------------------------
  // Auto‑focus the newly added input field
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (shouldFocusNew && lastInputRef.current) {
      lastInputRef.current.focus();
      setShouldFocusNew(false);
    }
  }, [shouldFocusNew]);

  // ---------------------------------------------------------------------------
  // Save logic – builds a minimal, clean payload for Strapi
  // ---------------------------------------------------------------------------
  const onSave = async () => {
    try {
      setLoading(true);
      const paramId = params.resumeId;
      const isNumericId = /^\d+$/.test(String(paramId));

      // 1️⃣ Fetch the freshest resume data (fallback to context)
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

      // 2️⃣ Normalize skills (strip id, trim name, ensure numeric rating)
      const normalizedSkills = skills
        .map((s) => {
          const { id, ...rest } = s;
          return {
            name: rest.name?.trim() || "",
            rating: Number.isFinite(Number(rest.rating)) ? Number(rest.rating) : 0,
          };
        })
        .filter((s) => s.name && s.name.trim() !== "");

      // 3️⃣ Build clean base object – remove system keys & strip ids from all repeatable components
      const systemKeys = ["id", "documentId", "createdAt", "updatedAt", "publishedAt"];
      const base = Object.fromEntries(
        Object.entries(current || {}).filter(([k]) => !systemKeys.includes(k))
      );
      if (!base.title) base.title = "My Resume";

      const componentKeys = [
        "experience",
        "Experience",
        "education",
        "Education",
        "languages",
        "Languages",
        "certifications",
        "Certifications",
        "skills",
        "Skills",
      ];
      componentKeys.forEach((key) => {
        if (Array.isArray(base[key])) {
          base[key] = base[key].map(({ id, ...rest }) => rest);
        }
      });

      // 4️⃣ Attach cleaned skills using proper Strapi field name
      base.Skills = normalizedSkills;
      delete base.skills;

      // 5️⃣ Send update request
      let resp;
      if (isNumericId) {
        const locale = current?.locale;
        resp = await GlobalApi.UpdateResumeDetailWithLocale(paramId, { data: base }, locale);
      } else {
        resp = await GlobalApi.UpdateResumeByDocumentId(paramId, { data: base });
      }

      setLoading(false);
      toast("Skills Updated Successfully ✅");
      if (enableNext) enableNext(true);
      return resp;
    } catch (err) {
      console.error("Failed to update skills", err);
      setLoading(false);
      toast("Skills Update Failed ❌");
      throw err;
    }
  };

  // Expose the save method to the parent component
  useImperativeHandle(ref, () => ({
    handleSave: onSave,
  }));

  // ---------------------------------------------------------------------------
  // Render UI
  // ---------------------------------------------------------------------------
  return (
    <div className="glass-card mt-5">
      <h2 className="section-title">Skills</h2>
      <p className="section-subtitle">Add Your Professional Skills</p>
      <div className="max-h-[300px] overflow-y-auto pr-2 mb-4 custom-scrollbar">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row justify-between items-start mt-4 p-4 border border-white/30 rounded-xl bg-white/40 backdrop-blur-sm hover:shadow-md transition-all duration-300"
          >
            <div>
              <label className="text-xs font-medium text-gray-700">Name</label>
              <Input
                className="input-glass w-full"
                value={skill.name || ""}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                ref={index === skills.length - 1 ? lastInputRef : null}
              />
            </div>
            <Rating
              style={{ maxWidth: 120 }}
              value={Number.isFinite(Number(skill.rating)) ? Number(skill.rating) : 0}
              onChange={(v) => handleChange(index, "rating", v)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3">
          <Button variant="outline" onClick={AddNewSkills} className="btn-glass-outline">
            + Add More Skill
          </Button>
          {skills.length > 1 && (
            <Button
              variant="outline"
              onClick={RemoveSkills}
              className="border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200"
            >
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

Skills.displayName = "Skills";

export default Skills;
