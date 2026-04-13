"use client";

import { useState } from "react";
import {
  Menu,
  LayoutDashboard,
  CheckSquare,
  Folder,
  Briefcase,
  Users,
  Flame,
  Notebook,
  Settings,
  Sparkles,
  X,
  ChevronLeft,
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
    { name: "Profile", path: "/settings", icon: Settings },
  ];

  const iconColors: Record<string, string> = {
    "/": "#a78bfa",
    "/ai": "#60a5fa",
    "/tasks": "#34d399",
    "/projects": "#3b82f6",
    "/jobs": "#f59e0b",
    "/clients": "#ec4899",
    "/leads": "#f87171",
    "/notes": "#facc15",
    "/settings": "#94a3b8",
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div
        className="md:hidden fixed top-0 left-0 right-0 z-50 h-[60px] flex justify-between items-center px-5"
        style={{
          background: "rgba(8,8,8,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="flex items-center gap-2 whitespace-nowrap"
>
  {/* GX Box */}
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
    className="flex items-center justify-center rounded-xl"
    style={{
      width: "34px",
      height: "34px",
      background: "linear-gradient(135deg,#8b5cf6,#60a5fa,#34d399)",
      boxShadow: "0 6px 20px rgba(139,92,246,0.35)",
    }}
  >
    <span
      style={{
        color: "white",
        fontWeight: 900,
        fontSize: "12px",
        fontFamily: "DM Sans, sans-serif",
        letterSpacing: "-0.5px",
      }}
    >
      GX
    </span>
  </motion.div>

  {/* Text */}
  <span
    className="text-sm font-black tracking-tight"
    style={{
      fontFamily: "DM Sans, sans-serif",
      letterSpacing: "-0.5px",
    }}
  >
    <span style={{ color: "white" }}>Growth</span>
    <span
      style={{
        background: "linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      X
    </span>
  </span>
</motion.div>
        <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white transition-colors">
          <Menu size={20} />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="fixed top-0 left-0 w-[270px] h-full z-50 flex flex-col"
              style={{
                background: "#0a0a0e",
                borderRight: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center justify-between px-5 py-5">
                
               <motion.span
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="text-sm font-black tracking-tight whitespace-nowrap"
  style={{
    fontFamily: "DM Sans, sans-serif",
    letterSpacing: "-0.5px",
  }}
>
  <span style={{ color: "white" }}>Growth</span>
  <span
    style={{
      background: "linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    }}
  >
    X
  </span>
</motion.span>
                <button onClick={() => setMobileOpen(false)} className="text-gray-600 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <SidebarContent
                menuItems={menuItems}
                pathname={pathname}
                user={user}
                iconColors={iconColors}
                collapsed={false}
                close={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <motion.aside
        animate={{ width: desktopOpen ? 240 : 68 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex flex-col h-screen relative flex-shrink-0"
        style={{
          background: "#090910",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        {/* Logo row */}
        <div className="flex items-center justify-between px-4 py-5 flex-shrink-0">
          <AnimatePresence>
            {desktopOpen && (
              <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="flex items-center gap-2 whitespace-nowrap"
>
  {/* GX Box */}
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    whileHover={{ scale: 1.05 }}
    transition={{ duration: 0.3 }}
    className="flex items-center justify-center rounded-xl"
    style={{
      width: "34px",
      height: "34px",
      background: "linear-gradient(135deg,#8b5cf6,#60a5fa,#34d399)",
      boxShadow: "0 6px 20px rgba(139,92,246,0.35)",
    }}
  >
    <span
      style={{
        color: "white",
        fontWeight: 900,
        fontSize: "12px",
        fontFamily: "DM Sans, sans-serif",
        letterSpacing: "-0.5px",
      }}
    >
      GX
    </span>
  </motion.div>

  {/* Text */}
  <span
    className="text-sm font-black tracking-tight"
    style={{
      fontFamily: "DM Sans, sans-serif",
      letterSpacing: "-0.5px",
    }}
  >
    <span style={{ color: "white" }}>Growth</span>
    <span
      style={{
        background: "linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      X
    </span>
  </span>
</motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setDesktopOpen(!desktopOpen)}
            className="text-gray-600 hover:text-white transition-colors ml-auto"
          >
            <motion.div animate={{ rotate: desktopOpen ? 0 : 180 }} transition={{ duration: 0.2 }}>
              <ChevronLeft size={16} />
            </motion.div>
          </button>
        </div>

        <SidebarContent
          menuItems={menuItems}
          pathname={pathname}
          user={user}
          iconColors={iconColors}
          collapsed={!desktopOpen}
        />
      </motion.aside>
    </>
  );
}

function SidebarContent({ menuItems, pathname, user, iconColors, collapsed, close }: any) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
        {menuItems.map((item: any, i: number) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          const color = iconColors[item.path] || "#888";

          return (
            <Link key={i} href={item.path} onClick={close}>
              <motion.div
                whileHover={{ x: 2 }}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
                style={{
                  background: isActive
                    ? `${color}14`
                    : "transparent",
                  border: isActive ? `1px solid ${color}25` : "1px solid transparent",
                }}
              >
                {/* Active left bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: color }}
                  />
                )}

                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isActive ? `${color}25` : "rgba(255,255,255,0.04)",
                  }}
                >
                  <Icon size={15} style={{ color: isActive ? color : "#555" }} />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[13px] font-medium whitespace-nowrap"
                      style={{ color: isActive ? "white" : "#666" }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip on collapsed */}
                {collapsed && (
                  <div
                    className="absolute left-14 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
                    opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50"
                    style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                  >
                    {item.name}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="px-3 py-4 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <UserButton />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-[13px] font-medium text-white truncate">
                  {user.firstName || "User"}
                </p>
                <p className="text-[11px] text-gray-600 truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
