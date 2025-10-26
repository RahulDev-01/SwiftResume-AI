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
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext) ;


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
            'title','resumeId','userEmail','userName',
            'firstName','lastName','jobTitle','address','phone','email',
            'summery','themeColor','color'
          ]);
          const base = Object.fromEntries(
            Object.entries(current || {})
              .filter(([k, v]) => !systemKeys.includes(k))
              .filter(([k, v]) => scalarAllowed.has(k))
              .filter(([k, v]) => v===null || ['string','number','boolean'].includes(typeof v))
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
    useEffect(()=>{
        if (!hasUserEdited) return;
        setResumeInfo(prev => ({
            ...(prev||{}),
            education: educationalList
        }));
    },[educationalList, hasUserEdited, setResumeInfo])

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-1'>
            <h2 className='font-bold text-lg'>Education</h2>
            <p>Add Your Educational Details</p>
            <div>
                {educationalList.map((item, index) => (
                    <div key={index}>
                        <div className='grid grid-cols-2  gap-3 border p-3 my-5 rounded-lg '>
                            <div className='col-span-2 '>
                                <label>University Name</label>
                                <Input name="universityName" value={item.universityName} onChange={(e) => handleChange(e, index)} placeholder="e.g., Stanford University" />
                            </div>
                            <div>
                                <label>Degree </label>
                                <Input name="degree" value={item.degree} onChange={(e) => handleChange(e, index)} placeholder="e.g., B.Sc., M.Tech" />
                            </div>
                            <div>
                                <label>Major</label>
                                <Input name="major" value={item.major} onChange={(e) => handleChange(e, index)} placeholder="e.g., Computer Science" />
                            </div>
                            <div>
                                <label>Start Date</label>
                                <Input name="startDate" value={item.startDate} onChange={(e) => handleChange(e, index)} type='text' placeholder="e.g., Jan 2021" />
                            </div>
                            <div>
                                <label>End Date</label>
                                <Input name="endDate" value={item.endDate} onChange={(e) => handleChange(e, index)} type='text' placeholder="e.g., Dec 2022 or Present"  />
                            </div>
                            <div className='col-span-2'>
                                <label>Description</label>
                                <Textarea name="description" value={item.description} onChange={(e) => handleChange(e, index)} placeholder="E.g., Coursework, GPA, awards, projects" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between">
                                <div className="flex gap-2">
                                    <Button
                                        variant='outline'
                                        className='text-primary border-primary hover:bg-primary/10'
                                        onClick={AddNewdu}
                                    >
                                        + Add More Education
                                    </Button>

                                    {educationalList.length > 1 && (
                                        <Button
                                            variant='outline'
                                            className='text-primary border-primary hover:bg-primary/10'
                                            onClick={() => RemoveNewEdu(index)}
                                        >
                                            - Remove
                                        </Button>
                                    )}
                                </div>
                                 <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
        </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Education