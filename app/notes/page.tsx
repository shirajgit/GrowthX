"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

type Note = {
  _id: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [form, setForm] = useState({ title: "", content: "" });

  const fetchNotes = async () => {
    const res = await fetch("/api/notes");
    if (!res.ok) return;

    const data = await res.json();
    setNotes(data);
  };

useEffect(() => {
    (async () => {
      await fetchNotes();
    })();
  }, []);

  // ✅ Smart Time
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      day: "2-digit",
      month: "short",
    });
  };

  const addNote = async () => {
    if (!form.title.trim()) return;

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!res.ok) return;

    const newNote = await res.json();

    setNotes((prev) => [newNote, ...prev]);
    setForm({ title: "", content: "" });
  };

  const deleteNote = async (id: string) => {
    await fetch(`/api/notes/${id}`, {
      method: "DELETE",
    });

    setNotes((prev) => prev.filter((n) => n._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-4 sm:p-6">
      <h1 className="text-3xl mt-1 lg:mt-1 font-bold mb-8">📝 Notes</h1>

      {/* Add Note */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title"
          className="px-4 py-2 text-2xl rounded-2xl bg-gray-900 border border-gray-700  "
        />

        <textarea
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
          placeholder="Write your note..."
          className="px-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 h-28 text-base"
        />

        <button
          onClick={addNote}
          className="bg-white font-bold text-black py-1 rounded-2xl w-50 h-15 col-span-full hover:scale-105 transition"
        >
           +Add Note
        </button>
      </div>

      {/* Notes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:bg-gray-800/60 transition"
          >
            {/* Top */}
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-lg font-semibold tracking-tight">
                {note.title}
              </h2>

              <button
                onClick={() => deleteNote(note._id)}
                className="text-red-500 hover:scale-110 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Content */}
            <p className="text-sm text-gray-400 whitespace-pre-line mb-3 leading-relaxed">
              {note.content}
            </p>

            {/* Time */}
            <div className="text-xs text-gray-500">
              {note.createdAt && (
                <div>🕒 {formatTime(note.createdAt)}</div>
              )}
              {note.updatedAt && (
                <div className="text-green-400">
                  ✏️ {formatTime(note.updatedAt)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty */}
      {notes.length === 0 && (
        <div className="text-center mt-20 text-gray-500">
          📝 No notes yet... start writing ✍️
        </div>
      )}
    </div>
  );
}