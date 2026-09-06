"use client";

import React from "react";
import { AdminLanguageProvider } from "@/lib/adminLanguage";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminLanguageProvider>
      <AdminNav />
      <main className="flex-1 lg:pl-64 flex flex-col pb-24 lg:pb-12">
        {children}
      </main>
    </AdminLanguageProvider>
  );
}
