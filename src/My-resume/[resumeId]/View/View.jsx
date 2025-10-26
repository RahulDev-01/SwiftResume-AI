import React, { useEffect, useState } from 'react'
import Header from '../../../components/custom/Header'
import { Button } from "@/components/ui/button";
import ResumePreview from '../../../Pages/dashboard/resume/component/ResumePreview';
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import GlobalApi from '../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { RWebShare } from 'react-web-share';
function View() {
      const [resumeInfo,setResumeInfo] = useState();
      const [zoom, setZoom] = useState(1.5);
    const {resumeId} = useParams()

    useEffect(()=>{
        GetResumeInfo();
    },[])
      const GetResumeInfo =()=>{
        GlobalApi.GetId(resumeId).then(resp=>{
            console.log(resp);
            setResumeInfo(resp.data.data)
            
        })
      }
      const HandleDownload=()=>{
        window.print()
      }



  return (
    <ResumeInfoContext.Provider value={{resumeInfo,setResumeInfo}}>
        <div id='no-print'>
        <Header />
        <div className='my-10 mx-10 md:mx-20  lg:mx-36 '>
            <h2 className='text-center text-2xl font-medium'>Congrats 🎉 Your Ultimate AI Generate Resume Is Ready 📝 </h2>
            <p className='text-center text-gray-400 mt-5'>Now you are ready to download your resume and you can share unique url with your  friends and family  </p>
            <div className='flex items-center justify-end gap-2 px-6 my-5'>
              <Button onClick={HandleDownload}>Download</Button>

             <RWebShare
        data={{
          text: "Hello EveryOne , This is my Resume Click on Url To Check It",
          url: import.meta.env.VITE_URL+"/myresume/"+resumeId+"/view",
          title: resumeId?.firstName+" "+resumeId?.lastName+"Resume"
        }}
        onClick={() => console.log("shared successfully!")}
      >
        <button>Share 🔗</button>
      </RWebShare>
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