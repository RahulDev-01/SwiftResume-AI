import React, { useState, useRef, useContext } from 'react'
import PersonalDetails from '../../components/forms/PersonalDetails'
import Summary from '../../components/forms/Summary';
import Experience from '../../components/forms/Experience';
import Education from '../../components/forms/Education';
import Skills from '../../components/forms/Skills';
import Languages from '../../components/forms/Languages';
import Projects from '../../components/forms/Projects';
import { ResumeInfoContext } from '@/context/ResumeInfoContext.jsx';

function FormSection({ activeSection, onSectionChange }) {
  const [enableNext, setEnableNext] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { resumeInfo } = useContext(ResumeInfoContext) || {};

  // Refs to access form components
  const personalDetailsRef = useRef(null);
  const summaryRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const languagesRef = useRef(null);

  // Check if Template 2 is selected
  const isTemplate2 = resumeInfo?.templateId === '2' || resumeInfo?.templateId === 2;

  // Auto-save when section changes
  const handleSectionChange = async (newSection) => {
    setIsSaving(true);

    try {
      // Get the current form ref based on activeSection
      let currentFormRef = null;
      switch (activeSection) {
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
          currentFormRef = projectsRef;
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

      // Move to new section after successful save
      if (onSectionChange) {
        onSectionChange(newSection);
      }
    } catch (error) {
      console.error('Error saving form:', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className='glass-card'>
      {/* Section Title */}
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-800'>
          {activeSection === 1 && 'Basic Details'}
          {activeSection === 2 && 'Summary'}
          {activeSection === 3 && 'Experience'}
          {activeSection === 4 && 'Education'}
          {activeSection === 5 && 'Skills & Expertise'}
          {activeSection === 6 && 'Projects'}
          {activeSection === 7 && 'Languages'}
        </h2>
        <p className='text-sm text-gray-500 mt-1'>
          Fill in the information below. Changes are saved automatically.
        </p>
      </div>

      {/* Saving indicator */}
      {isSaving && (
        <div className='mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 flex items-center gap-2'>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
          Saving changes...
        </div>
      )}

      {/* Personal Detail */}
      {activeSection === 1 && <PersonalDetails ref={personalDetailsRef} enableNext={(v) => setEnableNext(v)} />}

      {/* Summary */}
      {activeSection === 2 && <Summary ref={summaryRef} enableNext={(v) => setEnableNext(v)} />}

      {/* Experience */}
      {activeSection === 3 && <Experience ref={experienceRef} enableNext={(v) => setEnableNext(v)} />}

      {/* Educational Details */}
      {activeSection === 4 && <Education ref={educationRef} enableNext={(v) => setEnableNext(v)} />}

      {/* Skills */}
      {activeSection === 5 && <Skills ref={skillsRef} enableNext={(v) => setEnableNext(v)} />}

      {/* Projects - Only for Template 2 */}
      {isTemplate2 && activeSection === 6 && <Projects ref={projectsRef} enableNext={(v) => setEnableNext(v)} />}

      {/* Languages - Only for Template 2 */}
      {isTemplate2 && activeSection === 7 && <Languages ref={languagesRef} enableNext={(v) => setEnableNext(v)} />}
    </div>
  )
}

export default FormSection