import React from "react";

export default function BackgroundGlow({ accentColor = "#6366f1" }: { accentColor?: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* 1. Hero top-center glow — accent color */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] rounded-full blur-[160px] opacity-25 animate-float-orb"
        style={{ backgroundColor: accentColor }}
      />

      {/* 2. Upper-right neon purple orb */}
      <div
        className="absolute top-[15%] -right-32 w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.14] animate-float-orb"
        style={{
          backgroundColor: "#7c3aed",
          animationDelay: "-3.5s",
          animationDuration: "12s",
        }}
      />

      {/* 3. Lower-left cyan accent orb */}
      <div
        className="absolute -bottom-24 -left-36 w-[450px] h-[450px] rounded-full blur-[160px] opacity-[0.13] animate-float-orb"
        style={{
          backgroundColor: "#06b6d4",
          animationDelay: "-6s",
          animationDuration: "11s",
        }}
      />

      {/* 4. Center-bottom deep indigo */}
      <div
        className="absolute top-[55%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.10] animate-float-orb"
        style={{
          backgroundColor: "#4338ca",
          animationDelay: "-8s",
          animationDuration: "14s",
        }}
      />

      {/* 5. Subtle warm micro-glow accent */}
      <div
        className="absolute top-[30%] left-[15%] w-[200px] h-[200px] rounded-full blur-[100px] opacity-[0.08] animate-float-orb"
        style={{
          backgroundColor: "#ec4899",
          animationDelay: "-2s",
          animationDuration: "9s",
        }}
      />

      {/* Dot-grid texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
    </div>
  );
}