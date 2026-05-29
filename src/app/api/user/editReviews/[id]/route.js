import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Review } from "@/lib/models";

export async function GET(req, { params }) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { id: reviewId } = await params;
    const { searchParams } = new URL(req.url);
    const rating = searchParams.get("rating");
    const text = searchParams.get("text");

    await connectDB();

    const review = await Review.findById(reviewId);
    if (!review) return NextResponse.json({ message: "Review doesn't exist" }, { status: 404 });

    if (!review.user.equals(auth.user._id)) {
      return NextResponse.json({ message: "Not the owner" }, { status: 403 });
    }

    const update = {};
    if (rating !== undefined) update.rating = rating;
    if (text !== undefined) update.text = text;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $set: update },
      { new: true, runValidators: true }
    );

    return NextResponse.json({ message: "Review Updated", updatedReview });
  } catch (error) {
    console.error("Error in updateReviews:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
