// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , signInWithEmailAndPassword, createUserWithEmailAndPassword , onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBniIdVJL0qTyu6YZh-q3Ib7wm2SDmbvY",
  authDomain: "loginauthtest-c52c8.firebaseapp.com",
  projectId: "loginauthtest-c52c8",
  storageBucket: "loginauthtest-c52c8.firebasestorage.app",
  messagingSenderId: "1079481677328",
  appId: "1:1079481677328:web:d947260280d13a44f27c95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
 export const auth = getAuth();





//shows error messages on login/register site
function showMessage(message, divId){
    let messageDiv=document.getElementById(divId);
    messageDiv.style.display="block";
    messageDiv.innerHTML=message;
    messageDiv.style.opacity=1;
    setTimeout(function(){
        messageDiv.style.opacity=0;
    },5000);
 }


//Function for registering users
export function handleSignup(e) {
	e.preventDefault();

	const email = document.getElementById('rEmail').value;
	const password = document.getElementById('rPassword').value;
	const userName = document.getElementById('rUsername').value;


 createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
	const userData = { //passes registered data as userData
		email: email,
		userName: userName,
		createdAt: new Date(),
	}
	console.log(`Success! registered user ${userName} with email ${email}`);
	const docRef = doc(db, "users", user.uid); //references the collection of users in the database
	setDoc(docRef, userData) //Passes userData onto the selected uid in database collection
	.then(() => {
		window.location.href= 'index.html';
	})
	.catch((error) => {
		console.error('Error writing document');
	})

    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

			switch(error.code){
				case "auth/email-already-in-use":
					showMessage('Email Address already in use!', 'signUpMessage');
				break;
				case	"auth/weak-password":
					showMessage('Password is too weak, minimum 6 characters', 'signUpMessage');
				break;
				case 	"auth/invalid-email":
				showMessage('please register with a valid email format', 'signUpMessage');
				break;
			}


    // ..
  });
}



export function handleSignIn(e) {
	e.preventDefault();

	const email = document.getElementById('log-email').value;
	const password = document.getElementById('log-password').value;



  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
	console.log(`User with email ${email} logged in!`);
	window.location.href='dashboard.html';
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;

	if(errorCode == 'auth/invalid-credential'){
		showMessage('The password and email does not match', 'signInMessage');
	}

	
  });
}




onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    // User is signed out
    // ...
  }
});


export function logOut(e) {
	if(e) e.preventDefault();
	
	signOut(auth)
	.then(() => {
	  // Sign-out successful.
	  window.location.href="index.html";
	  console.log('User signed out!');
	  window.alert('Successfully logged out!');
	}).catch((error) => {
		console.log(error);
		window.alert(error);
	  // An error happened.
	});
	
}