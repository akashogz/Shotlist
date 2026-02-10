import React from 'react'

function ProfileCards({ tab }) {
  return (
    <div className='w-full justify-center items-center flex flex-col md:p-20 p-5 gap-5'>
        <tab.icon size={70}/>
        <p className='font-semibold text-white/50'>Your {tab.label} is Empty</p>
    </div>
  )
}

export default ProfileCards