import express from "express";
import { 
  getPopularMovies, 
  getTrendingMovies, 
  getTopRatedMovies,
  getMovieDetails,
  getDiscoverMovies,
  searchMovies,
  getPersonDetails
} from "../controllers/movie.controller.js";

const router = express.Router();

router.get("/popular", getPopularMovies);
router.get("/trending", getTrendingMovies);
router.get("/top_rated", getTopRatedMovies);
router.get("/search", searchMovies);
router.get("/discover", getDiscoverMovies);
router.get("/:movieId", getMovieDetails);
router.get("/person/:personId", getPersonDetails);

export default router;