"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  FirebaseUser,
  db,
} from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export interface CreatorProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  username: string;
  bio?: string;
  theme?: string;
  plan?: "FREE" | "PRO" | "BUSINESS";
  createdAt?: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  creatorProfile: CreatorProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<CreatorProfile | null>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [creatorProfile, setCreatorProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Sync or fetch creator profile from Firestore
  const syncCreatorProfile = async (firebaseUser: FirebaseUser): Promise<CreatorProfile> => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data() as CreatorProfile;
        setCreatorProfile(data);
        return data;
      }

      // Generate default username from email or display name
      const baseName = (firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "creator")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
      const username = `${baseName || "user"}${Math.floor(1000 + Math.random() * 9000)}`;

      const newProfile: CreatorProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "Digital Creator",
        photoURL:
          firebaseUser.photoURL ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        username,
        bio: "Digital Creator • Tech Enthusiast • Gamer",
        theme: "glass-dark",
        plan: "FREE",
        createdAt: serverTimestamp(),
      };

      await setDoc(userRef, newProfile, { merge: true });
      setCreatorProfile(newProfile);

      // Also notify backend sync API
      fetch("/api/auth/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfile),
      }).catch((err) => console.warn("Backend sync notice:", err));

      return newProfile;
    } catch (err) {
      console.error("Error syncing creator profile:", err);
      const fallback: CreatorProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
        displayName: firebaseUser.displayName || "Digital Creator",
        photoURL: firebaseUser.photoURL || "",
        username: "creator",
        plan: "FREE",
      };
      setCreatorProfile(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await syncCreatorProfile(currentUser);
      } else {
        setCreatorProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<CreatorProfile | null> => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = await syncCreatorProfile(result.user);
      setIsAuthModalOpen(false);
      return profile;
    } catch (err: any) {
      console.error("Google Sign-In Error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setCreatorProfile(null);
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await syncCreatorProfile(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        creatorProfile,
        loading,
        signInWithGoogle,
        logout,
        refreshProfile,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
