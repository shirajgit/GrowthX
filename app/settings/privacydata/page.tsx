"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, Download, Trash2, Eye, Lock, Server,
  Globe, Bell, Check, ChevronRight, AlertTriangle,
  Database, FileText, X, Loader2,
} from "lucide-react";

type ToggleSetting = {
  id: string;
  label: string;
  sub: string;
  value: boolean;
};

const dataCategories = [
  { icon: FileText, label: "Tasks & Notes", sub: "All tasks, notes, and their timestamps", color: "#34d399", size: "~12 KB" },
  { icon: Server, label: "Projects & Jobs", sub: "Project names, progress, job applications", color: "#3b82f6", size: "~8 KB" },
  { icon: Globe, label: "Clients & Leads", sub: "Contact info, companies, statuses", color: "#ec4899", size: "~15 KB" },
  { icon: Database, label: "Settings & Profile", sub: "Display name, theme, preferences", color: "#a78bfa", size: "~2 KB" },
];

const privacyPolicySections = [
  {
    title: "What we collect",
    body: "GrowthX collects only the data you explicitly enter: tasks, projects, notes, clients, leads, job applications, and your account preferences. We do not collect browsing history, device fingerprints, or third-party behavioral data.",
  },
  {
    title: "How we use it",
    body: "Your data is used exclusively to power your GrowthX workspace and generate AI-driven insights within the app. We do not sell, rent, or share your data with advertising networks or data brokers.",
  },
  {
    title: "Data storage",
    body: "All data is stored in MongoDB Atlas on servers in your region. Data is encrypted at rest (AES-256) and in transit (TLS 1.3). Backups are taken daily and retained for 30 days.",
  },
  {
    title: "Authentication",
    body: "Authentication is handled by Clerk, a SOC 2 Type II certified provider. GrowthX never stores your password. Session tokens are short-lived and rotated automatically.",
  },
  {
    title: "AI & third parties",
    body: "AI features use the Anthropic API. Only the specific prompt and minimal workspace context needed to answer your query is sent. No conversation history is retained by Anthropic beyond the current request.",
  },
  {
    title: "Your rights",
    body: "You have the right to access, correct, export, or delete all your data at any time. Submit a data request or delete your account directly from this page.",
  },
];

function ToggleRow({
  setting,
  onChange,
}: {
  setting: ToggleSetting;
  onChange: (id: string, val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-[13.5px] font-medium text-white">{setting.label}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{setting.sub}</p>
      </div>
      <motion.button
        onClick={() => onChange(setting.id, !setting.value)}
        className="relative w-11 h-6 rounded-full flex-shrink-0 transition-colors duration-200"
        style={{
          background: setting.value
            ? "linear-gradient(135deg, rgba(139,92,246,0.6), rgba(59,130,246,0.5))"
            : "rgba(255,255,255,0.08)",
          border: `1px solid ${setting.value ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.1)"}`,
        }}
      >
        <motion.div
          animate={{ x: setting.value ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="absolute top-0.5 w-4 h-4 rounded-full"
          style={{ background: setting.value ? "white" : "#444" }}
        />
      </motion.button>
    </div>
  );
}

export default function PrivacyDataPage() {
  const [privacySettings, setPrivacySettings] = useState<ToggleSetting[]>([
    { id: "analytics", label: "Usage Analytics", sub: "Help us improve GrowthX with anonymous usage data", value: true },
    { id: "ai_context", label: "AI Context Memory", sub: "Allow AI to use workspace data for better suggestions", value: true },
    { id: "crash_reports", label: "Crash Reports", sub: "Automatically send error reports to our team", value: false },
    { id: "marketing", label: "Product Updates", sub: "Receive emails about new features and improvements", value: true },
  ]);

  const [exporting, setExporting] = useState(false);
  const [exported, setExported] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const toggleSetting = (id: string, val: boolean) => {
    setPrivacySettings((prev) => prev.map((s) => (s.id === id ? { ...s, value: val } : s)));
  };

  const handleExport = async () => {
    setExporting(true);
    // Fetch all data from APIs
    try {
      const [tasks, projects, jobs, clients, leads, notes] = await Promise.all([
        fetch("/api/tasks").then((r) => r.json()).catch(() => []),
        fetch("/api/projects").then((r) => r.json()).catch(() => []),
        fetch("/api/jobs").then((r) => r.json()).catch(() => []),
        fetch("/api/clients").then((r) => r.json()).catch(() => []),
        fetch("/api/leads").then((r) => r.json()).catch(() => []),
        fetch("/api/notes").then((r) => r.json()).catch(() => []),
      ]);

      const exportData = {
        exported_at: new Date().toISOString(),
        app: "GrowthX",
        data: { tasks, projects, jobs, clients, leads, notes },
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `growthx-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExported(true);
      setTimeout(() => setExported(false), 3000);
    } catch {
      console.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(160deg, #080808 0%, #0f0f13 50%, #0a0a10 100%)",
      }}
    >
      {/* Ambient */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)" }} />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.03) 0%, transparent 70%)" }} />

      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 font-semibold mb-2">Legal & Security</p>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.15))",
                border: "1px solid rgba(99,102,241,0.3)",
                boxShadow: "0 0 20px rgba(99,102,241,0.15)",
              }}>
              <Shield size={18} style={{ color: "#818cf8" }} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Privacy & Data</h1>
          </div>
          <p className="text-gray-500 text-sm">Control your data, privacy preferences, and account deletion.</p>
        </motion.div>

        {/* Privacy controls */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-5"
        >
          <p className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-gray-600 px-1 mb-2">Privacy Controls</p>
          <div className="rounded-2xl overflow-hidden divide-y"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
       
            }}>
            {privacySettings.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12 + i * 0.05 }}
                style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
              >
                <ToggleRow setting={s} onChange={toggleSetting} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Your data */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-5"
        >
          <p className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-gray-600 px-1 mb-2">Your Data</p>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="p-4 grid grid-cols-2 gap-2">
              {dataCategories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.24 + i * 0.06 }}
                    className="flex items-start gap-3 p-3 rounded-xl"
                    style={{
                      background: `${cat.color}0a`,
                      border: `1px solid ${cat.color}18`,
                    }}
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cat.color}18` }}>
                      <Icon size={13} style={{ color: cat.color }} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white leading-none mb-0.5">{cat.label}</p>
                      <p className="text-[10px] text-gray-600 leading-snug">{cat.sub}</p>
                      <p className="text-[10px] mt-1 font-medium" style={{ color: cat.color }}>{cat.size}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="px-4 pb-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExport}
                disabled={exporting}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: exported
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(255,255,255,0.05)",
                  border: `1px solid ${exported ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.1)"}`,
                  color: exported ? "#4ade80" : "white",
                }}
              >
                {exporting ? (
                  <><Loader2 size={15} className="animate-spin" /> Preparing export…</>
                ) : exported ? (
                  <><Check size={15} /> Downloaded!</>
                ) : (
                  <><Download size={15} /> Export All My Data (.json)</>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Security info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <p className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-gray-600 px-1 mb-2">Security</p>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { icon: Lock, label: "End-to-end encryption", sub: "AES-256 at rest · TLS 1.3 in transit", color: "#34d399", badge: "Active" },
              { icon: Eye, label: "Two-factor authentication", sub: "Managed via your Clerk account", color: "#60a5fa", badge: "Via Clerk" },
              { icon: Server, label: "Data residency", sub: "MongoDB Atlas · Regional servers", color: "#a78bfa", badge: "Compliant" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-4 px-4 py-3.5"
                  style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${item.color}18`, border: `1px solid ${item.color}25` }}>
                    <Icon size={15} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-white">{item.label}</p>
                    <p className="text-[11px] text-gray-500">{item.sub}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}25`,
                      color: item.color,
                    }}>
                    {item.badge}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Privacy policy summary */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="mb-5"
        >
          <p className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-gray-600 px-1 mb-2">Privacy Policy Summary</p>
          <div className="rounded-2xl p-5 space-y-4"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            {privacyPolicySections.map((section, i) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.42 + i * 0.05 }}
              >
                <p className="text-xs font-bold text-white mb-1">{section.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{section.body}</p>
                {i < privacyPolicySections.length - 1 && (
                  <div className="mt-4 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />
                )}
              </motion.div>
            ))}
            <div className="pt-2">
              <button className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: "#818cf8" }}>
                Read full Privacy Policy <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-red-900 px-1 mb-2">Danger Zone</p>
          <div className="rounded-2xl p-5"
            style={{
              background: "rgba(239,68,68,0.04)",
              border: "1px solid rgba(239,68,68,0.15)",
            }}>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#ef4444" }} />
              <div>
                <p className="text-sm font-bold text-white">Delete Account & All Data</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  This permanently deletes your account, all tasks, projects, notes, clients, leads, jobs, and settings. This action cannot be undone.
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#ef4444",
              }}
            >
              <Trash2 size={14} /> Delete My Account
            </motion.button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-[11px] text-gray-700 mt-10 tracking-wide"
        >
          GrowthX · Last updated April 2025 · GDPR & CCPA compliant
        </motion.p>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl p-6 relative"
              style={{
                background: "#0e0e14",
                border: "1px solid rgba(239,68,68,0.2)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              }}
            >
              <button
                onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
                className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>

              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <AlertTriangle size={18} style={{ color: "#ef4444" }} />
              </div>

              <h2 className="text-lg font-bold text-white mb-1">Delete everything?</h2>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Type <span className="font-mono text-red-400 text-xs px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(239,68,68,0.1)" }}>DELETE</span> to confirm. This is permanent.
              </p>

              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none mb-4 font-mono"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${deleteConfirm === "DELETE" ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.08)"}`,
                  color: deleteConfirm === "DELETE" ? "#ef4444" : "white",
                }}
              />

              <div className="flex gap-2">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#888" }}
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={deleteConfirm === "DELETE" ? { scale: 1.02 } : {}}
                  whileTap={deleteConfirm === "DELETE" ? { scale: 0.97 } : {}}
                  disabled={deleteConfirm !== "DELETE" || deleting}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: deleteConfirm === "DELETE" ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${deleteConfirm === "DELETE" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
                    color: deleteConfirm === "DELETE" ? "#ef4444" : "#333",
                    cursor: deleteConfirm === "DELETE" ? "pointer" : "not-allowed",
                  }}
                >
                  {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  {deleting ? "Deleting…" : "Delete Account"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}