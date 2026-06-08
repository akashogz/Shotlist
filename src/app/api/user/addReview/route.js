import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Review, Watched } from "@/lib/models";
import { getOrCreateMovie } from "@/lib/services/movie";
import { Movie } from "@/lib/models";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { tmdbId, text, rating, } = await req.json();
    const userId = auth.user._id;

    if (!tmdbId || !rating) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const movie = await getOrCreateMovie(tmdbId);

    const exists = await Review.findOne({
      movie: movie._id,
      user: userId,
    });
    if (exists) return NextResponse.json({ message: "Already reviewed!" }, { status: 400 });


    const review = await Review.create({
      user: userId,
      movie: movie._id,
      text,
      rating
    });

    const watchedExists = await Watched.findOne({
      movie: movie._id,
      userId,
    });

    if (!watchedExists) {
      await Watched.create({ userId, movie: movie._id });

      await Movie.updateOne(
        { _id: movie._id },
        {
          $inc: {
            watchedCount: 1,
          },
        }
      );
    }

    await Movie.updateOne(
      { _id: movie._id },
      {
        $inc: {
          reviewCount: 1,
        },
      }
    );

    return NextResponse.json({ message: "Review added successfully", review }, { status: 201 });
  } catch (error) {
    console.error("Error adding review:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
