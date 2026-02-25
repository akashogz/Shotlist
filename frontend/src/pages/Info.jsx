import {
    BookOpen, Brain, Check, Clock, Columns4Icon, EllipsisVertical, ExternalLink, EyeIcon,
    FilmIcon, GhostIcon, HandFistIcon, Heart, HeartIcon, KeyIcon,
    LaughIcon, Menu, MountainIcon, MoveRight, Music, Pencil, Plus, ReceiptText,
    ShieldAlert, Sparkles, Star, Theater, TrainTrack, Trash, Tv, UsersIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { getMovieDetails } from "../lib/api/movie.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import ReviewField from "../components/ReviewField.jsx";
import api from "../lib/api/api.js";
import toast from "react-hot-toast";

const GENRE_ICONS = {
    Action: <HandFistIcon size={16} />,
    Adventure: <MountainIcon size={16} />,
    Animation: <FilmIcon size={16} />,
    Comedy: <LaughIcon size={16} />,
    Crime: <Columns4Icon size={16} />,
    Documentary: <BookOpen size={16} />,
    Drama: <Theater size={16} />,
    Family: <UsersIcon size={16} />,
    Fantasy: <Sparkles size={16} />,
    History: <Clock size={16} />,
    Horror: <GhostIcon size={16} />,
    Music: <Music size={16} />,
    Mystery: <KeyIcon size={16} />,
    Romance: <HeartIcon size={16} />,
    "Science Fiction": <Brain size={16} />,
    "TV Movie": <Tv size={16} />,
    Thriller: <EyeIcon size={16} />,
    War: <ShieldAlert size={16} />,
    Western: <TrainTrack size={16} />
};

function Info() {
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [country, setCountry] = useState("US");
    const { movieId } = useParams();
    const navigate = useNavigate();
    const [editReview, setEditReview] = useState(false);

    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const loggedIn = !!user;

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const movieData = await getMovieDetails(movieId);
                setMovie(movieData);

                const response = await api.get(`/user/fetchMovieReviews?tmdbId=${Number(movieData.id)}&viewerId=${user?._id || ''}`);
                setReviews(response.data.reviews || []);
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            }
        };
        fetchAll();
        window.scrollTo(0, 0);
    }, [movieId, user?._id]);

    if (!movie) return <div className="h-screen bg-[#242424]" />;

    const recommendations = movie.recommendations?.results?.length
        ? movie.recommendations.results
        : movie.similar?.results || [];

    const isWatched = user?.watched?.some(m => m.movieId === movie.id);

    const handleAddToWatched = async () => {
        if (!loggedIn) {
            toast.error("Log in to interact");
            return navigate('/login');
        }

        try {
            let updatedWatched;
            if (isWatched) {
                const res = await api.post('/user/removeFromWatched', { tmdbId: movie.id });
                toast.success(res.data.message);
                updatedWatched = user.watched.filter(m => m.movieId !== movie.id);
            } else {
                const res = await api.post('/user/addToWatched', {
                    movieId: movie.id,
                    title: movie.title,
                    posterPath: movie.poster_path
                });
                toast.success(res.data.message);
                updatedWatched = [...user.watched, {
                    movieId: movie.id,
                    title: movie.title,
                    posterPath: movie.poster_path
                }];
            }
            setUser({ ...user, watched: updatedWatched });
        } catch (err) {
            toast.error("Action failed");
        }
    };

    return (
        <div className="w-screen bg-[#242424] text-white overflow-x-hidden -z-10">
            {/* BACKDROP */}
            <div className="relative h-100 sm:h-96 md:h-125">
                <img
                    src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`}
                    className="absolute h-full w-full object-cover object-top"
                    alt=""
                />
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#242424] h-full" />
            </div>

            {/* CONTENT WRAPPER */}
            <div className=" mx-auto px-4 sm:px-8 lg:px-20 md:-mt-70 -mt-70 relative z-10 pb-20">

                {/* HERO SECTION */}
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="shrink-0 flex flex-col gap-4 items-center">
                        <img
                            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                            className="w-40 sm:w-45 md:w-50 rounded-xl shadow-2xl border border-white/10"
                            alt={movie.title}
                        />
                        <button
                            onClick={handleAddToWatched}
                            className={`flex gap-2 items-center justify-center p-3 rounded-full w-full font-bold transition-all duration-300 ${isWatched ? 'bg-white text-black' : 'bg-[#464E82] text-white hover:bg-[#5a65a3]'
                                }`}
                        >
                            {isWatched ? <Check size={18} /> : <Plus size={18} />}
                            {isWatched ? "Watched" : "Add to Watched"}
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-black">{movie.title}</h1>
                        {movie.tagline && <p className="italic text-white/70">"{movie.tagline}"</p>}

                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="bg-[#4C4C4C] px-3 py-1 rounded-full text-sm shadow-sm">{movie.release_date?.slice(0, 4)}</span>
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="bg-[#4C4C4C] px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm">
                                    {GENRE_ICONS[genre.name]} {genre.name}
                                </span>
                            ))}
                            <span className="bg-[#4C4C4C] px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-sm">
                                <Star size={14} fill="currentColor" /> {movie.vote_average?.toFixed(1)}/10
                            </span>
                            <span className="bg-[#4C4C4C] px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-sm">
                                <Clock size={14} />{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                            </span>
                        </div>

                        <p className="text-md text-white/80 leading-relaxed">{movie.overview}</p>
                    </div>
                </div>


                <div>
                    <div className="flex justify-between items-center mb-6 mt-16">
                        <h3 className="text-2xl font-bold">Where to Watch</h3>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-sm focus:bg-black/80"
                        >
                            {["US", "IN", "GB", "AU", "CA"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {movie["watch/providers"]?.results?.[country]?.buy?.map((p, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
                                <img src={`https://image.tmdb.org/t/p/original${p.logo_path}`} className="size-10 rounded-md" />
                                <div>
                                    <p className="text-sm font-medium">{p.provider_name}</p>
                                    <p className="text-xs text-white/40">Buy</p>
                                </div>
                            </div>
                        )) || <p className="text-white/40 text-sm">No streaming options found for this region.</p>}
                    </div>
                </div>

                <section className="mt-10 gap-12">
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-bold mb-6">Cast</h3>
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {movie.credits?.cast?.slice(0, 10).map(actor => (
                                <div key={actor.id} className="shrink-0 w-28 md:w-32">
                                    {
                                        actor.profile_path ?
                                            <img
                                                src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                                className="h-40 w-full object-cover rounded-lg mb-2 bg-white/5"
                                            /> :
                                            <img src="/logo.png"
                                                className="h-40 w-full object-cover rounded-lg mb-2 bg-white/5 p-10" />
                                    }
                                    <p className="text-sm font-bold truncate">{actor.name}</p>
                                    <p className="text-xs text-white/50 truncate">{actor.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* REVIEWS */}
                <section className="mt-10">
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="text-3xl font-bold">Community Reviews</h3>
                        {reviews.length > 3 && (
                            <button className="text-[#464E82] font-semibold flex items-center gap-2 hover:underline">
                                View all {reviews.length} <MoveRight size={16} />
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {reviews.slice(0, 3).map(i => (
                            <div key={i._id} className="flex flex-col gap-3 bg-[#303030] rounded-lg p-3 justify-between w-full max-w-md">
                                <div className="flex flex-col gap-2">
                                    <div className='flex justify-between items-start'>
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className='flex gap-2 items-center justify-between w-full'>
                                                <div className="flex gap-2">
                                                    <img
                                                        src={`https://api.dicebear.com/9.x/glass/svg?seed=${i.avatarSeed}`}
                                                        className="size-9 rounded-full object-cover"
                                                        alt={i.username}
                                                    />
                                                    <div>
                                                        <p className="font-medium text-white/50 text-sm">{i.username}</p>
                                                        <p className="text-xs text-white/50">
                                                            {new Date(i.createdAt).toLocaleDateString('en-GB', {
                                                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="bg-[#3a3a3a] p-2 rounded-lg hover:rounded-[50px] duration-300 transition-all ease-in-out" onClick={() => setEditReview(true)}><Pencil size={16} className=""/></div>
                                                    <div className="bg-[#3a3a3a] p-2 rounded-lg hover:rounded-[50px] duration-300 transition-all ease-in-out"><Trash size={16}/></div>
                                                </div>
                                            </div>
                                            <span className='flex gap-1 text-sm'><p className='font-semibold text-white text-[14px]'>{i.movieName}</p></span>
                                            <div className='flex items-center gap-1 h-full'>
                                                <div className='flex'>
                                                    {[1, 2, 3, 4, 5].map((idx) => (
                                                        <div key={idx} className='flex'>
                                                            {idx - 0.5 <= i.rating && <img src='/star-half-left.png' className='h-4' />}
                                                            {idx <= i.rating && <img src='/star-half-right.png' className='h-4' />}
                                                            {idx - 0.5 > i.rating && <img src='/star-half.png' className='h-4' />}
                                                            {idx > i.rating && <img src='/star-half-r.png' className='h-4' />}
                                                        </div>
                                                    ))}
                                                </div>
                                                <p className='text-sm text-white/50'>({i.rating})</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className={`text-sm leading-relaxed text-white/90 ${editReview ? `hidden` : ``} duration-150 transition-opacity`} >{i.text}</p>
                                    <textarea className={`bg-[#525252] focus:outline-0 border border-white/50 rounded-lg p-1 text-sm no-scrollbar ${editReview ? `` : `hidden`}`} />
                                    <button className="w-full bg-[#464E82] p-2 rounded-lg text-sm font-bold">Edit</button>
                                </div>

                                <div className="flex justify-end items-center gap-1.5 text-xs text-white/60">
                                    <div className='flex gap-1 items-center'>
                                        <div className="flex items-center justify-center">
                                            <Heart
                                                size={14}
                                                className={`cursor-pointer transition-all ${i.isLiked ? "fill-red-500 text-red-500 scale-110" : "hover:text-white"}`}
                                                onClick={() => handleLike(i._id)}
                                            />
                                        </div>
                                        <p className="leading-none select-none">
                                            {i.likesCount || 0} Likes
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {reviews.length === 0 && (
                            <div className="col-span-full text-center py-12 bg-white/5 rounded-xl border border-dashed border-white/20">
                                <GhostIcon className="mx-auto mb-2 opacity-20" size={48} />
                                <p className="text-white/40 text-sm">Be the first to review {movie.title}!</p>
                            </div>
                        )}
                    </div>

                    {loggedIn ? (
                        <ReviewField tmdbId={movie.id} movieName={movie.title} posterPath={movie.poster_path} />
                    ) : (
                        <div className="bg-white/5 p-6 rounded-xl text-center text-sm">
                            <p>Please <Link to="/login" className="text-[#464E82] underline font-bold">Login</Link> to share your thoughts.</p>
                        </div>
                    )}
                </section>

                {/* RECOMMENDATIONS */}
                <section className="mt-16">
                    <h3 className="text-3xl font-bold mb-6">More Like This</h3>
                    <div className="flex gap-4 overflow-x-auto pb-6 no-scrollbar">
                        {recommendations.slice(0, 10).map(m => (
                            <img
                                key={m.id}
                                onClick={() => navigate(`/movie/${m.id}`)}
                                src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                                className="h-50 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-300"
                                alt={m.title}
                            />
                        ))}
                    </div>
                </section>

                {/* FULL DATA TABLE */}
                <section className="mt-16">
                    <div className="bg-[#303030] p-4 rounded-t-xl flex items-center gap-2 border-b border-white/10">
                        <ReceiptText size={20} />
                        <h3 className="font-bold">Production Details</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 bg-[#3D3D3D] rounded-b-xl overflow-hidden text-sm">
                        {[
                            ["Release Date", movie.release_date],
                            ["Language", movie.spoken_languages?.map(l => l.english_name).join(", ")],
                            ["Budget", movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"],
                            ["Revenue", movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"],
                            ["Status", movie.status],
                            ["IMDb", <a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" className="text-blue-400 hover:underline">View Page</a>]
                        ].map(([label, value], i) => (
                            <div key={i} className="flex border-white/5 border">
                                <div className="w-1/3 p-4 text-white/40 bg-[#3D3D3D] border-r border-white/5">{label}</div>
                                <div className="w-2/3 p-4 font-medium">{value}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Info;