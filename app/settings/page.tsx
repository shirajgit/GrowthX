"use client";

import { motion } from "framer-motion";
import { UserButton, useUser, useClerk } from "@clerk/nextjs";

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-black via-gray-900 to-black">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">👤 Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl mx-auto bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl text-center space-y-6"
      >

        {/* AVATAR */}
        <div className="flex justify-center">
          <div className="scale-150">
            <UserButton />
          </div>
        </div>

        {/* USER INFO */}
        <div>
          <h2 className="text-xl font-semibold">
            {user.fullName}
          </h2>
          <p className="text-gray-400 text-sm">
            {user.primaryEmailAddress?.emailAddress}
          </p>
        </div>

        {/* INFO TEXT */}
        <p className="text-gray-400 text-sm">
          Your account is securely managed via Clerk.  
          You can update your personal details anytime.
        </p>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3">

          {/* MANAGE ACCOUNT */}
          <button
            onClick={() => openUserProfile()}
            className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            ⚙️ Manage Account
          </button>

          {/* LOGOUT */}
          <button
            onClick={() => signOut()}
            className="w-full py-3 rounded-xl bg-red-500/80 hover:bg-red-500 transition"
          >
            🚪 Logout
          </button>

        </div>

      </motion.div>
    </div>
  );
}