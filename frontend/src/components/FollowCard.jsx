import React from 'react'
import { useEffect } from 'react'
import api from '../lib/api/api'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Cross, Plus } from 'lucide-react';
import { tailspin } from 'ldrs';

function FollowCard({ viewerId = "", userId = "", openFollowModal, setOpenFollowModal, setActiveFollow, activeFollow }) {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    tailspin.register();

    useEffect(() => {
        setLoading(true)
        const fetchFollowers = async () => {
            const res = await api.get(`user/fetchFollowers/${userId}?viewerId=${viewerId}`);
            setFollowers(res.data)
            setLoading(false);
        }

        const fetchFollowing = async () => {
            const res = await api.get(`user/fetchFollowing/${userId}?viewerId=${viewerId}`);
            setFollowing(res.data);
            setLoading(false);
        }

        if (activeFollow === "Followers") {
            fetchFollowers();
        } else {
            fetchFollowing();
        }
    }, [activeFollow, userId])

    useEffect(() => {
        if (openFollowModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [openFollowModal]);

    const handleFollow = async (followeeId) => {
        try {
            const res = await api.post('/user/followToggle', { followeeId });
            toast.success(res.data.message);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        }
    }

    return (
        <div className='fixed bg-[#303030] p-5 rounded-lg flex flex-col gap-3 w-[calc(100vw-5%)] lg:w-[calc(100vw-20%)] h-[calc(100vh-150px)] transition-all ease-in-out duration-200'>
            <div>
                <div className='flex'>
                    <div className='flex w-full gap-5 justify-center'>
                        <h1 className={`font-bold ${activeFollow == "Followers" ? `underline` : `decoration-[#808080]`} underline-offset-3 hover:underline ease-in-out duration-200 cursor-pointer`} onClick={() => setActiveFollow("Followers")}>Followers</h1>
                        <p className='text-[#808080]'>|</p>
                        <h1 className={`font-bold ${activeFollow == "Following" ? `underline` : `decoration-[#808080]`} underline-offset-3 hover:underline ease-in-out duration-200 cursor-pointer`} onClick={() => setActiveFollow("Following")}>Following</h1>
                    </div>
                    <Plus className='size-5 rotate-45 hover:rotate-135 duration-200 ease-in-out' onClick={() => setOpenFollowModal(false)} />
                </div>
                <div>
                    {loading ? (
                        <div className='w-full h-dvh -mt-30 flex items-center justify-center'>
                            <l-tailspin size="40" stroke="4" speed="0.9" color="white"></l-tailspin>
                        </div>
                    ) : (
                        (() => {
                            const currentData = activeFollow === "Followers" ? followers : following;

                            if (currentData.length === 0) {
                                return (
                                    <div className='flex flex-col w-full items-center justify-center h-dvh -mt-30'>
                                        <p>No {activeFollow}(s) found</p>
                                    </div>
                                );
                            }

                            return (
                                <div className='flex flex-col gap-1'>
                                    {currentData.map((f, index) => (
                                        <div className='flex gap-2 justify-between h-full overflow-y-scroll no-scrollbar hover:bg-[#4848488b] ease-in-out duration-200 p-2 rounded-lg' key={f._id || index}>
                                            <div className='flex gap-2 items-center w-full cursor-pointer' onClick={() => { navigate(`/profile/${f.username}`); setOpenFollowModal(false); }}>
                                                <img src={`https://api.dicebear.com/9.x/glass/svg?seed=${f.avatarSeed}`} className='size-10 rounded-full' alt="avatar" />
                                                <p className='text-sm'>{f.username}</p>
                                            </div>
                                            <button
                                                className={`${f._id !== viewerId ? `hover:bg-[#303030] bg-[#282828] ` : ``} text-sm p-2 rounded-lg font-semibold z-10`}
                                                onClick={() => handleFollow(f._id)}
                                            >
                                                {f.isFollowing ? `Followed` : f._id !== viewerId ? `Follow` : `You`}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()
                    )}
                </div>
            </div>
        </div>
    )
}

export default FollowCard