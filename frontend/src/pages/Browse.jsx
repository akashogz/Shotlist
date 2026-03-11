import React, { useEffect, useState } from "react";
import FilterSystem from "../components/FilterSystem";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import api from "../lib/api/api";

function Browse() {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentIndices, setCurrentIndices] = useState([1, 2, 3, 4, 5]);
    const [filters, setFilters] = useState({
        sort_by: "",
        genres: [],
        releaseStart: null,
        releaseEnd: null,
        language: null,
    });

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await api.get('/movie/discover', {
                    params: {
                        page: currentPage,
                        ...filters
                    }
                });
                setMovies(res.data);
            } catch (err) {
                console.error("Discovery error:", err);
            }
        };

        fetchMovies();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, filters]);

    const handleNextIndices = () => {
        setCurrentIndices((prev) => {
            const last = prev[prev.length - 1];
            return Array.from({ length: 5 }, (_, i) => last + i + 1);
        });
    };

    const handlePrevIndices = () => {
        setCurrentIndices((prev) => {
            const first = prev[0];
            const start = Math.max(1, first - 5);
            return Array.from({ length: 5 }, (_, i) => start + i);
        });
    };

    return (
        <div className="flex flex-col min-h-screen">
            <FilterSystem setFilters={setFilters} />

            <div className="flex-1 flex flex-col lg:ml-65">
                <div className="p-2 pt-5 sm:p-5 md:p-10 lg:p-20">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 place-items-center">
                        {movies.map((movie) => (
                            <MoviePoster key={movie.id} movie={movie} />
                        ))}
                    </div>

                    <div className="flex flex-col w-full justify-center items-center mt-12 gap-4">
                        <p className="text-sm font-medium text-gray-400">Page {currentPage}</p>
                        <div className="flex items-center gap-2">
                            <button className="bg-[#383838] hover:bg-[#262626] sm:block hidden p-2 px-5 rounded-lg text-sm transition-colors border border-[#434343]"
                                onClick={handlePrevIndices}>Prev</button>

                            <div className="flex gap-2">
                                {currentIndices.map((i) => (
                                    <button
                                        key={i}
                                        className={`w-10 h-10 rounded-lg text-sm transition-all duration-300 ${i === currentPage
                                                ? "bg-[#464E82] text-white font-bold"
                                                : "bg-[#2e2e2e] text-gray-400 hover:bg-[#333]"
                                            }`}
                                        onClick={() => setCurrentPage(i)}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>

                            <button className="bg-[#383838] hover:bg-[#262626] sm:block hidden p-2 px-5 rounded-lg text-sm transition-colors border border-[#434343]"
                                onClick={handleNextIndices}>Next</button>
                        </div>
                        <div className="flex gap-2">
                            <button className="bg-[#383838] sm:hidden hover:bg-[#262626] p-2 px-5 rounded-lg text-sm transition-colors border border-[#434343]"
                                onClick={handlePrevIndices}>Prev</button>
                            <button className="bg-[#383838] hover:bg-[#262626]  sm:hidden p-2 px-5 rounded-lg text-sm transition-colors border border-[#434343]"
                                onClick={handleNextIndices}>Next</button>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}

const MoviePoster = ({ movie }) => {
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    return (
        <div
            className="group relative cursor-pointer items-center flex flex-col"
            onClick={() => navigate(`/movie/${movie?.id}`)}
        >
            <div className="aspect-2/3 w-35 md:45 rounded-xl bg-[#1A1A1A] group">
                {!loaded && (
                    <div className="absolute inset-0 animate-pulse bg-[#262626]" />
                )}
                <img
                    loading="lazy"
                    src={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
                    alt={movie.title}
                    onLoad={() => setLoaded(true)}
                    className={`h-full w-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"
                        }`}
                />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-200 truncate w-35 md:w-45 group-hover:text-white transition-colors text-center">
                {movie.title}
            </h3>
        </div>
    );
};

export default Browse;