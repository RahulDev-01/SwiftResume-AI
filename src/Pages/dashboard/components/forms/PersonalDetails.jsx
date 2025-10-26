import React, { useState } from 'react'
import { useContext } from 'react'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'
import { Input} from "@/components/ui/input";
import { Button} from "@/components/ui/button";
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import GlobalApi from '../../../../../service/GlobalApi';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

function PersonalDetails({enableNext}) {
    const params =useParams();

    const {resumeInfo , setResumeInfo} =useContext(ResumeInfoContext);
    const [formData, setFormData] = useState();
    const [loading, setloading] = useState(false);
    useEffect(()=>{},[])
    const  handleInputChange = (e)=>{
        enableNext(false)

        const {name}= e.target;
        let { value } = e.target;
        // Only allow digits in phone field
        if (name === 'phone') {
            const digits = (value || '').replace(/\D/g, '');
            // reflect sanitized value back to the input element
            e.target.value = digits;
            value = digits;
        }
        setFormData({
            ...formData ,[name]:value
        })

        setResumeInfo({
            ...resumeInfo ,[name]:value
        })

    }
    const onSave=(e)=>{
        e.preventDefault();
        setloading(true)
        const data ={data:formData}
        GlobalApi.UpdateResumeDatail(params?.resumeId,data).then(resp=>{console.log(resp);
            enableNext(true)
            setloading(false);
            toast("Details Updated")
        },(error)=>setloading(false))
    }
  return (
    <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-1'>
        <h2 className='font-bold text-lg'>Personal Detail</h2>
        <p>Get Started with the basic information</p>

        <form onSubmit={onSave}>
            <div className='grid grid-cols-2 mt-5 gap-3'>
                <div>
                    <label className='text-sm'>First Name</label>
                    <Input name='firstName' required onChange={handleInputChange} defaultValue={resumeInfo?.firstName}/>
                </div>
                <div>
                    <label className='text-sm'>Last Name</label>
                    <Input name='lastName' required onChange={handleInputChange} defaultValue={resumeInfo?.lastName}/>
                </div>
                <div className='col-span-2'>
                    <label className='text-sm'>Job Title</label>
                    <Input name='jobTitle' required onChange={handleInputChange} defaultValue={resumeInfo?.jobTitle}/>
                </div>
                <div className='col-span-2'>
                    <label className='text-sm'>Address</label>
                    <Input name='address' required onChange={handleInputChange} defaultValue={resumeInfo?.address}/>
                </div>
                <div>
                    <label className='text-sm'>Phone</label>
                    <Input 
                        name='phone' 
                        type='tel' 
                        inputMode='numeric' 
                        pattern='[0-9]*' 
                        maxLength={15}
                        required 
                        onChange={handleInputChange} 
                        defaultValue={resumeInfo?.phone}
                    />
                </div>
                 <div>
                    <label className='text-sm'>Email</label>
                    <Input name='email'  type='email' required onChange={handleInputChange} defaultValue={resumeInfo?.email}/>
                </div>

                
            </div>
            <div className='mt-3 flex justify-end'>
                <Button type="submit"  disabled={loading}>
                    {loading?<Loader2Icon className='animate-spin'/>:"Save"}</Button>
            </div>
        </form>
    </div>
  )
}

export default PersonalDetails