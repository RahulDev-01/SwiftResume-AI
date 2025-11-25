import React from 'react'
import { SignUp as ClerkSignUp } from '@clerk/clerk-react'

function SignUp() {
    return (
        <div className='flex justify-center my-30 items-center'>
            <ClerkSignUp
                routing="path"
                path="/auth/sign-up"
                afterSignUpUrl="/dashboard"
                signInUrl="/auth/sign-in"
            />
        </div>
    )
}

export default SignUp
