import { SearchAlert } from 'lucide-react'
import React from 'react'

function VideoPlayer({ video, isOpen }) {
    return (
        <>
            {

                isOpen && video &&
                
                <iframe
                    style={{
                        backgroundColor: 'black',
                        maxWidth: '100%',
                        height: 'auto',
                        aspectRatio: '16/9',
                        border: 'none'
                    }}
                    width="1080"
                    height="1080"
                    src={`https://www.youtube.com/embed/${video.key}?autoplay=1&mute=1&rel=0&modestbranding=1&iv_load_policy=3`}
                    title="Movie Trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className='rounded-lg w-150'
                ></iframe>
            }
            {
                !video && 
                <div className='aspect-video bg-[#101010] w-150 rounded-lg flex flex-col gap-2 items-center justify-center'>
                    <SearchAlert className='' size={40}/>
                    <p className='font-bold text-sm md:text-md'>Sorry, There is no trailer available for this movie.</p>
                </div>
            }
        </>
    )
}

export default VideoPlayer
