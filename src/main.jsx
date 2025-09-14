import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SignIn from './auth/SignIn.jsx'
import { Home } from './Pages/Home.jsx'
import Dashboard from './Pages/Dashboard.jsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path :'/',
        element : <Home />
      },
      {
        path :'/dashboard',
        element : <Dashboard />
      }
    ]
  },
  {
    path:'/auth/sign-in',
    element:<SignIn />
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider  router={router} />
  </StrictMode>,
)
