import axios from "axios";

const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchTrendingMovies = async () => {
  try {
    const response = await api.get('trending/movie/week', {
      params: {
        api_key: API_KEY,
        language: 'en-US',
        page: 1,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
};