import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAKgHBRrMuxnXtleIe34-EeT22oRDzK8H0",
  authDomain: "diplomprojectfinalversion.firebaseapp.com",
  projectId: "diplomprojectfinalversion",
  storageBucket: "diplomprojectfinalversion.appspot.com",
  messagingSenderId: "92478116109",
  appId: "1:92478116109:web:cd22db9c6bea821dd0a044",
  measurementId: "G-F9MV1NXBK5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

export default db;

