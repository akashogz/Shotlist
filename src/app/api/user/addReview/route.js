import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Review, Watched } from "@/lib/models";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { tmdbId, text, rating, username, avatarSeed, movieName, posterPath } = await req.json();
    const userId = auth.user._id;

    if (!tmdbId || !rating || !username || !movieName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const exists = await Review.findOne({
      tmdbId,
      user: new mongoose.Types.ObjectId(userId),
    });
    if (exists) return NextResponse.json({ message: "Already reviewed!" }, { status: 400 });

    const review = await Review.create({
      user: userId,
      tmdbId,
      text,
      rating,
      username,
      avatarSeed,
      movieName,
      posterPath,
    });

    const watchedExists = await Watched.findOne({
      tmdbId,
      user: new mongoose.Types.ObjectId(userId),
    });

    if (!wacthedExists) await Watched.create({ userId, movieId: tmdbId, title: movieName, posterPath });

    return NextResponse.json({ message: "Review added successfully", review }, { status: 201 });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
