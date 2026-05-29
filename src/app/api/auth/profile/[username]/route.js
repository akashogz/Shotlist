import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { User, Review, Watched, Watchlist } from "@/lib/models";

export async function GET(req, { params }) {
  try {
    const { username } = await params;
    await connectDB();

    const targetUser = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    }).select("-password");

    if (!targetUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const [reviewCount, watchedCount, watchlistCount] = await Promise.all([
      Review.countDocuments({ user: targetUser._id }),
      Watched.countDocuments({ userId: targetUser._id }),
      Watchlist.countDocuments({ userId: targetUser._id }),
    ]);

    return NextResponse.json({
      ...targetUser.toObject(),
      stats: { reviews: reviewCount, watched: watchedCount, watchlist: watchlistCount },
    });
  } catch (err) {
    console.error("Fetch profile error:", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
