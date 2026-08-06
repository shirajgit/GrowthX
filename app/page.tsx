"use client";

import { useEffect, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// ---- Theme tokens -----------------------------------------------------------
const CATEGORY = {
  tasks: { label: "Tasks", color: "#22c55e", icon: "✅" },
  projects: { label: "Projects", color: "#3b82f6", icon: "🚀" },
  jobs: { label: "Jobs", color: "#f59e0b", icon: "💼" },
  leads: { label: "Leads", color: "#ec4899", icon: "🎯" },
} as const;

const STATUS_COLORS: Record<string, string> = {
  done: "#22c55e",
  completed: "#22c55e",
  "in-progress": "#3b82f6",
  in_progress: "#3b82f6",
  doing: "#3b82f6",
  todo: "#a855f7",
  pending: "#a855f7",
  backlog: "#6b7280",
  blocked: "#ef4444",
};
const FALLBACK_STATUS_COLORS = ["#8b5cf6", "#06b6d4", "#f43f5e", "#eab308", "#10b981"];

const cardStyle = {
  background: "var(--surface-2)",
  border: "1px solid var(--border-soft)",
};

type ChatMsg = { role: "user" | "ai"; content: string };

export default function DashboardLayout() {
  const [stats, setStats] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [completion, setCompletion] = useState(0);
  const [aiData, setAiData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchSafe = async (url: string) => {
    try {
      const res = await fetch(url);
      return res.ok ? res.json() : [];
    } catch {
      return [];
    }
  };

  // 7-day activity + running cumulative total
  const generateChart = (tasks: any[], projects: any[], jobs: any[], leads: any[]) => {
    const days = 7;
    const data: any[] = [];
    let cumulative = 0;

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];

      const count = (arr: any[]) =>
        arr.filter((x) => x.createdAt?.startsWith(dateStr)).length;

      const t = count(tasks);
      const p = count(projects);
      const j = count(jobs);
      const l = count(leads);
      const total = t + p + j + l;
      cumulative += total;

      data.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        tasks: t,
        projects: p,
        jobs: j,
        leads: l,
        total,
        cumulative,
      });
    }
    return data;
  };

  // Task status breakdown (real .status values, grouped dynamically)
  const buildStatusData = (tasks: any[]) => {
    const groups: Record<string, number> = {};
    tasks.forEach((t) => {
      const key = (t.status || "todo").toString().toLowerCase();
      groups[key] = (groups[key] || 0) + 1;
    });
    let fallbackIdx = 0;
    return Object.entries(groups).map(([name, value]) => ({
      name: name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value,
      color:
        STATUS_COLORS[name] ||
        FALLBACK_STATUS_COLORS[fallbackIdx++ % FALLBACK_STATUS_COLORS.length],
    }));
  };

  const fetchAll = async () => {
    setLoading(true);

    const [tasks, projects, jobs, leads] = await Promise.all([
      fetchSafe("/api/tasks"),
      fetchSafe("/api/projects"),
      fetchSafe("/api/jobs"),
      fetchSafe("/api/leads"),
    ]);

    const chart = generateChart(tasks, projects, jobs, leads);
    const today = chart[chart.length - 1] || {};

    const openTasks = tasks.filter((t: any) => t.status !== "done").length;
    const doneTasks = tasks.length - openTasks;

    setStats([
      { key: "tasks", title: "Tasks", value: openTasks, delta: today.tasks || 0, ...CATEGORY.tasks },
      { key: "projects", title: "Projects", value: projects.length, delta: today.projects || 0, ...CATEGORY.projects },
      { key: "jobs", title: "Jobs", value: jobs.length, delta: today.jobs || 0, ...CATEGORY.jobs },
      { key: "leads", title: "Leads", value: leads.length, delta: today.leads || 0, ...CATEGORY.leads },
    ]);

    setChartData(chart);
    setStatusData(buildStatusData(tasks));
    setCategoryData([
      { name: "Tasks", value: tasks.length, color: CATEGORY.tasks.color },
      { name: "Projects", value: projects.length, color: CATEGORY.projects.color },
      { name: "Jobs", value: jobs.length, color: CATEGORY.jobs.color },
      { name: "Leads", value: leads.length, color: CATEGORY.leads.color },
    ]);
    setCompletion(tasks.length ? Math.round((doneTasks / tasks.length) * 100) : 0);

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

  // Chat: posts to your existing /api/ai endpoint
  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || chatLoading) return;

    setMessages((m) => [...m, { role: "user", content }]);
    setInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "ai", content: data.reply || "I couldn't generate a response." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "ai", content: "Something went wrong reaching the assistant. Try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    fetchAI();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
          <p className="text-gray-500 tracking-widest uppercase text-xs">Loading GrowthX</p>
        </div>
      </div>
    );
  }

  const maxStat = Math.max(...stats.map((s) => s.value), 1);
  const tooltipStyle = {
    contentStyle: { background: "#111", border: "1px solid #222", borderRadius: 12, fontSize: 12 },
    labelStyle: { color: "#888" },
  };
  const quickPrompts = [
    "What should I do right now? Give me clear next actions.",
    "Summarize my week",
    "Which leads should I follow up first?",
  ];

  return (
    <div
      className="min-h-screen p-6 text-white space-y-5"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "var(--bg-grad)",
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

      {/* ============ AI INSIGHT — restyled spotlight ============ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        data-theme="dark"
        className="relative rounded-[28px] overflow-hidden"
        style={{
          background: "linear-gradient(140deg, rgba(20,16,34,0.9) 0%, rgba(13,16,28,0.9) 100%)",
          border: "1px solid rgba(139,92,246,0.18)",
          boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
        }}
      >
        {/* moving sheen */}
        <motion.div
          className="absolute -inset-x-20 -top-24 h-44 pointer-events-none blur-3xl"
          style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.25), transparent)" }}
          animate={{ x: [-80, 80, -80] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative p-6 flex flex-col md:flex-row md:items-center gap-6">
          {/* Avatar with pulsing ring */}
          <div className="relative flex-shrink-0 mx-auto md:mx-0">
            <span className="absolute inset-0 rounded-2xl animate-ping opacity-30"
              style={{ background: "rgba(139,92,246,0.4)" }} />
            <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(59,130,246,0.25))",
                border: "1px solid rgba(139,92,246,0.45)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15)",
              }}>
              🤖
            </div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[11px] tracking-[0.25em] uppercase text-purple-300 font-semibold">AI Insight</p>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Live
              </span>
            </div>

            {aiLoading ? (
              <div className="space-y-2">
                <div className="h-5 rounded-full bg-white/5 animate-pulse w-3/4" />
                <div className="h-3 rounded-full bg-white/5 animate-pulse w-1/2" />
              </div>
            ) : (
              <>
                <p className="text-lg md:text-xl text-white font-semibold leading-snug tracking-tight">
                  {aiData?.summary || "Analyzing your workspace…"}
                </p>
                {aiData?.insight && <p className="text-sm text-gray-400 mt-1.5">{aiData.insight}</p>}
              </>
            )}

            {/* action chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              {quickPrompts.map((q, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => sendMessage(q)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium transition-all text-purple-200"
                  style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)" }}
                >
                  {i === 0 ? "🧠 " : ""}{q.length > 28 ? q.slice(0, 28) + "…" : q}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============ STATS — restyled cards ============ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3 }}
            className="relative rounded-2xl overflow-hidden p-4 group"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}
          >
            {/* corner glow */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-25 transition-opacity group-hover:opacity-40"
              style={{ background: s.color }} />

            {/* top row: icon chip + delta */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                style={{ background: `${s.color}1f`, border: `1px solid ${s.color}40` }}>
                {s.icon}
              </div>
              {s.delta > 0 && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                  style={{ background: `${s.color}1a`, color: s.color }}>
                  +{s.delta} today
                </span>
              )}
            </div>

            <h2 className="text-3xl font-bold tracking-tight leading-none" style={{ color: s.color }}>{s.value}</h2>
            <p className="text-[11px] text-gray-500 tracking-wide uppercase mt-1.5">{s.title}</p>

            {/* comparison bar */}
            <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: "var(--surface-hover)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(s.value / maxStat) * 100}%` }}
                transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: s.color }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ACTIVITY AREA + STATUS DONUT */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.45 }}
          className="lg:col-span-2 rounded-2xl p-5" style={cardStyle}
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-4">Activity — Last 7 Days</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  {Object.entries(CATEGORY).map(([key, c]) => (
                    <linearGradient key={key} id={`g-${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={c.color} stopOpacity={0.5} />
                      <stop offset="100%" stopColor={c.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="day" stroke="#444" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
                <YAxis stroke="#444" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip {...tooltipStyle} />
                {Object.entries(CATEGORY).map(([key, c]) => (
                  <Area key={key} type="monotone" dataKey={key} stackId="1" stroke={c.color} strokeWidth={2} fill={`url(#g-${key})`} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            {Object.values(CATEGORY).map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                <span className="text-[11px] text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.45 }}
          className="rounded-2xl p-5" style={cardStyle}
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-2">Task Status</p>
          <div className="h-48">
            {statusData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} stroke="none">
                    {statusData.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-600">No tasks yet</div>
            )}
          </div>
          <div className="space-y-1.5 mt-2">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />{s.name}
                </span>
                <span className="text-gray-500">{s.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CATEGORY BARS + COMPLETION RADIAL */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42, duration: 0.45 }}
          className="lg:col-span-2 rounded-2xl p-5" style={cardStyle}
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-4">Totals by Category</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="name" stroke="#444" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} />
                <YAxis stroke="#444" tick={{ fontSize: 11, fill: "#666" }} axisLine={false} tickLine={false} width={28} />
                <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {categoryData.map((c, i) => <Cell key={i} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48, duration: 0.45 }}
          className="rounded-2xl p-5 flex flex-col" style={cardStyle}
        >
          <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-2">Task Completion</p>
          <div className="flex-1 relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: completion, fill: "#8b5cf6" }]} startAngle={90} endAngle={-270}>
                <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">{completion}%</span>
              <span className="text-[11px] text-gray-500 uppercase tracking-wide mt-1">done</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI GRID */}
      <div className="grid md:grid-cols-2 gap-4">
        {[
          { title: "🔥 Priorities", key: "priorities" },
          { title: "⚡ Suggestions", key: "suggestions" },
        ].map((section, si) => (
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.54 + si * 0.08, duration: 0.45 }}
            className="rounded-2xl p-5" style={cardStyle}
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

      {/* AI CHAT PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.45 }}
        className="rounded-2xl overflow-hidden flex flex-col" style={cardStyle}
      >
        <div className="px-5 py-3 flex items-center gap-2 border-b border-white/5">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.3)" }}>💬</span>
          <p className="text-[11px] tracking-[0.2em] uppercase text-purple-400 font-semibold">Assistant</p>
        </div>

        <div className="px-5 py-4 space-y-3 max-h-80 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-3">Ask anything about your workspace.</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {["Summarize my week", "What's overdue?", "Top leads to call"].map((q) => (
                  <button key={q} onClick={() => sendMessage(q)}
                    className="px-3 py-1.5 rounded-lg text-xs text-gray-300 transition-all hover:text-white"
                    style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={
                    m.role === "user"
                      ? { background: "linear-gradient(135deg, rgba(139,92,246,0.35), rgba(59,130,246,0.35))", border: "1px solid rgba(139,92,246,0.4)", color: "#ede9fe", borderBottomRightRadius: 6 }
                      : { background: "var(--surface-3)", border: "1px solid var(--border)", color: "var(--text-muted)", borderBottomLeftRadius: 6 }
                  }
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {chatLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl flex gap-1" style={{ background: "var(--surface-3)", border: "1px solid var(--border)" }}>
                {[0, 1, 2].map((d) => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="px-4 py-3 border-t border-white/5 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder="Message the assistant…"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-600 px-3 py-2 rounded-xl outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || chatLoading}
            className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-40 transition-all"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.4), rgba(59,130,246,0.4))", border: "1px solid rgba(139,92,246,0.4)", color: "#ede9fe" }}
          >
            Send
          </motion.button>
        </div>
      </motion.div>

      {/* SCORE */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.45 }}
        className="relative rounded-2xl p-6 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.08))", border: "1px solid rgba(139,92,246,0.15)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.3), transparent)" }} />
        <p className="text-[11px] tracking-[0.2em] uppercase text-purple-400 font-semibold mb-2">AI Productivity Score</p>
        {aiLoading || !aiData ? (
          <div className="h-12 w-24 mx-auto rounded-xl bg-white/5 animate-pulse" />
        ) : (
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {aiData.score ?? 0}%
          </div>
        )}
      </motion.div>
    </div>
  );
}