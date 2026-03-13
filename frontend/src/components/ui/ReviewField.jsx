import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import api from '../../lib/api/api';
import toast from 'react-hot-toast';

function ReviewField({ tmdbId, movieName, posterPath }) {
    const user = useAuthStore((s) => s.user);

    const [selectedStars, setSelectedStars] = useState(0);
    const [hovering, setHovering] = useState(0);
    const [text, setText] = useState("");
    const [posting, setPosting] = useState(false);

    const handleSubmitReview = async () => {
        try {
            setPosting(true);
            if (selectedStars > 0) {
                const data = { 
                    tmdbId, text, 
                    rating: selectedStars, 
                    username: user.username, 
                    avatarSeed: user.avatarSeed,
                    movieName,
                    posterPath,
                }
                const res = await api.post('/user/addReview', data);
                toast.success(res.data.message);
                setText("");
                setSelectedStars(0);
            } else {
                toast.error("Please select a rating!");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Something went wrong";
            toast.error(errorMsg);
        } finally {
            setPosting(false);
        }
    };

    return (
        <div className="w-full">
            <div className='hidden md:flex items-start gap-4 w-full group'>
                <div className="relative">
                    <img
                        src={`https://api.dicebear.com/9.x/glass/svg?seed=${user?.avatarSeed}`}
                        className='size-11 rounded-full ring-2 ring-white/20 transition-all'
                        alt="avatar"
                    />
                </div>

                <div className='flex-1 flex flex-col gap-2'>
                    <div className='w-full bg-[#1E1E1E] border border-white/10 rounded-full p-1.5 flex items-center justify-between transition-all'>

                        <div className='flex flex-1 items-center'>
                            <div className='flex gap-0.5 px-3 border-r border-white/10 items-center'>
                                {[1, 2, 3, 4, 5].map((s) => {
                                    const isLeftActive = (hovering || selectedStars) >= s - 0.5;
                                    const isRightActive = (hovering || selectedStars) >= s;

                                    return (
                                        <div className='flex' key={s}>
                                            <img
                                                src={isLeftActive ? '/star-half-left.png' : '/star-half.png'}
                                                className='h-5 w-auto cursor-pointer transition-transform'
                                                onClick={() => setSelectedStars(s - 0.5)}
                                                onMouseEnter={() => setHovering(s - 0.5)}
                                                onMouseLeave={() => setHovering(0)}
                                            />
                                            <img
                                                src={isRightActive ? '/star-half-right.png' : '/star-half-r.png'}
                                                className={`h-5 w-auto cursor-pointer transition-opacity `}
                                                onClick={() => setSelectedStars(s)}
                                                onMouseEnter={() => setHovering(s)}
                                                onMouseLeave={() => setHovering(0)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <input
                                type='text'
                                value={text}
                                placeholder={`Write a review as ${user?.username}...`}
                                className='flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none px-4'
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmitReview()}
                            />
                        </div>

                        <button
                            className='bg-[#464E82] hover:bg-[#5660a5] text-white text-xs font-bold py-2.5 px-6 rounded-full transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2'
                            onClick={handleSubmitReview}
                            disabled={posting || !text.trim() || selectedStars === 0}
                        >
                            {posting ? (
                                <>
                                    <div className="size-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    <span>POSTING</span>
                                </>
                            ) : (
                                `Post as ${user.username}`
                            )}
                        </button>
                    </div>

                    <div className="px-2 opacity-0 group-focus-within:opacity-100 transition-opacity flex justify-between">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Press Enter to post</p>
                        {selectedStars > 0 && (
                            <p className="text-[10px] text-gray-500 font-bold">Rating: {selectedStars} stars</p>
                        )}
                    </div>
                </div>
            </div>

            <div className='block md:hidden w-full max-w-md mx-auto p-4 bg-[#303030] border border-white/5 shadow-xl rounded-2xl'>

                <div className='flex items-center gap-3 mb-5'>
                    <img
                        src={`https://api.dicebear.com/9.x/glass/svg?seed=${user?.avatarSeed}`}
                        className='size-10 rounded-full ring-2 ring-white/20'
                        alt="User avatar"
                    />
                    <div className="flex flex-col">
                        <span className='text-[10px] uppercase tracking-wider text-gray-400 font-bold'>Reviewing as</span>
                        <span className='text-sm font-semibold text-white'>{user?.username}</span>
                    </div>
                </div>

                <div className='flex justify-center items-center gap-1 mb-6 py-3 bg-white/10 rounded-xl border border-white/15'>
                    {[1, 2, 3, 4, 5].map((s) => {
                        const isLeftActive = (hovering || selectedStars) >= s - 0.5;
                        const isRightActive = (hovering || selectedStars) >= s;

                        return (
                            <div className='flex' key={s}>
                                <img
                                    src={isLeftActive ? '/star-half-left.png' : '/star-half.png'}
                                    className='h-6 w-auto cursor-pointer transition-opacity'
                                    onClick={() => setSelectedStars(s - 0.5)}
                                    onMouseEnter={() => setHovering(s - 0.5)}
                                    onMouseLeave={() => setHovering(0)}
                                />
                                <img
                                    src={isRightActive ? '/star-half-right.png' : '/star-half-r.png'}
                                    className={`h-6 w-auto cursor-pointer transition-opacity`}
                                    onClick={() => setSelectedStars(s)}
                                    onMouseEnter={() => setHovering(s)}
                                    onMouseLeave={() => setHovering(0)}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="relative">
                    <textarea
                        rows={4}
                        value={text}
                        placeholder='Write your thoughts here...'
                        className='bg-white/10 border border-white/15 rounded-xl p-4 text-base focus:ring-2 focus:ring-[#464E82] focus:border-transparent outline-none w-full resize-none text-white placeholder:text-gray-500 transition-all'
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <button
                    className='mt-4 w-full py-4 px-5 rounded-xl bg-[#464E82] hover:bg-[#5660a5] text-white font-bold text-sm shadow-lg active:scale-[0.97] transition-all disabled:opacity-50 disabled:grayscale'
                    onClick={handleSubmitReview}
                    disabled={posting}
                >
                    {posting ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Posting Review...</span>
                        </div>
                    ) : (
                        `Post Review`
                    )}
                </button>
            </div>
        </div>
    );
}

export default ReviewField;