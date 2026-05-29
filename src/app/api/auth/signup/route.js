import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/models";
import { sendVerificationEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    const { name, username, email, password } = await req.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectDB();

    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      return NextResponse.json(
        { message: exists.email === email ? "Email already exists" : "Username already exists" },
        { status: 409 }
      );
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      avatarSeed: username.toLowerCase(),
      authProvider: "local",
      isVerified: false,
      verificationToken: hashedToken,
      verificationTokenExpires: Date.now() + 1000 * 60 * 15,
    });

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      { user: { id: user._id, name: user.name, username: user.username, email: user.email, avatarSeed: user.avatarSeed } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
