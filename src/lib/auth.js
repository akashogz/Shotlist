import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectDB from "@/lib/db/mongodb";
import { User } from "@/lib/models";

export async function getAuthUser() {
  console.log("========== AUTH START ==========");

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  console.log("TOKEN EXISTS:", !!token);

  if (!token) {
    console.log("NO TOKEN FOUND");
    return null;
  }

  try {
    console.log("JWT SECRET EXISTS:", !!process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    await connectDB();
    console.log("DB CONNECTED");

    const user = await User.findById(decoded.id).select(
      "-password -verificationToken -verificationTokenExpires"
    );

    console.log("USER FOUND:", !!user);

    if (!user) {
      console.log("USER NOT FOUND IN DATABASE");
      return null;
    }

    console.log("========== AUTH SUCCESS ==========");
    return user;
  } catch (err) {
    console.error("========== AUTH ERROR ==========");
    console.error(err);
    console.error("===============================");
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthUser();

  if (!user) {
    console.log("AUTH FAILED");
    return {
      error: true,
      status: 401,
      message: "Not authenticated",
    };
  }

  console.log("AUTH PASSED");

  return { user };
}