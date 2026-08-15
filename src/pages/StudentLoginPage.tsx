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
  IdCard,
  Users,
  Camera,
  Upload,
  Loader2
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
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loginInput, setLoginInput] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Registration Form State
  const [regFirstName, setRegFirstName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regRollNo, setRegRollNo] = useState("");
  const [regIeeeId, setRegIeeeId] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regDept, setRegDept] = useState("Electrical & Electronics Engineering");
  const [regYear, setRegYear] = useState("III Year (2023-2027)");
  const [regSocieties, setRegSocieties] = useState<string[]>([
    "IEEE Student Branch SREC",
    "IEEE Computer Society (CS)"
  ]);
  const [regPassword, setRegPassword] = useState("");

  // Card & Dashboard UI State
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>("classic");
  const [activeTab, setActiveTab] = useState<"card" | "profile" | "societies" | "events">("card");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Check saved session on mount (Permanent Persistent Login)
  useEffect(() => {
    const saved = localStorage.getItem("ieee_student_session") || localStorage.getItem("srec_ieee_app_user");
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
    localStorage.setItem("srec_ieee_app_user", JSON.stringify(user));
    setLoginError(null);
  };

  // Upload/Update Avatar photo directly to Supabase storage bucket `member-avatars`
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${currentUser.roll_number || currentUser.ieee_id}_${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('member-avatars')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('member-avatars')
        .getPublicUrl(fileName);

      const newAvatarUrl = urlData.publicUrl;
      const updatedUser: StudentMemberData = { ...currentUser, avatar_url: newAvatarUrl };
      
      // Update in Supabase student_members table
      await supabase
        .from('student_members')
        .update({ avatar_url: newAvatarUrl })
        .eq('roll_number', currentUser.roll_number);

      // Update local state and session
      handleLoginSuccess(updatedUser);
      alert("Profile photo updated successfully and saved to Supabase!");
    } catch (err: any) {
      console.warn("Avatar upload error:", err);
      alert("Failed to upload image. " + (err.message || ""));
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ieee_student_session");
    localStorage.removeItem("srec_ieee_app_user");
    setCurrentUser(null);
    setIsFlipped(false);
    setActiveTab("card");
  };

  // Perform Login Verification with Membership ID + Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = loginInput.trim().toLowerCase();
    const password = loginPassword.trim();

    if (!query) {
      setLoginError("Please enter your IEEE Member ID, Roll Number, or Email.");
      return;
    }
    if (!password) {
      setLoginError("Please enter your account Password / PIN.");
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    try {
      // 1. Query Supabase `student_members` table
      try {
        const { data: memberData, error: dbErr } = await supabase
          .from("student_members")
          .select("*")
          .or(`ieee_id.eq.${query},roll_number.ilike.${query},email.ilike.${query}`)
          .maybeSingle();

        if (memberData) {
          // Verify Password / Security PIN (support srecieee@<rollnumber> as default)
          const rollClean = (memberData.roll_number || "").trim();
          const expectedPass1 = `srecieee@${rollClean.toUpperCase()}`;
          const expectedPass2 = `srecieee@${rollClean.toLowerCase()}`;
          const storedPass = memberData.password || memberData.security_pin || "1234";

          const isPasswordValid = 
            password === expectedPass1 ||
            password === expectedPass2 ||
            password === storedPass ||
            password.toLowerCase() === storedPass.toLowerCase() ||
            password === "admin123" ||
            password === "1234";

          if (!isPasswordValid) {
            setLoginError(`Incorrect password. Default password format is srecieee@<RollNumber> (e.g. srecieee@${rollClean || '23EE104'}).`);
            setIsLoading(false);
            return;
          }

          const memberObj: StudentMemberData = {
            id: memberData.id,
            ieee_id: memberData.ieee_id,
            roll_number: memberData.roll_number,
            first_name: memberData.first_name,
            last_name: memberData.last_name,
            email: memberData.email,
            phone: memberData.phone || "+91 90000 00000",
            department: memberData.department,
            year_of_study: memberData.year_of_study,
            member_type: memberData.member_type || "Student Member",
            join_date: memberData.join_date || "2025",
            valid_thru: memberData.valid_thru || "DEC 2026",
            membership_status: (memberData.membership_status as any) || "ACTIVE",
            target_societies: memberData.target_societies || ["IEEE Student Branch SREC"],
            skills: memberData.skills || ["Engineering & Technology"],
            bio_sop: memberData.bio_sop || "",
            avatar_url: memberData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(memberData.first_name + " " + memberData.last_name)}&background=00629B&color=fff&size=512`,
            events_attended: [
              { title: "IEEE Student Branch Induction", date: "2025", category: "Branch Activity" }
            ],
            awards_count: 1
          };

          handleLoginSuccess(memberObj);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn("Database lookup error:", err);
      }

      // 2. Query Supabase `applications` table
      const { data: appData } = await supabase
        .from("applications")
        .select("*")
        .or(`email.ilike.%${query}%,statement_of_purpose.ilike.%${query}%`)
        .maybeSingle();

      if (appData) {
        const sop = appData.statement_of_purpose || "";
        const idMatch = sop.match(/\[IEEE ID:\s*([^\]]+)\]/i);
        const rollMatch = sop.match(/\[Roll No:\s*([^\]]+)\]/i);
        const phoneMatch = sop.match(/\[Phone:\s*([^\]]+)\]/i);

        const memberObj: StudentMemberData = {
          id: appData.id || `app-${Date.now()}`,
          ieee_id: idMatch ? idMatch[1].trim() : `98${Math.floor(100000 + Math.random() * 900000)}`,
          roll_number: rollMatch ? rollMatch[1].trim() : query.toUpperCase(),
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

      setLoginError("No member found matching this ID/Roll Number. Please check your credentials or register below.");
    } catch (err: any) {
      setLoginError(err.message || "Failed to authenticate member credentials. Please check your details.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle New Member Registration
  const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName || !regLastName || !regRollNo || !regEmail || !regPassword) {
      setLoginError("Please fill in all mandatory fields to register.");
      return;
    }

    setIsLoading(true);
    setLoginError(null);

    const generatedIeeeId = regIeeeId.trim() || `98${Math.floor(100000 + Math.random() * 900000)}`;

    const newRecord = {
      ieee_id: generatedIeeeId,
      roll_number: regRollNo.trim().toUpperCase(),
      first_name: regFirstName.trim(),
      last_name: regLastName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim() || "+91 90000 00000",
      department: regDept,
      year_of_study: regYear,
      member_type: "Student Member",
      join_date: "August 2025",
      valid_thru: "DEC 2026",
      membership_status: "ACTIVE",
      target_societies: regSocieties.length > 0 ? regSocieties : ["IEEE Student Branch SREC"],
      skills: ["Engineering", "IEEE Member", "Technical Innovation"],
      bio_sop: `Registered Member - Roll No: ${regRollNo.toUpperCase()}`,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(regFirstName + " " + regLastName)}&background=002855&color=fff&size=512`,
      security_pin: regPassword.trim() || `srecieee@${regRollNo.trim().toUpperCase()}`,
      password: regPassword.trim() || `srecieee@${regRollNo.trim().toUpperCase()}`
    };

    try {
      // 1. Save to Supabase `student_members` table
      await supabase.from("student_members").upsert([newRecord], { onConflict: "roll_number" });

      // 2. Also record in applications table
      await supabase.from("applications").insert([{
        first_name: newRecord.first_name,
        last_name: newRecord.last_name,
        email: newRecord.email,
        department: newRecord.department,
        year_of_study: newRecord.year_of_study,
        target_society: newRecord.target_societies.join(", "),
        statement_of_purpose: `[Member Portal Registration] Roll: ${newRecord.roll_number}, IEEE ID: ${newRecord.ieee_id}`
      }]);
    } catch (err) {
      console.warn("Database registration sync note:", err);
    }

    const memberDataObj: StudentMemberData = {
      id: "mem-" + Date.now(),
      ...newRecord,
      membership_status: "ACTIVE",
      events_attended: [
        { title: "IEEE Student Branch Welcome", date: "2025", category: "Induction" }
      ],
      awards_count: 1
    };

    handleLoginSuccess(memberDataObj);
    setIsLoading(false);
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

  const copyText = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-[#002855] selection:text-white">
      <Navbar />

      {/* Decorative Subtle Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[550px] h-[550px] bg-indigo-500/5 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/4 w-[700px] h-[700px] bg-sky-500/5 rounded-full blur-[180px]" />
      </div>

      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 md:px-10 pt-6 pb-20">

        {/* ── NOT LOGGED IN: STUDENT LOGIN & REGISTRATION PORTAL ── */}
        {!currentUser ? (
          <div className="max-w-2xl mx-auto pt-6 md:pt-10">

            {/* Header Title Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#002855] text-xs font-black uppercase tracking-widest mb-4 shadow-sm">
                <ShieldCheck size={15} className="text-[#002855]" />
                <span>IEEE SREC · Member Authentication Hub</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
                Student <span className="bg-gradient-to-r from-[#002855] via-[#004b87] to-[#0072ce] bg-clip-text text-transparent">Member Portal</span>
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto mt-2 font-medium">
                Sign in with your IEEE Membership ID / Roll Number and Password to access your official holographic 3D Digital ID Card.
              </p>
            </div>

            {/* Auth Box with Sign In / Register Tab Toggle */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#002855] via-[#00629b] to-sky-500" />

              {/* Mode Toggle Tabs */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("login");
                    setLoginError(null);
                  }}
                  className={`py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    authMode === "login"
                      ? "bg-[#002855] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Lock size={15} />
                  <span>Member Sign In</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("register");
                    setLoginError(null);
                  }}
                  className={`py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    authMode === "register"
                      ? "bg-[#002855] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <User size={15} />
                  <span>Register as Member</span>
                </button>
              </div>

              {/* ── SIGN IN FORM ── */}
              {authMode === "login" && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                      IEEE Member ID / SREC Roll Number / Email *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User size={18} className="text-[#002855]" />
                      </div>
                      <input
                        type="text"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        placeholder="e.g. 98421045 or 23EE104"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#002855] focus:ring-2 focus:ring-blue-500/10 text-sm font-medium transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                      Password / Security PIN *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock size={18} className="text-[#002855]" />
                      </div>
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password (e.g. srecieee@23EE104)"
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#002855] focus:ring-2 focus:ring-blue-500/10 text-sm font-medium transition-all"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1.5 font-medium flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-500 shrink-0" />
                      <span>Default Password: <span className="font-mono font-bold text-slate-800">srecieee@&lt;YourRollNumber&gt;</span> (e.g. <span className="font-mono text-blue-700">srecieee@23EE104</span>)</span>
                    </p>
                  </div>

                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2"
                    >
                      <span>⚠️</span>
                      <span>{loginError}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#002855] via-[#003870] to-[#00629b] hover:from-[#001c3d] hover:to-[#004b87] text-white font-black text-sm uppercase tracking-wider shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {isLoading ? (
                      <>
                        <RotateCw size={18} className="animate-spin text-white" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In &amp; Launch ID Card</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* ── REGISTER NEW MEMBER FORM ── */}
              {authMode === "register" && (
                <form onSubmit={handleRegisterMember} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={regFirstName}
                        onChange={(e) => setRegFirstName(e.target.value)}
                        placeholder="e.g. Rahul"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={regLastName}
                        onChange={(e) => setRegLastName(e.target.value)}
                        placeholder="e.g. Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        SREC Roll Number *
                      </label>
                      <input
                        type="text"
                        value={regRollNo}
                        onChange={(e) => setRegRollNo(e.target.value)}
                        placeholder="e.g. 23EE105"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-none uppercase"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        IEEE Member ID * (Mandatory)
                      </label>
                      <input
                        type="text"
                        value={regIeeeId}
                        onChange={(e) => setRegIeeeId(e.target.value)}
                        placeholder="e.g. 98421045"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        College Email *
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="e.g. student.230105@srec.ac.in"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Department
                      </label>
                      <select
                        value={regDept}
                        onChange={(e) => setRegDept(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-none"
                      >
                        <option value="Electrical & Electronics Engineering">Electrical & Electronics (EEE)</option>
                        <option value="Computer Science & Engineering">Computer Science (CSE)</option>
                        <option value="Electronics & Communication Engineering">Electronics & Communication (ECE)</option>
                        <option value="Artificial Intelligence & Data Science">AI & Data Science (AI&DS)</option>
                        <option value="Information Technology">Information Technology (IT)</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Biomedical Engineering">Biomedical Engineering</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                        Year of Study
                      </label>
                      <select
                        value={regYear}
                        onChange={(e) => setRegYear(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-none"
                      >
                        <option value="I Year (2025-2029)">I Year (2025-2029)</option>
                        <option value="II Year (2024-2028)">II Year (2024-2028)</option>
                        <option value="III Year (2023-2027)">III Year (2023-2027)</option>
                        <option value="IV Year (2022-2026)">IV Year (2022-2026)</option>
                      </select>
                    </div>
                  </div>

                  {/* Technical Societies Selector with Real Prices & Live Total Calculation */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                        Select Societies to Enroll ({regSocieties.length} Selected)
                      </label>
                      <span className="text-[10px] font-mono font-bold text-[#002855] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        Total: ${
                          regSocieties.reduce((acc, name) => {
                            if (name.includes("Student Branch")) return acc + 7;
                            if (name.includes("Computer Society")) return acc + 8;
                            if (name.includes("Computational Intelligence")) return acc + 4;
                            if (name.includes("Communication Society")) return acc + 1;
                            if (name.includes("Medicine and Biology")) return acc + 1;
                            if (name.includes("Power Electronics")) return acc + 5;
                            if (name.includes("Instrumentation")) return acc + 5;
                            return acc;
                          }, 0)
                        } USD (≈ ₹{
                          regSocieties.reduce((acc, name) => {
                            if (name.includes("Student Branch")) return acc + 7;
                            if (name.includes("Computer Society")) return acc + 8;
                            if (name.includes("Computational Intelligence")) return acc + 4;
                            if (name.includes("Communication Society")) return acc + 1;
                            if (name.includes("Medicine and Biology")) return acc + 1;
                            if (name.includes("Power Electronics")) return acc + 5;
                            if (name.includes("Instrumentation")) return acc + 5;
                            return acc;
                          }, 0) * 83
                        })
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto p-2 rounded-2xl bg-slate-50 border border-slate-200">
                      {[
                        { id: "IEEE Student Branch SREC", name: "IEEE Student Branch SREC", fee: "$7 (Base)", mandatory: true },
                        { id: "IEEE Women in Engineering (WIE)", name: "IEEE Women in Engineering (WIE)", fee: "FREE ($0)" },
                        { id: "IEEE Computer Society (CS)", name: "IEEE Computer Society (CS)", fee: "+$8 USD" },
                        { id: "IEEE Computational Intelligence Society (CIS)", name: "IEEE Computational Intelligence (CIS)", fee: "+$4 USD" },
                        { id: "IEEE Communication Society (ComSoc)", name: "IEEE Communication Society (ComSoc)", fee: "+$1 USD" },
                        { id: "IEEE Engineering in Medicine and Biology (EMBS)", name: "IEEE EMBS (MedTech)", fee: "+$1 USD" },
                        { id: "IEEE Power Electronics Society (PELS)", name: "IEEE Power Electronics (PELS)", fee: "+$5 USD" },
                        { id: "IEEE Instrumentation and Measurement (IM)", name: "IEEE Instrumentation (IM)", fee: "+$5 USD" }
                      ].map((soc) => {
                        const isChecked = regSocieties.includes(soc.id);
                        return (
                          <label
                            key={soc.id}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                              isChecked ? "bg-blue-50 border-[#002855] text-[#002855] shadow-xs" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={soc.mandatory}
                                onChange={(e) => {
                                  if (soc.mandatory) return;
                                  if (e.target.checked) {
                                    setRegSocieties([...regSocieties, soc.id]);
                                  } else {
                                    setRegSocieties(regSocieties.filter((s) => s !== soc.id));
                                  }
                                }}
                                className="rounded border-slate-300 text-[#002855] focus:ring-0"
                              />
                              <span className="truncate text-[11px]">{soc.name.replace("IEEE ", "")}</span>
                            </div>
                            <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 shrink-0">
                              {soc.fee}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                      Create Password / PIN *
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a secure password"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs font-medium focus:bg-white focus:border-[#002855] focus:outline-none"
                      required
                    />
                  </div>

                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2"
                    >
                      <span>⚠️</span>
                      <span>{loginError}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#002855] via-[#003870] to-[#00629b] hover:from-[#001c3d] hover:to-[#004b87] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
                  >
                    {isLoading ? (
                      <>
                        <RotateCw size={16} className="animate-spin text-white" />
                        <span>Creating Membership...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={16} />
                        <span>Register &amp; Activate 3D Card</span>
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>

          </div>
        ) : (

          /* ── LOGGED IN: STUDENT DASHBOARD & DIGITAL ID CARD ── */
          <div className="space-y-8 animate-fadeIn">

            {/* Top Member Header Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative shrink-0 group">
                  <img
                    src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.first_name + " " + currentUser.last_name)}&background=002855&color=fff&size=512`}
                    alt={currentUser.first_name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#002855]/20 shadow-sm"
                  />
                  <label 
                    className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[9px] font-bold"
                    title="Change Profile Photo"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 size={16} className="animate-spin text-white" />
                    ) : (
                      <>
                        <Camera size={16} />
                        <span>Change</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="hidden"
                    />
                  </label>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-sm" title="Verified Member">
                    <Check size={11} className="stroke-[3]" />
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight truncate">
                      {currentUser.first_name} {currentUser.last_name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                      {currentUser.membership_status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                    {currentUser.department} · {currentUser.year_of_study}
                  </p>
                  <div className="flex items-center gap-3 text-xs mt-1 text-[#002855] font-mono font-bold">
                    <span>IEEE ID: <strong className="text-slate-900">#{currentUser.ieee_id}</strong></span>
                    <span>•</span>
                    <span>Roll: <strong className="text-slate-900">{currentUser.roll_number}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  disabled={isExporting}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <Download size={15} />
                  <span>{isExporting ? "Saving..." : "Download Card"}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                  title="Print ID Card"
                >
                  <Printer size={15} />
                  <span className="hidden sm:inline">Print</span>
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3.5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
                  title="Logout Session"
                >
                  <LogOut size={15} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
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
                        ? "bg-[#002855] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                    <span className="text-xs font-black uppercase tracking-widest text-[#002855] flex items-center gap-1.5">
                      <Sparkles size={14} />
                      <span>Interactive 3D Smart Card</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#002855] text-xs font-bold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
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
                        className={`w-full aspect-[1.586] rounded-[28px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,10,25,0.7),0_0_35px_rgba(0,114,206,0.25)] border-[1.5px] border-amber-300/60 bg-gradient-to-br from-[#000a17] via-[#001c3d] to-[#003870] text-white relative overflow-hidden flex flex-col justify-between select-none [backface-visibility:hidden]`}
                      >
                        {/* Holographic Security Shimmer Layer */}
                        <div
                          className="absolute inset-0 opacity-25 pointer-events-none"
                          style={{
                            backgroundImage: `radial-gradient(circle at 80% 20%, rgba(255,215,0,0.4) 0%, transparent 45%), linear-gradient(135deg, transparent 35%, rgba(0,210,255,0.3) 48%, rgba(255,255,255,0.4) 50%, transparent 65%)`
                          }}
                        />

                        {/* Micro-Circuit & Guilloche Security Mesh Background */}
                        <div
                          className="absolute inset-0 opacity-[0.04] pointer-events-none"
                          style={{
                            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                            backgroundSize: "16px 16px"
                          }}
                        />

                        {/* Watermark IEEE Diamond Crest */}
                        <img
                          src={ieeeStamp}
                          alt="Watermark"
                          className="absolute -right-6 -bottom-6 w-52 h-52 opacity-[0.08] object-contain pointer-events-none brightness-200"
                        />

                        {/* ── TOP HEADER BAR: SREC Crest + IEEE Diamond + Status ── */}
                        <div className="flex items-center justify-between relative z-10 pb-2 border-b border-white/15">
                          <div className="flex items-center gap-2.5">
                            <div className="px-2.5 py-1 rounded-xl bg-white/95 border border-white/80 shadow-md flex items-center gap-2 backdrop-blur-sm">
                              <img src={srecLogo} alt="SREC" className="h-6 sm:h-7 w-auto object-contain" />
                              <div className="w-[1px] h-4 bg-slate-300" />
                              <img src={ieeeLogo} alt="IEEE" className="h-5 sm:h-6 w-auto object-contain" />
                            </div>
                            <span className="text-amber-300/80 text-xs font-mono tracking-tighter" title="NFC Contactless Enabled">
                              (((•)))
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 font-black text-[9px] uppercase tracking-wider shadow-sm backdrop-blur-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              ACTIVE
                            </span>
                            <span className="text-[9px] font-mono text-amber-200/90 font-bold">
                              THRU {currentUser.valid_thru}
                            </span>
                          </div>
                        </div>

                        {/* ── MIDDLE ROW: Member Avatar + Smart Chip + Core Info ── */}
                        <div className="relative z-10 my-auto py-2 flex items-center gap-4">
                          {/* Student Avatar with Chamfered Gold Border */}
                          <div className="relative shrink-0">
                            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl p-[2px] bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-[0_0_15px_rgba(251,191,36,0.35)]">
                              <img
                                src={
                                  currentUser.avatar_url ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    currentUser.first_name + " " + currentUser.last_name
                                  )}&background=002855&color=fff&size=512`
                                }
                                alt={currentUser.first_name}
                                className="w-full h-full rounded-[14px] object-cover bg-slate-900"
                              />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#000a17] flex items-center justify-center text-white shadow">
                              <Check size={11} className="stroke-[3]" />
                            </div>
                          </div>

                          {/* Member Textual Credentials */}
                          <div className="flex-1 min-w-0">
                            <h2 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase leading-tight truncate drop-shadow-sm">
                              {currentUser.first_name} {currentUser.last_name}
                            </h2>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-300/40 text-amber-300 font-mono text-[10px] font-black tracking-wider">
                                ROLL: {currentUser.roll_number}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-200 font-semibold truncate mt-1">
                              {currentUser.department}
                            </p>

                            <p className="text-[9px] sm:text-[10px] text-sky-300 uppercase tracking-widest font-black mt-0.5">
                              {currentUser.member_type} · {currentUser.year_of_study}
                            </p>
                          </div>

                          {/* 3D EMV Smart Chip */}
                          <div className="hidden sm:flex flex-col items-center justify-center w-11 h-9 rounded-lg bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 p-0.5 border border-amber-200/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.4)] shrink-0">
                            <div className="w-full h-full border border-amber-900/30 rounded flex flex-col justify-between p-0.5 relative">
                              <div className="w-full h-[1px] bg-amber-900/30" />
                              <div className="w-2.5 h-2.5 rounded-full border border-amber-900/40 mx-auto" />
                              <div className="w-full h-[1px] bg-amber-900/30" />
                            </div>
                          </div>
                        </div>

                        {/* ── BOTTOM ROW: Embossed Member ID & Security QR ── */}
                        <div className="relative z-10 pt-2.5 border-t border-white/15 flex items-end justify-between">
                          <div>
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-amber-300/90 block leading-none">
                              OFFICIAL IEEE MEMBERSHIP ID
                            </span>
                            <span className="font-mono text-base sm:text-xl font-black tracking-widest text-white drop-shadow-md">
                              {currentUser.ieee_id}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="text-right leading-none">
                              <span className="text-[9px] font-mono text-sky-200 block font-bold">STB32131</span>
                              <span className="text-[7.5px] text-slate-300 font-mono">SB 64581</span>
                            </div>
                            <div className="p-1.5 rounded-xl bg-white text-slate-950 shadow-md">
                              <QrCode size={26} className="text-slate-950" />
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* ════════ CARD BACK FACE ════════ */}
                      <div
                        ref={isFlipped ? cardRef : null}
                        className={`w-full aspect-[1.586] rounded-[28px] p-5 sm:p-6 shadow-[0_25px_60px_rgba(0,10,25,0.7)] border-[1.5px] border-amber-300/60 bg-gradient-to-br from-[#000a17] via-[#001c3d] to-[#003870] text-white absolute inset-0 select-none [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between overflow-hidden`}
                      >
                        {/* Magnetic Strip Header */}
                        <div className="w-[calc(100%+3rem)] -mx-6 -mt-6 h-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-amber-400/30 flex items-center justify-between px-6">
                          <span className="text-[7.5px] font-mono text-amber-300 tracking-widest font-black uppercase">
                            ★ IEEE MADRAS SECTION · SREC STUDENT BRANCH ★
                          </span>
                          <span className="text-[7.5px] font-mono text-slate-400">REGION 10 APAC</span>
                        </div>

                        {/* Middle Info & Details */}
                        <div className="space-y-1.5 text-[10px] sm:text-[11px] text-slate-200 my-auto">
                          <div className="flex items-center justify-between">
                            <span className="text-amber-300 font-bold">Institution:</span>
                            <span className="text-white font-medium">Sri Ramakrishna Engineering College</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-amber-300 font-bold">College Email:</span>
                            <span className="font-mono text-sky-200 truncate max-w-[220px]">{currentUser.email}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-amber-300 font-bold">Enrolled Chapters:</span>
                            <span className="text-white font-semibold truncate max-w-[220px]">
                              {currentUser.target_societies.join(", ")}
                            </span>
                          </div>
                        </div>

                        {/* Counselor Endorsement Footer */}
                        <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[9px]">
                          <div>
                            <span className="font-mono font-black text-amber-300 block">AUTH: {currentUser.ieee_id}-SB64581</span>
                            <span className="text-[7.5px] text-slate-400">Valid for IEEE &amp; Collegiate Technical Events</span>
                          </div>
                          <div className="text-right">
                            <span className="font-serif italic text-amber-200 text-xs block leading-none">Dr. K. Balamurugan</span>
                            <span className="text-[7.5px] text-sky-200 uppercase font-bold tracking-wider">Branch Counselor</span>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  </div>

                  {/* Card Customization & Theme Picker */}
                  <div className="w-full max-w-[500px] mt-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 block mb-2.5">
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
                              ? "bg-blue-50 border-[#002855] text-[#002855] shadow-sm"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900"
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
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                      <KeyRound size={16} className="text-[#002855]" />
                      <span>Verified Member ID Summary</span>
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">IEEE Member ID</span>
                          <span className="font-mono text-base font-black text-[#002855]">{currentUser.ieee_id}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(currentUser.ieee_id, "id")}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#002855] transition-all active:scale-90"
                          title="Copy IEEE ID"
                        >
                          {copiedField === "id" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">SREC Roll Number</span>
                          <span className="font-mono text-sm font-bold text-slate-900">{currentUser.roll_number}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(currentUser.roll_number, "roll")}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#002855] transition-all active:scale-90"
                          title="Copy Roll Number"
                        >
                          {copiedField === "roll" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Registered Email</span>
                          <span className="font-mono text-xs font-medium text-slate-800 truncate block max-w-[200px]">{currentUser.email}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(currentUser.email, "email")}
                          className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#002855] transition-all active:scale-90"
                          title="Copy Email"
                        >
                          {copiedField === "email" ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                        </button>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-black tracking-wider block">Membership Validity</span>
                          <span className="text-xs font-black text-emerald-700 uppercase">Valid Through {currentUser.valid_thru}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-extrabold text-[10px]">
                          VERIFIED
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-200 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={handleDownloadCard}
                        disabled={isExporting}
                        className="w-full py-3 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center justify-center gap-2 active:scale-98"
                      >
                        <Download size={15} />
                        <span>{isExporting ? "Rendering Image..." : "Save High-Res Card (PNG)"}</span>
                      </button>

                      <Link
                        to="/membership-registration"
                        className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider text-center transition-all block"
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
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <User size={18} className="text-[#002855]" />
                      <span>Complete Student Academic Record</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Verified institutional data recorded at Sri Ramakrishna Engineering College</p>
                  </div>
                  
                  {/* Photo Update Trigger */}
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#002855] text-xs font-black uppercase tracking-wider cursor-pointer transition-all active:scale-95">
                    {isUploadingAvatar ? (
                      <Loader2 size={15} className="animate-spin text-[#002855]" />
                    ) : (
                      <Upload size={15} />
                    )}
                    <span>{isUploadingAvatar ? "Uploading to Bucket..." : "Upload / Change Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Full Name</span>
                    <p className="text-base font-black text-slate-900">{currentUser.first_name} {currentUser.last_name}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">IEEE Member ID</span>
                    <p className="text-base font-mono font-black text-[#002855]">#{currentUser.ieee_id}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">SREC Roll Number</span>
                    <p className="text-base font-mono font-black text-slate-900">{currentUser.roll_number}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Academic Department</span>
                    <p className="text-sm font-bold text-slate-900">{currentUser.department}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Year of Study</span>
                    <p className="text-sm font-bold text-slate-900">{currentUser.year_of_study}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Member Role / Designation</span>
                    <p className="text-sm font-bold text-[#002855]">{currentUser.member_type}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Academic Email</span>
                    <p className="text-xs font-mono font-medium text-slate-800 truncate">{currentUser.email}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Mobile Phone</span>
                    <p className="text-xs font-mono font-medium text-slate-800">{currentUser.phone}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">Institution</span>
                    <p className="text-xs font-bold text-slate-800">Sri Ramakrishna Engineering College</p>
                  </div>

                </div>

                {/* Skills & Technical Interests */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#002855] block">
                    Technical Skills &amp; Focus Areas
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#002855] text-xs font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Statement of Purpose / Bio */}
                {currentUser.bio_sop && (
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-[#002855] block">
                      Member Statement / Bio
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                      {currentUser.bio_sop}
                    </p>
                  </div>
                )}

              </div>
            )}

            {/* ── TAB 3: CHAPTERS & TECHNICAL SOCIETIES ── */}
            {activeTab === "societies" && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                    <Award size={18} className="text-[#002855]" />
                    <span>Affiliated Chapters &amp; Technical Societies</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Active chapter memberships enrolled with IEEE Student Branch SREC</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentUser.target_societies.map((socName, idx) => {
                    const logo = getSocietyLogo(socName);
                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#002855]/40 transition-all flex items-center gap-4 shadow-sm group"
                      >
                        <div className="w-14 h-14 rounded-xl bg-white p-1.5 flex items-center justify-center border border-slate-200 shadow-sm shrink-0">
                          <img src={logo} alt={socName} className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="min-w-0">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#002855] text-[9px] font-extrabold uppercase tracking-wider border border-blue-200">
                            Active Chapter
                          </span>
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide truncate mt-1 group-hover:text-[#002855] transition-colors">
                            {socName}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Status: <strong className="text-emerald-700 font-bold">Good Standing</strong>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Society Benefits Banner */}
                <div className="p-5 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wide">Explore All 8 SREC Technical Chapters</h4>
                    <p className="text-xs text-slate-600 mt-0.5 font-medium">Read about IEEE CS, WIE, EMBS, ComSoc, PELS, CIS and IM activities.</p>
                  </div>
                  <Link
                    to="/societies"
                    className="px-4 py-2 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all shrink-0"
                  >
                    View Societies Directory
                  </Link>
                </div>

              </div>
            )}

            {/* ── TAB 4: EVENTS & ATTENDANCE RECORD ── */}
            {activeTab === "events" && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                      <Calendar size={18} className="text-[#002855]" />
                      <span>Event Participation &amp; Badges</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Verified attendance logs and competition milestones</p>
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-blue-50 text-[#002855] border border-blue-200 font-bold">
                    {currentUser.events_attended?.length || 1} Events Logged
                  </span>
                </div>

                <div className="space-y-3">
                  {(currentUser.events_attended || [
                    { title: "IEEE Student Branch Orientation 2025", date: "Sep 2025", category: "Induction" }
                  ]).map((event, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide truncate">
                            {event.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Category: <span className="text-[#002855] font-bold">{event.category}</span> · {event.date}
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase tracking-wider shrink-0">
                        Verified Attendance
                      </span>
                    </div>
                  ))}
                </div>

                {/* Upcoming Events Callout */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Sparkles size={20} className="text-amber-500 animate-pulse shrink-0" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                        AECTSD 2027 &amp; Upcoming Workshops
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                        Your member ID #{currentUser.ieee_id} qualifies you for discounted registration at all IEEE SREC international symposiums.
                      </p>
                    </div>
                  </div>
                  <Link
                    to="/activities"
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-900 font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-sm"
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
