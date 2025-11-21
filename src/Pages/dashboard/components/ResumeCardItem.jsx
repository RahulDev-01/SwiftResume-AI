import { Download, Eye, MoreVertical, Pen, Trash, Loader2, FileText } from 'lucide-react'
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

  // Randomize a bit of the skeleton look based on title length or id to make them look slightly different? 
  // For now, static skeleton is fine.

  return (
    <div className='group relative hover:-translate-y-2 transition-all duration-300 ease-in-out'>
      <Link to={'/dashboard/resume/' + resumeId + "/edit"}>
        <div
          className='h-[320px] bg-white dark:bg-secondary rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 relative group-hover:shadow-2xl transition-all cursor-pointer'
        >
          {/* Resume Preview Mockup */}
          <div className='h-full w-full p-4 flex flex-col gap-3 opacity-80 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>

            {/* Header Strip */}
            <div
              className='h-24 w-full rounded-t-md shadow-sm flex items-center justify-center mb-2'
              style={{ background: resume?.themeColor || '#666' }}
            >
              <FileText className='text-white/50 h-12 w-12' />
            </div>

            {/* Body Skeleton */}
            <div className='space-y-2 px-2'>
              <div className='h-3 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-full'></div>
              <div className='h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full'></div>
              <div className='h-2 w-5/6 bg-gray-100 dark:bg-gray-800 rounded-full'></div>

              <div className='pt-4 space-y-2'>
                <div className='h-2 w-1/3 bg-gray-200 dark:bg-gray-700 rounded-full'></div>
                <div className='h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full'></div>
                <div className='h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full'></div>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px] cursor-pointer'>
              <button className='bg-white text-black px-6 py-2 rounded-full font-medium transform scale-90 group-hover:scale-[1.02] transition-transform shadow-xl cursor-pointer'>
                Edit Resume
              </button>
            </div>
          </div>
        </div>
      </Link>

      {/* Footer Info */}
      <div className='mt-3 flex justify-between items-start px-1'>
        <div>
          <h2 className='font-bold text-lg text-gray-800 dark:text-white truncate max-w-[200px] leading-tight'>{cardTitle}</h2>
          <p className='text-xs text-gray-400 font-medium mt-1'>Edited {new Date().toLocaleDateString()}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className='outline-none'>
            <div className='p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500'>
              <MoreVertical className='h-5 w-5' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className='cursor-pointer py-2 font-medium' onSelect={onEdit}>
              <Pen className='h-4 w-4 mr-2 text-blue-500' /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer py-2 font-medium' onSelect={onView}>
              <Eye className='h-4 w-4 mr-2 text-green-500' /> View
            </DropdownMenuItem>
            <DropdownMenuItem className='cursor-pointer py-2 font-medium' onSelect={onDownload}>
              <Download className='h-4 w-4 mr-2 text-purple-500' /> Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='cursor-pointer py-2 font-medium text-red-500 focus:text-red-600 focus:bg-red-50'
              onSelect={(e) => { e.preventDefault(); setDeleteDialogOpen(true); }}
            >
              <Trash className='h-4 w-4 mr-2' /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => { if (!isDeleting) setDeleteDialogOpen(open); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your resume "{cardTitle}" and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} disabled={isDeleting} className='bg-red-600 hover:bg-red-700 text-white'>
              {isDeleting ? (
                <span className='inline-flex items-center gap-2'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                  Deleting...
                </span>
              ) : 'Delete Resume'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ResumeCardItem