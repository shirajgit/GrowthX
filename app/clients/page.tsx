"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState([
    {
      id: 1,
      name: "John Doe",
      company: "ABC Corp",
      email: "john@example.com",
      status: "active",
    },
    {
      id: 2,
      name: "Sarah Khan",
      company: "StartupX",
      email: "sarah@example.com",
      status: "pending",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    status: "active",
  });

  const addClient = () => {
    if (!form.name.trim()) return;

    setClients([
      ...clients,
      {
        id: Date.now(),
        name: form.name,
        company: form.company,
        email: form.email,
        status: form.status,
      },
    ]);

    setForm({ name: "", company: "", email: "", status: "active" });
  };

  const deleteClient = (id) => {
    setClients(clients.filter((c) => c.id !== id));
  };

  const statusColor = (status) => {
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
    <div className="min-h-screen   text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Clients</h1>
      </div>

      {/* Add Client */}
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Client Name"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Company"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <input
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="inactive">Inactive</option>
        </select>
        <button
          onClick={addClient}
          className="bg-white text-black px-4 py-3 rounded-xl flex items-center justify-center gap-2 col-span-full md:col-span-1"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Clients Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Company</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-t border-gray-800">
                <td className="p-4">{client.name}</td>
                <td className="p-4">{client.company}</td>
                <td className="p-4">{client.email}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusColor(
                      client.status
                    )}`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteClient(client.id)}
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