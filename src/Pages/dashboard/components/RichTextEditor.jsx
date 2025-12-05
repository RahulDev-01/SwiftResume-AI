import { Brain, Loader2Icon } from 'lucide-react';
import React, { useContext, useState } from 'react'
import {
    BtnBold,
    BtnBulletList,
    BtnClearFormatting,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnRedo,
    BtnStrikeThrough,
    BtnStyles,
    BtnUnderline,
    BtnUndo,
    Editor,
    EditorProvider,
    HtmlButton,
    Separator,
    Toolbar,
} from 'react-simple-wysiwyg'
import { Button } from "@/components/ui/button";
import { ResumeInfoContext } from '../../../context/ResumeInfoContext';
import { toast } from 'sonner';
import { sendMessage } from '../../../../service/AIModal';

const PROMPT = 'For the position of {positionTitle}, generate exactly 5-7 ATS-optimized bullet points that score 10/10 for Applicant Tracking Systems. Each bullet point should be keyword-rich, professionally written, and include action verbs with quantifiable results. Return ONLY the bullet points in HTML format using <ul><li> tags with relevant industry keywords and achievements. No introduction, no conclusion, just the ATS-optimized bullet points.'
function RichTextEditor({ onRichTextEditrChange, index, initialValue = '' }) {
    const [value, setValue] = useState(initialValue || '');
    const [aiLoading, setAiLoading] = useState(false);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext) || {};
    const currentTitle = resumeInfo?.experience?.[index]?.title || '';
    // Summary From AI
    const GenerateSummeryFromAI = async () => {
        if (!currentTitle) {
            toast("Please add Position Title first");
            return;
        }

        setAiLoading(true);
        try {
            const prompt = PROMPT.replace('{positionTitle}', currentTitle);

            // Send the computed prompt and get the AI response.
            const resultText = await sendMessage(prompt);

            // Extract only the bullet points and clean the response
            let resp = '';
            if (typeof resultText === 'string') {
                // If it's JSON, try to parse it and get the first relevant text
                try {
                    const parsed = JSON.parse(resultText);
                    if (Array.isArray(parsed)) {
                        resp = parsed[0]?.text || parsed[0]?.summery || '';
                    }
                } catch {
                    // Not JSON, use the string directly
                    resp = resultText;
                }
            } else if (resultText && typeof resultText === 'object') {
                resp = resultText.text || resultText.output_text || '';
            } else {
                resp = String(resultText);
            }

            // Clean the response: remove code markers and clean HTML
            resp = resp
                .replace(/```html/gi, '')
                .replace(/```/g, '')
                .replace(/^\s*<ul>/i, '<ul>') // Remove spaces before opening ul
                .replace(/\s*<\/ul>\s*$/i, '</ul>') // Remove spaces around closing ul
                .trim();

            console.log('Clean response to be set:', resp);
            setValue(resp);
            // Manually trigger the onChange to update parent
            onRichTextEditrChange({ target: { value: resp } });
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error('AI generation error:', error);
            }
            toast.error('Failed to generate content. Please try again.');
        } finally {
            setAiLoading(false);
        }

    }

    return (
        <div>
            <div className='flex justify-between my-2'>
                <label htmlFor="" className='text-lg font-semibold'>Summery</label>
                <Button
                    className='flex gap-2 border-primary text-primary'
                    variant='outline'
                    size='sm'
                    onClick={GenerateSummeryFromAI}
                    disabled={aiLoading || !currentTitle}
                >
                    {aiLoading ?
                        <Loader2Icon className='h-4 w-4 animate-spin' /> :
                        <Brain className='h-4 w-4' />
                    }
                    {aiLoading ? 'Generating...' : 'Generate From AI'}
                </Button>
            </div>

            {/* Hydrate from initialValue when it changes, but don't override user edits if they already typed */}
            {/** This lightweight effect must be above the Editor to ensure initial render uses the latest value */}
            {(() => {
                if ((value === '' || value == null) && (initialValue || '') !== '') {
                    // Set synchronously during render cycle via closure-safe pattern
                    // Note: in strict mode this may run twice, but value equality guards it
                    setTimeout(() => setValue(initialValue), 0);
                }
                return null;
            })()}

            <EditorProvider>
                <Editor
                    value={value}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setValue(newValue);
                        onRichTextEditrChange({ target: { value: newValue } });
                    }}>
                    <Toolbar>
                        {/* <BtnUndo />
            <BtnRedo /> */}
                        {/* <Separator /> */}
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <Separator />
                        <BtnLink />
                        {/* <BtnClearFormatting /> */}
                        {/* <HtmlButton /> */}
                        {/* <Separator /> */}
                        {/* <BtnStyles /> */}
                    </Toolbar>

                </Editor>
            </EditorProvider>
        </div>
    )
}

export default RichTextEditor