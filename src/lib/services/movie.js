import { Movie } from "@/lib/models";
import connectDB from "@/lib/db/mongodb";
import { tmdbFetch, getCachedOrFetch } from "@/lib/tmdb";

export async function getOrCreateMovie(tmdbId) {
  await connectDB();

  let movie = await Movie.findOne({ tmdbId });

  const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;

  if (
    movie &&
    Date.now() - movie.lastSynced.getTime() < ONE_MONTH
  ) {
    return movie;
  }

  const key = `movie:details:${tmdbId}`;
  const tmdbMovie = await getCachedOrFetch(
    key,
    async () =>
      tmdbFetch(`/movie/${movieId}`, {
        append_to_response: "credits",
      }),
    604800
  );

  const director =
    tmdbMovie.credits?.crew?.find(
      (person) => person.job === "Director"
    )?.name || "";

  const update = {
    tmdbId: tmdbMovie.id,
    movieName: tmdbMovie.title,
    posterPath: tmdbMovie.poster_path,
    backdropPath: tmdbMovie.backdrop_path,
    releaseDate: tmdbMovie.release_date,
    director,
    genres: tmdbMovie.genres,
    voteAverage: tmdbMovie.vote_average,
    lastSynced: new Date(),
  };

  movie = await Movie.findOneAndUpdate(
    { tmdbId },
    update,
    {
      new: true,
      upsert: true,
    }
  );

  return movie;
}