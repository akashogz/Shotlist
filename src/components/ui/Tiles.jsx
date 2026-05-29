"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";
import MoreModal from "../features/MoreModal";

export default function Tiles({ movies = [], title, loading }) {
  const [openMore, setOpenMore] = useState(false);
  const router = useRouter();

  return (
    <div className="flex gap-8 md:gap-25 overflow-x-auto rounded-lg no-scrollbar">
      {loading && Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-50 md:h-55 min-w-32 md:w-40 rounded-lg bg-gradient-to-r from-[#55555584] to-[#3030307c] animate-pulse" />
      ))}

      {!loading && movies.slice(0, 5).map((movie) => (
        <div
          key={movie.id}
          className="flex flex-col group overflow-hidden h-50 md:h-55 min-w-32 gap-2 cursor-pointer"
          onClick={() => router.push(`/movie/${movie.id}`)}
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            loading="lazy"
            className="h-50 md:h-55 min-w-32 md:w-40 rounded-lg object-cover
                       group-hover:md:h-38 group-hover:h-35
                       group-hover:brightness-75 transition-all duration-300"
          />
          <div className="hidden group-hover:flex flex-col justify-between items-center
                          min-w-32 md:w-40 bg-gradient-to-bl from-[#3c3c3c3b]
                          to-[#60606038] rounded-lg p-2">
            <p className="w-32 md:w-38 truncate text-center font-bold text-sm">{movie.title}</p>
            <p className="text-xs">{Math.round(movie.vote_average * 10) / 10}</p>
          </div>
        </div>
      ))}

      {!loading && (
        <button
          onClick={() => setOpenMore(true)}
          aria-label={`Show more ${title}`}
          className="h-50 md:h-55 w-35 md:w-20 flex items-center justify-center"
        >
          <span className="w-15 md:w-20 h-15 md:h-20 rounded-full bg-[#464E82] flex items-center justify-center">
            <MoveRight size={32} />
          </span>
        </button>
      )}

      <MoreModal open={openMore} items={movies} title={title} setOpenMore={setOpenMore} />
    </div>
  );
}
