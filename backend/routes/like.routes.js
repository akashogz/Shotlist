import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { likeToggle } from "../controllers/like.controller.js";

const router = express.Router();

router.post('/likeToggle', protect, likeToggle);

export default router