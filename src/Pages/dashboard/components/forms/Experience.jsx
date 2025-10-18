import { Input} from "@/components/ui/input";
import { Button} from "@/components/ui/button";
import React, { useState } from 'react'
import RichTextEditor from "../RichTextEditor";
const  fromField = {
    title:'',
    companyName :'',
    city:'',
    stat:'',
    startDate:'',
    endDate:'',
    workSummery:'',
}
function Experience() {
   const [experienceList, setExperienceList] = useState([fromField]);
   const handleChange =(index,event)=>{

   }
  return (
   <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-1'>
        <h2 className='font-bold text-lg'>Proffesional Experience</h2>
        <p>Add Your Previous Job Experience</p>
        <div>
            {experienceList.map((field,index)=>(
                <div>
                    <div className='grid grid-cols-2  gap-3 border p-3 my-5 rounded-lg '>
                        <div>
                            <label className="text-xs " >Position Title</label>
                            <Input type="text" name ="title" onChange={(event)=>handleChange(index,event)} />
                        </div>
                        <div>
                            <label className="text-xs " >Company Name</label>
                            <Input type="text" name ="companyName" onChange={(event)=>handleChange(index,event)} />
                        </div>
                        <div>
                            <label className="text-xs " >City</label>
                            <Input type="text" name ="city" onChange={(event)=>handleChange(index,event)} />
                        </div>
                        <div>
                            <label className="text-xs " >State</label>
                            <Input type="text" name ="state" onChange={(event)=>handleChange(index,event)} />
                        </div>
                        <div>
                            <label className="text-xs " >Start Date </label>
                            <Input type="date" name ="startDate" onChange={(event)=>handleChange(index,event)} />
                        </div>
                        <div>
                            <label className="text-xs " >End Date</label>
                            <Input type="date" name ="endDate" onChange={(event)=>handleChange(index,event)} />
                        </div>
                        <div className="col-span-2">
                           <RichTextEditor />
                        </div>


                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-between">
            <Button variant ='outline' className='text-primary'>+ Add More Experience</Button>
            <Button>Save</Button>
        </div>
        </div>
  )
}

export default Experience