import { useUser } from "@clerk/clerk-react"
import { Navigate, Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import { useEffect } from "react"
import GlobalApi from "../service/GlobalApi"

function App() {
  const { user, isLoaded, isSignedIn } = useUser()

  // Wake up backend on initial load (non-blocking)
  useEffect(() => {
    const wakeUpBackend = async () => {
      // Don't await - let it run in background
      GlobalApi.Ping().catch(() => {
        // Silently fail - ping is just to warm up Render
      });
    };
    wakeUpBackend();
  }, []);

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