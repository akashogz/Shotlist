import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { Follow } from "@/lib/models";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const viewerId = searchParams.get("viewerId");

    await connectDB();

    const followers = await Follow.find({ followeeId: userId })
      .populate("followerId", "username avatarSeed")
      .lean();

    let followingIds = [];
    if (viewerId) {
      const viewerFollowing = await Follow.find({ followerId: viewerId });
      followingIds = viewerFollowing.map((f) => f.followeeId.toString());
    }

    const results = followers
      .map((f) => {
        if (!f.followerId) return null;
        const followerData = f.followerId;
        return {
          ...followerData,
          isFollowing: viewerId ? followingIds.includes(followerData._id.toString()) : false,
        };
      })
      .filter(Boolean);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in fetchFollowers:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
