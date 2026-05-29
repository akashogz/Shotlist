import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Review } from "@/lib/models";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { tmdbId } = await req.json();
    const userId = auth.user._id;

    await connectDB();

    const review = await Review.findOne({
      tmdbId,
      user: new mongoose.Types.ObjectId(userId),
    });

    return NextResponse.json({
      message: "Review fetched successfully",
      review,
      watched: auth.user.watched,
    });
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
