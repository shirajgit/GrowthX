"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

const ThemeContext = createContext<{
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}>({ theme: "dark", toggle: () => {}, setTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Initialised to "dark" for SSR; reconciled on mount with whatever the
  // anti-FOUC head script already applied, then the server preference.
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme") as Theme) || "dark";
    setThemeState(current);

    // Reconcile with the per-user saved preference (cross-device sync).
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((p) => {
        if (p?.theme === "light" || p?.theme === "dark") {
          setThemeState(p.theme);
          applyTheme(p.theme);
          try { localStorage.setItem("gx-theme", p.theme); } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try { localStorage.setItem("gx-theme", t); } catch {}
    // Persist server-side when signed in (ignored / 401 when signed out).
    fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: t }),
    }).catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
