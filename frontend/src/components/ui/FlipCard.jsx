import { useState } from 'react';
import api from '../../lib/api/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const FlipCard = ({ item }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate(); 
  
  const handleRemove = async() => {
    const res = await api.post('/user/removeFromWatched', { tmdbId: item.movieId });
    
    toast.success(res.data.message);
  }

  return (
    <div 
      className="group w-35 aspect-2/3 perspective-[1000px] cursor-pointer"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div className={`relative h-full w-full duration-500 transition-all transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}>
        
        <div className="absolute inset-0 w-full h-full bg-zinc-800 text-white flex items-center justify-center rounded-xl backface-hidden">
          <img src={`https://image.tmdb.org/t/p/w185/${item.posterPath}`} className='w-35 rounded-lg hover:scale-105 ease-in-out duration-200'/>
        </div>

        <div className="absolute inset-0 w-full h-full bg-[#202020] text-white flex flex-col items-center justify-between rounded-xl transform-[rotateY(180deg)] backface-hidden border border-[#505050] p-4">
          <h1 className='text-sm text-center font-bold cursor-pointer hover:underline underline-offset-3' onClick={() => navigate(`/movie/${item.movieId}`)}>{item.title}</h1>
          <p className="text-xs text-center">Added at: {new Date(item.addedAt).toLocaleDateString('en-GB', {
                              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })}</p>
          <button className='bg-white text-black p-2 rounded-full px-4 text-sm font-bold hover:bg-white/80 ease-in-out duration-300' onClick={() => handleRemove()}>Remove</button>
        </div>

      </div>
    </div>
  );
};