import { Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

// Components & Layouts
import MainLayout from './components/MainLayout';
import AuthLayout from './components/AuthLayout';
import ProfileLayout from './components/ProfileLayout';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import Logup from './pages/Logup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Info from './pages/Info';
import Browse from './pages/Browse';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';

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
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <ScrollToTop />

      <Routes>
        {/* standard browsing routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path='/movie/:movieId' element={<Info />} />
          <Route path='/browse' element={<Browse />} />
        </Route>

        {/* profile routes - fixed the path syntax to use :username */}
        <Route element={<ProfileLayout />}>
          <Route path='/profile/:username' element={<Profile />} />
        </Route>

        {/* auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Logup />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;