// firebase.js

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref } from 'firebase/storage';

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCwvNfBABvIz9c8KAo8EAc9jhOU1XdLtPY",
  authDomain: "x01-ai-helper.firebaseapp.com",
  projectId: "x01-ai-helper",
  storageBucket: "x01-ai-helper.firebasestorage.app",
  messagingSenderId: "264657329993",
  appId: "1:264657329993:web:8eeb5451873acebb4c0498",
  measurementId: "G-ENNGX1NY9G"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Get Firebase services
const auth = getAuth(app); // React Native persistence handled automatically in v10+
const db = getFirestore(app);
const storage = getStorage(app);
const storageRef = ref(storage);

// ✅ Auth helper functions
function signUp(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}

function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// ✅ Export everything
export {
  app,
  auth,
  db,
  storage,
  storageRef,
  signUp,
  signIn
};