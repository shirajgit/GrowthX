"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: "Ravi Kumar",
      source: "LinkedIn",
      contact: "ravi@mail.com",
      status: "new",
      work: "Send intro message",
    },
    {
      id: 2,
      name: "Ayesha Shaikh",
      source: "Referral",
      contact: "ayesha@mail.com",
      status: "contacted",
      work: "Schedule meeting",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    source: "",
    contact: "",
    status: "new",
    work: "",
  });

  const addLead = () => {
    if (!form.name.trim()) return;

    setLeads([
      ...leads,
      {
        id: Date.now(),
        name: form.name,
        source: form.source,
        contact: form.contact,
        status: form.status,
        work: form.work,
      },
    ]);

    setForm({ name: "", source: "", contact: "", status: "new", work: "" });
  };

  const deleteLead = (id : number) => {
    setLeads(leads.filter((l) => l.id !== id));
  };

  const statusColor = (status : string) => {
    switch (status) {
      case "new":
        return "bg-blue-500/20 text-blue-400";
      case "contacted":
        return "bg-yellow-500/20 text-yellow-400";
      case "converted":
        return "bg-green-500/20 text-green-400";
      case "lost":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-700 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen  text-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Leads</h1>
      </div>

      {/* Add Lead */}
      <div className="grid md:grid-cols-5 gap-3 mb-6">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <input
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          placeholder="Source"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <input
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          placeholder="Contact"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <input
          value={form.work}
          onChange={(e) => setForm({ ...form, work: e.target.value })}
          placeholder="Next Work (follow-up, call...)"
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        />
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>

        <button
          onClick={addLead}
          className="bg-white text-black px-4 py-3 rounded-xl flex items-center justify-center gap-2 col-span-full"
        >
          <Plus size={18} /> Add Lead
        </button>
      </div>

      {/* Leads Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Source</th>
              <th className="text-left p-4">Contact</th>
              <th className="text-left p-4">Work</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-t border-gray-800">
                <td className="p-4">{lead.name}</td>
                <td className="p-4">{lead.source}</td>
                <td className="p-4">{lead.contact}</td>
                <td className="p-4 text-gray-300">{lead.work}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${statusColor(
                      lead.status
                    )}`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => deleteLead(lead.id)}
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