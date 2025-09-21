import React, { useState } from 'react'
import PersonalDetails from '../../components/forms/PersonalDetails'
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';

function FormSection() {
  const [activeFormIndex , setActiveFormIndex] = useState(1);
  const [enableNext,setEnableNext] = useState(false)



  return (
    <div>
      <div className='flex justify-between mb-3'>
        <Button varient='outline' size='sm'
         classname='flex gap-2 '> <LayoutGrid />Theme</Button>
        <div className='flex gap-2'>
          {activeFormIndex>1 &&
           <Button  size='sm'
           onClick={()=>setActiveFormIndex(activeFormIndex -1)}><ArrowLeft /> </Button>}
        <Button classname ='flex gap-2' size='sm' disabled ={!enableNext}
          onClick={()=>setActiveFormIndex(activeFormIndex +1)}
          >Next <ArrowRight /></Button>
        </div>
      </div>
      {/* Personal Detail */}
      {activeFormIndex==1?<PersonalDetails enableNext={(v)=>setEnableNext(v)}/>: null}

      {/* Summery */}

      {/* Experience */}

      {/* Educational Details */}

      {/* Skills */}


    </div>
  )
}

export default FormSection