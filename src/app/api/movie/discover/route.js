import { NextResponse } from "next/server";
import { tmdbFetch } from "@/lib/tmdb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const params = Object.fromEntries(searchParams.entries());

    const data = await tmdbFetch("/discover/movie", params);
    return NextResponse.json(data.results);
  } catch {
    return NextResponse.json({ error: "Discovery unavailable" }, { status: 500 });
  }
}
