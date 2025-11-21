import { Loader2, PlusSquare } from 'lucide-react'
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
        className='p-14 py-24 border-2 border-dashed items-center flex justify-center bg-secondary/20 rounded-xl h-[280px] hover:scale-101 transition-all hover:shadow-xl cursor-pointer hover:border-primary group'
        onClick={() => setOpenDailog(true)}
      >
        <div className='flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors'>
          <PlusSquare className='h-10 w-10' />
          <span className='font-medium'>Create New Resume</span>
        </div>
      </div>
      <Dialog open={openDailog} onOpenChange={(open) => { if (!loading) setOpenDailog(open); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Add a title for your new resume
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <Input
              placeholder="Ex. Full Stack Developer Resume"
              onChange={(e) => setResumeTitle(e.target.value)}
            />
            <div className='flex justify-end gap-3'>
              <Button variant="outline" onClick={() => { setOpenDailog(false) }} disabled={loading}>Cancel</Button>
              <Button onClick={onCreate} disabled={!resumeTitle || loading}>
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
