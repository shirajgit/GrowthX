"use client";

import "./globals.css";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";
import LandingPage from "@/components/LandingPage";
import ThemeProvider from "@/components/ThemeProvider";
import { motion, MotionConfig } from "framer-motion";
import { useEffect } from "react";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/user/sync", { method: "POST" }).catch(console.error);
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/40 animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "var(--bg)",
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
        /* ---- LANDING PAGE ---- */
        <LandingPage />
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>GrowthX</title>
        <meta name="description" content="Your all-in-one productivity workspace" />
        {/* Set theme before paint to avoid a flash of the wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('gx-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
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
          <ThemeProvider>
            <MotionConfig reducedMotion="user">
              <LayoutContent>{children}</LayoutContent>
            </MotionConfig>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
