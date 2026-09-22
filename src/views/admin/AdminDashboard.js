import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import OfficeBearers from "@/components/societies/OfficeBearers";
import SocietyLeadershipAdmin from "./SocietyLeadershipAdmin";
import OfficeBearerCardsAdmin from "./OfficeBearerCardsAdmin";
import EventReportsAdmin from "./EventReportsAdmin";
import LaunchControlRoom from "@/components/admin/LaunchControlRoom";
import PageVisibilityAdmin from "@/components/admin/PageVisibilityAdmin";
import { getPrimaryMemberCardPdfUrl, uploadMemberCardPdf } from "@/utils/cardPdfHelper";
import { Activity, Users, Settings, Briefcase, FileText, Banknote, ShieldCheck, LayoutDashboard, LogOut, TrendingUp, Search, Bell, Globe, Award, Layers, Download, Trash2, Crown, Cpu, RefreshCw, X, Plus, FileSpreadsheet, Check, ExternalLink, Upload, Eye, Loader2, ArrowRight, CreditCard, Menu, ChevronRight, Sparkles, Database, Rocket, Radio, Tv, Lock } from "lucide-react";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  // Sync activeTab with URL parameters or path
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
    else if (location.pathname.includes("bearer-cards") ||
      location.pathname.includes("office-cards") ||
      location.pathname.includes("officer-cards")) {
      setActiveTab("office_cards");
    }
  }, [location]);
  const [activities, setActivities] = useState([]);
  const [officeRows, setOfficeRows] = useState([]);
  const [memberRows, setMemberRows] = useState([]);
  const [annualPlans, setAnnualPlans] = useState([]);
  const [fundingRequests, setFundingRequests] = useState([]);
  const [seniorMembers, setSeniorMembers] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [awards, setAwards] = useState([]);
  const [editingSocietyId, setEditingSocietyId] = useState(null);
  const [editingAwardId, setEditingAwardId] = useState(null);
  const [societyForm, setSocietyForm] = useState({
    name: "",
    short_code: "",
    description: "",
    established_year: "2001",
    member_count: "50",
  });
  const [awardForm, setAwardForm] = useState({
    title: "",
    year: "2024",
    description: "",
    category: "IEEE Madras Section",
    amount: "",
    image_url: "",
  });
  const [appSearch, setAppSearch] = useState("");
  const [selectedAppIds, setSelectedAppIds] = useState([]);
  const [pageContents, setPageContents] = useState([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [editingContentId, setEditingContentId] = useState(null);
  const [contentForm, setContentForm] = useState({
    page_key: "",
    content_key: "",
    content_text: "",
  });
  const [adminsList, setAdminsList] = useState([]);
  const [adminForm, setAdminForm] = useState({
    username: "",
    password: "",
    role: "Master Administrator",
  });
  const [adminProfile, setAdminProfile] = useState(() => {
    const storedUser = sessionStorage.getItem("admin_username") || localStorage.getItem("admin_username") || "Admin Manager";
    const storedRole = sessionStorage.getItem("admin_role") || localStorage.getItem("admin_role") || "Master Administrator";
    const storedAvatar = sessionStorage.getItem("admin_avatar") || localStorage.getItem("admin_avatar") || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
    const storedEmail = sessionStorage.getItem("admin_email") || "admin@ieeesrec.org";
    return {
      username: storedUser,
      role: storedRole,
      avatar: storedAvatar,
      email: storedEmail,
    };
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: adminProfile.username,
    role: adminProfile.role,
    avatar: adminProfile.avatar,
  });

  // Role-Based Access Control (RBAC) Permissions Engine
  const userRoleLower = (adminProfile.role || "Master Administrator").toLowerCase();
  const isMaster = userRoleLower.includes("master") || userRoleLower.includes("super") || userRoleLower === "admin" || userRoleLower === "executive";
  const isSocietyLead = userRoleLower.includes("society") || userRoleLower.includes("chapter");
  const isEventManager = userRoleLower.includes("activit") || userRoleLower.includes("event") || userRoleLower.includes("program");
  const isRegistrar = userRoleLower.includes("membership") || userRoleLower.includes("registrar") || userRoleLower.includes("admission") || userRoleLower.includes("roster");
  const isAuditor = userRoleLower.includes("auditor") || userRoleLower.includes("viewer") || userRoleLower.includes("read-only");

  const permissions = useMemo(() => ({
    canManageAdmins: isMaster,
    canEditCMS: isMaster,
    canEditVisibility: isMaster,
    canApproveStudents: isMaster || isRegistrar,
    canDeleteStudents: isMaster || isRegistrar,
    canEditActivities: isMaster || isEventManager || isSocietyLead,
    canDeleteActivities: isMaster || isEventManager,
    canEditSocieties: isMaster || isSocietyLead,
    canDeleteSocieties: isMaster,
    canManageLaunchMode: isMaster || isEventManager,
    isReadOnly: isAuditor,
  }), [isMaster, isSocietyLead, isEventManager, isRegistrar, isAuditor]);

  const handleUpdateProfile = (e) => {
    e?.preventDefault();
    const updated = {
      ...adminProfile,
      username: profileForm.username.trim() || "Admin Manager",
      role: profileForm.role,
      avatar: profileForm.avatar.trim() || adminProfile.avatar,
    };
    setAdminProfile(updated);
    sessionStorage.setItem("admin_username", updated.username);
    sessionStorage.setItem("admin_role", updated.role);
    sessionStorage.setItem("admin_avatar", updated.avatar);
    localStorage.setItem("admin_username", updated.username);
    localStorage.setItem("admin_role", updated.role);
    localStorage.setItem("admin_avatar", updated.avatar);
    setShowProfileModal(false);
    alert(`Security clearance updated to: ${updated.role}`);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [cmsSubTab, setCmsSubTab] = useState("landing");
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.allSettled([
        fetchActivities(),
        fetchOfficeBearers(),
        fetchMembers(),
        fetchAnnualPlans(),
        fetchFundingRequests(),
        fetchSeniorMembers(),
        fetchSocieties(),
        fetchApplications(),
        fetchStudentMembers(),
        fetchAwards(),
        fetchPageContents(),
        fetchAdmins(),
      ]);
    } catch (err) {
      console.error("Refresh error:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };
  const monthlyEventData = useMemo(() => {
    const counts = Array(12).fill(0);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    activities.forEach(act => {
      if (act.date) {
        const dateObj = new Date(act.date);
        if (!isNaN(dateObj.getTime())) {
          const month = dateObj.getMonth();
          counts[month]++;
        }
      }
    });
    return monthNames.map((name, index) => ({
      month: name,
      val: counts[index]
    }));
  }, [activities]);
  // Calculate real student and professional distribution
  const memberDistribution = useMemo(() => {
    if (memberRows.length > 0) {
      const latest = memberRows[0];
      const students = latest.student_members || 0;
      const pros = latest.professional_members || 0;
      const total = latest.total_members || (students + pros) || 1;
      const studentPercent = Math.round((students / total) * 100);
      const profPercent = 100 - studentPercent;
      return { studentPercent, profPercent, studentCount: students, profCount: pros };
    }
    return { studentPercent: 75, profPercent: 25, studentCount: 150, profCount: 50 };
  }, [memberRows]);
  // Calculate real membership growth compared to previous record
  const memberGrowthPercent = useMemo(() => {
    if (memberRows.length >= 2) {
      const latest = memberRows[0].total_members || (memberRows[0].student_members + memberRows[0].professional_members);
      const prev = memberRows[1].total_members || (memberRows[1].student_members + memberRows[1].professional_members);
      if (prev > 0) {
        const pct = ((latest - prev) / prev) * 100;
        return (pct >= 0 ? "+" : "") + pct.toFixed(0) + "%";
      }
    }
    return "+15%";
  }, [memberRows]);
  // Calculate real activities growth compared to previous year
  const activitiesGrowthPercent = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentYearEvents = activities.filter(a => a.date && new Date(a.date).getFullYear() === currentYear).length;
    const lastYearEvents = activities.filter(a => a.date && new Date(a.date).getFullYear() === currentYear - 1).length;
    if (lastYearEvents > 0) {
      const pct = ((currentYearEvents - lastYearEvents) / lastYearEvents) * 100;
      return (pct >= 0 ? "+" : "") + pct.toFixed(0) + "%";
    }
    return "+12%";
  }, [activities]);
  const handleLogout = async () => {
    sessionStorage.removeItem("admin_auth");
    await supabase.auth.signOut();
    navigate("/admin-login");
  };
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState("");
  const [activitySearch, setActivitySearch] = useState("");
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [editingOfficeId, setEditingOfficeId] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editingPlanId, setEditingPlanId] = useState(null);
  const [editingFundingId, setEditingFundingId] = useState(null);
  const [editingSeniorId, setEditingSeniorId] = useState(null);
  // Student Members (`student_members` table) State
  const [studentMembers, setStudentMembers] = useState([]);
  const [studentMembersLoading, setStudentMembersLoading] = useState(false);
  const ALL_TECHNICAL_SOCIETIES = [
    "IEEE Student Branch SREC",
    "IEEE Women in Engineering (WIE)",
    "IEEE Computer Society (CS)",
    "IEEE Computational Intelligence Society (CIS)",
    "IEEE Communication Society (ComSoc)",
    "IEEE Engineering in Medicine and Biology (EMBS)",
    "IEEE Instrumentation and Measurement (IM)",
    "IEEE Power Electronics Society (PELS)",
    "IEEE Circuits and Systems Society (CAS)"
  ];
  const [memberSearch, setMemberSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [ieeeStatusFilter, setIeeeStatusFilter] = useState("ALL");
  const [societyFilter, setSocietyFilter] = useState("ALL");
  const matchesSocietyFilter = (targetSocieties, filter) => {
    if (!filter || filter === "ALL")
      return true;
    if (!targetSocieties)
      return false;
    let socList = [];
    if (Array.isArray(targetSocieties)) {
      socList = targetSocieties;
    }
    else if (typeof targetSocieties === "string") {
      try {
        const parsed = JSON.parse(targetSocieties);
        if (Array.isArray(parsed))
          socList = parsed;
        else
          socList = [targetSocieties];
      }
      catch {
        socList = targetSocieties.split(",").map((s) => s.trim());
      }
    }
    const f = filter.toLowerCase();
    return socList.some((soc) => {
      const s = String(soc).toLowerCase();
      if (s === f)
        return true;
      if (f.includes("pels") && (s.includes("pels") || s.includes("power")))
        return true;
      if (f.includes("cs") && (s.includes("computer") || s === "cs"))
        return true;
      if (f.includes("cis") && (s.includes("computational") || s.includes("cis")))
        return true;
      if (f.includes("comsoc") && (s.includes("communication") || s.includes("comsoc")))
        return true;
      if (f.includes("embs") && (s.includes("medicine") || s.includes("biology") || s.includes("embs")))
        return true;
      if (f.includes("im") && (s.includes("instrumentation") || s.includes("ims") || s === "im"))
        return true;
      if (f.includes("cas") && (s.includes("circuits") || s.includes("cas")))
        return true;
      if (f.includes("wie") && (s.includes("women") || s.includes("wie")))
        return true;
      if (f.includes("student branch") || f.includes("parent sb")) {
        return s.includes("student branch") || s.includes("parent sb") || s.includes("srec");
      }
      return s.includes(f) || f.includes(s);
    });
  };

  const filteredStudentList = useMemo(() => {
    return studentMembers.filter((m) => {
      const q = memberSearch.trim().toLowerCase();
      const matchesSearch = !q || [
        m.first_name, m.last_name, m.roll_number, m.email, m.ieee_id, m.department, m.year_of_study
      ].some(val => val?.toLowerCase().includes(q));
      const matchesDept = deptFilter === "ALL" || m.department === deptFilter;
      const matchesIeee = ieeeStatusFilter === "ALL"
        ? true
        : ieeeStatusFilter === "PENDING"
          ? m.ieee_id === "PENDING" || !m.ieee_id
          : m.ieee_id !== "PENDING" && Boolean(m.ieee_id);
      const matchesSociety = matchesSocietyFilter(m.target_societies, societyFilter);
      return matchesSearch && matchesDept && matchesIeee && matchesSociety;
    });
  }, [studentMembers, memberSearch, deptFilter, ieeeStatusFilter, societyFilter]);

  const [editingStudentMember, setEditingStudentMember] = useState(null);
  const [inspectingStudentMember, setInspectingStudentMember] = useState(null);
  const [isSavingStudentMember, setIsSavingStudentMember] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isUploadingAdminPdf, setIsUploadingAdminPdf] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    roll_number: "",
    email: "",
    first_name: "",
    last_name: "",
    ieee_id: "PENDING",
    phone: "",
    department: "CSE",
    year_of_study: "1st Year",
    gender: "Male",
    tshirt_size: "L",
    applicant_type: "undergraduate",
    membership_status: "ACTIVE",
    target_societies: ["IEEE Student Branch SREC", "IEEE Women in Engineering (WIE)"],
    card_pdf_url: "",
  });
  const handleAdminUploadPdf = async (file, isEditing) => {
    if (!file)
      return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      alert("Please select a valid PDF file.");
      return;
    }
    try {
      setIsUploadingAdminPdf(true);
      const identifier = isEditing
        ? (editingStudentMember?.ieee_id && editingStudentMember.ieee_id !== "PENDING" ? editingStudentMember.ieee_id : editingStudentMember?.roll_number || "member")
        : (newMemberForm.ieee_id && newMemberForm.ieee_id !== "PENDING" ? newMemberForm.ieee_id : newMemberForm.roll_number || "member");
      const publicUrl = await uploadMemberCardPdf(file, identifier);
      if (isEditing && editingStudentMember) {
        setEditingStudentMember({ ...editingStudentMember, card_pdf_url: publicUrl });
      }
      else {
        setNewMemberForm({ ...newMemberForm, card_pdf_url: publicUrl });
      }
      alert("IEEE Card PDF uploaded successfully!");
    }
    catch (err) {
      console.error("Admin PDF upload error:", err);
      alert("Upload failed: " + (err.message || ""));
    }
    finally {
      setIsUploadingAdminPdf(false);
    }
  };
  const [activityForm, setActivityForm] = useState({
    s_no: "",
    event: "",
    date: "",
    chief_guest: "",
    participants: "",
    image_url: "",
  });
  const [officeForm, setOfficeForm] = useState({
    name: "",
    role: "",
    department: "",
    academic_year: "2025-2026",
    year: "2025",
    group_name: "IEEE SB",
    image_url: "",
  });
  const [memberForm, setMemberForm] = useState({
    year: "2025",
    professional_members: "",
    student_members: "",
    total_members: "",
  });
  const [planForm, setPlanForm] = useState({
    s_no: "",
    event: "",
    sub_event: "",
    schedule: "",
  });
  const [fundingForm, setFundingForm] = useState({
    title: "",
    submission_type: "Annual Plan",
    description: "",
    budget_amount: "",
    contact_email: "",
  });
  const [seniorForm, setSeniorForm] = useState({
    name: "",
    s_no: "",
    current_role: "",
    college: "",
    linkedin_url: "",
    image_url: "",
  });
  const fetchActivities = async () => {
    setActivitiesLoading(true);
    setActivitiesError("");
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("s_no", { ascending: true });
    if (error) {
      setActivitiesError(error.message);
      setActivities([]);
    }
    else {
      setActivities(data || []);
    }
    setActivitiesLoading(false);
  };
const DEFAULT_SOCIETIES_LIST = [
  { id: 1, name: "IEEE Student Branch SREC (Main SB)", short_code: "srec", established_year: "2001", coordinator: "Dr. K. Balamurugan", description: "Established on 11 June 2001 under IEEE Madras Section. School Code: 41347756, Branch Code: 61491.", member_count: 350 },
  { id: 2, name: "IEEE Women in Engineering (WIE)", short_code: "wie", established_year: "2009", coordinator: "Mrs. Jansi Rani", description: "Supports and empowers women engineers and scientists through technical and leadership development.", member_count: 120 },
  { id: 3, name: "IEEE Engineering in Medicine and Biology (EMBS)", short_code: "embs", established_year: "2018", coordinator: "Dr. Deepa B Prabhu", description: "Focusing on biomedical engineering, healthcare technologies, and scientific innovation.", member_count: 65 },
  { id: 4, name: "IEEE Computer Society (CS)", short_code: "cs", established_year: "2019", coordinator: "Dr. J. Selvakumar", description: "Focusing on computer science, AI, software development, and emerging technologies.", member_count: 180 },
  { id: 5, name: "IEEE Communication Society (ComSoc)", short_code: "comsoc", established_year: "2024", coordinator: "Dr. K. Balamurugan", description: "Focusing on communication systems, networking, and signal processing technologies.", member_count: 75 },
  { id: 6, name: "IEEE Power Electronics Society (PELS)", short_code: "pels", established_year: "2024", coordinator: "Dr. C. Praveenkumar", description: "Focusing on power electronics, renewable energy systems, and electrical innovations.", member_count: 85 },
  { id: 7, name: "IEEE Instrumentation and Measurement (IM)", short_code: "im", established_year: "2025", coordinator: "Dr. Y. Dharsan", description: "Focusing on measurement systems, instrumentation technologies, and precision engineering.", member_count: 60 },
  { id: 8, name: "IEEE Computational Intelligence Society (CIS)", short_code: "cis", established_year: "2025", coordinator: "Dr. J. Selvakumar", description: "Focusing on artificial intelligence, machine learning, and intelligent systems.", member_count: 95 },
  { id: 9, name: "IEEE Circuits and Systems Society (CAS)", short_code: "cas", established_year: "2025", coordinator: "Dr. K. Balamurugan", description: "Focusing on circuits, integrated systems, signal processing, and VLSI design.", member_count: 70 }
];

const DEFAULT_MEMBER_COUNTS_DATA = [
  { id: 59, year: 2026, professional_members: 100, student_members: 250, total_members: 350 },
  { id: 1, year: 2025, professional_members: 23, student_members: 52, total_members: 75 },
  { id: 2, year: 2024, professional_members: 19, student_members: 60, total_members: 79 },
  { id: 3, year: 2023, professional_members: 21, student_members: 89, total_members: 110 },
  { id: 4, year: 2022, professional_members: 18, student_members: 102, total_members: 120 },
  { id: 5, year: 2021, professional_members: 16, student_members: 33, total_members: 49 },
  { id: 6, year: 2020, professional_members: 18, student_members: 63, total_members: 81 },
  { id: 7, year: 2019, professional_members: 18, student_members: 52, total_members: 70 },
  { id: 8, year: 2018, professional_members: 20, student_members: 104, total_members: 124 },
  { id: 9, year: 2017, professional_members: 29, student_members: 115, total_members: 144 },
  { id: 10, year: 2016, professional_members: 26, student_members: 118, total_members: 144 },
  { id: 11, year: 2015, professional_members: 25, student_members: 80, total_members: 105 },
  { id: 12, year: 2014, professional_members: 26, student_members: 132, total_members: 158 },
  { id: 13, year: 2013, professional_members: 17, student_members: 100, total_members: 117 },
  { id: 14, year: 2012, professional_members: 22, student_members: 90, total_members: 112 }
];

const DEFAULT_AWARDS_DATA = [
  { id: 1, title: 'Appreciation Award', year: 2026, description: 'Outstanding student branch performance and technical activities', category: 'IEEE Madras Section', amount: 'Rs.5000/-', image_url: '2026.jpg' },
  { id: 2, title: 'Appreciation Award', year: 2025, description: 'Appreciation award for organizing high-impact technical activities', category: 'IEEE Madras Section', amount: 'Rs.4500/-', image_url: '2025.jpeg' },
  { id: 3, title: 'Appreciation Award', year: 2024, description: 'Exemplary student branch activity and membership growth', category: 'IEEE Madras Section', amount: 'Rs.4000/-', image_url: '2024.jpeg' },
  { id: 4, title: 'Appreciation Award', year: 2023, description: 'Appreciation award for organizing IEEE technical activities', category: 'IEEE Madras Section', amount: 'Rs.3500/-', image_url: '2023.jpg' },
  { id: 5, title: 'Appreciation Award', year: 2022, description: 'Consistent active branch performance', category: 'IEEE Madras Section', amount: 'Rs.3500/-', image_url: '2022.jpg' },
  { id: 6, title: 'Appreciation Award', year: 2021, description: 'Excellence in organizing webinars & symposiums', category: 'IEEE Madras Section', amount: 'Rs.4000/-', image_url: '2021.jpg' },
  { id: 7, title: 'Appreciation Award', year: 2020, description: 'Virtual engagement and resilience award', category: 'IEEE Madras Section', amount: 'Rs.3000/-', image_url: '2020.jpg' },
  { id: 8, title: 'Appreciation Award', year: 2019, description: 'Active student chapter excellence', category: 'IEEE Madras Section', amount: 'Rs.3000/-', image_url: '2019.jpg' },
  { id: 9, title: 'Appreciation Award', year: 2018, description: 'Distinguished student branch award', category: 'IEEE Madras Section', amount: 'Rs.3000/-', image_url: '2018.jpeg' },
  { id: 10, title: 'Appreciation Award', year: 2017, description: 'Technical event participation & conference organizing', category: 'IEEE Madras Section', amount: 'Rs.2000/-', image_url: '2017.jpeg' }
];

const DEFAULT_SENIOR_MEMBERS_DATA = [
  { s_no: 1, name: "Dr. A. Soundarrajan", current_role: "Principal & Chief Patron", college: "Sri Ramakrishna Engineering College" },
  { s_no: 2, name: "Dr. K. Balamurugan", current_role: "Student Branch Counsellor", college: "Sri Ramakrishna Engineering College" },
  { s_no: 3, name: "Dr. J. Selvakumar", current_role: "Faculty Advisor, IEEE Computer Society", college: "Sri Ramakrishna Engineering College" },
  { s_no: 4, name: "Dr. C. Praveenkumar", current_role: "Faculty Advisor, IEEE Power Electronics Society", college: "Sri Ramakrishna Engineering College" },
  { s_no: 5, name: "Mrs. Jansi Rani", current_role: "Faculty Advisor, IEEE Women in Engineering", college: "Sri Ramakrishna Engineering College" },
  { s_no: 6, name: "Dr. Deepa B Prabhu", current_role: "Faculty Advisor, IEEE EMBS", college: "Sri Ramakrishna Engineering College" },
  { s_no: 7, name: "Dr. Y. Dharsan", current_role: "Faculty Advisor, IEEE Instrumentation & Measurement", college: "Sri Ramakrishna Engineering College" }
];

  const fetchOfficeBearers = async () => {
    try {
      const { data } = await supabase
        .from("office_bearers")
        .select("*")
        .order("year", { ascending: false })
        .order("id", { ascending: true });
      if (data && data.length > 0) {
        setOfficeRows(data);
      } else {
        const { data: srecData } = await supabase.from("srec_office_bearers").select("*");
        setOfficeRows(srecData && srecData.length > 0 ? srecData : []);
      }
    } catch {
      setOfficeRows([]);
    }
  };
  const fetchMembers = async () => {
    try {
      const { data } = await supabase
        .from("member_counts")
        .select("*")
        .order("year", { ascending: false });
      setMemberRows(data && data.length > 0 ? data : DEFAULT_MEMBER_COUNTS_DATA);
    } catch {
      setMemberRows(DEFAULT_MEMBER_COUNTS_DATA);
    }
  };
  const fetchAnnualPlans = async () => {
    const { data } = await supabase.from("annual_plan").select("*").order("s_no", { ascending: true });
    setAnnualPlans(data || []);
  };
  const fetchFundingRequests = async () => {
    const { data } = await supabase.from("funding_submissions").select("*").order("id", { ascending: false });
    setFundingRequests(data || []);
  };
  const fetchSeniorMembers = async () => {
    try {
      const { data } = await supabase.from("senior_members").select("*").order("s_no", { ascending: true });
      setSeniorMembers(data && data.length > 0 ? data : DEFAULT_SENIOR_MEMBERS_DATA);
    } catch {
      setSeniorMembers(DEFAULT_SENIOR_MEMBERS_DATA);
    }
  };
  const fetchPageContents = async () => {
    setContentLoading(true);
    const { data } = await supabase
      .from("page_content")
      .select("*")
      .order("page_key", { ascending: true })
      .order("content_key", { ascending: true });
    setPageContents(data || []);
    setContentLoading(false);
  };
  const fetchSocieties = async () => {
    try {
      const { data } = await supabase.from("societies").select("*").order("id", { ascending: true });
      setSocieties(data && data.length > 0 ? data : DEFAULT_SOCIETIES_LIST);
    } catch {
      setSocieties(DEFAULT_SOCIETIES_LIST);
    }
  };
  const fetchApplications = async () => {
    const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    setApplications(data || []);
  };
  const fetchStudentMembers = async () => {
    setStudentMembersLoading(true);
    try {
      const { data, error } = await supabase
        .from("student_members")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setStudentMembers(data);
      }
    } catch (err) {
      console.warn("fetchStudentMembers note:", err);
    } finally {
      setStudentMembersLoading(false);
    }
  };
  const updateStudentMember = async (e) => {
    e.preventDefault();
    if (!editingStudentMember)
      return;
    setIsSavingStudentMember(true);
    try {
      const cleanRoll = String(editingStudentMember.roll_number || "").trim().toUpperCase();
      const updateData = {
        roll_number: cleanRoll,
        email: editingStudentMember.email ? editingStudentMember.email.trim() : "",
        first_name: editingStudentMember.first_name ? editingStudentMember.first_name.trim() : "",
        last_name: editingStudentMember.last_name ? editingStudentMember.last_name.trim() : "",
        ieee_id: editingStudentMember.ieee_id ? editingStudentMember.ieee_id.trim() : "PENDING",
        department: editingStudentMember.department,
        year_of_study: editingStudentMember.year_of_study,
        gender: editingStudentMember.gender,
        tshirt_size: editingStudentMember.tshirt_size,
        applicant_type: editingStudentMember.applicant_type,
        membership_status: editingStudentMember.membership_status,
        phone: editingStudentMember.phone ? editingStudentMember.phone.trim() : null,
        target_societies: editingStudentMember.target_societies || ["IEEE Student Branch SREC"],
      };
      if (editingStudentMember.card_pdf_url?.trim()) {
        updateData.card_pdf_url = editingStudentMember.card_pdf_url.trim();
      }

      let result = await supabase
        .from("student_members")
        .update(updateData)
        .eq("id", editingStudentMember.id);

      // Dynamically remove any column that is missing in Supabase schema cache and retry
      while (result.error && result.error.message && (result.error.message.includes("Could not find the '") || result.error.message.includes("column") || result.error.message.includes("does not exist"))) {
        const match = result.error.message.match(/Could not find the '([^']+)' column/) ||
          result.error.message.match(/column "([^"]+)" of relation/) ||
          result.error.message.match(/column "([^"]+)" does not exist/);
        if (match && match[1] && updateData[match[1]] !== undefined) {
          console.warn(`Removing missing column '${match[1]}' from update payload and retrying`);
          delete updateData[match[1]];
          result = await supabase
            .from("student_members")
            .update(updateData)
            .eq("id", editingStudentMember.id);
        } else {
          break;
        }
      }

      if (result.error) {
        alert("Error updating member: " + result.error.message);
      }
      else {
        alert("Student Member record updated successfully!");
        setEditingStudentMember(null);
        fetchStudentMembers();
      }
    }
    catch (err) {
      alert("Update failed: " + err.message);
    }
    finally {
      setIsSavingStudentMember(false);
    }
  };
  const handleDeleteStudentMember = async (id, rollNo) => {
    if (!confirm(`Are you sure you want to delete member record with Roll Number: ${rollNo}?`))
      return;
    try {
      const { error } = await supabase
        .from("student_members")
        .delete()
        .eq("id", id);
      if (error) {
        alert("Error deleting member: " + error.message);
      }
      else {
        setStudentMembers(prev => prev.filter(m => m.id !== id));
      }
    }
    catch (err) {
      alert("Delete failed: " + err.message);
    }
  };
  const handleAddStudentMember = async (e) => {
    e.preventDefault();
    if (!newMemberForm.roll_number.trim() || !newMemberForm.email.trim() || !newMemberForm.first_name.trim() || !newMemberForm.last_name.trim()) {
      alert("Please fill in all required fields (Roll Number, Email, First Name, Last Name).");
      return;
    }
    setIsAddingMember(true);
    try {
      const cleanRoll = newMemberForm.roll_number.trim().toUpperCase();
      const defaultPassword = `srecieee@${cleanRoll}`;
      const payload = {
        roll_number: cleanRoll,
        email: newMemberForm.email.trim(),
        first_name: newMemberForm.first_name.trim(),
        last_name: newMemberForm.last_name.trim(),
        ieee_id: newMemberForm.ieee_id.trim() || "PENDING",
        phone: newMemberForm.phone.trim() || null,
        department: newMemberForm.department,
        year_of_study: newMemberForm.year_of_study,
        gender: newMemberForm.gender,
        tshirt_size: newMemberForm.tshirt_size,
        applicant_type: newMemberForm.applicant_type,
        membership_status: newMemberForm.membership_status,
        password: defaultPassword,
        security_pin: defaultPassword,
        target_societies: newMemberForm.target_societies.length ? newMemberForm.target_societies : ["IEEE Student Branch SREC"],
      };
      if (newMemberForm.card_pdf_url?.trim()) {
        payload.card_pdf_url = newMemberForm.card_pdf_url.trim();
      }
      let result = await supabase.from("student_members").insert([payload]);
      
      // Dynamically remove any column missing in Supabase schema and retry
      while (result.error && result.error.message && (result.error.message.includes("Could not find the '") || result.error.message.includes("column") || result.error.message.includes("does not exist"))) {
        const match = result.error.message.match(/Could not find the '([^']+)' column/) ||
          result.error.message.match(/column "([^"]+)" of relation/) ||
          result.error.message.match(/column "([^"]+)" does not exist/);
        if (match && match[1] && payload[match[1]] !== undefined) {
          console.warn(`Removing missing column '${match[1]}' from insert payload and retrying`);
          delete payload[match[1]];
          result = await supabase.from("student_members").insert([payload]);
        } else {
          break;
        }
      }

      if (result.error) {
        alert("Error adding student member: " + result.error.message);
      }
      else {
        alert("New Student Member added successfully!");
        setIsAddMemberOpen(false);
        setNewMemberForm({
          roll_number: "",
          email: "",
          first_name: "",
          last_name: "",
          ieee_id: "PENDING",
          phone: "",
          department: "CSE",
          year_of_study: "1st Year",
          gender: "Male",
          tshirt_size: "L",
          applicant_type: "undergraduate",
          membership_status: "ACTIVE",
          target_societies: ["IEEE Student Branch SREC", "IEEE Women in Engineering (WIE)"],
          card_pdf_url: "",
        });
        fetchStudentMembers();
      }
    }
    catch (err) {
      alert("Add member failed: " + err.message);
    }
    finally {
      setIsAddingMember(false);
    }
  };
  const fetchAwards = async () => {
    try {
      const { data } = await supabase.from("awards").select("*").order("year", { ascending: false }).order("id", { ascending: true });
      setAwards(data && data.length > 0 ? data : DEFAULT_AWARDS_DATA);
    } catch {
      setAwards(DEFAULT_AWARDS_DATA);
    }
  };
  const fetchAdmins = async () => {
    const { data } = await supabase.from("admins").select("*").order("id", { ascending: true });
    setAdminsList(data || []);
  };
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const localAdmin = sessionStorage.getItem("admin_auth");
      if (!session && localAdmin !== "true") {
        navigate("/admin-login");
      }
    };
    checkAuth();
    handleRefreshAll();
  }, [navigate]);

  // Dynamic live fetch whenever active tab changes
  useEffect(() => {
    switch (activeTab) {
      case "student_roster":
        fetchStudentMembers();
        break;
      case "activities":
        fetchActivities();
        break;
      case "office":
        fetchOfficeBearers();
        break;
      case "plans":
        fetchAnnualPlans();
        break;
      case "funding":
        fetchFundingRequests();
        break;
      case "societies":
        fetchSocieties();
        break;
      case "applications":
        fetchApplications();
        break;
      case "awards":
        fetchAwards();
        break;
      case "senior":
        fetchSeniorMembers();
        break;
      case "members":
        fetchMembers();
        break;
      case "cms":
      case "cms_landing":
      case "cms_about":
      case "cms_contact":
      case "cms_advanced":
        fetchPageContents();
        break;
      case "admin_users":
        fetchAdmins();
        break;
      case "overview":
      default:
        handleRefreshAll();
        break;
    }
  }, [activeTab]);

  // Real-time Database Subscriptions for Live Sync across all tables
  useEffect(() => {
    const liveChannel = supabase
      .channel("admin_live_data_feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "student_members" }, () => {
        fetchStudentMembers();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "activities" }, () => {
        fetchActivities();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => {
        fetchApplications();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "awards" }, () => {
        fetchAwards();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "office_bearers" }, () => {
        fetchOfficeBearers();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "event_reports" }, () => {
        // Event reports sub-component automatically listens or updates
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "annual_plan" }, () => {
        fetchAnnualPlans();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "funding_submissions" }, () => {
        fetchFundingRequests();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "societies" }, () => {
        fetchSocieties();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "page_content" }, () => {
        fetchPageContents();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(liveChannel);
    };
  }, []);
  // Auto Logout due to inactivity (30 minutes)
  useEffect(() => {
    let timeoutId;
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    const logoutUser = async () => {
      sessionStorage.removeItem("admin_auth");
      await supabase.auth.signOut();
      alert("You have been automatically logged out due to inactivity.");
      navigate("/admin-login");
    };
    const resetTimer = () => {
      if (timeoutId)
        clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutUser, INACTIVITY_TIMEOUT);
    };
    const events = ["mousemove", "keydown", "mousedown", "scroll", "touchstart"];
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    resetTimer();
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      if (timeoutId)
        clearTimeout(timeoutId);
    };
  }, [navigate]);
  const resetActivityForm = () => {
    setEditingActivityId(null);
    setActivityForm({
      s_no: "",
      event: "",
      date: "",
      chief_guest: "",
      participants: "",
      image_url: "",
    });
  };
  const resetOfficeForm = () => {
    setEditingOfficeId(null);
    setOfficeForm({
      name: "",
      role: "",
      department: "",
      academic_year: "2025-2026",
      year: "2025",
      group_name: "IEEE SB",
      image_url: "",
    });
  };
  const resetMemberForm = () => {
    setEditingMemberId(null);
    setMemberForm({
      year: "2025",
      professional_members: "",
      student_members: "",
      total_members: "",
    });
  };
  const resetPlanForm = () => {
    setEditingPlanId(null);
    setPlanForm({ s_no: "", event: "", sub_event: "", schedule: "" });
  };
  const resetFundingForm = () => {
    setEditingFundingId(null);
    setFundingForm({ title: "", submission_type: "Annual Plan", description: "", budget_amount: "", contact_email: "" });
  };
  const resetSeniorForm = () => {
    setEditingSeniorId(null);
    setSeniorForm({ name: "", s_no: "", current_role: "", college: "", linkedin_url: "", image_url: "" });
  };
  const submitActivity = async (e) => {
    e.preventDefault();
    const payload = {
      s_no: Number(activityForm.s_no),
      event: activityForm.event.trim(),
      date: activityForm.date.trim() || null,
      chief_guest: activityForm.chief_guest.trim() || null,
      participants: activityForm.participants.trim() || null,
      image_url: activityForm.image_url.trim() || null,
    };
    if (!payload.s_no || !payload.event) {
      alert("S.No and Event are required");
      return;
    }
    if (editingActivityId) {
      const { error } = await supabase
        .from("activities")
        .update(payload)
        .eq("id", editingActivityId);
      if (error) {
        alert(error.message);
        return;
      }
    }
    else {
      const { error } = await supabase.from("activities").insert([payload]);
      if (error) {
        alert(error.message);
        return;
      }
    }
    resetActivityForm();
    fetchActivities();
  };
  const submitOffice = async (e) => {
    e.preventDefault();
    const payload = {
      name: officeForm.name.trim(),
      role: officeForm.role.trim(),
      department: officeForm.department.trim() || null,
      academic_year: officeForm.academic_year.trim() || null,
      year: Number(officeForm.year),
      group_name: officeForm.group_name.trim() || "IEEE SB",
      image_url: officeForm.image_url.trim() || null,
    };
    if (editingOfficeId) {
      const { data, error } = await supabase.from("office_bearers").update(payload).eq("id", editingOfficeId).select();
      if (error) {
        alert("Error: " + error.message);
        return;
      }
      if (!data || data.length === 0) {
        alert("UPDATE BLOCKED: You haven't run the SQL code in alter_schema.sql! Your database's Row Level Security is still blocking changes.");
        return;
      }
    }
    else {
      const { error } = await supabase.from("office_bearers").insert([payload]);
      if (error) {
        alert("Failed to insert office bearer: " + error.message);
        console.error(error);
        return;
      }
    }
    resetOfficeForm();
    fetchOfficeBearers();
  };
  const submitMember = async (e) => {
    e.preventDefault();
    const payload = {
      year: Number(memberForm.year),
      professional_members: Number(memberForm.professional_members),
      student_members: Number(memberForm.student_members),
      total_members: Number(memberForm.total_members),
    };
    if (editingMemberId) {
      const { error } = await supabase.from("member_counts").update(payload).eq("id", editingMemberId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    else {
      const { error } = await supabase.from("member_counts").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetMemberForm();
    fetchMembers();
  };
  const deleteActivity = async (id) => {
    const ok = window.confirm("Delete this activity?");
    if (!ok)
      return;
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchActivities();
  };
  const deleteOffice = async (id) => {
    const ok = window.confirm("Delete this office bearer?");
    if (!ok)
      return;
    const { data, error } = await supabase.from("office_bearers").delete().eq("id", id).select();
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    if (!data || data.length === 0) {
      alert("DELETE BLOCKED: You haven't run the SQL code in alter_schema.sql! Your database's Row Level Security is still blocking changes.");
      return;
    }
    fetchOfficeBearers();
  };
  const deleteMember = async (id) => {
    const ok = window.confirm("Delete this member count?");
    if (!ok)
      return;
    const { error } = await supabase.from("member_counts").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchMembers();
  };
  const submitPlan = async (e) => {
    e.preventDefault();
    const payload = {
      s_no: Number(planForm.s_no),
      event: planForm.event,
      sub_event: planForm.sub_event || null,
      schedule: planForm.schedule,
    };
    if (editingPlanId) {
      const { error } = await supabase.from("annual_plan").update(payload).eq("id", editingPlanId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    else {
      const { error } = await supabase.from("annual_plan").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetPlanForm();
    fetchAnnualPlans();
  };
  const submitFunding = async (e) => {
    e.preventDefault();
    const payload = {
      title: fundingForm.title,
      submission_type: fundingForm.submission_type,
      description: fundingForm.description || null,
      budget_amount: Number(fundingForm.budget_amount) || null,
      contact_email: fundingForm.contact_email || null,
    };
    if (editingFundingId) {
      const { error } = await supabase.from("funding_submissions").update(payload).eq("id", editingFundingId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    else {
      const { error } = await supabase.from("funding_submissions").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetFundingForm();
    fetchFundingRequests();
  };
  const deletePlan = async (id) => {
    const ok = window.confirm("Delete this annual plan?");
    if (!ok)
      return;
    const { error } = await supabase.from("annual_plan").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchAnnualPlans();
  };
  const deleteFunding = async (id) => {
    const ok = window.confirm("Delete this funding request?");
    if (!ok)
      return;
    const { error } = await supabase.from("funding_submissions").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchFundingRequests();
  };
  const submitSenior = async (e) => {
    e.preventDefault();
    const payload = {
      name: seniorForm.name,
      s_no: Number(seniorForm.s_no) || null,
      current_role: seniorForm.current_role || null,
      college: seniorForm.college || null,
      linkedin_url: seniorForm.linkedin_url || null,
      image_url: seniorForm.image_url || null,
    };
    if (editingSeniorId) {
      const { error } = await supabase.from("senior_members").update(payload).eq("id", editingSeniorId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    else {
      const { error } = await supabase.from("senior_members").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetSeniorForm();
    fetchSeniorMembers();
  };
  const deleteSenior = async (id) => {
    const ok = window.confirm("Delete this senior member?");
    if (!ok)
      return;
    const { error } = await supabase.from("senior_members").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchSeniorMembers();
  };
  const resetSocietyForm = () => {
    setEditingSocietyId(null);
    setSocietyForm({ name: "", short_code: "", description: "", established_year: "2001", member_count: "50" });
  };
  const submitSociety = async (e) => {
    e.preventDefault();
    const payload = {
      name: societyForm.name.trim(),
      short_code: societyForm.short_code.trim() || null,
      description: societyForm.description.trim() || null,
      established_year: Number(societyForm.established_year) || 2001,
      member_count: Number(societyForm.member_count) || 50,
    };
    if (!payload.name) {
      alert("Society name is required.");
      return;
    }
    if (editingSocietyId) {
      const { error } = await supabase.from("societies").update(payload).eq("id", editingSocietyId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    else {
      const { error } = await supabase.from("societies").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetSocietyForm();
    fetchSocieties();
  };
  const deleteSociety = async (id) => {
    const ok = window.confirm("Delete this society?");
    if (!ok)
      return;
    const { error } = await supabase.from("societies").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchSocieties();
  };
  const deleteApplication = async (id) => {
    const ok = window.confirm("Delete this join application?");
    if (!ok)
      return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchApplications();
  };
  const resetAwardForm = () => {
    setEditingAwardId(null);
    setAwardForm({ title: "", year: "2024", description: "", category: "IEEE Madras Section", amount: "", image_url: "" });
  };
  const submitAward = async (e) => {
    e.preventDefault();
    const payload = {
      title: awardForm.title.trim(),
      year: Number(awardForm.year) || new Date().getFullYear(),
      description: awardForm.description.trim() || null,
      category: awardForm.category.trim() || null,
      amount: awardForm.amount.trim() || null,
      image_url: awardForm.image_url.trim() || null,
    };
    if (!payload.title) {
      alert("Award title is required.");
      return;
    }
    if (editingAwardId) {
      const { error } = await supabase.from("awards").update(payload).eq("id", editingAwardId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    else {
      const { error } = await supabase.from("awards").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetAwardForm();
    fetchAwards();
  };
  const deleteAward = async (id) => {
    const ok = window.confirm("Delete this award?");
    if (!ok)
      return;
    const { error } = await supabase.from("awards").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchAwards();
  };
  const deleteSelectedApplications = async () => {
    if (selectedAppIds.length === 0)
      return alert("No applications selected.");
    if (!confirm(`Are you sure you want to delete ${selectedAppIds.length} selected applications?`))
      return;
    try {
      const { error } = await supabase.from("applications").delete().in("id", selectedAppIds);
      if (error) {
        await supabase.from("student_applications").delete().in("id", selectedAppIds);
      }
      setSelectedAppIds([]);
      await fetchApplications();
      alert(`Successfully deleted ${selectedAppIds.length} applications.`);
    }
    catch (err) {
      const msg = err instanceof Error ? err.message : "Error deleting applications";
      alert("Error deleting applications: " + msg);
    }
  };
  const downloadSelectedReceipts = () => {
    if (selectedAppIds.length === 0)
      return alert("No applications selected for receipt download.");
    const selectedApps = applications.filter(a => selectedAppIds.includes(a.id));
    let content = `====================================================\n`;
    content += `       IEEE SREC STUDENT BRANCH - OFFICIAL RECEIPT     \n`;
    content += `====================================================\n\n`;
    content += `Generated Date: ${new Date().toLocaleString()}\n`;
    content += `Total Records Selected: ${selectedApps.length}\n\n`;
    selectedApps.forEach((app, idx) => {
      content += `----------------------------------------------------\n`;
      content += `RECEIPT #${idx + 1}\n`;
      content += `Application ID : ${app.id}\n`;
      content += `Student Name   : ${app.first_name} ${app.last_name}\n`;
      content += `Email          : ${app.email}\n`;
      content += `Department     : ${app.department} (${app.year_of_study || 'N/A'})\n`;
      content += `Target Society : ${app.target_society || 'IEEE SREC SB'}\n`;
      content += `Submission Date: ${app.created_at ? new Date(app.created_at).toLocaleString() : 'N/A'}\n`;
      content += `Membership Expiry: DEC 31, ${new Date(app.created_at || Date.now()).getFullYear() + 1}\n`;
      content += `Notes / SOP    : ${app.statement_of_purpose || 'N/A'}\n`;
      content += `----------------------------------------------------\n\n`;
    });
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IEEE_SREC_Student_Receipts_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const exportToExcel = (filename, headers, rows) => {
    const processCell = (val) => {
      if (val === null || val === undefined)
        return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };
    const csvContent = "\uFEFF" + [
      headers.map(h => `"${h.replace(/"/g, '""')}"`).join(","),
      ...rows.map(row => row.map(processCell).join(","))
    ].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  const exportApplicationsToExcel = () => {
    const targetList = selectedAppIds.length > 0
      ? applications.filter(a => selectedAppIds.includes(a.id))
      : applications;
    if (targetList.length === 0) {
      alert("No submission data available to export.");
      return;
    }
    const headers = [
      "Application ID",
      "First Name",
      "Last Name",
      "Full Name",
      "Register / Roll Number",
      "Email",
      "Department",
      "Year of Study",
      "Target Societies",
      "Skills",
      "Statement of Purpose",
      "Submission Date"
    ];
    const rows = targetList.map(app => [
      app.id,
      app.first_name || "",
      app.last_name || "",
      app.full_name || `${app.first_name || ''} ${app.last_name || ''}`.trim(),
      app.register_number || "",
      app.email || "",
      app.department || "",
      app.year_of_study || "",
      app.target_society || "",
      Array.isArray(app.skills) ? app.skills.join("; ") : "",
      app.statement_of_purpose || "",
      app.created_at ? new Date(app.created_at).toLocaleString("en-IN") : ""
    ]);
    exportToExcel("IEEE_SREC_Join_Submissions", headers, rows);
  };
  const exportStudentMembersToExcel = () => {
    const filtered = studentMembers.filter((m) => {
      const q = memberSearch.trim().toLowerCase();
      const matchesSearch = !q || [
        m.first_name, m.last_name, m.roll_number, m.email, m.ieee_id, m.department, m.year_of_study
      ].some(val => val?.toLowerCase().includes(q));
      const matchesDept = deptFilter === "ALL" || m.department === deptFilter;
      const matchesIeee = ieeeStatusFilter === "ALL"
        ? true
        : ieeeStatusFilter === "PENDING"
          ? m.ieee_id === "PENDING" || !m.ieee_id
          : m.ieee_id !== "PENDING" && Boolean(m.ieee_id);
      const matchesSociety = matchesSocietyFilter(m.target_societies, societyFilter);
      return matchesSearch && matchesDept && matchesIeee && matchesSociety;
    });
    if (filtered.length === 0) {
      alert("No student members match the active filters to export.");
      return;
    }
    const headers = [
      "Roll Number",
      "IEEE Member ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Department",
      "Year of Study",
      "Gender",
      "T-Shirt Size",
      "Category",
      "Status",
      "Selected Societies",
      "Registered Date"
    ];
    const rows = filtered.map(m => [
      m.roll_number || "",
      m.ieee_id || "PENDING",
      m.first_name || "",
      m.last_name || "",
      m.email || "",
      m.phone || "",
      m.department || "",
      m.year_of_study || "",
      m.gender || "",
      m.tshirt_size || "",
      m.applicant_type || "undergraduate",
      m.membership_status || "ACTIVE",
      Array.isArray(m.target_societies) ? m.target_societies.join("; ") : "IEEE Student Branch SREC",
      m.created_at ? new Date(m.created_at).toLocaleString("en-IN") : ""
    ]);
    exportToExcel("IEEE_SREC_Student_Members_Roster", headers, rows);
  };
  const resetContentForm = () => {
    setEditingContentId(null);
    setContentForm({
      page_key: "",
      content_key: "",
      content_text: "",
    });
  };
  const submitContent = async (e) => {
    e.preventDefault();
    if (!contentForm.page_key || !contentForm.content_key || !contentForm.content_text) {
      alert("Please fill in all fields.");
      return;
    }
    const payload = {
      page_key: contentForm.page_key,
      content_key: contentForm.content_key,
      content_text: contentForm.content_text,
    };
    if (editingContentId) {
      const { error } = await supabase.from("page_content").update(payload).eq("id", editingContentId);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    else {
      const { error } = await supabase.from("page_content").insert([payload]);
      if (error) {
        alert("Error: " + error.message);
        return;
      }
    }
    resetContentForm();
    fetchPageContents();
  };
  const deleteContent = async (id) => {
    const ok = window.confirm("Delete this content key?");
    if (!ok)
      return;
    const { error } = await supabase.from("page_content").delete().eq("id", id);
    if (error) {
      alert("Error: " + error.message);
      return;
    }
    fetchPageContents();
  };
  const upsertContent = async (page_key, content_key, content_text) => {
    const { error } = await supabase
      .from("page_content")
      .upsert({ page_key, content_key, content_text }, { onConflict: "page_key,content_key" });
    if (error) {
      alert("Error saving: " + error.message);
    }
    else {
      fetchPageContents();
    }
  };
  const addAdminUser = async (e) => {
    e.preventDefault();
    if (!permissions.canManageAdmins) {
      alert("Permission Denied: Only Master Administrators can provision new admin accounts.");
      return;
    }
    if (!adminForm.username || !adminForm.password) {
      alert("Please fill in both fields.");
      return;
    }
    const payload = {
      username: adminForm.username.trim(),
      password: adminForm.password.trim(),
      role: adminForm.role || "Master Administrator",
    };
    let { error } = await supabase.from("admins").insert([payload]);
    if (error && error.message && (error.message.includes("role") || error.message.includes("column"))) {
      // If table doesn't have role column, fallback without role column
      const fallback = await supabase.from("admins").insert([{
        username: payload.username,
        password: payload.password,
      }]);
      error = fallback.error;
    }
    if (error) {
      alert("Error adding admin: " + error.message);
    }
    else {
      setAdminForm({ username: "", password: "", role: "Master Administrator" });
      fetchAdmins();
      alert(`Admin account '${payload.username}' registered successfully with clearance: ${payload.role}!`);
    }
  };
  const deleteAdminUser = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this admin account?");
    if (!ok)
      return;
    const { error } = await supabase.from("admins").delete().eq("id", id);
    if (error) {
      alert("Error deleting admin: " + error.message);
    }
    else {
      fetchAdmins();
    }
  };
  const filteredActivities = useMemo(() => {
    const q = activitySearch.trim().toLowerCase();
    if (!q)
      return activities;
    return activities.filter((item) => [
      item.s_no?.toString(),
      item.event,
      item.date,
      item.chief_guest,
      item.participants,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(q));
  }, [activities, activitySearch]);
  const tabs = [
    { id: "overview", label: "Dashboard Overview", icon: <LayoutDashboard size={18} /> },
    { id: "launch_control", label: "Launch Mode & Remote", icon: <Rocket size={18} /> },
    { id: "student_roster", label: "Student Roster", icon: <Users size={18} /> },
    { id: "office", label: "Main SB Bearers", icon: <Briefcase size={18} /> },
    { id: "society_leaders", label: "Society Leaders", icon: <Crown size={18} /> },
    { id: "office_cards", label: "Officer ID Cards", icon: <CreditCard size={18} /> },
    { id: "senior", label: "Senior Members", icon: <ShieldCheck size={18} /> },
    { id: "members", label: "Members Track", icon: <Users size={18} /> },
    { id: "activities", label: "Activities", icon: <Activity size={18} /> },
    { id: "event_reports", label: "Event Reports (DB)", icon: <FileText size={18} /> },
    { id: "plans", label: "Annual Plans", icon: <FileText size={18} /> },
    { id: "funding", label: "Funding Requests", icon: <Banknote size={18} /> },
    { id: "societies", label: "Societies & Chapters", icon: <Layers size={18} /> },
    { id: "applications", label: "Join Submissions", icon: <FileText size={18} /> },
    { id: "awards", label: "Awards & Honors", icon: <Award size={18} /> },
    { id: "cms", label: "Website Content CMS", icon: <FileText size={18} /> },
    { id: "page_visibility", label: "Page Visibility & Nav", icon: <Eye size={18} /> },
    { id: "admin_users", label: "Admin Accounts", icon: <ShieldCheck size={18} /> },
  ];
  return (
    <div className="flex min-h-screen bg-[#f4f7fb] font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    {/* MOBILE FULL-SCREEN / SLIDE-OVER MILK WHITE DRAWER */}
    {isDrawerOpen && (
      <div className="fixed inset-0 z-50 lg:hidden flex">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={() => setIsDrawerOpen(false)} />

        {/* Drawer Sidebar */}
        <div className="relative flex flex-col w-[85%] max-w-xs bg-white border-r border-slate-200 h-full z-10 overflow-y-auto custom-scrollbar shadow-2xl">
          {/* Drawer Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/30">
                <Crown className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  IEEE SREC ADMIN
                </h3>
                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">
                  Executive Suite
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900"
            >
              <X size={16} />
            </button>
          </div>

          {/* Drawer Menu Items */}
          <div className="flex-1 px-3 py-4 space-y-6">
            {/* Mission Control */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">MISSION CONTROL</p>
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "overview"
                  ? "bg-slate-900 text-white font-black shadow-md border border-slate-900"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("launch_control");
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "launch_control"
                  ? "bg-blue-600 text-white font-black shadow-md border border-blue-600"
                  : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"}`}
              >
                <div className="flex items-center gap-2">
                  <Rocket size={16} className={activeTab === "launch_control" ? "text-white" : "text-blue-600 animate-pulse"} />
                  <span>Launch Mode &amp; Remote</span>
                </div>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-blue-600 text-white uppercase">
                  Live
                </span>
              </button>
            </div>

            {/* Members & Leaders */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">MEMBERS &amp; LEADERS</p>
              <div className="space-y-1">
                {[
                  { id: "student_roster", label: `Student Roster (${studentMembers.length})`, icon: <Users size={16} />, count: studentMembers.length, highlight: true },
                  { id: "office", label: "Main SB Bearers", icon: <Briefcase size={16} />, count: officeRows.length },
                  { id: "society_leaders", label: "Society Leaders", icon: <Crown size={16} /> },
                  { id: "office_cards", label: "Officer ID Cards", icon: <CreditCard size={16} /> },
                  { id: "senior", label: "Senior Members", icon: <ShieldCheck size={16} /> },
                  { id: "members", label: "Members Track", icon: <Users size={16} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === item.id
                      ? "bg-slate-900 text-white font-black shadow-md border border-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === item.id ? "bg-white/20 text-white font-black" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Activities & Programs */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">ACTIVITIES &amp; PROGRAMMES</p>
              <div className="space-y-1">
                {[
                  { id: "activities", label: "Activities", icon: <Activity size={16} />, count: activities.length },
                  { id: "event_reports", label: "Event Reports (DB)", icon: <FileText size={16} /> },
                  { id: "plans", label: "Annual Plans", icon: <FileText size={16} /> },
                  { id: "funding", label: "Funding Requests", icon: <Banknote size={16} /> },
                  { id: "societies", label: "Societies & Chapters", icon: <Layers size={16} />, count: societies.length },
                  { id: "applications", label: "Join Submissions", icon: <FileText size={16} />, count: applications.length },
                  { id: "awards", label: "Awards & Honors", icon: <Award size={16} />, count: awards.length },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === item.id
                      ? "bg-slate-900 text-white font-black shadow-md border border-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === item.id ? "bg-white/20 text-white font-black" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CMS & Settings */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">CMS &amp; CONFIG</p>
              <div className="space-y-1">
                {[
                  { id: "cms", label: "Website Content CMS", icon: <FileText size={16} /> },
                  { id: "page_visibility", label: "Page Visibility & Nav", icon: <Eye size={16} /> },
                  { id: "admin_users", label: "Admin Accounts", icon: <ShieldCheck size={16} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${(activeTab === item.id || (item.id === "cms" && (activeTab === "cms_landing" || activeTab === "cms_about" || activeTab === "cms_contact" || activeTab === "cms_advanced")))
                      ? "bg-slate-900 text-white font-black shadow-md border border-slate-900"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut size={14} /> Exit Admin Portal
            </button>
          </div>
        </div>
      </div>
    )}

    {/* LEFT SIDEBAR (Desktop Milk White Theme Style) */}
    <aside className="hidden lg:flex flex-col w-[285px] bg-white border-r border-slate-200/90 shrink-0 h-screen sticky top-0 overflow-y-auto custom-scrollbar shadow-xs">
      {/* Brand Logo & Name */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-200 bg-slate-50/80">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
          <Crown className="h-5 w-5 stroke-[2.5]" />
        </div>
        <div>
          <h1 className="text-base font-black tracking-tight text-slate-900">IEEE SREC ADMIN</h1>
          <p className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">Enterprise Suite</p>
        </div>
      </div>

      {/* Menu Nav */}
      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Group 1: MISSION CONTROL */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">MISSION CONTROL</p>
          <div className="space-y-1.5">
            <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "overview"
              ? "bg-slate-900 text-white font-black shadow-md border border-slate-900"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard size={18} />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button onClick={() => setActiveTab("launch_control")} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "launch_control"
              ? "bg-blue-600 text-white font-black shadow-md border border-blue-600"
              : "bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"}`}>
              <div className="flex items-center gap-2.5">
                <Rocket size={18} className={activeTab === "launch_control" ? "text-white" : "text-blue-600 animate-pulse"} />
                <span>Launch Mode &amp; Remote</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${activeTab === "launch_control" ? "bg-white/20 text-white" : "bg-blue-600 text-white"}`}>
                Live
              </span>
            </button>
          </div>
        </div>

        {/* Group 2: MEMBERS & LEADERSHIP */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">MEMBERS &amp; LEADERSHIP</p>
          <div className="space-y-1">
            {[
              { id: "student_roster", label: `Student Roster (${studentMembers.length})`, icon: <Users size={18} />, count: studentMembers.length, highlight: true },
              { id: "office", label: "Main SB Bearers", icon: <Briefcase size={18} />, count: officeRows.length },
              { id: "society_leaders", label: "Society Leaders", icon: <Crown size={18} /> },
              { id: "office_cards", label: "Officer ID Cards", icon: <CreditCard size={18} /> },
              { id: "senior", label: "Senior Members", icon: <ShieldCheck size={18} /> },
              { id: "members", label: "Members Track", icon: <Users size={18} /> },
            ].map((item) => (<button type="button" key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
              ? "bg-slate-900 text-white font-black shadow-md border border-slate-900"
              : item.highlight
                ? "text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === item.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                  {item.count}
                </span>
              )}
            </button>))}
          </div>
        </div>

        {/* Group 3: ACTIVITIES & PROGRAMMES */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">ACTIVITIES &amp; PROGRAMMES</p>
          <div className="space-y-1">
            {[
              { id: "activities", label: "Activities", icon: <Activity size={18} />, count: activities.length },
              { id: "event_reports", label: "Event Reports (DB)", icon: <FileText size={18} /> },
              { id: "plans", label: "Annual Plans", icon: <FileText size={18} /> },
              { id: "funding", label: "Funding Requests", icon: <Banknote size={18} /> },
              { id: "societies", label: "Societies & Chapters", icon: <Layers size={18} />, count: societies.length },
              { id: "applications", label: "Join Submissions", icon: <FileText size={18} />, count: applications.length },
              { id: "awards", label: "Awards & Honors", icon: <Award size={18} />, count: awards.length }
            ].map((item) => (<button type="button" key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
              ? "bg-slate-900 text-white font-black shadow-md border border-slate-900"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === item.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                  {item.count}
                </span>
              )}
            </button>))}
          </div>
        </div>

        {/* Group 4: CMS & CONFIG */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">CMS &amp; CONFIG</p>
          <div className="space-y-1">
            {[
              { id: "cms", label: "Website Content CMS", icon: <FileText size={18} /> },
              { id: "page_visibility", label: "Page Visibility & Nav", icon: <Eye size={18} /> },
              { id: "admin_users", label: "Admin Accounts", icon: <ShieldCheck size={18} /> },
            ].map((item) => (<button type="button" key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${(activeTab === item.id || (item.id === "cms" && (activeTab === "cms_landing" || activeTab === "cms_about" || activeTab === "cms_contact" || activeTab === "cms_advanced")))
              ? "bg-slate-900 text-white font-black shadow-md border border-slate-900"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </button>))}
          </div>
        </div>

        {/* Group 5: DEVELOPER */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">DEVELOPER</p>
          <div className="space-y-1">
            <a href="https://surya-ruddy.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-600 hover:bg-slate-100 hover:text-slate-900">
              <div className="flex items-center gap-2.5">
                <Globe size={18} className="text-blue-600" />
                <span>My Portfolio</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Admin User Profile Card in Sidebar */}
      <div
        onClick={() => {
          setProfileForm({ username: adminProfile.username, role: adminProfile.role, avatar: adminProfile.avatar });
          setShowProfileModal(true);
        }}
        className="mx-4 my-2 p-3 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center gap-3 shadow-xs hover:border-blue-500/80 transition-all cursor-pointer group"
        title="Click to view & change Admin Role Clearance"
      >
        <div className="relative shrink-0">
          <img
            src={adminProfile.avatar}
            alt={adminProfile.username}
            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs group-hover:scale-105 transition-transform"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
            }}
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black text-slate-900 truncate group-hover:text-blue-600 transition-colors">{adminProfile.username || "Admin Manager"}</p>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-wider truncate mt-0.5">{adminProfile.role || "MASTER ADMINISTRATOR"}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLogout();
          }}
          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition cursor-pointer shrink-0"
          title="Exit Portal"
        >
          <LogOut size={13} />
        </button>
      </div>

      {/* Promo Card at bottom of sidebar */}
      <div className="mx-4 my-4 p-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 border border-blue-100 rounded-2xl text-center flex flex-col gap-2 shadow-xs">
        <h4 className="text-xs font-black text-blue-900 flex items-center justify-center gap-1.5">
          <Sparkles size={13} className="text-blue-600" />
          <span>IEEE SREC Admin Suite</span>
        </h4>
        <p className="text-[10px] text-slate-600 font-medium">Total registered database members: <strong className="text-blue-700">{studentMembers.length} Students</strong></p>
        <a href="https://ieee.org" target="_blank" rel="noreferrer" className="rounded-xl bg-blue-600 py-2 text-[11px] font-black text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition">
          Visit IEEE Global
        </a>
      </div>
    </aside>

    {/* RIGHT CONTENT CONTAINER */}
    <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-[#f4f7fb]">
      {/* DESKTOP TOP BAR (Milk White) */}
      <header className="hidden lg:flex bg-white/90 border-b border-slate-200/90 h-16 items-center justify-between px-6 sticky top-0 z-35 backdrop-blur-xl shadow-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="text-slate-400">Dashboard</span>
            <ChevronRight size={13} className="text-slate-400" />
            <span className="text-slate-900 font-extrabold flex items-center gap-1.5">
              {tabs.find(t => t.id === activeTab)?.label || "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-72 bg-slate-100 border border-slate-200/90 rounded-xl px-3.5 py-1.5 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
            <Search size={15} className="text-slate-400 shrink-0" />
            <input type="text" placeholder="Search database or type command..." className="w-full text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 placeholder-slate-400 font-medium" />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 font-mono text-[9px] font-medium text-slate-500 shadow-2xs">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          {/* Live System Time Widget */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono font-bold shadow-2xs">
            <span className="text-[10px] font-sans font-bold text-slate-400 uppercase">IST</span>
            <span className="text-slate-900 font-extrabold">{currentTime}</span>
          </div>

          {/* Total Students Counter in Header */}
          <button
            onClick={() => setActiveTab("student_roster")}
            className="admin-btn-tactile inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
            title="View Student Roster Directory"
          >
            <Users size={13} className="text-blue-600 animate-admin-float" />
            <span>{studentMembers.length} Students</span>
          </button>

          {/* Quick Launch Mode Link */}
          <button
            onClick={() => setActiveTab("launch_control")}
            className="admin-btn-tactile inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-2xs"
          >
            <Rocket size={13} className="text-blue-600 animate-pulse" />
            <span>Launch Remote</span>
          </button>

          {/* Live Indicator with Radar Ring */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-admin-radar"></span>
            <span className="text-[11px] font-black tracking-wider">LIVE DB</span>
          </div>

          {/* Refresh DB Button */}
          <button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="admin-btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all active:scale-95 cursor-pointer shadow-2xs"
            title="Refresh all database collections"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin text-blue-600" : "text-slate-500"} />
            <span>{isRefreshing ? "Syncing..." : "Refresh DB"}</span>
          </button>

          {/* Profile Capsule */}
          <div className="flex items-center gap-3 border-l border-slate-200 pl-3.5">
            <div
              onClick={() => {
                setProfileForm({ username: adminProfile.username, role: adminProfile.role, avatar: adminProfile.avatar });
                setShowProfileModal(true);
              }}
              className="admin-btn-tactile flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-2xl shadow-2xs hover:border-blue-400 transition-all cursor-pointer group"
              title="Click to view Admin Profile & Security Clearance"
            >
              <div className="relative shrink-0">
                <img
                  src={adminProfile.avatar}
                  alt={adminProfile.username}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                  }}
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
              </div>

              <div className="text-left hidden sm:block">
                <p className="text-xs font-black text-slate-900 leading-tight group-hover:text-blue-700 transition-colors">
                  {adminProfile.username || "Admin Manager"}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                    {adminProfile.role || "MASTER ADMINISTRATOR"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="admin-btn-tactile p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all cursor-pointer shadow-2xs"
              title="Exit / Logout from Admin Portal"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TOP BAR (Milk White Sticky) */}
      <div className="lg:hidden bg-white/95 border-b border-slate-200 px-4 py-3 sticky top-0 z-40 backdrop-blur-xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 text-slate-700 border border-slate-200 active:scale-95 shadow-xs cursor-pointer"
            title="Open Navigation Menu"
          >
            <Menu size={18} />
          </button>
          <div
            onClick={() => {
              setProfileForm({ username: adminProfile.username, role: adminProfile.role, avatar: adminProfile.avatar });
              setShowProfileModal(true);
            }}
            className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl"
          >
            <div className="relative">
              <img
                src={adminProfile.avatar}
                alt={adminProfile.username}
                className="w-7 h-7 rounded-lg object-cover border border-slate-300"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white rounded-full" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 leading-tight">
                {adminProfile.username || "Admin Manager"}
              </p>
              <span className="text-[8px] font-black text-blue-600 uppercase">
                {adminProfile.role || "MASTER"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("student_roster")}
            className="px-2 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-black"
          >
            {studentMembers.length} Students
          </button>
          <button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-100 text-slate-700 border border-slate-200 active:scale-95 cursor-pointer"
            title="Refresh Database"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-blue-600" : ""} />
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200"
            title="Logout"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="flex-1 w-full min-w-0 flex flex-col relative bg-[#f4f7fb]">
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1600px] w-full mx-auto pb-20">
          {activeTab === "overview" && (
            <div className="animate-admin-fade-in space-y-6">
              {/* Quick Launch Ceremony Banner (Milk White Modern) */}
              <div className="admin-card-elevated p-6 md:p-7 relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25 animate-admin-float">
                    <Rocket size={26} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2 flex-wrap">
                      <span>Grand Launch Ceremony &amp; Stage Remote</span>
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Auditorium Ready
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium max-w-xl">
                      Broadcast synchronized countdowns, control the background video, and fire the official website launch remote in real-time.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setActiveTab("launch_control")}
                    className="admin-btn-tactile flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Radio size={15} /> Open Remote Controller
                  </button>
                  <a
                    href="/launch"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="admin-btn-tactile px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <Tv size={15} className="text-slate-600" /> Stage View
                  </a>
                </div>
              </div>

              {/* KPI STAT CARDS WITH HOVER DEPTH & MICRO-INTERACTIONS */}
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Hero Stat: Total Student Members */}
                <div onClick={() => setActiveTab("student_roster")} className="admin-kpi-card flex flex-col justify-between h-40 group">
                  <div className="flex items-center justify-between">
                    <div className="kpi-icon-box rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 shadow-2xs">
                      <Users size={22} />
                    </div>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                      <Crown size={12} className="text-blue-600" /> Master Roster
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{studentMembers.length} Students</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Total Registered Members</p>
                  </div>
                </div>

                {/* Card 1: Activities */}
                <div onClick={() => setActiveTab("activities")} className="admin-kpi-card flex flex-col justify-between h-40 group">
                  <div className="flex items-center justify-between">
                    <div className="kpi-icon-box rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-emerald-600 shadow-2xs">
                      <Activity size={22} />
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                      <TrendingUp size={12} /> {activitiesGrowthPercent}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{activities.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Activities Conducted</p>
                  </div>
                </div>

                {/* Card 2: Office Bearers */}
                <div onClick={() => setActiveTab("office")} className="admin-kpi-card flex flex-col justify-between h-40 group">
                  <div className="flex items-center justify-between">
                    <div className="kpi-icon-box rounded-2xl bg-purple-50 border border-purple-100 p-3 text-purple-600 shadow-2xs">
                      <Briefcase size={22} />
                    </div>
                    <span className="text-xs font-black text-purple-700 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                      <Crown size={12} className="text-purple-600" /> Active Team
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{officeRows.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Office Bearers</p>
                  </div>
                </div>

                {/* Card 3: Technical Societies */}
                <div onClick={() => setActiveTab("societies")} className="admin-kpi-card flex flex-col justify-between h-40 group">
                  <div className="flex items-center justify-between">
                    <div className="kpi-icon-box rounded-2xl bg-amber-50 border border-amber-100 p-3 text-amber-600 shadow-2xs">
                      <Layers size={22} />
                    </div>
                    <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
                      Chapters
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{societies.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">IEEE Societies</p>
                  </div>
                </div>

                {/* Card 4: Student Join Submissions */}
                <div onClick={() => setActiveTab("applications")} className="admin-kpi-card flex flex-col justify-between h-40 group">
                  <div className="flex items-center justify-between">
                    <div className="kpi-icon-box rounded-2xl bg-blue-50 border border-blue-100 p-3 text-blue-600 shadow-2xs">
                      <FileText size={22} />
                    </div>
                    <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full shadow-2xs">
                      Submissions
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{applications.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Join Requests</p>
                  </div>
                </div>

                {/* Card 5: Awards */}
                <div onClick={() => setActiveTab("awards")} className="admin-kpi-card flex flex-col justify-between h-40 group">
                  <div className="flex items-center justify-between">
                    <div className="kpi-icon-box rounded-2xl bg-amber-50 border border-amber-100 p-3 text-amber-600 shadow-2xs">
                      <Award size={22} />
                    </div>
                    <span className="text-xs font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full shadow-2xs">
                      Honors
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{awards.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Awards &amp; Grants</p>
                  </div>
                </div>

                {/* Card 6: Senior Members */}
                <div onClick={() => setActiveTab("senior")} className="admin-kpi-card flex flex-col justify-between h-40 group">
                  <div className="flex items-center justify-between">
                    <div className="kpi-icon-box rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-emerald-600 shadow-2xs">
                      <ShieldCheck size={22} />
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full shadow-2xs">
                      Alumni &amp; Seniors
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{seniorMembers.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Senior Members</p>
                  </div>
                </div>

                {/* Card 7: Member Track Records */}
                <div onClick={() => setActiveTab("members")} className="admin-kpi-card flex flex-col justify-between h-40 group">
                  <div className="flex items-center justify-between">
                    <div className="kpi-icon-box rounded-2xl bg-indigo-50 border border-indigo-100 p-3 text-indigo-600 shadow-2xs">
                      <Users size={22} />
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs">
                      <TrendingUp size={12} /> {memberGrowthPercent}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{memberRows.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Years Tracked</p>
                  </div>
                </div>
              </div>

              {/* QUICK OPERATIONS COMMAND CENTER */}
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 pt-2">
                <div onClick={() => setActiveTab("student_roster")} className="admin-quick-tile group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Student Roster</p>
                      <p className="text-[10px] text-slate-500 font-semibold">{studentMembers.length} registered</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="tile-arrow text-slate-400" />
                </div>

                <div onClick={() => setActiveTab("office_cards")} className="admin-quick-tile group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                      <CreditCard size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Officer ID Cards</p>
                      <p className="text-[10px] text-slate-500 font-semibold">Generate &amp; Download</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="tile-arrow text-slate-400" />
                </div>

                <div onClick={() => setActiveTab("event_reports")} className="admin-quick-tile group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Event Reports (DB)</p>
                      <p className="text-[10px] text-slate-500 font-semibold">Upload &amp; Archive</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="tile-arrow text-slate-400" />
                </div>

                <div onClick={() => setActiveTab("cms")} className="admin-quick-tile group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Globe size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">Website CMS</p>
                      <p className="text-[10px] text-slate-500 font-semibold">Live text &amp; images</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="tile-arrow text-slate-400" />
                </div>
              </div>

              {/* Welcome Executive Card */}
              <div className="mt-8 rounded-3xl bg-white border border-slate-200 p-6 md:p-8 text-slate-900 shadow-xs relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Executive Console Live</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
                    IEEE SREC Executive Portal
                  </h2>
                  <p className="text-slate-600 max-w-2xl text-sm leading-relaxed font-medium">
                    Live system overseeing <strong className="text-slate-900 font-black">{studentMembers.length} Student Members</strong>, active activities, office bearer records, annual plans, and website CMS updates in real-time.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button onClick={() => setActiveTab("student_roster")} className="bg-slate-900 hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 cursor-pointer">
                      <Users size={16} /> View Student Directory ({studentMembers.length})
                    </button>
                    <button onClick={() => setActiveTab("activities")} className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer">
                      <Activity size={16} /> Post New Activity
                    </button>
                  </div>
                </div>
              </div>

              {/* Visual Analytics Graphs Grid (Milk White) */}
              <div className="grid gap-6 md:grid-cols-3 mt-8">
                {/* Monthly Event Engagement Bar Chart */}
                <div className="md:col-span-2 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">Event Engagement</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-0.5">Real monthly event count from database</p>
                      </div>
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                        Total Events: {activities.length}
                      </span>
                    </div>

                    {/* Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-2 pt-6">
                      {(() => {
                        const maxEventsVal = Math.max(...monthlyEventData.map(d => d.val), 1);
                        return monthlyEventData.map((item, idx) => (<div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full bg-slate-100 rounded-t-xl relative h-48 flex items-end overflow-hidden border-t border-slate-200">
                            <div style={{ height: `${(item.val / maxEventsVal) * 100}%` }} className="w-full bg-gradient-to-t from-blue-600 via-blue-500 to-indigo-400 rounded-t-xl group-hover:brightness-110 transition-all duration-300 relative shadow-xs">
                              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-md">
                                {item.val} Events
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{item.month}</span>
                        </div>));
                      })()}
                    </div>
                  </div>
                </div>

                {/* Member Distribution Donut */}
                <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">Members Distribution</h4>
                    <p className="text-xs text-slate-500 font-semibold mb-6">Real breakdown (latest tracked year)</p>

                    <div className="flex justify-center items-center py-6 relative">
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="65" stroke="#f1f5f9" strokeWidth="14" fill="transparent" />
                        <circle cx="80" cy="80" r="65" stroke="#2563eb" strokeWidth="14" fill="transparent" strokeDasharray="408" strokeDashoffset={Math.round(408 - (408 * memberDistribution.studentPercent) / 100)} strokeLinecap="round" className="transition-all duration-500" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black text-slate-900">{memberDistribution.studentPercent}%</span>
                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-0.5">Students</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-2 text-slate-700">
                          <span className="w-3 h-3 rounded-full bg-blue-600"></span> Student Members ({memberDistribution.studentCount})
                        </span>
                        <span className="text-slate-900 font-bold">{memberDistribution.studentPercent}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-2 text-slate-700">
                          <span className="w-3 h-3 rounded-full bg-slate-300"></span> Professional ({memberDistribution.profCount})
                        </span>
                        <span className="text-slate-900 font-bold">{memberDistribution.profPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activities" && (<div className="space-y-8">
            <form onSubmit={submitActivity} className="rounded-3xl bg-white p-6 md:p-8 shadow-xs border border-slate-200">
              <h3 className="mb-6 text-xl font-black text-slate-900">
                {editingActivityId ? "Edit Activity Record" : "Post New Activity Record"}
              </h3>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 text-xs">
                <input type="number" placeholder="S.No" value={activityForm.s_no} onChange={(e) => setActivityForm({ ...activityForm, s_no: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />

                <input type="text" placeholder="Event Name" value={activityForm.event} onChange={(e) => setActivityForm({ ...activityForm, event: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />

                <input type="text" placeholder="Date (e.g. 15 Aug 2025)" value={activityForm.date} onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" />

                <input type="text" placeholder="Chief Guest / Organizer" value={activityForm.chief_guest} onChange={(e) => setActivityForm({ ...activityForm, chief_guest: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" />

                <input type="text" placeholder="Participants Count (e.g. 120)" value={activityForm.participants} onChange={(e) => setActivityForm({ ...activityForm, participants: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" />

                <input type="text" placeholder="Image URL (Optional)" value={activityForm.image_url} onChange={(e) => setActivityForm({ ...activityForm, image_url: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" />
              </div>

              <div className="mt-6 flex gap-4">
                <button className="rounded-xl bg-slate-900 hover:bg-black text-white px-6 py-3 font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer">
                  {editingActivityId ? "Update Activity" : "Save Activity"}
                </button>

                {editingActivityId && (<button type="button" onClick={resetActivityForm} className="rounded-xl bg-slate-100 hover:bg-slate-200 px-6 py-3 font-bold text-slate-700 text-xs transition cursor-pointer border border-slate-200">
                  Cancel
                </button>)}
              </div>
            </form>

            <div className="rounded-3xl bg-white p-6 md:p-8 shadow-xs border border-slate-200">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Activity size={18} className="text-blue-600" />
                    <span>Activity Records ({activities.length})</span>
                  </h3>
                </div>

                <div className="relative w-full md:w-80">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search activities..." value={activitySearch} onChange={(e) => setActivitySearch(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" />
                </div>
              </div>

              {activitiesLoading && <p className="text-slate-500 text-xs">Loading activities from database...</p>}
              {!activitiesLoading && activitiesError && (<p className="text-rose-500 text-xs">Error: {activitiesError}</p>)}
              {!activitiesLoading && !activitiesError && filteredActivities.length === 0 && (<p className="text-slate-500 text-xs">No activities found.</p>)}

              {!activitiesLoading && !activitiesError && filteredActivities.length > 0 && (<div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-xs">
                <table className="w-full border-collapse text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5 text-left">S.No</th>
                      <th className="px-4 py-3.5 text-left">Event</th>
                      <th className="px-4 py-3.5 text-left">Date</th>
                      <th className="px-4 py-3.5 text-left">Chief Guest</th>
                      <th className="px-4 py-3.5 text-left">Participants</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredActivities.map((row) => (<tr key={row.id} className="hover:bg-slate-50/70 transition-colors text-slate-800">
                      <td className="px-4 py-3.5 font-bold text-blue-600">{row.s_no}</td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">{row.event}</td>
                      <td className="px-4 py-3.5 text-slate-600">{row.date || "-"}</td>
                      <td className="px-4 py-3.5 text-slate-600">{row.chief_guest || "-"}</td>
                      <td className="px-4 py-3.5 text-slate-600">{row.participants || "-"}</td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        <button onClick={() => {
                          setEditingActivityId(row.id);
                          setActivityForm({
                            s_no: String(row.s_no),
                            event: row.event || "",
                            date: row.date || "",
                            chief_guest: row.chief_guest || "",
                            participants: row.participants || "",
                            image_url: row.image_url || "",
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }} className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 font-bold transition cursor-pointer">
                          Edit
                        </button>
                        <button onClick={() => deleteActivity(row.id)} className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 font-bold transition cursor-pointer">
                          Delete
                        </button>
                      </td>
                    </tr>))}
                  </tbody>
                </table>
              </div>)}
            </div>
          </div>)}

          {activeTab === "page_visibility" && (<PageVisibilityAdmin />)}

          {activeTab === "launch_control" && (<LaunchControlRoom />)}

          {activeTab === "event_reports" && (<EventReportsAdmin />)}

          {activeTab === "office" && (<OfficeBearers />)}

          {activeTab === "society_leaders" && (<SocietyLeadershipAdmin />)}

          {activeTab === "office_cards" && (<OfficeBearerCardsAdmin />)}

          {activeTab === "members" && (<div className="space-y-8">
            <form onSubmit={submitMember} className="rounded-3xl bg-white p-6 md:p-8 shadow-xs border border-slate-200">
              <h3 className="mb-6 text-xl font-black text-slate-900">
                {editingMemberId ? "Edit Member Count Record" : "Add Year Membership Track"}
              </h3>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 text-xs">
                <input type="number" placeholder="Year (e.g. 2025)" value={memberForm.year} onChange={(e) => setMemberForm({ ...memberForm, year: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                <input type="number" placeholder="Professional Members" value={memberForm.professional_members} onChange={(e) => setMemberForm({ ...memberForm, professional_members: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                <input type="number" placeholder="Student Members" value={memberForm.student_members} onChange={(e) => setMemberForm({ ...memberForm, student_members: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                <input type="number" placeholder="Total Members" value={memberForm.total_members} onChange={(e) => setMemberForm({ ...memberForm, total_members: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
              </div>

              <div className="mt-6 flex gap-4">
                <button className="rounded-xl bg-slate-900 hover:bg-black text-white px-6 py-3 font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer">
                  {editingMemberId ? "Update Record" : "Save Record"}
                </button>
                {editingMemberId && (<button type="button" onClick={resetMemberForm} className="rounded-xl bg-slate-100 hover:bg-slate-200 px-6 py-3 font-bold text-slate-700 text-xs transition cursor-pointer border border-slate-200">
                  Cancel
                </button>)}
              </div>
            </form>

            <div className="overflow-x-auto rounded-3xl bg-white border border-slate-200 shadow-xs p-0">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-left">Year</th>
                    <th className="px-5 py-4 text-left">Professional</th>
                    <th className="px-5 py-4 text-left">Student</th>
                    <th className="px-5 py-4 text-left">Total</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {memberRows.map((row) => (<tr key={row.id} className="hover:bg-slate-50/70 transition-colors text-slate-800">
                    <td className="px-5 py-3.5 font-bold text-blue-600">{row.year}</td>
                    <td className="px-5 py-3.5 text-slate-600">{row.professional_members}</td>
                    <td className="px-5 py-3.5 text-blue-600 font-bold">{row.student_members}</td>
                    <td className="px-5 py-3.5 text-slate-900 font-black">{row.total_members}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button onClick={() => {
                        setEditingMemberId(row.id);
                        setMemberForm({
                          year: String(row.year),
                          professional_members: String(row.professional_members),
                          student_members: String(row.student_members),
                          total_members: String(row.total_members),
                        });
                      }} className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 font-bold transition cursor-pointer">
                        Edit
                      </button>
                      <button onClick={() => deleteMember(row.id)} className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 font-bold transition cursor-pointer">
                        Delete
                      </button>
                    </td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}
          {activeTab === "plans" && (<div className="space-y-8">
            <form onSubmit={submitPlan} className="rounded-3xl bg-white p-6 md:p-8 shadow-xs border border-slate-200">
              <h3 className="mb-6 text-xl font-black text-slate-900">
                {editingPlanId ? "Edit Annual Plan" : "Add Annual Plan"}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <input type="number" placeholder="S.No" value={planForm.s_no} onChange={(e) => setPlanForm({ ...planForm, s_no: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                <input type="text" placeholder="Event Name" value={planForm.event} onChange={(e) => setPlanForm({ ...planForm, event: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                <input type="text" placeholder="Sub Event (Optional)" value={planForm.sub_event} onChange={(e) => setPlanForm({ ...planForm, sub_event: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" />
                <input type="text" placeholder="Schedule (e.g. Q1 / March 2026)" value={planForm.schedule} onChange={(e) => setPlanForm({ ...planForm, schedule: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
              </div>
              <div className="mt-6 flex gap-4">
                <button className="rounded-xl bg-slate-900 hover:bg-black text-white px-6 py-3 font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer">
                  {editingPlanId ? "Update Plan" : "Save Plan"}
                </button>
                {editingPlanId && (<button type="button" onClick={resetPlanForm} className="rounded-xl bg-slate-100 hover:bg-slate-200 px-6 py-3 font-bold text-slate-700 text-xs transition cursor-pointer border border-slate-200">
                  Cancel
                </button>)}
              </div>
            </form>

            <div className="overflow-x-auto rounded-3xl bg-white border border-slate-200 shadow-xs p-0">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-left">S.No</th>
                    <th className="px-5 py-4 text-left">Event</th>
                    <th className="px-5 py-4 text-left">Sub Event</th>
                    <th className="px-5 py-4 text-left">Schedule</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {annualPlans.map((row) => (<tr key={row.id} className="hover:bg-slate-50/70 transition-colors text-slate-800">
                    <td className="px-5 py-3.5 font-bold text-blue-600">{row.s_no}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{row.event}</td>
                    <td className="px-5 py-3.5 text-slate-500">{row.sub_event || "-"}</td>
                    <td className="px-5 py-3.5 text-slate-700">{row.schedule}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button onClick={() => {
                        setEditingPlanId(row.id);
                        setPlanForm({ s_no: String(row.s_no), event: row.event, sub_event: row.sub_event || "", schedule: row.schedule });
                      }} className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 font-bold transition cursor-pointer">Edit</button>
                      <button onClick={() => deletePlan(row.id)} className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 font-bold transition cursor-pointer">Delete</button>
                    </td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}

          {activeTab === "funding" && (<div className="space-y-8">
            <form onSubmit={submitFunding} className="rounded-3xl bg-white p-6 md:p-8 shadow-xs border border-slate-200">
              <h3 className="mb-6 text-xl font-black text-slate-900">
                {editingFundingId ? "Edit Funding Request" : "Add Funding Request"}
              </h3>
              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <input type="text" placeholder="Title" value={fundingForm.title} onChange={(e) => setFundingForm({ ...fundingForm, title: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                <select aria-label="Submission Type" value={fundingForm.submission_type} onChange={(e) => setFundingForm({ ...fundingForm, submission_type: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-blue-600 outline-none">
                  <option value="Annual Plan">Annual Plan</option>
                  <option value="Event Funding">Event Funding</option>
                  <option value="Special Project">Special Project</option>
                </select>
                <input type="number" placeholder="Budget Amount (Rs)" value={fundingForm.budget_amount} onChange={(e) => setFundingForm({ ...fundingForm, budget_amount: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                <input type="email" placeholder="Contact Email" value={fundingForm.contact_email} onChange={(e) => setFundingForm({ ...fundingForm, contact_email: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                <textarea placeholder="Description..." value={fundingForm.description} onChange={(e) => setFundingForm({ ...fundingForm, description: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none md:col-span-2" rows={3} required />
              </div>
              <div className="mt-6 flex gap-4">
                <button className="rounded-xl bg-slate-900 hover:bg-black text-white px-6 py-3 font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer">
                  {editingFundingId ? "Update Request" : "Save Request"}
                </button>
                {editingFundingId && (<button type="button" onClick={resetFundingForm} className="rounded-xl bg-slate-100 hover:bg-slate-200 px-6 py-3 font-bold text-slate-700 text-xs transition cursor-pointer border border-slate-200">
                  Cancel
                </button>)}
              </div>
            </form>

            <div className="overflow-x-auto rounded-3xl bg-white border border-slate-200 shadow-xs p-0">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-left">Title</th>
                    <th className="px-5 py-4 text-left">Type</th>
                    <th className="px-5 py-4 text-left">Budget</th>
                    <th className="px-5 py-4 text-left">Email</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fundingRequests.map((row) => (<tr key={row.id} className="hover:bg-slate-50/70 transition-colors text-slate-800">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{row.title}</td>
                    <td className="px-5 py-3.5 text-slate-500">{row.submission_type}</td>
                    <td className="px-5 py-3.5 text-blue-600 font-bold">Rs. {row.budget_amount}</td>
                    <td className="px-5 py-3.5 text-slate-600 font-mono">{row.contact_email}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button onClick={() => {
                        setEditingFundingId(row.id);
                        setFundingForm({
                          title: row.title,
                          submission_type: row.submission_type,
                          description: row.description || "",
                          budget_amount: String(row.budget_amount || ""),
                          contact_email: row.contact_email || ""
                        });
                      }} className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 font-bold transition cursor-pointer">Edit</button>
                      <button onClick={() => deleteFunding(row.id)} className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 font-bold transition cursor-pointer">Delete</button>
                    </td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}

          {activeTab === "senior" && (<div className="space-y-8">
            <form onSubmit={submitSenior} className="rounded-3xl bg-white p-6 md:p-8 shadow-xs border border-slate-200">
              <h3 className="mb-6 text-xl font-black text-slate-900">
                {editingSeniorId ? "Edit Senior Member" : "Add Senior Member"}
              </h3>

              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <input type="text" placeholder="Name" value={seniorForm.name} onChange={(e) => setSeniorForm({ ...seniorForm, name: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                <input type="number" placeholder="S.No" value={seniorForm.s_no} onChange={(e) => setSeniorForm({ ...seniorForm, s_no: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                <input type="text" placeholder="Current Role (e.g. Software Engineer)" value={seniorForm.current_role} onChange={(e) => setSeniorForm({ ...seniorForm, current_role: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" />
                <input type="text" placeholder="College" value={seniorForm.college} onChange={(e) => setSeniorForm({ ...seniorForm, college: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" />
                <input type="url" placeholder="LinkedIn URL" value={seniorForm.linkedin_url} onChange={(e) => setSeniorForm({ ...seniorForm, linkedin_url: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none md:col-span-2" />
                <input type="url" placeholder="Image URL" value={seniorForm.image_url} onChange={(e) => setSeniorForm({ ...seniorForm, image_url: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none md:col-span-2" />
              </div>

              <div className="mt-6 flex gap-4">
                <button className="rounded-xl bg-slate-900 hover:bg-black text-white px-6 py-3 font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer">
                  {editingSeniorId ? "Update Member" : "Save Member"}
                </button>
                {editingSeniorId && (<button type="button" onClick={resetSeniorForm} className="rounded-xl bg-slate-100 hover:bg-slate-200 px-6 py-3 font-bold text-slate-700 text-xs transition cursor-pointer border border-slate-200">
                  Cancel
                </button>)}
              </div>
            </form>

            <div className="overflow-x-auto rounded-3xl bg-white border border-slate-200 shadow-xs p-0">
              <table className="w-full border-collapse text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4 text-left">S.No</th>
                    <th className="px-5 py-4 text-left">Name</th>
                    <th className="px-5 py-4 text-left">Role</th>
                    <th className="px-5 py-4 text-left">College</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {seniorMembers.map((row) => (<tr key={row.id} className="hover:bg-slate-50/70 transition-colors text-slate-800">
                    <td className="px-5 py-3.5 font-bold text-blue-600">{row.s_no}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">{row.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{row.current_role || "-"}</td>
                    <td className="px-5 py-3.5 text-slate-500">{row.college || "-"}</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button onClick={() => {
                        setEditingSeniorId(row.id);
                        setSeniorForm({
                          name: row.name,
                          s_no: row.s_no ? String(row.s_no) : "",
                          current_role: row.current_role || "",
                          college: row.college || "",
                          linkedin_url: row.linkedin_url || "",
                          image_url: row.image_url || "",
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }} className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 font-bold transition cursor-pointer">
                        Edit
                      </button>
                      <button onClick={() => {
                        if (window.confirm("Delete this senior member?"))
                          deleteSenior(row.id);
                      }} className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 font-bold transition cursor-pointer">
                        Delete
                      </button>
                    </td>
                  </tr>))}
                </tbody>
              </table>
            </div>
          </div>)}


          {(activeTab === "cms" || activeTab === "cms_landing" || activeTab === "cms_about" || activeTab === "cms_contact" || activeTab === "cms_advanced") && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    Website Content CMS
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Manage dynamic text, announcements, quotes, and content across public website pages.
                  </p>
                </div>

                {/* Sub-tab Pill Navigation */}
                <div className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-2xl">
                  {[
                    { id: "landing", label: "Landing Page" },
                    { id: "about", label: "About Page" },
                    { id: "contact", label: "Contact Info" },
                    { id: "advanced", label: "Raw Keys" },
                  ].map((sub) => {
                    const isSelected = (activeTab === "cms" && cmsSubTab === sub.id) || (activeTab === `cms_${sub.id}`);
                    return (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => {
                          setActiveTab("cms");
                          setCmsSubTab(sub.id);
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white text-slate-900 font-extrabold shadow-sm"
                            : "text-slate-500 hover:text-slate-900"
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub-tab 1: Landing Page CMS */}
              {((activeTab === "cms" && cmsSubTab === "landing") || activeTab === "cms_landing") && (
                <LandingCMSForm pageContents={pageContents} onSave={upsertContent} />
              )}

              {/* Sub-tab 2: About Page CMS */}
              {((activeTab === "cms" && cmsSubTab === "about") || activeTab === "cms_about") && (
                <AboutCMSForm pageContents={pageContents} onSave={upsertContent} />
              )}

              {/* Sub-tab 3: Contact Page CMS */}
              {((activeTab === "cms" && cmsSubTab === "contact") || activeTab === "cms_contact") && (
                <ContactCMSForm pageContents={pageContents} onSave={upsertContent} />
              )}

              {/* Sub-tab 4: Raw Keys Editor */}
              {((activeTab === "cms" && cmsSubTab === "advanced") || activeTab === "cms_advanced") && (
                <div className="space-y-6">
                  <form onSubmit={submitContent} className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-slate-900">{editingContentId ? "Edit Content Key" : "Add New Content Key"}</h3>
                    <div className="grid gap-4 md:grid-cols-2 text-xs">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold uppercase tracking-wider text-slate-600">Page Key (e.g. "about")</label>
                        <input type="text" placeholder="e.g. about" value={contentForm.page_key} onChange={(e) => setContentForm({ ...contentForm, page_key: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold uppercase tracking-wider text-slate-600">Content Key (e.g. "intro_text")</label>
                        <input type="text" placeholder="e.g. intro_text" value={contentForm.content_key} onChange={(e) => setContentForm({ ...contentForm, content_key: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="font-bold uppercase tracking-wider text-slate-600">Content Text (HTML / Plain Text)</label>
                        <textarea rows={4} placeholder="Type the page content here..." value={contentForm.content_text} onChange={(e) => setContentForm({ ...contentForm, content_text: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                      </div>
                    </div>

                    <div className="mt-6 flex gap-4">
                      <button className="rounded-xl bg-slate-900 hover:bg-black text-white px-6 py-3 font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer">
                        {editingContentId ? "Update Content" : "Save Content"}
                      </button>
                      {editingContentId && (<button type="button" onClick={resetContentForm} className="rounded-xl bg-slate-100 hover:bg-slate-200 px-6 py-3 font-bold text-slate-700 text-xs transition cursor-pointer border border-slate-200">
                        Cancel
                      </button>)}
                    </div>
                  </form>

                  <div className="overflow-x-auto rounded-3xl bg-white border border-slate-200 shadow-xs p-0">
                    <table className="w-full border-collapse text-xs">
                      <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-5 py-4 text-left">Page</th>
                          <th className="px-5 py-4 text-left">Content Key</th>
                          <th className="px-5 py-4 text-left">Text Sneak Peek</th>
                          <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pageContents.map((row) => (<tr key={row.id} className="hover:bg-slate-50/70 transition-colors text-slate-800">
                          <td className="px-5 py-3.5 font-bold text-blue-600">{row.page_key}</td>
                          <td className="px-5 py-3.5 font-bold text-slate-900">{row.content_key}</td>
                          <td className="px-5 py-3.5 text-slate-500 truncate max-w-[200px]">{row.content_text}</td>
                          <td className="px-5 py-3.5 text-right space-x-2">
                            <button onClick={() => {
                              setEditingContentId(row.id);
                              setContentForm({
                                page_key: row.page_key,
                                content_key: row.content_key,
                                content_text: row.content_text,
                              });
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }} className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 font-bold transition cursor-pointer">
                              Edit
                            </button>
                            <button onClick={() => deleteContent(row.id)} className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 font-bold transition cursor-pointer">
                              Delete
                            </button>
                          </td>
                        </tr>))}
                        {pageContents.length === 0 && (<tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-xs text-slate-400 font-medium">
                            No page content keys added yet. Use the form above to add your dynamic content string.
                          </td>
                        </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}


          {activeTab === "societies" && (<div className="space-y-12">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Societies Management</h2>
              <p className="text-sm text-slate-500 mt-1">Manage IEEE Technical Societies, edit chapter descriptions, and update Office Bearers &amp; Executive Members.</p>
            </div>

            {/* Section 1: Society Info Editor */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Form */}
              <form onSubmit={submitSociety} className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-4 self-start">
                <h3 className="text-lg font-black text-slate-900">{editingSocietyId ? "Edit Society Info" : "Add New Society"}</h3>

                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold uppercase tracking-wider text-slate-600">Society Name</label>
                  <input type="text" placeholder="e.g. IEEE Computer Society" value={societyForm.name} onChange={(e) => setSocietyForm({ ...societyForm, name: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" required />
                </div>

                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold uppercase tracking-wider text-slate-600">Short Code</label>
                  <input type="text" placeholder="e.g. CS" value={societyForm.short_code} onChange={(e) => setSocietyForm({ ...societyForm, short_code: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" />
                </div>

                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-bold uppercase tracking-wider text-slate-600">Description</label>
                  <textarea rows={3} placeholder="Brief overview of the society's mission..." value={societyForm.description} onChange={(e) => setSocietyForm({ ...societyForm, description: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-600 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold uppercase tracking-wider text-slate-600">Est. Year</label>
                    <input type="number" value={societyForm.established_year} onChange={(e) => setSocietyForm({ ...societyForm, established_year: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold uppercase tracking-wider text-slate-600">Member Count</label>
                    <input type="number" value={societyForm.member_count} onChange={(e) => setSocietyForm({ ...societyForm, member_count: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 rounded-xl bg-slate-900 hover:bg-black py-2.5 font-bold text-white text-xs uppercase tracking-wider transition cursor-pointer shadow-sm">
                    {editingSocietyId ? "Update Society" : "Add Society"}
                  </button>
                  {editingSocietyId && (<button type="button" onClick={resetSocietyForm} className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2.5 font-bold text-slate-700 text-xs transition cursor-pointer border border-slate-200">
                    Cancel
                  </button>)}
                </div>
              </form>

              {/* List Table */}
              <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/70">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Layers size={18} className="text-blue-600" />
                    <span>IEEE Technical Chapters ({societies.length})</span>
                  </h3>
                </div>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full border-collapse text-xs">
                    <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3.5 text-left">Code</th>
                        <th className="px-6 py-3.5 text-left">Society Name</th>
                        <th className="px-6 py-3.5 text-left">Members</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {societies.map((soc) => (<tr key={soc.id} className="hover:bg-slate-50/70 transition-colors text-slate-800">
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-mono font-bold text-xs">{soc.short_code || "GEN"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{soc.name}</p>
                          {soc.description && <p className="text-xs text-slate-500 truncate max-w-xs">{soc.description}</p>}
                        </td>
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                          {soc.member_count || 0} Members
                        </td>
                        <td className="px-6 py-4 text-xs text-right space-x-2">
                          <button type="button" onClick={() => {
                            setEditingSocietyId(soc.id);
                            setSocietyForm({
                              name: soc.name,
                              short_code: soc.short_code || "",
                              description: soc.description || "",
                              established_year: soc.established_year?.toString() || "2001",
                              member_count: soc.member_count?.toString() || "50",
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }} className="rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-1.5 font-bold transition cursor-pointer">
                            Edit
                          </button>
                          <button type="button" onClick={() => deleteSociety(soc.id)} className="rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 font-bold transition cursor-pointer">
                            Delete
                          </button>
                        </td>
                      </tr>))}
                      {societies.length === 0 && (<tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400 font-medium">
                          No technical societies found.
                        </td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 2: Dedicated Office Bearers & Executive Members Editor */}
            <div className="pt-8 border-t border-zinc-800">
              <div className="mb-6">
                <h3 className="text-xl font-black text-white">Manage Society Office Bearers &amp; Executive Team</h3>
                <p className="text-xs text-zinc-400 mt-1">Select any chapter (CS, CIS, ComSoc, EMBS, IMS, PELS, WIE) to add, edit, or delete Office Bearers and Executive Members with photo uploads.</p>
              </div>
              <OfficeBearers />
            </div>
          </div>)}

          {activeTab === "applications" && (<div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Student Join Submissions</h2>
                <p className="text-sm text-slate-500 mt-1">Review student applications submitted from the /join portal.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                <div className="relative w-full sm:w-72">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Filter by name, email, society..." value={appSearch} onChange={(e) => setAppSearch(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 font-bold focus:outline-none focus:border-blue-600 shadow-xs" />
                </div>

                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Registration Status</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={pageContents.find(c => c.page_key === "system" && c.content_key === "registration_open")?.content_text !== "false"} onChange={async (e) => {
                      const newStatus = e.target.checked ? "true" : "false";
                      localStorage.setItem("ieee_registration_open", newStatus);
                      window.dispatchEvent(new Event("registration_status_changed"));
                      await upsertContent("system", "registration_open", newStatus);
                      setPageContents(prev => {
                        const existing = prev.findIndex(c => c.page_key === "system" && c.content_key === "registration_open");
                        if (existing >= 0) {
                          const newContents = [...prev];
                          newContents[existing] = { ...newContents[existing], content_text: newStatus };
                          return newContents;
                        }
                        else {
                          return [...prev, { id: Date.now(), page_key: "system", content_key: "registration_open", content_text: newStatus }];
                        }
                      });
                    }} />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Batch Actions Toolbar */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => {
                  const filtered = applications.filter(app => {
                    const q = appSearch.trim().toLowerCase();
                    if (!q)
                      return true;
                    return (app.first_name?.toLowerCase().includes(q) ||
                      app.last_name?.toLowerCase().includes(q) ||
                      app.email?.toLowerCase().includes(q) ||
                      app.target_society?.toLowerCase().includes(q) ||
                      app.department?.toLowerCase().includes(q));
                  });
                  if (selectedAppIds.length === filtered.length) {
                    setSelectedAppIds([]);
                  }
                  else {
                    setSelectedAppIds(filtered.map(a => a.id));
                  }
                }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2 border border-slate-200 cursor-pointer">
                  <input type="checkbox" checked={applications.length > 0 && selectedAppIds.length === applications.length} readOnly className="rounded accent-blue-600 cursor-pointer" />
                  <span>Select All ({selectedAppIds.length}/{applications.length})</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={exportApplicationsToExcel} className="px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs flex items-center gap-2 cursor-pointer active:scale-95" title="Download all applications or selected applications as Excel CSV">
                  <FileSpreadsheet size={15} />
                  <span>Export Excel ({selectedAppIds.length > 0 ? selectedAppIds.length : applications.length})</span>
                </button>

                <button type="button" onClick={downloadSelectedReceipts} disabled={selectedAppIds.length === 0} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-xs flex items-center gap-2 ${selectedAppIds.length > 0
                  ? "bg-slate-900 hover:bg-black text-white cursor-pointer font-bold"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"}`}>
                  <Download size={14} />
                  <span>Receipts ({selectedAppIds.length})</span>
                </button>

                <button type="button" onClick={deleteSelectedApplications} disabled={selectedAppIds.length === 0} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-xs flex items-center gap-2 ${selectedAppIds.length > 0
                  ? "bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"}`}>
                  <Trash2 size={14} />
                  <span>Delete Selected ({selectedAppIds.length})</span>
                </button>
              </div>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {applications
                .filter(app => {
                  const q = appSearch.trim().toLowerCase();
                  if (!q)
                    return true;
                  return (app.first_name?.toLowerCase().includes(q) ||
                    app.last_name?.toLowerCase().includes(q) ||
                    app.email?.toLowerCase().includes(q) ||
                    app.target_society?.toLowerCase().includes(q) ||
                    app.department?.toLowerCase().includes(q));
                })
                .map((app) => {
                  const isSelected = selectedAppIds.includes(app.id);
                  return (<div key={app.id} className={`rounded-3xl border ${isSelected ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20" : "border-slate-200 bg-white"} p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-all relative group`}>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={isSelected} onChange={() => {
                            setSelectedAppIds(prev => prev.includes(app.id) ? prev.filter(id => id !== app.id) : [...prev, app.id]);
                          }} className="w-4 h-4 rounded accent-blue-600 cursor-pointer" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                            {app.target_society || "IEEE SB"}
                          </span>
                        </label>

                        <span className="text-[10px] font-bold text-slate-400">
                          {app.created_at ? new Date(app.created_at).toLocaleDateString() : "Recent"}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900">{app.first_name} {app.last_name}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{app.email}</p>
                        <p className="text-xs text-slate-600 font-semibold mt-1">Dept: <strong className="text-slate-900">{app.department}</strong> • Year: <strong className="text-slate-900">{app.year_of_study}</strong></p>
                      </div>

                      {app.skills && app.skills.length > 0 && (<div className="flex flex-wrap gap-1 pt-1">
                        {app.skills.map((skill, idx) => (<span key={idx} className="text-[9px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                          {skill}
                        </span>))}
                      </div>)}

                      {(() => {
                        if (!app.statement_of_purpose)
                          return null;
                        const rawSop = app.statement_of_purpose;
                        const bracketMatches = rawSop.match(/\[(.*?)\]/g) || [];
                        const tags = bracketMatches
                          .map(m => m.replace(/\[|\]/g, '').trim())
                          .filter(t => Boolean(t));
                        let cleanText = rawSop
                          .replace(/\[(.*?)\]/g, '')
                          .replace(/^Statement of Purpose:\s*/i, '')
                          .trim();
                        if (!cleanText || cleanText.toLowerCase() === 'n/a') {
                          cleanText = "Enrolled via IEEE SREC Web Portal to access events, workshops, technical societies & professional networking.";
                        }
                        return (<div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                              Statement of Purpose
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                              Verified
                            </span>
                          </div>

                          {tags.length > 0 && (<div className="flex flex-wrap gap-1">
                            {tags.map((tag, idx) => (<span key={idx} className="text-[9.5px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                              {tag}
                            </span>))}
                          </div>)}

                          <p className="text-xs text-slate-700 font-medium leading-relaxed italic bg-white p-2.5 rounded-xl border border-slate-200">
                            &ldquo;{cleanText}&rdquo;
                          </p>
                        </div>);
                      })()}
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">ID: {app.id.slice(0, 8)}...</span>
                      <button type="button" onClick={() => deleteApplication(app.id)} className="text-xs text-rose-600 hover:text-rose-700 font-bold uppercase tracking-wider transition cursor-pointer">
                        Delete Application
                      </button>
                    </div>
                  </div>);
                })}

              {applications.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-3xl">
                  <p className="text-slate-500 font-bold text-sm">No student applications received yet.</p>
                </div>
              )}
            </div>
          </div>)}

          {/* TAB: STUDENT ROSTER (DATABASE TABLE `public.student_members`) */}
          {activeTab === "student_roster" && (
            <div className="space-y-6 w-full max-w-full min-w-0 animate-admin-fade-in font-sans">
              {/* ─── 1. EXECUTIVE KPI SUMMARY RIBBON (MILK WHITE) ─── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {/* Master Total Registered Students Card */}
                <div className="admin-kpi-card flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Total Registered Students</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">
                      {studentMembers.length}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Live Database Verified</span>
                    </p>
                  </div>
                  <div className="kpi-icon-box w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Users size={22} />
                  </div>
                </div>

                {/* Pending IEEE IDs */}
                <div className="admin-kpi-card flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Pending IEEE IDs</p>
                    <p className="text-2xl font-black text-amber-600 mt-1">
                      {studentMembers.filter(m => m.ieee_id === "PENDING" || !m.ieee_id).length} Students
                    </p>
                    <button type="button" onClick={() => setIeeeStatusFilter("PENDING")} className="text-[11px] text-amber-700 hover:text-amber-800 hover:underline font-bold mt-0.5 inline-flex items-center gap-1 cursor-pointer">
                      <span>Filter pending</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                  <div className="kpi-icon-box w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <span className="text-xl">⏳</span>
                  </div>
                </div>

                {/* Assigned & Verified IEEE IDs */}
                <div className="admin-kpi-card flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Assigned IEEE IDs</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">
                      {studentMembers.filter(m => m.ieee_id !== "PENDING" && Boolean(m.ieee_id)).length} Verified
                    </p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Official Members</p>
                  </div>
                  <div className="kpi-icon-box w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <ShieldCheck size={22} />
                  </div>
                </div>

                {/* Diversity / Representation */}
                <div className="admin-kpi-card flex items-center justify-between group">
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Diversity (Female)</p>
                    <p className="text-2xl font-black text-purple-600 mt-1">
                      {studentMembers.filter(m => m.gender?.toLowerCase() === "female").length} Students
                    </p>
                    <p className="text-[11px] text-purple-600 font-semibold mt-0.5">
                      {studentMembers.length > 0
                        ? Math.round((studentMembers.filter(m => m.gender?.toLowerCase() === "female").length / studentMembers.length) * 100)
                        : 0}% Representation
                    </p>
                  </div>
                  <div className="kpi-icon-box w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                    <Crown size={20} />
                  </div>
                </div>
              </div>

              {/* ─── 2. HEADER & ACTION TOOLBAR (MILK WHITE) ─── */}
              <div className="admin-card-elevated flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 w-full">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Student Members Master Directory
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Live database of verified student registrations, assigned IEEE IDs, chapter affiliations &amp; credentials ({studentMembers.length} total enrolled).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button type="button" onClick={exportStudentMembersToExcel} className="admin-btn-tactile px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition flex items-center gap-2 cursor-pointer active:scale-95" title="Download filtered student members database directory as Excel CSV">
                    <FileSpreadsheet size={16} />
                    <span>Export Excel ({studentMembers.length})</span>
                  </button>
                  <button type="button" onClick={() => setIsAddMemberOpen(true)} className="admin-btn-tactile px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-xs transition flex items-center gap-2 cursor-pointer active:scale-95">
                    <Plus size={16} />
                    <span>Add Student</span>
                  </button>
                  <button type="button" onClick={fetchStudentMembers} className="admin-btn-tactile px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 border border-slate-200 cursor-pointer" title="Refresh from Supabase">
                    <RefreshCw size={14} className={studentMembersLoading ? "animate-spin text-blue-600" : ""} />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>

              {/* ─── 3. COMMAND SEARCH & FILTER BAR ─── */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 w-full">
                {/* Active Live Student Counter Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                      <Users size={16} />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">Database Status</span>
                      <span className="text-xs text-slate-700 font-semibold">
                        Showing <strong className="text-slate-900 font-black text-sm">{filteredStudentList.length}</strong> of <strong className="text-slate-900 font-black text-sm">{studentMembers.length}</strong> Total Registered Students
                      </span>
                    </div>
                  </div>

                  {filteredStudentList.length !== studentMembers.length && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Filtered View Active
                    </span>
                  )}
                </div>

                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" placeholder="Search by Name, Roll Number, IEEE ID, Email, Dept..." value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600" />
                    {memberSearch && (<button type="button" onClick={() => setMemberSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      <X size={14} />
                    </button>)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Department Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dept:</span>
                      <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600">
                        <option value="ALL">All Depts</option>
                        <option value="CSE">CSE</option>
                        <option value="ECE">ECE</option>
                        <option value="EEE">EEE</option>
                        <option value="EIE">EIE</option>
                        <option value="IT">IT</option>
                        <option value="AI & DS">AI &amp; DS</option>
                        <option value="CSS">CSS</option>
                        <option value="BME">BME</option>
                        <option value="RA">RA</option>
                        <option value="MECH">MECH</option>
                        <option value="AERO">AERO</option>
                        <option value="CIVIL">CIVIL</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* IEEE ID Status Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">IEEE ID:</span>
                      <select value={ieeeStatusFilter} onChange={(e) => setIeeeStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600">
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending Only</option>
                        <option value="ASSIGNED">Assigned Only</option>
                      </select>
                    </div>

                    {/* Society Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Society:</span>
                      <select value={societyFilter} onChange={(e) => setSocietyFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600">
                        <option value="ALL">All Chapters</option>
                        <option value="IEEE Student Branch SREC">Parent SB</option>
                        <option value="IEEE Women in Engineering (WIE)">WIE</option>
                        <option value="IEEE Computer Society (CS)">CS</option>
                        <option value="IEEE Computational Intelligence Society (CIS)">CIS</option>
                        <option value="IEEE Communication Society (ComSoc)">ComSoc</option>
                        <option value="IEEE Engineering in Medicine and Biology (EMBS)">EMBS</option>
                        <option value="IEEE Instrumentation and Measurement (IM)">IM</option>
                        <option value="IEEE Power Electronics Society (PELS)">PELS</option>
                        <option value="IEEE Circuits and Systems Society (CAS)">CAS</option>
                      </select>
                    </div>

                    {/* Clear Filters */}
                    {(deptFilter !== "ALL" || ieeeStatusFilter !== "ALL" || societyFilter !== "ALL" || memberSearch) && (<button type="button" onClick={() => {
                      setDeptFilter("ALL");
                      setIeeeStatusFilter("ALL");
                      setSocietyFilter("ALL");
                      setMemberSearch("");
                    }} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs transition cursor-pointer">
                      Reset Filters
                    </button>)}
                  </div>
                </div>
              </div>

              {/* ─── 4. ULTRA-MODERN STUDENT ROSTER TABLE (MILK WHITE) ─── */}
              <div className="rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden w-full max-w-full">
                <div className="overflow-x-auto w-full custom-scrollbar">
                  <table className="w-full min-w-[850px] text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-black uppercase text-[11px] tracking-wider border-b border-slate-200">
                        <th className="py-4 px-5">Student Member</th>
                        <th className="py-4 px-4 font-mono">Roll Number</th>
                        <th className="py-4 px-4 font-mono">IEEE Member ID</th>
                        <th className="py-4 px-4">Department</th>
                        <th className="py-4 px-4">Society Chapters</th>
                        <th className="py-4 px-3">Year</th>
                        <th className="py-4 px-3">Gender</th>
                        <th className="py-4 px-3">T-Shirt</th>
                        <th className="py-4 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudentList.map((m, idx) => {
                        const isPending = m.ieee_id === "PENDING" || !m.ieee_id;
                        return (<tr key={m.id || idx} onClick={() => setInspectingStudentMember(m)} className="admin-table-row-milk cursor-pointer group text-slate-800">
                          {/* Member Portrait & Contact */}
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3.5">
                              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 shadow-xs overflow-hidden shrink-0 flex items-center justify-center font-black text-sm group-hover:scale-105 transition-all">
                                {m.avatar_url ? (<img src={m.avatar_url} alt={m.first_name} className="w-full h-full object-cover object-top" />) : (`${m.first_name?.[0] || ''}${m.last_name?.[0] || ''}`)}
                              </div>
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 block text-xs sm:text-sm group-hover:text-blue-600 transition-colors truncate">
                                  {m.first_name} {m.last_name}
                                </span>
                                <span className="font-mono text-[11px] text-slate-400 block truncate max-w-[200px] mt-0.5">
                                  {m.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Roll Number */}
                          <td className="py-4 px-4 font-mono font-bold text-slate-800 text-xs">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800">
                              {m.roll_number}
                            </span>
                          </td>

                          {/* IEEE ID with glowing status */}
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-xl border shadow-xs ${isPending
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                              {isPending ? (<>
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span>PENDING</span>
                              </>) : (<>
                                <ShieldCheck size={13} className="text-emerald-600" />
                                <span>{m.ieee_id}</span>
                              </>)}
                            </span>
                          </td>

                          {/* Department */}
                          <td className="py-4 px-4">
                            <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200">
                              {m.department}
                            </span>
                          </td>

                          {/* Selected Societies with distinct chapter badges */}
                          <td className="py-4 px-4 max-w-[220px]">
                            <div className="flex flex-wrap gap-1.5">
                              {(m.target_societies && m.target_societies.length > 0
                                ? m.target_societies
                                : ["IEEE Student Branch SREC"]).map((soc, sIdx) => {
                                  const tag = soc
                                    .replace("IEEE ", "")
                                    .replace("Student Branch SREC", "Parent SB")
                                    .replace("Women in Engineering", "WIE")
                                    .replace("Computer Society", "CS")
                                    .replace("Computational Intelligence Society", "CIS")
                                    .replace("Communication Society", "ComSoc")
                                    .replace("Engineering in Medicine and Biology", "EMBS")
                                    .replace("Instrumentation and Measurement", "IM")
                                    .replace("Power Electronics Society", "PELS")
                                    .replace("Circuits and Systems Society", "CAS");
                                  let badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                                  if (tag.includes("WIE"))
                                    badgeColor = "bg-purple-50 text-purple-700 border-purple-200";
                                  if (tag.includes("PELS"))
                                    badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                                  if (tag.includes("CS"))
                                    badgeColor = "bg-cyan-50 text-cyan-700 border-cyan-200";
                                  if (tag.includes("CAS"))
                                    badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-200";
                                  return (<span key={sIdx} className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-md border shrink-0 whitespace-nowrap ${badgeColor}`} title={soc}>
                                    {tag}
                                  </span>);
                                })}
                            </div>
                          </td>

                          {/* Year of Study */}
                          <td className="py-4 px-3 font-semibold text-slate-600 whitespace-nowrap">
                            {m.year_of_study}
                          </td>

                          {/* Gender */}
                          <td className="py-4 px-3 font-semibold text-slate-600">
                            {m.gender || "—"}
                          </td>

                          {/* T-Shirt Size */}
                          <td className="py-4 px-3">
                            <span className="font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                              {m.tshirt_size || "L"}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              <button type="button" onClick={() => window.open(getPrimaryMemberCardPdfUrl(m), "_blank")} className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] uppercase transition border border-blue-200 shadow-xs cursor-pointer flex items-center gap-1" title="Open Official IEEE Card PDF in new tab">
                                <FileText size={12} className="text-blue-600" />
                                <span>PDF</span>
                              </button>
                              <button type="button" onClick={() => setInspectingStudentMember(m)} className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] uppercase transition border border-slate-200 cursor-pointer" title="Inspect Profile Details">
                                View
                              </button>
                              <button type="button" onClick={() => setEditingStudentMember(m)} className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white font-bold text-[11px] uppercase tracking-wider transition shadow-xs cursor-pointer">
                                Edit
                              </button>
                              <button type="button" onClick={() => handleDeleteStudentMember(m.id, m.roll_number)} className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] uppercase tracking-wider transition border border-rose-200 cursor-pointer">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>);
                      })}

                      {filteredStudentList.length === 0 && (<tr>
                        <td colSpan={9} className="py-16 text-center text-slate-400 font-bold">
                          {studentMembersLoading ? (<div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin text-blue-600" size={20} />
                            <span>Loading student members from Supabase...</span>
                          </div>) : ("No student members found matching the criteria.")}
                        </td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ─── 5. FULL STUDENT PROFILE INSPECTION MODAL (MILK WHITE) ─── */}
              {inspectingStudentMember && (<div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn text-slate-800">
                  {/* Modal Hero Header */}
                  <div className="bg-slate-50 border-b border-slate-200 text-slate-900 p-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 min-w-[5rem] min-h-[5rem] max-w-[5rem] max-h-[5rem] rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl font-black text-slate-700 shadow-xs overflow-hidden shrink-0">
                        {inspectingStudentMember.avatar_url ? (<img src={inspectingStudentMember.avatar_url} alt={inspectingStudentMember.first_name} className="w-full h-full object-cover object-top" />) : (`${inspectingStudentMember.first_name?.[0] || ''}${inspectingStudentMember.last_name?.[0] || ''}`)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Verified Student Profile</span>
                        <h3 className="text-2xl font-black text-slate-900">{inspectingStudentMember.first_name} {inspectingStudentMember.last_name}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{inspectingStudentMember.email}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setInspectingStudentMember(null)} className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Modal Profile Details Matrix */}
                  <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] uppercase font-bold text-slate-500">Roll Number</p>
                        <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{inspectingStudentMember.roll_number}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] uppercase font-bold text-slate-500">IEEE Member ID</p>
                        <p className="text-sm font-mono font-bold text-blue-600 mt-0.5">{inspectingStudentMember.ieee_id || "PENDING"}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] uppercase font-bold text-slate-500">Security PIN</p>
                        <p className="text-sm font-mono font-bold text-emerald-600 mt-0.5">{inspectingStudentMember.security_pin || "••••"}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] uppercase font-bold text-slate-500">Department</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">{inspectingStudentMember.department}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] uppercase font-bold text-slate-500">Year of Study</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">{inspectingStudentMember.year_of_study}</p>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-[10px] uppercase font-bold text-slate-500">Phone</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">{inspectingStudentMember.phone || "Not Provided"}</p>
                      </div>
                    </div>

                    {/* Official IEEE PDF Card Block */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                          <FileText size={14} className="text-blue-600" />
                          <span>Official IEEE Card (PDF)</span>
                        </p>
                        <p className="text-xs font-mono text-slate-500 mt-0.5 truncate max-w-[280px]">
                          {inspectingStudentMember.card_pdf_url || `/cards/${inspectingStudentMember.ieee_id && inspectingStudentMember.ieee_id !== 'PENDING' ? inspectingStudentMember.ieee_id : inspectingStudentMember.roll_number}.pdf`}
                        </p>
                      </div>
                      <button type="button" onClick={() => window.open(getPrimaryMemberCardPdfUrl(inspectingStudentMember), "_blank")} className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition shadow-xs flex items-center gap-1.5 shrink-0 cursor-pointer">
                        <ExternalLink size={13} />
                        <span>Open PDF</span>
                      </button>
                    </div>

                    {/* Selected Societies */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <p className="text-[11px] font-bold uppercase text-slate-700 tracking-wider mb-2">Registered Society Chapters</p>
                      <div className="flex flex-wrap gap-2">
                        {(inspectingStudentMember.target_societies || ["IEEE Student Branch SREC"]).map((soc, idx) => (<span key={idx} className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs">
                          {soc}
                        </span>))}
                      </div>
                    </div>

                    {/* Bio & SOP */}
                    {inspectingStudentMember.bio_sop && (<div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <p className="text-[11px] font-bold uppercase text-slate-700 tracking-wider mb-1.5">Statement of Purpose / Bio</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{inspectingStudentMember.bio_sop}</p>
                    </div>)}

                    {/* Action footer */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                      <button type="button" onClick={() => {
                        const m = inspectingStudentMember;
                        setInspectingStudentMember(null);
                        setEditingStudentMember(m);
                      }} className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition shadow-sm text-center cursor-pointer">
                        Edit Student Record
                      </button>
                      <button type="button" onClick={() => setInspectingStudentMember(null)} className="py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition border border-slate-200 cursor-pointer">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>)}
            </div>
          )}

          {/* ADD NEW STUDENT MEMBER MODAL OVERLAY (MILK WHITE) */}
          {isAddMemberOpen && (<div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn text-slate-800">
              <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Database Entry Creation</span>
                  <h3 className="text-xl font-black text-slate-900">Add New Student Member Record</h3>
                  <p className="text-xs text-slate-500">Creates a new member profile in `public.student_members` table</p>
                </div>
                <button type="button" onClick={() => setIsAddMemberOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddStudentMember} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Roll Number */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Roll / Register Number <span className="text-rose-500">*</span></label>
                    <input type="text" value={newMemberForm.roll_number} onChange={(e) => setNewMemberForm({ ...newMemberForm, roll_number: e.target.value })} placeholder="e.g. 21CS045" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" required />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Official Email <span className="text-rose-500">*</span></label>
                    <input type="email" value={newMemberForm.email} onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })} placeholder="student@srec.ac.in" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" required />
                  </div>

                  {/* First Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">First Name <span className="text-rose-500">*</span></label>
                    <input type="text" value={newMemberForm.first_name} onChange={(e) => setNewMemberForm({ ...newMemberForm, first_name: e.target.value })} placeholder="e.g. Surya" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" required />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Last Name <span className="text-rose-500">*</span></label>
                    <input type="text" value={newMemberForm.last_name} onChange={(e) => setNewMemberForm({ ...newMemberForm, last_name: e.target.value })} placeholder="e.g. Narayanan" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" required />
                  </div>

                  {/* IEEE Member ID */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">IEEE Member ID</label>
                    <input type="text" value={newMemberForm.ieee_id} onChange={(e) => setNewMemberForm({ ...newMemberForm, ieee_id: e.target.value })} placeholder="e.g. 102075943 or PENDING" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" />
                  </div>

                  {/* Department */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Department</label>
                    <select value={newMemberForm.department} onChange={(e) => setNewMemberForm({ ...newMemberForm, department: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none">
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="EIE">EIE</option>
                      <option value="IT">IT</option>
                      <option value="AI & DS">AI & DS</option>
                      <option value="CSS">CSS</option>
                      <option value="BME">BME</option>
                      <option value="RA">RA</option>
                      <option value="MECH">MECH</option>
                      <option value="AERO">AERO</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Year of Study */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Year of Study</label>
                    <select value={newMemberForm.year_of_study} onChange={(e) => setNewMemberForm({ ...newMemberForm, year_of_study: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none">
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="1st Year PG">1st Year PG</option>
                      <option value="2nd Year PG">2nd Year PG</option>
                    </select>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Gender</label>
                    <select value={newMemberForm.gender} onChange={(e) => setNewMemberForm({ ...newMemberForm, gender: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none">
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* T-Shirt Size */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">T-Shirt Size</label>
                    <select value={newMemberForm.tshirt_size} onChange={(e) => setNewMemberForm({ ...newMemberForm, tshirt_size: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none">
                      <option value="XXS">XXS</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="3XL">3XL</option>
                    </select>
                  </div>

                  {/* Applicant Category */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Applicant Category</label>
                    <select value={newMemberForm.applicant_type} onChange={(e) => setNewMemberForm({ ...newMemberForm, applicant_type: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none">
                      <option value="undergraduate">Undergraduate (BE/B.Tech)</option>
                      <option value="postgraduate">Postgraduate (ME/M.Tech/MBA)</option>
                      <option value="professional">Professional / Faculty</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Phone Number</label>
                    <input type="text" value={newMemberForm.phone} onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })} placeholder="+91 9876543210" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" />
                  </div>

                  {/* Membership Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Status</label>
                    <select value={newMemberForm.membership_status} onChange={(e) => setNewMemberForm({ ...newMemberForm, membership_status: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none">
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="EXPIRED">EXPIRED</option>
                    </select>
                  </div>

                  {/* Selected Societies Checklist */}
                  <div className="space-y-2 col-span-full pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                      <span>Selected Societies / Affiliated Chapters</span>
                      <span className="text-[10px] text-blue-600 font-bold">({newMemberForm.target_societies.length} Selected)</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ALL_TECHNICAL_SOCIETIES.map((socName) => {
                        const isSelected = newMemberForm.target_societies.includes(socName);
                        return (<button key={socName} type="button" onClick={() => {
                          const current = newMemberForm.target_societies;
                          const next = current.includes(socName)
                            ? current.filter(s => s !== socName)
                            : [...current, socName];
                          setNewMemberForm({ ...newMemberForm, target_societies: next });
                        }} className={`p-2 rounded-xl text-left text-[11px] font-bold border transition flex items-center justify-between cursor-pointer ${isSelected
                          ? "bg-blue-50 border-blue-400 text-blue-700"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"}`}>
                          <span className="truncate">{socName.replace("IEEE ", "")}</span>
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"}`}>
                            {isSelected && <Check size={10} className="stroke-[3]" />}
                          </div>
                        </button>);
                      })}
                    </div>
                  </div>

                  {/* Original IEEE PDF Card Upload */}
                  <div className="col-span-full space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                      <span>Original IEEE Membership Card (PDF)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Drop file or enter direct URL</span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <input type="text" value={newMemberForm.card_pdf_url} onChange={(e) => setNewMemberForm({ ...newMemberForm, card_pdf_url: e.target.value })} placeholder="e.g. /cards/102298938.pdf or Supabase URL" className="flex-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs bg-white text-slate-900 focus:border-blue-600 outline-none" />
                      <label className={`px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs ${isUploadingAdminPdf ? 'opacity-50 pointer-events-none' : ''}`}>
                        {isUploadingAdminPdf ? <Loader2 size={13} className="animate-spin text-white" /> : <Upload size={13} />}
                        <span>{isUploadingAdminPdf ? "Uploading..." : "Upload PDF"}</span>
                        <input type="file" accept="application/pdf" onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f)
                            handleAdminUploadPdf(f, false);
                        }} disabled={isUploadingAdminPdf} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsAddMemberOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition border border-slate-200 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={isAddingMember} className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-sm transition disabled:opacity-50 cursor-pointer">
                    {isAddingMember ? "Creating Member..." : "Create Student Member Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>)}

          {/* EDIT STUDENT MEMBER MODAL OVERLAY (MILK WHITE) */}
          {editingStudentMember && (<div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn text-slate-800">
              <div className="bg-slate-50 border-b border-slate-200 p-6 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Edit Member Record</span>
                  <h3 className="text-xl font-black text-slate-900">{editingStudentMember.first_name} {editingStudentMember.last_name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Roll: {editingStudentMember.roll_number} · Email: {editingStudentMember.email}</p>
                </div>
                <button type="button" onClick={() => setEditingStudentMember(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={updateStudentMember} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Roll / Register Number (Editable) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Roll / Register Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingStudentMember.roll_number || ""}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, roll_number: e.target.value })}
                      placeholder="e.g. 71812507044 or 21CS045"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                      required
                    />
                  </div>

                  {/* Official Email (Editable) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Official Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editingStudentMember.email || ""}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, email: e.target.value })}
                      placeholder="student@srec.ac.in"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                      required
                    />
                  </div>

                  {/* First Name (Editable) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingStudentMember.first_name || ""}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, first_name: e.target.value })}
                      placeholder="e.g. Priyanka"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                      required
                    />
                  </div>

                  {/* Last Name (Editable) */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingStudentMember.last_name || ""}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, last_name: e.target.value })}
                      placeholder="e.g. S"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                      required
                    />
                  </div>

                  {/* IEEE Member ID */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">IEEE Member ID</label>
                    <input
                      type="text"
                      value={editingStudentMember.ieee_id || ""}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, ieee_id: e.target.value })}
                      placeholder="e.g. 102075943 or PENDING"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Department</label>
                    <select
                      value={editingStudentMember.department || ""}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                      required
                    >
                      <option value="CSE">CSE</option>
                      <option value="ECE">ECE</option>
                      <option value="EEE">EEE</option>
                      <option value="EIE">EIE</option>
                      <option value="IT">IT</option>
                      <option value="AI & DS">AI & DS</option>
                      <option value="CSS">CSS</option>
                      <option value="BME">BME</option>
                      <option value="RA">RA</option>
                      <option value="MECH">MECH</option>
                      <option value="AERO">AERO</option>
                      <option value="CIVIL">CIVIL</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Year of Study */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Year of Study</label>
                    <select
                      value={editingStudentMember.year_of_study || ""}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, year_of_study: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                      required
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="1st Year PG">1st Year PG</option>
                      <option value="2nd Year PG">2nd Year PG</option>
                    </select>
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Gender</label>
                    <select
                      value={editingStudentMember.gender || ""}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, gender: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* T-Shirt Size */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">T-Shirt Size</label>
                    <select
                      value={editingStudentMember.tshirt_size || "L"}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, tshirt_size: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                    >
                      <option value="XXS">XXS</option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                      <option value="3XL">3XL</option>
                    </select>
                  </div>

                  {/* Applicant Type */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Applicant Category</label>
                    <select
                      value={editingStudentMember.applicant_type || "undergraduate"}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, applicant_type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                    >
                      <option value="undergraduate">Undergraduate (BE/B.Tech)</option>
                      <option value="postgraduate">Postgraduate (ME/M.Tech/MBA)</option>
                      <option value="professional">Professional / Faculty</option>
                    </select>
                  </div>

                  {/* Mobile Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Phone Number</label>
                    <input
                      type="text"
                      value={editingStudentMember.phone || ""}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                    />
                  </div>

                  {/* Membership Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Membership Status</label>
                    <select
                      value={editingStudentMember.membership_status || "ACTIVE"}
                      onChange={(e) => setEditingStudentMember({ ...editingStudentMember, membership_status: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="EXPIRED">EXPIRED</option>
                    </select>
                  </div>

                  {/* Selected Societies Checklist */}
                  <div className="space-y-2 col-span-full pt-2 border-t border-slate-100">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between">
                      <span>Affiliated Chapters / Societies</span>
                      <span className="text-[10px] text-blue-600 font-bold">
                        ({(Array.isArray(editingStudentMember.target_societies) ? editingStudentMember.target_societies : []).length} Selected)
                      </span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {ALL_TECHNICAL_SOCIETIES.map((socName) => {
                        const currentSocieties = Array.isArray(editingStudentMember.target_societies)
                          ? editingStudentMember.target_societies
                          : [];
                        const isSelected = currentSocieties.includes(socName);
                        return (
                          <button
                            key={socName}
                            type="button"
                            onClick={() => {
                              const next = isSelected
                                ? currentSocieties.filter((s) => s !== socName)
                                : [...currentSocieties, socName];
                              setEditingStudentMember({ ...editingStudentMember, target_societies: next });
                            }}
                            className={`p-2 rounded-xl text-left text-[11px] font-bold border transition flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? "bg-blue-50 border-blue-400 text-blue-700"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className="truncate">{socName.replace("IEEE ", "")}</span>
                            <div
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                                isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check size={10} className="stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Original IEEE PDF Card Upload */}
                  <div className="col-span-full space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                      <span>Original IEEE Membership Card (PDF)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Drop file or enter direct URL</span>
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-2.5">
                      <input
                        type="text"
                        value={editingStudentMember.card_pdf_url || ""}
                        onChange={(e) => setEditingStudentMember({ ...editingStudentMember, card_pdf_url: e.target.value })}
                        placeholder="e.g. /cards/102298938.pdf or Supabase URL"
                        className="flex-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs bg-white text-slate-900 focus:border-blue-600 outline-none"
                      />
                      <label className={`px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs ${isUploadingAdminPdf ? 'opacity-50 pointer-events-none' : ''}`}>
                        {isUploadingAdminPdf ? <Loader2 size={13} className="animate-spin text-white" /> : <Upload size={13} />}
                        <span>{isUploadingAdminPdf ? "Uploading..." : "Upload PDF"}</span>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) handleAdminUploadPdf(f, true);
                          }}
                          disabled={isUploadingAdminPdf}
                          className="hidden"
                        />
                      </label>
                      {(editingStudentMember.card_pdf_url || (editingStudentMember.ieee_id && editingStudentMember.ieee_id !== "PENDING")) && (
                        <button
                          type="button"
                          onClick={() => window.open(getPrimaryMemberCardPdfUrl(editingStudentMember), "_blank")}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1 shrink-0 cursor-pointer border border-slate-200"
                          title="Preview current PDF in new tab"
                        >
                          <Eye size={13} />
                          <span>Preview</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setEditingStudentMember(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition border border-slate-200 cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" disabled={isSavingStudentMember} className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs uppercase tracking-wider shadow-sm transition disabled:opacity-50 cursor-pointer">
                    {isSavingStudentMember ? "Saving Changes..." : "Save Member Record"}
                  </button>
                </div>
              </form>
            </div>
          </div>)}

          {/* TAB: AWARDS & RECOGNITIONS (MILK WHITE) */}
          {activeTab === "awards" && (<div className="space-y-6 w-full max-w-full min-w-0">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Awards &amp; Recognitions</h2>
              <p className="text-sm text-slate-500 mt-1">Manage accolades, grants, and honors received by SREC Student Branch.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 w-full">
              {/* Form */}
              <form onSubmit={submitAward} className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-4 self-start">
                <h3 className="text-lg font-black text-slate-900">{editingAwardId ? "Edit Award" : "Add New Award"}</h3>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Award Title</label>
                  <input type="text" placeholder="e.g. IEEE Appreciation Award" value={awardForm.title} onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Year</label>
                    <input type="number" value={awardForm.year} onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" required />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Grant / Amount</label>
                    <input type="text" placeholder="e.g. Rs.4000 / USD 1000" value={awardForm.amount} onChange={(e) => setAwardForm({ ...awardForm, amount: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Category / Awarder</label>
                  <input type="text" placeholder="e.g. IEEE Madras Section / IEEE HQ" value={awardForm.category} onChange={(e) => setAwardForm({ ...awardForm, category: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Description</label>
                  <textarea rows={3} placeholder="Award citation or description..." value={awardForm.description} onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Image URL</label>
                  <input type="text" placeholder="Optional image filename or public link..." value={awardForm.image_url} onChange={(e) => setAwardForm({ ...awardForm, image_url: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 text-slate-900 focus:bg-white focus:border-blue-600 outline-none" />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 rounded-xl bg-slate-900 hover:bg-black py-2.5 font-bold text-white text-sm transition shadow-sm cursor-pointer">
                    {editingAwardId ? "Update Award" : "Add Award"}
                  </button>
                  {editingAwardId && (<button type="button" onClick={resetAwardForm} className="rounded-xl bg-slate-100 px-4 py-2.5 font-semibold text-slate-700 text-sm hover:bg-slate-200 transition border border-slate-200 cursor-pointer">
                    Cancel
                  </button>)}
                </div>
              </form>

              {/* List Table */}
              <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70">
                  <h3 className="text-lg font-black text-slate-900">Award Records ({awards.length})</h3>
                </div>
                <div className="overflow-x-auto flex-1 custom-scrollbar">
                  <table className="w-full min-w-[500px] border-collapse">
                    <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-black border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3.5 text-left">Year</th>
                        <th className="px-6 py-3.5 text-left">Award Title</th>
                        <th className="px-6 py-3.5 text-left">Category & Amount</th>
                        <th className="px-6 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {awards.map((award) => (<tr key={award.id} className="hover:bg-slate-50/70 transition-colors text-slate-800">
                        <td className="px-6 py-4 text-xs font-mono font-bold text-blue-600">{award.year}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{award.title}</p>
                          {award.description && <p className="text-xs text-slate-500 truncate max-w-xs">{award.description}</p>}
                        </td>
                        <td className="px-6 py-4 text-xs">
                          <p className="font-semibold text-slate-700">{award.category || "General"}</p>
                          {award.amount && <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] inline-block mt-0.5">{award.amount}</span>}
                        </td>
                        <td className="px-6 py-4 text-sm text-right space-x-2">
                          <button type="button" onClick={() => {
                            setEditingAwardId(award.id);
                            setAwardForm({
                              title: award.title,
                              year: award.year.toString(),
                              description: award.description || "",
                              category: award.category || "IEEE Madras Section",
                              amount: award.amount || "",
                              image_url: award.image_url || "",
                            });
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }} className="text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer">
                            Edit
                          </button>
                          <button type="button" onClick={() => deleteAward(award.id)} className="text-rose-600 hover:text-rose-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer">
                            Delete
                          </button>
                        </td>
                      </tr>))}
                      {awards.length === 0 && (<tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400 font-medium">
                          No awards found in the database.
                        </td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>)}

          {/* TAB: ADMIN ACCOUNTS (MILK WHITE) */}
          {activeTab === "admin_users" && (<div className="space-y-6 w-full max-w-full min-w-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Admin Accounts &amp; Security Roles</h2>
                <p className="text-sm text-slate-500 mt-1">Assign role-based access control, manage credentials, and configure admin permissions.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProfileForm({ username: adminProfile.username, role: adminProfile.role, avatar: adminProfile.avatar });
                  setShowProfileModal(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-blue-700 text-xs font-bold shadow-xs transition cursor-pointer self-start md:self-auto"
              >
                <ShieldCheck size={16} className="text-blue-600" />
                <span>My Active Clearance: <strong>{adminProfile.role}</strong></span>
              </button>
            </div>

            {!permissions.canManageAdmins ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xs text-center flex flex-col items-center justify-center max-w-xl mx-auto py-12">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mb-4 shadow-xs">
                  <Lock size={28} />
                </div>
                <h3 className="text-lg font-black text-slate-900">Master Clearance Required</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-md">
                  You are currently authenticated as <span className="font-bold text-slate-800">{adminProfile.username}</span> with clearance level <span className="font-bold text-blue-600">{adminProfile.role}</span>. Managing system administrative accounts requires <strong>Master Administrator</strong> clearance.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setProfileForm({ username: adminProfile.username, role: adminProfile.role, avatar: adminProfile.avatar });
                      setShowProfileModal(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
                  >
                    Open Clearance Manager
                  </button>
                  <button
                    onClick={() => setActiveTab("overview")}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Return to Overview
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-3 w-full">
                {/* Form Card */}
                <form onSubmit={addAdminUser} className="lg:col-span-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col gap-4 self-start">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <ShieldCheck className="text-blue-600" size={20} />
                    <h3 className="text-lg font-black text-slate-900">Provision Admin</h3>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Username / ID</label>
                    <input type="text" placeholder="e.g. john_doe" value={adminForm.username} onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none" required />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
                    <input type="password" placeholder="Create strong password" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none" required />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Assigned Role &amp; Permissions</label>
                    <select
                      value={adminForm.role}
                      onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-slate-50 text-slate-900 font-bold focus:bg-white focus:border-blue-600 outline-none"
                    >
                      <option value="Master Administrator">👑 Master Administrator (Full Access)</option>
                      <option value="Student Registrar & Admissions">👥 Student Registrar (Rosters &amp; Applications)</option>
                      <option value="Activities & Event Coordinator">📅 Activities Coordinator (Events &amp; Launch)</option>
                      <option value="Chapter & Society Lead">🏛️ Chapter &amp; Society Lead (Societies &amp; Bearers)</option>
                      <option value="Auditor & Viewer (Read-Only)">🔍 Auditor &amp; Viewer (Read-Only Access)</option>
                    </select>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800">Clearance Summary:</p>
                    <p>• {adminForm.role === "Master Administrator" ? "Unrestricted CRUD access across all database tables and settings." : adminForm.role === "Student Registrar & Admissions" ? "Can approve, verify, add and export student member records." : adminForm.role === "Activities & Event Coordinator" ? "Can manage activities, launch remote, annual plans and event reports." : adminForm.role === "Chapter & Society Lead" ? "Can manage chapter leadership, officer cards and society events." : "Read-only inspection access without mutation privileges."}</p>
                  </div>

                  <button className="mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 font-bold text-white text-sm transition cursor-pointer shadow-md shadow-blue-500/20">
                    Provision Account
                  </button>
                </form>

                {/* List Card */}
                <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white shadow-xs overflow-hidden flex flex-col">
                  <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-900">Registered Admins ({adminsList.length})</h3>
                    <span className="text-xs font-bold text-slate-500">Live Database</span>
                  </div>
                  <div className="overflow-x-auto flex-1 custom-scrollbar">
                    <table className="w-full min-w-[500px] border-collapse">
                      <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-black border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3.5 text-left">Admin User</th>
                          <th className="px-6 py-3.5 text-left">Assigned Role</th>
                          <th className="px-6 py-3.5 text-left">Provisioned</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminsList.map((admin) => {
                          const displayName = admin.username || admin.name || admin.email || admin.user_name || "admin";
                          const roleName = admin.role || (displayName.toLowerCase().includes("admin") ? "Master Administrator" : "Society Officer");
                          return (
                            <tr key={admin.id} className="hover:bg-slate-50/70 transition-colors text-slate-800">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center border border-blue-200">
                                    {displayName.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">{displayName}</p>
                                    <p className="text-[10px] text-slate-400">{displayName.toLowerCase()}@ieeesrec.org</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-xs">
                                <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[11px] border ${
                                  roleName.includes("Master")
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : roleName.includes("Registrar") || roleName.includes("Admission")
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : roleName.includes("Activities") || roleName.includes("Event")
                                    ? "bg-purple-50 text-purple-700 border-purple-200"
                                    : roleName.includes("Society") || roleName.includes("Chapter")
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                                }`}>
                                  {roleName}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                                {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "Active"}
                              </td>
                              <td className="px-6 py-4 text-sm text-right">
                                <button
                                  type="button"
                                  onClick={() => deleteAdminUser(admin.id)}
                                  className="text-rose-600 hover:text-rose-700 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                                >
                                  Revoke
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {adminsList.length === 0 && (<tr>
                          <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400 font-bold">
                            No admin accounts found in the database.
                          </td>
                        </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>)}

          {/* ADMIN SECURITY CLEARANCE & ROLE PROFILE MODAL */}
          {showProfileModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                      <ShieldCheck size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">Admin Security Clearance</h3>
                      <p className="text-xs text-slate-500 font-medium">Configure active role constraints &amp; identity</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-slate-700 transition"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Modal Body */}
                <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
                  {/* Current Identity Preview */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <div className="relative shrink-0">
                      <img
                        src={profileForm.avatar}
                        alt={profileForm.username}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
                        }}
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900">{profileForm.username || "Admin Manager"}</p>
                      <span className="inline-block px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-xs">
                        {profileForm.role}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-1 truncate">{adminProfile.email}</p>
                    </div>
                  </div>

                  {/* Form Inputs */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Admin Display Name</label>
                      <input
                        type="text"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold bg-white text-slate-900 focus:border-blue-600 outline-none"
                        placeholder="e.g. Admin Manager / Dr. Counselor"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Security Clearance / Role Switcher</label>
                      <select
                        value={profileForm.role}
                        onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                        className="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-bold bg-white text-slate-900 focus:border-blue-600 outline-none"
                      >
                        <option value="Master Administrator">👑 Master Administrator (Full Access)</option>
                        <option value="Student Registrar & Admissions">👥 Student Registrar &amp; Admissions (Rosters &amp; ID Cards)</option>
                        <option value="Activities & Event Coordinator">📅 Activities &amp; Event Coordinator (Events &amp; Launch)</option>
                        <option value="Chapter & Society Lead">🏛️ Chapter &amp; Society Lead (Societies &amp; Leaders)</option>
                        <option value="Auditor & Viewer (Read-Only)">🔍 Auditor &amp; Viewer (Read-Only Mode)</option>
                      </select>
                      <p className="text-[11px] text-slate-400 mt-0.5">Switch role to simulate different admin actions &amp; security boundaries.</p>
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">Avatar Image URL</label>
                      <input
                        type="url"
                        value={profileForm.avatar}
                        onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                        className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-medium bg-white text-slate-900 focus:border-blue-600 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Permissions Capabilities Matrix */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Granted Clearance Capabilities</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5">
                        <Check size={14} className={profileForm.role.includes("Master") ? "text-emerald-600" : "text-slate-300"} />
                        <span className={profileForm.role.includes("Master") ? "font-bold text-slate-800" : "text-slate-400 line-through"}>Manage Admin Users</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check size={14} className={profileForm.role.includes("Master") ? "text-emerald-600" : "text-slate-300"} />
                        <span className={profileForm.role.includes("Master") ? "font-bold text-slate-800" : "text-slate-400 line-through"}>Edit Live Site CMS</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check size={14} className={profileForm.role.includes("Master") || profileForm.role.includes("Registrar") ? "text-emerald-600" : "text-slate-300"} />
                        <span className={profileForm.role.includes("Master") || profileForm.role.includes("Registrar") ? "font-bold text-slate-800" : "text-slate-400 line-through"}>Manage Students &amp; Cards</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check size={14} className={profileForm.role.includes("Master") || profileForm.role.includes("Activities") || profileForm.role.includes("Chapter") ? "text-emerald-600" : "text-slate-300"} />
                        <span className={profileForm.role.includes("Master") || profileForm.role.includes("Activities") || profileForm.role.includes("Chapter") ? "font-bold text-slate-800" : "text-slate-400 line-through"}>Edit Activities &amp; Events</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowProfileModal(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
                    >
                      Save &amp; Apply Clearance
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

            </main>

            {/* MOBILE BOTTOM NAVIGATION DOCK (Milk White) */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200 backdrop-blur-xl px-2 py-2 flex items-center justify-around shadow-lg">
              {[
                { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
                { id: "launch_control", label: "Remote", icon: <Rocket size={18} className="text-blue-600" /> },
                { id: "activities", label: "Events", icon: <Activity size={18} /> },
                { id: "student_roster", label: `Members (${studentMembers.length})`, icon: <Users size={18} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition active:scale-95 ${
                    activeTab === tab.id
                      ? "text-slate-900 font-extrabold bg-slate-100 border border-slate-200"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.icon}
                  <span className="text-[10px] mt-0.5 font-bold">{tab.label}</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-slate-500 hover:text-slate-900 transition active:scale-95 cursor-pointer"
              >
                <Menu size={18} />
                <span className="text-[10px] mt-0.5 font-bold">More</span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

// Sub-components for separated page editors
const LandingCMSForm = ({ pageContents, onSave }) => {
  const heroTitle = pageContents.find(c => c.page_key === "landing" && c.content_key === "hero_title")?.content_text || "Global Excellence";
  const heroDesc = pageContents.find(c => c.page_key === "landing" && c.content_key === "hero_desc")?.content_text || "Empowering minds and shaping the future through uncompromising technology research.";
  const [title, setTitle] = useState(heroTitle);
  const [desc, setDesc] = useState(heroDesc);
  useEffect(() => {
    setTitle(heroTitle);
    setDesc(heroDesc);
  }, [heroTitle, heroDesc]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave("landing", "hero_title", title);
    onSave("landing", "hero_desc", desc);
    alert("Landing page content updated successfully!");
  };
  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero Heading Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-lg border px-4 py-3 text-sm" required />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero Subdescription</label>
        <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} className="rounded-lg border px-4 py-3 text-sm" required />
      </div>
      <button type="submit" className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white text-sm">
        Save Landing Page Content
      </button>
    </form>
  );
};

const AboutCMSForm = ({ pageContents, onSave }) => {
  const introTextVal = pageContents.find(c => c.page_key === "about" && c.content_key === "intro_text")?.content_text || "The IEEE Student Branch of Sri Ramakrishna Engineering College...";
  const principalMsgVal = pageContents.find(c => c.page_key === "about" && c.content_key === "principal_message")?.content_text || "Fostering innovation, research, and technical excellence...";
  const hodMsgVal = pageContents.find(c => c.page_key === "about" && c.content_key === "hod_message")?.content_text || "Empowering students with strong fundamentals, technological innovation, and practical excellence to lead the future of electrical and electronics engineering.";
  const counselorMsgVal = pageContents.find(c => c.page_key === "about" && c.content_key === "counselor_message")?.content_text || "Empowering students to transcend boundaries...";
  const [introText, setIntroText] = useState(introTextVal);
  const [principalMsg, setPrincipalMsg] = useState(principalMsgVal);
  const [hodMsg, setHodMsg] = useState(hodMsgVal);
  const [counselorMsg, setCounselorMsg] = useState(counselorMsgVal);
  useEffect(() => {
    setIntroText(introTextVal);
    setPrincipalMsg(principalMsgVal);
    setHodMsg(hodMsgVal);
    setCounselorMsg(counselorMsgVal);
  }, [introTextVal, principalMsgVal, hodMsgVal, counselorMsgVal]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave("about", "intro_text", introText);
    onSave("about", "principal_message", principalMsg);
    onSave("about", "hod_message", hodMsg);
    onSave("about", "counselor_message", counselorMsg);
    alert("About page content updated successfully!");
  };
  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">About SREC Intro Text</label>
        <textarea rows={3} value={introText} onChange={(e) => setIntroText(e.target.value)} className="rounded-lg border px-4 py-3 text-sm" required />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Principal Message Quote</label>
        <textarea rows={3} value={principalMsg} onChange={(e) => setPrincipalMsg(e.target.value)} className="rounded-lg border px-4 py-3 text-sm" required />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">HOD (EEE) Message Quote</label>
        <textarea rows={3} value={hodMsg} onChange={(e) => setHodMsg(e.target.value)} className="rounded-lg border px-4 py-3 text-sm" required />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Counselor Message Quote</label>
        <textarea rows={3} value={counselorMsg} onChange={(e) => setCounselorMsg(e.target.value)} className="rounded-lg border px-4 py-3 text-sm" required />
      </div>
      <button type="submit" className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white text-sm">
        Save About Page Content
      </button>
    </form>
  );
};

const ContactCMSForm = ({ pageContents, onSave }) => {
  const subtitleVal = pageContents.find(c => c.page_key === "contact" && c.content_key === "contact_subtitle")?.content_text || "We’d love to hear from you. Reach out to the IEEE Student Branch SREC.";
  const addressVal = pageContents.find(c => c.page_key === "contact" && c.content_key === "address")?.content_text || "Vattamalaipalayam, NGGO Colony, Coimbatore, Tamil Nadu 641022";
  const phoneVal = pageContents.find(c => c.page_key === "contact" && c.content_key === "phone")?.content_text || "+91 422 246 1588";
  const emailVal = pageContents.find(c => c.page_key === "contact" && c.content_key === "email")?.content_text || "ieee@srec.ac.in";
  const [subtitle, setSubtitle] = useState(subtitleVal);
  const [address, setAddress] = useState(addressVal);
  const [phone, setPhone] = useState(phoneVal);
  const [email, setEmail] = useState(emailVal);
  useEffect(() => {
    setSubtitle(subtitleVal);
    setAddress(addressVal);
    setPhone(phoneVal);
    setEmail(emailVal);
  }, [subtitleVal, addressVal, phoneVal, emailVal]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave("contact", "contact_subtitle", subtitle);
    onSave("contact", "address", address);
    onSave("contact", "phone", phone);
    onSave("contact", "email", email);
    alert("Contact page content updated successfully!");
  };
  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero Subtitle</label>
        <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="rounded-lg border px-4 py-3 text-sm" required />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Address Text</label>
        <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} className="rounded-lg border px-4 py-3 text-sm" required />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-lg border px-4 py-3 text-sm" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border px-4 py-3 text-sm" required />
        </div>
      </div>
      <button type="submit" className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white text-sm">
        Save Contact Page Content
      </button>
    </form>
  );
};

export default AdminDashboard;
