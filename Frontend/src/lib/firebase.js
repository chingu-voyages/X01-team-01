// firebase.js

import { initializeApp } from 'firebase/app';
import {getAuth, GoogleAuthProvider, GithubAuthProvider,signInWithPopup, signOut} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBkMzsnaK5AWSzGw4gCl4L6MX_W0IdHjGQ",
  authDomain: "x01-ai-helper.firebaseapp.com",
  projectId: "x01-ai-helper",
  storageBucket: "x01-ai-helper.firebasestorage.app",
  messagingSenderId: "264657329993",
  appId: "1:264657329993:web:8eeb5451873acebb4c0498",
  measurementId: "G-ENNGX1NY9G"
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

// Google sign in
function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

// GitHub sign in
function signInWithGithub() {
  return signInWithPopup(auth, githubProvider);
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