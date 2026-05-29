import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Review, ReviewLike } from "@/lib/models";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { reviewId } = await req.json();
    const userId = auth.user._id;
    const reviewObjectId = new Types.ObjectId(reviewId);

    await connectDB();

    const existingLike = await ReviewLike.findOne({ user: userId, review: reviewObjectId });

    if (!existingLike) {
      await ReviewLike.create({ user: userId, review: reviewObjectId });
      await Review.updateOne({ _id: reviewObjectId }, { $inc: { likesCount: 1 } });
      return NextResponse.json({ message: "Liked successfully", isLiked: true });
    } else {
      await ReviewLike.deleteOne({ _id: existingLike._id });
      await Review.updateOne({ _id: reviewObjectId }, { $inc: { likesCount: -1 } });
      return NextResponse.json({ message: "Unliked successfully", isLiked: false });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
