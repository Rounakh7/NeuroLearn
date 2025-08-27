import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔹 Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDw7QxImtDDBNkRaWdR-RqX5v0LiQKe-Mo",
  authDomain: "cognibridge-demo.firebaseapp.com",
  projectId: "cognibridge-demo",
  storageBucket: "cognibridge-demo.appspot.com",
  messagingSenderId: "618194770448",
  appId: "1:618194770448:web:70d5463ff1d95368710895"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
