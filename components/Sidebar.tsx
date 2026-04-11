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
  Sparkles,
 
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

  if (!isLoaded || !user) return null;

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "AI Assistant", path: "/ai", icon: Sparkles },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },
    { name: "Projects", path: "/projects", icon: Folder },
    { name: "Jobs", path: "/jobs", icon: Briefcase },
    { name: "Clients", path: "/clients", icon: Users },
    { name: "Leads", path: "/leads", icon: Flame },
    { name: "Notes", path: "/notes", icon: Notebook },   
    { name: "Profile", path: "/settings", icon: user.imageUrl ? () => (
      <img
        src={user.imageUrl}
        alt="Profile"
        className="w-6 h-6 rounded-full"
      />
    ) : Settings },
  ];    

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 
        bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex justify-between items-center">

        <h1 className="text-xl font-semibold text-white">GrowthX</h1>

        <button onClick={() => setMobileOpen(true)}>
          <Menu className="text-gray-300" />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 25 }}
              className="fixed top-0 left-0 w-72 h-full z-50 
              bg-[#0f0f0f] border-r border-white/10 
              p-5 flex flex-col justify-between shadow-2xl"
            >
              <SidebarContent
                menuItems={menuItems}
                pathname={pathname}
                user={user}
                close={() => setMobileOpen(false)}
                collapsed={false}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ================= DESKTOP ================= */}
      <motion.aside
        animate={{ width: desktopOpen ? 260 : 80 }}
        transition={{ duration: 0.25 }}
        className="hidden md:flex flex-col justify-between
        bg-[#0f0f0f] border-r border-white/10
        h-screen p-3 backdrop-blur-xl relative"
      >
        <SidebarContent
          menuItems={menuItems}
          pathname={pathname}
          user={user}
          collapsed={!desktopOpen}
          toggle={() => setDesktopOpen(!desktopOpen)}
        />

        {/* 🚀 FLOATING AI BUTTON */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="absolute bottom-6 right-4 bg-white text-black p-3 rounded-full shadow-xl"
        >
          <Sparkles size={18} />
        </motion.button>
      </motion.aside>
    </>
  );
}

/* ================= CONTENT ================= */

function SidebarContent({
  menuItems,
  pathname,
  user,
  collapsed,
  toggle,
  close,
}: any) {
  return (
    <>
      {/* TOP */}
      <div>
        <div className="flex items-center justify-between mb-6 px-2">
          {!collapsed && (
            <h1 className="text-lg font-semibold text-white">Navigation</h1>
          )}

          {toggle && (
            <button
              onClick={toggle}
              className="text-gray-400 hover:text-white"
            >
              <Menu size={18} />
            </button>
          )}
        </div>

        {/* NAV */}
        <nav className="flex flex-col gap-2">
          {menuItems.map((item: any, i: number) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <Link key={i} href={item.path} onClick={close}>
                <div className="relative group">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200
                    ${
                      isActive
                        ? "bg-white text-black shadow"
                        : "text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {/* 🔥 Active Glow */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-white/10 blur-md" />
                    )}

                    <Icon size={18} />

                    {!collapsed && item.name}
                  </motion.div>

                  {/* 💡 TOOLTIP */}
                  {collapsed && (
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 
                      bg-black text-white text-xs px-2 py-1 rounded opacity-0 
                      group-hover:opacity-100 transition whitespace-nowrap">
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* USER */}
      <div className="border-t border-white/10 pt-4 flex items-center justify-between px-2">
        {!collapsed && (
          <div>
            <p className="text-sm text-white font-medium">
              {user.firstName || "User"}
            </p>
            <p className="text-xs text-gray-400">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        )}

        <UserButton />
      </div>
    </>
  );
}