"use client";

import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const metadata = {
  title: "GrowthX",
  description:
    "A dashboard for GrowthX users to manage their growth and analytics.",
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const [loading, setLoading] = useState(false);

  // 🔥 AUTO SYNC USER WITH DB
  useEffect(() => {
    if (!isSignedIn) return;

    const synced = sessionStorage.getItem("synced");

    if (!synced) {
      fetch("/api/user/sync").catch(() =>
        console.error("User sync failed")
      );
      sessionStorage.setItem("synced", "true");
    }
  }, [isSignedIn]);

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white relative overflow-hidden">
      
      {/* 🔥 BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] bg-white/5 blur-[120px] top-[-100px] left-[-100px]" />
        <div className="absolute w-[400px] h-[400px] bg-white/5 blur-[120px] bottom-[-100px] right-[-100px]" />
      </div>

      {/* ================= TOP BAR ================= */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 
        border-b border-white/10 backdrop-blur-xl bg-white/5"
      >
        {/* LOGO */}
        <h1 className="text-xl font-semibold tracking-wide 
          bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
          GrowthX
        </h1>

        {/* RIGHT */}
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="px-5 py-2 rounded-xl bg-white text-black font-medium 
              hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg 
              hover:shadow-white/20">
              Sign In
            </button>
          </SignInButton>
        ) : (
          <div className="flex items-center gap-4">
            {/* LIVE STATUS */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Live
            </div>

            {/* USER */}
            <div className="p-[2px] rounded-full bg-gradient-to-r from-white/20 to-white/5">
              <UserButton />
            </div>
          </div>
        )}
      </motion.div>

      {/* ================= AUTH SCREEN ================= */}
      {!isSignedIn ? (
        <div className="flex items-center justify-center h-[calc(100vh-80px)] px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-8 rounded-3xl 
            bg-white/5 backdrop-blur-2xl border border-white/10 
            shadow-[0_0_60px_rgba(255,255,255,0.08)] text-center relative"
          >
            {/* GLOW INSIDE */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-20 pointer-events-none" />

            {/* LOGO */}
            <div className="mb-6 relative z-10">
              <div className="w-16 h-16 mx-auto rounded-2xl 
                bg-gradient-to-br from-white/20 to-white/5 
                flex items-center justify-center text-xl font-bold shadow-xl">
                GX
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-3 tracking-tight relative z-10">
              Welcome Back 👋
            </h2>

            <p className="text-gray-400 mb-6 text-sm relative z-10">
              Continue building your productivity empire
            </p>

            <div className="relative z-10">
              <SignInButton mode="modal">
                <button
                  onClick={() => setLoading(true)}
                  className="w-full py-3 rounded-xl bg-white text-black font-semibold 
                  hover:bg-gray-200 transition-all duration-200 
                  hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  {loading ? "Opening..." : "Continue with Clerk"}
                </button>
              </SignInButton>
            </div>

            <p className="text-xs text-gray-500 mt-6 relative z-10">
              Secured with enterprise-grade authentication
            </p>
          </motion.div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-64px)]">
          {/* SIDEBAR */}
          <Sidebar />

          {/* MAIN */}
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 overflow-y-auto"
          >
            <div className="bg-white/[0.02] rounded-3xl border border-white/10 shadow-inner">
              {children}
            </div>
          </motion.main>
        </div>
      )}
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ClerkProvider>
          <LayoutContent>{children}</LayoutContent>
        </ClerkProvider>
      </body>
    </html>
  );
}