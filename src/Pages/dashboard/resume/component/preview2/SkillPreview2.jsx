import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function SkillPreview2({ resumeInfo, enableEditMode }) {
    const skills = (() => {
        const raw = Array.isArray(resumeInfo?.skills) ? resumeInfo.skills : [];
        if (enableEditMode) {
            // In edit mode, show whatever is in the list (even empty ones) so user sees "Add More" working
            // But if completely empty, show Dummy
            return raw.length > 0 ? raw : (Array.isArray(Dummy?.skills) ? Dummy.skills : []);
        }
        // In view mode, filter out empty ones
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
                        className='px-3 py-1 text-xs font-medium text-white rounded text-center'
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
