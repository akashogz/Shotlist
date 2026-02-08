import {
    BookOpen, Brain, Clock, Columns4Icon, ExternalLink, EyeIcon,
    FilmIcon, GhostIcon, HandFistIcon, Heart, HeartIcon, KeyIcon,
    LaughIcon, MountainIcon, MoveRight, Music, Plus, ReceiptText,
    ShieldAlert, Sparkles, Star, Theater, TrainTrack, Tv, UsersIcon
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { getMovieDetails } from "../lib/api/movie.js";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";

function Info() {
    const [movie, setMovie] = useState(null);
    const { movieId } = useParams();
    const navigate = useNavigate();

    const g = {
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

    const [country, setCountry] = useState("US");
    const user = useAuthStore((s) => s.user);
    const loggedIn = !!user;

    useEffect(() => {
        const fetchMovie = async () => {
            const data = await getMovieDetails(movieId);
            setMovie(data);
        };
        fetchMovie();
    }, [movieId]);

    if (!movie) return null;

    const recc =
        movie.recommendations.results.length !== 0
            ? movie.recommendations.results
            : movie.similar.results;

    return (
        <div>
            {/* BACKDROP */}
            <div className="relative h-48 sm:h-64 md:h-70 w-full -z-10">
                <img
                    src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                    className="absolute h-96 sm:h-112 md:h-160 w-full object-cover object-top"
                    alt={movie.title}
                />
                <div className="absolute w-full bg-linear-to-b h-96 sm:h-112 md:h-160 from-[#464e8263] to-[#242424]" />
            </div>

            {/* CONTENT */}
            <div className="flex flex-col p-4 sm:p-8 md:p-12 lg:p-20 gap-6 md:gap-10 -mt-30 md:-mt-50">

                {/* POSTER + INFO */}
                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                    <div className="flex flex-col gap-3 items-center md:items-start justify-center">
                        <img
                            src={`https://image.tmdb.org/t/p/w1280/${movie.poster_path}`}
                            className="w-40 sm:w-48 md:w-55 rounded-lg shadow-2xl"
                            alt={movie.title}
                        />
                        <div className="w-full flex justify-center">
                            <button className="flex gap-1 text-sm font-semibold items-center justify-center bg-[#464E82] rounded-full p-3 shadow-2xl md:w-auto">
                                <Plus size={16} /> Add to Watched
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-shadow-2xl">
                            {movie.title}
                        </h1>
                        <h2 className="italic text-sm sm:text-md text-shadow-2xl">
                            ~ {movie.tagline}
                        </h2>

                        <div className="flex flex-wrap gap-2">
                            <span className="bg-[#4C4C4C] text-sm p-1 px-2 rounded-full">
                                {movie.release_date.slice(0, 4)}
                            </span>
                            {movie.genres.map((genre, index) => (
                                <span
                                    key={index}
                                    className="bg-[#4C4C4C] text-sm p-1 px-2 rounded-full flex gap-1 items-center"
                                >
                                    {g[genre.name]} {genre.name}
                                </span>
                            ))}
                            <span className="bg-[#4C4C4C] text-sm p-1 px-2 rounded-full flex gap-1 items-center">
                                <Star size={16} /> {(Math.floor(movie.vote_average * 10)) / 10}
                            </span>
                            <span className="bg-[#4C4C4C] text-sm p-1 px-2 rounded-full flex gap-1 items-center">
                                <Clock size={16} />
                                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                            </span>
                        </div>

                        <p className="text-sm sm:text-base leading-relaxed text-shadow-2xl">
                            {movie.overview}
                        </p>
                    </div>
                </div>

                {/* WHERE TO WATCH */}
                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 items-center">
                        <h1 className="font-bold text-2xl sm:text-3xl">Where to Watch</h1>
                        <select
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="p-1 rounded-lg text-sm bg-[#434343] active:outline-0"
                        >
                            <option value="US">US</option>
                            <option value="IN">IN</option>
                            <option value="EN">EN</option>
                            <option value="AU">AU</option>
                            <option value="CN">CN</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {movie["watch/providers"]?.results?.[country]?.buy?.length ? (
                            movie["watch/providers"].results[country].buy.map((p, i) => (
                                <div key={i} className="flex gap-2 items-center">
                                    <img
                                        src={`https://image.tmdb.org/t/p/original${p.logo_path}`}
                                        className="size-10 rounded-lg"
                                    />
                                    <div>
                                        <p className="text-sm">{p.provider_name}</p>
                                        <p className="text-xs text-white/50">Buy</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No options available in your country</p>
                        )}
                    </div>
                </div>

                {/* CAST */}
                <div className="flex flex-col gap-5">
                    <div className="flex justify-between">
                        <h1 className="font-bold text-2xl sm:text-3xl">Cast</h1>
                        <button className="bg-[#464E82] rounded-full h-10 p-3 px-5 text-sm md:flex gap-2 items-center hidden">
                            <MoveRight size={16} /> View All
                        </button>
                    </div>
                    <div className="flex gap-3 overflow-x-scroll no-scrollbar">
                        {movie.credits.cast.slice(0, 9).map((actor, index) => (
                            <div key={index} className="flex w-full flex-col gap-2">
                                {actor.profile_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                                        className="md:h-40 w-full h-20 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="h-40 bg-white/20 rounded-lg flex items-center justify-center">
                                        <img src="/logo.png" className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="flex flex-col w-20 md:w-35">
                                    <p className="text-sm font-semibold">{actor.name}</p>
                                    <p className="text-xs text-white/50">as {actor.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* COMMUNITY REVIEWS */}
                <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-[1fr_auto] items-center">
                        <h1 className="font-bold text-2xl sm:text-3xl">
                            Reviews from the community...
                        </h1>
                        <button className="bg-[#464E82] rounded-full h-10 p-3 px-5 text-sm md:flex gap-2 items-center hidden">
                            <MoveRight size={16} /> View All Reviews
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* REVIEW 1 */}
                        <div className="flex flex-col gap-3 bg-[#303030] rounded-lg p-4 justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2 items-center">
                                    <img
                                        src="../public/user1.png"
                                        className="size-9 rounded-full object-cover"
                                        alt="User"
                                    />
                                    <div>
                                        <p className="font-bold">DailyDoseOfMarvel</p>
                                        <p className="text-xs text-white/50">
                                            Tuesday, 14 May 2024
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed">
                                    My favorite Spidey version! The skateboarding, the humor, the
                                    suit — everything just clicks. Also, the Gwen & Peter
                                    storyline is SO much better than usual superhero love
                                    interests. Deserves more appreciation!
                                </p>
                            </div>
                            <div className="flex gap-1 justify-end items-center text-xs">
                                <Heart size={14} /> 198 Likes
                            </div>
                        </div>

                        {/* REVIEW 2 */}
                        <div className="flex flex-col gap-3 bg-[#303030] rounded-lg p-4 justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2 items-center">
                                    <img
                                        src="../public/user.png"
                                        className="size-9 rounded-full object-cover"
                                        alt="User"
                                    />
                                    <div>
                                        <p className="font-bold">WebSlinger</p>
                                        <p className="text-xs text-white/50">
                                            Monday, 18 June 2024
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed">
                                    Andrew Garfield brought a fresh, witty energy to Spider-Man
                                    that I loved. The chemistry with Emma Stone was top-tier
                                    superhero romance. Some story beats felt rushed, but overall
                                    it’s an awesome reboot with great web-swinging shots!
                                </p>
                            </div>
                            <div className="flex gap-1 justify-end items-center text-xs">
                                <Heart size={14} /> 154 Likes
                            </div>
                        </div>

                        {/* REVIEW 3 */}
                        <div className="flex flex-col gap-3 bg-[#303030] rounded-lg p-4 justify-between">
                            <div className="flex flex-col gap-3">
                                <div className="flex gap-2 items-center">
                                    <img
                                        src="../public/user2.png"
                                        className="size-9 rounded-full object-cover"
                                        alt="User"
                                    />
                                    <div>
                                        <p className="font-bold">NerdyNarrator</p>
                                        <p className="text-xs text-white/50">
                                            Thursday, 23 September 2024
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm leading-relaxed">
                                    Visually impressive and stylish, but the plot tries to juggle
                                    too much at once. Still, the action scenes are a blast and
                                    Garfield nails the awkward-but-cool vibe of Peter Parker.
                                </p>
                            </div>
                            <div className="flex gap-1 justify-end items-center text-xs">
                                <Heart size={14} /> 128 Likes
                            </div>
                        </div>
                        <button className="bg-[#464E82] rounded-full h-10 p-3 px-5 text-sm gap-2 items-center flex md:hidden justify-center">
                            <MoveRight size={16} /> View All Reviews
                        </button>
                    </div>

                    {/* LOGIN PROMPT */}
                    {!loggedIn && (
                        <div className="font-semibold flex gap-2">
                            Please log in to leave a review.
                            <Link to="/signup" className="underline font-medium">
                                Login / Signup
                            </Link>
                        </div>
                    )}
                </div>


                {/* MORE LIKE THIS */}
                <div className="flex flex-col gap-4">
                    <h1 className="font-bold text-2xl sm:text-3xl">More like this</h1>
                    <div className="flex justify-between gap-5 overflow-x-scroll md:overflow-visible">
                        {recc.slice(0, 5).map((m, i) => (
                            <img
                                key={i}
                                onClick={() => navigate(`/movie/${m.id}`)}
                                src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                                className="h-50 sm:h-70 rounded-lg hover:brightness-50 shrink-0 cursor-pointer"
                            />
                        ))}
                    </div>
                </div>

            </div>
            {/* FULL DETAILS */}
            <div className="flex flex-col gap-2 px-3 md:px-20">
                <div className="bg-[#303030] p-3 px-6 sm:px-8 rounded-lg flex gap-2 items-center">
                    <p className="font-semibold">Full Details</p>
                    <ReceiptText size={16} />
                </div>

                <div className="grid grid-cols-1 bg-[#3D3D3D] rounded-lg text-xs sm:text-sm overflow-hidden">

                    {[
                        ["Release Date", movie.release_date],
                        ["Language", movie.spoken_languages.map(l => l.english_name).join(", ")],
                        ["Production", movie.production_companies.map(p => p.name).join(", ")],
                        ["Budget", `$${movie.budget.toLocaleString()}`],
                        ["Revenue", `$${movie.revenue.toLocaleString()}`],
                        ["Popularity", movie.popularity],
                        ["Status", movie.status],
                    ].map(([label, value], index) => (
                        <div className="flex w-full" key={index}>
                            <div className="w-1/2 p-3 sm:p-4 border-b border-r border-[#303030] text-white/50 text-center">
                                {label}
                            </div>
                            <div className="w-1/2 p-3 sm:p-4 border-b border-[#303030] text-center font-semibold">
                                {value}
                            </div>
                        </div>
                    ))}

                    {/* IMDb */}
                    <div className="flex w-full">
                        <div className="w-1/2 p-3 sm:p-4 border-r border-[#303030] text-white/50 text-center">
                            IMDb Page
                        </div>
                        <div className="w-1/2 p-3 sm:p-4 text-center font-semibold">
                            <a
                                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 hover:underline"
                            >
                                <ExternalLink size={14} />
                                Open Page
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Info;
