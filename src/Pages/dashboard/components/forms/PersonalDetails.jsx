import React, { useState, useContext, useEffect, useImperativeHandle, forwardRef } from 'react'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from 'react-router-dom';
import GlobalApi from '../../../../../service/GlobalApi';
import { Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';

const PersonalDetails = forwardRef(({ enableNext }, ref) => {
    const params = useParams();

    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [formData, setFormData] = useState({});
    const [loading, setloading] = useState(false);

    useEffect(() => {
        if (resumeInfo) {
            setFormData({
                firstName: resumeInfo.firstName,
                lastName: resumeInfo.lastName,
                jobTitle: resumeInfo.jobTitle,
                address: resumeInfo.address,
                phone: resumeInfo.phone,
                phone: resumeInfo.phone,
                email: resumeInfo.email,
                linkedin: resumeInfo.linkedin,
                github: resumeInfo.github
            });
        }
    }, [resumeInfo])

    const handleInputChange = (e) => {
        enableNext(false)

        const { name } = e.target;
        let { value } = e.target;
        // Only allow digits in phone field
        if (name === 'phone') {
            const digits = (value || '').replace(/\D/g, '');
            // reflect sanitized value back to the input element
            e.target.value = digits;
            value = digits;
        }
        setFormData({
            ...formData, [name]: value
        })

        setResumeInfo({
            ...resumeInfo, [name]: value
        })

    }
    const onSave = (e) => {
        e.preventDefault();
        setloading(true)
        const data = { data: formData }
        GlobalApi.UpdateResumeDetail(params?.resumeId, data).then(resp => {
            enableNext(true)
            setloading(false);
            toast("Personal Details: Details updated ✅")
        }, (error) => { 
            setloading(false); 
            toast("Personal Details: Server error, please try again ❌") 
        })
    }

    // Expose handleSave method to parent component
    useImperativeHandle(ref, () => ({
        handleSave: async () => {
            return new Promise((resolve, reject) => {
                setloading(true);
                const data = { data: formData };
                GlobalApi.UpdateResumeDetail(params?.resumeId, data)
                    .then(resp => {
                        enableNext(true);
                        setloading(false);
                        toast("Personal Details: Details updated ✅");
                        resolve(resp);
                    })
                    .catch(error => {
                        setloading(false);
                        toast("Personal Details: Server error, please try again ❌");
                        reject(error);
                    });
            });
        }
    }));

    return (
        <div className='glass-card mt-5'>
            <h2 className='section-title'>Personal Details</h2>
            <p className='section-subtitle'>Get Started with the basic information</p>

            <form onSubmit={onSave}>
                <div className='grid grid-cols-2 mt-5 gap-6'>
                    <div className="space-y-1.5">
                        <label className='text-sm font-medium text-gray-700'>First Name</label>
                        <Input className="input-glass" name='firstName' required onChange={handleInputChange} defaultValue={resumeInfo?.firstName} placeholder="e.g., John" />
                    </div>
                    <div className="space-y-1.5">
                        <label className='text-sm font-medium text-gray-700'>Last Name</label>
                        <Input className="input-glass" name='lastName' required onChange={handleInputChange} defaultValue={resumeInfo?.lastName} placeholder="e.g., Doe" />
                    </div>
                    <div className='col-span-2 space-y-1.5'>
                        <label className='text-sm font-medium text-gray-700'>Job Title</label>
                        <Input className="input-glass" name='jobTitle' required onChange={handleInputChange} defaultValue={resumeInfo?.jobTitle} placeholder="e.g., Software Engineer" />
                    </div>
                    <div className='col-span-2 space-y-1.5'>
                        <label className='text-sm font-medium text-gray-700'>Address</label>
                        <Input className="input-glass" name='address' required onChange={handleInputChange} defaultValue={resumeInfo?.address} placeholder="e.g., 123 Main St, City, State" />
                    </div>
                    <div className="space-y-1.5">
                        <label className='text-sm font-medium text-gray-700'>Phone</label>
                        <Input
                            className="input-glass"
                            name='phone'
                            type='tel'
                            inputMode='numeric'
                            pattern='[0-9]*'
                            maxLength={15}
                            required
                            onChange={handleInputChange}
                            defaultValue={resumeInfo?.phone}
                            placeholder='e.g., 5551234567'
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className='text-sm font-medium text-gray-700'>Email</label>
                        <Input className="input-glass" name='email' type='email' required onChange={handleInputChange} defaultValue={resumeInfo?.email} placeholder="e.g., john.doe@example.com" />
                    </div>


                </div>
                <div className='grid grid-cols-2 mt-3 gap-6'>
                    <div className="space-y-1.5">
                        <label className='text-sm font-medium text-gray-700'>LinkedIn</label>
                        <Input className="input-glass" name='linkedin' onChange={handleInputChange} defaultValue={resumeInfo?.linkedin} placeholder="e.g., https://linkedin.com/in/johndoe" />
                    </div>
                    <div className="space-y-1.5">
                        <label className='text-sm font-medium text-gray-700'>GitHub</label>
                        <Input className="input-glass" name='github' onChange={handleInputChange} defaultValue={resumeInfo?.github} placeholder="e.g., https://github.com/johndoe" />
                    </div>
                </div>
                <div className='mt-6 flex justify-end'>
                    <Button type="submit" disabled={loading} className="btn-glass">
                        {loading ? <Loader2Icon className='animate-spin' /> : "Save"}</Button>
                </div>
            </form>
        </div>
    )
});

PersonalDetails.displayName = 'PersonalDetails';

export default PersonalDetails