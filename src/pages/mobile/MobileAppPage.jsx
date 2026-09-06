import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import html2canvas from "html2canvas";
import { getPrimaryMemberCardPdfUrl } from "@/utils/cardPdfHelper";
import { Users, IdCard, Cpu, LayoutGrid, Search, Sparkles, ShieldCheck, Award, Calendar, DollarSign, Image as ImageIcon, Phone, UserPlus, ArrowRight, ExternalLink, ChevronRight, Share2, Copy, Check, RotateCw, QrCode, SlidersHorizontal, Table as TableIcon, CheckCircle2, Mail, Info, Layers, ArrowLeft, X, Globe, GraduationCap, LogOut, Lock, User, Crown, Trophy, Code2, Wallet, PenTool, Palette, FileText, FileEdit, Download, Camera, Loader2, Eye, ShieldAlert, Building2, BookOpen, KeyRound, Laptop, Zap } from "lucide-react";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ieeeLogo from "@/assets/ieee-logo.png";
import ieeeStamp from "@/assets/ieees.png";
import counselorSign from "@/assets/counselor-signature.png";
import srecLogo from "@/assets/srec-logo.png";
import snrLogo from "@/assets/snr-trust-logo.png";
// Society Logos
import csLogo from "@/assets/societies/CS.png";
import cisLogo from "@/assets/societies/CIS.webp";
import comsocLogo from "@/assets/societies/ComSoc.jpg";
import embsLogo from "@/assets/societies/EMBS.jpg";
import imLogo from "@/assets/societies/IM.jpg";
import wieLogo from "@/assets/societies/WIE.jpg";
import pelsLogo from "@/assets/societies/pels.png";
import casLogo from "@/assets/societies/css.svg";

// ── Role Metadata & Classification Helper ─────────────────────────────
const ROLES_META = [
  { match: ["counsellor", "counselor", "advisor", "mentor"], meta: { priority: 0, category: "leadership", tagline: "Faculty Mentor & Visionary Guide", icon: GraduationCap, color: "#7c3aed", bg: "#f5f3ff" } },
  { match: ["chairperson", "chair"], meta: { priority: 1, category: "leadership", tagline: "Supreme Student Leader", icon: Crown, color: "#d97706", bg: "#fffbeb" } },
  { match: ["vice chair", "vice-chair", "vice chairperson"], meta: { priority: 2, category: "leadership", tagline: "Strategic Growth Driver", icon: Trophy, color: "#059669", bg: "#ecfdf5" } },
  { match: ["secretary"], meta: { priority: 3, category: "core", tagline: "Governance & SB Operations", icon: FileText, color: "#2563eb", bg: "#eff6ff" } },
  { match: ["joint secretary"], meta: { priority: 4, category: "core", tagline: "Operations Coordinator", icon: FileEdit, color: "#0284c7", bg: "#f0f9ff" } },
  { match: ["treasurer"], meta: { priority: 5, category: "core", tagline: "Financial Guardian & Grants", icon: Wallet, color: "#ea580c", bg: "#fff7ed" } },
  { match: ["editor"], meta: { priority: 6, category: "core", tagline: "Editorial & Publications", icon: PenTool, color: "#9333ea", bg: "#faf5ff" } },
  { match: ["web designer", "webmaster", "digital"], meta: { priority: 7, category: "tech_design", tagline: "Digital Architect & Systems", icon: Code2, color: "#4f46e5", bg: "#eef2ff" } },
  { match: ["event", "activity", "activities"], meta: { priority: 8, category: "tech_design", tagline: "Events & Conclaves Orchestrator", icon: Calendar, color: "#0891b2", bg: "#ecfeff" } },
  { match: ["executive member", "exec member", "executive lead", "senior executive"], meta: { priority: 9, category: "exec", tagline: "Executive Committee Lead", icon: ShieldCheck, color: "#0284c7", bg: "#f0f9ff" } },
];

const DEFAULT_OFFICER_META = {
  priority: 99, category: "exec", tagline: "Student Leader & Executive", icon: ShieldCheck, color: "#002855", bg: "#f1f5f9"
};

const getOfficerMeta = (role) => {
  if (!role) return DEFAULT_OFFICER_META;
  const r = role.toLowerCase();
  return ROLES_META.find((x) => x.match.some((m) => r.includes(m)))?.meta ?? DEFAULT_OFFICER_META;
};

const getOfficerImg = (p) => {
  const raw = (p.image_url || p.photo || p.photo_url || p.avatar_url || "").trim();
  if (!raw) return `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || "Member")}&background=002855&color=fff&size=256`;
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }
  const safePath = raw.startsWith("/") ? raw.slice(1) : raw;
  const knownBuckets = ["office_bearers", "society_members", "member-avatars", "avatars", "photos", "societies"];
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

const getSupabaseImgUrl = (p) => {
  if (!p) return "";
  const raw = typeof p === "string" ? p.trim() : (p.image_url || p.photo || p.photo_url || p.avatar_url || "").trim();
  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:") || raw.startsWith("blob:") || raw.startsWith("/")) {
    return raw;
  }
  const safePath = raw.startsWith("/") ? raw.slice(1) : raw;
  const knownBuckets = ["activities", "reports", "office_bearers", "society_members", "member-avatars", "avatars", "photos", "societies"];
  for (const bucket of knownBuckets) {
    if (safePath.startsWith(`${bucket}/`)) {
      const subPath = safePath.slice(bucket.length + 1);
      const { data } = supabase.storage.from(bucket).getPublicUrl(subPath);
      if (data?.publicUrl) return data.publicUrl;
    }
  }
  const { data } = supabase.storage.from("activities").getPublicUrl(safePath);
  return data?.publicUrl || raw;
};

// ── Complete 2026-2027 Office Bearers & Executive Team Baseline Dataset ───
const REAL_OFFICE_BEARERS = [
  {
    id: "ob-12",
    name: "Dr. K. Balamurugan",
    role: "Student Branch Counsellor",
    department: "Associate Professor / EEE",
    category: "leadership",
    tagline: "Faculty Mentor & Visionary Guide",
    color: "#7c3aed",
    bg: "#f5f3ff",
    icon: GraduationCap,
    email: "balamurugan.k@srec.ac.in",
    image_url: "https://srec.ac.in/uploads/Faculty/imresizer4drkbalamurugan260715124354.jpg"
  },
  {
    id: "ob-1",
    name: "S Darshan",
    role: "Chairperson",
    department: "IV Year EEE",
    category: "leadership",
    tagline: "Supreme Student Leader",
    color: "#d97706",
    bg: "#fffbeb",
    icon: Crown,
    email: "darshan.220104@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ob-2",
    name: "D Jennifer Shobha",
    role: "Vice-Chairperson",
    department: "III Year Civil",
    category: "leadership",
    tagline: "Strategic Growth Driver",
    color: "#059669",
    bg: "#ecfdf5",
    icon: Trophy,
    email: "jennifer.230201@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ob-3",
    name: "R Vishnu Kaarthik",
    role: "Secretary",
    department: "III Year EEE",
    category: "core",
    tagline: "Governance & SB Operations",
    color: "#2563eb",
    bg: "#eff6ff",
    icon: FileText,
    email: "vishnukaarthik.230105@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ob-4",
    name: "D R Prithika",
    role: "Treasurer",
    department: "II Year EEE B",
    category: "core",
    tagline: "Financial Guardian & Grants",
    color: "#ea580c",
    bg: "#fff7ed",
    icon: Wallet,
    email: "prithika.240108@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ob-5",
    name: "S Deepak",
    role: "Activities Coordinator",
    department: "IV Year EEE",
    category: "tech_design",
    tagline: "Events & Workshops Orchestrator",
    color: "#0891b2",
    bg: "#ecfeff",
    icon: Calendar,
    email: "deepak.220105@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ob-6",
    name: "S Amirtha Varshini",
    role: "Joint Activity Coordinator",
    department: "III Year CSE A",
    category: "tech_design",
    tagline: "Symposia & Conclaves Operations",
    color: "#0284c7",
    bg: "#f0f9ff",
    icon: Sparkles,
    email: "amirthavarshini.230302@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ob-7",
    name: "V Smrthikha",
    role: "Joint Activity Coordinator",
    department: "III Year BME",
    category: "tech_design",
    tagline: "Interdisciplinary Outreach Lead",
    color: "#db2777",
    bg: "#fdf2f8",
    icon: Sparkles,
    email: "smrthikha.230501@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ob-8",
    name: "K S Surya Narayanan",
    role: "Web Designer & Digital Lead",
    department: "II Year EEE B",
    category: "tech_design",
    tagline: "Digital Architect & Systems",
    color: "#4f46e5",
    bg: "#eef2ff",
    icon: Code2,
    email: "suryanarayanan.240112@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ob-9",
    name: "Nithin Annamalai R",
    role: "Editor & Publications Lead",
    department: "II Year EEE B",
    category: "core",
    tagline: "Newsletter & Content Chief",
    color: "#9333ea",
    bg: "#faf5ff",
    icon: PenTool,
    email: "nithin.240109@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ob-10",
    name: "S Latisha",
    role: "Editor",
    department: "III Year CSE B",
    category: "core",
    tagline: "Technical Content & Reports",
    color: "#c026d3",
    bg: "#fdf4ff",
    icon: FileEdit,
    email: "latisha.230308@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "ob-11",
    name: "Dharshini",
    role: "Editor",
    department: "III Year IT A",
    category: "core",
    tagline: "Editorial & Section Communications",
    color: "#e11d48",
    bg: "#fff1f2",
    icon: FileEdit,
    email: "dharshini.230402@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "em-1",
    name: "S Mathusri",
    role: "Executive Lead",
    department: "III Year M.Tech CSE",
    category: "exec",
    tagline: "Executive Team Direction",
    color: "#059669",
    bg: "#ecfdf5",
    icon: Crown,
    email: "mathusri.238101@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "em-2",
    name: "D Akshaya Dharun",
    role: "Technical Executive",
    department: "II Year CSE A",
    category: "exec",
    tagline: "Coding & Hackathon Ops",
    color: "#0284c7",
    bg: "#f0f9ff",
    icon: Cpu,
    email: "akshaya.240301@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "em-3",
    name: "A Dhivya Tharsana",
    role: "Creative Executive",
    department: "II Year AI & DS",
    category: "exec",
    tagline: "Visual Identity & Posters",
    color: "#d946ef",
    bg: "#fdf4ff",
    icon: Palette,
    email: "dhivya.240601@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "em-4",
    name: "S V Hemesh",
    role: "Operations Executive",
    department: "II Year CSE A",
    category: "exec",
    tagline: "Logistics & Event Management",
    color: "#2563eb",
    bg: "#eff6ff",
    icon: Layers,
    email: "hemesh.240308@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "em-5",
    name: "M Barath",
    role: "Events Executive",
    department: "II Year EEE A",
    category: "exec",
    tagline: "Technical Competitions",
    color: "#f59e0b",
    bg: "#fffbeb",
    icon: Calendar,
    email: "barath.240102@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "em-6",
    name: "F Mohammed Aathif F",
    role: "Social Media Executive",
    department: "II Year EEE A",
    category: "exec",
    tagline: "Digital Outreach & Branding",
    color: "#ec4899",
    bg: "#fdf2f8",
    icon: Share2,
    email: "aathif.240107@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "em-7",
    name: "Bhargavan Balaji",
    role: "Executive Member",
    department: "II Year EEE A",
    category: "exec",
    tagline: "Student Volunteer Team",
    color: "#64748b",
    bg: "#f8fafc",
    icon: ShieldCheck,
    email: "bhargavan.240103@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "em-8",
    name: "R Srenithi",
    role: "Executive Member",
    department: "III Year M.Tech CSE",
    category: "exec",
    tagline: "Student Volunteer Team",
    color: "#64748b",
    bg: "#f8fafc",
    icon: ShieldCheck,
    email: "srenithi.238102@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
  },
  {
    id: "em-9",
    name: "V Swetha",
    role: "Executive Member",
    department: "III Year EIE",
    category: "exec",
    tagline: "Student Volunteer Team",
    color: "#64748b",
    bg: "#f8fafc",
    icon: ShieldCheck,
    email: "swetha.230701@srec.ac.in",
    image_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
  }
];
// Verified Student Members (loaded dynamically from database)
const SEED_MEMBERS = [];

// Complete 2026-2027 Office Bearers & Executive Datasets for all 9 Chapters (Exact Real DB Rows)
const REAL_SOCIETY_DATASETS = {
  embs: {
    bearers: [
      { id: 1, name: "Dr. Deepa B. Prabhu", role: "IEEE EMBS Coordinator", department: "Faculty / BME" },
      { id: 2, name: "Anjanalakshmi S Prabhu", role: "Chairperson", department: "BME" },
      { id: 3, name: "M Iniya Dharshana", role: "Vice-Chairperson", department: "BME" },
      { id: 4, name: "V MadhuShree", role: "Treasurer", department: "BME" },
      { id: 5, name: "U Maimathi", role: "Joint-Treasurer", department: "BME" },
    ],
    execs: [
      { id: 1, name: "N Nisha", role: "Executive Member", department: "BME" },
      { id: 2, name: "V Smrithika", role: "Executive Member", department: "BME" },
      { id: 3, name: "P Susmitha", role: "Executive Member", department: "BME" },
      { id: 4, name: "R Tejashri", role: "Executive Member", department: "BME" },
      { id: 5, name: "S Tejasvi", role: "Executive Member", department: "BME" },
      { id: 6, name: "J Balamurali", role: "Executive Member", department: "BME" },
      { id: 7, name: "Iniya Vivekanandhan", role: "Executive Member", department: "BME" },
      { id: 8, name: "V Jazlin Angela", role: "Executive Member", department: "BME" },
      { id: 9, name: "S Lokha Varshini", role: "Executive Member", department: "BME" },
      { id: 10, name: "P Poojitha", role: "Executive Member", department: "BME" },
      { id: 11, name: "S Preethiv", role: "Executive Member", department: "BME" },
      { id: 12, name: "K Yuvarani", role: "Executive Member", department: "BME" },
    ]
  },
  cs: {
    bearers: [
      { id: 1, name: "Dr. J. Selvakumar", role: "Faculty Advisor", department: "HoD / CSE" },
      { id: 2, name: "Mohan Krishna G R", role: "Chairperson", department: "IV CSE" },
      { id: 3, name: "Arjun S", role: "Vice Chairperson", department: "III CSE" },
      { id: 4, name: "K S Surya Narayanan", role: "Secretary", department: "II EEE" },
      { id: 5, name: "Amirthavarshini S", role: "Treasurer", department: "III CSE" },
      { id: 6, name: "Rohit S K", role: "Activity Coordinator", department: "III CSE" },
    ],
    execs: [
      { id: 1, name: "Seralathan C A", role: "Executive Member", department: "II CSE" },
      { id: 2, name: "Dhakshitha S", role: "Executive Member", department: "II CSE" },
      { id: 3, name: "Sania N", role: "Executive Member", department: "II CSE" },
    ]
  },
  cis: {
    bearers: [
      { id: 1, name: "Dr. R. Kingsy Grace", role: "Faculty Advisor", department: "Professor / CSE" },
      { id: 2, name: "Ashwanth Senthil Kumar", role: "Chairperson", department: "BE. CSE" },
      { id: 3, name: "Latisha S", role: "Vice Chair Person", department: "BE. CSE" },
      { id: 4, name: "Arjun Krishna R", role: "Secretary", department: "BE. CSE" },
      { id: 5, name: "Madhushri Venkitasamy", role: "Treasurer", department: "BE. CSE" },
      { id: 6, name: "Amirthavarshini S", role: "Web Master", department: "BE. CSE" },
      { id: 7, name: "ROHIT S K", role: "Activity Coordinator", department: "BE. CSE" },
      { id: 8, name: "SANIA N", role: "Activity Coordinator", department: "BE. CSE" },
      { id: 9, name: "DHAKSHITHA S", role: "Designer", department: "BE. CSE" },
    ],
    execs: [
      { id: 1, name: "Seralathan C A", role: "Executive Member", department: "BE. CSE" },
    ]
  },
  comsoc: {
    bearers: [
      { id: 1, name: "Dr. M. Kathirvelu", role: "Faculty Advisor", department: "HoD / ECE" },
      { id: 2, name: "Vijayaragavan K", role: "Chairperson", department: "IV ECE" },
      { id: 3, name: "Shri Nithin S B", role: "Vice Chairperson", department: "IV ECE" },
      { id: 4, name: "JAYASHREE VS", role: "Secretary", department: "III ECE" },
      { id: 5, name: "Arulgnani PR", role: "Joint Secretary", department: "III ECE" },
      { id: 6, name: "Dhivya G", role: "Treasurer", department: "III ECE" },
      { id: 7, name: "Madhushree K", role: "Joint Treasurer", department: "II ECE" },
      { id: 8, name: "Evan Mitchell P", role: "Activity Coordinator", department: "III ECE" },
      { id: 9, name: "Kiran Malini V", role: "Activity Coordinator", department: "III ECE" },
      { id: 10, name: "Varsha Nachiyar N", role: "Social Media Lead", department: "II ECE" },
      { id: 11, name: "Porkko N", role: "Social Media", department: "II ECE" },
      { id: 12, name: "Guganeshan P", role: "Webmaster", department: "III ECE" },
      { id: 13, name: "Balasubramanian S", role: "Webmaster", department: "III ECE" },
    ],
    execs: [
      { id: 1, name: "Yonica M", role: "Executive Member", department: "II ECE" },
      { id: 2, name: "Hariprasath Ponnusamy", role: "Executive Member", department: "BE. ECE" },
      { id: 3, name: "Indradharshini U", role: "Executive Member", department: "BE. ECE" },
      { id: 4, name: "Evangeline Stella", role: "Executive Member", department: "BE. ECE" },
      { id: 5, name: "Vaishnavi S", role: "Executive Member", department: "BE. ECE" },
    ]
  },
  pels: {
    bearers: [
      { id: 1, name: "Dr. C. Praveenkumar", role: "Faculty Advisor", department: "AP (Sr.G)/EEE" },
      { id: 2, name: "Pabitra Santra", role: "Chairperson", department: "III EEE" },
      { id: 3, name: "Jeevith Pranav P", role: "Vice-Chairperson", department: "IV EEE" },
      { id: 4, name: "Akshreeya T", role: "Secretary", department: "IV EEE" },
      { id: 5, name: "Swathi P", role: "Editor", department: "II EEE" },
      { id: 6, name: "Nikhil Balaji R", role: "Joint Activity Coordinator", department: "II EEE" },
      { id: 7, name: "Sabarinath V S B", role: "Editor", department: "II EEE" },
      { id: 8, name: "Alexander Samuel R", role: "Activity Coordinator", department: "II EEE" },
      { id: 9, name: "Ranjith Kumar R", role: "Joint Activity Coordinator", department: "II EEE" },
    ],
    execs: [
      { id: 1, name: "Hari saran M", role: "Executive Member", department: "II EEE" },
      { id: 2, name: "Ishani S", role: "Executive Member", department: "II EEE" },
      { id: 3, name: "Arya M S", role: "Executive Member", department: "II EEE" },
      { id: 4, name: "Kavipriya K", role: "Executive Member", department: "II EEE" },
      { id: 5, name: "Vishweshwaran G", role: "Executive Member", department: "II EEE" },
      { id: 6, name: "Janani A P", role: "Executive Member", department: "II EEE" },
    ]
  },
  im: {
    bearers: [
      { id: 1, name: "Dr. Y. Dharsan", role: "Faculty Advisor", department: "AP / EIE" },
      { id: 2, name: "ELAKKIYA R", role: "Chairperson", department: "EIE" },
      { id: 3, name: "HARIHARASUDHAN D", role: "Vice-Chairperson", department: "EIE" },
      { id: 4, name: "SRIDARSHAN A", role: "Secretary", department: "EIE" },
      { id: 5, name: "MOULEESH M", role: "Treasurer", department: "EIE" },
      { id: 6, name: "SIVAPIRIYANARUNACHALAMRAJKUMAR", role: "Event coordinator", department: "EIE" },
      { id: 7, name: "PRAVIN A", role: "Event coordinator", department: "EIE" },
    ],
    execs: [
      { id: 1, name: "SHIRISHKRISHNA S", role: "Executive Member", department: "EIE" },
      { id: 2, name: "RITHIKA S", role: "Executive Member", department: "EIE" },
    ]
  },
  cas: {
    bearers: [
      { id: 1, name: "Dr. K. Balamurugan", role: "Faculty Advisor", department: "AsP/EEE" },
      { id: 2, name: "Darshan S", role: "Chairperson", department: "IV EEE" },
      { id: 3, name: "D Jennifer Shobha", role: "Vice Chairperson", department: "III Civil" },
      { id: 4, name: "Nithin Annamalai R", role: "Secretary", department: "II EEE" },
      { id: 5, name: "D R Prithika", role: "Treasurer", department: "II EEE" },
    ],
    execs: [
      { id: 1, name: "Bhargavan Balaji", role: "Executive Member", department: "II EEE" },
      { id: 2, name: "M Barath", role: "Executive Member", department: "II EEE" },
      { id: 3, name: "F Mohammed Aathif", role: "Executive Member", department: "II EEE" },
    ]
  },
  wie: {
    bearers: [
      { id: 1, name: "Mrs. S. Jansi Rani", role: "IEEE WIE Coordinator", department: "AP (Sr.G)/IT" },
      { id: 2, name: "G J Lithigaa", role: "Chairperson", department: "III IT A" },
      { id: 3, name: "S Dhakshitha", role: "Secretary", department: "III CSE A" },
      { id: 4, name: "S Karishma", role: "Joint Secretary", department: "IV EEE" },
      { id: 5, name: "S Tejasvi", role: "Joint Activity Coordinator", department: "III BME" },
      { id: 6, name: "S I Aravindh", role: "Joint Activity Coordinator", department: "II EEE A" },
      { id: 7, name: "R Tejashri", role: "Treasurer", department: "III BME" },
      { id: 8, name: "J Sindhu", role: "Social Media", department: "III M.Tech CSE" },
      { id: 9, name: "P S Allan", role: "Social Media", department: "III Civil" },
    ],
    execs: [
      { id: 1, name: "K Lahitha", role: "Executive Member", department: "III M.Tech CSE" },
      { id: 2, name: "S Lavanya", role: "Executive Member", department: "III EIE" },
      { id: 3, name: "K Muthtamil", role: "Executive Member", department: "II EEE A" },
      { id: 4, name: "P Mahalakshmi", role: "Executive Member", department: "II AI & DS" },
      { id: 5, name: "V Mahalakshmi", role: "Executive Member", department: "II AI & DS" },
      { id: 6, name: "D Eklesia Blessie", role: "Executive Member", department: "II IT A" },
      { id: 7, name: "S Kaniska Sri", role: "Executive Member", department: "II EEE A" },
    ]
  },
  srec: {
    bearers: [
      { id: 1, name: "Dr. K. Balamurugan", role: "Student Branch Counsellor", department: "AsP/EEE" },
      { id: 2, name: "Darshan S", role: "Chairperson", department: "IV EEE" },
      { id: 3, name: "D Jennifer Shobha", role: "Vice Chairperson", department: "III Civil" },
      { id: 4, name: "D R Prithika", role: "Treasurer", department: "II EEE B" },
      { id: 5, name: "S Deepak", role: "Activities Coordinator", department: "IV EEE" },
      { id: 6, name: "S Amirtha Varshini", role: "Joint Activity Coordinator", department: "III CSE A" },
      { id: 7, name: "V Smrthikha", role: "Joint Activity Coordinator", department: "III BME" },
      { id: 8, name: "K S Surya Narayanan", role: "Webmaster", department: "II EEE B" },
      { id: 9, name: "Nithin Annamalai R", role: "Editor", department: "II EEE B" },
      { id: 10, name: "S Latisha", role: "Editor", department: "III CSE B" },
      { id: 11, name: "Dharshini", role: "Editor", department: "III IT A" },
    ],
    execs: [
      { id: 1, name: "S Mathusri", role: "Executive Member", department: "III M.Tech CSE" },
      { id: 2, name: "A Dhivya Tharsana", role: "Creative Executive", department: "II AI & DS" },
      { id: 3, name: "M Barath", role: "Events Executive", department: "II EEE A" },
      { id: 4, name: "F Mohammed Aathif", role: "Executive Member", department: "II EEE A" },
      { id: 5, name: "Bhargavan Balaji", role: "Executive Member", department: "II EEE A" },
      { id: 6, name: "R Srenithi", role: "Executive Member", department: "III M.Tech CSE" },
      { id: 7, name: "V Swetha", role: "Executive Member", department: "III EIE" },
    ]
  }
};

// Societies Data with Exact Real IEEE Student Membership Pricing (+ 18% GST Tax) & Real Table Chairs
const SOCIETIES_DATA = [
  { id: "srec", code: "IEEE SB SREC", name: "IEEE Student Branch SREC", logo: ieeeStamp, category: "Parent Branch", advisor: "Dr. K. Balamurugan", chair: "Darshan S", members: "180+", feeUSD: "$7.00 USD + 18% GST (≈ ₹684 total)", badge: "Core Chapter", href: "/societies/srec", description: "Primary membership giving full access to all SB flagship events, workshops, and IEEE global portal." },
  { id: "cs", code: "CS", name: "IEEE Computer Society", logo: csLogo, category: "Computing & Software", advisor: "Dr. J. Selvakumar", chair: "Mohan Krishna G R", members: "95+", feeUSD: "$8.00 USD + 18% GST (≈ ₹784 total)", badge: "Most Popular", href: "/societies/cs", description: "Premier technical community for computing, software systems, algorithms, cybersecurity, and AI." },
  { id: "cis", code: "CIS", name: "Computational Intelligence Society", logo: cisLogo, category: "AI & Deep Learning", advisor: "Dr. R. Kingsy Grace", chair: "Ashwanth Senthil Kumar", members: "60+", feeUSD: "$4.00 USD + 18% GST (≈ ₹392 total)", badge: "AI Frontier", href: "/societies/cis", description: "Focusing on neural networks, evolutionary computing, fuzzy logic, deep learning, and intelligent agents." },
  { id: "comsoc", code: "ComSoc", name: "Communication Society", logo: comsocLogo, category: "5G & Telecommunications", advisor: "Dr. M. Kathirvelu", chair: "Vijayaragavan K", members: "50+", feeUSD: "$1.00 USD + 18% GST (≈ ₹98 total)", badge: "Next-Gen Comms", href: "/societies/comsoc", description: "Connecting engineers in telecommunications, optical networking, 5G/6G, and RF wireless protocols." },
  { id: "embs", code: "EMBS", name: "Engineering in Medicine & Biology", logo: embsLogo, category: "Biotech & Healthcare", advisor: "Dr. Deepa B. Prabhu", chair: "Anjanalakshmi S Prabhu", members: "45+", feeUSD: "$1.00 USD + 18% GST (≈ ₹98 total)", badge: "HealthTech", href: "/societies/embs", description: "Bridging engineering with medical sciences, healthcare instrumentation, bioinformatics, and biosensors." },
  { id: "pels", code: "PELS", name: "Power Electronics Society", logo: pelsLogo, category: "EV & Green Energy", advisor: "Dr. C. Praveenkumar", chair: "Pabitra Santra", members: "55+", feeUSD: "$10.00 USD + 18% GST (≈ ₹980 total)", badge: "Clean Tech", href: "/societies/pels", description: "Dedicated to power conversion, renewable energy grids, motor drives, EV systems, and power chips." },
  { id: "im", code: "IM", name: "Instrumentation & Measurement", logo: imLogo, category: "Sensors & Precision", advisor: "Dr. Y. Dharsan", chair: "ELAKKIYA R", members: "40+", feeUSD: "$5.00 USD + 18% GST (≈ ₹490 total)", badge: "Smart Sensors", href: "/societies/im", description: "Advancing precision sensors, automated testing, smart instrumentation, calibration, and metrology." },
  { id: "cas", code: "CAS", name: "Circuits and Systems Society", logo: casLogo, category: "VLSI & Chip Design", advisor: "Dr. K. Balamurugan", chair: "Darshan S", members: "80+", feeUSD: "$6.00 USD + 18% GST (≈ ₹588 total)", badge: "VLSI & ICs", href: "/societies/cas", description: "Advancing theory, design, and practical implementation of circuits, VLSI systems, microchips, and signal processing." },
  { id: "wie", code: "WIE", name: "Women in Engineering Affinity Group", logo: wieLogo, category: "Diversity & STEM", advisor: "Mrs. S. Jansi Rani", chair: "G J Lithigaa", members: "110+", feeUSD: "$0.00 (FREE for Students)", badge: "Empowerment", href: "/societies/wie", description: "Global network inspiring, encouraging, and empowering women scientists and engineers in STEM." }
];
// Past Bearers Data
const PAST_BEARERS_DATA = [
  { year: "2024-2025", role: "Chairperson", name: "Sabarinath M", dept: "ECE", achievement: "Exemplary Student Branch Award" },
  { year: "2024-2025", role: "Secretary", name: "Kavya R", dept: "CSE", achievement: "Best WIE Outreach Award" },
  { year: "2023-2024", role: "Chairperson", name: "Naveen Kumar S", dept: "EEE", achievement: "Highest Member Growth in Section" },
  { year: "2023-2024", role: "Secretary", name: "Swathi P", dept: "BME", achievement: "Madras Section Travel Grant" },
  { year: "2022-2023", role: "Chairperson", name: "Dinesh K", dept: "CSE", achievement: "Section Outstanding Volunteer" }
];
// Awards & Honors Data
const AWARDS_DATA = [
  { title: "IEEE Madras Section Exemplary Student Branch", year: "2024", body: "IEEE Madras Section", prize: "₹15,000 & Plaque" },
  { title: "Regional Exemplary Student Branch Award (R10)", year: "2023", body: "IEEE Region 10 (Asia-Pacific)", prize: "$500 Grant" },
  { title: "Outstanding Student Volunteer Award", year: "2024", body: "IEEE Computer Society Madras", prize: "Honorary Citation" },
  { title: "Best WIE Affinity Group Initiative", year: "2024", body: "IEEE Madras Section WIE", prize: "₹10,000 Grant" }
];
// Annual Plans Data
const ANNUAL_PLANS_DATA = [
  { month: "January", event: "Renewable Energy & Smart Grid Workshop", society: "PELS", budget: "₹18,000", status: "Completed" },
  { month: "February", event: "WIE STEM Outreach for School Students", society: "WIE", budget: "₹12,000", status: "Completed" },
  { month: "March", event: "National Level AI & LLM Bootcamp", society: "CS & CIS", budget: "₹25,000", status: "Completed" },
  { month: "May", event: "IEEE Leadership Transition Meet", society: "Parent SB", budget: "₹10,000", status: "Completed" },
  { month: "July", event: "HackIEEE 2025 - 24hr Hackathon", society: "Tech Hub", budget: "₹65,000", status: "Completed" },
  { month: "August", event: "VisionX National Technical Symposium", society: "CS / CIS", budget: "₹45,000", status: "Completed" },
  { month: "October", event: "Global IEEE Day 2025 Celebrations", society: "All Chapters", budget: "₹30,000", status: "Completed" },
  { month: "February 2027", event: "AECTSD 2027 International Conference", society: "IEEE SREC", budget: "₹3,50,000", status: "Upcoming" }
];
// Funding Data
const FUNDING_DATA = [
  { grant: "IEEE Madras Section Activity Support Grant", amount: "₹25,000", year: "2025", agency: "IEEE Madras Section", purpose: "Symposium & Hackathon" },
  { grant: "IEEE Region 10 Educational Activities Fund", amount: "$400 USD", year: "2024", agency: "IEEE R10 Asia-Pacific", purpose: "School STEM Outreach" },
  { grant: "IEEE Computer Society Chapter Support Grant", amount: "$300 USD", year: "2024", agency: "IEEE CS Global", purpose: "Cloud AI Workshop" },
  { grant: "SREC Management Institutional Match Grant", amount: "₹1,50,000", year: "2025", agency: "SNR Sons Trust", purpose: "Lab Infrastructure & Events" }
];
// Contact Directory
const CONTACT_DIRECTORY = [
  { title: "Branch Counselor", contact: "Dr. K. Balamurugan", detail: "+91 94435 67890", email: "balamurugan.k@srec.ac.in" },
  { title: "Student Chairperson", contact: "S Darshan", detail: "+91 94882 14502", email: "darshan.220104@srec.ac.in" },
  { title: "Web Designer & Digital Lead", contact: "K S Surya Narayanan", detail: "+91 91234 56780", email: "suryanarayanan.240112@srec.ac.in" },
  { title: "Official SB Email", contact: "IEEE SREC Desk", detail: "ieee@srec.ac.in", email: "ieee@srec.ac.in" },
  { title: "Campus Location", contact: "Sri Ramakrishna Engineering College", detail: "Vattamalaipalayam, NGGO Colony, Coimbatore - 641022", email: "info@srec.ac.in" }
];
const EVENTS_DATA = [
  {
    id: "aectsd-2027",
    title: "AECTSD 2027: International Conference",
    subtitle: "Advances in Electrical, Communication & Thermal Systems for Sustainable Development",
    category: "Conference",
    date: "Feb 18-20, 2027",
    time: "09:00 AM - 05:30 PM",
    venue: "SREC Main Auditorium & Mechanical Seminar Hall",
    society: "IEEE SREC SB",
    badge: "Flagship 2027",
    status: "Upcoming",
    color: "from-amber-500 to-red-500",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
    link: "http://aectsd2027.srecieee.org/",
    description: "Premier IEEE international conference featuring keynote researchers from NUS Singapore, IIT Madras, and international power engineers."
  },
  {
    id: "visionx-2025",
    title: "VisionX 2025: National Level Technical Symposium",
    subtitle: "AI Hackathons, Paper Presentations, Web Dev & Coding Wars",
    category: "Symposium",
    date: "August 29, 2025",
    time: "09:00 AM - 04:30 PM",
    venue: "CSE & IT Department Complex",
    society: "IEEE CS & CIS",
    badge: "National Symposium",
    status: "Completed",
    color: "from-blue-600 to-cyan-500",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80",
    link: "/activities",
    description: "Annual national tech fest hosting 800+ engineering participants across 12 inter-collegiate competitive tracks."
  },
  {
    id: "ieee-xtreme",
    title: "IEEE Xtreme 19.0: Global 24-Hour Hackathon",
    subtitle: "World-wide virtual programming contest with 10,000+ teams",
    category: "Hackathon",
    date: "October 2025",
    time: "24 Hours Continuous",
    venue: "SREC Central Computing Labs",
    society: "IEEE Computer Society",
    badge: "Global Coding",
    status: "Completed",
    color: "from-indigo-600 to-purple-600",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80",
    link: "/activities",
    description: "Proctored 24-hour non-stop algorithmic problem solving contest on HackerRank with worldwide IEEE ranking."
  },
  {
    id: "ieee-day-2025",
    title: "Global IEEE Day 2025 Celebrations",
    subtitle: "Project Expo, Tech Quiz, Cake Cutting & Alumni Keynote",
    category: "Celebration",
    date: "October 03, 2025",
    time: "10:00 AM - 04:00 PM",
    venue: "SREC Campus Plaza",
    society: "All 8 Chapters",
    badge: "IEEE Day",
    status: "Completed",
    color: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
    link: "/activities",
    description: "Commemorating the first time IEEE members gathered worldwide to share technical ideas in 1884."
  },
  {
    id: "smart-grid-workshop",
    title: "Renewable Energy & EV Smart Grid Lab",
    subtitle: "Hands-on MATLAB & Hardware Inverter Design",
    category: "Workshop",
    date: "January 2025",
    time: "09:30 AM - 04:00 PM",
    venue: "EEE Power Electronics Research Lab",
    society: "IEEE PELS",
    badge: "Clean Tech",
    status: "Completed",
    color: "from-amber-600 to-yellow-500",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80",
    link: "/societies/pels",
    description: "Hands-on training on photovoltaic converters, battery management systems, and brushless DC motor controllers."
  },
  {
    id: "wie-stem-outreach",
    title: "WIE Star Outreach: School STEM Drive",
    subtitle: "Inspiring Young Women Students in Science & Robotics",
    category: "Outreach",
    date: "February 2025",
    time: "10:00 AM - 03:30 PM",
    venue: "Government Higher Secondary School, Coimbatore",
    society: "IEEE WIE",
    badge: "Empowerment",
    status: "Completed",
    color: "from-pink-500 to-rose-600",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80",
    link: "/societies/wie",
    description: "Empowering 120+ school girls with fundamental science experiments, robotics kits, and coding basics."
  }
];
// Helper to format short chapter names on card back
const formatShortSocieties = (societies) => {
  if (!societies) return "SB SREC";
  const list = Array.isArray(societies)
    ? societies
    : (typeof societies === "string" ? societies.split(",") : [societies]);
  const shortMap = {
    "IEEE Student Branch SREC": "SB SREC",
    "IEEE Women in Engineering (WIE)": "WIE",
    "IEEE Computer Society (CS)": "CS",
    "IEEE Computational Intelligence Society (CIS)": "CIS",
    "IEEE Communication Society (ComSoc)": "ComSoc",
    "IEEE Engineering in Medicine and Biology (EMBS)": "EMBS",
    "IEEE Power Electronics Society (PELS)": "PELS",
    "IEEE Instrumentation and Measurement (IM)": "IM",
    "IEEE Circuits and Systems Society (CAS)": "CAS",
  };
  return list
    .filter(Boolean)
    .map((raw) => {
      const s = String(raw || "").trim();
      if (!s) return "";
      if (shortMap[s]) return shortMap[s];
      const match = s.match(/\(([^)]+)\)/);
      if (match) return match[1];
      return s.replace(/^IEEE\s+/i, "").replace(/\s+Society/i, "").replace(/Student Branch/i, "SB");
    })
    .filter(Boolean)
    .join(", ") || "SB SREC";
};
const CARD_THEMES = [
  { id: "classic", name: "IEEE Navy", gradient: "from-[#002244] via-[#004b87] to-[#00629b]", border: "border-sky-300/40", text: "text-sky-200" },
  { id: "cyber", name: "Cyan Glow", gradient: "from-[#021329] via-[#002f5e] to-[#004e8a]", border: "border-cyan-400/60", text: "text-cyan-200" },
  { id: "gold", name: "Gold Foil", gradient: "from-[#241a05] via-[#42320d] to-[#594311]", border: "border-amber-400/60", text: "text-amber-200" },
  { id: "titanium", name: "Dark Titanium", gradient: "from-[#0f172a] via-[#1e293b] to-[#334155]", border: "border-slate-400/40", text: "text-slate-200" }
];
export const MobileAppPage = ({
  defaultTab = "home",
  defaultCategory = "menu",
  focusSociety = null,
  forceLogin = false
} = {}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("srec_ieee_app_user") || localStorage.getItem("ieee_student_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear any old dummy demo session
        if (parsed && (parsed.id === "stu-001" || parsed.id === "stu-002" || parsed.id === "stu-003" || parsed.roll_number === "22EE104")) {
          localStorage.removeItem("srec_ieee_app_user");
          localStorage.removeItem("ieee_student_session");
          return null;
        }
        return parsed;
      }
    } catch {}
    return null;
  });
  const [isGuestMode, setIsGuestMode] = useState(!forceLogin);
  const [loginInput, setLoginInput] = useState("");
  const [authPin, setAuthPin] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  // Valid Tab Identifiers
  const VALID_TABS = ["home", "societies", "id", "events", "menu"];

  // Tab State with Resilient Fallback
  const tabParam = searchParams.get("tab");
  const initialTab = (tabParam && VALID_TABS.includes(tabParam))
    ? tabParam
    : (defaultTab && VALID_TABS.includes(defaultTab) ? defaultTab : "home");
  const [activeTab, setActiveTab] = useState(initialTab);
  // Sub-page category in "All Pages" menu
  const [allPagesCategory, setAllPagesCategory] = useState(defaultCategory || "menu");
  // Focused Society Detail Chapter (if any)
  const [selectedSocietyId, setSelectedSocietyId] = useState(focusSociety || null);
  // Office Bearers Category Filter: all | leadership | core | tech_design | exec
  const [officerCategory, setOfficerCategory] = useState("all");
  const [dbOfficers, setDbOfficers] = useState(REAL_OFFICE_BEARERS);
  const [dynamicSocietyLeaders, setDynamicSocietyLeaders] = useState({});
  const [dynamicSocietyOfficers, setDynamicSocietyOfficers] = useState({});
  const [dynamicSocietyExecutives, setDynamicSocietyExecutives] = useState({});

  // Synchronize tab and category when navigation or parameters change
  useEffect(() => {
    const currentParam = searchParams.get("tab");
    if (currentParam && VALID_TABS.includes(currentParam)) {
      setActiveTab(currentParam);
    } else if (defaultTab && VALID_TABS.includes(defaultTab)) {
      setActiveTab(defaultTab);
    }
    if (defaultCategory) setAllPagesCategory(defaultCategory);
    if (focusSociety) setSelectedSocietyId(focusSociety);
    if (forceLogin) setIsGuestMode(false);
  }, [searchParams, defaultTab, defaultCategory, focusSociety, forceLogin]);
  // Events Category Filter: all | Upcoming | Symposium | Hackathon | Workshop | Celebration | Outreach
  const [eventCategoryFilter, setEventCategoryFilter] = useState("All");
  const [dbEvents, setDbEvents] = useState(EVENTS_DATA);
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  // Live Database Datasets for All Mobile Pages
  const [dbPastBearers, setDbPastBearers] = useState(PAST_BEARERS_DATA);
  const [dbAwards, setDbAwards] = useState(AWARDS_DATA);
  const [dbAnnualPlans, setDbAnnualPlans] = useState(ANNUAL_PLANS_DATA);
  const [dbFunding, setDbFunding] = useState(FUNDING_DATA);
  const [dbSeniorMembers, setDbSeniorMembers] = useState([]);
  const [dbMemberCounts, setDbMemberCounts] = useState([]);
  // View Mode toggle: "table" vs "cards"
  const [viewMode, setViewMode] = useState("cards");
  // Members list & Selected member (no demo default)
  const [members, setMembers] = useState(SEED_MEMBERS);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  // Digital ID Card states (Single Official IEEE Navy Style)
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedText, setCopiedText] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDownloadingCardImg, setIsDownloadingCardImg] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  // PDF Viewer Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState("");
  const [detailModalMember, setDetailModalMember] = useState(null);
  // Membership Renewal State
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewalYear, setRenewalYear] = useState("2027");
  const [renewalSuccessToast, setRenewalSuccessToast] = useState(false);
  // In-App Registration State & Handlers
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regForm, setRegForm] = useState({
    firstName: "",
    lastName: "",
    rollNumber: "",
    ieeeId: "",
    email: "",
    phone: "",
    department: "Computer Science & Engineering",
    yearOfStudy: "I Year (2024-2028)",
    selectedSocieties: ["IEEE Student Branch SREC", "IEEE Computer Society (CS)"],
    skills: "Engineering, Coding, IEEE Events",
    sop: ""
  });
  const [isRegSubmitting, setIsRegSubmitting] = useState(false);
  // Global Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");
  const idCardRef = useRef(null);
  const cardFrontRef = useRef(null);
  // Check saved session and load all members from Supabase database on mount
  useEffect(() => {
    const saved = localStorage.getItem("srec_ieee_app_user") || localStorage.getItem("ieee_student_session");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.ieee_id) {
          setCurrentUser(parsed);
          setSelectedMember(parsed);
        }
      }
      catch (err) {
        localStorage.removeItem("srec_ieee_app_user");
      }
    }
    // Fetch live member directory, office bearers, and all table datasets from Supabase
    const fetchDbData = async () => {
      try {
        const [
          membersRes,
          b1,
          e1,
          pastBRes,
          awardsRes,
          plansRes,
          fundingRes,
          seniorRes,
          memberCountsRes
        ] = await Promise.all([
          supabase.from("student_members").select("*").order("created_at", { ascending: false }),
          supabase.from("srec_office_bearers").select("*"),
          supabase.from("srec_executive_members").select("*"),
          supabase.from("office_bearers").select("*").order("year", { ascending: false }),
          supabase.from("awards").select("*").order("year", { ascending: false }),
          supabase.from("annual_plan").select("*").order("s_no", { ascending: true }),
          supabase.from("funding_submissions").select("*").order("id", { ascending: false }),
          supabase.from("senior_members").select("*").order("s_no", { ascending: true }),
          supabase.from("member_counts").select("*").order("year", { ascending: false }),
        ]);

        if (membersRes.data && membersRes.data.length > 0) {
          setMembers(membersRes.data);
        }

        // Process live past office bearers table
        if (pastBRes.data && pastBRes.data.length > 0) {
          const formattedPast = pastBRes.data.map((r) => ({
            year: r.academic_year || (r.year ? `${r.year}-${Number(r.year) + 1}` : "2024-2025"),
            role: r.role || "Executive Member",
            name: r.name || "Officer",
            dept: r.department || "Engineering",
            achievement: r.group_name || r.society_code || "IEEE Student Branch Service"
          }));
          setDbPastBearers(formattedPast);
        }

        // Process live awards table
        if (awardsRes.data && awardsRes.data.length > 0) {
          const formattedAwards = awardsRes.data.map((r) => ({
            id: r.id,
            title: r.title || "IEEE Accolade",
            year: r.year ? String(r.year) : "2024",
            body: r.body || r.category || "IEEE Madras Section",
            prize: r.prize || r.description || "Citation Plaque"
          }));
          setDbAwards(formattedAwards);
        }

        // Process live annual plans table
        if (plansRes.data && plansRes.data.length > 0) {
          const formattedPlans = plansRes.data.map((r) => ({
            id: r.id,
            month: r.month || "Academic Year",
            event: r.event || "IEEE Technical Initiative",
            society: r.society || "IEEE SB",
            budget: r.budget || "Sanctioned",
            status: r.status || "Completed"
          }));
          setDbAnnualPlans(formattedPlans);
        }

        // Process live funding table
        if (fundingRes.data && fundingRes.data.length > 0) {
          const formattedFunding = fundingRes.data.map((r) => ({
            id: r.id,
            grant: r.title || "Activity Support Grant",
            amount: r.budget_amount ? (String(r.budget_amount).startsWith("$") || String(r.budget_amount).startsWith("₹") ? r.budget_amount : `₹${r.budget_amount}`) : "₹25,000",
            year: r.description && r.description.includes("Year:") ? r.description.replace("Year:", "").trim() : (r.created_at ? new Date(r.created_at).getFullYear().toString() : "2024"),
            agency: r.submission_type || "IEEE Madras Section",
            purpose: r.description || "Technical Conclaves & Student Chapters"
          }));
          setDbFunding(formattedFunding);
        }

        if (seniorRes.data && seniorRes.data.length > 0) {
          setDbSeniorMembers(seniorRes.data);
        }

        if (memberCountsRes.data && memberCountsRes.data.length > 0) {
          setDbMemberCounts(memberCountsRes.data);
        }

        // Process live office bearers from tables
        const srecB = (b1.data && b1.data.length > 0) ? b1.data : [];
        const srecE = (e1.data && e1.data.length > 0) ? e1.data : [];
        const combined = [...srecB, ...srecE];

        if (combined.length > 0) {
          const formattedOfficers = combined.map((m, idx) => {
            const meta = getOfficerMeta(m.role);
            const img = getOfficerImg(m);
            return {
              id: m.id ? `db-${m.id}` : `ob-${idx}`,
              name: m.name || "Officer",
              role: m.role || "Executive Member",
              department: m.department || "SREC IEEE",
              category: meta.category,
              tagline: meta.tagline,
              color: meta.color,
              bg: meta.bg,
              icon: meta.icon,
              email: m.email || (m.name ? `${m.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in` : ""),
              image_url: img,
              priority: meta.priority
            };
          }).sort((a, b) => a.priority - b.priority);

          setDbOfficers(formattedOfficers);
        }

        // Fetch dedicated tables for each society to retrieve exact live chairs, advisors, office bearers, and executive members
        const socTables = {
          srec: {
            bearers: ["srec_office_bearers"],
            execs: ["srec_executive_members"],
          },
          cs: {
            bearers: ["cs_office_bearers"],
            execs: ["cs_executive_members"],
          },
          cis: {
            bearers: ["cis_office_bearers"],
            execs: ["cis_executive_members"],
          },
          comsoc: {
            bearers: ["comsoc_office_bearers"],
            execs: ["comsoc_executive_members"],
          },
          embs: {
            bearers: ["embs_office_bearers"],
            execs: ["embs_executive_members"],
          },
          pels: {
            bearers: ["pels_office_bearers"],
            execs: ["pels_executive_members"],
          },
          im: {
            bearers: ["im_office_bearers", "ims_office_bearers"],
            execs: ["im_executive_members", "ims_executive_members"],
          },
          cas: {
            bearers: ["cas_office_bearers", "cass_office_bearers"],
            execs: ["cas_executive_members", "cass_executive_members"],
          },
          wie: {
            bearers: ["wie_office_bearers"],
            execs: ["wie_executive_members"],
          },
        };

        const liveLeaders = {};
        const liveOfficers = {};
        const liveExecutives = {};

        await Promise.all(
          Object.entries(socTables).map(async ([socKey, cfg]) => {
            // 1. Fetch Chapter Office Bearers
            for (const tbl of cfg.bearers) {
              try {
                const { data } = await supabase.from(tbl).select("*").order("id", { ascending: true });
                if (data && data.length > 0) {
                  const chairPerson = data.find((r) => {
                    const role = (r.role || "").toLowerCase();
                    return (role.includes("chair") || role.includes("president")) && !role.includes("vice") && !role.includes("co-chair");
                  });
                  const advisor = data.find((r) => {
                    const role = (r.role || "").toLowerCase();
                    return (
                      role.includes("counselor") ||
                      role.includes("counsellor") ||
                      role.includes("advisor") ||
                      (role.includes("coordinator") && !role.includes("activity") && !role.includes("event") && !role.includes("joint"))
                    );
                  });
                  if (chairPerson || advisor) {
                    liveLeaders[socKey] = {
                      chair: chairPerson?.name || undefined,
                      chairImg: chairPerson ? getSupabaseImgUrl(chairPerson) : undefined,
                      advisor: advisor?.name || undefined,
                      advisorImg: advisor ? getSupabaseImgUrl(advisor) : undefined,
                    };
                  }
                  liveOfficers[socKey] = data.map((r) => ({
                    id: r.id,
                    name: r.name,
                    role: r.role,
                    department: r.department || "",
                    academic_year: r.academic_year || "",
                    image_url: getSupabaseImgUrl(r),
                    linkedin_url: r.linkedin_url || ""
                  }));
                  break;
                }
              } catch {}
            }

            // 2. Fetch Chapter Executive Members
            for (const tbl of cfg.execs) {
              try {
                const { data } = await supabase.from(tbl).select("*").order("id", { ascending: true });
                if (data && data.length > 0) {
                  liveExecutives[socKey] = data.map((r) => ({
                    id: r.id,
                    name: r.name,
                    role: r.role || "Executive Member",
                    department: r.department || "",
                    academic_year: r.academic_year || "",
                    image_url: getSupabaseImgUrl(r),
                    linkedin_url: r.linkedin_url || ""
                  }));
                  break;
                }
              } catch {}
            }
          })
        );
        if (Object.keys(liveLeaders).length > 0) {
          setDynamicSocietyLeaders(liveLeaders);
        }
        if (Object.keys(liveOfficers).length > 0) {
          setDynamicSocietyOfficers(liveOfficers);
        }
        if (Object.keys(liveExecutives).length > 0) {
          setDynamicSocietyExecutives(liveExecutives);
        }

        // 3. Fetch Live Events & Activities from Supabase tables (activities, annual_plan, event_reports)
        try {
          const [actRes, planRes, repRes] = await Promise.all([
            supabase.from("activities").select("*").order("s_no", { ascending: false }),
            supabase.from("annual_plan").select("*").order("s_no", { ascending: true }),
            supabase.from("event_reports").select("*").order("id", { ascending: false }),
          ]);

          const loadedEvents = [];

          // Process activities table rows
          if (actRes.data && actRes.data.length > 0) {
            actRes.data.forEach((a) => {
              const nameLower = (a.event || "").toLowerCase();
              let category = "Workshop";
              if (nameLower.includes("conference") || nameLower.includes("aectsd")) category = "Conference";
              else if (nameLower.includes("symposium") || nameLower.includes("visionx")) category = "Symposium";
              else if (nameLower.includes("hackathon") || nameLower.includes("xtreme") || nameLower.includes("code") || nameLower.includes("coding")) category = "Hackathon";
              else if (nameLower.includes("celebration") || nameLower.includes("inaugur") || nameLower.includes("day")) category = "Celebration";
              else if (nameLower.includes("outreach") || nameLower.includes("school") || nameLower.includes("stem")) category = "Outreach";
              else if (nameLower.includes("webinar") || nameLower.includes("talk") || nameLower.includes("seminar")) category = "Webinar";

              const isUpcoming = (a.date || "").includes("2026") || (a.date || "").includes("2027") || nameLower.includes("upcoming");

              loadedEvents.push({
                id: `act-${a.id || a.s_no}`,
                title: a.event || "IEEE SB Activity",
                subtitle: a.chief_guest ? `Chief Guest: ${a.chief_guest}` : "Technical SB Activity",
                category,
                date: a.date || "Academic Session",
                time: "09:30 AM - 04:30 PM",
                venue: "SREC Campus, Coimbatore",
                society: "IEEE SREC SB",
                badge: a.s_no ? `Activity #${a.s_no}` : category,
                status: isUpcoming ? "Upcoming" : "Completed",
                chief_guest: a.chief_guest || "",
                participants: a.participants || "",
                description: a.chief_guest ? `Conducted with distinguished guest ${a.chief_guest}. Total participants: ${a.participants || "Open to all"}.` : `Official IEEE Student Branch technical activity at Sri Ramakrishna Engineering College.`,
                image: a.image_url ? getSupabaseImgUrl(a.image_url) : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80",
                link: "/activities",
              });
            });
          }

          // Process annual_plan table rows
          if (planRes.data && planRes.data.length > 0) {
            planRes.data.forEach((p) => {
              const nameLower = (p.event || "").toLowerCase();
              let category = "Workshop";
              if (nameLower.includes("conference") || nameLower.includes("aectsd")) category = "Conference";
              else if (nameLower.includes("symposium") || nameLower.includes("visionx")) category = "Symposium";
              else if (nameLower.includes("hackathon")) category = "Hackathon";
              else if (nameLower.includes("celebration") || nameLower.includes("day") || nameLower.includes("transition")) category = "Celebration";
              else if (nameLower.includes("outreach") || nameLower.includes("stem")) category = "Outreach";

              const isUpcoming = (p.status || "").toLowerCase() === "upcoming" || (p.month || "").includes("2026") || (p.month || "").includes("2027");

              if (!loadedEvents.some(e => e.title.toLowerCase().trim() === (p.event || "").toLowerCase().trim())) {
                loadedEvents.push({
                  id: `plan-${p.id || p.s_no}`,
                  title: p.event || "Annual Plan Initiative",
                  subtitle: `Organized by ${p.society || "IEEE SB"} · Budget ${p.budget || "Sanctioned"}`,
                  category,
                  date: p.month || "Academic Year",
                  time: "Scheduled Session",
                  venue: "SREC Campus Auditorium & Labs",
                  society: p.society || "IEEE SREC",
                  badge: p.status === "Upcoming" ? "Upcoming Plan" : "Annual Plan",
                  status: isUpcoming ? "Upcoming" : "Completed",
                  description: `Annual activity initiative planned by ${p.society || "IEEE Student Branch"}. Allocated budget: ${p.budget || "Standard"}.`,
                  image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80",
                  link: "/activities",
                });
              }
            });
          }

          // Process event_reports table rows
          if (repRes.data && repRes.data.length > 0) {
            repRes.data.forEach((r) => {
              const nameLower = (r.title || r.event_name || "").toLowerCase();
              let category = r.category || "Workshop";
              if (nameLower.includes("conference")) category = "Conference";
              else if (nameLower.includes("symposium")) category = "Symposium";
              else if (nameLower.includes("hackathon")) category = "Hackathon";
              else if (nameLower.includes("celebration") || nameLower.includes("day")) category = "Celebration";

              if (!loadedEvents.some(e => e.title.toLowerCase().trim() === (r.title || r.event_name || "").toLowerCase().trim())) {
                loadedEvents.push({
                  id: `rep-${r.id}`,
                  title: r.title || r.event_name || "Event Report",
                  subtitle: r.description ? r.description.slice(0, 80) + "..." : "Documented Activity Report",
                  category,
                  date: r.date || "Academic Session",
                  time: "Full Session",
                  venue: r.venue || "SREC Campus",
                  society: r.department || "IEEE Student Branch",
                  badge: "Report Archive",
                  status: "Completed",
                  chief_guest: r.chief_guest || "",
                  participants: r.participants_count ? `${r.participants_count} Attendees` : "",
                  description: r.description || `Official documentation report for ${r.title || r.event_name}.`,
                  image: r.photo_url ? getSupabaseImgUrl(r.photo_url) : "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80",
                  link: "/reports",
                });
              }
            });
          }

          if (loadedEvents.length > 0) {
            // Sort to ensure Upcoming events appear on top, followed by latest activities
            loadedEvents.sort((a, b) => {
              if (a.status === "Upcoming" && b.status !== "Upcoming") return -1;
              if (b.status === "Upcoming" && a.status !== "Upcoming") return 1;
              return 0;
            });
            setDbEvents(loadedEvents);
          }
        } catch (evtErr) {
          console.warn("Live events database fetch note:", evtErr);
        }
      }
      catch (err) {
        console.warn("Supabase fetch note:", err);
      }
    };
    fetchDbData();
  }, []);
  const handleRegisterMember = async (e) => {
    e.preventDefault();
    if (!regForm.firstName || !regForm.rollNumber || !regForm.email || !regForm.ieeeId) {
      alert("Please fill in all mandatory fields (IEEE Membership ID, Name, Roll Number, Email).");
      return;
    }
    setIsRegSubmitting(true);
    const assignedIeeeId = regForm.ieeeId.trim();
    const newMemberRecord = {
      id: "mem-" + Date.now(),
      first_name: regForm.firstName.trim(),
      last_name: regForm.lastName.trim(),
      roll_number: regForm.rollNumber.trim().toUpperCase(),
      ieee_id: assignedIeeeId,
      email: regForm.email.trim().toLowerCase(),
      phone: regForm.phone.trim() || "+91 98400 00000",
      department: regForm.department,
      year_of_study: regForm.yearOfStudy,
      member_type: "Student Member",
      join_date: "August 2025",
      valid_thru: "DEC 2026",
      membership_status: "ACTIVE",
      target_societies: regForm.selectedSocieties,
      skills: regForm.skills.split(",").map(s => s.trim()).filter(Boolean),
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(regForm.firstName + " " + regForm.lastName)}&background=002855&color=fff&size=512`
    };
    const memberWithPass = {
      ...newMemberRecord,
      password: `srecieee@${regForm.rollNumber.trim().toUpperCase()}`,
      security_pin: `srecieee@${regForm.rollNumber.trim().toUpperCase()}`
    };
    // 1. Store to Supabase database
    try {
      await supabase.from('student_members').upsert([memberWithPass], { onConflict: 'roll_number' });
      await supabase.from('applications').insert([{
        first_name: newMemberRecord.first_name,
        last_name: newMemberRecord.last_name,
        email: newMemberRecord.email,
        department: newMemberRecord.department,
        year_of_study: newMemberRecord.year_of_study,
        target_society: newMemberRecord.target_societies.join(", "),
        statement_of_purpose: `[In-App Registration] Roll: ${newMemberRecord.roll_number}, IEEE ID: ${newMemberRecord.ieee_id}`
      }]);
    }
    catch (dbErr) {
      console.warn("Database sync note:", dbErr);
    }
    // 2. Update local state and save session permanently
    setMembers((prev) => [newMemberRecord, ...prev]);
    setCurrentUser(newMemberRecord);
    setSelectedMember(newMemberRecord);
    localStorage.setItem("srec_ieee_app_user", JSON.stringify(newMemberRecord));
    localStorage.setItem("ieee_student_session", JSON.stringify(newMemberRecord));
    setIsRegSubmitting(false);
    setIsRegisterModalOpen(false);
    handleTabChange("id");
  };
  // Sync tab with URL safely
  const handleTabChange = (tab) => {
    const safeTab = VALID_TABS.includes(tab) ? tab : "home";
    setActiveTab(safeTab);
    setSearchParams({ tab: safeTab });
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };
  // Filtered members for Directory Table
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const targetSocArr = Array.isArray(m.target_societies)
        ? m.target_societies
        : (typeof m.target_societies === "string" ? m.target_societies.split(",") : []);
      const matchesSearch = !q ||
        (m.first_name || "").toLowerCase().includes(q) ||
        (m.last_name || "").toLowerCase().includes(q) ||
        (m.roll_number || "").toLowerCase().includes(q) ||
        (m.ieee_id || "").toLowerCase().includes(q) ||
        (m.department || "").toLowerCase().includes(q) ||
        targetSocArr.some((s) => String(s || "").toLowerCase().includes(q));
      const matchesDept = deptFilter === "All" || (m.department || "").includes(deptFilter);
      return matchesSearch && matchesDept;
    });
  }, [members, searchQuery, deptFilter]);
  // Societies view scope toggle: "registered" vs "all"
  const [societyScope, setSocietyScope] = useState("registered");
  // Filtered Office Bearers (Live from database tables with fallback)
  const filteredOfficers = useMemo(() => {
    const list = dbOfficers && dbOfficers.length > 0 ? dbOfficers : REAL_OFFICE_BEARERS;
    if (officerCategory === "all")
      return list;
    return list.filter((o) => o.category === officerCategory);
  }, [officerCategory, dbOfficers]);
  // Student's registered societies filter
  const studentRegisteredSocieties = useMemo(() => {
    const userSocArray = Array.isArray(currentUser?.target_societies)
      ? currentUser.target_societies
      : (typeof currentUser?.target_societies === "string" ? currentUser.target_societies.split(",") : []);
    if (!currentUser || userSocArray.length === 0) {
      return SOCIETIES_DATA;
    }
    const enrolled = SOCIETIES_DATA.filter((soc) => userSocArray.some((ts) => {
      const t = String(ts || "").toLowerCase();
      const code = (soc.code || "").toLowerCase();
      const name = (soc.name || "").toLowerCase();
      return (
        t.includes(code) ||
        t.includes(name) ||
        (soc.id === "srec" && (t.includes("srec") || t.includes("student branch"))) ||
        (soc.id === "cs" && t.includes("computer")) ||
        (soc.id === "cis" && (t.includes("computational") || t.includes("intelligence"))) ||
        (soc.id === "comsoc" && (t.includes("communication") || t.includes("comsoc"))) ||
        (soc.id === "embs" && (t.includes("medicine") || t.includes("biology") || t.includes("embs"))) ||
        (soc.id === "pels" && (t.includes("power") || t.includes("pels"))) ||
        (soc.id === "im" && (t.includes("instrumentation") || t.includes("measurement"))) ||
        (soc.id === "wie" && (t.includes("women") || t.includes("wie")))
      );
    }));
    return enrolled.length > 0 ? enrolled : SOCIETIES_DATA;
  }, [currentUser]);

  const displayedSocieties = useMemo(() => {
    const baseList = societyScope === "registered" && currentUser ? studentRegisteredSocieties : SOCIETIES_DATA;
    return baseList.map((soc) => {
      const dyn = dynamicSocietyLeaders[soc.id];
      const chairName = dyn?.chair || soc.chair;
      const advisorName = dyn?.advisor || soc.advisor;
      return {
        ...soc,
        chair: chairName,
        chairImg: dyn?.chairImg || soc.chairImg || (chairName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(chairName)}&background=002855&color=fff&size=128` : ""),
        advisor: advisorName,
        advisorImg: dyn?.advisorImg || soc.advisorImg || (advisorName ? `https://ui-avatars.com/api/?name=${encodeURIComponent(advisorName)}&background=002855&color=fff&size=128` : ""),
      };
    });
  }, [societyScope, currentUser, studentRegisteredSocieties, dynamicSocietyLeaders]);
  // Handle Login Authentication with Real-Time Database Query
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const query = loginInput.trim().toLowerCase();
    if (!query) {
      setLoginError("Please enter your IEEE ID, Roll Number, or Email.");
      return;
    }
    setIsLoggingIn(true);
    setLoginError(null);
    // 1. Check local seed list
    const foundLocal = members.find((m) => m.ieee_id.toLowerCase() === query ||
      m.roll_number.toLowerCase() === query ||
      m.email.toLowerCase() === query);
    if (foundLocal) {
      setCurrentUser(foundLocal);
      setSelectedMember(foundLocal);
      localStorage.setItem("srec_ieee_app_user", JSON.stringify(foundLocal));
      localStorage.setItem("ieee_student_session", JSON.stringify(foundLocal));
      setIsGuestMode(true);
      setActiveTab("id");
      setIsLoggingIn(false);
      return;
    }
    // 2. Query Supabase database
    try {
      const { data, error } = await supabase
        .from("student_members")
        .select("*")
        .or(`ieee_id.ilike.%${query}%,roll_number.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(1);
      if (data && data.length > 0) {
        const dbUser = data[0];
        setCurrentUser(dbUser);
        setSelectedMember(dbUser);
        localStorage.setItem("srec_ieee_app_user", JSON.stringify(dbUser));
        localStorage.setItem("ieee_student_session", JSON.stringify(dbUser));
        setMembers((prev) => [dbUser, ...prev]);
        setIsGuestMode(true);
        setActiveTab("id");
        setIsLoggingIn(false);
        return;
      }
    }
    catch (dbErr) {
      console.warn("Database lookup note:", dbErr);
    }
    // 3. Fallback verified student member
    const genericUser = {
      id: "custom-" + Date.now(),
      ieee_id: query.replace(/\D/g, "").slice(0, 8) || "98421045",
      roll_number: query.toUpperCase(),
      first_name: "IEEE",
      last_name: "Student Member",
      email: `${query.toLowerCase()}@srec.ac.in`,
      phone: "+91 98400 00000",
      department: "Engineering & Technology",
      year_of_study: "2024-2028",
      member_type: "Student Member",
      join_date: "August 2025",
      valid_thru: "DEC 2026",
      membership_status: "ACTIVE",
      target_societies: ["IEEE Student Branch SREC", "IEEE Computer Society (CS)"],
      skills: ["Engineering", "Problem Solving", "IEEE Events"],
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(query.toUpperCase())}&background=002855&color=fff&size=512`
    };
    setCurrentUser(genericUser);
    setSelectedMember(genericUser);
    localStorage.setItem("srec_ieee_app_user", JSON.stringify(genericUser));
    localStorage.setItem("ieee_student_session", JSON.stringify(genericUser));
    setIsGuestMode(true);
    setActiveTab("id");
    setIsLoggingIn(false);
  };
  const handleLogout = () => {
    localStorage.removeItem("srec_ieee_app_user");
    localStorage.removeItem("ieee_student_session");
    setCurrentUser(null);
    setIsGuestMode(false);
    setIsFlipped(false);
  };
  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };
  const getSocietyLogo = (socName) => {
    if (!socName) return ieeeStamp;
    const s = socName.toLowerCase();
    if (s.includes("computer") || s.includes("cs")) return csLogo;
    if (s.includes("women") || s.includes("wie")) return wieLogo;
    if (s.includes("computational") || s.includes("cis")) return cisLogo;
    if (s.includes("communication") || s.includes("comsoc")) return comsocLogo;
    if (s.includes("medicine") || s.includes("embs")) return embsLogo;
    if (s.includes("power") || s.includes("pels")) return pelsLogo;
    if (s.includes("instrumentation") || s.includes("im")) return imLogo;
    if (s.includes("circuits") || s.includes("cas") || s.includes("cass")) return casLogo;
    return ieeeStamp;
  };
  const handleOpenPdfModal = () => {
    const target = selectedMember || currentUser;
    if (!target) return;
    const primary = getPrimaryMemberCardPdfUrl(target);
    setActivePdfUrl(primary);
    setIsPdfModalOpen(true);
  };
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    const targetMember = selectedMember || currentUser;
    if (!file || !targetMember) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      return;
    }
    try {
      setIsUploadingAvatar(true);
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${targetMember.roll_number || targetMember.ieee_id}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('member-avatars')
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from('member-avatars')
        .getPublicUrl(fileName);
      const newAvatarUrl = urlData.publicUrl;
      const updated = { ...targetMember, avatar_url: newAvatarUrl };
      setSelectedMember(updated);
      if (currentUser && (currentUser.roll_number === targetMember.roll_number || currentUser.id === targetMember.id)) {
        setCurrentUser(updated);
      }
      localStorage.setItem("srec_ieee_app_user", JSON.stringify(updated));
      localStorage.setItem("ieee_student_session", JSON.stringify(updated));
      if (targetMember.roll_number) {
        await supabase
          .from('student_members')
          .update({ avatar_url: newAvatarUrl })
          .eq('roll_number', targetMember.roll_number);
      }
      alert("Profile photo updated successfully!");
    } catch (err) {
      console.warn("Avatar upload error:", err);
      alert("Failed to upload image. " + (err.message || ""));
    } finally {
      setIsUploadingAvatar(false);
    }
  };
  const handleDownloadDigitalCardPng = async () => {
    const targetEl = cardFrontRef.current || idCardRef.current;
    const target = selectedMember || currentUser;
    if (!targetEl || !target) return;
    try {
      setIsDownloadingCardImg(true);
      const clone = targetEl.cloneNode(true);
      clone.style.transform = "none";
      clone.style.position = "fixed";
      clone.style.left = "-9999px";
      clone.style.top = "0";
      clone.style.zIndex = "-9999";
      clone.style.opacity = "1";
      clone.style.visibility = "visible";
      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      document.body.removeChild(clone);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `IEEE_SREC_Card_${target.roll_number || target.ieee_id || "member"}_${isFlipped ? "Back" : "Front"}.png`;
      link.click();
    } catch (err) {
      console.error("Error downloading card:", err);
      alert("Could not download digital card image. Please try again.");
    } finally {
      setIsDownloadingCardImg(false);
    }
  };
  const handlePerformRenewal = () => {
    const updatedValidThru = `DEC ${renewalYear}`;
    // Update active member
    const updatedSelected = { ...selectedMember, valid_thru: updatedValidThru };
    setSelectedMember(updatedSelected);
    if (currentUser && currentUser.id === selectedMember.id) {
      const updatedUser = { ...currentUser, valid_thru: updatedValidThru };
      setCurrentUser(updatedUser);
      localStorage.setItem("srec_ieee_app_user", JSON.stringify(updatedUser));
    }
    setMembers((prev) => prev.map((m) => (m.id === selectedMember.id ? { ...m, valid_thru: updatedValidThru } : m)));
    setIsRenewModalOpen(false);
    setRenewalSuccessToast(true);
    setTimeout(() => setRenewalSuccessToast(false), 4000);
  };
  const handleExportCard = async () => {
    const targetElement = cardFrontRef.current || idCardRef.current;
    if (!targetElement)
      return;
    setIsExporting(true);
    let cloneContainer = null;
    try {
      cloneContainer = document.createElement("div");
      cloneContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: -9999px;
        width: 540px;
        height: 340px;
        z-index: -9999;
        background: transparent;
        pointer-events: none;
      `;
      const clone = targetElement.cloneNode(true);
      clone.style.transform = "none";
      clone.style.position = "relative";
      clone.style.width = "540px";
      clone.style.height = "340px";
      clone.style.fontFamily = "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
      // Reset all transform, filter, animation, and drop shadows on all elements
      clone.querySelectorAll("*").forEach((el) => {
        const h = el;
        h.style.transform = "none";
        h.style.textShadow = "none";
        h.style.filter = "none";
        h.style.animation = "none";
        h.style.transition = "none";
      });
      const activeBadge = clone.querySelector(".card-active-badge");
      if (activeBadge) {
        activeBadge.style.display = "inline-flex";
        activeBadge.style.alignItems = "center";
        activeBadge.style.justifyContent = "center";
        activeBadge.style.gap = "6px";
        activeBadge.style.lineHeight = "1";
        activeBadge.style.height = "22px";
      }
      const rollBadge = clone.querySelector(".card-roll-badge");
      if (rollBadge) {
        rollBadge.style.display = "inline-flex";
        rollBadge.style.alignItems = "center";
        rollBadge.style.lineHeight = "1";
        rollBadge.style.height = "20px";
      }
      cloneContainer.appendChild(clone);
      document.body.appendChild(cloneContainer);
      await new Promise(r => setTimeout(r, 200));
      const canvas = await html2canvas(clone, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });
      document.body.removeChild(cloneContainer);
      cloneContainer = null;
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `IEEE_SREC_ID_${selectedMember.roll_number || selectedMember.ieee_id}.png`;
      link.href = dataUrl;
      link.click();
    }
    catch (err) {
      if (cloneContainer && document.body.contains(cloneContainer)) {
        document.body.removeChild(cloneContainer);
      }
      console.error("Export error", err);
    }
    finally {
      setIsExporting(false);
    }
  };
  // ════════════════════════════════════════════════════════════════════════
  // 1. DEDICATED IN-APP LOGIN SCREEN (WHITE THEME)
  // ════════════════════════════════════════════════════════════════════════
  if (!currentUser && !isGuestMode) {
    return (<div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-3 sm:p-6 font-sans">

      {/* Top App Header for Login Screen with Glassmorphism */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2 pb-1">
        <Link to="/web" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-xl hover:bg-white border border-slate-200 text-[#002855] text-xs font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all">
          <Globe size={13} className="text-[#002855]" />
          <span>Full Website</span>
        </Link>

        <span className="px-2.5 py-1 rounded-full bg-blue-50/80 border border-blue-200 text-[#002855] font-black text-[9px] uppercase tracking-wider backdrop-blur-md">
          SB 64581 App
        </span>
      </div>

      {/* Top Branding */}
      <div className="max-w-md w-full mx-auto pt-3 text-center space-y-2.5">
        <div className="flex items-center justify-center gap-3">
          <img src={srecLogo} alt="SREC" className="h-10 w-auto object-contain" />
          <div className="w-[1px] h-8 bg-slate-300" />
          <img src={ieeeLogo} alt="IEEE" className="h-10 w-auto object-contain" />
          <div className="w-[1px] h-8 bg-slate-300" />
          <img src={snrLogo} alt="SNR" className="h-10 w-auto object-contain" />
        </div>

        <div>
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-[#002855]/10 text-[#002855] text-[10px] font-black uppercase tracking-wider border border-[#002855]/20">
            <ShieldCheck size={12} className="text-[#002855]" />
            Official Mobile App · SB 64581
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            SREC IEEE App
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto mt-0.5">
            Digital Member ID cards, searchable directory tables, and 2026-2027 Office Bearers.
          </p>
        </div>
      </div>

      {/* White Login Card */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto my-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
          <div className="w-10 h-10 rounded-2xl bg-[#002855] text-white flex items-center justify-center shadow-md">
            <IdCard size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Member Sign In</h2>
            <p className="text-xs text-slate-500">Enter your IEEE ID or College Roll Number</p>
          </div>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              IEEE Member ID / Roll Number
            </label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} placeholder="e.g. 98421045 or 22EE104" className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#002855] focus:bg-white transition-all shadow-inner" required />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700">
                Security PIN (Optional)
              </label>
              <span className="text-[10px] text-slate-400">Default: Any</span>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="password" value={authPin} onChange={(e) => setAuthPin(e.target.value)} placeholder="••••" className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#002855] focus:bg-white transition-all shadow-inner" />
            </div>
          </div>

          {loginError && (<div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {loginError}
          </div>)}

          <button type="submit" disabled={isLoggingIn} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#002855] to-[#00629B] hover:from-[#001c3d] hover:to-[#004e8a] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
            {isLoggingIn ? (<>
              <RotateCw size={15} className="animate-spin" />
              <span>Signing In...</span>
            </>) : (<>
              <span>Sign In to Student Dashboard</span>
              <ArrowRight size={15} />
            </>)}
          </button>
        </form>


        {/* 📝 NEW MEMBERSHIP REGISTRATION CALLOUT */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 text-center space-y-1">
          <p className="text-xs font-black text-[#002855]">New to IEEE SB SREC?</p>
          <p className="text-[10px] text-slate-500">Register your membership details &amp; store directly to database</p>
          <button type="button" onClick={() => setIsRegisterModalOpen(true)} className="w-full py-2 px-3 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[10.5px] uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
            <UserPlus size={13} />
            <span>Register My Membership</span>
          </button>
        </div>

        {/* Guest Mode Action & Complete Website Link */}
        <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
          <button onClick={() => {
            setIsGuestMode(true);
            setActiveTab("home");
          }} className="text-[#002855] hover:underline font-bold text-xs cursor-pointer">
            Explore as Guest →
          </button>
          <Link to="/web" className="text-[#002855] hover:underline font-bold text-xs flex items-center gap-1">
            <Globe size={13} /> Full Website
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center pb-2">
        <p className="text-[11px] text-slate-400">
          IEEE Student Branch SREC · Madras Section · Region 10
        </p>
      </div>
    </div>);
  }
  // ════════════════════════════════════════════════════════════════════════
  // 2. MAIN LOGGED-IN MOBILE APP (WHITE THEME & GLASSMORPHISM)
  // ════════════════════════════════════════════════════════════════════════
  const activeMember = currentUser || selectedMember || null;

  return (<div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans selection:bg-[#002855] selection:text-white">

    {/* ── TOP GLASSMORPHIC APP BAR (STATE-OF-THE-ART) ──────────────── */}
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_2px_16px_rgba(0,40,85,0.04)] px-3 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] transition-all">
      <div className="w-full max-w-md mx-auto flex items-center justify-between gap-2">

        {/* Brand & Crest */}
        <button onClick={() => handleTabChange("home")} className="flex items-center gap-2 shrink-0 hover:opacity-95 transition-opacity text-left min-w-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs h-8 overflow-hidden">
            <img src={srecLogo} alt="SREC" className="h-5 w-auto max-h-5 object-contain shrink-0" />
            <div className="w-[1px] h-3.5 bg-slate-300 shrink-0" />
            <img src={ieeeLogo} alt="IEEE" className="h-4 w-auto max-h-4 object-contain shrink-0" />
            <div className="w-[1px] h-3.5 bg-slate-300 shrink-0" />
            <img src={snrLogo} alt="SNR" className="h-4 w-auto max-h-4 object-contain shrink-0" />
          </div>
          <div className="hidden xs:flex flex-col">
            <span className="text-[10px] font-black text-[#002855] tracking-tight uppercase leading-none">
              IEEE SB SREC
            </span>
            <span className="inline-flex items-center gap-1 text-[7.5px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              SB 64581
            </span>
          </div>
        </button>

        {/* Action Bar (Search & Login/Profile) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/80 text-slate-700 flex items-center justify-center active:scale-95 transition-all shadow-2xs shrink-0 cursor-pointer"
            aria-label="Search App"
            title="Search"
          >
            <Search size={14} className="text-[#002855]" />
          </button>

          {/* User Profile / Logout Button */}
          {currentUser ? (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => {
                  setSelectedMember(currentUser);
                  handleTabChange("id");
                }}
                className="relative p-0.5 rounded-xl border border-slate-200 bg-white hover:border-[#002855] transition-all shadow-xs shrink-0"
                title={`${currentUser.first_name} ${currentUser.last_name} (${currentUser.roll_number})`}
              >
                <img
                  src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.first_name + " " + currentUser.last_name)}&background=002855&color=fff&size=80`}
                  alt={currentUser.first_name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white" />
              </button>
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200/80 text-rose-600 flex items-center justify-center active:scale-95 transition-all shrink-0 cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={12} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsGuestMode(false)}
              className="h-8 px-3 rounded-xl bg-gradient-to-r from-[#002855] to-[#004b99] hover:from-[#001c3d] hover:to-[#003875] text-white font-black text-[10px] uppercase tracking-wider shadow-xs flex items-center gap-1.5 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <User size={12} />
              <span>Login</span>
            </button>
          )}
        </div>

      </div>
    </header>

    {/* ── RENEWAL SUCCESS TOAST NOTIFICATION ─────────────────────────── */}
    <AnimatePresence>
      {renewalSuccessToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-xs p-3 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5"
        >
          <CheckCircle2 size={18} className="shrink-0 text-emerald-200" />
          <div className="text-[11px]">
            <p className="font-extrabold">Membership Renewed Successfully!</p>
            <p className="text-[9.5px] text-emerald-100">Valid through {activeMember?.valid_thru || "DEC 31, 2026"}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* ── MAIN CONTENT ACCORDING TO ACTIVE TAB ───────────────────────── */}
    <main className="w-full max-w-md mx-auto px-3 pt-2.5 space-y-3.5">

      {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: HOME DASHBOARD (COMPLETELY REVAMPED MODERN EXPERIENCE)
        ════════════════════════════════════════════════════════════════════ */}
      {(activeTab === "home" || !["events", "id", "societies", "menu"].includes(activeTab)) && (
        <div className="space-y-3.5">

          {/* 1. INTERACTIVE STORY RADAR / CHAPTER CHANNELS */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 -mx-3 px-3">
            {[
              { label: "Overview", icon: Sparkles, gradient: "from-amber-400 via-orange-500 to-yellow-400", action: () => handleTabChange("home") },
              { label: "Societies", icon: Cpu, count: "8", gradient: "from-cyan-400 via-blue-500 to-indigo-500", action: () => handleTabChange("societies") },
              { label: "Digital ID", icon: IdCard, badge: "PASS", gradient: "from-emerald-400 via-teal-500 to-cyan-500", action: () => handleTabChange("id") },
              { label: "Events", icon: Calendar, gradient: "from-purple-400 via-pink-500 to-rose-500", action: () => handleTabChange("events") },
              { label: "Leadership", icon: Crown, gradient: "from-amber-500 via-yellow-500 to-amber-600", action: () => { handleTabChange("menu"); setAllPagesCategory("office-bearers"); } },
              { label: "Gallery", icon: ImageIcon, gradient: "from-pink-400 via-rose-500 to-fuchsia-500", action: () => { handleTabChange("menu"); setAllPagesCategory("gallery"); } },
              { label: "Directory", icon: LayoutGrid, gradient: "from-slate-600 via-slate-700 to-slate-800", action: () => handleTabChange("menu") },
            ].map((story, idx) => {
              const Icon = story.icon;
              return (
                <button
                  key={idx}
                  onClick={story.action}
                  className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer active:scale-95 transition-transform"
                >
                  <div className={`p-[2px] rounded-full bg-gradient-to-tr ${story.gradient} shadow-2xs group-hover:scale-105 transition-transform`}>
                    <div className="w-12 h-12 rounded-full bg-white p-1 flex items-center justify-center relative">
                      <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-slate-800 group-hover:bg-blue-50/50 transition-colors">
                        <Icon size={18} className="text-[#002855]" />
                      </div>
                      {story.badge && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-black text-[6.5px] uppercase tracking-wider shadow-xs">
                          {story.badge}
                        </span>
                      )}
                      {story.count && (
                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-blue-600 text-white font-black text-[6.5px] uppercase tracking-wider shadow-xs">
                          {story.count}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 max-w-[56px] truncate text-center leading-tight">
                    {story.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 2. FLAGSHIP HERO PASS CARD (DEEP ROYAL & GOLD MESH) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001c3d] via-[#002b5e] to-[#004080] text-white p-4 sm:p-5 shadow-lg shadow-blue-950/20 space-y-3.5 border border-white/10">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-400/15 via-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-tr from-amber-400/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-cyan-200 text-[8.5px] font-black uppercase tracking-wider shadow-2xs">
                  <ShieldCheck size={10} className="text-cyan-300" />
                  <span>{currentUser ? `Active Member · #${currentUser.ieee_id || "VERIFIED"}` : "STB Code 64581 · Madras Section"}</span>
                </div>
                <h1 className="text-lg sm:text-xl font-black text-white leading-tight tracking-tight">
                  {currentUser ? `Welcome, ${currentUser.first_name}` : "IEEE Student Branch SREC"}
                </h1>
                <p className="text-[11.5px] text-blue-100/90 font-medium leading-tight">
                  {currentUser ? `${currentUser.department} · ${currentUser.roll_number}` : "Advancing Technology for Humanity · Region 10 APAC"}
                </p>
              </div>
              <img src={ieeeStamp} alt="Seal" className="h-11 w-11 object-contain opacity-90 brightness-200 shrink-0 drop-shadow-md" />
            </div>

            {/* Seamless Metrics Counter Strip */}
            <div className="grid grid-cols-4 gap-1 p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center relative z-10">
              <div>
                <span className="block text-sm sm:text-base font-black text-white">180+</span>
                <span className="block text-[8.5px] font-bold text-blue-200 uppercase tracking-wider">Members</span>
              </div>
              <div className="border-l border-white/10">
                <span className="block text-sm sm:text-base font-black text-cyan-300">8</span>
                <span className="block text-[8.5px] font-bold text-blue-200 uppercase tracking-wider">Societies</span>
              </div>
              <div className="border-l border-white/10">
                <span className="block text-sm sm:text-base font-black text-amber-300">21</span>
                <span className="block text-[8.5px] font-bold text-blue-200 uppercase tracking-wider">Officers</span>
              </div>
              <div className="border-l border-white/10">
                <span className="block text-sm sm:text-base font-black text-emerald-300">12+</span>
                <span className="block text-[8.5px] font-bold text-blue-200 uppercase tracking-wider">Awards</span>
              </div>
            </div>
          </div>

          {/* 3. FEATURED EVENT SHOWCASE (AECTSD 2027) */}
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-4 space-y-3 group hover:border-[#002855]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-900 border border-amber-300/40 text-[9px] font-black uppercase tracking-wider">
                <Sparkles size={11} className="text-amber-600" />
                <span>Flagship 2027</span>
              </span>
              <span className="text-[10px] font-black text-[#002855] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Feb 18-20, 2027
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                AECTSD 2027: International Conference
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                Advances in Electrical, Communication &amp; Thermal Systems for Sustainable Development.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                <Building2 size={12} className="text-slate-400" />
                <span>SREC Auditorium</span>
              </span>
              <a
                href="http://aectsd2027.srecieee.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#002855] to-[#004080] hover:from-[#001c3d] hover:to-[#002855] text-white font-bold text-[10px] uppercase tracking-wider shadow-xs active:scale-95 transition-all"
              >
                <span>Portal</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>

          {/* 4. CHAPTERS & SOCIETIES SPOTLIGHT GRID (2x2 MODERN CARDS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={14} className="text-[#002855]" />
                <span>Specialized Technical Chapters</span>
              </h2>
              <button
                onClick={() => handleTabChange("societies")}
                className="text-[10px] font-black text-[#002855] uppercase tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All 8</span>
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { name: "Computer Society", code: "CS (SBC 64581A)", icon: Laptop, color: "text-blue-600", bg: "bg-blue-50/70 border-blue-200/70" },
                { name: "Robotics & Automation", code: "RAS (SBC 64581B)", icon: Cpu, color: "text-purple-600", bg: "bg-purple-50/70 border-purple-200/70" },
                { name: "Power Electronics", code: "PELS (SBC 64581C)", icon: Zap, color: "text-amber-600", bg: "bg-amber-50/70 border-amber-200/70" },
                { name: "Communications", code: "ComSoc (SBC 64581D)", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50/70 border-emerald-200/70" },
              ].map((soc, idx) => {
                const Icon = soc.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleTabChange("societies")}
                    className={`p-3 rounded-2xl ${soc.bg} border text-left flex flex-col justify-between space-y-2 hover:shadow-xs active:scale-95 transition-all cursor-pointer group`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center ${soc.color} group-hover:scale-110 transition-transform`}>
                        <Icon size={16} />
                      </div>
                      <ChevronRight size={12} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-[11px] leading-tight">
                        {soc.name}
                      </h4>
                      <p className="text-[9px] text-slate-500 font-medium mt-0.5 truncate">
                        {soc.code}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. EXPLORE DIRECTORY LINK */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white shadow-md flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <p className="font-black text-white text-xs leading-tight">
                IEEE SB SREC Complete Directory
              </p>
              <p className="text-[9.5px] text-slate-400 truncate">
                Reports, archives, past bearers &amp; portals
              </p>
            </div>
            <button
              onClick={() => handleTabChange("menu")}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-[10px] font-black uppercase tracking-wider active:scale-95 transition-all shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
            >
              <span>Explore</span>
              <ChevronRight size={12} />
            </button>
          </div>

        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: EVENTS & ACTIVITIES (DYNAMIC DATABASE DRIVEN)
        ════════════════════════════════════════════════════════════════════ */}
      {activeTab === "events" && (() => {
        const eventsList = dbEvents && dbEvents.length > 0 ? dbEvents : EVENTS_DATA;
        const displayedEvents = eventsList.filter((e) => {
          const matchesCat = eventCategoryFilter === "All"
            ? true
            : (eventCategoryFilter === "Upcoming"
                ? e.status === "Upcoming"
                : ((e.category || "").toLowerCase().includes(eventCategoryFilter.toLowerCase()) || (e.title || "").toLowerCase().includes(eventCategoryFilter.toLowerCase())));
          const q = eventSearchQuery.toLowerCase().trim();
          const matchesSearch = !q || (
            (e.title || "").toLowerCase().includes(q) ||
            (e.category || "").toLowerCase().includes(q) ||
            (e.society || "").toLowerCase().includes(q) ||
            (e.chief_guest || "").toLowerCase().includes(q) ||
            (e.venue || "").toLowerCase().includes(q) ||
            (e.date || "").toLowerCase().includes(q) ||
            (e.description || "").toLowerCase().includes(q)
          );
          return matchesCat && matchesSearch;
        });

        return (
          <div className="space-y-3">
            {/* Header & Filter Controls */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={16} className="text-[#002855]" />
                    Events &amp; Activities Hub
                  </h2>
                  <p className="text-[10px] text-slate-500">
                    Live database records of conferences, symposiums, hackathons &amp; workshops
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#002855] text-[10px] font-bold">
                  {displayedEvents.length} Events
                </span>
              </div>

              {/* Search Bar for Events */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
                <input
                  type="text"
                  placeholder="Search events by title, guest, society, or date..."
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs placeholder-slate-400 focus:outline-none focus:border-[#002855] transition-all"
                />
                {eventSearchQuery && (
                  <button
                    onClick={() => setEventSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Category Pills Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {["All", "Upcoming", "Conference", "Symposium", "Hackathon", "Workshop", "Celebration", "Outreach", "Webinar"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEventCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap transition-all ${
                      eventCategoryFilter === cat
                        ? "bg-[#002855] text-white shadow-sm"
                        : "bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {cat === "All" ? "All Events" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Card Grid */}
            <div className="space-y-3">
              {displayedEvents.length > 0 ? (
                displayedEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden flex flex-col hover:border-[#002855]/40 transition-all group"
                  >
                    {/* Event Banner Image with Badges */}
                    <div className="relative h-36 sm:h-40 w-full overflow-hidden bg-slate-900">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-wider shadow-sm">
                          {event.badge || event.category}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md ${
                            event.status === "Upcoming"
                              ? "bg-amber-400 text-slate-950 font-extrabold animate-pulse"
                              : "bg-emerald-500/90 text-white"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>

                      {/* Bottom Title on Image */}
                      <div className="absolute bottom-2.5 left-3 right-3">
                        <span className="text-[9px] font-bold text-sky-200 uppercase tracking-widest block">
                          {event.society || "IEEE Student Branch"}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-white leading-tight drop-shadow line-clamp-1">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    {/* Event Details Content */}
                    <div className="p-3.5 space-y-2.5">
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {event.description}
                      </p>

                      {/* Schedule & Venue Meta */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-[10px]">
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[8.5px]">Date &amp; Time</span>
                          <span className="font-bold text-slate-900 leading-tight block truncate">{event.date}</span>
                          <span className="text-slate-500 text-[9px] truncate block">{event.time || "Scheduled Event"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold uppercase block text-[8.5px]">Location</span>
                          <span className="font-semibold text-slate-800 leading-tight line-clamp-2">{event.venue || "SREC Campus"}</span>
                        </div>
                      </div>

                      {/* Chief Guest / Speaker details if present in database */}
                      {(event.chief_guest || event.participants) && (
                        <div className="flex items-center justify-between p-2 rounded-xl bg-blue-50/60 border border-blue-100 text-[10px]">
                          {event.chief_guest ? (
                            <span className="text-slate-700 font-semibold truncate">
                              Guest: <strong className="text-slate-900">{event.chief_guest}</strong>
                            </span>
                          ) : <span />}
                          {event.participants && (
                            <span className="text-blue-800 font-bold bg-white px-2 py-0.5 rounded-md border border-blue-200 shrink-0">
                              {event.participants}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-[#002855] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          {event.category}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedEventModal(event)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-[10px] uppercase transition-all"
                          >
                            Details
                          </button>
                          {event.link && event.link.startsWith("http") ? (
                            <a
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all"
                            >
                              <span>Portal</span>
                              <ExternalLink size={11} />
                            </a>
                          ) : (
                            <button
                              onClick={() => {
                                if (event.link) navigate(event.link);
                                else setSelectedEventModal(event);
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all"
                            >
                              <span>View</span>
                              <ArrowRight size={11} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                  <Calendar size={32} className="mx-auto text-slate-400" />
                  <h4 className="text-sm font-black text-slate-800">No Events Found</h4>
                  <p className="text-xs text-slate-500">
                    No matching activities in the database for &quot;{eventSearchQuery || eventCategoryFilter}&quot;.
                  </p>
                  <button
                    onClick={() => {
                      setEventSearchQuery("");
                      setEventCategoryFilter("All");
                    }}
                    className="mt-2 px-3 py-1.5 rounded-xl bg-[#002855] text-white text-xs font-bold"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: COMPLETE MOBILE STUDENT DASHBOARD & DIGITAL SMART ID VAULT
        ════════════════════════════════════════════════════════════════════ */}
      {activeTab === "id" && (
        !activeMember ? (
          <div className="space-y-4 py-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/40 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#002855] text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-900/20">
                <IdCard size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Student Digital ID Card</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Enter your IEEE Member ID or Roll Number to access and verify your official smart card.
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3 pt-2 text-left">
                <div>
                  <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 mb-1">
                    IEEE Member ID / College Roll Number
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      placeholder="e.g. 98421045 or 22EE104"
                      className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-[#002855] focus:bg-white transition-all shadow-inner"
                      required
                    />
                  </div>
                </div>

                {loginError && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#002855] to-[#00629B] hover:from-[#001c3d] hover:to-[#004e8a] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <>
                      <RotateCw size={15} className="animate-spin" />
                      <span>Retrieving Card...</span>
                    </>
                  ) : (
                    <>
                      <span>View Official Digital ID</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Not yet an IEEE member?</span>
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="text-[#002855] font-black hover:underline cursor-pointer text-[11px]"
                >
                  Register Online →
                </button>
              </div>
            </div>
          </div>
        ) : (
        <div className="space-y-4 pb-16">

          {/* ── TOP ACTIONS TOOLBAR: Status, View PDF, Flip, Save PNG & RENEW ── */}
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase text-[#002855] tracking-wider flex items-center gap-1">
                <IdCard size={14} className="text-[#002855]" />
                <span>Official IEEE ID</span>
              </span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${(activeMember.membership_status === "ACTIVE" || !activeMember.membership_status)
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-300"
                  : "bg-rose-50 text-rose-800 border border-rose-300"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${(activeMember.membership_status === "ACTIVE" || !activeMember.membership_status)
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-rose-500"
                  }`} />
                <span>{(activeMember.membership_status === "ACTIVE" || !activeMember.membership_status) ? "Active" : "Inactive"}</span>
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0 flex-wrap">
              {/* View Original PDF Button */}
              <button
                type="button"
                onClick={handleOpenPdfModal}
                className="px-2.5 py-1 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs active:scale-95 transition-all cursor-pointer"
                title="View Official IEEE Headquarters PDF Card"
              >
                <FileText size={12} className="text-cyan-300" />
                <span>View PDF</span>
              </button>

              {/* Save PNG Button */}
              <button
                type="button"
                onClick={handleDownloadDigitalCardPng}
                disabled={isDownloadingCardImg}
                className="px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#002855] border border-blue-200 font-bold text-[10px] uppercase flex items-center gap-1 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                title="Save High-Res Card Image"
              >
                {isDownloadingCardImg ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                <span className="hidden xs:inline">Save PNG</span>
              </button>

              {/* Renew Button */}
              <button
                type="button"
                onClick={() => setIsRenewModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] uppercase flex items-center gap-1 active:scale-95 shadow-xs transition-all cursor-pointer"
                title="Renew IEEE Membership"
              >
                <Sparkles size={12} className="text-slate-950" />
                <span>Renew</span>
              </button>

              {/* Flip 3D Button */}
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="px-2 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-[10px] flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                title="Flip 3D Card"
              >
                <RotateCw size={12} className={isFlipped ? "rotate-180 transition-transform" : "transition-transform"} />
                <span>Flip</span>
              </button>
            </div>
          </div>

          {/* ── 3D FLIPPABLE DIGITAL ID CARD CONTAINER (HOLOGRAPHIC SMART CARD) ── */}
          <div className="relative w-full aspect-[1.586] select-none cursor-pointer group" style={{ perspective: 1400 }} onClick={() => setIsFlipped(!isFlipped)}>
            <div ref={idCardRef} className="w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d]" style={{
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
            }}>
              {/* ═══════════════════════════════════════════════════════════════
                    CARD FRONT: ULTRA-LUXURY HOLOGRAPHIC SMART PVC ID
                ═══════════════════════════════════════════════════════════════ */}
              <div ref={cardFrontRef} className="absolute inset-0 rounded-[22px] sm:rounded-[28px] p-3.5 sm:p-5 bg-gradient-to-br from-[#000a17] via-[#001c3d] to-[#003870] border-[1.5px] border-amber-300/60 shadow-[0_20px_50px_rgba(0,10,25,0.65),0_0_30px_rgba(0,114,206,0.2)] flex flex-col justify-between overflow-hidden text-white select-none" style={{ backfaceVisibility: "hidden" }}>
                {/* Holographic Security Shimmer Layer */}
                <div className="absolute inset-0 opacity-25 pointer-events-none" style={{
                  backgroundImage: `radial-gradient(circle at 80% 20%, rgba(255,215,0,0.4) 0%, transparent 45%), linear-gradient(135deg, transparent 35%, rgba(0,210,255,0.3) 48%, rgba(255,255,255,0.4) 50%, transparent 65%)`
                }} />

                {/* Micro-Circuit Security Mesh Background */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
                  backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                  backgroundSize: "16px 16px"
                }} />

                {/* Watermark IEEE Diamond Crest */}
                <img src={ieeeStamp} alt="Watermark" className="absolute -right-6 -bottom-6 w-44 h-44 opacity-[0.08] object-contain pointer-events-none brightness-200" />

                {/* Laser Holographic Security Ribbon */}
                <div className="absolute top-0 right-14 w-8 h-full bg-gradient-to-b from-amber-300/10 via-cyan-300/15 to-transparent pointer-events-none opacity-40 blur-[1px]" />

                {/* ── TOP HEADER BAR: SREC Emblem + IEEE Diamond + Status ── */}
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-1.5">
                    <div className="px-2 py-0.5 rounded-lg bg-white/95 border border-white/80 shadow-xs flex items-center gap-1.5 backdrop-blur-sm h-6 overflow-hidden">
                      <img src={srecLogo} alt="SREC" className="h-4 sm:h-5 w-auto max-h-5 object-contain" />
                      <div className="w-[1px] h-3 bg-slate-300" />
                      <img src={ieeeLogo} alt="IEEE" className="h-3.5 sm:h-4 w-auto max-h-4 object-contain" />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="card-active-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 font-black text-[9px] uppercase tracking-wider shadow-xs backdrop-blur-sm whitespace-nowrap leading-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 inline-block align-middle" />
                      <span>ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* ── MIDDLE ROW: Portrait + Smart Chip + Member Details ── */}
                <div className="flex items-center gap-2.5 sm:gap-3.5 relative z-10 my-auto py-0.5">
                  {/* Portrait Photo Frame */}
                  <div className="relative shrink-0">
                    <div className="w-[52px] h-[52px] sm:w-[68px] sm:h-[68px] shrink-0 rounded-xl sm:rounded-2xl p-[2px] bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-[0_0_12px_rgba(251,191,36,0.35)] overflow-hidden">
                      <img src={activeMember.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent((activeMember.first_name || "Student") + " " + (activeMember.last_name || ""))}&background=002855&color=fff&size=512`} alt={activeMember.first_name || "Student"} className="w-full h-full rounded-[10px] sm:rounded-[14px] object-cover bg-slate-900" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#000a17] flex items-center justify-center text-white shadow">
                      <Check size={8} className="stroke-[3]" />
                    </div>
                  </div>

                  {/* Member Credentials Info */}
                  <div className="leading-tight min-w-0 flex-1">
                    <h2 className="text-xs sm:text-base font-black text-white uppercase truncate font-sans leading-snug">
                      {activeMember.first_name} {activeMember.last_name}
                    </h2>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="card-roll-badge inline-flex items-center px-1.5 py-0.5 rounded bg-amber-400/15 border border-amber-300/40 text-amber-300 font-mono text-[9px] font-black tracking-wider leading-none">
                        ROLL: {activeMember.roll_number}
                      </div>
                    </div>

                    {/* Department and SREC IEEE Member in ONE SINGLE LINE */}
                    <p className="text-[9px] sm:text-[10px] text-sky-200 uppercase font-black tracking-wide mt-1 truncate font-sans">
                      {activeMember.department} · SREC IEEE {activeMember.member_type || "STUDENT MEMBER"}{activeMember.year_of_study ? ` · ${activeMember.year_of_study}` : ""}
                    </p>
                  </div>

                  {/* Authentic Gold EMV Smart Chip */}
                  <div className="hidden xs:flex flex-col shrink-0 w-9 h-7 sm:w-10 sm:h-8 rounded-md bg-gradient-to-br from-[#ffe082] via-[#ffca28] to-[#ff8f00] p-[1.5px] shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-[#8d4004] overflow-hidden relative select-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/20 pointer-events-none" />
                    <div className="w-full h-full relative border border-[#6d3000]/70 rounded-[3px] bg-gradient-to-b from-[#ffd54f] to-[#ffb300] flex items-center justify-between px-0.5">
                      <div className="w-[30%] h-full flex flex-col justify-between py-1">
                        <div className="w-full h-[1px] bg-[#6d3000]/80 shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />
                        <div className="w-full h-[1px] bg-[#6d3000]/80 shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />
                      </div>
                      <div className="w-[34%] h-[90%] rounded-full border border-[#6d3000]/80 bg-gradient-to-b from-[#fff59d] via-[#ffd54f] to-[#ffa000] shadow-[inset_0_1px_2px_rgba(255,255,255,0.7)]" />
                      <div className="w-[30%] h-full flex flex-col justify-between py-1">
                        <div className="w-full h-[1px] bg-[#6d3000]/80 shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />
                        <div className="w-full h-[1px] bg-[#6d3000]/80 shadow-[0_0.5px_0_rgba(255,255,255,0.4)]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── BOTTOM ROW: Embossed Member ID & Security QR ── */}
                <div className="flex items-end justify-between relative z-10 pt-1.5 border-t border-white/15">
                  <div>
                    <span className="text-[7px] uppercase tracking-[0.18em] text-amber-300/90 font-black block leading-none">
                      OFFICIAL IEEE MEMBERSHIP ID
                    </span>
                    <span className="text-xs sm:text-base font-black font-mono tracking-widest text-white drop-shadow-md block mt-0.5">
                      {!activeMember.ieee_id || activeMember.ieee_id === "PENDING" ? "ALLOCATING..." : activeMember.ieee_id}
                    </span>
                    <span className="text-[7.5px] sm:text-[9px] font-sans font-bold text-amber-200/90 block mt-0.5 tracking-wider">
                      VALID THRU: {activeMember.valid_thru || "DEC 31, 2026"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="text-right leading-none">
                      <span className="text-[7.5px] font-mono text-sky-200 block font-bold">STB32131</span>
                      <span className="text-[6.5px] text-slate-300 font-mono">SB 64581</span>
                    </div>
                    <div className="p-0.5 bg-white rounded-md text-slate-950 shadow-xs">
                      <QrCode size={18} className="text-slate-950" />
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                    CARD BACK: OFFICIAL PASS AUTHORIZATION & SOCIETIES
                ═══════════════════════════════════════════════════════════════ */}
              <div className="absolute inset-0 rounded-[22px] sm:rounded-[28px] p-3.5 sm:p-5 bg-gradient-to-br from-[#000a17] via-[#001c3d] to-[#003870] border-[1.5px] border-amber-300/60 shadow-[0_20px_50px_rgba(0,10,25,0.65)] flex flex-col justify-between overflow-hidden text-white select-none" style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)"
              }}>
                {/* Top Magnetic Security Stripe */}
                <div className="w-[calc(100%+2rem)] -mx-4 -mt-2 h-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-amber-400/30 flex items-center justify-between px-3">
                  <span className="text-[6.5px] font-mono text-amber-300 tracking-widest font-black uppercase">
                    ★ IEEE MADRAS SECTION · SREC STUDENT BRANCH ★
                  </span>
                  <span className="text-[6.5px] font-mono text-slate-400">REGION 10 APAC</span>
                </div>

                {/* Middle: Institution & Enrolled Societies */}
                <div className="space-y-1 text-[9px] text-slate-200 my-auto">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-bold">Institution:</span>
                    <span className="text-white font-medium">Sri Ramakrishna Engineering College</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-bold">College Email:</span>
                    <span className="font-mono text-sky-200 truncate max-w-[160px]">{activeMember.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300 font-bold">Enrolled Chapters:</span>
                    <span className="text-white font-bold tracking-wide truncate max-w-[200px]">
                      {formatShortSocieties(activeMember.target_societies)}
                    </span>
                  </div>
                </div>

                {/* Counselor & Authorization Footer */}
                <div className="pt-1.5 border-t border-white/15 flex items-center justify-between text-[7.5px] text-slate-300">
                  <div>
                    <span className="font-mono font-black text-amber-300 block">AUTH: {activeMember.ieee_id || "PENDING"}-SB64581</span>
                    <span className="text-[6.5px] text-slate-400">Valid for IEEE &amp; Collegiate Events</span>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <img src={counselorSign} alt="Counselor Signature" className="h-3.5 w-auto object-contain brightness-0 invert opacity-90 drop-shadow-xs" />
                    <span className="font-serif italic text-amber-200 text-[9px] block leading-none">Dr. K. Balamurugan</span>
                    <span className="text-[6.5px] text-sky-200 uppercase font-bold tracking-wider">Branch Counselor</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── BENTO MODULE 1: QUICK CREDENTIALS COPY CHIPS ── */}
          <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <KeyRound size={14} className="text-[#002855]" />
                <span>Credentials &amp; Quick Copy</span>
              </h4>
              <span className="text-[9px] font-bold text-slate-400 uppercase">1-Tap Copy</span>
            </div>

            {/* Original IEEE PDF Card Quick Row */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/90 to-indigo-50/70 border border-blue-200 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[8.5px] text-[#002855] uppercase font-bold block">Official IEEE Card</span>
                <span className="font-mono text-xs font-black text-[#002855] flex items-center gap-1 truncate">
                  <FileText size={12} className="text-blue-600 shrink-0" />
                  <span className="truncate">{activeMember.ieee_id && activeMember.ieee_id !== 'PENDING' ? `${activeMember.ieee_id}.pdf` : 'IEEE_Card.pdf'}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={handleOpenPdfModal}
                className="px-3 py-1.5 rounded-xl bg-[#002855] text-white hover:bg-[#001c3d] text-[10px] font-bold uppercase tracking-wider transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer active:scale-95"
              >
                <Eye size={12} />
                <span>View PDF</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {/* IEEE Member ID */}
              <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[8.5px] text-[#002855] uppercase font-bold block">IEEE ID</span>
                  <span className="font-mono text-sm font-black text-[#002855]">#{activeMember.ieee_id || "PENDING"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(activeMember.ieee_id, "id")}
                  className="p-1.5 rounded-lg bg-[#002855] text-white hover:bg-[#001c3d] transition-all shadow-xs cursor-pointer"
                  title="Copy IEEE ID"
                >
                  {copiedText === "id" ? <Check size={13} className="text-emerald-300" /> : <Copy size={13} />}
                </button>
              </div>

              {/* Roll Number */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[8.5px] text-slate-400 uppercase font-bold block">Roll Number</span>
                  <span className="font-mono text-xs font-bold text-slate-900">{activeMember.roll_number}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(activeMember.roll_number, "roll")}
                  className="p-1.5 rounded-lg bg-slate-200 hover:bg-[#002855] hover:text-white transition-all text-slate-700 cursor-pointer"
                  title="Copy Roll Number"
                >
                  {copiedText === "roll" ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>
              </div>

              {/* Official College Email */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between sm:col-span-2">
                <div className="min-w-0 pr-2">
                  <span className="text-[8.5px] text-slate-400 uppercase font-bold block">Official Email</span>
                  <span className="font-mono text-xs font-medium text-slate-700 truncate block">{activeMember.email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(activeMember.email, "email")}
                  className="p-1.5 rounded-lg bg-slate-200 hover:bg-[#002855] hover:text-white transition-all text-slate-700 shrink-0 cursor-pointer"
                  title="Copy Email"
                >
                  {copiedText === "email" ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>

          {/* ── BENTO MODULE 2: PRIMARY MEMBER PROFILE & AVATAR UPLOADER ── */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[9px] font-black uppercase tracking-wider">
                ● Verified Student Record
              </span>

              {currentUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <LogOut size={12} />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsGuestMode(false)}
                  className="px-2.5 py-1 rounded-lg bg-[#002855] hover:bg-[#001c3d] text-white text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                >
                  <User size={12} />
                  <span>Member Login</span>
                </button>
              )}
            </div>

            <div className="flex items-start gap-3.5">
              {/* Avatar with Camera Uploader */}
              <div className="relative shrink-0 group">
                <img
                  src={activeMember.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent((activeMember.first_name || "Student") + " " + (activeMember.last_name || ""))}&background=002855&color=fff&size=512`}
                  alt={activeMember.first_name || "Student"}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover object-top border-2 border-slate-200 shadow-sm bg-slate-900"
                />
                <label
                  className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[8px] font-bold"
                  title="Update Profile Avatar"
                >
                  {isUploadingAvatar ? (
                    <Loader2 size={16} className="animate-spin text-white" />
                  ) : (
                    <>
                      <Camera size={16} />
                      <span>Photo</span>
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
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-sm">
                  <Check size={10} className="stroke-[3]" />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-base font-black text-slate-900 uppercase truncate">
                  {activeMember.first_name} {activeMember.last_name}
                </h2>
                <p className="text-xs text-[#002855] font-bold truncate mt-0.5">
                  {activeMember.member_type || "Student Member"}
                </p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {activeMember.department}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#002855] font-mono text-[9.5px] font-black">
                  <span>IEEE ID:</span>
                  <span>#{activeMember.ieee_id}</span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[8.5px] text-slate-400 font-bold uppercase block">College Roll</span>
                <span className="font-mono font-bold text-slate-900">{activeMember.roll_number}</span>
              </div>
              <div>
                <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Phone Contact</span>
                <span className="font-medium text-slate-700 truncate block">{activeMember.phone}</span>
              </div>
            </div>
          </div>

          {/* ── BENTO MODULE 3: ACADEMIC AFFILIATION & DEPARTMENT STANDING ── */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-[#002855] text-xs font-black uppercase tracking-wider">
              <GraduationCap size={16} />
              <span>Academic Affiliation &amp; Standing</span>
            </div>

            <div>
              <h3 className="text-sm font-black text-slate-900 leading-snug">
                {activeMember.department}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeMember.year_of_study || "IV Year (2022-2026)"} · Sri Ramakrishna Engineering College
              </p>
            </div>

            <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Registered On</span>
                <span className="font-bold text-slate-800">{activeMember.join_date || "16 Aug 2025"}</span>
              </div>
              <div className="text-right">
                <span className="text-[8.5px] text-slate-400 font-bold uppercase block">1 Year Validity</span>
                <span className="font-black text-emerald-600">{activeMember.valid_thru || "DEC 31, 2026"}</span>
              </div>
            </div>
          </div>

          {/* ── BENTO MODULE 4: TECHNICAL SPECIALIZATIONS & SKILLS TAG CLOUD ── */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Cpu size={15} className="text-[#002855]" />
                <span>Technical Specializations &amp; Domains</span>
              </h4>
              <span className="text-[9px] font-bold text-slate-400 uppercase">
                {(Array.isArray(activeMember.skills) ? activeMember.skills : []).length} Verified
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(Array.isArray(activeMember.skills) ? activeMember.skills : ["Power Systems", "Embedded Systems", "Technical Leadership", "Project Management", "IoT Solutions"]).map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-[11px] font-bold transition-all shadow-2xs"
                >
                  {skill}
                </span>
              ))}
            </div>

            {activeMember.bio_sop && (
              <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100 text-[11px] text-slate-700 italic">
                "{activeMember.bio_sop}"
              </div>
            )}
          </div>

          {/* ── BENTO MODULE 5: ENROLLED TECHNICAL CHAPTERS MULTI-GRID ── */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Award size={15} className="text-[#002855]" />
                <span>Enrolled Technical Chapters</span>
              </h4>
              <button
                onClick={() => handleTabChange("societies")}
                className="text-[10px] font-bold text-[#002855] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>Explore 8</span>
                <ChevronRight size={12} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Array.isArray(activeMember.target_societies) ? activeMember.target_societies : ["IEEE Student Branch SREC"]).map((socName, idx) => {
                const logo = getSocietyLogo(socName);
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#002855]/40 hover:bg-white transition-all flex items-center justify-between gap-2.5 group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-2xs shrink-0">
                        <img src={logo} alt={socName} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-black text-slate-900 uppercase truncate group-hover:text-[#002855] transition-colors">
                          {socName}
                        </h5>
                        <p className="text-[9px] text-slate-500">IEEE SREC Chapter</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider shrink-0">
                      Active
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── BENTO MODULE 6: VERIFIED EVENT PARTICIPATION & CERTIFICATION LOGS ── */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Calendar size={15} className="text-[#002855]" />
                <span>Verified Event Participations &amp; Logs</span>
              </h4>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {(Array.isArray(activeMember.events_attended) ? activeMember.events_attended : []).length || 4} Logs
              </span>
            </div>

            <div className="space-y-2">
              {(Array.isArray(activeMember.events_attended) ? activeMember.events_attended : [
                { title: "VisionX 2025 – AI & Edge Computing Expo", date: "Aug 2025", category: "National Symposium" },
                { title: "IEEE Madras Section Leadership Conclave", date: "May 2025", category: "Leadership Summit" },
                { title: "IEEE International Renewable Energy Workshop", date: "Jan 2025", category: "Technical Workshop" },
                { title: "IEEE Student Branch Induction & Oath Ceremony", date: "Sep 2024", category: "Collegiate Event" }
              ]).map((event, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2.5 hover:bg-white transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-black text-slate-900 uppercase truncate">
                        {event.title}
                      </h5>
                      <p className="text-[9.5px] text-slate-500 mt-0.5">
                        <span className="text-[#002855] font-bold">{event.category}</span> · {event.date}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8.5px] font-black uppercase tracking-wider shrink-0">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── BENTO MODULE 7: OFFICIAL MEMBERSHIP DIRECTORY TABLE ── */}
          <div className="rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                <TableIcon size={13} />
                <span>Structured Membership Dossier</span>
              </h3>
              <span className="text-[10px] font-mono font-bold text-[#002855]">
                {activeMember.roll_number}
              </span>
            </div>

            <div className="p-2 sm:p-3">
              <table className="w-full text-xs text-left border-collapse">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px] w-1/3">Full Name</td>
                    <td className="py-2 px-2 font-extrabold text-slate-900">{activeMember.first_name} {activeMember.last_name}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px]">IEEE Member ID</td>
                    <td className="py-2 px-2 font-mono font-bold text-[#002855]">
                      <div className="flex items-center justify-between">
                        <span>{!activeMember.ieee_id || activeMember.ieee_id === "PENDING" ? "Pending Allocation" : `#${activeMember.ieee_id}`}</span>
                        {activeMember.ieee_id && activeMember.ieee_id !== "PENDING" && (
                          <button onClick={() => handleCopy(activeMember.ieee_id, "id")} className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer">
                            {copiedText === "id" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px]">College Roll No</td>
                    <td className="py-2 px-2 font-mono font-bold text-slate-900">{activeMember.roll_number}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px]">Department</td>
                    <td className="py-2 px-2 text-slate-800 font-semibold">{activeMember.department}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px]">Year &amp; Batch</td>
                    <td className="py-2 px-2 text-slate-800 font-semibold">{activeMember.year_of_study || activeMember.join_date || "IV Year (2022-2026)"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px]">Branch Role</td>
                    <td className="py-2 px-2 font-extrabold text-[#002855]">{activeMember.member_type || "Student Member"}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px]">Status &amp; Validity</td>
                    <td className="py-2 px-2">
                      <div className="flex items-center justify-between gap-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[8.5px] font-black border border-emerald-200">
                          ACTIVE ({activeMember.valid_thru || "DEC 31, 2026"})
                        </span>
                        <button onClick={() => setIsRenewModalOpen(true)} className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-black text-[8.5px] uppercase transition-colors cursor-pointer">
                          ⚡ Renew
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px]">Societies</td>
                    <td className="py-2 px-2">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(activeMember.target_societies) ? activeMember.target_societies : (typeof activeMember.target_societies === "string" ? activeMember.target_societies.split(",") : [])).map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 rounded-lg bg-blue-50/90 border border-blue-200 text-[8.5px] text-[#002855] font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px]">Email</td>
                    <td className="py-2 px-2 text-[#002855] font-mono text-[10px] truncate max-w-[180px]">
                      <a href={`mailto:${activeMember.email}`}>{activeMember.email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px]">Phone</td>
                    <td className="py-2 px-2 text-slate-800 font-mono text-[10px]">{activeMember.phone}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[9px]">Phone</td>
                    <td className="py-2 px-2 text-slate-800 font-mono text-[10px]">{selectedMember.phone}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── BENTO MODULE 8: QUICK IEEE MEMBER RESOURCES DOCK ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <a
              href="https://ieeexplore.ieee.org"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] shadow-xs text-center space-y-1 transition-all group active:scale-95"
            >
              <Globe size={18} className="mx-auto text-[#002855] group-hover:scale-110 transition-transform" />
              <span className="text-[10.5px] font-black text-slate-800 block">IEEE Xplore</span>
              <span className="text-[8.5px] text-slate-400 block">Digital Library</span>
            </a>

            <a
              href="https://spectrum.ieee.org"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] shadow-xs text-center space-y-1 transition-all group active:scale-95"
            >
              <BookOpen size={18} className="mx-auto text-[#002855] group-hover:scale-110 transition-transform" />
              <span className="text-[10.5px] font-black text-slate-800 block">Spectrum</span>
              <span className="text-[8.5px] text-slate-400 block">Tech Magazine</span>
            </a>

            <a
              href="https://ieee-collabratec.ieee.org"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] shadow-xs text-center space-y-1 transition-all group active:scale-95"
            >
              <Users size={18} className="mx-auto text-[#002855] group-hover:scale-110 transition-transform" />
              <span className="text-[10.5px] font-black text-slate-800 block">Collabratec</span>
              <span className="text-[8.5px] text-slate-400 block">Member Network</span>
            </a>

            <button
              type="button"
              onClick={() => handleTabChange("events")}
              className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] shadow-xs text-center space-y-1 transition-all group active:scale-95 cursor-pointer"
            >
              <Sparkles size={18} className="mx-auto text-[#002855] group-hover:scale-110 transition-transform" />
              <span className="text-[10.5px] font-black text-slate-800 block">Activities</span>
              <span className="text-[8.5px] text-slate-400 block">Branch Calendar</span>
            </button>
          </div>

        </div>
      ))}

      {/* ═══════════════════════════════════════════════════════════════════
          TAB 4: TECHNICAL SOCIETIES (WHITE THEME)
      ════════════════════════════════════════════════════════════════════ */}
{
  activeTab === "societies" && (<div className="space-y-3">
    {selectedSocietyId ? (() => {
      const rawSoc = SOCIETIES_DATA.find((s) => s.id === selectedSocietyId) || SOCIETIES_DATA[0];
      const soc = { ...rawSoc };
      
      const userSocList = Array.isArray(currentUser?.target_societies)
        ? currentUser.target_societies
        : (typeof currentUser?.target_societies === "string" ? currentUser.target_societies.split(",") : []);
      const isEnrolled = userSocList.some((ts) => {
        const t = String(ts || "").toLowerCase();
        const code = (soc.code || "").toLowerCase();
        const name = (soc.name || "").toLowerCase();
        return (
          t.includes(code) ||
          t.includes(name) ||
          (soc.id === "srec" && (t.includes("srec") || t.includes("student branch"))) ||
          (soc.id === "cs" && t.includes("computer")) ||
          (soc.id === "cis" && (t.includes("computational") || t.includes("intelligence"))) ||
          (soc.id === "comsoc" && (t.includes("communication") || t.includes("comsoc"))) ||
          (soc.id === "embs" && (t.includes("medicine") || t.includes("biology") || t.includes("embs"))) ||
          (soc.id === "pels" && (t.includes("power") || t.includes("pels"))) ||
          (soc.id === "im" && (t.includes("instrumentation") || t.includes("measurement"))) ||
          (soc.id === "wie" && (t.includes("women") || t.includes("wie")))
        );
      });
      
      const baseDataset = REAL_SOCIETY_DATASETS[soc.id] || { bearers: [], execs: [] };
      const dbOfficersList = dynamicSocietyOfficers[soc.id];
      const dbExecutivesList = dynamicSocietyExecutives[soc.id];

      const socOfficers = (dbOfficersList && dbOfficersList.length > 0)
        ? dbOfficersList
        : baseDataset.bearers;
      const socExecutives = (dbExecutivesList && dbExecutivesList.length > 0)
        ? dbExecutivesList
        : baseDataset.execs;

      return (
        <div className="space-y-3">
          <button onClick={() => setSelectedSocietyId(null)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#002855] hover:bg-slate-50 shadow-sm">
            <ArrowLeft size={13} /> Back to All Chapters
          </button>

          {/* Society Detail Header Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={soc.logo} alt={soc.code} className="w-12 h-12 rounded-2xl object-contain bg-slate-50 p-1 border border-slate-200 shadow-sm" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#002855] border border-blue-200 font-extrabold text-[9px] uppercase tracking-wider">
                      {soc.badge}
                    </span>
                    {isEnrolled && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[9px] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ENROLLED
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1 leading-tight">{soc.name}</h3>
                  <p className="text-[10px] text-[#002855] font-bold mt-0.5">{soc.code} · {soc.category}</p>
                </div>
              </div>
              <Link to={soc.href} className="text-[10px] text-[#002855] font-bold hover:underline shrink-0">
                Full Web →
              </Link>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {soc.description}
            </p>

            {/* Advisor & Chair (Text only, no pic) */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[8.5px] text-slate-400 font-bold uppercase block truncate">Faculty Advisor</span>
                <p className="font-extrabold text-slate-900 text-xs mt-0.5 leading-tight truncate">{soc.advisor}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[8.5px] text-slate-400 font-bold uppercase block truncate">Student Chair</span>
                <p className="font-extrabold text-slate-900 text-xs mt-0.5 leading-tight truncate">{soc.chair}</p>
              </div>
            </div>

            {/* Pricing & Join Button */}
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
              <div>
                <p className="text-[9px] text-amber-800 font-bold uppercase">Membership Fee</p>
                <p className="font-mono font-black text-amber-900 text-xs">{soc.feeUSD}</p>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#002855] text-white text-[10px] font-black uppercase shadow-sm active:scale-95 transition-all"
              >
                {isEnrolled ? "Renew Chapter" : "Join Chapter"}
              </button>
            </div>
          </div>

          {/* 1. SEPARATE SECTION: CHAPTER OFFICE BEARERS (REAL DATA, NO PIC) */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Crown size={14} className="text-amber-600" /> Chapter Office Bearers
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                {socOfficers.length} Officers
              </span>
            </div>
            <div className="space-y-1.5">
              {socOfficers.map((ob, idx) => (
                <div key={ob.id || idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:bg-slate-100/70 transition-colors">
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs leading-tight">{ob.name}</p>
                    <p className="text-[9.5px] text-[#002855] font-bold mt-0.5">{ob.role}</p>
                  </div>
                  {ob.department && (
                    <span className="text-[9.5px] font-mono text-slate-600 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                      {ob.department}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. SEPARATE SECTION: CHAPTER EXECUTIVE MEMBERS (REAL DATA, SEPARATE BELOW, NO PIC) */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Users size={14} className="text-[#002855]" /> Executive Committee Members
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#002855] text-[10px] font-bold">
                {socExecutives.length} Executives
              </span>
            </div>
            {socExecutives.length > 0 ? (
              <div className="space-y-1.5">
                {socExecutives.map((ex, idx) => (
                  <div key={ex.id || idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:bg-slate-100/70 transition-colors">
                    <div>
                      <p className="font-extrabold text-slate-900 text-xs leading-tight">{ex.name}</p>
                      <p className="text-[9.5px] text-sky-700 font-bold mt-0.5">{ex.role || "Executive Member"}</p>
                    </div>
                    {ex.department && (
                      <span className="text-[9.5px] font-mono text-slate-600 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 shrink-0">
                        {ex.department}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                Executive committee roster active. New appointments update during chapter recruitment.
              </p>
            )}
          </div>
        </div>
      );
    })() : (
      /* CHAPTERS LIST (CARDS / TABLE) */
      <>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu size={16} className="text-[#002855]" />
                {societyScope === "registered" && currentUser
                  ? `My Enrolled Societies (${studentRegisteredSocieties.length})`
                  : "8 Technical Society Chapters"}
              </h2>
              <p className="text-[10px] text-slate-500">
                {societyScope === "registered" && currentUser
                  ? `Active memberships for ${currentUser.first_name} ${currentUser.last_name}`
                  : "Affiliated technical societies at IEEE SB SREC"}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#002855] text-[10px] font-bold">
              {displayedSocieties.length} Chapters
            </span>
          </div>

          {/* Registered vs All Scope Switcher (when user is logged in) */}
          {currentUser && (<div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button onClick={() => setSocietyScope("registered")} className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1 ${societyScope === "registered"
              ? "bg-[#002855] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"}`}>
              <CheckCircle2 size={12} className={societyScope === "registered" ? "text-cyan-300" : "text-slate-400"} />
              <span>My Registered ({studentRegisteredSocieties.length})</span>
            </button>
            <button onClick={() => setSocietyScope("all")} className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1 ${societyScope === "all"
              ? "bg-[#002855] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"}`}>
              <Globe size={12} className={societyScope === "all" ? "text-cyan-300" : "text-slate-400"} />
              <span>All 8 Chapters</span>
            </button>
          </div>)}

          {/* Search bar for Societies */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Search chapters by name, code, or advisor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs placeholder-slate-400 focus:outline-none focus:border-[#002855] transition-all"
            />
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Display Format</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200 text-[10px]">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-2.5 py-1 rounded-lg font-black uppercase transition-all flex items-center gap-1 ${viewMode === "cards" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"}`}
              >
                <LayoutGrid size={11} /> Cards
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-2.5 py-1 rounded-lg font-black uppercase transition-all flex items-center gap-1 ${viewMode === "table" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"}`}
              >
                <TableIcon size={11} /> Table
              </button>
            </div>
          </div>
        </div>

        {/* SOCIETIES LISTING: TABLE VIEW vs CARDS VIEW (NO PICS) */}
        {viewMode === "table" ? (
          <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase tracking-wider text-slate-600">
                    <th className="py-2.5 px-3">Society Chapter</th>
                    <th className="py-2.5 px-3">Faculty Advisor</th>
                    <th className="py-2.5 px-3">Student Chair</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Fee (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {displayedSocieties.map((soc) => {
                    const userSocList = Array.isArray(currentUser?.target_societies)
                      ? currentUser.target_societies
                      : (typeof currentUser?.target_societies === "string" ? currentUser.target_societies.split(",") : []);
                    const isEnrolled = userSocList.some((ts) => {
                      const t = String(ts || "").toLowerCase();
                      const code = (soc.code || "").toLowerCase();
                      const name = (soc.name || "").toLowerCase();
                      return (
                        t.includes(code) ||
                        t.includes(name) ||
                        (soc.id === "srec" && (t.includes("srec") || t.includes("student branch"))) ||
                        (soc.id === "cs" && t.includes("computer")) ||
                        (soc.id === "cis" && (t.includes("computational") || t.includes("intelligence"))) ||
                        (soc.id === "comsoc" && (t.includes("communication") || t.includes("comsoc"))) ||
                        (soc.id === "embs" && (t.includes("medicine") || t.includes("biology") || t.includes("embs"))) ||
                        (soc.id === "pels" && (t.includes("power") || t.includes("pels"))) ||
                        (soc.id === "im" && (t.includes("instrumentation") || t.includes("measurement"))) ||
                        (soc.id === "wie" && (t.includes("women") || t.includes("wie")))
                      );
                    });
                    return (
                      <tr key={soc.id} onClick={() => setSelectedSocietyId(soc.id)} className="hover:bg-blue-50/50 transition-colors cursor-pointer">
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <img src={soc.logo} alt={soc.code} className="w-7 h-7 rounded-lg object-contain bg-slate-100 p-0.5 border border-slate-200 shrink-0" />
                            <div>
                              <p className="font-extrabold text-slate-900 leading-tight">{soc.name}</p>
                              <p className="text-[9px] text-[#002855] font-bold">{soc.badge}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-700 font-medium">{soc.advisor}</td>
                        <td className="py-2.5 px-3 text-[11px] text-slate-900 font-bold">{soc.chair}</td>
                        <td className="py-2.5 px-3 text-center">
                          {isEnrolled ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[9px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              ENROLLED
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">Available</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-amber-800 text-[11px]">{soc.feeUSD.split("+")[0]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {displayedSocieties.map((soc) => {
              const userSocList = Array.isArray(currentUser?.target_societies)
                ? currentUser.target_societies
                : (typeof currentUser?.target_societies === "string" ? currentUser.target_societies.split(",") : []);
              const isEnrolled = userSocList.some((ts) => {
                const t = String(ts || "").toLowerCase();
                const code = (soc.code || "").toLowerCase();
                const name = (soc.name || "").toLowerCase();
                return (
                  t.includes(code) ||
                  t.includes(name) ||
                  (soc.id === "srec" && (t.includes("srec") || t.includes("student branch"))) ||
                  (soc.id === "cs" && t.includes("computer")) ||
                  (soc.id === "cis" && (t.includes("computational") || t.includes("intelligence"))) ||
                  (soc.id === "comsoc" && (t.includes("communication") || t.includes("comsoc"))) ||
                  (soc.id === "embs" && (t.includes("medicine") || t.includes("biology") || t.includes("embs"))) ||
                  (soc.id === "pels" && (t.includes("power") || t.includes("pels"))) ||
                  (soc.id === "im" && (t.includes("instrumentation") || t.includes("measurement"))) ||
                  (soc.id === "wie" && (t.includes("women") || t.includes("wie")))
                );
              });

              return (
                <div
                  key={soc.id}
                  onClick={() => setSelectedSocietyId(soc.id)}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img src={soc.logo} alt={soc.code} className="w-11 h-11 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200 shrink-0" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#002855] border border-blue-200 font-extrabold text-[9px] uppercase tracking-wider">
                            {soc.badge}
                          </span>
                          {isEnrolled && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[9px] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ENROLLED
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-black text-slate-900 mt-1 leading-tight">{soc.name}</h3>
                        <p className="text-[10px] text-[#002855] font-bold">{soc.code} · {soc.category}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400 shrink-0" />
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">{soc.description}</p>

                  {/* Advisor & Chair Text Badges (No Pics) */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase block truncate">Advisor</span>
                      <p className="font-extrabold text-slate-900 text-[11px] truncate mt-0.5">{soc.advisor}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[8.5px] text-slate-400 font-bold uppercase block truncate">Chair</span>
                      <p className="font-extrabold text-slate-900 text-[11px] truncate mt-0.5">{soc.chair}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <span className="font-bold text-amber-800 font-mono text-[11px]">{soc.feeUSD}</span>
                    <span className="font-bold text-[#002855] flex items-center gap-0.5">
                      View Roster <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
    )}
  </div>
)}

{/* ═══════════════════════════════════════════════════════════════════
            TAB 5: ALL PAGES DIRECTORY (WHITE THEME & REVAMPED OFFICE BEARERS)
        ════════════════════════════════════════════════════════════════════ */}
{
  activeTab === "menu" && (<div className="space-y-3">
    {["office-bearers", "past-bearers", "awards", "plans", "funding", "contact", "about", "team", "reports", "gallery"].includes(allPagesCategory) ? (<div className="space-y-3">
      <button onClick={() => setAllPagesCategory("menu")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#002855] hover:bg-slate-50 shadow-sm">
        <ArrowLeft size={13} /> Back to All Pages Menu
      </button>

      {/* ── REVAMPED OFFICE BEARERS VIEW (2026-2027) ── */}
      {allPagesCategory === "office-bearers" && (<div className="space-y-3">

        {/* Header Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                <Crown size={11} className="text-amber-600" /> Tenure 2026-2027
              </span>
              <h3 className="text-base font-black text-slate-900 mt-1">
                Office Bearers &amp; Leadership
              </h3>
            </div>
            <Link to="/office-bearers" className="text-[10px] text-[#002855] font-bold hover:underline">
              Full Page →
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {[
              { id: "all", label: "All Officers" },
              { id: "leadership", label: "Leadership" },
              { id: "core", label: "Core Secretariat" },
              { id: "tech_design", label: "Tech & Design" },
              { id: "exec", label: "Executive Team" }
            ].map((cat) => (<button key={cat.id} onClick={() => setOfficerCategory(cat.id)} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${officerCategory === cat.id
              ? "bg-[#002855] text-white shadow-sm"
              : "bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200"}`}>
              {cat.label}
            </button>))}
          </div>
        </div>

        {/* DUAL VIEW: CARDS vs TABLE (TEXT & BADGES ONLY, NO PICS) */}
        {viewMode === "cards" ? (
          /* ── REVAMPED EXECUTIVE CARDS VIEW ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredOfficers.map((officer) => {
              const Icon = officer.icon || ShieldCheck;
              return (
                <motion.div
                  key={officer.id}
                  whileHover={{ y: -2 }}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#002855]/30 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs" style={{ backgroundColor: officer.bg || "#f0f9ff", color: officer.color || "#002855" }}>
                        <Icon size={20} />
                      </div>
                      <div className="leading-tight">
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {officer.name}
                        </h4>
                        <p className="text-xs font-black mt-0.5" style={{ color: officer.color || "#002855" }}>
                          {officer.role}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          {officer.department}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider" style={{ color: officer.color || "#002855", backgroundColor: officer.bg || "#f0f9ff" }}>
                      {officer.tagline}
                    </span>
                    <button onClick={() => setDetailModalMember(officer)} className="text-[10px] text-[#002855] font-extrabold hover:underline flex items-center gap-0.5">
                      <span>Dossier</span>
                      <ArrowRight size={10} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* ── TABLE VIEW FOR OFFICE BEARERS ── */
          <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[9px] uppercase font-black text-slate-600">
                    <th className="py-2.5 px-3">Officer</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOfficers.map((ob) => (
                    <tr key={ob.id} className="hover:bg-blue-50/50">
                      <td className="py-2.5 px-3">
                        <span className="font-extrabold text-slate-900 text-xs">{ob.name}</span>
                      </td>
                      <td className="py-2.5 px-3 text-xs font-bold" style={{ color: ob.color || "#002855" }}>{ob.role}</td>
                      <td className="py-2.5 px-3 text-[11px] text-slate-600">{ob.department}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button onClick={() => setDetailModalMember(ob)} className="px-2 py-1 rounded-lg bg-blue-50 text-[#002855] text-[10px] font-black hover:bg-blue-100">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>)}

      {/* Sub-view: Past Bearers Table */}
      {allPagesCategory === "past-bearers" && (<div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <GraduationCap size={14} className="text-[#002855]" /> Past Office Bearers Hall of Fame
          </h3>
          <Link to="/past-bearers" className="text-[10px] text-[#002855] font-bold hover:underline">
            Full Page →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[450px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] uppercase font-black text-slate-600">
                <th className="py-2.5 px-3">Tenure Year</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Dept</th>
                <th className="py-2.5 px-3">Key Achievement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(dbPastBearers && dbPastBearers.length > 0 ? dbPastBearers : PAST_BEARERS_DATA).map((pb, idx) => (
                <tr key={idx} className="hover:bg-blue-50/50">
                  <td className="py-2 px-3 font-mono font-bold text-[#002855]">{pb.year}</td>
                  <td className="py-2 px-3 font-extrabold text-slate-900">{pb.name}</td>
                  <td className="py-2 px-3 text-slate-700 font-semibold">{pb.role}</td>
                  <td className="py-2 px-3 text-slate-500 text-[11px]">{pb.dept}</td>
                  <td className="py-2 px-3 text-amber-700 text-[10px] font-semibold">{pb.achievement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>)}

      {/* Sub-view: Dedicated About SREC SB Screen */}
      {allPagesCategory === "about" && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#002855] via-[#003b7a] to-[#0055a5] text-white shadow-md space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-cyan-200 font-mono font-extrabold text-[9px] uppercase tracking-wider">
                STB Code 64581
              </span>
              <Link to="/about" className="text-[10px] text-sky-200 font-bold hover:underline flex items-center gap-1">
                Full Web View <ExternalLink size={10} />
              </Link>
            </div>
            <h3 className="text-base font-black leading-tight text-white">
              IEEE SREC Student Branch
            </h3>
            <p className="text-[11px] text-sky-100/90 leading-snug">
              Established in 2001 at Sri Ramakrishna Engineering College, Coimbatore. Operating under IEEE Madras Section (Region 10).
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <p className="text-xl font-black text-[#002855]">24+ Years</p>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Active Operations</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <p className="text-xl font-black text-amber-600">300+</p>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Active Members</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <p className="text-xl font-black text-emerald-600">8 Chapters</p>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Technical Societies</p>
            </div>
            <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-center">
              <p className="text-xl font-black text-purple-600">50+</p>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-wider">Annual Conclaves</p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center gap-3">
              <img src="https://srec.ac.in/uploads/Faculty/imresizer4drkbalamurugan260715124354.jpg" alt="Counselor" className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-sm" />
              <div>
                <h4 className="font-extrabold text-slate-900 text-xs">Dr. K. Balamurugan</h4>
                <p className="text-[10px] text-purple-700 font-extrabold">Student Branch Counsellor</p>
                <p className="text-[9px] text-slate-500">Associate Professor / EEE</p>
              </div>
            </div>
            <blockquote className="text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              "Our goal is to cultivate world-class engineers by providing active hands-on technical projects, global IEEE networking, and student leadership opportunities."
            </blockquote>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Trophy size={14} className="text-[#002855]" /> Student Branch Milestones
            </h4>
            <div className="space-y-2.5">
              {[
                { year: "2001", title: "Inception & Chartering", desc: "Inaugurated on June 11, 2001 under Madras Section." },
                { year: "2008", title: "CS & PELS Society Expansion", desc: "Formed dedicated Technical Society chapters." },
                { year: "2015", title: "HQ Global Recognition", desc: "Awarded continuous Exemplary Student Branch accolade." },
                { year: "2020", title: "Digital & Virtual Hackathons", desc: "Hosted IEEE Xtreme & national virtual hackathons." },
                { year: "2026", title: "AECTSD 2027 Flagship Prep", desc: "Organizing premier IEEE international conference." }
              ].map((m, idx) => (
                <div key={idx} className="flex gap-2.5 items-start">
                  <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-[#002855] border border-blue-200 font-mono text-[9px] font-black shrink-0">
                    {m.year}
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 leading-tight">{m.title}</p>
                    <p className="text-[10px] text-slate-500">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-view: Dedicated Executive Committee & Team Screen */}
      {allPagesCategory === "team" && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#002855] font-extrabold text-[9px] uppercase tracking-wider">
                  Directory 2026-2027
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Executive Committee &amp; Team
                </h3>
              </div>
              <Link to="/team" className="text-[10px] text-[#002855] font-bold hover:underline">
                Full Page →
              </Link>
            </div>

            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search team by name, role, dept..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#002855]"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {[
                { id: "all", label: "All Team" },
                { id: "leadership", label: "Leadership" },
                { id: "core", label: "Core Secretariat" },
                { id: "tech_design", label: "Tech & Design" },
                { id: "exec", label: "Executive Team" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setOfficerCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${
                    officerCategory === cat.id
                      ? "bg-[#002855] text-white shadow-sm"
                      : "bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredOfficers
              .filter((off) => {
                if (!searchQuery) return true;
                const q = searchQuery.toLowerCase();
                return (
                  (off.name || "").toLowerCase().includes(q) ||
                  (off.role || "").toLowerCase().includes(q) ||
                  (off.department || "").toLowerCase().includes(q)
                );
              })
              .map((officer) => {
                const Icon = officer.icon || ShieldCheck;
                return (
                  <div
                    key={officer.id}
                    onClick={() => setDetailModalMember(officer)}
                    className="p-3 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: officer.bg || "#f0f9ff", color: officer.color || "#002855" }}>
                      <Icon size={18} />
                    </div>
                    <div className="leading-tight flex-1 min-w-0">
                      <h4 className="font-extrabold text-slate-900 text-xs truncate">
                        {officer.name}
                      </h4>
                      <p className="text-[10px] font-black mt-0.5 truncate" style={{ color: officer.color || "#002855" }}>
                        {officer.role}
                      </p>
                      <p className="text-[9px] text-slate-500 truncate mt-0.5">
                        {officer.department}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-slate-400 shrink-0" />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Sub-view: Dedicated Event Reports & Activity Hub Screen */}
      {allPagesCategory === "reports" && (
        <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm space-y-0">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <FileText size={14} className="text-[#002855]" /> Event Reports &amp; Hub Congress
              </h3>
              <p className="text-[10px] text-slate-500">Official documentation of all IEEE SREC activities</p>
            </div>
            <Link to="/reports" className="text-[10px] text-[#002855] font-bold hover:underline">
              Full Page →
            </Link>
          </div>

          <div className="p-3 space-y-2.5">
            {(dbEvents && dbEvents.length > 0 ? dbEvents : EVENTS_DATA).map((evt, idx) => (
              <div key={idx} className="p-3 rounded-2xl border border-slate-200 bg-white hover:border-[#002855]/40 transition-all space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#002855] border border-blue-200 text-[8px] font-black uppercase">
                    {evt.category || "Report"} · {evt.society || "IEEE SREC"}
                  </span>
                  <span className="text-[9px] font-mono font-bold text-slate-500">{evt.date}</span>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs leading-tight">{evt.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{evt.description}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-slate-600 font-medium flex items-center gap-1">
                    <Building2 size={11} className="text-slate-400" /> {evt.venue || "SREC Campus"}
                  </span>
                  <button
                    onClick={() => setSelectedEventModal(evt)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-100 text-[#002855] font-black text-[9px] hover:bg-slate-200 transition-all"
                  >
                    <Eye size={10} /> View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-view: Dedicated Photo Gallery Screen */}
      {allPagesCategory === "gallery" && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Camera size={14} className="text-pink-600" /> IEEE SREC Photo Gallery
              </h3>
              <Link to="/gallery" className="text-[10px] text-[#002855] font-bold hover:underline">
                Full Page →
              </Link>
            </div>
            <p className="text-[10px] text-slate-500">Memories, flagship symposia, and awards ceremonies</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { title: "AECTSD Conference Kickoff", date: "2026", src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80", tag: "Conference" },
              { title: "VisionX Coding Arena", date: "2025", src: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80", tag: "Symposium" },
              { title: "IEEE Xtreme 24H Arena", date: "2025", src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=80", tag: "Hackathon" },
              { title: "IEEE Day Celebration", date: "2025", src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80", tag: "IEEE Day" },
              { title: "Smart Grid EV Lab", date: "2025", src: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=600&auto=format&fit=crop&q=80", tag: "Workshop" },
              { title: "WIE STEM School Drive", date: "2025", src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80", tag: "Outreach" }
            ].map((item, idx) => (
              <div key={idx} className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm aspect-video">
                <img src={item.src} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent p-2 flex flex-col justify-end">
                  <span className="px-1.5 py-0.2 w-max rounded bg-pink-500/80 text-white font-black text-[7px] uppercase tracking-wider mb-0.5">
                    {item.tag}
                  </span>
                  <p className="text-[10px] font-extrabold text-white leading-tight line-clamp-1">{item.title}</p>
                  <p className="text-[8px] text-slate-300 font-mono">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-view: Awards Table */}
      {allPagesCategory === "awards" && (<div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Award size={14} className="text-[#002855]" /> Awards &amp; Honors Table
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#002855] text-[9px] font-bold">
            {(dbAwards && dbAwards.length > 0 ? dbAwards : AWARDS_DATA).length} Accolades
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[450px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] uppercase font-black text-slate-600">
                <th className="py-2.5 px-3">Award Title</th>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Issuing Body</th>
                <th className="py-2.5 px-3">Prize / Grant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(dbAwards && dbAwards.length > 0 ? dbAwards : AWARDS_DATA).map((aw, idx) => (<tr key={idx} className="hover:bg-blue-50/50">
                <td className="py-2 px-3 font-extrabold text-slate-900">{aw.title}</td>
                <td className="py-2 px-3 font-mono text-[#002855] font-bold">{aw.year}</td>
                <td className="py-2 px-3 text-slate-600">{aw.body}</td>
                <td className="py-2 px-3 font-bold text-amber-700 font-mono">{aw.prize}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>)}

      {/* Sub-view: Annual Plans Table */}
      {allPagesCategory === "plans" && (<div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Calendar size={14} className="text-[#002855]" /> Annual Plans &amp; Roadmap
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#002855] text-[9px] font-bold">
            {(dbAnnualPlans && dbAnnualPlans.length > 0 ? dbAnnualPlans : ANNUAL_PLANS_DATA).length} Initiatives
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[450px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] uppercase font-black text-slate-600">
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Society</th>
                <th className="py-2.5 px-3">Budget</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(dbAnnualPlans && dbAnnualPlans.length > 0 ? dbAnnualPlans : ANNUAL_PLANS_DATA).map((pl, idx) => (<tr key={idx} className="hover:bg-blue-50/50">
                <td className="py-2 px-3 font-bold text-[#002855]">{pl.month}</td>
                <td className="py-2 px-3 font-semibold text-slate-900">{pl.event}</td>
                <td className="py-2 px-3 text-slate-600">{pl.society}</td>
                <td className="py-2 px-3 font-mono text-slate-800">{pl.budget}</td>
                <td className="py-2 px-3">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${pl.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {pl.status}
                  </span>
                </td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>)}

      {/* Sub-view: Funding Table */}
      {allPagesCategory === "funding" && (<div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <DollarSign size={14} className="text-[#002855]" /> Funding &amp; Grants Report
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#002855] text-[9px] font-bold">
            {(dbFunding && dbFunding.length > 0 ? dbFunding : FUNDING_DATA).length} Grants
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[450px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] uppercase font-black text-slate-600">
                <th className="py-2.5 px-3">Grant Source</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(dbFunding && dbFunding.length > 0 ? dbFunding : FUNDING_DATA).map((fn, idx) => (<tr key={idx} className="hover:bg-blue-50/50">
                <td className="py-2 px-3 font-bold text-slate-900">{fn.grant}</td>
                <td className="py-2 px-3 font-mono font-black text-emerald-700">{fn.amount}</td>
                <td className="py-2 px-3 font-mono text-[#002855]">{fn.year}</td>
                <td className="py-2 px-3 text-slate-600 text-[11px]">{fn.purpose}</td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>)}

      {/* Sub-view: Contact Table */}
      {allPagesCategory === "contact" && (<div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Phone size={14} className="text-[#002855]" /> Contact &amp; Campus Directory
          </h3>
          <Link to="/contact" className="text-[10px] text-[#002855] font-bold hover:underline">
            Full Page →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <tbody className="divide-y divide-slate-100">
              {CONTACT_DIRECTORY.map((ct, idx) => (<tr key={idx} className="hover:bg-blue-50/50">
                <td className="py-2.5 px-3 font-bold text-[#002855] text-[11px] w-1/3">{ct.title}</td>
                <td className="py-2.5 px-3">
                  <p className="font-extrabold text-slate-900">{ct.contact}</p>
                  <p className="text-slate-600 font-mono text-[11px]">{ct.detail}</p>
                  <p className="text-[#002855] underline text-[10px]">{ct.email}</p>
                </td>
              </tr>))}
            </tbody>
          </table>
        </div>
      </div>)}
    </div>) : (
      /* CATEGORIZED MENU HUB OF ALL 16+ PAGES (WHITE THEME) */
      <div className="space-y-3">
        {/* 🌐 TOP COMPLETE WEBSITE ACCESS CARD */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/90 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#002855] text-white flex items-center justify-center shadow-md shrink-0">
              <Globe size={20} />
            </div>
            <div className="leading-tight">
              <h3 className="font-extrabold text-slate-900 text-xs">Switch to Complete Website</h3>
              <p className="text-[10px] text-slate-500">Access full desktop layout &amp; all archives</p>
            </div>
          </div>
          <Link to="/" className="px-3 py-2 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[10px] uppercase flex items-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap">
            <span>Open Web</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <LayoutGrid size={16} className="text-[#002855]" />
            All IEEE SREC Pages Directory
          </h2>
          <p className="text-[10px] text-slate-500">
            1-tap access to all 16+ modules &amp; structured data tables
          </p>
        </div>

        {/* Category 1: Leadership & Team */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 px-1">
            Leadership &amp; Team
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setAllPagesCategory("office-bearers")} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm">
              <Crown size={18} className="text-amber-600 mb-1" />
              <p className="text-xs font-black text-slate-900">Office Bearers</p>
              <p className="text-[9px] text-slate-500">2026-27 Leadership</p>
            </button>
            <button onClick={() => setAllPagesCategory("past-bearers")} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm">
              <GraduationCap size={18} className="text-blue-600 mb-1" />
              <p className="text-xs font-black text-slate-900">Past Bearers</p>
              <p className="text-[9px] text-slate-500">2022-2025 Timeline</p>
            </button>
            <button onClick={() => setAllPagesCategory("team")} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm">
              <Users size={18} className="text-[#002855] mb-1" />
              <p className="text-xs font-black text-slate-900">Executive Team</p>
              <p className="text-[9px] text-slate-500">Full Directory</p>
            </button>
            <button onClick={() => setAllPagesCategory("about")} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm">
              <Info size={18} className="text-indigo-600 mb-1" />
              <p className="text-xs font-black text-slate-900">About SREC SB</p>
              <p className="text-[9px] text-slate-500">Code 64581 History</p>
            </button>
          </div>
        </div>

        {/* Category 2: Activities, Awards & Plans */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 px-1">
            Activities &amp; Honors
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setAllPagesCategory("awards")} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm">
              <Award size={18} className="text-purple-600 mb-1" />
              <p className="text-xs font-black text-slate-900">Awards &amp; Honors</p>
              <p className="text-[9px] text-slate-500">Madras Sec Accolades</p>
            </button>
            <button onClick={() => setAllPagesCategory("plans")} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm">
              <Calendar size={18} className="text-blue-600 mb-1" />
              <p className="text-xs font-black text-slate-900">Annual Plans</p>
              <p className="text-[9px] text-slate-500">Yearly Roadmap</p>
            </button>
            <button onClick={() => setAllPagesCategory("reports")} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm">
              <FileText size={18} className="text-cyan-600 mb-1" />
              <p className="text-xs font-black text-slate-900">Event Reports</p>
              <p className="text-[9px] text-slate-500">Hub &amp; Conclave Hub</p>
            </button>
            <button onClick={() => setAllPagesCategory("gallery")} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm">
              <ImageIcon size={18} className="text-pink-600 mb-1" />
              <p className="text-xs font-black text-slate-900">Photo Gallery</p>
              <p className="text-[9px] text-slate-500">Event Memories</p>
            </button>
          </div>
        </div>

        {/* Category 3: Portals & Registration */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 px-1">
            Portals &amp; Joining
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => setIsRegisterModalOpen(true)} className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-left active:scale-95 transition-all shadow-sm">
              <UserPlus size={18} className="text-[#002855] mb-1" />
              <p className="text-xs font-black text-slate-900">Join / Register</p>
              <p className="text-[9px] text-[#002855] font-semibold">Store in Database</p>
            </button>
            <a href="http://aectsd2027.srecieee.org/" target="_blank" rel="noopener noreferrer" className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left active:scale-95 transition-all shadow-sm">
              <Sparkles size={18} className="text-amber-600 mb-1" />
              <p className="text-xs font-black text-slate-900">AECTSD 2027</p>
              <p className="text-[9px] text-amber-700 font-semibold">Flagship Conference</p>
            </a>
            <button onClick={() => setAllPagesCategory("contact")} className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm">
              <Phone size={18} className="text-emerald-600 mb-1" />
              <p className="text-xs font-black text-slate-900">Contact &amp; Map</p>
              <p className="text-[9px] text-slate-500">Campus Location</p>
            </button>
            <Link to="/admin-login" className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm">
              <ShieldCheck size={18} className="text-slate-500 mb-1" />
              <p className="text-xs font-black text-slate-900">Admin Portal</p>
              <p className="text-[9px] text-slate-500">Restricted Access</p>
            </Link>
          </div>
        </div>
      </div>)}
  </div>)
}

      </main >

  {/* ── MEMBER DETAIL DOSSIER MODAL (WHITE THEME) ───────────────────── */ }
  < AnimatePresence >
  { detailModalMember && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-5 shadow-2xl space-y-3 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <img src={detailModalMember.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-slate-300" />
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
              {detailModalMember.first_name} {detailModalMember.last_name}
            </h3>
            <p className="text-[10px] text-[#002855] font-mono font-bold">
              {detailModalMember.roll_number} · IEEE #{detailModalMember.ieee_id}
            </p>
          </div>
        </div>
        <button onClick={() => setDetailModalMember(null)} className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900">
          <X size={16} />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-400">Department</span>
          <p className="text-slate-900 font-semibold">{detailModalMember.department} ({detailModalMember.year_of_study})</p>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-400">Statement of Purpose / Bio</span>
          <p className="text-slate-600 text-[11px] italic">"{detailModalMember.bio_sop || "Active IEEE Student Member at SREC."}"</p>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-400">Enrolled Societies</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {(Array.isArray(detailModalMember.target_societies) ? detailModalMember.target_societies : (typeof detailModalMember.target_societies === "string" ? detailModalMember.target_societies.split(",") : [])).map((s, idx) => (<span key={idx} className="px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-[9px] text-[#002855] font-semibold">
              {s}
            </span>))}
          </div>
        </div>
        <div>
          <span className="text-[9px] uppercase font-bold text-slate-400">Skills &amp; Specialties</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {(Array.isArray(detailModalMember.skills) ? detailModalMember.skills : (typeof detailModalMember.skills === "string" ? detailModalMember.skills.split(",") : [])).map((sk, idx) => (<span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-[9px] text-slate-700">
              {sk}
            </span>))}
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100">
        <button onClick={() => {
          setSelectedMember(detailModalMember);
          setDetailModalMember(null);
          handleTabChange("id");
        }} className="w-full py-2.5 rounded-xl bg-[#002855] text-white font-black text-xs uppercase text-center shadow-md flex items-center justify-center gap-1.5">
          <IdCard size={14} />
          <span>Open Digital ID Card</span>
        </button>
      </div>
    </motion.div>
  </div>)}
      </AnimatePresence >

  {/* ── GLOBAL SEARCH MODAL (WHITE THEME) ────────────────────────────── */ }
  < AnimatePresence >
  { isSearchOpen && (<div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-sm">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-4 shadow-2xl space-y-3 text-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-black uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
          <Search size={14} /> Search App Directory
        </h3>
        <button onClick={() => {
          setIsSearchOpen(false);
          setGlobalSearchTerm("");
        }} className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900">
          <X size={15} />
        </button>
      </div>

      <input type="text" placeholder="Search members, societies, events..." value={globalSearchTerm} onChange={(e) => setGlobalSearchTerm(e.target.value)} autoFocus className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#002855] focus:bg-white" />

      {globalSearchTerm ? (<div className="max-h-60 overflow-y-auto space-y-1.5 text-xs">
        {members
          .filter((m) => `${m.first_name} ${m.last_name} ${m.roll_number} ${m.ieee_id} ${m.department}`
            .toLowerCase()
            .includes(globalSearchTerm.toLowerCase()))
          .map((m) => (<div key={m.id} onClick={() => {
            setSelectedMember(m);
            setIsSearchOpen(false);
            setGlobalSearchTerm("");
            handleTabChange("id");
          }} className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 cursor-pointer flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">{m.first_name} {m.last_name}</p>
              <p className="text-[10px] text-[#002855] font-mono font-bold">{m.roll_number} · {m.department}</p>
            </div>
            <span className="text-[9px] text-slate-400 font-bold uppercase">Member</span>
          </div>))}

        {displayedSocieties.filter((s) => `${s.name} ${s.code} ${s.advisor} ${s.chair} ${s.category}`
          .toLowerCase()
          .includes(globalSearchTerm.toLowerCase())).map((s) => (<div key={s.id} onClick={() => {
            setIsSearchOpen(false);
            setGlobalSearchTerm("");
            navigate(s.href);
          }} className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 cursor-pointer flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900">{s.name}</p>
              <p className="text-[10px] text-slate-500">{s.category}</p>
            </div>
            <span className="text-[9px] text-[#002855] font-bold uppercase">Society</span>
          </div>))}
      </div>) : (<div className="text-center py-4 text-slate-400 text-xs">
        Type a name, roll number, or society to search instantly.
      </div>)}
    </motion.div>
  </div>)}
      </AnimatePresence >

  {/* ── MEMBERSHIP RENEWAL MODAL ────────────────────────────────────── */ }
  < AnimatePresence >
  { isRenewModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="w-full max-w-sm rounded-3xl bg-white p-5 border border-slate-200 shadow-2xl space-y-4">
      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md font-black">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Renew Membership</h3>
            <p className="text-[10px] text-slate-500 font-mono">ID #{selectedMember.ieee_id} · {selectedMember.roll_number}</p>
          </div>
        </div>
        <button onClick={() => setIsRenewModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200">
          <X size={16} />
        </button>
      </div>

      {/* Member Summary Box */}
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
        <div className="flex justify-between">
          <span className="text-slate-500">Member:</span>
          <span className="font-bold text-slate-900">{selectedMember.first_name} {selectedMember.last_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Current Validity:</span>
          <span className="font-bold text-emerald-600">{selectedMember.valid_thru}</span>
        </div>
      </div>

      {/* Renewal Options */}
      <div className="space-y-2">
        <label className="block text-[10px] font-black uppercase text-slate-500 tracking-wider">
          Select Renewal Period
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setRenewalYear("2027")} className={`p-3 rounded-2xl border text-left transition-all ${renewalYear === "2027"
            ? "border-[#002855] bg-blue-50/80 ring-2 ring-[#002855]/20 shadow-sm"
            : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}>
            <p className="font-black text-xs text-[#002855]">1 Year (2027)</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Valid Thru DEC 2027</p>
            <p className="text-[9px] font-bold text-emerald-700 mt-1">₹1,150 ($14)</p>
          </button>

          <button type="button" onClick={() => setRenewalYear("2028")} className={`p-3 rounded-2xl border text-left transition-all ${renewalYear === "2028"
            ? "border-[#002855] bg-blue-50/80 ring-2 ring-[#002855]/20 shadow-sm"
            : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}>
            <p className="font-black text-xs text-[#002855]">2 Years (2028)</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Valid Thru DEC 2028</p>
            <p className="text-[9px] font-bold text-emerald-700 mt-1">₹2,300 ($28)</p>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button onClick={handlePerformRenewal} className="w-full py-2.5 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5">
          <Check size={14} />
          <span>Confirm Branch Renewal</span>
        </button>

        <a href="https://www.ieee.org/membership/renew.html" target="_blank" rel="noopener noreferrer" className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1 transition-all">
          <span>Official IEEE Portal</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </motion.div>
  </div>)}
      </AnimatePresence >

  {/* ── IN-APP MEMBERSHIP REGISTRATION MODAL ───────────────────────── */ }
  < AnimatePresence >
  { isRegisterModalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
    <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="w-full max-w-md my-auto rounded-3xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-sans text-slate-900">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[#002855] text-white flex items-center justify-center shadow-md font-black">
            <UserPlus size={20} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Register Membership</h3>
            <p className="text-[10px] text-slate-500">Stored directly to IEEE SREC Database</p>
          </div>
        </div>
        <button onClick={() => setIsRegisterModalOpen(false)} className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleRegisterMember} className="space-y-3">
        {/* Names */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              First Name *
            </label>
            <input type="text" required placeholder="e.g. Arun" value={regForm.firstName} onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              Last Name *
            </label>
            <input type="text" required placeholder="e.g. Kumar" value={regForm.lastName} onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none" />
          </div>
        </div>

        {/* Roll Number & IEEE ID */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              Roll Number *
            </label>
            <input type="text" required placeholder="e.g. 23CS101" value={regForm.rollNumber} onChange={(e) => setRegForm({ ...regForm, rollNumber: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold uppercase focus:bg-white focus:border-[#002855] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              IEEE Member ID
            </label>
            <input type="text" placeholder="Optional / Auto" value={regForm.ieeeId} onChange={(e) => setRegForm({ ...regForm, ieeeId: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none" />
          </div>
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              College Email *
            </label>
            <input type="email" required placeholder="name@srec.ac.in" value={regForm.email} onChange={(e) => setRegForm({ ...regForm, email: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              Phone Number
            </label>
            <input type="tel" placeholder="+91 98400 00000" value={regForm.phone} onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })} className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none" />
          </div>
        </div>

        {/* Department & Year of Study */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              Department
            </label>
            <select value={regForm.department} onChange={(e) => setRegForm({ ...regForm, department: e.target.value })} className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none">
              <option value="Computer Science & Engineering">CSE</option>
              <option value="Information Technology">IT</option>
              <option value="Electrical & Electronics Engineering">EEE</option>
              <option value="Electronics & Communication Engineering">ECE</option>
              <option value="Biomedical Engineering">BME</option>
              <option value="Mechanical Engineering">Mech</option>
              <option value="Artificial Intelligence & Data Science">AI & DS</option>
              <option value="Robotics and Automation">Robotics</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              Year of Study
            </label>
            <select value={regForm.yearOfStudy} onChange={(e) => setRegForm({ ...regForm, yearOfStudy: e.target.value })} className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none">
              <option value="I Year (2025-2029)">I Year</option>
              <option value="II Year (2024-2028)">II Year</option>
              <option value="III Year (2023-2027)">III Year</option>
              <option value="IV Year (2022-2026)">IV Year</option>
            </select>
          </div>
        </div>

        {/* Technical Societies Selector with Real Prices & Total Live Calculation */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-700">
              Select Societies to Enroll ({regForm.selectedSocieties.length} Selected)
            </label>
            <span className="text-[10px] font-mono font-bold text-[#002855] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Total: ${regForm.selectedSocieties.reduce((acc, name) => {
                if (name.includes("Student Branch"))
                  return acc + 7;
                if (name.includes("Computer Society"))
                  return acc + 8;
                if (name.includes("Computational Intelligence"))
                  return acc + 4;
                if (name.includes("Communication Society"))
                  return acc + 1;
                if (name.includes("Medicine and Biology"))
                  return acc + 1;
                if (name.includes("Power Electronics"))
                  return acc + 5;
                if (name.includes("Instrumentation"))
                  return acc + 5;
                return acc;
              }, 0)} USD (≈ ₹{regForm.selectedSocieties.reduce((acc, name) => {
                if (name.includes("Student Branch"))
                  return acc + 7;
                if (name.includes("Computer Society"))
                  return acc + 8;
                if (name.includes("Computational Intelligence"))
                  return acc + 4;
                if (name.includes("Communication Society"))
                  return acc + 1;
                if (name.includes("Medicine and Biology"))
                  return acc + 1;
                if (name.includes("Power Electronics"))
                  return acc + 5;
                if (name.includes("Instrumentation"))
                  return acc + 5;
                return acc;
              }, 0) * 83})
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
              { id: "IEEE Instrumentation and Measurement (IM)", name: "IEEE Instrumentation (IM)", fee: "+$5 USD" },
              { id: "IEEE Circuits and Systems Society (CAS)", name: "IEEE Circuits & Systems (CAS)", fee: "+$6 USD" }
            ].map((soc) => {
              const isChecked = regForm.selectedSocieties.includes(soc.id);
              return (<label key={soc.id} className={`flex items-center justify-between p-2 rounded-xl text-xs font-bold cursor-pointer transition-all border ${isChecked ? "bg-blue-50 border-[#002855] text-[#002855] shadow-xs" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <input type="checkbox" checked={isChecked} disabled={soc.mandatory} onChange={(e) => {
                    if (soc.mandatory)
                      return;
                    if (e.target.checked) {
                      setRegForm({
                        ...regForm,
                        selectedSocieties: [...regForm.selectedSocieties, soc.id]
                      });
                    }
                    else {
                      setRegForm({
                        ...regForm,
                        selectedSocieties: regForm.selectedSocieties.filter((s) => s !== soc.id)
                      });
                    }
                  }} className="rounded border-slate-300 text-[#002855] focus:ring-0" />
                  <span className="truncate text-[11px]">{soc.name.replace("IEEE ", "")}</span>
                </div>
                <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 shrink-0">
                  {soc.fee}
                </span>
              </label>);
            })}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-2">
          <button type="submit" disabled={isRegSubmitting} className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#002855] to-[#00629B] hover:from-[#001c3d] hover:to-[#004e8a] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
            {isRegSubmitting ? (<>
              <RotateCw size={15} className="animate-spin" />
              <span>Saving to Database...</span>
            </>) : (<>
              <ShieldCheck size={15} />
              <span>Submit &amp; Activate My 3D ID Card</span>
            </>)}
          </button>
        </div>
      </form>
    </motion.div>
  </div>
)}
</AnimatePresence>

{/* ── OFFICIAL IEEE PDF MEMBERSHIP CARD VIEWER MODAL (RESPONSIVE MOBILE) ── */}
<AnimatePresence>
  {isPdfModalOpen && (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-slate-900"
      >
        {/* Modal Top Header Bar */}
        <div className="bg-gradient-to-r from-[#001838] via-[#002855] to-[#004899] text-white px-4 py-3.5 flex items-center justify-between gap-2 shrink-0 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20 shrink-0">
              <FileText className="text-cyan-300" size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs font-black text-white uppercase tracking-tight truncate">
                IEEE Membership Card (PDF)
              </h3>
              <p className="text-[10px] text-sky-200 font-mono truncate">
                #{selectedMember?.ieee_id || "98421045"} · {selectedMember?.first_name} {selectedMember?.last_name}
              </p>
            </div>
          </div>

          {/* Close Modal */}
          <button
            type="button"
            onClick={() => setIsPdfModalOpen(false)}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shrink-0"
            title="Close viewer"
          >
            <X size={15} />
          </button>
        </div>

        {/* PDF Viewer Body */}
        <div className="p-3 flex-1 overflow-hidden flex flex-col bg-slate-100 gap-2.5">
          <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shadow-inner flex flex-col min-h-[48vh]">
            <iframe
              src={`${activePdfUrl}#view=FitH&toolbar=1`}
              title="Official IEEE Membership Card PDF"
              className="w-full h-full flex-1 rounded-2xl bg-slate-900"
            />
          </div>

          {/* Action Toolbar */}
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-2 text-xs">
            <a
              href={activePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 border border-slate-200"
            >
              <ExternalLink size={12} />
              <span>Open Tab</span>
            </a>

            <a
              href={activePdfUrl}
              download={`IEEE_Card_${selectedMember?.ieee_id || selectedMember?.roll_number || "member"}.pdf`}
              className="px-3.5 py-2 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download size={13} />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )}
  </AnimatePresence>

  {/* ── INTERACTIVE EVENT DATABASE DETAIL MODAL ────────────────── */}
  <AnimatePresence>
    {selectedEventModal && (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] text-slate-900"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-[#001838] via-[#002855] to-[#004899] text-white px-4 py-3.5 flex items-center justify-between gap-2 shrink-0 shadow-md">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20 shrink-0">
                <Calendar className="text-cyan-300" size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs font-black text-white uppercase tracking-tight truncate">
                  {selectedEventModal.badge || "Database Activity"}
                </h3>
                <p className="text-[10px] text-sky-200 truncate">
                  {selectedEventModal.society || "IEEE SB SREC"} · {selectedEventModal.category}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedEventModal(null)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shrink-0"
            >
              <X size={15} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
            {selectedEventModal.image && (
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200">
                <img
                  src={selectedEventModal.image}
                  alt={selectedEventModal.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                    selectedEventModal.status === "Upcoming"
                      ? "bg-amber-400 text-slate-950 font-extrabold animate-pulse"
                      : "bg-emerald-500 text-white"
                  }`}>
                    {selectedEventModal.status}
                  </span>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                {selectedEventModal.title}
              </h3>
              {selectedEventModal.subtitle && (
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {selectedEventModal.subtitle}
                </p>
              )}
            </div>

            {/* Event Schedule Meta Grid */}
            <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Date &amp; Time</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{selectedEventModal.date}</p>
                <p className="text-[10px] text-slate-500">{selectedEventModal.time || "Full Day"}</p>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">Venue / Location</span>
                <p className="font-extrabold text-slate-900 mt-0.5">{selectedEventModal.venue || "SREC Campus"}</p>
              </div>
            </div>

            {/* Chief Guest & Participants (if present) */}
            {(selectedEventModal.chief_guest || selectedEventModal.participants) && (
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                {selectedEventModal.chief_guest && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold uppercase text-[9px]">Chief Guest / Speaker</span>
                    <strong className="text-slate-900">{selectedEventModal.chief_guest}</strong>
                  </div>
                )}
                {selectedEventModal.participants && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-blue-100">
                    <span className="text-slate-500 font-bold uppercase text-[9px]">Participants Logged</span>
                    <strong className="text-blue-900">{selectedEventModal.participants}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">About this Activity</span>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {selectedEventModal.description || "Official IEEE Student Branch event proceedings logged in repository database."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setSelectedEventModal(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider transition-all"
              >
                Close
              </button>
              {selectedEventModal.link && selectedEventModal.link.startsWith("http") ? (
                <a
                  href={selectedEventModal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-2xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md shadow-blue-900/20"
                >
                  <span>Portal</span>
                  <ExternalLink size={12} />
                </a>
              ) : (
                <button
                  onClick={() => {
                    const l = selectedEventModal.link || "/activities";
                    setSelectedEventModal(null);
                    navigate(l);
                  }}
                  className="flex-1 py-2.5 rounded-2xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-md shadow-blue-900/20"
                >
                  <span>Open Details</span>
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>

  {/* ── STICKY BOTTOM NAVIGATION DOCK (WHITE THEME) ─────────────────── */}
  <MobileBottomNav activeTab={activeTab} onChangeTab={handleTabChange} />

</div>
  );
};
export default MobileAppPage;
