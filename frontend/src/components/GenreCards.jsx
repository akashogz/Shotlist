import React from "react";

function GenreCards() {
  const genres = [
    {
      name: "Action",
      color: "#D7263D",
      img: "action.png",
    },
    {
      name: "Adventure",
      color: "#2BB673",
      img: "adventure.png",
    },
    {
      name: "Comedy",
      color: "#FFCA28",
      img: "comedy.png",
    },
    {
      name: "Drama",
      color: "#7E57C2",
      img: "drama.png",
    },
    {
      name: "Sci-Fi",
      color: "#00B8F5",
      img: "sci-fi.png",
    },
  ];

  return (
    <div className="flex gap-8 md:gap-25 overflow-x-auto rounded-lg no-scrollbar">
      {genres.map((genre) => (
        <div
          key={genre.name}
          className="
            min-h-50 md:min-h-55
            min-w-32 md:min-w-39.75
            rounded-lg
            bg-linear-to-bl
            from-[#3c3c3c76] to-[#60606071]
            hover:from-[#60606071] hover:to-[#3c3c3c76]
            transition-colors duration-800
            flex flex-col items-center justify-center gap-2
            text-lg
          "
        >
          <div
            className="
              overflow-hidden
              flex rounded-full
              items-center justify-center
              p-3 border-2 inset-shadow-sm
              hover:shadow-2xl ease-in-out duration-300
            "
            style={{ backgroundColor: genre.color }}
          >
            <img
              src={genre.img}
              alt={genre.name}
              className="size-8 "
            />
          </div>

          <p className="font-semibold text-sm md:text-lg">{genre.name}</p>
        </div>
      ))}

      <div className="h-50 md:h-55 w-35 md:w-20 rounded-lg flex items-center justify-center">
        <div className="w-15 md:w-20 h-15 md:h-20 rounded-full bg-[#464E82] flex items-center justify-center">
          <img src="right-arrow.png" className="size-6 md:size-8" />
        </div>
      </div>
    </div>
  );
}

export default GenreCards;
