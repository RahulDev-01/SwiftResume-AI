import React from 'react'
import { ExternalLink } from 'lucide-react'
import Dummy from '../../../../../Data/Dummy'
import { ensureUrl } from '../../../../../utils/urlHelper';

function ExperiencePreview2({ resumeInfo }) {
    const experiences = (() => {
        const raw = resumeInfo?.experience;
        if (raw === undefined || raw === null) return Dummy.experience;
        const filtered = raw.filter((e) => e?.title?.trim() || e?.companyName?.trim());
        return filtered.length > 0 ? filtered : Dummy.experience;
    })();

    return (
        <div>
            <h2 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2' style={{ borderColor: resumeInfo?.themeColor }}>
                WORK EXPERIENCE
            </h2>
            <div className='relative'>
                {/* Vertical timeline line */}
                {experiences.length > 1 && (
                    <div
                        className='absolute left-[5px] top-3 bottom-3 w-0.5'
                        style={{ backgroundColor: resumeInfo?.themeColor }}
                    ></div>
                )}

                <div className='space-y-5 break-words'>
                    {experiences.map((exp, index) => (
                        <div key={index} className='relative pl-6'>
                            {/* Timeline marker */}
                            <div className='absolute left-0 top-1 w-3 h-3 rounded-full border-2 bg-white' style={{ borderColor: resumeInfo?.themeColor }}></div>

                            <div>
                                <h3 className='font-bold text-base text-gray-800'>{exp?.title}</h3>
                                <div className='flex items-center gap-2 mb-1'>
                                    {exp?.url ? (
                                        <a href={ensureUrl(exp?.url)} style={{ textDecoration: 'underline' }} className='flex items-center gap-2 hover:underline cursor-pointer'>
                                            <span className='font-semibold text-sm flex items-center gap-1' style={{ color: resumeInfo?.themeColor }}>
                                                <img src="/icons/company.png" alt="company" className="w-4 h-4" /> {exp?.companyName}
                                            </span>
                                        </a>
                                    ) : (
                                        <>
                                            <span className='font-semibold text-sm flex items-center gap-1' style={{ color: resumeInfo?.themeColor }}>
                                                <img src="/icons/company.png" alt="company" className="w-4 h-4" /> {exp?.companyName}
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className='text-xs text-gray-500 italic mb-2 flex items-center gap-1'>
                                    <img src="/icons/date.png" alt="date" className="w-4 h-4" />
                                    {exp?.startDate} - {exp?.currentlyWorking ? 'Present' : exp?.endDate}
                                    {(exp?.city || exp?.state) && (
                                        <span className='ml-4'>{exp?.city}{exp?.city && exp?.state ? ', ' : ''}{exp?.state}</span>
                                    )}
                                </div>
                                {exp?.workSummery && (
                                    <div className='text-xs text-gray-700 leading-relaxed'
                                        dangerouslySetInnerHTML={{ __html: exp?.workSummery }} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ExperiencePreview2
