"use client";

import { motion } from "framer-motion";
import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, Shield, Bell, ChevronRight, Zap, User, Lock, Palette,
  HelpCircle, Settings, Flame, Rocket, CheckCircle2,
} from "lucide-react";

const menuSections = [
  {
    label: "Account",
    items: [
      { icon: User, label: "Personal Information", sub: "Name, email, profile photo", action: "profile", url: null, color: "#a78bfa" },
      { icon: Lock, label: "Password & Security", sub: "2FA, login history", action: "profile", url: null, color: "#60a5fa" },
      { icon: Bell, label: "Notifications", sub: "Alerts, digests, reminders", action: null, url: null, color: "#f59e0b" },
    ],
  },
  {
    label: "Preferences",
    items: [
      { icon: Palette, label: "Appearance", sub: "Theme, density, language", action: null, url: null, color: "#34d399" },
      { icon: Zap, label: "Integrations", sub: "Connected apps & APIs", action: null, url: null, color: "#f472b6" },
    ],
  },
  {
    label: "Support",
    items: [
      { icon: HelpCircle, label: "Help Center", sub: "Docs, tutorials, FAQs", action: null, url: "/settings/help", color: "#94a3b8" },
      { icon: Shield, label: "Privacy & Data", sub: "Data export, deletion", action: null, url: "/settings/privacydata", color: "#64748b" },
    ],
  },
];

type RealStats = { tasksDone: number; doneToday: number; projects: number; projectsToday: number; streak: number };

function computeStreak(tasks: any[]) {
  const days = new Set<string>();
  tasks.forEach((t) => [t.createdAt, t.updatedAt].forEach((d) => { if (d) days.add(new Date(d).toDateString()); }));
  let streak = 0;
  const cur = new Date();
  if (!days.has(cur.toDateString())) cur.setDate(cur.getDate() - 1);
  while (days.has(cur.toDateString())) { streak++; cur.setDate(cur.getDate() - 1); }
  return streak;
}

function StatPill({ label, value, icon: Icon, delta, color, index, loading }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }} className="relative flex-1 min-w-[90px] rounded-2xl overflow-hidden p-4"
      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-20" style={{ background: color }} />
      <div className="flex items-center justify-between mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}1f`, border: `1px solid ${color}40` }}>
          <Icon size={13} style={{ color }} />
        </div>
        {delta && <span className="text-[9px] font-semibold tracking-widest uppercase" style={{ color }}>{delta}</span>}
      </div>
      {loading ? <div className="h-7 w-10 rounded-lg bg-white/5 animate-pulse mb-1" /> : <p className="text-2xl font-bold tracking-tight" style={{ color }}>{value}</p>}
      <p className="text-[11px] text-gray-500 mt-0.5 tracking-wide">{label}</p>
    </motion.div>
  );
}

function MenuRow({ item, index, onClick }: any) {
  const Icon = item.icon;
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const soon = !item.action && !item.url;

  const handleClick = () => {
    if (soon) return;
    if (item.url) router.push(item.url);
    else onClick();
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onClick={handleClick}
      className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group text-left"
      style={{ background: hovered && !soon ? "rgba(255,255,255,0.05)" : "transparent", cursor: soon ? "default" : "pointer" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>
        <Icon size={16} style={{ color: item.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-medium text-white leading-none mb-0.5">{item.label}</p>
        <p className="text-[11px] text-gray-500 truncate">{item.sub}</p>
      </div>
      {soon ? (
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest uppercase flex-shrink-0" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#6b7280" }}>Soon</span>
      ) : (
        <motion.div animate={{ x: hovered ? 2 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight size={15} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
        </motion.div>
      )}
    </motion.button>
  );
}

export default function ProfilePage() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [signingOut, setSigningOut] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [stats, setStats] = useState<RealStats>({ tasksDone: 0, doneToday: 0, projects: 0, projectsToday: 0, streak: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const [tasksRes, projectsRes] = await Promise.all([fetch("/api/tasks"), fetch("/api/projects")]);
        const [tasks, projects] = await Promise.all([tasksRes.ok ? tasksRes.json() : [], projectsRes.ok ? projectsRes.json() : []]);
        const today = new Date().toDateString();
        const t = Array.isArray(tasks) ? tasks : [];
        const p = Array.isArray(projects) ? projects : [];
        setStats({
          tasksDone: t.filter((x: any) => x.status === "done").length,
          doneToday: t.filter((x: any) => x.status === "done" && x.updatedAt && new Date(x.updatedAt).toDateString() === today).length,
          projects: p.length,
          projectsToday: p.filter((x: any) => x.createdAt && new Date(x.createdAt).toDateString() === today).length,
          streak: computeStreak(t),
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, [mounted]);

  if (!user || !mounted) {
    return (
      <div className="h-screen flex items-center justify-center" style={{ background: "#080808" }}>
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-white/60 animate-spin" />
      </div>
    );
  }

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Recently";
  const handleSignOut = async () => { setSigningOut(true); await signOut(); };

  const statCards = [
    { label: "Tasks Done", value: String(stats.tasksDone), icon: CheckCircle2, color: "#34d399", delta: stats.doneToday > 0 ? `+${stats.doneToday} today` : "", loading: statsLoading },
    { label: "Projects", value: String(stats.projects), icon: Rocket, color: "#3b82f6", delta: stats.projectsToday > 0 ? `+${stats.projectsToday}` : "", loading: statsLoading },
    { label: "Day Streak", value: String(stats.streak), icon: Flame, color: "#f59e0b", delta: stats.streak > 0 ? "days" : "", loading: statsLoading },
  ];

  return (
    <div className="min-h-screen text-white relative" style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "linear-gradient(160deg, #080808 0%, #0f0f13 50%, #0a0a10 100%)" }}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)" }} />

      <div className="relative max-w-xl mx-auto px-4 py-8 pb-24">
        {/* Header — unified icon-chip style */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex items-center gap-3 mb-7">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.4), rgba(167,139,250,0.12))", border: "1px solid rgba(167,139,250,0.4)", boxShadow: "0 0 24px rgba(167,139,250,0.15)" }}>
            <Settings size={20} style={{ color: "#a78bfa" }} />
          </div>
          <div>
            <p className="text-[11px] tracking-[0.25em] uppercase text-gray-600 font-semibold">Account</p>
            <h1 className="text-2xl font-bold tracking-tight leading-none mt-0.5">Profile</h1>
          </div>
        </motion.div>

        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden mb-4 p-6"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.09)", boxShadow: "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)" }}>
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
          <div className="flex items-center gap-5">
            <div className="relative flex-shrink-0">
              <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))", boxShadow: "0 0 0 1px rgba(255,255,255,0.1), 0 8px 24px rgba(139,92,246,0.2)" }}>
                {user.imageUrl ? <img src={user.imageUrl} alt="avatar" className="w-full h-full object-cover rounded-2xl" /> : <span className="text-2xl font-bold text-white">{(user.firstName || "U")[0]}</span>}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-[#0f0f13]" style={{ background: "#22c55e" }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white tracking-tight truncate">{user.fullName || user.firstName || "User"}</h2>
              <p className="text-[13px] text-gray-400 truncate mt-0.5">{user.primaryEmailAddress?.emailAddress}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-widest uppercase" style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }}>Pro</span>
                <span className="text-[11px] text-gray-600">Member since {joinDate}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            {statCards.map((s, i) => <StatPill key={s.label} {...s} index={i} />)}
          </div>
        </motion.div>

        {/* Menu sections */}
        {menuSections.map((section, si) => (
          <motion.div key={section.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + si * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="mb-3">
            <p className="text-[10.5px] font-semibold tracking-[0.2em] uppercase text-gray-600 px-1 mb-2">{section.label}</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {section.items.map((item, ii) => (
                <div key={item.label} style={{ borderTop: ii > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
                  <MenuRow item={item} index={si * 3 + ii} onClick={() => (item.action === "profile" ? openUserProfile() : undefined)} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {/* Sign out */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="mt-4">
          <motion.button onClick={handleSignOut} disabled={signingOut} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2.5 rounded-2xl py-4 transition-all duration-200 font-semibold text-[13.5px]"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", color: signingOut ? "rgba(239,68,68,0.5)" : "#ef4444" }}>
            {signingOut ? <div className="w-4 h-4 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" /> : <LogOut size={15} />}
            {signingOut ? "Signing out…" : "Sign Out"}
          </motion.button>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center text-[11px] text-gray-700 mt-8 tracking-wide">
          GrowthX · v2.0 · Secured with Clerk
        </motion.p>
      </div>
    </div>
  );
}