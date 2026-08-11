//IMPORTS
import { handleSignIn } from "./firebaseconfig.js";
import { handleSignup } from "./firebaseconfig.js";
import '../css/style.css';

document.addEventListener("DOMContentLoaded", () => {

 //Marking DOM-Elements  
const signUpButton=document.getElementById('signUpButton');
const signInButton=document.getElementById('signInButton');
const signInForm=document.getElementById('signIn');
const signUpForm=document.getElementById('signup');
const loginBtn = document.getElementById('submitSignIn');
const registerBtn = document.getElementById('submitSignUp');



//Tying buttons to appropriate functions
signUpButton.addEventListener('click',function(){
    signInForm.style.display="none";
    signUpForm.style.display="block";
})
signInButton.addEventListener('click', function(){
    signInForm.style.display="block";
    signUpForm.style.display="none";
})


loginBtn.addEventListener('click', handleSignIn);
registerBtn.addEventListener('click', handleSignup);




});