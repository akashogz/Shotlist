import { NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import { Review } from "@/lib/models";
import { text } from "stream/consumers";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tmdbId = searchParams.get("tmdbId");
    const viewerId = searchParams.get("viewerId");
    const includes = searchParams.get("includes");
    const cursor = searchParams.get("cursor");
    const limit = Number(searchParams.get("limit")) || 10;

    const movieNumberId = Number(tmdbId);
    const viewerObjectId =
      viewerId && mongoose.Types.ObjectId.isValid(viewerId)
        ? new mongoose.Types.ObjectId(viewerId)
        : null;

    await connectDB();

    const match = {
    };

    if (tmdbId) {
      match.tmdbId = movieNumberId
    }

    if (includes?.trim()) {
      match.$or = [
        {
          text: {
            $regex: includes,
            $options: "i",
          },
        },
        {
          movieName: {
            $regex: includes,
            $options: "i",
          },
        },
      ];
    }

    if (cursor) {
      match._id = {
        $lt: new Types.ObjectId(cursor),
      };
    }

    const pipeline = [
      {
        $match: match
      },
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
      { $sort: { _id: -1 } },
      { $limit: limit + 1 },
    ];

    const reviews = await Review.aggregate(pipeline);

    const hasMore = reviews.length > limit;

    if (hasMore) {
      reviews.pop();
    }

    const nextCursor = hasMore
      ? reviews[reviews.length - 1]._id
      : null;


    return NextResponse.json({
      reviews,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Error in fetchMovieReviews:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
