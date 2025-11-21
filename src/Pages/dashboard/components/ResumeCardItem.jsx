import { Download, Eye, MoreVertical, Notebook, Pen, Trash, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GlobalApi from '../../../../service/GlobalApi'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

function ResumeCardItem({ resume, refreshData }) {
  const resumeId = resume?.documentId || resume?.id || resume?.attributes?.documentId || "";
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

  const onEdit = () => { if (resumeId) navigate(`/dashboard/resume/${resumeId}/edit`) }
  const onView = () => { if (resumeId) window.open(`/my-resume/${resumeId}/view`, '_blank') }
  const onDownload = () => { if (resumeId) window.open(`/my-resume/${resumeId}/view`, '_blank') }

  const handleConfirmDelete = async () => {
    if (!resumeId) return;
    try {
      setIsDeleting(true);
      await GlobalApi.DeleteResumeByDocumentId(resumeId);
      setRemoved(true);
      if (typeof refreshData === 'function') {
        await refreshData();
      }
      setDeleteDialogOpen(false);
    } catch (e) {
      console.error('Delete failed', e);
    } finally {
      setIsDeleting(false);
    }
  }

  if (removed) return null;

  return (
    <div className='group relative'>
      <Link to={'/dashboard/resume/' + resumeId + "/edit"}>
        <div
          className='p-14 bg-gradient-to-b from-secondary/50 to-secondary flex items-center justify-center h-[280px] rounded-t-xl border-t border-x border-primary/10 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer overflow-hidden relative'
          style={{
            borderColor: resume?.themeColor,
          }}
        >
          {/* Decorative elements to make it look like a resume */}
          <div className='absolute top-0 left-0 w-full h-2 bg-primary/20' style={{ background: resume?.themeColor }}></div>
          <div className='flex flex-col items-center justify-center opacity-80 group-hover:scale-101 transition-transform duration-300'>
            <Notebook className='w-16 h-16 text-primary' style={{ color: resume?.themeColor }} />
          </div>

          {/* Hover overlay */}
          <div className='absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
            <div className='bg-background/90 px-4 py-2 rounded-full text-sm font-medium shadow-sm transform translate-y-4 group-hover:translate-y-0 transition-transform'>
              Edit Resume
            </div>
          </div>
        </div>
      </Link>

      <div
        className='border p-4 flex justify-between items-center rounded-b-xl shadow-sm bg-white dark:bg-card z-10 relative'
        style={{ borderTopColor: resume?.themeColor }}
      >
        <div className='flex flex-col'>
          <h2 className='font-semibold text-sm truncate max-w-[180px]'>{cardTitle}</h2>
          <p className='text-xs text-muted-foreground'>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className='outline-none'>
            <div className='p-2 hover:bg-secondary rounded-full transition-colors'>
              <MoreVertical className='h-4 w-4 cursor-pointer text-muted-foreground' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className='cursor-pointer' onSelect={onEdit}>
              <Pen className='h-4 w-4 mr-2' /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer text-blue-500' onSelect={onView}>
              <Eye className='h-4 w-4 mr-2 text-blue-500' /> View
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer' onSelect={onDownload}>
              <Download className='h-4 w-4 mr-2' /> Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='cursor-pointer text-destructive focus:text-destructive'
              onSelect={(e) => { e.preventDefault(); setDeleteDialogOpen(true); }}
            >
              <Trash className='h-4 w-4 mr-2 text-red-500' /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => { if (!isDeleting) setDeleteDialogOpen(open); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete resume?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your resume and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className='bg-destructive hover:bg-destructive/90'>
              {isDeleting ? (
                <span className='inline-flex items-center gap-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
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