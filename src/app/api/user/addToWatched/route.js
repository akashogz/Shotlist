import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Watched } from "@/lib/models";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { movieId, title, posterPath } = await req.json();
    const userId = auth.user._id;

    await connectDB();

    const exists = await Watched.findOne({ userId, movieId });
    if (exists) {
      return NextResponse.json({ message: "Movie already in watched list" }, { status: 400 });
    }

    const watched = await Watched.create({ userId, movieId, title, posterPath });

    return NextResponse.json({ message: "Added to watched", watched }, { status: 201 });
  } catch (error) {
    console.error("Error adding to watched:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
