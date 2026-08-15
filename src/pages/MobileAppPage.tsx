import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import html2canvas from "html2canvas";
import {
  Home,
  Users,
  IdCard,
  Cpu,
  LayoutGrid,
  Search,
  Sparkles,
  Shield,
  ShieldCheck,
  Award,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Phone,
  UserPlus,
  Compass,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Download,
  Share2,
  Copy,
  Check,
  RotateCw,
  QrCode,
  SlidersHorizontal,
  Table as TableIcon,
  Grid,
  CheckCircle2,
  Mail,
  Building2,
  Star,
  Zap,
  Info,
  Layers,
  ArrowLeft,
  X,
  Bell,
  Heart,
  Globe,
  GraduationCap,
  LogOut,
  Lock,
  User,
  Crown,
  Trophy,
  Code2,
  Wallet,
  PenTool,
  Palette,
  FileText,
  FileEdit,
  Linkedin,
  Clock
} from "lucide-react";

import MobileBottomNav, { MobileTabType } from "@/components/MobileBottomNav";
import DownloadAppModal from "@/components/DownloadAppModal";
import ieeeLogo from "@/assets/ieee-logo.png";
import ieeeStamp from "@/assets/ieees.png";
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

// ── Types ─────────────────────────────────────────────────────────────
export interface StudentMember {
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
  membership_status: "ACTIVE" | "EXPIRED" | "PENDING";
  target_societies: string[];
  skills: string[];
  bio_sop?: string;
  avatar_url?: string;
  events_count?: number;
  awards_count?: number;
  events_attended?: { title: string; date: string; category: string }[];
}

export type ViewMode = "table" | "cards";

export interface OfficerItem {
  id: string;
  name: string;
  role: string;
  department: string;
  category: "leadership" | "core" | "tech_design" | "exec";
  tagline: string;
  color: string;
  bg: string;
  icon: React.ElementType;
  email?: string;
  linkedin?: string;
  image_url?: string;
}

// ── Complete 2026-2027 Office Bearers & Executive Team Dataset ───────────
const REAL_OFFICE_BEARERS: OfficerItem[] = [
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

// Verified Seed Student Members
const SEED_MEMBERS: StudentMember[] = [
  {
    id: "stu-001",
    ieee_id: "98421045",
    roll_number: "22EE104",
    first_name: "S",
    last_name: "Darshan",
    email: "darshan.220104@srec.ac.in",
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
    avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    events_count: 14,
    awards_count: 3
  },
  {
    id: "stu-002",
    ieee_id: "98319240",
    roll_number: "23CS218",
    first_name: "R",
    last_name: "Vishnu Kaarthik",
    email: "vishnukaarthik.230105@srec.ac.in",
    phone: "+91 98402 33419",
    department: "Electrical & Electronics Engineering",
    year_of_study: "III Year (2023-2027)",
    member_type: "Secretary",
    join_date: "September 2023",
    valid_thru: "DEC 2026",
    membership_status: "ACTIVE",
    target_societies: [
      "IEEE Computer Society (CS)",
      "IEEE Computational Intelligence Society (CIS)"
    ],
    skills: ["Machine Learning", "Full-Stack Development", "Cloud Architecture", "Python", "Data Structures"],
    bio_sop: "Passionate researcher focusing on applied artificial intelligence, open-source algorithms, and scalable web apps.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    events_count: 9,
    awards_count: 2
  },
  {
    id: "stu-003",
    ieee_id: "98553108",
    roll_number: "24EE112",
    first_name: "K S",
    last_name: "Surya Narayanan",
    email: "suryanarayanan.240112@srec.ac.in",
    phone: "+91 91234 56780",
    department: "Electrical & Electronics Engineering",
    year_of_study: "II Year (2024-2028)",
    member_type: "Web Designer & Digital Lead",
    join_date: "August 2024",
    valid_thru: "DEC 2026",
    membership_status: "ACTIVE",
    target_societies: [
      "IEEE Student Branch SREC",
      "IEEE Computer Society (CS)"
    ],
    skills: ["Web Development", "React.js", "TypeScript", "UI/UX Design", "Capacitor Mobile Apps"],
    bio_sop: "Architecting modern digital experiences and high-performance apps for IEEE Student Branch SREC.",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    events_count: 12,
    awards_count: 4
  }
];

// Societies Data with Exact Real IEEE Student Membership Pricing
const SOCIETIES_DATA = [
  { id: "srec", code: "IEEE SB SREC", name: "IEEE Student Branch SREC", logo: srecLogo, category: "Parent Branch", advisor: "Dr. K. Balamurugan", chair: "S Darshan", members: "180+", feeUSD: "$7.00 USD (≈ ₹580)", badge: "Core Chapter", href: "/societies/srec", description: "Primary membership giving full access to all SB flagship events, workshops, and IEEE global portal." },
  { id: "cs", code: "CS", name: "IEEE Computer Society", logo: csLogo, category: "Computing & Software", advisor: "Dr. S. Hariharan", chair: "R Vishnu Kaarthik", members: "95+", feeUSD: "$8.00 USD (≈ ₹664)", badge: "Most Popular", href: "/societies/cs", description: "Premier technical community for computing, software systems, algorithms, cybersecurity, and AI." },
  { id: "cis", code: "CIS", name: "Computational Intelligence Society", logo: cisLogo, category: "AI & Deep Learning", advisor: "Dr. R. Kingsy Grace", chair: "D Akshaya Dharun", members: "60+", feeUSD: "$4.00 USD (≈ ₹332)", badge: "AI Frontier", href: "/societies/cis", description: "Focusing on neural networks, evolutionary computing, fuzzy logic, deep learning, and intelligent agents." },
  { id: "comsoc", code: "ComSoc", name: "Communication Society", logo: comsocLogo, category: "5G & Telecommunications", advisor: "Dr. M. Kathirvelu", chair: "S Deepak", members: "50+", feeUSD: "$1.00 USD (≈ ₹83)", badge: "Next-Gen Comms", href: "/societies/comsoc", description: "Connecting engineers in telecommunications, optical networking, 5G/6G, and RF wireless protocols." },
  { id: "embs", code: "EMBS", name: "Engineering in Medicine & Biology", logo: embsLogo, category: "Biotech & Healthcare", advisor: "Dr. J. S. Prasath", chair: "V Smrthikha", members: "45+", feeUSD: "$1.00 USD (≈ ₹83)", badge: "HealthTech", href: "/societies/embs", description: "Bridging engineering with medical sciences, healthcare instrumentation, bioinformatics, and biosensors." },
  { id: "pels", code: "PELS", name: "Power Electronics Society", logo: pelsLogo, category: "EV & Green Energy", advisor: "Dr. C. Kathirvel", chair: "S Darshan", members: "55+", feeUSD: "$5.00 USD (≈ ₹415)", badge: "Clean Tech", href: "/societies/pels", description: "Dedicated to power conversion, renewable energy grids, motor drives, EV systems, and power chips." },
  { id: "im", code: "IM", name: "Instrumentation & Measurement", logo: imLogo, category: "Sensors & Precision", advisor: "Dr. S. Mythili", chair: "Nithin Annamalai R", members: "40+", feeUSD: "$5.00 USD (≈ ₹415)", badge: "Smart Sensors", href: "/societies/im", description: "Advancing precision sensors, automated testing, smart instrumentation, calibration, and metrology." },
  { id: "wie", code: "WIE", name: "Women in Engineering Affinity Group", logo: wieLogo, category: "Diversity & STEM", advisor: "Dr. N. Saranya", chair: "D Jennifer Shobha", members: "110+", feeUSD: "$0.00 (FREE for Students)", badge: "Empowerment", href: "/societies/wie", description: "Global network inspiring, encouraging, and empowering women scientists and engineers in STEM." }
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

// Rich Events & Activities Directory for Mobile App
export interface IEEEEventItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Conference" | "Symposium" | "Hackathon" | "Workshop" | "Celebration" | "Outreach";
  date: string;
  time: string;
  venue: string;
  society: string;
  badge: string;
  status: "Upcoming" | "Active" | "Completed";
  color: string;
  image: string;
  link: string;
  description: string;
}

const EVENTS_DATA: IEEEEventItem[] = [
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

// ── Card Theme Customizer ─────────────────────────────────────────────
type CardTheme = "classic" | "cyber" | "gold" | "titanium";
const CARD_THEMES: { id: CardTheme; name: string; gradient: string; border: string; text: string }[] = [
  { id: "classic", name: "IEEE Navy", gradient: "from-[#002244] via-[#004b87] to-[#00629b]", border: "border-sky-300/40", text: "text-sky-200" },
  { id: "cyber", name: "Cyan Glow", gradient: "from-[#021329] via-[#002f5e] to-[#004e8a]", border: "border-cyan-400/60", text: "text-cyan-200" },
  { id: "gold", name: "Gold Foil", gradient: "from-[#241a05] via-[#42320d] to-[#594311]", border: "border-amber-400/60", text: "text-amber-200" },
  { id: "titanium", name: "Dark Titanium", gradient: "from-[#0f172a] via-[#1e293b] to-[#334155]", border: "border-slate-400/40", text: "text-slate-200" }
];

export const MobileAppPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<StudentMember | null>(null);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const [loginInput, setLoginInput] = useState("");
  const [authPin, setAuthPin] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tab State
  const initialTab = (searchParams.get("tab") as MobileTabType) || "home";
  const [activeTab, setActiveTab] = useState<MobileTabType>(initialTab);

  // Sub-page category in "All Pages" menu
  const [allPagesCategory, setAllPagesCategory] = useState<
    "menu" | "office-bearers" | "past-bearers" | "awards" | "plans" | "funding" | "contact"
  >("menu");

  // Office Bearers Category Filter: all | leadership | core | tech_design | exec
  const [officerCategory, setOfficerCategory] = useState<string>("all");

  // Events Category Filter: all | Upcoming | Symposium | Hackathon | Workshop | Celebration | Outreach
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>("All");

  // View Mode toggle: "table" vs "cards"
  const [viewMode, setViewMode] = useState<ViewMode>("cards");

  // Members list & Selected member
  const [members, setMembers] = useState<StudentMember[]>(SEED_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<StudentMember>(SEED_MEMBERS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  // Digital ID Card states (Single Official IEEE Navy Style)
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [detailModalMember, setDetailModalMember] = useState<StudentMember | null>(null);

  // Membership Renewal State
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewalYear, setRenewalYear] = useState<"2027" | "2028">("2027");
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

  const idCardRef = useRef<HTMLDivElement>(null);

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
      } catch (err) {
        localStorage.removeItem("srec_ieee_app_user");
      }
    }

    // Fetch live member directory from Supabase
    const fetchDbMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("student_members")
          .select("*")
          .order("created_at", { ascending: false });

        if (data && data.length > 0) {
          setMembers(data as StudentMember[]);
          // If no user selected yet, select the first from DB
          if (!saved) {
            setSelectedMember(data[0] as StudentMember);
          }
        }
      } catch (err) {
        console.warn("Supabase fetch student_members note:", err);
      }
    };

    fetchDbMembers();
  }, []);

  const handleRegisterMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.firstName || !regForm.rollNumber || !regForm.email || !regForm.ieeeId) {
      alert("Please fill in all mandatory fields (IEEE Membership ID, Name, Roll Number, Email).");
      return;
    }

    setIsRegSubmitting(true);
    const assignedIeeeId = regForm.ieeeId.trim();
    const newMemberRecord: StudentMember = {
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
    } catch (dbErr) {
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

  // Sync tab with URL
  const handleTabChange = (tab: MobileTabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filtered members for Directory Table
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        m.first_name.toLowerCase().includes(q) ||
        m.last_name.toLowerCase().includes(q) ||
        m.roll_number.toLowerCase().includes(q) ||
        m.ieee_id.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q) ||
        m.target_societies.some((s) => s.toLowerCase().includes(q));

      const matchesDept = deptFilter === "All" || m.department.includes(deptFilter);
      return matchesSearch && matchesDept;
    });
  }, [members, searchQuery, deptFilter]);

  // Societies view scope toggle: "registered" vs "all"
  const [societyScope, setSocietyScope] = useState<"registered" | "all">("registered");

  // Filtered Office Bearers
  const filteredOfficers = useMemo(() => {
    if (officerCategory === "all") return REAL_OFFICE_BEARERS;
    return REAL_OFFICE_BEARERS.filter((o) => o.category === officerCategory);
  }, [officerCategory]);

  // Student's registered societies filter
  const studentRegisteredSocieties = useMemo(() => {
    if (!currentUser || !currentUser.target_societies || currentUser.target_societies.length === 0) {
      return SOCIETIES_DATA;
    }
    const enrolled = SOCIETIES_DATA.filter((soc) =>
      currentUser.target_societies.some((ts) => {
        const t = ts.toLowerCase();
        const code = soc.code.toLowerCase();
        const name = soc.name.toLowerCase();
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
      })
    );
    return enrolled.length > 0 ? enrolled : SOCIETIES_DATA;
  }, [currentUser]);

  const displayedSocieties =
    societyScope === "registered" && currentUser ? studentRegisteredSocieties : SOCIETIES_DATA;

  // Handle Login Authentication with Real-Time Database Query
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = loginInput.trim().toLowerCase();
    if (!query) {
      setLoginError("Please enter your IEEE ID, Roll Number, or Email.");
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    // 1. Check local seed list
    const foundLocal = members.find(
      (m) =>
        m.ieee_id.toLowerCase() === query ||
        m.roll_number.toLowerCase() === query ||
        m.email.toLowerCase() === query
    );

    if (foundLocal) {
      setCurrentUser(foundLocal);
      setSelectedMember(foundLocal);
      localStorage.setItem("srec_ieee_app_user", JSON.stringify(foundLocal));
      localStorage.setItem("ieee_student_session", JSON.stringify(foundLocal));
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
        const dbUser = data[0] as StudentMember;
        setCurrentUser(dbUser);
        setSelectedMember(dbUser);
        localStorage.setItem("srec_ieee_app_user", JSON.stringify(dbUser));
        localStorage.setItem("ieee_student_session", JSON.stringify(dbUser));
        setMembers((prev) => [dbUser, ...prev]);
        setIsLoggingIn(false);
        return;
      }
    } catch (dbErr) {
      console.warn("Database lookup note:", dbErr);
    }

    // 3. Fallback verified student member
    const genericUser: StudentMember = {
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
    setIsLoggingIn(false);
  };

  const handleQuickDemoLogin = (demoMember: StudentMember) => {
    setCurrentUser(demoMember);
    setSelectedMember(demoMember);
    localStorage.setItem("srec_ieee_app_user", JSON.stringify(demoMember));
    localStorage.setItem("ieee_student_session", JSON.stringify(demoMember));
  };

  const handleLogout = () => {
    localStorage.removeItem("srec_ieee_app_user");
    localStorage.removeItem("ieee_student_session");
    setCurrentUser(null);
    setIsGuestMode(false);
    setIsFlipped(false);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
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

    setMembers((prev) =>
      prev.map((m) => (m.id === selectedMember.id ? { ...m, valid_thru: updatedValidThru } : m))
    );

    setIsRenewModalOpen(false);
    setRenewalSuccessToast(true);
    setTimeout(() => setRenewalSuccessToast(false), 4000);
  };

  const handleExportCard = async () => {
    if (!idCardRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(idCardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `IEEE_SREC_ID_${selectedMember.roll_number || selectedMember.ieee_id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export error", err);
    } finally {
      setIsExporting(false);
    }
  };

  // ════════════════════════════════════════════════════════════════════════
  // 1. DEDICATED IN-APP LOGIN SCREEN (WHITE THEME)
  // ════════════════════════════════════════════════════════════════════════
  if (!currentUser && !isGuestMode) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-3 sm:p-6 font-sans">
        
        {/* Top App Header for Login Screen with Glassmorphism */}
        <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2 pb-1">
          <Link
            to="/web"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 backdrop-blur-xl hover:bg-white border border-slate-200 text-[#002855] text-xs font-black uppercase tracking-wider shadow-sm active:scale-95 transition-all"
          >
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
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto my-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xl shadow-slate-200/50 space-y-4"
        >
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
                <input
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  placeholder="e.g. 98421045 or 22EE104"
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#002855] focus:bg-white transition-all shadow-inner"
                  required
                />
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
                <input
                  type="password"
                  value={authPin}
                  onChange={(e) => setAuthPin(e.target.value)}
                  placeholder="••••"
                  className="w-full pl-10 pr-3 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-[#002855] focus:bg-white transition-all shadow-inner"
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
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#002855] to-[#00629B] hover:from-[#001c3d] hover:to-[#004e8a] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RotateCw size={15} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Mobile App</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* 📝 NEW MEMBERSHIP REGISTRATION CALLOUT */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 text-center space-y-1.5">
            <p className="text-xs font-black text-[#002855]">New to IEEE SB SREC?</p>
            <p className="text-[10px] text-slate-500">Register your membership details &amp; store directly to database</p>
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[11px] uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <UserPlus size={14} />
              <span>Register My Membership</span>
            </button>
          </div>

          {/* Quick Demo 1-Tap Login Profiles */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block text-center">
              Quick 1-Tap Demo Login
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {SEED_MEMBERS.map((demo) => (
                <button
                  key={demo.id}
                  onClick={() => handleQuickDemoLogin(demo)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-300 text-left transition-all active:scale-95 group"
                >
                  <p className="text-[10px] font-extrabold text-slate-900 truncate group-hover:text-[#002855]">
                    {demo.first_name} {demo.last_name}
                  </p>
                  <p className="text-[8px] text-slate-500 font-mono">{demo.roll_number}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Guest Mode Action & Complete Website Link */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <button
              onClick={() => setIsGuestMode(true)}
              className="text-[#002855] hover:underline font-bold text-xs"
            >
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
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // 2. MAIN LOGGED-IN MOBILE APP (WHITE THEME & GLASSMORPHISM)
  // ════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24 font-sans selection:bg-[#002855] selection:text-white">
      
      {/* ── TOP GLASSMORPHIC APP BAR (CLEAN & NON-SQUISHED) ──────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-white/60 shadow-[0_4px_25px_rgba(0,40,85,0.06)] px-3 py-2 sm:px-4 pt-[max(0.5rem,env(safe-area-inset-top))] transition-all">
        <div className="max-w-md mx-auto flex items-center justify-between gap-2">
          
          {/* Brand & Logos (Clean, proportional, non-squished) */}
          <button
            onClick={() => handleTabChange("home")}
            className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity text-left"
          >
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/90 border border-slate-200/90 shadow-sm">
              <img src={srecLogo} alt="SREC" className="h-6 w-auto object-contain" />
              <div className="w-[1px] h-4 bg-slate-300" />
              <img src={ieeeLogo} alt="IEEE" className="h-6 w-auto object-contain" />
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-50/90 border border-blue-200/80 text-[#002855] text-[10px] font-black uppercase tracking-wider hidden xs:inline">
              SB 64581
            </span>
          </button>

          {/* Action Bar (Web, View Mode Toggle, Search, Avatar / Logout) */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Complete Website Button */}
            <Link
              to="/web"
              className="h-8 px-2.5 rounded-xl bg-blue-50/90 hover:bg-blue-100 border border-blue-200/90 text-[#002855] active:scale-95 transition-all flex items-center gap-1 text-[10px] font-black uppercase tracking-wider shadow-sm"
              title="Open Complete Website"
            >
              <Globe size={13} className="text-[#002855]" />
              <span>Web</span>
            </Link>

            {/* View Mode Toggle (Table / Cards) */}
            <button
              onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all text-xs active:scale-95 ${
                viewMode === "table"
                  ? "bg-[#002855] text-white border-[#002855] shadow-sm font-bold"
                  : "bg-white/80 border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
              title={`Switch to ${viewMode === "table" ? "Card View" : "Table View"}`}
            >
              {viewMode === "table" ? <TableIcon size={14} /> : <Grid size={14} />}
            </button>

            {/* Quick Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-8 h-8 rounded-xl bg-white/80 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center active:scale-95 transition-all"
              aria-label="Search App"
              title="Search"
            >
              <Search size={14} />
            </button>

            {/* User Profile / Logout Button */}
            {currentUser ? (
              <div className="flex items-center gap-1 pl-0.5">
                <button
                  onClick={() => {
                    setSelectedMember(currentUser);
                    handleTabChange("id");
                  }}
                  className="relative group p-0.5 rounded-xl border border-slate-200 bg-white hover:border-[#002855] transition-all"
                  title={`${currentUser.first_name} ${currentUser.last_name} (${currentUser.roll_number})`}
                >
                  <img
                    src={currentUser.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"}
                    alt={currentUser.first_name}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </button>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 flex items-center justify-center active:scale-95 transition-all"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsGuestMode(false)}
                className="h-8 px-2.5 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[10px] uppercase tracking-wider shadow-sm flex items-center gap-1 active:scale-95 transition-all"
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
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm p-3 rounded-2xl bg-emerald-600 text-white shadow-xl flex items-center gap-2.5"
          >
            <CheckCircle2 size={18} className="shrink-0 text-emerald-200" />
            <div className="text-xs">
              <p className="font-extrabold">Membership Renewed Successfully!</p>
              <p className="text-[10px] text-emerald-100">Valid through {selectedMember.valid_thru}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ACCORDING TO ACTIVE TAB ───────────────────────── */}
      <main className="max-w-md mx-auto px-3 pt-3">
        
        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: HOME DASHBOARD (WHITE THEME)
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3.5"
          >
            {/* Top Stories / Highlights Carousel */}
            <div className="overflow-x-auto no-scrollbar flex items-center gap-3 py-1 -mx-3 px-3">
              {[
                { title: "Office Bearers", tag: "2026-27", color: "from-amber-400 to-orange-500", action: () => { handleTabChange("menu"); setAllPagesCategory("office-bearers"); } },
                { title: "Events", tag: "Flagship", color: "from-indigo-600 to-blue-500", action: () => handleTabChange("events") },
                { title: "Digital ID", tag: "3D Card", color: "from-blue-600 to-cyan-500", action: () => handleTabChange("id") },
                { title: "My Societies", tag: "Enrolled", color: "from-emerald-500 to-teal-600", action: () => handleTabChange("societies") },
                { title: "Full Website", tag: "Desktop", color: "from-blue-600 to-indigo-600", link: "/" },
                { title: "AECTSD '27", tag: "Flagship", color: "from-rose-500 to-red-600", link: "http://aectsd2027.srecieee.org/" }
              ].map((story, i) => (
                <div
                  key={i}
                  onClick={() => {
                    if (story.action) story.action();
                    else if (story.link) {
                      if (story.link.startsWith("http")) window.open(story.link, "_blank");
                      else navigate(story.link);
                    }
                  }}
                  className="flex flex-col items-center shrink-0 cursor-pointer active:scale-95 transition-transform"
                >
                  <div className={`w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr ${story.color} shadow-sm`}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-1 text-center">
                      <Sparkles size={16} className="text-[#002855]" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-1 truncate max-w-[64px]">
                    {story.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Hero Welcome Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#001c3d] text-white p-4 sm:p-5 shadow-lg shadow-blue-950/15">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[9px] font-black uppercase tracking-wider backdrop-blur-md">
                    <ShieldCheck size={10} /> Active Session
                  </span>
                  <h1 className="text-lg font-black text-white mt-1.5 leading-tight">
                    {currentUser ? `Welcome, ${currentUser.first_name}` : "IEEE Student Branch SREC"}
                  </h1>
                  <p className="text-xs text-blue-100 mt-0.5 font-medium">
                    {currentUser ? `${currentUser.department} · ${currentUser.roll_number}` : "Code 64581 · Advancing Technology for Humanity"}
                  </p>
                </div>
                <img src={ieeeStamp} alt="Seal" className="h-10 w-10 object-contain opacity-90 brightness-200" />
              </div>

              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => {
                    handleTabChange("menu");
                    setAllPagesCategory("office-bearers");
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-left active:scale-95 transition-all backdrop-blur-md"
                >
                  <div className="p-2 rounded-xl bg-amber-400 text-slate-950 shadow-sm">
                    <Crown size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Office Bearers</p>
                    <p className="text-[9px] text-amber-200">2026-27 Team</p>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange("id")}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-white text-slate-900 text-left active:scale-95 transition-all shadow-md"
                >
                  <div className="p-2 rounded-xl bg-[#002855] text-white">
                    <IdCard size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">My Digital ID</p>
                    <p className="text-[9px] text-[#002855] font-semibold">3D Card &amp; Dossier</p>
                  </div>
                </button>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/15 text-center">
                <div className="p-1 rounded-xl bg-white/10">
                  <p className="text-sm font-black text-white">180+</p>
                  <p className="text-[8px] text-blue-200 font-bold uppercase">Members</p>
                </div>
                <div className="p-1 rounded-xl bg-white/10">
                  <p className="text-sm font-black text-white">8</p>
                  <p className="text-[8px] text-blue-200 font-bold uppercase">Societies</p>
                </div>
                <div className="p-1 rounded-xl bg-white/10">
                  <p className="text-sm font-black text-white">21</p>
                  <p className="text-[8px] text-blue-200 font-bold uppercase">Officers</p>
                </div>
                <div className="p-1 rounded-xl bg-white/10">
                  <p className="text-sm font-black text-white">12+</p>
                  <p className="text-[8px] text-blue-200 font-bold uppercase">Awards</p>
                </div>
              </div>
            </div>

            {/* 🌐 PROMINENT COMPLETE WEBSITE BUTTON CARD */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/90 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#002855] text-white flex items-center justify-center shadow-md shrink-0">
                  <Globe size={20} />
                </div>
                <div className="leading-tight">
                  <h3 className="font-extrabold text-slate-900 text-xs">View Complete Website</h3>
                  <p className="text-[10px] text-slate-500">Full desktop portal, archives &amp; gallery</p>
                </div>
              </div>
              <Link
                to="/web"
                className="px-3 py-2 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[10px] uppercase flex items-center gap-1.5 shadow-md shadow-blue-900/10 active:scale-95 transition-all whitespace-nowrap"
              >
                <span>Full Web</span>
                <ExternalLink size={12} />
              </Link>
            </div>

            {/* Quick Access Menu Cards (White Theme) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <LayoutGrid size={14} className="text-[#002855]" />
                  Explore Pages &amp; Tables
                </h2>
                <button
                  onClick={() => handleTabChange("menu")}
                  className="text-[10px] text-[#002855] font-bold hover:underline flex items-center"
                >
                  All 16 Pages <ChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Office Bearers", icon: Crown, tabKey: "office-bearers", color: "bg-amber-50 text-amber-900 border-amber-200" },
                  { label: "Societies Hub", icon: Cpu, tabType: "societies", color: "bg-blue-50 text-blue-900 border-blue-200" },
                  { label: "Activities", icon: Calendar, tabKey: "plans", color: "bg-sky-50 text-sky-900 border-sky-200" },
                  { label: "Awards & Honors", icon: Award, tabKey: "awards", color: "bg-purple-50 text-purple-900 border-purple-200" },
                  { label: "Funding Plan", icon: DollarSign, tabKey: "funding", color: "bg-emerald-50 text-emerald-900 border-emerald-200" },
                  { label: "Annual Plans", icon: SlidersHorizontal, tabKey: "plans", color: "bg-rose-50 text-rose-900 border-rose-200" },
                  { label: "Past Bearers", icon: GraduationCap, tabKey: "past-bearers", color: "bg-slate-100 text-slate-900 border-slate-200" },
                  { label: "Gallery", icon: ImageIcon, route: "/gallery", color: "bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200" },
                  { label: "Register / Join", icon: UserPlus, route: "/membership-registration", color: "bg-[#002855] text-white border-[#002855]" }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (item.tabType) {
                          handleTabChange(item.tabType as MobileTabType);
                        } else if (item.tabKey) {
                          handleTabChange("menu");
                          setAllPagesCategory(item.tabKey as any);
                        } else if (item.route) {
                          navigate(item.route);
                        }
                      }}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl ${item.color} border text-center active:scale-95 transition-all shadow-sm`}
                    >
                      <Icon size={18} className="mb-1" />
                      <span className="text-[10px] font-black uppercase tracking-tight leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Flagship Event Card */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={10} className="text-amber-600" /> Flagship 2027
                </span>
                <span className="text-[10px] font-bold text-slate-500">Feb 18-20, 2027</span>
              </div>
              <h3 className="text-sm font-black text-slate-900">
                AECTSD 2027: International Conference
              </h3>
              <p className="text-[11px] text-slate-600 leading-snug">
                Advances in Electrical, Communication &amp; Thermal Systems for Sustainable Development.
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-500 font-medium">Venue: SREC Auditorium</span>
                <a
                  href="http://aectsd2027.srecieee.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-[#002855] text-white font-bold text-[10px] uppercase shadow-sm"
                >
                  <span>Portal</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: EVENTS & ACTIVITIES (WHITE THEME)
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "events" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Header & Filter Controls */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={16} className="text-[#002855]" />
                    Events &amp; Activities Hub
                  </h2>
                  <p className="text-[10px] text-slate-500">
                    Flagship conferences, symposiums, hackathons &amp; workshops
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#002855] text-[10px] font-bold">
                  {EVENTS_DATA.length} Events
                </span>
              </div>

              {/* Category Pills Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {["All", "Conference", "Symposium", "Hackathon", "Workshop", "Celebration", "Outreach"].map((cat) => (
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
              {EVENTS_DATA.filter((e) =>
                eventCategoryFilter === "All" ? true : e.category === eventCategoryFilter
              ).map((event) => (
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
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-slate-900 text-[9px] font-black uppercase tracking-wider shadow-sm">
                        {event.badge}
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
                        {event.society}
                      </span>
                      <h3 className="text-sm sm:text-base font-black text-white leading-tight drop-shadow truncate">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Event Details Content */}
                  <div className="p-3.5 space-y-2.5">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Schedule & Venue Meta */}
                    <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-[10px]">
                      <div>
                        <span className="text-slate-400 font-bold uppercase block text-[8.5px]">Date &amp; Time</span>
                        <span className="font-bold text-slate-900 leading-tight block">{event.date}</span>
                        <span className="text-slate-500 text-[9px]">{event.time}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold uppercase block text-[8.5px]">Location</span>
                        <span className="font-semibold text-slate-800 leading-tight line-clamp-2">{event.venue}</span>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-bold text-[#002855] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {event.category}
                      </span>

                      {event.link.startsWith("http") ? (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all"
                        >
                          <span>Conference Portal</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <button
                          onClick={() => navigate(event.link)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[10px] uppercase shadow-sm active:scale-95 transition-all"
                        >
                          <span>Explore Details</span>
                          <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: DIGITAL ID CARD & STRUCTURED USER DETAILS (SINGLE OFFICIAL STYLE)
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "id" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3.5"
          >
            {/* Actions Toolbar: Flip, Save ID & RENEW MEMBERSHIP */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[#002855] font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#002855]" />
                  Official IEEE ID
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Renew Button */}
                <button
                  onClick={() => setIsRenewModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase flex items-center gap-1.5 active:scale-95 shadow-md shadow-amber-500/20 transition-all"
                  title="Renew IEEE Membership"
                >
                  <Sparkles size={13} className="text-slate-950" />
                  <span>Renew</span>
                </button>

                {/* Flip Button */}
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
                >
                  <RotateCw size={13} className={isFlipped ? "rotate-180 transition-transform" : ""} />
                  <span className="hidden xs:inline">Flip</span>
                </button>

                {/* Save ID Button */}
                <button
                  onClick={handleExportCard}
                  disabled={isExporting}
                  className="px-3 py-1.5 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-xs uppercase flex items-center gap-1 active:scale-95 shadow-sm transition-all"
                >
                  <Download size={13} />
                  <span>{isExporting ? "Saving..." : "Save ID"}</span>
                </button>
              </div>
            </div>

            {/* 3D Flippable Digital ID Card Container (Luxury Holographic PVC Smart Card) */}
            <div
              className="relative w-full aspect-[1.586] select-none cursor-pointer group"
              style={{ perspective: 1400 }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                ref={idCardRef}
                className="w-full h-full relative transition-transform duration-700 [transform-style:preserve-3d]"
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
              >
                {/* ═══════════════════════════════════════════════════════════════
                    CARD FRONT: ULTRA-LUXURY HOLOGRAPHIC SMART PVC ID
                ═══════════════════════════════════════════════════════════════ */}
                <div
                  className="absolute inset-0 rounded-[28px] p-4 sm:p-5 bg-gradient-to-br from-[#000a17] via-[#001c3d] to-[#003870] border-[1.5px] border-amber-300/60 shadow-[0_25px_60px_rgba(0,10,25,0.7),0_0_35px_rgba(0,114,206,0.25)] flex flex-col justify-between overflow-hidden text-white relative select-none"
                  style={{ backfaceVisibility: "hidden" }}
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
                    className="absolute -right-6 -bottom-6 w-48 h-48 opacity-[0.08] object-contain pointer-events-none brightness-200"
                  />

                  {/* Laser Holographic Security Ribbon */}
                  <div className="absolute top-0 right-14 w-8 h-full bg-gradient-to-b from-amber-300/10 via-cyan-300/15 to-transparent pointer-events-none opacity-40 blur-[1px]" />

                  {/* ── TOP HEADER BAR: SREC Emblem + IEEE Diamond + Status ── */}
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="px-2.5 py-1 rounded-xl bg-white/95 border border-white/80 shadow-md flex items-center gap-2 backdrop-blur-sm">
                        <img src={srecLogo} alt="SREC" className="h-5 sm:h-6 w-auto object-contain" />
                        <div className="w-[1px] h-3.5 bg-slate-300" />
                        <img src={ieeeLogo} alt="IEEE" className="h-4 sm:h-5 w-auto object-contain" />
                      </div>

                      {/* Contactless Wave Icon in Gold */}
                      <span className="text-amber-300/80 text-[11px] font-mono tracking-tighter" title="NFC Contactless Enabled">
                        (((•)))
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 font-black text-[9px] uppercase tracking-wider shadow-sm backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ACTIVE
                      </span>
                      <span className="text-[8px] font-mono text-amber-200/90 font-bold">
                        {selectedMember.valid_thru}
                      </span>
                    </div>
                  </div>

                  {/* ── MIDDLE ROW: Portrait + Smart Chip + Member Details ── */}
                  <div className="flex items-center gap-3.5 relative z-10 my-auto py-1">
                    {/* Portrait Photo Frame */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl p-[2px] bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 shadow-[0_0_15px_rgba(251,191,36,0.35)]">
                        <img
                          src={
                            selectedMember.avatar_url ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              selectedMember.first_name + " " + selectedMember.last_name
                            )}&background=002855&color=fff&size=512`
                          }
                          alt={selectedMember.first_name}
                          className="w-full h-full rounded-[14px] object-cover bg-slate-900"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#000a17] flex items-center justify-center text-white shadow">
                        <Check size={9} className="stroke-[3]" />
                      </div>
                    </div>

                    {/* Member Credentials Info */}
                    <div className="leading-tight min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-black text-white tracking-wide uppercase truncate drop-shadow-sm">
                          {selectedMember.first_name} {selectedMember.last_name}
                        </h2>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-300/40 text-amber-300 font-mono text-[10px] font-black tracking-wider">
                          ROLL: {selectedMember.roll_number}
                        </span>
                      </div>

                      <p className="text-[10.5px] text-slate-200 font-semibold mt-1 truncate max-w-[210px]">
                        {selectedMember.department}
                      </p>

                      <p className="text-[9px] text-sky-300 uppercase tracking-widest font-black mt-0.5">
                        {selectedMember.member_type} · {selectedMember.year_of_study}
                      </p>
                    </div>

                    {/* Gold 3D EMV Smart Chip */}
                    <div className="hidden xs:flex flex-col items-center justify-center w-10 h-8 rounded-lg bg-gradient-to-br from-amber-100 via-amber-300 to-amber-500 p-0.5 border border-amber-200/80 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.4)] shrink-0">
                      <div className="w-full h-full border border-amber-900/30 rounded flex flex-col justify-between p-0.5 relative">
                        <div className="w-full h-[1px] bg-amber-900/30" />
                        <div className="w-2 h-2 rounded-full border border-amber-900/40 mx-auto" />
                        <div className="w-full h-[1px] bg-amber-900/30" />
                      </div>
                    </div>
                  </div>

                  {/* ── BOTTOM ROW: Embossed Member ID & Security QR ── */}
                  <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/15">
                    <div>
                      <span className="text-[7.5px] uppercase tracking-[0.2em] text-amber-300/90 font-black block leading-none">
                        OFFICIAL IEEE MEMBERSHIP ID
                      </span>
                      <span className="text-sm sm:text-base font-black font-mono tracking-widest text-white drop-shadow-md">
                        {selectedMember.ieee_id}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right leading-none">
                        <span className="text-[8px] font-mono text-sky-200 block font-bold">STB32131</span>
                        <span className="text-[7px] text-slate-300 font-mono">SB 64581</span>
                      </div>
                      <div className="p-1 rounded-xl bg-white text-slate-950 shadow-md">
                        <QrCode size={22} className="text-slate-950" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════════════════
                    CARD BACK: OFFICIAL PASS AUTHORIZATION & SOCIETIES
                ═══════════════════════════════════════════════════════════════ */}
                <div
                  className="absolute inset-0 rounded-[28px] p-4 sm:p-5 bg-gradient-to-br from-[#000a17] via-[#001c3d] to-[#003870] border-[1.5px] border-amber-300/60 shadow-[0_25px_60px_rgba(0,10,25,0.7)] flex flex-col justify-between overflow-hidden text-white select-none"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  {/* Top Magnetic Security Stripe */}
                  <div className="w-[calc(100%+2.5rem)] -mx-5 -mt-2 h-7 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-amber-400/30 flex items-center justify-between px-4">
                    <span className="text-[7px] font-mono text-amber-300 tracking-widest font-black uppercase">
                      ★ IEEE MADRAS SECTION · SREC STUDENT BRANCH ★
                    </span>
                    <span className="text-[7px] font-mono text-slate-400">REGION 10 APAC</span>
                  </div>

                  {/* Middle: Signature & Enrolled Societies */}
                  <div className="space-y-1.5 text-[9.5px] text-slate-200 my-auto">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-300 font-bold">Institution:</span>
                      <span className="text-white font-medium">Sri Ramakrishna Engineering College</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-300 font-bold">College Email:</span>
                      <span className="font-mono text-sky-200 truncate max-w-[180px]">{selectedMember.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-amber-300 font-bold">Enrolled Chapters:</span>
                      <span className="text-white font-semibold truncate max-w-[180px]">
                        {selectedMember.target_societies.join(", ")}
                      </span>
                    </div>
                  </div>

                  {/* Counselor & Authorization Footer */}
                  <div className="pt-2 border-t border-white/15 flex items-center justify-between text-[8px] text-slate-300">
                    <div>
                      <span className="font-mono font-black text-amber-300 block">AUTH: {selectedMember.ieee_id}-SB64581</span>
                      <span className="text-[7px] text-slate-400">Valid for IEEE &amp; Collegiate Technical Events</span>
                    </div>
                    <div className="text-right">
                      <span className="font-serif italic text-amber-200 text-[10px] block leading-none">Dr. K. Balamurugan</span>
                      <span className="text-[7px] text-sky-200 uppercase font-bold tracking-wider">Branch Counselor</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STRUCTURED MEMBERSHIP DETAILS TABLE */}
            <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-sm">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                  <TableIcon size={14} />
                  Structured Membership Dossier
                </h3>
                <span className="text-[10px] font-mono font-bold text-[#002855]">
                  {selectedMember.roll_number}
                </span>
              </div>

              <div className="p-3">
                <table className="w-full text-xs text-left border-collapse">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[10px] w-1/3">Full Name</td>
                      <td className="py-2 px-2 font-extrabold text-slate-900">{selectedMember.first_name} {selectedMember.last_name}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[10px]">IEEE Member ID</td>
                      <td className="py-2 px-2 font-mono font-bold text-[#002855] flex items-center justify-between">
                        <span>{selectedMember.ieee_id}</span>
                        <button
                          onClick={() => handleCopy(selectedMember.ieee_id, "id")}
                          className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-0.5"
                        >
                          {copiedText === "id" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[10px]">College Roll No</td>
                      <td className="py-2 px-2 font-mono font-bold text-slate-900">{selectedMember.roll_number}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[10px]">Department</td>
                      <td className="py-2 px-2 text-slate-800">{selectedMember.department}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[10px]">Year &amp; Batch</td>
                      <td className="py-2 px-2 text-slate-800">{selectedMember.year_of_study}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[10px]">Branch Role</td>
                      <td className="py-2 px-2 font-extrabold text-[#002855]">{selectedMember.member_type}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[10px]">Status &amp; Validity</td>
                      <td className="py-2 px-2">
                        <div className="flex items-center justify-between gap-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9px] font-black border border-emerald-200">
                            ACTIVE ({selectedMember.valid_thru})
                          </span>
                          <button
                            onClick={() => setIsRenewModalOpen(true)}
                            className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-black text-[9px] uppercase transition-colors"
                          >
                            ⚡ Renew
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[10px]">Societies</td>
                      <td className="py-2 px-2">
                        <div className="flex flex-wrap gap-1">
                          {selectedMember.target_societies.map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-[9px] text-[#002855] font-semibold">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[10px]">Email</td>
                      <td className="py-2 px-2 text-[#002855] font-mono text-[11px] underline truncate">
                        <a href={`mailto:${selectedMember.email}`}>{selectedMember.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-500 font-bold uppercase text-[10px]">Phone</td>
                      <td className="py-2 px-2 text-slate-800 font-mono">{selectedMember.phone}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Switch to other verified members */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block">
                Switch Verified Member Card
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMember(m);
                      setIsFlipped(false);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${
                      selectedMember.id === m.id
                        ? "bg-[#002855] text-white border-[#002855] font-bold shadow-sm"
                        : "bg-slate-50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <img src={m.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"} alt="Photo" className="w-4 h-4 rounded-full object-cover" />
                    <span>{m.first_name} ({m.roll_number})</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: TECHNICAL SOCIETIES (WHITE THEME)
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "societies" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
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
              {currentUser && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    onClick={() => setSocietyScope("registered")}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1 ${
                      societyScope === "registered"
                        ? "bg-[#002855] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <CheckCircle2 size={12} className={societyScope === "registered" ? "text-cyan-300" : "text-slate-400"} />
                    <span>My Registered ({studentRegisteredSocieties.length})</span>
                  </button>
                  <button
                    onClick={() => setSocietyScope("all")}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-1 ${
                      societyScope === "all"
                        ? "bg-[#002855] text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <span>All 8 Chapters</span>
                  </button>
                </div>
              )}
            </div>

            {/* TABULAR SOCIETIES VIEW */}
            {viewMode === "table" ? (
              <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-sm">
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
                        const isEnrolled = currentUser?.target_societies.some(
                          (ts) =>
                            ts.toLowerCase().includes(soc.code.toLowerCase()) ||
                            ts.toLowerCase().includes(soc.name.toLowerCase()) ||
                            (soc.id === "srec" && (ts.toLowerCase().includes("srec") || ts.toLowerCase().includes("student branch"))) ||
                            (soc.id === "cs" && ts.toLowerCase().includes("computer")) ||
                            (soc.id === "cis" && (ts.toLowerCase().includes("computational") || ts.toLowerCase().includes("intelligence"))) ||
                            (soc.id === "comsoc" && (ts.toLowerCase().includes("communication") || ts.toLowerCase().includes("comsoc"))) ||
                            (soc.id === "embs" && (ts.toLowerCase().includes("medicine") || ts.toLowerCase().includes("biology") || ts.toLowerCase().includes("embs"))) ||
                            (soc.id === "pels" && (ts.toLowerCase().includes("power") || ts.toLowerCase().includes("pels"))) ||
                            (soc.id === "im" && (ts.toLowerCase().includes("instrumentation") || ts.toLowerCase().includes("measurement"))) ||
                            (soc.id === "wie" && (ts.toLowerCase().includes("women") || ts.toLowerCase().includes("wie")))
                        );

                        return (
                          <tr
                            key={soc.id}
                            onClick={() => navigate(soc.href)}
                            className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                          >
                            <td className="py-2.5 px-3">
                              <div className="flex items-center gap-2">
                                <img src={soc.logo} alt={soc.code} className="w-7 h-7 rounded-lg object-contain bg-slate-100 p-0.5 border border-slate-200" />
                                <div>
                                  <p className="font-extrabold text-slate-900 leading-tight">{soc.name}</p>
                                  <p className="text-[9px] text-[#002855] font-bold">{soc.badge}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-700">{soc.advisor}</td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-900 font-bold">{soc.chair}</td>
                            <td className="py-2.5 px-3 text-center">
                              {isEnrolled ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[9px]">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                  ENROLLED
                                </span>
                              ) : (
                                <span className="text-[9px] text-slate-400 font-medium">Available</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono font-black text-amber-700">{soc.feeUSD}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* CARD VIEW */
              <div className="space-y-2.5">
                {displayedSocieties.map((soc) => {
                  const isEnrolled = currentUser?.target_societies.some(
                    (ts) =>
                      ts.toLowerCase().includes(soc.code.toLowerCase()) ||
                      ts.toLowerCase().includes(soc.name.toLowerCase()) ||
                      (soc.id === "srec" && (ts.toLowerCase().includes("srec") || ts.toLowerCase().includes("student branch"))) ||
                      (soc.id === "cs" && ts.toLowerCase().includes("computer")) ||
                      (soc.id === "cis" && (ts.toLowerCase().includes("computational") || ts.toLowerCase().includes("intelligence"))) ||
                      (soc.id === "comsoc" && (ts.toLowerCase().includes("communication") || ts.toLowerCase().includes("comsoc"))) ||
                      (soc.id === "embs" && (ts.toLowerCase().includes("medicine") || ts.toLowerCase().includes("biology") || ts.toLowerCase().includes("embs"))) ||
                      (soc.id === "pels" && (ts.toLowerCase().includes("power") || ts.toLowerCase().includes("pels"))) ||
                      (soc.id === "im" && (ts.toLowerCase().includes("instrumentation") || ts.toLowerCase().includes("measurement"))) ||
                      (soc.id === "wie" && (ts.toLowerCase().includes("women") || ts.toLowerCase().includes("wie")))
                  );

                  return (
                    <div
                      key={soc.id}
                      onClick={() => navigate(soc.href)}
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#002855]/50 shadow-sm cursor-pointer active:scale-[0.99] transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <img src={soc.logo} alt={soc.code} className="w-10 h-10 rounded-xl object-contain bg-slate-50 p-1 border border-slate-200" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-extrabold text-slate-900 text-sm">{soc.name}</h3>
                              {isEnrolled && (
                                <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-black">
                                  ENROLLED
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-[#002855] font-bold">{soc.badge} · Advisor: {soc.advisor}</p>
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-slate-400" />
                      </div>
                      <p className="text-[11px] text-slate-600 mt-2">{soc.description}</p>
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[10px]">
                        <span className="text-slate-500">Chair: <strong className="text-slate-900">{soc.chair}</strong></span>
                        <span className="font-bold text-amber-700 font-mono">Fee: {soc.feeUSD}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 5: ALL PAGES DIRECTORY (WHITE THEME & REVAMPED OFFICE BEARERS)
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "menu" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {allPagesCategory !== "menu" ? (
              <div className="space-y-3">
                <button
                  onClick={() => setAllPagesCategory("menu")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#002855] hover:bg-slate-50 shadow-sm"
                >
                  <ArrowLeft size={13} /> Back to All Pages Menu
                </button>

                {/* ── REVAMPED OFFICE BEARERS VIEW (2026-2027) ── */}
                {allPagesCategory === "office-bearers" && (
                  <div className="space-y-3">
                    
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

                    {/* DUAL VIEW: CARDS vs TABLE */}
                    {viewMode === "cards" ? (
                      /* ── REVAMPED EXECUTIVE CARDS VIEW ── */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {filteredOfficers.map((officer) => {
                          const Icon = officer.icon;
                          return (
                            <motion.div
                              key={officer.id}
                              whileHover={{ y: -2 }}
                              className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#002855]/30 transition-all flex flex-col justify-between"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3">
                                  <div
                                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
                                    style={{ backgroundColor: officer.color }}
                                  >
                                    <Icon size={20} />
                                  </div>
                                  <div className="leading-tight">
                                    <h4 className="font-extrabold text-slate-900 text-sm">
                                      {officer.name}
                                    </h4>
                                    <p
                                      className="text-xs font-black mt-0.5"
                                      style={{ color: officer.color }}
                                    >
                                      {officer.role}
                                    </p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">
                                      {officer.department}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                <span className="text-slate-500 italic truncate max-w-[170px]">
                                  "{officer.tagline}"
                                </span>
                                {officer.email && (
                                  <a
                                    href={`mailto:${officer.email}`}
                                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#002855] font-bold flex items-center gap-1 transition-colors"
                                  >
                                    <Mail size={11} />
                                    <span>Email</span>
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      /* ── REVAMPED EXECUTIVE TABLE VIEW ── */
                      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 text-[9px] uppercase font-black text-slate-600">
                                <th className="py-2.5 px-3">Officer &amp; Role</th>
                                <th className="py-2.5 px-3">Department</th>
                                <th className="py-2.5 px-3">Tagline</th>
                                <th className="py-2.5 px-3 text-right">Contact</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filteredOfficers.map((officer) => {
                                const Icon = officer.icon;
                                return (
                                  <tr key={officer.id} className="hover:bg-blue-50/40">
                                    <td className="py-2.5 px-3">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                                          style={{ backgroundColor: officer.color }}
                                        >
                                          <Icon size={14} />
                                        </div>
                                        <div>
                                          <p className="font-extrabold text-slate-900 leading-tight">
                                            {officer.name}
                                          </p>
                                          <p
                                            className="text-[10px] font-black"
                                            style={{ color: officer.color }}
                                          >
                                            {officer.role}
                                          </p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-600 font-medium">
                                      {officer.department}
                                    </td>
                                    <td className="py-2.5 px-3 text-slate-500 text-[10px] italic">
                                      {officer.tagline}
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                      {officer.email ? (
                                        <a
                                          href={`mailto:${officer.email}`}
                                          className="text-[#002855] underline font-mono text-[10px]"
                                        >
                                          {officer.email.split("@")[0]}
                                        </a>
                                      ) : (
                                        <span className="text-slate-400">—</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                  </div>
                )}

                {/* Sub-view: Past Bearers Table */}
                {allPagesCategory === "past-bearers" && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <GraduationCap size={14} className="text-[#002855]" /> Past Office Bearers Timeline
                      </h3>
                      <Link to="/past-bearers" className="text-[10px] text-[#002855] font-bold hover:underline">
                        Full Page →
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse min-w-[450px]">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[9px] uppercase font-black text-slate-600">
                            <th className="py-2.5 px-3">Tenure</th>
                            <th className="py-2.5 px-3">Role</th>
                            <th className="py-2.5 px-3">Leader Name</th>
                            <th className="py-2.5 px-3">Key Achievement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {PAST_BEARERS_DATA.map((pb, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/50">
                              <td className="py-2 px-3 font-mono font-bold text-[#002855]">{pb.year}</td>
                              <td className="py-2 px-3 text-slate-700 font-bold">{pb.role}</td>
                              <td className="py-2 px-3 text-slate-900 font-extrabold">{pb.name} ({pb.dept})</td>
                              <td className="py-2 px-3 text-amber-700 text-[10px] font-semibold">{pb.achievement}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-view: Awards Table */}
                {allPagesCategory === "awards" && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <Award size={14} className="text-[#002855]" /> Awards &amp; Honors Table
                      </h3>
                      <Link to="/awards" className="text-[10px] text-[#002855] font-bold hover:underline">
                        Full Page →
                      </Link>
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
                          {AWARDS_DATA.map((aw, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/50">
                              <td className="py-2 px-3 font-extrabold text-slate-900">{aw.title}</td>
                              <td className="py-2 px-3 font-mono text-[#002855] font-bold">{aw.year}</td>
                              <td className="py-2 px-3 text-slate-600">{aw.body}</td>
                              <td className="py-2 px-3 font-bold text-amber-700 font-mono">{aw.prize}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-view: Annual Plans Table */}
                {allPagesCategory === "plans" && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <Calendar size={14} className="text-[#002855]" /> Annual Plans &amp; Roadmap
                      </h3>
                      <Link to="/annual-plans" className="text-[10px] text-[#002855] font-bold hover:underline">
                        Full Page →
                      </Link>
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
                          {ANNUAL_PLANS_DATA.map((pl, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/50">
                              <td className="py-2 px-3 font-bold text-[#002855]">{pl.month}</td>
                              <td className="py-2 px-3 font-semibold text-slate-900">{pl.event}</td>
                              <td className="py-2 px-3 text-slate-600">{pl.society}</td>
                              <td className="py-2 px-3 font-mono text-slate-800">{pl.budget}</td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${
                                  pl.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                                }`}>
                                  {pl.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-view: Funding Table */}
                {allPagesCategory === "funding" && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                    <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                        <DollarSign size={14} className="text-[#002855]" /> Funding &amp; Grants Report
                      </h3>
                      <Link to="/funding" className="text-[10px] text-[#002855] font-bold hover:underline">
                        Full Page →
                      </Link>
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
                          {FUNDING_DATA.map((fn, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/50">
                              <td className="py-2 px-3 font-bold text-slate-900">{fn.grant}</td>
                              <td className="py-2 px-3 font-mono font-black text-emerald-700">{fn.amount}</td>
                              <td className="py-2 px-3 font-mono text-[#002855]">{fn.year}</td>
                              <td className="py-2 px-3 text-slate-600 text-[11px]">{fn.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-view: Contact Table */}
                {allPagesCategory === "contact" && (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
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
                          {CONTACT_DIRECTORY.map((ct, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/50">
                              <td className="py-2.5 px-3 font-bold text-[#002855] text-[11px] w-1/3">{ct.title}</td>
                              <td className="py-2.5 px-3">
                                <p className="font-extrabold text-slate-900">{ct.contact}</p>
                                <p className="text-slate-600 font-mono text-[11px]">{ct.detail}</p>
                                <p className="text-[#002855] underline text-[10px]">{ct.email}</p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
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
                  <Link
                    to="/"
                    className="px-3 py-2 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-[10px] uppercase flex items-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap"
                  >
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
                    <button
                      onClick={() => setAllPagesCategory("office-bearers")}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm"
                    >
                      <Crown size={18} className="text-amber-600 mb-1" />
                      <p className="text-xs font-black text-slate-900">Office Bearers</p>
                      <p className="text-[9px] text-slate-500">2026-27 Leadership</p>
                    </button>
                    <button
                      onClick={() => setAllPagesCategory("past-bearers")}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm"
                    >
                      <GraduationCap size={18} className="text-blue-600 mb-1" />
                      <p className="text-xs font-black text-slate-900">Past Bearers</p>
                      <p className="text-[9px] text-slate-500">2022-2025 Timeline</p>
                    </button>
                    <Link
                      to="/team"
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm"
                    >
                      <Users size={18} className="text-[#002855] mb-1" />
                      <p className="text-xs font-black text-slate-900">Executive Team</p>
                      <p className="text-[9px] text-slate-500">Full Directory</p>
                    </Link>
                    <Link
                      to="/about"
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm"
                    >
                      <Info size={18} className="text-indigo-600 mb-1" />
                      <p className="text-xs font-black text-slate-900">About SREC SB</p>
                      <p className="text-[9px] text-slate-500">Code 64581 History</p>
                    </Link>
                  </div>
                </div>

                {/* Category 2: Activities, Awards & Plans */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 px-1">
                    Activities &amp; Honors
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAllPagesCategory("awards")}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm"
                    >
                      <Award size={18} className="text-purple-600 mb-1" />
                      <p className="text-xs font-black text-slate-900">Awards &amp; Honors</p>
                      <p className="text-[9px] text-slate-500">Madras Sec Accolades</p>
                    </button>
                    <button
                      onClick={() => setAllPagesCategory("plans")}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm"
                    >
                      <Calendar size={18} className="text-blue-600 mb-1" />
                      <p className="text-xs font-black text-slate-900">Annual Plans</p>
                      <p className="text-[9px] text-slate-500">Yearly Roadmap</p>
                    </button>
                    <button
                      onClick={() => setAllPagesCategory("funding")}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm"
                    >
                      <DollarSign size={18} className="text-emerald-600 mb-1" />
                      <p className="text-xs font-black text-slate-900">Funding &amp; Grants</p>
                      <p className="text-[9px] text-slate-500">Budget Breakdown</p>
                    </button>
                    <Link
                      to="/gallery"
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm"
                    >
                      <ImageIcon size={18} className="text-pink-600 mb-1" />
                      <p className="text-xs font-black text-slate-900">Photo Gallery</p>
                      <p className="text-[9px] text-slate-500">Event Memories</p>
                    </Link>
                  </div>
                </div>

                {/* Category 3: Portals & Registration */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 px-1">
                    Portals &amp; Joining
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setIsRegisterModalOpen(true)}
                      className="p-3 rounded-2xl bg-blue-50 border border-blue-200 text-left active:scale-95 transition-all shadow-sm"
                    >
                      <UserPlus size={18} className="text-[#002855] mb-1" />
                      <p className="text-xs font-black text-slate-900">Join / Register</p>
                      <p className="text-[9px] text-[#002855] font-semibold">Store in Database</p>
                    </button>
                    <a
                      href="http://aectsd2027.srecieee.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left active:scale-95 transition-all shadow-sm"
                    >
                      <Sparkles size={18} className="text-amber-600 mb-1" />
                      <p className="text-xs font-black text-slate-900">AECTSD 2027</p>
                      <p className="text-[9px] text-amber-700 font-semibold">Flagship Conference</p>
                    </a>
                    <button
                      onClick={() => setAllPagesCategory("contact")}
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm"
                    >
                      <Phone size={18} className="text-emerald-600 mb-1" />
                      <p className="text-xs font-black text-slate-900">Contact &amp; Map</p>
                      <p className="text-[9px] text-slate-500">Campus Location</p>
                    </button>
                    <Link
                      to="/admin-login"
                      className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] text-left active:scale-95 transition-all shadow-sm"
                    >
                      <ShieldCheck size={18} className="text-slate-500 mb-1" />
                      <p className="text-xs font-black text-slate-900">Admin Portal</p>
                      <p className="text-[9px] text-slate-500">Restricted Access</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </main>

      {/* ── MEMBER DETAIL DOSSIER MODAL (WHITE THEME) ───────────────────── */}
      <AnimatePresence>
        {detailModalMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-5 shadow-2xl space-y-3 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <img
                    src={detailModalMember.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-slate-300"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
                      {detailModalMember.first_name} {detailModalMember.last_name}
                    </h3>
                    <p className="text-[10px] text-[#002855] font-mono font-bold">
                      {detailModalMember.roll_number} · IEEE #{detailModalMember.ieee_id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailModalMember(null)}
                  className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
                >
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
                    {detailModalMember.target_societies.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200 text-[9px] text-[#002855] font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Skills &amp; Specialties</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {detailModalMember.skills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-100 text-[9px] text-slate-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setSelectedMember(detailModalMember);
                    setDetailModalMember(null);
                    handleTabChange("id");
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#002855] text-white font-black text-xs uppercase text-center shadow-md flex items-center justify-center gap-1.5"
                >
                  <IdCard size={14} />
                  <span>Open Digital ID Card</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── GLOBAL SEARCH MODAL (WHITE THEME) ────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-4 shadow-2xl space-y-3 text-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#002855] flex items-center gap-1.5">
                  <Search size={14} /> Search App Directory
                </h3>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setGlobalSearchTerm("");
                  }}
                  className="p-1 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900"
                >
                  <X size={15} />
                </button>
              </div>

              <input
                type="text"
                placeholder="Search members, societies, events..."
                value={globalSearchTerm}
                onChange={(e) => setGlobalSearchTerm(e.target.value)}
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#002855] focus:bg-white"
              />

              {globalSearchTerm ? (
                <div className="max-h-60 overflow-y-auto space-y-1.5 text-xs">
                  {members
                    .filter((m) =>
                      `${m.first_name} ${m.last_name} ${m.roll_number} ${m.ieee_id} ${m.department}`
                        .toLowerCase()
                        .includes(globalSearchTerm.toLowerCase())
                    )
                    .map((m) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setSelectedMember(m);
                          setIsSearchOpen(false);
                          setGlobalSearchTerm("");
                          handleTabChange("id");
                        }}
                        className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{m.first_name} {m.last_name}</p>
                          <p className="text-[10px] text-[#002855] font-mono font-bold">{m.roll_number} · {m.department}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Member</span>
                      </div>
                    ))}

                  {SOCIETIES_DATA.filter((s) =>
                    `${s.name} ${s.code} ${s.advisor} ${s.category}`
                      .toLowerCase()
                      .includes(globalSearchTerm.toLowerCase())
                  ).map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setGlobalSearchTerm("");
                        navigate(s.href);
                      }}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <p className="text-[10px] text-slate-500">{s.category}</p>
                      </div>
                      <span className="text-[9px] text-[#002855] font-bold uppercase">Society</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs">
                  Type a name, roll number, or society to search instantly.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MEMBERSHIP RENEWAL MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {isRenewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-sm rounded-3xl bg-white p-5 border border-slate-200 shadow-2xl space-y-4"
            >
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
                <button
                  onClick={() => setIsRenewModalOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200"
                >
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
                  <button
                    type="button"
                    onClick={() => setRenewalYear("2027")}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      renewalYear === "2027"
                        ? "border-[#002855] bg-blue-50/80 ring-2 ring-[#002855]/20 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <p className="font-black text-xs text-[#002855]">1 Year (2027)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Valid Thru DEC 2027</p>
                    <p className="text-[9px] font-bold text-emerald-700 mt-1">₹1,150 ($14)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRenewalYear("2028")}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      renewalYear === "2028"
                        ? "border-[#002855] bg-blue-50/80 ring-2 ring-[#002855]/20 shadow-sm"
                        : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <p className="font-black text-xs text-[#002855]">2 Years (2028)</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Valid Thru DEC 2028</p>
                    <p className="text-[9px] font-bold text-emerald-700 mt-1">₹2,300 ($28)</p>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <button
                  onClick={handlePerformRenewal}
                  className="w-full py-2.5 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Confirm Branch Renewal</span>
                </button>

                <a
                  href="https://www.ieee.org/membership/renew.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1 transition-all"
                >
                  <span>Official IEEE Portal</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── IN-APP MEMBERSHIP REGISTRATION MODAL ───────────────────────── */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md my-auto rounded-3xl bg-white p-5 sm:p-6 border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto font-sans text-slate-900"
            >
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
                <button
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
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
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arun"
                      value={regForm.firstName}
                      onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kumar"
                      value={regForm.lastName}
                      onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none"
                    />
                  </div>
                </div>

                {/* Roll Number & IEEE ID */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 23CS101"
                      value={regForm.rollNumber}
                      onChange={(e) => setRegForm({ ...regForm, rollNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold uppercase focus:bg-white focus:border-[#002855] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                      IEEE Member ID
                    </label>
                    <input
                      type="text"
                      placeholder="Optional / Auto"
                      value={regForm.ieeeId}
                      onChange={(e) => setRegForm({ ...regForm, ieeeId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                      College Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@srec.ac.in"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98400 00000"
                      value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none"
                    />
                  </div>
                </div>

                {/* Department & Year of Study */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
                      Department
                    </label>
                    <select
                      value={regForm.department}
                      onChange={(e) => setRegForm({ ...regForm, department: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none"
                    >
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
                    <select
                      value={regForm.yearOfStudy}
                      onChange={(e) => setRegForm({ ...regForm, yearOfStudy: e.target.value })}
                      className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:bg-white focus:border-[#002855] outline-none"
                    >
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
                      Total: ${
                        regForm.selectedSocieties.reduce((acc, name) => {
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
                        regForm.selectedSocieties.reduce((acc, name) => {
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
                      const isChecked = regForm.selectedSocieties.includes(soc.id);
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
                                  setRegForm({
                                    ...regForm,
                                    selectedSocieties: [...regForm.selectedSocieties, soc.id]
                                  });
                                } else {
                                  setRegForm({
                                    ...regForm,
                                    selectedSocieties: regForm.selectedSocieties.filter((s) => s !== soc.id)
                                  });
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

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isRegSubmitting}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#002855] to-[#00629B] hover:from-[#001c3d] hover:to-[#004e8a] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-900/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isRegSubmitting ? (
                      <>
                        <RotateCw size={15} className="animate-spin" />
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={15} />
                        <span>Submit &amp; Activate My 3D ID Card</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── STICKY BOTTOM NAVIGATION DOCK (WHITE THEME) ─────────────────── */}
      <MobileBottomNav
        activeTab={activeTab}
        onChangeTab={handleTabChange}
      />

    </div>
  );
};

export default MobileAppPage;
