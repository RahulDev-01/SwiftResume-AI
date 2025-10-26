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
    // Context
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext) ;
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

        // Use resumeInfo attributes as base, fallback to fetch
        let current = resumeInfo?.attributes || {};
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
          } catch (err) {
            console.warn('Could not fetch current resume, using empty base', err);
            current = {};
          }
        }

        // Normalize experience entries
        const normalizedExperience = experienceList
          .map((e) => ({
            title: e.title?.trim() || null,
            companyName: e.companyName?.trim() || null,
            city: e.city?.trim() || null,
            state: e.state?.trim() || null,
            startDate: e.startDate || null,
            endDate: e.endDate || null,
            workSummery: (e.workSummery ?? '').toString(),
          }))
          .filter((e) =>
            e.title || e.companyName || e.city || e.state || e.startDate || e.endDate || (e.workSummery && e.workSummery.trim() !== '')
          );

        // Per Strapi schema, the component field is 'Experience' (capital E)
        const keys = Object.keys(current || {});
        const experienceKey = 'Experience';

        // Merge with existing attributes excluding system/read-only keys
        const systemKeys = ['id', 'documentId', 'createdAt', 'updatedAt', 'publishedAt'];
        const base = Object.fromEntries(
          Object.entries(current || {}).filter(([k]) => !systemKeys.includes(k))
        );
        // Ensure required collection fields are present (title is required in schema)
        if (!base.title) {
          console.warn('Missing required field: title. Using fallback default title.');
          base.title = 'My Resume'; // Provide default to satisfy Strapi required field
        }
        const updateData = { ...base, [experienceKey]: normalizedExperience };

        console.log('Experience keys on record:', keys);
        console.log('Sending experience update keys:', Object.keys(updateData));

        const locale = current?.locale;
        console.log('Using locale for update (experience):', locale);
        if (isNumericId) {
          await GlobalApi.UpdateResumeDatailWithLocale(paramId, { data: updateData }, locale);
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
    const handleRichTextEditor =(e,name,index)=>{
        console.log('Experience form received value:', e.target.value);
        setExperienceList(prev => {
            const newEntries = prev.slice();
            newEntries[index] = { ...newEntries[index], [name]: e.target.value };
            console.log('Updated experience entry:', newEntries[index]);
            return newEntries;
        })
        setHasUserEdited(true);
    }

    // Hydrate from backend-loaded context once
    useEffect(() => {
        const incoming = resumeInfo?.experience;
        if (Array.isArray(incoming) && incoming.length) {
            setExperienceList(incoming);
        }
    }, [resumeInfo?.experience]);

    // Only push to context after user edits
    useEffect(() => {
        if (!hasUserEdited) return;
        console.log('Experience: pushing user-edited list to context:', experienceList);
        setResumeInfo(prev => ({
            ...prev,
            experience: experienceList
        }));
    }, [experienceList, hasUserEdited, setResumeInfo])
    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-1'>
            <h2 className='font-bold text-lg'>Proffesional Experience</h2>
            <p>Add Your Previous Job Experience</p>
            <div>
                {experienceList.map((field, index) => (
                    <div key={index}>
                        <div className='grid grid-cols-2  gap-3 border p-3 my-5 rounded-lg '>
                            <div>
                                <label className="text-xs " >Position Title</label>
                                <Input type="text" name="title" value={field.title || ''} onChange={(event) => handleChange(index, event)} placeholder="e.g., Software Engineer" />
                            </div>
                            <div>
                                <label className="text-xs " >Company Name</label>
                                <Input type="text" name="companyName" value={field.companyName || ''} onChange={(event) => handleChange(index, event)} placeholder="e.g., Acme Corp" />
                            </div>
                            <div>
                                <label className="text-xs " >City</label>
                                <Input type="text" name="city" value={field.city || ''} onChange={(event) => handleChange(index, event)} placeholder="e.g., San Francisco" />
                            </div>
                            <div>
                                <label className="text-xs " >State</label>
                                <Input type="text" name="state" value={field.state || ''} onChange={(event) => handleChange(index, event)} placeholder="e.g., CA" />
                            </div>
                            <div>
                                <label className="text-xs " >Start Date </label>
                                <Input type="text" placeholder="e.g., Jan 2021" name="startDate" value={field.startDate || ''} onChange={(event) => handleChange(index, event)} />
                            </div>
                            <div>
                                <label className="text-xs " >End Date</label>
                                <Input type="text" placeholder="e.g., Dec 2022 or Present" name="endDate" value={field.endDate || ''} onChange={(event) => handleChange(index, event)} />
                            </div>
                            {/* Rich Text Editor  */}
                            <div className="col-span-2">
                                <RichTextEditor onRichTextEditrChange={(event) => handleRichTextEditor(event, 'workSummery', index)} index={index} initialValue={field.workSummery || ''} />
                            </div>


                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <Button 
                        variant='outline' 
                        className='text-primary border-primary hover:bg-primary/10' 
                        onClick={AddNewExp}
                    >
                        + Add More Experience
                    </Button>
                    
                    {experienceList.length > 1 && (
                        <Button 
                            variant='outline' 
                            className='text-primary border-primary hover:bg-primary/10' 
                            onClick={RemoveNewExp}
                        >
                            - Remove
                        </Button>
                    )}
                </div>
                <Button disabled={loading} onClick={onSave}>
                  {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
                </Button>
            </div>
        </div>
    )
}

export default Experience