import React from 'react'
import { SignIn as ClerkSignIn } from '@clerk/clerk-react'

function SignIn() {
  return (
    <div className='flex justify-center my-30 items-center'>
      <ClerkSignIn
        routing="path"
        path="/auth/sign-in"
        afterSignInUrl="/dashboard"
        signUpUrl="/auth/sign-up"
      />
    </div>
  )
}

export default SignIn
