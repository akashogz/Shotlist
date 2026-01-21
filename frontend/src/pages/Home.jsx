import React, { useEffect, useState } from 'react'
import Hero from '../components/Hero';
import { fetchPopularMovies } from '../lib/api/popular';
import Tiles from '../components/Tiles';
import MoreModal from '../components/MoreModal';
import { fetchTrendingMovies } from '../lib/api/trending';
import { fetchAllTimeMovies } from '../lib/api/alltime';
import GenreCards from '../components/GenreCards';
import CommunityCard from '../components/CommunityCard';

function Home() {
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
            <Hero slides={popular.slice(0, 5)} />
            <div className='px-5 md:px-20 flex flex-col gap-5 mt-5'>
                <div>
                    <p className='text-2xl md:text-3xl font-bold mb-4'>Trending This Week</p>
                    <Tiles movies={trending} title={"Trending This Week"} />
                </div>
                <div>
                    <p className='text-2xl md:text-3xl font-bold mb-4'>Popular Now</p>
                    <Tiles movies={popular} title={"Popular Now"} />
                </div>
                <div>
                    <p className='text-2xl md:text-3xl font-bold mb-4'>Best of All Time</p>
                    <Tiles movies={alltime} title={"Best of All Time"} />
                </div>
                <div>
                    <p className='text-2xl md:text-3xl font-bold mb-4'>Search by Genre</p>
                    <GenreCards />
                </div>
                <div>
                    <p className='text-2xl md:text-3xl font-bold mb-4'>From the community...</p>
                    <CommunityCard/>
                </div>
            </div>
        </>
    )
}

export default Home