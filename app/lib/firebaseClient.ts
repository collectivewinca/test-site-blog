import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBp7cV45-dz53a-pvdarHGrPH6oG_nF8i8",
  authDomain: "velab-458919.firebaseapp.com",
  projectId: "velab-458919",
  storageBucket: "velab-458919.appspot.com",
  messagingSenderId: "822914084371",
  appId: "1:822914084371:web:0fb0b2720592ff805159e6",

};

// Prevent re-initialization in Next.js/React
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export { app, db }; 