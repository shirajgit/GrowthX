"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Theme switch. `variant="pill"` renders a labelled row (used in the
 * sidebar footer); `variant="icon"` renders a compact square button
 * (used in the landing nav).
 */
export default function ThemeToggle({
  variant = "icon",
  collapsed = false,
}: {
  variant?: "icon" | "pill";
  collapsed?: boolean;
}) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;

  const Icon = (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {isDark ? <Moon size={16} style={{ color: "#a78bfa" }} /> : <Sun size={16} style={{ color: "#f59e0b" }} />}
      </motion.span>
    </AnimatePresence>
  );

  if (variant === "pill") {
    return (
      <button
        onClick={toggle}
        aria-label={label}
        title={label}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
        style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
      >
        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--surface-3)" }}>
          {Icon}
        </span>
        {!collapsed && (
          <span className="flex items-center justify-between flex-1 min-w-0">
            <span className="text-[13px] font-medium" style={{ color: "var(--text)" }}>
              {isDark ? "Dark" : "Light"} mode
            </span>
            {/* mini track indicator */}
            <span className="relative w-9 h-5 rounded-full flex-shrink-0" style={{ background: isDark ? "rgba(139,92,246,0.35)" : "rgba(245,158,11,0.35)", border: "1px solid var(--border-strong)" }}>
              <motion.span
                animate={{ x: isDark ? 2 : 18 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="absolute top-0.5 w-3.5 h-3.5 rounded-full"
                style={{ background: isDark ? "#a78bfa" : "#f59e0b" }}
              />
            </span>
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={label}
      title={label}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60"
      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
    >
      {Icon}
    </button>
  );
}
