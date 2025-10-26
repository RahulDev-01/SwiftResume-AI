import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function EducationPreview({resumeInfo}) {
  return (
 <div className='my-6'> 
    <h2 className='text-center font-bold text-lg mb-2' style={{color:resumeInfo?.themeColor}}>Education </h2>
    <hr className='border-[2px]' style={{borderColor:resumeInfo?.themeColor}}/>
    {(() => {
        const raw = Array.isArray(resumeInfo?.education) ? resumeInfo.education : [];
        const meaningful = raw.filter((e)=> (
          e?.universityName?.trim() || e?.degree?.trim() || e?.major?.trim() || e?.description?.trim()
        ));
        const list = meaningful.length ? meaningful : (Array.isArray(Dummy?.education) ? Dummy.education : []);
        return list;
    })().map((edu,index)=>(
        <div key={index} className='my-5'>
            <h2 className='text-sm my-[3px] font-bold'
            style={{color:resumeInfo?.themeColor}}
            >{edu?.universityName}</h2>
            <h2 className='text-xs flex justify-between'>{edu?.degree} in {edu?.major} 
                <span className='text-gray-500'>{edu?.startDate} -  {edu?.endDate}</span>
            </h2>
            <p className='text-xs my-2 text-gray-700 break-words max-h-32 overflow-y-auto pr-1'>
                {edu.description}
            </p>
        </div>
    ))}

</div>
  )
}

export default EducationPreview