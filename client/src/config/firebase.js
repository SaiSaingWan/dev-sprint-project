import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDphMbmHoODxpwMloVsZ33AyiX5gs6U1tA",
  authDomain: "dev-sprint-project.firebaseapp.com",
  projectId: "dev-sprint-project",
  storageBucket: "dev-sprint-project.firebasestorage.app",
  messagingSenderId: "663729736795",
  appId: "1:663729736795:web:213485c49acbf46c88037e",
  measurementId: "G-N4ZWDCZ8LK"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;