import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/layout";
import Footer from "@/components/layout";
import { supabase } from "@/lib/supabase";
import {
  Linkedin,
  Users,
  ChevronLeft,
  ChevronRight,
  Crown,
  FileText,
  Wallet,
  PenTool,
  Code2,
  CalendarDays,
  Star,
  GraduationCap,
  Search,
  X,
  Trophy,
  MapPin,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Sparkle,
  Award,
  UserCheck
} from "lucide-react";
import srecCampus from "@/assets/srec-campus.png";
import ieee25Logo from "@/assets/ieee-25-years-logo.png";

// ─── FONTS & STYLES ──────────────────────────────────────────────────
const GFONTS =
  "https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap";

// ─── ROLE METADATA MATRIX ─────────────────────────────────────────────
const ROLES = [
  {
    match: ["counsellor", "counselor", "faculty coordinator", "faculty advisor", "branch counselor", "student branch counsellor", "advisor"],
    meta: {
      priority: 0,
      category: "faculty",
      tagline: "Student Branch Counsellor & Chief Mentor",
      badge: "Faculty Mentor",
      icon: GraduationCap,
      color: "#a78bfa",
      bg: "rgba(167,139,250,.15)",
    },
  },
  {
    match: ["chairperson", "chair", "president", "branch chair"],
    meta: {
      priority: 1,
      category: "presidency",
      tagline: "Apex Student Leader & Executive Governor",
      badge: "Chairperson",
      icon: Crown,
      color: "#fbbf24",
      bg: "rgba(251,191,36,.15)",
    },
  },
  {
    match: ["vice chairperson", "vice chair", "vice-chair", "vice president", "vice-chairperson"],
    meta: {
      priority: 2,
      category: "presidency",
      tagline: "Strategic Director & Executive Co-Lead",
      badge: "Vice Chairperson",
      icon: Trophy,
      color: "#34d399",
      bg: "rgba(52,211,153,.15)",
    },
  },
  {
    match: ["secretary", "gen sec", "general secretary"],
    meta: {
      priority: 3,
      category: "core",
      tagline: "Administrative Governor & Branch Operations Lead",
      badge: "Secretary",
      icon: FileText,
      color: "#38bdf8",
      bg: "rgba(56,189,248,.15)",
    },
  },
  {
    match: ["treasurer", "finance", "treasury", "accounts"],
    meta: {
      priority: 4,
      category: "core",
      tagline: "Fiscal Comptroller & Finance Officer",
      badge: "Treasurer",
      icon: Wallet,
      color: "#fb923c",
      bg: "rgba(251,146,60,.15)",
    },
  },
  {
    match: ["web designer", "webmaster", "tech lead", "technical head"],
    meta: {
      priority: 5,
      category: "leads",
      tagline: "Digital Systems Architect & Platform Lead",
      badge: "Webmaster",
      icon: Code2,
      color: "#22d3ee",
      bg: "rgba(34,211,238,.15)",
    },
  },
  {
    match: ["editor", "editorial", "publications"],
    meta: {
      priority: 6,
      category: "leads",
      tagline: "Editorial Director & Newsletter Curator",
      badge: "Editor",
      icon: PenTool,
      color: "#f472b6",
      bg: "rgba(244,114,182,.15)",
    },
  },
  {
    match: ["activities coordinator", "event coordinator", "activity coordinator"],
    meta: {
      priority: 7,
      category: "leads",
      tagline: "Events & Program Orchestrator",
      badge: "Activities Lead",
      icon: CalendarDays,
      color: "#fde047",
      bg: "rgba(253,224,71,.15)",
    },
  },
  {
    match: ["joint activity", "joint event", "deputy activity"],
    meta: {
      priority: 8,
      category: "leads",
      tagline: "Co-Orchestrator of Branch Initiatives",
      badge: "Joint Activities",
      icon: Sparkle,
      color: "#e879f9",
      bg: "rgba(232,121,249,.15)",
    },
  },
  {
    match: ["creative executive", "design exec"],
    meta: {
      priority: 9,
      category: "committee",
      tagline: "Visual Identity & Creative Lead",
      badge: "Creative Exec",
      icon: Star,
      color: "#ec4899",
      bg: "rgba(236,72,153,.15)",
    },
  },
  {
    match: ["events executive", "activity exec"],
    meta: {
      priority: 10,
      category: "committee",
      tagline: "Events & Logistics Coordinator",
      badge: "Events Exec",
      icon: CalendarDays,
      color: "#f59e0b",
      bg: "rgba(245,158,11,.15)",
    },
  },
  {
    match: ["executive member", "exec member"],
    meta: {
      priority: 11,
      category: "committee",
      tagline: "Executive Committee Member",
      badge: "Executive",
      icon: ShieldCheck,
      color: "#818cf8",
      bg: "rgba(129,140,248,.15)",
    },
  },
];

const DEFAULT_META = {
  priority: 99,
  category: "committee",
  tagline: "Student Leader & Council Member",
  badge: "Officer",
  icon: Star,
  color: "#94a3b8",
  bg: "rgba(148,163,184,.15)",
};

const getMeta = (role = "") => {
  const norm = role.toLowerCase().trim();
  for (const r of ROLES) {
    if (r.match.some((m) => norm.includes(m))) return r.meta;
  }
  return DEFAULT_META;
};

// ─── SAFE IMAGE RESOLVER ─────────────────────────────────────────────
const getImg = (person) => {
  if (!person) return "";
  const raw =
    person.image_url ||
    person.photo ||
    person.photo_url ||
    person.avatar_url ||
    person.avatar ||
    "";
  if (!raw || typeof raw !== "string") return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  const safePath = raw.replace(/^(\/|storage\/v1\/object\/public\/)/, "");
  const { data } = supabase.storage.from("office_bearers").getPublicUrl(encodeURIComponent(safePath));
  return data?.publicUrl || raw;
};

// ─── INITIAL SEED DATA FALLBACK (2026-2027) ───────────────────────────
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
//  CORPORATE PROFILE MODAL
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
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || "M")}&background=0b1736&color=38bdf8&size=512&bold=true&format=png`
    : getImg(person);
  const linkedin = person.linkedin_url || person.linkedin || null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[250] flex items-center justify-center p-3 sm:p-6"
      style={{ background: "rgba(2, 6, 23, 0.94)", backdropFilter: "blur(24px)" }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-gradient-to-b from-[#0b162f] to-[#040817]"
      >
        {/* Top Controls */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {allMembers.length > 1 && (
            <>
              <button
                onClick={() => {
                  setErr(false);
                  onSelect(prevPerson);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-black/60 hover:bg-cyan-600 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
                title="Previous"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  setErr(false);
                  onSelect(nextPerson);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-black/60 hover:bg-cyan-600 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
                title="Next"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-black/60 hover:bg-red-600 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Portrait Media */}
        <div className="relative w-full h-80 overflow-hidden bg-slate-950 shrink-0">
          <img
            src={img}
            alt={person.name}
            className="w-full h-full object-cover object-top"
            onError={() => setErr(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b162f] via-transparent to-black/30" />
          <div className="absolute bottom-3 left-5 z-10">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-xl backdrop-blur-md"
              style={{ background: meta.bg, borderColor: meta.color, color: meta.color }}
            >
              <Icon size={12} /> {person.role || "Officer"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <h2
            className="text-2xl font-black text-white leading-tight tracking-tight mb-1"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            {person.name}
          </h2>
          {person.department && (
            <p className="text-sm font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
              <MapPin size={13} className="text-cyan-400" />
              {person.department}
            </p>
          )}
          <p className="text-xs sm:text-sm italic text-slate-400 mb-4">
            "{meta.tagline}"
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
              <CheckCircle2 size={13} className="text-cyan-400" /> Verified Executive
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-slate-300">
              <ShieldCheck size={13} className="text-purple-400" /> Term 2026–2027
            </span>
          </div>

          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#0077b5] hover:bg-[#005e93] transition-all shadow-lg"
            >
              <Linkedin size={18} /> Connect on LinkedIn <ExternalLink size={14} />
            </a>
          ) : (
            <div className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-center text-slate-400 text-xs font-semibold">
              Official IEEE SREC Student Branch Delegate
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  MAIN CORPORATE INTRANET PORTAL COMPONENT
// ════════════════════════════════════════════════════════════════════
export const OfficeBearersPage = () => {
  const [bearers, setBearers] = useState(FALLBACK_BEARERS);
  const [execs, setExecs] = useState(FALLBACK_EXECS);
  const [, setLoading] = useState(false);
  const [activeTier, setActiveTier] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [spotlightPerson, setSpotlightPerson] = useState(FALLBACK_BEARERS[0]);

  // Fetch Supabase data
  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bRes, eRes] = await Promise.allSettled([
          supabase.from("srec_office_bearers").select("*").order("id", { ascending: true }),
          supabase.from("srec_executive_members").select("*").order("id", { ascending: true }),
        ]);

        if (!mounted) return;

        if (bRes.status === "fulfilled" && bRes.value.data && bRes.value.data.length > 0) {
          setBearers(bRes.value.data);
          setSpotlightPerson(bRes.value.data[0]);
        }
        if (eRes.status === "fulfilled" && eRes.value.data && eRes.value.data.length > 0) {
          setExecs(eRes.value.data);
        }
      } catch (e) {
        console.warn("Using fallback office bearers roster:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Combined Roster
  const allMembers = useMemo(() => {
    const combined = [...bearers, ...execs];
    return combined.sort((a, b) => getMeta(a.role).priority - getMeta(b.role).priority);
  }, [bearers, execs]);

  // Filtered by Tier and Search
  const filteredMembers = useMemo(() => {
    return allMembers.filter((m) => {
      const meta = getMeta(m.role);
      const matchesTier = activeTier === "all" || meta.category === activeTier;
      const s = search.toLowerCase().trim();
      const matchesSearch =
        !s ||
        (m.name || "").toLowerCase().includes(s) ||
        (m.role || "").toLowerCase().includes(s) ||
        (m.department || "").toLowerCase().includes(s);
      return matchesTier && matchesSearch;
    });
  }, [allMembers, activeTier, search]);

  const spotlightMeta = getMeta(spotlightPerson?.role);
  const SpotlightIcon = spotlightMeta.icon;
  const spotlightImg = getImg(spotlightPerson);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500 selection:text-black">
      <style>{`
        @import url('${GFONTS}');
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(56,189,248,0.3); border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      {/* Top Universal Navbar */}
      <Navbar />

      {/* ════════════════════════════════════════════════════════════════
          SPLIT SCREEN CORPORATE EXECUTIVE PORTAL (my IEEE SREC)
      ════════════════════════════════════════════════════════════════ */}
      <div className="pt-32 xl:pt-44 flex-1 flex flex-col lg:flex-row w-full max-w-[1920px] mx-auto">
        
        {/* ─── LEFT COLUMN: EXECUTIVE PASSPORT & SPOTLIGHT CONTROLLER (35%) ─── */}
        <aside className="w-full lg:w-[380px] xl:w-[420px] 2xl:w-[460px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 relative p-6 sm:p-8 flex flex-col justify-between overflow-hidden">
          {/* Scenic Background Texture */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <img
              src={srecCampus}
              alt="SREC Campus"
              className="w-full h-full object-cover opacity-20 filter brightness-75 contrast-125 saturate-110 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/95 via-[#06102b]/95 to-[#020512]" />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Top Brand Header: "my IEEE SREC" */}
            <div className="w-full flex items-center justify-between pb-6 border-b border-white/10 mb-8">
              <div className="flex items-center gap-3">
                <img src={ieee25Logo} alt="25 Years Logo" className="w-10 h-10 object-contain drop-shadow-md" />
                <div className="text-left">
                  <div className="text-lg font-black text-white tracking-tight flex items-center gap-1.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    my <span className="text-cyan-400">IEEE SREC</span>
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Executive Portal • STB32131
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
                2026–2027
              </span>
            </div>

            {/* Concentric Halo Circular Portrait of the Active Officer */}
            <div className="relative my-4 group cursor-pointer" onClick={() => setSelected(spotlightPerson)}>
              <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full p-1 bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_35px_rgba(6,182,212,0.45)] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 border-2 border-slate-900">
                  <img
                    src={spotlightImg}
                    alt={spotlightPerson?.name || "Officer"}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>

              <div className="absolute -bottom-2 inset-x-0 flex justify-center">
                <span
                  className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border shadow-xl backdrop-blur-md"
                  style={{ background: spotlightMeta.bg, borderColor: spotlightMeta.color, color: spotlightMeta.color }}
                >
                  <SpotlightIcon size={12} className="inline mr-1" />
                  {spotlightPerson?.role || "Leader"}
                </span>
              </div>
            </div>

            {/* Officer Details */}
            <div className="mt-6 mb-3">
              <h2
                className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
              >
                {spotlightPerson?.name}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-cyan-300 flex items-center justify-center gap-1.5 mt-1.5">
                <MapPin size={13} /> {spotlightPerson?.department || "Sri Ramakrishna Engineering College"}
              </p>
            </div>

            {/* Clean Institutional Credentials Tag */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-semibold bg-white/10 border border-white/15 text-slate-300 flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-cyan-400" /> STB32131 Official
              </span>
              {spotlightPerson?.linkedin_url && (
                <a
                  href={spotlightPerson.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-full bg-white/10 hover:bg-[#0077b5] text-white border border-white/15 transition-colors"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={12} />
                </a>
              )}
            </div>
          </div>

          {/* Left Footer Desk Links */}
          <div className="relative z-10 pt-6 mt-8 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <Link to="/about" className="hover:text-cyan-400 transition-colors">About Branch</Link>
            <span>•</span>
            <Link to="/societies/office-bearers" className="hover:text-cyan-400 transition-colors">Societies</Link>
            <span>•</span>
            <Link to="/past-bearers" className="hover:text-cyan-400 transition-colors">Past Archives</Link>
          </div>
        </aside>

        {/* ─── RIGHT COLUMN: MAIN ROSTER WORKSPACE WITH WHITE BACKGROUND GLASS EFFECT (65%) ─── */}
        <main className="flex-1 flex flex-col bg-slate-100/95 backdrop-blur-3xl overflow-y-auto custom-scrollbar border-l border-slate-200/80">
          
          {/* 1. Top Corporate Navigation Bar (Solid Executive Teal / Blue) */}
          <div className="bg-[#0284c7] text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-sm border-b border-sky-600/30">
            <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
              <span className="font-black text-sm uppercase tracking-wider flex items-center gap-2 shrink-0">
                <Crown size={16} /> Executive Council 2026–2027
              </span>
              <div className="h-4 w-[1px] bg-white/30 shrink-0" />
              <Link to="/societies/office-bearers" className="text-xs font-bold text-white/85 hover:text-white flex items-center gap-1.5 shrink-0 transition-colors">
                <Users size={14} /> Society Chapters
              </Link>
              <Link to="/activities" className="text-xs font-bold text-white/85 hover:text-white flex items-center gap-1.5 shrink-0 transition-colors">
                <CalendarDays size={14} /> IEEE Day & Sportz Day
              </Link>
              <Link to="/awards" className="text-xs font-bold text-white/85 hover:text-white flex items-center gap-1.5 shrink-0 transition-colors">
                <Award size={14} /> Accolades
              </Link>
            </div>

            <span className="text-[11px] font-mono font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
              {filteredMembers.length} Members
            </span>
          </div>

          {/* 2. White Frosted Glass Search & Category Filter Dock */}
          <div className="p-6 pb-4 flex flex-col gap-4 border-b border-slate-200/90 bg-white/80 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by officer name, role, department..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all shadow-sm"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Quick Status */}
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium self-end sm:self-center">
                <span>Showing:</span>
                <span className="text-slate-900 font-bold uppercase tracking-wider">{activeTier === "all" ? "Full Council" : activeTier}</span>
                <span className="text-slate-400">({filteredMembers.length})</span>
              </div>
            </div>

            {/* Category Filter Pills (Moved cleanly to filter bar) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
              {[
                { id: "all", label: "All Council", icon: Users },
                { id: "faculty", label: "Mentor", icon: GraduationCap },
                { id: "presidency", label: "Chairs", icon: Crown },
                { id: "core", label: "Core Office", icon: FileText },
                { id: "leads", label: "Branch Leads", icon: CalendarDays },
                { id: "committee", label: "Executive Comm.", icon: ShieldCheck },
                { id: "tech_design", label: "Web", icon: Code2 },
                { id: "editorial", label: "Editor", icon: PenTool },
              ].map((tier) => {
                const TierIcon = tier.icon;
                const isActive = activeTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    onClick={() => setActiveTier(tier.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? "bg-sky-600 border-sky-600 text-white shadow-sm"
                        : "bg-white/90 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 hover:border-slate-300"
                    }`}
                  >
                    <TierIcon size={13} />
                    <span>{tier.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. The Leadership Cards Grid with White Background Glass Effect */}
          <div className="p-6 flex-1">
            <div className="flex flex-wrap justify-center items-stretch gap-5">
              {filteredMembers.map((person) => {
                const meta = getMeta(person.role);
                const Icon = meta.icon;
                const isSelected = spotlightPerson?.id === person.id;
                const imgSrc = getImg(person);

                return (
                  <motion.div
                    key={String(person.id)}
                    whileHover={{ y: -4 }}
                    onClick={() => setSpotlightPerson(person)}
                    className={`w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(50%-0.75rem)] xl:w-[250px] 2xl:w-[270px] rounded-2xl p-3.5 flex flex-col justify-between border cursor-pointer transition-all duration-300 backdrop-blur-xl ${
                      isSelected
                        ? "bg-white border-sky-500 shadow-[0_12px_35px_rgba(2,132,199,0.22)] ring-2 ring-sky-400/40"
                        : "bg-white/90 hover:bg-white border-slate-200/90 hover:border-sky-300 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_rgba(2,132,199,0.12)]"
                    }`}
                  >
                    {/* Portrait Frame - 100% Uncropped Visibility */}
                    <div className="relative w-full aspect-[4/4.8] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/80 mb-3 shadow-inner">
                      <img
                        src={imgSrc}
                        alt={person.name}
                        className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-2 left-2">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border shadow-md"
                          style={{ background: meta.bg, borderColor: meta.color, color: meta.color }}
                        >
                          <Icon size={10} className="inline mr-1" />
                          {person.role || "Officer"}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-700 bg-white/90 border border-slate-200/80 backdrop-blur-md shadow-xs">
                          2026–2027
                        </span>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="text-center px-1 flex-1 flex flex-col justify-between">
                      <div>
                        <h4
                          className="font-black text-slate-900 text-base leading-snug truncate hover:text-sky-600 transition-colors"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          {person.name}
                        </h4>
                        {person.department && (
                          <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5 flex items-center justify-center gap-1">
                            <MapPin size={10} className="text-sky-500 shrink-0" />
                            {person.department}
                          </p>
                        )}
                      </div>

                      {/* Card Action Row */}
                      <div className="pt-2.5 mt-3 border-t border-slate-100 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(person);
                          }}
                          className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold bg-slate-900 hover:bg-sky-600 text-white transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                        >
                          <span>Profile</span>
                          <ExternalLink size={10} />
                        </button>
                        {person.linkedin_url && (
                          <a
                            href={person.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#0077b5] text-slate-600 hover:text-white border border-slate-200 transition-all"
                            title="LinkedIn"
                          >
                            <Linkedin size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 4. Bottom Corporate Bento Modules (White Glass Aesthetic) */}
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-200/90 pt-6">
              
              {/* Module 1: 25 Years of Student Excellence */}
              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-amber-200/90 shadow-[0_4px_20px_rgba(245,158,11,0.08)] flex items-center gap-3.5">
                <img src={ieee25Logo} alt="25 Years Logo" className="w-12 h-12 object-contain shrink-0" />
                <div>
                  <h5 className="font-bold text-amber-900 text-xs uppercase tracking-wider">
                    Silver Jubilee • 25 Years
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    1999/2000–2025/2026 milestone celebrating a quarter century of student brilliance.
                  </p>
                </div>
              </div>

              {/* Module 2: Council Welcome */}
              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-sky-200/90 shadow-[0_4px_20px_rgba(2,132,199,0.08)] flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0">
                  <Crown size={22} />
                </div>
                <div>
                  <h5 className="font-bold text-sky-900 text-xs uppercase tracking-wider">
                    Official Council 2026–2027
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Governing student officers steering all technical societies and branch wings.
                  </p>
                </div>
              </div>

              {/* Module 3: Flagship Conclaves */}
              <div className="p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-blue-200/90 shadow-[0_4px_20px_rgba(37,99,235,0.08)] flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                  <CalendarDays size={22} />
                </div>
                <div>
                  <h5 className="font-bold text-blue-900 text-xs uppercase tracking-wider">
                    Flagship Events
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    IEEE Day 2026 (06.10.2026) & IEEE Sportz Day 2026 (18.10.2026).
                  </p>
                </div>
              </div>

            </div>
          </div>

        </main>
      </div>

      {/* Profile Lightbox Modal */}
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

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default OfficeBearersPage;
