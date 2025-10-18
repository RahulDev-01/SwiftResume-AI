import React from 'react'
import { useState } from 'react'
import { Editor, EditorProvider } from 'react-simple-wysiwyg'

function RichTextEditor() {
    const [value,setValue] = useState();
  return (
    <div>
        <EditorProvider>
            <Editor value={value} onChange={(e)=>{
                setValue(e.target.value)
            }}>

            </Editor>
        </EditorProvider>
    </div>
  )
}

export default RichTextEditor