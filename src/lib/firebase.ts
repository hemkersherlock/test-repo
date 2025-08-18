
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// We need a function to get the Firebase instances so they are only created on the client-side.
const getFirebaseInstances = () => {
  let app: FirebaseApp;
  let db: Firestore;
  let auth: Auth;

  if (typeof window !== 'undefined') {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    
    db = getFirestore(app);
    auth = getAuth(app);

    // Enable offline persistence only on the client
    try {
      enableIndexedDbPersistence(db);
    } catch (err: any) {
      if (err.code == 'failed-precondition') {
        console.warn("Firestore offline persistence failed: Multiple tabs open.");
      } else if (err.code == 'unimplemented') {
        console.warn("Firestore offline persistence failed: Browser does not support it.");
      }
    }
    return { app, db, auth };
  }
  
  // On the server, we return null or undefined objects.
  // This can be handled in the consuming code. For this app, it's safe because
  // auth state is only checked on the client.
  return { app: null, db: null, auth: null };
}

// Export a getter for the auth object to be used in contexts
export const getFirebaseAuth = () => {
    const { auth } = getFirebaseInstances();
    if (!auth) {
        // This will be called on the server, we can create a dummy or throw,
        // but for now, returning null is safe given the app structure.
        return null;
    }
    return auth;
}

// Export a getter for the db object
export const getFirebaseDb = () => {
    const { db } = getFirebaseInstances();
    if (!db) {
        return null;
    }
    return db;
}
