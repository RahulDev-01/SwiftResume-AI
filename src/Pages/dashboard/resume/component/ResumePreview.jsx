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
    <div className='shadow-lg h-full p-14 border-t-[20px]' style={{borderColor:resumeInfo?.themeColor}}>
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