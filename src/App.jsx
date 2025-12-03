import { useUser } from "@clerk/clerk-react"
import { Navigate, Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import { useEffect } from "react"
import GlobalApi from "../service/GlobalApi"

function App() {
  const { user, isLoaded, isSignedIn } = useUser()

  // Wake up backend on initial load
  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        await GlobalApi.Ping();
        console.log("Backend pinged successfully");
      } catch (error) {
        console.error("Backend ping failed", error);
      }
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