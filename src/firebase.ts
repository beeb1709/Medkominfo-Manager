import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAq83AS8GmsTI1qoXAuHW58RAwePLjZZc",
  authDomain: "medkominfo-submission-d0139.firebaseapp.com",
  projectId: "medkominfo-submission-d0139",
  storageBucket: "medkominfo-submission-d0139.firebasestorage.app",
  messagingSenderId: "478028894302",
  appId: "1:478028894302:web:b28fec5529327920a464cf",
  measurementId: "G-J9SD82D68N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
