import { NextResponse } from "next/server";
import { tmdbFetch, getCachedOrFetch } from "@/lib/tmdb";

export async function GET() {
  try {
    const movies = await getCachedOrFetch("movies:trending", async () => {
      const data = await tmdbFetch("/trending/movie/week");
      return data.results;
    });
    return NextResponse.json(movies);
  } catch {
    return NextResponse.json({ error: "Trending unavailable" }, { status: 500 });
  }
}
