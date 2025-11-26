import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function SkillPreview2({ resumeInfo }) {
    const skills = (() => {
        const raw = Array.isArray(resumeInfo?.skills) ? resumeInfo.skills : [];
        const meaningful = raw.filter((s) => s?.name?.trim());
        return meaningful.length ? meaningful : (Array.isArray(Dummy?.skills) ? Dummy.skills : []);
    })();

    return (
        <div className='mb-6'>
            <h2 className='text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2' style={{ borderColor: resumeInfo?.themeColor }}>
                AREAS OF EXPERTISE
            </h2>
            <div className='flex flex-wrap gap-2'>
                {skills.map((skill, index) => (
                    <span
                        key={index}
                        className='px-3 py-1 text-xs font-medium text-white rounded'
                        style={{ backgroundColor: resumeInfo?.themeColor || '#047857' }}
                    >
                        {skill?.name}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default SkillPreview2
