import React, { useEffect, useState } from 'react'
import Header from '../../../components/custom/Header'
import { Button } from "@/components/ui/button";
import ResumePreview from '../../../Pages/dashboard/resume/component/ResumePreview';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import GlobalApi from '../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { RWebShare } from '../../../components/shared/RWebShare';
function View() {
  const [resumeInfo, setResumeInfo] = useState();
  const [zoom] = useState(1.5);
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
          return [];
        };

        const normalized = {
          ...attrs,
          education: pickArray(attrs, ['education', 'Education', 'educations', 'Educations']),
          experience: pickArray(attrs, ['experience', 'Experience', 'experiences', 'Experiences']),
          skills: pickArray(attrs, ['skills', 'Skills', 'skill', 'Skill']),
          templateId: attrs.templateId || '1'
        };

        setResumeInfo(normalized);
      })
    }
    GetResumeInfo();
  }, [resumeId])
  const HandleDownload = () => {
    window.print()
  }



  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id='no-print'>
        <Header />
        <div className='my-10 mx-10 md:mx-20 lg:mx-36'>
          <div className='glass-card text-center'>
            <h2 className='text-2xl font-bold text-gray-900'>Congrats 🎉 Your Ultimate AI Generated Resume Is Ready 📝</h2>
            <p className='text-gray-500 mt-4 mb-8'>Now you are ready to download your resume and share your unique URL with friends and family.</p>
            <div className='flex items-center justify-center gap-4'>
              <Button onClick={HandleDownload} className="btn-glass">Download</Button>
              <RWebShare
                data={{
                  text: "Hello! This is my resume. Open this link to view it.",
                  url: `${import.meta.env.VITE_URL}/my-resume/${resumeId}/view`,
                  title: `${(resumeInfo?.firstName || '').trim()} ${(resumeInfo?.lastName || '').trim()} Resume`.trim(),
                }}
              >
                <Button variant="outline" className='btn-glass-outline'>Share 🔗</Button>
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