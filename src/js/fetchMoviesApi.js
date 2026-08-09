const TMBD_API_KEY = process.env.TMBD_API_KEY
const TMBD_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export async function fetchMovies(query = '', genreId = ''){
	let url = `${TMBD_BASE_URL}/movie/popular?api_key=${TMBD_API_KEY}&language=en-US&page=1`;

	if (query){
		url = `${TMBD_BASE_URL}/search/movie?api_key=${TMBD_API_KEY}&query=${encodeURIComponent(query)}`;
	} else if (genreId){
		url = `${TMBD_BASE_URL}/discover/movie?api_key=${TMBD_API_KEY}&with_genres=${genreId}`;
	}

	try {
		const response = await fetch(url);
		const data = await response.json();
		renderMovies(data.results || []);
	}catch(error){
		console.error('Error fetching TMBD movies:', error);
	}

	

}

function renderMovies(movies) {
	const movieGrid = document.getElementById('movieGrid');
	if (!movieGrid) return;

	if (movies.length === 0) {
		movieGrid.innerHTML = '<p>No movies found. </p>'
		return;
	}

	movieGrid.innerHTML = movies.map(movie => {
		const poster = movie.poster_path
		?`${IMAGE_BASE_URL}${movie.poster_path}`
		:'https://via.placeholder.com/500x750?text=No+Poster';

		return `
		<div class="movie-card" data-id="${movie.id}">
			<img src="${poster}" alt="${movie.title}">
			<div class="movie-info">
			<h3>${movie.title}</h3>
			<p class="rating">⭐️ ${movie.vote_average.toFixed(1)}/10 </p>
			<p class="movie-price"> 40kr / 48t</p>
			<button class="rent-Btn" data-id="${movie.id}" data-title="${movie.title.replace(/"/g, '&quot;')}">
			Add to cart
			</button>
			</div>
		</div>
		`;
	}).join('');

	document.querySelectorAll('.rent-Btn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const movieId = e.target.getAttribute('data-id');
			const movieTitle = e.target.getAttribute('data-title');
			handleRentMovie(movieId, movieTitle);
		});
	});
}

//Marked DOM-Elements for making filtering work
const genreSelect = document.getElementById('genreSelect');
const searchInput = document.getElementById('searchInput');

export function movieFiltering(){

	if (genreSelect) {
		genreSelect.addEventListener('change', (e) => {
			const selectedGenre = e.target.value; 
			const currentSearch = searchInput ? searchInput.value : '';
			
			
			fetchMovies(currentSearch, selectedGenre);
		});
	}

}
