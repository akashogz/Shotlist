import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tailspin } from 'ldrs';
import { Cake, Film, Home, Mars, MoveLeft, MoveRight, Signature, User, Venus } from 'lucide-react';
import api from "../lib/api/api.js";
import CareerTimeline from '../components/features/CareerTimeline.jsx';

function Person() {
    const { personId } = useParams();
    const [person, setPerson] = useState({});
    const [loading, setLoading] = useState(false);
    const [bioExpanded, setBioExpanded] = useState(false);
    const navigate = useNavigate();
    tailspin.register();

    useEffect(() => {
        setPerson({});
        setLoading(true)
        const fetchPerson = async () => {
            const res = await api.get(`movie/person/${personId}`).catch(err => ({ data: null }))
            console.log(res.data)
            setPerson(res.data);

            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }

        fetchPerson()
    }, [personId])

    const convertDateToText = (dateStr) => {
        const [year, month, day] = dateStr?.split('-');

        const dateObj = new Date(year, month - 1, day);

        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };


    if (loading) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                <l-tailspin
                    size="40"
                    stroke="4"
                    speed="0.9"
                    color="white"
                ></l-tailspin>
            </div>
        );
    }

    return (
        <div className={`md:p-20 p-5 pt-20 md:pt-28 h-full w-full flex flex-col gap-2 max-w-screen overflow-hidden ${loading ? `opacity-0` : `opacity-100`} transition-opacity duration-500 `}>
            <div className=''>
                <div className='bg-linear-to-b blur-sm from-[#464e8234] to-[#24242400] absolute w-screen h-80 -mt-20 md:-mt-28 -ml-5 md:-ml-20 -z-10'>
                    <img src={`https://image.tmdb.org/t/p/original${person?.profile_path}`} className='w-full h-80 blur-[120px] object-fit brightness-80'></img>
                </div>
                <div className='flex flex-col gap-5  items-center '>
                    <img
                        className='w-40 aspect-2/3 object-cover rounded-lg'
                        src={`https://image.tmdb.org/t/p/original${person?.profile_path}`}
                    />
                    <div className='flex gap-2 items-center'>
                        <h1 className='font-bold text-2xl'>{person?.name}</h1>
                        <p className={`text-xs bg-linear-to-br to-[#2424249a] ${person?.known_for_department == "Acting" ? `from-[#464e82d7]` : `from-[#658246d7]`} border border-white/50 px-3 rounded-lg font-regular`}>{person.known_for_department == "Acting" ? `Actor` : person.known_for_department == "Directing" ? `Director` : person.known_for_department}</p>
                    </div>
                    <div className='flex flex-wrap justify-center gap-2 text-sm'>
                        <div className='flex gap-2 items-center border px-3 py-2 rounded-full'>
                            <Cake size={14} color='gray' />
                            <p className='text-white/50 font-semibold text-xs'>Birthday</p>
                            {
                                person?.birthday &&
                                <p className='text-xs'>{convertDateToText(person?.birthday)}</p>
                            }
                        </div>
                        <div className='flex gap-2 items-center border px-3 py-2 rounded-full'>
                            <Home size={14} color='gray' />
                            <p className='text-white/50 font-semibold text-xs'>Birthplace</p>
                            <p className='text-xs'>{person.place_of_birth}</p>
                        </div>
                        <div className='flex gap-2 items-center border px-3 py-2 rounded-full'>
                            {person.gender == 1 ? <Venus size={14} color='gray' /> : person.gender == 2 ? <Mars size={14} color='gray' /> : <User size={14} color='gray' />}
                            <p className='text-white/50 font-semibold text-xs'>Gender</p>
                            <p className='text-xs'>{person.gender == 1 ? `Female` : person.gender == 2 ? `Male` : `Other`}</p>
                        </div>
                        <div className='flex gap-2 items-center border px-3 py-2 rounded-full'>
                            <Film size={14} color='gray' />
                            <p className='text-white/50 font-semibold text-xs'>Filmography</p>
                            <p className='text-xs'>{person?.known_for_department === "Acting" ? person?.combined_credits?.cast.length : person?.combined_credits?.crew.length
                            }</p>
                        </div>
                        <div className='flex gap-2 items-center border px-3 py-2 rounded-full'>
                            <Signature size={14} color='gray' />
                            <p className='text-white/50 font-semibold text-xs'>AKA</p>
                            <p className='text-xs max-w-40 line-clamp-1'>{person.also_known_as}</p>
                        </div>
                    </div>
                    <div className="transition-all duration-300">
                        <div
                            className={`overflow-hidden transition-all duration-500 ease-in-out relative ${bioExpanded ? "max-h-250" : "max-h-18"
                                }`}
                        >
                            <p className="text-sm leading-6 text-zinc-300">
                                {person.biography}
                            </p>

                            {!bioExpanded && (
                                <div className="absolute bottom-0 left-0 h-20 w-full bg-linear-to-t from-[#242424] to-transparent blur-[1px]" />
                            )}
                        </div>

                        <div className='h-full flex items-end justify-end'>
                            <button
                                onClick={() => setBioExpanded(!bioExpanded)}
                                className="mt-3 transition-all duration-200 border border-white/10 px-3 rounded-full hover:bg-white/5"
                            >
                                {bioExpanded ? (
                                    <p className="flex items-center gap-2 text-xs font-light">
                                        show less <MoveLeft size={16} />
                                    </p>
                                ) : (
                                    <p className="flex items-center gap-2 text-xs font-light">
                                        show more <MoveRight size={16} />
                                    </p>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-5 mt-10 w-full items-start'>
                        <h1 className='font-bold text-2xl'>Essential Films</h1>
                        <div className='overflow-y-scroll h-full w-full py-2 no-scrollbar px-2'>

                            <div className='flex w-full justify-between gap-2 overflow-visible'>
                                {(person?.known_for_department === "Acting"
                                    ? person?.combined_credits?.cast
                                    : person?.combined_credits?.crew
                                )
                                    ?.filter(
                                        (item) =>
                                            item.media_type === "movie" &&
                                            item.poster_path
                                    )
                                    ?.filter(
                                        (item, index, self) =>
                                            index ===
                                            self.findIndex((m) => m.id === item.id)
                                    )
                                    .sort((a, b) => b.vote_count - a.vote_count)
                                    .slice(0, 9)
                                    .map((m, i) => (
                                        <img
                                            key={`${m.id}-${i}`}
                                            src={`https://image.tmdb.org/t/p/w185${m.poster_path}`}
                                            className='w-35 aspect-2/3 rounded-lg transition-all duration-200 hover:brightness-80 hover:scale-105 cursor-pointer'
                                            onClick={() => navigate(`/movie/${m.id}`)}
                                        />
                                    ))}
                            </div>

                        </div>
                    </div>
                    <div className=' flex flex-col mt-10 w-full items-start'>
                        <h1 className='text-2xl font-bold'>Career Timeline</h1>
                        <CareerTimeline
                            movies={
                                person?.known_for_department === "Acting"

                                    ? person?.combined_credits?.cast
                                        ?.filter(
                                            (item) =>
                                                item.media_type === "movie" &&
                                                item.poster_path
                                        )

                                    : Object.values(

                                        (person?.combined_credits?.crew || [])

                                            .filter(
                                                (item) =>
                                                    item.media_type === "movie" &&
                                                    item.poster_path
                                            )

                                            .reduce((acc, item) => {

                                                if (!acc[item.id]) {

                                                    acc[item.id] = {
                                                        ...item,
                                                        jobs: [item.job],
                                                    };

                                                } else if (
                                                    item.job &&
                                                    !acc[item.id].jobs.includes(item.job)
                                                ) {

                                                    acc[item.id].jobs.push(item.job);
                                                }

                                                return acc;

                                            }, {})
                                    )
                            }
                        />
                    </div>

                    <div className='flex flex-col gap-5 mt-10 w-full items-start justify-start'>
                        <h1 className='font-bold text-2xl'>Socials</h1>
                        <div className='flex gap-5'>
                            <div className='flex gap-5 flex-wrap'>
                                {person?.external_ids?.tiktok_id && (
                                    <a
                                        href={`https://www.tiktok.com/@${person.external_ids.tiktok_id}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-sm flex items-center gap-2 rounded-full border px-3 py-1 bg-linear-to-br hover:from-[#2323237b] hover:to-[#4c4c4c4e] transition-all duration-300 hover:scale-105'
                                    >
                                        <img src='/tiktok.png' className='size-4' />
                                        <p>@{person.external_ids.tiktok_id}</p>
                                    </a>
                                )}
                                {person?.external_ids?.instagram_id && (
                                    <a
                                        href={`https://www.instagram.com/${person.external_ids.instagram_id}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-sm flex items-center gap-2 rounded-full border px-3 py-1 bg-linear-to-br hover:from-[#8234af7a] hover:to-[#f5852970] transition-all duration-300 hover:scale-105'
                                    >
                                        <img src='/instagram.png' className='size-4' />
                                        <p>@{person.external_ids.instagram_id}</p>
                                    </a>
                                )}
                                {person?.external_ids?.twitter_id && (
                                    <a
                                        href={`https://x.com/${person.external_ids.twitter_id}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-sm flex items-center gap-2 rounded-full border px-3 py-1 bg-linear-to-br hover:from-[#2323237b] hover:to-[#4c4c4c4e] transition-all duration-300 hover:scale-105'
                                    >
                                        <img src='/x.png' className='size-4' />
                                        <p>@{person.external_ids.twitter_id}</p>
                                    </a>
                                )}
                                {person?.external_ids?.imdb_id && (
                                    <a
                                        href={`https://www.imdb.com/name/${person.external_ids.imdb_id}`}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-sm flex items-center gap-2 rounded-full border px-3 py-1 bg-linear-to-br hover:from-[#f5c5187b] hover:to-[#2727274e] transition-all duration-300 hover:scale-105'
                                    >
                                        <img src='/imdb.png' className='size-4' />
                                        <p>IMDb</p>
                                    </a>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Person