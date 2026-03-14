import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-v4tuYfeyFLJ1YxsPJq_UxNlv6dcW9mc",
  authDomain: "angel-mart-e9bfa.firebaseapp.com",
  projectId: "angel-mart-e9bfa",
  appId: "1:10505435313:web:6d631ebd4db78dcee4ca90",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const API_URL = import.meta.env.VITE_DB_URL || "https://sheetdb.io/api/v1/g048qvsq925es";
