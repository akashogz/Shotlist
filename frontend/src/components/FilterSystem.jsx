import React, { useEffect, useState, useCallback } from "react";
import { X, ChevronDown, RotateCcw } from "lucide-react";
import { useUserStore } from "../store/userStore";

const GENRE_MAP = { Action: 28, Comedy: 35, Drama: 18, "Sci-Fi": 878 };
const SORT_MAP = { Popularity: "popularity.desc", Rating: "vote_average.desc", Voting: "vote_count.desc", Released: "primary_release_date.desc" };
const LANGUAGE_MAP = { English: "en", Hindi: "hi", Spanish: "es", French: "fr" };

const FILTERS = [
  { id: "sort", title: "Sort", options: Object.keys(SORT_MAP) },
  { id: "genre", title: "Genre", options: Object.keys(GENRE_MAP) },
  { id: "year", title: "Year", options: ["2020-Present", "2010-2019", "2000-2009", "Before 2000"] },
  { id: "language", title: "Language", options: Object.keys(LANGUAGE_MAP) },
];

const INITIAL_STATE = {
  sortBy: "",
  genres: [],
  releaseStart: null,
  releaseEnd: null,
  language: null,
};

export default function FilterSystem({ setFilters }) {
  const { localFilters, setLocalFilters, activeFilters, setActiveFilters } = useUserStore();
  const clearAll = useUserStore((s) => s.clearAll);
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    setFilters({
      ...localFilters,
      with_genres: localFilters.genres.join(","),
    });
  }, [localFilters, setFilters]);

  const removeFilter = useCallback(({ id, label }) => {
    clearAll();
  }, [setActiveFilters, setLocalFilters]);

  const handleSelect = (id, label) => {
    const isGenre = id === "genre";
    const exists = activeFilters.some((f) => f.id === id && f.label === label);

    if (exists) {
      removeFilter({ id, label });
    } else {
      setActiveFilters((prev) => 
        isGenre ? [...prev, { id, label }] : [...prev.filter((f) => f.id !== id), { id, label }]
      );

      setLocalFilters((prev) => {
        const updated = { ...prev };
        if (id === "sort") updated.sortBy = SORT_MAP[label];
        if (id === "language") updated.language = LANGUAGE_MAP[label];
        if (id === "genre") {
          const gid = GENRE_MAP[label];
          if (!updated.genres.includes(gid)) updated.genres = [...updated.genres, gid];
        }
        if (id === "year") {
           const yearMap = {
            "2020-Present": ["2020-01-01", null],
            "2010-2019": ["2010-01-01", "2019-12-31"],
            "2000-2009": ["2000-01-01", "2009-12-31"],
            "Before 2000": [null, "1999-12-31"],
          };
          [updated.releaseStart, updated.releaseEnd] = yearMap[label];
        }
        return updated;
      });
    }
    setOpenDropdown(null);
  };

  return (
    <div className="w-full text-white">
      {/* Mobile View */}
      <div className="lg:hidden bg-[#303030] px-4 py-3 mt-20 rounded-lg mx-5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button onClick={clearAll} className="p-2 bg-[#505050] rounded-full border border-[#606060] shrink-0">
            <RotateCcw size={18} />
          </button>

          {FILTERS.map((f) => (
            <div key={f.id} className="relative shrink-0">
              <button
                onClick={() => setOpenDropdown(openDropdown === f.id ? null : f.id)}
                className={`flex items-center gap-2 px-4 py-2 bg-[#505050] rounded-full text-xs border transition-colors ${
                  activeFilters.some((af) => af.id === f.id) ? "border-white" : "border-[#606060]"
                }`}
              >
                {f.title} <ChevronDown size={14} />
              </button>

              {openDropdown === f.id && (
                <div className="absolute top-12 left-0 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-2xl z-50 p-1 min-w-40">
                  {f.options.map((opt) => (
                    <div
                      key={opt}
                      onClick={() => handleSelect(f.id, opt)}
                      className={`p-3 rounded-lg cursor-pointer text-sm ${
                        activeFilters.some((af) => af.label === opt) ? "bg-white text-black" : "hover:bg-[#262626]"
                      }`}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Active Filter Badges */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#444]">
            {activeFilters.map((f, i) => (
              <span key={i} className="flex items-center gap-2 bg-[#444] px-3 py-1 rounded-full text-[11px]">
                {f.label} <X size={12} className="cursor-pointer" onClick={() => removeFilter(f)} />
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#303030] border-r border-[#262626] h-screen fixed left-0 top-0 pt-24 p-6 overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Filters</h2>
          {activeFilters.length > 0 && (
            <button onClick={clearAll} className="text-xs text-gray-400 hover:text-white uppercase tracking-tighter">
              Reset All
            </button>
          )}
        </div>

        {FILTERS.map((section) => (
          <div key={section.id} className="mb-8 border-b border-[#444] pb-6">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-4 tracking-widest">
              {section.title}
            </h3>
            <div className="flex flex-wrap gap-2">
              {section.options.map((opt) => {
                const isActive = activeFilters.some((af) => af.label === opt);
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelect(section.id, opt)}
                    className={`text-[11px] px-3 py-1.5 rounded-full border transition-all ${
                      isActive ? "bg-white text-black border-white font-bold" : "border-[#505050] text-gray-400 hover:border-white"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </aside>
    </div>
  );
}