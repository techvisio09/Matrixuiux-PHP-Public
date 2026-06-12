import React from "react";

// UCODE SOFTTECH brand mark: gradient rounded square with a "U" wrapping a keyhole
// (license keys / unlocking genuine software). Scalable SVG — used in Header, Footer, Checkout.
export const Logo = ({ className = "w-11 h-11", status = true, shadow = true }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 48 48" className={`w-full h-full ${shadow ? "drop-shadow-md" : ""}`} aria-label="UCODE SOFTTECH logo">
      <defs>
        <linearGradient id="ucode-logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="55%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#ucode-logo-g)" />
      {/* U */}
      <path d="M15 11 v14 a9 9 0 0 0 18 0 v-14" stroke="white" strokeWidth="4.6" fill="none" strokeLinecap="round" />
      {/* Keyhole */}
      <circle cx="24" cy="21.5" r="3" fill="white" />
      <path d="M24 23 l-2.4 6.5 h4.8 Z" fill="white" />
    </svg>
    {status && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />}
  </div>
);

export default Logo;
