// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYqwzMfoRzlTndmxi63jMWbZdOKb0FTdI",
  authDomain: "mern-project-a39d6.firebaseapp.com",
  projectId: "mern-project-a39d6",
  storageBucket: "mern-project-a39d6.appspot.com",
  messagingSenderId: "205581707458",
  appId: "1:205581707458:web:70e87327e2ad3c108f735b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
