import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { Watched } from "@/lib/models";

export async function GET(req, { params }) {
  try {
    const { id: userId } = await params;
    await connectDB();

    const watched = await Watched.find({ userId }).sort({ addedAt: -1 });
    return NextResponse.json({ message: "Fetched watched", watched });
  } catch (error) {
    console.error("Error in fetchWatched:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
