import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Review } from "@/lib/models";

export async function DELETE(req, { params }) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { id: reviewId } = await params;
    const userId = auth.user._id;

    await connectDB();

    const review = await Review.findById(reviewId);
    if (!review) return NextResponse.json({ message: "Review doesn't exist" }, { status: 404 });

    if (review.user.toString() !== userId.toString()) {
      return NextResponse.json({ message: "Not authorized" }, { status: 401 });
    }

    await Review.deleteOne({ _id: reviewId });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
