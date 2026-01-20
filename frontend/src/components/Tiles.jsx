import React, { use, useState } from 'react'
import MoreModal from './MoreModal';

function Tiles({ movies, title }) {
    const [openMore, setOpenMore] = useState(false);
    const [l, setL] = useState(0);
    return (
        <div className='flex gap-8 md:gap-25 overflow-x-auto rounded-lg scroll-none no-scrollbar'>
            {
                movies.slice(0, 5).map((movie, index) => (
                    <img key={index} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className='h-50 md:h-55 min-w-32 md:w-40 rounded-lg object-cover'></img>
                ))
            }
            <div className='h-50 md:h-55 w-35 md:w-20 rounded-lg object-cover justify-center items-center flex'>
                <div className='w-15 md:w-20 h-15 md:h-20 rounded-full bg-[#464E82] flex items-center justify-center' onClick={() => setOpenMore(!openMore)}>
                    <img src='right-arrow.png' className='size-6 md:size-8'></img>
                </div>
            </div>
            <MoreModal open={openMore} movies={movies} title={title} setOpenMore={setOpenMore}/>
        </div>
    )
}

export default Tiles