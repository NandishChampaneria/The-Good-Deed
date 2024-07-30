import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/login/LoginPage"
import SignUpPage from "./pages/auth/signup/SignUpPage"
import HomePage from "./pages/home/HomePage"
import Navbar from "./components/common/Navbar";
import Discover from "./pages/home/Discover";
import EventPage from "./pages/event/EventPage";
import CreateEvent from "./pages/home/CreateEvent";
import ProfilePage from "./pages/profile/ProfilePage";

function App() {
  return (
    <div className="">
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/discover' element={<Discover />} />
        <Route path='/event/:id' element={<EventPage />} />
        <Route path='/createevent' element={<CreateEvent />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
      </Routes>
    </div>
  )
}

export default App
