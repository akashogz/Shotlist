"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import api from "@/lib/api/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart } from "lucide-react";
import handleLike from "../../lib/utilities/handleLike";

export default function SearchPage() {
  const [movies, setMovies] = useState([]);
  const [person, setPerson] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState("Movies");
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, personRes, reviewsRes] = await Promise.all([
          api.get(`movie/search-movie?query=${query}`),
          api.get(`movie/search-person?query=${query}`),
          api.get(`user/fetchMovieReviews?includes=${query}`)
        ]);

        setMovies(moviesRes.data);
        setPerson(personRes.data);
        setReviews(reviewsRes.data.reviews);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [query]);

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
              <p className="text-sm font-bold">Search results for &ldquo;{query}&rdquo;</p>
              <div className="font-semibold text-xs flex gap-2">
                <button className={`px-3 rounded-full p-1 hover:bg-[#5e5e5e] ${selected === "Movies" ? "bg-[#5e5e5e]" : "bg-[#404040]"}`} onClick={() => setSelected("Movies")}>Movies ({movies.length})</button>
                <button className={`px-3 rounded-full p-1 hover:bg-[#5e5e5e] ${selected === "People" ? "bg-[#5e5e5e]" : "bg-[#404040]"}`} onClick={() => setSelected("People")}>People ({person.length})</button>
                <button className={`px-3 rounded-full p-1 hover:bg-[#5e5e5e] ${selected === "Reviews" ? "bg-[#5e5e5e]" : "bg-[#404040]"}`} onClick={() => setSelected("Reviews")}>Reviews ({reviews.length})</button>
              </div>
            </div>
            <div className="flex flex-col place-items-center items-start">
              {selected === "Movies" && movies.map((movie, index) => (
                <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-[#3b3b3b] p-2 py-5 items-center w-full" key={index}>
                  {movie.poster_path
                    ? <img src={`https://image.tmdb.org/t/p/w185/${movie.poster_path}`} className="w-20 rounded-lg bg-[#303030] aspect-2/3" alt={movie.title} />
                    : <div className="w-20 rounded-lg bg-[#303030] aspect-2/3 items-center justify-center flex"><img src="/logo.png" className="p-7" alt="" /></div>
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
              <div className="flex flex-wrap gap-5">
                {selected == "Reviews" && reviews.map((r, index) => (
                  <div key={r._id} className="flex flex-col gap-3 bg-[#303030] rounded-lg p-3 justify-between w-full max-w-md lg:w-110">
                    <div className="flex flex-col gap-2">
                      <div className='flex justify-between items-start'>
                        <div className="flex flex-col gap-2 w-full">
                          <div className="flex">
                            <div className="flex flex-col gap-2 w-full">
                              <div className=''>
                                <div className="flex gap-2">
                                  <img
                                    src={`https://api.dicebear.com/9.x/glass/svg?seed=${r.avatarSeed}`}
                                    className="size-9 rounded-full object-cover"
                                    alt={r.username}
                                  />
                                  <div>
                                    <p className="font-medium text-white/50 text-sm">{r.username}</p>
                                    <p className="text-xs text-white/50">
                                      {new Date(r.createdAt).toLocaleDateString('en-GB', {
                                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <span className='flex gap-1 text-sm'><p className='font-semibold text-white text-[14px]'>{r.movieName}</p></span>
                              <div className='flex items-center gap-1 h-full'>
                                <div className='flex'>
                                  {[1, 2, 3, 4, 5].map((idx) => (
                                    <div key={idx} className='flex'>
                                      {idx - 0.5 <= r.rating && <img src='/star-half-left.png' className='h-4' />}
                                      {idx <= r.rating && <img src='/star-half-right.png' className='h-4' />}
                                      {idx - 0.5 > r.rating && <img src='/star-half.png' className='h-4' />}
                                      {idx > r.rating && <img src='/star-half-r.png' className='h-4' />}
                                    </div>
                                  ))}
                                </div>
                                <p className='text-sm text-white/50'>({r.rating})</p>
                              </div>
                            </div>
                            <img src={`https://image.tmdb.org/t/p/w154/${r.posterPath}`} className="h-23 rounded-lg aspect-2/3" />
                          </div>
                          <p className={`text-sm leading-relaxed text-white/90 duration-150 transition-opacity`} >{r.text}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end items-center gap-1.5 text-xs text-white/60">
                      <div className='flex gap-1 items-center'>
                        <div className="flex items-center justify-center">
                          <Heart
                            size={14}
                            className={`cursor-pointer transition-all ${r.isLiked ? "fill-red-500 text-red-500 scale-110" : "hover:text-white"}`}
                            onClick={() => handleLike(r._id)}
                          />
                        </div>
                        <p className="leading-none select-none">
                          {r.likesCount || 0} Likes
                        </p>
                      </div>
                    </div>
                  </div>
                ))

                }
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
