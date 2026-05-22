import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../lib/api/api';
import { tailspin } from 'ldrs';

function Search() {
    const [movies, setMovies] = useState([]);
    const [person, setPerson] = useState([]);
    const [selected, setSelected] = useState("Movies");
    const navigate = useNavigate();
    const { searchQuery } = useParams();
    const [loading, setLoading] = useState(true);
    tailspin.register();

    useEffect(() => {
        const fetchMovies = async () => {
            const res = await api.get(
                `movie/search-movie?query=${searchQuery}`
            );
            setMovies(res.data);
        };

        const fetchPerson = async () => {
            const res = await api.get(
                `movie/search-person?query=${searchQuery}`
            );
            setPerson(res.data);
        };

        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([
                    fetchMovies(),
                    fetchPerson()
                ]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData()
    }, [searchQuery]);

    return (
        <div className='md:px-20 px-5 pt-20 flex flex-col gap-5'>
            <div className='flex w-full h-full items-center justify-center '>
                {loading &&
                    <l-tailspin
                        size="40"
                        stroke="2"
                        speed="0.9"
                        color="white"
                        className="pt-40 pb-30"
                    ></l-tailspin>}
            </div>
            {
                !loading &&
                <div className='flex flex-col gap-5'>
                    <div className='flex gap-2 flex-col'>
                        <div className='flex gap-1'>
                            <p className='text-sm font-bold'>Search results for "{searchQuery}"</p>
                        </div>
                        <div className='font-semibold text-xs flex gap-2'>
                            <button className={`px-3 rounded-full p-1 hover:bg-[#5e5e5e] ${selected == "Movies" ? `bg-[#5e5e5e]` : `bg-[#404040]`}`} onClick={() => setSelected("Movies")}>
                                Movies ({movies.length})
                            </button>
                            <button className={`px-3 rounded-full p-1 hover:bg-[#5e5e5e] ${selected == "People" ? `bg-[#5e5e5e]` : `bg-[#404040]`}`} onClick={() => setSelected("People")}>
                                People ({person.length})
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col place-items-center items-start'>
                        {
                            selected == "Movies" &&
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
                        {
                            selected == "People" &&
                            person.map((person, index) => (
                                <div className='grid grid-cols-[auto_1fr] gap-5 border-t border-[#3b3b3b] p-2 py-5 items-center w-full' key={index}>
                                    {
                                        person.profile_path &&
                                        <div>
                                            <img src={`https://image.tmdb.org/t/p/w185/${person.profile_path}`} className='w-15 h-15 rounded-full object-cover bg-[#303030] aspect-2/3' />
                                        </div>
                                    }
                                    {
                                        !person.profile_path &&
                                        <div className='w-15 h-15 rounded-full  bg-[#303030] items-center justify-center flex'>
                                            <img src='/logo.png' className='p-4' />
                                        </div>
                                    }
                                    <div className='flex flex-col gap-1'>
                                        <Link className='text-sm font-bold underline underline-offset-2 cursor-pointer' to={`/person/${person?.id}`}>{person?.name}</Link>
                                        <p className='text-xs text-white/50'>{person.known_for_department}</p>
                                        <p className='text-xs text-ellipsis text-white/50 line-clamp-2'>Known For: {person.known_for.map((m, i) => m.title || m.name).join(", ")}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default Search