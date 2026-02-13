import express from "express";
import { addReview, addToWatched, changePFP, getUserInteraction, removeFromWatched } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/change-pfp', protect, changePFP);
router.post('/addReview', protect, addReview);
router.post('/findUserReview', protect, getUserInteraction);
router.post('/addToWatched', protect, addToWatched);
router.post('/removeFromWatched', protect, removeFromWatched);

export default router;