import React from 'react'
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react'
import { useUser } from '@clerk/clerk-react'
import Dummy from '../../../../../Data/Dummy'

function PersonalDetailPreview2({ resumeInfo }) {
    const { user } = useUser();
    const firstName = (resumeInfo?.firstName || '').trim() || Dummy.firstName;
    const lastName = (resumeInfo?.lastName || '').trim() || Dummy.lastName;
    const jobTitle = (resumeInfo?.jobTitle || '').trim() || Dummy.jobTitle;
    const address = (resumeInfo?.address || '').trim() || Dummy.address;
    const phone = (resumeInfo?.phone || '').trim() || Dummy.phone;
    const email = (resumeInfo?.email || '').trim() || Dummy.email;

    return (
        <div className='flex gap-6 items-start mb-6'>
            {/* Profile Photo */}
            <div className='flex-shrink-0'>
                <div className='w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-gray-300'>
                    {user?.imageUrl ? (
                        <img src={user.imageUrl} alt={`${firstName} ${lastName}`} className='w-full h-full object-cover' />
                    ) : (
                        <div className='w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center'>
                            <span className='text-4xl text-gray-600 font-bold'>{firstName[0]}{lastName[0]}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Name and Title */}
            <div className='flex-grow'>
                <h1 className='text-4xl font-bold text-gray-800 mb-1'>
                    {firstName} {lastName}
                </h1>
                <h2 className='text-lg text-gray-600 mb-4'>{jobTitle}</h2>
            </div>

            {/* Contact Info */}
            <div className='flex flex-col gap-2 text-sm text-gray-700'>
                <div className='flex items-center gap-2'>
                    <Mail className='w-4 h-4' style={{ color: resumeInfo?.themeColor }} />
                    <span>{email}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <Phone className='w-4 h-4' style={{ color: resumeInfo?.themeColor }} />
                    <span>{phone}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <MapPin className='w-4 h-4' style={{ color: resumeInfo?.themeColor }} />
                    <span>{address}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <Linkedin className='w-4 h-4' style={{ color: resumeInfo?.themeColor }} />
                    <span className='text-xs'>linkedin.com/in/{firstName.toLowerCase()}.{lastName.toLowerCase()}</span>
                </div>
            </div>
        </div>
    )
}

export default PersonalDetailPreview2
