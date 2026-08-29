import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import OfficeBearers from "@/components/societies/OfficeBearers";
import SocietyLeadershipAdmin from "./SocietyLeadershipAdmin";
import OfficeBearerCardsAdmin from "./OfficeBearerCardsAdmin";
import EventReportsAdmin from "./EventReportsAdmin";
import { getPrimaryMemberCardPdfUrl, uploadMemberCardPdf } from "@/utils/cardPdfHelper";
import { Activity, Users, Settings, Briefcase, FileText, Banknote, ShieldCheck, LayoutDashboard, LogOut, TrendingUp, Search, Bell, Globe, Award, Layers, Download, Trash2, Crown, Cpu, RefreshCw, X, Plus, FileSpreadsheet, Check, ExternalLink, Upload, Eye, Loader2, ArrowRight, CreditCard, Menu, ChevronRight, Sparkles, Database } from "lucide-react";
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
    role: "admin",
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
  const fetchOfficeBearers = async () => {
    const { data } = await supabase
      .from("office_bearers")
      .select("*")
      .order("year", { ascending: false })
      .order("id", { ascending: true });
    setOfficeRows(data || []);
  };
  const fetchMembers = async () => {
    const { data } = await supabase
      .from("member_counts")
      .select("*")
      .order("year", { ascending: false });
    setMemberRows(data || []);
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
    const { data } = await supabase.from("senior_members").select("*").order("s_no", { ascending: true });
    setSeniorMembers(data || []);
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
    const { data } = await supabase.from("societies").select("*").order("id", { ascending: true });
    setSocieties(data || []);
  };
  const fetchApplications = async () => {
    const { data } = await supabase.from("applications").select("*").order("created_at", { ascending: false });
    setApplications(data || []);
  };
  const fetchStudentMembers = async () => {
    setStudentMembersLoading(true);
    const { data, error } = await supabase
      .from("student_members")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) {
      setStudentMembers(data);
    }
    setStudentMembersLoading(false);
  };
  const updateStudentMember = async (e) => {
    e.preventDefault();
    if (!editingStudentMember)
      return;
    setIsSavingStudentMember(true);
    try {
      const updateData = {
        ieee_id: editingStudentMember.ieee_id,
        department: editingStudentMember.department,
        year_of_study: editingStudentMember.year_of_study,
        gender: editingStudentMember.gender,
        tshirt_size: editingStudentMember.tshirt_size,
        applicant_type: editingStudentMember.applicant_type,
        membership_status: editingStudentMember.membership_status,
        first_name: editingStudentMember.first_name,
        last_name: editingStudentMember.last_name,
        email: editingStudentMember.email,
        roll_number: editingStudentMember.roll_number,
        phone: editingStudentMember.phone,
        designation: editingStudentMember.designation,
        password: editingStudentMember.password,
        target_societies: editingStudentMember.target_societies || ["IEEE Student Branch SREC"],
      };
      if (editingStudentMember.card_pdf_url !== undefined && editingStudentMember.card_pdf_url !== null) {
        updateData.card_pdf_url = editingStudentMember.card_pdf_url;
      }
      let { error } = await supabase
        .from("student_members")
        .update(updateData)
        .eq("id", editingStudentMember.id);
      // If Supabase returns schema cache error for card_pdf_url, retry without it so edits still succeed
      if (error && error.message?.toLowerCase().includes("card_pdf_url")) {
        console.warn("Retrying student member update without card_pdf_url (add column to Supabase schema):", error.message);
        delete updateData.card_pdf_url;
        const retry = await supabase
          .from("student_members")
          .update(updateData)
          .eq("id", editingStudentMember.id);
        error = retry.error;
      }
      if (error) {
        alert("Error updating member: " + error.message);
      }
      else {
        alert("Student Member updated successfully!");
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
      let { error } = await supabase.from("student_members").insert([payload]);
      if (error && error.message?.toLowerCase().includes("card_pdf_url")) {
        console.warn("Retrying member insert without card_pdf_url:", error.message);
        delete payload.card_pdf_url;
        const retry = await supabase.from("student_members").insert([payload]);
        error = retry.error;
      }
      if (error) {
        alert("Error adding student member: " + error.message);
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
      alert("Add failed: " + err.message);
    }
    finally {
      setIsAddingMember(false);
    }
  };
  const fetchAwards = async () => {
    const { data } = await supabase.from("awards").select("*").order("year", { ascending: false }).order("id", { ascending: true });
    setAwards(data || []);
  };
  const fetchAdmins = async () => {
    const { data } = await supabase.from("admins").select("id, username, created_at").order("id", { ascending: true });
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
    fetchActivities();
    fetchOfficeBearers();
    fetchMembers();
    fetchAnnualPlans();
    fetchFundingRequests();
    fetchSeniorMembers();
    fetchSocieties();
    fetchApplications();
    fetchStudentMembers();
    fetchAwards();
    fetchPageContents();
    fetchAdmins();
  }, [navigate]);
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
    if (!adminForm.username || !adminForm.password) {
      alert("Please fill in both fields.");
      return;
    }
    const { error } = await supabase.from("admins").insert([adminForm]);
    if (error) {
      alert("Error adding admin: " + error.message);
    }
    else {
      setAdminForm({ username: "", password: "" });
      fetchAdmins();
      alert("Admin user added successfully!");
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
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "activities", label: "Activities", icon: <Activity size={18} /> },
    { id: "office", label: "Main SB Bearers", icon: <Briefcase size={18} /> },
    { id: "society_leaders", label: "Society Leaders", icon: <Crown size={18} /> },
    { id: "office_cards", label: "Officer ID Cards", icon: <CreditCard size={18} /> },
    { id: "members", label: "Members", icon: <Users size={18} /> },
    { id: "plans", label: "Annual Plans", icon: <FileText size={18} /> },
    { id: "funding", label: "Funding", icon: <Banknote size={18} /> },
    { id: "senior", label: "Senior Members", icon: <ShieldCheck size={18} /> },
    { id: "societies", label: "Societies", icon: <Layers size={18} /> },
    { id: "applications", label: "Applications", icon: <FileText size={18} /> },
    { id: "awards", label: "Awards", icon: <Award size={18} /> },
    { id: "cms_landing", label: "Landing CMS", icon: <FileText size={18} /> },
    { id: "cms_about", label: "About CMS", icon: <FileText size={18} /> },
    { id: "cms_contact", label: "Contact CMS", icon: <FileText size={18} /> },
    { id: "cms_advanced", label: "Advanced CMS", icon: <Settings size={18} /> },
    { id: "admin_users", label: "Admin Accounts", icon: <ShieldCheck size={18} /> },
  ];
  return (<div className="flex min-h-screen bg-[#070e17] font-sans text-slate-100 selection:bg-cyan-500 selection:text-white">
    <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

    {/* MOBILE FULL-SCREEN / SLIDE-OVER CYBER DRAWER */}
    {isDrawerOpen && (
      <div className="fixed inset-0 z-50 lg:hidden flex">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Drawer Sidebar */}
        <div className="relative flex flex-col w-[85%] max-w-xs bg-[#0c1626] border-r border-slate-800 h-full z-10 overflow-y-auto custom-scrollbar shadow-2xl">
          {/* Drawer Header */}
          <div className="px-5 py-4 flex items-center justify-between border-b border-slate-800 bg-[#09121f]">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-md shadow-cyan-500/25">
                <Cpu className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300">
                  IEEE SREC ADMIN
                </h3>
                <p className="text-[9px] font-bold text-cyan-400/90 uppercase tracking-widest">
                  Portal Navigation
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800/80 text-slate-300 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Drawer Menu Items */}
          <div className="flex-1 px-3 py-4 space-y-6">
            {/* Menu */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">MENU</p>
              <button
                onClick={() => {
                  setActiveTab("overview");
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "overview"
                  ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-black shadow-md border border-cyan-400/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">LIVE CONTENT</p>
              <div className="space-y-1">
                {[
                  { id: "activities", label: "Activities", icon: <Activity size={16} />, count: activities.length },
                  { id: "event_reports", label: "Event Reports (DB)", icon: <FileText size={16} /> },
                  { id: "office", label: "Main SB Bearers", icon: <Briefcase size={16} />, count: officeRows.length },
                  { id: "society_leaders", label: "Society Leaders", icon: <Crown size={16} /> },
                  { id: "office_cards", label: "Officer ID Cards (DB)", icon: <CreditCard size={16} /> },
                  { id: "members", label: "Members Track", icon: <Users size={16} /> },
                  { id: "plans", label: "Annual Plans", icon: <FileText size={16} /> },
                  { id: "funding", label: "Funding Requests", icon: <Banknote size={16} /> },
                  { id: "senior", label: "Senior Members", icon: <ShieldCheck size={16} /> },
                  { id: "societies", label: "Societies", icon: <Layers size={16} />, count: societies.length },
                  { id: "applications", label: "Join Submissions", icon: <FileText size={16} />, count: applications.length },
                  { id: "student_roster", label: "Student Directory (DB)", icon: <Users size={16} />, count: studentMembers.length },
                  { id: "awards", label: "Awards & Recognitions", icon: <Award size={16} />, count: awards.length },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === item.id
                      ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-black shadow-md border border-cyan-400/30"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.count !== undefined && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* CMS */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">CMS PAGES</p>
              <div className="space-y-1">
                {[
                  { id: "cms_landing", label: "Landing CMS", icon: <FileText size={16} /> },
                  { id: "cms_about", label: "About CMS", icon: <FileText size={16} /> },
                  { id: "cms_contact", label: "Contact CMS", icon: <FileText size={16} /> },
                  { id: "cms_advanced", label: "Advanced CMS", icon: <Settings size={16} /> },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === item.id
                      ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-black shadow-md border border-cyan-400/30"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* System */}
            <div className="space-y-1.5">
              <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">SYSTEM</p>
              <button
                onClick={() => {
                  setActiveTab("admin_users");
                  setIsDrawerOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "admin_users"
                  ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-black shadow-md border border-cyan-400/30"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} />
                  <span>Admin Accounts</span>
                </div>
                {adminsList.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-slate-300">
                    {adminsList.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-[#09121f] flex flex-col gap-2">
            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-bold flex items-center justify-center gap-2 transition"
            >
              <LogOut size={14} /> Exit Admin Portal
            </button>
          </div>
        </div>
      </div>
    )}

    {/* LEFT SIDEBAR (Desktop Executive Style) */}
    <aside className="hidden lg:flex flex-col w-[280px] bg-[#0c1626] border-r border-slate-800/80 shrink-0 h-screen sticky top-0 overflow-y-auto">
      {/* Brand Logo & Name */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-slate-800/80 bg-[#09121f]">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-lg shadow-cyan-500/25">
          <Cpu className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-300">IEEE SREC ADMIN</h1>
          <p className="text-[10px] font-extrabold text-cyan-400/90 uppercase tracking-widest">Executive Portal</p>
        </div>
      </div>

      {/* Menu Nav */}
      <div className="flex-1 px-4 py-6 space-y-7">
        {/* Group 1: MENU */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">MENU</p>
          <div className="space-y-1">
            <button onClick={() => setActiveTab("overview")} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "overview"
              ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-extrabold shadow-md shadow-cyan-500/20 border border-cyan-400/30"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </div>
            </button>
          </div>
        </div>

        {/* Group 2: WEBSITE CONTENT */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">CONTENT</p>
          <div className="space-y-1">
            {[
              { id: "activities", label: "Activities", icon: <Activity size={18} />, count: activities.length },
              { id: "event_reports", label: "Event Reports (DB)", icon: <FileText size={18} /> },
              { id: "office", label: "Main SB Bearers", icon: <Briefcase size={18} />, count: officeRows.length },
              { id: "society_leaders", label: "Society Leaders", icon: <Crown size={18} /> },
              { id: "office_cards", label: "Officer ID Cards (DB)", icon: <CreditCard size={18} /> },
              { id: "members", label: "Members Track", icon: <Users size={18} /> },
              { id: "plans", label: "Annual Plans", icon: <FileText size={18} /> },
              { id: "funding", label: "Funding Requests", icon: <Banknote size={18} /> },
              { id: "senior", label: "Senior Members", icon: <ShieldCheck size={18} /> },
              { id: "societies", label: "Societies", icon: <Layers size={18} />, count: societies.length },
              { id: "applications", label: "Join Submissions", icon: <FileText size={18} />, count: applications.length },
              { id: "student_roster", label: "Student Directory (DB)", icon: <Users size={18} />, count: studentMembers.length },
              { id: "awards", label: "Awards & Recognitions", icon: <Award size={18} />, count: awards.length }
            ].map((item) => (<button type="button" key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
              ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-extrabold shadow-md shadow-cyan-500/20 border border-cyan-400/30"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === item.id ? "bg-black/30 text-white" : "bg-slate-800 text-slate-400"
                  }`}>
                  {item.count}
                </span>
              )}
            </button>))}
          </div>
        </div>

        {/* Group 3: CMS CHANNELS */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">CMS PAGES</p>
          <div className="space-y-1">
            {[
              { id: "cms_landing", label: "Landing CMS", icon: <FileText size={18} /> },
              { id: "cms_about", label: "About CMS", icon: <FileText size={18} /> },
              { id: "cms_contact", label: "Contact CMS", icon: <FileText size={18} /> },
              { id: "cms_advanced", label: "Advanced CMS", icon: <Settings size={18} /> }
            ].map((item) => (<button type="button" key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
              ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-extrabold shadow-md shadow-cyan-500/20 border border-cyan-400/30"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
            </button>))}
          </div>
        </div>

        {/* Group 4: SYSTEM */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">SYSTEM</p>
          <div className="space-y-1">
            <button onClick={() => setActiveTab("admin_users")} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === "admin_users"
              ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-extrabold shadow-md shadow-cyan-500/20 border border-cyan-400/30"
              : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"}`}>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={18} />
                <span>Admin Accounts</span>
              </div>
              {adminsList.length > 0 && (
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === "admin_users" ? "bg-black/30 text-white" : "bg-slate-800 text-slate-400"
                  }`}>
                  {adminsList.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Group 5: DEVELOPER */}
        <div className="space-y-2">
          <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">DEVELOPER</p>
          <div className="space-y-1">
            <a href="https://surya-ruddy.vercel.app/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-400 hover:bg-slate-800/60 hover:text-cyan-400">
              <div className="flex items-center gap-2.5">
                <Globe size={18} className="text-cyan-400" />
                <span>My Portfolio</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Promo Card at bottom of sidebar */}
      <div className="mx-4 my-6 p-4 bg-gradient-to-br from-[#10213b] to-[#0a1526] border border-cyan-500/30 rounded-2xl text-center flex flex-col gap-2">
        <h4 className="text-xs font-black text-white">IEEE SB SREC Panel</h4>
        <p className="text-[10px] text-slate-300 font-medium">Manage all student chapter updates & records live.</p>
        <a href="https://ieee.org" target="_blank" rel="noreferrer" className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-[11px] font-bold text-white shadow-md shadow-cyan-500/20 hover:brightness-110 transition">
          Visit IEEE Global
        </a>
      </div>
    </aside>

    {/* RIGHT CONTENT CONTAINER */}
    <div className="flex-1 flex flex-col min-w-0 min-h-screen">
      {/* DESKTOP TOP BAR */}
      <header className="hidden lg:flex bg-[#0c1626]/90 border-b border-slate-800/80 h-16 items-center justify-between px-6 sticky top-0 z-35 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span className="text-slate-500">Dashboard</span>
            <ChevronRight size={13} className="text-slate-600" />
            <span className="text-cyan-300 font-extrabold">
              {tabs.find(t => t.id === activeTab)?.label || "Overview"}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-80 bg-[#070e17] border border-slate-700/80 rounded-xl px-3.5 py-1.5 focus-within:border-cyan-400 transition-colors">
            <Search size={15} className="text-cyan-400 shrink-0" />
            <input type="text" placeholder="Search database or type command..." className="w-full text-xs bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder-slate-400" />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[9px] font-medium text-slate-300">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {/* Live Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LIVE DATABASE</span>
          </div>

          {/* Refresh DB Button */}
          <button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-cyan-500/10 border border-white/10 hover:border-cyan-500/40 text-xs font-bold text-slate-200 hover:text-cyan-300 transition-all active:scale-95 cursor-pointer shadow-sm"
            title="Refresh all database collections"
          >
            <RefreshCw size={13} className={isRefreshing ? "animate-spin text-cyan-400" : "text-cyan-400"} />
            <span>{isRefreshing ? "Syncing..." : "Refresh DB"}</span>
          </button>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-3 border-l border-slate-800 pl-5">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-white">Admin Manager</p>
              <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">IEEE Admin</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md border border-cyan-400/30">
              A
            </div>
            <button onClick={handleLogout} className="text-xs text-rose-400 hover:text-rose-300 font-extrabold uppercase tracking-wider flex items-center gap-1 pl-2 border-l border-slate-800 transition-colors cursor-pointer">
              <LogOut size={14} /> Exit
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE TOP BAR (Sticky) */}
      <div className="lg:hidden bg-[#0c1626]/95 border-b border-slate-800 px-4 py-3 sticky top-0 z-40 backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-800/90 text-cyan-400 border border-slate-700 active:scale-95 shadow-md cursor-pointer"
            title="Open Navigation Menu"
          >
            <Menu size={18} />
          </button>
          <div>
            <h2 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>IEEE SREC</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 uppercase">
                {tabs.find(t => t.id === activeTab)?.label || "Dashboard"}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshAll}
            disabled={isRefreshing}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-slate-800/80 text-cyan-400 border border-slate-700 active:scale-95 cursor-pointer"
            title="Refresh Database"
          >
            <RefreshCw size={14} className={isRefreshing ? "animate-spin text-cyan-300" : ""} />
          </button>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-xs shadow-md border border-cyan-400/30">
            A
          </div>
        </div>
      </div>

      {/* MOBILE QUICK SCROLL PILLS STRIP */}
      <div className="lg:hidden bg-[#070e17]/95 border-b border-slate-800/80 px-2 py-2 sticky top-[57px] z-35 backdrop-blur-lg">
        <nav className="flex overflow-x-auto gap-2 py-1 px-1 no-scrollbar select-none scroll-smooth">
          {tabs.map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${isCurrent
                  ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-slate-950 shadow-md font-extrabold scale-102"
                  : "bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08]"
                  }`}
              >
                <span className={isCurrent ? "text-slate-950" : "text-cyan-400"}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* MAIN PANEL */}
      <div className="flex-1 w-full min-w-0 flex flex-col relative">
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-[1600px] w-full mx-auto pb-20">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {/* Card 1: Activities */}
                <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#111f35] to-[#0c1728] p-5 shadow-xl hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between h-36 group">
                  <div className="flex items-center justify-between">
                    <div className="rounded-xl bg-blue-500/15 border border-blue-500/30 p-2.5 text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.2)] group-hover:scale-110 transition-transform"><Activity size={20} /></div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <TrendingUp size={10} /> {activitiesGrowthPercent}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{activities.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Activities</p>
                  </div>
                </div>

                {/* Card 2: Office Bearers */}
                <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#111f35] to-[#0c1728] p-5 shadow-xl hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between h-36 group">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-indigo-500/15 border border-indigo-500/30 p-2.5 text-indigo-400 shadow-[0_0_12px_rgba(129,140,248,0.2)] group-hover:scale-110 transition-transform"><Briefcase size={20} /></div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <TrendingUp size={10} /> +8%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{officeRows.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Bearers</p>
                  </div>
                </div>

                {/* Card 3: Technical Societies */}
                <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#111f35] to-[#0c1728] p-5 shadow-xl hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col justify-between h-36 group">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-cyan-500/15 border border-cyan-500/30 p-2.5 text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.2)] group-hover:scale-110 transition-transform"><Layers size={20} /></div>
                    <span className="text-xs font-extrabold text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                      Active
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{societies.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">IEEE Societies</p>
                  </div>
                </div>

                {/* Card 4: Student Join Submissions */}
                <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#111f35] to-[#0c1728] p-5 shadow-xl hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between h-36 group">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-purple-500/15 border border-purple-500/30 p-2.5 text-purple-400 shadow-[0_0_12px_rgba(192,132,252,0.2)] group-hover:scale-110 transition-transform"><Users size={20} /></div>
                    <span className="text-xs font-extrabold text-purple-400 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                      New
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{applications.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Join Requests</p>
                  </div>
                </div>

                {/* Card 5: Awards */}
                <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#111f35] to-[#0c1728] p-5 shadow-xl hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between h-36 group">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-amber-500/15 border border-amber-500/30 p-2.5 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)] group-hover:scale-110 transition-transform"><Award size={20} /></div>
                    <span className="text-xs font-extrabold text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                      Honors
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{awards.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Awards</p>
                  </div>
                </div>

                {/* Card 6: Senior Members */}
                <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#111f35] to-[#0c1728] p-5 shadow-xl hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300 flex flex-col justify-between h-36 group">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-sky-500/15 border border-sky-500/30 p-2.5 text-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.2)] group-hover:scale-110 transition-transform"><ShieldCheck size={20} /></div>
                    <span className="text-xs font-extrabold text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-0.5 rounded-full">
                      Stable
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{seniorMembers.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Seniors</p>
                  </div>
                </div>

                {/* Card 7: Member Track Records */}
                <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#111f35] to-[#0c1728] p-5 shadow-xl hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between h-36 group">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-emerald-500/15 border border-emerald-500/30 p-2.5 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.2)] group-hover:scale-110 transition-transform"><Users size={20} /></div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-0.5">
                      <TrendingUp size={10} /> {memberGrowthPercent}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{memberRows.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Years Tracked</p>
                  </div>
                </div>

                {/* Card 8: Funding Requests */}
                <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#111f35] to-[#0c1728] p-5 shadow-xl hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300 flex flex-col justify-between h-36 group">
                  <div className="flex items-center justify-between">
                    <div className="rounded-full bg-rose-500/15 border border-rose-500/30 p-2.5 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)] group-hover:scale-110 transition-transform"><Banknote size={20} /></div>
                    <span className="text-xs font-extrabold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                      Pending
                    </span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight">{fundingRequests.length}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">Funding Req</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-cyan-500/40 p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-2 flex items-center gap-2"><TrendingUp size={24} className="text-cyan-400" /> Welcome to IEEE SREC Command Center</h2>
                  <p className="text-slate-300 max-w-2xl text-sm leading-relaxed">Use the navigation menu on the left to manage student branch activities, office bearer records, annual plans, and website CMS updates in real-time.</p>
                  <div className="mt-8 flex gap-4">
                    <button onClick={() => setActiveTab("activities")} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-cyan-500/25 hover:brightness-110 transition flex items-center gap-2">
                      <Activity size={18} /> Post New Activity
                    </button>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4 text-cyan-400">
                  <ShieldCheck size={250} />
                </div>
              </div>

              {/* Visual Analytics Graphs Grid */}
              <div className="grid gap-6 md:grid-cols-3 mt-8">
                {/* Monthly Event Engagement Bar Chart */}
                <div className="md:col-span-2 rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#111f35] to-[#0c1728] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-black text-white uppercase tracking-wider">Event Engagement</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">Real monthly event count from database</p>
                      </div>
                      <span className="text-xs font-bold text-cyan-400 bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 rounded-full">
                        Total Events: {activities.length}
                      </span>
                    </div>

                    {/* Bar Bars */}
                    <div className="h-64 flex items-end justify-between gap-2 pt-6">
                      {(() => {
                        const maxEventsVal = Math.max(...monthlyEventData.map(d => d.val), 1);
                        return monthlyEventData.map((item, idx) => (<div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                          <div className="w-full bg-slate-900/80 rounded-t-lg relative h-48 flex items-end overflow-hidden border-t border-slate-800">
                            <div style={{ height: `${(item.val / maxEventsVal) * 100}%` }} className="w-full bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-400 rounded-t-lg group-hover:brightness-125 transition-all duration-300 relative shadow-[0_0_12px_rgba(56,189,248,0.3)]">
                              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-cyan-300 border border-slate-700 text-[10px] font-bold rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-lg">
                                {item.val} Events
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{item.month}</span>
                        </div>));
                      })()}
                    </div>
                  </div>
                </div>

                {/* Member Distribution Donut/Radial Mockup */}
                <div className="rounded-2xl border border-slate-700/70 bg-gradient-to-br from-[#111f35] to-[#0c1728] p-6 shadow-xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-wider mb-1">Members Distribution</h4>
                    <p className="text-xs text-slate-400 font-semibold mb-6">Real breakdown (latest tracked year)</p>

                    <div className="flex justify-center items-center py-6 relative">
                      {/* Circular progress SVG */}
                      <svg className="w-40 h-40 transform -rotate-90">
                        <circle cx="80" cy="80" r="65" stroke="#1e293b" strokeWidth="14" fill="transparent" />
                        <circle cx="80" cy="80" r="65" stroke="#00f2fe" strokeWidth="14" fill="transparent" strokeDasharray="408" strokeDashoffset={Math.round(408 - (408 * memberDistribution.studentPercent) / 100)} strokeLinecap="round" className="transition-all duration-500 shadow-[0_0_15px_#00f2fe]" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-3xl font-black text-white">{memberDistribution.studentPercent}%</span>
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mt-0.5">Students</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-6 border-t border-slate-800">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-2 text-slate-300">
                          <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]"></span> Student Members ({memberDistribution.studentCount})
                        </span>
                        <span className="text-white font-bold">{memberDistribution.studentPercent}%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="flex items-center gap-2 text-slate-300">
                          <span className="w-3 h-3 rounded-full bg-slate-700"></span> Professional ({memberDistribution.profCount})
                        </span>
                        <span className="text-white font-bold">{memberDistribution.profPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {activeTab === "activities" && (<div className="space-y-8">
                <form onSubmit={submitActivity} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingActivityId ? "Edit Activity" : "Add New Activity"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <input type="number" placeholder="S.No" value={activityForm.s_no} onChange={(e) => setActivityForm({ ...activityForm, s_no: e.target.value })} className="rounded-lg border px-4 py-3" required />

                    <input type="text" placeholder="Event" value={activityForm.event} onChange={(e) => setActivityForm({ ...activityForm, event: e.target.value })} className="rounded-lg border px-4 py-3" required />

                    <input type="text" placeholder="Date" value={activityForm.date} onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })} className="rounded-lg border px-4 py-3" />

                    <input type="text" placeholder="Chief Guest / Organizer" value={activityForm.chief_guest} onChange={(e) => setActivityForm({ ...activityForm, chief_guest: e.target.value })} className="rounded-lg border px-4 py-3" />

                    <input type="text" placeholder="Participants" value={activityForm.participants} onChange={(e) => setActivityForm({ ...activityForm, participants: e.target.value })} className="rounded-lg border px-4 py-3" />

                    <input type="text" placeholder="Image URL" value={activityForm.image_url} onChange={(e) => setActivityForm({ ...activityForm, image_url: e.target.value })} className="rounded-lg border px-4 py-3" />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingActivityId ? "Update Activity" : "Add Activity"}
                    </button>

                    {editingActivityId && (<button type="button" onClick={resetActivityForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">
                      Cancel
                    </button>)}
                  </div>
                </form>

                <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-2xl font-bold text-[#0b3b8f]">Activity Records</h3>

                    <input type="text" placeholder="Search activities..." value={activitySearch} onChange={(e) => setActivitySearch(e.target.value)} className="w-full rounded-lg border px-4 py-3 md:w-80" />
                  </div>

                  {activitiesLoading && <p className="text-slate-500">Loading activities...</p>}
                  {!activitiesLoading && activitiesError && (<p className="text-red-600">Error: {activitiesError}</p>)}
                  {!activitiesLoading && !activitiesError && filteredActivities.length === 0 && (<p className="text-slate-500">No activities found.</p>)}

                  {!activitiesLoading && !activitiesError && filteredActivities.length > 0 && (<div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                    <table className="w-full border-collapse">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left">S.No</th>
                          <th className="px-4 py-3 text-left">Event</th>
                          <th className="px-4 py-3 text-left">Date</th>
                          <th className="px-4 py-3 text-left">Chief Guest</th>
                          <th className="px-4 py-3 text-left">Participants</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredActivities.map((row) => (<tr key={row.id} className="border-b hover:bg-slate-50">
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.s_no}</td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{row.event}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.date || "-"}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.chief_guest || "-"}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.participants || "-"}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">
                            <div className="flex gap-2">
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
                              }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
                                Edit
                              </button>
                              <button onClick={() => deleteActivity(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>))}
                      </tbody>
                    </table>
                  </div>)}
                </div>
              </div>)}

              {activeTab === "event_reports" && (<EventReportsAdmin />)}

              {activeTab === "office" && (<OfficeBearers />)}

              {activeTab === "society_leaders" && (<SocietyLeadershipAdmin />)}

              {activeTab === "office_cards" && (<OfficeBearerCardsAdmin />)}

              {activeTab === "members" && (<div className="space-y-8">
                <form onSubmit={submitMember} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingMemberId ? "Edit Member Count" : "Add Member Count"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <input type="number" placeholder="Year" value={memberForm.year} onChange={(e) => setMemberForm({ ...memberForm, year: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="number" placeholder="Professional Members" value={memberForm.professional_members} onChange={(e) => setMemberForm({ ...memberForm, professional_members: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="number" placeholder="Student Members" value={memberForm.student_members} onChange={(e) => setMemberForm({ ...memberForm, student_members: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="number" placeholder="Total Members" value={memberForm.total_members} onChange={(e) => setMemberForm({ ...memberForm, total_members: e.target.value })} className="rounded-lg border px-4 py-3" required />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingMemberId ? "Update" : "Add"}
                    </button>
                    {editingMemberId && (<button type="button" onClick={resetMemberForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">
                      Cancel
                    </button>)}
                  </div>
                </form>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">Year</th>
                        <th className="px-4 py-3 text-left">Professional</th>
                        <th className="px-4 py-3 text-left">Student</th>
                        <th className="px-4 py-3 text-left">Total</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memberRows.map((row) => (<tr key={row.id} className="border-b">
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.year}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.professional_members}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.student_members}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.total_members}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">
                          <div className="flex gap-2">
                            <button onClick={() => {
                              setEditingMemberId(row.id);
                              setMemberForm({
                                year: String(row.year),
                                professional_members: String(row.professional_members),
                                student_members: String(row.student_members),
                                total_members: String(row.total_members),
                              });
                            }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white">
                              Edit
                            </button>
                            <button onClick={() => deleteMember(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>))}
                    </tbody>
                  </table>
                </div>
              </div>)}
              {activeTab === "plans" && (<div className="space-y-8">
                <form onSubmit={submitPlan} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingPlanId ? "Edit Annual Plan" : "Add Annual Plan"}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input type="number" placeholder="S.No" value={planForm.s_no} onChange={(e) => setPlanForm({ ...planForm, s_no: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="text" placeholder="Event" value={planForm.event} onChange={(e) => setPlanForm({ ...planForm, event: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="text" placeholder="Sub Event (Optional)" value={planForm.sub_event} onChange={(e) => setPlanForm({ ...planForm, sub_event: e.target.value })} className="rounded-lg border px-4 py-3" />
                    <input type="text" placeholder="Schedule" value={planForm.schedule} onChange={(e) => setPlanForm({ ...planForm, schedule: e.target.value })} className="rounded-lg border px-4 py-3" required />
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingPlanId ? "Update" : "Add"}
                    </button>
                    {editingPlanId && (<button type="button" onClick={resetPlanForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">
                      Cancel
                    </button>)}
                  </div>
                </form>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">S.No</th>
                        <th className="px-4 py-3 text-left">Event</th>
                        <th className="px-4 py-3 text-left">Sub Event</th>
                        <th className="px-4 py-3 text-left">Schedule</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {annualPlans.map((row) => (<tr key={row.id} className="border-b">
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.s_no}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.event}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.sub_event || "-"}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.schedule}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">
                          <div className="flex gap-2">
                            <button onClick={() => {
                              setEditingPlanId(row.id);
                              setPlanForm({ s_no: String(row.s_no), event: row.event, sub_event: row.sub_event || "", schedule: row.schedule });
                            }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                            <button onClick={() => deletePlan(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                          </div>
                        </td>
                      </tr>))}
                    </tbody>
                  </table>
                </div>
              </div>)}

              {activeTab === "funding" && (<div className="space-y-8">
                <form onSubmit={submitFunding} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingFundingId ? "Edit Funding Request" : "Add Funding Request"}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input type="text" placeholder="Title" value={fundingForm.title} onChange={(e) => setFundingForm({ ...fundingForm, title: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <select aria-label="Submission Type" value={fundingForm.submission_type} onChange={(e) => setFundingForm({ ...fundingForm, submission_type: e.target.value })} className="rounded-lg border px-4 py-3">
                      <option value="Annual Plan">Annual Plan</option>
                      <option value="Event Funding">Event Funding</option>
                      <option value="Special Project">Special Project</option>
                    </select>
                    <input type="number" placeholder="Budget Amount (Rs)" value={fundingForm.budget_amount} onChange={(e) => setFundingForm({ ...fundingForm, budget_amount: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="email" placeholder="Contact Email" value={fundingForm.contact_email} onChange={(e) => setFundingForm({ ...fundingForm, contact_email: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <textarea placeholder="Description" value={fundingForm.description} onChange={(e) => setFundingForm({ ...fundingForm, description: e.target.value })} className="rounded-lg border px-4 py-3 md:col-span-2" rows={3} required />
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingFundingId ? "Update" : "Add"}
                    </button>
                    {editingFundingId && (<button type="button" onClick={resetFundingForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">
                      Cancel
                    </button>)}
                  </div>
                </form>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">Title</th>
                        <th className="px-4 py-3 text-left">Type</th>
                        <th className="px-4 py-3 text-left">Budget</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fundingRequests.map((row) => (<tr key={row.id} className="border-b">
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.title}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.submission_type}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">Rs. {row.budget_amount}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.contact_email}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">
                          <div className="flex gap-2">
                            <button onClick={() => {
                              setEditingFundingId(row.id);
                              setFundingForm({
                                title: row.title,
                                submission_type: row.submission_type,
                                description: row.description || "",
                                budget_amount: String(row.budget_amount || ""),
                                contact_email: row.contact_email || ""
                              });
                            }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white">Edit</button>
                            <button onClick={() => deleteFunding(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
                          </div>
                        </td>
                      </tr>))}
                    </tbody>
                  </table>
                </div>
              </div>)}

              {activeTab === "senior" && (<div className="space-y-8">
                <form onSubmit={submitSenior} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingSeniorId ? "Edit Senior Member" : "Add Senior Member"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input type="text" placeholder="Name" value={seniorForm.name} onChange={(e) => setSeniorForm({ ...seniorForm, name: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="number" placeholder="S.No" value={seniorForm.s_no} onChange={(e) => setSeniorForm({ ...seniorForm, s_no: e.target.value })} className="rounded-lg border px-4 py-3" required />
                    <input type="text" placeholder="Current Role (e.g. Software Engineer)" value={seniorForm.current_role} onChange={(e) => setSeniorForm({ ...seniorForm, current_role: e.target.value })} className="rounded-lg border px-4 py-3" />
                    <input type="text" placeholder="College" value={seniorForm.college} onChange={(e) => setSeniorForm({ ...seniorForm, college: e.target.value })} className="rounded-lg border px-4 py-3" />
                    <input type="url" placeholder="LinkedIn URL" value={seniorForm.linkedin_url} onChange={(e) => setSeniorForm({ ...seniorForm, linkedin_url: e.target.value })} className="rounded-lg border px-4 py-3 md:col-span-2" />
                    <input type="url" placeholder="Image URL" value={seniorForm.image_url} onChange={(e) => setSeniorForm({ ...seniorForm, image_url: e.target.value })} className="rounded-lg border px-4 py-3 md:col-span-2" />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingSeniorId ? "Update Member" : "Add Member"}
                    </button>
                    {editingSeniorId && (<button type="button" onClick={resetSeniorForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">
                      Cancel
                    </button>)}
                  </div>
                </form>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">S.No</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">College</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seniorMembers.map((row) => (<tr key={row.id} className="border-b hover:bg-slate-50">
                        <td className="px-5 py-3.5 text-sm font-bold text-[#0b3b8f]">{row.s_no}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{row.name}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.current_role || "-"}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">{row.college || "-"}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">
                          <div className="flex gap-2">
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
                            }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition">
                              Edit
                            </button>
                            <button onClick={() => {
                              if (window.confirm("Delete this senior member?"))
                                deleteSenior(row.id);
                            }} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>))}
                    </tbody>
                  </table>
                </div>
              </div>)}


              {activeTab === "cms_landing" && (<div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Landing Page CMS</h2>
                  <p className="text-sm text-slate-500 mt-1">Edit the main hero header and subdescription on the homepage.</p>
                </div>
                <LandingCMSForm pageContents={pageContents} onSave={upsertContent} />
              </div>)}

              {activeTab === "cms_about" && (<div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">About Page CMS</h2>
                  <p className="text-sm text-slate-500 mt-1">Edit the SREC intro description, Principal message and Counselor message quotes.</p>
                </div>
                <AboutCMSForm pageContents={pageContents} onSave={upsertContent} />
              </div>)}

              {activeTab === "cms_contact" && (<div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Contact Page CMS</h2>
                  <p className="text-sm text-slate-500 mt-1">Edit the contact page address, email, phone and subtitle info.</p>
                </div>
                <ContactCMSForm pageContents={pageContents} onSave={upsertContent} />
              </div>)}

              {activeTab === "cms_advanced" && (<div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Advanced CMS (Raw Keys)</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage and edit raw page keys and content keys in the database.</p>
                </div>

                <form onSubmit={submitContent} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{editingContentId ? "Edit Content Key" : "Add New Content Key"}</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Page Key (e.g. "about")</label>
                      <input type="text" placeholder="e.g. about" value={contentForm.page_key} onChange={(e) => setContentForm({ ...contentForm, page_key: e.target.value })} className="rounded-lg border px-4 py-3 text-sm" required />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Content Key (e.g. "intro_text")</label>
                      <input type="text" placeholder="e.g. intro_text" value={contentForm.content_key} onChange={(e) => setContentForm({ ...contentForm, content_key: e.target.value })} className="rounded-lg border px-4 py-3 text-sm" required />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Content Text (HTML / Plain Text Supported)</label>
                      <textarea rows={4} placeholder="Type the page content here..." value={contentForm.content_text} onChange={(e) => setContentForm({ ...contentForm, content_text: e.target.value })} className="rounded-lg border px-4 py-3 text-sm" required />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white text-sm">
                      {editingContentId ? "Update Content" : "Add Content"}
                    </button>
                    {editingContentId && (<button type="button" onClick={resetContentForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold text-sm">
                      Cancel
                    </button>)}
                  </div>
                </form>

                <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
                  <table className="w-full border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left">Page</th>
                        <th className="px-4 py-3 text-left">Content Key</th>
                        <th className="px-4 py-3 text-left">Text Sneak Peek</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageContents.map((row) => (<tr key={row.id} className="border-b hover:bg-slate-50">
                        <td className="px-5 py-3.5 text-sm font-bold text-[#0b3b8f]">{row.page_key}</td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{row.content_key}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-500 truncate max-w-[200px]">{row.content_text}</td>
                        <td className="px-5 py-3.5 text-sm text-slate-700">
                          <div className="flex gap-2">
                            <button onClick={() => {
                              setEditingContentId(row.id);
                              setContentForm({
                                page_key: row.page_key,
                                content_key: row.content_key,
                                content_text: row.content_text,
                              });
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }} className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition">
                              Edit
                            </button>
                            <button onClick={() => deleteContent(row.id)} className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>))}
                      {pageContents.length === 0 && (<tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500 font-medium bg-slate-50/50">
                          No page content keys added yet. Use the form above to add your first dynamic content string!
                        </td>
                      </tr>)}
                    </tbody>
                  </table>
                </div>
              </div>)}


              {activeTab === "societies" && (<div className="space-y-12">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Societies Management</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage IEEE Technical Societies, edit chapter descriptions, and update Office Bearers & Executive Members.</p>
                </div>

                {/* Section 1: Society Info Editor */}
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Form */}
                  <form onSubmit={submitSociety} className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4 self-start">
                    <h3 className="text-lg font-bold text-slate-800">{editingSocietyId ? "Edit Society Info" : "Add New Society"}</h3>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Society Name</label>
                      <input type="text" placeholder="e.g. IEEE Computer Society" value={societyForm.name} onChange={(e) => setSocietyForm({ ...societyForm, name: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" required />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Short Code</label>
                      <input type="text" placeholder="e.g. CS" value={societyForm.short_code} onChange={(e) => setSocietyForm({ ...societyForm, short_code: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                      <textarea rows={3} placeholder="Brief overview of the society's mission..." value={societyForm.description} onChange={(e) => setSocietyForm({ ...societyForm, description: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Est. Year</label>
                        <input type="number" value={societyForm.established_year} onChange={(e) => setSocietyForm({ ...societyForm, established_year: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Member Count</label>
                        <input type="number" value={societyForm.member_count} onChange={(e) => setSocietyForm({ ...societyForm, member_count: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 rounded-lg bg-[#0b3b8f] py-2.5 font-semibold text-white text-sm hover:bg-[#002a52] transition">
                        {editingSocietyId ? "Update Society" : "Add Society"}
                      </button>
                      {editingSocietyId && (<button type="button" onClick={resetSocietyForm} className="rounded-lg bg-slate-200 px-4 py-2.5 font-semibold text-slate-700 text-sm hover:bg-slate-300 transition">
                        Cancel
                      </button>)}
                    </div>
                  </form>

                  {/* List Table */}
                  <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                      <h3 className="text-lg font-bold text-slate-800">IEEE Technical Chapters ({societies.length})</h3>
                    </div>
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3 text-left">Code</th>
                            <th className="px-6 py-3 text-left">Society Name</th>
                            <th className="px-6 py-3 text-left">Members</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {societies.map((soc) => (<tr key={soc.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 text-xs font-bold text-blue-600 uppercase">
                              <span className="px-2 py-1 rounded bg-blue-50 border border-blue-100">{soc.short_code || "GEN"}</span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-slate-800">{soc.name}</p>
                              {soc.description && <p className="text-xs text-slate-400 truncate max-w-xs">{soc.description}</p>}
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                              {soc.member_count || 0} Members
                            </td>
                            <td className="px-6 py-4 text-sm text-right space-x-2">
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
                              }} className="text-amber-600 hover:text-amber-800 font-semibold transition">
                                Edit
                              </button>
                              <button type="button" onClick={() => deleteSociety(soc.id)} className="text-red-600 hover:text-red-800 font-semibold transition">
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
                <div className="pt-8 border-t border-slate-200">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Manage Society Office Bearers & Executive Team</h3>
                    <p className="text-xs text-slate-500 mt-1">Select any chapter (CS, CIS, ComSoc, EMBS, IMS, PELS, WIE) to add, edit, or delete Office Bearers and Executive Members with photo uploads.</p>
                  </div>
                  <OfficeBearers />
                </div>
              </div>)}

              {activeTab === "applications" && (<div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Student Join Submissions</h2>
                    <p className="text-sm text-slate-500 mt-1">Review student applications submitted from the /join portal.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                    <input type="text" placeholder="Filter by name, email, society..." value={appSearch} onChange={(e) => setAppSearch(e.target.value)} className="w-full sm:w-72 rounded-xl border border-slate-300 px-4 py-2.5 text-xs bg-white text-slate-900 font-bold focus:outline-none focus:border-blue-600 shadow-sm" />

                    <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-slate-300 shadow-sm">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">Registration Status</span>
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
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-4">
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
                    }} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-2">
                      <input type="checkbox" checked={applications.length > 0 && selectedAppIds.length === applications.length} readOnly className="rounded accent-blue-600 cursor-pointer" />
                      <span>Select All ({selectedAppIds.length}/{applications.length})</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button type="button" onClick={exportApplicationsToExcel} className="px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95" title="Download all applications or selected applications as Excel CSV">
                      <FileSpreadsheet size={15} />
                      <span>Export Submissions to Excel ({selectedAppIds.length > 0 ? selectedAppIds.length : applications.length})</span>
                    </button>

                    <button type="button" onClick={downloadSelectedReceipts} disabled={selectedAppIds.length === 0} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm flex items-center gap-2 ${selectedAppIds.length > 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
                      <Download size={14} />
                      <span>Download Receipts ({selectedAppIds.length})</span>
                    </button>

                    <button type="button" onClick={deleteSelectedApplications} disabled={selectedAppIds.length === 0} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition shadow-sm flex items-center gap-2 ${selectedAppIds.length > 0
                      ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>
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
                      return (<div key={app.id} className={`rounded-2xl border ${isSelected ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20" : "border-slate-200 bg-white"} p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition relative group`}>
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

                            <span className="text-[10px] font-bold text-slate-500">
                              {app.created_at ? new Date(app.created_at).toLocaleDateString() : "Recent"}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-slate-900">{app.first_name} {app.last_name}</h3>
                            <p className="text-xs text-slate-700 font-bold mt-0.5">{app.email}</p>
                            <p className="text-xs text-slate-600 font-semibold mt-1">Dept: <strong className="text-slate-900">{app.department}</strong> • Year: <strong className="text-slate-900">{app.year_of_study}</strong></p>
                          </div>

                          {app.skills && app.skills.length > 0 && (<div className="flex flex-wrap gap-1 pt-1">
                            {app.skills.map((skill, idx) => (<span key={idx} className="text-[9px] font-bold text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
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
                            return (<div className="p-3.5 bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200 rounded-xl space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[10px] font-black text-[#003366] uppercase tracking-wider flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#00629b]" />
                                  Statement of Purpose
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                  Verified
                                </span>
                              </div>

                              {tags.length > 0 && (<div className="flex flex-wrap gap-1">
                                {tags.map((tag, idx) => (<span key={idx} className="text-[9.5px] font-mono font-bold text-slate-700 bg-white border border-slate-200/90 px-2 py-0.5 rounded-md shadow-2xs">
                                  {tag}
                                </span>))}
                              </div>)}

                              <p className="text-xs text-slate-800 font-medium leading-relaxed italic bg-white/90 p-2.5 rounded-lg border border-slate-200/70 shadow-2xs">
                                &ldquo;{cleanText}&rdquo;
                              </p>
                            </div>);
                          })()}
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400">ID: {app.id.slice(0, 8)}...</span>
                          <button type="button" onClick={() => deleteApplication(app.id)} className="text-xs text-red-600 hover:text-red-800 font-bold uppercase tracking-wider transition">
                            Delete Application
                          </button>
                        </div>
                      </div>);
                    })}

                  {applications.length === 0 && (<div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-2xl">
                    <p className="text-slate-500 font-bold text-sm">No student applications received yet.</p>
                  </div>)}
                </div>
              </div>)}

              {/* TAB: STUDENT ROSTER (DATABASE TABLE `public.student_members`) */}
              {activeTab === "student_roster" && (<div className="space-y-8 animate-fadeIn font-sans">
                {/* ─── 1. EXECUTIVE KPI SUMMARY RIBBON ─── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#002855] text-white p-5 rounded-2xl border border-slate-700 shadow-md flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Registered</p>
                      <p className="text-2xl font-black text-white mt-1">{studentMembers.length} Students</p>
                      <p className="text-[11px] text-sky-300 font-semibold mt-0.5">Database Active</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Users size={22} />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-amber-700">Pending IEEE IDs</p>
                      <p className="text-2xl font-black text-amber-900 mt-1">
                        {studentMembers.filter(m => m.ieee_id === "PENDING" || !m.ieee_id).length} Students
                      </p>
                      <button type="button" onClick={() => setIeeeStatusFilter("PENDING")} className="text-[11px] text-amber-700 hover:underline font-bold mt-0.5 inline-flex items-center gap-1">
                        <span>Filter pending</span>
                        <ArrowRight size={11} />
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                      <span className="text-xl">⏳</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-emerald-700">Assigned IEEE IDs</p>
                      <p className="text-2xl font-black text-emerald-900 mt-1">
                        {studentMembers.filter(m => m.ieee_id !== "PENDING" && Boolean(m.ieee_id)).length} Verified
                      </p>
                      <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Official Members</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-purple-200/80 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-purple-700">Diversity (Female)</p>
                      <p className="text-2xl font-black text-purple-900 mt-1">
                        {studentMembers.filter(m => m.gender?.toLowerCase() === "female").length} Students
                      </p>
                      <p className="text-[11px] text-purple-600 font-semibold mt-0.5">
                        {studentMembers.length > 0
                          ? Math.round((studentMembers.filter(m => m.gender?.toLowerCase() === "female").length / studentMembers.length) * 100)
                          : 0}% Representation
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
                      <Crown size={20} />
                    </div>
                  </div>
                </div>

                {/* ─── 2. HEADER & ACTION TOOLBAR ─── */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-black uppercase tracking-wider mb-2">
                      <Users size={14} className="text-blue-600" />
                      <span>Executive Student Directory (`public.student_members`)</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Student Members Master Directory</h2>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Live database of verified student registrations, assigned IEEE IDs, chapter affiliations &amp; credentials.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button type="button" onClick={exportStudentMembersToExcel} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95" title="Download filtered student members database directory as Excel CSV">
                      <FileSpreadsheet size={16} />
                      <span>Export Excel ({studentMembers.length})</span>
                    </button>
                    <button type="button" onClick={() => setIsAddMemberOpen(true)} className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-sm transition flex items-center gap-2 cursor-pointer active:scale-95">
                      <Plus size={16} />
                      <span>Add Student</span>
                    </button>
                    <button type="button" onClick={fetchStudentMembers} className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 border border-slate-200 cursor-pointer" title="Refresh from Supabase">
                      <RefreshCw size={14} className={studentMembersLoading ? "animate-spin text-blue-600" : ""} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {/* ─── 3. COMMAND SEARCH & FILTER BAR ─── */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input type="text" placeholder="Search by Name, Roll Number, IEEE ID, Email, Dept..." value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 shadow-xs" />
                      {memberSearch && (<button type="button" onClick={() => setMemberSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <X size={14} />
                      </button>)}
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Department Filter */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Dept:</span>
                        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white">
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
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">IEEE ID:</span>
                        <select value={ieeeStatusFilter} onChange={(e) => setIeeeStatusFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white">
                          <option value="ALL">All Status</option>
                          <option value="PENDING">Pending Only</option>
                          <option value="ASSIGNED">Assigned Only</option>
                        </select>
                      </div>

                      {/* Society Filter */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Society:</span>
                        <select value={societyFilter} onChange={(e) => setSocietyFilter(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white">
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
                      }} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition">
                        Reset Filters
                      </button>)}
                    </div>
                  </div>
                </div>

                {/* ─── 4. ULTRA-MODERN STUDENT ROSTER TABLE ─── */}
                <div className="rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900 text-white font-black uppercase text-[11px] tracking-wider border-b border-slate-800">
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
                        {studentMembers
                          .filter((m) => {
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
                          })
                          .map((m, idx) => {
                            const isPending = m.ieee_id === "PENDING" || !m.ieee_id;
                            return (<tr key={m.id || idx} onClick={() => setInspectingStudentMember(m)} className="hover:bg-blue-50/60 transition-colors cursor-pointer group">
                              {/* Member Portrait & Contact (Enlarged Photo) */}
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-3.5">
                                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-[#002855] text-white border-2 border-slate-200 shadow-sm overflow-hidden shrink-0 flex items-center justify-center font-black text-base group-hover:scale-105 transition-transform bg-slate-900">
                                    {m.avatar_url ? (<img src={m.avatar_url} alt={m.first_name} className="w-full h-full object-cover object-top" />) : (`${m.first_name?.[0] || ''}${m.last_name?.[0] || ''}`)}
                                  </div>
                                  <div className="min-w-0">
                                    <span className="font-black text-slate-900 block text-xs sm:text-sm group-hover:text-blue-700 transition-colors truncate">
                                      {m.first_name} {m.last_name}
                                    </span>
                                    <span className="font-mono text-[11px] text-slate-500 block truncate max-w-[200px] mt-0.5">
                                      {m.email}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Roll Number */}
                              <td className="py-4 px-4 font-mono font-black text-slate-900 text-xs">
                                <span className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800">
                                  {m.roll_number}
                                </span>
                              </td>

                              {/* IEEE ID with glowing status */}
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center gap-1.5 font-mono text-xs font-black px-3 py-1 rounded-xl border shadow-xs ${isPending
                                  ? "bg-amber-50 text-amber-900 border-amber-300"
                                  : "bg-blue-50 text-blue-900 border-blue-300"}`}>
                                  {isPending ? (<>
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    <span>PENDING</span>
                                  </>) : (<>
                                    <ShieldCheck size={13} className="text-blue-700" />
                                    <span>{m.ieee_id}</span>
                                  </>)}
                                </span>
                              </td>

                              {/* Department */}
                              <td className="py-4 px-4">
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
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
                                      let badgeColor = "bg-blue-50 text-blue-900 border-blue-200";
                                      if (tag.includes("WIE"))
                                        badgeColor = "bg-purple-50 text-purple-900 border-purple-200";
                                      if (tag.includes("PELS"))
                                        badgeColor = "bg-emerald-50 text-emerald-900 border-emerald-200";
                                      if (tag.includes("CS"))
                                        badgeColor = "bg-orange-50 text-orange-900 border-orange-200";
                                      if (tag.includes("CAS"))
                                        badgeColor = "bg-indigo-50 text-indigo-900 border-indigo-200";
                                      return (<span key={sIdx} className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md border shrink-0 whitespace-nowrap shadow-2xs ${badgeColor}`} title={soc}>
                                        {tag}
                                      </span>);
                                    })}
                                </div>
                              </td>

                              {/* Year of Study */}
                              <td className="py-4 px-3 font-semibold text-slate-700 whitespace-nowrap">
                                {m.year_of_study}
                              </td>

                              {/* Gender */}
                              <td className="py-4 px-3 font-semibold text-slate-700">
                                {m.gender || "—"}
                              </td>

                              {/* T-Shirt Size */}
                              <td className="py-4 px-3">
                                <span className="font-mono font-black text-slate-800 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md text-[11px]">
                                  {m.tshirt_size || "L"}
                                </span>
                              </td>

                              {/* Action Buttons */}
                              <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1.5">
                                  <button type="button" onClick={() => window.open(getPrimaryMemberCardPdfUrl(m), "_blank")} className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#002855] font-bold text-[11px] uppercase transition border border-blue-200 shadow-2xs cursor-pointer flex items-center gap-1" title="Open Official IEEE Card PDF in new tab">
                                    <FileText size={12} className="text-blue-600" />
                                    <span>PDF</span>
                                  </button>
                                  <button type="button" onClick={() => setInspectingStudentMember(m)} className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] uppercase transition shadow-2xs cursor-pointer" title="Inspect Profile Details">
                                    View
                                  </button>
                                  <button type="button" onClick={() => setEditingStudentMember(m)} className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] uppercase tracking-wider transition shadow-2xs cursor-pointer">
                                    Edit
                                  </button>
                                  <button type="button" onClick={() => handleDeleteStudentMember(m.id, m.roll_number)} className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[11px] uppercase tracking-wider transition border border-red-200 cursor-pointer">
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>);
                          })}

                        {studentMembers.length === 0 && (<tr>
                          <td colSpan={9} className="py-16 text-center text-slate-500 font-bold">
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

                {/* ─── 5. FULL STUDENT PROFILE INSPECTION MODAL ─── */}
                {inspectingStudentMember && (<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
                  <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn text-slate-900">
                    {/* Modal Hero Header */}
                    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#002855] text-white p-6 flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/10 border-2 border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-xl overflow-hidden shrink-0 bg-slate-900">
                          {inspectingStudentMember.avatar_url ? (<img src={inspectingStudentMember.avatar_url} alt={inspectingStudentMember.first_name} className="w-full h-full object-cover object-top" />) : (`${inspectingStudentMember.first_name?.[0] || ''}${inspectingStudentMember.last_name?.[0] || ''}`)}
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Verified Student Profile</span>
                          <h3 className="text-2xl sm:text-3xl font-black text-white">{inspectingStudentMember.first_name} {inspectingStudentMember.last_name}</h3>
                          <p className="text-xs text-slate-300 font-mono mt-0.5">{inspectingStudentMember.email}</p>
                        </div>
                      </div>
                      <button type="button" onClick={() => setInspectingStudentMember(null)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
                        <X size={18} />
                      </button>
                    </div>

                    {/* Modal Profile Details Matrix */}
                    <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Roll Number</p>
                          <p className="text-sm font-mono font-black text-slate-900 mt-0.5">{inspectingStudentMember.roll_number}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400">IEEE Member ID</p>
                          <p className="text-sm font-mono font-black text-blue-700 mt-0.5">{inspectingStudentMember.ieee_id || "PENDING"}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Security PIN</p>
                          <p className="text-sm font-mono font-black text-emerald-700 mt-0.5">{inspectingStudentMember.security_pin || "••••"}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Department</p>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">{inspectingStudentMember.department}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Year of Study</p>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">{inspectingStudentMember.year_of_study}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                          <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                          <p className="text-xs font-bold text-slate-900 mt-0.5">{inspectingStudentMember.phone || "Not Provided"}</p>
                        </div>
                      </div>

                      {/* Official IEEE PDF Card Block */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-black uppercase text-blue-900 tracking-wider flex items-center gap-1.5">
                            <FileText size={14} className="text-blue-600" />
                            <span>Official IEEE Card (PDF)</span>
                          </p>
                          <p className="text-xs font-mono text-slate-600 mt-0.5 truncate max-w-[280px]">
                            {inspectingStudentMember.card_pdf_url || `/cards/${inspectingStudentMember.ieee_id && inspectingStudentMember.ieee_id !== 'PENDING' ? inspectingStudentMember.ieee_id : inspectingStudentMember.roll_number}.pdf`}
                          </p>
                        </div>
                        <button type="button" onClick={() => window.open(getPrimaryMemberCardPdfUrl(inspectingStudentMember), "_blank")} className="px-3.5 py-2 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer">
                          <ExternalLink size={13} />
                          <span>Open PDF</span>
                        </button>
                      </div>

                      {/* Selected Societies */}
                      <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                        <p className="text-[11px] font-black uppercase text-blue-900 tracking-wider mb-2">Registered Society Chapters</p>
                        <div className="flex flex-wrap gap-2">
                          {(inspectingStudentMember.target_societies || ["IEEE Student Branch SREC"]).map((soc, idx) => (<span key={idx} className="px-3 py-1 rounded-xl bg-white border border-blue-200 text-blue-900 text-xs font-bold shadow-2xs">
                            {soc}
                          </span>))}
                        </div>
                      </div>

                      {/* Bio & SOP */}
                      {inspectingStudentMember.bio_sop && (<div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                        <p className="text-[11px] font-black uppercase text-slate-500 tracking-wider mb-1.5">Statement of Purpose / Bio</p>
                        <p className="text-xs text-slate-700 leading-relaxed">{inspectingStudentMember.bio_sop}</p>
                      </div>)}

                      {/* Action footer */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <button type="button" onClick={() => {
                          const m = inspectingStudentMember;
                          setInspectingStudentMember(null);
                          setEditingStudentMember(m);
                        }} className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm text-center cursor-pointer">
                          Edit Student Record
                        </button>
                        <button type="button" onClick={() => setInspectingStudentMember(null)} className="py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition">
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>)}
              </div>)}

              {/* ADD NEW STUDENT MEMBER MODAL OVERLAY */}
              {isAddMemberOpen && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn">
                  <div className="bg-[#003366] text-white p-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Database Entry Creation</span>
                      <h3 className="text-xl font-black text-white">Add New Student Member Record</h3>
                      <p className="text-xs text-sky-200">Creates a new member profile in `public.student_members` table</p>
                    </div>
                    <button type="button" onClick={() => setIsAddMemberOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleAddStudentMember} className="p-6 space-y-4 text-slate-900">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Roll Number */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Roll / Register Number <span className="text-red-500">*</span></label>
                        <input type="text" value={newMemberForm.roll_number} onChange={(e) => setNewMemberForm({ ...newMemberForm, roll_number: e.target.value })} placeholder="e.g. 21CS045" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600" required />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Official Email <span className="text-red-500">*</span></label>
                        <input type="email" value={newMemberForm.email} onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })} placeholder="student@srec.ac.in" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs bg-slate-50 focus:bg-white focus:border-blue-600" required />
                      </div>

                      {/* First Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">First Name <span className="text-red-500">*</span></label>
                        <input type="text" value={newMemberForm.first_name} onChange={(e) => setNewMemberForm({ ...newMemberForm, first_name: e.target.value })} placeholder="e.g. Surya" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600" required />
                      </div>

                      {/* Last Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Last Name <span className="text-red-500">*</span></label>
                        <input type="text" value={newMemberForm.last_name} onChange={(e) => setNewMemberForm({ ...newMemberForm, last_name: e.target.value })} placeholder="e.g. Narayanan" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600" required />
                      </div>

                      {/* IEEE Member ID */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">IEEE Member ID</label>
                        <input type="text" value={newMemberForm.ieee_id} onChange={(e) => setNewMemberForm({ ...newMemberForm, ieee_id: e.target.value })} placeholder="e.g. 102075943 or PENDING" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600" />
                      </div>

                      {/* Department */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Department</label>
                        <select value={newMemberForm.department} onChange={(e) => setNewMemberForm({ ...newMemberForm, department: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600">
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
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Year of Study</label>
                        <select value={newMemberForm.year_of_study} onChange={(e) => setNewMemberForm({ ...newMemberForm, year_of_study: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600">
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
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Gender</label>
                        <select value={newMemberForm.gender} onChange={(e) => setNewMemberForm({ ...newMemberForm, gender: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* T-Shirt Size */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">T-Shirt Size</label>
                        <select value={newMemberForm.tshirt_size} onChange={(e) => setNewMemberForm({ ...newMemberForm, tshirt_size: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600">
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
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Applicant Category</label>
                        <select value={newMemberForm.applicant_type} onChange={(e) => setNewMemberForm({ ...newMemberForm, applicant_type: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600">
                          <option value="undergraduate">Undergraduate (BE/B.Tech)</option>
                          <option value="postgraduate">Postgraduate (ME/M.Tech/MBA)</option>
                          <option value="professional">Professional / Faculty</option>
                        </select>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number</label>
                        <input type="text" value={newMemberForm.phone} onChange={(e) => setNewMemberForm({ ...newMemberForm, phone: e.target.value })} placeholder="+91 9876543210" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs bg-slate-50 focus:bg-white focus:border-blue-600" />
                      </div>

                      {/* Membership Status */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Status</label>
                        <select value={newMemberForm.membership_status} onChange={(e) => setNewMemberForm({ ...newMemberForm, membership_status: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600">
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                          <option value="EXPIRED">EXPIRED</option>
                        </select>
                      </div>

                      {/* Selected Societies Checklist */}
                      <div className="space-y-2 col-span-full pt-2 border-t border-slate-200">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
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
                              ? "bg-blue-50 border-[#003366] text-[#003366]"
                              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-white"}`}>
                              <span className="truncate">{socName.replace("IEEE ", "")}</span>
                              <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${isSelected ? "bg-[#003366] border-[#003366] text-white" : "border-slate-300 bg-white"}`}>
                                {isSelected && <Check size={10} className="stroke-[3]" />}
                              </div>
                            </button>);
                          })}
                        </div>
                      </div>

                      {/* Original IEEE PDF Card Upload */}
                      <div className="col-span-full space-y-1.5 p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                        <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center justify-between">
                          <span>Original IEEE Membership Card (PDF)</span>
                          <span className="text-[10px] text-slate-500 font-normal">Drop file or enter direct URL</span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-2.5">
                          <input type="text" value={newMemberForm.card_pdf_url} onChange={(e) => setNewMemberForm({ ...newMemberForm, card_pdf_url: e.target.value })} placeholder="e.g. /cards/102298938.pdf or Supabase URL" className="flex-1 w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs bg-white focus:border-blue-600" />
                          <label className={`px-4 py-2 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs ${isUploadingAdminPdf ? 'opacity-50 pointer-events-none' : ''}`}>
                            {isUploadingAdminPdf ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
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
                      <button type="button" onClick={() => setIsAddMemberOpen(false)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition">
                        Cancel
                      </button>
                      <button type="submit" disabled={isAddingMember} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50">
                        {isAddingMember ? "Creating Member..." : "Create Student Member Record"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>)}

              {/* EDIT STUDENT MEMBER MODAL OVERLAY */}
              {editingStudentMember && (<div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn">
                  <div className="bg-[#003366] text-white p-6 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300">Edit Member Record</span>
                      <h3 className="text-xl font-black text-white">{editingStudentMember.first_name} {editingStudentMember.last_name}</h3>
                      <p className="text-xs text-sky-200 font-mono">Roll: {editingStudentMember.roll_number} · Email: {editingStudentMember.email}</p>
                    </div>
                    <button type="button" onClick={() => setEditingStudentMember(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={updateStudentMember} className="p-6 space-y-4 text-slate-900">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* IEEE Member ID */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">IEEE Member ID</label>
                        <input type="text" value={editingStudentMember.ieee_id || ""} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, ieee_id: e.target.value })} placeholder="e.g. 102075943 or PENDING" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600" required />
                      </div>

                      {/* Department */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Department</label>
                        <select value={editingStudentMember.department || ""} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, department: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600" required>
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
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Year of Study</label>
                        <select value={editingStudentMember.year_of_study || ""} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, year_of_study: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600" required>
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
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Gender</label>
                        <select value={editingStudentMember.gender || ""} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, gender: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* T-Shirt Size */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">T-Shirt Size</label>
                        <select value={editingStudentMember.tshirt_size || "L"} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, tshirt_size: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600">
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
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Applicant Category</label>
                        <select value={editingStudentMember.applicant_type || "undergraduate"} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, applicant_type: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600">
                          <option value="undergraduate">Undergraduate (BE/B.Tech)</option>
                          <option value="postgraduate">Postgraduate (ME/M.Tech/MBA)</option>
                          <option value="professional">Professional / Faculty</option>
                        </select>
                      </div>

                      {/* First Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">First Name</label>
                        <input type="text" value={editingStudentMember.first_name || ""} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, first_name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600" required />
                      </div>

                      {/* Last Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Last Name</label>
                        <input type="text" value={editingStudentMember.last_name || ""} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, last_name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600" required />
                      </div>

                      {/* Mobile Phone */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Phone Number</label>
                        <input type="text" value={editingStudentMember.phone || ""} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, phone: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs bg-slate-50 focus:bg-white focus:border-blue-600" />
                      </div>

                      {/* Membership Status */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Membership Status</label>
                        <select value={editingStudentMember.membership_status || "ACTIVE"} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, membership_status: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs bg-slate-50 focus:bg-white focus:border-blue-600">
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                          <option value="EXPIRED">EXPIRED</option>
                        </select>
                      </div>

                      {/* Original IEEE PDF Card Upload */}
                      <div className="col-span-full space-y-1.5 p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                        <label className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center justify-between">
                          <span>Original IEEE Membership Card (PDF)</span>
                          <span className="text-[10px] text-slate-500 font-normal">Drop file or enter direct URL</span>
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-2.5">
                          <input type="text" value={editingStudentMember.card_pdf_url || ""} onChange={(e) => setEditingStudentMember({ ...editingStudentMember, card_pdf_url: e.target.value })} placeholder="e.g. /cards/102298938.pdf or Supabase URL" className="flex-1 w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs bg-white focus:border-blue-600" />
                          <label className={`px-4 py-2 rounded-xl bg-[#002855] hover:bg-[#001c3d] text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs ${isUploadingAdminPdf ? 'opacity-50 pointer-events-none' : ''}`}>
                            {isUploadingAdminPdf ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                            <span>{isUploadingAdminPdf ? "Uploading..." : "Upload PDF"}</span>
                            <input type="file" accept="application/pdf" onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f)
                                handleAdminUploadPdf(f, true);
                            }} disabled={isUploadingAdminPdf} className="hidden" />
                          </label>
                          {(editingStudentMember.card_pdf_url || (editingStudentMember.ieee_id && editingStudentMember.ieee_id !== "PENDING")) && (<button type="button" onClick={() => window.open(getPrimaryMemberCardPdfUrl(editingStudentMember), "_blank")} className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1 shrink-0 cursor-pointer" title="Preview current PDF in new tab">
                            <Eye size={13} />
                            <span>Preview</span>
                          </button>)}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                      <button type="button" onClick={() => setEditingStudentMember(null)} className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition">
                        Cancel
                      </button>
                      <button type="submit" disabled={isSavingStudentMember} className="px-6 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition disabled:opacity-50">
                        {isSavingStudentMember ? "Saving Changes..." : "Save Member Record"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>)}

              {activeTab === "awards" && (<div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Awards & Recognitions</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage accolades, grants, and honors received by SREC Student Branch.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Form */}
                  <form onSubmit={submitAward} className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4 self-start">
                    <h3 className="text-lg font-bold text-slate-800">{editingAwardId ? "Edit Award" : "Add New Award"}</h3>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Award Title</label>
                      <input type="text" placeholder="e.g. IEEE Appreciation Award" value={awardForm.title} onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Year</label>
                        <input type="number" value={awardForm.year} onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" required />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Grant / Amount</label>
                        <input type="text" placeholder="e.g. Rs.4000 / USD 1000" value={awardForm.amount} onChange={(e) => setAwardForm({ ...awardForm, amount: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category / Awarder</label>
                      <input type="text" placeholder="e.g. IEEE Madras Section / IEEE HQ" value={awardForm.category} onChange={(e) => setAwardForm({ ...awardForm, category: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                      <textarea rows={3} placeholder="Award citation or description..." value={awardForm.description} onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Image URL</label>
                      <input type="text" placeholder="Optional image filename or public link..." value={awardForm.image_url} onChange={(e) => setAwardForm({ ...awardForm, image_url: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 rounded-lg bg-[#0b3b8f] py-2.5 font-semibold text-white text-sm hover:bg-[#002a52] transition">
                        {editingAwardId ? "Update Award" : "Add Award"}
                      </button>
                      {editingAwardId && (<button type="button" onClick={resetAwardForm} className="rounded-lg bg-slate-200 px-4 py-2.5 font-semibold text-slate-700 text-sm hover:bg-slate-300 transition">
                        Cancel
                      </button>)}
                    </div>
                  </form>

                  {/* List Table */}
                  <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-200">
                      <h3 className="text-lg font-bold text-slate-800">Award Records ({awards.length})</h3>
                    </div>
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3 text-left">Year</th>
                            <th className="px-6 py-3 text-left">Award Title</th>
                            <th className="px-6 py-3 text-left">Category & Amount</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {awards.map((award) => (<tr key={award.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 text-xs font-bold text-[#0b3b8f]">{award.year}</td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-slate-800">{award.title}</p>
                              {award.description && <p className="text-xs text-slate-400 truncate max-w-xs">{award.description}</p>}
                            </td>
                            <td className="px-6 py-4 text-xs">
                              <p className="font-semibold text-slate-700">{award.category || "General"}</p>
                              {award.amount && <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] inline-block mt-0.5">{award.amount}</span>}
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
                              }} className="text-amber-600 hover:text-amber-800 font-semibold transition">
                                Edit
                              </button>
                              <button type="button" onClick={() => deleteAward(award.id)} className="text-red-600 hover:text-red-800 font-semibold transition">
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

              {activeTab === "admin_users" && (<div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Admin Accounts</h2>
                  <p className="text-sm text-slate-500 mt-1">Add, review, or revoke login credentials for the admin portal.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* Form Card */}
                  <form onSubmit={addAdminUser} className="lg:col-span-1 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col gap-4 self-start">
                    <h3 className="text-lg font-bold text-slate-800">Create Admin Account</h3>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Username</label>
                      <input type="text" placeholder="Enter username" value={adminForm.username} onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" required />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                      <input type="password" placeholder="Enter password" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} className="rounded-lg border px-4 py-2.5 text-sm bg-white" required />
                    </div>

                    <button className="mt-2 rounded-lg bg-[#0b3b8f] py-2.5 font-semibold text-white text-sm hover:bg-[#002a52] transition">
                      Create Account
                    </button>
                  </form>

                  {/* List Card */}
                  <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-200">
                      <h3 className="text-lg font-bold text-slate-800">Existing Admins</h3>
                    </div>
                    <div className="overflow-x-auto flex-1">
                      <table className="w-full border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-3 text-left">Username</th>
                            <th className="px-6 py-3 text-left">Created At</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {adminsList.map((admin) => (<tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 text-sm font-semibold text-slate-800">{admin.username}</td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                              {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "N/A"}
                            </td>
                            <td className="px-6 py-4 text-sm text-right">
                              <button type="button" onClick={() => deleteAdminUser(admin.id)} className="text-red-600 hover:text-red-800 font-semibold transition">
                                Delete
                              </button>
                            </td>
                          </tr>))}
                          {adminsList.length === 0 && (<tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-400 font-medium">
                              No admin accounts found in the database.
                            </td>
                          </tr>)}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>)}


            </main>
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
  const counselorMsgVal = pageContents.find(c => c.page_key === "about" && c.content_key === "counselor_message")?.content_text || "Empowering students to transcend boundaries...";
  const [introText, setIntroText] = useState(introTextVal);
  const [principalMsg, setPrincipalMsg] = useState(principalMsgVal);
  const [counselorMsg, setCounselorMsg] = useState(counselorMsgVal);
  useEffect(() => {
    setIntroText(introTextVal);
    setPrincipalMsg(principalMsgVal);
    setCounselorMsg(counselorMsgVal);
  }, [introTextVal, principalMsgVal, counselorMsgVal]);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave("about", "intro_text", introText);
    onSave("about", "principal_message", principalMsg);
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
