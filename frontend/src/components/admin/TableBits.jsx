import React from "react";
import { Loader2 } from "lucide-react";

export const Th = ({ children }) => <th className="text-left text-[11px] uppercase tracking-wide text-slate-400 font-semibold px-3 py-2 whitespace-nowrap">{children}</th>;

export const Td = ({ children, className = "" }) => <td className={`px-3 py-2.5 text-sm text-slate-700 align-middle ${className}`}>{children}</td>;

export const TabSpinner = () => (
  <div className="py-10 text-center"><Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-600" /></div>
);
