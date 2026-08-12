import {
  useEffect, useRef, useState, useMemo, useCallback,
} from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import {
  Linkedin, History, Users, ChevronLeft, ChevronRight, Crown,
  FileText, Wallet, PenTool, Code2, Cpu, Palette, Share2,
  CalendarDays, Star, GraduationCap, FileEdit, Sparkles, Search,
  X, Filter, Layers, Trophy, Zap, MapPin, ExternalLink,
  CheckCircle2, ShieldCheck, ChevronDown, ChevronUp,
} from "lucide-react";
import srecCampus from "@/assets/srec-campus.png";
import receiptHeader from "@/assets/receipt-header.jpg";

// ─── FONTS ──────────────────────────────────────────────────────────
const GFONTS =
  "https://fonts.googleapis.com/css2?family=Outfit:wght@700;800;900&family=Plus+Jakarta+Sans:wght@700;800;900&family=Space+Grotesk:wght@700&family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap";

// ─── TYPES ──────────────────────────────────────────────────────────
export type OfficePerson = {
  id: number | string;
  name?: string;
  role?: string;
  department?: string;
  year?: number;
  image_url?: string;
  photo?: string;
  photo_url?: string;
  linkedin_url?: string;
  linkedin?: string;
  bio?: string;
};

// ─── ROLE META ──────────────────────────────────────────────────────
type RoleMeta = {
  priority: number;
  category: "leadership" | "core" | "tech_design" | "exec";
  tagline: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  bg: string;
};

const ROLES: { match: string[]; meta: RoleMeta }[] = [
  { match: ["counsellor", "counselor"], meta: { priority: 0, category: "leadership", tagline: "Mentor & Visionary Guide", icon: GraduationCap, color: "#a78bfa", glow: "rgba(167,139,250,.5)", bg: "rgba(167,139,250,.12)" } },
  { match: ["chairperson", "chair"], meta: { priority: 1, category: "leadership", tagline: "Supreme Student Leader", icon: Crown, color: "#fbbf24", glow: "rgba(251,191,36,.5)", bg: "rgba(251,191,36,.12)" } },
  { match: ["vice chair", "vice-chair", "vice chairperson"], meta: { priority: 2, category: "leadership", tagline: "Strategic Growth Driver", icon: Trophy, color: "#34d399", glow: "rgba(52,211,153,.5)", bg: "rgba(52,211,153,.12)" } },
  { match: ["secretary"], meta: { priority: 3, category: "core", tagline: "Governance & Records", icon: FileText, color: "#60a5fa", glow: "rgba(96,165,250,.5)", bg: "rgba(96,165,250,.12)" } },
  { match: ["joint secretary"], meta: { priority: 4, category: "core", tagline: "Operations Coordinator", icon: FileEdit, color: "#38bdf8", glow: "rgba(56,189,248,.5)", bg: "rgba(56,189,248,.12)" } },
  { match: ["treasurer"], meta: { priority: 5, category: "core", tagline: "Financial Guardian", icon: Wallet, color: "#fb923c", glow: "rgba(251,146,60,.5)", bg: "rgba(251,146,60,.12)" } },
  { match: ["editor"], meta: { priority: 6, category: "core", tagline: "Editorial & Publications", icon: PenTool, color: "#f472b6", glow: "rgba(244,114,182,.5)", bg: "rgba(244,114,182,.12)" } },
  { match: ["web designer", "webmaster"], meta: { priority: 7, category: "tech_design", tagline: "Digital Architect", icon: Code2, color: "#22d3ee", glow: "rgba(34,211,238,.5)", bg: "rgba(34,211,238,.12)" } },
  { match: ["technical head", "technical lead"], meta: { priority: 8, category: "tech_design", tagline: "Innovation Pioneer", icon: Cpu, color: "#4ade80", glow: "rgba(74,222,128,.5)", bg: "rgba(74,222,128,.12)" } },
  { match: ["creative head", "design head"], meta: { priority: 9, category: "tech_design", tagline: "Visual Identity Director", icon: Palette, color: "#e879f9", glow: "rgba(232,121,249,.5)", bg: "rgba(232,121,249,.12)" } },
  { match: ["social media"], meta: { priority: 10, category: "tech_design", tagline: "Digital Outreach Lead", icon: Share2, color: "#f9a8d4", glow: "rgba(249,168,212,.5)", bg: "rgba(249,168,212,.12)" } },
  { match: ["event coordinator", "activities coordinator"], meta: { priority: 11, category: "tech_design", tagline: "Events Orchestrator", icon: CalendarDays, color: "#fde68a", glow: "rgba(253,230,138,.5)", bg: "rgba(253,230,138,.12)" } },
  { match: ["executive lead", "senior executive"], meta: { priority: 12, category: "exec", tagline: "Executive Team Lead", icon: Crown, color: "#e879f9", glow: "rgba(232,121,249,.5)", bg: "rgba(232,121,249,.12)" } },
  { match: ["technical executive", "tech exec"], meta: { priority: 13, category: "exec", tagline: "Tech & Dev Executive", icon: Cpu, color: "#22d3ee", glow: "rgba(34,211,238,.5)", bg: "rgba(34,211,238,.12)" } },
  { match: ["creative executive", "design exec"], meta: { priority: 14, category: "exec", tagline: "Creative & Design", icon: Palette, color: "#f472b6", glow: "rgba(244,114,182,.5)", bg: "rgba(244,114,182,.12)" } },
  { match: ["operations executive", "ops exec"], meta: { priority: 15, category: "exec", tagline: "Operations Lead", icon: Layers, color: "#38bdf8", glow: "rgba(56,189,248,.5)", bg: "rgba(56,189,248,.12)" } },
  { match: ["events executive", "activity exec"], meta: { priority: 16, category: "exec", tagline: "Events Executive", icon: CalendarDays, color: "#fde68a", glow: "rgba(253,230,138,.5)", bg: "rgba(253,230,138,.12)" } },
  { match: ["social media executive", "media exec"], meta: { priority: 17, category: "exec", tagline: "Outreach & Media", icon: Share2, color: "#f9a8d4", glow: "rgba(249,168,212,.5)", bg: "rgba(249,168,212,.12)" } },
  { match: ["executive member", "exec member"], meta: { priority: 18, category: "exec", tagline: "Executive Committee Member", icon: ShieldCheck, color: "#818cf8", glow: "rgba(129,140,248,.5)", bg: "rgba(129,140,248,.12)" } },
];

const DEFAULT_META: RoleMeta = {
  priority: 99, category: "exec", tagline: "Student Leader", icon: Star,
  color: "#94a3b8", glow: "rgba(148,163,184,.4)", bg: "rgba(148,163,184,.10)",
};

const getMeta = (role?: string): RoleMeta => {
  if (!role) return DEFAULT_META;
  const r = role.toLowerCase();
  return ROLES.find((x) => x.match.some((m) => r.includes(m)))?.meta ?? DEFAULT_META;
};

// ─── IMAGE ──────────────────────────────────────────────────────────
const getImg = (p: OfficePerson) => {
  const raw = p.image_url || p.photo || p.photo_url;
  if (raw) {
    if (raw.startsWith("http")) return raw;
    const { data } = supabase.storage.from("office_bearers").getPublicUrl(encodeURIComponent(raw.trim()));
    return data?.publicUrl;
  }
  return "";
};

// ─── REAL DATABASE DATA FALLBACKS (2026-2027) ──────────────────────────
const REAL_BEARERS_DATA: OfficePerson[] = [
  { id: "ob-1", name: "S Darshan", role: "Chairperson", department: "IV EEE" },
  { id: "ob-2", name: "D Jennifer Shobha", role: "Vice-Chairperson", department: "III Civil" },
  { id: "ob-3", name: "R Vishnu Kaarthik", role: "Secretary", department: "III EEE" },
  { id: "ob-4", name: "D R Prithika", role: "Treasurer", department: "II EEE B" },
  { id: "ob-5", name: "S Deepak", role: "Activities Coordinator", department: "IV EEE" },
  { id: "ob-6", name: "S Amirtha Varshini", role: "Joint Activity Coordinator", department: "III CSE A" },
  { id: "ob-7", name: "V Smrthikha", role: "Joint Activity Coordinator", department: "III BME" },
  { id: "ob-8", name: "K S Surya Narayanan", role: "Web Designer", department: "II EEE B" },
  { id: "ob-9", name: "Nithin Annamalai R", role: "Editor", department: "II EEE B" },
  { id: "ob-10", name: "S Latisha", role: "Editor", department: "III CSE B" },
  { id: "ob-11", name: "Dharshini", role: "Editor", department: "III IT A" },
  { id: "ob-12", name: "Dr.K.Balamurugan", role: "Student Branch Counsellor", department: "AsP/EEE", image_url: "https://srec.ac.in/uploads/Faculty/imresizer4drkbalamurugan260715124354.jpg" },
];

const REAL_EXECS_DATA: OfficePerson[] = [
  { id: "em-1", name: "S Mathusri", role: "Executive Lead", department: "III M.Tech CSE" },
  { id: "em-2", name: "D Akshaya Dharun", role: "Technical Executive", department: "II CSE A" },
  { id: "em-3", name: "A Dhivya Tharsana", role: "Creative Executive", department: "II AI & DS" },
  { id: "em-4", name: "S V Hemesh", role: "Operations Executive", department: "II CSE A" },
  { id: "em-5", name: "M Barath", role: "Events Executive", department: "II EEE A" },
  { id: "em-6", name: "F Mohammed Aathif F", role: "Social Media Executive", department: "II EEE A" },
  { id: "em-7", name: "Bhargavan Balaji", role: "Executive Member", department: "II EEE A" },
  { id: "em-8", name: "R Srenithi", role: "Executive Member", department: "III M.Tech CSE" },
  { id: "em-9", name: "V Swetha", role: "Executive Member", department: "III EIE" },
];

// ─── FULL SCREEN BIG BOX CARD ────────────────────────────────────────
const MemberBigGridBox = ({ person, onSelect }: { person: OfficePerson; onSelect: (p: OfficePerson) => void }) => {
  const meta = getMeta(person.role);
  const Icon = meta.icon;
  const [err, setErr] = useState(false);
  const imgSrc = getImg(person);
  const showFallback = err || !imgSrc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect(person)}
      className="group relative rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-end border transition-all duration-300 shadow-2xl"
      style={{
        height: "480px",
        borderColor: "rgba(255,255,255,0.1)",
        background: "rgba(15,22,41,0.7)",
      }}
    >
      {/* Background Image or Gradient Avatar */}
      {!showFallback ? (
        <img
          src={imgSrc}
          alt={person.name || "Member"}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
          onError={() => setErr(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-transform duration-700 group-hover:scale-105"
          style={{ background: `radial-gradient(circle at 50% 30%, ${meta.color}25 0%, rgba(15,22,41,0.95) 75%)` }}
        >
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center mb-4 border shadow-2xl"
            style={{ background: meta.bg, borderColor: `${meta.color}50`, color: meta.color }}
          >
            <Icon size={44} />
          </div>
          <p
            className="text-3xl font-black tracking-tight"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", color: meta.color }}
          >
            {(person.name || "M").split(" ").map(n => n[0]).join("").slice(0, 3)}
          </p>
        </div>
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

      {/* Hover border */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{
          border: `2px solid ${meta.color}`,
        }}
      />

      {/* Role Badge Top */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border shadow-lg"
          style={{ background: meta.bg, borderColor: `${meta.color}60`, color: meta.color }}
        >
          <Icon size={12} /> {person.role || "Executive"}
        </span>
      </div>

      {/* Member Details Bottom */}
      <div className="relative z-10 p-6 flex flex-col">
        <h3
          className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight leading-tight mb-1"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          {person.name || "—"}
        </h3>

        {person.department && (
          <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-4">
            <MapPin size={13} className="text-cyan-400 shrink-0" />
            {person.department}
          </p>
        )}

        <button
          className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-lg"
          style={{
            background: meta.color,
            color: "#000",
          }}
        >
          View Profile <ExternalLink size={13} />
        </button>
      </div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  DESKTOP CENTER-FOCUS CAROUSEL
// ════════════════════════════════════════════════════════════════════
const DesktopCarousel = ({
  members, onSelect,
}: { members: OfficePerson[]; onSelect: (p: OfficePerson) => void }) => {
  const [active, setActive] = useState(0);
  const total = members.length;

  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);

  // Auto-advance every 10 seconds
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      next();
    }, 10000);
    return () => clearInterval(timer);
  }, [next, total]);

  // keyboard
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next]);

  const getSlot = (idx: number) => {
    const diff = ((idx - active + total) % total);
    if (diff === 0) return "center";
    if (diff === 1) return "right1";
    if (diff === total - 1) return "left1";
    if (diff === 2) return "right2";
    if (diff === total - 2) return "left2";
    return "hidden";
  };

  const SLOT_STYLE: Record<string, React.CSSProperties & { zIndex: number }> = {
    center: { transform: "translateX(0%) scale(1)", opacity: 1, zIndex: 5, filter: "none" },
    left1: { transform: "translateX(-76%) scale(0.85)", opacity: 0.9, zIndex: 4, filter: "brightness(0.85)" },
    right1: { transform: "translateX(76%) scale(0.85)", opacity: 0.9, zIndex: 4, filter: "brightness(0.85)" },
    left2: { transform: "translateX(-140%) scale(0.70)", opacity: 0.65, zIndex: 3, filter: "brightness(0.7)" },
    right2: { transform: "translateX(140%) scale(0.70)", opacity: 0.65, zIndex: 3, filter: "brightness(0.7)" },
    hidden: { transform: "translateX(0%) scale(0.55)", opacity: 0, zIndex: 1, pointerEvents: "none" as const },
  };

  if (total === 0) return null;

  return (
    <div className="relative w-full select-none">
      {/* Track */}
      <div className="relative h-[600px] flex items-center justify-center overflow-visible">
        {members.map((p, idx) => {
          const slot = getSlot(idx);
          const style = SLOT_STYLE[slot];
          const meta = getMeta(p.role);
          const isCenter = slot === "center";

          return (
            <motion.div
              key={String(p.id)}
              animate={{
                x: style.transform.match(/translateX\(([^)]+)\)/)?.[1] ?? "0%",
                scale: parseFloat(style.transform.match(/scale\(([^)]+)\)/)?.[1] ?? "1"),
                opacity: style.opacity,
                filter: style.filter,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              style={{ position: "absolute", zIndex: style.zIndex, width: "380px" }}
              onClick={() => isCenter ? onSelect(p) : (slot !== "hidden" && setActive(idx))}
              className="cursor-pointer"
            >
              <CarouselCard person={p} isCenter={isCenter} meta={meta} />
            </motion.div>
          );
        })}
      </div>

      {/* ─── SINGLE ROW: LEFT SIDE DYNAMIC STYLING + RIGHT SIDE INFO BAR ─── */}
      <div className="mt-8 max-w-[1100px] mx-auto px-4">
        <div
          className="relative rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-6 border backdrop-blur-2xl transition-all duration-500 shadow-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(15,22,41,0.92) 0%, rgba(8,12,24,0.95) 100%)",
            borderColor: `${getMeta(members[active].role).color}40`,
            boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
          }}
        >
          {/* LEFT SIDE: Dynamic Aesthetic Styling (Active Member Details) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={String(members[active].id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4 flex-1 min-w-0"
            >
              {(() => {
                const p = members[active];
                const meta = getMeta(p.role);
                const Icon = meta.icon;
                return (
                  <>
                    {/* Icon Badge */}
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300"
                      style={{
                        background: meta.bg,
                        borderColor: `${meta.color}60`,
                        color: meta.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>

                    {/* Active Member Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border"
                          style={{ background: meta.bg, borderColor: `${meta.color}50`, color: meta.color }}
                        >
                          {p.role || "Officer"}
                        </span>
                        {p.department && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <MapPin size={11} className="text-cyan-400 shrink-0" />
                            {p.department}
                          </span>
                        )}
                      </div>

                      <h3
                        className="text-xl sm:text-2xl font-black text-white truncate tracking-tight"
                        style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                      >
                        {p.name || "—"}
                      </h3>
                    </div>

                    {/* View Profile Button */}
                    <button
                      onClick={() => onSelect(p)}
                      className="hidden sm:inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 shrink-0"
                      style={{
                        background: meta.color,
                        color: "#000",
                      }}
                    >
                      Profile <ExternalLink size={12} />
                    </button>
                  </>
                );
              })()}
            </motion.div>
          </AnimatePresence>

          {/* RIGHT SIDE: Info Bar & Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/10">
            {/* Prev Button */}
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all hover:scale-110 active:scale-95 bg-white/5 hover:bg-white/15"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
              title="Previous Member"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>

            {/* Pagination Dots Track */}
            <div className="flex items-center gap-1.5 px-2">
              {members.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? "20px" : "6px",
                    height: "6px",
                    background:
                      i === active
                        ? getMeta(members[active].role).color
                        : "rgba(255,255,255,0.25)",
                  }}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={next}
              className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all hover:scale-110 active:scale-95 bg-white/5 hover:bg-white/15"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
              title="Next Member"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CarouselCard = ({
  person, isCenter, meta,
}: { person: OfficePerson; isCenter: boolean; meta: RoleMeta }) => {
  const [err, setErr] = useState(false);
  const imgSrc = getImg(person);
  const showFallback = err || !imgSrc;
  const Icon = meta.icon;

  return (
    <div
      className="relative rounded-3xl overflow-hidden group transition-all duration-300"
      style={{
        height: isCenter ? "540px" : "440px",
        transition: "height 0.4s ease, border-color 0.4s ease",
        border: isCenter
          ? `2px solid ${meta.color}`
          : `1px solid ${meta.color}50`,
        boxShadow: isCenter
          ? "0 25px 50px rgba(0,0,0,0.7)"
          : "0 10px 25px rgba(0,0,0,0.4)",
      }}
    >
      {!showFallback ? (
        <img src={imgSrc} alt={person.name || "Member"}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={() => setErr(true)}
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
          style={{ background: `radial-gradient(circle at 50% 30%, ${meta.color}35 0%, rgba(15,22,41,0.95) 80%)` }}
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-3 border shadow-2xl"
            style={{ background: meta.bg, borderColor: `${meta.color}60`, color: meta.color }}
          >
            <Icon size={38} />
          </div>
          <p
            className="text-2xl font-black tracking-tight"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", color: meta.color }}
          >
            {(person.name || "M").split(" ").map(n => n[0]).join("").slice(0, 3)}
          </p>
        </div>
      )}

      {/* Gradient Overlay for text contrast */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isCenter
            ? "linear-gradient(to top, rgba(4,6,15,0.95) 0%, rgba(4,6,15,0.3) 50%, transparent 85%)"
            : "linear-gradient(to top, rgba(4,6,15,0.88) 0%, rgba(4,6,15,0.25) 55%, transparent 85%)",
        }}
      />

      {/* Role badge top (Visible on all cards!) */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md shadow-lg"
          style={{ background: meta.bg, borderColor: `${meta.color}60`, color: meta.color }}
        >
          <Icon size={10} /> {person.role || "Officer"}
        </span>
      </div>

      {/* Member details bottom (Visible on background side cards!) */}
      {!isCenter && (
        <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10 flex flex-col justify-end">
          <h4
            className="font-black text-white text-base leading-tight truncate"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            {person.name || "—"}
          </h4>
          {person.department && (
            <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5 font-semibold truncate">
              <MapPin size={10} className="text-cyan-400 shrink-0" />
              {person.department}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  MOBILE UI — Modern Grid & Card Stream
// ════════════════════════════════════════════════════════════════════
const MobileView = ({
  members, onSelect,
}: { members: OfficePerson[]; onSelect: (p: OfficePerson) => void }) => {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "leadership" | "core" | "tech_design" | "exec">("all");

  const filtered = useMemo(() => {
    const t = search.toLowerCase().trim();
    return members.filter((m) => {
      const meta = getMeta(m.role);
      const matchTab = tab === "all" || meta.category === tab;
      const matchSearch = !t ||
        (m.name || "").toLowerCase().includes(t) ||
        (m.role || "").toLowerCase().includes(t) ||
        (m.department || "").toLowerCase().includes(t);
      return matchTab && matchSearch;
    });
  }, [members, tab, search]);

  const tabOptions = [
    { id: "all", label: "All", count: members.length },
    { id: "leadership", label: "Leaders", count: members.filter(m => getMeta(m.role).category === "leadership").length },
    { id: "core", label: "Core", count: members.filter(m => getMeta(m.role).category === "core").length },
    { id: "tech_design", label: "Tech", count: members.filter(m => getMeta(m.role).category === "tech_design").length },
    { id: "exec", label: "Exec", count: members.filter(m => getMeta(m.role).category === "exec").length },
  ];

  return (
    <div className="flex flex-col min-h-0 px-4">
      {/* Mobile Search bar */}
      <div className="mb-3">
        <div className="relative flex items-center">
          <Search size={14} className="absolute left-3 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search office bearers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-3 rounded-2xl text-white text-xs placeholder-slate-500 outline-none border"
            style={{ background: "rgba(15,22,41,0.8)", borderColor: "rgba(255,255,255,0.1)", fontFamily: "'Inter', sans-serif" }}
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 text-slate-400"><X size={14} /></button>}
        </div>
      </div>

      {/* Mobile Tab strip */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar py-1">
        {tabOptions.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{
              background: tab === t.id ? "linear-gradient(135deg,#22d3ee,#818cf8)" : "rgba(255,255,255,0.06)",
              color: tab === t.id ? "#000" : "rgba(255,255,255,0.6)",
              border: tab === t.id ? "none" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {t.label}
            <span className="text-[9px] font-black opacity-80">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Member Cards List */}
      <div className="space-y-3.5 pb-6">
        {filtered.map((person) => {
          const meta = getMeta(person.role);
          const Icon = meta.icon;
          const imgSrc = getImg(person);

          return (
            <motion.div
              key={String(person.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => onSelect(person)}
              className="relative rounded-2xl overflow-hidden p-3.5 flex items-center gap-3.5 border cursor-pointer active:scale-98 transition-transform"
              style={{
                background: "rgba(15,22,41,0.75)",
                borderColor: `${meta.color}35`,
                boxShadow: "0 8px 25px rgba(0,0,0,0.4)",
              }}
            >
              {/* Left Avatar / Image */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border" style={{ borderColor: `${meta.color}50` }}>
                {imgSrc ? (
                  <img src={imgSrc} alt={person.name || "Member"} className="w-full h-full object-cover object-top" />
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-1 text-center"
                    style={{ background: meta.bg }}
                  >
                    <Icon size={24} style={{ color: meta.color }} />
                    <span className="text-xs font-black mt-1" style={{ color: meta.color, fontFamily: "'Outfit', sans-serif" }}>
                      {(person.name || "M").split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Right Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider mb-1"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    <Icon size={10} /> {person.role || "Executive"}
                  </span>
                  <h3
                    className="text-lg font-black text-white truncate leading-tight"
                    style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                  >
                    {person.name || "—"}
                  </h3>
                  {person.department && (
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin size={10} className="text-cyan-400 shrink-0" />
                      {person.department}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                  <span className="text-[10px] text-slate-500 font-medium">{meta.tagline}</span>
                  <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: meta.color }}>
                    View <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  PROFILE MODAL
// ════════════════════════════════════════════════════════════════════
const ProfileModal = ({ person, onClose }: { person: OfficePerson | null; onClose: () => void }) => {
  const [err, setErr] = useState(false);
  if (!person) return null;
  const meta = getMeta(person.role);
  const Icon = meta.icon;
  const img = err
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || "M")}&background=111827&color=22d3ee&size=512&bold=true&format=png`
    : getImg(person);
  const linkedin = person.linkedin_url || person.linkedin || null;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(2, 4, 12, 0.90)", backdropFilter: "blur(24px)" }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 25 }}
        transition={{ type: "spring", damping: 25, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-sm max-h-[92vh] flex flex-col rounded-t-[2rem] sm:rounded-[2.25rem] overflow-hidden border shadow-2xl"
        style={{
          background: "linear-gradient(170deg, #0e1526 0%, #060913 100%)",
          borderColor: `${meta.color}45`,
          boxShadow: `0 25px 60px -10px rgba(0,0,0,0.95), 0 0 30px ${meta.color}20`,
        }}
      >
        {/* Mobile Drag Handle */}
        <div className="flex justify-center pt-2.5 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Top Glow Bar */}
        <div className="h-1 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}80, transparent)` }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/70 text-white border border-white/15 transition-all backdrop-blur-md shadow-lg"
        >
          <X size={16} />
        </button>

        {/* Full Image Container */}
        <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-slate-950 shrink-0">
          <img
            src={img}
            alt={person.name || "Member"}
            className="w-full h-full object-cover object-top"
            onError={() => setErr(true)}
          />
          {/* Top subtle overlay shadow for close button clarity */}
          <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

          {/* Bottom gradient transition into card body */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0e1526] via-[#0e1526]/70 to-transparent pointer-events-none" />

          {/* Floating Role badge positioned over bottom of poster */}
          <div className="absolute bottom-3 left-5 z-10">
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider border shadow-xl backdrop-blur-md"
              style={{ background: meta.bg, borderColor: `${meta.color}70`, color: meta.color }}
            >
              <Icon size={12} /> {person.role || "Officer"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-6 pt-1 flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-between">
          <div>
            {/* Member Name */}
            <h2
              className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-1"
              style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
            >
              {person.name || "Member"}
            </h2>

            {/* Department */}
            {person.department && (
              <p className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <MapPin size={13} className="text-cyan-400 shrink-0" />
                {person.department}
              </p>
            )}

            {/* Tagline */}
            <p className="text-xs sm:text-sm italic text-slate-400 mb-4 font-normal">
              "{meta.tagline}"
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 backdrop-blur-sm">
                <CheckCircle2 size={13} className="text-cyan-400" /> Verified Member
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 backdrop-blur-sm">
                <ShieldCheck size={13} className="text-purple-400" /> IEEE SREC 2026
              </span>
            </div>
          </div>

          {/* CTA LinkedIn Button */}
          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-1"
              style={{
                background: "linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)",
                boxShadow: "0 8px 25px -5px rgba(0, 119, 181, 0.5)",
              }}
            >
              <Linkedin size={18} /> Connect on LinkedIn <ExternalLink size={14} />
            </a>
          ) : (
            <div className="w-full flex items-center justify-center py-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-500 text-sm font-medium mt-1">
              No public social link
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ════════════════════════════════════════════════════════════════════
const OfficeBearersPage = () => {
  const YEAR = 2026;
  const [bearers, setBearers] = useState<OfficePerson[]>([]);
  const [execs, setExecs] = useState<OfficePerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<OfficePerson | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("carousel");

  // Desktop-only: filter/search state
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "leadership" | "core" | "tech_design" | "exec">("all");
  const [section, setSection] = useState<"bearers" | "execs">("bearers");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [b1, e1, b2, e2] = await Promise.all([
          supabase.from("office_bearers").select("*"),
          supabase.from("executive_members").select("*"),
          supabase.from("new_office_bearers").select("*"),
          supabase.from("new_executive_members").select("*"),
        ]);
        const bData = b2.data?.length ? b2.data : (b1.data?.length ? b1.data : []);
        const eData = e2.data?.length ? e2.data : (e1.data?.length ? e1.data : []);
        if (bData.length > 0) setBearers(bData);
        if (eData.length > 0) setExecs(eData);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const sortedBearers = useMemo(
    () => (bearers.length > 0 ? [...bearers].sort((a, b) => getMeta(a.role).priority - getMeta(b.role).priority) : REAL_BEARERS_DATA),
    [bearers]
  );
  const displayExecs = useMemo(
    () => {
      const list = execs.length > 0 ? execs : REAL_EXECS_DATA;
      return [...list].sort((a, b) => getMeta(a.role).priority - getMeta(b.role).priority);
    },
    [execs]
  );

  const allMembers = useMemo(() => [...sortedBearers, ...displayExecs], [sortedBearers, displayExecs]);

  // Desktop filtered list for carousel
  const desktopFiltered = useMemo(() => {
    const members = section === "bearers" ? sortedBearers : displayExecs;
    const t = search.toLowerCase().trim();
    return members.filter((m) => {
      const meta = getMeta(m.role);
      const matchTab = tab === "all" || meta.category === tab;
      const matchSearch = !t || (m.name || "").toLowerCase().includes(t) || (m.role || "").toLowerCase().includes(t) || (m.department || "").toLowerCase().includes(t);
      return matchTab && matchSearch;
    });
  }, [section, sortedBearers, displayExecs, tab, search]);

  const tabs = [
    { id: "all", label: "All", count: (section === "bearers" ? sortedBearers : displayExecs).length },
    { id: "leadership", label: "Leaders", count: (section === "bearers" ? sortedBearers : displayExecs).filter(m => getMeta(m.role).category === "leadership").length },
    { id: "core", label: "Core", count: (section === "bearers" ? sortedBearers : displayExecs).filter(m => getMeta(m.role).category === "core").length },
    { id: "tech_design", label: "Tech", count: (section === "bearers" ? sortedBearers : displayExecs).filter(m => getMeta(m.role).category === "tech_design").length },
    { id: "exec", label: "Exec", count: (section === "bearers" ? sortedBearers : displayExecs).filter(m => getMeta(m.role).category === "exec").length },
  ];

  return (
    <div
      className="min-h-screen flex flex-col relative text-white overflow-x-hidden"
      style={{ background: "linear-gradient(160deg, #04060f 0%, #090d1e 35%, #060918 65%, #04060f 100%)" }}
    >
      <style>{`
        @import url('${GFONTS}');
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      {/* ── College Campus Background Overlay ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <img
          src={srecCampus}
          alt="SREC Campus"
          className="w-full h-full object-cover opacity-[0.20] scale-105 filter brightness-90 contrast-125 saturate-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 30%, rgba(15,22,41,0.7) 0%, rgba(4,6,15,0.96) 80%)",
          }}
        />
      </div>

      <Navbar />

      {/* ══════════════════════════ HERO HEADER ══════════════════════════ */}
      <section className="relative z-10 pt-8 pb-10 text-center px-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-3 tracking-tight" style={{ fontFamily: "'Syne',sans-serif" }}>
            Office{" "}
            <span style={{ background: "linear-gradient(135deg,#22d3ee 0%,#818cf8 50%,#c084fc 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Bearers
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed mb-6">
            The visionary student leaders & dedicated officers steering IEEE SREC towards global excellence.
          </p>

          {/* View Mode Switcher Buttons */}
          <div className="inline-flex p-1.5 rounded-2xl border border-white/10" style={{ background: "rgba(15,22,41,0.8)", backdropFilter: "blur(20px)" }}>
            <button
              onClick={() => setViewMode("grid")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-lg"
              style={{
                background: viewMode === "grid" ? "linear-gradient(135deg,#22d3ee,#818cf8)" : "transparent",
                color: viewMode === "grid" ? "#000" : "rgba(255,255,255,0.6)",
              }}
            >
              <Layers size={16} /> Grid View (All Members)
            </button>
            <button
              onClick={() => setViewMode("carousel")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300"
              style={{
                background: viewMode === "carousel" ? "linear-gradient(135deg,#22d3ee,#818cf8)" : "transparent",
                color: viewMode === "carousel" ? "#000" : "rgba(255,255,255,0.6)",
              }}
            >
              <Sparkles size={16} /> 3D Carousel Showcase
            </button>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════ DESKTOP VIEW ══════════════════════════ */}
      <div className="relative z-10 hidden sm:block">
        {viewMode === "carousel" ? (
          <>
            {/* Office Bearers Carousel Section */}
            <div className="max-w-[1400px] mx-auto px-6 pb-12">
              <DesktopCarousel members={sortedBearers} onSelect={setSelected} />
            </div>

            {/* Executive Committee Carousel Section */}
            <div className="max-w-[1400px] mx-auto px-6 pt-10 pb-16 border-t border-white/10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-3">
                  <Users size={12} className="text-purple-400" />
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-widest">Executive Team</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Executive <span style={{ background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Committee</span>
                </h2>
              </div>
              <DesktopCarousel members={displayExecs} onSelect={setSelected} />
            </div>
          </>
        ) : (
          <>
            {/* Office Bearers Grid Section */}
            <div className="max-w-[1450px] mx-auto px-6 pb-16">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-3">
                  <Crown size={14} className="text-cyan-400" />
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">Core Leadership</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Office <span style={{ background: "linear-gradient(135deg, #22d3ee 0%, #818cf8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Bearers</span>
                </h2>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {sortedBearers.map((p) => (
                    <MemberBigGridBox key={String(p.id)} person={p} onSelect={setSelected} />
                  ))}
                </div>
              )}
            </div>

            {/* Executive Committee Grid Section */}
            <div className="max-w-[1450px] mx-auto px-6 pt-12 pb-20 border-t border-white/10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 mb-3">
                  <Users size={14} className="text-purple-400" />
                  <span className="text-[11px] font-bold text-purple-400 uppercase tracking-widest">Executive Team</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Executive <span style={{ background: "linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Committee</span>
                </h2>
                <p className="text-slate-400 text-sm max-w-lg mx-auto mt-2">
                  The dedicated student members supporting operations, tech, and events across IEEE SREC.
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-96">
                  <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-3.5 h-3.5 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {displayExecs.map((p) => (
                    <MemberBigGridBox key={String(p.id)} person={p} onSelect={setSelected} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ══════════════════════════ MOBILE VIEW ══════════════════════════ */}
      <div className="relative z-10 sm:hidden pb-6">
        {loading ? (
          <div className="flex items-center justify-center h-60 gap-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        ) : (
          <MobileView members={allMembers} onSelect={setSelected} />
        )}
      </div>

      {/* ══════════════════════════ CTA BANNER ══════════════════════════ */}
      <div className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center"
          style={{
            background: "linear-gradient(135deg,rgba(34,211,238,.07) 0%,rgba(129,140,248,.07) 50%,rgba(168,85,247,.07) 100%)",
            border: "1px solid rgba(34,211,238,.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,#22d3ee,#818cf8,#c084fc,transparent)" }} />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-3">
            <History size={11} className="text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">IEEE SREC Legacy</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>
            Explore Past Committees
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            Review previous office bearer councils or browse the full student member directory.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/past-bearers"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm text-slate-900 transition-all hover:scale-105 hover:shadow-xl w-full sm:w-auto justify-center"
              style={{ background: "linear-gradient(135deg,#22d3ee,#818cf8)", boxShadow: "0 8px 25px rgba(34,211,238,.25)" }}
            >
              <History size={15} /> Past Office Bearers
            </Link>
            <Link to="/team"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-sm text-cyan-300 transition-all hover:scale-105 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 w-full sm:w-auto justify-center"
            >
              <Users size={15} /> Full Student Directory
            </Link>
          </div>
        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selected && <ProfileModal person={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default OfficeBearersPage;
