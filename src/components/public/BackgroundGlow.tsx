import React from "react";

export default function BackgroundGlow({ accentColor = "#6366f1" }: { accentColor?: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* 1. Hero top-center glow — accent color, large and soft */}
      <div
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[550px] rounded-full blur-[180px] opacity-20 animate-float-orb"
        style={{ backgroundColor: accentColor }}
      />

      {/* 2. Upper-right neon purple orb */}
      <div
        className="absolute top-[12%] -right-36 w-[550px] h-[550px] rounded-full blur-[200px] opacity-[0.12] animate-float-orb"
        style={{
          backgroundColor: "#7c3aed",
          animationDelay: "-3.5s",
          animationDuration: "13s",
        }}
      />

      {/* 3. Lower-left cyan accent orb */}
      <div
        className="absolute -bottom-28 -left-40 w-[500px] h-[500px] rounded-full blur-[180px] opacity-[0.10] animate-float-orb"
        style={{
          backgroundColor: "#06b6d4",
          animationDelay: "-6s",
          animationDuration: "11s",
        }}
      />

      {/* 4. Center-bottom deep indigo — adds depth */}
      <div
        className="absolute top-[55%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[160px] opacity-[0.08] animate-float-orb"
        style={{
          backgroundColor: "#4338ca",
          animationDelay: "-8s",
          animationDuration: "14s",
        }}
      />

      {/* 5. Subtle warm micro-glow — adds variety */}
      <div
        className="absolute top-[30%] left-[15%] w-[220px] h-[220px] rounded-full blur-[120px] opacity-[0.06] animate-float-orb"
        style={{
          backgroundColor: "#ec4899",
          animationDelay: "-2s",
          animationDuration: "9s",
        }}
      />

      {/* 6. Extra accent glow at bottom right */}
      <div
        className="absolute bottom-[20%] right-[10%] w-[180px] h-[180px] rounded-full blur-[100px] opacity-[0.07] animate-float-orb"
        style={{
          backgroundColor: accentColor,
          animationDelay: "-4s",
          animationDuration: "12s",
        }}
      />

      {/* Dot-grid texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top gradient vignette for premium feel */}
      <div
        className="absolute top-0 left-0 right-0 h-[250px]"
        style={{
          background: "linear-gradient(180deg, rgba(6, 8, 13, 0.6) 0%, transparent 100%)",
        }}
      />

      {/* Bottom gradient vignette */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[200px]"
        style={{
          background: "linear-gradient(0deg, rgba(6, 8, 13, 0.8) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}