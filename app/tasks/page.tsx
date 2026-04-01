"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";

type Task = {
  _id: string;
  title: string;
  status: "todo" | "done";
  createdAt?: string;
  updatedAt?: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

 useEffect(() => {
    (async () => {
      await fetchTasks();
    })();
  }, []);

  // ✅ Smart Time Formatter
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

  const addTask = async () => {
    if (!input.trim()) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: input,
        status: "todo",
      }),
    });

    const newTask = await res.json();
    setTasks((prev) => [newTask, ...prev]);
    setInput("");
  };

  const toggleTask = async (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done";

    const res = await fetch(`/api/${task._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    });

    const updated = await res.json();

    setTasks((prev) =>
      prev.map((t) => (t._id === updated._id ? updated : t))
    );
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/${id}`, {
      method: "DELETE",
    });

    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-6">
      
      {/* Header */}
      <div className="flex mt-12 lg:mt-1 justify-between items-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          🧠 Tasks Manager
        </h1>
      </div>

      {/* Input */}
      <div className="flex gap-3 mb-8">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What's on your mind..."
          className="flex-1 px-5 py-3 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition"
        />
        <button
          onClick={addTask}
          className="bg-white text-black px-5 py-3 rounded-2xl flex items-center gap-2 font-medium hover:scale-105 active:scale-95 transition"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Tasks */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="group flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all duration-300"
          >
            {/* Left */}
            <div
              className="flex items-center gap-4 cursor-pointer"
              onClick={() => toggleTask(task)}
            >
              {task.status === "done" ? (
                <CheckCircle className="text-green-400 group-hover:scale-110 transition" />
              ) : (
                <Circle className="text-gray-500 group-hover:text-white transition" />
              )}

              <div className="flex flex-col">
                <span
                  className={`text-lg ${
                    task.status === "done"
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >
                  {task.title}
                </span>

                <div className="text-xs text-gray-400 mt-1 flex gap-3">
                  {task.createdAt && (
                    <span>
                      🕒 {formatTime(task.createdAt)}
                    </span>
                  )}

                  {task.updatedAt && task.status === "done" && (
                    <span className="text-green-400">
                      ✅ {formatTime(task.updatedAt)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Delete */}
            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-500 opacity-70 hover:opacity-100 hover:scale-110 transition"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center mt-20 text-gray-500">
          No tasks yet... start adding 🚀
        </div>
      )}
    </div>
  );
}