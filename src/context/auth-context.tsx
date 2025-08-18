
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFirebaseAuth } from '@/lib/firebase';
import { 
  onAuthStateChanged, 
  User,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  Auth
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<any>;
  signInWithEmail: (email: string, pass: string) => Promise<any>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    const authInstance = getFirebaseAuth();
    setAuth(authInstance);

    if (authInstance) {
      const unsubscribe = onAuthStateChanged(authInstance, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Not in a browser environment
      setLoading(false);
    }
  }, []);
  
  const signInWithGoogle = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (error) {
      console.error("Google sign-in failed:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    if (!auth) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      router.push('/');
      return userCredential;
    } catch (error) {
      console.error("Email sign-up failed:", error);
      throw error;
    }
  };
  
  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) return;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      router.push('/');
      return userCredential;
    } catch (error) {
      console.error("Email sign-in failed:", error);
      // Re-throw the error so the UI can catch it and display a message
      throw error;
    }
  };

  const signInAsGuest = async () => {
    if (!auth) return;
    try {
      // This logic ensures we only sign in anonymously if there's no current user.
      if (!auth.currentUser) {
        await signInAnonymously(auth);
      }
      router.push('/');
    } catch (error) {
      console.error("Anonymous sign-in failed:", error);
      throw error;
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };


  const value = { 
    user, 
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signInAsGuest,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
