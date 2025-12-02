import React from 'react'
import { ExternalLink } from 'lucide-react'
import Dummy from '../../../../../Data/Dummy'

function CertificationsPreview2({ resumeInfo }) {
    const certifications = (() => {
        const raw = resumeInfo?.certifications;
        if (raw === undefined || raw === null) return Dummy.certifications;
        return raw.filter((c) => c?.title?.trim());
    })();

    if (!certifications || certifications.length === 0) return null;

    return (
        <div className='my-6'>
            <h2 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2' style={{ borderColor: resumeInfo?.themeColor }}>
                TRAINING AND CERTIFICATIONS
            </h2>
            <div className='relative'>
                {/* Vertical timeline line */}
                {certifications.length > 1 && (
                    <div
                        className='absolute left-[5px] top-3 bottom-3 w-0.5'
                        style={{ backgroundColor: resumeInfo?.themeColor }}
                    ></div>
                )}

                <div className='space-y-5 break-words'>
                    {certifications.map((cert, index) => (
                        <div key={index} className='relative pl-6'>
                            {/* Timeline marker */}
                            <div className='absolute left-0 top-1 w-3 h-3 rounded-full border-2 bg-white' style={{ borderColor: resumeInfo?.themeColor }}></div>

                            <div>
                                <h3 className='font-bold text-base text-gray-800'>{cert?.title}</h3>
                                <div className='flex items-center gap-2 mb-1'>
                                    {cert?.url ? (
                                        <a href={cert?.url} target="_blank" rel="noreferrer" className='flex items-center gap-2 hover:underline cursor-pointer'>
                                            <span className='font-semibold text-sm' style={{ color: resumeInfo?.themeColor }}>
                                                {cert?.issuer}
                                            </span>
                                            <ExternalLink className='w-3 h-3' style={{ color: resumeInfo?.themeColor }} />
                                        </a>
                                    ) : (
                                        <>
                                            <span className='font-semibold text-sm' style={{ color: resumeInfo?.themeColor }}>
                                                {cert?.issuer}
                                            </span>
                                            {cert?.url && <ExternalLink className='w-3 h-3' style={{ color: resumeInfo?.themeColor }} />}
                                        </>
                                    )}
                                </div>
                                {cert?.date && <div className='text-xs text-gray-500 italic mb-2'>{cert?.date}</div>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CertificationsPreview2
