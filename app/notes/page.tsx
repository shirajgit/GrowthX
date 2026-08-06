"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, StickyNote, NotebookPen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

const ACCENT = "#a78bfa";

const formatTime = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString([], { hour: "2-digit", minute: "2-digit", hour12: true, day: "2-digit", month: "short" });
};

const noteAccents = [
  { color: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.15)" },
  { color: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.15)" },
  { color: "#34d399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.15)" },
  { color: "#f472b6", bg: "rgba(244,114,182,0.08)", border: "rgba(244,114,182,0.15)" },
  { color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.15)" },
  { color: "#facc15", bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.15)" },
];

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);

  useEffect(() => {
    fetch("/api/notes").then((r) => r.json()).then((d) => { setNotes(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const addNote = async () => {
    if (!form.title.trim()) return;
    const res = await fetch("/api/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!res.ok) return;
    const newNote = await res.json();
    setNotes((prev) => [newNote, ...prev]);
    setForm({ title: "", content: "" });
    setComposing(false);
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  const filtered = notes.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen text-white p-4 sm:p-6" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "var(--bg-grad)" }}>
      <div className="fixed top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)" }} />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${ACCENT}40, ${ACCENT}12)`, border: `1px solid ${ACCENT}40` }}>
            <NotebookPen size={20} style={{ color: ACCENT }} />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 font-semibold">Workspace</p>
            <h1 className="text-2xl font-bold tracking-tight leading-none mt-0.5">Notes</h1>
          </div>
        </div>
        <p className="text-xs text-gray-600">{notes.length} saved</p>
      </motion.div>

      {/* Search + compose toggle */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes…"
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-violet-500/40 transition-colors"
            style={{ background: "var(--surface)", border: "1px solid var(--border-soft)", color: "var(--text)" }} />
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setComposing((c) => !c)}
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold flex-shrink-0"
          style={{ background: `${ACCENT}1f`, border: `1px solid ${ACCENT}50`, color: "#c4b5fd" }}>
          <Plus size={15} /> <span className="hidden sm:inline">New Note</span>
        </motion.button>
      </div>

      {/* Composer */}
      <AnimatePresence>
        {composing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl p-5 mb-6 overflow-hidden" style={{ background: "var(--surface)", border: `1px solid ${ACCENT}25` }}>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title…"
              className="w-full px-4 py-3 rounded-xl text-base font-semibold outline-none mb-3" style={{ background: "var(--surface-3)", border: "1px solid var(--border-strong)", color: "var(--text)" }} />
            <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write something…" rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ background: "var(--surface-3)", border: "1px solid var(--border-strong)", color: "var(--text)" }} />
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={addNote}
              className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold" style={{ background: `linear-gradient(135deg, ${ACCENT}33, ${ACCENT}1a)`, border: `1px solid ${ACCENT}50`, color: "#c4b5fd" }}>
              <Plus size={15} /> Save Note
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid / skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: "var(--surface)" }} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((note, i) => {
              const accent = noteAccents[i % noteAccents.length];
              const isExpanded = expandedId === note._id;
              const preview = note.content.length > 120 && !isExpanded ? note.content.slice(0, 120) + "…" : note.content;
              return (
                <motion.div key={note._id} layout initial={{ opacity: 0, y: 16, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }} whileHover={{ y: -3 }}
                  className="relative rounded-2xl p-5 group cursor-pointer" style={{ background: `linear-gradient(135deg, ${accent.bg} 0%, var(--surface-2) 100%)`, border: `1px solid ${accent.border}` }}
                  onClick={() => setExpandedId(isExpanded ? null : note._id)}>
                  <div className="absolute top-0 left-6 right-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent.color}40, transparent)` }} />
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: accent.color }} />
                      <h2 className="text-sm font-bold text-white leading-tight">{note.title}</h2>
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }} className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" style={{ color: "#ef4444" }}>
                      <Trash2 size={14} />
                    </motion.button>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed whitespace-pre-line mb-4">{preview}</p>
                  {note.content.length > 120 && <p className="text-[11px] font-semibold mb-3" style={{ color: accent.color }}>{isExpanded ? "Show less" : "Show more"}</p>}
                  <div className="text-[10px] text-gray-600 space-y-0.5">
                    {note.createdAt && <div>Created {formatTime(note.createdAt)}</div>}
                    {note.updatedAt && note.updatedAt !== note.createdAt && <div style={{ color: "#4ade80" }}>Updated {formatTime(note.updatedAt)}</div>}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-24 text-gray-600">
          <StickyNote size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">{search ? "No notes match your search" : "No notes yet — start writing ✍️"}</p>
        </motion.div>
      )}
    </div>
  );
}