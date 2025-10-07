import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXbLTk6Hmz7s1kK1cr64q6IKEJa83BylI",
  authDomain: "tindaodofut-6f567.firebaseapp.com",
  projectId: "tindaodofut-6f567",
  storageBucket: "tindaodofut-6f567.firebasestorage.app",
  messagingSenderId: "599352243885",
  appId: "1:599352243885:web:34a74576f62eaa2505b824"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
