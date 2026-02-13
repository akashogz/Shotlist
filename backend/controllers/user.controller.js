import reviewModel from "../models/review.model.js";
import userModel from "../models/user.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

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
        const { tmdbId, text, rating } = req.body;
        const userId = req.user._id;

        if (!tmdbId || !rating) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const review = await reviewModel.create({
            user: userId,
            tmdbId,
            text,
            rating
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
        console.log(movieId)

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