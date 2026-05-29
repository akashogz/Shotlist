import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { Watchlist } from "@/lib/models";

export async function GET(req, { params }) {
  try {
    const { id: userId } = await params;
    await connectDB();

    const watchlist = await Watchlist.find({ userId }).sort({ addedAt: -1 });
    return NextResponse.json({ message: "Fetched watchlist", watchlist });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
