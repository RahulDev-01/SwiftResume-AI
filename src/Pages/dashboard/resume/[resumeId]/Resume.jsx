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
          Languages: pickArray(attrs, ['languages', 'Languages']),
          Projects: pickArray(attrs, ['Projects', 'projects', 'Project', 'project']),
          templateId: attrs.templateId || '1'
        };

        setResumeInfo(normalized)
      }).catch(err => {
        console.error('Failed to load resume:', err);
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
      <div className="min-h-screen bg-gray-50">
        {/* Top Bar with Enhanced UI */}
        <div className='sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm'>
          <div className='mx-auto max-w-7xl px-4 lg:px-6 py-3'>
            <div className='flex flex-wrap justify-between items-center gap-4'>

              {/* Left: Home Button */}
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className='flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 shadow-sm'
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
                  <label className='text-xs font-semibold text-gray-500 mb-1 block'>Template</label>
                  <select
                    className='appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 cursor-pointer hover:border-blue-400 text-sm font-medium min-w-[140px] shadow-sm'
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
                  <svg className='absolute right-3 top-[30px] w-5 h-5 text-gray-400 pointer-events-none' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                  </svg>
                </div>

                {/* Theme Color Picker - Horizontal Scroll with Buttons */}
                <div className='relative flex items-center gap-3'>
                  <label className='text-xs font-semibold text-gray-500 mb-1 block absolute -top-5 left-0'>Theme Color</label>

                  {/* Left Scroll Button */}
                  <button
                    onClick={() => {
                      const container = document.getElementById('theme-scroll-container');
                      if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
                    }}
                    className='p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-blue-400 transition-all shadow-sm z-10'
                  >
                    <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                    </svg>
                  </button>

                  {/* Scrollable Container */}
                  <div
                    id='theme-scroll-container'
                    className='flex gap-3 overflow-x-auto px-1 py-2 scroll-smooth'
                    style={{
                      maxWidth: '300px',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    <style>{`
                      #theme-scroll-container::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {themeColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setResumeInfo({ ...resumeInfo, themeColor: color });
                          GlobalApi.UpdateResumeDetail(resumeId, { data: { themeColor: color } });
                          toast.success('Theme color updated!');
                        }}
                        className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 hover:scale-110 flex-shrink-0 border border-gray-100 shadow-sm ${resumeInfo?.themeColor === color
                          ? 'ring-2 ring-blue-500 ring-offset-2 scale-110'
                          : 'hover:ring-2 hover:ring-gray-200'
                          }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>

                  {/* Right Scroll Button */}
                  <button
                    onClick={() => {
                      const container = document.getElementById('theme-scroll-container');
                      if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
                    }}
                    className='p-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 hover:border-blue-400 transition-all shadow-sm z-10'
                  >
                    <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right: View & Download Buttons */}
              <div className='flex items-center gap-3'>
                <button
                  onClick={() => window.location.href = `/my-resume/${resumeId}/view`}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 transition-all duration-200 shadow-sm font-medium text-sm'
                >
                  <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                  </svg>
                  View
                </button>
                <button
                  onClick={() => window.location.href = `/my-resume/${resumeId}/view`}
                  className='flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm'
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

        {/* Main Content - Responsive Layout */}
        <div className='flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-72px)]'>
          {/* Section 1: Sidebar with Collapsible Forms */}
          <div className='w-full lg:w-[500px] flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto h-auto lg:h-full'>
            <ResumeSidebarWithForms
              resumeInfo={resumeInfo}
              isTemplate2={isTemplate2}
            />
          </div>

          {/* Section 2: Preview in A4 Size */}
          <div className='flex-1 overflow-auto bg-gray-100 p-4 lg:p-8 h-auto lg:h-full'>
            <div className='mx-auto' style={{ width: '210mm', minHeight: '297mm' }}>
              <div className='bg-white shadow-xl' style={{ width: '210mm', minHeight: '297mm' }}>
                <ResumePreview enableEditMode={true} />
              </div>
            </div>
          </div>
        </div>

        {/* Debug Section - Temporary */}
        <div className="p-4 bg-gray-200 text-xs font-mono overflow-auto border-t border-gray-400">
          <h3 className="font-bold">Debug Info</h3>
          <p><strong>Resume ID:</strong> {resumeId}</p>
          <p><strong>Keys in resumeInfo:</strong> {Object.keys(resumeInfo || {}).join(', ')}</p>
          <p><strong>Projects Data:</strong> {JSON.stringify(resumeInfo?.Projects || 'N/A').substring(0, 100)}...</p>
          <p><strong>Languages Data:</strong> {JSON.stringify(resumeInfo?.Languages || 'N/A').substring(0, 100)}...</p>
          <p><strong>Experience Data:</strong> {JSON.stringify(resumeInfo?.Experience || 'N/A').substring(0, 100)}...</p>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default Resume
