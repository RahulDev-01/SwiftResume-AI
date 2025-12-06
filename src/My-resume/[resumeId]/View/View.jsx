import React, { useEffect, useState } from 'react'
import Header from '../../../components/custom/Header'
import { Button } from "@/components/ui/button";
import ResumePreview from '../../../Pages/dashboard/resume/component/ResumePreview';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import GlobalApi from '../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { RWebShare } from '../../../components/shared/RWebShare';
import Dummy from '../../../Data/Dummy';
import { Download, Share2, FileCheck, Sparkles, CheckCircle2, Type } from 'lucide-react';

function View() {
  const [resumeInfo, setResumeInfo] = useState();
  const [zoom] = useState(1.5);
  const [fontSize, setFontSize] = useState(100); // Font size percentage (70-100)
  const { resumeId } = useParams()

  useEffect(() => {
    const GetResumeInfo = () => {
      GlobalApi.GetId(resumeId).then(resp => {
        const payload = resp?.data?.data;
        const attrs = payload?.attributes || payload || {};

        // Normalize arrays
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
          education: pickArray(attrs, ['education', 'Education', 'educations', 'Educations']),
          experience: pickArray(attrs, ['experience', 'Experience', 'experiences', 'Experiences']),
          skills: pickArray(attrs, ['skills', 'Skills', 'skill', 'Skill']),
          languages: pickArray(attrs, ['languages', 'Languages']),
          certifications: pickArray(attrs, ['certifications', 'Certifications']),
          templateId: attrs.templateId || '1'
        };

        setResumeInfo(normalized);
      })
    }
    GetResumeInfo();
  }, [resumeId])

  const HandleDownload = () => {
    window.print();
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id='no-print' className="min-h-screen text-black">
        <Header />

        {/* Main Success Card */}
        <div className='my-10 mx-auto max-w-4xl px-6'>
          <div className='bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden'>

            {/* Header Section with Gradient */}
            <div className='p-8 text-black relative overflow-hidden'>
              <div className='relative z-10 text-center'>
                <div className='mb-4 flex justify-center'>
                  <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center animate-bounce'>
                    <Sparkles className='w-10 h-10 text-blue-600' />
                  </div>
                </div>
                <h2 className='text-3xl md:text-4xl font-bold mb-3 text-black'>
                  🎉 Your Resume is Ready!
                </h2>
                <p className='text-gray-700 text-lg max-w-2xl mx-auto'>
                  Your professional resume has been generated successfully. Download it now or share with recruiters.
                </p>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className='p-8 border-b border-gray-100'>
              <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
                <Button
                  onClick={HandleDownload}
                  className="w-full sm:w-auto px-8 py-6 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group"
                >
                  <div className="flex items-center gap-3">
                    <Download className="w-5 h-5 group-hover:animate-bounce" />
                    <span>Download Resume</span>
                  </div>
                </Button>

                <RWebShare
                  data={{
                    text: "Check out my professional resume created with SwiftResume AI!",
                    url: `${import.meta.env.VITE_URL}/my-resume/${resumeId}/view`,
                    title: `${(resumeInfo?.firstName || '').trim()} ${(resumeInfo?.lastName || '').trim()} - Resume`,
                  }}
                >
                  <Button variant="outline" className='w-full sm:w-auto px-8 py-6 text-base font-semibold border-2 text-black transition-all duration-300 rounded-xl group'>
                    <div className="flex items-center gap-3">
                      <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>Share Link</span>
                    </div>
                  </Button>
                </RWebShare>
              </div>
            </div>

            {/* Font Size Control */}
            <div className='px-8 py-6 border-b border-gray-100 bg-gray-50'>
              <h3 className='text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                <Type className='w-4 h-4 text-purple-600' />
                Adjust Font Size (for single-page fit)
              </h3>
              <div className='flex items-center gap-4'>
                <span className='text-sm text-gray-600 min-w-[60px]'>Smaller</span>
                <input
                  type="range"
                  min="70"
                  max="100"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className='flex-1 h-2 bg-gradient-to-r from-purple-200 to-blue-200 rounded-lg appearance-none cursor-pointer slider'
                />
                <span className='text-sm text-gray-600 min-w-[60px]'>Larger</span>
                <div className='min-w-[60px] text-center'>
                  <span className='text-sm font-semibold text-purple-700'>{fontSize}%</span>
                </div>
              </div>
              <p className='text-xs text-gray-500 mt-2'>Reduce font size if your resume spans multiple pages</p>
            </div>

            {/* Quick Tips Section */}
            <div className='p-8 bg-gradient-to-br from-gray-50 to-blue-50'>
              <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2'>
                <FileCheck className='w-5 h-5 text-blue-600' />
                Next Steps
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                  <div className='flex items-start gap-3'>
                    <div className='w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <CheckCircle2 className='w-5 h-5 text-green-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 mb-1'>Review Content</h4>
                      <p className='text-sm text-gray-600'>Double-check all information before sharing</p>
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                  <div className='flex items-start gap-3'>
                    <div className='w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <Download className='w-5 h-5 text-blue-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 mb-1'>Download PDF</h4>
                      <p className='text-sm text-gray-600'>Save as PDF for easy sharing</p>
                    </div>
                  </div>
                </div>

                <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
                  <div className='flex items-start gap-3'>
                    <div className='w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0'>
                      <Share2 className='w-5 h-5 text-purple-600' />
                    </div>
                    <div>
                      <h4 className='font-semibold text-gray-900 mb-1'>Share Online</h4>
                      <p className='text-sm text-gray-600'>Send your unique link to recruiters</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Preview - Unchanged */}
      <div id='print-area' className='bg-gray-100 py-10' style={{ fontSize: `${fontSize}%` }}>
        <div className='screen-zoom-wrapper'>
          <div
            className='screen-zoom-target'
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              width: 'min(900px, 100%)',
              margin: '0 auto'
            }}
          >
            <ResumePreview />
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default View