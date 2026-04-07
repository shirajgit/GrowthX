"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";

type Lead = {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: string;
  work: string;
  createdAt: string;
  updatedAt: string;
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "new",
    work: "",
  });

  // 🔥 Fetch
  const fetchLeads = async () => {
    setLoading(true);
    const res = await fetch("/api/leads");
    const data = await res.json();
    setLeads(data);
    setLoading(false);
  };

useEffect(() => {
    (async () => {
      await fetchLeads();
    })();
  }, []);

  // ➕ Add
  const addLead = async () => {
    if (!form.name.trim()) return;

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const newLead = await res.json();
    setLeads((prev) => [newLead, ...prev]);

    setForm({
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "new",
      work: "",
    });
  };

  // ❌ Delete
  const deleteLead = async (id: string) => {
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    setLeads((prev) => prev.filter((l) => l._id !== id));
  };

  // 🎨 Status UI
  const statusColor = (status: string) => {
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

  const formatTime = (time: string) =>
    new Date(time).toLocaleString();

  // 🔍 Filter logic
  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "all" ? true : lead.status === filter;

    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white p-6">
      <h1 className="text-3xl mt-1 lg:mt-1 font-bold mb-6">Leads</h1>

      {/* ADD FORM */}
      <div className="grid md:grid-cols-6 gap-3 mb-6">
        {(["name", "company", "email", "phone", "work"] as const).map((f) => (
          <input
            key={f}
            value={form[f]}
            onChange={(e) =>
              setForm({ ...form, [f]: e.target.value })
            }
            placeholder={f}
            className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
          />
        ))}

        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
          className="px-4 py-3 rounded-xl bg-gray-900 border border-gray-700"
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>

        <button
          onClick={addLead}
          className="bg-white text-sm font-bold text-black px-4 py-3 rounded-xl col-span-full md:col-span-1"
        >
           + Add
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-xl"
        />
 
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-1 py-2 bg-gray-900 border border-gray-700 rounded-xl"
        > 
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* MOBILE */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredLeads.map((lead) => (
          <div
            key={lead._id}
            className="bg-gray-900 border border-gray-800 p-4 rounded-2xl"
          >
            <div className="flex justify-between">
              <h2>{lead.name}</h2>
              <button onClick={() => deleteLead(lead._id)}>
                <Trash2 size={16} />
              </button>
            </div>

            <p>{lead.company}</p>
            <p>{lead.email}</p>
            <p>{lead.work}</p>

            <select
              value={lead.status}
              onChange={async (e) => {
                const newStatus = e.target.value;

                setLeads((prev) =>
                  prev.map((l) =>
                    l._id === lead._id
                      ? { ...l, status: newStatus }
                      : l
                  )
                );

                await fetch(`/api/leads/${lead._id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ status: newStatus }),
                });
              }}
              className={`mt-2 ${statusColor(lead.status)}`}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>

            <a
              href={`https://wa.me/${lead.phone || ""}`}
              target="_blank"
              className="text-green-400 block mt-2"
            >
              WhatsApp
            </a>
          </div>
        ))}
      </div>

      {/* DESKTOP */}
      <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Company</th>
              <th className="p-4">Email</th>
              <th className="p-4">Work</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead._id} className="border-t border-gray-800">
                <td className="p-4">{lead.name}</td>
                <td className="p-4">{lead.company}</td>
                <td className="p-4">{lead.email}</td>
                <td className="p-4">{lead.work}</td>

                <td className="p-4">
                  <select
                    value={lead.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value;

                      setLeads((prev) =>
                        prev.map((l) =>
                          l._id === lead._id
                            ? { ...l, status: newStatus }
                            : l
                        )
                      );

                      await fetch(`/api/leads/${lead._id}`, {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          status: newStatus,
                        }),
                      });
                    }}
                    className={`${statusColor(lead.status)} px-2 py-1 rounded`}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => setEditingLead(lead)}
                    className="text-blue-400 mr-3"
                  >
                    Edit
                  </button>

                  <a
                    href={`https://wa.me/${lead.phone || ""}`}
                    target="_blank"
                    className="text-green-400 mr-3"
                  >
                    WA
                  </a>

                  <button
                    onClick={() => deleteLead(lead._id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingLead && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-xl w-96">
            <h2 className="mb-4 text-lg font-bold">Edit</h2>

            <input
              value={editingLead.name}
              onChange={(e) =>
                setEditingLead({
                  ...editingLead,
                  name: e.target.value,
                })
              }
              className="w-full mb-2 p-2 bg-gray-800"
            />

            <button
              onClick={async () => {
                await fetch(`/api/leads/${editingLead._id}`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(editingLead),
                });

                setLeads((prev) =>
                  prev.map((l) =>
                    l._id === editingLead._id
                      ? editingLead
                      : l
                  )
                );

                setEditingLead(null);
              }}
              className="bg-white text-black px-4 py-2 mt-2"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}