import { useUser } from "@clerk/clerk-react"
import { Navigate, Outlet } from "react-router-dom"
import { Toaster } from "sonner"

function App() {
  const { user, isLoaded, isSignedIn } = useUser()
  if (!isSignedIn && isLoaded) {
    return <Navigate to={'/auth/sign-in'} />
  }
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}

export default App