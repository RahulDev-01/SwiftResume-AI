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
import { data } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';



function AddResume() {
    const [openDailog, setOpenDailog] = useState(false);
    const [resumeTitle,setResumeTitle] =useState();
    const {user} = useUser();
    const [loading,setLoading] = useState(false)
    const onCreate=()=>{
        setLoading(true)
        const uuid = uuidv4()
        const data ={
            data:{
                title : resumeTitle,
                resumeId :uuid,
                userEmail : user?.primaryEmailAddress?.emailAddress,
                userName :user?.fullName
            }
        }
        GlobalApi.CreateNewResume(data)
        .then(resp=> {
            console.log(resp);
            if(resp){
                setLoading(false)
            }
        
        }
        );
        
    }
  return (
    <div>
        <div className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg  h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dotted' onClick={()=>setOpenDailog(true)}>
            <PlusSquareIcon />
        </div>
        <Dialog open={openDailog}>
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
                 >Cancel</Button>
                <Button 
                onClick={()=>{onCreate()}}
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
