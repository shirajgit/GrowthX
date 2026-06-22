"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Search, CheckSquare, ListTodo, Target, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Task = {
  _id: string;
  title: string;
  status: "todo" | "done";
  userId: string;
  createdAt?: string;
  updatedAt?: string;
};

const ACCENT = "#34d399";

const formatTime = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(); yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString()}, ${time}`;
};

function StatCard({ label, value, color, icon: Icon, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      whileHover={{ y: -2 }}
      className="relative rounded-2xl p-4 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20" style={{ background: color }} />
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${color}1f`, border: `1px solid ${color}40` }}>
        <Icon size={15} style={{ color }} />
      </div>
      <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
      <p className="text-[11px] text-gray-500 uppercase tracking-wide mt-1.5">{label}</p>
    </motion.div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    fetch("/api/tasks").then((r) => r.json()).then((d) => { setTasks(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    setAdding(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: input }),
    });
    if (!res.ok) { setAdding(false); return; }
    const newTask = await res.json();
    setTasks((prev) => [newTask, ...prev]);
    setInput("");
    setAdding(false);
  };

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done";
    const res = await fetch(`/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === "done").length;
  const todo = total - done;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen text-white p-4 sm:p-6" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "linear-gradient(160deg, #080808 0%, #0f0f13 50%, #0a0a10 100%)" }}>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${ACCENT}40, ${ACCENT}12)`, border: `1px solid ${ACCENT}40` }}>
            <CheckSquare size={20} style={{ color: ACCENT }} />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 font-semibold">Productivity</p>
            <h1 className="text-2xl font-bold tracking-tight leading-none mt-0.5">Tasks</h1>
          </div>
        </div>
      </motion.div>

      {/* Stat row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total" value={total} color="#a78bfa" icon={ListTodo} delay={0.04} />
        <StatCard label="Remaining" value={todo} color="#f59e0b" icon={Flame} delay={0.08} />
        <StatCard label="Completed" value={done} color={ACCENT} icon={CheckCircle2} delay={0.12} />
        <StatCard label="Completion" value={`${progress}%`} color="#60a5fa" icon={Target} delay={0.16} />
      </div>

      {/* Progress bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="rounded-2xl p-4 mb-5" style={{ background: `linear-gradient(135deg, ${ACCENT}14, ${ACCENT}04)`, border: `1px solid ${ACCENT}22` }}>
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[11px] tracking-[0.2em] uppercase text-emerald-400 font-semibold">Today's Progress</p>
          <p className="text-xs text-gray-500">{done} / {total} done</p>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${ACCENT}80, ${ACCENT})`, boxShadow: `0 0 12px ${ACCENT}66` }} />
        </div>
      </motion.div>

      {/* Add input */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="flex gap-3 mb-5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="Add a new task…"
          className="flex-1 px-5 py-3.5 rounded-xl text-sm outline-none transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${focused ? `${ACCENT}66` : "rgba(255,255,255,0.08)"}`, boxShadow: focused ? `0 0 0 3px ${ACCENT}14` : "none", color: "white" }}
        />
        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={addTask} disabled={adding}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold flex-shrink-0"
          style={{ background: `${ACCENT}1f`, border: `1px solid ${ACCENT}50`, color: ACCENT }}>
          <Plus size={16} /><span className="hidden sm:inline">{adding ? "Adding…" : "Add"}</span>
        </motion.button>
      </motion.div>

      {/* Filters + search */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }} className="flex flex-wrap items-center gap-2 mb-6">
        {(["all", "todo", "done"] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
            style={{ background: filter === f ? `${ACCENT}1f` : "rgba(255,255,255,0.04)", border: `1px solid ${filter === f ? `${ACCENT}50` : "rgba(255,255,255,0.07)"}`, color: filter === f ? ACCENT : "#666" }}>
            {f} {f === "all" ? `(${total})` : f === "todo" ? `(${todo})` : `(${done})`}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
            className="pl-8 pr-4 py-1.5 rounded-full text-xs outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "white", width: "140px" }} />
        </div>
      </motion.div>

      {/* List / skeleton */}
      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />)}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((task, i) => (
              <motion.div key={task._id} layout
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20, scale: 0.97 }}
                transition={{ delay: i * 0.03, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ x: 2 }}
                className="group flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all duration-200"
                style={{ background: task.status === "done" ? `${ACCENT}0a` : "rgba(255,255,255,0.03)", border: `1px solid ${task.status === "done" ? `${ACCENT}1f` : "rgba(255,255,255,0.06)"}` }}>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => toggleTask(task)} className="flex-shrink-0">
                  {task.status === "done" ? <CheckCircle2 size={20} style={{ color: ACCENT }} /> : <Circle size={20} className="text-gray-700 group-hover:text-gray-400 transition-colors" />}
                </motion.button>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleTask(task)}>
                  <p className="text-sm font-medium leading-snug" style={{ color: task.status === "done" ? "#4b5563" : "white", textDecoration: task.status === "done" ? "line-through" : "none" }}>{task.title}</p>
                  <div className="flex gap-3 mt-1">
                    {task.createdAt && <span className="text-[11px] text-gray-700">{formatTime(task.createdAt)}</span>}
                    {task.updatedAt && task.status === "done" && <span className="text-[11px]" style={{ color: ACCENT }}>✓ {formatTime(task.updatedAt)}</span>}
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => deleteTask(task._id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: "#ef4444" }}>
                  <Trash2 size={15} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-24 text-gray-600">
          <CheckSquare size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? "No tasks match your search" : "Nothing here yet — add your first task 🚀"}</p>
        </motion.div>
      )}
    </div>
  );
}