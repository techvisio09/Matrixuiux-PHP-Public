import React, { createContext, useContext, useEffect, useState } from "react";
const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => localStorage.getItem("gsb_theme") === "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("gsb_theme", dark ? "dark" : "light");
  }, [dark]);
  return <ThemeContext.Provider value={{ dark, toggle: () => setDark((d) => !d) }}>{children}</ThemeContext.Provider>;
};
export const useTheme = () => useContext(ThemeContext);
