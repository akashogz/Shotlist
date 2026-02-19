import reviewModel from "../models/review.model.js";
import userModel from "../models/user.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import { Types } from "mongoose";

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

        const user = await User.findById(userId);
        const exists = user.watched.some(movie => movie.movieId === movieId);

        if (exists) {
            return res.status(400).json({ message: "Movie already in watched list" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { watched: { movieId, title, posterPath } } },
            { new: true }
        );

        res.status(201).json({
            message: "Added to watched",
            watched: updatedUser.watched
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

        const numericId = Number(tmdbId);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    watched: { movieId: numericId }
                }
            },
            { new: true }
        ).select("watched");

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "Removed from watched",
            watched: updatedUser.watched
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
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
        const topReviews = await reviewModel.find({
            createdAt: { $gte: oneWeekAgo }
        })
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

        // 1. Convert tmdbId to Number because it's a Number in your Schema
        // 2. Convert viewerId to ObjectId for the $eq comparison in the pipeline
        const movieNumberId = Number(tmdbId);
        const viewerObjectId = viewerId && mongoose.Types.ObjectId.isValid(viewerId) 
            ? new mongoose.Types.ObjectId(viewerId) 
            : null;

        const pipeline = [
            // Match reviews for this specific movie
            { $match: { tmdbId: movieNumberId } },

            // Pull user details (username, avatar) from the Users collection
            {
                $lookup: {
                    from: "users", // Must match your MongoDB collection name
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },

            // Add fields to the top level for easier frontend access
            {
                $addFields: {
                    username: "$userDetails.username",
                    avatarSeed: "$userDetails.avatarSeed"
                }
            },

            // Check if the current viewer has liked this review
            {
                $lookup: {
                    from: "reviewlikes", // Ensure this matches your likes collection name
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

            // Clean up: Remove the temporary objects we joined
            { $project: { userDetails: 0, userLike: 0 } },

            // Sort by newest first
            { $sort: { createdAt: -1 } }
        ];

        const reviews = await reviewModel   .aggregate(pipeline);

        return res.status(200).json({
            reviews: reviews || [],
            count: reviews.length
        });

    } catch (error) {
        console.error("Error in fetchMovieReviews:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};