import React from 'react'

function CommunityCard({ topReviews = [] }) {
    if (!topReviews.length) return <p className="text-white/50 p-6">No trending reviews this week.</p>;

    return (
        <div className='grid md:grid-cols-2 gap-4 md:gap-5 items-stretch'>
            {topReviews.map((review, index) => (
                <div
                    className='bg-[#60606071] hover:bg-[#393939] ease-in-out duration-300 rounded-lg p-3 flex flex-col gap-3'
                    key={review._id || index}
                >
                    <div className='flex gap-3 w-full items-center'>
                        <img
                            src={`https://api.dicebear.com/9.x/glass/svg?seed=${review.user?.avatarSeed || 'default'}`}
                            className='size-10 md:size-12 rounded-full border border-white/10'
                            alt="avatar"
                        />
                        <div className='flex flex-col justify-between w-full'>
                            <p className='font-bold text-white'>{review.user?.username || 'Anonymous'}</p>
                            <p className='text-[10px] md:text-xs text-white/40 font-medium'>
                                {new Date(review.createdAt).toLocaleDateString('en-GB', {
                                    weekday: 'long', day: 'numeric', month: 'short', year: 'numeric'
                                })}
                            </p>
                        </div>
                    </div>

                    <div className='flex gap-4 h-full'>
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${review.posterPath}`}
                            className='w-24 md:w-28 aspect-2/3 object-cover rounded-md shadow-lg'
                            alt="poster"
                        />

                        <div className='flex flex-col flex-1'>
                            <div className='flex flex-col gap-2'>
                                <div className='flex gap-0.5'>
                                    {[1, 2, 3, 4, 5].map((idx) => (
                                        <div key={idx} className='flex'>
                                            {idx - 0.5 <= review.rating && <img src='/star-half-left.png' className='h-4' alt='' />}
                                            {idx <= review.rating && <img src='/star-half-right.png' className='h-4' alt='' />}
                                            {idx - 0.5 > review.rating && <img src='/star-half.png' className='h-4' alt='' />}
                                            {idx > review.rating && <img src='/star-half-r.png' className='h-4' alt='' />}
                                        </div>
                                    ))}
                                    <p className='text-xs text-white/50'>({review.rating})</p>
                                </div>
                                <p className='text-sm leading-relaxed text-gray-200 line-clamp-6'>
                                    {review.text}
                                </p>
                            </div>

                            <div className='mt-auto pt-2 flex items-center justify-end gap-1.5'>
                                <img src='/love.png' className='size-3.5' alt="like" />
                                <span className='text-xs font-semibold text-white'>{review.likesCount} Likes</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CommunityCard