import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Review, Watched, Watchlist } from "@/lib/models";

export async function GET() {
  console.log("========== /api/auth/me ==========");

  const auth = await requireAuth();

  console.log("AUTH RESULT:", auth);

  if (auth.error) {
    return NextResponse.json(
      { message: auth.message },
      { status: auth.status }
    );
  }

  try {
    await connectDB();

    const { user } = auth;

    console.log("USER OBJECT:", user);
    console.log("HAS toObject:", typeof user?.toObject);

    const [reviewCount, watchedCount, watchlistCount] = await Promise.all([
      Review.countDocuments({ user: user._id }),
      Watched.countDocuments({ user: user._id }),
      Watchlist.countDocuments({ userId: user._id }),
    ]);

    const userData =
      typeof user.toObject === "function"
        ? user.toObject()
        : user;

    return NextResponse.json({
      ...userData,
      stats: {
        reviews: reviewCount,
        watched: watchedCount,
        watchlist: watchlistCount,
      },
    });
  } catch (err) {
    console.error("========== ME ROUTE ERROR ==========");
    console.error(err);
    console.error("==================================");

    return NextResponse.json(
      {
        message: "Failed to fetch user data",
        error: err.message,
      },
      { status: 500 }
    );
  }
}