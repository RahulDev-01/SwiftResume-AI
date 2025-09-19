import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FormSection from '../component/FormSection';
import ResumePreview from '../component/ResumePreview';
import { ResumeIfoContext } from '../../../../context/ResumeInfoContext';
import Dummy from '../../../../Data/Dummy';

function Resume() {

    const params = useParams();
    const [resumeInfo, setResumeInfo] = useState()
    useEffect(()=>{
  setResumeInfo(Dummy)
        
    },[])


  return (
    <ResumeIfoContext.Provider value={{resumeInfo, setResumeInfo}}>
    <div>
      <div className='grid grid-cols-1 md:grid-cols-2 p-10 g-10'>
        {/* Form Section */}
        <FormSection />
        {/* Preview Section */}
        <ResumePreview />
      </div>
    </div>
    </ResumeIfoContext.Provider>
  )
}

export default Resume