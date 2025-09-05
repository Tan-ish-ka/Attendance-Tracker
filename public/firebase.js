// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6rqVf8uwCqoyxCXq-Czvp_kRzRDY32Rw",
  authDomain: "attendance-tracker-f44a7.firebaseapp.com",
  projectId: "attendance-tracker-f44a7",
  storageBucket: "attendance-tracker-f44a7.firebasestorage.app",
  messagingSenderId: "137523138795",
  appId: "1:137523138795:web:3dd4c08af4b6a62a1beeae",
  measurementId: "G-JB884XN19Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
