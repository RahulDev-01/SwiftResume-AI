import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function SkillPreview({resumeInfo}) {
  return (
     <div className='my-6'> 
    <h2 className='text-center font-bold text-lg mb-2' style={{color:resumeInfo?.themeColor}}>Skills</h2>
    <hr className='border-[2px]' style={{borderColor:resumeInfo?.themeColor}}/> 
    <div className='grid grid-cols-2 gap-3 my-4 w-full'>
        {(() => {
            const raw = Array.isArray(resumeInfo?.skills) ? resumeInfo.skills : [];
            const meaningful = raw.filter((s)=> (s?.name?.trim() || Number(s?.rating) > 0));
            const list = meaningful.length ? meaningful : (Array.isArray(Dummy?.skills) ? Dummy.skills : []);
            return list;
        })().map((skill,index)=>(
            <div key={index} className='flex items-center gap-3 min-w-0 flex-wrap'>
                <div className='flex-1 min-w-0'>
                    <h2 className='text-xs break-words whitespace-normal'>{skill?.name}</h2>
                </div>
                <div className='h-2 bg-gray-200 w-[120px] flex-none'>
                    <div className='h-2' style={{backgroundColor :resumeInfo?.themeColor, width:(Number(skill?.rating)||0)*20+"%"}}></div>
                </div>
            </div>
        ))}
    </div>
    
    </div>
  )
}

export default SkillPreview