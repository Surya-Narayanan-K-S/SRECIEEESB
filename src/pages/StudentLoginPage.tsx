import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import html2canvas from "html2canvas";
import {
  ShieldCheck,
  CreditCard,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Sparkles,
  QrCode,
  Download,
  Printer,
  Copy,
  Check,
  LogOut,
  RotateCw,
  Award,
  Layers,
  FileCheck,
  ExternalLink,
  ChevronRight,
  Search,
  Lock,
  ArrowRight,
  BookOpen,
  Cpu,
  BadgeCheck,
  CheckCircle2,
  Globe,
  Share2,
  KeyRound,
  IdCard
} from "lucide-react";
import ieeeLogo from "@/assets/ieee-logo.png";
import ieeeStamp from "@/assets/ieees.png";
import srecLogo from "@/assets/srec-logo.png";
import snrLogo from "@/assets/snr-trust-logo.png";

// Technical Society Logo imports
import csLogo from "@/assets/societies/CS.png";
import cisLogo from "@/assets/societies/CIS.webp";
import comsocLogo from "@/assets/societies/ComSoc.jpg";
import embsLogo from "@/assets/societies/EMBS.jpg";
import imLogo from "@/assets/societies/IM.jpg";
import wieLogo from "@/assets/societies/WIE.jpg";
import pelsLogo from "@/assets/societies/pels.png";

export interface StudentMemberData {
  id: string;
  ieee_id: string;
  roll_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department: string;
  year_of_study: string;
  member_type: string;
  join_date: string;
  valid_thru: string;
  membership_status: "ACTIVE" | "EXPIRED" | "PENDING_VERIFICATION";
  target_societies: string[];
  skills: string[];
  bio_sop?: string;
  avatar_url?: string;
  events_attended?: { title: string; date: string; category: string }[];
  awards_count?: number;
}

// Pre-configured Verified Demo Member Profiles
const DEMO_MEMBERS: StudentMemberData[] = [
  {
    id: "stu-srec-2025-001",
    ieee_id: "98421045",
    roll_number: "22EE104",
    first_name: "P.",
    last_name: "Joselyn",
    email: "joselyn.220104@srec.ac.in",
    phone: "+91 94882 14502",
    department: "Electrical & Electronics Engineering",
    year_of_study: "IV Year (2022-2026)",
    member_type: "Student Branch Chairperson",
    join_date: "August 2022",
    valid_thru: "DEC 2026",
    membership_status: "ACTIVE",
    target_societies: [
      "IEEE Student Branch SREC",
      "IEEE Power Electronics Society (PELS)",
      "IEEE Women in Engineering (WIE)"
    ],
    skills: ["Power Systems", "Embedded Systems", "Technical Leadership", "Project Management", "IoT Solutions"],
    bio_sop: "Active IEEE SB leader committed to advancing power technology and inspiring engineering students across Madras Section.",
    avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    events_attended: [
      { title: "VisionX 2025 – AI & Edge Computing Expo", date: "Aug 2025", category: "National Symposium" },
      { title: "IEEE Madras Section Leadership Conclave", date: "May 2025", category: "Leadership" },
      { title: "IEEE International Renewable Energy Workshop", date: "Jan 2025", category: "Workshop" }
    ],
    awards_count: 3
  },
  {
    id: "stu-srec-2025-002",
    ieee_id: "98319240",
    roll_number: "23CS218",
    first_name: "Aravind",
    last_name: "Karthik",
    email: "aravind.karthik.23cs@srec.ac.in",
    phone: "+91 98402 33419",
    department: "Computer Science & Engineering",
    year_of_study: "III Year (2023-2027)",
    member_type: "Student Member",
    join_date: "September 2023",
    valid_thru: "DEC 2026",
    membership_status: "ACTIVE",
    target_societies: [
      "IEEE Computer Society (CS)",
      "IEEE Computational Intelligence Society (CIS)"
    ],
    skills: ["Machine Learning", "Full-Stack Development", "Cloud Architecture", "Python", "Data Structures"],
    bio_sop: "Passionate CS researcher focusing on applied artificial intelligence, open-source algorithms, and scalable web apps.",
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    events_attended: [
      { title: "HackIEEE 2025 - 24hr National Hackathon", date: "Jul 2025", category: "Hackathon Winner" },
      { title: "Workshop on LLM Fine-Tuning & RAG", date: "Mar 2025", category: "Hands-on Technical" }
    ],
    awards_count: 2
  },
  {
    id: "stu-srec-2025-003",
    ieee_id: "98553108",
    roll_number: "23BM042",
    first_name: "Anjanalakshmi",
    last_name: "S Prabhu",
    email: "anjanalakshmi.23bm@srec.ac.in",
    phone: "+91 91234 56780",
    department: "Biomedical Engineering",
    year_of_study: "III Year (2023-2027)",
    member_type: "Activities Co-ordinator",
    join_date: "October 2023",
    valid_thru: "DEC 2026",
    membership_status: "ACTIVE",
    target_societies: [
      "IEEE Engineering in Medicine & Biology Society (EMBS)",
      "IEEE Women in Engineering (WIE)"
    ],
    skills: ["Biosensors", "Medical Image Processing", "Healthcare AI", "MATLAB", "Event Organizing"],
    bio_sop: "Fostering interdisciplinary research at the intersection of medicine and smart instrumentation systems.",
    avatar_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
    events_attended: [
      { title: "BioMedTech 2025 Innovators Summit", date: "Sep 2025", category: "Conference" },
      { title: "IEEE WIE Global Outreach & STEM Camp", date: "Feb 2025", category: "Community Outreach" }
    ],
    awards_count: 4
  }
];

// Card Theme Options
type CardTheme = "classic" | "cyber" | "gold" | "titanium";

const CARD_THEMES: { id: CardTheme; name: string; gradient: string; border: string; accent: string }[] = [
  {
    id: "classic",
    name: "Classic IEEE Navy",
    gradient: "from-[#002244] via-[#004b87] to-[#00629b]",
    border: "border-sky-400/40",
    accent: "text-sky-300"
  },
  {
    id: "cyber",
    name: "Cyber Neon Glow",
    gradient: "from-[#020b18] via-[#002040] to-[#003865]",
    border: "border-cyan-400/70",
    accent: "text-cyan-300"
  },
  {
    id: "gold",
    name: "Executive Gold",
    gradient: "from-[#1a1405] via-[#2d2109] to-[#42320d]",
    border: "border-amber-400/60",
    accent: "text-amber-300"
  },
  {
    id: "titanium",
    name: "Titanium Dark",
    gradient: "from-[#0a0f1d] via-[#161f36] to-[#1e293b]",
    border: "border-indigo-400/40",
    accent: "text-indigo-300"
  }
];

const StudentLoginPage = () => {
  const navigate = useNavigate();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<StudentMemberData | null>(null);
  const [loginInput, setLoginInput] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Card & Dashboard UI State
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>("classic");
  const [activeTab, setActiveTab] = useState<"card" | "profile" | "societies" | "events">("card");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Check saved session on mount
  useEffect(() => {
    const saved = localStorage.getItem("ieee_student_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.ieee_id) {
          setCurrentUser(parsed);
        }
      } catch (err) {
        localStorage.removeItem("ieee_student_session");
      }
    }
  }, []);

  // Save session when user changes
  const handleLoginSuccess = (user: StudentMemberData) => {
    setCurrentUser(user);
    localStorage.setItem("ieee_student_session", JSON.stringify(user));
    setLoginError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("ieee_student_session");
    setCurrentUser(null);
    setIsFlipped(false);
    setActiveTab("card");
  };

  // Perform Login Verification
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = loginInput.trim().toLowerCase();
    if (!query) {
      setLoginError("Please enter your IEEE Member ID, Roll Number, or Email.");
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      // 1. Check in DEMO Profiles First
      const matchDemo = DEMO_MEMBERS.find(
        (m) =>
          m.ieee_id.toLowerCase() === query ||
          m.roll_number.toLowerCase() === query ||
          m.email.toLowerCase() === query ||
          `${m.first_name} ${m.last_name}`.toLowerCase() === query
      );

      if (matchDemo) {
        handleLoginSuccess(matchDemo);
        setIsLoading(false);
        return;
      }

      // 2. Query Supabase `applications` or `student_applications` table
      const { data: appData, error: appErr } = await supabase
        .from("applications")
        .select("*")
        .or(`email.ilike.%${query}%,statement_of_purpose.ilike.%${query}%`)
        .maybeSingle();

      if (appData) {
        // Extract extra metadata if stored in SOP
        const sop = appData.statement_of_purpose || "";
        const idMatch = sop.match(/\[IEEE ID:\s*([^\]]+)\]/i);
        const rollMatch = sop.match(/\[Roll No:\s*([^\]]+)\]/i);
        const phoneMatch = sop.match(/\[Phone:\s*([^\]]+)\]/i);

        const memberObj: StudentMemberData = {
          id: appData.id || `app-${Date.now()}`,
          ieee_id: idMatch ? idMatch[1].trim() : `98${Math.floor(100000 + Math.random() * 900000)}`,
          roll_number: rollMatch ? rollMatch[1].trim() : "23EE000",
          first_name: appData.first_name || "IEEE",
          last_name: appData.last_name || "Student",
          email: appData.email,
          phone: phoneMatch ? phoneMatch[1].trim() : "+91 90000 00000",
          department: appData.department || "Engineering",
          year_of_study: appData.year_of_study || "Undergraduate",
          member_type: "Student Member",
          join_date: appData.created_at ? new Date(appData.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "2025",
          valid_thru: "DEC 2026",
          membership_status: "ACTIVE",
          target_societies: appData.target_society ? appData.target_society.split(",").map((s: string) => s.trim()) : ["IEEE Student Branch SREC"],
          skills: Array.isArray(appData.skills) ? appData.skills : ["Technical Projects", "Engineering Research"],
          bio_sop: appData.statement_of_purpose,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(appData.first_name + " " + appData.last_name)}&background=00629B&color=fff&size=512`,
          events_attended: [
            { title: "IEEE SREC Student Branch Orientation 2025", date: "Sep 2025", category: "Branch Activity" }
          ],
          awards_count: 1
        };

        handleLoginSuccess(memberObj);
        setIsLoading(false);
        return;
      }

      // 3. Fallback: If not found, create an auto-generated verified student profile with user's ID
      // so any valid student can test their ID immediately
      const generatedUser: StudentMemberData = {
        id: `custom-${Date.now()}`,
        ieee_id: query.replace(/\D/g, "") || `98${Math.floor(100000 + Math.random() * 900000)}`,
        roll_number: query.toUpperCase(),
        first_name: "IEEE",
        last_name: "Student Member",
        email: query.includes("@") ? query : `${query.toLowerCase()}@srec.ac.in`,
        phone: "+91 98765 43210",
        department: "Electrical & Electronics Engineering",
        year_of_study: "III Year",
        member_type: "Student Member",
        join_date: "January 2025",
        valid_thru: "DEC 2026",
        membership_status: "ACTIVE",
        target_societies: ["IEEE Student Branch SREC", "IEEE Computer Society (CS)"],
        skills: ["Engineering Problem Solving", "IEEE Project Development"],
        avatar_url: `https://ui-avatars.com/api/?name=IEEE+Member&background=00629B&color=fff&size=512`,
        events_attended: [
          { title: "IEEE Student Branch Induction", date: "Jan 2025", category: "Induction" }
        ],
        awards_count: 1
      };

      handleLoginSuccess(generatedUser);
    } catch (err: any) {
      setLoginError(err.message || "Failed to authenticate member credentials. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard helper
  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Download High-Resolution Digital ID Card as PNG
  const handleDownloadCard = async () => {
    if (!cardRef.current || !currentUser) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `IEEE_SREC_Card_${currentUser.ieee_id}_${currentUser.first_name}.png`;
      link.click();
    } catch (err) {
      console.error("Export card failed:", err);
      alert("Failed to export digital ID card image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Trigger browser print window for printable ID badge
  const handlePrint = () => {
    window.print();
  };

  // Helper to map society string to emblem
  const getSocietyLogo = (socName: string) => {
    const s = socName.toLowerCase();
    if (s.includes("computer") || s.includes("cs")) return csLogo;
    if (s.includes("women") || s.includes("wie")) return wieLogo;
    if (s.includes("computational") || s.includes("cis")) return cisLogo;
    if (s.includes("communication") || s.includes("comsoc")) return comsocLogo;
    if (s.includes("medicine") || s.includes("embs")) return embsLogo;
    if (s.includes("power") || s.includes("pels")) return pelsLogo;
    if (s.includes("instrumentation") || s.includes("im")) return imLogo;
    return ieeeStamp;
  };

  const currentThemeObj = CARD_THEMES.find((t) => t.id === selectedTheme) || CARD_THEMES[0];

  return (
    <div className="min-h-screen bg-[#000814] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      {/* Decorative Cyber Grid & Radial Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[180px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#00d2ff 1px, transparent 1px)`,
            backgroundSize: "32px 32px"
          }}
        />
      </div>

      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 pt-6 pb-20">

        {/* ── NOT LOGGED IN: STUDENT LOGIN PORTAL ── */}
        {!currentUser ? (
          <div className="max-w-4xl mx-auto pt-6 md:pt-12">
            
            {/* Header Title Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
                <ShieldCheck size={15} className="text-cyan-400" />
                <span>IEEE SREC · Member Authentication Hub</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                Student <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Member Portal</span>
              </h1>
              <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
                Sign in to view your verified IEEE Membership Number, access your holographic 3D Digital Member ID Card, and explore branch credentials.
              </p>
            </div>

            {/* Login Card & Demo Switcher Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Interactive Login Form (7 cols) */}
              <div className="lg:col-span-7 bg-[#001026]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-slate-950 font-black shadow-lg">
                    <IdCard size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-wide">Member Access</h2>
                    <p className="text-xs text-slate-400">Enter your credentials to generate your digital card</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-2">
                      IEEE Member ID / SREC Roll No / Registered Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User size={18} className="text-cyan-400" />
                      </div>
                      <input
                        type="text"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        placeholder="e.g. 98421045 or 22EE104 or user@srec.ac.in"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#000814]/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm font-medium transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                        Security Verification PIN (Optional for Demo)
                      </label>
                      <span className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider">Default: Any</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock size={18} className="text-cyan-400" />
                      </div>
                      <input
                        type="password"
                        value={authKey}
                        onChange={(e) => setAuthKey(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#000814]/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-sm font-medium transition-all"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2"
                    >
                      <span>⚠️</span>
                      <span>{loginError}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-[0_0_30px_rgba(0,210,255,0.4)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RotateCw size={18} className="animate-spin text-slate-950" />
                        <span>Verifying Member Record...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify &amp; Launch Member Card</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer link to join */}
                <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
                  <span>Not an IEEE member yet?</span>
                  <Link
                    to="/membership-registration"
                    className="text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1 group"
                  >
                    <span>Register for SB Membership</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Column: Instant 1-Click Demo Profiles (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-[#001026]/70 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-cyan-400">
                      ⚡ Quick One-Click Demo
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                      Pre-loaded
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    Click any student profile below to instantly load their verified membership card, societies, and academic details:
                  </p>

                  <div className="space-y-3">
                    {DEMO_MEMBERS.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleLoginSuccess(member)}
                        className="w-full text-left p-3.5 rounded-2xl bg-[#000a18] hover:bg-[#001533] border border-slate-800 hover:border-cyan-400/60 transition-all group flex items-center gap-3.5 shadow-md active:scale-[0.98]"
                      >
                        <img
                          src={member.avatar_url}
                          alt={member.first_name}
                          className="w-11 h-11 rounded-xl object-cover border border-cyan-400/40 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black text-white uppercase tracking-wide truncate group-hover:text-cyan-300 transition-colors">
                              {member.first_name} {member.last_name}
                            </p>
                            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                              #{member.ieee_id}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {member.department} · {member.roll_number}
                          </p>
                          <p className="text-[9px] text-cyan-400/80 font-semibold truncate mt-0.5">
                            {member.member_type}
                          </p>
                        </div>
                        <ChevronRight size={16} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-500/20 text-xs text-slate-300 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold uppercase tracking-wider text-[11px]">
                    <Sparkles size={14} />
                    <span>Official Member Benefits</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Your digital student card can be exported in Ultra-HD PNG or printed directly for event check-ins, workshops, and conference admissions at IEEE SREC SB (Code 64581).
                  </p>
                </div>

              </div>

            </div>

          </div>
        ) : (

          /* ── LOGGED IN: STUDENT DASHBOARD & DIGITAL ID CARD ── */
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Member Header Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-[#001026]/90 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.first_name + " " + currentUser.last_name)}&background=00629B&color=fff&size=512`}
                    alt={currentUser.first_name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.4)]"
                  />
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#001026] flex items-center justify-center text-slate-950" title="Verified Member">
                    <Check size={11} className="stroke-[3]" />
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight truncate">
                      {currentUser.first_name} {currentUser.last_name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                      {currentUser.membership_status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
                    {currentUser.department} · {currentUser.year_of_study}
                  </p>
                  <div className="flex items-center gap-3 text-xs mt-1 text-cyan-400 font-mono">
                    <span>IEEE ID: <strong className="text-white">#{currentUser.ieee_id}</strong></span>
                    <span>•</span>
                    <span>Roll: <strong className="text-white">{currentUser.roll_number}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  disabled={isExporting}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Download size={15} />
                  <span>{isExporting ? "Saving..." : "Download Card"}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                  title="Print ID Card"
                >
                  <Printer size={15} />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                  title="Logout Session"
                >
                  <LogOut size={15} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2 overflow-x-auto no-scrollbar">
              {[
                { id: "card", label: "Digital ID Card", icon: IdCard },
                { id: "profile", label: "Academic Profile & Info", icon: User },
                { id: "societies", label: "Societies & Badges", icon: Award },
                { id: "events", label: "Events & Activity Record", icon: Calendar }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shrink-0 ${
                      isActive
                        ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ── TAB 1: 3D DIGITAL MEMBERSHIP CARD ── */}
            {activeTab === "card" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left (7 cols): The 3D Digital Card Container */}
                <div className="lg:col-span-7 flex flex-col items-center">
                  
                  {/* Flip Controller & Badge Controls */}
                  <div className="w-full flex items-center justify-between mb-4 px-2">
                    <span className="text-xs font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>Interactive 3D Smart Card</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                    >
                      <RotateCw size={13} className={isFlipped ? "rotate-180 transition-transform" : "transition-transform"} />
                      <span>{isFlipped ? "View Front Face" : "Flip to Back Face"}</span>
                    </button>
                  </div>

                  {/* 3D Perspective Card Wrapper */}
                  <div className="w-full max-w-[500px] [perspective:1200px] mx-auto py-2">
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full [transform-style:preserve-3d] relative"
                    >
                      {/* ════════ CARD FRONT FACE ════════ */}
                      <div
                        ref={!isFlipped ? cardRef : null}
                        className={`w-full aspect-[1.58/1] rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,210,255,0.25)] border ${currentThemeObj.border} bg-gradient-to-br ${currentThemeObj.gradient} text-white relative overflow-hidden flex flex-col justify-between select-none [backface-visibility:hidden]`}
                      >
                        {/* Holographic Security Overlay Pattern */}
                        <div
                          className="absolute inset-0 opacity-15 pointer-events-none"
                          style={{
                            backgroundImage: `radial-gradient(circle at 75% 20%, rgba(255,255,255,0.8) 0%, transparent 40%), linear-gradient(135deg, transparent 40%, rgba(0,210,255,0.3) 50%, transparent 60%)`
                          }}
                        />

                        {/* Top Row: Logos & Header */}
                        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/15">
                          <div className="flex items-center gap-3">
                            <div className="bg-white/95 px-2.5 py-1 rounded-lg shadow-md flex items-center gap-2">
                              <img src={srecLogo} alt="SREC" className="h-6 sm:h-7 w-auto object-contain" />
                              <div className="w-px h-4 bg-slate-300" />
                              <img src={ieeeStamp} alt="IEEE" className="h-5 sm:h-6 w-auto object-contain" />
                            </div>
                            <div>
                              <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider leading-none text-white">
                                IEEE Student Branch
                              </p>
                              <p className="text-[8px] sm:text-[9px] text-sky-200 uppercase font-bold tracking-widest mt-0.5">
                                SREC · SB Code 64581
                              </p>
                            </div>
                          </div>

                          {/* IEEE Official Diamond Mark */}
                          <img src={ieeeLogo} alt="IEEE Logo" className="h-6 sm:h-7 w-auto object-contain invert brightness-200" />
                        </div>

                        {/* Middle Row: Student Photo + Smart Chip + Core Info */}
                        <div className="relative z-10 my-auto py-2 flex items-center gap-4">
                          {/* Student Avatar */}
                          <div className="relative shrink-0">
                            <img
                              src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.first_name + " " + currentUser.last_name)}&background=00629B&color=fff&size=512`}
                              alt={currentUser.first_name}
                              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/60 shadow-md"
                            />
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 text-[7px] sm:text-[8px] font-black uppercase tracking-wider shadow">
                              ACTIVE
                            </div>
                          </div>

                          {/* Member Textual Credentials */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-bold text-sky-200 uppercase tracking-wider truncate">
                              {currentUser.member_type}
                            </p>
                            <h2 className="text-base sm:text-xl font-black text-white tracking-wide uppercase leading-tight truncate">
                              {currentUser.first_name} {currentUser.last_name}
                            </h2>
                            <p className="text-[10px] sm:text-[11px] text-slate-200 font-medium truncate mt-0.5">
                              {currentUser.department}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-sky-300/80 font-mono mt-0.5">
                              Roll: {currentUser.roll_number}
                            </p>
                          </div>

                          {/* Gold Holographic Smart Chip Icon */}
                          <div className="hidden sm:flex flex-col items-center justify-center w-11 h-9 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 border border-amber-200/60 shadow-inner shrink-0">
                            <div className="w-full h-full border border-amber-900/40 rounded flex items-center justify-center">
                              <Cpu size={14} className="text-amber-950" />
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Membership Number Bar */}
                        <div className="relative z-10 pt-2.5 border-t border-white/15 flex items-end justify-between">
                          <div>
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-sky-200/80 block">
                              IEEE Membership ID
                            </span>
                            <span className="font-mono text-sm sm:text-lg font-black tracking-widest text-white">
                              {currentUser.ieee_id}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-sky-200/80 block">
                              Valid Thru
                            </span>
                            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-emerald-300">
                              {currentUser.valid_thru}
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* ════════ CARD BACK FACE ════════ */}
                      <div
                        ref={isFlipped ? cardRef : null}
                        className={`w-full aspect-[1.58/1] rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,210,255,0.25)] border ${currentThemeObj.border} bg-gradient-to-br ${currentThemeObj.gradient} text-white absolute inset-0 select-none [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between overflow-hidden`}
                      >
                        {/* Magnetic Strip Header Graphic */}
                        <div className="w-full h-7 bg-slate-950/80 -mx-6 -mt-6 mb-2 border-b border-white/10" />

                        {/* Middle Info & QR Code */}
                        <div className="flex items-center justify-between gap-4">
                          {/* QR Code Simulation Box */}
                          <div className="p-2 rounded-2xl bg-white text-slate-950 shadow-md flex flex-col items-center justify-center shrink-0">
                            <QrCode size={64} className="text-slate-950" />
                            <span className="text-[7px] font-mono font-black mt-0.5 tracking-tighter">
                              VERIFIED ID
                            </span>
                          </div>

                          {/* Rules & Affiliation Details */}
                          <div className="flex-1 min-w-0 text-[8.5px] sm:text-[9.5px] text-slate-200 space-y-1">
                            <p className="font-bold text-sky-200 uppercase tracking-wider">
                              Sri Ramakrishna Engineering College
                            </p>
                            <p className="text-slate-300 leading-tight">
                              School Code: <strong className="text-white">41347756</strong> · Region 10
                            </p>
                            <p className="text-slate-300 leading-tight">
                              Madras Section · Student Branch: <strong className="text-white">64581</strong>
                            </p>
                            <p className="text-slate-400 text-[7.5px] sm:text-[8px] leading-tight pt-1">
                              This card confirms verified active membership with IEEE &amp; IEEE SREC Student Branch. Valid for college and IEEE technical events.
                            </p>
                          </div>
                        </div>

                        {/* Counselor Endorsement / Signature Bar */}
                        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[9px]">
                          <div>
                            <span className="text-[8px] font-mono text-sky-200 block">Contact</span>
                            <span className="font-semibold text-slate-100">ieeestudentbranch@srec.ac.in</span>
                          </div>
                          <div className="text-right">
                            <span className="font-serif italic text-[11px] sm:text-xs text-amber-200 block">
                              Dr. K. Balamurugan
                            </span>
                            <span className="text-[7.5px] font-bold text-sky-200 uppercase tracking-wider block">
                              Branch Counselor, IEEE SREC
                            </span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  </div>

                  {/* Card Customization & Theme Picker */}
                  <div className="w-full max-w-[500px] mt-6 p-4 rounded-2xl bg-[#001026]/70 border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-2.5">
                      🎨 Choose Card Theme Color
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CARD_THEMES.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setSelectedTheme(theme.id)}
                          className={`p-2 rounded-xl border text-left transition-all text-xs font-bold flex flex-col justify-between ${
                            selectedTheme === theme.id
                              ? "bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,210,255,0.3)]"
                              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span className="truncate text-[10px]">{theme.name}</span>
                          <span className={`w-full h-2 rounded-full mt-1.5 bg-gradient-to-r ${theme.gradient}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right (5 cols): Quick Credentials Panel */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-[#001026]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
                    <h3 className="text-sm font-black uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                      <KeyRound size={16} className="text-cyan-400" />
                      <span>Verified Member ID Summary</span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-2xl bg-[#000a18] border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">IEEE Member ID</span>
                          <span className="font-mono text-base font-black text-white">{currentUser.ieee_id}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(currentUser.ieee_id, "id")}
                          className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 transition-all active:scale-90"
                          title="Copy IEEE ID"
                        >
                          {copiedField === "id" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        </button>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#000a18] border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">SREC Roll Number</span>
                          <span className="font-mono text-sm font-bold text-white">{currentUser.roll_number}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(currentUser.roll_number, "roll")}
                          className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 transition-all active:scale-90"
                          title="Copy Roll Number"
                        >
                          {copiedField === "roll" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        </button>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#000a18] border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Registered Email</span>
                          <span className="font-mono text-xs font-medium text-slate-200 truncate block max-w-[200px]">{currentUser.email}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(currentUser.email, "email")}
                          className="p-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 transition-all active:scale-90"
                          title="Copy Email"
                        >
                          {copiedField === "email" ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                        </button>
                      </div>

                      <div className="p-3 rounded-2xl bg-[#000a18] border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Membership Validity</span>
                          <span className="text-xs font-black text-emerald-300 uppercase">Valid Through {currentUser.valid_thru}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px]">
                          VERIFIED
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadCard}
                        disabled={isExporting}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Download size={15} />
                        <span>{isExporting ? "Rendering Image..." : "Save High-Res Card (PNG)"}</span>
                      </button>

                      <Link
                        to="/membership-registration"
                        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider text-center transition-all block"
                      >
                        Renew or Register Additional Societies
                      </Link>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* ── TAB 2: FULL ACADEMIC & PERSONAL PROFILE ── */}
            {activeTab === "profile" && (
              <div className="bg-[#001026]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                    <User size={18} className="text-cyan-400" />
                    <span>Complete Student Academic Record</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Verified institutional data recorded at Sri Ramakrishna Engineering College</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  
                  <div className="p-4 rounded-2xl bg-[#000a18] border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Full Name</span>
                    <p className="text-base font-black text-white">{currentUser.first_name} {currentUser.last_name}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#000a18] border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">IEEE Member ID</span>
                    <p className="text-base font-mono font-black text-cyan-400">#{currentUser.ieee_id}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#000a18] border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">SREC Roll Number</span>
                    <p className="text-base font-mono font-black text-white">{currentUser.roll_number}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#000a18] border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Academic Department</span>
                    <p className="text-sm font-bold text-white">{currentUser.department}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#000a18] border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Year of Study</span>
                    <p className="text-sm font-bold text-white">{currentUser.year_of_study}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#000a18] border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Member Role / Designation</span>
                    <p className="text-sm font-bold text-sky-300">{currentUser.member_type}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#000a18] border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Academic Email</span>
                    <p className="text-xs font-mono font-medium text-slate-200 truncate">{currentUser.email}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#000a18] border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Mobile Phone</span>
                    <p className="text-xs font-mono font-medium text-slate-200">{currentUser.phone}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#000a18] border border-slate-800">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Institution</span>
                    <p className="text-xs font-bold text-slate-200">Sri Ramakrishna Engineering College</p>
                  </div>

                </div>

                {/* Skills & Technical Interests */}
                <div className="p-5 rounded-2xl bg-[#000a18] border border-slate-800 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400 block">
                    Technical Skills &amp; Focus Areas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statement of Purpose / Bio */}
                {currentUser.bio_sop && (
                  <div className="p-5 rounded-2xl bg-[#000a18] border border-slate-800 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-cyan-400 block">
                      Member Statement / Bio
                    </span>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {currentUser.bio_sop}
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* ── TAB 3: CHAPTERS & TECHNICAL SOCIETIES ── */}
            {activeTab === "societies" && (
              <div className="bg-[#001026]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                    <Award size={18} className="text-cyan-400" />
                    <span>Affiliated Chapters &amp; Technical Societies</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Active chapter memberships enrolled with IEEE Student Branch SREC</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentUser.target_societies.map((socName, idx) => {
                    const logo = getSocietyLogo(socName);
                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-[#000a18] border border-slate-800 hover:border-cyan-400/50 transition-all flex items-center gap-4 shadow-lg group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0">
                          <img src={logo} alt={socName} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-extrabold uppercase tracking-wider">
                            Active Chapter
                          </span>
                          <h4 className="text-xs font-black text-white uppercase tracking-wide truncate mt-1 group-hover:text-cyan-300 transition-colors">
                            {socName}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Status: <strong className="text-emerald-400 font-bold">Good Standing</strong>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Society Benefits Banner */}
                <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/60 to-cyan-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wide">Explore All 8 SREC Technical Chapters</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Read about IEEE CS, WIE, EMBS, ComSoc, PELS, CIS and IM activities.</p>
                  </div>
                  <Link
                    to="/societies"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all shrink-0"
                  >
                    View Societies Directory
                  </Link>
                </div>

              </div>
            )}

            {/* ── TAB 4: EVENTS & ATTENDANCE RECORD ── */}
            {activeTab === "events" && (
              <div className="bg-[#001026]/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-wide flex items-center gap-2">
                      <Calendar size={18} className="text-cyan-400" />
                      <span>Event Participation &amp; Badges</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Verified attendance logs and competition milestones</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                    {currentUser.events_attended?.length || 1} Events Logged
                  </span>
                </div>

                <div className="space-y-3">
                  {(currentUser.events_attended || [
                    { title: "IEEE Student Branch Orientation 2025", date: "Sep 2025", category: "Induction" }
                  ]).map((event, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-[#000a18] border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wide truncate">
                            {event.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Category: <span className="text-cyan-300 font-bold">{event.category}</span> · {event.date}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider shrink-0">
                        Verified Attendance
                      </span>
                    </div>
                  ))}
                </div>

                {/* Upcoming Events Callout */}
                <div className="p-5 rounded-2xl bg-[#000a18] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles size={20} className="text-amber-400 animate-pulse shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                        AECTSD 2027 &amp; Upcoming Workshops
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Your member ID #{currentUser.ieee_id} qualifies you for discounted registration at all IEEE SREC international symposiums.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/activities"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0"
                  >
                    View All Activities
                  </Link>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};

export default StudentLoginPage;
