"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, X, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Lead = {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: string;
  work: string;
  createdAt: string;
  updatedAt: string;
};

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  new: { label: "New", color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.2)" },
  contacted: { label: "Contacted", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
  converted: { label: "Converted", color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
  lost: { label: "Lost", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", status: "new", work: "" });

  useEffect(() => {
    fetch("/api/leads").then((r) => r.json()).then((d) => { setLeads(d); setLoading(false); });
  }, []);

  const addLead = async () => {
    if (!form.name.trim()) return;
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newLead = await res.json();
    setLeads((prev) => [newLead, ...prev]);
    setForm({ name: "", company: "", email: "", phone: "", status: "new", work: "" });
  };

  const deleteLead = async (id: string) => {
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setLeads((prev) => prev.filter((l) => l._id !== id));
  };

  const updateStatus = async (id: string, status: string) => {
    setLeads((prev) => prev.map((l) => l._id === id ? { ...l, status } : l));
    await fetch(`/api/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const saveLead = async () => {
    if (!editingLead) return;
    await fetch(`/api/leads/${editingLead._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingLead),
    });
    setLeads((prev) => prev.map((l) => l._id === editingLead._id ? editingLead : l));
    setEditingLead(null);
  };

  const filtered = leads.filter((lead) => {
    const matchSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || lead.status === filter;
    return matchSearch && matchFilter;
  });

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
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 font-semibold mb-1">Pipeline</p>
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <p className="text-gray-500 text-sm mt-1">{leads.length} leads in pipeline</p>
      </motion.div>

      {/* Status summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="flex flex-wrap gap-2 mb-6"
      >
        {Object.entries(statusConfig).map(([key, sc]) => {
          const count = leads.filter((l) => l.status === key).length;
          return (
            <button
              key={key}
              onClick={() => setFilter(filter === key ? "all" : key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: filter === key ? sc.bg : "rgba(255,255,255,0.04)",
                border: `1px solid ${filter === key ? sc.border : "rgba(255,255,255,0.07)"}`,
                color: filter === key ? sc.color : "#6b7280",
              }}
            >
              {sc.label} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Add Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="rounded-2xl p-5 mb-6"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-4">Add Lead</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { key: "name", placeholder: "Name" },
            { key: "company", placeholder: "Company" },
            { key: "email", placeholder: "Email" },
            { key: "phone", placeholder: "Phone" },
            { key: "work", placeholder: "Work type" },
          ].map((f) => (
            <input
              key={f.key}
              value={(form as any)[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="px-4 py-3 rounded-xl text-sm outline-none col-span-1"
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
              <option key={key} value={key}>{sc.label}</option>
            ))}
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={addLead}
          className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.1))",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#fca5a5",
          }}
        >
          <Plus size={15} /> Add Lead
        </motion.button>
      </motion.div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leads…"
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "white",
          }}
        />
      </div>

      {/* Desktop Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="hidden md:block rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Lead", "Company", "Email", "Work", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-[11px] tracking-[0.15em] uppercase text-gray-600 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((lead, i) => {
                const sc = statusConfig[lead.status] || statusConfig.new;
                return (
                  <motion.tr
                    key={lead._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group hover:bg-white/[0.02] transition-colors"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: sc.bg, color: sc.color }}>
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium">{lead.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{lead.company}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{lead.email}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{lead.work}</td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold outline-none cursor-pointer"
                        style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}
                      >
                        {Object.entries(statusConfig).map(([key, s]) => (
                          <option key={key} value={key}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setEditingLead(lead)} className="text-xs text-blue-400 hover:text-blue-300">Edit</button>
                        <a href={`https://wa.me/${lead.phone || ""}`} target="_blank" className="text-xs text-green-400 hover:text-green-300">WA</a>
                        <button onClick={() => deleteLead(lead._id)} style={{ color: "#ef4444" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.map((lead, i) => {
          const sc = statusConfig[lead.status] || statusConfig.new;
          return (
            <motion.div
              key={lead._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">{lead.name}</p>
                  <p className="text-xs text-gray-500">{lead.company} · {lead.work}</p>
                </div>
                <button onClick={() => deleteLead(lead._id)} style={{ color: "#ef4444" }}><Trash2 size={14} /></button>
              </div>
              <p className="text-xs text-gray-600 mb-3">{lead.email}</p>
              <div className="flex items-center justify-between">
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead._id, e.target.value)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold outline-none"
                  style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color }}
                >
                  {Object.entries(statusConfig).map(([key, s]) => (
                    <option key={key} value={key}>{s.label}</option>
                  ))}
                </select>
                <a href={`https://wa.me/${lead.phone || ""}`} target="_blank" className="text-xs text-green-400">WhatsApp</a>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && !loading && (
        <div className="text-center mt-20 text-gray-600">
          <Flame size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No leads found</p>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setEditingLead(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl p-6 relative"
              style={{ background: "#111", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-white">Edit Lead</h2>
                <button onClick={() => setEditingLead(null)} className="text-gray-600 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {(["name", "company", "email", "phone", "work"] as const).map((f) => (
                  <input
                    key={f}
                    value={editingLead[f] || ""}
                    onChange={(e) => setEditingLead({ ...editingLead, [f]: e.target.value })}
                    placeholder={f}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "white" }}
                  />
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={saveLead}
                className="w-full mt-4 py-3 rounded-xl font-semibold text-sm"
                style={{ background: "white", color: "black" }}
              >
                Save Changes
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
