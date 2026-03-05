import React, { useEffect, useState } from 'react'
import { searchMovie } from '../lib/api/search'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';

function Search() {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();
    const { searchQuery } = useParams();

    useEffect(() => {
        const fetchSearch = async () => {
            const res = await searchMovie(searchQuery);
            setMovies(res)
            console.log(res)
        }

        fetchSearch()
    }, [searchQuery]);

    return (
        <div className='md:px-20 px-5 pt-20 flex flex-col gap-5'>
            <div className='flex gap-1 flex-col'>
                <p className='text-sm font-bold'>Search results for "{searchQuery}"</p>
                <p className='text-sm'>({movies.length} results)</p>
            </div>
            <div className='flex flex-col place-items-center items-start'>
                {
                    movies.map((movie, index) => (
                        <div className='grid grid-cols-[auto_1fr] gap-5 border-t border-[#3b3b3b] p-2 py-5 items-center w-full' key={index}>
                            {
                                movie.poster_path &&
                                <div>
                                    <img src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`} className='w-20 rounded-lg bg-[#303030] aspect-2/3' />
                                </div>
                            }
                            {
                                !movie.poster_path &&
                                <div className='w-20 rounded-lg bg-[#303030] aspect-2/3 items-center justify-center flex'>
                                    <img src='/logo.png' className='p-7' />
                                </div>
                            }
                            <div className='flex flex-col gap-1'>
                                <Link className='text-sm font-bold underline underline-offset-2 cursor-pointer' to={`/movie/${movie.id}`}>{movie.title}</Link>
                                <p className='text-sm'>{movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ``}</p>
                                <p className='text-sm text-ellipsis line-clamp-2'>{movie.overview}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Search