import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import OfficeBearers from "@/components/OfficeBearers";
import { Activity, Users, Settings, Briefcase, FileText, Banknote, ShieldCheck, Image as ImageIcon, LayoutDashboard, LogOut, TrendingUp, Search, Bell, Cpu, Globe, Award, Layers } from "lucide-react";

type ActivityRow = {
  id: number;
  s_no: number;
  event: string;
  date: string | null;
  chief_guest: string | null;
  participants: string | null;
  image_url: string | null;
};

type MemberRow = {
  id: number;
  year: number;
  professional_members: number;
  student_members: number;
  total_members: number;
};

type OfficeBearer = {
  id: number;
  name: string;
  role: string;
  department: string | null;
  academic_year: string | null;
  year: number;
  group_name: string | null;
  image_url: string | null;
};

type AnnualPlan = {
  id: number;
  s_no: number;
  event: string;
  sub_event: string | null;
  schedule: string;
};

type FundingSubmission = {
  id: number;
  title: string;
  submission_type: string;
  description: string | null;
  budget_amount: number | null;
  contact_email: string | null;
};

type SeniorMember = {
  id: number;
  name: string;
  s_no: number | null;
  current_role: string | null;
  college: string | null;
  linkedin_url: string | null;
  image_url: string | null;
};

type SocietyRow = {
  id: number;
  name: string;
  short_code: string | null;
  description: string | null;
  established_year: number | null;
  member_count: number | null;
};

type ApplicationRow = {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  department: string;
  year_of_study: string;
  target_society: string;
  skills: string[] | null;
  statement_of_purpose: string;
};

type AwardRow = {
  id: number;
  title: string;
  year: number;
  description: string | null;
  category: string | null;
  amount: string | null;
  image_url: string | null;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "activities" | "office" | "members" | "plans" | "funding" | "senior" | "societies" | "applications" | "awards" | "cms_landing" | "cms_about" | "cms_contact" | "cms_advanced" | "admin_users">("overview");

  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [officeRows, setOfficeRows] = useState<OfficeBearer[]>([]);
  const [memberRows, setMemberRows] = useState<MemberRow[]>([]);
  const [annualPlans, setAnnualPlans] = useState<AnnualPlan[]>([]);
  const [fundingRequests, setFundingRequests] = useState<FundingSubmission[]>([]);
  const [seniorMembers, setSeniorMembers] = useState<SeniorMember[]>([]);

  const [societies, setSocieties] = useState<SocietyRow[]>([]);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [awards, setAwards] = useState<AwardRow[]>([]);

  const [editingSocietyId, setEditingSocietyId] = useState<number | null>(null);
  const [editingAwardId, setEditingAwardId] = useState<number | null>(null);

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

  type PageContentRow = {
    id: number;
    page_key: string;
    content_key: string;
    content_text: string;
  };
  const [pageContents, setPageContents] = useState<PageContentRow[]>([]);
  const [contentLoading, setContentLoading] = useState(false);
  const [editingContentId, setEditingContentId] = useState<number | null>(null);
  const [contentForm, setContentForm] = useState({
    page_key: "",
    content_key: "",
    content_text: "",
  });

  type AdminUserRow = {
    id: number;
    username: string;
    created_at: string;
  };
  const [adminsList, setAdminsList] = useState<AdminUserRow[]>([]);
  const [adminForm, setAdminForm] = useState({
    username: "",
    password: "",
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Group real events by month dynamically
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

  const [editingActivityId, setEditingActivityId] = useState<number | null>(null);
  const [editingOfficeId, setEditingOfficeId] = useState<number | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
  const [editingPlanId, setEditingPlanId] = useState<number | null>(null);
  const [editingFundingId, setEditingFundingId] = useState<number | null>(null);
  const [editingSeniorId, setEditingSeniorId] = useState<number | null>(null);


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
    } else {
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
    fetchAwards();
    fetchPageContents();
    fetchAdmins();
  }, [navigate]);

  // Auto Logout due to inactivity (30 minutes)
  useEffect(() => {
    let timeoutId: any;
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    const logoutUser = async () => {
      sessionStorage.removeItem("admin_auth");
      await supabase.auth.signOut();
      alert("You have been automatically logged out due to inactivity.");
      navigate("/admin-login");
    };

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
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
      if (timeoutId) clearTimeout(timeoutId);
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



  const submitActivity = async (e: React.FormEvent) => {
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
    } else {
      const { error } = await supabase.from("activities").insert([payload]);

      if (error) {
        alert(error.message);
        return;
      }
    }

    resetActivityForm();
    fetchActivities();
  };

  const submitOffice = async (e: React.FormEvent) => {
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
      if (error) { alert("Error: " + error.message); return; }
      if (!data || data.length === 0) {
        alert("UPDATE BLOCKED: You haven't run the SQL code in alter_schema.sql! Your database's Row Level Security is still blocking changes.");
        return;
      }
    } else {
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

  const submitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      year: Number(memberForm.year),
      professional_members: Number(memberForm.professional_members),
      student_members: Number(memberForm.student_members),
      total_members: Number(memberForm.total_members),
    };
    if (editingMemberId) {
      const { error } = await supabase.from("member_counts").update(payload).eq("id", editingMemberId);
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("member_counts").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetMemberForm();
    fetchMembers();
  };

  const deleteActivity = async (id: number) => {
    const ok = window.confirm("Delete this activity?");
    if (!ok) return;
    const { error } = await supabase.from("activities").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchActivities();
  };

  const deleteOffice = async (id: number) => {
    const ok = window.confirm("Delete this office bearer?");
    if (!ok) return;
    const { data, error } = await supabase.from("office_bearers").delete().eq("id", id).select();
    if (error) { alert("Error: " + error.message); return; }
    if (!data || data.length === 0) {
      alert("DELETE BLOCKED: You haven't run the SQL code in alter_schema.sql! Your database's Row Level Security is still blocking changes.");
      return;
    }
    fetchOfficeBearers();
  };

  const deleteMember = async (id: number) => {
    const ok = window.confirm("Delete this member count?");
    if (!ok) return;
    const { error } = await supabase.from("member_counts").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchMembers();
  };

  const submitPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      s_no: Number(planForm.s_no),
      event: planForm.event,
      sub_event: planForm.sub_event || null,
      schedule: planForm.schedule,
    };
    if (editingPlanId) {
      const { error } = await supabase.from("annual_plan").update(payload).eq("id", editingPlanId);
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("annual_plan").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetPlanForm();
    fetchAnnualPlans();
  };

  const submitFunding = async (e: React.FormEvent) => {
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
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("funding_submissions").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetFundingForm();
    fetchFundingRequests();
  };

  const deletePlan = async (id: number) => {
    const ok = window.confirm("Delete this annual plan?");
    if (!ok) return;
    const { error } = await supabase.from("annual_plan").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchAnnualPlans();
  };

  const deleteFunding = async (id: number) => {
    const ok = window.confirm("Delete this funding request?");
    if (!ok) return;
    const { error } = await supabase.from("funding_submissions").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchFundingRequests();
  };

  const submitSenior = async (e: React.FormEvent) => {
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
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("senior_members").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetSeniorForm();
    fetchSeniorMembers();
  };

  const deleteSenior = async (id: number) => {
    const ok = window.confirm("Delete this senior member?");
    if (!ok) return;
    const { error } = await supabase.from("senior_members").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchSeniorMembers();
  };

  const resetSocietyForm = () => {
    setEditingSocietyId(null);
    setSocietyForm({ name: "", short_code: "", description: "", established_year: "2001", member_count: "50" });
  };

  const submitSociety = async (e: React.FormEvent) => {
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
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("societies").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetSocietyForm();
    fetchSocieties();
  };

  const deleteSociety = async (id: number) => {
    const ok = window.confirm("Delete this society?");
    if (!ok) return;
    const { error } = await supabase.from("societies").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchSocieties();
  };

  const deleteApplication = async (id: string) => {
    const ok = window.confirm("Delete this join application?");
    if (!ok) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchApplications();
  };

  const resetAwardForm = () => {
    setEditingAwardId(null);
    setAwardForm({ title: "", year: "2024", description: "", category: "IEEE Madras Section", amount: "", image_url: "" });
  };

  const submitAward = async (e: React.FormEvent) => {
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
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("awards").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetAwardForm();
    fetchAwards();
  };

  const deleteAward = async (id: number) => {
    const ok = window.confirm("Delete this award?");
    if (!ok) return;
    const { error } = await supabase.from("awards").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchAwards();
  };

  const resetContentForm = () => {
    setEditingContentId(null);
    setContentForm({
      page_key: "",
      content_key: "",
      content_text: "",
    });
  };

  const submitContent = async (e: React.FormEvent) => {
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
      if (error) { alert("Error: " + error.message); return; }
    } else {
      const { error } = await supabase.from("page_content").insert([payload]);
      if (error) { alert("Error: " + error.message); return; }
    }
    resetContentForm();
    fetchPageContents();
  };

  const deleteContent = async (id: number) => {
    const ok = window.confirm("Delete this content key?");
    if (!ok) return;
    const { error } = await supabase.from("page_content").delete().eq("id", id);
    if (error) { alert("Error: " + error.message); return; }
    fetchPageContents();
  };

  const upsertContent = async (page_key: string, content_key: string, content_text: string) => {
    const { error } = await supabase
      .from("page_content")
      .upsert({ page_key, content_key, content_text }, { onConflict: "page_key,content_key" });
    if (error) {
      alert("Error saving: " + error.message);
    } else {
      fetchPageContents();
    }
  };

  const addAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.username || !adminForm.password) {
      alert("Please fill in both fields.");
      return;
    }
    const { error } = await supabase.from("admins").insert([adminForm]);
    if (error) {
      alert("Error adding admin: " + error.message);
    } else {
      setAdminForm({ username: "", password: "" });
      fetchAdmins();
      alert("Admin user added successfully!");
    }
  };

  const deleteAdminUser = async (id: number) => {
    const ok = window.confirm("Are you sure you want to delete this admin account?");
    if (!ok) return;
    const { error } = await supabase.from("admins").delete().eq("id", id);
    if (error) {
      alert("Error deleting admin: " + error.message);
    } else {
      fetchAdmins();
    }
  };



  const filteredActivities = useMemo(() => {
    const q = activitySearch.trim().toLowerCase();
    if (!q) return activities;

    return activities.filter((item) =>
      [
        item.s_no?.toString(),
        item.event,
        item.date,
        item.chief_guest,
        item.participants,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [activities, activitySearch]);

  const tabs = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={18} /> },
    { id: "activities", label: "Activities", icon: <Activity size={18} /> },
    { id: "office", label: "Office Bearers", icon: <Briefcase size={18} /> },
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
  ] as const;

  return (
    <div className="flex min-h-screen bg-[#070e17] font-sans text-slate-100 selection:bg-cyan-500 selection:text-white">
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      {/* LEFT SIDEBAR (Executive Cyber Dark Style) */}
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
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-extrabold shadow-md shadow-cyan-500/20 border border-cyan-400/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                }`}
              >
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
                { id: "activities", label: "Activities", icon: <Activity size={18} /> },
                { id: "office", label: "Office Bearers", icon: <Briefcase size={18} /> },
                { id: "members", label: "Members Track", icon: <Users size={18} /> },
                { id: "plans", label: "Annual Plans", icon: <FileText size={18} /> },
                { id: "funding", label: "Funding Requests", icon: <Banknote size={18} /> },
                { id: "senior", label: "Senior Members", icon: <ShieldCheck size={18} /> },
                { id: "societies", label: "Societies", icon: <Layers size={18} /> },
                { id: "applications", label: "Join Submissions", icon: <FileText size={18} /> },
                { id: "awards", label: "Awards & Recognitions", icon: <Award size={18} /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-extrabold shadow-md shadow-cyan-500/20 border border-cyan-400/30"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
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
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-extrabold shadow-md shadow-cyan-500/20 border border-cyan-400/30"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Group 4: SYSTEM */}
          <div className="space-y-2">
            <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">SYSTEM</p>
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab("admin_users")}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === "admin_users"
                    ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 text-white font-extrabold shadow-md shadow-cyan-500/20 border border-cyan-400/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={18} />
                  <span>Admin Accounts</span>
                </div>
              </button>
            </div>
          </div>

          {/* Group 5: DEVELOPER */}
          <div className="space-y-2">
            <p className="px-3 text-[10px] font-black text-cyan-400/80 uppercase tracking-widest">DEVELOPER</p>
            <div className="space-y-1">
              <a
                href="https://surya-ruddy.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-slate-400 hover:bg-slate-800/60 hover:text-cyan-400"
              >
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
        {/* TOP BAR */}
        <header className="bg-[#0c1626]/90 border-b border-slate-800/80 h-16 flex items-center justify-between px-6 sticky top-0 z-35 backdrop-blur-xl">
          <div className="flex items-center gap-2.5 w-96 bg-[#070e17] border border-slate-700/80 rounded-xl px-3.5 py-1.5 focus-within:border-cyan-400 transition-colors">
            <Search size={16} className="text-cyan-400 shrink-0" />
            <input
              type="text"
              placeholder="Search database or type command..."
              className="w-full text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder-slate-400"
            />
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-300">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>

          <div className="flex items-center gap-6">
            {/* Live Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE DATABASE</span>
            </div>

            {/* Notification icon */}
            <button className="text-slate-300 hover:text-cyan-400 transition relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#38bdf8]"></span>
            </button>

            {/* Profile Dropdown */}
            <div className="flex items-center gap-3 border-l border-slate-800 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white">Admin Manager</p>
                <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">IEEE Admin</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md border border-cyan-400/30">
                A
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-400 hover:text-rose-300 font-extrabold uppercase tracking-wider flex items-center gap-1 pl-2 border-l border-slate-800 transition-colors"
              >
                <LogOut size={14} /> Exit
              </button>
            </div>
          </div>
        </header>

        {/* MOBILE NAVIGATION BAR */}
        <div className="lg:hidden bg-[#0c1626] border-b border-slate-800 px-4 py-2 sticky top-16 z-30">
          <nav className="flex overflow-x-auto gap-4 py-1 no-scrollbar snap-x">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); window.scrollTo({ top: 0, behavior: "smooth"}); }}
                className={`flex whitespace-nowrap items-center gap-1.5 py-2 text-xs font-bold transition snap-start border-b-2 ${
                  activeTab === tab.id
                    ? "text-cyan-400 border-cyan-400"
                    : "text-slate-400 border-transparent"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* MAIN PANEL */}
        <div className="flex-1 w-full min-w-0 flex flex-col relative">
          <main className="flex-1 p-6 lg:p-10 w-full mx-auto pb-20">
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
                          return monthlyEventData.map((item, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                              <div className="w-full bg-slate-900/80 rounded-t-lg relative h-48 flex items-end overflow-hidden border-t border-slate-800">
                                <div
                                  style={{ height: `${(item.val / maxEventsVal) * 100}%` }}
                                  className="w-full bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-400 rounded-t-lg group-hover:brightness-125 transition-all duration-300 relative shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                                >
                                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-cyan-300 border border-slate-700 text-[10px] font-bold rounded-md px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-lg">
                                    {item.val} Events
                                  </span>
                                </div>
                              </div>
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{item.month}</span>
                            </div>
                          ));
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
                          <circle cx="80" cy="80" r="65" stroke="#00f2fe" strokeWidth="14" fill="transparent"
                            strokeDasharray="408" strokeDashoffset={Math.round(408 - (408 * memberDistribution.studentPercent) / 100)} strokeLinecap="round" className="transition-all duration-500 shadow-[0_0_15px_#00f2fe]" />
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

            {activeTab === "activities" && (
              <div className="space-y-8">
                <form onSubmit={submitActivity} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingActivityId ? "Edit Activity" : "Add New Activity"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <input
                      type="number"
                      placeholder="S.No"
                      value={activityForm.s_no}
                      onChange={(e) => setActivityForm({ ...activityForm, s_no: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Event"
                      value={activityForm.event}
                      onChange={(e) => setActivityForm({ ...activityForm, event: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />

                    <input
                      type="text"
                      placeholder="Date"
                      value={activityForm.date}
                      onChange={(e) => setActivityForm({ ...activityForm, date: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />

                    <input
                      type="text"
                      placeholder="Chief Guest / Organizer"
                      value={activityForm.chief_guest}
                      onChange={(e) => setActivityForm({ ...activityForm, chief_guest: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />

                    <input
                      type="text"
                      placeholder="Participants"
                      value={activityForm.participants}
                      onChange={(e) => setActivityForm({ ...activityForm, participants: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />

                    <input
                      type="text"
                      placeholder="Image URL"
                      value={activityForm.image_url}
                      onChange={(e) => setActivityForm({ ...activityForm, image_url: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingActivityId ? "Update Activity" : "Add Activity"}
                    </button>

                    {editingActivityId && (
                      <button
                        type="button"
                        onClick={resetActivityForm}
                        className="rounded-lg bg-slate-200 px-6 py-3 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>

                <div className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-2xl font-bold text-[#0b3b8f]">Activity Records</h3>

                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={activitySearch}
                      onChange={(e) => setActivitySearch(e.target.value)}
                      className="w-full rounded-lg border px-4 py-3 md:w-80"
                    />
                  </div>

                  {activitiesLoading && <p className="text-slate-500">Loading activities...</p>}
                  {!activitiesLoading && activitiesError && (
                    <p className="text-red-600">Error: {activitiesError}</p>
                  )}
                  {!activitiesLoading && !activitiesError && filteredActivities.length === 0 && (
                    <p className="text-slate-500">No activities found.</p>
                  )}

                  {!activitiesLoading && !activitiesError && filteredActivities.length > 0 && (
                    <div className="overflow-x-auto rounded-xl bg-white border border-slate-200 shadow-sm p-0">
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
                          {filteredActivities.map((row) => (
                            <tr key={row.id} className="border-b hover:bg-slate-50">
                              <td className="px-5 py-3.5 text-sm text-slate-700">{row.s_no}</td>
                              <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{row.event}</td>
                              <td className="px-5 py-3.5 text-sm text-slate-700">{row.date || "-"}</td>
                              <td className="px-5 py-3.5 text-sm text-slate-700">{row.chief_guest || "-"}</td>
                              <td className="px-5 py-3.5 text-sm text-slate-700">{row.participants || "-"}</td>
                              <td className="px-5 py-3.5 text-sm text-slate-700">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
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
                                    }}
                                    className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteActivity(row.id)}
                                    className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "office" && (
              <OfficeBearers />
            )}

            {activeTab === "members" && (
              <div className="space-y-8">
                <form onSubmit={submitMember} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingMemberId ? "Edit Member Count" : "Add Member Count"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <input
                      type="number"
                      placeholder="Year"
                      value={memberForm.year}
                      onChange={(e) => setMemberForm({ ...memberForm, year: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Professional Members"
                      value={memberForm.professional_members}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, professional_members: e.target.value })
                      }
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Student Members"
                      value={memberForm.student_members}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, student_members: e.target.value })
                      }
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Total Members"
                      value={memberForm.total_members}
                      onChange={(e) =>
                        setMemberForm({ ...memberForm, total_members: e.target.value })
                      }
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingMemberId ? "Update" : "Add"}
                    </button>
                    {editingMemberId && (
                      <button
                        type="button"
                        onClick={resetMemberForm}
                        className="rounded-lg bg-slate-200 px-6 py-3 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
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
                      {memberRows.map((row) => (
                        <tr key={row.id} className="border-b">
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.year}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.professional_members}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.student_members}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.total_members}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingMemberId(row.id);
                                  setMemberForm({
                                    year: String(row.year),
                                    professional_members: String(row.professional_members),
                                    student_members: String(row.student_members),
                                    total_members: String(row.total_members),
                                  });
                                }}
                                className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteMember(row.id)}
                                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {activeTab === "plans" && (
              <div className="space-y-8">
                <form onSubmit={submitPlan} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingPlanId ? "Edit Annual Plan" : "Add Annual Plan"}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="number"
                      placeholder="S.No"
                      value={planForm.s_no}
                      onChange={(e) => setPlanForm({ ...planForm, s_no: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Event"
                      value={planForm.event}
                      onChange={(e) => setPlanForm({ ...planForm, event: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Sub Event (Optional)"
                      value={planForm.sub_event}
                      onChange={(e) => setPlanForm({ ...planForm, sub_event: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                    <input
                      type="text"
                      placeholder="Schedule"
                      value={planForm.schedule}
                      onChange={(e) => setPlanForm({ ...planForm, schedule: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingPlanId ? "Update" : "Add"}
                    </button>
                    {editingPlanId && (
                      <button type="button" onClick={resetPlanForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">
                        Cancel
                      </button>
                    )}
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
                      {annualPlans.map((row) => (
                        <tr key={row.id} className="border-b">
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "funding" && (
              <div className="space-y-8">
                <form onSubmit={submitFunding} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingFundingId ? "Edit Funding Request" : "Add Funding Request"}
                  </h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Title"
                      value={fundingForm.title}
                      onChange={(e) => setFundingForm({ ...fundingForm, title: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <select
                      aria-label="Submission Type"
                      value={fundingForm.submission_type}
                      onChange={(e) => setFundingForm({ ...fundingForm, submission_type: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    >
                      <option value="Annual Plan">Annual Plan</option>
                      <option value="Event Funding">Event Funding</option>
                      <option value="Special Project">Special Project</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Budget Amount (Rs)"
                      value={fundingForm.budget_amount}
                      onChange={(e) => setFundingForm({ ...fundingForm, budget_amount: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Contact Email"
                      value={fundingForm.contact_email}
                      onChange={(e) => setFundingForm({ ...fundingForm, contact_email: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={fundingForm.description}
                      onChange={(e) => setFundingForm({ ...fundingForm, description: e.target.value })}
                      className="rounded-lg border px-4 py-3 md:col-span-2"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingFundingId ? "Update" : "Add"}
                    </button>
                    {editingFundingId && (
                      <button type="button" onClick={resetFundingForm} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold">
                        Cancel
                      </button>
                    )}
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
                      {fundingRequests.map((row) => (
                        <tr key={row.id} className="border-b">
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "senior" && (
              <div className="space-y-8">
                <form onSubmit={submitSenior} className="rounded-xl bg-white p-6 md:p-8 shadow-sm border border-slate-200">
                  <h3 className="mb-6 text-2xl font-bold text-[#0b3b8f]">
                    {editingSeniorId ? "Edit Senior Member" : "Add Senior Member"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Name"
                      value={seniorForm.name}
                      onChange={(e) => setSeniorForm({ ...seniorForm, name: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="number"
                      placeholder="S.No"
                      value={seniorForm.s_no}
                      onChange={(e) => setSeniorForm({ ...seniorForm, s_no: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Current Role (e.g. Software Engineer)"
                      value={seniorForm.current_role}
                      onChange={(e) => setSeniorForm({ ...seniorForm, current_role: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                    <input
                      type="text"
                      placeholder="College"
                      value={seniorForm.college}
                      onChange={(e) => setSeniorForm({ ...seniorForm, college: e.target.value })}
                      className="rounded-lg border px-4 py-3"
                    />
                    <input
                      type="url"
                      placeholder="LinkedIn URL"
                      value={seniorForm.linkedin_url}
                      onChange={(e) => setSeniorForm({ ...seniorForm, linkedin_url: e.target.value })}
                      className="rounded-lg border px-4 py-3 md:col-span-2"
                    />
                    <input
                      type="url"
                      placeholder="Image URL"
                      value={seniorForm.image_url}
                      onChange={(e) => setSeniorForm({ ...seniorForm, image_url: e.target.value })}
                      className="rounded-lg border px-4 py-3 md:col-span-2"
                    />
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white">
                      {editingSeniorId ? "Update Member" : "Add Member"}
                    </button>
                    {editingSeniorId && (
                      <button
                        type="button"
                        onClick={resetSeniorForm}
                        className="rounded-lg bg-slate-200 px-6 py-3 font-semibold"
                      >
                        Cancel
                      </button>
                    )}
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
                      {seniorMembers.map((row) => (
                        <tr key={row.id} className="border-b hover:bg-slate-50">
                          <td className="px-5 py-3.5 text-sm font-bold text-[#0b3b8f]">{row.s_no}</td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{row.name}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.current_role || "-"}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">{row.college || "-"}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
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
                                }}
                                className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm("Delete this senior member?")) deleteSenior(row.id);
                                }}
                                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {activeTab === "cms_landing" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Landing Page CMS</h2>
                  <p className="text-sm text-slate-500 mt-1">Edit the main hero header and subdescription on the homepage.</p>
                </div>
                <LandingCMSForm 
                  pageContents={pageContents} 
                  onSave={upsertContent} 
                />
              </div>
            )}

            {activeTab === "cms_about" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">About Page CMS</h2>
                  <p className="text-sm text-slate-500 mt-1">Edit the SREC intro description, Principal message and Counselor message quotes.</p>
                </div>
                <AboutCMSForm 
                  pageContents={pageContents} 
                  onSave={upsertContent} 
                />
              </div>
            )}

            {activeTab === "cms_contact" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Contact Page CMS</h2>
                  <p className="text-sm text-slate-500 mt-1">Edit the contact page address, email, phone and subtitle info.</p>
                </div>
                <ContactCMSForm 
                  pageContents={pageContents} 
                  onSave={upsertContent} 
                />
              </div>
            )}

            {activeTab === "cms_advanced" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800">Advanced CMS (Raw Keys)</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage and edit raw page keys and content keys in the database.</p>
                </div>

                <form onSubmit={submitContent} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{editingContentId ? "Edit Content Key" : "Add New Content Key"}</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Page Key (e.g. "about")</label>
                      <input
                        type="text"
                        placeholder="e.g. about"
                        value={contentForm.page_key}
                        onChange={(e) => setContentForm({ ...contentForm, page_key: e.target.value })}
                        className="rounded-lg border px-4 py-3 text-sm"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Content Key (e.g. "intro_text")</label>
                      <input
                        type="text"
                        placeholder="e.g. intro_text"
                        value={contentForm.content_key}
                        onChange={(e) => setContentForm({ ...contentForm, content_key: e.target.value })}
                        className="rounded-lg border px-4 py-3 text-sm"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Content Text (HTML / Plain Text Supported)</label>
                      <textarea
                        rows={4}
                        placeholder="Type the page content here..."
                        value={contentForm.content_text}
                        onChange={(e) => setContentForm({ ...contentForm, content_text: e.target.value })}
                        className="rounded-lg border px-4 py-3 text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white text-sm">
                      {editingContentId ? "Update Content" : "Add Content"}
                    </button>
                    {editingContentId && (
                      <button
                        type="button"
                        onClick={resetContentForm}
                        className="rounded-lg bg-slate-200 px-6 py-3 font-semibold text-sm"
                      >
                        Cancel
                      </button>
                    )}
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
                      {pageContents.map((row) => (
                        <tr key={row.id} className="border-b hover:bg-slate-50">
                          <td className="px-5 py-3.5 text-sm font-bold text-[#0b3b8f]">{row.page_key}</td>
                          <td className="px-5 py-3.5 text-sm font-semibold text-slate-900">{row.content_key}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-500 truncate max-w-[200px]">{row.content_text}</td>
                          <td className="px-5 py-3.5 text-sm text-slate-700">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingContentId(row.id);
                                  setContentForm({
                                    page_key: row.page_key,
                                    content_key: row.content_key,
                                    content_text: row.content_text,
                                  });
                                  window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className="rounded bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteContent(row.id)}
                                className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {pageContents.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500 font-medium bg-slate-50/50">
                            No page content keys added yet. Use the form above to add your first dynamic content string!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {activeTab === "societies" && (
              <div className="space-y-12">
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
                      <input
                        type="text"
                        placeholder="e.g. IEEE Computer Society"
                        value={societyForm.name}
                        onChange={(e) => setSocietyForm({ ...societyForm, name: e.target.value })}
                        className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Short Code</label>
                      <input
                        type="text"
                        placeholder="e.g. CS"
                        value={societyForm.short_code}
                        onChange={(e) => setSocietyForm({ ...societyForm, short_code: e.target.value })}
                        className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                      <textarea
                        rows={3}
                        placeholder="Brief overview of the society's mission..."
                        value={societyForm.description}
                        onChange={(e) => setSocietyForm({ ...societyForm, description: e.target.value })}
                        className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Est. Year</label>
                        <input
                          type="number"
                          value={societyForm.established_year}
                          onChange={(e) => setSocietyForm({ ...societyForm, established_year: e.target.value })}
                          className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Member Count</label>
                        <input
                          type="number"
                          value={societyForm.member_count}
                          onChange={(e) => setSocietyForm({ ...societyForm, member_count: e.target.value })}
                          className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 rounded-lg bg-[#0b3b8f] py-2.5 font-semibold text-white text-sm hover:bg-[#002a52] transition">
                        {editingSocietyId ? "Update Society" : "Add Society"}
                      </button>
                      {editingSocietyId && (
                        <button type="button" onClick={resetSocietyForm} className="rounded-lg bg-slate-200 px-4 py-2.5 font-semibold text-slate-700 text-sm hover:bg-slate-300 transition">
                          Cancel
                        </button>
                      )}
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
                          {societies.map((soc) => (
                            <tr key={soc.id} className="hover:bg-slate-50/80 transition-colors">
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
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingSocietyId(soc.id);
                                    setSocietyForm({
                                      name: soc.name,
                                      short_code: soc.short_code || "",
                                      description: soc.description || "",
                                      established_year: soc.established_year?.toString() || "2001",
                                      member_count: soc.member_count?.toString() || "50",
                                    });
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className="text-amber-600 hover:text-amber-800 font-semibold transition"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteSociety(soc.id)}
                                  className="text-red-600 hover:text-red-800 font-semibold transition"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          {societies.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400 font-medium">
                                No technical societies found.
                              </td>
                            </tr>
                          )}
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
              </div>
            )}

            {activeTab === "applications" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800">Student Join Submissions</h2>
                    <p className="text-sm text-slate-500 mt-1">Review student applications submitted from the /join portal.</p>
                  </div>
                  <div className="w-full sm:w-72">
                    <input
                      type="text"
                      placeholder="Filter by name, email, society..."
                      value={appSearch}
                      onChange={(e) => setAppSearch(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2 text-xs bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {applications
                    .filter(app => {
                      const q = appSearch.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        app.first_name?.toLowerCase().includes(q) ||
                        app.last_name?.toLowerCase().includes(q) ||
                        app.email?.toLowerCase().includes(q) ||
                        app.target_society?.toLowerCase().includes(q) ||
                        app.department?.toLowerCase().includes(q)
                      );
                    })
                    .map((app) => (
                      <div key={app.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                              {app.target_society || "IEEE SB"}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400">
                              {app.created_at ? new Date(app.created_at).toLocaleDateString() : "Recent"}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-slate-900">{app.first_name} {app.last_name}</h3>
                            <p className="text-xs text-slate-500 font-medium">{app.email}</p>
                            <p className="text-xs text-slate-400 mt-1">Dept: <strong>{app.department}</strong> • Year: <strong>{app.year_of_study}</strong></p>
                          </div>

                          {app.skills && app.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {app.skills.map((skill, idx) => (
                                <span key={idx} className="text-[9px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}

                          {app.statement_of_purpose && (
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Statement of Purpose</p>
                              <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">"{app.statement_of_purpose}"</p>
                            </div>
                          )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                          <button
                            type="button"
                            onClick={() => deleteApplication(app.id)}
                            className="text-xs text-red-600 hover:text-red-800 font-bold uppercase tracking-wider transition"
                          >
                            Delete Application
                          </button>
                        </div>
                      </div>
                    ))}

                  {applications.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-2xl">
                      <p className="text-slate-400 font-medium text-sm">No student applications received yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "awards" && (
              <div className="space-y-6">
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
                      <input
                        type="text"
                        placeholder="e.g. IEEE Appreciation Award"
                        value={awardForm.title}
                        onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })}
                        className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Year</label>
                        <input
                          type="number"
                          value={awardForm.year}
                          onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
                          className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Grant / Amount</label>
                        <input
                          type="text"
                          placeholder="e.g. Rs.4000 / USD 1000"
                          value={awardForm.amount}
                          onChange={(e) => setAwardForm({ ...awardForm, amount: e.target.value })}
                          className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category / Awarder</label>
                      <input
                        type="text"
                        placeholder="e.g. IEEE Madras Section / IEEE HQ"
                        value={awardForm.category}
                        onChange={(e) => setAwardForm({ ...awardForm, category: e.target.value })}
                        className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                      <textarea
                        rows={3}
                        placeholder="Award citation or description..."
                        value={awardForm.description}
                        onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
                        className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Image URL</label>
                      <input
                        type="text"
                        placeholder="Optional image filename or public link..."
                        value={awardForm.image_url}
                        onChange={(e) => setAwardForm({ ...awardForm, image_url: e.target.value })}
                        className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button type="submit" className="flex-1 rounded-lg bg-[#0b3b8f] py-2.5 font-semibold text-white text-sm hover:bg-[#002a52] transition">
                        {editingAwardId ? "Update Award" : "Add Award"}
                      </button>
                      {editingAwardId && (
                        <button type="button" onClick={resetAwardForm} className="rounded-lg bg-slate-200 px-4 py-2.5 font-semibold text-slate-700 text-sm hover:bg-slate-300 transition">
                          Cancel
                        </button>
                      )}
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
                          {awards.map((award) => (
                            <tr key={award.id} className="hover:bg-slate-50/80 transition-colors">
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
                                <button
                                  type="button"
                                  onClick={() => {
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
                                  }}
                                  className="text-amber-600 hover:text-amber-800 font-semibold transition"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteAward(award.id)}
                                  className="text-red-600 hover:text-red-800 font-semibold transition"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          {awards.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-400 font-medium">
                                No awards found in the database.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "admin_users" && (
              <div className="space-y-6">
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
                      <input
                        type="text"
                        placeholder="Enter username"
                        value={adminForm.username}
                        onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                        className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</label>
                      <input
                        type="password"
                        placeholder="Enter password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        className="rounded-lg border px-4 py-2.5 text-sm bg-white"
                        required
                      />
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
                          {adminsList.map((admin) => (
                            <tr key={admin.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-6 py-4 text-sm font-semibold text-slate-800">{admin.username}</td>
                              <td className="px-6 py-4 text-sm text-slate-500">
                                {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "N/A"}
                              </td>
                              <td className="px-6 py-4 text-sm text-right">
                                <button
                                  type="button"
                                  onClick={() => deleteAdminUser(admin.id)}
                                  className="text-red-600 hover:text-red-800 font-semibold transition"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                          {adminsList.length === 0 && (
                            <tr>
                              <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-400 font-medium">
                                No admin accounts found in the database.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}


          </main>
        </div>
      </div>
    </div>
  );
};

// Sub-components for separated page editors
const LandingCMSForm = ({ pageContents, onSave }: { pageContents: any[], onSave: (pk: string, ck: string, txt: string) => void }) => {
  const heroTitle = pageContents.find(c => c.page_key === "landing" && c.content_key === "hero_title")?.content_text || "Global Excellence";
  const heroDesc = pageContents.find(c => c.page_key === "landing" && c.content_key === "hero_desc")?.content_text || "Empowering minds and shaping the future through uncompromising technology research.";

  const [title, setTitle] = useState(heroTitle);
  const [desc, setDesc] = useState(heroDesc);

  useEffect(() => {
    setTitle(heroTitle);
    setDesc(heroDesc);
  }, [heroTitle, heroDesc]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave("landing", "hero_title", title);
    onSave("landing", "hero_desc", desc);
    alert("Landing page content updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero Heading Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border px-4 py-3 text-sm"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Hero Subdescription</label>
        <textarea
          rows={3}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="rounded-lg border px-4 py-3 text-sm"
          required
        />
      </div>
      <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white text-sm">
        Save Landing Page Content
      </button>
    </form>
  );
};

const AboutCMSForm = ({ pageContents, onSave }: { pageContents: any[], onSave: (pk: string, ck: string, txt: string) => void }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
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
        <textarea
          rows={3}
          value={introText}
          onChange={(e) => setIntroText(e.target.value)}
          className="rounded-lg border px-4 py-3 text-sm"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Principal Message Quote</label>
        <textarea
          rows={3}
          value={principalMsg}
          onChange={(e) => setPrincipalMsg(e.target.value)}
          className="rounded-lg border px-4 py-3 text-sm"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Counselor Message Quote</label>
        <textarea
          rows={3}
          value={counselorMsg}
          onChange={(e) => setCounselorMsg(e.target.value)}
          className="rounded-lg border px-4 py-3 text-sm"
          required
        />
      </div>
      <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white text-sm">
        Save About Page Content
      </button>
    </form>
  );
};

const ContactCMSForm = ({ pageContents, onSave }: { pageContents: any[], onSave: (pk: string, ck: string, txt: string) => void }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
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
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="rounded-lg border px-4 py-3 text-sm"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Address Text</label>
        <textarea
          rows={2}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="rounded-lg border px-4 py-3 text-sm"
          required
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded-lg border px-4 py-3 text-sm"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border px-4 py-3 text-sm"
            required
          />
        </div>
      </div>
      <button className="rounded-lg bg-[#0b3b8f] px-6 py-3 font-semibold text-white text-sm">
        Save Contact Page Content
      </button>
    </form>
  );
};

export default AdminDashboard;


