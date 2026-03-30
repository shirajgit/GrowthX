 "use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState } from "react";
import { Menu, LayoutDashboard, CheckSquare, Folder, Briefcase, Users, Flame, Notebook, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();

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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex bg-gray-950  text-white">
        {/* Sidebar */}
        <motion.aside
          animate={{ width: open ? 240 : 80 }}
          className="bg-black/80 backdrop-blur-xl border-r border-gray-800 flex flex-col p-4"
        >
          <button
            onClick={() => setOpen(!open)}
            className="mb-8 flex items-center gap-2"
          >
            <Menu />
            {open && <span className="text-sm font-semibold">Menu</span>}
          </button>

          <nav className="flex flex-col gap-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;

              return (
                <Link key={index} href={item.path}>
                  <div
                    className={`flex items-center gap-3 p-3 rounded-xl transition cursor-pointer ${
                      isActive
                        ? "bg-white text-black"
                        : "hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={18} />
                    {open && <span>{item.name}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}
