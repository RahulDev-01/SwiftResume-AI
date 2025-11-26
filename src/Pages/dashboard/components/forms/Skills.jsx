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
  const debounceRef = useRef(null);

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

  // Hydrate local state from backend-loaded context once
  useEffect(() => {
    if (hasUserEdited) return; // Don't overwrite if user has edited
    const incoming = resumeInfo?.skills;
    if (Array.isArray(incoming) && incoming.length) {
      setSkills(incoming);
    }
  }, [resumeInfo?.skills, hasUserEdited]);

  // Only push to context after user edits
  useEffect(() => {
    if (!hasUserEdited || typeof setResumeInfo !== 'function') return;
    setResumeInfo((prev) => ({
      ...prev,
      skills: skills,
    }));
  }, [skills, hasUserEdited, setResumeInfo]);

  // Auto-focus new input
  useEffect(() => {
    if (shouldFocusNew && lastInputRef.current) {
      lastInputRef.current.focus();
      setShouldFocusNew(false);
    }
  }, [skills, shouldFocusNew]);

  const onSave = async () => {
    try {
      setLoading(true);
      const paramId = params.resumeId;
      const isNumericId = /^\d+$/.test(String(paramId));

      // Normalize skills: trim names, coerce rating to number, filter empty rows - STRIP 'id' field
      const normalizedSkills = skills
        .map((s) => {
          const { id, ...rest } = s; // Remove id field
          return {
            name: rest.name?.trim() || '',
            rating: Number.isFinite(Number(rest.rating)) ? Number(rest.rating) : 0,
          };
        })
        .filter((s) => s.name && s.name.trim() !== '');

      const skillsKey = 'Skills';
      const updateData = { [skillsKey]: normalizedSkills };

      console.log('Skills: Sending update with keys:', Object.keys(updateData));
      console.log('Skills: Sample payload:', { [skillsKey]: updateData[skillsKey] });

      const data = { data: updateData };

      // Use appropriate API based on ID type
      if (isNumericId) {
        await GlobalApi.UpdateResumeDetail(paramId, data);
      } else {
        await GlobalApi.UpdateResumeByDocumentId(paramId, data);
      }

      setLoading(false);
      toast("Skills Updated Successfully");
    } catch (err) {
      console.error('Failed to update skills', err);
      setLoading(false);
      toast("Skills Update Failed");
      throw err;
    }
  };

  // Expose handleSave method to parent component
  useImperativeHandle(ref, () => ({
    handleSave: onSave
  }));

  return (
    <div className="glass-card mt-5">
      <h2 className="section-title">Skills</h2>
      <p className="section-subtitle">Add Your Professional Skills</p>
      <div>
        {skills.map((skill, index) => (
          <div key={index} className="flex justify-between items-center mt-4 p-4 border border-white/30 rounded-xl bg-white/40 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <div>
              <label className="text-xs font-medium text-gray-700">Name</label>
              <Input
                className="input-glass w-full"
                value={skill.name || ''}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                ref={index === skills.length - 1 ? lastInputRef : null}
              />
            </div>
            <Rating style={{ maxWidth: 120 }} value={Number.isFinite(Number(skill.rating)) ? Number(skill.rating) : 0} onChange={(v) => handleChange(index, "rating", v)} />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3">
          <Button variant="outline" onClick={AddNewSkills} className="btn-glass-outline">
            + Add More Skill
          </Button>
          {skills.length > 1 && (
            <Button variant="outline" onClick={RemoveSkills} className="border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200">
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

Skills.displayName = 'Skills';

export default Skills;
