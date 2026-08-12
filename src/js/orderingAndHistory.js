//IMPORTS
import {doc, getDoc, setDoc} from 'firebase/firestore/lite';
import { db, auth } from './firebaseconfig.js';
import { renderCartView, syncCartfromFireStore } from './cartService.js';


//function for checking out
export async function checkout() {
	const user = auth.currentUser;
	if(!user) return alert("PLease log in to complete your purchase.");

	try{
                //sync function for fetching cart
		const rawCart = await syncCartfromFireStore(user.uid);
		const cart = Array.isArray(rawCart) ? rawCart : [];

		if (cart.length === 0) {
			return alert("Your cart is empty!");
		} //checks it the cart has any items

		const totalPrice = cart.reduce((sum, item) => sum + (item.price || 40), 0); //calculates total price of items

        //Creates a new order item based on the payload recieved from cart
		const newOrder = {
			orderId: `ORD-${Date.now()}${user.uid.slice(0,7)}`,
			createdAt: new Date().toISOString(),
			totalPrice: totalPrice,
			items: cart
		};

        //defining const for functions
		const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const userData = userDoc.exists() ? userDoc.data() : {};
        const existingOrders = Array.isArray(userData.orders) ? userData.orders : [];

        //adds a new order into users orders array
		await setDoc(userDocRef, {
			orders: [newOrder, ...existingOrders],
			cart: []
		}, {merge: true});


		alert("🎉 Purchase confrimed! enjoy your movies!."); //upon ordering

		await renderCartView(); //refreshes cart
        renderOrderHistory(); //refreshes order history


	} catch(error){
		console.error("Checkout failed:", error);
		alert("Failed to process payment. Please try again.");
	}



}



//function for rendering order history
export async function renderOrderHistory(){
	  const orderHistoryContainer = document.getElementById('orderHistory');
	  if(!orderHistoryContainer) return;

	  const user = auth.currentUser;
	  if(!user) {
		orderHistoryContainer.innerHTML = `<p>Please log in to view your ordere history.</p>`
		return;
	  }

	  orderHistoryContainer.innerHTML = `<p>Loading order history...</p>`;

    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            orderHistoryContainer.innerHTML = `<p>No previous orders found.</p>`;
            return;
        }

        const orders = userDoc.data().orders || [];

        if (orders.length === 0) {
            orderHistoryContainer.innerHTML = `<p>You haven't rented any movies yet.</p>`;
            return;
        } // If the user has not ordered any movies

        //maps through orders and destructures them into viewable 'cards'
        const ordersHTML = orders.map(({ orderId, createdAt, totalPrice, items }) => {
            const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            const itemsList = items.map(({ title, poster, price }) => `
                <div class="order-item-chip" >
                    ${poster ? `<img src="${poster}" alt="${title}">`: ''}
                    <div>
                        <strong style="display: block; font-size: 0.95rem;">${title}</strong>
                        <small style="color: #aaa;">${price || 40} kr / 48 hrs</small>
                    </div>
                </div>
            `).join('');

            return `
                <div class="order-card" >
                    <div >
                        <span>${orderId}</span>
                        <small >${formattedDate}</small>
                    </div>
                    <div >
                        ${itemsList}
                    </div>
                    <div >
                        Total Paid: ${totalPrice} kr
                    </div>
                </div>
            `;
        }).join('');

        orderHistoryContainer.innerHTML = `<h3>Your Rentals</h3>${ordersHTML}`;

    } catch (error) {
        console.error("Failed to render order history:", error); //for error handling
        orderHistoryContainer.innerHTML = `<p>Could not load order history.</p>`; //html for if orders could not load
    }

    
    renderOrderHistory();


}