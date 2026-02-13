import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ratingSchema = new Schema(
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
},
  { timestamps: true }
);

ratingSchema.index({ user: 1, tmdbId: 1 }, { unique: true });

export default model("Rating", ratingSchema);