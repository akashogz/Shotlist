import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero';
import { fetchPopularMovies } from './lib/api/popular';
import Tiles from './components/Tiles';
import MoreModal from './components/MoreModal';
import { fetchTrendingMovies } from './lib/api/trending';
import { fetchAllTimeMovies } from './lib/api/alltime';

function App() {
  const [popular, setPopular] = useState([]);
  const [trending, setTrending] = useState([]);
  const [alltime, setAllTime] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      const moviesData1 = await fetchPopularMovies();
      const moviesData2 = await fetchTrendingMovies();
      const moviesData3 = await fetchAllTimeMovies();
      setPopular(moviesData1);
      setTrending(moviesData2);
      setAllTime(moviesData3); 
    }
    getMovies();
  }, [])

  return (
    <>
      <Navbar />
      <Hero slides={popular.slice(0,5)}/>
      <div className='px-5 md:px-20 flex flex-col gap-5 mt-5'>
        <div>
          <p className='text-2xl md:text-3xl font-bold mb-4'>Trending This Week</p>
          <Tiles movies={trending} title={"Trending This Week"}/>
        </div>
        <div>
          <p className='text-2xl md:text-3xl font-bold mb-4'>Popular Now</p>
          <Tiles movies={popular} title={"Popular Now"}/>
        </div>
        <div>
          <p className='text-2xl md:text-3xl font-bold mb-4'>Best of All Time</p>
          <Tiles movies={alltime} title={"Best of All Time"}/>
        </div>
        <div>
          <p className='text-2xl md:text-3xl font-bold mb-4'>Search by Genre</p>
          <div className='flex gap-8 md:gap-25 overflow-x-auto rounded-lg scroll-none no-scrollbar'>
            <div className='min-h-50 md:min-h-55 min-w-32 md:min-w-39 rounded-lg bg-linear-to-b from-[#3c3c3c76] to-[#60606071] items-center justify-center flex flex-col gap-2 text-lg'>
                <div className='overflow-hidden flex rounded-full  bg-[#D7263D] items-center justify-center p-3 border-2  inset-shadow-sm'>
                  <img src='action.png' className='size-8'></img>
                </div>
                <p className='font-semibold'>Action</p>
            </div>
            <div className='min-h-50 md:min-h-55 min-w-32 md:min-w-40 rounded-lg bg-linear-to-b from-[#3c3c3c76] to-[#60606071] items-center justify-center flex flex-col gap-2 text-lg'>
                <div className='overflow-hidden flex rounded-full  bg-[#2BB673] items-center justify-center p-3 border-2 inset-shadow-sm'>
                  <img src='adventure.png' className='size-8'></img>
                </div>
                <p className='font-semibold'>Adventure</p>
            </div>
            <div className='min-h-50 md:min-h-55 min-w-32 md:min-w-40 rounded-lg bg-linear-to-b from-[#3c3c3c76] to-[#60606071] items-center justify-center flex flex-col gap-2 text-lg'>
                <div className='overflow-hidden flex rounded-full  bg-[#FFCA28] items-center justify-center p-3 border-2 inset-shadow-sm'>
                  <img src='comedy.png' className='size-8'></img>
                </div>
                <p className='font-semibold'>Comedy</p>
            </div>
            <div className='min-h-50 md:min-h-55 min-w-32 md:min-w-40 rounded-lg bg-linear-to-b from-[#3c3c3c76] to-[#60606071] items-center justify-center flex flex-col gap-2 text-lg'>
                <div className='overflow-hidden flex rounded-full  bg-[#7E57C2] items-center justify-center p-3 border-2 inset-shadow-sm'>
                  <img src='drama.png' className='size-8'></img>
                </div>
                <p className='font-semibold'>Drama</p>
            </div>
            <div className='h-50 md:h-55 min-w-32 md:min-w-40 rounded-lg bg-linear-to-b from-[#3c3c3c76] to-[#60606071] items-center justify-center flex flex-col gap-2 text-lg'>
                <div className='overflow-hidden flex rounded-full  bg-[#00B8F5] items-center justify-center p-3 border-2 inset-shadow-sm'>
                  <img src='sci-fi.png' className='size-8 drop-shadow-xs drop-shadow-black/20'></img>
                </div>
                <p className='font-bold'>Sci-Fi</p>
            </div>
            <div className='h-50 md:h-55 w-35 md:w-20 rounded-lg object-cover justify-center items-center flex'>
                <div className='w-15 md:w-20 h-15 md:h-20 rounded-full bg-[#464E82] flex items-center justify-center' onClick={() => setOpenMore(!openMore)}>
                    <img src='right-arrow.png' className='size-6 md:size-8'></img>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className='font-slim text-sm w-full flex flex-col justify-between items-center mt-30 mb-5 gap-3'>
        <p>©{(new Date).getFullYear()} Cinescope. All Rights Reserved.</p>
        <p>Made By Akash Gautam</p>
        <a href='mailto:akashogz@gmail.com' className='underline'>akashogz@gmail.com</a>
      </div>
    </>
  )
}

export default App
