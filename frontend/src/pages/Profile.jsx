import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Bookmark, Check, MessageSquareMore, Pencil, Plus, Star } from 'lucide-react';
import ProfileCards from '../components/ProfileCards';
import ProfileModal from '../components/ProfileModal';
import api from '../lib/api/api';
import toast from 'react-hot-toast';
import FollowCard from '../components/FollowCard';

function Profile() {
    const { username } = useParams();
    const navigate = useNavigate();

    const currentUser = useAuthStore((s) => s.user);
    const profileData = useAuthStore((s) => s.profile);
    const fetchProfile = useAuthStore((s) => s.fetchProfile);
    const loading = useAuthStore((s) => s.loading);

    const [openProfileModal, setOpenProfileModal] = useState(false);
    const isOwnProfile = currentUser?.username === username;
    const displayUser = profileData;
    const [isFollowed, setIsFollowed] = useState(false);
    const [openFollowModal, setOpenFollowModal] = useState(false);
    const [activeFollow, setActiveFollow] = useState("Followers");

    useEffect(() => {
        if (username) {
            fetchProfile(username);
        }
    }, [username, fetchProfile]);

    useEffect(() => {
        const checkFollowed = async () => {
            const ifFollowed = await api.get(`user/checkIfFollowed/${profileData._id}`)
            setIsFollowed(ifFollowed.data.isFollowed);
            console.log(ifFollowed)
        }
        checkFollowed();
    }, [profileData, isFollowed])

    const tabs = [
        { label: "Watched", icon: Check, path: "watched" },
        { label: "Reviews", icon: MessageSquareMore, path: "reviews" },
        { label: "Watchlist", icon: Bookmark, path: "watchlist" },
    ];
    const [active, setActive] = useState(tabs[0]);

    const handleFollow = async () => {
        try {
            const res = await api.post('/user/followToggle', { followeeId: displayUser._id });
            setIsFollowed(!isFollowed);
            toast.success(res.data.message);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        }
    }

    if (loading) {
        return <div className='min-h-screen w-full flex justify-center items-center text-white'><p className="animate-pulse">Loading profile...</p></div>;
    }

    if (!displayUser) {
        return <div className='min-h-screen w-full flex justify-center items-center text-white'><p>User not found</p></div>;
    }

    return (
        <div className='md:p-20 p-5 pt-20 md:pt-28 h-full w-full flex items-center flex-col gap-2'>
            <div className='relative flex flex-col items-center group justify-center'>
                <img
                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${displayUser.avatarSeed}`}
                    className='size-20 rounded-full border-4 border-white shadow-2xl transition-transform group-hover:scale-105'
                    alt="avatar"
                />

                {isOwnProfile && (
                    <div
                        className='bg-white p-2 rounded-full absolute bottom-0 right-0 cursor-pointer shadow-lg hover:bg-gray-200 transition-colors'
                        onClick={() => setOpenProfileModal(true)}
                    >
                        <Pencil size={14} color='black' />
                    </div>
                )}
            </div>

            <div className='flex flex-col items-center gap-6 w-full justify-center tracking-tight'>
                <div className='flex flex-col items-center gap-3'>
                    <div className='flex flex-col items-center'>
                        <div className='flex gap-2 items-center'>
                            <h1 className='font-bold text-2xl text-center text-white'>
                                {(displayUser.name || displayUser.username)}
                            </h1>
                            <button className={`${isFollowed ? `bg-white hover:white/90 text-black` : `bg-[#464E82] hover:bg-[#464e82c2]`} duration-200 ease-in-out transition-all flex gap-1 items-center p-0 px-3 rounded-full text-sm justify-center`} onClick={() => handleFollow()}>{isFollowed? <Check size={14} /> : <Plus size={14} />} {isFollowed ? `Following` : `Follow`}</button>
                        </div>
                        <p className='text-gray-400'>@{displayUser.username}</p>
                    </div>

                    <div className='flex gap-4 text-sm text-white/50 px-4 py-1 rounded-full bg-[#303030] shadow-xs'>
                        <button className='hover:underline underline-offset-2 cursor-pointer ease-in-out duration-200' onClick={() => {setOpenFollowModal(true); setActiveFollow("Followers")}}><span className="text-white font-bold">{displayUser.followers?.length || 0}</span> Followers</button>
                        <p>•</p>
                        <button className='hover:underline underline-offset-2 cursor-pointer ease-in-out duration-200' onClick={() => {setOpenFollowModal(true); setActiveFollow("Following")}}><span className="text-white font-bold">{displayUser.following?.length || 0}</span> Following</button>
                    </div>
                </div>

                <div className='grid sm:grid-cols-3 max-w-3xl gap-5 rounded-lg text-sm mb-5'>
                    {[
                        { label: "Watched", icon: Check, count: displayUser.stats?.watched || 0 },
                        { label: "Reviews", icon: MessageSquareMore, count: displayUser.stats?.reviews || 0 },
                        { label: "Watchlist", icon: Bookmark, count: displayUser.stats?.watchlist || 0 },
                    ].map((stat) => (
                        <div key={stat.label} className='p-4 bg-[#303030] rounded-lg flex gap-2 items-center justify-center shadow-md'>
                            <div className='flex gap-2 items-center'>
                                <stat.icon size={16} className="" />
                                <p className='text-sm text-white/50'>{stat.label}</p>
                                <p className='font-bold text-md text-white'>{stat.count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='w-full max-w-4xl border-b border-white/10'>
                <div className='flex justify-around gap-2'>
                    {tabs.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => setActive(tab)}
                            className={`pb-4 px-1 md:px-2 text-sm font-bold transition-all relative ${active.label === tab.label
                                ? 'text-white'
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {tab.label}
                            {active.label === tab.label && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <ProfileCards tab={active} displayUser={displayUser} />

            {openProfileModal && <ProfileModal setOpenProfileModal={setOpenProfileModal} />}
            {
                displayUser?._id && currentUser?._id && openFollowModal &&
                <FollowCard viewerId={currentUser?._id} userId={displayUser?._id} setOpenFollowModal={setOpenFollowModal} activeFollow={activeFollow} setActiveFollow={setActiveFollow} className={`${openFollowModal ? `opacity-100` : `opacity-0`} transition-all ease-in-out duration-300`}/>
            }
        </div>
    );
}

export default Profile;