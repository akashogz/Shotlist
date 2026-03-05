import React, { useEffect, useState } from 'react'
import { searchMovie } from '../lib/api/search'
import { useNavigate } from 'react-router-dom';

function Search() {
    const [movies, setMovies] = useState([]);
    const query = "Nightcrawler";
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSearch = async () => {
            const res = await searchMovie(query);
            setMovies(res)
            console.log(res)
        }

        fetchSearch()
    }, [query]);

    return (
        <div className='md:px-20 px-5 pt-20 flex flex-col gap-5'>
            <p className='text-sm font-bold'>Search results for "{query}" ({movies.length} results)</p>
            <div className='flex flex-col place-items-center items-start'>
                {
                    movies.map((movie, index) => (
                        <div className='flex flex-2 gap-3 border-t border-[#3b3b3b] p-2 py-5 items-center w-full' key={index} onClick={() => navigate(`/movie/${movie.id}`)} >
                            {
                                movie.poster_path && 
                                <div>
                                    <img src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`} className='w-25 md:w-25 rounded-lg' />
                                </div>
                            }
                            {
                                !movie.poster_path && 
                                <div className='w-25 md:w-25 rounded-lg bg-[#303030] aspect-2/3 items-center justify-center flex'>
                                    <img src='/logo.png' className='p-7'/>
                                </div>
                            }
                            <p className='text-sm font-bold '>{movie.title} ({movie.release_date.slice(0,4)})</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Search