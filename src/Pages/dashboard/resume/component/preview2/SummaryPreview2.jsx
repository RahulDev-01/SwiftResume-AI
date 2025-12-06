import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function SummaryPreview2({ resumeInfo }) {
    const summary = resumeInfo?.summery && resumeInfo.summery.trim() ? resumeInfo.summery : Dummy.summery;

    return (
        <div>
            <p className='text-sm text-gray-700 leading-relaxed text-justify break-words'>
                {summary}
            </p>
        </div>
    )
}

export default SummaryPreview2
