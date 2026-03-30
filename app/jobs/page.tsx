"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function JobsPage() {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      company: "Google",
      role: "Frontend Developer",
      status: "applied",
    },
    {
      id: 2,
      company: "Amazon",
      role: "Full Stack Developer",
      status: "interview",
    },
  ]);

  const [form, setForm] = useState({
    company: "",
    role: "",
    status: "applied",
  });

  const addJob = () => {
    if (!form.company.trim() || !form.role.trim()) return;

    setJobs([
      ...jobs,
      {
        id: Date.now(),
        company: form.company,
        role: form.role,
        status: form.status,
      },
    ]);

    setForm({ company: "", role: "", status: "applied" });
  };

  const deleteJob = (id : number) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const statusColor = (status : string) => {
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
    <div className="min-h-screen  text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Applications</h1>
      </div>

      {/* Add Job */}
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Company"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <input
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          placeholder="Role"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        >
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="rejected">Rejected</option>
          <option value="offer">Offer</option>
        </select>
        <button
          onClick={addJob}
          className="bg-white text-black px-4 py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Jobs Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="text-left p-4">Company</th>
              <th className="text-left p-4">Role</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-t border-gray-800">
                <td className="p-4">{job.company}</td>
                <td className="p-4">{job.role}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusColor(
                      job.status
                    )}`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteJob(job.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}