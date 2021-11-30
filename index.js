import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword , onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.1/firebase-auth.js";
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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
let flg = true;
//getting a reference to the database
const db = getDatabase(app);
let firebaseRef;
// screen e je word gula ashbe oigular ekta track rakha
let respectiveWords = [];
let respectiveWords2 = [];
let wordMap = new Map();
  onAuthStateChanged(auth, (user) =>  {
    if (user) {
         console.log(user.uid);
         firebaseRef = ref(db,user.uid);
       
    } else {
    console.log("user is currently signed out");
       
    }
    });
    
 let timeToSearch;
 let displayArea;
 let totalText;
 let jsonText;
 let btnWords = [];
 let divWords = [];
 let btnWord;
 let nDiv;
 let mainWord;
 let strLen;
  
    

    function createButtonDiv(){
      respectiveWords2 = [];
      btnWords = [];
      divWords = [];
      for(let i = 0;i<150;i++){
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
 //HERE WHEN THE SUBTITLE FILE IS UPLOADED IS BEING TRACKED AS A STRING INSIDE THE TOTAL TEXT STRING VARIABLE
document.getElementById('upload')
            .addEventListener('change', function() {   
            var fr=new FileReader();
            fr.onload=function(){
                totalText = fr.result;
            }
            fr.readAsText(this.files[0]);
        });
  



// checking whether the respective word exists in the database or not
 function wordExist(strWord,callBack){
     let fl = true;
     let avail = [];
    onValue(firebaseRef, (snapshot) => {
       // let fl = true;
        snapshot.forEach(function(element){
             if(element.val().inputWord == strWord){
                 fl = false;
                 
             }
        });
            callBack(fl,strWord);
      });
            
}
  
 

 //TRACKING THE WORDS ACCORDING TO THE TIME LIMIT USER GIVES AS INPUT AND THEN THE FUNCTION outputWord DOES THE REST OF THE PART.
  
  document.querySelector("#btn").addEventListener("click",wordSearch);
function wordSearch(){
       respectiveWords2 = [];
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
                                respectiveWords.push(wordToSearch.toUpperCase());
                                if(wordToSearch.length > 2){
                                wordExist(wordToSearch.toUpperCase(),function(flagValue,outPutString){
                                    if(flagValue == true)  {
                                     
                                      outputWord(outPutString);
                                    }
                                });
                              }   wordToSearch = "";
                                
                                }
                    }
                    k++;
                }    break;
            }
        }  

       }
       
            respectiveWords2 = [];
            respectiveWords = [];
            collectButtonListener();
          
}   




//AFTER GETTING THE RESPECTIVE WORD , HERE WE ARE SENDING A REQUEST TO THE API TO GIVE INFORMATION ABOUT THE WORD AND THEN  THE INFO IS BEING APPENDED AS A CHILD INSIDE DIV searchResult.
function outputWord(wordToSearch){
    
    let request = new XMLHttpRequest();
    request.open('GET', 'https://api.dictionaryapi.dev/api/v2/entries/en_US/' + wordToSearch, true);
    request.onload = function(){
         let data = JSON.parse(this.response);
          let temp = "   ";
          for(let i = 0;i<data[0].meanings.length;i++){
             for(let j = 0;j<data[0].meanings[i].definitions.length;j++){
                    temp += data[0].meanings[i].definitions[j].definition;
                    temp += "<br>";
             }
          }
        if(data[0].word != null){
        respectiveWords2.push(data[0].word);
        /*let nDiv = document.createElement("div");
      nDiv.style.display= "grid";
      nDiv.style.gridTemplateColumns = "repeat(autofit,minmax(30px,1fr))";
      nDiv.style.gap= "1rem";
      nDiv.style.alignItems= "flex-start";
      nDiv.style.background= "whitesmoke";
      nDiv.style.padding= "1rem";
      nDiv.style.border= "1px solid black";
      nDiv.style.color= "darkred";
      nDiv.style.borderRadius= ".25rem";*/
          mainWord = document.createElement("h1");
         mainWord.style.font = "2em";
         mainWord.innerHTML = data[0].word;
         let resultBar = document.getElementById("searchResult");
         resultBar.style.visibility = "visible";
         divWords[respectiveWords2.length-1].appendChild(mainWord);
        // nDiv.appendChild(mainWord);
         let wordMeaning = document.createElement("p");
         wordMeaning.style.font = "4rem";
         wordMeaning.innerHTML = temp;
         divWords[respectiveWords2.length-1].appendChild(wordMeaning);
         //nDiv.appendChild(wordMeaning);
         btnWords[respectiveWords2.length - 1].innerHTML = "CRYSTAL_CLEARED_" + data[0].word.toUpperCase();
         //btnWords[respectiveWords2.length - 1].style.visibility = "visible";
         //divWords[respectiveWords2.length-1].style.visibility = "visible";
         divWords[respectiveWords2.length-1].appendChild(btnWords[respectiveWords2.length - 1]);
         resultBar.appendChild(divWords[respectiveWords2.length-1]);
           
        }
     
    }
    request.send();
       
}



   function pushingWordInDatabase(btnWord,id){
     
    let alreadyKnownWord = "";
    let alreadyKnownDiv = document.getElementById("_"+ id.toString());
      let givenWord = btnWord.innerHTML;
    for(let i = 16;i<givenWord.length;i++){
        alreadyKnownWord += givenWord[i];
    }  
    
      if(alreadyKnownWord != null){    let inputWord = alreadyKnownWord.toUpperCase();
         set(push(firebaseRef),{inputWord});
         btnWord.style.visibility = "hidden";
         alreadyKnownDiv.style.visibility = "hidden";
      }
}



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
            
            location.href = "./src/auth.html";
     });       
  }); 
  }