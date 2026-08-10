import {doc, getDoc, setDoc} from 'firebase/firestore/lite';
import { db, auth } from './firebaseconfig.js';





export async function syncCartfromFireStore(userId) {
	const user = auth.currentUser;
	if(!user) return;

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





export async function addMovieToCart(movie) {
	const user = auth.currentUser;
	if(!user) return alert("please login to add items to cart.");

	try{
		const cart = await syncCartfromFireStore(user.uid);

		const targetId = String(movie.id);
		const exists = cart.some(item => String(item.id) === targetId);

		if (exists){
			alert(`"${movie.title}" is already in your cart!`);
			return;
		}

		const posterUrl = movie.poster || movie.poster_path;
		const newItem = {
			id: targetId,
			title: movie.title,
			price: 40,
		}

		cart.push(newItem);

		const userDocRef = doc(db, "users", user.uid );
		await setDoc(userDocRef, {cart: cart}, {merge: true});

		alert(`Added "${movie.title}" to cart!`);

		renderCartView();

	}catch(error){
		console.error("Failed to add movie to cart in Firestore:", error);
		alert("Failed to update cart. Please try again.");
	}
	

	
}

export async function renderCartView() {
	const shoppingCart = document.getElementById('shoppingCart');
	if(!shoppingCart) return;

	const user = auth.currentUser;
	if(!user) {
		shoppingCart.innerHTML = `<h2>Please Log in to view your cart</h2>`;
		return;
	}

	const cart = await syncCartfromFireStore(user.uid); 

	if (cart.length === 0) {
		shoppingCart.innerHTML =`
		<p>Your cart is empty</p>`;
		return;
	}

	const totalPrice = cart.reduce((sum, item) => sum +(item.price || 40), 0);

	const itemsHTML = cart.map(item => `
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
	`).join('');

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

	document.querySelectorAll('.removeItemBtn').forEach(btn => {
		btn.addEventListener('click', (e) => {
			const movieId = e.target.getAttribute('data-id');
			removeFromCart(movieId);
		});
	});


}



async function removeFromCart(movieId) {
  const user = auth.currentUser;
  if(!user) return;
  
  try{
	let cart = await syncCartfromFireStore(user.uid);

	const idtoRemove = String(movieId);
	cart = cart.filter(item => String(item.id) !== idtoRemove);



	const userDocRef = doc(db, "users", user.uid);
	await setDoc(userDocRef, {cart: cart}, {merge: true});

	renderCartView();
  }catch(error){
	console.error("Failed to remove item from Firestore", error);
  }


}