import React from 'react'

function ExperiencePreview({resumeInfo}) {
  return (
    <div className='my-6'> 
    <h2 className='text-center font-bold text-lg mb-2' style={{color:resumeInfo?.themeColor}}>Professional Experience</h2>
    <hr className='border-[2px]' style={{borderColor:resumeInfo?.themeColor}}/>

    {resumeInfo?.experience.map((exp,index)=>(
        <div key={index} className='my-5'>
            <h2 className='text-sm font-bold'
            style={{color:resumeInfo?.themeColor}}>
                {exp?.title}</h2>
            <h2 className='text-xs flex justify-between '>{exp?.companyName}, {exp?.city}, {exp?.state}
            <span className=' text-gray-500'>{exp?.startDate} - {exp?.currentlyWorking?'Present':exp?.endDate}</span>
            </h2>
            <p className='text-xs py-2  text-gray-700'>
                {exp?.workSummery}
            </p>
        </div>
    ))}
    </div>
  )
}

export default ExperiencePreview