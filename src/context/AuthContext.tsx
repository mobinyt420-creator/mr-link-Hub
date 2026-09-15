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
  loginWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (
    name: string,
    email: string,
    username: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
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

  // Sync or fetch creator profile from Firestore and Next.js backend API
  const syncCreatorProfile = async (firebaseUser: FirebaseUser): Promise<CreatorProfile> => {
    try {
      let profileData: CreatorProfile | null = null;
      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          profileData = userSnap.data() as CreatorProfile;
        }
      } catch (e) {
        console.warn("Firestore fetch notice:", e);
      }

      if (!profileData) {
        // Generate clean username from email or display name
        const baseName = (firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "creator")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");
        const username = `${baseName || "user"}${Math.floor(1000 + Math.random() * 9000)}`;

        profileData = {
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

        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          await setDoc(userRef, profileData, { merge: true });
        } catch (docErr) {
          console.warn("Firestore save notice:", docErr);
        }
      }

      setCreatorProfile(profileData);

      // Crucial: Await backend sync so session cookie linkhub_session is firmly attached before redirecting
      try {
        await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        });
      } catch (syncErr) {
        console.warn("Backend auth sync notice:", syncErr);
      }

      return profileData;
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
        // Also check if existing backend cookie session exists
        try {
          const meRes = await fetch("/api/admin/auth/me");
          const meData = await meRes.json();
          if (meData?.authenticated && meData?.user) {
            setCreatorProfile({
              uid: meData.user.id,
              email: meData.user.email,
              displayName: meData.user.name,
              photoURL: "",
              username: meData.user.email.split("@")[0] || "creator",
              plan: "FREE",
            });
          }
        } catch {
          // ignore
        }
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

  const loginWithEmail = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Login failed" };
      }
      setCreatorProfile({
        uid: data.user.id,
        email: data.user.email,
        displayName: data.user.name,
        photoURL: "",
        username: data.user.email.split("@")[0] || "creator",
        plan: "FREE",
      });
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (
    name: string,
    email: string,
    username: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || "Registration failed" };
      }
      setCreatorProfile({
        uid: data.user.id,
        email: data.user.email,
        displayName: data.user.name,
        photoURL: "",
        username: data.user.username || "creator",
        plan: "FREE",
      });
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Network error" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      try {
        await signOut(auth);
      } catch {
        // ignore
      }
      await fetch("/api/admin/auth/logout", { method: "POST" });
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
        loginWithEmail,
        registerWithEmail,
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
