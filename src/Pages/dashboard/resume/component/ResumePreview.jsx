import React, { useContext } from 'react'
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext'
import ResumePreview1 from './ResumePreview1'
import ResumePreview2 from './ResumePreview2'

function ResumePreview({ enableEditMode = false }) {

  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext)

  return (
    <>
      {resumeInfo?.templateId == 2 ?
        <ResumePreview2 resumeInfo={resumeInfo} enableEditMode={enableEditMode} />
        :
        <ResumePreview1 resumeInfo={resumeInfo} enableEditMode={enableEditMode} />
      }
    </>
  )
}

export default ResumePreview