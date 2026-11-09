import { createContext, useCallback, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({ theme: "dark", toggleTheme: () => {} });

const BROWSER_THEME_COLORS = { dark: "#03040c", light: "#fafaf9" };

// The initial class is set by the inline script in index.html, before first paint, to avoid a flash.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => (document.documentElement.classList.contains("dark") ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BROWSER_THEME_COLORS[theme]);
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Storage can be blocked (private mode); the theme still works for this visit.
    }
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((current) => (current === "dark" ? "light" : "dark")), []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
