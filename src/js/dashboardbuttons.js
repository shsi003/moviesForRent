

export function showMenu() {
	shoppingCart.style.display = 'none';
	previousOrders.style.display = 'none';
	menuSection.style.display='block';
}

export function showCart() {
	shoppingCart.style.display = 'block';
	previousOrders.style.display = 'none';
	menuSection.style.display='none';
}

export function showOrders() {
	shoppingCart.style.display = 'none';	
	menuSection.style.display='none';
	previousOrders.style.display = 'block';
}