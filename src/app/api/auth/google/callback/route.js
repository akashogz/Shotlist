import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/models";
import { cookieOptions } from "@/lib/cookieOptions";

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.shotlist.uk"
    : "http://localhost:3000";

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://shotlist.uk"
    : "http://localhost:3000";

const googleTokenURL = "https://oauth2.googleapis.com/token";
const googleUserInfoURL = "https://www.googleapis.com/oauth2/v2/userinfo";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(`${FRONTEND_URL}/login?error=oauth`);
    }

    const tokenRes = await fetch(googleTokenURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
      }),
    });

    const tokenData = await tokenRes.json();
    const { access_token } = tokenData;

    const userRes = await fetch(googleUserInfoURL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const { id: googleId, email, name } = await userRes.json();

    await connectDB();

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        name,
        email,
        username: email.split("@")[0] + crypto.randomInt(1000),
        avatarSeed: crypto.randomUUID(),
        authProvider: "google",
        googleId,
        isVerified: true,
        password: crypto.randomUUID(),
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const response = NextResponse.redirect(FRONTEND_URL);
    response.cookies.set("token", token, cookieOptions);
    return response;
  } catch (err) {
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(`${FRONTEND_URL}/login?error=oauth`);
  }
}
