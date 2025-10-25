// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz0KXK9LFgMhC8cXSeI0ftMtz_sS_VTTs",
  authDomain: "kissansahyata.firebaseapp.com",
  projectId: "kissansahyata",
  storageBucket: "kissansahyata.firebasestorage.app",
  messagingSenderId: "535308124611",
  appId: "1:535308124611:web:a3739b0d1806db8994fd76",
  measurementId: "G-Z3JL5HB5H7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth to use in your app
export const auth = getAuth(app);
