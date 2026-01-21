import React from 'react'

function Footer() {
    return (
        <div className='font-slim text-sm w-full flex flex-col justify-between items-center mt-30 mb-5 gap-3'>
            <p>©{(new Date).getFullYear()} Shotlist. All Rights Reserved.</p>
            <p>Made By Akash Gautam</p>
            <a href='mailto:akashogz@gmail.com' className='underline'>akashogz@gmail.com</a>
        </div>
    )
}

export default Footer