import axios from "axios";

const API_KEY = import.meta.env.VITE_REACT_APP_API_KEY;
const BASE_URL = import.meta.env.VITE_REACT_APP_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
});

export const fetchDiscoverMovies = async (currentPage = 1, filters) => {
    try {
        const response = await api.get('discover/movie', {
            params: {
                api_key: API_KEY,
                page: currentPage,
                ...(filters.sortBy && { sort_by: filters.sortBy }),
                ...(filters.genres?.length && { with_genres: filters.genres.join(",") }),
                ...(filters.releaseStart && { "primary_release_date.gte": filters.releaseStart }),
                ...(filters.releaseEnd && { "primary_release_date.lte": filters.releaseEnd }),
                ...(filters.runtimeMax && { "with_runtime.lte": filters.runtimeMax }),
                ...(filters.language && { with_original_language: filters.language }),
                ...(filters.certification && {
                    certification_country: "US",
                    "certification.lte": filters.certification,
                }),
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
};