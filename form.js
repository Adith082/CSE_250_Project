// Importing necessary functions that we need from firebase-app.js and firebase-auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
              

// web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnU84w-mRsQLBcak29Nw4pfgDzFelcSPQ",
  authDomain: "subtitle-hacks.firebaseapp.com",
  databaseURL: "https://subtitle-hacks-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "subtitle-hacks",
  storageBucket: "subtitle-hacks.appspot.com",
  messagingSenderId: "49823560767",
  appId: "1:49823560767:web:33a39a3d3e2649ff2ef48a",
  measurementId: "G-Y808J8Y5MY"
};

// Initializing Firebase and getting a reference to authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//  Signing up the user using firebase authentication after clicking the sign up button with required information
if(document.querySelector("#signup") != null){
document.querySelector("#signup").addEventListener("click",function(){
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
        createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
//setting the location to main.html after signing up the new user 
location.href = "./main.html";
const user = userCredential.user;
alert("signed up");
})
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
alert(errorMessage);
// ..
});
}); 
}

///Signing in the user using firebase authentication after clicking the sign in button with required information
if(document.querySelector("#signin") != null){
document.querySelector("#signin").addEventListener("click",function(){
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
alert("signed in");
location.href = "./main.html";
const user = userCredential.user;
//location.href = "main.html";
// ...
})
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
alert(errorMessage);
});
}); 
}
  

