import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout";
import Footer from "@/components/layout";
import { supabase } from "@/lib/supabase";
import {
  Linkedin,
  History,
  Users,
  ChevronLeft,
  ChevronRight,
  Crown,
  FileText,
  Wallet,
  PenTool,
  Code2,
  Cpu,
  Palette,
  Share2,
  CalendarDays,
  Star,
  GraduationCap,
  FileEdit,
  Sparkles,
  Search,
  X,
  Layers,
  Trophy,
  MapPin,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Maximize2,
  Sparkle,
  Award,
  Flame,
  LayoutGrid,
  SlidersHorizontal,
  Info,
} from "lucide-react";
import srecCampus from "@/assets/srec-campus.png";
import ieeeDayGroupPhoto from "@/assets/ieee-day-2026-office-bearers.png";

// ─── FONTS & STYLES ──────────────────────────────────────────────────
const GFONTS =
  "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&family=Syne:wght@700;800&family=Inter:wght@400;500;600;700&display=swap";

// ─── ROLE METADATA MATRIX ─────────────────────────────────────────────
const ROLES = [
  {
    match: [
      "counsellor",
      "counselor",
      "faculty coordinator",
      "faculty advisor",
      "branch counselor",
      "student branch counsellor",
      "advisor",
    ],
    meta: {
      priority: 0,
      category: "faculty",
      tagline: "Student Branch Counsellor & Chief Mentor",
      badge: "Faculty Mentor",
      icon: GraduationCap,
      color: "#a78bfa",
      glow: "rgba(167,139,250,.6)",
      bg: "rgba(167,139,250,.14)",
      border: "rgba(167,139,250,.45)",
    },
  },
  {
    match: ["chairperson", "chair", "president"],
    meta: {
      priority: 1,
      category: "leadership",
      tagline: "Supreme Student Leader & Branch Chair",
      badge: "Executive Chair",
      icon: Crown,
      color: "#fbbf24",
      glow: "rgba(251,191,36,.6)",
      bg: "rgba(251,191,36,.14)",
      border: "rgba(251,191,36,.45)",
    },
  },
  {
    match: ["vice chair", "vice-chair", "vice chairperson", "vice president"],
    meta: {
      priority: 2,
      category: "leadership",
      tagline: "Strategic Growth Driver & Vice Chair",
      badge: "Vice Chair",
      icon: Trophy,
      color: "#34d399",
      glow: "rgba(52,211,153,.6)",
      bg: "rgba(52,211,153,.14)",
      border: "rgba(52,211,153,.45)",
    },
  },
  {
    match: ["secretary", "secretariat"],
    meta: {
      priority: 3,
      category: "core",
      tagline: "Governance, Operations & Secretariat",
      badge: "Secretary",
      icon: FileText,
      color: "#38bdf8",
      glow: "rgba(56,189,248,.6)",
      bg: "rgba(56,189,248,.14)",
      border: "rgba(56,189,248,.45)",
    },
  },
  {
    match: ["treasurer", "finance"],
    meta: {
      priority: 4,
      category: "core",
      tagline: "Financial Guardian & Resource Custodian",
      badge: "Treasurer",
      icon: Wallet,
      color: "#fb923c",
      glow: "rgba(251,146,60,.6)",
      bg: "rgba(251,146,60,.14)",
      border: "rgba(251,146,60,.45)",
    },
  },
  {
    match: ["joint secretary"],
    meta: {
      priority: 5,
      category: "core",
      tagline: "Operations & Administration Lead",
      badge: "Joint Secretary",
      icon: FileEdit,
      color: "#38bdf8",
      glow: "rgba(56,189,248,.6)",
      bg: "rgba(56,189,248,.14)",
      border: "rgba(56,189,248,.45)",
    },
  },
  {
    match: ["web designer", "webmaster", "tech lead", "technical head"],
    meta: {
      priority: 6,
      category: "tech_design",
      tagline: "Digital Architect & Systems Master",
      badge: "Webmaster",
      icon: Code2,
      color: "#22d3ee",
      glow: "rgba(34,211,238,.6)",
      bg: "rgba(34,211,238,.14)",
      border: "rgba(34,211,238,.45)",
    },
  },
  {
    match: ["editor", "editorial", "publications"],
    meta: {
      priority: 7,
      category: "tech_design",
      tagline: "Editorial Director & Newsletter Curator",
      badge: "Editor",
      icon: PenTool,
      color: "#f472b6",
      glow: "rgba(244,114,182,.6)",
      bg: "rgba(244,114,182,.14)",
      border: "rgba(244,114,182,.45)",
    },
  },
  {
    match: ["activities coordinator", "event coordinator", "activity coordinator"],
    meta: {
      priority: 8,
      category: "tech_design",
      tagline: "Events & Program Orchestrator",
      badge: "Activities Lead",
      icon: CalendarDays,
      color: "#fde047",
      glow: "rgba(253,224,71,.6)",
      bg: "rgba(253,224,71,.14)",
      border: "rgba(253,224,71,.45)",
    },
  },
  {
    match: ["joint activity", "joint event", "deputy activity"],
    meta: {
      priority: 9,
      category: "tech_design",
      tagline: "Co-Orchestrator of Branch Initiatives",
      badge: "Joint Activities",
      icon: Sparkle,
      color: "#e879f9",
      glow: "rgba(232,121,249,.6)",
      bg: "rgba(232,121,249,.14)",
      border: "rgba(232,121,249,.45)",
    },
  },
  {
    match: ["creative executive", "design exec"],
    meta: {
      priority: 10,
      category: "exec",
      tagline: "Visual Identity & Creative Lead",
      badge: "Creative Exec",
      icon: Palette,
      color: "#ec4899",
      glow: "rgba(236,72,153,.6)",
      bg: "rgba(236,72,153,.14)",
      border: "rgba(236,72,153,.45)",
    },
  },
  {
    match: ["events executive", "activity exec"],
    meta: {
      priority: 11,
      category: "exec",
      tagline: "Events & Logistics Coordinator",
      badge: "Events Exec",
      icon: CalendarDays,
      color: "#f59e0b",
      glow: "rgba(245,158,11,.6)",
      bg: "rgba(245,158,11,.14)",
      border: "rgba(245,158,11,.45)",
    },
  },
  {
    match: ["executive member", "exec member"],
    meta: {
      priority: 12,
      category: "exec",
      tagline: "Executive Committee Member",
      badge: "Executive",
      icon: ShieldCheck,
      color: "#818cf8",
      glow: "rgba(129,140,248,.6)",
      bg: "rgba(129,140,248,.14)",
      border: "rgba(129,140,248,.45)",
    },
  },
];

const DEFAULT_META = {
  priority: 99,
  category: "exec",
  tagline: "Student Leader & Council Member",
  badge: "Officer",
  icon: Star,
  color: "#94a3b8",
  glow: "rgba(148,163,184,.4)",
  bg: "rgba(148,163,184,.10)",
  border: "rgba(148,163,184,.3)",
};

const getMeta = (role) => {
  if (!role) return DEFAULT_META;
  const r = role.toLowerCase();
  return ROLES.find((x) => x.match.some((m) => r.includes(m)))?.meta ?? DEFAULT_META;
};

const getImg = (p) => {
  const raw = (p.image_url || p.photo || p.photo_url || "").trim();
  if (!raw) return "";
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("data:") ||
    raw.startsWith("blob:")
  ) {
    return raw;
  }
  const safePath = raw.startsWith("/") ? raw.slice(1) : raw;
  const knownBuckets = [
    "office_bearers",
    "society_members",
    "leadership_portraits",
    "member_profiles",
    "member-avatars",
    "avatars",
    "photos",
    "societies",
    "activities",
    "gallery",
  ];
  for (const bucket of knownBuckets) {
    if (safePath.startsWith(`${bucket}/`)) {
      const subPath = safePath.slice(bucket.length + 1);
      const { data } = supabase.storage.from(bucket).getPublicUrl(subPath);
      if (data?.publicUrl) return data.publicUrl;
    }
  }
  const { data } = supabase.storage.from("office_bearers").getPublicUrl(encodeURIComponent(safePath));
  return data?.publicUrl || raw;
};

// ─── INITIAL SEED DATA FALLBACK ───────────────────────────────────────
const FALLBACK_BEARERS = [
  {
    id: 1,
    name: "Dr. K. Balamurugan",
    role: "Student Branch Counsellor",
    department: "Associate Professor / EEE",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787503822076.png",
    linkedin_url: "https://www.linkedin.com/in/dr-k-balamurugan-6536b528/",
  },
  {
    id: 13,
    name: "Darshan S",
    role: "Chairperson",
    department: "IV EEE",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787744458855.png",
    linkedin_url: "",
  },
  {
    id: 14,
    name: "D Jennifer Shobha",
    role: "Vice Chairperson",
    department: "III Civil",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787744578593.png",
    linkedin_url: "",
  },
  {
    id: 15,
    name: "R Vishnu Kaarthik",
    role: "Secretary",
    department: "III EEE",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787503896400.jpeg",
    linkedin_url: "https://www.linkedin.com/in/vishnu-kaarthik-r-436329291/",
  },
  {
    id: 5,
    name: "D R Prithika",
    role: "Treasurer",
    department: "II EEE B",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504175984.jpeg",
    linkedin_url: "",
  },
  {
    id: 6,
    name: "S Deepak",
    role: "Activities Coordinator",
    department: "IV EEE",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787503934985.jpeg",
    linkedin_url: "",
  },
  {
    id: 7,
    name: "S Amirtha Varshini",
    role: "Joint Activity Coordinator",
    department: "III CSE A",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787503956324.jpeg",
    linkedin_url: "",
  },
  {
    id: 8,
    name: "V Smrthikha",
    role: "Joint Activity Coordinator",
    department: "III BME",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787503995702.jpeg",
    linkedin_url: "",
  },
  {
    id: 9,
    name: "K S Surya Narayanan",
    role: "Webmaster",
    department: "II EEE B",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504019195.jpeg",
    linkedin_url: "https://www.linkedin.com/in/surya-narayanan-k-s-3a6509289/",
  },
  {
    id: 10,
    name: "Nithin Annamalai R",
    role: "Editor",
    department: "II EEE B",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504036446.jpeg",
    linkedin_url: "",
  },
  {
    id: 11,
    name: "S Latisha",
    role: "Editor",
    department: "III CSE B",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504089391.jpeg",
    linkedin_url: "",
  },
  {
    id: 12,
    name: "Dharshini",
    role: "Editor",
    department: "III IT A",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504138402.jpeg",
    linkedin_url: "",
  },
];

const FALLBACK_EXECS = [
  {
    id: 101,
    name: "S Mathusri",
    role: "Executive Member",
    department: "III M.Tech CSE",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787761057800.png",
    linkedin_url: "",
  },
  {
    id: 102,
    name: "A Dhivya Tharsana",
    role: "Creative Executive",
    department: "II AI & DS",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504245299.jpeg",
    linkedin_url: "",
  },
  {
    id: 103,
    name: "M Barath",
    role: "Events Executive",
    department: "II EEE A",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504266686.jpeg",
    linkedin_url: "",
  },
  {
    id: 104,
    name: "F Mohammed Aathif",
    role: "Executive Member",
    department: "II EEE A",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504281472.jpeg",
    linkedin_url: "",
  },
  {
    id: 105,
    name: "Bhargavan Balaji",
    role: "Executive Member",
    department: "II EEE A",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504727465.png",
    linkedin_url: "",
  },
  {
    id: 106,
    name: "R Srenithi",
    role: "Executive Member",
    department: "III M.Tech CSE",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504298184.jpeg",
    linkedin_url: "",
  },
  {
    id: 107,
    name: "V Swetha",
    role: "Executive Member",
    department: "III EIE",
    academic_year: "2026-2027",
    image_url:
      "https://wlbgdlolgjccvbuvutiw.supabase.co/storage/v1/object/public/office_bearers/leadership/society-srec-1787504316490.jpeg",
    linkedin_url: "",
  },
];

// ════════════════════════════════════════════════════════════════════
//  COMMEMORATIVE IMAGE LIGHTBOX
// ════════════════════════════════════════════════════════════════════
const ImageLightboxModal = ({ src, title, subtitle, date, venue, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-6"
      style={{
        background: "rgba(3, 7, 18, 0.94)",
        backdropFilter: "blur(28px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-6xl w-full max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#0a0f1d] shadow-[0_0_80px_rgba(34,211,238,0.2)]"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <h4 className="text-white font-bold text-sm sm:text-base">{title}</h4>
              <p className="text-slate-400 text-xs">
                {date} • {venue}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Image Preview Container */}
        <div className="relative flex-1 overflow-hidden flex items-center justify-center p-2 sm:p-4 bg-slate-950/60">
          <img
            src={src}
            alt={title}
            className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
          />
        </div>

        {/* Bottom Banner */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Award size={15} className="text-amber-400" />
            <span>Official Induction & Commemoration of the IEEE Student Branch Council</span>
          </div>
          <a
            href={src}
            download="IEEE-SREC-Day-2026-Council.png"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-bold transition-all"
          >
            Open Original File <ExternalLink size={12} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  COMMEMORATIVE COUNCIL PHOTO HERO SHOWCASE
// ════════════════════════════════════════════════════════════════════
const CouncilCommemorativeSpotlight = ({ onOpenLightbox }) => {
  return (
    <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 mb-16">
      <div
        className="relative rounded-3xl overflow-hidden border border-white/15 p-1 sm:p-2 backdrop-blur-2xl transition-all duration-500 shadow-2xl"
        style={{
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(9,13,28,0.92) 50%, rgba(17,24,39,0.85) 100%)",
          boxShadow:
            "0 25px 60px -15px rgba(0,0,0,0.8), 0 0 40px rgba(34,211,238,0.12)",
        }}
      >
        {/* Top Decorative Header */}
        <div className="px-5 py-4 sm:px-8 sm:py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-md">
                <Crown size={12} /> Milestone Commemoration
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                <CalendarDays size={12} /> 06.10.2026 • IEEE Day 2026
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-500/10 border border-purple-500/30 text-purple-300">
                <ShieldCheck size={12} /> STB32131
              </span>
            </div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              The Executive Council{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #22d3ee 0%, #818cf8 50%, #c084fc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                In Action
              </span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Student Branch Counsellor Dr. K. Balamurugan alongside the elected Office Bearers
              and Executive Committee at Sri Ramakrishna Engineering College on IEEE Day 2026.
            </p>
          </div>

          <button
            onClick={onOpenLightbox}
            className="self-start md:self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold uppercase tracking-wider bg-white/10 hover:bg-cyan-500 hover:text-slate-950 border border-white/20 text-white transition-all duration-300 shadow-lg group shrink-0"
          >
            <Maximize2
              size={15}
              className="group-hover:scale-110 transition-transform text-cyan-400 group-hover:text-slate-950"
            />
            <span>View Full Portrait</span>
          </button>
        </div>

        {/* Featured Image Area */}
        <div
          onClick={onOpenLightbox}
          className="relative group cursor-pointer overflow-hidden rounded-2xl m-2 sm:m-3 border border-white/10 bg-slate-950"
        >
          <img
            src={ieeeDayGroupPhoto}
            alt="IEEE Day 2026 Office Bearers & Student Council - Sri Ramakrishna Engineering College"
            className="w-full h-auto max-h-[560px] object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />

          {/* Top/Bottom Gradient Shadows for Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

          {/* Hover Hint Overlay */}
          <div className="absolute inset-0 bg-cyan-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950/90 text-white border border-cyan-400/40 text-xs font-bold uppercase tracking-widest shadow-2xl backdrop-blur-md">
              <Maximize2 size={14} className="text-cyan-400" /> Click to Expand Full View
            </span>
          </div>

          {/* Photo Bottom Caption Bar */}
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Users size={20} />
              </div>
              <div>
                <p className="text-white font-bold text-xs sm:text-sm">
                  IEEE Student Branch STB32131 • 2026 - 2027 Executive Assembly
                </p>
                <p className="text-slate-400 text-[11px]">
                  Sri Ramakrishna Engineering College, Coimbatore • 25 Years of Student Excellence
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300 self-end sm:self-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Full Leadership Delegation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  FACULTY COUNSELLOR SPOTLIGHT BANNER
// ════════════════════════════════════════════════════════════════════
const CounselorSpotlightCard = ({ counselor, onSelect }) => {
  if (!counselor) return null;
  const meta = getMeta(counselor.role);
  const imgSrc = getImg(counselor);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      onClick={() => onSelect(counselor)}
      className="group relative rounded-3xl overflow-hidden p-6 sm:p-8 border cursor-pointer transition-all duration-300 shadow-2xl mb-12"
      style={{
        background:
          "linear-gradient(135deg, rgba(26,16,60,0.75) 0%, rgba(15,22,41,0.85) 60%, rgba(10,14,30,0.95) 100%)",
        borderColor: "rgba(167,139,250,0.45)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.6), 0 0 35px rgba(167,139,250,0.15)",
      }}
    >
      {/* Background Ambient Glow */}
      <div
        className="absolute -right-20 -top-20 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: meta.color }}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        {/* Counselor Avatar Image */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shrink-0 border-2 shadow-2xl group-hover:scale-105 transition-transform duration-500" style={{ borderColor: meta.color }}>
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={counselor.name}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-4 text-center"
              style={{ background: meta.bg }}
            >
              <GraduationCap size={44} style={{ color: meta.color }} />
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-md backdrop-blur-md"
              style={{ background: meta.bg, borderColor: meta.color, color: meta.color }}
            >
              Mentor
            </span>
          </div>
        </div>

        {/* Details & Quote */}
        <div className="flex-1 text-center md:text-left min-w-0">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border backdrop-blur-md" style={{ background: meta.bg, borderColor: meta.border, color: meta.color }}>
            <GraduationCap size={14} /> Student Branch Counsellor (STB32131)
          </div>

          <h3
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white group-hover:text-purple-300 transition-colors tracking-tight leading-tight mb-2"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            {counselor.name}
          </h3>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm text-slate-300 font-medium mb-4">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <MapPin size={14} /> {counselor.department || "AsP / EEE, Sri Ramakrishna Engineering College"}
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="text-purple-300 font-semibold">Tenure: {counselor.academic_year || "2026 - 2027"}</span>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed max-w-3xl mb-5">
            "Guiding young engineering minds to cultivate pioneering solutions, global standards of research, and exemplary leadership under the IEEE umbrella."
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all duration-300 group-hover:shadow-purple-500/30"
              style={{ background: meta.color, color: "#000" }}
            >
              View Mentor Profile <ExternalLink size={13} />
            </button>
            {counselor.linkedin_url && (
              <a
                href={counselor.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-[#0077b5]/20 hover:bg-[#0077b5]/30 text-[#00a0dc] border border-[#0077b5]/40 transition-all"
              >
                <Linkedin size={14} /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  EXECUTIVE CARD (STREAMLINED & ELEVATED DESIGN)
// ════════════════════════════════════════════════════════════════════
const ModernExecutiveCard = ({ person, onSelect, isProminent = false }) => {
  const meta = getMeta(person.role);
  const Icon = meta.icon;
  const [err, setErr] = useState(false);
  const imgSrc = getImg(person);
  const showFallback = err || !imgSrc;

  const academicYear =
    person.academic_year === "2024-2026" || !person.academic_year
      ? "2026–2027"
      : person.academic_year;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.25 }}
      onClick={() => onSelect(person)}
      className="group relative w-full rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-end border transition-all duration-300 shadow-xl"
      style={{
        height: isProminent ? "520px" : "480px",
        borderColor: "rgba(255,255,255,0.12)",
        background: "rgba(15,22,41,0.85)",
        boxShadow: `0 15px 35px rgba(0,0,0,0.5), 0 0 20px ${meta.glow ? meta.color + "15" : "transparent"}`,
      }}
    >
      {/* Background Portrait */}
      {!showFallback ? (
        <img
          src={imgSrc}
          alt={person.name || "Member"}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setErr(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center transition-transform duration-700 group-hover:scale-105"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${meta.color}25 0%, rgba(15,22,41,0.95) 75%)`,
          }}
        >
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 border shadow-2xl"
            style={{ background: meta.bg, borderColor: `${meta.color}50`, color: meta.color }}
          >
            <Icon size={38} />
          </div>
          <p
            className="text-2xl font-black tracking-tight"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif", color: meta.color }}
          >
            {(person.name || "M")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 3)}
          </p>
        </div>
      )}

      {/* Layered Gradient Overlays for High-Contrast Text - gently faded so entire portrait/poster is visible */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/35 to-transparent pointer-events-none" />

      {/* Active Glowing Border on Hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"
        style={{ border: `2px solid ${meta.color}` }}
      />

      {/* Role Pill Badge (Top Left) */}
      <div className="absolute top-4 left-4 z-10">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md border shadow-lg"
          style={{ background: meta.bg, borderColor: `${meta.color}70`, color: meta.color }}
        >
          <Icon size={12} /> {person.role || "Executive"}
        </span>
      </div>

      {/* Academic Year Tag (Top Right) */}
      <div className="absolute top-4 right-4 z-10">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-200 bg-slate-950/80 border border-white/15 backdrop-blur-md">
          {academicYear}
        </span>
      </div>

      {/* Card Info Details (Bottom) - Center Aligned */}
      <div className="relative z-10 p-5 sm:p-6 flex flex-col items-center text-center">
        <h3
          className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight leading-snug mb-1 text-center"
          style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
        >
          {person.name || "—"}
        </h3>

        {person.department && (
          <p className="text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5 mb-3.5 text-center">
            <MapPin size={13} className="text-cyan-400 shrink-0" />
            {person.department}
          </p>
        )}

        <div className="w-full flex items-center justify-center gap-2 pt-2 border-t border-white/10">
          <button
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-lg"
            style={{
              background: meta.color,
              color: "#000",
            }}
          >
            Profile <ExternalLink size={12} />
          </button>
          {person.linkedin_url && (
            <a
              href={person.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-xl bg-white/10 hover:bg-[#0077b5] text-white border border-white/15 transition-all"
              title="Connect on LinkedIn"
            >
              <Linkedin size={15} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  DESKTOP CENTER-FOCUS CAROUSEL
// ════════════════════════════════════════════════════════════════════
const DesktopCarousel = ({ members, onSelect }) => {
  const [active, setActive] = useState(0);
  const total = members.length;
  const prev = useCallback(() => setActive((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((i) => (i + 1) % total), [total]);

  // Auto-advance
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      next();
    }, 5500);
    return () => clearInterval(timer);
  }, [next, total, active]);

  // Keyboard navigation
  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next]);

  const getSlot = (idx) => {
    const diff = (idx - active + total) % total;
    if (diff === 0) return "center";
    if (diff === 1) return "right1";
    if (diff === total - 1) return "left1";
    if (diff === 2) return "right2";
    if (diff === total - 2) return "left2";
    return "hidden";
  };

  const SLOT_STYLE = {
    center: {
      transform: "translateX(0%) scale(1.05)",
      opacity: 1,
      zIndex: 10,
      filter: "brightness(1) contrast(1.05)",
    },
    left1: {
      transform: "translateX(-68%) scale(0.84)",
      opacity: 0.85,
      zIndex: 8,
      filter: "brightness(0.75)",
    },
    right1: {
      transform: "translateX(68%) scale(0.84)",
      opacity: 0.85,
      zIndex: 8,
      filter: "brightness(0.75)",
    },
    left2: {
      transform: "translateX(-128%) scale(0.68)",
      opacity: 0.5,
      zIndex: 6,
      filter: "brightness(0.5) blur(1px)",
    },
    right2: {
      transform: "translateX(128%) scale(0.68)",
      opacity: 0.5,
      zIndex: 6,
      filter: "brightness(0.5) blur(1px)",
    },
    hidden: {
      transform: "translateX(0%) scale(0.4)",
      opacity: 0,
      zIndex: 1,
      pointerEvents: "none",
    },
  };

  if (total === 0) return null;

  return (
    <div className="relative w-full select-none">
      {/* Track */}
      <div className="relative h-[560px] flex items-center justify-center overflow-visible">
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
              style={{ position: "absolute", zIndex: style.zIndex, width: "360px" }}
              onClick={() => (isCenter ? onSelect(p) : slot !== "hidden" && setActive(idx))}
              className="cursor-pointer"
            >
              <CarouselCard person={p} isCenter={isCenter} meta={meta} />
            </motion.div>
          );
        })}
      </div>

      {/* Control Dock */}
      <div className="mt-6 max-w-[1000px] mx-auto px-4">
        <div
          className="relative rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-6 border backdrop-blur-2xl transition-all duration-500 shadow-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,22,41,0.92) 0%, rgba(8,12,24,0.95) 100%)",
            borderColor: `${getMeta(members[active].role).color}40`,
            boxShadow: "0 15px 35px rgba(0,0,0,0.6)",
          }}
        >
          {/* Active Member Details */}
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
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border"
                      style={{
                        background: meta.bg,
                        borderColor: `${meta.color}60`,
                        color: meta.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border"
                          style={{
                            background: meta.bg,
                            borderColor: `${meta.color}50`,
                            color: meta.color,
                          }}
                        >
                          {p.role || "Officer"}
                        </span>
                        {p.department && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium truncate">
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

          {/* Controls */}
          <div className="flex items-center gap-3 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/10">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all hover:scale-110 active:scale-95 bg-white/5 hover:bg-white/15"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
              title="Previous"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>

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

            <button
              onClick={next}
              className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all hover:scale-110 active:scale-95 bg-white/5 hover:bg-white/15"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
              title="Next"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CarouselCard = ({ person, isCenter, meta }) => {
  const [err, setErr] = useState(false);
  const imgSrc = getImg(person);
  const showFallback = err || !imgSrc;
  const Icon = meta.icon;

  return (
    <div
      className="relative rounded-3xl overflow-hidden group transition-all duration-300"
      style={{
        height: isCenter ? "500px" : "420px",
        transition: "height 0.4s ease, border-color 0.4s ease",
        border: isCenter ? `2px solid ${meta.color}` : `1px solid ${meta.color}50`,
        boxShadow: isCenter ? "0 25px 50px rgba(0,0,0,0.7)" : "0 10px 25px rgba(0,0,0,0.4)",
      }}
    >
      {!showFallback ? (
        <img
          src={imgSrc}
          alt={person.name || "Member"}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          onError={() => setErr(true)}
        />
      ) : (
        <div
          className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${meta.color}35 0%, rgba(15,22,41,0.95) 80%)`,
          }}
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
            {(person.name || "M")
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 3)}
          </p>
        </div>
      )}

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isCenter
            ? "linear-gradient(to top, rgba(4,6,15,0.95) 0%, rgba(4,6,15,0.3) 50%, transparent 85%)"
            : "linear-gradient(to top, rgba(4,6,15,0.88) 0%, rgba(4,6,15,0.25) 55%, transparent 85%)",
        }}
      />

      {/* Role Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md shadow-lg"
          style={{ background: meta.bg, borderColor: `${meta.color}60`, color: meta.color }}
        >
          <Icon size={10} /> {person.role || "Officer"}
        </span>
      </div>

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
//  PROFILE MODAL (WITH NEXT / PREV NAVIGATION)
// ════════════════════════════════════════════════════════════════════
const ProfileModal = ({ person, allMembers, onSelect, onClose }) => {
  const [err, setErr] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!person) return null;

  const currentIndex = allMembers.findIndex((m) => m.id === person.id);
  const prevPerson = currentIndex > 0 ? allMembers[currentIndex - 1] : allMembers[allMembers.length - 1];
  const nextPerson = currentIndex < allMembers.length - 1 ? allMembers[currentIndex + 1] : allMembers[0];

  const meta = getMeta(person.role);
  const Icon = meta.icon;
  const img = err
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || "M")}&background=111827&color=22d3ee&size=512&bold=true&format=png`
    : getImg(person);
  const linkedin = person.linkedin_url || person.linkedin || null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6"
      style={{ background: "rgba(2, 4, 12, 0.92)", backdropFilter: "blur(24px)" }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 25 }}
        transition={{ type: "spring", damping: 25, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border shadow-2xl"
        style={{
          background: "linear-gradient(170deg, #0e1526 0%, #060913 100%)",
          borderColor: `${meta.color}50`,
          boxShadow: `0 25px 60px -10px rgba(0,0,0,0.95), 0 0 35px ${meta.color}25`,
        }}
      >
        {/* Top Glow Bar */}
        <div
          className="h-1.5 w-full shrink-0"
          style={{ background: `linear-gradient(90deg, ${meta.color}, ${meta.color}80, transparent)` }}
        />

        {/* Top Floating Controls */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {allMembers.length > 1 && (
            <>
              <button
                onClick={() => {
                  setErr(false);
                  onSelect(prevPerson);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-all"
                title="Previous Member"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  setErr(false);
                  onSelect(nextPerson);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-all"
                title="Next Member"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-black/50 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Full Image Container */}
        <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-slate-950 shrink-0">
          <img
            src={img}
            alt={person.name || "Member"}
            className="w-full h-full object-cover object-top"
            onError={() => setErr(true)}
          />

          <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#0e1526] via-[#0e1526]/75 to-transparent pointer-events-none" />

          {/* Floating Role badge */}
          <div className="absolute bottom-3 left-5 z-10">
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-xl backdrop-blur-md"
              style={{ background: meta.bg, borderColor: `${meta.color}80`, color: meta.color }}
            >
              <Icon size={12} /> {person.role || "Officer"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-6 pt-1 flex-1 overflow-y-auto custom-scrollbar flex flex-col justify-between">
          <div>
            <h2
              className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight mb-1"
              style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
            >
              {person.name || "Member"}
            </h2>

            {person.department && (
              <p className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <MapPin size={13} className="text-cyan-400 shrink-0" />
                {person.department}
              </p>
            )}

            <p className="text-xs sm:text-sm italic text-slate-400 mb-4 font-normal">
              "{meta.tagline}"
            </p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 backdrop-blur-sm">
                <CheckCircle2 size={13} className="text-cyan-400" /> Verified Council Member
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300 backdrop-blur-sm">
                <ShieldCheck size={13} className="text-purple-400" /> IEEE SREC {person.academic_year || "2026-2027"}
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
            <div className="w-full flex items-center justify-center py-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 text-xs font-medium mt-1">
              Official IEEE SREC Student Branch Delegate
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  MAIN OFFICE BEARERS PAGE COMPONENT
// ════════════════════════════════════════════════════════════════════
export const OfficeBearersPage = () => {
  const [bearers, setBearers] = useState(FALLBACK_BEARERS);
  const [execs, setExecs] = useState(FALLBACK_EXECS);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [viewMode, setViewMode] = useState("hierarchy"); // "hierarchy" | "grid" | "carousel"

  // Search & Filter State
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");

  useEffect(() => {
    let isMounted = true;
    const load = async (isBackground = false) => {
      if (!isBackground) setLoading(true);
      try {
        const [b1, e1] = await Promise.all([
          supabase.from("srec_office_bearers").select("*"),
          supabase.from("srec_executive_members").select("*"),
        ]);
        if (!isMounted) return;
        const srecB = b1.data && b1.data.length > 0 ? b1.data : [];
        const srecE = e1.data && e1.data.length > 0 ? e1.data : [];
        if (srecB.length > 0) setBearers(srecB);
        if (srecE.length > 0) setExecs(srecE);
      } catch {
        /* Keep fallback data on network/supabase error */
      } finally {
        if (isMounted && !isBackground) {
          setLoading(false);
        }
      }
    };
    load(false);

    // Auto-refresh every 30 seconds
    const intervalId = setInterval(() => {
      load(true);
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const sortedBearers = useMemo(
    () => [...bearers].sort((a, b) => getMeta(a.role).priority - getMeta(b.role).priority),
    [bearers]
  );
  const sortedExecs = useMemo(
    () => [...execs].sort((a, b) => getMeta(a.role).priority - getMeta(b.role).priority),
    [execs]
  );
  const allMembers = useMemo(
    () => [...sortedBearers, ...sortedExecs],
    [sortedBearers, sortedExecs]
  );

  // Groupings for Hierarchy View
  const facultyCounsellor = useMemo(
    () => sortedBearers.find((m) => getMeta(m.role).category === "faculty"),
    [sortedBearers]
  );
  const presidency = useMemo(
    () => sortedBearers.filter((m) => getMeta(m.role).category === "leadership"),
    [sortedBearers]
  );
  const coreSecretariat = useMemo(
    () => sortedBearers.filter((m) => getMeta(m.role).category === "core"),
    [sortedBearers]
  );
  const techAndCreatives = useMemo(
    () => sortedBearers.filter((m) => getMeta(m.role).category === "tech_design"),
    [sortedBearers]
  );
  const execCommittee = sortedExecs;

  // Filtered members for Grid view & Mobile search
  const filteredMembers = useMemo(() => {
    const t = search.toLowerCase().trim();
    return allMembers.filter((m) => {
      const meta = getMeta(m.role);
      const matchTab = tab === "all" || meta.category === tab;
      const matchSearch =
        !t ||
        (m.name || "").toLowerCase().includes(t) ||
        (m.role || "").toLowerCase().includes(t) ||
        (m.department || "").toLowerCase().includes(t);
      return matchTab && matchSearch;
    });
  }, [allMembers, tab, search]);

  const tabs = [
    { id: "all", label: "All Members", count: allMembers.length },
    {
      id: "faculty",
      label: "Mentor",
      count: allMembers.filter((m) => getMeta(m.role).category === "faculty").length,
    },
    {
      id: "leadership",
      label: "Presidency",
      count: allMembers.filter((m) => getMeta(m.role).category === "leadership").length,
    },
    {
      id: "core",
      label: "Secretariat & Treasury",
      count: allMembers.filter((m) => getMeta(m.role).category === "core").length,
    },
    {
      id: "tech_design",
      label: "Tech & Media",
      count: allMembers.filter((m) => getMeta(m.role).category === "tech_design").length,
    },
    {
      id: "exec",
      label: "Executive Committee",
      count: allMembers.filter((m) => getMeta(m.role).category === "exec").length,
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col relative text-white overflow-x-hidden"
      style={{
        background:
          "linear-gradient(160deg, #030612 0%, #070d1e 35%, #050918 65%, #03050f 100%)",
      }}
    >
      <style>{`
        @import url('${GFONTS}');
        .no-scrollbar::-webkit-scrollbar{display:none}
        .no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}
      `}</style>

      {/* College Campus Background Texture */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <img
          src={srecCampus}
          alt="SREC Campus"
          className="w-full h-full object-cover opacity-[0.14] scale-105 filter brightness-90 contrast-125 saturate-110"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 20%, rgba(15,22,41,0.65) 0%, rgba(3,6,15,0.98) 75%)",
          }}
        />
      </div>

      <Navbar />

      {/* ══════════════════════════ HERO SECTION ══════════════════════════ */}
      <section className="relative z-10 pt-10 pb-8 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-4 shadow-lg backdrop-blur-md">
            <Sparkles size={13} className="text-cyan-400" />
            <span className="text-xs font-black text-cyan-300 uppercase tracking-widest">
              IEEE Student Branch STB32131 • Sri Ramakrishna Engineering College
            </span>
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-none mb-4 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Council &{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, #22d3ee 0%, #818cf8 50%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Office Bearers
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
            Meet the visionary faculty mentor, student officers, and executive committee members
            empowering engineering excellence and driving high-impact initiatives across IEEE SREC.
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-8 text-xs font-semibold text-slate-300">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              👑 <strong className="text-white">1</strong> Branch Counsellor
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              ⚡ <strong className="text-white">10</strong> Core Executive Officers
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              🛡️ <strong className="text-white">7</strong> Committee Executives
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
              🌐 <strong className="text-white">8</strong> Specialized Societies
            </span>
          </div>

          {/* Quick Route Switches (Branch vs Society vs Past) */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <div className="inline-flex p-1 rounded-2xl border border-white/15 bg-slate-900/80 backdrop-blur-xl">
              <span className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md">
                Student Branch (SB)
              </span>
              <Link
                to="/societies/office-bearers"
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span>Society Chapters</span>
                <ExternalLink size={12} className="text-cyan-400" />
              </Link>
            </div>

            <Link
              to="/past-bearers"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-300 transition-all hover:text-white"
            >
              <History size={13} />
              <span>Past Bearers</span>
            </Link>
          </div>

          {/* View Mode Switcher Buttons */}
          <div
            className="inline-flex p-1.5 rounded-2xl border border-white/15"
            style={{ background: "rgba(15,22,41,0.85)", backdropFilter: "blur(20px)" }}
          >
            <button
              onClick={() => setViewMode("hierarchy")}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-md"
              style={{
                background:
                  viewMode === "hierarchy"
                    ? "linear-gradient(135deg,#22d3ee,#818cf8)"
                    : "transparent",
                color: viewMode === "hierarchy" ? "#000" : "rgba(255,255,255,0.7)",
              }}
            >
              <Layers size={15} /> Executive Hierarchy
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-md"
              style={{
                background:
                  viewMode === "grid"
                    ? "linear-gradient(135deg,#22d3ee,#818cf8)"
                    : "transparent",
                color: viewMode === "grid" ? "#000" : "rgba(255,255,255,0.7)",
              }}
            >
              <LayoutGrid size={15} /> Roster Grid
            </button>
            <button
              onClick={() => setViewMode("carousel")}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 shadow-md"
              style={{
                background:
                  viewMode === "carousel"
                    ? "linear-gradient(135deg,#22d3ee,#818cf8)"
                    : "transparent",
                color: viewMode === "carousel" ? "#000" : "rgba(255,255,255,0.7)",
              }}
            >
              <Sparkles size={15} /> 3D Stage
            </button>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════ COMMEMORATIVE GROUP PHOTO SHOWCASE ══════════════════════════ */}
      <CouncilCommemorativeSpotlight onOpenLightbox={() => setLightboxOpen(true)} />

      {/* ══════════════════════════ VIEW MODE 1: EXECUTIVE HIERARCHY ══════════════════════════ */}
      {viewMode === "hierarchy" && (
        <section className="relative z-10 max-w-[1450px] mx-auto w-full px-4 sm:px-6 pb-20">
          {/* LEVEL 1: Faculty Counsellor */}
          <div className="mb-14">
            <div className="text-center md:text-left mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-500/15 border border-purple-500/35 text-purple-300 mb-2">
                <GraduationCap size={13} /> Mentorship & Patronage
              </span>
              <h2
                className="text-2xl sm:text-3xl font-black text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Faculty Leadership
              </h2>
            </div>
            <CounselorSpotlightCard
              counselor={facultyCounsellor}
              onSelect={setSelected}
            />
          </div>

          {/* LEVEL 2: Presidency & Supreme Leadership */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500/15 border border-amber-500/35 text-amber-300 mb-2">
                <Crown size={13} /> The Executive Presidency
              </span>
              <h2
                className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Branch <span className="text-amber-400">Chairperson</span> &{" "}
                <span className="text-emerald-400">Vice Chairperson</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-1">
                The apex student leaders steering operations, delegations, and branch vision.
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-stretch gap-8 max-w-4xl mx-auto">
              {presidency.map((person) => (
                <div key={String(person.id)} className="w-full sm:w-[360px] max-w-[400px] flex">
                  <ModernExecutiveCard
                    person={person}
                    onSelect={setSelected}
                    isProminent={true}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* LEVEL 3: Core Secretariat & Finance */}
          {coreSecretariat.length > 0 && (
            <div className="mb-16 pt-10 border-t border-white/10">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-500/15 border border-blue-500/35 text-blue-300 mb-2">
                  <FileText size={13} /> Operations & Finance
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Secretariat & <span className="text-orange-400">Treasury</span>
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-1">
                  Managing institutional governance, financial records, and official communications.
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 max-w-4xl mx-auto">
                {coreSecretariat.map((person) => (
                  <div key={String(person.id)} className="w-full sm:w-[320px] max-w-[340px] flex">
                    <ModernExecutiveCard
                      person={person}
                      onSelect={setSelected}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 4: Technology, Creative & Event Directorate */}
          {techAndCreatives.length > 0 && (
            <div className="mb-16 pt-10 border-t border-white/10">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 mb-2">
                  <Code2 size={13} /> Innovation & Outreach
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Webmaster, <span className="text-pink-400">Editorial</span> &{" "}
                  <span className="text-yellow-400">Events Leads</span>
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-1">
                  Crafting digital experiences, publications, technical innovations, and flagship conferences.
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 max-w-[1400px] mx-auto">
                {techAndCreatives.map((person) => (
                  <div key={String(person.id)} className="w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[280px] max-w-[320px] flex">
                    <ModernExecutiveCard
                      person={person}
                      onSelect={setSelected}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LEVEL 5: Executive Committee */}
          {execCommittee.length > 0 && (
            <div className="pt-10 border-t border-white/10">
              <div className="text-center mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-500/15 border border-purple-500/35 text-purple-300 mb-2">
                  <Users size={13} /> Committee Delegations
                </span>
                <h2
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Executive <span className="text-purple-400">Committee</span>
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm max-w-lg mx-auto mt-1">
                  The active student executives orchestrating department logistics, design, and member coordination.
                </p>
              </div>

              <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 max-w-[1400px] mx-auto">
                {execCommittee.map((person) => (
                  <div key={String(person.id)} className="w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[280px] max-w-[320px] flex">
                    <ModernExecutiveCard
                      person={person}
                      onSelect={setSelected}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════ VIEW MODE 2: ROSTER DIRECTORY GRID ══════════════════════════ */}
      {viewMode === "grid" && (
        <section className="relative z-10 max-w-[1450px] mx-auto w-full px-4 sm:px-6 pb-20">
          {/* Search & Filter Dock */}
          <div className="mb-10 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
              <div className="relative flex-1 w-full">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, role, or department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-white text-sm placeholder-slate-500 outline-none border border-white/15 focus:border-cyan-400 bg-slate-900/80 backdrop-blur-xl transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={{
                    background:
                      tab === t.id
                        ? "linear-gradient(135deg,#22d3ee,#818cf8)"
                        : "rgba(255,255,255,0.06)",
                    color: tab === t.id ? "#000" : "rgba(255,255,255,0.7)",
                    border: tab === t.id ? "none" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <span>{t.label}</span>
                  <span className="text-[10px] font-black opacity-80">({t.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          {filteredMembers.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 max-w-lg mx-auto">
              <Users size={40} className="mx-auto text-slate-500 mb-3" />
              <h3 className="text-xl font-bold text-white mb-1">No office bearers found</h3>
              <p className="text-slate-400 text-sm mb-4">
                No matching members found for "{search}". Try searching another name or reset filters.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setTab("all");
                }}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center items-stretch gap-6 sm:gap-8 max-w-[1400px] mx-auto">
              {filteredMembers.map((person) => (
                <div key={String(person.id)} className="w-full sm:w-[calc(50%-1.25rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[280px] max-w-[320px] flex">
                  <ModernExecutiveCard
                    person={person}
                    onSelect={setSelected}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ══════════════════════════ VIEW MODE 3: 3D STAGE CAROUSEL ══════════════════════════ */}
      {viewMode === "carousel" && (
        <section className="relative z-10 max-w-[1450px] mx-auto w-full px-4 sm:px-6 pb-20">
          <div className="mb-14">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 mb-2">
                <Crown size={13} /> Core Leadership Council
              </span>
              <h2
                className="text-3xl sm:text-4xl font-black text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Office Bearers Showcase
              </h2>
            </div>
            <DesktopCarousel members={sortedBearers} onSelect={setSelected} />
          </div>

          <div className="pt-10 border-t border-white/10">
            <div className="text-center mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-500/15 border border-purple-500/35 text-purple-300 mb-2">
                <Users size={13} /> Executive Delegation
              </span>
              <h2
                className="text-3xl sm:text-4xl font-black text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Executive Committee Showcase
              </h2>
            </div>
            <DesktopCarousel members={sortedExecs} onSelect={setSelected} />
          </div>
        </section>
      )}

      {/* ══════════════════════════ LEGACY & DIRECTORY CTA BANNER ══════════════════════════ */}
      <section className="relative z-10 max-w-[1400px] mx-auto w-full px-4 sm:px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl overflow-hidden p-8 sm:p-12 text-center border border-cyan-500/20 shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg,rgba(34,211,238,.07) 0%,rgba(129,140,248,.07) 50%,rgba(168,85,247,.07) 100%)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg,transparent,#22d3ee,#818cf8,#c084fc,transparent)",
            }}
          />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-3">
            <History size={11} className="text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              IEEE SREC Legacy & Records
            </span>
          </div>

          <h3
            className="text-2xl sm:text-4xl font-black text-white mb-2"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Explore Society Chapters & Past Committees
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mb-6">
            Discover the office bearers steering our specialized technical chapters (CS, WIE, PELS,
            EMBS, COMSOC, CIS, CAS, IMS) or browse our historical leadership roster.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/societies/office-bearers"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-950 transition-all hover:scale-105 shadow-xl w-full sm:w-auto justify-center"
              style={{
                background: "linear-gradient(135deg,#22d3ee,#818cf8)",
                boxShadow: "0 8px 25px rgba(34,211,238,.25)",
              }}
            >
              <Crown size={15} /> Society Office Bearers
            </Link>
            <Link
              to="/past-bearers"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-cyan-300 transition-all hover:scale-105 border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 w-full sm:w-auto justify-center"
            >
              <History size={15} /> Past Bearers Archive
            </Link>
            <Link
              to="/team"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-300 transition-all hover:scale-105 border border-white/10 bg-white/5 hover:bg-white/10 w-full sm:w-auto justify-center"
            >
              <Users size={15} /> Full Member Directory
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════ MODALS ══════════════════════════ */}
      {/* Lightbox Modal for IEEE Day 2026 Group Photo */}
      <AnimatePresence>
        {lightboxOpen && (
          <ImageLightboxModal
            src={ieeeDayGroupPhoto}
            title="IEEE Day 2026 • Official Executive Council Assembly"
            subtitle="Sri Ramakrishna Engineering College (STB32131)"
            date="October 06, 2026"
            venue="Coimbatore - 22"
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Member Profile Modal */}
      <AnimatePresence>
        {selected && (
          <ProfileModal
            person={selected}
            allMembers={allMembers}
            onSelect={setSelected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default OfficeBearersPage;
