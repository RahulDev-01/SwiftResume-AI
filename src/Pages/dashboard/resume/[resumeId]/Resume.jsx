import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FormSection from '../component/FormSection';
import ResumePreview from '../component/ResumePreview';
import ResumeSidebar from '../component/ResumeSidebar';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import Dummy from '../../../../Data/Dummy';
import GlobalApi from '../../../../../service/GlobalApi';
import { toast } from 'sonner';

function Resume() {

  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState()
  const [activeSection, setActiveSection] = useState(1);

  useEffect(() => {
    const GetResumeInfo = () => {
      GlobalApi.GetId(resumeId).then(resp => {
        const payload = resp?.data?.data;
        // Strapi v4: payload = { id, attributes: { ... } }
        // Strapi v5 (documentId direct): attributes may already be at data level
        const attrs = payload?.attributes || payload || {};

        // Normalize keys to what the preview expects (lowercase arrays)
        const pickArray = (obj, keys) => {
          // Try direct arrays by key
          for (const k of keys) {
            if (Array.isArray(obj?.[k])) return obj[k];
          }
          // Try Strapi relation/component arrays under key.data
          for (const k of keys) {
            const rel = obj?.[k]?.data;
            if (Array.isArray(rel)) {
              // Unwrap attributes if present per item
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

        console.log('Normalized resume info for preview:', {
          keys: Object.keys(normalized),
          educationCount: normalized.education?.length,
          experienceCount: normalized.experience?.length,
          skillsCount: normalized.skills?.length,
        });

        setResumeInfo(normalized)
      })
    }
    GetResumeInfo()
  }, [resumeId])

  // Check if Template 2 is selected
  const isTemplate2 = resumeInfo?.templateId === '2' || resumeInfo?.templateId === 2;

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const element = previewRef.current;
      if (!element) {
        toast.error('Preview not found. Please try again.');
        return;
      }

      const resumeTitle = `${(resumeInfo?.firstName || '').trim()}_${(resumeInfo?.lastName || '').trim()}_Resume`.trim() || 'Resume';

      await generatePdf(element, resumeTitle);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Top Bar with Template Selection */}
        <div className='sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm'>
          <div className='mx-auto max-w-7xl px-6 py-4 flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent'>
                Resume Builder
              </h1>
              <p className='text-sm text-gray-500 mt-0.5'>Create your professional resume</p>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-3'>
                <label className='text-sm font-semibold text-gray-700'>Template:</label>
                <select
                  className='px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all cursor-pointer hover:border-purple-400 text-sm'
                  value={resumeInfo?.templateId || '1'}
                  onChange={(e) => {
                    const newTemplateId = e.target.value;
                    setResumeInfo({ ...resumeInfo, templateId: newTemplateId });
                    // Save to backend
                    GlobalApi.UpdateResumeDetail(resumeId, { data: { templateId: newTemplateId } });
                    toast.success(`Switched to Template ${newTemplateId}`);
                  }}
                >
                  <option value="1">Template 1</option>
                  <option value="2">Template 2</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className='flex h-[calc(100vh-80px)]'>
          {/* Sidebar */}
          <div className='w-80 flex-shrink-0 shadow-lg'>
            <ResumeSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              onDownload={handleDownloadPdf}
              isTemplate2={isTemplate2}
            />
          </div>

          {/* Content Area */}
          <div className='flex-1 overflow-y-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 p-8'>
              {/* Form Section */}
              <div>
                <FormSection
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                />
              </div>

              {/* Preview Section */}
              <div className='lg:sticky lg:top-8 h-fit'>
                <div className='relative'>
                  {isGeneratingPdf && (
                    <div className='absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg'>
                      <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto'></div>
                        <p className='mt-4 text-sm font-medium text-gray-700'>Generating PDF...</p>
                      </div>
                    </div>
                  )}
                  <div ref={previewRef}>
                    <ResumePreview enableEditMode={true} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default Resume