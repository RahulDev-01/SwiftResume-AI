import React from 'react'
import Dummy from '../../../../../Data/Dummy'

function SkillPreview({ resumeInfo }) {
  return (
    <div className='my-6 relative z-50'>
      <h2 className='text-center font-bold text-lg mb-2' style={{ color: resumeInfo?.themeColor }}>Skills</h2>
      <hr className='border-[2px]' style={{ borderColor: resumeInfo?.themeColor }} />
      <div className='grid grid-cols-1 gap-3 my-4 w-full max-h-[150px] overflow-y-auto pr-2'>
        {(() => {
          const raw = Array.isArray(resumeInfo?.skills) ? resumeInfo.skills : [];
          const meaningful = raw.filter((s) => (s?.name?.trim() || Number(s?.rating) > 0));
          const list = meaningful.length ? meaningful : (Array.isArray(Dummy?.skills) ? Dummy.skills : []);
          return list;
        })().map((skill, index) => (
          <div key={index} className='grid grid-cols-[1fr_auto] items-center gap-3 min-w-0'>
            <div className='min-w-0'>
              <h2 className='text-xs break-words whitespace-normal truncate'>{skill?.name}</h2>
            </div>
            <div className='h-2 bg-gray-200 w-[100px] sm:w-[120px] md:w-[140px] flex-none shrink-0 overflow-hidden rounded'>
              {(() => {
                const raw = Number(skill?.rating);
                const pct = Number.isFinite(raw)
                  ? (raw <= 5 ? raw * 20 : Math.max(0, Math.min(100, raw)))
                  : 0;
                return (
                  <div className='h-2 rounded' style={{ backgroundColor: resumeInfo?.themeColor, width: pct + "%" }}></div>
                );
              })()}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default SkillPreview