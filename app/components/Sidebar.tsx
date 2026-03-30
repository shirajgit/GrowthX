"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(true);

  const menuItems = [
    "Dashboard",
    "Tasks",
    "Projects",
    "Jobs",
    "Clients",
    "Leads",
    "Notes",
    "Settings",
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: open ? 250 : 80 }}
        className="bg-black text-white flex flex-col p-4"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="mb-6 flex items-center gap-2"
        >
          <Menu />
          {open && <span className="text-sm">Menu</span>}
        </button>

        {/* Menu Items */}
        <nav className="flex flex-col gap-4">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition"
            >
              {open ? item : item[0]}
            </div>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-2 border rounded-lg"
            />
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
          </div>
        </div>

        {/* Page Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl shadow">Tasks</div>
          <div className="p-4 bg-white rounded-xl shadow">Projects</div>
          <div className="p-4 bg-white rounded-xl shadow">Jobs</div>
        </div>

        <div className="mt-6 p-6 bg-white rounded-xl shadow">
          {children}
        </div>
      </main>
    </div>
  );
}
