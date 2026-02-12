import React from 'react'
import { useAuthStore } from '../store/authStore'
import { Bookmark, Check, MessageSquareMore, Pencil, Star } from 'lucide-react';
import ProfileCards from '../components/ProfileCards';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../components/ProfileModal';

function Profile() {
    const user = useAuthStore((s) => s.user);
    const loading = useAuthStore((s) => s.loading);
    const tabs = [
        { label: "Watched", icon: Check, path: "watched" },
        { label: "Reviews", icon: MessageSquareMore, path: "reviews" },
        { label: "Ratings", icon: Star, path: "ratings" },
        { label: "Watchlist", icon: Bookmark, path: "watchlist" },
    ];
    const [active, setActive] = useState(tabs[0]);
    const navigate = useNavigate();
    const [openProfileModal, setOpenProfileModal] = useState(false);

    if (loading) {
        return <div className='min-h-screen w-full p-20 flex justify-between items-center'><p>Loading profile...</p></div>;
    }

    if (!loading && !user){
        navigate('/login')
    }

    return (
        <div className='md:p-20 p-5 pt-20 h-full w-screen flex items-center flex-col gap-2 justify-between'>
            <div className='flex flex-col justify-end items-end'>
                <img src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.avatarSeed}`} className='size-18 rounded-full border-3' />
                <div className='bg-white p-1 rounded-full absolute justify-end shadow-md'  onClick={() => setOpenProfileModal(true)}>
                    <Pencil size={12} color='black' className=''/>
                </div>
            </div>
            <div className='flex flex-col items-center gap-5'>
                <div className='flex flex-col items-center gap-1'>
                    <p className='font-bold text-xl text-center'>{user.name.toUpperCase()}</p>
                    <p className='font-sm text-sm'>@{user.username}</p>
                    <div className='flex gap-2 text-sm text-white/50'>
                        <p>{user.followers.length} Followers</p>
                        <p>•</p>
                        <p>{user.following.length} Following</p>
                    </div>
                </div>
                <div className='grid sm:grid-cols-4 max-w-3xl gap-2 rounded-lg text-sm'>
                    <div className='p-4 bg-[#303030] rounded-lg flex gap-2 items-center justify-center shadow-md'>
                        <div className='flex gap-2 items-center'>
                            <Check size={18} strokeWidth={3} />
                            <p className='text-white/50'>Watched</p>
                        </div>
                        <p className='font-bold'>{user.watched.length}</p>
                    </div>
                    <div className='p-4 bg-[#303030] rounded-lg flex gap-4 items-center justify-center shadow-md'>
                        <div className='flex gap-2 items-center'>
                            <MessageSquareMore size={18} strokeWidth={3} />
                            <p className='text-white/50'>Reviews</p>
                        </div>
                        <p className='font-bold'>{user.stats.reviews}</p>
                    </div>
                    <div className='p-4 bg-[#303030] rounded-lg flex gap-2 items-center justify-center shadow-md'>
                        <div className='flex gap-2 items-center'>
                            <Star size={18} strokeWidth={3} />
                            <p className='text-white/50'>Ratings</p>
                        </div>
                        <p className='font-bold'>{user.stats.ratings}</p>
                    </div>
                    <div className='p-4 flex gap-2 bg-[#303030] rounded-lg items-center justify-center shadow-md'>
                        <div className='flex gap-2 items-center'>
                            <Bookmark size={18} strokeWidth={3} />
                            <p className='text-white/50'>Reviews</p>
                        </div>
                        <p className='font-bold'>{user.watchlist.length}</p>
                    </div>
                </div>
            </div>
            <div className='w-full items-center justify-between pt-3'>
                <div className='w-full grid sm:grid-cols-4 grid-cols-2 text-center text-sm sm:text-md'>
                    <p className={`cursor-pointer  border-white/50 p-2  font-bold  border-r ${active.label == "Watched" ? `underline underline-offset-4` : `hover:underline hover:decoration-white/50 hover:underline-offset-4`}`} onClick={() => setActive(tabs[0])}>Watched</p>
                    <p className={`cursor-pointer sm:border-r border-white/50 p-2  font-bold ${active.label == "Reviews" ? `underline underline-offset-4` : ` hover:underline hover:decoration-white/50 hover:underline-offset-4`}`} onClick={() => setActive(tabs[1])}>Reviews</p>
                    <p className={`cursor-pointer border-r border-white/50 p-2  font-bold ${active.label == "Ratings" ? `underline underline-offset-4` : ` hover:underline hover:decoration-white/50 hover:underline-offset-4`}`} onClick={() => setActive(tabs[2])}>Ratings</p>
                    <p className={`cursor-pointer p-2  font-bold ${active.label == "Watchlist" ? `underline underline-offset-4` : ` hover:underline hover:decoration-white/50 hover:underline-offset-4`}`} onClick={() => setActive(tabs[3])}>Watchlist</p>
                </div>
            </div>
            <ProfileCards tab={active}/>
            {openProfileModal && <ProfileModal setOpenProfileModal={setOpenProfileModal} />}
        </div>
    )
}

export default Profile