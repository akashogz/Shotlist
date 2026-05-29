import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/models";
import { cookieOptions } from "@/lib/cookieOptions";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email }).select("+password");
    if (!user) return NextResponse.json({ message: "User doesn't exist!" }, { status: 404 });

    const verify = await bcrypt.compare(password, user.password);
    if (!verify) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    if (!user.isVerified) {
      return NextResponse.json(
        { message: "Please verify your email before logging in." },
        { status: 403 }
      );
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const response = NextResponse.json(
      { user: { id: user._id, name: user.name, username: user.username, email: user.email, avatarSeed: user.avatarSeed } },
      { status: 201 }
    );

    response.cookies.set("token", token, cookieOptions);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
