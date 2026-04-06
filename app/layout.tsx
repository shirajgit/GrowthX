"use client";

import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Sidebar from "@/components/Sidebar";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* ================= TOP BAR ================= */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur-md">
        <h1 className="text-xl font-semibold tracking-wide">
          GrowthX
        </h1>

        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="px-5 py-2 rounded-xl bg-white text-black font-medium hover:scale-105 transition">
              Sign In
            </button>
          </SignInButton>
        ) : (
          <UserButton />
        )}
      </div>

      {/* ================= AUTH SCREEN ================= */}
      {!isSignedIn ? (
        <div className="flex items-center justify-center h-[calc(100vh-80px)] px-4">

          <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-center">

            <h2 className="text-3xl font-bold mb-3">
              Welcome Back 👋
            </h2>

            <p className="text-gray-400 mb-6">
              Sign in to access your dashboard
            </p>

            <SignInButton mode="modal">
              <button className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition">
                Continue with Clerk
              </button>
            </SignInButton>

            <p className="text-xs text-gray-500 mt-6">
              Secure authentication powered by Clerk
            </p>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-64px)]">

          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
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
      <body>
        <ClerkProvider>
          <LayoutContent>{children}</LayoutContent>
        </ClerkProvider>
      </body>
    </html>
  );
}