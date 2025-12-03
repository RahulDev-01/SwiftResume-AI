import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResumePreview from '../component/ResumePreview';
import ResumeSidebarWithForms from '../component/ResumeSidebarWithForms';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import Dummy from '../../../../Data/Dummy';
import GlobalApi from '../../../../../service/GlobalApi';
import { toast } from 'sonner';

function Resume() {

  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState()

  useEffect(() => {
    const GetResumeInfo = () => {
      GlobalApi.GetId(resumeId).then(resp => {
        const payload = resp?.data?.data;
        const attrs = payload?.attributes || payload || {};

        const pickArray = (obj, keys) => {
          for (const k of keys) {
            if (Array.isArray(obj?.[k])) return obj[k];
          }
          for (const k of keys) {
            const rel = obj?.[k]?.data;
            if (Array.isArray(rel)) {
              return rel.map((it) => it?.attributes || it).filter(Boolean);
            }
          }
          return null;
        };
        const normalized = {
          ...Dummy,
          ...attrs,
          education: pickArray(attrs, ['education', 'Education', 'educations', 'Educations', 'EducationList']),
          experience: pickArray(attrs, ['experience', 'Experience', 'experiences', 'Experiences', 'workExperience', 'WorkExperience']),
          skills: pickArray(attrs, ['skills', 'Skills', 'skill', 'Skill']),
          languages: pickArray(attrs, ['languages', 'Languages']),
          certifications: pickArray(attrs, ['certifications', 'Certifications']),
          templateId: attrs.templateId || '1'
        };

        setResumeInfo(normalized)
      })
    }
    GetResumeInfo()
  }, [resumeId])

  const isTemplate2 = resumeInfo?.templateId === '2' || resumeInfo?.templateId === 2;

  // 24 theme colors
  const themeColors = [
    '#2563eb', // Blue-600
    '#10b981', // Emerald-500
    '#059669', // Emerald-600
    '#0891b2', // Cyan-600
    '#3b82f6', // Blue-500
    '#14b8a6', // Teal-500
    '#6366f1', // Indigo-500
    '#8b5cf6', // Violet-500
    '#a855f7', // Purple-500
    '#d946ef', // Fuchsia-500
    '#ec4899', // Pink-500
    '#f43f5e', // Rose-500
    '#ef4444', // Red-500
    '#f97316', // Orange-500
    '#f59e0b', // Amber-500
    '#eab308', // Yellow-500
    '#84cc16', // Lime-500
    '#22c55e', // Green-500
    '#06b6d4', // Cyan-500
    '#0ea5e9', // Sky-500
    '#7c3aed', // Violet-600
    '#000000', // Black
    '#047857', // Emerald-700
    '#dc2626'  // Red-600
  ];

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
        {/* Top Bar with Enhanced UI */}
        <div className='sticky top-0 z-20 bg-white border-b border-gray-200 shadow-md'>
          <div className='mx-auto max-w-7xl px-6 py-3'>
            <div className='flex justify-between items-center gap-4'>

              {/* Left: Home Button */}
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className='flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                  </svg>
                  <span className='font-medium text-sm'>Home</span>
                </button>
              </div>

              {/* Center: Template & Theme Controls */}
              <div className='flex items-center gap-4 flex-1 justify-center'>
                {/* Template Selector */}
                <div className='relative'>
                  <label className='text-xs font-semibold text-gray-600 mb-1 block'>Template</label>
                  <select
                    className='appearance-none px-4 py-2.5 pr-10 border-2 border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 cursor-pointer hover:border-blue-400 hover:shadow-md text-sm font-medium min-w-[140px] shadow-sm'
                    value={resumeInfo?.templateId || '1'}
                    onChange={(e) => {
                      const newTemplateId = e.target.value;
                      setResumeInfo({ ...resumeInfo, templateId: newTemplateId });
                      GlobalApi.UpdateResumeDetail(resumeId, { data: { templateId: newTemplateId } });
                      toast.success(`Switched to Template ${newTemplateId}`);
                    }}
                  >
                    <option value="1">Template 1</option>
                    <option value="2">Template 2</option>
                  </select>
                  <svg className='absolute right-3 top-[30px] w-5 h-5 text-gray-500 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </div>

                {/* Theme Color Picker - 24 Scrollable Colors */}
                <div className='relative'>
                  <label className='text-xs font-semibold text-gray-600 mb-1 block'>Theme Color · 24 Options</label>
                  <div
                    className='overflow-x-auto p-2 border-2 border-gray-300 rounded-lg bg-white shadow-sm hover:border-blue-400 transition-all'
                    style={{
                      maxWidth: '450px',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e1 #f1f5f9'
                    }}
                  >
                    <div className='flex gap-2.5 pb-1'>
                      {themeColors.map((color, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setResumeInfo({ ...resumeInfo, themeColor: color });
                            GlobalApi.UpdateResumeDetail(resumeId, { data: { themeColor: color } });
                            toast.success('Theme color updated!');
                          }}
                          className={`w-10 h-10 rounded-full cursor-pointer transition-all duration-300 hover:scale-125 flex-shrink-0 ${resumeInfo?.themeColor === color
                              ? 'ring-4 ring-blue-500 ring-offset-2 scale-110'
                              : 'hover:ring-2 hover:ring-gray-400'
                            }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: View & Download Buttons */}
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => window.location.href = `/my-resume/${resumeId}/view`}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 shadow-sm hover:shadow-md font-medium text-sm hover:scale-105'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                  View
                </button>
                <button
                  onClick={() => window.location.href = `/my-resume/${resumeId}/view`}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm hover:scale-105'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 2 Sections Only */}
        <div className='flex' style={{ height: 'calc(100vh - 72px)' }}>
          {/* Section 1: Sidebar with Collapsible Forms */}
          <div className='w-[500px] flex-shrink-0 shadow-lg overflow-y-auto'>
            <ResumeSidebarWithForms
              resumeInfo={resumeInfo}
              isTemplate2={isTemplate2}
            />
          </div>

          {/* Section 2: Preview in A4 Size */}
          <div className='flex-1 overflow-y-auto bg-gradient-to-br from-blue-50 to-green-50 p-8'>
            <div className='mx-auto' style={{ width: '210mm', minHeight: '297mm' }}>
              <div className='bg-white shadow-2xl' style={{ width: '210mm', minHeight: '297mm' }}>
                <ResumePreview enableEditMode={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default Resume