"use client";

import React, { useState, useEffect, useContext, createContext } from "react";

interface Context {
  mode: string;
  setMode: (mode: string) => void;
}

const ThemeContext = createContext<Context>({} as Context);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState("");
  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);
  useEffect(() => {
    if (localStorage.theme === "system") {
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? setMode("dark")
        : setMode("light");
    } else {
      setMode(localStorage.theme);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
