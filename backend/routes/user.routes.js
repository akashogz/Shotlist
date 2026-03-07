import express from "express";
import { addReview, addToWatched, addToWatchlist, changePFP, checkWatched, deleteReview, editReview, fetchMovieReviews, fetchReviews, fetchTopReviews, fetchWatched, fetchWatchlist, getUserInteraction, removeFromWatched, removeFromWatchlist } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post('/change-pfp', protect, changePFP);
router.post('/addReview', protect, addReview);
router.post('/findUserReview', getUserInteraction);
router.post('/addToWatched', protect, addToWatched);
router.post('/removeFromWatched', protect, removeFromWatched);
router.get('/fetchReviews/:userId', fetchReviews);
router.get('/fetchTopReviews', fetchTopReviews);
router.get('/fetchMovieReviews', fetchMovieReviews);
router.get('/editReviews/:id', protect, editReview);
router.get('/checkWatched/:id', protect, checkWatched);
router.get('/fetchWatched/:id', fetchWatched);
router.post('/addToWatchlist', protect, addToWatchlist);
router.post('/removeFromWatchlist', protect, removeFromWatchlist);
router.get('/fetchWatchlist/:id', fetchWatchlist);
router.delete('/deleteReview/:id', protect, deleteReview);

export default router;