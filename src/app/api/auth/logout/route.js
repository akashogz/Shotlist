import { NextResponse } from "next/server";
import { cookieOptions } from "@/lib/cookieOptions";

export async function GET() {
  const response = NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  response.cookies.set("token", "", { ...cookieOptions, expires: new Date(0) });
  return response;
}
