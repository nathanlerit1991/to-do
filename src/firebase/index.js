import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDQkDjYMw8v7bKzODre5eW34lq_qjllESY',
  authDomain: 'nathan-todo.firebaseapp.com',
  projectId: 'nathan-todo',
  storageBucket: 'nathan-todo.appspot.com',
  messagingSenderId: '87776193516',
  appId: '1:87776193516:web:2d53dcc1f23d6065cfaec9'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {
  db
}