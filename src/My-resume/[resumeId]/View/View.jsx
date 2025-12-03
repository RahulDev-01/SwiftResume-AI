import React, { useEffect, useState } from 'react'
import Header from '../../../components/custom/Header'
import { Button } from "@/components/ui/button";
import ResumePreview from '../../../Pages/dashboard/resume/component/ResumePreview';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import GlobalApi from '../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { RWebShare } from '../../../components/shared/RWebShare';
import Dummy from '../../../Data/Dummy';
import { toast } from 'sonner';
import html2pdf from 'html2pdf.js';

function View() {
  const [resumeInfo, setResumeInfo] = useState();
  const [zoom] = useState(1.5);
  const [isDownloading, setIsDownloading] = useState(false);
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

  const HandleDownload = async () => {
    setIsDownloading(true);
    try {
      toast.info('Generating PDF... Please wait.');

      const element = document.getElementById('print-area');
      if (!element) {
        toast.error('Print area not found. Please try again.');
        setIsDownloading(false);
        return;
      }

      const resumeTitle = `${(resumeInfo?.firstName || '').trim()}_${(resumeInfo?.lastName || '').trim()}_Resume`.trim() || 'Resume';

      const options = {
        margin: 0,
        filename: `${resumeTitle}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
          letterRendering: true
        },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      };

      await html2pdf().set(options).from(element).save();
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id='no-print' className="min-h-screen bg-gray-50">
        <Header />
        <div className='my-10 mx-auto max-w-3xl px-6'>
          <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center'>
            <div className='mb-6 flex justify-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center'>
                <span className='text-3xl'>🎉</span>
              </div>
            </div>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-3'>
              Your Resume is Ready!
            </h2>
            <p className='text-gray-600 mb-8 max-w-lg mx-auto'>
              Your professional resume has been generated successfully. You can now download it as a PDF or share the unique link with recruiters.
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Button
                onClick={HandleDownload}
                className="w-full sm:w-auto px-8 py-6 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-xl"
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating PDF...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download Resume</span>
                  </div>
                )}
              </Button>

              <RWebShare
                data={{
                  text: "Check out my professional resume created with SwiftResume AI!",
                  url: `${import.meta.env.VITE_URL}/my-resume/${resumeId}/view`,
                  title: `${(resumeInfo?.firstName || '').trim()} ${(resumeInfo?.lastName || '').trim()} - Resume`,
                }}
              >
                <Button variant="outline" className='w-full sm:w-auto px-8 py-6 text-base font-medium border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-all duration-200 rounded-xl'>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span>Share Link</span>
                  </div>
                </Button>
              </RWebShare>
            </div>
          </div>
        </div>
      </div>
      <div id='print-area'>
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