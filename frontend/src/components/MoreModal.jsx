import React from 'react'

function MoreModal({ open, movies, title, setOpenMore }) {
    return (
        <div className={`z-50 inset-0 m-5 md:m-10 shadow-2xl p-5 rounded-2xl ${open ? `fixed` : `hidden`} items-center flex justify-center flex-col`}>
            <div className=' bg-linear-to-r from-[#66666675] to-[#4b4b4b78] backdrop-blur-xl absolute -z-1 w-full h-full m-5 md:m-10 rounded-2xl'></div>
            <h1 className='text-2xl font-bold mb-2'>{title}</h1>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-10 overflow-y-scroll no-scrollbar overflow-auto p-1 rounded-lg'>
                {
                    movies.map((movie, index) => (
                        <img key={index} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className='h-40 md:h-55 w-30 md:w-40 rounded-lg object-cover hover:scale-105 transition-transform duration-300'></img>
                    ))
                }
            </div>
            <img src='close.png' className='size-4 fixed top-12 right-10 md:top-16 md:right-16' onClick={() => setOpenMore(!open)}></img>
        </div>
    )
}

export default MoreModal