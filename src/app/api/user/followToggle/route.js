import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { User, Follow } from "@/lib/models";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { followeeId } = await req.json();
    const followerId = auth.user._id;

    if (followerId.toString() === followeeId.toString()) {
      return NextResponse.json({ message: "Can't follow oneself" }, { status: 400 });
    }

    await connectDB();

    const followee = await User.findById(followeeId);
    if (!followee) return NextResponse.json({ message: "Followee not found" }, { status: 404 });

    const exists = await Follow.findOne({ followeeId, followerId });

    if (exists) {
      const followId = exists._id;
      await Follow.findByIdAndDelete(followId);
      await Promise.all([
        User.findByIdAndUpdate(followerId, { $pull: { following: followId } }),
        User.findByIdAndUpdate(followeeId, { $pull: { followers: followId } }),
      ]);
      return NextResponse.json({ message: "Unfollowed successfully" });
    }

    const follow = await Follow.create({ followerId, followeeId });
    await Promise.all([
      User.findByIdAndUpdate(followerId, { $push: { following: follow._id } }),
      User.findByIdAndUpdate(followeeId, { $push: { followers: follow._id } }),
    ]);

    return NextResponse.json({ message: "Followed successfully", follow }, { status: 201 });
  } catch (error) {
    console.error("Error adding follower:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
