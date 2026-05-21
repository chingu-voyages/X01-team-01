// firebase.js

import { initializeApp } from 'firebase/app';
import {getAuth, GoogleAuthProvider, GithubAuthProvider,signInWithPopup, signOut} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';


// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const storageRef = ref(storage);

// providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Force Google account chooser
googleProvider.setCustomParameters({
  prompt: "select_account",
});

githubProvider.setCustomParameters({
  login: "",
  allow_signup: "true",
});

// Google sign in
async function signInWithGoogle() {
  try {
    await signOut(auth);
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (err) {
    return null;
  }
}

// GitHub sign in
async function signInWithGithub() {
  try {
    await signOut(auth);
    const result = await signInWithPopup(auth, githubProvider);
    return result;
  } catch (err) {
    return null;
  }
}

// Logout
function logout() {
  return signOut(auth);
}

// Exports
export {
  app,
  auth,
  db,
  storage,
  storageRef,
  signInWithGoogle,
  signInWithGithub,
  logout
};