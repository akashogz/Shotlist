import reviewModel from "../models/review.model.js";
import reviewLikeModel from "../models/reviewLike.model.js";
import { Types } from "mongoose";

export const likeToggle = async (req, res) => {
    try {
        const userId = req.user._id;
        const { reviewId } = req.body;

        const reviewObjectId = new Types.ObjectId(reviewId);

        const existingLike = await reviewLikeModel.findOne({
            user: userId,
            review: reviewObjectId
        });

        if (!existingLike) {
            await reviewLikeModel.create({
                user: userId,
                review: reviewObjectId
            });

            await reviewModel.updateOne(
                { _id: reviewObjectId },
                { $inc: { likesCount: 1 } }
            );

            return res.json({ message: "Liked successfully", isLiked: true });
        } else {
            await reviewLikeModel.deleteOne({ _id: existingLike._id });

            await reviewModel.updateOne(
                { _id: reviewObjectId },
                { $inc: { likesCount: -1 } }
            );

            return res.json({ message: "Unliked successfully", isLiked: false });
        }

    } catch (error) {
        console.error("Error toggling like:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
