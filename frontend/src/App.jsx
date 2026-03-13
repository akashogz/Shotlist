import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast";

import { useAuthStore } from './store/authStore';

import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import BrowseLayout from './components/layout/BrowseLayout';
import ProfileLayout from './components/features/ProfileLayout';
import FollowCard from './components/features/FollowCard';
import ScrollToTop from './components/ui/ScrollToTop';

import Home from './pages/Home';
import Logup from './pages/Signup'; 
import Login from './pages/Login';
import Profile from './pages/Profile';
import Info from './pages/Info';
import Browse from './pages/Browse';
import Search from './pages/Search';

function App() {
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

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
          <Route path='/follow' element={<FollowCard/>}/>
        </Route>

        <Route element={<BrowseLayout />}>
          <Route path='/browse' element={<Browse />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<Logup />} />
          <Route path='/login' element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;