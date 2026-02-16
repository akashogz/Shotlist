import express from "express";
import { addReview, addToWatched, changePFP, fetchReviews, getUserInteraction, removeFromWatched } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/change-pfp', protect, changePFP);
router.post('/addReview', protect, addReview);
router.post('/findUserReview', getUserInteraction);
router.post('/addToWatched', protect, addToWatched);
router.post('/removeFromWatched', protect, removeFromWatched);
router.get('/fetchReviews/:userId', fetchReviews);

export default router;