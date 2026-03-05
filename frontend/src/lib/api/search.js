import axios from "axios";

const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

export const searchMovie = async (query) => {
  try {
    const response = await api.get('search/movie', {
      params: {
        api_key: API_KEY,
        query: query, 
        include_adult: false,
        language: 'en-US'
      }
    });
    
    return response.data.results || []; 
  } catch (error) {
    console.error('Error fetching movies:', error.message);
    return [];
  }
};