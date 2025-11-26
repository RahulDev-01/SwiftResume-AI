import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function EducationPreview2({ resumeInfo }) {
    const educations = (() => {
        const raw = resumeInfo?.education;
        if (raw === undefined || raw === null) return Dummy.education;
        const filtered = raw.filter((e) => e?.universityName?.trim() || e?.degree?.trim());
        return filtered.length > 0 ? filtered : Dummy.education;
    })();

    return (
        <div className='mb-6'>
            <h2 className='text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2' style={{ borderColor: resumeInfo?.themeColor }}>
                EDUCATION
            </h2>
            <div className='space-y-3 break-words'>
                {educations.map((edu, index) => (
                    <div key={index} className='relative pl-4'>
                        <div className='absolute left-0 top-1 w-2 h-2 rounded-full' style={{ backgroundColor: resumeInfo?.themeColor }}></div>
                        <h3 className='font-bold text-sm text-gray-800'>
                            {edu?.degree} in {edu?.major}
                        </h3>
                        <p className='text-xs text-gray-700'>{edu?.universityName}</p>
                        <p className='text-xs text-gray-500 italic'>
                            {edu?.startDate} - {edu?.endDate}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EducationPreview2
