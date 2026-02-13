import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { Star, StarHalf } from 'lucide-react';
import api from '../lib/api/api';
import toast from 'react-hot-toast';

function ReviewField({ tmdbId }) {
    const user = useAuthStore((s) => s.user);

    const [selectedStars, setSelectedStars] = useState(0);
    const [hovering, setHovering] = useState(0);
    const [text, setText] = useState("");
    const [posting, setPosting] = useState(false);

    const handleSubmitReview = async (req, res) => {
        try {
            setPosting(true);
            if (selectedStars > 0) {
                const res = await api.post('/user/addReview', { tmdbId, text, rating: selectedStars });
                toast.success(res.data.message);
            }
            else {
                toast.error("Invalid review!")
            }
            setPosting(false);
        } catch (error) {
            setPosting(false);
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        }
    }

    return (
        <div className='flex gap-5 items-center'>
            <img src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.avatarSeed}`} className='size-11 rounded-full' />
            <div className='w-full border p-1 rounded-full items-center flex justify-between'>
                <div className='flex w-full flex-1'>
                    <div className='flex gap-0.5 h-full border-r items-center p-2'>
                        {[1, 2, 3, 4, 5].map((s, index) => (
                            
                        <div className='flex' key={index} >
                            <StarHalf fill={`${selectedStars >= s || hovering >= s ? `yellow` : `#808080`} `} strokeWidth={0} size={18} onClick={() => setSelectedStars(s - 0.5)} className='transition-colors duration-100 ease-in-out' onMouseEnter={() => setHovering(s)} onMouseLeave={() => setHovering(0)}  />
                            <StarHalf size={18} fill={`${selectedStars >= s || hovering >= s ? `yellow` : `#808080`} `} strokeWidth={0} className='rotate-y-180 -ml-4.5 transition-colors duration-100 ease-in-out'onClick={() => setSelectedStars(s)} onMouseEnter={() => setHovering(s)} onMouseLeave={() => setHovering(0)} />
                        </div>
                        ))}
                    </div>
                    <input type='text' placeholder='Enter your review... ' className='mx-4 text-sm focus:outline-0 px-2 w-full' onChange={(e) => setText(e.target.value)} />
                </div>
                <button className='text-sm font-semibold bg-[#464E82] p-2 rounded-full px-5' onClick={() => handleSubmitReview()} disabled={posting}>{posting ? `Posting` : `Post as ${user.username}`}</button>
            </div>
        </div>
    )
}

export default ReviewField