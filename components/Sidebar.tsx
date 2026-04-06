 "use client";

import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  CheckSquare,
  Folder,
  Briefcase,
  Users,
  Flame,
  Notebook,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, useUser } from "@clerk/nextjs";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);
  const pathname = usePathname();

  const { user, isLoaded } = useUser();

  // 🚫 Hide sidebar if not logged in
  if (!isLoaded || !user) return null;

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Projects", path: "/projects", icon: Folder },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Leads", path: "/leads", icon: Flame },
    { name: "Notes", path: "/notes", icon: Notebook },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 
        bg-gradient-to-r from-[#0f172a] to-[#111827] 
        border-b border-[#2a2a2a] p-4 flex justify-between items-center backdrop-blur-lg">
        
        <h1 className="text-2xl font-bold text-white tracking-wide 
        drop-shadow-[0_0_10px_rgba(59,130,246,0.7)]">
          GrowthX
        </h1>

        <button onClick={() => setMobileOpen(true)} className="text-gray-300">
          <Menu />
        </button>
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="fixed top-0 left-0 w-72 h-full 
              bg-gradient-to-b from-[#0f172a] to-[#111827]
              border-r border-[#2a2a2a] z-50 p-5 shadow-2xl flex flex-col justify-between"
            >
              {/* MENU */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-semibold text-white">Menu</h2>
                  <button onClick={() => setMobileOpen(false)}>
                    <X className="text-gray-400" />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  {menuItems.map((item, i) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;

                    return (
                      <Link key={i} href={item.path} onClick={() => setMobileOpen(false)}>
                        <div
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition
                          ${
                            isActive
                              ? "bg-white text-black"
                              : "text-gray-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <Icon size={18} />
                          {item.name}
                        </div>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* USER */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
                <div className="text-sm">
                  <p className="text-white font-medium">
                    {user.firstName || "User"}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>

                {/* ✅ FIXED (NO afterSignOutUrl) */}
                <UserButton />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        animate={{ width: desktopOpen ? 260 : 80 }}
        className="hidden md:flex flex-col justify-between 
        bg-gradient-to-b from-[#0f172a] to-[#111827]
        border-r border-[#2a2a2a] p-4"
      >
        {/* TOP */}
        <div>
          <button
            onClick={() => setDesktopOpen(!desktopOpen)}
            className="mb-6 flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <Menu size={18} />
            {desktopOpen && <span className="text-sm">Menu</span>}
          </button>

          <nav className="flex flex-col gap-2">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link key={i} href={item.path}>
                  <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition
                    ${
                      isActive
                        ? "bg-white text-black"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {desktopOpen && item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* USER */}
        <div className="flex items-center justify-between border-t border-gray-700 pt-4">
          {desktopOpen && (
            <div className="text-sm">
              <p className="text-white font-medium">
                {user.firstName || "User"}
              </p>
              <p className="text-gray-400 text-xs">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          )}

          {/* ✅ FIXED */}
          <UserButton />
        </div>
      </motion.aside>
    </>
  );
}