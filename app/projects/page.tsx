"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, ExternalLink, Check, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Project = {
  _id: string;
  name: string;
  tech: string;
  progress: number;
  createdAt?: string;
  updatedAt?: string;
};

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

const getProgressColor = (progress: number) => {
  if (progress >= 80) return { color: "#22c55e", bg: "rgba(34,197,94,0.15)" };
  if (progress >= 50) return { color: "#3b82f6", bg: "rgba(59,130,246,0.15)" };
  if (progress >= 25) return { color: "#f59e0b", bg: "rgba(245,158,11,0.15)" };
  return { color: "#6b7280", bg: "rgba(107,114,128,0.15)" };
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({ name: "", tech: "", progress: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState("");

  useEffect(() => {
    fetch("/api/projects").then((r) => r.json()).then(setProjects);
  }, []);

  const addProject = async () => {
    if (!form.name.trim()) return;
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, tech: form.tech, progress: Number(form.progress) || 0 }),
    });
    const newProject = await res.json();
    setProjects((prev) => [newProject, ...prev]);
    setForm({ name: "", tech: "", progress: "" });
  };

  const updateProgress = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
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

  const avgProgress = projects.length
    ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
    : 0;

  return (
    <div
      className="min-h-screen text-white p-4 sm:p-6"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(160deg, #080808 0%, #0f0f13 50%, #0a0a10 100%)",
      }}
    >
      {/* Ambient */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 font-semibold mb-1">Build</p>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-gray-500 text-sm mt-1">
          {projects.length} projects · avg {avgProgress}% complete
        </p>
      </motion.div>

      {/* Add Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 mb-6"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-4">New Project</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { key: "name", placeholder: "Project name", type: "text" },
            { key: "tech", placeholder: "Tech stack", type: "text" },
            { key: "progress", placeholder: "Progress %", type: "number" },
          ].map((f) => (
            <input
              key={f.key}
              value={(form as any)[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              type={f.type}
              onKeyDown={(e) => e.key === "Enter" && addProject()}
              className="px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "white",
              }}
            />
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={addProject}
          className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.1))",
            border: "1px solid rgba(59,130,246,0.3)",
            color: "#93c5fd",
          }}
        >
          <Plus size={15} /> Add Project
        </motion.button>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {projects.map((project, i) => {
            const pc = getProgressColor(project.progress);
            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-2xl p-5 group"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Progress glow bg */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-30 pointer-events-none transition-all duration-500"
                  style={{
                    background: `radial-gradient(circle at top right, ${pc.color}20, transparent 60%)`,
                  }}
                />

                {/* Top */}
                <div className="flex items-start justify-between mb-3 relative">
                  <div>
                    <h2 className="font-bold text-white tracking-tight mb-0.5">{project.name}</h2>
                    {project.tech && (
                      <div className="flex flex-wrap gap-1">
                        {project.tech.split(",").map((t) => (
                          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(255,255,255,0.06)", color: "#94a3b8" }}>
                            {t.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => deleteProject(project._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#ef4444" }}
                  >
                    <Trash2 size={15} />
                  </motion.button>
                </div>

                {/* Progress */}
                <div className="relative my-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-gray-600 uppercase tracking-widest">Progress</span>
                    <span className="text-xs font-bold" style={{ color: pc.color }}>{project.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.06 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${pc.color}80, ${pc.color})` }}
                    />
                  </div>
                </div>

                {/* Editable Progress */}
                <div className="flex items-center justify-between mb-3">
                  {editingId === project._id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={editProgress}
                        onChange={(e) => setEditProgress(e.target.value)}
                        className="w-16 px-2 py-1 text-xs rounded-lg outline-none"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "white" }}
                        min="0" max="100"
                      />
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => updateProgress(project._id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e" }}
                      >
                        <Check size={12} />
                      </motion.button>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => { setEditingId(project._id); setEditProgress(project.progress.toString()); }}
                      className="flex items-center gap-1.5 text-xs transition-colors"
                      style={{ color: "#4b5563" }}
                    >
                      <Pencil size={11} /> Update progress
                    </motion.button>
                  )}
                  <button className="flex items-center gap-1 text-xs" style={{ color: "#3b82f6" }}>
                    View <ExternalLink size={11} />
                  </button>
                </div>

                {/* Time */}
                <div className="text-[10px] text-gray-600 space-y-0.5">
                  {project.createdAt && <div>Created {formatTime(project.createdAt)}</div>}
                  {project.updatedAt && project.updatedAt !== project.createdAt && (
                    <div style={{ color: "#4ade80" }}>Updated {formatTime(project.updatedAt)}</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {projects.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-24 text-gray-600">
          <Rocket size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No projects yet — start building something 🚀</p>
        </motion.div>
      )}
    </div>
  );
}
