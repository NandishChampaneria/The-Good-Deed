import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import HomePage from "./pages/home/HomePage"
import Navbar from "./components/common/Navbar";
import Discover from "./pages/home/Discover";
import EventPage from "./pages/event/EventPage";
import CreateEvent from "./pages/home/CreateEvent";
import ProfilePage from "./pages/profile/ProfilePage";

import { Toaster } from "react-hot-toast"
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import EditProfileModal from "./pages/profile/EditProfileModal";
import Home from "./pages/home/Home";
import ManageEvent from "./pages/event/ManageEvent";

function App() {
  const{ data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if(data.error) return null;
        if(!res.ok) {
          throw new Error(data.error || "Failed to fetch user data");
        }
        console.log("authuser is here: ", data);
        return data;
      } catch(error) {
        throw new Error(error)
      }
    },
    retry: false
  });

  if(isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size='lg'/>
      </div>
    )
  }

  return (
    <div className="">
      <Navbar />
      <Routes>
        <Route path='/home' element={authUser ? <HomePage /> : <Navigate to="/" />} />
        <Route path='/' element={!authUser ? <Home /> : <Navigate to="/home" />} />
        <Route path='/discover' element={<Discover />} />
        <Route path='/event/:eventId' element={<EventPage />} />
        <Route path='/createevent' element={authUser ? <CreateEvent /> : <Navigate to="/" />} />
        <Route path='/event/manage/:eventId' element={authUser ? <ManageEvent /> : <Navigate to="/" />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
        <Route path='/profile/settings/:username' element={authUser ? <EditProfileModal /> : <Navigate to="/login" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/home" />} />
      </Routes>
      <Toaster
        containerStyle={{
          top: 100,
        }} 
      />
    </div>
  )
}

export default App
