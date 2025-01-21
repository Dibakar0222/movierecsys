const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors()); // Enable CORS for cross-origin requests

// TMDb API configuration
const API_KEY = "638d8bf9269b853937c945c14f8abaf4"; // Replace with your TMDb API Key
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"; // For medium-size posters

/**
 * Search for a movie by its title using TMDb API.
 */
async function searchMovie(query) {
    const url = `${BASE_URL}/search/movie`;
    try {
        const response = await axios.get(url, {
            params: {
                api_key: API_KEY,
                query: query
            }
        });
        if (response.data.results && response.data.results.length > 0) {
            const movie = response.data.results[0];
            return { id: movie.id, genre_ids: movie.genre_ids };
        }
        return { id: null, genre_ids: null };
    } catch (error) {
        console.error("Error in searchMovie:", error.message);
        return { id: null, genre_ids: null };
    }
}

/**
 * Fetch movies based on genres using TMDb API, including poster paths.
 */
async function getRecommendationsByGenre(genreIds) {
    const url = `${BASE_URL}/discover/movie`;
    try {
        const response = await axios.get(url, {
            params: {
                api_key: API_KEY,
                with_genres: genreIds.join(','),
                sort_by: "popularity.desc"
            }
        });

        const recommendations = response.data.results.slice(0, 5).map(movie => {
            return {
                title: movie.title,
                release_date: movie.release_date || "N/A",
                poster_url: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null
            };
        });

        return recommendations;
    } catch (error) {
        console.error("Error in getRecommendationsByGenre:", error.message);
        return [];
    }
}

/**
 * API endpoint to get movie recommendations.
 */
app.get('/recommend', async (req, res) => {
    const movieTitle = req.query.movie;
    if (!movieTitle) {
        return res.status(400).json({ error: "No movie title provided" });
    }

    const { id, genre_ids } = await searchMovie(movieTitle);
    if (id && genre_ids) {
        const recommendations = await getRecommendationsByGenre(genre_ids);
        return res.json({ recommendations });
    } else {
        return res.status(404).json({ error: "Movie not found" });
    }
});

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
