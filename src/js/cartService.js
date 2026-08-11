//IMPORTS
import {doc, getDoc, setDoc} from 'firebase/firestore/lite';
import { db, auth } from './firebaseconfig.js';
import { checkout } from './orderingAndHistory.js';




//function for syncing cart collection from Firestore
export async function syncCartfromFireStore(userId) {
	//checks the authenticated user
	const user = auth.currentUser;
	if(!user) return;

	//Finds users cart-array based on uid inside "user" database collection
	try{
		const userDocRef = doc(db, "users", user.uid);
		const docSnap = await getDoc(userDocRef);

		if (docSnap.exists() && Array.isArray(docSnap.data().cart)){
				return docSnap.data().cart;
		}

		return[];
	}catch(error){
		console.error('Error fetching cart from Firestore:', error);
		return [];
	}
}




//Function for adding movies to cart
export async function addMovieToCart(movie) {
	console.log("Movie object recieved by addMovieToCart:", movie);

	const user = auth.currentUser;
	if(!user) return alert("please login to add items to cart.");

	try{

		const userDocRef = doc(db, "users", user.uid );
		const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : {};

		//Call sync function from earlier to sync cart
		const cart = await syncCartfromFireStore(user.uid);
		const orders = Array.isArray(userData.orders) ? userData.orders : [];

		//Targets movie-id to see if they´re already in cart
		const targetId = String(movie.id);
		const exists = cart.some(item => String(item.id) === targetId);

		//alerts the user if the movie is already in cart
		if (exists){
			alert(`"${movie.title}" is already in your cart!`);
			return;
		}

		//checks time limit
		const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;
        const now = Date.now();

		//Goes through orders and checks if they´ve already rented the movie (less than 48 hours ago)
        const activeRental = orders.find(order => {
            const orderTime = new Date(order.createdAt).getTime();
            const isWithin48Hours = (now - orderTime) < FORTY_EIGHT_HOURS_MS;
            const containsMovie = order.items && order.items.some(item => String(item.id) === targetId);
            
            return isWithin48Hours && containsMovie;
        });

        if (activeRental) {
            const rentalTime = new Date(activeRental.createdAt).getTime();
            const hoursLeft = Math.ceil((FORTY_EIGHT_HOURS_MS - (now - rentalTime)) / (1000 * 60 * 60));
            
            alert(`You are currently renting "${movie.title}"! Your access expires in approximately ${hoursLeft} hour(s).`);
			console.log(`You are currently renting "${movie.title}"! Your access expires in approximately ${hoursLeft} hour(s).`)
            return;
        }

		//fallbacks to make sure poster is fetched correctly
		const rawPoster = 
		(movie.poster !== null && movie.poster !== undefined) ? movie.poster :
		(movie.poster_path !== null && movie.poster_path !== undefined) ? movie.poster_path:
		(movie.backdrop_path !== null && movie.backdrop_path !== undefined) ? movie.backdrop_path:
		'';

		let finalPoster = '';
		if (typeof rawPoster === 'string' && rawPoster.trim() !== ''){
			finalPoster = rawPoster.startsWith('http')
			? rawPoster
			:  `https://image.tmdb.org/t/p/w500${rawPoster.startsWith('/') ? '' : '/'}${rawPoster}`;
		}

		//Constructs movieItem to add to cart
		const newItem = {
			id: targetId,
			title: movie.title,
			price: Number(movie.price) ||40,
			poster: finalPoster
		}

		cart.push(newItem);

		//merges cart with cart in Firestore
		await setDoc(userDocRef, {cart: cart}, {merge: true});

		alert(`Added "${movie.title}" to cart!`);

		//Refreshes cart upon adding new movie
		renderCartView();

	}catch(error){
		console.error("Failed to add movie to cart in Firestore:", error); //console error checks for error handling
		alert("Failed to update cart. Please try again.");
	}
	

	
}


//function for rendering cart
export async function renderCartView() {
	const shoppingCart = document.getElementById('shoppingCart');
	if(!shoppingCart) return;

	const user = auth.currentUser;
	if(!user) {
		shoppingCart.innerHTML = `<h2>Please Log in to view your cart</h2>`;
		return;
	}

		//syncs cart with syncCart function
	const cart = await syncCartfromFireStore(user.uid); 

	if (cart.length === 0) {
		shoppingCart.innerHTML =`
		<p>Your cart is empty</p>`;
		return;
	}

	//Calculates total price
	const totalPrice = cart.reduce((sum, item) => sum +(item.price || 40), 0);

	//destructures items in cart and gives them a card
	const itemsHTML = cart.map(item => {
		
		
		return`
		<div class="class-item">
			<div>
				${item.poster ? `<img src="${item.poster}" alt="${item.title}">`: ''}	
				<div>
					<h3>${item.title}</h3>
					<p>${item.price || 40}kr / 48 hrs</p>
				</div>
			</div>
			<button class="removeItemBtn" data-id="${item.id}">Remove</button>
		</div>
	`}).join('');

	shoppingCart.innerHTML = `
		<div class="cartItemsList>
			${itemsHTML}
		</div>
		<div class="cartSummary">
		<h3>Total: ${totalPrice} kr</h3>
		<button id="checkoutBtn">
			Confirm Order & Pay
		</button>
		</div>
	`;

	//removing movie from cart
	document.querySelectorAll('.removeItemBtn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const movieId = e.target.getAttribute('data-id');
			removeFromCart(movieId);
		});
	});


	//Button for checking out and ordering
	document.getElementById('checkoutBtn').addEventListener('click', async() => {
		await checkout();
	})
	

 
}


//Function for removing item from cart
async function removeFromCart(movieId) {
  const user = auth.currentUser;
  if(!user) return;
  
  try{
	let cart = await syncCartfromFireStore(user.uid);

	//defines movie by matching to movie id
	const idtoRemove = String(movieId);
	cart = cart.filter(item => String(item.id) !== idtoRemove); //filtes through cart and removes by movieId



	const userDocRef = doc(db, "users", user.uid); //finds the users reference document
	await setDoc(userDocRef, {cart: cart}, {merge: true}); //merges users cart with Firestore cart after removing item

	//refreshes cart upon removing item
	renderCartView();
  }catch(error){
	console.error("Failed to remove item from Firestore", error); //console error for error handling
  }


}