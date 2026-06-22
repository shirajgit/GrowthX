"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Check, Rocket, Folder, TrendingUp, CheckCircle2, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Project = {
  _id: string;
  name: string;
  tech: string;
  progress: number;
  createdAt?: string;
  updatedAt?: string;
};

const ACCENT = "#3b82f6";

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

const getProgressColor = (p: number) => {
  if (p >= 80) return "#22c55e";
  if (p >= 50) return "#3b82f6";
  if (p >= 25) return "#f59e0b";
  return "#6b7280";
};

function Ring({ value, color }: { value: number; color: string }) {
  const r = 18, c = 2 * Math.PI * r, off = c - (value / 100) * c;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" className="flex-shrink-0">
      <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
      <motion.circle cx="24" cy="24" r={r} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
        strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: off }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} transform="rotate(-90 24 24)" />
      <text x="24" y="28" textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>{value}</text>
    </svg>
  );
}

function StatCard({ label, value, color, icon: Icon, delay = 0 }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -2 }}
      className="relative rounded-2xl p-4 overflow-hidden" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20" style={{ background: color }} />
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ background: `${color}1f`, border: `1px solid ${color}40` }}>
        <Icon size={15} style={{ color }} />
      </div>
      <p className="text-2xl font-bold leading-none" style={{ color }}>{value}</p>
      <p className="text-[11px] text-gray-500 uppercase tracking-wide mt-1.5">{label}</p>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ name: "", tech: "", progress: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then((d) => { setProjects(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const addProject = async () => {
    if (!form.name.trim()) return;
    const res = await fetch("/api/projects", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, tech: form.tech, progress: Number(form.progress) || 0 }),
    });
    const newProject = await res.json();
    setProjects((prev) => [newProject, ...prev]);
    setForm({ name: "", tech: "", progress: "" });
  };

  const updateProgress = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ progress: Number(editProgress) }),
    });
    const updated = await res.json();
    setProjects((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    setEditingId(null);
  };

  const deleteProject = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  const avgProgress = projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;
  const completed = projects.filter((p) => p.progress >= 100).length;
  const active = projects.filter((p) => p.progress > 0 && p.progress < 100).length;

  return (
    <div className="min-h-screen text-white p-4 sm:p-6" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "linear-gradient(160deg, #080808 0%, #0f0f13 50%, #0a0a10 100%)" }}>
      <div className="fixed top-0 left-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${ACCENT}40, ${ACCENT}12)`, border: `1px solid ${ACCENT}40` }}>
            <Folder size={20} style={{ color: ACCENT }} />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 font-semibold">Build</p>
            <h1 className="text-2xl font-bold tracking-tight leading-none mt-0.5">Projects</h1>
          </div>
        </div>
      </motion.div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Projects" value={projects.length} color="#a78bfa" icon={Folder} delay={0.04} />
        <StatCard label="Avg Progress" value={`${avgProgress}%`} color={ACCENT} icon={TrendingUp} delay={0.08} />
        <StatCard label="Completed" value={completed} color="#22c55e" icon={CheckCircle2} delay={0.12} />
      </div>

      {/* Add form */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
        className="rounded-2xl p-5 mb-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-4">New Project</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[{ key: "name", placeholder: "Project name", type: "text" }, { key: "tech", placeholder: "Tech stack (comma separated)", type: "text" }, { key: "progress", placeholder: "Progress %", type: "number" }].map((f) => (
            <input key={f.key} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder} type={f.type} onKeyDown={(e) => e.key === "Enter" && addProject()}
              className="px-4 py-3 rounded-xl text-sm outline-none focus:border-blue-500/50 transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "white" }} />
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={addProject}
          className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: `linear-gradient(135deg, ${ACCENT}33, ${ACCENT}1a)`, border: `1px solid ${ACCENT}50`, color: "#93c5fd" }}>
          <Plus size={15} /> Add Project
        </motion.button>
      </motion.div>

      {/* Grid / skeleton */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: "rgba(255,255,255,0.03)" }} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {projects.map((project, i) => {
              const color = getProgressColor(project.progress);
              return (
                <motion.div key={project._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -3 }}
                  className="relative rounded-2xl p-5 group overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="absolute inset-0 rounded-2xl opacity-40 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${color}1f, transparent 60%)` }} />

                  <div className="flex items-start justify-between mb-4 relative">
                    <div className="flex items-center gap-3 min-w-0">
                      <Ring value={project.progress} color={color} />
                      <div className="min-w-0">
                        <h2 className="font-bold text-white tracking-tight mb-1 truncate">{project.name}</h2>
                        {project.tech && (
                          <div className="flex flex-wrap gap-1">
                            {project.tech.split(",").filter(Boolean).slice(0, 3).map((t) => (
                              <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>{t.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => deleteProject(project._id)} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: "#ef4444" }}>
                      <Trash2 size={15} />
                    </motion.button>
                  </div>

                  <div className="w-full h-1.5 rounded-full overflow-hidden mb-4" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.05 }}
                      className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }} />
                  </div>

                  <div className="flex items-center justify-between relative">
                    {editingId === project._id ? (
                      <div className="flex items-center gap-2">
                        <input type="number" value={editProgress} onChange={(e) => setEditProgress(e.target.value)} min="0" max="100"
                          className="w-16 px-2 py-1 text-xs rounded-lg outline-none" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "white" }} />
                        <motion.button whileHover={{ scale: 1.1 }} onClick={() => updateProgress(project._id)} className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e" }}>
                          <Check size={12} />
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button whileHover={{ scale: 1.05 }} onClick={() => { setEditingId(project._id); setEditProgress(project.progress.toString()); }}
                        className="flex items-center gap-1.5 text-xs" style={{ color: "#6b7280" }}>
                        <Pencil size={11} /> Update progress
                      </motion.button>
                    )}
                    <span className="text-[10px] text-gray-600">{project.updatedAt && project.updatedAt !== project.createdAt ? `Updated ${formatTime(project.updatedAt)}` : project.createdAt ? `Created ${formatTime(project.createdAt)}` : ""}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {!loading && projects.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-24 text-gray-600">
          <Rocket size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No projects yet — start building something 🚀</p>
        </motion.div>
      )}
    </div>
  );
}