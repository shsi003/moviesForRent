import { onAuthStateChanged,} from "firebase/auth";
import {  getDoc, doc } from 'firebase/firestore/lite';
import { db, auth } from "./firebaseconfig.js";
import { logOut } from "./firebaseconfig.js";

import { showMenu, showCart, showOrders } from "./dashboardbuttons.js";

import { fetchMovies, movieFiltering } from "./fetchMoviesApi.js";


import '../css/dashboard.css';
import '../css/fetchMovies.css';

document.addEventListener("DOMContentLoaded", () => {
	
	const menuSection = document.getElementById('menuSection');
	const shoppingCart = document.getElementById('shoppingCart');
	const previousOrders = document.getElementById('previousOrders');

	const menuBtn = document.getElementById('menuBtn');
	const cartBtn = document.getElementById('shoppingCartBtn');
	const OrdersBtn = document.getElementById('previousOrdersBtn');

	

	const logOutBtn = document.getElementById('logOutBtn');


	menuBtn.addEventListener('click', showMenu);
	cartBtn.addEventListener('click', showCart);		
	OrdersBtn.addEventListener('click',showOrders);
	logOutBtn.addEventListener('click', logOut);


	
	
	fetchMovies();
	movieFiltering();



	




	onAuthStateChanged(auth, (user) => {
		if (user) {

		const uid = user.uid;
		  const docRef = doc(db, "users", uid);
		  getDoc(docRef)
		  .then((docSnap)=>{
			if(docSnap.exists()){
				const userData = docSnap.data();
				document.getElementById('loggedInUsername').innerText=userData.userName;
			}else{
				console.log('No user found with matching id');
			}
		  })
		  .catch((error) => {
			console.log("Error fetching document");
		  })
		  // ...
		} else {
			console.log("User id not found");
			window.location.href = 'index.html';
		  // User is signed out
		  // ...
		}
	  });	

	



	  
	  showMenu();
	 

})
