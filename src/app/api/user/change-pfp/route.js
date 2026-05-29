import { NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { requireAuth } from "@/lib/auth";
import { User } from "@/lib/models";

export async function POST(req) {
  const auth = await requireAuth();
  if (auth.error) return NextResponse.json({ message: auth.message }, { status: auth.status });

  try {
    const { avatarSeed } = await req.json();
    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      auth.user._id,
      { $set: { avatarSeed } },
      { new: true }
    ).select("-password");

    if (!updatedUser) return NextResponse.json({ message: "User not found" }, { status: 404 });

    return NextResponse.json({ message: "Update successful", avatarSeed: updatedUser.avatarSeed });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
