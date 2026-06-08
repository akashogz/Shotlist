import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Watched } from "@/lib/models";
import { getOrCreateMovie } from "@/lib/services/movie";
import { Movie } from "@/lib/models";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { movieId } = await req.json();
    const userId = auth.user._id;

    if (!movieId) { return NextResponse.json({ message: "Movie ID required" }, { status: 400 });}

    await connectDB();

    const movie = await getOrCreateMovie(movieId)

    const exists = await Watched.findOne({ userId, movie: movie._id });
    if (exists) {
      return NextResponse.json({ message: "Movie already in watched list" }, { status: 400 });
    }

    const watched = await Watched.create({ userId, movie: movie._id });

    await Movie.updateOne(
      { _id: movie._id },
      {
        $inc: {
          watchedCount: 1,
        },
      }
    );

    return NextResponse.json({ message: "Added to watched", watched }, { status: 201 });
  } catch (error) {
    console.error("Error adding to watched:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
