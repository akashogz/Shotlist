import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Follow } from "@/lib/models";

export async function GET(req, { params }) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { followeeId } = await params;
    const followerId = auth.user._id;

    await connectDB();

    const ifFollowed = await Follow.findOne({ followeeId, followerId });

    return NextResponse.json({ message: "Fetched if followed", isFollowed: !!ifFollowed });
  } catch (error) {
    console.error("Error in checkIfFollowed:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
