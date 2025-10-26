import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function PersonalDetailPreview({resumeInfo}) {
  const firstName = (resumeInfo?.firstName || '').trim() || Dummy.firstName;
  const lastName = (resumeInfo?.lastName || '').trim() || Dummy.lastName;
  const jobTitle = (resumeInfo?.jobTitle || '').trim() || Dummy.jobTitle;
  const address = (resumeInfo?.address || '').trim() || Dummy.address;
  const phone = (resumeInfo?.phone || '').trim() || Dummy.phone;
  const email = (resumeInfo?.email || '').trim() || Dummy.email;
  return (
    <div>
        <h2 className='font-bold text-xl text-center' style={{color:resumeInfo?.themeColor}}>
            {firstName} {lastName}</h2>
            <h2 className='text-center text-sm font-medium'>{jobTitle}</h2>
            <h2 className='text-center font-normal text-xs'  style={{color:resumeInfo?.themeColor}}>{address}</h2>

            <div className='flex justify-between'>
                <h2 className='font-normal text-xs'  style={{color:resumeInfo?.themeColor}}>{phone}</h2>
                <h2 className='font-normal text-xs'  style={{color:resumeInfo?.themeColor}}>{email}</h2>
            </div>
            <hr className='border-[2px] my-2 ' style={{borderColor:resumeInfo?.themeColor}}/>
    </div>
  )
}

export default PersonalDetailPreview