"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "Shiraj",
    email: "",
  });

  const [theme, setTheme] = useState("dark");

  const saveSettings = () => {
    alert("Settings saved (frontend only)");
  };

  return (
    <div className="min-h-screen text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      {/* Profile Settings */}
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl mb-6">
        <h2 className="text-lg font-semibold mb-4">Profile</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            placeholder="Name"
            className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700"
          />
          <input
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-gray-800 border border-gray-700"
          />
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-gray-900 border border-gray-800 p-5 rounded-2xl mb-6">
        <h2 className="text-lg font-semibold mb-4">Theme</h2>

        <div className="flex gap-4">
          <button
            onClick={() => setTheme("dark")}
            className={`px-4 py-2 rounded-xl border ${
              theme === "dark"
                ? "bg-white text-black"
                : "border-gray-700"
            }`}
          >
            Dark
          </button>

          <button
            onClick={() => setTheme("light")}
            className={`px-4 py-2 rounded-xl border ${
              theme === "light"
                ? "bg-white text-black"
                : "border-gray-700"
            }`}
          >
            Light
          </button>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={saveSettings}
        className="bg-white text-black px-6 py-3 rounded-xl"
      >
        Save Settings
      </button>
    </div>
  );
}
