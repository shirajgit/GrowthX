"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

type Job = {
  _id: string;
  company: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "applied",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState("");

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(data);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ Smart Time
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();

    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    const time = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    if (isToday) return `Today, ${time}`;
    if (isYesterday) return `Yesterday, ${time}`;

    return `${date.toLocaleDateString()}, ${time}`;
  };

  const addJob = async () => {
    if (!form.company.trim() || !form.role.trim()) return;

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const newJob = await res.json();
    setJobs((prev) => [newJob, ...prev]);

    setForm({ company: "", role: "", status: "applied" });
  };

  const deleteJob = async (id: string) => {
    await fetch(`/api/jobs/${id}`, {
      method: "DELETE",
    });

    setJobs((prev) => prev.filter((job) => job._id !== id));
  };

  const updateStatus = async (id: string) => {
    const res = await fetch(`/api/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: editStatus }),
    });

    if (!res.ok) return;

    const updated = await res.json();

    setJobs((prev) =>
      prev.map((j) => (j._id === updated._id ? updated : j))
    );

    setEditingId(null);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-500/20 text-blue-400";
      case "interview":
        return "bg-yellow-500/20 text-yellow-400";
      case "rejected":
        return "bg-red-500/20 text-red-400";
      case "offer":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-6">
      
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8">💼 Job Applications</h1>

      {/* Input */}
      <div className="grid md:grid-cols-4 gap-3 mb-8">
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Company"
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10"
        />
        <input
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          placeholder="Role"
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10"
        >
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
          <option value="offer">Offer</option>
        </select>

        <button
          onClick={addJob}
          className="bg-white text-black px-4 py-3 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Jobs */}
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {jobs.map((job) => {
          const statusMessage = {
            applied: "Application submitted",
            interview: "Interview scheduled 🚀",
            rejected: "Not selected ❌",
            offer: "Offer received 🎉",
          };

          return (
            <div
              key={job._id}
              className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition"
            >
              {/* Top */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-base font-bold">
                    {job.company.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                      {job.company}
                    </h2>
                    <p className="text-base text-gray-400">
                      {job.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => deleteJob(job._id)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Status */}
              <div className="mb-3 flex items-center justify-between">
                {editingId === job._id ? (
                  <div className="flex gap-2">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm"
                    >
                      <option value="applied">Applied</option>
                      <option value="interview">Interview</option>
                      <option value="rejected">Rejected</option>
                      <option value="offer">Offer</option>
                    </select>
                    <button
                      onClick={() => updateStatus(job._id)}
                      className="text-green-400 text-sm"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>

                    <button
                      onClick={() => {
                        setEditingId(job._id);
                        setEditStatus(job.status);
                      }}
                      className="text-blue-400"
                    >
                      <Pencil size={14} />
                    </button>
                  </>
                )}
              </div>

              {/* Status Message */}
              <p className="text-sm text-gray-400 mb-3">
                {statusMessage[job.status as keyof typeof statusMessage]}
              </p>

              {/* Time */}
              <div className="text-sm text-gray-400 flex flex-col gap-1">
                {job.createdAt && (
                  <span>📩 Applied: {formatTime(job.createdAt)}</span>
                )}

                {job.updatedAt && (
                  <span className="text-green-400">
                    🔄 Updated: {formatTime(job.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty */}
      {jobs.length === 0 && (
        <div className="text-center mt-20 text-gray-500">
          💼 No applications yet... start applying 🚀
        </div>
      )}
    </div>
  );
}