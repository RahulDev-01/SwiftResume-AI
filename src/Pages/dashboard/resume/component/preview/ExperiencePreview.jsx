import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function ExperiencePreview({resumeInfo}) {
  const raw = Array.isArray(resumeInfo?.experience) ? resumeInfo.experience : [];
  const meaningful = raw.filter((e)=> (e?.title?.trim() || e?.companyName?.trim() || e?.workSummery?.trim()));
  const list = meaningful.length ? meaningful : (Array.isArray(Dummy?.experience) ? Dummy.experience : []);
  return (
    <div className='my-6'> 
    <h2 className='text-center font-bold text-lg mb-2' style={{color:resumeInfo?.themeColor}}>Professional Experience</h2>
    <hr className='border-[2px]' style={{borderColor:resumeInfo?.themeColor}}/>

    {list.map((exp,index)=>(
        <div key={index} className='my-5'>
            <h2 className='text-sm font-bold'
            style={{color:resumeInfo?.themeColor}}>
                {exp?.title}</h2>
            <h2 className='text-xs flex justify-between '>{exp?.companyName}, {exp?.city}, {exp?.state}
            <span className=' text-gray-500'>{exp?.startDate} To {exp?.currentlyWorking?'Present':exp?.endDate}</span>
            </h2>
      {/* <p className='text-xs py-2  text-gray-700'>
        {exp?.workSummery}
      </p> */}
      <div 
        className="text-xs py-2 text-gray-700 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1 break-words" 
        dangerouslySetInnerHTML={{__html: exp?.workSummery || ''}} 
      />
      {/* Debug output */}
      {process.env.NODE_ENV === 'development' && (
        <div className="hidden">Debug workSummery: {JSON.stringify(exp?.workSummery)}</div>
      )}
        </div>
    ))}
    </div>
  )
}

export default ExperiencePreview