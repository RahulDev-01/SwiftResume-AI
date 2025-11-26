import React from 'react'
import { ExternalLink } from 'lucide-react'
import Dummy from '../../../../../Data/Dummy'

function CertificationsPreview2({ resumeInfo }) {
    const certifications = (() => {
        const raw = Array.isArray(resumeInfo?.certifications) ? resumeInfo.certifications : [];
        const meaningful = raw.filter((c) => c?.title?.trim());
        return meaningful.length ? meaningful : [];
    })();

    if (certifications.length === 0) return null;

    return (
        <div className='mb-6'>
            <h2 className='text-lg font-bold text-gray-800 mb-3 pb-2 border-b-2' style={{ borderColor: resumeInfo?.themeColor }}>
                TRAINING AND CERTIFICATIONS
            </h2>
            <div className='space-y-3'>
                {certifications.map((cert, index) => (
                    <div key={index}>
                        <div className='flex items-start gap-1'>
                            <h3 className='text-sm font-semibold text-gray-800 flex-1'>{cert?.title}</h3>
                            {cert?.url && <ExternalLink className='w-3 h-3 mt-0.5' style={{ color: resumeInfo?.themeColor }} />}
                        </div>
                        <p className='text-xs text-gray-600'>{cert?.issuer}</p>
                        {cert?.date && <p className='text-xs text-gray-500 italic'>{cert?.date}</p>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CertificationsPreview2
