import axios from "axios";
import dotenv from "dotenv";
import https from "https";

dotenv.config();

const API_KEY = process.env.TMDB_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const httpsAgent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 50,
  timeout: 60000,
});

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  httpsAgent,
  timeout: 20000, 
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Connection': 'keep-alive'
  }
});

tmdbApi.interceptors.response.use(null, async (error) => {
  const { config } = error;
  if (!config || config._retryCount >= 5) return Promise.reject(error);

  config._retryCount = config._retryCount || 0;
  config._retryCount++;

  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || (error.response && error.response.status === 403)) {
    const delay = config._retryCount * 300;
    console.log(`[Render-Retry] Attempt ${config._retryCount} for ${config.url}`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return tmdbApi(config);
  }
  return Promise.reject(error);
});

tmdbApi.interceptors.request.use((config) => {
  config.params = { ...config.params, api_key: API_KEY, language: "en-US" };
  return config;
});

export const getPopularMovies = async (req, res) => {
  try {
    const { data } = await tmdbApi.get("/movie/popular", { params: { page: req.query.page || 1 } });
    res.json(data.results);
  } catch (err) { res.status(500).json({ error: "Popular movies unavailable" }); }
};

export const getTopRatedMovies = async (req, res) => {
  try {
    const { data } = await tmdbApi.get("/movie/top_rated");
    res.json(data.results);
  } catch (err) { res.status(500).json({ error: "Top rated movies unavailable" }); }
};

export const searchMovies = async (req, res) => {
  try {
    const { data } = await tmdbApi.get("/search/movie", { params: { query: req.query.query, include_adult: false } });
    res.json(data.results);
  } catch (err) { res.status(500).json({ error: "Search unavailable" }); }
};

export const getDiscoverMovies = async (req, res) => {
  try {
    const { data } = await tmdbApi.get("/discover/movie", { params: { ...req.query } });
    res.json(data.results);
  } catch (err) { res.status(500).json({ error: "Discovery unavailable" }); }
};

export const getMovieDetails = async (req, res) => {
  try {
    const { data } = await tmdbApi.get(`/movie/${req.params.movieId}`, { params: { append_to_response: "credits,videos,recommendations" } });
    res.json(data);
  } catch (err) { res.status(404).json({ error: "Movie details not found" }); }
};

export const getTrendingMovies = async (req, res) => {
  try {
    const { data } = await tmdbApi.get("/trending/movie/week");
    res.json(data.results);
  } catch (err) {
    res.status(500).json({ error: "Trending movies unavailable" });
  }
};