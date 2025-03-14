document.addEventListener('DOMContentLoaded', () => {
    // Create navigation and movie sections with "See More" buttons
    document.body.innerHTML = `
        <nav>
            <div class="hamburger"><img src="Icon/Menu.png"></img>
            </div>
            <div class="nav-title">MyMovies</div>
         
                <div class="toggle-container">  
              <label class="switch">
        <input type="checkbox" id="darkModeToggle">
        <span class="slider"></span>
    </label>
            </div>
        </nav>
        <div class="more"><h2>Now Showing</h2><button id="toggleMoviesBtn">See More</button></div>
       
        <div id="movies"></div>
        <div class="more"><h2>Popular</h2><button id="togglePopularBtn">See More</button></div>
        <div id="popular"></div>
        <footer>
            <img id="home" src="Icon/Bookmark.png"></img>
           <i class="fa-solid fa-ticket-simple"></i>
           <a href="favorite.html"> <i class="fa-regular fa-bookmark"> </i></a>
                       
        </footer>
    `;

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

    // Fetch Genre List
    let genreList = {};
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=b20a453e291faa01557f91eeefb3266b&language=en-US')
        .then(res => res.json())
        .then(data => {
            genreList = data.genres.reduce((acc, genre) => {
                acc[genre.id] = genre.name;
                return acc;
            }, {});
        })
        .catch(err => console.error("Genre Fetch Error:", err));

    // Store all movies for toggling
    let nowPlayingMovies = [];
    let popularMovies = [];

    // Function to render movies
    function renderMovies(containerId, movies) {
        const container = document.getElementById(containerId);
        container.innerHTML = movies.map(movie => {
            const genres = movie.genre_ids
                .map(id => `<span class="genre-badge">${genreList[id] || 'Unknown'}</span>`)
                .join(' ');
            const runtime = movie.runtime 
                ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` 
                : "Unknown";
            const releaseDate = movie.release_date ? `Released: ${movie.release_date}` : "Unknown release date";

            if (containerId === 'movies') {
                return `
                
                    <a href="detaile.html?id=${movie.id}"><div class="movie-card">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        <div class="movie-title">${movie.title}</div>
                        <div class="movie-info">⭐ ${movie.vote_average.toFixed(1)}/10 IMDb</div>
                    </div></a>
                `;
            } else {
                return `
                    <a href="detaile.html?id=${movie.id}"><div class="movie-pupular">
                        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                        <div class="movie-title">
                            <div class="movie-info">
                                <h1 style="font-family: sans-serif;">${movie.title}</h1>
                                ⭐ ${movie.vote_average.toFixed(1)}/10 IMDb | 
                                <div class="genres">${genres}</div> 
                                ${releaseDate}
                            </div>
                        </div>
                    </div></a>
                `;
            }
        }).join('');
    }

    // Fetch Now Playing Movies
    fetch('data.json')
        .then(res => res.json())
        .then(data => {
            nowPlayingMovies = data.results;
            renderMovies('movies', nowPlayingMovies.slice(0, 3)); 
            setupToggleButton('toggleMoviesBtn', 'movies', nowPlayingMovies);
        })
        .catch(err => console.error("Now Playing Fetch Error:", err));

    // Fetch Popular Movies
    fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1&api_key=b20a453e291faa01557f91eeefb3266b')
        .then(res => res.json())
        .then(data => {
            popularMovies = data.results;
            renderMovies('popular', popularMovies.slice(0, 3)); 
            setupToggleButton('togglePopularBtn', 'popular', popularMovies);
        })
        .catch(err => console.error("Popular Movies Fetch Error:", err));

    // Function to set up "See More" button
    function setupToggleButton(buttonId, containerId, movies) {
        const button = document.getElementById(buttonId);
        let isExpanded = false;

        button.addEventListener('click', () => {
            isExpanded = !isExpanded;
            if (isExpanded) {
                renderMovies(containerId, movies); // Show all movies
                button.textContent = "See Less";
            } else {
                renderMovies(containerId, movies.slice(0, 3)); // Show only the first 3 movies
                button.textContent = "See More";
            }
        });
    }
    function toggleFavorite(id, button) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const index = favorites.indexOf(id);

        if (index === -1) {
            favorites.push(id);
            button.classList.add('card__favoritebtn--selected');
        } else {
            favorites.splice(index, 1);
            button.classList.remove('card__favoritebtn--selected');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
    
});