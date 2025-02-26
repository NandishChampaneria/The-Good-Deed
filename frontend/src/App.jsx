import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import HomePage from "./pages/home/HomePage";
import Navbar from "./components/common/Navbar";
import Discover from "./pages/home/Discover";
import About from "./pages/home/About";
import EventPage from "./pages/event/EventPage";
import CreateEvent from "./pages/home/CreateEvent";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import EditProfileModal from "./pages/profile/EditProfileModal";
import Home from "./pages/home/Home";
import ManageEvent from "./pages/event/ManageEvent";
import Footer from "./components/common/Footer";
import Notifications from "./pages/notifications/Notifications";
import Contact from "./pages/home/Contact";
import { useEffect } from "react";
import AllEevents from "./pages/home/AllEevents";
import AllOrganizations from "./pages/home/AllOrganizations";
import OrgSignUpPage from "./pages/auth/orgsignup/OrgSignUpPage";
import Test from "./pages/home/test";
import PrivacyPolicy from "./pages/home/PrivacyPolicy";
import Terms from "./pages/home/Terms";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch user data");
        }
        console.log("authuser is here: ", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "myCustomTheme");
  }, []);

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/orgsignup" && <Navbar />}
      <div className="flex-grow">
        <Routes>
          <Route path='/home' element={authUser ? <HomePage /> : <Navigate to="/" />} />
          <Route path='/' element={!authUser ? <Home /> : <Navigate to="/home" />} />
          <Route path='/discover' element={<Discover />} />
          <Route path='/allevents' element={<AllEevents />} />
          <Route path='/allorganizations' element={<AllOrganizations />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/event/:eventId' element={<EventPage />} />
          <Route path='/createevent' element={authUser ? <CreateEvent /> : <Navigate to="/" />} />
          <Route path='/event/manage/:eventId' element={authUser ? <ManageEvent /> : <Navigate to="/login" />} />
          <Route path='/profile/:username' element={<ProfilePage />} />
          <Route path='/profile/settings/:username' element={authUser ? <EditProfileModal /> : <Navigate to="/login" />} />
          <Route path='/notifications' element={authUser ? <Notifications /> : <Navigate to="/" />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/discover" />} />
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/discover" />} />
          <Route path='/orgsignup' element={!authUser ? <OrgSignUpPage /> : <Navigate to="/home" />} />
          <Route path='/privacypolicy' element={<PrivacyPolicy />} />
          <Route path='/terms' element={<Terms />} />
        </Routes>
      </div>
      {location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/orgsignup" && <Footer/>}
      <Toaster
        containerStyle={{
          top: 100,
        }}
      />
    </div>
  );
}

export default App;