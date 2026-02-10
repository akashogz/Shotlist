import React, { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";
import { fetchDiscoverMovies } from "../lib/api/discover";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";


function Browse() {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentIndices, setCurrentIndices] = useState([1, 2, 3, 4, 5]);
    const [filters, setFilters] = useState({
        sortBy: null,
        genres: [],
        releaseStart: null,
        releaseEnd: null,
        runtimeMax: null,
        language: null,
        certification: null,
    });

    useEffect(() => {
        const fetchMovies = async () => {
            const data = await fetchDiscoverMovies(currentPage, filters);
            setMovies(data);

            console.log(data)
        }

        fetchMovies();
    }, [currentPage, filters])

    const handlePageChange = () => {

    }

    const handleNextIndices = () => {
        setCurrentIndices((prev) => {
            const last = prev[prev.length - 1];
            return Array.from({ length: 5 }, (_, i) => last + i + 1);
        });
    }

    const handlePrevIndices = () => {
        setCurrentIndices((prev) => {
            const first = prev[0];
            const start = Math.max(1, first - 5);
            return Array.from({ length: 5 }, (_, i) => start + i);
        });
    };

    return (
        <>
            <FilterBar setFilters={setFilters} filters={filters}/>
            <div className="p-20 ml-60 overflow-scroll no-scrollbar h-screen">
                <div className="">
                    <div className="grid grid-cols-5 gap-5 ">
                        {
                            movies.map((movie, index) => (
                                <div>
                                    <MoviePoster movie={movie} />
                                </div>
                            ))
                        }

                    </div>
                </div>

                <div className="flex flex-col w-full justify-center items-center mt-10 gap-2">
                    <p className="text-sm font-semibold">Current Page: {currentPage}</p>
                    <div className="flex gap-2 cursor-pointer">
                        <p className="bg-[#3c3c3c] p-2 px-4 rounded-lg" onClick={() => handlePrevIndices()}>Prev</p>
                        {
                            currentIndices.map((i, index) => (
                                <p className={`p-2 px-4 rounded-lg ${i == currentPage ? `bg-[#464E82]` : `bg-[#727272ab] hover:bg-[#727272]`} transition-colors ease-in-out duration-700`} onClick={() => setCurrentPage(i)}>{i}</p>
                            ))
                        }
                        <p className="bg-[#3c3c3c] p-2 px-4 rounded-lg" onClick={() => handleNextIndices()}>Next</p>
                    </div>
                </div>
                <Footer />
                <div>
                </div>
            </div>
        </>
    )
}

const MoviePoster = ({ movie }) => {
    const [loaded, setLoaded] = useState(false);

    const navigate = useNavigate();


    return (
        <div className="relative h-55 aspect-2/3 rounded-lg">

            {!loaded && (
                <div className="absolute inset-0 bg-[#3A3A3A] animate-pulse rounded-lg" />
            )}

            <img
                loading="lazy"
                src={`https://image.tmdb.org/t/p/w342/${movie.poster_path}`}
                alt={movie.title}
                onLoad={() => setLoaded(true)}
                className={`h-55 object-cover duration-200 rounded-lg ease-in-out hover:scale-103 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
                onClick={() => navigate(`/movie/${movie?.id}`)}
            />
        </div>
    );
};


export default Browse;