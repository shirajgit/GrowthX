"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function DashboardLayout() {
  const [stats, setStats] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [aiData, setAiData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchSafe = async (url: string) => {
    try {
      const res = await fetch(url);
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  };

  // ✅ REAL CHART GENERATOR
  const generateChart = (tasks: any[], projects: any[], jobs: any[], clients: any[]) => {
    const days = 7;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const dateStr = d.toISOString().split("T")[0];

      const count = (arr: any[]) =>
        arr.filter((x) => x.createdAt?.startsWith(dateStr)).length;

      const t = count(tasks);
      const p = count(projects);
      const j = count(jobs);
      const c = count(clients);

      data.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        tasks: t,
        projects: p,
        jobs: j,
        clients: c,
        total: t + p + j + c,
      });
    }

    return data;
  };

  // 🔥 FETCH ALL DATA
  const fetchAll = async () => {
    setLoading(true);

    const [tasks, projects, jobs, clients] = await Promise.all([
      fetchSafe("/api/tasks"),
      fetchSafe("/api/projects"),
      fetchSafe("/api/jobs"),
      fetchSafe("/api/clients"),
    ]);

 setStats([
  {
    title: "Tasks",
    value: tasks.filter((t: any) => t.status !== "done").length,
  },
  { title: "Projects", value: projects.length },
  { title: "Jobs", value: jobs.length },
  { title: "Clients", value: clients.length },
]);

    const chart = generateChart(tasks, projects, jobs, clients);
    setChartData(chart);

    setLoading(false);
  };

  // 🤖 AI DASHBOARD DATA
  const fetchAI = async () => {
    try {
      setAiLoading(true);
      const res = await fetch("/api/ai/dashboard");
      const data = await res.json();
      setAiData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchAI(); // only once
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-400">
        Loading GrowthX...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white bg-gradient-to-br from-black via-gray-900 to-black space-y-6">

      {/* 🤖 AI HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10"
      >
        <h2 className="text-xl font-semibold mb-2">🤖 AI Insight</h2>

        {aiLoading ? (
          <p className="text-gray-400 animate-pulse">Thinking...</p>
        ) : (
          <>
            <p className="text-lg">{aiData?.summary}</p>
            <p className="text-sm text-gray-400 mt-2">{aiData?.insight}</p>
          </>
        )}

        {/* 🔥 BUTTONS */}
        <div className="mt-4 flex flex-wrap gap-3">

          {/* REFRESH */}
          <button
            onClick={fetchAI}
            className="px-4 py-2 rounded-xl bg-white text-black hover:scale-105 transition"
          >
            🔄 Refresh AI
          </button>

          {/* WHAT SHOULD I DO */}
          <button
            onClick={async () => {
              try {
                setAiLoading(true);

                const res = await fetch("/api/ai", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    message: "What should I do right now? Give me clear next actions.",
                  }),
                });

                const data = await res.json();

                setAiData((prev: any) => ({
                  ...prev,
                  summary: data.reply,
                }));

              } catch (err) {
                console.error(err);
              } finally {
                setAiLoading(false);
              }
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:scale-105 transition"
          >
            {aiLoading ? "Thinking..." : "🧠 What should I do now"}
          </button>

        </div>
      </motion.div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-gray-400">{s.title}</p>
            <h2 className="text-2xl font-bold">{s.value}</h2>
          </div>
        ))}
      </div>

      {/* 📈 CHART */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 h-64">
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <XAxis dataKey="day" stroke="#888" />
            <Tooltip />
            <Line dataKey="tasks" stroke="#22c55e" />
            <Line dataKey="projects" stroke="#3b82f6" />
            <Line dataKey="jobs" stroke="#f59e0b" />
            <Line dataKey="clients" stroke="#ec4899" />
            <Line dataKey="total" stroke="#ffffff" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🤖 AI GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-2">🔥 Priorities</h3>
          {aiData?.priorities?.map((p: string, i: number) => (
            <p key={i}>• {p}</p>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <h3 className="font-semibold mb-2">⚡ Suggestions</h3>
          {aiData?.suggestions?.map((s: string, i: number) => (
            <p key={i}>• {s}</p>
          ))}
        </div>

      </div>

      {/* 🎯 SCORE */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-center">
        <h3 className="text-lg">AI Productivity Score</h3>
        <div className="text-4xl font-bold">
          {aiData?.score || 0}%
        </div>
      </div>

    </div>
  );
} 