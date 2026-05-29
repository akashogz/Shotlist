import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { Watched } from "@/lib/models";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { tmdbId } = await req.json();
    const userId = auth.user._id;

    if (!tmdbId) return NextResponse.json({ message: "No movie id provided" }, { status: 400 });

    await connectDB();

    const deleted = await Watched.findOneAndDelete({ movieId: tmdbId, userId });

    return NextResponse.json({ message: "Removed from watched", watched: deleted });
  } catch (error) {
    console.error("Error removing from watched:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
