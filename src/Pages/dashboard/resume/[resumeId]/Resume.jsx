import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function Resume() {

    const params = useParams();
    useEffect(()=>{
        console.log(params);
        
    },[])
  return (
    <div>Resume</div>
    
  )
}

export default Resume