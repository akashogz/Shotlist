import { NextResponse } from "next/server";
import { Types } from "mongoose";
import connectDB from "@/lib/db/mongodb";
import { Review } from "@/lib/models";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const viewerId = searchParams.get("viewerId");

    if (!userId) return NextResponse.json({ message: "User ID is required" }, { status: 400 });

    await connectDB();

    const pipeline = [
      { $match: { user: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      { $addFields: { username: "$userDetails.username", avatarSeed: "$userDetails.avatarSeed" } },
      { $project: { userDetails: 0 } },
    ];

    if (viewerId && Types.ObjectId.isValid(viewerId)) {
      pipeline.push(
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
                      { $eq: ["$user", new Types.ObjectId(viewerId)] },
                    ],
                  },
                },
              },
            ],
            as: "userLike",
          },
        },
        { $addFields: { isLiked: { $gt: [{ $size: "$userLike" }, 0] } } },
        { $project: { userLike: 0 } }
      );
    } else {
      pipeline.push({ $addFields: { isLiked: false } });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    const reviews = await Review.aggregate(pipeline);
    return NextResponse.json({ reviews: reviews || [] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
