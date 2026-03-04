import React from 'react'
import { useNavigate } from 'react-router-dom'
import logo from "../../public/logo.png"

function MoreModal({ open, items, title, setOpenMore }) {
    const navigate = useNavigate();
    return (
        <div className={`z-50 inset-0 m-5 md:m-10 shadow-2xl p-5 rounded-2xl ${open ? `fixed` : `hidden`} items-center flex justify-center flex-col`}>
            <div className=' bg-linear-to-r from-[#6666662e] to-[#4b4b4b46] backdrop-blur-xl absolute -z-1 w-full h-full m-5 md:m-10 rounded-2xl'></div>
            <h1 className='text-2xl font-bold mb-2'>{title}</h1>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-10 overflow-y-scroll no-scrollbar overflow-auto p-1 rounded-lg place-items-stretch place-content-stretch w-full h-full'>
                {
                    items.map((item, index) => (
                        <div className='flex flex-col items-center gap-2' key={index}>
                            {item.poster_path || item.profile_path ?
                            <img key={index} src={`https://image.tmdb.org/t/p/w500${item.poster_path || item.profile_path}`} className='h-40 md:h-55 w-30 md:w-40 rounded-lg object-cover hover:scale-102 ease-in-out duration-200 bg-[#4d4d4d]' onClick={() => navigate(`movie/${item?.id}`)}></img>
                            : <div className='rounded-lg h-40 md:h-55 w-30 md:w-40  bg-[#4d4d4d] flex items-center justify-center'>
                                <img key={index} src={`/logo.png`} className='p-10 hover:scale-102 ease-in-out duration-200' onClick={() => navigate(`movie/${item?.id}`)}></img>
                            </div>}
                            <div className='flex flex-col items-center w-30 md:w-40'>
                                <p className='text-md font-bold items-center'>{item.title || item.name}</p>
                                <p className='text-sm'>{item.character || ``}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
            <img src='/close.png' className='size-4 fixed top-12 right-10 md:top-16 md:right-16 hover:rotate-90 duration-200 ease-in-out' onClick={() => setOpenMore(!open)}></img>
        </div>
    )
}

export default MoreModal