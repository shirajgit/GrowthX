"use client";

import "./globals.css";
import { ClerkProvider, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/user/sync", { method: "POST" }).catch(console.error);
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "#080808" }}>
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "#080808",
      }}
    >
      {/* Global ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full blur-[140px] opacity-20"
          style={{ background: "rgba(139,92,246,0.15)", top: "-200px", right: "-200px" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-15"
          style={{ background: "rgba(59,130,246,0.12)", bottom: "-150px", left: "-150px" }} />
      </div>

      {!isSignedIn ? (
        /* ---- AUTH SCREEN ---- */
        <div className="relative flex flex-col min-h-screen">
          {/* Top bar */}
          <div className="flex items-center justify-between px-8 py-5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-lg font-bold tracking-tight"
              style={{
                background: "linear-gradient(90deg, #fff 0%, #666 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
              GrowthX
            </span>
            <SignInButton mode="modal">
              <button className="text-sm px-4 py-2 rounded-xl font-medium transition-all hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "white",
                }}>
                Sign In
              </button>
            </SignInButton>
          </div>

          {/* Hero */}
          <div className="flex-1 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md text-center"
            >
              {/* Logo mark */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-xl font-black mb-8"
                style={{
                  background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))",
                  border: "1px solid rgba(139,92,246,0.3)",
                  boxShadow: "0 0 40px rgba(139,92,246,0.2)",
                }}
              >
                GX
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-black tracking-tight mb-3"
              >
                Welcome back
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 text-sm mb-10 leading-relaxed"
              >
                Your all-in-one productivity workspace.<br />
                Tasks, projects, clients, and AI — all in one place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <SignInButton mode="modal">
                  <motion.button
                    onClick={() => setLoading(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-2xl font-semibold text-sm transition-all"
                    style={{
                      background: "white",
                      color: "black",
                      boxShadow: "0 8px 32px rgba(255,255,255,0.15)",
                    }}
                  >
                    {loading ? "Opening…" : "Continue with Clerk →"}
                  </motion.button>
                </SignInButton>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-gray-700 mt-6"
              >
                Enterprise-grade security · No credit card required
              </motion.p>
            </motion.div>
          </div>
        </div>
      ) : (
        /* ---- APP LAYOUT ---- */
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 overflow-y-auto pt-[60px] md:pt-0 relative"
          >
            {children}
          </motion.main>
        </div>
      )}
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>GrowthX</title>
        <meta name="description" content="Your all-in-one productivity workspace" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;0,9..40,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ClerkProvider>
          <LayoutContent>{children}</LayoutContent>
        </ClerkProvider>
      </body>
    </html>
  );
}
