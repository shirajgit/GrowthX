"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Project {
  name: string;
  createdAt?: string;
}

export default function DashboardLayout() {
  const [stats, setStats] = useState([
    { title: "Tasks Today", value: 0 },
    { title: "Projects", value: 0 },
    { title: "Jobs", value: 0 },
    { title: "Clients", value: 0 },
  ]);

  const [chartData, setChartData] = useState<{ day: string | number; tasks: number; projects: number; jobs: number; clients: number; total: number }[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<"7d" | "30d">("7d");

  const [growth, setGrowth] = useState(0);
  const [score, setScore] = useState(0);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [tasksRes, projectsRes, jobsRes, clientsRes] =
        await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/projects"),
          fetch("/api/jobs"),
          fetch("/api/clients"),
        ]);

      const tasks = await tasksRes.json();
      const projectsData = await projectsRes.json();
      const jobs = await jobsRes.json();
      const clients = await clientsRes.json();

      setProjects(projectsData.slice(0, 5));

      // 📊 Stats
      setStats([
        {
          title: "Tasks Today",
          value: tasks.filter((t: { status: string }) => t.status !== "done").length,
        },
        { title: "Projects", value: projectsData.length },
        { title: "Jobs", value: jobs.length },
        { title: "Clients", value: clients.length },
      ]);

      // 📊 Chart
      const days = range === "7d" ? 7 : 30;
      const data: { day: string | number; tasks: number; projects: number; jobs: number; clients: number; total: number }[] = [];

      let prevTotal = 0;
      let currentTotal = 0;

      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);

        const dateStr = d.toISOString().split("T")[0];

        const t = tasks.filter((x: { createdAt?: string }) =>
          x.createdAt?.startsWith(dateStr)
        ).length;

        const p = projectsData.filter((x: { createdAt?: string }) =>
          x.createdAt?.startsWith(dateStr)
        ).length;

        const j = jobs.filter((x: { createdAt?: string }) =>
          x.createdAt?.startsWith(dateStr)
        ).length;

        const c = clients.filter((x : { createdAt?: string }) =>
          x.createdAt?.startsWith(dateStr)
        ).length;

        const total = t + p + j + c;

        if (i >= days / 2) prevTotal += total;
        else currentTotal += total;

        data.push({
          day:
            range === "7d"
              ? d.toLocaleDateString("en-US", { weekday: "short" })
              : d.getDate(),
          tasks: t,
          projects: p,
          jobs: j,
          clients: c,
          total,
        });
      }

      const g =
        prevTotal === 0
          ? 100
          : Math.round(((currentTotal - prevTotal) / prevTotal) * 100);

      setGrowth(g);
      setChartData(data);

      // 🎯 Score
      const totals = data.map((d) => d.total);
      const avg =
        totals.reduce((a, b) => a + b, 0) / (totals.length || 1);
      setScore(Math.min(100, Math.round(avg * 10)));

      // ⚡ Activity (dynamic)
      const acts: string[] = [];

      if (tasks[0]) acts.push(`📝 Task: ${tasks[0].title}`);
      if (projectsData[0])
        acts.push(`🚀 Project: ${projectsData[0].name}`);
      if (clients[0]) acts.push(`📞 New client added`);
      if (jobs[0]) acts.push(`💼 Applied to job`);

      setActivities(acts);

      // 🤖 AI Suggestions
      const sugg: string[] = [];

      const pending = tasks.filter(
        (t: { status: string }) => t.status !== "done"
      );

      if (pending.length > 5)
        sugg.push("📝 Complete pending tasks");

      if (clients.length > 0)
        sugg.push("📞 Follow up with clients");

      if (projectsData.length === 0)
        sugg.push("🚀 Start a new project");

      if (g < 0)
        sugg.push("📉 Increase activity this week");

      if (avg < 3)
        sugg.push("⚡ Aim 3+ tasks daily");

      setSuggestions(sugg);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [range]);

  return (
    <div className="min-h-screen text-white p-6 bg-gradient-to-br from-black via-gray-900 to-black">

      {/* HEADER */}
      <div className="flex mt-14 lg:mt-1 justify-between items-center mb-6">
        <h1 className="text-3xl  font-bold">Dashboard</h1>

        <div className="flex gap-2">
          {["7d", "30d"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r as "7d" | "30d")}
              className={`px-3 py-1 rounded ${
                range === r ? "bg-white text-black" : "bg-gray-800"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white/5 p-4 rounded-xl">
            <p className="text-gray-400">{s.title}</p>
            <h2 className="text-2xl font-bold">{s.value}</h2>
            <p className={growth >= 0 ? "text-green-400 text-xs" : "text-red-400 text-xs"}>
              {growth >= 0 ? "▲" : "▼"} {growth}%
            </p>
          </div>
        ))}
      </div>

      {/* CHART */}
      <div className="bg-white/5 p-4 rounded-xl mb-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="day" stroke="#888" />
              <Tooltip />
              <Line dataKey="tasks" stroke="#22c55e" />
              <Line dataKey="projects" stroke="#3b82f6" />
              <Line dataKey="jobs" stroke="#f59e0b" />
              <Line dataKey="clients" stroke="#ec4899" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NEW SECTION */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* 📁 Recent Projects */}
        <div className="bg-white/5 p-4 rounded-xl">
          <h3 className="mb-2 font-semibold">Recent Projects</h3>
          {projects.map((p, i) => (
            <p key={i} className="text-sm text-gray-300">
              • {p.name}
            </p>
          ))}
        </div>

        {/* ⚡ Activity */}
        <div className="bg-white/5 p-4 rounded-xl">
          <h3 className="mb-2 font-semibold">Recent Activity</h3>
          {activities.map((a, i) => (
            <p key={i} className="text-sm text-gray-300">
              • {a}
            </p>
          ))}
        </div>

        {/* 🤖 AI Suggestions */}
        <div className="bg-white/5 p-4 rounded-xl">
          <h3 className="mb-2 font-semibold">AI Suggestions</h3>
          {suggestions.map((s, i) => (
            <p key={i} className="text-sm text-gray-300">
              • {s}
            </p>
          ))}
        </div>
      </div>

      {/* SCORE */}
      <div className="mt-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 rounded-xl text-center">
        <h3 className="mb-2">Productivity Score</h3>
        <div className="text-4xl font-bold">{score}%</div>
      </div>
    </div>
  );
}