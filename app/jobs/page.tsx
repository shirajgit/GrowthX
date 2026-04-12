"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, Check, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Job = {
  _id: string;
  company: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; message: string; emoji: string }> = {
  applied: { label: "Applied", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)", message: "Application submitted", emoji: "📩" },
  interview: { label: "Interview", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", message: "Interview scheduled", emoji: "🚀" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", message: "Not selected", emoji: "❌" },
  offer: { label: "Offer!", color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)", message: "Offer received", emoji: "🎉" },
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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({ company: "", role: "", status: "applied" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    fetch("/api/jobs").then((r) => r.json()).then(setJobs);
  }, []);

  const addJob = async () => {
    if (!form.company.trim() || !form.role.trim()) return;
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newJob = await res.json();
    setJobs((prev) => [newJob, ...prev]);
    setForm({ company: "", role: "", status: "applied" });
  };

  const deleteJob = async (id: string) => {
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((j) => j._id !== id));
  };

  const updateStatus = async (id: string) => {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: editStatus }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setJobs((prev) => prev.map((j) => (j._id === updated._id ? updated : j)));
    setEditingId(null);
  };

  const counts = Object.keys(statusConfig).reduce((acc, key) => {
    acc[key] = jobs.filter((j) => j.status === key).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div
      className="min-h-screen text-white p-4 sm:p-6"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(160deg, #080808 0%, #0f0f13 50%, #0a0a10 100%)",
      }}
    >
      {/* Ambient */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 font-semibold mb-1">Career</p>
        <h1 className="text-2xl font-bold tracking-tight">Job Applications</h1>
        <p className="text-gray-500 text-sm mt-1">{jobs.length} applications tracked</p>
      </motion.div>

      {/* Status Pills Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {Object.entries(statusConfig).map(([key, sc]) => (
          <div
            key={key}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}
          >
            {sc.emoji} {sc.label} <span className="opacity-60">· {counts[key]}</span>
          </div>
        ))}
      </motion.div>

      {/* Add Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-2xl p-5 mb-6"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-4">New Application</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { key: "company", placeholder: "Company name" },
            { key: "role", placeholder: "Role / Position" },
          ].map((f) => (
            <input
              key={f.key}
              value={(form as any)[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              onKeyDown={(e) => e.key === "Enter" && addJob()}
              className="px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "white",
              }}
            />
          ))}
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="px-4 py-3 rounded-xl text-sm outline-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "white",
            }}
          >
            {Object.entries(statusConfig).map(([key, sc]) => (
              <option key={key} value={key}>{sc.emoji} {sc.label}</option>
            ))}
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={addJob}
          className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(245,158,11,0.1))",
            border: "1px solid rgba(245,158,11,0.3)",
            color: "#fcd34d",
          }}
        >
          <Plus size={15} /> Add Application
        </motion.button>
      </motion.div>

      {/* Job Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {jobs.map((job, i) => {
            const sc = statusConfig[job.status] || statusConfig.applied;
            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-2xl p-5 group"
                style={{
                  background: `linear-gradient(135deg, ${sc.bg} 0%, rgba(255,255,255,0.02) 100%)`,
                  border: `1px solid ${sc.border}`,
                }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                      style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}
                    >
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h2 className="font-bold text-white tracking-tight">{job.company}</h2>
                      <p className="text-xs text-gray-500 mt-0.5">{job.role}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => deleteJob(job._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "#ef4444" }}
                  >
                    <Trash2 size={15} />
                  </motion.button>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between mb-3">
                  {editingId === job._id ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="px-2 py-1 text-xs rounded-lg outline-none"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                      >
                        {Object.entries(statusConfig).map(([key, s]) => (
                          <option key={key} value={key}>{s.emoji} {s.label}</option>
                        ))}
                      </select>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => updateStatus(job._id)}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(34,197,94,0.2)", color: "#22c55e" }}
                      >
                        <Check size={12} />
                      </motion.button>
                    </div>
                  ) : (
                    <>
                      <span
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}
                      >
                        {sc.emoji} {sc.label}
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => { setEditingId(job._id); setEditStatus(job.status); }}
                        style={{ color: "#60a5fa" }}
                      >
                        <Pencil size={13} />
                      </motion.button>
                    </>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-3">{sc.message}</p>

                <div className="text-[11px] text-gray-600 space-y-0.5">
                  {job.createdAt && <div>Applied: {formatTime(job.createdAt)}</div>}
                  {job.updatedAt && job.updatedAt !== job.createdAt && (
                    <div style={{ color: "#4ade80" }}>Updated: {formatTime(job.updatedAt)}</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {jobs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-24 text-gray-600"
        >
          <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No applications yet — start applying 🚀</p>
        </motion.div>
      )}
    </div>
  );
}
