import mongoose from "mongoose";

const { Schema, model } = mongoose;

const movieSnippetSchema = new Schema({
  movieId: { type: Number, required: true },
  title: { type: String, required: true },
  posterPath: { type: String },
  addedAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    avatarSeed: {
      type: String,
      required: true,
    },
    followers: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref: "User",
    }],
    
    watched: { 
      type: Schema.Types.ObjectId,
      ref: "Watched"
     },

    watchlist: {
      type: Schema.Types.ObjectId,
      ref: "Watchlist"
    },
    
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true }
);

export default model("User", userSchema);