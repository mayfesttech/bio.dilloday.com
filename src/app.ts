import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyALC7_uNBF4IFQmr-CXOYa6s3slDka1KYc',
  authDomain: 'dillo-day.firebaseapp.com',
  projectId: 'dillo-day',
  storageBucket: 'dillo-day.appspot.com',
  messagingSenderId: '1025535388888',
  appId: '1:1025535388888:web:32c934380d9ce0332cfbad',
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const auth = getAuth(app);
