import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useContext, useEffect, useState } from 'react'
import RichTextEditor from "../RichTextEditor";
import { ResumeInfoContext } from "../../../../context/ResumeInfoContext";
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
    // Context
    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext) ;
    const handleChange = (index, event) => {
        const newEntries = experienceList.slice();
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setExperienceList(newEntries);

    }

    
    const AddNewExp = () => {
        setExperienceList(prev => [...prev, createEmptyField()])
    }
    const RemoveNewExp = () => {
        setExperienceList(prev => prev.slice(0, -1))
    }
    const handleRichTextEditor =(e,name,index)=>{
        console.log('Experience form received value:', e.target.value);
        setExperienceList(prev => {
            const newEntries = prev.slice();
            newEntries[index] = { ...newEntries[index], [name]: e.target.value };
            console.log('Updated experience entry:', newEntries[index]);
            return newEntries;
        })
    }

    useEffect(() => {
        console.log('Updating resume context with:', experienceList);
        setResumeInfo(prev => ({
            ...prev,
            experience: experienceList
        }));
    }, [experienceList, setResumeInfo])
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
                                <Input type="text" name="title" onChange={(event) => handleChange(index, event)} />
                            </div>
                            <div>
                                <label className="text-xs " >Company Name</label>
                                <Input type="text" name="companyName" onChange={(event) => handleChange(index, event)} />
                            </div>
                            <div>
                                <label className="text-xs " >City</label>
                                <Input type="text" name="city" onChange={(event) => handleChange(index, event)} />
                            </div>
                            <div>
                                <label className="text-xs " >State</label>
                                <Input type="text" name="state" onChange={(event) => handleChange(index, event)} />
                            </div>
                            <div>
                                <label className="text-xs " >Start Date </label>
                                <Input type="date" name="startDate" onChange={(event) => handleChange(index, event)} />
                            </div>
                            <div>
                                <label className="text-xs " >End Date</label>
                                <Input type="date" name="endDate" onChange={(event) => handleChange(index, event)} />
                            </div>
                            {/* Rich Text Editor  */}
                            <div className="col-span-2">
                                <RichTextEditor onRichTextEditrChange={(event) => handleRichTextEditor(event, 'workSummery', index)} index={index} />
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
                <Button>Save</Button>
            </div>
        </div>
    )
}

export default Experience