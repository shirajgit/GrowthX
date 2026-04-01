"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [theme, setTheme] = useState("dark");

  // 🔹 Load settings
  const fetchSettings = async () => {
    const res = await fetch("/api/settings");
    const data = await res.json();

    setProfile({
      name: data.name,
      email: data.email,
    });
    setTheme(data.theme);
  };

 useEffect(() => {
    (async () => {
      await fetchSettings();
    })();
  }, []);

  // 🔹 Save settings
  const saveSettings = async () => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...profile,
        theme,
      }),
    });

    if (res.ok) {
      alert("✅ Settings saved!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      {/* Profile */}
      <div className="bg-gray-900 p-5 rounded-2xl mb-6">
        <h2 className="mb-4 font-semibold">Profile</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={profile.name}
            onChange={(e) =>
              setProfile({ ...profile, name: e.target.value })
            }
            placeholder="Name"
            className="px-4 py-3 rounded-xl bg-gray-800"
          />

          <input
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-gray-800"
          />
        </div>
      </div>

      {/* Theme */}
      <div className="bg-gray-900 p-5 rounded-2xl mb-6">
        <h2 className="mb-4 font-semibold">Theme</h2>

        <div className="flex gap-4">
          <button
            onClick={() => setTheme("dark")}
            className={`px-4 py-2 rounded-xl ${
              theme === "dark" ? "bg-white text-black" : "bg-gray-800"
            }`}
          >
            Dark
          </button>

          <button
            onClick={() => setTheme("light")}
            className={`px-4 py-2 rounded-xl ${
              theme === "light" ? "bg-white text-black" : "bg-gray-800"
            }`}
          >
            Light
          </button>
        </div>
      </div>

      <button
        onClick={saveSettings}
        className="bg-white text-black px-6 py-3 rounded-xl"
      >
        Save Settings
      </button>
    </div>
  );
}