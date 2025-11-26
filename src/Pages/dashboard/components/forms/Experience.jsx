import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from "../RichTextEditor";
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext";
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import GlobalApi from '../../../../../service/GlobalApi';

const createEmptyField = () => ({
  title: '',
  companyName: '',
  city: '',
  state: '',
  startDate: '',
  endDate: '',
  workSummery: '',
})

function Experience() {
  const [experienceList, setExperienceList] = useState([createEmptyField()]);
  const [hasUserEdited, setHasUserEdited] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

  const handleChange = (index, event) => {
    const newEntries = experienceList.slice();
    const { name, value } = event.target;
    newEntries[index][name] = value;
    setExperienceList(newEntries);
    setHasUserEdited(true);
  }

  const onSave = async () => {
    try {
      setLoading(true);
      const paramId = params.resumeId;
      const isNumericId = /^\d+$/.test(String(paramId));

      let current = resumeInfo?.attributes || {};
      if (!resumeInfo?.attributes) {
        try {
          if (isNumericId) {
            const currentResp = await GlobalApi.GetResumeById(paramId);
            current = currentResp?.data?.data?.attributes || {};
          } else {
            const currentResp = await GlobalApi.GetResumeByDocumentId(paramId);
            current = currentResp?.data?.data || {};
          }
        } catch (err) {
          console.warn('Could not fetch current resume', err);
          current = {};
        }
      }

      // Normalize experience - STRIP 'id' field to avoid Strapi validation error
      const normalizedExperience = experienceList
        .map((e) => {
          const { id, ...rest } = e; // Remove id field
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
        .filter((e) =>
          e.title || e.companyName || e.city || e.state || e.startDate || e.endDate || (e.workSummery && e.workSummery.trim() !== '')
        );

      const experienceKey = 'Experience';
      const systemKeys = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'];
      const base = Object.fromEntries(
        Object.entries(current || {}).filter(([k]) => !systemKeys.includes(k))
      );

      if (!base.title) {
        base.title = 'My Resume';
      }

      const updateData = { ...base, [experienceKey]: normalizedExperience };
      const locale = current?.locale;

      if (isNumericId) {
        await GlobalApi.UpdateResumeDetailWithLocale(paramId, { data: updateData }, locale);
      } else {
        await GlobalApi.UpdateResumeByDocumentId(paramId, { data: updateData });
      }

      setLoading(false);
      toast("Experience: Details updated ✅");
    } catch (err) {
      console.error('Failed to update experience', {
        err,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      setLoading(false);
      toast("Experience: Server error, please try again ❌");
    }
  };

  const AddNewExp = () => {
    setExperienceList(prev => [...prev, createEmptyField()])
    setHasUserEdited(true);
  }

  const RemoveNewExp = () => {
    setExperienceList(prev => prev.slice(0, -1))
    setHasUserEdited(true);
  }

  const handleRichTextEditor = (e, name, index) => {
    setExperienceList(prev => {
      const newEntries = prev.slice();
      newEntries[index] = { ...newEntries[index], [name]: e.target.value };
      return newEntries;
    })
    setHasUserEdited(true);
  }

  useEffect(() => {
    const incoming = resumeInfo?.experience;
    if (Array.isArray(incoming) && incoming.length) {
      setExperienceList(incoming);
    }
  }, [resumeInfo?.experience]);

  useEffect(() => {
    if (!hasUserEdited) return;
    setResumeInfo(prev => ({
      ...prev,
      experience: experienceList
    }));
  }, [experienceList, hasUserEdited, setResumeInfo])

  return (
    <div className='glass-card mt-5'>
      <h2 className='section-title'>Professional Experience</h2>
      <p className='section-subtitle'>Add Your Previous Job Experience</p>
      <div>
        {experienceList.map((field, index) => (
          <div key={index} className="mb-8 last:mb-0">
            <div className='grid grid-cols-2 gap-6 border border-white/30 p-6 rounded-xl bg-white/40 backdrop-blur-sm hover:shadow-md transition-all duration-300'>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Position Title</label>
                <Input className="input-glass" type="text" name="title" value={field.title || ''} onChange={(event) => handleChange(index, event)} placeholder="e.g., Software Engineer" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <Input className="input-glass" type="text" name="companyName" value={field.companyName || ''} onChange={(event) => handleChange(index, event)} placeholder="e.g., Acme Corp" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">City</label>
                <Input className="input-glass" type="text" name="city" value={field.city || ''} onChange={(event) => handleChange(index, event)} placeholder="e.g., San Francisco" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">State</label>
                <Input className="input-glass" type="text" name="state" value={field.state || ''} onChange={(event) => handleChange(index, event)} placeholder="e.g., CA" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Start Date </label>
                <Input className="input-glass" type="text" placeholder="e.g., Jan 2021" name="startDate" value={field.startDate || ''} onChange={(event) => handleChange(index, event)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">End Date</label>
                <Input className="input-glass" type="text" placeholder="e.g., Dec 2022 or Present" name="endDate" value={field.endDate || ''} onChange={(event) => handleChange(index, event)} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <RichTextEditor onRichTextEditrChange={(event) => handleRichTextEditor(event, 'workSummery', index)} index={index} initialValue={field.workSummery || ''} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <div className="flex gap-3">
          <Button variant='outline' className='btn-glass-outline' onClick={AddNewExp}>
            + Add More Experience
          </Button>
          {experienceList.length > 1 && (
            <Button variant='outline' className='border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200' onClick={RemoveNewExp}>
              - Remove
            </Button>
          )}
        </div>
        <Button disabled={loading} onClick={onSave} className="btn-glass">
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default Experience