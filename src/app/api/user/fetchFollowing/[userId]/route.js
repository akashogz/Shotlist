import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { Follow } from "@/lib/models";

export async function GET(req, { params }) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(req.url);
    const viewerId = searchParams.get("viewerId");

    await connectDB();

    const following = await Follow.find({ followerId: userId })
      .populate("followeeId", "username avatarSeed")
      .lean();

    let viewerFollowingIds = [];
    if (viewerId) {
      const viewerFollowing = await Follow.find({ followerId: viewerId }).lean();
      viewerFollowingIds = viewerFollowing.map((f) => f.followeeId.toString());
    }

    const results = following
      .map((f) => {
        if (!f.followeeId) return null;
        const userData = f.followeeId;
        return {
          ...userData,
          isFollowing: viewerId ? viewerFollowingIds.includes(userData._id.toString()) : false,
        };
      })
      .filter(Boolean);

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in fetchFollowing:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
