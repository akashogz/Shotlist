import React from 'react'

function Footer() {
    return (
        <div className='font-slim text-sm w-full flex flex-col justify-between items-center mt-30 gap-3'>
            <p>©{(new Date).getFullYear()} Shotlist. All Rights Reserved.</p>
            <p>Made By Akash Gautam</p>
            <div className='flex gap-2 items-center'>
                <a href='https://github.com/akashogz' target='_blank'><img src='../public/github.png' className='size-8'/></a>
                <a href='https://www.linkedin.com/in/akashogz/' target='_blank'><img src='../public/linkedin.webp' className='size-6'/></a>
            </div>
            <a href='mailto:akashogz@gmail.com' className='underline'>akashogz@gmail.com</a>
        </div>
    )
}

export default Footer