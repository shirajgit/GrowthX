// app/ai/page.tsx
"use client";

import { useState } from "react";

export default function AIPage() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const newChat = [...chat, { role: "user", text: input }];
    setChat(newChat);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setChat([
      ...newChat,
      { role: "ai", text: data.reply },
    ]);

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Assistant 🤖</h1>

      <div className="h-[400px] overflow-y-auto bg-black/40 p-4 rounded-xl space-y-3">
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.role === "user"
                ? "bg-white text-black ml-auto"
                : "bg-white/10"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="text-gray-400 text-sm">Thinking...</div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 p-3 rounded-xl bg-black border border-white/10"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-white text-black rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}