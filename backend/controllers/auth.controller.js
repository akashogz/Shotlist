import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import axios from "axios";
import crypto from "crypto";
import User from "../models/user.model.js";
import { cookieOptions } from "../lib/cookieOptions.js";
import {
  googleOAuthURL,
  googleTokenURL,
  googleUserInfoURL,
} from "../lib/googleOAuthConfig.js";

const BACKEND_URL = process.env.NODE_ENV === "production" 
  ? "https://shotlist.onrender.com" 
  : "http://localhost:3000";

const FRONTEND_URL = process.env.NODE_ENV === "production" 
  ? "https://shotlist.uk" 
  : "http://localhost:5173";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "User doesn't exist!" });

    const verify = await bcrypt.compare(password, user.password);
    if (!verify) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatarSeed: user.avatarSeed,
        },
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (exists) {
      return res.status(409).json({
        message: exists.email === email ? "Email already exists" : "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      avatarSeed: username.toLowerCase(),
      authProvider: "local",
      emailVerified: false,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res
      .cookie("token", token, cookieOptions)
      .status(201)
      .json({
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          avatarSeed: user.avatarSeed,
        },
      });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const googleRedirect = (req, res) => {
  const redirectUrl =
    `${googleOAuthURL}?` +
    new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
      response_type: "code",
      scope: "email profile",
      prompt: "consent",
    });

  res.redirect(redirectUrl);
};

export const googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Missing code" });

    const tokenRes = await axios.post(
      googleTokenURL,
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${BACKEND_URL}/api/auth/google/callback`,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const { access_token } = tokenRes.data;
    const userRes = await axios.get(googleUserInfoURL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id: googleId, email, name } = userRes.data;
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      user = await User.create({
        name,
        email,
        username: email.split("@")[0] + crypto.randomInt(1000),
        avatarSeed: crypto.randomUUID(),
        authProvider: "google",
        googleId,
        emailVerified: true,
        password: crypto.randomUUID(),
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res
      .cookie("token", token, cookieOptions)
      .redirect(FRONTEND_URL);
  } catch (err) {
    console.error("Google OAuth error:", err);
    res.redirect(`${FRONTEND_URL}/login?error=oauth`);
  }
};

export const logout = async (req, res) => {
  try {
    res
      .clearCookie("token", {
        ...cookieOptions,
        expires: new Date(0),
      })
      .status(200)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
};