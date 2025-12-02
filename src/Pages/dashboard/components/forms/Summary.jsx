import React, { useContext, useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import GlobalApi from '../../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { Brain, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { sendMessage, listAvailableModels } from '../../../../../service/AIModal';

const Summary = forwardRef(({ enableNext }, ref) => {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState('');
  const prompt = 'Given the job title "{jobTitle}", generate EXACTLY 3 ATS-optimized resume summary suggestions that score 10/10 for Applicant Tracking Systems. Each summary must be keyword-rich, professionally written, and tailored for maximum ATS compatibility. Return a JSON array where each item has: "ExperienceLevel" (one of "Fresher", "Mid Level", "Experienced") and "summery" (a 4-5 line professional summary with relevant industry keywords and quantifiable achievements). Return ONLY valid JSON (no markdown, no code fences, no extra text). Order the items as: Fresher, Mid Level, Experienced.'

  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const params = useParams();

  const [aiGeneratedSummeryList, setAiGeneratedSummeryList] = useState()
  // Hydrate local state from backend context once available (do not override user typing)
  useEffect(() => {
    if ((summery === undefined || summery === null || summery === '') && (resumeInfo?.summery ?? '') !== '') {
      setSummery(resumeInfo.summery);
    }
  }, [resumeInfo?.summery, summery]);
  useEffect(() => {
    if (summery) {
      setResumeInfo(prevResumeInfo => ({
        ...prevResumeInfo,
        summery: summery,
      }));
    }
  }, [summery, setResumeInfo]);

  const GenerateSummeryFromAi = async () => {
    setAiLoading(true);
    const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle || '');
    try {
      const resultText = await sendMessage(PROMPT);
      console.log(resultText);
      if (!resultText) {
        throw new Error('Empty AI response');
      }
      // Clean potential Markdown code fences and parse JSON
      const cleaned = String(resultText)
        .trim()
        .replace(/^```(?:json)?\s*/i, '')
        .replace(/```$/i, '');
      const parsed = JSON.parse(cleaned);
      const list = Array.isArray(parsed) ? parsed : [parsed];
      // Normalize keys so the UI can render consistently
      const normalized = list.map((it) => {
        const level = it?.Level ?? it?.ExperienceLevel ?? it?.experienceLevel ?? it?.level ?? '';
        const text = it?.summery ?? it?.summary ?? it?.Summary ?? it?.text ?? '';
        return {
          ExperienceLevel: typeof level === 'string' ? level.trim() : level,
          summery: typeof text === 'string' ? text.trim() : text,
        };
      });
      setAiGeneratedSummeryList(normalized);
    } catch (e) {
      console.error(e);
      const msg = e?.message || 'Failed to generate summary';
      toast(`Summary: ${msg} ❌`);
    } finally {
      setAiLoading(false);
    }
  }

  const handleSummaryChange = (e) => {
    const next = e.target.value || '';
    setSummery(next);
  };

  const onSave = (e) => {
    e.preventDefault();
    setSaving(true)
    const data = { data: { summery: summery } };
    GlobalApi.UpdateResumeDetail(params?.resumeId, data)
      .then(resp => {
        console.log(resp);
        enableNext(true)
        toast("Summary: Details updated ✅")
      })
      .catch(err => {
        const status = err?.response?.status;
        const msg = err?.message || 'Failed to update details';
        console.error('Save error:', status, err);
        toast(`Summary: Save failed${status ? ` (${status})` : ''}: ${msg} ❌`);
      })
      .finally(() => setSaving(false));
  }

  // Expose handleSave method to parent component
  useImperativeHandle(ref, () => ({
    handleSave: async () => {
      return new Promise((resolve, reject) => {
        setSaving(true);
        const data = { data: { summery: summery } };
        GlobalApi.UpdateResumeDetail(params?.resumeId, data)
          .then(resp => {
            console.log(resp);
            enableNext(true);
            toast("Summary: Details updated ✅");
            resolve(resp);
          })
          .catch(err => {
            const status = err?.response?.status;
            const msg = err?.message || 'Failed to update details';
            console.error('Save error:', status, err);
            toast(`Summary: Save failed${status ? ` (${status})` : ''}: ${msg} ❌`);
            reject(err);
          })
          .finally(() => setSaving(false));
      });
    }
  }));


  return (
    <div>
      <div className='glass-card mt-5'>
        <h2 className='section-title'>Summary</h2>
        <p className='section-subtitle'>Add Summary for your job title</p>

        <form className='mt-7' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label className='text-sm font-medium text-gray-700'>Add Summary</label>
            <div className='flex gap-2'>

              <Button className='btn-glass-outline flex gap-2' variant='outline' onClick={() => GenerateSummeryFromAi()} size='sm' type='button' disabled={aiLoading}>
                {aiLoading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : <Brain className='h-4 w-4' />}
                {aiLoading ? 'Generating...' : 'Generate from AI'}
              </Button>
            </div>
          </div>
          <Textarea className='mt-5 min-h-[150px] input-glass' value={summery || ''} onChange={handleSummaryChange} required placeholder="Write a professional summary..." />
          <div className='mt-6 flex justify-end'>
            <Button type="submit" disabled={saving} className="btn-glass">
              {saving ? <Loader2Icon className='animate-spin' /> : "Save"}</Button>
          </div>
        </form>
      </div>
      {aiGeneratedSummeryList && (
        <div className='mt-8'>
          <h2 className='section-title text-lg'>Suggestions</h2>
          <div className='grid grid-cols-1 gap-4 mt-3'>
            {[...aiGeneratedSummeryList]
              .sort((a, b) => {
                const toKey = (v) => String(v?.ExperienceLevel ?? v?.Level ?? '').toLowerCase().trim();
                const order = { 'fresher': 0, 'mid level': 1, 'experienced': 2 };
                return (order[toKey(a)] ?? 99) - (order[toKey(b)] ?? 99);
              })
              .map((item, index) => (
                <div
                  key={index}
                  className='p-5 rounded-xl border border-white/30 bg-white/40 backdrop-blur-sm cursor-pointer hover:bg-white/60 hover:shadow-md transition-all duration-300'
                  role='button'
                  tabIndex={0}
                  onClick={() => {
                    const text = item?.summery ?? item?.summary ?? item?.Summary ?? '';
                    setSummery(text);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      const text = item?.summery ?? item?.summary ?? item?.Summary ?? '';
                      setSummery(text);
                    }
                  }}
                >
                  <h3 className='font-semibold text-gray-800'>
                    Level: {item?.Level ?? item?.ExperienceLevel ?? item?.experienceLevel ?? '—'}
                  </h3>
                  <p className='mt-2 text-gray-600 text-sm leading-relaxed whitespace-pre-line'>
                    {item?.summery ?? item?.summary ?? item?.Summary ?? ''}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

    </div>


  )
});

Summary.displayName = 'Summary';

export default Summary