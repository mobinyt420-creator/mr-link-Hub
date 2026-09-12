import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// Official Firebase Configuration for mister-linkhub-app
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDVS6ViOQa1q79tMCMv8HGOsap0_5_o_BU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "mister-linkhub-app.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "mister-linkhub-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "mister-linkhub-app.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1096842122292",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1096842122292:web:08b2bdd531ede1f866e661",
};

// Initialize Firebase App (Singleton for Next.js App Router)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export type { FirebaseUser };
export { signInWithPopup, signOut, onAuthStateChanged };

// Initialize Firebase Analytics safely for client side
let analyticsInstance: Analytics | null = null;

export const initAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === "undefined") return null;
  if (analyticsInstance) return analyticsInstance;
  try {
    const supported = await isSupported();
    if (supported) {
      analyticsInstance = getAnalytics(app);
      return analyticsInstance;
    }
  } catch (err) {
    console.warn("Firebase Analytics not initialized:", err);
  }
  return null;
};
