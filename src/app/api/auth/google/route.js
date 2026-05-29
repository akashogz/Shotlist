import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.shotlist.uk"
    : "http://localhost:3000";

const googleOAuthURL = "https://accounts.google.com/o/oauth2/v2/auth";

export async function GET() {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
    response_type: "code",
    scope: "email profile",
    prompt: "consent",
  });

  return NextResponse.redirect(`${googleOAuthURL}?${params}`);
}
