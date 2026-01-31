import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tmdbId: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    spoiler: {
      type: Boolean,
      default: false,
    },

    likesCount: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

export default model("Review", reviewSchema);