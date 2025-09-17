import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './auth/SignIn.jsx'
import { Home } from './Pages/Home.jsx'
import Dashboard from './Pages/dashboard/Dashboard.jsx'
import { ClerkProvider } from '@clerk/clerk-react'


const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path :'/dashboard',
        element : <Dashboard />
      }
    ]
  },
      {
        path :'/',
        element : <Home />
      },
  {
    path:'/auth/sign-in',
    element:<SignIn />
  }
])
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <RouterProvider  router={router} />
    </ClerkProvider>
  </StrictMode>,
)
