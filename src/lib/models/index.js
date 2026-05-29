import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

// ─── User ────────────────────────────────────────────────────────────────────
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false, minlength: 8 },
    avatarSeed: { type: String, required: true },
    followers: [{ type: Schema.Types.ObjectId, ref: "Follow" }],
    following: [{ type: Schema.Types.ObjectId, ref: "Follow" }],
    watched: { type: Schema.Types.ObjectId, ref: "Watched" },
    watchlist: { type: Schema.Types.ObjectId, ref: "Watchlist" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

export const User = models.User || model("User", userSchema);

// ─── Review ──────────────────────────────────────────────────────────────────
const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    posterPath: { type: String, required: true },
    movieName: { type: String, required: true },
    tmdbId: { type: Number, required: true },
    text: { type: String, trim: true },
    spoiler: { type: Boolean, default: false },
    likesCount: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 10, required: true },
  },
  { timestamps: true }
);
reviewSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

export const Review = models.Review || model("Review", reviewSchema);

// ─── ReviewLike ───────────────────────────────────────────────────────────────
const reviewLikeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    review: { type: Schema.Types.ObjectId, ref: "Review", required: true },
  },
  { timestamps: true }
);
reviewLikeSchema.index({ user: 1, review: 1 }, { unique: true });

export const ReviewLike = models.ReviewLike || model("ReviewLike", reviewLikeSchema);

// ─── Watched ──────────────────────────────────────────────────────────────────
const watchedSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    movieId: { type: String, required: true },
    title: { type: String, required: true },
    posterPath: { type: String },
    genres: [{ type: String }],
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
watchedSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Watched = models.Watched || model("Watched", watchedSchema);

// ─── Watchlist ────────────────────────────────────────────────────────────────
const watchlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    movieId: { type: String, required: true },
    title: { type: String, required: true },
    posterPath: { type: String },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
watchlistSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export const Watchlist = models.Watchlist || model("Watchlist", watchlistSchema);

// ─── Follow ───────────────────────────────────────────────────────────────────
const followSchema = new Schema(
  {
    followerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    followeeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Follow = models.Follow || model("Follow", followSchema);
