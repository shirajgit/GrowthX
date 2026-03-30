"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function NotesPage() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Startup Idea",
      content: "Build a personal productivity SaaS",
    },
    {
      id: 2,
      title: "Learning",
      content: "Revise Next.js API routes and MongoDB",
    },
  ]);

  const [form, setForm] = useState({ title: "", content: "" });

  const addNote = () => {
    if (!form.title.trim()) return;

    setNotes([
      ...notes,
      {
        id: Date.now(),
        title: form.title,
        content: form.content,
      },
    ]);

    setForm({ title: "", content: "" });
  };

  const deleteNote = (id :number) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  return (
    <div className="min-h-screen text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notes</h1>
      </div>

      {/* Add Note */}
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Write your note..."
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 h-24"
        />

        <button
          onClick={addNote}
          className="bg-white text-black px-4 py-3 rounded-xl flex items-center justify-center gap-2 col-span-full"
        >
          <Plus size={18} /> Add Note
        </button>
      </div>

      {/* Notes Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-gray-900 border border-gray-800 p-5 rounded-2xl"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-semibold">{note.title}</h2>
              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <p className="text-sm text-gray-400 whitespace-pre-line">
              {note.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}