"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function MoreModal({ open, items = [], title, setOpenMore }) {
  const router = useRouter();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setOpenMore(false)}>
      <div className="bg-[#1e1e1e] rounded-xl p-5 w-[90vw] max-w-3xl max-h-[80vh] overflow-y-auto no-scrollbar" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl font-bold">{title}</p>
          <button onClick={() => setOpenMore(false)}><X /></button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {items.map((movie) => (
            <div key={movie.id} className="cursor-pointer group" onClick={() => { router.push(`/movie/${movie.id}`); setOpenMore(false); }}>
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                className="rounded-lg w-full aspect-[2/3] object-cover group-hover:brightness-75 transition"
              />
              <p className="text-xs mt-1 text-center truncate">{movie.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
