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
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    text: { type: String, trim: true },
    spoiler: { type: Boolean, default: false },
    likesCount: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 10, required: true },
  },
  { timestamps: true }
);
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

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
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
watchedSchema.index({ userId: 1, movie: 1 }, { unique: true });

export const Watched = models.Watched || model("Watched", watchedSchema);

// ─── Watchlist ────────────────────────────────────────────────────────────────
const watchlistSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
watchlistSchema.index({ userId: 1, movie: 1 }, { unique: true });

export const Watchlist = models.Watchlist || model("Watchlist", watchlistSchema);

// ─── Follow ───────────────────────────────────────────────────────────────────
const followSchema = new Schema(
  {
    followerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    followeeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

followSchema.index({ followerId: 1, followeeId: 1 }, { unique: true });

export const Follow = models.Follow || model("Follow", followSchema);

// ─── Movie ────────────────────────────────────────────────────────────────────
const movieSchema = new Schema(
  {
    tmdbId: { type: Number, required: true },
    movieName: { type: String, required: true, trim: true },
    posterPath: { type: String, required: true },
    backdropPath: { type: String },
    releaseDate: { type: String },
    director: { type: String },
    genres: [
      {
        id: Number,
        name: String,
      },
    ],
    voteAverage: { type: Number },
    reviewCount: { type: Number, default: 0 },
    watchedCount: { type: Number, default: 0 },
    watchlistCount: { type: Number, default: 0 },
    collectionCount: { type: Number, default: 0 },
    lastSynced: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

movieSchema.index({ tmdbId: 1 }, { unique: true });
movieSchema.index({ director: 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({
  movieName: "text",
});

export const Movie = models.Movie || model("Movie", movieSchema);

// ─── Collections ────────────────────────────────────────────────────────────────────
const collectionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 1000, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movies: [{
      movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
      position: { type: Number, required: true }, 
      addedAt: { type: Date, default: Date.now, }, 
      note: String,
    }],
    tags: [{ type: String, lowercase: true, trim: true }],
    visibility: { type: String, enum: ["public", "private", "unlisted"], default: "public" },
    likesCount: { type: Number, default: 0 },
    slug: { type: String, unique: true, trim: true, lowercase: true, required: true },
    saveCount: { type: Number, default: 0 },

  }, { timestamps: true }
)

collectionSchema.index({title: "text",});
collectionSchema.index({owner: 1, visibility: 1,});
collectionSchema.index({tags: 1,});

export const Collection = models.Collection || model("Collection", collectionSchema);