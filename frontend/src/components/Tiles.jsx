import React, { use, useState } from 'react'
import MoreModal from './MoreModal';

function Tiles({ movies, title }) {
    const [openMore, setOpenMore] = useState(false);
    const [l, setL] = useState(0);
    return (
        <div className='flex gap-8 md:gap-25 overflow-x-auto rounded-lg scroll-none no-scrollbar'>
            {
                movies.slice(0, 5).map((movie, index) => (
                    <div className='flex flex-col group ease-in-out duration-200 overflow-hidden h-50 md:h-55 min-w-32  gap-2'>
                        <img key={index} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className='h-50 md:h-55 min-w-32 md:w-40 rounded-lg object-cover group-hover:md:h-38 group-hover:h-35 group-hover:brightness-75 ease-in-out duration-300'></img>
                        <div className='hidden group-hover:flex ease-in-out duration-300 flex-col justify-between items-center min-w-32 md:w-40 bg-linear-to-bl from-[#3c3c3c3b] to-[#60606038] rounded-lg p-2'>
                            <p className='w-32 md:w-38 truncate text-center font-bold md:text-md text-sm'>{movie.title}</p>
                            <p className='text-xs md:text-sm'>{Math.round(movie.vote_average * 10)/10}</p>
                        </div>
                    </div>
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