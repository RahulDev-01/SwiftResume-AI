import { Download, Eye, MoreVertical, NotebookIcon, Pen, Trash, Loader2, Loader2Icon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GlobalApi from '../../../../service/GlobalApi'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function ResumeCardItem({resume, refreshData}) {
  const resumeId = resume?.documentId || resume?.id || resume?.attributes?.documentId || "";
  // Prefer the resume's Title fields, not the jobTitle
  const cardTitle = (
    (resume?.attributes?.Title ?? resume?.attributes?.title) ||
    (resume?.data?.Title ?? resume?.data?.title) ||
    resume?.Title ||
    resume?.title ||
    "Untitled Resume"
  );
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [removed, setRemoved] = useState(false);
  const onEdit = ()=>{ if(resumeId) navigate(`/dashboard/resume/${resumeId}/edit`)}
  const onView = ()=>{ if(resumeId) window.open(`/my-resume/${resumeId}/view`, '_blank') }
  const onDownload = ()=>{ if(resumeId) window.open(`/my-resume/${resumeId}/view`, '_blank') }
  const handleConfirmDelete = async ()=>{
    if(!resumeId) return;
    try{
      setIsDeleting(true);
      await GlobalApi.DeleteResumeByDocumentId(resumeId);
      setRemoved(true);
      if (typeof refreshData === 'function') {
        await refreshData();
      }
      setDeleteDialogOpen(false);
    }catch(e){
      console.error('Delete failed', e);
      alert('Failed to delete resume');
    } finally {
      setIsDeleting(false);
    }
  }
  if (removed) {
    return null;
  }
  return (
    <div>
      <>
        <Link to={'/dashboard/resume/'+resumeId+"/edit"}>
            <div className='p-14 bg-secondary flex items-center justify-center h-[280px] border-primary rounded-lg hover:scale-105 transition-all  hover:shadow-md hover:shadow-primary cursor-pointer'>
                <NotebookIcon />

            </div>
            <h2 className='text-center my-3'>{cardTitle}</h2>
        </Link>
        <div className='border p-3 flex justify-between items-center  rounded-b-lg shadow-lg' style={{background:resume?.themeColor}}>
          <h2 className='text-sm break-words whitespace-normal'>{cardTitle}</h2>
          
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className='h-4 w-4 cursor-pointer'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='cursor-pointer' onSelect={onEdit} onClick={onEdit}>
                <Pen className='h-4 w-4 mr-2'/> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer' onSelect={onView} onClick={onView}>
                <Eye className='h-4 w-4 mr-2'/> View
              </DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer' onSelect={onDownload} onClick={onDownload}>
                <Download className='h-4 w-4 mr-2'/> Download
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onSelect={(e)=>{ e.preventDefault(); setDeleteDialogOpen(true); }}
                onClick={(e)=>{ e.preventDefault(); setDeleteDialogOpen(true); }}
              >
                <Trash className='h-4 w-4 mr-2'/> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
    <AlertDialog open={deleteDialogOpen} onOpenChange={(open)=>{ if(!isDeleting) setDeleteDialogOpen(open); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete resume?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your resume and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className='bg-red-700 hover:bg-red-800'>
            {isDeleting ? (
              <span className='inline-flex items-center gap-2'>
                <Loader2Icon className='h-4 w-4 animate-spin' />
                Deleting...
              </span>
            ) : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
  )
}

export default ResumeCardItem