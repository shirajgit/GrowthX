"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

type Client = {
  _id: string;
  name: string;
  company: string;
  email: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    status: "active",
  });

  const fetchClients = async () => {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // ✅ Smart Time (AM/PM)
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

  const addClient = async () => {
    if (!form.name.trim()) return;

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const newClient = await res.json();

    setClients((prev) => [newClient, ...prev]);

    setForm({ name: "", company: "", email: "", status: "active" });
  };

  const deleteClient = async (id: string) => {
    await fetch(`/api/clients/${id}`, {
      method: "DELETE",
    });

    setClients((prev) => prev.filter((c) => c._id !== id));
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "inactive":
        return "bg-gray-700 text-gray-300";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen text-white p-4 sm:p-6">
      <h1 className="text-4xl font-bold mb-8">Clients</h1>

      {/* Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Client Name"
          className="px-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-base"
        />
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Company"
          className="px-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-base"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="px-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-base"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="px-4 py-3 rounded-2xl bg-gray-900 border border-gray-700 text-base"
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>

        <button
          onClick={addClient}
          className="bg-white text-black px-4 py-3 rounded-2xl w-full md:w-auto hover:scale-105 transition"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="min-w-[700px] w-full text-base">
          <thead className="bg-gray-800 text-gray-400 text-sm uppercase tracking-wide">
            <tr>
              <th className="text-left p-5">Name</th>
              <th className="text-left p-5">Company</th>
              <th className="text-left p-5">Email</th>
              <th className="text-left p-5">Status</th>
              <th className="text-left p-5">Time</th>
              <th className="text-right p-5">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client._id}
                className="border-t border-gray-800 hover:bg-gray-800/50 transition"
              >
                <td className="p-5 font-medium">{client.name}</td>
                <td className="p-5 text-gray-300">{client.company}</td>
                <td className="p-5 text-gray-400">{client.email}</td>

                <td className="p-5">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusColor(
                      client.status
                    )}`}
                  >
                    {client.status}
                  </span>
                </td>

                <td className="p-5 text-sm text-gray-400">
                  {client.createdAt && (
                    <div>🕒 {formatTime(client.createdAt)}</div>
                  )}
                  {client.updatedAt && (
                    <div className="text-green-400">
                      ✏️ {formatTime(client.updatedAt)}
                    </div>
                  )}
                </td>

                <td className="p-5 text-right">
                  <button
                    onClick={() => deleteClient(client._id)}
                    className="text-red-500 hover:scale-110 transition"
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