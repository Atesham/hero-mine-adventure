
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXwya7i0m5BFoIwJpHu54o0NbblpGDL9k",
  authDomain: "herocoin-mining.firebaseapp.com",
  projectId: "herocoin-mining",
  storageBucket: "herocoin-mining.appspot.com",
  messagingSenderId: "291875698023",
  appId: "1:291875698023:web:88a563175afaa068a4c123",
  measurementId: "G-D1VY2JNEZQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
