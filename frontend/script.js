async function getRecommendations() {
    const movieInput = document.getElementById('movieInput').value;
    const recommendationsDiv = document.getElementById('recommendations');

    if (!movieInput) {
        recommendationsDiv.innerHTML = 'Please enter a movie title.';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/recommend?movie=${encodeURIComponent(movieInput)}`);
        const data = await response.json();

        if (data.recommendations.length > 0) {
            const recommendationsList = data.recommendations.map(movie => `
                <div class="movie">
                    <img src="${movie.poster_url}" alt="${movie.title}" />
                    <p>${movie.title}</p>
                </div>
            `).join('');
            recommendationsDiv.innerHTML = `<div class="movies-grid">${recommendationsList}</div>`;
        } else {
            recommendationsDiv.innerHTML = 'No recommendations found.';
        }
    } catch (error) {
        console.error('Error:', error);
        recommendationsDiv.innerHTML = 'An error occurred while fetching recommendations.';
    }
}