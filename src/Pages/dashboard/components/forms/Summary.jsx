import React, { useContext, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { ResumeInfoContext } from '../../../../context/ResumeInfoContext';
import GlobalApi from '../../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { Brain, Loader2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { sendMessage } from '../../../../../service/AIModal';

function Summary({ enableNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState();
  const prompt = 'Given the job title "{jobTitle}", generate EXACTLY 3 resume summary suggestions as a JSON array. Each array item must be an object with the fields: "ExperienceLevel" (one of "Fresher", "Mid Level", "Experienced") and "summery" (a 4-5 line professional summary tailored to the job title). Return ONLY valid JSON (no markdown, no code fences, no extra text). Order the items as: Fresher, Mid Level, Experienced.'

  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const params = useParams();

  const [aiGeneratedSummeryList, setAiGeneratedSummeryList] = useState()
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
      toast(msg);
    } finally {
      setAiLoading(false);
    }
  }

  const onSave = (e) => {
    e.preventDefault();
    setSaving(true)
    const data = { data: { summery: summery } };
    GlobalApi.UpdateResumeDatail(params?.resumeId, data)
      .then(resp => {
        console.log(resp);
        enableNext(true)
        toast("Details Updated")
      })
      .catch(err => {
        const status = err?.response?.status;
        const msg = err?.message || 'Failed to update details';
        console.error('Save error:', status, err);
        toast(`Save failed${status ? ` (${status})` : ''}: ${msg}`);
      })
      .finally(() => setSaving(false));
  }


  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-1'>
        <h2 className='font-bold text-lg'>Summery</h2>
        <p>Add Summery for your job title </p>

        <form className='mt-7' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label htmlFor="">Add Summery</label>
            <Button className='border-[#2987CB] text-[#2987CB] font-semibold flex gap-2' variant='outline' onClick={() => GenerateSummeryFromAi()} size='sm' type='button' disabled={aiLoading }>
              {aiLoading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : <Brain className='h-4 w-4' />}
              {aiLoading ? 'Generating...' : 'Generate from AI'}
            </Button>
          </div>
          <Textarea className='mt-5' value={summery || ''} onChange={(e) => setSummery(e.target.value)} required />
          <div className='mt-2 flex justify-end'>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2Icon className='animate-spin' /> : "Save"}</Button>
          </div>
        </form>
      </div>
      {aiGeneratedSummeryList && (
        <div>
          <h2 className='font-bold text-lg'>Suggestions</h2>
          {[...aiGeneratedSummeryList]
            .sort((a, b) => {
              const toKey = (v) => String(v?.ExperienceLevel ?? v?.Level ?? '').toLowerCase().trim();
              const order = { 'fresher': 0, 'mid level': 1, 'experienced': 2 };
              return (order[toKey(a)] ?? 99) - (order[toKey(b)] ?? 99);
            })
            .map((item, index) => (
            <div
              key={index}
              className='my-4 p-5 rounded-xl border shadow-md bg-white cursor-pointer hover:shadow-lg hover:border-[#7C3AED] transition'
              role='button'
              tabIndex={0}
              onClick={() => setSummery(item?.summery ?? item?.summary ?? item?.Summary ?? '')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSummery(item?.summery ?? item?.summary ?? item?.Summary ?? ''); } }}
            >
              <h3 className='font-semibold text-[#7C3AED]'>
                Level: {item?.Level ?? item?.ExperienceLevel ?? item?.experienceLevel ?? '—'}
              </h3>
              <p className='mt-2 text-gray-700 whitespace-pre-line'>
                {item?.summery ?? item?.summary ?? item?.Summary ?? ''}
              </p>
            </div>
          ))}
        </div>
      )}
      
    </div>


  )
}

export default Summary