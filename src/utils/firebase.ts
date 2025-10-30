// Firebase configuration
// Replace these values with your Firebase project credentials
// Get these from: Firebase Console > Project Settings > Your apps


import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// TODO: Replace with your Firebase project configuration
// For now, this is a placeholder - you'll need to:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Add a web app to your project
// 3. Copy the config values here
const firebaseConfig = {
  apiKey: "AIzaSyCBQeqmfBAhfpkkjnix9b7b5GwWoKpZTv8",
  authDomain: "leetcode-pomodoro.firebaseapp.com",
  projectId: "leetcode-pomodoro",
  storageBucket: "leetcode-pomodoro.appspot.com",
  messagingSenderId: "778726541370",
  appId: "1:778726541370:web:3371a2f5b39dfc8fc20d03",
  measurementId: "G-0BZWX40BB7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export default app;
