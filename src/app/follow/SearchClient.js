"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SearchPage({
    searchQuery,
}) {
    const [movies, setMovies] = useState([]);
    const [person, setPerson] = useState([]);
    const [selected, setSelected] = useState("Movies");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [moviesRes, personRes] = await Promise.all([
                    api.get(`/movie/search-movie?query=${searchQuery}`),
                    api.get(`/movie/search-person?query=${searchQuery}`)
                ]);
                setMovies(moviesRes.data);
                setPerson(personRes.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [searchQuery]);

    return (
        <>
            <Navbar />
            <div className="md:px-20 px-5 pt-20 flex flex-col gap-5 min-h-screen">
                {loading && (
                    <div className="flex w-full h-full items-center justify-center pt-40">
                        <div className="w-10 h-10 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    </div>
                )}
                {!loading && (
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-bold">Search results for &ldquo;{searchQuery}&rdquo;</p>
                            <div className="font-semibold text-xs flex gap-2">
                                <button className={`px-3 rounded-full p-1 hover:bg-[#5e5e5e] ${selected === "Movies" ? "bg-[#5e5e5e]" : "bg-[#404040]"}`} onClick={() => setSelected("Movies")}>Movies ({movies.length})</button>
                                <button className={`px-3 rounded-full p-1 hover:bg-[#5e5e5e] ${selected === "People" ? "bg-[#5e5e5e]" : "bg-[#404040]"}`} onClick={() => setSelected("People")}>People ({person.length})</button>
                            </div>
                        </div>
                        <div className="flex flex-col place-items-center items-start">
                            {selected === "Movies" && movies.map((movie, index) => (
                                <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-[#3b3b3b] p-2 py-5 items-center w-full" key={index}>
                                    {movie.poster_path
                                        ? <img src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`} className="w-20 rounded-lg bg-[#303030] aspect-[2/3]" alt={movie.title} />
                                        : <div className="w-20 rounded-lg bg-[#303030] aspect-[2/3] items-center justify-center flex"><img src="/logo.png" className="p-7" alt="" /></div>
                                    }
                                    <div className="flex flex-col gap-1">
                                        <Link className="text-sm font-bold underline underline-offset-2 cursor-pointer" href={`/movie/${movie.id}`}>{movie.title}</Link>
                                        <p className="text-sm">{movie.release_date ? `(${movie.release_date.slice(0, 4)})` : ""}</p>
                                        <p className="text-sm text-ellipsis line-clamp-2">{movie.overview}</p>
                                    </div>
                                </div>
                            ))}
                            {selected === "People" && person.map((p, index) => (
                                <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-[#3b3b3b] p-2 py-5 items-center w-full" key={index}>
                                    {p.profile_path
                                        ? <img src={`https://image.tmdb.org/t/p/w185/${p.profile_path}`} className="w-15 h-15 rounded-full object-cover bg-[#303030]" alt={p.name} />
                                        : <div className="w-15 h-15 rounded-full bg-[#303030] items-center justify-center flex"><img src="/logo.png" className="p-4" alt="" /></div>
                                    }
                                    <div className="flex flex-col gap-1">
                                        <Link className="text-sm font-bold underline underline-offset-2 cursor-pointer" href={`/person/${p?.id}`}>{p?.name}</Link>
                                        <p className="text-xs text-white/50">{p.known_for_department}</p>
                                        <p className="text-xs text-ellipsis text-white/50 line-clamp-2">Known For: {p.known_for.map((m) => m.title || m.name).join(", ")}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}
