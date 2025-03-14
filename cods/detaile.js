const API_KEY = 'b20a453e291faa01557f91eeefb3266b';
const BASE_URL = 'https://api.themoviedb.org/3';

// Function to fetch the movie trailer
async function fetchMovieTrailer(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        const trailer = data.results.find(video => video.type === "Trailer" && video.site === "YouTube");
        return trailer ? trailer.key : null; // Return YouTube video ID
    } catch (error) {
        console.error("Error fetching movie trailer:", error);
        return null;
    }
}

// Function to fetch movie details
async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits`);
        const movie = await response.json();
        const trailerKey = await fetchMovieTrailer(movieId);
        renderMovieDetails(movie, trailerKey);
        setupFavoriteToggle(movie); // Setup favorite toggle
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
    
    // Get the switch input and status paragraph
    const switchInput = document.getElementById('darkModeToggle');
    const statusText = document.getElementById('status');
    
    // Check if dark mode is already enabled in localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        switchInput.checked = true;
        statusText.textContent = 'Dark Mode';
    }

    // Add an event listener for when the switch is toggled
    switchInput.addEventListener('change', function() {
        if (switchInput.checked) {
            document.body.classList.add('dark-mode');
            statusText.textContent = 'Dark Mode';
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.body.classList.remove('dark-mode');
            statusText.textContent = 'Light Mode';
            localStorage.setItem('darkMode', 'disabled');
        }
    });

}

// Function to render movie details
function renderMovieDetails(movie, trailerKey) {
    document.body.innerHTML = `
        <div class="movie-header">
    
    <div class="movie-backdrop" style="background-image: url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})">
        ${trailerKey ? `<button id="trailerButton" class="trailer-button pulse"><i class="fa-solid fa-play"></i></button>` : ''}
            <div class="toggle-container">  
              <label class="switch">
        <input type="checkbox" id="darkModeToggle">
        <span class="slider"></span>
    </label>
                 <a href="index.html"> <i id="arrow-left" class="fa-solid fa-arrow-left"></i> </a>
            </div>
    </div>
</div>
        </div>
        <div id="movieDetails" class="movie-details">
        
            <div class="movie-title">${movie.title}
                <i id="favoriteBtn" class="fa-regular fa-bookmark"></i></div>
            <div class="movie-rating">⭐ ${movie.vote_average.toFixed(1)}/10 IMDb</div>
            <div class="genres">${movie.genres.map(genre => `<span class="genre-badge">${genre.name}</span>`).join('')}</div>
            <div class="details">
                <div class="details-row"><span class="details-label">Length</span><span class="details-value">${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min</span></div>
                <div class="details-row"><span class="details-label">Language</span><span class="details-value">${movie.original_language.toUpperCase()}</span></div>
                <div class="details-row"><span class="details-label">Rating</span><span class="details-value">PG-13</span></div>
            </div>
            <div class="description-title">Description</div>
            <div class="description-text">${movie.overview}</div>
            <div class="cast">
                <div class="cast-title">Cast</div>
                <button id="seeMoreCast">See More</button>
            </div>
        </div>
        ${trailerKey ? `<div id="trailerLightbox" class="lightbox" style="display: none;">
            <div class="lightbox-content">
                <span class="close-lightbox">&times;</span>
                <iframe class="movie-trailer-lightbox" src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
            </div>
        </div>` : ''}
    `;

    // Render cast
    const castContainer = document.createElement('div');
    castContainer.className = 'cast-container';
    const initialCast = movie.credits.cast.slice(0, 4);

    function renderCast(castList) {
        castContainer.innerHTML = castList.map(member => `
            <div class="cast-member">
                <img class="cast-image" src="https://image.tmdb.org/t/p/w185${member.profile_path || ''}" alt="${member.name}" 
                onerror="this.src='https://via.placeholder.com/80?text=No+Image'">
                <div class="cast-name">${member.name}</div>
            </div>
        `).join('');
    }

    document.getElementById('movieDetails').appendChild(castContainer);
    renderCast(initialCast);

    // See More button functionality
    let isExpanded = false;
    const seeMoreButton = document.getElementById('seeMoreCast');
    seeMoreButton.addEventListener('click', () => {
        isExpanded = !isExpanded;
        renderCast(isExpanded ? movie.credits.cast : initialCast);
        seeMoreButton.textContent = isExpanded ? 'See Less' : 'See More';
    });
    // Lightbox functionality
    if (trailerKey) {
        const trailerButton = document.getElementById('trailerButton');
        const lightbox = document.getElementById('trailerLightbox');
        const closeLightbox = document.querySelector('.close-lightbox');
        trailerButton.addEventListener('click', () => {
            lightbox.style.display = 'block';
        });

        closeLightbox.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
}

// Setup favorite toggle
function setupFavoriteToggle(movie) {
    const favoriteBtn = document.getElementById('favoriteBtn');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const isFavorite = favorites.some(fav => fav.id === movie.id);

    if (isFavorite) {
        favoriteBtn.classList.remove('fa-regular');
        favoriteBtn.classList.add('fa-solid');
        favoriteBtn.style.color = '#b2bc00d1' 
    }

    favoriteBtn.addEventListener('click', () => {
        let currentFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = currentFavorites.findIndex(fav => fav.id === movie.id);

        if (index === -1) { 
            currentFavorites.push(movie);
            favoriteBtn.classList.remove('fa-regular');
            favoriteBtn.classList.add('fa-solid');
            favoriteBtn.style.color = '#b2bc00d1';
        } else {
            currentFavorites.splice(index, 1);
            favoriteBtn.classList.remove('fa-solid');
            favoriteBtn.classList.add('fa-regular');
            favoriteBtn.style.color = ''; // Reset color
        }

        localStorage.setItem('favorites', JSON.stringify(currentFavorites));
    });
}

// Get movie ID from URL and fetch details
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    if (movieId) {
        fetchMovieDetails(movieId);
    } else {
        console.error("No movie ID found in URL");
    }

    
});
