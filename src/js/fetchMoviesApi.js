import { addMovieToCart } from "./cartService.js";


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

		const movieSynopsis = getSentences(movie.overview, 2);

		return `
		<div class="movie-card" data-id="${movie.id}">
			<img src="${poster}" alt="${movie.title}">
			<div class="movie-info">
			<h3>${movie.title}</h3>
			<p class="rating">⭐️ ${movie.vote_average.toFixed(1)}/10 </p>

			
			<p class="actors" id="cast-${movie.id}"></p>	
			<p class="synopsis">${movieSynopsis}</p>

			<p class="movie-price"> 40kr / 48hrs</p>
			<button class="addToCartBtn" 
			data-id="${movie.id}" 
			data-title="${movie.title.replace(/"/g, '&quot;')}"
			data-poster = "${poster}"
			>
			Add to cart
			</button>
			</div>
		</div>
		`;
	}).join('');

	document.querySelectorAll('.addToCartBtn').forEach(btn => {
		btn.addEventListener('click', (e) => {

			const thisTarget = e.currentTarget;

			const movieData = {
				id: thisTarget.getAttribute('data-id'),
				title: thisTarget.getAttribute('data-title'),
				poster: thisTarget.getAttribute('data-poster'),
				price: 40
			};

			addMovieToCart(movieData);

			console.log("Constructed moviedata payload:", movieData);
		
		});
	});

	movies.forEach(movie => {
		loadMovieCast(movie.id);
	})


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


async function loadMovieCast(movieId) {

	const castElement = document.getElementById(`cast-${movieId}`);

	try{
		const url =`${TMBD_BASE_URL}/movie/${movieId}/credits?api_key=${TMBD_API_KEY}&language=en-US`;
	const response = await fetch(url);
		if(!response.ok) return;

	const data = await response.json();

	const topActors = data?.cast?.slice(0,3).map(actor => actor.name).join(', ');


	if(castElement) {
		castElement.innerHTML = `<strong>Cast:</strong> ${topActors || 'N/A'}`;
	}

	} catch(error){
		console.error(`Failed to load cast for movie: ${movie.title}  id: ${movie.id}`, error);
	}
	
}



function getSentences(text, count = 2) {
	if(!text) return 'No Synopsis available';
	const sentences = text.match(/[^.!?]+[.!?]+/g);
	if(!sentences) return text;
	return sentences.slice(0, count).join(' ');
}


