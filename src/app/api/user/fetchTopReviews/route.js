import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import redisClient from "@/lib/db/redis";
import { Review } from "@/lib/models";

const cacheKey = "reviews:top_global";

export async function GET() {
  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return NextResponse.json({
        message: "Top Reviews fetched (from cache)",
        topReviews: JSON.parse(cachedData),
      });
    }

    await connectDB();

    const topReviews = await Review.find()
      .sort({ likesCount: -1 })
      .limit(2)
      .populate("user", "username avatarSeed")
      .lean();

    if (topReviews.length > 0) {
      await redisClient.setEx(cacheKey, 86400, JSON.stringify(topReviews));
    }

    return NextResponse.json({ message: "Top Reviews fetched", topReviews });
  } catch (error) {
    console.error("Error fetching top reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
