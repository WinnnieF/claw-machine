"use client"
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set, push } from "firebase/database";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { useEffect } from "react";
export default function FB0529() {

  // Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "nccu-web-design.firebaseapp.com",
  projectId: "nccu-web-design",
  storageBucket: "nccu-web-design.firebasestorage.app",
  messagingSenderId: "49328770893",
  appId: "1:49328770893:web:85a80446945840b315f104",
  databaseURL: "https://nccu-web-design-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getDatabase(app);
const dbRef = ref(database, "/");

const auth = getAuth();
const provider = new GoogleAuthProvider();

useEffect(()=>{

  
  onValue(dbRef, (snapshot)=>{
    console.log( snapshot.val() );
  });

  const userRef = ref(database, "/accounts/00001/");

  set(userRef, {
    name: "Winnie",
    points: 200
  });

  
}, []);

const addNewAccount = () => {
  console.log("clicked");
  const accountRef = ref(database, "/accounts");

  push(accountRef, {
    name: "Winnie",
    type: "User",
    points: "10"
  });

}

const login = () => {
 
  signInWithPopup(auth, provider).then((result)=>{
    console.log(result);
    console.log(result.user.uid);
    console.log(result.user.displayName);
    

    const uid = result.user.uid;
    const name = result.user.displayName;


    const accountRef = ref(database, "/accounts/" + uid);
    console.log(accountRef); 
    
    if(!accountRef){
      //沒有此帳號，建立一個
      console.log("enter");

      push(accountRef, {
        name: name,
        type: "User",
        point: "10",
        uid: uid
      });

    }

  });

}

return (
  <>
    fb0529
    <div
      onClick={addNewAccount}
      className=" text-black border-black border-2 px-4 py-1 inline-block">
      Add new Account
    </div>
    <div
      onClick={login}
      className=" text-black border-black border-2 px-4 py-1 inline-block">
      Login with GOOGLE
    </div>
  </>
);
}