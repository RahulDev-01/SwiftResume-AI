import React, { useContext, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { Textarea } from "@/components/ui/textarea"
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import GlobalApi from '../../../../../service/GlobalApi';

const Education = forwardRef(({ enableNext }, ref) => {
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
        } catch (fetchErr) {
          console.warn('Could not fetch current resume', fetchErr);
          current = {};
        }
      }

      // Normalize education - STRIP 'id' field to avoid Strapi validation error
      const normalizedEducation = educationalList
        .map((e) => {
          const { id, ...rest } = e; // Remove id field
          return {
            universityName: rest.universityName?.trim() || null,
            degree: rest.degree?.trim() || null,
            major: rest.major?.trim() || null,
            startDate: rest.startDate || null,
            endDate: rest.endDate || null,
            description: (rest.description ?? '').toString(),
          };
        })
        .filter((e) =>
          e.universityName || e.degree || e.major || e.startDate || e.endDate || (e.description && e.description.trim() !== '')
        );

      const educationKey = 'Education';
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

      if (!base.title) {
        base.title = 'My Resume';
      }

      const updateData = { ...base, [educationKey]: normalizedEducation };
      const locale = current?.locale;

      if (isNumericId) {
        await GlobalApi.UpdateResumeDetailWithLocale(paramId, { data: updateData }, locale);
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
      throw err;
    }
  };

  useImperativeHandle(ref, () => ({
    handleSave: onSave
  }));

  useEffect(() => {
    const incoming = resumeInfo?.education;
    if (Array.isArray(incoming) && incoming.length) {
      setEducationalList(incoming);
    }
  }, [resumeInfo?.education]);

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
          <Button variant='outline' className='btn-glass-outline' onClick={AddNewdu}>
            + Add More Education
          </Button>
          {educationalList.length > 1 && (
            <Button variant='outline' className='border-red-500 text-red-500 hover:bg-red-50 transition-all duration-200' onClick={() => RemoveNewEdu(educationalList.length - 1)}>
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
});

Education.displayName = 'Education';

export default Education