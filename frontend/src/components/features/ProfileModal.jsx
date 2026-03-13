import axios from 'axios';
import { Check, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import api from '../../lib/api/api';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

function ProfileModal({ setOpenProfileModal, openProfileModel }) {
    const [random, setRandom] = useState(Math.random());
    const [selected, setSelected] = useState(0);
    const fetchMe = useAuthStore((s) => s.fetchMe);

    useEffect(() => {
            if (openProfileModel) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'unset';
            }
            return () => {
                document.body.style.overflow = 'unset';
            };
        }, [openProfileModel]);

    const handleProfileChange = async (avatarSeed) => {
        try {
            if (selected !== 0) {
                const res = await api.post("/user/change-pfp", { avatarSeed });
            }
            fetchMe();
            toast.success("Profile Picture Updated!")
            setOpenProfileModal(false);
        } catch (error) {
            console.error('Error setting profile picture:', error);
            return [];
        }
    }

    return (
        <div className='fixed min-h-screen'>
            <div className='justify-center bg-[#2e2e2e] rounded-lg p-5 flex flex-col gap-5 items-center'>
                <div className='flex justify-between w-full items-center'>
                    <p className='font-semibold text-2xl'>Choose a Picture</p>
                    <RotateCcw size={16} onClick={() => setRandom(Math.random())} className='hover:-rotate-180 ease-in-out duration-500 transition-transform' />
                </div>
                <div className='grid grid-cols-3 md:gap-5 gap-3'>
                    {
                        [10, 3, 32, 41, 57, 64, 79, 82, 95].map((val, index) => (
                            <div className='flex flex-col justify-end items-end'>
                                <img src={`https://api.dicebear.com/9.x/glass/svg?seed=${val * random}`} className='size-18 rounded-full hover:scale-105 duration-300 ease-in-out' key={index} onClick={() => setSelected(val)} />
                                <div className={`bg-white p-1 rounded-full absolute justify-end ${selected === val ? `opacity-100` : `opacity-0`} shadow-md transition-opacity duration-500 ease-in-out`}>
                                    <Check size={12} color='black' className={``}  />
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='flex w-full gap-2'>
                    <button className='bg-[#ffffff82] text-white p-3 w-full rounded-lg font-semibold text-sm' onClick={() => setOpenProfileModal(false)}>Close</button>
                    <button className='bg-white hover:bg-white/90 duration-200 ease-in-out text-black p-3 w-full rounded-lg font-semibold text-sm' onClick={() => handleProfileChange(selected * random)}>Apply</button>
                </div>
            </div>
        </div>
    )
}

export default ProfileModal