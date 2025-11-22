import { Input } from "@/components/ui/input";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import GlobalApi from "@/../service/GlobalApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ResumeInfoContext } from "@/context/ResumeInfoContext.jsx";

const Skills = () => {
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
  const debounceRef = useRef(null);

  const AddNewSkills = () => {
    setSkills([...skills, { name: "", rating: 0 }]);
    setHasUserEdited(true);
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
    const incoming = resumeInfo?.skills;
    if (Array.isArray(incoming) && incoming.length) {
      setSkills(incoming);
    }
  }, [resumeInfo?.skills]);

  // Only push to context after user edits
  useEffect(() => {
    if (!hasUserEdited || typeof setResumeInfo !== 'function') return;
    setResumeInfo((prev) => ({
      ...prev,
      skills: skills,
    }));
  }, [skills, hasUserEdited, setResumeInfo]);

  const onSave = async () => {
    try {
      setLoading(true);
      const paramId = params.resumeId;
      const isNumericId = /^\d+$/.test(String(paramId));

      // Always fetch fresh data to ensure we have all fields (Education, Experience, etc.)
      let current = {};
      try {
        if (isNumericId) {
          const currentResp = await GlobalApi.GetResumeById(paramId);
          current = currentResp?.data?.data?.attributes || {};
        } else {
          const currentResp = await GlobalApi.GetResumeByDocumentId(paramId);
          current = currentResp?.data?.data || {};
        }
        console.log('Skills: Fetched current data, keys:', Object.keys(current));
      } catch (err) {
        console.warn('Could not fetch current resume', err);
        current = {};
      }

      // Normalize skills: trim names, coerce rating to number, filter empty rows
      const normalizedSkills = skills
        .map((s) => ({
          name: s.name?.trim() || '',
          rating: Number.isFinite(Number(s.rating)) ? Number(s.rating) : 0,
        }))
        .filter((s) => s.name && s.name.trim() !== '');

      // Build base from current attributes: keep only scalar fields (avoid arrays/objects that may include nested ids)
      const systemKeys = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'];
      const scalarAllowed = new Set([
        'title', 'resumeId', 'userEmail', 'userName',
        'firstName', 'lastName', 'jobTitle', 'address', 'phone', 'email',
        'summery', 'themeColor', 'color'
      ]);
      const base = Object.fromEntries(
        Object.entries(current || {})
          .filter(([k, v]) => !systemKeys.includes(k))
          .filter(([k, v]) => scalarAllowed.has(k))
          .filter(([k, v]) => v === null || ['string', 'number', 'boolean'].includes(typeof v))
      );

      // Ensure title is present (required field)
      if (!base.title) {
        base.title = 'My Resume';
      }

      const skillsKey = 'Skills';
      const updateData = { ...base, [skillsKey]: normalizedSkills };

      console.log('Skills: Sending update with keys:', Object.keys(updateData));
      console.log('Skills: Sample payload:', { [skillsKey]: updateData[skillsKey] });

      const data = { data: updateData };

      // Use appropriate API based on ID type
      if (isNumericId) {
        await GlobalApi.UpdateResumeDatailWithLocale(paramId, data, current?.locale);
      } else {
        await GlobalApi.UpdateResumeByDocumentId(paramId, data);
      }

      setLoading(false);
      toast("Skills Updated Successfully");
    } catch (err) {
      console.error('Failed to update skills', err);
      setLoading(false);
      toast("Skills Update Failed");
    }
  };

  return (
    <div className="glass-card mt-5">
      <h2 className="section-title">Skills</h2>
      <p className="section-subtitle">Add Your Professional Skills</p>
      <div>
        {skills.map((skill, index) => (
          <div key={index} className="flex justify-between items-center mt-4 p-4 border border-white/30 rounded-xl bg-white/40 backdrop-blur-sm hover:shadow-md transition-all duration-300">
            <div>
              <label className="text-xs font-medium text-gray-700">Name</label>
              <Input className="input-glass w-full" value={skill.name || ''} onChange={(e) => handleChange(index, "name", e.target.value)} />
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
};

export default Skills;
