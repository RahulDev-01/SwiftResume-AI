import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function LanguagesPreview2({ resumeInfo }) {
    const languages = (() => {
        const raw = Array.isArray(resumeInfo?.languages) ? resumeInfo.languages : [];
        const meaningful = raw.filter((l) => l?.name?.trim());
        return meaningful.length ? meaningful : [];
    })();

    if (languages.length === 0) return null;

    return (
        <div className='mb-6'>
            <h2 className='text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2' style={{ borderColor: resumeInfo?.themeColor }}>
                LANGUAGES
            </h2>
            <div className='space-y-2'>
                {languages.map((lang, index) => (
                    <div key={index} className='flex justify-between items-baseline'>
                        <span className='text-sm font-semibold text-gray-800'>{lang?.name}</span>
                        <span className='text-xs text-gray-600 italic'>{lang?.proficiency}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default LanguagesPreview2
