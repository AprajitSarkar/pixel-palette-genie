
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDSq9TbdLhJ-m9Ov3ZCRotwhrBWOFFAVUE",
  authDomain: "stube-clone.firebaseapp.com",
  databaseURL: "https://stube-clone-default-rtdb.firebaseio.com",
  projectId: "stube-clone",
  storageBucket: "stube-clone.firebasestorage.app",
  messagingSenderId: "872937502355",
  appId: "1:872937502355:android:15185df77e36ab7a91ff66"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
