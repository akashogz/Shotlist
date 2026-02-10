import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

/* ---------------- TMDB MAPPINGS ---------------- */

const GENRE_MAP = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  "Sci-Fi": 878,
};

const SORT_MAP = {
  Popularity: "popularity.desc",
  Rating: "vote_average.desc",
  Voting: "vote_count.desc",
  Released: "primary_release_date.desc",
};

const LANGUAGE_MAP = {
  English: "en",
  Hindi: "hi",
  Spanish: "es",
  French: "fr",
};

/* ---------------- FILTER CONFIG ---------------- */

const FILTERS = [
  { id: "sort", title: "Sort By", options: Object.keys(SORT_MAP) },
  { id: "genre", title: "Genre", options: Object.keys(GENRE_MAP) },
  { id: "year", title: "Release Year", options: ["2020-Present", "2010-2019", "2000-2009", "Before 2000"] },
  { id: "runtime", title: "Runtime", options: ["≤ 90 min", "90–120 min", "≥ 120 min"] },
  { id: "language", title: "Language", options: Object.keys(LANGUAGE_MAP) },
  { id: "certification", title: "Certification", options: ["G", "PG", "PG-13", "R"] },
];

const INITIAL_FILTERS = {
  sortBy: "",
  genres: [],            // <-- TMDB GENRE IDS
  releaseStart: null,
  releaseEnd: null,
  runtimeMax: null,
  language: null,
  certification: null,
  certificationCountry: "US",
};

/* ---------------- MAIN ---------------- */

function FilterBar({ setFilters }) {
  const [filters, setLocalFilters] = useState(INITIAL_FILTERS);
  const [activeFilters, setActiveFilters] = useState([]);
  const [openFilters, setOpenFilters] = useState([]);

  useEffect(() => {
    setFilters({
      ...filters,
      with_genres: filters.genres.join(","), // TMDB expects comma-separated ids
    });
  }, [filters, setFilters]);

  const toggleSection = (id) => {
    setOpenFilters((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const addActiveFilter = (id, label) => {
    setActiveFilters((prev) =>
      prev.some((f) => f.id === id && f.label === label)
        ? prev
        : [...prev, { id, label }]
    );
  };

  const removeActiveFilter = ({ id, label }) => {
    setActiveFilters((prev) =>
      prev.filter((f) => !(f.id === id && f.label === label))
    );

    setLocalFilters((prev) => {
      const updated = { ...prev };

      if (id === "genre") {
        updated.genres = updated.genres.filter(
          (gid) => gid !== GENRE_MAP[label]
        );
      }

      if (id === "sort") updated.sortBy = "";
      if (id === "language") updated.language = null;
      if (id === "certification") updated.certification = null;
      if (id === "runtime") updated.runtimeMax = null;
      if (id === "year") {
        updated.releaseStart = null;
        updated.releaseEnd = null;
      }

      return updated;
    });
  };

  const clearAll = () => {
    setLocalFilters(INITIAL_FILTERS);
    setActiveFilters([]);
  };

  return (
    <div className="absolute h-full flex items-end">
      <div className="bg-[#303030] rounded-t-lg w-72 h-160 overflow-y-scroll no-scrollbar">

        <div className="px-5 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Filters</h1>
          {activeFilters.length > 0 && (
            <button onClick={clearAll} className="text-xs text-gray-300 hover:text-white">
              Clear all
            </button>
          )}
        </div>

        {activeFilters.length > 0 && (
          <div className="px-5 mb-3 flex flex-wrap gap-2">
            {activeFilters.map((filter, i) => (
              <span
                key={i}
                className="flex items-center gap-1 bg-[#4C4C4C] px-2 py-1 rounded-full text-xs"
              >
                {filter.label}
                <X
                  size={12}
                  className="cursor-pointer"
                  onClick={() => removeActiveFilter(filter)}
                />
              </span>
            ))}
          </div>
        )}

        {FILTERS.map((section) => (
          <FilterSection
            key={section.id}
            section={section}
            isOpen={openFilters.includes(section.id)}
            toggleSection={toggleSection}
            setLocalFilters={setLocalFilters}
            addActiveFilter={addActiveFilter}
          />
        ))}
      </div>
    </div>
  );
}

/* ---------------- SECTION ---------------- */

function FilterSection({
  section,
  isOpen,
  toggleSection,
  setLocalFilters,
  addActiveFilter,
}) {
  const { id, title, options } = section;

  const handleSelect = (value) => {
    setLocalFilters((prev) => {
      const updated = { ...prev };

      if (id === "sort") {
        updated.sortBy = SORT_MAP[value];
      }

      if (id === "genre") {
        const genreId = GENRE_MAP[value];
        if (!updated.genres.includes(genreId)) {
          updated.genres = [...updated.genres, genreId];
        }
      }

      if (id === "year") {
        const map = {
          "2020-Present": ["2020-01-01", null],
          "2010-2019": ["2010-01-01", "2019-12-31"],
          "2000-2009": ["2000-01-01", "2009-12-31"],
          "Before 2000": [null, "1999-12-31"],
        };
        [updated.releaseStart, updated.releaseEnd] = map[value];
      }

      if (id === "runtime") {
        const map = { "≤ 90 min": 90, "90–120 min": 120, "≥ 120 min": null };
        updated.runtimeMax = map[value];
      }

      if (id === "language") {
        updated.language = LANGUAGE_MAP[value];
      }

      if (id === "certification") {
        updated.certification = value;
      }

      return updated;
    });

    addActiveFilter(id, value);
  };

  return (
    <div className="border-b border-[#4C4C4C] px-5 py-3 text-sm">
      <button
        onClick={() => toggleSection(id)}
        className="flex w-full justify-between items-center"
      >
        <p>{title}</p>
        <Plus
          size={16}
          className={`transition-transform ${isOpen ? "rotate-45" : ""}`}
        />
      </button>

      <div className={`overflow-hidden transition-all ${isOpen ? "max-h-40 mt-3" : "max-h-0"}`}>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <span
              key={opt}
              onClick={() => handleSelect(opt)}
              className="bg-[#4C4C4C] px-2 py-1 rounded-full cursor-pointer hover:bg-[#5A5A5A]"
            >
              {opt}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
