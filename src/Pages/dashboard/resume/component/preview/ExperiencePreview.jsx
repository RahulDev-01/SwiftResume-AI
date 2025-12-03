import React from 'react'
import Dummy from '../../../../../Data/Dummy'
import { ensureUrl } from '../../../../../utils/urlHelper';

function ExperiencePreview({ resumeInfo }) {
  const raw = Array.isArray(resumeInfo?.experience) ? resumeInfo.experience : [];
  const meaningful = raw.filter((e) => (e?.title?.trim() || e?.companyName?.trim() || e?.workSummery?.trim()));
  const list = meaningful.length ? meaningful : (Array.isArray(Dummy?.experience) ? Dummy.experience : []);
  return (
    <div className='my-6'>
      <h2 className='text-center font-bold text-lg mb-2' style={{ color: resumeInfo?.themeColor }}>Professional Experience</h2>
      <hr className='border-[2px]' style={{ borderColor: resumeInfo?.themeColor }} />

      {list.map((exp, index) => (
        <div key={index} className='my-5'>
          <h2 className='text-sm font-bold' style={{ color: resumeInfo?.themeColor }}>{exp?.title}</h2>
          <h2 className='text-xs flex justify-between items-center font-medium'>
            {exp?.url ? (
              <a href={ensureUrl(exp?.url)} style={{ textDecoration: 'underline' }} className='flex items-center gap-1 hover:underline cursor-pointer'>
                <img src="/icons/company.png" alt="company" className="w-4 h-4" />
                {exp?.companyName}, {exp?.city}, {exp?.state}
              </a>
            ) : (
              <span className='flex items-center gap-1'>
                <img src="/icons/company.png" alt="company" className="w-4 h-4" />
                {exp?.companyName}, {exp?.city}, {exp?.state}
              </span>
            )}
            <span className='flex items-center gap-1'>
              <img src="/icons/date.png" alt="date" className="w-4 h-4" />
              {exp?.startDate} To {exp?.currentlyWorking ? 'Present' : exp?.endDate}
            </span>
          </h2>
          <div className='text-xs my-2 text-gray-700 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:mb-1 break-words' dangerouslySetInnerHTML={{ __html: exp?.workSummery }} />
        </div>
      ))}
    </div>
  )
}

export default ExperiencePreview