import axios from "axios";

const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: "en-US",
    },
});

export const getMovieDetails = async (movieId) => {
    try {
        const response = await api.get(`/movie/${movieId}`, {
            params: {
                append_to_response: "credits,watch/providers,recommendations,similar"
            }
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch movie details:", error);
        throw error;
    }
};
