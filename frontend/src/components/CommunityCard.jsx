import React from 'react'

function CommunityCard() {
    const reviews = [
        {
            userAvatar: "user1.png",
            userName: "CosmicCinephile",
            reviewDate: "Tuesday, 14 May 2024",
            moviePoster: "image 31.png",
            stars: 5,
            review: "A visually stunning and emotionally powerful journey through space and time. Hans Zimmer’s score alone could tear open wormholes. The relationship between Cooper and Murph hit harder than most sci-fi ever manages to. A visually stunning and emotionally powerful journey through space and time. Hans Zimmer’s score alone could tear open wormholes. The relationship between Cooper and Murph hit harder than most sci-fi ever manages to.",
            likes: 128,
        },
        {
            userAvatar: "user2.png",
            userName: "JazzHandsJamie",
            reviewDate: "Tuesday, 19 May 2024",
            moviePoster: "image 32.png",
            stars: 4,
            review: "A dreamy tribute to old-school Hollywood with modern heartbreak. The music, colors, and choreography are pure magic — but the ending reminds you that dreams often come with sacrifice. Beautifully bittersweet and full of soul.",
            likes: 64,
        }
    ]
    return (
        <div className='grid md:grid-cols-2 gap-3 md:gap-6 items-stretch'>
            {
                reviews.map((review, index) => (
                    <div className='bg-[#60606071] hover:bg-[#393939] ease-in-out duration-300 rounded-lg p-3 flex flex-col gap-3 items-center'>
                        <div className='flex gap-2 w-full items-center'>
                            <img src={`${review.userAvatar}`} className='size-9 md:size-11'></img>
                            <div className='md:flex md:justify-between w-full h-full items-center'>
                                <p className='font-bold'>{review.userName}</p>
                                <p className='font-regular text-xs md:text-sm text-white/50'>{review.reviewDate}</p>
                            </div>
                        </div>
                        <div className='flex gap-2'>
                            <img src={`${review.moviePoster}`} className='w-30 rounded-lg'></img>
                            <div className='flex flex-col justify-between'>
                                <div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex items-center'>
                                            <div className='flex gap-1'>
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <img
                                                        key={i}
                                                        src="star-filled.png"
                                                        className={`size-4 ${i <= review.stars ? "opacity-100" : "opacity-30"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className='font-regular line-clamp-6 md:line-clamp-5 text-sm'>{review.review}</p>
                                    </div>
                                </div>
                                <div className='w-full justify-end flex items-center gap-1'>
                                    <img src='love.png' className='size-4'></img>
                                    <p className='text-sm'>{review.likes} Likes</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default CommunityCard