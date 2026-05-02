import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBtjn3KSU8PxOHCy3Ed6RoFtE1fpiNb4aw",
  authDomain: "novashop-e5643.firebaseapp.com",
  projectId: "novashop-e5643",
  storageBucket: "novashop-e5643.appspot.com",
  messagingSenderId: "208735453501",
  appId: "1:208735453501:web:03934d35d4acb732e30554",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);