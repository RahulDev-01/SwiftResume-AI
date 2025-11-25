import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './auth/SignIn.jsx'
import SignUp from './auth/SignUp.jsx'
import { Home } from './Pages/Home.jsx'
import Dashboard from './Pages/dashboard/Dashboard.jsx'
import { ClerkProvider, AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import Resume from './Pages/dashboard/resume/[resumeId]/Resume.jsx'
import AITest from './components/AITest.jsx'
import View from './My-resume/[resumeId]/View/View.jsx'


const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/dashboard/resume/:resumeId/edit',
        element: <Resume />
      }
    ]
  },
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/auth/sign-in',
    element: <SignIn />
  },
  {
    path: '/auth/sign-up',
    element: <SignUp />
  },
  {
    path: '/auth/sign-in/sso-callback',
    element: <AuthenticateWithRedirectCallback />
  },
  {
    path: '/auth/sign-up/sso-callback',
    element: <AuthenticateWithRedirectCallback />
  },
  {
    path: '/sso-callback',
    element: <AuthenticateWithRedirectCallback />
  },
  {
    path: '/ai-test',
    element: <AITest />
  },
  {
    path: '/my-resume/:resumeId/view',
    element: <View />
  }
])
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)

