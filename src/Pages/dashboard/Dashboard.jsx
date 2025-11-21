import React, { useEffect, useState } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import GlobalApi from '../../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';
import { Loader2 } from 'lucide-react';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetResumeList = () => {
    setLoading(true);
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      setResumeList([]);
      setLoading(false);
      return;
    }
    GlobalApi.GetUserResumes(email)
      .then(resp => {
        setResumeList(resp?.data?.data || []);
        setLoading(false);
      })
      .catch(() => {
        setResumeList([]);
        setLoading(false);
      })
  }

  useEffect(() => {
    if (user) GetResumeList();
  }, [user])


  return (
    <div className='min-h-screen p-10 md:px-20 lg:px-32 relative'>
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4 animate-fade-in-up'>
          <div>
            <h2 className='font-bold text-4xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent inline-block' >My Resumes</h2>
            <p className='mt-2 text-muted-foreground text-lg'>Create and manage your AI-powered resumes.</p>
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <Loader2 className='animate-spin h-10 w-10 text-primary' />
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in-up animation-delay-2000'>
            <AddResume />
            {Array.isArray(resumeList) && resumeList.length > 0 && resumeList.map((resume, index) => (
              <ResumeCardItem resume={resume} key={index} refreshData={GetResumeList} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard