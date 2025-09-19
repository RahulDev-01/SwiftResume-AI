import React from 'react'

function EducationPreview({resumeInfo}) {
  return (
 <div className='my-6'> 
    <h2 className='text-center font-bold text-lg mb-2' style={{color:resumeInfo?.themeColor}}>Education </h2>
    <hr className='border-[2px]' style={{borderColor:resumeInfo?.themeColor}}/>
    {resumeInfo?.education.map((edu,index)=>(
        <div key={index} className='my-5'>
            <h2 className='text-sm my-[3px] font-bold'
            style={{color:resumeInfo?.themeColor}}
            >{edu?.universityName}</h2>
            <h2 className='text-xs flex justify-between'>{edu?.degree} in {edu?.major} 
                <span className='text-gray-500'>{edu?.startDate} -  {edu?.endDate}</span>
            </h2>
            <p className='text-xs my-2 text-gray-700'>
                {edu.description}
            </p>
        </div>
    ))}

</div>
  )
}

export default EducationPreview