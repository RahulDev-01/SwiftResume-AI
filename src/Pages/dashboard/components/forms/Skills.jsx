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
    <div className="glass-card p-8 mt-5 animate-fade-in-up">
      <h2 className="section-title">Skills</h2>
      <p className="section-subtitle">Add Your Professional Skills</p>
      <div>
        {skills.map((skill, index) => (
          <div
            key={index}
            className="flex justify-between items-center mt-4 p-4 border border-gray-100 rounded-xl bg-white/50 hover:shadow-md transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Name</label>
              <Input
                className="input-premium"
                value={skill.name || ''}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="e.g., React, Python"
              />
            </div>
            <Rating
              style={{ maxWidth: 120 }}
              value={Number.isFinite(Number(skill.rating)) ? Number(skill.rating) : 0}
              onChange={(v) => handleChange(index, "rating", v)}
              itemStyles={{
                itemShapes: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" /></svg>,
                activeFillColor: '#9333ea',
                inactiveFillColor: '#e5e7eb'
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3">
          <Button onClick={AddNewSkills} variant="outline" className="border-primary text-primary hover:bg-primary/10 transition-all duration-300">
            + Add More Skills
          </Button>
          <Button onClick={RemoveSkills} variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 transition-all duration-300">
            Remove
          </Button>
        </div>

        <Button disabled={loading} onClick={onSave} className="btn-premium">
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default Skills;
