import reviewModel from "../models/review.model.js";
import userModel from "../models/user.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { Types } from "mongoose";
import watchedModel from "../models/watched.model.js";

export const changePFP = async (req, res) => {
    try {
        const { avatarSeed } = req.body;
        const userId = req.user._id;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { avatarSeed: avatarSeed } },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Update successful",
            avatarSeed: updatedUser.avatarSeed
        });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ error: error.message });
    }
}

export const addReview = async (req, res) => {
    try {
        const { tmdbId, text, rating, username, avatarSeed, movieName, posterPath } = req.body;
        const userId = req.user._id;

        if (!tmdbId || !rating || !username || !movieName) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const exists = await reviewModel.findOne({ tmdbId, user: new mongoose.Types.ObjectId(userId) });
        if (exists) return res.status(400).json({ message: "Already reviewed!" })

        const review = await reviewModel.create({
            user: userId,
            tmdbId,
            text,
            rating,
            username,
            avatarSeed,
            movieName,
            posterPath
        });

        res.status(201).json({ message: "Review added successfully", review });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const addToWatched = async (req, res) => {
    try {
        const { movieId, title, posterPath } = req.body;
        const userId = req.user._id;

        const exists = await watchedModel.findOne( { userId, movieId });
        console.log(exists)

        if (exists) {
            return res.status(400).json({ message: "Movie already in watched list" });
        }

        const watched = await watchedModel.create({
            userId,
            movieId,
            title,
            posterPath
        })

        res.status(201).json({
            message: "Added to watched",
            watched: watched
        });
    } catch (error) {
        console.error("Error adding to watched:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const removeFromWatched = async (req, res) => {
    try {
        const { tmdbId } = req.body;
        const userId = req.user._id;

        if (!tmdbId) return res.status(400).json({ message: "No movie id provided" });

        const deleted = await watchedModel.findOneAndDelete({ movieId: tmdbId, userId });

        res.status(200).json({
            message: "Removed from watched",
            watched: deleted
        });
    } catch (error) {
        console.error("Error removing from watched:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getUserInteraction = async (req, res) => {
    try {
        const userId = req.user._id;
        const { tmdbId } = req.body;

        const review = await reviewModel.findOne({ tmdbId, user: new mongoose.Types.ObjectId(userId) });

        res.status(200).json({ message: "Review fetched succesfully", review, watched: req.user.watched });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const fetchReviews = async (req, res) => {
    try {
        const { userId } = req.params;
        const { viewerId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const pipeline = [
            { $match: { user: new Types.ObjectId(userId) } },

            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    username: "$userDetails.username",
                    avatarSeed: "$userDetails.avatarSeed"
                }
            },
            { $project: { userDetails: 0 } }
        ];

        if (viewerId && Types.ObjectId.isValid(viewerId)) {
            pipeline.push(
                {
                    $lookup: {
                        from: "reviewlikes",
                        let: { reviewId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$review", "$$reviewId"] },
                                            { $eq: ["$user", new Types.ObjectId(viewerId)] }
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "userLike"
                    }
                },
                {
                    $addFields: {
                        isLiked: { $gt: [{ $size: "$userLike" }, 0] }
                    }
                },
                { $project: { userLike: 0 } }
            );
        } else {
            pipeline.push({ $addFields: { isLiked: false } });
        }

        pipeline.push({ $sort: { createdAt: -1 } });

        const reviews = await reviewModel.aggregate(pipeline);
        res.status(200).json({ reviews: reviews || [] });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const fetchTopReviews = async (req, res) => {
    try {
        const topReviews = await reviewModel.find()
            .sort({ likesCount: -1 })
            .limit(2)
            .populate('user', 'username avatarSeed')
            .lean();

        return res.status(200).json({ message: "Top Reviews fetched", topReviews });
    } catch (error) {
        console.error("Error fetching top reviews:", error);
        throw error;
    }
}

export const fetchMovieReviews = async (req, res) => {
    try {
        const { tmdbId, viewerId } = req.query;

        if (!tmdbId) {
            return res.status(400).json({ message: "tmdbId is required" });
        }

        const movieNumberId = Number(tmdbId);
        const viewerObjectId = viewerId && mongoose.Types.ObjectId.isValid(viewerId)
            ? new mongoose.Types.ObjectId(viewerId)
            : null;

        const pipeline = [
            { $match: { tmdbId: movieNumberId } },

            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },

            {
                $addFields: {
                    username: "$userDetails.username",
                    avatarSeed: "$userDetails.avatarSeed"
                }
            },
            {
                $lookup: {
                    from: "reviewlikes",
                    let: { reviewId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$review", "$$reviewId"] },
                                        { $eq: ["$user", viewerObjectId] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "userLike"
                }
            },
            {
                $addFields: {
                    isLiked: { $gt: [{ $size: "$userLike" }, 0] }
                }
            },

            { $project: { userDetails: 0, userLike: 0 } },

            { $sort: { createdAt: -1 } }
        ];

        const reviews = await reviewModel.aggregate(pipeline);

        return res.status(200).json({
            reviews: reviews || [],
            count: reviews.length
        });

    } catch (error) {
        console.error("Error in fetchMovieReviews:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const editReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const { rating, text } = req.body;
        const { userId } = req.user._id;

        const review = await reviewModel.findById(reviewId);

        if (!review) return res.status(404).json({ message: "Review doesn't exist" });
        if (!review.user.equals(userId)) res.status(403).json({ message: "Not the owner" });

        const update = {}
        if (rating !== undefined) update.rating = rating;
        if (text !== undefined) update.text = text;

        const updatedReview = await reviewModel.findByIdAndUpdate(reviewId,
            { $set: update },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Review Updated", updatedReview });
    } catch (error) {
        console.error("Error in updateReviews:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const checkWatched = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        
        console.log(req.params);
        const tmdbId = Number(id);

        const isWatched = await watchedModel.findOne({ movieId: tmdbId, userId });
        console.log(isWatched, tmdbId)

        return res.status(200).json({ message: "Fetched", isWatched: !!(isWatched) });

    } catch (error) {
        console.error("Error in checkWatched:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
} 

export const fetchWatched = async (req, res) => {
    try {
        const userId = req.params.id;
        const watched = await watchedModel.find({ userId }).sort({ addedAt: -1 });

        return res.status(200).json({ message: "Fetched watched", watched });
    } catch (error) {
        console.error("Error in fetchWatched:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}