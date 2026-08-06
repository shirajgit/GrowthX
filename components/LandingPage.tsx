"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Sparkles, CheckSquare, Folder, Briefcase, Flame, Notebook,
  Brain, Shield, Zap, Gauge, MessageSquare, TrendingUp,
  ArrowRight, ChevronRight, Star, Lock, Menu, X,
} from "lucide-react";

/* ── Reusable CTA buttons ─────────────────────────────────────── */
function GetStarted({ label = "Get Started", size = "md" }: { label?: string; size?: "md" | "lg" }) {
  const pad = size === "lg" ? "px-7 py-4 text-base" : "px-5 py-2.5 text-sm";
  return (
    <SignUpButton mode="modal">
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`group inline-flex items-center gap-2 rounded-2xl font-semibold text-black ${pad} outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]`}
        style={{ background: "white", boxShadow: "0 8px 30px rgba(255,255,255,0.12)" }}
      >
        {label}
        <ArrowRight size={size === "lg" ? 18 : 15} className="transition-transform group-hover:translate-x-0.5" />
      </motion.button>
    </SignUpButton>
  );
}

/* ── Data ─────────────────────────────────────────────────────── */
const features = [
  { icon: CheckSquare, color: "#34d399", title: "Tasks", desc: "Capture, filter, and complete work with progress tracking and instant search." },
  { icon: Folder, color: "#3b82f6", title: "Projects", desc: "Group your work into projects and watch momentum build with live status." },
  { icon: Briefcase, color: "#f59e0b", title: "Jobs", desc: "Track applications end-to-end so nothing slips through the cracks." },
  { icon: Flame, color: "#f87171", title: "Leads & CRM", desc: "A lightweight CRM for contacts, companies, and follow-ups that convert." },
  { icon: Notebook, color: "#facc15", title: "Notes", desc: "Jot ideas and keep context close — searchable and always in sync." },
  { icon: Sparkles, color: "#a78bfa", title: "AI Assistant", desc: "Ask anything about your workspace and get clear, prioritized next actions." },
];

const aiHighlights = [
  { icon: Brain, title: "Workspace-aware insights", desc: "A live summary of what matters today, drawn from your real data — not generic tips." },
  { icon: MessageSquare, title: "Chat with your work", desc: "“What’s overdue?” “Which leads should I call first?” Get answers grounded in your workspace." },
  { icon: Gauge, title: "Productivity score", desc: "A single number that tracks your momentum and nudges you toward what moves the needle." },
];

const steps = [
  { n: "01", title: "Create your account", desc: "Sign up in seconds with secure, passwordless auth. No credit card required." },
  { n: "02", title: "Add your work", desc: "Bring in tasks, projects, jobs, leads, and notes — all in one clean workspace." },
  { n: "03", title: "Let AI guide you", desc: "Get daily priorities, insights, and answers so you always know your next move." },
];

const stats = [
  { value: "6-in-1", label: "Tools unified" },
  { value: "AI", label: "Built in, not bolted on" },
  { value: "AES-256", label: "Encryption at rest" },
  { value: "GDPR", label: "& CCPA compliant" },
];

const faqs = [
  { q: "Is GrowthX free to start?", a: "Yes — create an account and start using every core module right away. No credit card required." },
  { q: "How is my data protected?", a: "Data is encrypted at rest (AES-256) and in transit (TLS 1.3), stored on MongoDB Atlas, with passwordless auth handled by Clerk." },
  { q: "What powers the AI features?", a: "The assistant uses your workspace context to generate insights and answers. Only the minimal context needed for your query is ever sent." },
  { q: "Can I export or delete my data?", a: "Anytime. Export everything to JSON in one click, or permanently delete your account and all data from the Privacy & Data page." },
];

/* ── Section wrapper for scroll-reveal ────────────────────────── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="flex items-center justify-center rounded-xl w-8 h-8"
      style={{ background: "linear-gradient(135deg,#8b5cf6,#60a5fa,#34d399)", boxShadow: "0 6px 20px rgba(139,92,246,0.35)" }}>
      <span className="text-white font-black text-[11px] tracking-tight">GX</span>
    </div>
    <span className="text-base font-black tracking-tight">
      <span className="text-white">Growth</span>
      <span style={{ background: "linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>X</span>
    </span>
  </div>
);

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "AI", href: "#ai" },
    { label: "How it works", href: "#how" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "var(--bg)" }}>
      {/* ── NAV ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40" style={{ background: "rgba(8,8,8,0.72)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-gray-400 hover:text-white transition-colors">{l.label}</a>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="text-sm px-4 py-2 rounded-xl font-medium text-white transition-all hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
                Sign In
              </button>
            </SignInButton>
            <GetStarted />
          </div>
          <button onClick={() => setMenuOpen((o) => !o)} aria-label="Toggle menu" className="md:hidden text-gray-300 hover:text-white">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="md:hidden px-5 pb-5 flex flex-col gap-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)} className="py-2.5 text-sm text-gray-300 hover:text-white transition-colors">{l.label}</a>
            ))}
            <div className="flex gap-3 mt-2">
              <SignInButton mode="modal">
                <button className="flex-1 text-sm px-4 py-2.5 rounded-xl font-medium text-white" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>Sign In</button>
              </SignInButton>
              <GetStarted />
            </div>
          </motion.div>
        )}
      </header>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute w-[600px] h-[600px] rounded-full blur-[160px] opacity-25" style={{ background: "rgba(139,92,246,0.4)", top: "-220px", left: "50%", transform: "translateX(-50%)" }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-5 pt-20 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium mb-7"
            style={{ background: "rgba(139,92,246,0.12)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd" }}>
            <Sparkles size={13} /> AI-powered productivity workspace
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.05] text-white">
            Everything you do to grow,
            <br />
            <span style={{ background: "linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              in one workspace.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-400 text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            Tasks, projects, jobs, leads, and notes — unified and supercharged with an AI assistant
            that tells you exactly what to focus on next.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
            <GetStarted label="Get Started — it's free" size="lg" />
            <a href="#features" className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl font-semibold text-sm text-white transition-all hover:bg-white/5"
              style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
              Explore features <ChevronRight size={16} />
            </a>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} className="text-xs text-gray-600 mt-6">
            No credit card required · Enterprise-grade security · Cancel anytime
          </motion.p>

          {/* Product preview mock */}
          <motion.div data-theme="dark" initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-16 rounded-3xl overflow-hidden text-left"
            style={{ background: "linear-gradient(140deg, rgba(20,16,34,0.9), rgba(13,16,28,0.9))", border: "1px solid rgba(139,92,246,0.18)", boxShadow: "0 40px 90px rgba(0,0,0,0.5)" }}>
            <div className="flex items-center gap-1.5 px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="w-3 h-3 rounded-full" style={{ background: "#f87171" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#facc15" }} />
              <span className="w-3 h-3 rounded-full" style={{ background: "#34d399" }} />
              <span className="ml-3 text-xs text-gray-500">GrowthX · Dashboard</span>
            </div>
            <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {features.slice(0, 4).map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${f.color}1f`, border: `1px solid ${f.color}40` }}>
                      <Icon size={16} style={{ color: f.color }} />
                    </div>
                    <div className="text-2xl font-bold leading-none" style={{ color: f.color }}>{[12, 5, 8, 24][features.indexOf(f)]}</div>
                    <div className="text-[11px] text-gray-500 uppercase tracking-wide mt-1.5">{f.title}</div>
                  </div>
                );
              })}
            </div>
            <div className="px-5 pb-5">
              <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "rgba(139,92,246,0.08)", border: "1px solid rgba(139,92,246,0.2)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)" }}>🤖</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] tracking-[0.25em] uppercase text-purple-300 font-semibold">AI Insight</p>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold" style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#86efac" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Live
                    </span>
                  </div>
                  <p className="text-sm text-white font-semibold mt-1.5">You have 5 open tasks and 3 leads to follow up — start with the two due today.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-5 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.05}>
              <div className="rounded-2xl p-5 text-center h-full" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1.5">{s.label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────── */}
      <section id="features" className="max-w-6xl mx-auto px-5 py-20 scroll-mt-20">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] tracking-[0.25em] uppercase text-purple-400 font-semibold mb-3">Features</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">One workspace for all your work</h2>
          <p className="text-gray-400 mt-4">Stop juggling five different apps. GrowthX brings every part of your day together — and adds an AI layer on top.</p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.07}>
                <motion.div whileHover={{ y: -4 }} className="group relative rounded-2xl p-6 h-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40" style={{ background: f.color }} />
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: `${f.color}1f`, border: `1px solid ${f.color}40` }}>
                    <Icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1.5">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── AI SPOTLIGHT ──────────────────────────────────────── */}
      <section id="ai" className="max-w-6xl mx-auto px-5 py-20 scroll-mt-20">
        <div data-theme="dark" className="relative rounded-[32px] overflow-hidden p-8 sm:p-12"
          style={{ background: "linear-gradient(140deg, rgba(20,16,34,0.9), rgba(13,16,28,0.9))", border: "1px solid rgba(139,92,246,0.2)" }}>
          <div className="absolute -top-24 -right-16 w-72 h-72 rounded-full blur-[120px] opacity-30 pointer-events-none" style={{ background: "rgba(139,92,246,0.5)" }} />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd" }}>
                <Zap size={13} /> Powered by AI
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">Your workspace, with a brain</h2>
              <p className="text-gray-400 mt-4 leading-relaxed">
                GrowthX doesn't just store your work — it understands it. Get a live daily briefing, ask questions in plain English,
                and see a productivity score that keeps you honest.
              </p>
              <div className="mt-7"><GetStarted label="Try the AI assistant" /></div>
            </Reveal>

            <div className="space-y-3">
              {aiHighlights.map((h, i) => {
                const Icon = h.icon;
                return (
                  <Reveal key={h.title} delay={i * 0.08}>
                    <div className="flex items-start gap-4 rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
                        <Icon size={18} style={{ color: "#a78bfa" }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{h.title}</p>
                        <p className="text-[13px] text-gray-400 mt-0.5 leading-relaxed">{h.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section id="how" className="max-w-6xl mx-auto px-5 py-20 scroll-mt-20">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] tracking-[0.25em] uppercase text-blue-400 font-semibold mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Up and running in minutes</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="relative rounded-2xl p-6 h-full" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-5xl font-black leading-none mb-4" style={{ background: "linear-gradient(135deg,#a78bfa,#60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", opacity: 0.9 }}>{s.n}</div>
                <h3 className="text-lg font-bold text-white mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TRUST / SECURITY ──────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 py-10">
        <Reveal>
          <div className="rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)" }}>
                <Shield size={22} style={{ color: "#34d399" }} />
              </div>
              <div>
                <p className="text-white font-bold">Secure & private by design</p>
                <p className="text-sm text-gray-400 mt-0.5">Passwordless auth via Clerk. AES-256 at rest, TLS 1.3 in transit. Export or delete your data anytime.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:ml-auto">
              {[{ i: Lock, t: "AES-256" }, { i: Star, t: "SOC 2 auth" }, { i: TrendingUp, t: "GDPR / CCPA" }].map((b) => {
                const Icon = b.i;
                return (
                  <span key={b.t} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-gray-300" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Icon size={12} /> {b.t}
                  </span>
                );
              })}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" className="max-w-3xl mx-auto px-5 py-20 scroll-mt-20">
        <Reveal className="text-center mb-10">
          <p className="text-[11px] tracking-[0.25em] uppercase text-gray-500 font-semibold mb-3">FAQ</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Questions, answered</h2>
        </Reveal>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.05}>
              <details className="group rounded-2xl px-5 py-4" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <summary className="flex items-center justify-between cursor-pointer list-none text-white font-semibold text-sm">
                  {f.q}
                  <ChevronRight size={16} className="text-gray-500 transition-transform group-open:rotate-90" />
                </summary>
                <p className="text-sm text-gray-400 leading-relaxed mt-3">{f.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-5 pb-20">
        <Reveal>
          <div className="relative rounded-[32px] overflow-hidden p-10 sm:p-16 text-center"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.18), rgba(59,130,246,0.12))", border: "1px solid rgba(139,92,246,0.25)" }}>
            <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)" }} />
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">Ready to grow faster?</h2>
            <p className="text-gray-300 mt-4 max-w-xl mx-auto">Join GrowthX and turn scattered work into a single, AI-guided workflow. It's free to start.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              <GetStarted label="Get Started — it's free" size="lg" />
              <SignInButton mode="modal">
                <button className="px-6 py-4 rounded-2xl font-semibold text-sm text-white transition-all hover:bg-white/5" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
                  I already have an account
                </button>
              </SignInButton>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-6 text-sm text-gray-500">
            {navLinks.map((l) => <a key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</a>)}
          </div>
          <p className="text-xs text-gray-600">© 2026 GrowthX · GDPR & CCPA compliant</p>
        </div>
      </footer>
    </div>
  );
}
