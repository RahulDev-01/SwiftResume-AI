import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function SummaryPreview2({ resumeInfo }) {
    const summary = resumeInfo?.summery != null ? resumeInfo.summery : Dummy.summery;

    return (
        <div className='mb-6'>
            <p className='text-sm text-gray-700 leading-relaxed text-justify'>
                {summary}
            </p>
        </div>
    )
}

export default SummaryPreview2
