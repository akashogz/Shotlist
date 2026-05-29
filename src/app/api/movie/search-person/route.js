import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    const data = await tmdbFetch("/search/person", { query, include_adult: false, page: 1 });
    return NextResponse.json(data.results);
  } catch {
    return NextResponse.json({ error: "Search unavailable" }, { status: 500 });
  }
}
