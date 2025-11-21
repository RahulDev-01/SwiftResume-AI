import { Loader2, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import GlobalApi from '../../../../service/GlobalApi';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

function AddResume() {
  const [openDailog, setOpenDailog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate()

  const onCreate = async () => {
    if (!resumeTitle?.trim()) return;
    try {
      setLoading(true);
      const uuid = uuidv4();
      const payload = {
        data: {
          title: resumeTitle.trim(),
          resumeId: uuid,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName,
          themeColor: '#FFA500'
        },
      };
      const resp = await GlobalApi.CreateNewResume(payload);
      if (resp?.data?.data?.documentId) {
        navigation("/dashboard/resume/" + resp.data.data.documentId + "/edit");
      }
    } catch (e) {
      console.error('Create resume failed', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div
        className='h-[320px] bg-white dark:bg-secondary/20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer group hover:shadow-xl'
        onClick={() => setOpenDailog(true)}
      >
        <div className='h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform group-hover:bg-primary/20'>
          <Plus className='h-8 w-8 text-primary' />
        </div>
        <h3 className='font-semibold text-lg text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors'>Create New Resume</h3>
        <p className='text-sm text-gray-400 mt-1 font-medium'>Start from scratch</p>
      </div>

      <Dialog open={openDailog} onOpenChange={(open) => { if (!loading) setOpenDailog(open); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Resume</DialogTitle>
            <DialogDescription>
              Give your resume a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-6 py-4'>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Resume Title</label>
              <Input
                className="h-11"
                placeholder="e.g. Full Stack Developer, Product Manager..."
                onChange={(e) => setResumeTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && resumeTitle && onCreate()}
              />
            </div>
            <div className='flex justify-end gap-3'>
              <Button variant="outline" onClick={() => { setOpenDailog(false) }} disabled={loading}>Cancel</Button>
              <Button onClick={onCreate} disabled={!resumeTitle || loading} className="px-8">
                {loading ? <Loader2 className='animate-spin h-4 w-4 mr-2' /> : null}
                Create
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddResume
