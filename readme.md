##Description
This app functions as a site where movies can temporarily rent movies for cheap,
with prices that are lower than cinema tickets or a normal streaming subscription.
Its made for situations where people want to rent a movie for one-time use, or people who do not stream as much, and thus have no reason for a rolling streaming subscription.

##Features:
* **User Authentication & Management:** Handled by Firebase Auth.
* **Movie Discovery:** Dynamic fetching of popular movies with genre filtering.
* **Smart Cart System:** Uses real-time Firestore synchronization for cart management.
* **48-Hour Rental Validation:** Prevents users from re-renting movies they already have active before the expiration date.
* **Order History:** Detailed log of previous rentals, including movies and dates.
* **Modular Codebase:** Structured into modular JS and CSS files.



APIS:
TMDB API
The project uses a free API key from 'themoviedb.com' - which I received for free upon registry, for fetching movie card content.
It was selected for it´s comprehensive datasets and free developer access (upon registry).
link:**[The Movie Database (TMDB) API](https://developer.themoviedb.org/docs):** 

Firebase
The project also uses Firebase (FireStore and Authentication) for handling clients user authentiction, and document storage (such as the cart section and order history section). 
It was selected for secure user session handling and real-time database synchronization.
link:**[Firebase Auth & Firestore](https://firebase.google.com/docs):**


##IMPORTANT - READ##
You may notice that the first commit pushes a large number of files, stacked full of code.
this is because it originally started as  a "first-draft" or a practice project (AFTER RECEIVING THE ASSIGNMENT AND CRITERIA) for my final project, but as I put more time into it, I grew more invested. 