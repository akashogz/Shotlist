import { NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/models";

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://shotlist.uk"
    : "http://localhost:3000";

export async function GET(req, { params }) {
  try {
    const { token } = await params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await connectDB();

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    return NextResponse.redirect(`${FRONTEND_URL}/login?verified=true`);
  } catch (error) {
    console.error("Verify email error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
