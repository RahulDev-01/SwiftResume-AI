import React from 'react'

function SummaryPreview({resumeInfo}) {
  return (
    <p className='text-sm text-gray-600'>{resumeInfo?.summery}</p>
  )
}

export default SummaryPreview