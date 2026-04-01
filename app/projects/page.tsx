"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ExternalLink, Pencil } from "lucide-react";

type Project = {
  _id: string;
  name: string;
  tech: string;
  progress: number;
  createdAt?: string;
  updatedAt?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    name: "",
    tech: "",
    progress: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editProgress, setEditProgress] = useState("");

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  };

 useEffect(() => {
    (async () => {
      await fetchProjects();
    })();
  }, []);

  // ✅ Time formatter
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

  const addProject = async () => {
    if (!form.name.trim()) return;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        tech: form.tech,
        progress: Number(form.progress) || 0,
      }),
    });

    const newProject = await res.json();
    setProjects((prev) => [newProject, ...prev]);

    setForm({ name: "", tech: "", progress: "" });
  };

  const updateProgress = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progress: Number(editProgress),
      }),
    });

    const updated = await res.json();

    setProjects((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p))
    );

    setEditingId(null);
    setEditProgress("");
  };

  const deleteProject = async (id: string) => {
    await fetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-6">
      
      {/* Header */}
      <div className="flex mt-12 lg:mt-1 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          🚀 Projects
        </h1>
      </div>

      {/* Input */}
      <div className="grid md:grid-cols-4 gap-3 mb-8">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Project name"
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-white/20 outline-none"
        />
        <input
          value={form.tech}
          onChange={(e) => setForm({ ...form, tech: e.target.value })}
          placeholder="Tech stack"
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-white/20 outline-none"
        />
        <input
          value={form.progress}
          onChange={(e) =>
            setForm({ ...form, progress: e.target.value })
          }
          placeholder="Progress %"
          type="number"
          className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-white/20 outline-none"
        />
        <button
          onClick={addProject}
          className="bg-white text-black px-4 py-3 rounded-2xl flex items-center justify-center gap-2 font-medium hover:scale-105 active:scale-95 transition"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Projects */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <div
            key={project._id}
            className="group bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all duration-300"
          >
            {/* Top */}
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold">
                {project.name}
              </h2>

              <button
                onClick={() => deleteProject(project._id)}
                className="text-red-500 opacity-70 hover:opacity-100 hover:scale-110 transition"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Tech */}
            <p className="text-sm text-gray-400 mb-4">
              {project.tech}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-white to-gray-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            {/* ✏️ Editable Progress */}
            <div className="flex items-center justify-between mb-3">
              {editingId === project._id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={editProgress}
                    onChange={(e) => setEditProgress(e.target.value)}
                    className="w-16 px-2 py-1 text-sm rounded bg-gray-800 border border-gray-600"
                  />
                  <button
                    onClick={() => updateProgress(project._id)}
                    className="text-green-400 text-xs"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-gray-400">
                    {project.progress}% completed
                  </p>

                  <button
                    onClick={() => {
                      setEditingId(project._id);
                      setEditProgress(project.progress.toString());
                    }}
                    className="text-blue-400 hover:scale-110 transition"
                  >
                    <Pencil size={14} />
                  </button>
                </>
              )}
            </div>

            {/* Time Info */}
            <div className="text-xs text-gray-400 flex flex-col gap-1 mb-3">
              {project.createdAt && (
                <span>🕒 {formatTime(project.createdAt)}</span>
              )}

              {project.updatedAt && (
                <span className="text-green-400">
                  ✏️ {formatTime(project.updatedAt)}
                </span>
              )}
            </div>

            {/* Action */}
            <button className="text-sm flex items-center gap-1 text-blue-400 hover:underline">
              View <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center mt-20 text-gray-500">
          🚀 No projects yet... start building something amazing
        </div>
      )}
    </div>
  );
}