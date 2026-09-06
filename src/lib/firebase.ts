import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

// User's Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCTyfCaMy7iFJuxWVDH4whS-LOmpE6lGdM",
  authDomain: "mr-linkhub.firebaseapp.com",
  projectId: "mr-linkhub",
  storageBucket: "mr-linkhub.firebasestorage.app",
  messagingSenderId: "591212086930",
  appId: "1:591212086930:web:13c3884cc19647e106c84b",
  measurementId: "G-GQZ6H7CG6S",
};

// Initialize Firebase App (Singleton for Next.js App Router)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore Database
export const db = getFirestore(app);

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
