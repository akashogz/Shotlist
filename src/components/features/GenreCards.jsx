"use client";
import { useRouter } from "next/navigation";
import { MoveRight } from "lucide-react";
import { useUserStore } from "@/store/userStore";

const genres = [
  { name: "Action", color: "#D7263D", img: "action.png", code: 28 },
  { name: "Adventure", color: "#2BB673", img: "adventure.png", code: 12 },
  { name: "Comedy", color: "#FFCA28", img: "comedy.png", code: 35 },
];

export default function GenreCards() {
  const router = useRouter();
  const { setLocalFilters, setActiveFilters } = useUserStore();

  const handleGenreCard = (genre) => {
    setLocalFilters(() => ({ sort_by: "Popularity", genres: [genre.code], releaseStart: null, releaseEnd: null, language: null }));
    setActiveFilters(() => [{ id: "genre", label: genre.name, value: genre.code }]);
    router.push("/browse");
  };

  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-3 gap-3 md:gap-8 overflow-x-auto rounded-lg no-scrollbar">
      {genres.map((genre) => (
        <div
          key={genre.name}
          className="rounded-lg bg-gradient-to-bl from-[#3c3c3c76] to-[#60606071] hover:from-[#60606071] hover:to-[#3c3c3c76] transition-colors duration-300 flex items-center justify-between gap-2 text-lg p-2 px-5 cursor-pointer"
          onClick={() => handleGenreCard(genre)}
        >
          <div className="overflow-hidden flex rounded-full items-center justify-center p-2 border-2" style={{ backgroundColor: genre.color }}>
            <img src={genre.img} alt={genre.name} className="size-4" />
          </div>
          <p className="text-sm">{genre.name}</p>
        </div>
      ))}
      <div
        className="rounded-lg bg-gradient-to-bl from-[#464e82] to-[#464e8279] hover:from-[#464e8279] hover:to-[#464e82] transition-colors duration-300 flex items-center justify-between gap-2 text-lg p-3 px-5 cursor-pointer"
        onClick={() => router.push("/browse")}
      >
        <p className="text-sm">More</p>
        <MoveRight />
      </div>
    </div>
  );
}
