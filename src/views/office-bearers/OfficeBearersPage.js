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
  Sparkles,
  ArrowRight,
  LayoutGrid,
  List,
  Network,
  Printer,
  Share2,
  Building2,
  BadgeCheck,
  Globe,
  Briefcase
} from "lucide-react";
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
      wing: "Faculty Mentorship",
      tagline: "Student Branch Counsellor & Chief Mentor",
      badge: "Faculty Mentor",
      icon: GraduationCap,
      color: "#7c3aed",
      bg: "rgba(124,58,237,.10)",
      borderColor: "rgba(124,58,237,.30)",
    },
  },
  {
    match: ["chairperson", "chair", "president", "branch chair"],
    meta: {
      priority: 1,
      category: "presidency",
      wing: "Executive Presidency",
      tagline: "Apex Student Leader & Executive Governor",
      badge: "Chairperson",
      icon: Crown,
      color: "#d97706",
      bg: "rgba(217,119,6,.10)",
      borderColor: "rgba(217,119,6,.30)",
    },
  },
  {
    match: ["vice chairperson", "vice chair", "vice-chair", "vice president", "vice-chairperson"],
    meta: {
      priority: 2,
      category: "presidency",
      wing: "Executive Presidency",
      tagline: "Strategic Director & Executive Co-Lead",
      badge: "Vice Chairperson",
      icon: Trophy,
      color: "#059669",
      bg: "rgba(5,150,105,.10)",
      borderColor: "rgba(5,150,105,.30)",
    },
  },
  {
    match: ["secretary", "gen sec", "general secretary"],
    meta: {
      priority: 3,
      category: "core",
      wing: "Secretariat & Finance",
      tagline: "Administrative Governor & Branch Operations Lead",
      badge: "Secretary",
      icon: FileText,
      color: "#0284c7",
      bg: "rgba(2,132,199,.10)",
      borderColor: "rgba(2,132,199,.30)",
    },
  },
  {
    match: ["treasurer", "finance", "treasury", "accounts"],
    meta: {
      priority: 4,
      category: "core",
      wing: "Secretariat & Finance",
      tagline: "Fiscal Comptroller & Finance Officer",
      badge: "Treasurer",
      icon: Wallet,
      color: "#ea580c",
      bg: "rgba(234,88,12,.10)",
      borderColor: "rgba(234,88,12,.30)",
    },
  },
  {
    match: ["web designer", "webmaster", "tech lead", "technical head"],
    meta: {
      priority: 5,
      category: "tech",
      wing: "Technical & Web Systems",
      tagline: "Digital Systems Architect & Platform Lead",
      badge: "Webmaster",
      icon: Code2,
      color: "#0891b2",
      bg: "rgba(8,145,178,.10)",
      borderColor: "rgba(8,145,178,.30)",
    },
  },
  {
    match: ["editor", "editorial", "publications"],
    meta: {
      priority: 6,
      category: "editorial",
      wing: "Publications & Editorial",
      tagline: "Editorial Director & Newsletter Curator",
      badge: "Editor",
      icon: PenTool,
      color: "#db2777",
      bg: "rgba(219,39,119,.10)",
      borderColor: "rgba(219,39,119,.30)",
    },
  },
  {
    match: ["activities coordinator", "event coordinator", "activity coordinator"],
    meta: {
      priority: 7,
      category: "events",
      wing: "Event Operations",
      tagline: "Events & Program Orchestrator",
      badge: "Activities Lead",
      icon: CalendarDays,
      color: "#ca8a04",
      bg: "rgba(202,138,4,.10)",
      borderColor: "rgba(202,138,4,.30)",
    },
  },
  {
    match: ["joint activity", "joint event", "deputy activity"],
    meta: {
      priority: 8,
      category: "events",
      wing: "Event Operations",
      tagline: "Co-Orchestrator of Branch Initiatives",
      badge: "Joint Activities",
      icon: Sparkle,
      color: "#9333ea",
      bg: "rgba(147,51,234,.10)",
      borderColor: "rgba(147,51,234,.30)",
    },
  },
  {
    match: ["creative executive", "design exec"],
    meta: {
      priority: 9,
      category: "committee",
      wing: "Executive Committee",
      tagline: "Visual Identity & Creative Lead",
      badge: "Creative Exec",
      icon: Star,
      color: "#e11d48",
      bg: "rgba(225,29,72,.10)",
      borderColor: "rgba(225,29,72,.30)",
    },
  },
  {
    match: ["events executive", "activity exec"],
    meta: {
      priority: 10,
      category: "committee",
      wing: "Executive Committee",
      tagline: "Events & Logistics Coordinator",
      badge: "Events Exec",
      icon: CalendarDays,
      color: "#d97706",
      bg: "rgba(217,119,6,.10)",
      borderColor: "rgba(217,119,6,.30)",
    },
  },
  {
    match: ["executive member", "exec member"],
    meta: {
      priority: 11,
      category: "committee",
      wing: "Executive Committee",
      tagline: "Executive Committee Member",
      badge: "Executive",
      icon: ShieldCheck,
      color: "#4f46e5",
      bg: "rgba(79,70,229,.10)",
      borderColor: "rgba(79,70,229,.30)",
    },
  },
];

const DEFAULT_META = {
  priority: 99,
  category: "committee",
  wing: "Executive Committee",
  tagline: "Student Leader & Council Member",
  badge: "Officer",
  icon: Star,
  color: "#64748b",
  bg: "rgba(100,116,139,.10)",
  borderColor: "rgba(100,116,139,.30)",
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
//  EXECUTIVE PROFILE DOSSIER LIGHTBOX MODAL
// ════════════════════════════════════════════════════════════════════
const ProfileModal = ({ person, allMembers, onSelect, onClose }) => {
  const [err, setErr] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        const idx = allMembers.findIndex((m) => m.id === person.id);
        const prev = idx > 0 ? allMembers[idx - 1] : allMembers[allMembers.length - 1];
        setErr(false);
        onSelect(prev);
      }
      if (e.key === "ArrowRight") {
        const idx = allMembers.findIndex((m) => m.id === person.id);
        const next = idx < allMembers.length - 1 ? allMembers[idx + 1] : allMembers[0];
        setErr(false);
        onSelect(next);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [person, allMembers, onSelect, onClose]);

  if (!person) return null;

  const currentIndex = allMembers.findIndex((m) => m.id === person.id);
  const prevPerson = currentIndex > 0 ? allMembers[currentIndex - 1] : allMembers[allMembers.length - 1];
  const nextPerson = currentIndex < allMembers.length - 1 ? allMembers[currentIndex + 1] : allMembers[0];

  const meta = getMeta(person.role);
  const Icon = meta.icon;
  const img = err
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name || "M")}&background=0284c7&color=ffffff&size=512&bold=true&format=png`
    : getImg(person);
  const linkedin = person.linkedin_url || person.linkedin || null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[250] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(16px)" }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl bg-white"
      >
        {/* Top Floating Controls */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          {allMembers.length > 1 && (
            <>
              <button
                onClick={() => {
                  setErr(false);
                  onSelect(prevPerson);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/95 hover:bg-sky-600 hover:text-white text-slate-700 border border-slate-200 shadow-md backdrop-blur-md transition-all cursor-pointer"
                title="Previous Officer (←)"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => {
                  setErr(false);
                  onSelect(nextPerson);
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/95 hover:bg-sky-600 hover:text-white text-slate-700 border border-slate-200 shadow-md backdrop-blur-md transition-all cursor-pointer"
                title="Next Officer (→)"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/95 hover:bg-red-500 hover:text-white text-slate-700 border border-slate-200 shadow-md backdrop-blur-md transition-all cursor-pointer"
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Uncropped High-Res Portrait Header */}
        <div className="relative w-full h-84 overflow-hidden bg-slate-100 shrink-0">
          <img
            src={img}
            alt={person.name}
            className="w-full h-full object-cover object-top"
            onError={() => setErr(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20" />
          <div className="absolute bottom-3 left-5 z-10">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm backdrop-blur-md"
              style={{ background: meta.bg, borderColor: meta.borderColor, color: meta.color }}
            >
              <Icon size={12} /> {person.role || "Officer"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h2
              className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight"
              style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
            >
              {person.name}
            </h2>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
              ID: STB-{String(person.id).padStart(3, "0")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-sm font-semibold text-sky-600 mb-3">
            <MapPin size={14} />
            <span>{person.department || "Sri Ramakrishna Engineering College"}</span>
          </div>

          <p className="text-sm text-slate-600 italic mb-6 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            "{meta.tagline}"
          </p>

          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-sky-50 border border-sky-100 text-sky-700">
              <CheckCircle2 size={13} className="text-sky-600" /> Verified Executive
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-purple-50 border border-purple-100 text-purple-700">
              <ShieldCheck size={13} className="text-purple-600" /> Term 2026–2027
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-xl bg-amber-50 border border-amber-100 text-amber-700">
              <Sparkles size={13} className="text-amber-600" /> Silver Jubilee Council
            </span>
          </div>

          {linkedin ? (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white bg-[#0077b5] hover:bg-[#005e93] transition-all shadow-md hover:shadow-lg"
            >
              <Linkedin size={18} /> Connect on LinkedIn <ExternalLink size={14} />
            </a>
          ) : (
            <div className="w-full py-3 rounded-xl bg-slate-100 border border-slate-200 text-center text-slate-500 text-xs font-semibold">
              Official IEEE SREC Student Branch Delegate • STB32131
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT: PROFESSIONAL EXECUTIVE LEADERSHIP DIRECTORY
// ════════════════════════════════════════════════════════════════════
export const OfficeBearersPage = () => {
  const [bearers, setBearers] = useState(FALLBACK_BEARERS);
  const [execs, setExecs] = useState(FALLBACK_EXECS);
  const [, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  
  // ─── PROFESSIONAL VIEW SWITCHER: 'grid' | 'table' | 'org' ───────────
  const [viewMode, setViewMode] = useState("grid");

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

  // Apex Counsellor
  const counsellor = useMemo(() => {
    return allMembers.find((m) => getMeta(m.role).category === "faculty") || allMembers[0];
  }, [allMembers]);

  // Presidency Leaders (Chairs)
  const presidency = useMemo(() => {
    return allMembers.filter((m) => getMeta(m.role).category === "presidency");
  }, [allMembers]);

  // Core Secretariat
  const secretariat = useMemo(() => {
    return allMembers.filter((m) => getMeta(m.role).category === "core");
  }, [allMembers]);

  // Technical & Functional Leads
  const leads = useMemo(() => {
    return allMembers.filter((m) => ["tech", "editorial", "events"].includes(getMeta(m.role).category));
  }, [allMembers]);

  // Executive Committee
  const committee = useMemo(() => {
    return allMembers.filter((m) => getMeta(m.role).category === "committee");
  }, [allMembers]);

  // Filtered Roster by Search & Category
  const filteredMembers = useMemo(() => {
    return allMembers.filter((m) => {
      const meta = getMeta(m.role);
      const matchesCat = activeCategory === "all" || meta.category === activeCategory;
      const s = search.toLowerCase().trim();
      const matchesSearch =
        !s ||
        (m.name || "").toLowerCase().includes(s) ||
        (m.role || "").toLowerCase().includes(s) ||
        (m.department || "").toLowerCase().includes(s);
      return matchesCat && matchesSearch;
    });
  }, [allMembers, activeCategory, search]);

  // Handle Share / Print Action
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "IEEE SREC Executive Council 2026–2027",
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Executive Council Roster link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans relative selection:bg-sky-500 selection:text-white overflow-x-hidden">
      <style>{`
        @import url('${GFONTS}');
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(2,132,199,0.25); border-radius: 999px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        @media print {
          header, nav, footer, .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      {/* Universal Floating Top Navbar */}
      <Navbar />

      {/* Ambient Frosted Background Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden no-print">
        <div className="absolute top-24 left-1/4 w-[550px] h-[550px] bg-sky-200/35 rounded-full blur-[140px]" />
        <div className="absolute top-64 right-1/4 w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-[130px]" />
        <div className="absolute bottom-24 left-1/3 w-[650px] h-[650px] bg-cyan-200/25 rounded-full blur-[160px]" />
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MAIN PAGE CONTENT (pt-36 lg:pt-44 Clears Floating Double Navbar)
      ════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 pt-36 lg:pt-44 flex-1 flex flex-col w-full max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* ─── 1. INSTITUTIONAL ACCREDITATION & JURISDICTION BAR ─── */}
        <div className="w-full flex flex-wrap items-center justify-between gap-3 px-6 py-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-xs mb-8 text-xs font-semibold text-slate-600 no-print">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-1.5 text-sky-700 font-bold">
              <Globe size={14} className="text-sky-600" /> IEEE Region 10 (Asia-Pacific)
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-purple-700 font-bold">
              <Building2 size={14} className="text-purple-600" /> IEEE Madras Section
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-slate-800 font-bold">
              <BadgeCheck size={14} className="text-emerald-600" /> Student Branch STB32131
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              title="Share Roster Link"
            >
              <Share2 size={12} /> Share
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
              title="Print Council Gazette"
            >
              <Printer size={12} /> Print
            </button>
          </div>
        </div>

        {/* ─── 2. EXECUTIVE HERO HEADER (WHITE FROSTED GLASS) ─── */}
        <header className="relative w-full rounded-3xl p-8 sm:p-12 mb-10 overflow-hidden bg-white/85 backdrop-blur-2xl border border-slate-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.04)] text-center">
          
          {/* Silver Jubilee Seal */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-amber-100/90 border border-amber-200 shadow-xs mb-6">
            <img src={ieee25Logo} alt="25 Years Logo" className="w-8 h-8 object-contain" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-900">
              Silver Jubilee Milestone • Executive Council Term 2026–2027
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-4"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            Executive Leadership <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">Council</span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 font-medium leading-relaxed mb-8">
            Governing student council and executive committee spearheading technical advancement, research initiatives, publications, and student fellowship at Sri Ramakrishna Engineering College.
          </p>

          {/* Professional Metric Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 no-print">
            <div className="px-4 py-2 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center gap-2 text-xs font-bold text-slate-700">
              <Users size={16} className="text-sky-600" />
              <span>{allMembers.length} Active Officers</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center gap-2 text-xs font-bold text-slate-700">
              <Briefcase size={16} className="text-purple-600" />
              <span>8 Specialized Divisions</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/90 border border-slate-200/80 shadow-xs flex items-center gap-2 text-xs font-bold text-slate-700">
              <CalendarDays size={16} className="text-amber-600" />
              <span>IEEE Day & Sportz Day 2026</span>
            </div>
            <Link
              to="/societies/office-bearers"
              className="px-4 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white shadow-sm flex items-center gap-2 text-xs font-bold transition-all"
            >
              <Crown size={15} />
              <span>Technical Societies</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </header>

        {/* ─── 3. APEX PATRON SHOWCASE (STUDENT BRANCH COUNSELLOR) ─── */}
        {counsellor && (
          <section className="mb-12">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 text-center sm:text-left flex items-center gap-2 justify-center sm:justify-start">
              <GraduationCap size={16} className="text-purple-600" />
              <span>Branch Faculty Mentorship & Advisory</span>
            </div>

            <div
              onClick={() => setSelected(counsellor)}
              className="group relative w-full rounded-3xl p-6 sm:p-8 bg-white/85 hover:bg-white backdrop-blur-2xl border border-slate-200/90 hover:border-purple-300 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_45px_rgba(124,58,237,0.12)] transition-all duration-300 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8"
            >
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
                {/* Counsellor Portrait */}
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-100 border-2 border-purple-200/60 shadow-md shrink-0">
                  <img
                    src={getImg(counsellor)}
                    alt={counsellor.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-600 text-white shadow-xs">
                      Patron
                    </span>
                  </div>
                </div>

                {/* Counsellor Info */}
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 mb-2">
                    <GraduationCap size={13} /> {counsellor.role}
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight group-hover:text-purple-700 transition-colors"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {counsellor.name}
                  </h2>
                  <p className="text-sm font-semibold text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                    <MapPin size={14} className="text-purple-600" />
                    {counsellor.department || "Sri Ramakrishna Engineering College"}
                  </p>
                  <p className="text-xs text-slate-500 italic mt-2 max-w-lg">
                    "Guiding the student branch in excellence, research integrity, and student development."
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(counsellor);
                  }}
                  className="py-2.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider bg-purple-600 hover:bg-purple-700 text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink size={14} /> Full Dossier
                </button>
                {counsellor.linkedin_url && (
                  <a
                    href={counsellor.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-[#0077b5] text-slate-700 hover:text-white border border-slate-200 transition-all"
                    title="Connect on LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ─── 4. MAIN WORKSPACE WITH VIEW SWITCHER (CARDS | TABLE | ORG TREE) ─── */}
        <main className="w-full rounded-3xl overflow-hidden bg-white/85 backdrop-blur-2xl border border-slate-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.05)] flex flex-col mb-12">
          
          {/* Top Corporate Ribbon */}
          <div className="bg-[#0284c7] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
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

            {/* View Switcher Controls */}
            <div className="flex items-center gap-1.5 bg-sky-800/60 p-1 rounded-xl border border-white/20">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-sky-900 shadow-xs" : "text-white/80 hover:text-white"
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid size={13} />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "table" ? "bg-white text-sky-900 shadow-xs" : "text-white/80 hover:text-white"
                }`}
                title="Enterprise Directory Table"
              >
                <List size={13} />
                <span className="hidden sm:inline">Directory</span>
              </button>
              <button
                onClick={() => setViewMode("org")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "org" ? "bg-white text-sky-900 shadow-xs" : "text-white/80 hover:text-white"
                }`}
                title="Hierarchy Org Chart"
              >
                <Network size={13} />
                <span className="hidden sm:inline">Hierarchy</span>
              </button>
            </div>
          </div>

          {/* Search & Wing Filter Controls */}
          <div className="p-6 sm:p-8 pb-5 border-b border-slate-200/80 bg-white/60 flex flex-col md:flex-row items-center justify-between gap-5 no-print">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by officer name, role, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all shadow-xs"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Division Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
              {[
                { id: "all", label: "All Council" },
                { id: "presidency", label: "Chairs" },
                { id: "core", label: "Secretariat" },
                { id: "tech", label: "Webmaster" },
                { id: "editorial", label: "Editorial" },
                { id: "events", label: "Activities" },
                { id: "committee", label: "Committee" },
              ].map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                      isActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "bg-white/90 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─── VIEW 1: GRID CARDS VIEW ─── */}
          {viewMode === "grid" && (
            <div className="p-6 sm:p-8 flex-1">
              {filteredMembers.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <Users size={36} className="mx-auto mb-2 opacity-40" />
                  <p className="text-sm font-semibold">No council members match your search.</p>
                  <button
                    onClick={() => {
                      setSearch("");
                      setActiveCategory("all");
                    }}
                    className="mt-3 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
                  {filteredMembers.map((person) => {
                    const meta = getMeta(person.role);
                    const Icon = meta.icon;
                    const imgSrc = getImg(person);

                    return (
                      <motion.div
                        key={String(person.id)}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelected(person)}
                        className="group rounded-2xl p-3.5 bg-white/90 hover:bg-white backdrop-blur-xl border border-slate-200/80 hover:border-sky-300 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_35px_rgba(2,132,199,0.12)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
                      >
                        {/* 100% Uncropped Portrait Frame */}
                        <div className="relative w-full aspect-[4/4.8] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/70 mb-3 shadow-inner">
                          <img
                            src={imgSrc}
                            alt={person.name}
                            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                          {/* Role Badge */}
                          <div className="absolute top-2 left-2">
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider backdrop-blur-md border shadow-xs"
                              style={{ background: meta.bg, borderColor: meta.borderColor, color: meta.color }}
                            >
                              <Icon size={10} className="inline mr-1" />
                              {person.role || "Officer"}
                            </span>
                          </div>
                          {/* Year Badge */}
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-slate-700 bg-white/90 border border-slate-200/80 backdrop-blur-md shadow-xs">
                              2026–2027
                            </span>
                          </div>
                        </div>

                        {/* Officer Details */}
                        <div className="text-center px-1 flex-1 flex flex-col justify-between">
                          <div>
                            <h3
                              className="font-black text-slate-900 text-base leading-snug truncate group-hover:text-sky-600 transition-colors"
                              style={{ fontFamily: "'Outfit', sans-serif" }}
                            >
                              {person.name}
                            </h3>
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
                              <span>Dossier</span>
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
              )}
            </div>
          )}

          {/* ─── VIEW 2: ENTERPRISE DIRECTORY TABLE VIEW ─── */}
          {viewMode === "table" && (
            <div className="overflow-x-auto p-4 sm:p-6 flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-50/60">
                    <th className="py-3 px-4">Officer</th>
                    <th className="py-3 px-4">Designation & Wing</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Term</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredMembers.map((person) => {
                    const meta = getMeta(person.role);
                    const Icon = meta.icon;
                    const imgSrc = getImg(person);

                    return (
                      <tr
                        key={String(person.id)}
                        onClick={() => setSelected(person)}
                        className="hover:bg-sky-50/50 transition-colors cursor-pointer group"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={imgSrc}
                              alt={person.name}
                              className="w-10 h-10 rounded-xl object-cover object-top border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                                {person.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                ID: STB-{String(person.id).padStart(3, "0")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: meta.bg, color: meta.color }}
                          >
                            <Icon size={12} />
                            <span>{person.role}</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {meta.wing}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                          {person.department || "Sri Ramakrishna Engineering College"}
                        </td>
                        <td className="py-3.5 px-4 text-xs font-bold text-slate-700">
                          2026–2027
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 size={11} /> Verified Active
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelected(person)}
                              className="py-1 px-3 rounded-lg text-xs font-bold bg-slate-900 hover:bg-sky-600 text-white transition-all cursor-pointer"
                            >
                              Profile
                            </button>
                            {person.linkedin_url && (
                              <a
                                href={person.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded-lg bg-slate-100 hover:bg-[#0077b5] text-slate-700 hover:text-white border border-slate-200 transition-all"
                                title="LinkedIn"
                              >
                                <Linkedin size={14} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ─── VIEW 3: HIERARCHY ORG CHART VIEW ─── */}
          {viewMode === "org" && (
            <div className="p-6 sm:p-10 flex-1 flex flex-col items-center">
              
              {/* Level 1: Faculty Counsellor */}
              <div className="w-full max-w-md text-center mb-8">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 mb-2 inline-block">
                  Level 1 • Faculty Mentorship
                </span>
                <div
                  onClick={() => setSelected(counsellor)}
                  className="p-5 rounded-2xl bg-white border-2 border-purple-300 shadow-md hover:shadow-xl transition-all cursor-pointer flex items-center gap-4 text-left"
                >
                  <img
                    src={getImg(counsellor)}
                    alt={counsellor?.name}
                    className="w-16 h-16 rounded-xl object-cover object-top border shrink-0"
                  />
                  <div>
                    <h4 className="font-black text-slate-900 text-base">{counsellor?.name}</h4>
                    <p className="text-xs font-bold text-purple-700">{counsellor?.role}</p>
                    <p className="text-[11px] text-slate-500">{counsellor?.department}</p>
                  </div>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-[2px] h-8 bg-slate-300 mb-2" />

              {/* Level 2: Presidency (Chairs) */}
              <div className="w-full max-w-3xl mb-8">
                <div className="text-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block">
                    Level 2 • Executive Presidency
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {presidency.map((m) => (
                    <div
                      key={String(m.id)}
                      onClick={() => setSelected(m)}
                      className="p-4 rounded-2xl bg-white border border-amber-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                    >
                      <img
                        src={getImg(m)}
                        alt={m.name}
                        className="w-14 h-14 rounded-xl object-cover object-top border shrink-0"
                      />
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{m.name}</h4>
                        <p className="text-xs font-bold text-amber-700">{m.role}</p>
                        <p className="text-[11px] text-slate-500">{m.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-[2px] h-8 bg-slate-300 mb-2" />

              {/* Level 3: Secretariat & Finance */}
              <div className="w-full max-w-3xl mb-8">
                <div className="text-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 inline-block">
                    Level 3 • Secretariat & Finance
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {secretariat.map((m) => (
                    <div
                      key={String(m.id)}
                      onClick={() => setSelected(m)}
                      className="p-4 rounded-2xl bg-white border border-sky-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                    >
                      <img
                        src={getImg(m)}
                        alt={m.name}
                        className="w-14 h-14 rounded-xl object-cover object-top border shrink-0"
                      />
                      <div>
                        <h4 className="font-black text-slate-900 text-sm">{m.name}</h4>
                        <p className="text-xs font-bold text-sky-700">{m.role}</p>
                        <p className="text-[11px] text-slate-500">{m.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-[2px] h-8 bg-slate-300 mb-2" />

              {/* Level 4: Specialized Leads (Web, Editorial, Events) */}
              <div className="w-full max-w-5xl mb-8">
                <div className="text-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 inline-block">
                    Level 4 • Technical, Editorial & Event Operations
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {leads.map((m) => {
                    const meta = getMeta(m.role);
                    return (
                      <div
                        key={String(m.id)}
                        onClick={() => setSelected(m)}
                        className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-3"
                      >
                        <img
                          src={getImg(m)}
                          alt={m.name}
                          className="w-12 h-12 rounded-lg object-cover object-top border shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 text-xs truncate">{m.name}</h4>
                          <p className="text-[11px] font-semibold truncate" style={{ color: meta.color }}>{m.role}</p>
                          <p className="text-[10px] text-slate-400 truncate">{m.department}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-[2px] h-8 bg-slate-300 mb-2" />

              {/* Level 5: Executive Committee */}
              <div className="w-full max-w-5xl">
                <div className="text-center mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 inline-block">
                    Level 5 • Executive Committee Members
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {committee.map((m) => (
                    <div
                      key={String(m.id)}
                      onClick={() => setSelected(m)}
                      className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2.5"
                    >
                      <img
                        src={getImg(m)}
                        alt={m.name}
                        className="w-10 h-10 rounded-lg object-cover object-top border shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{m.name}</h4>
                        <p className="text-[10px] text-indigo-600 font-semibold truncate">{m.role}</p>
                        <p className="text-[10px] text-slate-400 truncate">{m.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>

        {/* ─── 5. BOTTOM BENTO MODULES (WHITE GLASS AESTHETIC) ─── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5 no-print">
          
          {/* Module 1: 25 Years of Student Excellence */}
          <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-2xl border border-amber-200/90 shadow-[0_6px_25px_rgba(245,158,11,0.06)] flex items-start gap-4">
            <img src={ieee25Logo} alt="25 Years Logo" className="w-14 h-14 object-contain shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Milestone Era
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1.5">
                Silver Jubilee 25 Years
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Celebrating 25 glorious years of engineering excellence, student leadership, and technical advancement at SREC.
              </p>
            </div>
          </div>

          {/* Module 2: Council Governance */}
          <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-2xl border border-sky-200/90 shadow-[0_6px_25px_rgba(2,132,199,0.06)] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 border border-sky-200 flex items-center justify-center shrink-0">
              <Crown size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                Governing Body
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1.5">
                Official Council 2026–2027
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Apex chairs, secretariat, and executive delegates leading branch activities, publications, and external conclaves.
              </p>
            </div>
          </div>

          {/* Module 3: Flagship Conclaves */}
          <div className="p-6 rounded-3xl bg-white/85 backdrop-blur-2xl border border-indigo-200/90 shadow-[0_6px_25px_rgba(79,70,229,0.06)] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
              <CalendarDays size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                Flagship Assemblies
              </span>
              <h4 className="font-bold text-slate-900 text-sm mt-1.5">
                IEEE Day & Sportz Day 2026
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                IEEE Day Conclave (06.10.2026) & IEEE Sportz Day (18.10.2026) celebrating athletic and technical fellowship.
              </p>
            </div>
          </div>

        </section>

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
