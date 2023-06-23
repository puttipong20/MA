import { initializeApp } from 'firebase/app'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_REACT_APP_APPID,
}

initializeApp(config)

const functions = getFunctions()
const auth = getAuth()
const db = getFirestore()
const storage = getStorage()

// if (window.location.hostname === 'localhost') {
//   connectAuthEmulator(auth, 'http://localhost:9099')
//   connectFunctionsEmulator(functions, 'localhost', 5001)
//   connectFirestoreEmulator(db, 'localhost', 8080)
//   connectStorageEmulator(storage, 'localhost', 9199)
// }

export { functions, auth, db, storage }
