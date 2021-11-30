// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword , onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
              
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
//module scaffolding
const FirebaseAndUserInfo = {};
// Your web app's Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// getting the data
//const email = document.getElementById("email").value;
//const password = document.getElementById("password").value;


//  THIS PART IS FOR SIGN UP
if(document.querySelector("#signup") != null){
document.querySelector("#signup").addEventListener("click",function(){
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;
        createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
// Signed in 
location.href = "../index.html";
const user = userCredential.user;
alert("signed up");
location.href = "../index.html"
// ...
})
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
alert(errorMessage);
// ..
});
}); 
}

//functions signin


///THIS PART IS FOR SIGN IN
if(document.querySelector("#signin") != null){
document.querySelector("#signin").addEventListener("click",function(){
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;
signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
alert("signed in");
//location.href = "../index.html";
const user = userCredential.user;
location.href = "../index.html";
// ...
})
.catch((error) => {
const errorCode = error.code;
const errorMessage = error.message;
alert(errorMessage);
});
}); 
}
  
// for sign out
if(document.querySelector("#signout") != null){ 
document.querySelector("#signout").addEventListener("click",function(){
   auth.signOut().then(()=>{
           console.log("user is signed out");
   });       
}); 
}


// for getting the signed in users unique id
 
   
       
//console.log("user token again 2" + firebaseConfig.id);

 