import React, { useContext } from 'react'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'
import PersonalDetailPreview from './preview/PersonalDetailPreview'
import SummaryPreview from './preview/SummaryPreview'
import ExperiencePreview from './preview/ExperiencePreview'
import EducationPreview from './preview/EducationPreview'
import SkillPreview from './preview/SkillPreview'

function ResumePreview() {

    const {resumeInfo, setResumeInfo} = useContext(ResumeInfoContext)
  return (
    <div className='shadow-lg p-14 print:p-0 border-t-[20px] print:border-t-0 resume-sheet w-full max-w-[900px] mx-auto print:w-[210mm] print:min-h-[297mm]' style={{borderColor:resumeInfo?.themeColor}}>
        {/* Personal DEtail  */}
        <PersonalDetailPreview  resumeInfo={resumeInfo}/>

        {/* Summary  */}
        <SummaryPreview  resumeInfo ={resumeInfo}/>

        {/* Professional Experience  */}
        <ExperiencePreview resumeInfo ={resumeInfo}/>

        {/* Educational Details */}
        <EducationPreview resumeInfo ={resumeInfo} />

        {/* Skills*/}
        <SkillPreview resumeInfo ={resumeInfo} />

    </div>
  )
}

export default ResumePreview