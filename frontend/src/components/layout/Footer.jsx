import React from 'react'

function Footer() {
    return (
        <div className='font-slim text-sm w-full flex flex-col justify-between items-center mt-30 gap-3 mb-10'>
            <p>©{(new Date).getFullYear()} Shotlist. All Rights Reserved.</p>
            <div className='grid grid-cols-2 gap-1 items-center'>
                <p className='text-xs font-semibold text-white/50'>Powered by</p>
                <img src='TMDB.svg'/>
            </div>
            <p className='text-xs text-white/50'>This product uses the TMDB API but is not endorsed or certified by TMDB</p>
        </div>
    )
}

export default Footer