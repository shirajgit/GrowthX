"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, Copy, Check, RotateCcw, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
};

const SUGGESTED_PROMPTS = [
  "What should I focus on today?",
  "Help me write a cold email",
  "Summarize my priorities",
  "How can I improve productivity?",
];

function MessageBubble({ msg, index }: { msg: Message; index: number }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const copy = () => {
    navigator.clipboard.writeText(msg.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: isUser
            ? "rgba(255,255,255,0.08)"
            : "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))",
          border: `1px solid ${isUser ? "rgba(255,255,255,0.1)" : "rgba(139,92,246,0.3)"}`,
        }}
      >
        {isUser ? (
          <User size={14} className="text-gray-400" />
        ) : (
          <Sparkles size={14} style={{ color: "#a78bfa" }} />
        )}
      </div>

      {/* Bubble */}
      <div className={`group max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
          style={{
            background: isUser
              ? "rgba(255,255,255,0.08)"
              : "rgba(139,92,246,0.08)",
            border: `1px solid ${isUser ? "rgba(255,255,255,0.1)" : "rgba(139,92,246,0.15)"}`,
            color: isUser ? "white" : "#e2e8f0",
            borderRadius: isUser ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
          }}
        >
          {msg.text}
        </div>

        {/* Footer row */}
        <div className={`flex items-center gap-2 px-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
          <span className="text-[10px] text-gray-700">
            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
          </span>
          {!isUser && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={copy}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ color: copied ? "#34d399" : "#4b5563" }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex gap-3"
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))",
          border: "1px solid rgba(139,92,246,0.3)",
        }}
      >
        <Sparkles size={14} style={{ color: "#a78bfa" }} />
      </div>
      <div
        className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
        style={{
          background: "rgba(139,92,246,0.08)",
          border: "1px solid rgba(139,92,246,0.15)",
          borderRadius: "4px 18px 18px 18px",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#a78bfa" }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function AIPage() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: msg,
      timestamp: new Date(),
    };

    setChat((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: data.reply || "Sorry, I couldn't process that.",
        timestamp: new Date(),
      };

      setChat((prev) => [...prev, aiMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: "Something went wrong. Please try again.",
        timestamp: new Date(),
      };
      setChat((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => setChat([]);

  return (
    <div
      className="flex flex-col h-screen md:h-[calc(100vh-0px)] text-white"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        background: "linear-gradient(160deg, #080808 0%, #0f0f13 50%, #0a0a10 100%)",
      }}
    >
      {/* Ambient */}
      <div className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-5 py-4 flex-shrink-0 relative"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))",
              border: "1px solid rgba(139,92,246,0.3)",
              boxShadow: "0 0 20px rgba(139,92,246,0.2)",
            }}
          >
            <Sparkles size={16} style={{ color: "#a78bfa" }} />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">AI Assistant</p>
            <p className="text-[11px] text-gray-600 mt-0.5">
              {loading ? (
                <span style={{ color: "#a78bfa" }}>Thinking…</span>
              ) : (
                "Ready to help"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {chat.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearChat}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "#6b7280",
              }}
            >
              <RotateCcw size={12} /> Clear
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Empty state */}
        {chat.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center h-full text-center pt-12"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
              style={{
                background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.15))",
                border: "1px solid rgba(139,92,246,0.25)",
                boxShadow: "0 0 40px rgba(139,92,246,0.15)",
              }}
            >
              <Sparkles size={28} style={{ color: "#a78bfa" }} />
            </div>
            <h2 className="text-lg font-bold text-white mb-2">How can I help?</h2>
            <p className="text-sm text-gray-600 mb-8 max-w-xs">
              Ask me anything — tasks, strategy, writing, or whatever's on your mind.
            </p>

            {/* Suggested prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={prompt}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => sendMessage(prompt)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-left transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "#9ca3af",
                  }}
                >
                  <Zap size={13} style={{ color: "#a78bfa", flexShrink: 0 }} />
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Messages */}
        {chat.map((msg, i) => (
          <MessageBubble key={msg.id} msg={msg} index={i} />
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {loading && <TypingIndicator />}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="px-4 sm:px-6 py-4 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-3 transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Message AI Assistant… (Enter to send)"
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-sm text-white placeholder-gray-600 leading-relaxed"
            style={{ maxHeight: "120px", minHeight: "24px" }}
          />
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={{
              background: input.trim() && !loading
                ? "linear-gradient(135deg, rgba(139,92,246,0.5), rgba(59,130,246,0.4))"
                : "rgba(255,255,255,0.04)",
              border: `1px solid ${input.trim() && !loading ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.06)"}`,
              color: input.trim() && !loading ? "#c4b5fd" : "#374151",
            }}
          >
            <Send size={14} />
          </motion.button>
        </div>
        <p className="text-center text-[10px] text-gray-700 mt-2">
          Shift+Enter for new line · Enter to send
        </p>
      </motion.div>
    </div>
  );
}
