// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABEc1vdWHGav3k5XL3ZFp9WqbO21yjOw0",
  authDomain: "agentes-amapa.firebaseapp.com",
  projectId: "agentes-amapa",
  storageBucket: "agentes-amapa.firebasestorage.app",
  messagingSenderId: "237940639605",
  appId: "1:237940639605:web:766b6b92db969eeb77753c",
  measurementId: "G-1B4EVVZ0TF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);