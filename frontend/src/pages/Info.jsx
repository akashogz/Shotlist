import {
    Bookmark,
    BookOpen, Brain, Check, Clock, Columns4Icon, EllipsisVertical, ExternalLink, EyeIcon,
    FilmIcon, GhostIcon, HandFistIcon, Heart, HeartIcon, KeyIcon,
    LaughIcon, Menu, MountainIcon, MoveRight, Music, Pause, Pencil, Play, Plus, ReceiptText,
    Save,
    ShieldAlert, Sparkles, Star, Theater, TrainTrack, Trash, Tv, UsersIcon,
    X
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import ReviewField from "../components/ReviewField.jsx";
import api from "../lib/api/api.js";
import toast from "react-hot-toast";
import MoreModal from "../components/MoreModal.jsx";
import VideoPlayer from "../components/VideoPlayer.jsx";
import { tailspin } from 'ldrs'

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
    const [openMore, setOpenMore] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [isWatchListed, setIsWatchlisted] = useState(false);
    const [openTrailer, setOpenTrailer] = useState(false);
    const [loadingWatched, setLoadingWatched] = useState(false);
    const [loadingWatchlisted, setLoadingWatchlisted] = useState(false);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const isTrailerOpen = queryParams.get("trailer");

    const user = useAuthStore((s) => s.user);
    const setUser = useAuthStore((s) => s.setUser);
    const loggedIn = !!user;

    tailspin.register()

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const fetchMovieDetails = async () => {
                    const res = await api.get(`movie/${movieId}`)
                    setMovie(res.data);
                }
                fetchMovieDetails()

                const response = await api.get(`/user/fetchMovieReviews?tmdbId=${(movieId)}&viewerId=${user?._id || ''}`);
                setReviews(response.data.reviews || []);

                const watched = await api.get(`/user/checkWatched/${movieId}`);
                setIsWatched(watched.data.isWatched);
                setIsWatchlisted(watched.data.isWatchlisted);
            } catch (error) {
                console.error("Failed to fetch movie details:", error);
            }
        };
        if (isTrailerOpen === "open") setOpenTrailer(true);
        fetchAll();
        window.scrollTo(0, 0);
    }, [movieId, user?._id]);

    if (!movie) return <div className="h-screen bg-[#242424]" />;

    const recommendations = movie.recommendations?.results?.length
        ? movie.recommendations.results
        : movie.similar?.results || [];

    const handleAddToWatched = async () => {
        if (!loggedIn) {
            toast.error("Log in to interact");
            return navigate('/login');
        }

        try {
            setLoadingWatched(true);
            if (isWatched) {
                const res = await api.post('/user/removeFromWatched', { tmdbId: movie.id });
                toast.success(res.data.message);
                setIsWatched(false);
            } else {
                const res = await api.post('/user/addToWatched', {
                    movieId: movie.id,
                    title: movie.title,
                    posterPath: movie.poster_path
                });
                toast.success(res.data.message);
                setIsWatched(true);
            }
        } catch (err) {
            console.log(err)
            toast.error("Action failed");
        } finally {
            setLoadingWatched(false);
        }
    };

    const handleAddToWatchlist = async () => {
        if (!loggedIn) {
            toast.error("Log in to interact");
            return navigate('/login');
        }

        try {
            setLoadingWatchlisted(true);
            if (isWatchListed) {
                const res = await api.post('/user/removeFromWatchlist', { tmdbId: movie.id });
                toast.success(res.data.message);
                setIsWatchlisted(false);
            } else {
                setLoadingWatchlisted(true);
                const res = await api.post('/user/addToWatchlist', {
                    movieId: movie.id,
                    title: movie.title,
                    posterPath: movie.poster_path
                });
                toast.success(res.data.message);
                setIsWatchlisted(true);
            }
        } catch (err) {
            console.log(err)
            toast.error("Action failed");
        } finally {
            setLoadingWatchlisted(false);
        }
    };

    const handleLike = async (reviewId) => {
        try {
            if (!loggedIn) {
                toast.error("Log in to interact");
                return navigate('/login');
            }
            console.log(reviewId)
            const res = await api.post(`/like/likeToggle`, { reviewId });
            const { isLiked: serverIsLiked, message } = res.data;
            console.log(res)
            setReviews((prevItems) =>
                prevItems.map((item) => {
                    if (item._id === reviewId) {
                        const newIsLiked = serverIsLiked !== undefined ? serverIsLiked : !item.isLiked;
                        return {
                            ...item,
                            isLiked: newIsLiked,
                            likesCount: newIsLiked
                                ? (item.likesCount || 0) + 1
                                : Math.max(0, (item.likesCount || 0) - 1)
                        };
                    }
                    return item;
                })
            );
            toast.success(message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="w-screen bg-[#242424] text-white overflow-x-hidden -z-10">
            {/* BACKDROP */}
            <div className={`relative h-100 sm:h-96 md:h-150 ${openTrailer ? `blur-lg` : ``} duration-300 ease-in-out`}>
                <img
                    src={`https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}`}
                    className="absolute h-full w-full object-cover object-top"
                    alt=""
                    loading="eager"
                    fetchPriority="high"
                />
                <div className="absolute inset-0 bg-linear-to-b from-[#464e8253] to-[#242424] min-h-full" />
            </div>

            {/* CONTENT WRAPPER */}
            <div className={`mx-auto px-4 sm:px-8 lg:px-20 md:-mt-120 -mt-70 relative z-10 pb-20`}>

                {/* HERO SECTION */}
                <div className={`flex flex-col gap-8 items-center md:items-start transition-all duration-1000 ease-in-out`}>
                    <div className="shrink-0 flex flex-col gap-4 items-center w-full h-full">
                        {
                            !openTrailer &&
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                className={`w-40 sm:w-45 md:w-50 rounded-xl shadow-sm border border-white/10 ${!openTrailer ? `opacity-100 scale-100` : `opacity-0 pointer-events-none scale-90`} transition-all duration-200`}
                                alt={movie.title}
                            />
                        }

                        {
                            openTrailer &&
                            <div className={`flex w-full h-full justify-center gap-3 items-center ${openTrailer ? `opacity-100 scale-100` : `opacity-0 pointer-events-none scale-90`} transition-all duration-200`}>
                                <VideoPlayer video={movie.videos?.results?.find(m => m.name.includes("Trailer"))} isOpen={openTrailer} />
                            </div>
                        }
                        <div className="gap-2 flex w-45 sm:w-45 md:w-50">
                            <button
                                onClick={() => setOpenTrailer(!openTrailer)}
                                className={`bg-white hover:bg-white/70 ease-in-out w-2/4 duration-300 flex gap-2 items-center justify-center p-3 rounded-full font-bold transition-all duration-300'
                                    }`}
                            >
                                <div className="relative flex items-center justify-center">
                                    <div className={`absolute transition-all duration-300 ease-in-out ${openTrailer ? 'opacity-100 scale-100' : 'opacity-0 scale-50 '}`}>
                                        <Pause size={18} color="black" />
                                    </div>
                                    <div className={`absolute transition-all duration-300 ease-in-out ${!openTrailer ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                                        <Play size={18} color="black" />
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={handleAddToWatched}
                                className={`flex gap-2 items-center justify-center p-3 w-1/4 aspect-square rounded-full font-bold transition-all duration-300 ${isWatched && !loadingWatched ? 'bg-white text-black' : 'bg-[#464E82] text-white hover:bg-[#5a65a3]'
                                    }`}
                            >
                                {
                                    !loadingWatched &&
                                    <div className="flex items-center justify-center">
                                        <div className={`absolute transition-all duration-300 ease-in-out ${isWatched ? 'opacity-100 scale-100' : 'opacity-0 scale-50 rotate-90'}`}>
                                            <Check size={18} color="black" />
                                        </div>
                                        <div className={`absolute transition-all duration-300 ease-in-out ${!isWatched ? 'opacity-100 scale-100' : 'opacity-0 scale-50 -rotate-90'}`}>
                                            <Plus size={18} color="white" />
                                        </div>
                                    </div>
                                }
                                {
                                    loadingWatched &&
                                    <l-tailspin
                                        size="20"
                                        stroke="2"
                                        speed="0.9"
                                        color="white"
                                    ></l-tailspin>
                                }
                            </button>
                            <button
                                onClick={() => handleAddToWatchlist()}
                                className={`flex gap-2 items-center justify-center p-3 w-1/4 aspect-square rounded-full font-bold transition-all duration-300 ${isWatchListed && !loadingWatchlisted ? 'bg-white text-black' : 'bg-[#464E82] text-white hover:bg-[#5a65a3]'
                                    }`}
                            >
                                {
                                    !loadingWatchlisted &&
                                    <div className="flex items-center justify-center">
                                        <div className={`absolute transition-all duration-300 ease-in-out ${isWatchListed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 rotate-90'}`}>
                                            <Bookmark size={18} color="black" fill="black" />
                                        </div>
                                        <div className={`absolute transition-all duration-300 ease-in-out ${!isWatchListed ? 'opacity-100 scale-100' : 'opacity-0 scale-50 -rotate-90'}`}>
                                            <Bookmark size={18} color="white" />
                                        </div>
                                    </div>
                                }
                                {
                                    loadingWatchlisted &&
                                    <l-tailspin
                                        size="20"
                                        stroke="2"
                                        speed="0.9"
                                        color="white"
                                    ></l-tailspin>
                                }
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 text-center md:text-left items-center w-full">
                        <h1 className="text-4xl md:text-6xl font-black w-full text-center">{movie.title}</h1>
                        {movie.tagline && <p className="italic text-white/70 text-center w-full">"{movie.tagline}"</p>}

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
                        {movie["watch/providers"]?.results?.[country]?.flatrate?.map((p, i) => (
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
                        <div className="flex justify-between mb-6 items-center">
                            <h3 className="text-2xl font-bold ">Cast</h3>
                            <button className="flex gap-2 rounded-full bg-[#464E82] p-2 px-5 text-sm font-bold items-center" onClick={() => setOpenMore(true)}>View All <MoveRight /></button>
                        </div>
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
                                            <p className={`text-sm leading-relaxed text-white/90 duration-150 transition-opacity`} >{i.text}</p>
                                        </div>
                                    </div>
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
                                src={`https://image.tmdb.org/t/p/w154${m.poster_path}`}
                                className="h-50 rounded-lg cursor-pointer hover:scale-105 ease-in-out duration-300"
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
                    <div className="grid grid-cols-1 md:grid-cols-1 bg-[#3D3D3D] rounded-b-xl overflow-hidden text-sm">
                        {[
                            ["Release Date", movie.release_date],
                            ["Language", movie.spoken_languages?.map(l => l.english_name).join(", ")],
                            ["Directed By", movie.credits.crew.find(i => i.known_for_department === "Directing")?.name],
                            ["Produced By", movie.production_companies?.map(p => p.name).join(", ")],
                            ["Budget", movie.budget ? `$${movie.budget.toLocaleString()}` : "N/A"],
                            ["Revenue", movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"],
                            ["Status", movie.status],
                            ["IMDb", <span className="flex gap-2 items-center"><ExternalLink size={14} /><a href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" className="text-blue-300 hover:underline">View Page</a></span>]
                        ].map(([label, value], i) => (
                            <div key={i} className="flex border-white/5 border">
                                <div className="p-4 text-white/40 bg-[#3D3D3D] border-r border-white/5 items-center w-1/2 flex justify-center">{label}</div>
                                <div className="w-1/2 flex items-center justify-center p-4 font-medium">{value}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <MoreModal items={movie.credits?.cast} open={openMore} title={"Cast"} setOpenMore={setOpenMore} />
        </div>
    );
}

export default Info;