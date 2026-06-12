import React from "react";

// Brand-colored payment card badges
export const VisaIcon = ({ className = "" }) => (
  <span className={`inline-flex items-center justify-center bg-white border border-slate-200 rounded-md px-2 py-1 ${className}`} style={{ minWidth: 44 }}>
    <span style={{ color: "#1A1F71", fontWeight: 900, fontStyle: "italic", fontSize: 14, letterSpacing: "-0.5px", fontFamily: "Arial, sans-serif" }}>VISA</span>
  </span>
);

export const MasterCardIcon = ({ className = "" }) => (
  <span className={`inline-flex items-center justify-center bg-white border border-slate-200 rounded-md px-1.5 py-1 ${className}`} style={{ minWidth: 44 }}>
    <svg viewBox="0 0 40 24" width="32" height="20">
      <circle cx="16" cy="12" r="8" fill="#EB001B" />
      <circle cx="24" cy="12" r="8" fill="#F79E1B" />
      <path d="M20 6.5a8 8 0 0 1 0 11 8 8 0 0 1 0-11z" fill="#FF5F00" />
    </svg>
  </span>
);

export const AmexIcon = ({ className = "" }) => (
  <span className={`inline-flex items-center justify-center rounded-md px-2 py-1 ${className}`} style={{ background: "#2E77BC", minWidth: 44 }}>
    <span style={{ color: "white", fontWeight: 900, fontSize: 9, letterSpacing: "0.5px", fontFamily: "Arial, sans-serif" }}>AMEX</span>
  </span>
);

export const DiscoverIcon = ({ className = "" }) => (
  <span className={`inline-flex items-center justify-center bg-white border border-slate-200 rounded-md px-2 py-1 ${className}`} style={{ minWidth: 44 }}>
    <span style={{ color: "#333", fontWeight: 800, fontSize: 9, fontFamily: "Arial, sans-serif" }}>
      DISC<span style={{ color: "#FF6000" }}>●</span>VER
    </span>
  </span>
);

export const PayPalIcon = ({ className = "" }) => (
  <span className={`inline-flex items-center justify-center bg-white border border-slate-200 rounded-md px-2 py-1 ${className}`} style={{ minWidth: 50 }}>
    <span style={{ fontWeight: 900, fontSize: 11, fontStyle: "italic", fontFamily: "Arial, sans-serif" }}>
      <span style={{ color: "#003087" }}>Pay</span>
      <span style={{ color: "#009CDE" }}>Pal</span>
    </span>
  </span>
);

export const PaymentRow = () => (
  <div className="flex items-center gap-2 flex-wrap">
    <VisaIcon />
    <MasterCardIcon />
    <AmexIcon />
    <DiscoverIcon />
    <PayPalIcon />
  </div>
);

export default PaymentRow;
