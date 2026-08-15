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
  GraduationCap
} from "lucide-react";

import MobileBottomNav, { MobileTabType } from "@/components/MobileBottomNav";
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

// Pre-verified Seed Student Members
const SEED_MEMBERS: StudentMember[] = [
  {
    id: "stu-001",
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
    events_count: 14,
    awards_count: 3,
    events_attended: [
      { title: "VisionX 2025 – AI & Edge Computing Expo", date: "Aug 2025", category: "National Symposium" },
      { title: "IEEE Madras Section Leadership Conclave", date: "May 2025", category: "Leadership" },
      { title: "IEEE International Renewable Energy Workshop", date: "Jan 2025", category: "Workshop" }
    ]
  },
  {
    id: "stu-002",
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
    events_count: 9,
    awards_count: 2,
    events_attended: [
      { title: "HackIEEE 2025 - 24hr National Hackathon", date: "Jul 2025", category: "Hackathon Winner" },
      { title: "Workshop on LLM Fine-Tuning & RAG", date: "Mar 2025", category: "Hands-on Technical" }
    ]
  },
  {
    id: "stu-003",
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
    events_count: 12,
    awards_count: 4,
    events_attended: [
      { title: "BioMedTech 2025 Innovators Summit", date: "Sep 2025", category: "Conference" },
      { title: "IEEE WIE Global Outreach & STEM Camp", date: "Feb 2025", category: "Community Outreach" }
    ]
  },
  {
    id: "stu-004",
    ieee_id: "98661294",
    roll_number: "22EC185",
    first_name: "Siddharth",
    last_name: "Venkatesh",
    email: "siddharth.22ec185@srec.ac.in",
    phone: "+91 97890 12345",
    department: "Electronics & Communication",
    year_of_study: "IV Year (2022-2026)",
    member_type: "Vice Chair - ComSoc",
    join_date: "August 2022",
    valid_thru: "DEC 2026",
    membership_status: "ACTIVE",
    target_societies: [
      "IEEE Communication Society (ComSoc)",
      "IEEE Student Branch SREC"
    ],
    skills: ["5G Networks", "Wireless Communications", "Signal Processing", "RF Engineering"],
    bio_sop: "Researching high-frequency telecommunication protocols and next-generation wireless communications.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    events_count: 11,
    awards_count: 2,
    events_attended: [
      { title: "IEEE 5G & Beyond Global Summit", date: "Nov 2025", category: "Symposium" }
    ]
  },
  {
    id: "stu-005",
    ieee_id: "98774512",
    roll_number: "24IT092",
    first_name: "Deepika",
    last_name: "Sundar",
    email: "deepika.24it092@srec.ac.in",
    phone: "+91 98940 54321",
    department: "Information Technology",
    year_of_study: "II Year (2024-2028)",
    member_type: "Executive Member",
    join_date: "August 2024",
    valid_thru: "DEC 2026",
    membership_status: "ACTIVE",
    target_societies: [
      "IEEE Computer Society (CS)",
      "IEEE Women in Engineering (WIE)"
    ],
    skills: ["Cybersecurity", "Web Security", "React.js", "Ethical Hacking", "UI/UX"],
    bio_sop: "Active student contributor exploring cloud security models and encouraging women in computing.",
    avatar_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
    events_count: 7,
    awards_count: 1,
    events_attended: [
      { title: "CyberSec Conclave 2025", date: "Oct 2025", category: "Technical Workshop" }
    ]
  },
  {
    id: "stu-006",
    ieee_id: "98889321",
    roll_number: "23AD055",
    first_name: "Manojkumar",
    last_name: "Ramesh",
    email: "manojkumar.23ad@srec.ac.in",
    phone: "+91 96290 87654",
    department: "AI & Data Science",
    year_of_study: "III Year (2023-2027)",
    member_type: "Technical Lead - CIS",
    join_date: "September 2023",
    valid_thru: "DEC 2026",
    membership_status: "ACTIVE",
    target_societies: [
      "IEEE Computational Intelligence Society (CIS)",
      "IEEE Student Branch SREC"
    ],
    skills: ["Deep Learning", "PyTorch", "Computer Vision", "Generative AI", "TensorFlow"],
    bio_sop: "Exploring neural architectures, LLM fine-tuning, and AI-driven assistive systems.",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    events_count: 15,
    awards_count: 3,
    events_attended: [
      { title: "AI Horizons Conference 2025", date: "Dec 2025", category: "International Conference" }
    ]
  }
];

// Societies Data
const SOCIETIES_DATA = [
  {
    id: "srec",
    code: "IEEE SB SREC",
    name: "IEEE Student Branch SREC",
    logo: srecLogo,
    category: "Parent Branch",
    advisor: "Dr. K. Balamurugan",
    chair: "P. Joselyn",
    members: "180+",
    feeUSD: "$7.00",
    badge: "Core Chapter",
    href: "/societies/srec",
    description: "Main governing student branch offering access to all section activities and IEEE benefits."
  },
  {
    id: "cs",
    code: "CS",
    name: "IEEE Computer Society",
    logo: csLogo,
    category: "Computing & Software",
    advisor: "Dr. S. Hariharan",
    chair: "Aravind Karthik",
    members: "95+",
    feeUSD: "$8.00",
    badge: "Most Popular",
    href: "/societies/cs",
    description: "Premier technical community for computing, software systems, algorithms, and AI."
  },
  {
    id: "cis",
    code: "CIS",
    name: "Computational Intelligence Society",
    logo: cisLogo,
    category: "AI & Deep Learning",
    advisor: "Dr. R. Kingsy Grace",
    chair: "Manojkumar Ramesh",
    members: "60+",
    feeUSD: "$4.00",
    badge: "AI Frontier",
    href: "/societies/cis",
    description: "Focusing on neural networks, evolutionary computing, fuzzy logic, and deep learning."
  },
  {
    id: "comsoc",
    code: "ComSoc",
    name: "Communication Society",
    logo: comsocLogo,
    category: "5G & Telecommunications",
    advisor: "Dr. M. Kathirvelu",
    chair: "Siddharth Venkatesh",
    members: "50+",
    feeUSD: "$1.00",
    badge: "Next-Gen Comms",
    href: "/societies/comsoc",
    description: "Connecting engineers in telecommunications, optical networking, 5G/6G, and RF."
  },
  {
    id: "embs",
    code: "EMBS",
    name: "Engineering in Medicine & Biology",
    logo: embsLogo,
    category: "Biotech & Healthcare",
    advisor: "Dr. J. S. Prasath",
    chair: "Anjanalakshmi S",
    members: "45+",
    feeUSD: "$1.00",
    badge: "HealthTech",
    href: "/societies/embs",
    description: "Bridging engineering with medical sciences, healthcare instrumentation, and biosensors."
  },
  {
    id: "pels",
    code: "PELS",
    name: "Power Electronics Society",
    logo: pelsLogo,
    category: "EV & Green Energy",
    advisor: "Dr. C. Kathirvel",
    chair: "P. Joselyn",
    members: "55+",
    feeUSD: "$2.00",
    badge: "Clean Tech",
    href: "/societies/pels",
    description: "Dedicated to power conversion, renewable energy grids, motor drives, and EV systems."
  },
  {
    id: "im",
    code: "IM",
    name: "Instrumentation & Measurement",
    logo: imLogo,
    category: "Sensors & Precision",
    advisor: "Dr. S. Mythili",
    chair: "Vigneshwaran K",
    members: "40+",
    feeUSD: "$1.00",
    badge: "Smart Sensors",
    href: "/societies/im",
    description: "Advancing precision sensors, automated testing, smart instrumentation, and metrology."
  },
  {
    id: "wie",
    code: "WIE",
    name: "Women in Engineering Affinity Group",
    logo: wieLogo,
    category: "Diversity & STEM",
    advisor: "Dr. N. Saranya",
    chair: "Harini M",
    members: "110+",
    feeUSD: "$0.00 (FREE)",
    badge: "Empowerment",
    href: "/societies/wie",
    description: "Global network inspiring, encouraging, and empowering women in engineering."
  }
];

// Activities / Events Data
const ACTIVITIES_DATA = [
  {
    id: "act-1",
    title: "AECTSD 2027 – International Conference",
    date: "Feb 18-20, 2027",
    category: "Flagship Conference",
    venue: "SREC Main Auditorium",
    status: "Upcoming",
    badge: "Flagship",
    coordinator: "IEEE SB SREC Exec",
    link: "http://aectsd2027.srecieee.org/"
  },
  {
    id: "act-2",
    title: "VisionX 2025: AI & Edge Computing Expo",
    date: "Aug 29, 2025",
    category: "National Symposium",
    venue: "Mini Auditorium",
    status: "Completed",
    badge: "National Level",
    coordinator: "Computer Society & CIS",
    link: "/activities"
  },
  {
    id: "act-3",
    title: "HackIEEE 2025 – 24-Hour Hackathon",
    date: "Jul 12-13, 2025",
    category: "Hackathon",
    venue: "SREC Innovation Hub",
    status: "Completed",
    badge: "Cash Prize ₹50K",
    coordinator: "Tech Committee",
    link: "/activities"
  },
  {
    id: "act-4",
    title: "IEEE Day 2025 Celebrations & Tech Quest",
    date: "Oct 07, 2025",
    category: "Celebration",
    venue: "SREC Campus Quad",
    status: "Completed",
    badge: "Global IEEE Day",
    coordinator: "SB Office Bearers",
    link: "/activities"
  },
  {
    id: "act-5",
    title: "Hands-on Workshop: LLM Fine-Tuning & RAG",
    date: "Mar 15, 2025",
    category: "Technical Workshop",
    venue: "CSE Cloud Lab",
    status: "Completed",
    badge: "Hands-on",
    coordinator: "IEEE CS Chapter",
    link: "/activities"
  }
];

// Office Bearers Data
const OFFICE_BEARERS_DATA = [
  {
    role: "Branch Counselor",
    name: "Dr. K. Balamurugan",
    dept: "Electrical & Electronics Engg",
    category: "Faculty Leadership",
    email: "balamurugan.k@srec.ac.in",
    tenure: "2024-Present"
  },
  {
    role: "Chairperson",
    name: "P. Joselyn",
    dept: "Electrical & Electronics Engg",
    category: "Student Leadership",
    email: "joselyn.220104@srec.ac.in",
    tenure: "2025-2026"
  },
  {
    role: "Vice Chairperson",
    name: "Aravind Karthik",
    dept: "Computer Science & Engg",
    category: "Student Leadership",
    email: "aravind.karthik.23cs@srec.ac.in",
    tenure: "2025-2026"
  },
  {
    role: "Secretary",
    name: "Anjanalakshmi S",
    dept: "Biomedical Engineering",
    category: "Core Secretariat",
    email: "anjanalakshmi.23bm@srec.ac.in",
    tenure: "2025-2026"
  },
  {
    role: "Joint Secretary",
    name: "Siddharth Venkatesh",
    dept: "Electronics & Communication",
    category: "Core Secretariat",
    email: "siddharth.22ec185@srec.ac.in",
    tenure: "2025-2026"
  },
  {
    role: "Treasurer",
    name: "Deepika Sundar",
    dept: "Information Technology",
    category: "Finance",
    email: "deepika.24it092@srec.ac.in",
    tenure: "2025-2026"
  },
  {
    role: "Webmaster & Tech Lead",
    name: "Manojkumar Ramesh",
    dept: "AI & Data Science",
    category: "Digital & Tech",
    email: "manojkumar.23ad@srec.ac.in",
    tenure: "2025-2026"
  }
];

// Past Bearers Data
const PAST_BEARERS_DATA = [
  { year: "2024-2025", role: "Chairperson", name: "Sabarinath M", dept: "ECE", achievement: "Exemplary Student Branch Award" },
  { year: "2024-2025", role: "Secretary", name: "Kavya R", dept: "CSE", achievement: "Best WIE Outreach Award" },
  { year: "2023-2024", role: "Chairperson", name: "Naveen Kumar S", dept: "EEE", achievement: "Highest Member Growth in Section" },
  { year: "2023-2024", role: "Secretary", name: "Swathi P", dept: "BME", achievement: "Madras Section Travel Grant" },
  { year: "2022-2023", role: "Chairperson", name: "Dinesh K", dept: "CSE", achievement: "Section Outstanding Student Volunteer" }
];

// Awards & Honors Data
const AWARDS_DATA = [
  {
    title: "IEEE Madras Section Exemplary Student Branch",
    year: "2024",
    body: "IEEE Madras Section",
    prize: "₹15,000 & Plaque",
    category: "Section Award",
    recipient: "IEEE SB SREC (64581)"
  },
  {
    title: "Regional Exemplary Student Branch Award (R10)",
    year: "2023",
    body: "IEEE Region 10 (Asia-Pacific)",
    prize: "$500 Grant",
    category: "Global Award",
    recipient: "IEEE SB SREC"
  },
  {
    title: "Outstanding Student Volunteer Award",
    year: "2024",
    body: "IEEE Computer Society Madras",
    prize: "Honorary Citation",
    category: "Individual",
    recipient: "P. Joselyn"
  },
  {
    title: "Best WIE Affinity Group Initiative",
    year: "2024",
    body: "IEEE Madras Section WIE",
    prize: "₹10,000 Grant",
    category: "Special Interest",
    recipient: "IEEE WIE SREC"
  }
];

// Annual Plans & Roadmap Data
const ANNUAL_PLANS_DATA = [
  { month: "January", event: "Renewable Energy & Smart Grid Workshop", society: "PELS", budget: "₹18,000", status: "Completed" },
  { month: "February", event: "WIE STEM Outreach for School Students", society: "WIE", budget: "₹12,000", status: "Completed" },
  { month: "March", event: "National Level AI & LLM Bootcamp", society: "CS & CIS", budget: "₹25,000", status: "Completed" },
  { month: "May", event: "IEEE Leadership & Officer Transition Meet", society: "Parent SB", budget: "₹10,000", status: "Completed" },
  { month: "July", event: "HackIEEE 2025 - 24hr Hackathon", society: "Tech Hub", budget: "₹65,000", status: "Completed" },
  { month: "August", event: "VisionX National Technical Symposium", society: "CS / CIS", budget: "₹45,000", status: "Completed" },
  { month: "October", event: "Global IEEE Day 2025 Celebrations", society: "All Chapters", budget: "₹30,000", status: "Completed" },
  { month: "February 2027", event: "AECTSD 2027 International Conference", society: "IEEE SREC Flagship", budget: "₹3,50,000", status: "Upcoming" }
];

// Funding & Grants Data
const FUNDING_DATA = [
  { grant: "IEEE Madras Section Activity Support Grant", amount: "₹25,000", year: "2025", agency: "IEEE Madras Section", purpose: "Symposium & Hackathon" },
  { grant: "IEEE Region 10 Educational Activities Fund", amount: "$400 USD", year: "2024", agency: "IEEE R10 Asia-Pacific", purpose: "School STEM Outreach" },
  { grant: "IEEE Computer Society Chapter Support Grant", amount: "$300 USD", year: "2024", agency: "IEEE CS Global", purpose: "Cloud AI Workshop" },
  { grant: "SREC Management Institutional Match Grant", amount: "₹1,50,000", year: "2025", agency: "SNR Sons Charitable Trust", purpose: "Lab Infrastructure & Events" }
];

// Contact Directory
const CONTACT_DIRECTORY = [
  { title: "Branch Counselor", contact: "Dr. K. Balamurugan", detail: "+91 94435 67890", email: "balamurugan.k@srec.ac.in", type: "Faculty" },
  { title: "Student Chairperson", contact: "P. Joselyn", detail: "+91 94882 14502", email: "joselyn.220104@srec.ac.in", type: "Student Leader" },
  { title: "Official SB Email", contact: "IEEE SREC Desk", detail: "ieee@srec.ac.in", email: "ieee@srec.ac.in", type: "General" },
  { title: "Campus Location", contact: "Sri Ramakrishna Engineering College", detail: "Vattamalaipalayam, NGGO Colony, Coimbatore - 641022", email: "info@srec.ac.in", type: "Address" }
];

// ── Card Theme Customizer ─────────────────────────────────────────────
type CardTheme = "classic" | "cyber" | "gold" | "titanium";
const CARD_THEMES: { id: CardTheme; name: string; gradient: string; border: string; accent: string }[] = [
  { id: "classic", name: "Classic Navy", gradient: "from-[#002244] via-[#004b87] to-[#00629b]", border: "border-sky-400/40", accent: "text-sky-300" },
  { id: "cyber", name: "Cyber Glow", gradient: "from-[#020b18] via-[#002040] to-[#003865]", border: "border-cyan-400/70", accent: "text-cyan-300" },
  { id: "gold", name: "Executive Gold", gradient: "from-[#1a1405] via-[#2d2109] to-[#42320d]", border: "border-amber-400/60", accent: "text-amber-300" },
  { id: "titanium", name: "Titanium Dark", gradient: "from-[#0a0f1d] via-[#161f36] to-[#1e293b]", border: "border-indigo-400/40", accent: "text-indigo-300" }
];

export const MobileAppPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State
  const initialTab = (searchParams.get("tab") as MobileTabType) || "home";
  const [activeTab, setActiveTab] = useState<MobileTabType>(initialTab);

  // Sub-page category view in "All Pages" menu
  const [allPagesCategory, setAllPagesCategory] = useState<
    "menu" | "office-bearers" | "past-bearers" | "awards" | "plans" | "funding" | "contact" | "about"
  >("menu");

  // View Mode toggle: "table" vs "cards"
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Members list & Selected member
  const [members, setMembers] = useState<StudentMember[]>(SEED_MEMBERS);
  const [selectedMember, setSelectedMember] = useState<StudentMember>(SEED_MEMBERS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [societyFilter, setSocietyFilter] = useState("All");

  // Digital ID Card states
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>("classic");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [detailModalMember, setDetailModalMember] = useState<StudentMember | null>(null);

  // Global Search Modal State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  const idCardRef = useRef<HTMLDivElement>(null);

  // Sync tab with URL
  const handleTabChange = (tab: MobileTabType) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch student members from Supabase if table exists
  useEffect(() => {
    const fetchSupabaseMembers = async () => {
      try {
        const { data, error } = await supabase.from("student_members").select("*");
        if (!error && data && data.length > 0) {
          const merged = [...data];
          // Ensure seed members exist if not in DB
          SEED_MEMBERS.forEach((sm) => {
            if (!merged.find((m) => m.ieee_id === sm.ieee_id)) {
              merged.push(sm);
            }
          });
          setMembers(merged);
        }
      } catch (err) {
        // use fallback SEED_MEMBERS
      }
    };
    fetchSupabaseMembers();
  }, []);

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
      const matchesSoc = societyFilter === "All" || m.target_societies.some((s) => s.includes(societyFilter));

      return matchesSearch && matchesDept && matchesSoc;
    });
  }, [members, searchQuery, deptFilter, societyFilter]);

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Export ID Card as PNG
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

  // Active theme gradient object
  const currentTheme = CARD_THEMES.find((t) => t.id === selectedTheme) || CARD_THEMES[0];

  return (
    <div className="min-h-screen bg-[#000814] text-slate-100 pb-24 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* ── TOP MOBILE APP BAR ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#000d20]/95 backdrop-blur-2xl border-b border-cyan-500/30 px-3.5 py-2.5 shadow-lg">
        <div className="max-w-md mx-auto flex items-center justify-between">
          
          {/* Brand Header */}
          <div className="flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2">
              <img src={srecLogo} alt="SREC" className="h-7 w-auto object-contain" />
              <div className="w-[1px] h-5 bg-slate-700" />
              <img src={ieeeLogo} alt="IEEE" className="h-7 w-auto object-contain" />
            </Link>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
                  SREC IEEE APP
                </span>
                <span className="px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-[8px] border border-cyan-400/40">
                  SB 64581
                </span>
              </div>
              <p className="text-[8px] text-slate-400 font-medium leading-none">
                Madras Section · R10
              </p>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle (Table / Cards) */}
            <button
              onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
              className={`p-1.5 rounded-xl border transition-all text-xs flex items-center gap-1 ${
                viewMode === "table"
                  ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_10px_rgba(0,210,255,0.3)]"
                  : "bg-slate-900 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title={`Switch to ${viewMode === "table" ? "Card View" : "Table View"}`}
            >
              {viewMode === "table" ? <TableIcon size={14} /> : <Grid size={14} />}
              <span className="text-[9px] font-bold uppercase">{viewMode}</span>
            </button>

            {/* Quick Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 active:scale-95 transition-all"
              aria-label="Search"
            >
              <Search size={15} />
            </button>

            {/* Web Home Return */}
            <Link
              to="/"
              className="p-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center gap-1"
            >
              <span>Web</span>
              <ExternalLink size={11} />
            </Link>
          </div>

        </div>
      </header>

      {/* ── MAIN CONTENT ACCORDING TO ACTIVE TAB ───────────────────────── */}
      <main className="max-w-md mx-auto px-3 pt-3">
        
        {/* ═══════════════════════════════════════════════════════════════════
            TAB 1: HOME DASHBOARD
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "home" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Top Stories / Highlights Reel */}
            <div className="overflow-x-auto no-scrollbar flex items-center gap-3 py-1 -mx-3 px-3">
              {[
                { title: "AECTSD 2027", tag: "Flagship", color: "from-amber-500 to-orange-600", link: "http://aectsd2027.srecieee.org/" },
                { title: "Digital ID", tag: "Lookup", color: "from-cyan-500 to-blue-600", action: () => handleTabChange("id") },
                { title: "Directory", tag: "Members", color: "from-blue-600 to-indigo-600", action: () => handleTabChange("directory") },
                { title: "8 Societies", tag: "Explore", color: "from-emerald-500 to-teal-600", action: () => handleTabChange("societies") },
                { title: "Awards '24", tag: "Madras Sec", color: "from-purple-500 to-pink-600", action: () => { handleTabChange("menu"); setAllPagesCategory("awards"); } },
                { title: "Join SB", tag: "Register", color: "from-rose-500 to-red-600", link: "/membership-registration" }
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
                  <div className={`w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr ${story.color} shadow-md`}>
                    <div className="w-full h-full rounded-full bg-[#000d20] flex items-center justify-center p-1 text-center">
                      <Sparkles size={16} className="text-white animate-pulse" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-200 mt-1 truncate max-w-[64px]">
                    {story.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Hero Banner with Quick Actions */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#001838] via-[#002855] to-[#001026] border border-cyan-500/40 p-4 shadow-[0_0_30px_rgba(0,210,255,0.15)]">
              <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[9px] font-black uppercase tracking-wider border border-cyan-400/40">
                    <ShieldCheck size={10} /> Official Mobile App
                  </span>
                  <h1 className="text-lg font-black text-white mt-1.5 leading-tight">
                    IEEE Student Branch SREC
                  </h1>
                  <p className="text-xs text-slate-300 mt-0.5 font-medium">
                    Code 64581 · Advancing Technology for Humanity
                  </p>
                </div>
                <img src={ieeeStamp} alt="Seal" className="h-11 w-11 object-contain opacity-90" />
              </div>

              {/* Quick Action Button Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={() => handleTabChange("directory")}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 hover:bg-cyan-500/30 text-left active:scale-95 transition-all"
                >
                  <div className="p-2 rounded-xl bg-cyan-400 text-slate-950">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Member Table</p>
                    <p className="text-[9px] text-cyan-300">View Directory</p>
                  </div>
                </button>

                <button
                  onClick={() => handleTabChange("id")}
                  className="flex items-center gap-2 p-2.5 rounded-2xl bg-gradient-to-r from-blue-600/30 to-cyan-500/20 border border-blue-400/50 hover:bg-blue-600/40 text-left active:scale-95 transition-all"
                >
                  <div className="p-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950">
                    <IdCard size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">My Digital ID</p>
                    <p className="text-[9px] text-cyan-300">3D Card & Details</p>
                  </div>
                </button>
              </div>

              {/* Live SB Metrics Bar */}
              <div className="grid grid-cols-4 gap-1.5 mt-3 pt-3 border-t border-white/10 text-center">
                <div className="p-1.5 rounded-xl bg-[#000814]/60">
                  <p className="text-sm font-black text-cyan-400">180+</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Members</p>
                </div>
                <div className="p-1.5 rounded-xl bg-[#000814]/60">
                  <p className="text-sm font-black text-blue-400">8</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Societies</p>
                </div>
                <div className="p-1.5 rounded-xl bg-[#000814]/60">
                  <p className="text-sm font-black text-amber-400">35+</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Events/Yr</p>
                </div>
                <div className="p-1.5 rounded-xl bg-[#000814]/60">
                  <p className="text-sm font-black text-emerald-400">12+</p>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Awards</p>
                </div>
              </div>
            </div>

            {/* Quick Access Menu Cards */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <LayoutGrid size={14} className="text-cyan-400" />
                  Explore Pages & Tables
                </h2>
                <button
                  onClick={() => handleTabChange("menu")}
                  className="text-[10px] text-cyan-400 font-bold hover:underline flex items-center"
                >
                  All 16 Pages <ChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Office Bearers", icon: Shield, tabKey: "office-bearers", color: "from-amber-500/20 to-orange-500/10 border-amber-400/30 text-amber-300" },
                  { label: "Societies Hub", icon: Cpu, tabType: "societies", color: "from-cyan-500/20 to-blue-500/10 border-cyan-400/30 text-cyan-300" },
                  { label: "Activities", icon: Calendar, tabKey: "plans", color: "from-blue-500/20 to-indigo-500/10 border-blue-400/30 text-blue-300" },
                  { label: "Awards & Honors", icon: Award, tabKey: "awards", color: "from-purple-500/20 to-pink-500/10 border-purple-400/30 text-purple-300" },
                  { label: "Funding Plan", icon: DollarSign, tabKey: "funding", color: "from-emerald-500/20 to-teal-500/10 border-emerald-400/30 text-emerald-300" },
                  { label: "Annual Plans", icon: SlidersHorizontal, tabKey: "plans", color: "from-rose-500/20 to-red-500/10 border-rose-400/30 text-rose-300" },
                  { label: "Past Bearers", icon: GraduationCap, tabKey: "past-bearers", color: "from-slate-700/40 to-slate-800/20 border-slate-600 text-slate-300" },
                  { label: "Gallery", icon: ImageIcon, route: "/gallery", color: "from-fuchsia-500/20 to-purple-500/10 border-fuchsia-400/30 text-fuchsia-300" },
                  { label: "Register / Join", icon: UserPlus, route: "/membership-registration", color: "from-cyan-500/30 to-blue-600/30 border-cyan-400/60 text-white" }
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
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-gradient-to-b ${item.color} border text-center active:scale-95 transition-all shadow-sm`}
                    >
                      <Icon size={20} className="mb-1.5" />
                      <span className="text-[10px] font-black uppercase tracking-tight leading-tight">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Flagship Event Card */}
            <div className="p-3.5 rounded-2xl bg-[#001026] border border-amber-400/40 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-extrabold text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles size={10} className="animate-pulse" /> Flagship 2027
                </span>
                <span className="text-[10px] font-bold text-slate-400">Feb 18-20, 2027</span>
              </div>
              <h3 className="text-sm font-black text-white">
                AECTSD 2027: International Conference
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Advances in Electrical, Communication & Thermal Systems for Sustainable Development.
              </p>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/10">
                <span className="text-[10px] text-amber-300 font-bold">Venue: SREC Auditorium</span>
                <a
                  href="http://aectsd2027.srecieee.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-500 text-slate-950 font-black text-[10px] uppercase shadow-sm"
                >
                  <span>Portal</span>
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 2: MEMBER DIRECTORY & STRUCTURED TABLE
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "directory" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* Header & Filter Controls */}
            <div className="p-3 rounded-2xl bg-[#001026] border border-cyan-500/30">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={16} className="text-cyan-400" />
                    Student Members Directory
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    Showing {filteredMembers.length} verified IEEE SREC members
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold">
                  {members.length} Total
                </span>
              </div>

              {/* Search input */}
              <div className="relative mb-2">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by Name, Roll No, IEEE ID, Dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#000814] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Department pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {["All", "Computer Science", "Electrical", "Electronics", "Biomedical", "Information Technology", "AI & Data"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDeptFilter(d === deptFilter ? "All" : d)}
                    className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase whitespace-nowrap transition-all ${
                      deptFilter === d
                        ? "bg-cyan-400 text-slate-950 shadow-sm"
                        : "bg-slate-900 border border-slate-700 text-slate-300"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* TABULAR VIEW OF MEMBERS */}
            {viewMode === "table" ? (
              <div className="rounded-2xl border border-cyan-500/30 overflow-hidden bg-[#001026]/90 backdrop-blur-xl shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[550px]">
                    <thead>
                      <tr className="bg-[#001838] border-b border-cyan-500/30 text-[9px] font-black uppercase tracking-wider text-cyan-300">
                        <th className="py-2.5 px-3">Member / Roll</th>
                        <th className="py-2.5 px-3">IEEE ID</th>
                        <th className="py-2.5 px-3">Department &amp; Year</th>
                        <th className="py-2.5 px-3">Societies</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {filteredMembers.map((member) => (
                        <tr
                          key={member.id}
                          className="hover:bg-cyan-500/10 transition-colors group cursor-pointer"
                          onClick={() => {
                            setSelectedMember(member);
                            handleTabChange("id");
                          }}
                        >
                          {/* Name & Avatar */}
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <img
                                src={member.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                                alt={member.first_name}
                                className="w-7 h-7 rounded-full object-cover border border-cyan-400/40"
                              />
                              <div>
                                <p className="font-extrabold text-white leading-tight">
                                  {member.first_name} {member.last_name}
                                </p>
                                <p className="text-[10px] text-cyan-300 font-mono">
                                  {member.roll_number}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* IEEE ID */}
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                            {member.ieee_id}
                          </td>

                          {/* Dept & Year */}
                          <td className="py-2.5 px-3">
                            <p className="text-[11px] text-slate-200 font-medium truncate max-w-[150px]">
                              {member.department}
                            </p>
                            <p className="text-[9px] text-slate-400">{member.year_of_study}</p>
                          </td>

                          {/* Societies */}
                          <td className="py-2.5 px-3">
                            <div className="flex flex-wrap gap-1 max-w-[140px]">
                              {member.target_societies.slice(0, 2).map((soc, si) => (
                                <span
                                  key={si}
                                  className="px-1.5 py-0.2 rounded bg-cyan-950/80 border border-cyan-500/30 text-[8px] text-cyan-300 font-semibold truncate"
                                >
                                  {soc.replace("IEEE", "").replace("Society", "").trim()}
                                </span>
                              ))}
                              {member.target_societies.length > 2 && (
                                <span className="text-[8px] text-slate-400 font-bold">
                                  +{member.target_societies.length - 2}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-2.5 px-3 text-center">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black border border-emerald-400/40">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              ACTIVE
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDetailModalMember(member);
                                }}
                                className="p-1 rounded-lg bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300"
                                title="View Dossier"
                              >
                                <Info size={13} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMember(member);
                                  handleTabChange("id");
                                }}
                                className="px-2 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold text-[9px] uppercase hover:bg-cyan-400 hover:text-slate-950 flex items-center gap-1"
                              >
                                <IdCard size={11} /> ID
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* CARD VIEW OF MEMBERS */
              <div className="space-y-2.5">
                {filteredMembers.map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      setSelectedMember(member);
                      handleTabChange("id");
                    }}
                    className="p-3.5 rounded-2xl bg-[#001026] border border-cyan-500/30 hover:border-cyan-400/60 shadow-md cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120"}
                          alt={member.first_name}
                          className="w-11 h-11 rounded-2xl object-cover border border-cyan-400/50 shadow-md"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-white text-sm">
                              {member.first_name} {member.last_name}
                            </h3>
                            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 text-[8px] font-black border border-emerald-400/40">
                              ACTIVE
                            </span>
                          </div>
                          <p className="text-[10px] text-cyan-300 font-mono">
                            {member.roll_number} · IEEE #{member.ieee_id}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {member.department} ({member.year_of_study})
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-cyan-400" />
                    </div>

                    {/* Member Societies tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5 pt-2 border-t border-white/10">
                      {member.target_societies.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-[9px] text-cyan-300 font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 3: DIGITAL ID CARD & STRUCTURED USER DETAILS TABLE
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "id" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Theme & Actions Toolbar */}
            <div className="p-3 rounded-2xl bg-[#001026] border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-[9px] font-black uppercase text-cyan-400 tracking-wider">
                  Card Theme
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {CARD_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase border transition-all ${
                        selectedTheme === theme.id
                          ? "bg-cyan-400 text-slate-950 border-cyan-300 shadow-sm"
                          : "bg-slate-900 border-slate-700 text-slate-300"
                      }`}
                    >
                      {theme.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1 active:scale-95"
                >
                  <RotateCw size={13} className={isFlipped ? "rotate-180 transition-transform" : ""} />
                  <span>Flip</span>
                </button>
                <button
                  onClick={handleExportCard}
                  disabled={isExporting}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase flex items-center gap-1 active:scale-95 shadow-md"
                >
                  <Download size={13} />
                  <span>{isExporting ? "Saving..." : "Save ID"}</span>
                </button>
              </div>
            </div>

            {/* 3D Flippable Digital ID Card Container */}
            <div
              className="relative w-full aspect-[1.586] select-none cursor-pointer"
              style={{ perspective: 1200 }}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div
                ref={idCardRef}
                className="w-full h-full relative transition-transform duration-700"
                style={{
                  transformStyle: "preserve-3d",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
              >
                {/* ── CARD FRONT ── */}
                <div
                  className={`absolute inset-0 rounded-3xl p-4 bg-gradient-to-br ${currentTheme.gradient} border ${currentTheme.border} shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden`}
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {/* Hologram Background Watermark */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                  <img src={ieeeStamp} alt="Watermark" className="absolute -right-6 -bottom-6 w-36 h-36 opacity-10 object-contain pointer-events-none" />

                  {/* Header Row */}
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <img src={srecLogo} alt="SREC" className="h-7 w-auto object-contain brightness-110" />
                      <div className="w-[1px] h-6 bg-white/30" />
                      <img src={ieeeLogo} alt="IEEE" className="h-7 w-auto object-contain brightness-110" />
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/50 font-black text-[9px] uppercase tracking-wider">
                        ACTIVE MEMBER
                      </span>
                      <p className="text-[8px] text-white/70 font-mono mt-0.5">VALID THRU DEC 2026</p>
                    </div>
                  </div>

                  {/* Member Details Row */}
                  <div className="flex items-center gap-3 relative z-10 my-auto">
                    <div className="relative shrink-0">
                      <img
                        src={selectedMember.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                        alt="Photo"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white/80 shadow-md"
                      />
                      <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-cyan-400 text-slate-950">
                        <CheckCircle2 size={12} />
                      </div>
                    </div>

                    <div className="leading-tight">
                      <h2 className="text-base font-black text-white tracking-wide">
                        {selectedMember.first_name} {selectedMember.last_name}
                      </h2>
                      <p className="text-xs font-black text-cyan-300 font-mono">
                        ROLL: {selectedMember.roll_number}
                      </p>
                      <p className="text-[10px] text-white/90 font-medium mt-0.5 truncate max-w-[200px]">
                        {selectedMember.department}
                      </p>
                      <p className="text-[9px] text-white/75 font-semibold">
                        {selectedMember.member_type} · {selectedMember.year_of_study}
                      </p>
                    </div>
                  </div>

                  {/* Footer Row */}
                  <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/20">
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/60 font-bold">IEEE MEMBER ID</p>
                      <p className="text-sm font-black font-mono text-cyan-300 tracking-wider">
                        {selectedMember.ieee_id}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="p-1 rounded-lg bg-white/10 backdrop-blur text-white text-[8px] font-mono">
                        SB 64581
                      </div>
                      <div className="p-1.5 rounded-lg bg-white text-slate-950">
                        <QrCode size={18} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── CARD BACK ── */}
                <div
                  className={`absolute inset-0 rounded-3xl p-4 bg-gradient-to-br ${currentTheme.gradient} border ${currentTheme.border} shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden`}
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)"
                  }}
                >
                  <div className="flex items-center justify-between border-b border-white/20 pb-2">
                    <div>
                      <p className="text-[9px] font-black uppercase text-cyan-300 tracking-wider">
                        IEEE Student Branch SREC
                      </p>
                      <p className="text-[8px] text-white/70">Madras Section · Region 10 (Asia-Pacific)</p>
                    </div>
                    <img src={snrLogo} alt="SNR" className="h-6 w-auto object-contain" />
                  </div>

                  <div className="space-y-1.5 text-[10px] text-white/90">
                    <p className="font-semibold">
                      <span className="text-white/60">Email: </span>
                      {selectedMember.email}
                    </p>
                    <p className="font-semibold">
                      <span className="text-white/60">Phone: </span>
                      {selectedMember.phone}
                    </p>
                    <p className="font-semibold">
                      <span className="text-white/60">Enrolled Societies: </span>
                      {selectedMember.target_societies.join(", ")}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/20 flex items-center justify-between text-[8px] text-white/60">
                    <p>Card Verification Key: {selectedMember.ieee_id}-SB64581</p>
                    <p>Tap to Flip Front</p>
                  </div>
                </div>
              </div>
            </div>

            {/* STRUCTURED MEMBERSHIP DETAILS TABLE (PER USER) */}
            <div className="rounded-2xl border border-cyan-500/30 overflow-hidden bg-[#001026]/90 shadow-xl">
              <div className="px-4 py-3 bg-[#001838] border-b border-cyan-500/30 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <TableIcon size={14} />
                  Structured Membership Dossier
                </h3>
                <span className="text-[10px] font-mono text-cyan-400">
                  {selectedMember.roll_number}
                </span>
              </div>

              <div className="p-3">
                <table className="w-full text-xs text-left border-collapse">
                  <tbody className="divide-y divide-slate-800">
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px] w-1/3">Full Name</td>
                      <td className="py-2 px-2 font-extrabold text-white">{selectedMember.first_name} {selectedMember.last_name}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px]">IEEE Member ID</td>
                      <td className="py-2 px-2 font-mono font-bold text-cyan-300 flex items-center justify-between">
                        <span>{selectedMember.ieee_id}</span>
                        <button
                          onClick={() => handleCopy(selectedMember.ieee_id, "id")}
                          className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-0.5"
                        >
                          {copiedText === "id" ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px]">College Roll No</td>
                      <td className="py-2 px-2 font-mono font-bold text-white">{selectedMember.roll_number}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px]">Department</td>
                      <td className="py-2 px-2 text-slate-200">{selectedMember.department}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px]">Year &amp; Batch</td>
                      <td className="py-2 px-2 text-slate-200">{selectedMember.year_of_study}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px]">Branch Designation</td>
                      <td className="py-2 px-2 font-extrabold text-amber-300">{selectedMember.member_type}</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px]">Membership Status</td>
                      <td className="py-2 px-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-black border border-emerald-400/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          ACTIVE (Valid thru {selectedMember.valid_thru})
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px]">Enrolled Societies</td>
                      <td className="py-2 px-2">
                        <div className="flex flex-wrap gap-1">
                          {selectedMember.target_societies.map((s, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-[9px] text-cyan-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px]">Technical Skills</td>
                      <td className="py-2 px-2">
                        <div className="flex flex-wrap gap-1">
                          {selectedMember.skills.map((skill, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px]">Official Email</td>
                      <td className="py-2 px-2 text-cyan-300 underline font-mono text-[11px] truncate">
                        <a href={`mailto:${selectedMember.email}`}>{selectedMember.email}</a>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-2 text-slate-400 font-bold uppercase text-[10px]">Phone Contact</td>
                      <td className="py-2 px-2 text-slate-200 font-mono">{selectedMember.phone}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Switch to Other Members */}
            <div className="p-3 rounded-2xl bg-[#001026] border border-cyan-500/30">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-2">
                Quick Switch Verified Member Card
              </span>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {members.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedMember(m);
                      setIsFlipped(false);
                    }}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all border ${
                      selectedMember.id === m.id
                        ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm"
                        : "bg-slate-900 border-slate-700 text-slate-300"
                    }`}
                  >
                    <img src={m.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80"} alt="Photo" className="w-5 h-5 rounded-full object-cover" />
                    <span>{m.first_name} ({m.roll_number})</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 4: TECHNICAL SOCIETIES TABLE & HUB
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "societies" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="p-3 rounded-2xl bg-[#001026] border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu size={16} className="text-cyan-400" />
                    8 Technical Society Chapters
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    Affiliated technical societies at IEEE SB SREC
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold">
                  8 Chapters
                </span>
              </div>
            </div>

            {/* TABULAR SOCIETIES VIEW */}
            {viewMode === "table" ? (
              <div className="rounded-2xl border border-cyan-500/30 overflow-hidden bg-[#001026]/90 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-[#001838] border-b border-cyan-500/30 text-[9px] font-black uppercase tracking-wider text-cyan-300">
                        <th className="py-2.5 px-3">Society Chapter</th>
                        <th className="py-2.5 px-3">Faculty Advisor</th>
                        <th className="py-2.5 px-3">Student Chair</th>
                        <th className="py-2.5 px-3 text-center">Members</th>
                        <th className="py-2.5 px-3 text-right">Fee (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {SOCIETIES_DATA.map((soc) => (
                        <tr
                          key={soc.id}
                          onClick={() => navigate(soc.href)}
                          className="hover:bg-cyan-500/10 transition-colors cursor-pointer"
                        >
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <img src={soc.logo} alt={soc.code} className="w-7 h-7 rounded-lg object-contain bg-white/10 p-0.5" />
                              <div>
                                <p className="font-extrabold text-white leading-tight">{soc.name}</p>
                                <p className="text-[9px] text-cyan-300 font-bold">{soc.badge}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-300">{soc.advisor}</td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-200 font-semibold">{soc.chair}</td>
                          <td className="py-2.5 px-3 text-center font-mono text-cyan-300 font-bold">{soc.members}</td>
                          <td className="py-2.5 px-3 text-right font-mono font-black text-amber-300">{soc.feeUSD}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* CARD VIEW */
              <div className="space-y-2.5">
                {SOCIETIES_DATA.map((soc) => (
                  <div
                    key={soc.id}
                    onClick={() => navigate(soc.href)}
                    className="p-3.5 rounded-2xl bg-[#001026] border border-cyan-500/30 hover:border-cyan-400/60 shadow-md cursor-pointer active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img src={soc.logo} alt={soc.code} className="w-10 h-10 rounded-xl object-contain bg-white/10 p-1 border border-white/20" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-white text-sm">{soc.name}</h3>
                          </div>
                          <p className="text-[10px] text-cyan-300 font-bold">{soc.badge} · Advisor: {soc.advisor}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-cyan-400" />
                    </div>
                    <p className="text-[11px] text-slate-300 mt-2">{soc.description}</p>
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-white/10 text-[10px]">
                      <span className="text-slate-400">Chair: <strong className="text-white">{soc.chair}</strong></span>
                      <span className="font-bold text-amber-300 font-mono">Fee: {soc.feeUSD}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════
            TAB 5: ALL PAGES DIRECTORY & STRUCTURED SUB-TABLES
        ════════════════════════════════════════════════════════════════════ */}
        {activeTab === "menu" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {/* If a sub-table category is selected, show that table view with a back button */}
            {allPagesCategory !== "menu" ? (
              <div className="space-y-3">
                <button
                  onClick={() => setAllPagesCategory("menu")}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-cyan-300 hover:text-white"
                >
                  <ArrowLeft size={13} /> Back to All Pages Menu
                </button>

                {/* Sub-view: Office Bearers Table */}
                {allPagesCategory === "office-bearers" && (
                  <div className="rounded-2xl border border-cyan-500/30 overflow-hidden bg-[#001026] shadow-xl">
                    <div className="p-3 bg-[#001838] border-b border-cyan-500/30 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        <Shield size={14} /> Office Bearers Table (2025-2026)
                      </h3>
                      <Link to="/office-bearers" className="text-[10px] text-cyan-300 font-bold hover:underline">
                        Full Page →
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse min-w-[450px]">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-[9px] uppercase font-black text-cyan-400">
                            <th className="py-2 px-3">Role</th>
                            <th className="py-2 px-3">Name</th>
                            <th className="py-2 px-3">Department</th>
                            <th className="py-2 px-3">Email</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {OFFICE_BEARERS_DATA.map((ob, idx) => (
                            <tr key={idx} className="hover:bg-cyan-500/10">
                              <td className="py-2 px-3 font-extrabold text-amber-300">{ob.role}</td>
                              <td className="py-2 px-3 font-bold text-white">{ob.name}</td>
                              <td className="py-2 px-3 text-slate-300">{ob.dept}</td>
                              <td className="py-2 px-3 font-mono text-[10px] text-cyan-300">{ob.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-view: Past Bearers Table */}
                {allPagesCategory === "past-bearers" && (
                  <div className="rounded-2xl border border-cyan-500/30 overflow-hidden bg-[#001026] shadow-xl">
                    <div className="p-3 bg-[#001838] border-b border-cyan-500/30 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        <GraduationCap size={14} /> Past Office Bearers Timeline
                      </h3>
                      <Link to="/past-bearers" className="text-[10px] text-cyan-300 font-bold hover:underline">
                        Full Page →
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse min-w-[450px]">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-[9px] uppercase font-black text-cyan-400">
                            <th className="py-2 px-3">Tenure</th>
                            <th className="py-2 px-3">Role</th>
                            <th className="py-2 px-3">Leader Name</th>
                            <th className="py-2 px-3">Key Achievement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {PAST_BEARERS_DATA.map((pb, idx) => (
                            <tr key={idx} className="hover:bg-cyan-500/10">
                              <td className="py-2 px-3 font-mono font-bold text-cyan-300">{pb.year}</td>
                              <td className="py-2 px-3 text-slate-300 font-bold">{pb.role}</td>
                              <td className="py-2 px-3 text-white font-extrabold">{pb.name} ({pb.dept})</td>
                              <td className="py-2 px-3 text-amber-300 text-[10px] font-semibold">{pb.achievement}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-view: Awards Table */}
                {allPagesCategory === "awards" && (
                  <div className="rounded-2xl border border-cyan-500/30 overflow-hidden bg-[#001026] shadow-xl">
                    <div className="p-3 bg-[#001838] border-b border-cyan-500/30 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                        <Award size={14} /> Awards &amp; Honors Table
                      </h3>
                      <Link to="/awards" className="text-[10px] text-cyan-300 font-bold hover:underline">
                        Full Page →
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse min-w-[450px]">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-[9px] uppercase font-black text-cyan-400">
                            <th className="py-2 px-3">Award Title</th>
                            <th className="py-2 px-3">Year</th>
                            <th className="py-2 px-3">Issuing Body</th>
                            <th className="py-2 px-3">Prize / Grant</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {AWARDS_DATA.map((aw, idx) => (
                            <tr key={idx} className="hover:bg-cyan-500/10">
                              <td className="py-2 px-3 font-extrabold text-white">{aw.title}</td>
                              <td className="py-2 px-3 font-mono text-cyan-300">{aw.year}</td>
                              <td className="py-2 px-3 text-slate-300">{aw.body}</td>
                              <td className="py-2 px-3 font-bold text-amber-300 font-mono">{aw.prize}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-view: Annual Plans Table */}
                {allPagesCategory === "plans" && (
                  <div className="rounded-2xl border border-cyan-500/30 overflow-hidden bg-[#001026] shadow-xl">
                    <div className="p-3 bg-[#001838] border-b border-cyan-500/30 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                        <Calendar size={14} /> Annual Plans &amp; Roadmap
                      </h3>
                      <Link to="/annual-plans" className="text-[10px] text-cyan-300 font-bold hover:underline">
                        Full Page →
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse min-w-[450px]">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-[9px] uppercase font-black text-cyan-400">
                            <th className="py-2 px-3">Month</th>
                            <th className="py-2 px-3">Event / Milestone</th>
                            <th className="py-2 px-3">Society</th>
                            <th className="py-2 px-3">Budget</th>
                            <th className="py-2 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {ANNUAL_PLANS_DATA.map((pl, idx) => (
                            <tr key={idx} className="hover:bg-cyan-500/10">
                              <td className="py-2 px-3 font-bold text-cyan-300">{pl.month}</td>
                              <td className="py-2 px-3 font-semibold text-white">{pl.event}</td>
                              <td className="py-2 px-3 text-slate-300">{pl.society}</td>
                              <td className="py-2 px-3 font-mono text-amber-300">{pl.budget}</td>
                              <td className="py-2 px-3">
                                <span className={`px-1.5 py-0.2 rounded text-[8px] font-bold ${
                                  pl.status === "Completed" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
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
                  <div className="rounded-2xl border border-cyan-500/30 overflow-hidden bg-[#001026] shadow-xl">
                    <div className="p-3 bg-[#001838] border-b border-cyan-500/30 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                        <DollarSign size={14} /> Funding &amp; Grants Report
                      </h3>
                      <Link to="/funding" className="text-[10px] text-cyan-300 font-bold hover:underline">
                        Full Page →
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse min-w-[450px]">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-[9px] uppercase font-black text-cyan-400">
                            <th className="py-2 px-3">Grant / Funding Source</th>
                            <th className="py-2 px-3">Amount</th>
                            <th className="py-2 px-3">Year</th>
                            <th className="py-2 px-3">Purpose</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {FUNDING_DATA.map((fn, idx) => (
                            <tr key={idx} className="hover:bg-cyan-500/10">
                              <td className="py-2 px-3 font-bold text-white">{fn.grant}</td>
                              <td className="py-2 px-3 font-mono font-black text-emerald-300">{fn.amount}</td>
                              <td className="py-2 px-3 font-mono text-cyan-300">{fn.year}</td>
                              <td className="py-2 px-3 text-slate-300 text-[11px]">{fn.purpose}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Sub-view: Contact Table */}
                {allPagesCategory === "contact" && (
                  <div className="rounded-2xl border border-cyan-500/30 overflow-hidden bg-[#001026] shadow-xl">
                    <div className="p-3 bg-[#001838] border-b border-cyan-500/30 flex items-center justify-between">
                      <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                        <Phone size={14} /> Contact &amp; Campus Directory
                      </h3>
                      <Link to="/contact" className="text-[10px] text-cyan-300 font-bold hover:underline">
                        Full Page →
                      </Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse">
                        <tbody className="divide-y divide-slate-800">
                          {CONTACT_DIRECTORY.map((ct, idx) => (
                            <tr key={idx} className="hover:bg-cyan-500/10">
                              <td className="py-2.5 px-3 font-bold text-cyan-300 text-[11px] w-1/3">{ct.title}</td>
                              <td className="py-2.5 px-3">
                                <p className="font-extrabold text-white">{ct.contact}</p>
                                <p className="text-slate-300 font-mono text-[11px]">{ct.detail}</p>
                                <p className="text-cyan-400 underline text-[10px]">{ct.email}</p>
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
              /* CATEGORIZED MENU HUB OF ALL 16+ PAGES */
              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#001026] border border-cyan-500/30">
                  <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <LayoutGrid size={16} className="text-cyan-400" />
                    All IEEE SREC Pages Directory
                  </h2>
                  <p className="text-[10px] text-slate-400">
                    1-tap access to all 16+ modules &amp; structured data tables
                  </p>
                </div>

                {/* Category 1: Leadership & Team */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 px-1">
                    Leadership &amp; Team
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAllPagesCategory("office-bearers")}
                      className="p-3 rounded-2xl bg-[#001026] border border-slate-700 hover:border-cyan-400 text-left active:scale-95 transition-all"
                    >
                      <Shield size={18} className="text-amber-400 mb-1" />
                      <p className="text-xs font-black text-white">Office Bearers</p>
                      <p className="text-[9px] text-slate-400">2025-26 Team Table</p>
                    </button>
                    <button
                      onClick={() => setAllPagesCategory("past-bearers")}
                      className="p-3 rounded-2xl bg-[#001026] border border-slate-700 hover:border-cyan-400 text-left active:scale-95 transition-all"
                    >
                      <GraduationCap size={18} className="text-blue-400 mb-1" />
                      <p className="text-xs font-black text-white">Past Bearers</p>
                      <p className="text-[9px] text-slate-400">2022-2025 Timeline</p>
                    </button>
                    <Link
                      to="/team"
                      className="p-3 rounded-2xl bg-[#001026] border border-slate-700 hover:border-cyan-400 text-left active:scale-95 transition-all"
                    >
                      <Users size={18} className="text-cyan-400 mb-1" />
                      <p className="text-xs font-black text-white">Executive Team</p>
                      <p className="text-[9px] text-slate-400">Full Directory</p>
                    </Link>
                    <Link
                      to="/about"
                      className="p-3 rounded-2xl bg-[#001026] border border-slate-700 hover:border-cyan-400 text-left active:scale-95 transition-all"
                    >
                      <Info size={18} className="text-indigo-400 mb-1" />
                      <p className="text-xs font-black text-white">About SREC SB</p>
                      <p className="text-[9px] text-slate-400">Code 64581 History</p>
                    </Link>
                  </div>
                </div>

                {/* Category 2: Activities, Awards & Plans */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 px-1">
                    Activities &amp; Honors
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAllPagesCategory("awards")}
                      className="p-3 rounded-2xl bg-[#001026] border border-slate-700 hover:border-cyan-400 text-left active:scale-95 transition-all"
                    >
                      <Award size={18} className="text-purple-400 mb-1" />
                      <p className="text-xs font-black text-white">Awards &amp; Honors</p>
                      <p className="text-[9px] text-slate-400">Madras Sec Accolades</p>
                    </button>
                    <button
                      onClick={() => setAllPagesCategory("plans")}
                      className="p-3 rounded-2xl bg-[#001026] border border-slate-700 hover:border-cyan-400 text-left active:scale-95 transition-all"
                    >
                      <Calendar size={18} className="text-blue-400 mb-1" />
                      <p className="text-xs font-black text-white">Annual Plans</p>
                      <p className="text-[9px] text-slate-400">Yearly Roadmap</p>
                    </button>
                    <button
                      onClick={() => setAllPagesCategory("funding")}
                      className="p-3 rounded-2xl bg-[#001026] border border-slate-700 hover:border-cyan-400 text-left active:scale-95 transition-all"
                    >
                      <DollarSign size={18} className="text-emerald-400 mb-1" />
                      <p className="text-xs font-black text-white">Funding &amp; Grants</p>
                      <p className="text-[9px] text-slate-400">Budget Breakdown</p>
                    </button>
                    <Link
                      to="/gallery"
                      className="p-3 rounded-2xl bg-[#001026] border border-slate-700 hover:border-cyan-400 text-left active:scale-95 transition-all"
                    >
                      <ImageIcon size={18} className="text-pink-400 mb-1" />
                      <p className="text-xs font-black text-white">Photo Gallery</p>
                      <p className="text-[9px] text-slate-400">Event Memories</p>
                    </Link>
                  </div>
                </div>

                {/* Category 3: Portals & Registration */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black uppercase tracking-wider text-cyan-400 px-1">
                    Portals &amp; Joining
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/membership-registration"
                      className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-400/60 text-left active:scale-95 transition-all"
                    >
                      <UserPlus size={18} className="text-cyan-300 mb-1" />
                      <p className="text-xs font-black text-white">Join / Register</p>
                      <p className="text-[9px] text-cyan-300">Student Membership</p>
                    </Link>
                    <a
                      href="http://aectsd2027.srecieee.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 border border-amber-400/60 text-left active:scale-95 transition-all"
                    >
                      <Sparkles size={18} className="text-amber-300 mb-1" />
                      <p className="text-xs font-black text-white">AECTSD 2027</p>
                      <p className="text-[9px] text-amber-300">Flagship Conference</p>
                    </a>
                    <button
                      onClick={() => setAllPagesCategory("contact")}
                      className="p-3 rounded-2xl bg-[#001026] border border-slate-700 hover:border-cyan-400 text-left active:scale-95 transition-all"
                    >
                      <Phone size={18} className="text-emerald-400 mb-1" />
                      <p className="text-xs font-black text-white">Contact &amp; Map</p>
                      <p className="text-[9px] text-slate-400">Campus Location</p>
                    </button>
                    <Link
                      to="/admin-login"
                      className="p-3 rounded-2xl bg-[#001026] border border-slate-700 hover:border-cyan-400 text-left active:scale-95 transition-all"
                    >
                      <ShieldCheck size={18} className="text-slate-400 mb-1" />
                      <p className="text-xs font-black text-white">Admin Portal</p>
                      <p className="text-[9px] text-slate-400">Restricted Access</p>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </main>

      {/* ── MEMBER DETAIL DOSSIER MODAL ──────────────────────────────────── */}
      <AnimatePresence>
        {detailModalMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-[#001026] border border-cyan-500/40 p-4 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <img
                    src={detailModalMember.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover border border-cyan-400"
                  />
                  <div>
                    <h3 className="font-extrabold text-white text-sm leading-tight">
                      {detailModalMember.first_name} {detailModalMember.last_name}
                    </h3>
                    <p className="text-[10px] text-cyan-300 font-mono">
                      {detailModalMember.roll_number} · IEEE #{detailModalMember.ieee_id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setDetailModalMember(null)}
                  className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Department</span>
                  <p className="text-white font-medium">{detailModalMember.department} ({detailModalMember.year_of_study})</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Statement of Purpose / Bio</span>
                  <p className="text-slate-300 text-[11px] italic">"{detailModalMember.bio_sop || "Active IEEE Student Member at SREC."}"</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Enrolled Societies</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {detailModalMember.target_societies.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-[9px] text-cyan-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">Skills &amp; Specialties</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {detailModalMember.skills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedMember(detailModalMember);
                    setDetailModalMember(null);
                    handleTabChange("id");
                  }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase text-center shadow-md flex items-center justify-center gap-1"
                >
                  <IdCard size={14} />
                  <span>Open 3D ID Card</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── GLOBAL SEARCH MODAL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm rounded-3xl bg-[#001026] border border-cyan-500/40 p-4 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Search size={14} /> Search App Directory
                </h3>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setGlobalSearchTerm("");
                  }}
                  className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
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
                className="w-full bg-[#000814] border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
              />

              {globalSearchTerm ? (
                <div className="max-h-60 overflow-y-auto space-y-1.5 text-xs">
                  {/* Matching members */}
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
                        className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-500/20 cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-white">{m.first_name} {m.last_name}</p>
                          <p className="text-[10px] text-cyan-300 font-mono">{m.roll_number} · {m.department}</p>
                        </div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Member</span>
                      </div>
                    ))}

                  {/* Matching societies */}
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
                      className="p-2 rounded-xl bg-slate-900 hover:bg-cyan-500/20 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-white">{s.name}</p>
                        <p className="text-[10px] text-cyan-300">{s.category}</p>
                      </div>
                      <span className="text-[9px] text-blue-400 font-bold uppercase">Society</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500 text-xs">
                  Type a name, roll number, or society to search instantly.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── STICKY BOTTOM NAVIGATION DOCK ────────────────────────────────── */}
      <MobileBottomNav
        activeTab={activeTab}
        onChangeTab={handleTabChange}
      />

    </div>
  );
};

export default MobileAppPage;
