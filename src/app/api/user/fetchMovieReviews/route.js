import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import { Review } from "@/lib/models";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tmdbId = searchParams.get("tmdbId");
    const viewerId = searchParams.get("viewerId");

    if (!tmdbId) return NextResponse.json({ message: "tmdbId is required" }, { status: 400 });

    const movieNumberId = Number(tmdbId);
    const viewerObjectId =
      viewerId && mongoose.Types.ObjectId.isValid(viewerId)
        ? new mongoose.Types.ObjectId(viewerId)
        : null;

    await connectDB();

    const pipeline = [
      { $match: { tmdbId: movieNumberId } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $addFields: { username: "$userDetails.username", avatarSeed: "$userDetails.avatarSeed" } },
      {
        $lookup: {
          from: "reviewlikes",
          let: { reviewId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$review", "$$reviewId"] },
                    { $eq: ["$user", viewerObjectId] },
                  ],
                },
              },
            },
          ],
          as: "userLike",
        },
      },
      { $addFields: { isLiked: { $gt: [{ $size: "$userLike" }, 0] } } },
      { $project: { userDetails: 0, userLike: 0 } },
      { $sort: { createdAt: -1 } },
    ];

    const reviews = await Review.aggregate(pipeline);

    return NextResponse.json({ reviews: reviews || [], count: reviews.length });
  } catch (error) {
    console.error("Error in fetchMovieReviews:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
