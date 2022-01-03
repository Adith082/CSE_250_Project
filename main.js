
//Importing functions from firebase-app.js , firebase-auth.js and firebase-database.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
import {getDatabase,ref,set,push,onValue} from "https://www.gstatic.com/firebasejs/9.4.1/firebase-database.js"

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
// Initializing  Firebase and getting a reference to Authentication
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//getting a reference to the database
const db = getDatabase(app);

//Necessary variables for implementation purpose
let firebaseRef;
let respectiveWords = [];
let respectiveWords2 = [];
let wordMap = new Map();
let timeToSearch;
let totalText;
let btnWords = [];
let divWords = [];
let btnWord;
let nDiv;
let mainWord;
  
  //When ever an authorization state is changed this function is called
  onAuthStateChanged(auth, (user) =>  {
    if (user) {
         // Every individual user will have a specific id which is counted as a primary key for real-time database
         firebaseRef = ref(db,user.uid);
    } else {
      console.log("user is currently signed out");   
    }
    });
    

    //Creation and design of buttons and divs for words
    function createButtonDiv(){
      respectiveWords2 = [];
      respectiveWords = [];
      wordMap.clear();
      btnWords = [];
      divWords = [];
      for(let i = 0;i<5000;i++){
      btnWord = document.createElement("button");
       btnWord.style.background = "darkred";
       btnWord.style.color = "whitesmoke";
       btnWord.style.fontSize = "1rem";
       btnWord.style.padding = ".5em , .75em";
       btnWord.style.borderRadius= ".25em";
       btnWord.style.cursor= "pointer";
       btnWord.setAttribute("id",(i).toString());
       btnWord.style.visibility = "visible";
       btnWords.push(btnWord);



       nDiv = document.createElement("div");
       nDiv.setAttribute("id","_" + (i).toString());
       nDiv.style.display= "grid";
       nDiv.style.gridTemplateColumns = "repeat(autofit,minmax(30px,1fr))";
       nDiv.style.gap= "1rem";
       nDiv.style.alignItems= "flex-start";
       nDiv.style.background= "whitesmoke";
       nDiv.style.padding= "1rem";
       nDiv.style.border= "1px solid black";
       nDiv.style.color= "darkred";
       nDiv.style.borderRadius= ".25rem";
       nDiv.style.visibility = "visible";
       
       divWords.push(nDiv);

      }
    }
 //Here when the subtitile file is uploaded , it is being tracked as a string inside the (totalText) string variable
document.getElementById('upload')
            .addEventListener('change', function() {   
            var fr=new FileReader();
            fr.onload=function(){
                totalText = fr.result;
            }
            fr.readAsText(this.files[0]);
        });
  



// checking whether the respective word exists in the database or not and passing the boolean inside a callback function
 function wordExist(strWord,callBack){
    onValue(firebaseRef, (snapshot) => {
        let fl = true;
        snapshot.forEach(function(element){
             if(element.val().inputWord == strWord){
                 fl = false;
             }
        });
            callBack(fl,strWord);
      });
            
}
  
 


 
  document.querySelector("#btn").addEventListener("click",wordSearch);
 //Tracking the words according to the time-stamp which user gives as input and then the function outputWord does the rest of the part. 
 function wordSearch(){
      createButtonDiv();
      timeToSearch = document.getElementById("searchBox").value;
        document.getElementById("searchResult").innerHTML = "";
        let tempo;
       for(let i = 0;i<totalText.length-7;i++){
        if(totalText[i] >= '0' && totalText[i] <= '9' && totalText[i+1] >= '0' && totalText[i+1] <= '9' && totalText[i+2] == ':' && totalText[i+3] >= '0' && totalText[i+3] <= '9' && totalText[i+4] >= '0' && totalText[i+4] <= '9' && totalText[i+5] == ':' && totalText[i+6] >= '0' && totalText[i+6] <= '9' && totalText[i+7] >= '0' && totalText[i+7] <= '9'){
            tempo = (totalText[i] + totalText[i+1] + totalText[i+2] + totalText[i+3] + totalText[i+4] + totalText[i+5] + totalText[i+6] + totalText[i+7]);  
             if(tempo > timeToSearch){
                let wordToSearch = "";
                let k = i+8;
                while(!(totalText[k] >= '0' && totalText[k] <= '9'   && totalText[k+1] >= '0' && totalText[k+1] <= '9' && totalText[k+2] == ':' && totalText[k+3] >= '0' && totalText[k+3] <= '9' && totalText[k+4] >= '0' && totalText[k+4] <= '9' && totalText[k+5] == ':' && totalText[k+6] >= '0' && totalText[k+6] <= '9' && totalText[k+7] >= '0' && totalText[k+7] <= '9')){
                    console.log(totalText[k]);
                    if((totalText[k] >= 'a' && totalText[k] <= 'z') || (totalText[k]>='A' && totalText[k]<='Z')){
                         wordToSearch += totalText[k];
                    }else{
                       
                        if(wordToSearch != ""){
                             if(wordToSearch.length > 2)   respectiveWords.push(wordToSearch.toUpperCase());
                                  wordToSearch = ""; 
                                }
                    }
                    k++;
                }    break;
            }
        }  

       }
       
       respectiveWords.forEach(function(item,index,respectiveWords){
        wordExist(item,function(flagValue,outPutString){
          // the CallBack function
          if((flagValue == true) && (wordMap.get(outPutString) != 1))  {
            wordMap.set(outPutString,1);  
            outputWord(outPutString,index,respectiveWords);
          }
      });
           
       });
           
          respectiveWords = [];
          collectButtonListener();
            
}   




//After getting the respective word , here an API request is sent to get information about the respective word and then the information is being shown as a card-layout
 function outputWord(wordToSearch){

    let request = new XMLHttpRequest();
    request.open('GET', 'https://api.dictionaryapi.dev/api/v2/entries/en_US/' + wordToSearch, true);
    request.onload = function(){
         let data = JSON.parse(this.response);
          let temp = "   ";
          if(data["title"] == undefined){
          for(let i = 0;i<data[0].meanings.length;i++){
             for(let j = 0;j<data[0].meanings[i].definitions.length;j++){
                    temp += data[0].meanings[i].definitions[j].definition;
                    temp += "<br>";
             }
          }
        }
        if(data["title"] == undefined){
        respectiveWords2.push(data[0].word);
         mainWord = document.createElement("h1");
         mainWord.style.font = "2em";
         mainWord.innerHTML = data[0].word;
         let resultBar = document.getElementById("searchResult");
         resultBar.style.visibility = "visible";
         divWords[respectiveWords2.length-1].appendChild(mainWord);
         let wordMeaning = document.createElement("p");
         wordMeaning.style.font = "4rem";
         wordMeaning.innerHTML = temp;
         divWords[respectiveWords2.length-1].appendChild(wordMeaning);
         btnWords[respectiveWords2.length - 1].innerHTML = "Crystal_cleared_" + data[0].word.toUpperCase();
         divWords[respectiveWords2.length-1].appendChild(btnWords[respectiveWords2.length - 1]);
         resultBar.appendChild(divWords[respectiveWords2.length-1]);
        }
     
    }
    request.send(null);
  
       
}


   //Respective word gets pushed into the database as well as the rcard-layout also gets erased 
   function pushingWordInDatabase(btnWord,id){
     
    let alreadyKnownWord = "";
    let alreadyKnownDiv = document.getElementById("_"+ id.toString());
      let givenWord = btnWord.innerHTML;
    for(let i = 16;i<givenWord.length;i++){
        alreadyKnownWord += givenWord[i];
    }  
    
      if(alreadyKnownWord != null){    let inputWord = alreadyKnownWord.toUpperCase();
         set(push(firebaseRef),{inputWord});
         btnWord.style.opacity = "0";
         btnWord.style.transition = "visibility 0s linear 1s, opacity 1s linear";
         alreadyKnownDiv.style.opacity = "0";
         alreadyKnownDiv.style.transition = "visibility 0s linear 1s, opacity 1s linear";
         setTimeout(function(){
           btnWord.remove();
           alreadyKnownDiv.remove();
         }, 1000);
      }
}


 //Card-layout button listener for pushes the clickable card-layouts id to pushingWordInDatabase function
 function collectButtonListener(){
 for(let k = 0;k<btnWords.length;k++) {if(btnWords[k] != null){ 
  btnWords[k].addEventListener("click",function(){pushingWordInDatabase(btnWords[k],k)});
} 
}
 }
 
 

 //signing out buttons function
 if(document.querySelector("#logout") != null){ 
  document.querySelector("#logout").addEventListener("click",function(){
     auth.signOut().then(()=>{
            
            location.href = "./index.html";
     });       
  }); 
  }
