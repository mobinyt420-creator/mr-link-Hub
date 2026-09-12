import React from "react";
import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "LinkHub — Next-Gen Link-in-Bio & SafeLink Monetization Platform",
  description:
    "The all-in-one link management & SafeLink monetization platform for South Asian creators. Share your links, monetize traffic, and receive fast payouts via bKash & Nagad.",
};

export default function HomePage() {
  return <LandingPage />;
}