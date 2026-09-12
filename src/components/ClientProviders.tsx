"use client";

import React, { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <AuthModal />
    </AuthProvider>
  );
}
