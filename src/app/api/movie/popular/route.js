import { NextResponse } from "next/server";
import { tmdbFetch, getCachedOrFetch } from "@/lib/tmdb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;
  const key = `movies:popular:p${page}`;

  try {
    const movies = await getCachedOrFetch(key, async () => {
      const data = await tmdbFetch("/movie/popular", { page });
      return data.results;
    });
    return NextResponse.json(movies);
  } catch {
    return NextResponse.json({ error: "Popular movies unavailable" }, { status: 500 });
  }
}
