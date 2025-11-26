import React, { useState, useRef, useContext } from 'react'
import PersonalDetails from '../../components/forms/PersonalDetails'
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home, LayoutGrid } from 'lucide-react';
import Summary from '../../components/forms/Summary';
import Experience from '../../components/forms/Experience';
import Education from '../../components/forms/Education';
import Skills from '../../components/forms/Skills';
import Languages from '../../components/forms/Languages';
import Certifications from '../../components/forms/Certifications';
import { Link, Navigate, useParams } from 'react-router-dom';
import ThemeColor from '../../components/ThemeColor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext.jsx';

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { resumeId } = useParams();
  const { resumeInfo } = useContext(ResumeInfoContext) || {};

  // Refs to access form components
  const personalDetailsRef = useRef(null);
  const summaryRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const skillsRef = useRef(null);
  const certificationsRef = useRef(null);
  const languagesRef = useRef(null);

  // Check if Template 2 is selected
  const isTemplate2 = resumeInfo?.templateId === '2' || resumeInfo?.templateId === 2;

  // Reset enableNext when changing form
  const goToForm = (index) => {
    setActiveFormIndex(index);
    setEnableNext(false);
  }

  // Handle Next button click - auto-save before moving to next form
  const handleNext = async () => {
    setIsSaving(true);

    try {
      // Get the current form ref based on activeFormIndex
      let currentFormRef = null;
      switch (activeFormIndex) {
        case 1:
          currentFormRef = personalDetailsRef;
          break;
        case 2:
          currentFormRef = summaryRef;
          break;
        case 3:
          currentFormRef = experienceRef;
          break;
        case 4:
          currentFormRef = educationRef;
          break;
        case 5:
          currentFormRef = skillsRef;
          break;
        case 6:
          currentFormRef = certificationsRef;
          break;
        case 7:
          currentFormRef = languagesRef;
          break;
        default:
          break;
      }

      // If the form has a save function, call it
      if (currentFormRef?.current?.handleSave) {
        await currentFormRef.current.handleSave();
      }

      // Move to next form after successful save
      goToForm(activeFormIndex + 1);
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className='flex justify-between mb-3'>
        <div className='flex gap-5'>
          <Link to={"/dashboard"}>
            <Button className='mb-1 btn-glass-outline' size="sm"><Home className='inline' /></Button>
          </Link>
          <ThemeColor />
        </div>
        <div className='flex gap-2'>
          {activeFormIndex > 1 &&
            <Button size='sm'
              onClick={() => goToForm(activeFormIndex - 1)}
              disabled={isSaving}
              className="btn-glass-outline"
            >
              <ArrowLeft />
            </Button>}
          <Button
            className='flex gap-2 btn-glass'
            size='sm'
            onClick={handleNext}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Next'} <ArrowRight />
          </Button>
        </div>
      </div>

      {/* Personal Detail */}
      {activeFormIndex == 1 ? <PersonalDetails ref={personalDetailsRef} enableNext={(v) => setEnableNext(v)} /> : null}

      {/* Summary */}
      {activeFormIndex == 2 ? <Summary ref={summaryRef} enableNext={(v) => setEnableNext(v)} /> : null}

      {/* Experience */}
      {activeFormIndex == 3 ? <Experience ref={experienceRef} enableNext={(v) => setEnableNext(v)} /> : null}

      {/* Educational Details */}
      {activeFormIndex == 4 ? <Education ref={educationRef} enableNext={(v) => setEnableNext(v)} /> : null}

      {/* Skills */}
      {activeFormIndex == 5 ? <Skills ref={skillsRef} enableNext={(v) => setEnableNext(v)} /> : null}

      {/* Certifications - Only for Template 2 */}
      {isTemplate2 && activeFormIndex == 6 ? <Certifications ref={certificationsRef} enableNext={(v) => setEnableNext(v)} /> : null}

      {/* Languages - Only for Template 2 */}
      {isTemplate2 && activeFormIndex == 7 ? <Languages ref={languagesRef} enableNext={(v) => setEnableNext(v)} /> : null}

      {/* Navigate to view page */}
      {(isTemplate2 && activeFormIndex == 8) || (!isTemplate2 && activeFormIndex == 6) ? <Navigate to={'/my-resume/' + resumeId + "/view"} /> : null}
    </div>
  )
}

export default FormSection