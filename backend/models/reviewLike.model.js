import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewLikeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    review: {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    }
  },
  { timestamps: true }
);

reviewLikeSchema.index({ user: 1, review: 1 }, { unique: true });

export default model("ReviewLike", reviewLikeSchema);
