import { NextResponse } from "next/server";
import { tmdbFetch, getCachedOrFetch } from "@/lib/tmdb";

export async function GET(req, { params }) {
  try {
    const { movieId } = await params;
    const key = `movie:details:${movieId}`;

    const movie = await getCachedOrFetch(
      key,
      async () =>
        tmdbFetch(`/movie/${movieId}`, {
          append_to_response: "credits,videos,recommendations,watch/providers",
        }),
      604800 // 7 days
    );

    return NextResponse.json(movie);
  } catch {
    return NextResponse.json({ error: "Movie details not found" }, { status: 404 });
  }
}
