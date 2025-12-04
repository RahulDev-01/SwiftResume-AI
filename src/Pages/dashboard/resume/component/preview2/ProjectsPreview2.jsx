import React from 'react'
import { ExternalLink } from 'lucide-react'
import Dummy from '../../../../../Data/Dummy'
import { ensureUrl } from '../../../../../utils/urlHelper';

function ProjectsPreview2({ resumeInfo }) {
    const projects = (() => {
        const raw = resumeInfo?.Projects || resumeInfo?.certifications;
        if (raw === undefined || raw === null) return Dummy.certifications; // Fallback to dummy if needed, or create dummy projects
        return raw.filter((c) => c?.title?.trim());
    })();

    if (!projects || projects.length === 0) return null;

    return (
        <div className='my-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2' style={{ borderColor: resumeInfo?.themeColor }}>
                PROJECTS
            </h2>
            <div className='relative'>
                {/* Vertical timeline line */}
                {projects.length > 1 && (
                    <div
                        className='absolute left-[5px] top-3 bottom-3 w-0.5'
                        style={{ backgroundColor: resumeInfo?.themeColor }}
                    ></div>
                )}

                <div className='space-y-5 break-words'>
                    {projects.map((proj, index) => (
                        <div key={index} className='relative pl-6'>
                            {/* Timeline marker */}
                            <div className='absolute left-0 top-1 w-3 h-3 rounded-full border-2 bg-white' style={{ borderColor: resumeInfo?.themeColor }}></div>

                            <div>
                                <h3 className='font-bold text-base text-gray-800'>{proj?.title}</h3>
                                <div className='flex items-center gap-2 mb-1'>
                                    {proj?.url ? (
                                        <a href={ensureUrl(proj?.url)} target="_blank" rel="noreferrer" className='flex items-center gap-2 hover:underline cursor-pointer'>
                                            <span className='font-semibold text-sm flex items-center gap-1' style={{ color: resumeInfo?.themeColor }}>
                                                <ExternalLink className='w-4 h-4' style={{ color: resumeInfo?.themeColor }} />
                                                {proj?.linkDisplay || proj?.url}
                                            </span>
                                        </a>
                                    ) : (
                                        <span className='font-semibold text-sm flex items-center gap-1' style={{ color: resumeInfo?.themeColor }}>
                                            <ExternalLink className='w-4 h-4' style={{ color: resumeInfo?.themeColor }} />
                                            {proj?.linkDisplay}
                                        </span>
                                    )}
                                </div>
                                {proj?.description && (
                                    <p className='text-sm text-gray-600 whitespace-pre-line leading-relaxed'>
                                        {proj?.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProjectsPreview2
