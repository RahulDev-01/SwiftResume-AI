import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from 'react'
import RichTextEditor from "../RichTextEditor";
const fromField = {
    title: '',
    companyName: '',
    city: '',
    stat: '',
    startDate: '',
    endDate: '',
    workSummery: '',
}
function Experience() {
    const [experienceList, setExperienceList] = useState([fromField]);
    const handleChange = (index, event) => {
        const newEntries = experienceList.slice();
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setExperienceList(newEntries);

    }
    const AddNewExp = () => {
        setExperienceList([...experienceList, fromField])
    }
    const RemoveNewExp = () => {
        setExperienceList(experienceList => experienceList.slice(0, -1))
    }
    const handleRichTextEditor =(e,name,index)=>{
             const newEntries = experienceList.slice();
             newEntries[index][name] = e.target.value;;
        setExperienceList(newEntries);
    }
    
    useEffect(() => {
        console.log(experienceList);
    }, [experienceList])
    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-1'>
            <h2 className='font-bold text-lg'>Proffesional Experience</h2>
            <p>Add Your Previous Job Experience</p>
            <div>
                {experienceList.map((field, index) => (
                    <div>
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
                                <RichTextEditor onRichTextEditrChange={(event) => handleRichTextEditor(event, 'workSummery', index)} />
                            </div>


                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between">
                <div className="flex gap-2">

                    <Button variant='outline' className='text-primary' onClick={AddNewExp}>+ Add More Experience</Button>
                    <Button variant='outline' className='text-primary' onClick={RemoveNewExp}>- Remove</Button>
                </div>
                <Button>Save</Button>
            </div>
        </div>
    )
}

export default Experience