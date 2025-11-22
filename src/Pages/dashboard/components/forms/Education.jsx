import React, { useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { Textarea } from "@/components/ui/textarea"
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import GlobalApi from '../../../../../service/GlobalApi';
function Education() {
  const [educationalList, setEducationalList] = useState([
    {
      universityName: '',
      degree: '',
      major: '',
      startDate: '',
      endDate: '',
      description: '',
    }
  ])
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  // Context
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);


  const handleChange = (event, index) => {
    const newEntries = educationalList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setEducationalList(newEntries);
    setHasUserEdited(true);
  }

  const params = useParams()

  const AddNewdu = () => {
    setEducationalList(prev => ([
      ...prev,
      {
        universityName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: '',
      }
    ]));
    setHasUserEdited(true);
  }

  const RemoveNewEdu = (index) => {
    setEducationalList(prev => prev.filter((_, i) => i !== index));
    setHasUserEdited(true);
  }

  const onSave = async () => {
    try {
      setLoading(true);
      const paramId = params.resumeId;
      const isNumericId = /^\d+$/.test(String(paramId));

      // Use resumeInfo attributes as base, fallback to empty object
      let current = resumeInfo?.attributes || {};

      // If resumeInfo doesn't have attributes, try to fetch
      if (!resumeInfo?.attributes) {
        try {
          if (isNumericId) {
            const currentResp = await GlobalApi.GetResumeById(paramId);
            current = currentResp?.data?.data?.attributes || {};
            console.log('Fetched by numeric ID, attributes:', Object.keys(current));
          } else {
            const currentResp = await GlobalApi.GetResumeByDocumentId(paramId);
            // Strapi v5: when fetching by documentId, attributes are directly in data.data
            current = currentResp?.data?.data || {};
            console.log('Fetched by documentId, attributes:', Object.keys(current));
          }
        } catch (fetchErr) {
          console.warn('Could not fetch current resume, using empty base', fetchErr);
          current = {};
        }
      }

      // Normalize entries: trim strings, empty strings -> null, filter out totally empty rows
      const normalizedEducation = educationalList
        .map((e) => ({
          universityName: e.universityName?.trim() || null,
          degree: e.degree?.trim() || null,
          major: e.major?.trim() || null,
          startDate: e.startDate || null,
          endDate: e.endDate || null,
          description: (e.description ?? '').toString(),
        }))
        .filter((e) =>
          e.universityName || e.degree || e.major || e.startDate || e.endDate || (e.description && e.description.trim() !== '')
        );

      // Per Strapi schema, the attribute key is capitalized 'Education'
      const keys = Object.keys(current || {});
      console.log('Strapi attribute keys on record:', keys);
      const educationKey = 'Education';

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

      // Safety: ensure required collection fields like 'title' are present
      if (!base.title) {
        console.warn('Missing required field: title. Using fallback default title.');
        base.title = 'My Resume'; // Provide default to satisfy Strapi required field
      }

      // Create the update payload with the correct structure (merge base + new education)
      const updateData = { ...base, [educationKey]: normalizedEducation };

      console.log('Sending update keys:', Object.keys(updateData));
      console.log('Sending update sample:', { [educationKey]: updateData[educationKey] });

      // Send the update (pass locale if available)
      const locale = current?.locale;
      console.log('Using locale for update (education):', locale);
      if (isNumericId) {
        await GlobalApi.UpdateResumeDatailWithLocale(paramId, { data: updateData }, locale);
      } else {
        await GlobalApi.UpdateResumeByDocumentId(paramId, { data: updateData });
      }

      setLoading(false);
      toast("Education: Details updated ✅");
    } catch (err) {
      console.error('Failed to update education', {
        err,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      setLoading(false);
      toast("Education: Server error, please try again ❌");
    }
  };
  // Hydrate local form state from backend-loaded context data once
  useEffect(() => {
    const incoming = resumeInfo?.education;
    if (Array.isArray(incoming) && incoming.length) {
      setEducationalList(incoming);
    }
  }, [resumeInfo?.education]);

  // Only push to context after user edits form
  useEffect(() => {
    if (!hasUserEdited) return;
    setResumeInfo(prev => ({
      ...(prev || {}),
      education: educationalList
    }));
  }, [educationalList, hasUserEdited, setResumeInfo])

  return (
    <div className='glass-card mt-5'>
      <h2 className='section-title'>Education</h2>
      <p className='section-subtitle'>Add Your Educational Details</p>
      <div>
        {educationalList.map((item, index) => (
          <div key={index} className="mb-8 last:mb-0">
            <div className='grid grid-cols-2 gap-6 border border-white/30 p-6 rounded-xl bg-white/40 backdrop-blur-sm hover:shadow-md transition-all duration-300'>
              <div className='col-span-2 space-y-2'>
                <label className='text-sm font-medium text-gray-700'>University Name</label>
                <Input className="input-glass" name="universityName" value={item.universityName} onChange={(e) => handleChange(e, index)} placeholder="e.g., Stanford University" />
              </div>
              <div className="space-y-2">
                <label className='text-sm font-medium text-gray-700'>Degree </label>
                <Input className="input-glass" name="degree" value={item.degree} onChange={(e) => handleChange(e, index)} placeholder="e.g., B.Sc., M.Tech" />
              </div>
              <div className="space-y-2">
                <label className='text-sm font-medium text-gray-700'>Major</label>
                <Input className="input-glass" name="major" value={item.major} onChange={(e) => handleChange(e, index)} placeholder="e.g., Computer Science" />
              </div>
              <div className="space-y-2">
                <label className='text-sm font-medium text-gray-700'>Start Date</label>
                <Input className="input-glass" name="startDate" value={item.startDate} onChange={(e) => handleChange(e, index)} type='text' placeholder="e.g., Jan 2021" />
              </div>
              <div className="space-y-2">
                <label className='text-sm font-medium text-gray-700'>End Date</label>
                <Input className="input-glass" name="endDate" value={item.endDate} onChange={(e) => handleChange(e, index)} type='text' placeholder="e.g., Dec 2022 or Present" />
              </div>
              <div className='col-span-2 space-y-2'>
                <label className='text-sm font-medium text-gray-700'>Description</label>
                <Textarea className="input-glass min-h-[100px]" name="description" value={item.description} onChange={(e) => handleChange(e, index)} placeholder="E.g., Coursework, GPA, awards, projects" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3">
          <Button
            variant='outline'
            className='btn-glass-outline'
            onClick={AddNewdu}
          >
            + Add More Education
          </Button>

          {educationalList.length > 1 && (
            <Button
              variant='outline'
              className='border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200'
              onClick={() => RemoveNewEdu(educationalList.length - 1)}
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
  )
}

export default Education