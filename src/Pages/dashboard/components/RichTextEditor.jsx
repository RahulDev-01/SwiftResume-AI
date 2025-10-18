import React from 'react'
import { useState } from 'react'
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

function RichTextEditor({onRichTextEditrChange}) {
    const [value,setValue] = useState();
  return (
    <div>
        <EditorProvider>
            <Editor value={value} onChange={(e)=>{
                setValue(e.target.value);
                onRichTextEditrChange(e)
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