import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import GlobalApi from '../../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([])

  useEffect(() => {
    const GetResumeList = () => {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) {
        setResumeList([]);
        return;
      }
      GlobalApi.GetUserResumes(email)
        .then(resp => {
          setResumeList(resp?.data?.data || []);
        })
        .catch(() => {
          setResumeList([]);
        })
    }
    user && GetResumeList()
  }, [user])


  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl' >My Resume </h2>
      <p className='mt-2'>Start Creating Resume With AI | for your next Job Role  </p>

      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-10 gap-5 '>
        <AddResume />
        {Array.isArray(resumeList) && resumeList.length > 0 && resumeList.map((resume, index) => (
          <ResumeCardItem resume={resume} key={index} />
        ))}
      </div>

    </div>
  )
}

export default Dashboard