"use client";

import { useState } from "react";
import { Plus, Trash2, ExternalLink } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Portfolio Website",
      tech: "Next.js, Tailwind",
      progress: 70,
    },
    {
      id: 2,
      name: "Client CRM Tool",
      tech: "MERN Stack",
      progress: 40,
    },
  ]);

  const [form, setForm] = useState({ name: "", tech: "", progress: "" });

  const addProject = () => {
    if (!form.name.trim()) return;

    setProjects([
      ...projects,
      {
        id: Date.now(),
        name: form.name,
        tech: form.tech,
        progress: Number(form.progress) || 0,
      },
    ]);

    setForm({ name: "", tech: "", progress: "" });
  };

  const deleteProject = (id : number) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen   text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
      </div>

      {/* Add Project */}
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Project name"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <input
          value={form.tech}
          onChange={(e) => setForm({ ...form, tech: e.target.value })}
          placeholder="Tech stack"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <input
          value={form.progress}
          onChange={(e) => setForm({ ...form, progress: e.target.value })}
          placeholder="Progress %"
          type="number"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <button
          onClick={addProject}
          className="bg-white text-black px-4 py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Project List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-gray-900 border border-gray-800 p-5 rounded-2xl"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <button
                onClick={() => deleteProject(project.id)}
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-3">{project.tech}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
              <div
                className="bg-white h-2 rounded-full"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mb-3">
              {project.progress}% completed
            </p>

            <button className="text-sm flex items-center gap-1 text-blue-400">
              View <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
