import React, { useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import { Textarea } from "@/components/ui/textarea"
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
    // Context
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext) ;

    const handleChange = (event, index) => {
     const newEntries = educationalList.slice();
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setEducationalList(newEntries);
    }

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
    }

    const RemoveNewEdu = (index) => {
        setEducationalList(prev => prev.filter((_, i) => i !== index));
    }
    useEffect(()=>{
            console.log('Updating resume context with:', educationalList);
        setResumeInfo(prev => ({
            ...prev,
            education: educationalList
        }));
    },[educationalList])

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
                                <Input name="universityName" value={item.universityName} onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div>
                                <label>Degree </label>
                                <Input name="degree" value={item.degree} onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div>
                                <label>Major</label>
                                <Input name="major" value={item.major} onChange={(e) => handleChange(e, index)} />
                            </div>
                            <div>
                                <label>Start Date</label>
                                <Input name="startDate" value={item.startDate} onChange={(e) => handleChange(e, index)} type='date' />
                            </div>
                            <div>
                                <label>End Date</label>
                                <Input name="endDate" value={item.endDate} onChange={(e) => handleChange(e, index)} type='date'  />
                            </div>
                            <div className='col-span-2'>
                                <label>Description</label>
                                <Textarea name="description" value={item.description} onChange={(e) => handleChange(e, index)} />
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
                                <Button>Save</Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Education