"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle, Circle } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Build dashboard UI", done: false },
    { id: 2, title: "Apply to 3 jobs", done: false },
    { id: 3, title: "Client follow-up", done: true },
  ]);

  const [input, setInput] = useState("");

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([
      ...tasks,
      { id: Date.now(), title: input, done: false },
    ]);
    setInput("");
  };

  const toggleTask = (id : number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  };

  const deleteTask = (id : number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen   text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tasks</h1>
      </div>

      {/* Add Task */}
      <div className="flex gap-3 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <button
          onClick={addTask}
          className="bg-white text-black px-4 py-3 rounded-xl flex items-center gap-2"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between bg-gray-900 border border-gray-800 p-4 rounded-xl"
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => toggleTask(task.id)}
            >
              {task.done ? (
                <CheckCircle className="text-green-500" />
              ) : (
                <Circle className="text-gray-500" />
              )}

              <span
                className={`$${
                  task.done ? "line-through text-gray-500" : ""
                }`}
              >
                {task.title}
              </span>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:text-red-400"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
