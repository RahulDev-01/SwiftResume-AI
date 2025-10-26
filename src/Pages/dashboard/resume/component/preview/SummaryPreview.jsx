import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function SummaryPreview({resumeInfo}) {
  const text = (resumeInfo?.summery || '').trim() || Dummy.summery;
  return (
    <p className='text-sm text-gray-600 break-words whitespace-pre-wrap'>
      {text}
    </p>
  )
}

export default SummaryPreview