document.addEventListener('DOMContentLoaded', () => {
    // Create header
    const header = document.createElement('header');
    header.innerHTML = `
        <h1>My Favorite Movies</h1>
         <div class="toggle-container">  
                <input type="checkbox" id="toggle">
                <label for="toggle">🌙</label>
              
            </div>
    `;
    document.body.prepend(header); // Add header to the top of the body

    const favoritesList = document.getElementById('favoritesList');
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (favorites.length === 0) {
        favoritesList.innerHTML = '';
    } else {
        favorites.forEach(movie => {
            fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=b20a453e291faa01557f91eeefb3266b&language=en-US`)
                .then(response => response.json())
                .then(movieData => {
                    const movieDiv = document.createElement('div');
                    movieDiv.innerHTML = `
                        <div class="all-movie"> 
                            <span class="close-lightbox">&times;</span>
                            <img class="movie-card" src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" alt="${movieData.title}">
                            <div class="mov"> 
                                <div class="movie-title">${movieData.title}</div>
                                <div class="movie-info"> ${movieData.vote_average.toFixed(1)}/10 IMDb⭐</div>
                                <a href="detaile.html?id=${movie.id}" class="det">Detail</a>
                            </div>
                        </div>
                         <footer>
            <a href="index.html">  <img src="Icon/Bookmark.png" id="home"></img></a>
           <i class="fa-solid fa-ticket-simple"></i>
          <i class="fa-regular fa-bookmark" id="book"></i>
                       
        </footer>
                    `;
                    
                    favoritesList.appendChild(movieDiv);

                    // Add event listener for close button
                    const closeButton = movieDiv.querySelector('.close-lightbox');
                    closeButton.addEventListener('click', () => {
                        // Remove the movieDiv from the favoritesList
                        favoritesList.removeChild(movieDiv);

                        // Remove the movie from localStorage
                        let currentFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                        currentFavorites = currentFavorites.filter(fav => fav.id !== movie.id);
                        localStorage.setItem('favorites', JSON.stringify(currentFavorites));

                        // Check if the favorites list is now empty and display a message
                        if (favoritesList.children.length === 0) {
                            favoritesList.innerHTML = ''; // Or display a message like "No favorites yet."
                        }
                    });
                })
                .catch(error => {
                    console.error("Error fetching movie details:", error);
                    // Optionally, display a message or remove the broken entry
                    const movieDiv = document.createElement('div');
                    movieDiv.innerHTML = ``;
                    favoritesList.appendChild(movieDiv);
                });
        });
    }

    const toggleInput = document.getElementById('toggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (toggleInput){
          toggleInput.checked = true;
        }
    }
    if (toggleInput){
      toggleInput.addEventListener('change', () => {
          document.body.classList.toggle('dark-mode');
          localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
      });
    }
});