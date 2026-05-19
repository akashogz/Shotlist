import { Link } from "react-router-dom";

const generateWavePath = (width) => {

    let path = `M 0 130 `;

    for (let x = 0; x <= width; x += 150) {

        const controlX = x + 50;

        const controlY =
            x % 300 === 0
                ? 90
                : 160;

        const endX = x + 120;

        path += `Q ${controlX} ${controlY}, ${endX} 120 `;
    }

    return path;
};

const CareerTimeline = ({ movies }) => {

    const spacing = 260;
    const startX = 200;

    const svgWidth = movies?.filter(
                        (movie) =>
                            movie.release_date &&
                            movie.poster_path &&
                            movie.media_type === "movie"
                    ).length * spacing + 400;

    return (
        <div className="overflow-x-scroll w-screen overflow-visible pt-10 no-scrollbar -ml-5 md:-ml-20">

            <div
                className="relative h-75"
                style={{ width: `${svgWidth}px` }}
            >

                <svg
                    viewBox={`0 0 ${svgWidth} 300`}
                    className="absolute inset-0 h-full w-full "
                    fill="white"
                >
                    <path
                        d={generateWavePath(svgWidth)}
                        stroke="rgba(255,255,255,0.8)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                    />
                </svg>

                {movies?.filter(
                        (movie) =>
                            movie.release_date &&
                            movie.poster_path &&
                            movie.media_type === "movie"
                    )
                    .sort((a, b) => {

                        const dateA = new Date(a.release_date).getTime();
                        const dateB = new Date(b.release_date).getTime();

                        return dateB - dateA;
                    })
                    .map((movie, index) => {
                        const x = startX + index * spacing + 50;

                        const isTop = index % 2 === 0;

                        return (
                            <div
                                key={movie.id}
                                className="absolute"
                                style={{
                                    left: `${x}px`,
                                    top: isTop ? "20px" : "160px",
                                    transform: "translateX(-50%)",
                                }}
                            >

                                <Link
                                    to={`/movie/${movie.id}`}
                                    className="group flex gap-2 items-center"
                                >

                                    <div className="border p-0.5 rounded-lg w-12 hover:border-0">
                                        <img
                                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                                            alt={movie.title}
                                            className="
                                        rounded-md
                                        w-12
                                        aspect-2/3
                                        shadow-lg
                                        transition-all
                                        duration-300
                                        hover:scale-250
                                    "
                                        />
                                    </div>

                                    <div className="mt-3 text-center">
                                        <p className="font-semibold text-white text-sm max-w-80 line-clamp-1">
                                            {movie.title}
                                        </p>

                                        <p className="text-white/50 text-xs">
                                            {movie.release_date?.slice(0, 4)}
                                        </p>

                                        {
                                            movie.character &&
                                            <p className="text-white/50 text-xs">
                                                as {movie.character}
                                            </p>
                                        }
                                        {
                                            movie.job &&
                                            <p className="text-white/50 text-xs">
                                                {movie.jobs.join(", ")}
                                            </p>
                                        }
                                    </div>

                                </Link>

                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default CareerTimeline;