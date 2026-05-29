import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Watchlist } from "@/lib/models";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { movieId, title, posterPath } = await req.json();
    const userId = auth.user._id;

    await connectDB();

    const exists = await Watchlist.findOne({ userId, movieId });
    if (exists) return NextResponse.json({ message: "Movie already in watchlist" }, { status: 400 });

    const watchlist = await Watchlist.create({ userId, movieId, title, posterPath });

    return NextResponse.json({ message: "Added to watchlist", watched: watchlist }, { status: 201 });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
