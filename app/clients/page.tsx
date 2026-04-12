"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Client = {
  _id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  active: { label: "Active", color: "#22c55e", bg: "rgba(34,197,94,0.1)", dot: "#22c55e" },
  pending: { label: "Pending", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", dot: "#f59e0b" },
  inactive: { label: "Inactive", color: "#6b7280", bg: "rgba(107,114,128,0.1)", dot: "#6b7280" },
};

const formatTime = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString([], {
    hour: "2-digit", minute: "2-digit", hour12: true,
    day: "2-digit", month: "short",
  });
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", company: "", email: "", status: "active" });
  const [adding, setAdding] = useState(false);

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => { fetchClients(); }, []);

  const addClient = async () => {
    if (!form.name.trim()) return;
    setAdding(true);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const newClient = await res.json();
    setClients((prev) => [newClient, ...prev]);
    setForm({ name: "", company: "", email: "", status: "active" });
    setAdding(false);
  };

  const deleteClient = async (id: string) => {
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    setClients((prev) => prev.filter((c) => c._id !== id));
  };

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

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
        style={{ background: "radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 font-semibold mb-1">CRM</p>
        <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
        <p className="text-gray-500 text-sm mt-1">{clients.length} total clients</p>
      </motion.div>

      {/* Add Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 mb-6"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-[11px] tracking-[0.2em] uppercase text-gray-600 font-semibold mb-4">Add Client</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: "name", placeholder: "Full name" },
            { key: "company", placeholder: "Company" },
            { key: "email", placeholder: "Email address" },
          ].map((f) => (
            <input
              key={f.key}
              value={(form as any)[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "white",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(236,72,153,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
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
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={addClient}
          disabled={adding}
          className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, rgba(236,72,153,0.2), rgba(236,72,153,0.1))",
            border: "1px solid rgba(236,72,153,0.3)",
            color: "#f9a8d4",
          }}
        >
          <Plus size={15} /> {adding ? "Adding…" : "Add Client"}
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mb-5"
      >
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clients…"
          className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            color: "white",
          }}
        />
      </motion.div>

      {/* Desktop Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="hidden md:block rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              {["Client", "Company", "Email", "Status", "Added", ""].map((h) => (
                <th key={h} className="text-left px-5 py-3.5 text-[11px] tracking-[0.15em] uppercase text-gray-600 font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((client, i) => {
                const sc = statusConfig[client.status] || statusConfig.inactive;
                return (
                  <motion.tr
                    key={client._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: `${sc.color}20`, color: sc.color }}
                        >
                          {client.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400">{client.company}</td>
                    <td className="px-5 py-4 text-gray-500 text-xs">{client.email}</td>
                    <td className="px-5 py-4">
                      <span
                        className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-600">{formatTime(client.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteClient(client._id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "#ef4444" }}
                      >
                        <Trash2 size={15} />
                      </motion.button>
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
        <AnimatePresence>
          {filtered.map((client, i) => {
            const sc = statusConfig[client.status] || statusConfig.inactive;
            return (
              <motion.div
                key={client._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl p-4"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{ background: `${sc.color}20`, color: sc.color }}>
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.company}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteClient(client._id)} style={{ color: "#ef4444" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-3">{client.email}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: sc.bg, color: sc.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }} />
                    {sc.label}
                  </span>
                  <span className="text-xs text-gray-600">{formatTime(client.createdAt)}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center mt-20 text-gray-600 text-sm">No clients found</div>
      )}
    </div>
  );
}
