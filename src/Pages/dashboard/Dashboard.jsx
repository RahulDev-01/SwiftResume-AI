import React, { useEffect, useState, useCallback } from 'react'
import AddResume from './components/AddResume'
import { useUser } from '@clerk/clerk-react'
import GlobalApi from '../../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';
import { Loader2 } from 'lucide-react';

// Cache key for localStorage
const CACHE_KEY = 'dashboard_resumes_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function Dashboard() {
  const { user, isLoaded } = useUser();
  const [resumeList, setResumeList] = useState([]);
  const [loading, setLoading] = useState(true);

  const GetResumeList = useCallback(async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
      setResumeList([]);
      setLoading(false);
      return;
    }

    // Check cache first
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp, userEmail } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_DURATION;

        // Use cache if valid and for same user
        if (!isExpired && userEmail === email) {
          setResumeList(data);
          setLoading(false);
          // Still fetch in background to update cache
          fetchAndUpdateCache(email);
          return;
        }
      }
    } catch (e) {
      console.error('Cache read error:', e);
    }

    // No valid cache, fetch data
    setLoading(true);
    await fetchAndUpdateCache(email);
  }, [user]);

  const fetchAndUpdateCache = async (email) => {
    try {
      const resp = await GlobalApi.GetUserResumes(email);
      const data = resp?.data?.data || [];
      setResumeList(data);

      // Update cache
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now(),
          userEmail: email
        }));
      } catch (e) {
        console.error('Cache write error:', e);
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
      setResumeList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      GetResumeList();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [user, isLoaded, GetResumeList])


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