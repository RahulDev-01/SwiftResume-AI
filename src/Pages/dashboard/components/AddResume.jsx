import { Loader2, Loader2Icon, PlusSquareIcon } from 'lucide-react'
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
  DialogTrigger,
} from "@/components/ui/dialog"
import GlobalApi from '../../../../service/GlobalApi';
import { data, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';



function AddResume() {
    const [openDailog, setOpenDailog] = useState(false);
    const [resumeTitle,setResumeTitle] =useState();
    const {user} = useUser();
    const [loading,setLoading] = useState(false);
    const navigation= useNavigate()
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
            alert('Failed to create resume');
        } finally {
            setLoading(false);
        }
    }
  return (
    <div>
        <div className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg  h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dotted' onClick={()=>setOpenDailog(true)}>
            <PlusSquareIcon />
        </div>
        <Dialog open={openDailog} onOpenChange={(open)=>{ if(!loading) setOpenDailog(open); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Resume </DialogTitle>
              <DialogDescription>
               Add a title for your new resume
                <Input className="mt-2"
                 placeholder="Ex. Java Full Stack resume" 
                 onChange ={(e)=>setResumeTitle(e.target.value)}
                
                
                />
              </DialogDescription>
              <div className='flex justify-end gap-5'>
                <Button variant="ghost"
                 onClick={()=>{setOpenDailog(false)}}
                 disabled={loading}
                 >Cancel</Button>
                <Button 
                onClick={onCreate}
                 disabled={!resumeTitle || loading}
                 >
                    {loading? <Loader2Icon className='animate-spin' />:'Create'}</Button>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default AddResume
