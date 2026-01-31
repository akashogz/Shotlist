import Home from './pages/Home'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Logup from './pages/Logup'
import Login from './pages/Login'
import MainLayout from './components/MainLayout'
import AuthLayout from './components/AuthLayout'
import ProfileLayout from './components/ProfileLayout'
import { Toaster } from "react-hot-toast";
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import Profile from './pages/Profile'

function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const user = useAuthStore((s) => s.user);

  console.log(user);

  useEffect(() => {
    fetchMe();
  }, []);
  
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route element={<ProfileLayout/>}>
          <Route path='/profile' element={<Profile/>} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Logup />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}

export default App
