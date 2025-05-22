// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVz_sDPktKaTXJbqiNKamc_6VnIJgHVH4",
  authDomain: "cl3fwilson-65c91.firebaseapp.com",
  projectId: "cl3fwilson-65c91",
  storageBucket: "cl3fwilson-65c91.firebasestorage.app",
  messagingSenderId: "1088228827391",
  appId: "1:1088228827391:web:ef114b25cecd8baa1b2cca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };  // Export only what you need