import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRymAewqBpniZku4zgTv7uJefj3eXH0tA",
  authDomain: "dating-site-cff44.firebaseapp.com",
  projectId: "dating-site-cff44",
  storageBucket: "dating-site-cff44.appspot.com",
  messagingSenderId: "944475325077",
  appId: "1:944475325077:web:8ec2b567952ceea542119c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();