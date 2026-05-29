import { NextResponse } from "next/server";
import { tmdbFetch, getCachedOrFetch } from "@/lib/tmdb";

export async function GET() {
  try {
    const movies = await getCachedOrFetch("movies:top_rated", async () => {
      const data = await tmdbFetch("/movie/top_rated");
      return data.results;
    });
    return NextResponse.json(movies);
  } catch {
    return NextResponse.json({ error: "Top rated unavailable" }, { status: 500 });
  }
}
