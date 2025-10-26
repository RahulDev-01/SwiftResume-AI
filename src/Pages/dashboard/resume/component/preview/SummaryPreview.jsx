import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function SummaryPreview({resumeInfo}) {
  const text = (resumeInfo?.summery || '').trim() || Dummy.summery;
  return (
    <p className='text-sm text-gray-600 break-words max-h-32 overflow-y-auto pr-1'>
      {text}
    </p>
  )
}

export default SummaryPreview