// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDTKwl828NWbVn7COwCCoNTjZVZ5VVW5Q",
  authDomain: "fin-algo-c781c.firebaseapp.com",
  projectId: "fin-algo-c781c",
  storageBucket: "fin-algo-c781c.appspot.com",
  messagingSenderId: "162744698598",
  appId: "1:162744698598:web:7e5c399f2cd13b01f91d27",
  measurementId: "G-XP7R8FET6G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);