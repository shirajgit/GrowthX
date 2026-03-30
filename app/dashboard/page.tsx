"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardLayout() {
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

  const stats = [
    { title: "Tasks Today", value: 5 },
    { title: "Active Projects", value: 3 },
    { title: "Job Applications", value: 12 },
    { title: "Clients", value: 4 },
  ];

  return (
    <div className="flex h-screen  text-white">
      

      {/* Main */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400 text-sm">Welcome back, Shiraj 👋</p>
          </div>

          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-700"
            />
            <div className="w-10 h-10 bg-gray-700 rounded-full" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-5 bg-gray-900 rounded-2xl border border-gray-800 shadow"
            >
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <h2 className="text-2xl font-semibold mt-2">{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks */}
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
            <h3 className="font-semibold mb-3">Today`s Tasks</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Finish dashboard UI</li>
              <li>• Apply to 3 jobs</li>
              <li>• Client follow-up</li>
            </ul>
          </div>

          {/* Projects */}
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
            <h3 className="font-semibold mb-3">Active Projects</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Portfolio Website</li>
              <li>• Client CRM Tool</li>
            </ul>
          </div>

          {/* Activity */}
          <div className="bg-gray-900 p-5 rounded-2xl border border-gray-800">
            <h3 className="font-semibold mb-3">Recent Activity</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Added new task</li>
              <li>• Updated project progress</li>
              <li>• Applied to company</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}