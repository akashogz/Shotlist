import express from "express";
import { googleCallback, googleRedirect, logout, register } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import reviewModel from "../models/review.model.js";
import ratingModel from "../models/rating.model.js";
import userModel from "../models/user.model.js";

const router = express.Router();

router.post("/signup", register);
router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);
router.get("/logout", logout);
router.get("/me", protect, async (req, res) => {
  try {
    const [reviewCount, ratingCount] = await Promise.all([
      reviewModel.countDocuments({ user: req.user._id }),
    ]);

    return res.json({
      ...req.user.toObject(),
      stats: {
        reviews: reviewCount,
      },
    });
  } catch (err) {
    console.error("ME route error:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});

router.get("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const targetUser = await userModel.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") }
    }).select("-password");

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const [reviewCount] = await Promise.all([
      reviewModel.countDocuments({ user: targetUser._id }),
    ]);

    return res.json({
      ...targetUser.toObject(),
      stats: {
        reviews: reviewCount,
      },
    });
  } catch (err) {
    console.error("Fetch profile error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
