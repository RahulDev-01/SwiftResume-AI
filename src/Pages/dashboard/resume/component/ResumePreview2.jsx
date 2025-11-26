import React from 'react'
import PersonalDetailPreview2 from './preview2/PersonalDetailPreview2'
import SummaryPreview2 from './preview2/SummaryPreview2'
import ExperiencePreview2 from './preview2/ExperiencePreview2'
import EducationPreview2 from './preview2/EducationPreview2'
import SkillPreview2 from './preview2/SkillPreview2'
import LanguagesPreview2 from './preview2/LanguagesPreview2'
import CertificationsPreview2 from './preview2/CertificationsPreview2'

function ResumePreview2({ resumeInfo }) {
    return (
        <div className='shadow-lg p-10 border-t-[20px] resume-sheet w-full max-w-[900px] mx-auto bg-white' style={{ borderColor: resumeInfo?.themeColor }}>
            {/* Header with Personal Details */}
            <PersonalDetailPreview2 resumeInfo={resumeInfo} />

            {/* Summary */}
            <SummaryPreview2 resumeInfo={resumeInfo} />

            <div className='grid grid-cols-3 gap-6 mt-6'>
                {/* Left Column: Experience (2/3 width) */}
                <div className='col-span-2'>
                    <ExperiencePreview2 resumeInfo={resumeInfo} />
                </div>

                {/* Right Column: Skills, Certifications, Education, Languages (1/3 width) */}
                <div className='col-span-1 flex flex-col'>
                    <SkillPreview2 resumeInfo={resumeInfo} />
                    <CertificationsPreview2 resumeInfo={resumeInfo} />
                    <EducationPreview2 resumeInfo={resumeInfo} />
                    <LanguagesPreview2 resumeInfo={resumeInfo} />
                </div>
            </div>
        </div>
    )
}

export default ResumePreview2
