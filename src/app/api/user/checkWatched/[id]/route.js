import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Watched, Watchlist } from "@/lib/models";
import { getOrCreateMovie } from "@/lib/services/movie";

export async function GET(req, { params }) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { id } = await params;
    const userId = auth.user._id;
    const tmdbId = Number(id);

    await connectDB();

    const movie = await getOrCreateMovie(tmdbId);

    const [isWatched, isWatchlisted] = await Promise.all([
      Watched.findOne({ movie: movie._id, userId }),
      Watchlist.findOne({ movie: movie._id, userId }),
    ]);

    return NextResponse.json({
      isWatched: !!isWatched,
      isWatchlisted: !!isWatchlisted,
    });
  } catch (error) {
    console.error("Error in checkWatched:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
