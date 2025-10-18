import React, { useState } from 'react'
import PersonalDetails from '../../components/forms/PersonalDetails'
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import Summary from '../../components/forms/Summary';
import Experience from '../../components/forms/Experience';

function FormSection() {
  const [activeFormIndex , setActiveFormIndex] = useState(1);
  const [enableNext,setEnableNext] = useState(false)

  // Reset enableNext when changing form
  const goToForm = (index) => {
    setActiveFormIndex(index);
    setEnableNext(false);
  }



  return (
    <div>
      <div className='flex justify-between mb-3'>
  <Button varient='outline' size='sm'
   className='flex gap-2 '> <LayoutGrid />Theme</Button>
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

      {/* Educational Details */}

      {/* Skills */}


    </div>
  )
}

export default FormSection