import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FormSection from '../component/FormSection';
import ResumePreview from '../component/ResumePreview';
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import Dummy from '../../../../Data/Dummy';
import GlobalApi from '../../../../../service/GlobalApi';

function Resume() {

  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState()
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

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div>
        {/* Template Selection */}
        {/* Template Selection */}
        <div className='my-10 mx-10 md:mx-20 lg:mx-36 flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-sm'>
          <div className='flex items-center gap-3'>
            <span className='text-base font-semibold text-gray-700'>Current Template:</span>
            <span className='px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-all' style={{
              backgroundColor: resumeInfo?.themeColor || '#047857',
              color: 'white'
            }}>
              Template {resumeInfo?.templateId || '1'}
            </span>
          </div>
          <div className='flex items-center gap-3'>
            <label className='text-base font-semibold text-gray-700'>Select Template:</label>
            <select
              className='p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all cursor-pointer hover:border-purple-400'
              value={resumeInfo?.templateId || '1'}
              onChange={(e) => {
                const newTemplateId = e.target.value;
                setResumeInfo({ ...resumeInfo, templateId: newTemplateId });
                // Save to backend
                GlobalApi.UpdateResumeDetail(resumeId, { data: { templateId: newTemplateId } });
              }}
            >
              <option value="1">Template 1</option>
              <option value="2">Template 2</option>
            </select>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-10 md:grid-cols-2 p-10 g-10'>
          {/* Form Section */}
          <FormSection />
          {/* Preview Section */}
          <div className='md:sticky md:top-20 h-fit'>
            <ResumePreview enableEditMode={true} />
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  )
}

export default Resume