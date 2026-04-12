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
        color: "#22c55e",
        icon: "✅",
      },
      { title: "Projects", value: projects.length, color: "#3b82f6", icon: "🚀" },
      { title: "Jobs", value: jobs.length, color: "#f59e0b", icon: "💼" },
      { title: "Clients", value: clients.length, color: "#ec4899", icon: "👥" },
    ]);

    const chart = generateChart(tasks, projects, jobs, clients);
    setChartData(chart);
    setLoading(false);
  };

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
    fetchAI();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
          <p className="text-gray-500 text-sm tracking-widest uppercase text-xs">Loading GrowthX</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-6 text-white space-y-5"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(160deg, #080808 0%, #0f0f13 50%, #0a0a10 100%)",
      }}
    >
      {/* Ambient glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)" }} />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />

      {/* Page title */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 font-semibold mb-1">Overview</p>
        <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
      </motion.div>

      {/* AI HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative rounded-3xl overflow-hidden p-6"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(59,130,246,0.08) 100%)",
          border: "1px solid rgba(139,92,246,0.2)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)" }} />

        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>
            🤖
          </div>
          <div className="flex-1">
            <p className="text-[11px] tracking-[0.2em] uppercase text-purple-400 font-semibold mb-1">AI Insight</p>
            {aiLoading ? (
              <div className="space-y-2">
                <div className="h-4 rounded-full bg-white/5 animate-pulse w-3/4" />
                <div className="h-3 rounded-full bg-white/5 animate-pulse w-1/2" />
              </div>
            ) : (
              <>
                <p className="text-white font-medium leading-snug">{aiData?.summary || "Analyzing your workspace..."}</p>
                <p className="text-sm text-gray-400 mt-1">{aiData?.insight}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={async () => {
              try {
                setAiLoading(true);
                const res = await fetch("/api/ai", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ message: "What should I do right now? Give me clear next actions." }),
                });
                const data = await res.json();
                setAiData((prev: any) => ({ ...prev, summary: data.reply }));
              } catch (err) {
                console.error(err);
              } finally {
                setAiLoading(false);
              }
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.3))",
              border: "1px solid rgba(139,92,246,0.4)",
              color: "#c4b5fd",
            }}
          >
            {aiLoading ? "Thinking…" : "🧠 What should I do now"}
          </motion.button>
        </div>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl overflow-hidden p-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20"
              style={{ background: s.color }} />
            <p className="text-2xl mb-2">{s.icon}</p>
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: s.color }}>{s.value}</h2>
            <p className="text-[11px] text-gray-500 tracking-wide uppercase mt-1">{s.title}</p>
          </motion.div>
        ))}
      </div>

      {/* CHART */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.45 }}
        className="rounded-2xl p-5"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-4">Activity — Last 7 Days</p>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#444" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#111", border: "1px solid #222", borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: "#888" }}
              />
              <Line dataKey="tasks" stroke="#22c55e" strokeWidth={2} dot={false} />
              <Line dataKey="projects" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line dataKey="jobs" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line dataKey="clients" stroke="#ec4899" strokeWidth={2} dot={false} />
              <Line dataKey="total" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 mt-3">
          {[
            { label: "Tasks", color: "#22c55e" },
            { label: "Projects", color: "#3b82f6" },
            { label: "Jobs", color: "#f59e0b" },
            { label: "Clients", color: "#ec4899" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              <span className="text-[11px] text-gray-500">{l.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI GRID */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { title: "🔥 Priorities", key: "priorities" },
          { title: "⚡ Suggestions", key: "suggestions" },
        ].map((section, si) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + si * 0.08, duration: 0.45 }}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-3">{section.title}</p>
            <div className="space-y-2">
              {(aiData?.[section.key] || []).map((item: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-1 h-1 rounded-full bg-gray-600 mt-2 flex-shrink-0" />
                  <p className="text-sm text-gray-300 leading-relaxed">{item}</p>
                </div>
              ))}
              {(!aiData?.[section.key] || aiData[section.key].length === 0) && (
                <div className="h-3 rounded-full bg-white/5 animate-pulse w-2/3" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* SCORE */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.45 }}
        className="relative rounded-2xl p-6 text-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.08))",
          border: "1px solid rgba(139,92,246,0.15)",
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }} />
        <p className="text-[11px] tracking-[0.2em] uppercase text-purple-400 font-semibold mb-2">AI Productivity Score</p>
        <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          {aiData?.score || 0}%
        </div>
      </motion.div>
    </div>
  );
}
