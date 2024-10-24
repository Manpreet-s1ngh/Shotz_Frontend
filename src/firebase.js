// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvide, GoogleAuthProvider } from 'firebase/auth';
import '../src/'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDQsgbyZ6LCO8MH1hF1faU30J8IJxfTvfE",
  authDomain: "sceneshare-4d84f.firebaseapp.com",
  projectId: "sceneshare-4d84f",
  storageBucket: "sceneshare-4d84f.appspot.com",
  messagingSenderId: "834554138122",
  appId: "1:834554138122:web:a3848282574fca3b11d9f3",
  measurementId: "G-N60N0KZRW5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth( app );

const provider = new GoogleAuthProvider();
export   {auth , provider};
