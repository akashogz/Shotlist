import React from 'react'
import { useAuthStore } from '../store/authStore'

function ProfileCards({ tab }) {
  const user = useAuthStore((s) => s.user);
  const items = (user?.[tab.label.toLowerCase()])
  

  return (
    <div>
      {
        items.length === 0 &&
        <div className='w-full justify-center items-center flex flex-col md:p-20 p-5 gap-5'>
          <tab.icon size={70} />
          <p className='font-semibold text-white/50'>Your {tab.label} is Empty</p>
        </div>
      }

      {
        items.length > 0 && 
        <div className='grid md:grid-cols-8 grid-cols-2 gap-5 w-screen px-5 md:px-20 mt-5 md:items-start items-center'>
          {
            items.map((i, index) => (
              <div>
                <img src={`https://image.tmdb.org/t/p/w1280/${i.posterPath}`} className='w-30 md:w-35 rounded-lg' />
              </div>
            ))
          }
        </div>  
      }
    </div>
  )
}

export default ProfileCards