//Functions for showing each tab

export function showMenu() {
	shoppingCartSection.style.display = 'none';
	previousOrders.style.display = 'none';
	menuSection.style.display='block';
}

export function showCart() {
	shoppingCartSection.style.display = 'block';
	previousOrders.style.display = 'none';
	menuSection.style.display='none';
}

export function showOrders() {
	shoppingCartSection.style.display = 'none';	
	menuSection.style.display='none';
	previousOrders.style.display = 'block';
}