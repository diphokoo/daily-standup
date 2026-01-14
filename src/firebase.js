import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBCogaJAnBzoY-DeK2GO89uIGgAuCg62lI",
  authDomain: "daily-stand-up-c1640.firebaseapp.com",
  projectId: "daily-stand-up-c1640",
  storageBucket: "daily-stand-up-c1640.firebasestorage.app",
  messagingSenderId: "781559164072",
  appId: "1:781559164072:web:312016ab9a95e4c96a669d",
  measurementId: "G-ZF0BT3806Y"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
