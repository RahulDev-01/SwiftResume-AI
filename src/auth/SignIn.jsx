import React from 'react'
import { SignIn as ClerkSignIn } from '@clerk/clerk-react'

function SignIn() {
  return (
    <div className='flex justify-center my-30 items-center'>
    <ClerkSignIn />
    </div>
  )
}

export default SignIn
