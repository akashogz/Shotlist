import React, { useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { Star } from 'lucide-react';

function ReviewField() {
    const user = useAuthStore((s) => s.user);

    const [selectedStars, setSelectedStars] = useState(0);
    const [hovering, setHovering] = useState(0);

    return (
        <div className='flex gap-5 items-center'>
            <img src={`https://api.dicebear.com/9.x/glass/svg?seed=${user.avatarSeed}`} className='size-11 rounded-full' />
            <div className='w-full border p-1 rounded-full items-center flex justify-between'>
                <div className='flex w-full flex-1'>
                    <div className='flex gap-0.5 h-full border-r items-center p-2'>
                        {[1, 2, 3, 4, 5].map((s, index) => (
                            <Star fill={`${selectedStars >= s || hovering >= s ? `yellow` : `#808080`} `} strokeWidth={0} size={18} onClick={() => setSelectedStars(s)} className='transition-colors duration-100 ease-in-out' onMouseEnter={() => setHovering(s)} onMouseLeave={() => setHovering(0)} />
                        ))}
                    </div>
                    <input type='text' placeholder='Enter your review... ' className='mx-4 text-sm focus:outline-0 px-2 w-full' />
                </div>
                <button className='text-sm font-semibold bg-[#464E82] p-2 rounded-full px-5'>Post as {user.username}</button>
            </div>
        </div>
    )
}

export default ReviewField