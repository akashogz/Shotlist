import express from "express";
import { googleCallback, googleRedirect, register } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import reviewModel from "../models/review.model.js";
import ratingModel from "../models/rating.model.js";

const router = express.Router();

router.post("/signup", register);
router.get("/google", googleRedirect);
router.get("/google/callback", googleCallback);
router.get("/me", protect, async (req, res) => {
  try {
    const [reviewCount, ratingCount] = await Promise.all([
      reviewModel.countDocuments({ user: req.user._id }),
      ratingModel.countDocuments({ user: req.user._id }),
    ]);

    return res.json({
      ...req.user.toObject(),
      stats: {
        reviews: reviewCount,
        ratings: ratingCount,
      },
    });
  } catch (err) {
    console.error("ME route error:", err);
    res.status(500).json({ message: "Failed to fetch user data" });
  }
});


export default router;
