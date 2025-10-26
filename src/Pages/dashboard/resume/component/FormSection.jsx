import React, { useState } from 'react'
import PersonalDetails from '../../components/forms/PersonalDetails'
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home, LayoutGrid } from 'lucide-react';
import Summary from '../../components/forms/Summary';
import Experience from '../../components/forms/Experience';
import Education from '../../components/forms/Education';
import Skills from '../../components/forms/Skills';
import { Link, Navigate, useParams } from 'react-router-dom';
import ThemeColor from '../../components/ThemeColor';

function FormSection() {
  const [activeFormIndex , setActiveFormIndex] = useState(1);
  const [enableNext,setEnableNext] = useState(false)
  const {resumeId} = useParams()

  // Reset enableNext when changing form
  const goToForm = (index) => {
    setActiveFormIndex(index);
    setEnableNext(false);
  }



  return (
    <div>
      <div className='flex justify-between mb-3'>
        <div className='flex gap-5'>
          <Link to={"/dashboard"}>
          <Button className='mb-1'><Home className='inline'/></Button>
          </Link>
          <ThemeColor />
  
   </div>
        <div className='flex gap-2'>
          {activeFormIndex>1 &&
           <Button  size='sm'
           onClick={()=>goToForm(activeFormIndex -1)}><ArrowLeft /> </Button>}
        <Button className ='flex gap-2' size='sm' 
          onClick={()=>goToForm(activeFormIndex +1)}
          >Next <ArrowRight /></Button>
        </div>
      </div>
      {/* Personal Detail */}
    {activeFormIndex==1?<PersonalDetails enableNext={(v)=>setEnableNext(v)}/>: null}

    {/* Summery */}
  {activeFormIndex==2?<Summary enableNext={(v)=>setEnableNext(v)}/>: null}
  {activeFormIndex==3?<Experience enableNext={(v)=>setEnableNext(v)}/>: null}
      {/* Experience */}
              {activeFormIndex==4?<Education enableNext={(v)=>setEnableNext(v)}/>: null}
      {/* Educational Details */}
      {activeFormIndex==5?<Skills enableNext={(v)=>setEnableNext(v)}/>: null}

      {/* Skills */}
      {activeFormIndex==6?<Navigate  to={'/my-resume/'+ resumeId +"/view"}/>: null}


    </div>
  )
}

export default FormSection