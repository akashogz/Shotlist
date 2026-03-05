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
import Search from './pages/Search';

function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const user = useAuthStore((s) => s.user);

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
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path='/movie/:movieId' element={<Info />} />
          <Route path='/search/:searchQuery' element={<Search />} />
        </Route>

        <Route element={<ProfileLayout />}>
          <Route path='/profile/:username' element={<Profile />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Logup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/browse' element={<Browse />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;