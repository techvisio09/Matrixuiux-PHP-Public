// Currency context with conversion rates (mock)
import React, { createContext, useContext, useState } from "react";

export const CURRENCIES = {
  USD: { symbol: "$", code: "USD", rate: 1, flag: "🇺🇸" },
  EUR: { symbol: "€", code: "EUR", rate: 0.92, flag: "🇪🇺" },
  GBP: { symbol: "£", code: "GBP", rate: 0.79, flag: "🇬🇧" },
  CAD: { symbol: "CA$", code: "CAD", rate: 1.37, flag: "🇨🇦" },
  AUD: { symbol: "AU$", code: "AUD", rate: 1.52, flag: "🇦🇺" },
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [code, setCode] = useState(() => localStorage.getItem("gsb_currency") || "USD");
  const setCurrency = (c) => { setCode(c); localStorage.setItem("gsb_currency", c); };
  const cur = CURRENCIES[code];
  const format = (usd) => `${cur.symbol}${(usd * cur.rate).toFixed(2)}`;
  return (
    <CurrencyContext.Provider value={{ code, cur, setCurrency, format }}>{children}</CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
