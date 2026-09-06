import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import html2canvas from "html2canvas";
import { getPrimaryMemberCardPdfUrl } from "@/utils/cardPdfHelper";
import { ShieldCheck, Mail, Phone, Building2, Calendar, Sparkles, QrCode, Copy, Check, LogOut, RotateCw, Award, ExternalLink, ChevronRight, BookOpen, Cpu, CheckCircle2, Globe, KeyRound, Users, Camera, Loader2, Eye, ShieldAlert, GraduationCap, FileText, Download, X } from "lucide-react";
import ieeeCustomCardLogo from "@/assets/ieee-custom-card-logo.png";
import ieeeStamp from "@/assets/ieees.png";
import counselorSign from "@/assets/counselor-signature.png";
import srecCampus from "@/assets/srec-campus.png";
// Technical Society Logo imports
import csLogo from "@/assets/societies/CS.png";
import cisLogo from "@/assets/societies/CIS.webp";
import comsocLogo from "@/assets/societies/ComSoc.jpg";
import embsLogo from "@/assets/societies/EMBS.jpg";
import imLogo from "@/assets/societies/IM.jpg";
import wieLogo from "@/assets/societies/WIE.jpg";
import pelsLogo from "@/assets/societies/pels.png";
import casLogo from "@/assets/societies/css.svg";
// Pre-configured Verified Demo Member Profile
const DEFAULT_USER = {
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
  join_date: "16 Aug 2025",
  membership_status: "ACTIVE",
  target_societies: [
    "IEEE Student Branch SREC",
    "IEEE Power Electronics Society (PELS)",
    "IEEE Women in Engineering (WIE)"
  ],
  skills: ["Power Systems", "Embedded Systems", "Technical Leadership", "Project Management", "IoT Solutions", "MATLAB & Simulink"],
  bio_sop: "Active IEEE SB leader committed to advancing power technology and inspiring engineering students across Madras Section.",
  avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  events_attended: [
    { title: "VisionX 2025 – AI & Edge Computing Expo", date: "Aug 2025", category: "National Symposium" },
    { title: "IEEE Madras Section Leadership Conclave", date: "May 2025", category: "Leadership Summit" },
    { title: "IEEE International Renewable Energy Workshop", date: "Jan 2025", category: "Technical Workshop" },
    { title: "IEEE Student Branch Induction & Oath Ceremony", date: "Sep 2024", category: "Collegiate Event" }
  ],
  awards_count: 3
};
// Calculate Membership Validity strictly as Dec 31st of Next Year from Registration Date
export const getMembershipValidity = (joinDateStr) => {
  let startDate = new Date();
  if (joinDateStr && joinDateStr !== "PENDING") {
    const parsed = Date.parse(joinDateStr);
    if (!isNaN(parsed)) {
      startDate = new Date(parsed);
    }
    else {
      const match = joinDateStr.match(/\b(20\d{2})\b/);
      if (match) {
        startDate = new Date(`${match[1]}-01-01`);
      }
    }
  }
  // Expiry is strictly Dec 31st of next year from registration date
  const nextYear = startDate.getFullYear() + 1;
  const expiryDate = new Date(nextYear, 11, 31, 23, 59, 59);
  const now = new Date();
  const isExpired = now > expiryDate;
  const formattedExpiry = `DEC 31, ${nextYear}`;
  return {
    startDate,
    expiryDate,
    formattedExpiry,
    isExpired,
    status: isExpired ? "INACTIVE" : "ACTIVE"
  };
};
export const calculateOneYearValidity = (joinDateStr) => {
  return getMembershipValidity(joinDateStr).formattedExpiry;
};
const StudentDashboardPage = () => {
  const navigate = useNavigate();
  // Authentication & Member State
  const [currentUser, setCurrentUser] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const cardRef = useRef(null);
  // Load session from localStorage on mount, fetch latest database record, and listen to Realtime changes
  useEffect(() => {
    const fetchLatestData = async (userObj) => {
      try {
        const cleanEmail = (userObj.email || "").trim().toLowerCase();
        const cleanRoll = (userObj.roll_number || "").trim().toUpperCase();
        const cleanId = (userObj.id || "").trim();
        let memberData = null;
        // 1. Try finding in `student_members` table by Email
        if (cleanEmail) {
          const { data } = await supabase
            .from("student_members")
            .select("*")
            .ilike("email", cleanEmail)
            .maybeSingle();
          if (data)
            memberData = data;
        }
        // 2. Try finding in `student_members` table by Roll Number
        if (!memberData && cleanRoll) {
          const { data } = await supabase
            .from("student_members")
            .select("*")
            .ilike("roll_number", cleanRoll)
            .maybeSingle();
          if (data)
            memberData = data;
        }
        // 3. Try finding by ID
        if (!memberData && cleanId) {
          const { data } = await supabase
            .from("student_members")
            .select("*")
            .eq("id", cleanId)
            .maybeSingle();
          if (data)
            memberData = data;
        }
        // 4. Check `applications` table for assigned IEEE ID if still missing or pending
        let resolvedIeeeId = memberData?.ieee_id || memberData?.membership_id || memberData?.ieee_membership_id || userObj.ieee_id;
        if (!resolvedIeeeId || resolvedIeeeId === "PENDING") {
          if (cleanEmail) {
            const { data: appData } = await supabase
              .from("applications")
              .select("ieee_id, application_no, membership_id")
              .ilike("email", cleanEmail)
              .maybeSingle();
            if (appData?.ieee_id)
              resolvedIeeeId = appData.ieee_id;
            else if (appData?.membership_id)
              resolvedIeeeId = appData.membership_id;
          }
          if ((!resolvedIeeeId || resolvedIeeeId === "PENDING") && cleanRoll) {
            const { data: appData } = await supabase
              .from("applications")
              .select("ieee_id, application_no, membership_id")
              .ilike("roll_number", cleanRoll)
              .maybeSingle();
            if (appData?.ieee_id)
              resolvedIeeeId = appData.ieee_id;
            else if (appData?.membership_id)
              resolvedIeeeId = appData.membership_id;
          }
        }
        if (memberData || (resolvedIeeeId && resolvedIeeeId !== userObj.ieee_id)) {
          const freshUser = {
            ...userObj,
            id: memberData?.id || userObj.id,
            ieee_id: resolvedIeeeId || memberData?.ieee_id || userObj.ieee_id,
            roll_number: memberData?.roll_number || userObj.roll_number,
            first_name: memberData?.first_name || userObj.first_name,
            last_name: memberData?.last_name || userObj.last_name,
            email: memberData?.email || userObj.email,
            phone: memberData?.phone || userObj.phone,
            department: memberData?.department || userObj.department,
            year_of_study: memberData?.year_of_study || userObj.year_of_study,
            member_type: memberData?.member_type || userObj.member_type,
            join_date: memberData?.join_date || memberData?.created_at || userObj.join_date,
            valid_thru: memberData?.valid_thru || calculateOneYearValidity(memberData?.join_date || memberData?.created_at),
            membership_status: memberData?.membership_status || userObj.membership_status,
            target_societies: memberData?.target_societies || userObj.target_societies,
            skills: memberData?.skills || userObj.skills,
            bio_sop: memberData?.bio_sop || userObj.bio_sop,
            avatar_url: memberData?.avatar_url || userObj.avatar_url,
            card_pdf_url: memberData?.card_pdf_url || memberData?.ieee_card_pdf || userObj.card_pdf_url,
          };
          setCurrentUser(freshUser);
          localStorage.setItem("ieee_student_session", JSON.stringify(freshUser));
        }
      }
      catch (err) {
        console.warn("Could not refresh member from DB:", err);
      }
    };
    let activeUser = DEFAULT_USER;
    const saved = localStorage.getItem("ieee_student_session") || localStorage.getItem("srec_ieee_app_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.ieee_id || parsed.roll_number || parsed.email)) {
          activeUser = parsed;
          setCurrentUser(parsed);
          fetchLatestData(parsed);
        }
        else {
          setCurrentUser(DEFAULT_USER);
        }
      }
      catch (err) {
        localStorage.removeItem("ieee_student_session");
        setCurrentUser(DEFAULT_USER);
      }
    }
    else {
      setCurrentUser(DEFAULT_USER);
    }
    // 5. Supabase Realtime Subscription: Instant live update when database rows change
    const channel = supabase
      .channel("student-dashboard-live-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "student_members" }, () => {
        fetchLatestData(activeUser);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => {
        fetchLatestData(activeUser);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("ieee_student_session");
    localStorage.removeItem("srec_ieee_app_user");
    setCurrentUser(null);
    navigate("/student-login");
  };
  // Upload/Update Avatar photo directly to Supabase storage bucket `member-avatars`
  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser)
      return;
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
      if (error)
        throw error;
      const { data: urlData } = supabase.storage
        .from('member-avatars')
        .getPublicUrl(fileName);
      const newAvatarUrl = urlData.publicUrl;
      const updatedUser = { ...currentUser, avatar_url: newAvatarUrl };
      await supabase
        .from('student_members')
        .update({ avatar_url: newAvatarUrl })
        .eq('roll_number', currentUser.roll_number);
      setCurrentUser(updatedUser);
      localStorage.setItem("ieee_student_session", JSON.stringify(updatedUser));
      localStorage.setItem("srec_ieee_app_user", JSON.stringify(updatedUser));
      alert("Profile photo updated successfully!");
    }
    catch (err) {
      console.warn("Avatar upload error:", err);
      alert("Failed to upload image. " + (err.message || ""));
    }
    finally {
      setIsUploadingAvatar(false);
    }
  };
  // PDF Card View & Modal States
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [activePdfUrl, setActivePdfUrl] = useState("");
  const [isDownloadingCardImg, setIsDownloadingCardImg] = useState(false);
  const handleOpenPdfModal = () => {
    if (!currentUser)
      return;
    const primary = getPrimaryMemberCardPdfUrl(currentUser);
    setActivePdfUrl(primary);
    setIsPdfModalOpen(true);
  };
  const handleDownloadDigitalCardPng = async () => {
    if (!cardRef.current || !currentUser)
      return;
    try {
      setIsDownloadingCardImg(true);
      const targetEl = cardRef.current;
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
      link.download = `IEEE_SREC_Card_${currentUser.roll_number || currentUser.ieee_id || "member"}_${isFlipped ? "Back" : "Front"}.png`;
      link.click();
    }
    catch (err) {
      console.error("Error downloading card:", err);
      alert("Could not download digital card image. Please try again.");
    }
    finally {
      setIsDownloadingCardImg(false);
    }
  };
  const copyText = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };
  const getSocietyLogo = (socName) => {
    const s = socName.toLowerCase();
    if (s.includes("computer") || s.includes("cs"))
      return csLogo;
    if (s.includes("women") || s.includes("wie"))
      return wieLogo;
    if (s.includes("computational") || s.includes("cis"))
      return cisLogo;
    if (s.includes("communication") || s.includes("comsoc"))
      return comsocLogo;
    if (s.includes("medicine") || s.includes("embs"))
      return embsLogo;
    if (s.includes("power") || s.includes("pels"))
      return pelsLogo;
    if (s.includes("instrumentation") || s.includes("im"))
      return imLogo;
    return ieeeStamp;
  };
  const formatShortSocieties = (societies) => {
    if (!societies)
      return "SB SREC";
    const list = Array.isArray(societies) ? societies : [societies];
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
    return list.map((s) => {
      if (shortMap[s])
        return shortMap[s];
      const match = s.match(/\(([^)]+)\)/);
      if (match)
        return match[1];
      return s.replace(/^IEEE\s+/i, "").replace(/\s+Society/i, "").replace(/Student Branch/i, "SB");
    }).join(", ");
  };
  if (!currentUser) {
    return (<div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
      <Loader2 className="animate-spin text-[#002855]" size={32} />
    </div>);
  }
  const validityInfo = getMembershipValidity(currentUser.join_date);
  const membershipValidityDate = validityInfo.formattedExpiry;
  const isMembershipActive = !validityInfo.isExpired && currentUser.membership_status !== "EXPIRED";
  return (<div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-[#002855] selection:text-white relative overflow-x-hidden">

    {/* Crisp White Ambient Mesh Canvas */}
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute top-0 right-1/4 w-[650px] h-[650px] bg-blue-50/80 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 -left-20 w-[550px] h-[550px] bg-indigo-50/70 rounded-full blur-[160px]" />
      <div className="absolute -bottom-20 right-10 w-[600px] h-[600px] bg-slate-100/90 rounded-full blur-[140px]" />
    </div>

    {/* Official Universal Navbar */}
    <Navbar />

    <main className="relative z-10 flex-1 max-w-[1480px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 space-y-6 animate-fadeIn">

      {/* ════════════════════════════════════════════════════════════════════
            MASTER MULTI-ZONE BENTO GRID LAYOUT
           ════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ══════════════════════════════════════════════════════════════════
            LEFT SIDEBAR: 3D ID CARD VAULT & CREDENTIALS (5 COLUMNS)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">

          {/* ── CARD HOLDER CONTAINER ── */}
          <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-4">

                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={15} className="text-amber-500" />
                    <span>Membership Card</span>
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${isMembershipActive
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-rose-100 text-rose-800 border border-rose-300"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${isMembershipActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                    {isMembershipActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* 3D Perspective Card Wrapper with Fluid Auto-Adjust Sizing */}
                <div className="w-full max-w-[540px] md:max-w-[620px] lg:max-w-[660px] mx-auto [perspective:1400px] py-1 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)} title="Click card to flip in place">
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full relative select-none"
                    style={{ transformStyle: "preserve-3d", WebkitTransformStyle: "preserve-3d" }}
                  >
                    {/* CARD FRONT FACE: AUTO-ADJUSTING FLUID HIGH-TECH DESIGN */}
                    <div
                      ref={!isFlipped ? cardRef : null}
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(0deg)",
                        transformStyle: "preserve-3d",
                        WebkitTransformStyle: "preserve-3d",
                        opacity: isFlipped ? 0 : 1,
                        pointerEvents: isFlipped ? "none" : "auto",
                        zIndex: isFlipped ? 0 : 2,
                        transition: "opacity 0.2s ease 0.1s",
                      }}
                      className="w-full aspect-[1.586] min-h-[220px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[330px] rounded-[20px] sm:rounded-[28px] md:rounded-[32px] bg-white text-slate-900 relative overflow-hidden shadow-[0_25px_60px_rgba(0,35,80,0.20)] border border-slate-200 select-none p-3.5 sm:p-5 md:p-6 flex flex-col justify-between"
                    >
                      {/* Left Micro Dot-Grid Matrix Texture */}
                      <div className="absolute left-0 top-0 bottom-0 w-[55%] opacity-[0.08] pointer-events-none" style={{
                        backgroundImage: `radial-gradient(#002855 1.5px, transparent 1.5px)`,
                        backgroundSize: "12px 12px"
                      }} />

                      {/* SREC Campus Subtle Architectural Watermark */}
                      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.08]">
                        <img src={srecCampus} alt="SREC Campus" className="w-full h-full object-cover object-center brightness-105 saturate-[1.2]" />
                      </div>

                      {/* ── RIGHT HIGH-TECH BLUE CIRCUIT CHEVRON SHIELD ── */}
                      <div className="absolute top-0 right-0 bottom-0 w-[52%] sm:w-[50%] pointer-events-none overflow-hidden">
                        {/* Outer Electric Blue Chevron Border */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0055ff] via-[#0038b8] to-[#001850] shadow-2xl" style={{
                          clipPath: "polygon(22% 0%, 100% 0%, 100% 100%, 0% 100%, 12% 50%)"
                        }} />
                        {/* Inner Dark Navy Shield */}
                        <div className="absolute inset-[3px] left-[6px] bg-gradient-to-br from-[#001844] via-[#001230] to-[#000818]" style={{
                          clipPath: "polygon(22% 0%, 100% 0%, 100% 100%, 0% 100%, 12% 50%)"
                        }}>
                          {/* High-Tech Cyan Circuit Trace Lines & Nodes */}
                          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 30 20 L 70 20 L 90 40 L 140 40" stroke="#0099ff" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
                            <path d="M 10 90 L 50 90 L 75 115 L 130 115" stroke="#00d4ff" strokeWidth="1.5" fill="none" />
                            <path d="M 40 160 L 90 160 L 110 140 L 160 140" stroke="#0066ff" strokeWidth="1.5" fill="none" />
                            <circle cx="90" cy="40" r="2.5" fill="#00d4ff" className="animate-ping opacity-75" />
                            <circle cx="75" cy="115" r="3" fill="#00d4ff" />
                            <circle cx="110" cy="140" r="2.5" fill="#38bdf8" />
                          </svg>

                          {/* Glowing Cyber Nodes */}
                          <div className="absolute top-1/4 right-8 w-2 h-2 rounded-full bg-[#00d4ff] shadow-[0_0_12px_#00d4ff]" />
                          <div className="absolute bottom-1/3 left-10 w-2 h-2 rounded-full bg-[#0099ff] shadow-[0_0_10px_#0099ff]" />
                        </div>
                      </div>

                      {/* ── TOP HEADER ROW ── */}
                      <div className="relative z-10 flex items-center justify-between">
                        {/* Top Left Branding */}
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-[#002855]" />
                          <span className="text-[9px] sm:text-[11px] md:text-[13px] font-black uppercase text-[#002855] tracking-wider">
                            IEEE SB SREC · SB 64581
                          </span>
                        </div>

                        {/* Top-Right Circular IEEE Logo Emblem Badge (Enlarged on Desktop) */}
                        <div className="w-[38px] h-[38px] sm:w-[50px] sm:h-[50px] md:w-[62px] md:h-[62px] lg:w-[68px] lg:h-[68px] rounded-full p-[2px] sm:p-[2.5px] md:p-[3px] bg-gradient-to-tr from-[#001c3d] via-[#002855] to-[#0066ff] shadow-[0_6px_16px_rgba(0,40,85,0.35)] flex items-center justify-center shrink-0">
                          <div className="w-full h-full rounded-full bg-white p-0.5 md:p-1 flex items-center justify-center overflow-hidden">
                            <img src={ieeeStamp} alt="IEEE" className="w-full h-full object-contain block max-w-full max-h-full" />
                          </div>
                        </div>
                      </div>

                      {/* ── MIDDLE SECTION: LEFT DETAILS & RIGHT STUDENT PORTRAIT ── */}
                      <div className="relative z-10 my-auto py-0.5 sm:py-1 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">

                        {/* Left: Name, Angled Role Ribbon & Stacked Contact Rows */}
                        <div className="max-w-[56%] sm:max-w-[58%] min-w-0 space-y-1 sm:space-y-1.5 md:space-y-2">

                          {/* Name & Sheared Role Ribbon */}
                          <div>
                            <h3 className="text-[13px] sm:text-base md:text-xl lg:text-2xl font-black text-[#002855] uppercase tracking-tight leading-tight truncate">
                              {currentUser.first_name} {currentUser.last_name}
                            </h3>

                            {/* Sheared/Angled Royal Blue Role Badge */}
                            <div className="inline-flex items-center px-2 sm:px-2.5 md:px-3 py-0.5 md:py-1 rounded-sm bg-[#004899] text-white font-black text-[7.5px] sm:text-[9px] md:text-[11px] uppercase tracking-wider transform -skew-x-12 mt-0.5 md:mt-1 shadow-xs">
                              <span className="transform skew-x-12 truncate max-w-[150px] sm:max-w-none">
                                {currentUser.member_type || "STUDENT MEMBER"} - {currentUser.department ? currentUser.department.split(" ")[0] : "IEEE"}
                              </span>
                            </div>
                          </div>

                          {/* Stacked Contact Rows with Circular Solid Blue Icons */}
                          <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5 text-[7.5px] sm:text-[9px] md:text-[11px] lg:text-xs text-slate-800 pt-0.5">

                            {/* Phone */}
                            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
                              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-[#002855] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <Phone size={8} className="md:w-3 md:h-3" />
                              </div>
                              <span className="font-bold text-slate-900 truncate">{currentUser.phone}</span>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
                              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-[#002855] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <Mail size={8} className="md:w-3 md:h-3" />
                              </div>
                              <span className="font-medium text-slate-700 truncate max-w-[130px] sm:max-w-[180px] md:max-w-[220px]">{currentUser.email}</span>
                            </div>

                            {/* IEEE ID */}
                            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
                              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-[#002855] text-white flex items-center justify-center shrink-0 shadow-2xs font-bold text-[6.5px] md:text-[9px]">
                                <Calendar size={8} className="md:w-3 md:h-3" />
                              </div>
                              <span className="font-mono font-bold text-[#002855] truncate">
                                {currentUser.ieee_id && currentUser.ieee_id !== "PENDING"
                                  ? currentUser.ieee_id
                                  : "PENDING"}
                              </span>
                            </div>

                            {/* Institution */}
                            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5">
                              <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-[#002855] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                <Building2 size={8} className="md:w-3 md:h-3" />
                              </div>
                              <span className="font-medium text-slate-700 truncate max-w-[130px] sm:max-w-[180px] md:max-w-[220px]">
                                SREC IEEE SB
                              </span>
                            </div>

                          </div>
                        </div>

                        {/* Right: Enlarged Student Portrait Photo with Thick White Border Frame on Desktop */}
                        <div className="w-[42%] sm:w-[40%] flex items-center justify-center shrink-0 pr-1 sm:pr-2">
                          <div className="relative">
                            <div className="w-[74px] h-[90px] sm:w-[96px] sm:h-[116px] md:w-[116px] md:h-[140px] lg:w-[126px] lg:h-[152px] rounded-[18px] sm:rounded-[24px] md:rounded-[30px] border-[3px] sm:border-4 md:border-[5px] border-white shadow-[0_12px_30px_rgba(0,0,0,0.45)] overflow-hidden shrink-0 bg-slate-900">
                              <img src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.first_name + " " + currentUser.last_name)}&background=002855&color=fff&size=512`} alt={currentUser.first_name} className="w-full h-full object-cover object-top block" />
                            </div>
                            {/* Emerald Verified Checkmark Badge or Inactive Expiry Badge */}
                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full border-2 md:border-[3px] border-white flex items-center justify-center text-white shadow-lg ${isMembershipActive ? "bg-[#00c853]" : "bg-rose-500"}`}>
                              {isMembershipActive ? (<Check size={12} className="stroke-[3] md:w-4 md:h-4" />) : (<ShieldAlert size={12} className="stroke-[2.5] md:w-4 md:h-4" />)}
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* ── BOTTOM ROW: STADIUM VALIDITY BOX & QR CODE ── */}
                      <div className="relative z-10 flex items-center justify-between pt-0.5 sm:pt-1 md:pt-2">

                        {/* Dark Navy Stadium Validity Pill */}
                        <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-white shadow-md border ${isMembershipActive
                          ? "bg-[#001838] border-[#003880]"
                          : "bg-[#280505] border-rose-800/80"}`}>
                          <div className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-md text-white flex items-center justify-center shadow-xs shrink-0 ${isMembershipActive ? "bg-[#0066ff]" : "bg-rose-600"}`}>
                            <Calendar size={10} className="md:w-3.5 md:h-3.5 stroke-[2.5]" />
                          </div>
                          <span className="text-[7.5px] sm:text-[9.5px] md:text-[11.5px] font-black uppercase tracking-wider truncate">
                            {isMembershipActive ? (<span className="text-sky-100">
                              VALID UPTO: <span className="text-white font-extrabold">{membershipValidityDate}</span>
                            </span>) : (<span className="text-rose-200">
                              EXPIRED: <span className="text-white font-extrabold">{membershipValidityDate}</span> · <span className="text-rose-300 font-extrabold">INACTIVE</span>
                            </span>)}
                          </span>
                        </div>

                        {/* White QR Code Badge on Bottom Right */}
                        <div className="p-1 sm:p-1.5 md:p-2 rounded-lg sm:rounded-xl md:rounded-2xl bg-white shadow-lg border border-white/90 shrink-0">
                          <QrCode size={18} className="sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#002855]" />
                        </div>

                      </div>

                    </div>

                    {/* CARD BACK FACE: MATCHING HIGH-TECH BACK FACE WITH BRANCH DETAILS */}
                    <div
                      ref={isFlipped ? cardRef : null}
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                        transformStyle: "preserve-3d",
                        WebkitTransformStyle: "preserve-3d",
                        opacity: isFlipped ? 1 : 0,
                        pointerEvents: isFlipped ? "auto" : "none",
                        zIndex: isFlipped ? 2 : 0,
                        transition: "opacity 0.2s ease 0.1s",
                      }}
                      className="w-full aspect-[1.586] min-h-[220px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[330px] rounded-[20px] sm:rounded-[28px] md:rounded-[32px] bg-gradient-to-br from-[#001230] via-[#001c44] to-[#000d20] text-white absolute inset-0 select-none p-3.5 sm:p-5 md:p-6 flex flex-col justify-between overflow-hidden shadow-[0_25px_60px_rgba(0,35,80,0.20)] border border-blue-900/50"
                    >
                      {/* Background Circuit Grid Texture */}
                      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M 0 50 L 300 50 M 50 0 L 50 300 M 0 150 L 300 150 M 200 0 L 200 300" stroke="#0099ff" strokeWidth="0.75" fill="none" />
                        <circle cx="50" cy="50" r="3" fill="#00d4ff" />
                        <circle cx="200" cy="150" r="3" fill="#00d4ff" />
                      </svg>

                      {/* SREC Campus Image Backdrop with Dark Navy Filter */}
                      <img src={srecCampus} alt="SREC Campus" className="absolute inset-0 w-full h-full object-cover object-center opacity-25 brightness-50 saturate-[1.3] pointer-events-none" />

                      {/* Top Header Ribbon */}
                      <div className="relative z-10 flex items-center justify-between pb-1.5 sm:pb-2 border-b border-white/15">
                        <span className="text-[8px] sm:text-[9px] md:text-[11px] font-mono text-cyan-300 tracking-widest font-black uppercase flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                          IEEE MADRAS SECTION · SREC SB
                        </span>
                        <span className="text-[7.5px] sm:text-[8px] md:text-[10px] font-mono text-slate-300 font-bold shrink-0">REGION 10 APAC</span>
                      </div>

                      {/* Center High-Tech Emblem */}
                      <div className="relative z-10 my-auto flex items-center justify-between px-1 sm:px-2 md:px-4 gap-2 sm:gap-4">
                        <div className="space-y-1 md:space-y-2 text-[8.5px] sm:text-[10px] md:text-xs text-slate-200 min-w-0">
                          <div>
                            <span className="text-cyan-400 font-bold block text-[7.5px] sm:text-[8px] md:text-[9.5px] uppercase">Institution</span>
                            <span className="text-white font-semibold truncate block">Sri Ramakrishna Engineering College</span>
                          </div>
                          <div>
                            <span className="text-cyan-400 font-bold block text-[7.5px] sm:text-[8px] md:text-[9.5px] uppercase">College Email</span>
                            <span className="font-mono text-sky-200 truncate block">{currentUser.email}</span>
                          </div>
                          <div>
                            <span className="text-cyan-400 font-bold block text-[7.5px] sm:text-[8px] md:text-[9.5px] uppercase">Enrolled Chapters</span>
                            <span className="text-white font-bold truncate block">{formatShortSocieties(currentUser.target_societies)}</span>
                          </div>
                        </div>

                        <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full p-[2.5px] md:p-[3.5px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 shadow-[0_0_25px_rgba(0,212,255,0.45)] flex items-center justify-center shrink-0">
                          <div className="w-full h-full rounded-full bg-white p-1 md:p-1.5 flex items-center justify-center overflow-hidden">
                            <img src={ieeeStamp} alt="IEEE" className="w-full h-full object-contain" />
                          </div>
                        </div>
                      </div>

                      {/* Footer Authorization Block */}
                      <div className="relative z-10 pt-1.5 sm:pt-2 md:pt-3 border-t border-white/15 flex items-center justify-between text-[8px] sm:text-[9px] md:text-[11px]">
                        <div>
                          <span className="font-mono font-bold text-cyan-300 block text-[7.5px] sm:text-[8.5px] md:text-[10px]">
                            AUTH: IEEE-{currentUser.ieee_id && currentUser.ieee_id !== 'PENDING' ? currentUser.ieee_id : 'PENDING'}-SB64581
                          </span>
                          <span className="text-[7px] sm:text-[7.5px] md:text-[9px] text-slate-400 font-mono">www.srec.ac.in · ieeesrec.org</span>
                        </div>
                        <div className="text-right flex flex-col items-end shrink-0">
                          <img src={counselorSign} alt="Counselor Signature" className="h-4 sm:h-5 md:h-6 w-auto object-contain brightness-0 invert opacity-90 drop-shadow-xs" />
                          <span className="font-serif italic text-cyan-200 text-[10px] sm:text-[11px] md:text-sm block leading-none font-medium mt-0.5">
                            Dr. K. Balamurugan
                          </span>
                          <span className="text-[6.5px] sm:text-[7.5px] md:text-[9px] text-sky-300 uppercase font-black tracking-wider leading-none mt-0.5">
                            BRANCH COUNSELOR
                          </span>
                        </div>
                      </div>

                    </div>
                  </motion.div>
                </div>

            {/* ── ACTION BUTTONS: VIEW ORIGINAL IEEE PDF CARD & DIGITAL CARD CONTROLS ── */}
            <div className="pt-2 space-y-2">
              <button type="button" onClick={handleOpenPdfModal} className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#002855] via-[#004899] to-[#0066cc] hover:from-[#001c3d] hover:to-[#004899] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#002855]/25 hover:shadow-xl hover:shadow-[#002855]/35 transition-all flex items-center justify-center gap-2.5 group active:scale-[0.98] cursor-pointer" title="View and Download official IEEE Headquarters PDF card">
                <div className="w-6 h-6 rounded-lg bg-white/15 flex items-center justify-center text-cyan-200 group-hover:scale-110 transition-transform">
                  <FileText size={15} />
                </div>
                <span>View Original IEEE Card (PDF)</span>
                <ExternalLink size={14} className="text-cyan-300 opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setIsFlipped(!isFlipped)} className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer" title="Flip between front and back of digital card">
                  <RotateCw size={13} />
                  <span>{isFlipped ? "Show Front" : "Flip Card"}</span>
                </button>

                <button type="button" onClick={handleDownloadDigitalCardPng} disabled={isDownloadingCardImg} className="py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#002855] border border-blue-200 font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50" title="Download high-resolution image of this digital collegiate card">
                  {isDownloadingCardImg ? (<>
                    <Loader2 size={13} className="animate-spin" />
                    <span>Saving...</span>
                  </>) : (<>
                    <Download size={13} />
                    <span>Save PNG</span>
                  </>)}
                </button>
              </div>
            </div>

            {/* Action Link: Show Renew Membership exclusively when inactive/expired */}
            {!isMembershipActive && (<div className="pt-2">
              <Link to="/membership-registration" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 active:scale-95">
                <RotateCw size={15} />
                <span>Renew Membership</span>
              </Link>
            </div>)}
          </div>

          {/* ── QUICK CREDENTIAL COPY CHIPS ── */}
          <div className="p-5 rounded-[24px] bg-white border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <KeyRound size={15} className="text-[#002855]" />
              <span>IEEE Membership Credentials</span>
            </h4>

            <div className="space-y-2 text-xs">
              {/* Original IEEE PDF Card Quick Row */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-50/90 to-indigo-50/70 border border-blue-200 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[9px] text-[#002855] uppercase font-bold block">Official IEEE Card</span>
                  <span className="font-mono text-xs font-black text-[#002855] flex items-center gap-1 truncate">
                    <FileText size={12} className="text-blue-600 shrink-0" />
                    <span>{currentUser.ieee_id && currentUser.ieee_id !== 'PENDING' ? `${currentUser.ieee_id}.pdf` : 'IEEE_Card.pdf'}</span>
                  </span>
                </div>
                <button type="button" onClick={handleOpenPdfModal} className="px-3 py-1.5 rounded-lg bg-[#002855] text-white hover:bg-[#001c3d] text-[11px] font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer" title="Open Original IEEE Card PDF">
                  <Eye size={12} />
                  <span>View PDF</span>
                </button>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-[#002855] uppercase font-bold block">IEEE Membership ID</span>
                  <span className="font-mono text-base font-black text-[#002855]">#{currentUser.ieee_id}</span>
                </div>
                <button type="button" onClick={() => copyText(currentUser.ieee_id, "id")} className="p-2 rounded-lg bg-[#002855] text-white hover:bg-[#001c3d] transition-all shadow-sm cursor-pointer" title="Copy IEEE ID">
                  {copiedField === "id" ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Roll Number</span>
                  <span className="font-mono text-xs font-bold text-slate-900">{currentUser.roll_number}</span>
                </div>
                <button type="button" onClick={() => copyText(currentUser.roll_number, "roll")} className="p-1.5 rounded-lg bg-slate-200/70 hover:bg-[#002855] hover:text-white transition-all text-slate-700 cursor-pointer" title="Copy Roll Number">
                  {copiedField === "roll" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase font-bold block">Official Email</span>
                  <span className="font-mono text-xs font-medium text-slate-700 truncate max-w-[180px] block">{currentUser.email}</span>
                </div>
                <button type="button" onClick={() => copyText(currentUser.email, "email")} className="p-1.5 rounded-lg bg-slate-200/70 hover:bg-[#002855] hover:text-white transition-all text-slate-700 cursor-pointer" title="Copy Email">
                  {copiedField === "email" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ══════════════════════════════════════════════════════════════════
            RIGHT MAIN WORKSPACE: BENTO DATA CORE (7 COLUMNS)
           ══════════════════════════════════════════════════════════════════ */}
        <div className="lg:col-span-7 space-y-6">

          {/* ── BENTO ROW 1: PRIMARY PROFILE & ACADEMIC STANDING ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Member Profile Card */}
            <div className="p-5 sm:p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[9px] font-black uppercase tracking-wider inline-block">
                    ● {currentUser.membership_status}
                  </span>

                  {/* Quick Account Controls */}
                  <div className="flex items-center gap-1.5">
                    <button type="button" onClick={handleLogout} className="px-3 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1">
                      <LogOut size={12} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="relative shrink-0 group">
                    <img src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.first_name + " " + currentUser.last_name)}&background=002855&color=fff&size=512`} alt={currentUser.first_name} className="w-20 h-20 rounded-2xl object-cover object-top border-2 border-slate-200 shadow-sm bg-slate-900" />
                    <label className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity text-[8px] font-bold" title="Update Avatar">
                      {isUploadingAvatar ? (<Loader2 size={16} className="animate-spin text-white" />) : (<>
                        <Camera size={16} />
                        <span>Photo</span>
                      </>)}
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} className="hidden" />
                    </label>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-sm">
                      <Check size={10} className="stroke-[3]" />
                    </span>
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 uppercase truncate">
                      {currentUser.first_name} {currentUser.last_name}
                    </h2>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {currentUser.member_type}
                    </p>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-[#002855] font-mono text-[10px] font-black">
                      <span>IEEE ID:</span>
                      <span>#{currentUser.ieee_id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Roll Number</span>
                  <span className="font-mono font-bold text-slate-900">{currentUser.roll_number}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Phone Contact</span>
                  <span className="font-medium text-slate-700">{currentUser.phone}</span>
                </div>
              </div>
            </div>

            {/* Department & Collegiate Standing */}
            <div className="p-5 sm:p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-[#002855] text-xs font-black uppercase tracking-wider mb-2">
                  <GraduationCap size={16} />
                  <span>Academic Affiliation</span>
                </div>
                <h3 className="text-sm font-black text-slate-900 leading-snug">
                  {currentUser.department}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {currentUser.year_of_study} · Sri Ramakrishna Engineering College
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">Registered On</span>
                  <span className="font-bold text-slate-800">{currentUser.join_date || "16 Aug 2025"}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block">1 Year Validity</span>
                  <span className="font-bold text-emerald-600">{membershipValidityDate}</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── BENTO ROW 2: TECHNICAL FOCUS & SKILLS TAG CLOUD ── */}
          <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Cpu size={16} className="text-[#002855]" />
                <span>Technical Specializations &amp; Domains</span>
              </h4>
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                {currentUser.skills.length} Areas Verified
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {currentUser.skills.map((skill, i) => (<span key={i} className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-800 text-xs font-bold transition-all shadow-2xs">
                {skill}
              </span>))}
            </div>

            {currentUser.bio_sop && (<div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs text-slate-700 italic">
              "{currentUser.bio_sop}"
            </div>)}
          </div>

          {/* ── BENTO ROW 3: ENROLLED CHAPTERS (MULTI-GRID) ── */}
          <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Award size={16} className="text-[#002855]" />
                <span>Enrolled Technical Chapters</span>
              </h4>
              <Link to="/societies" className="text-xs font-bold text-[#002855] hover:underline flex items-center gap-1">
                <span>Explore Chapters</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentUser.target_societies.map((socName, idx) => {
                const logo = getSocietyLogo(socName);
                return (<div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#002855]/40 hover:bg-white transition-all flex flex-col justify-between space-y-3 group">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center border border-slate-200 shadow-2xs">
                      <img src={logo} alt={socName} className="max-h-full max-w-full object-contain" />
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[8px] font-black uppercase tracking-wider">
                      Active
                    </span>
                  </div>

                  <div>
                    <h5 className="text-xs font-black text-slate-900 uppercase truncate group-hover:text-[#002855] transition-colors">
                      {socName}
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">IEEE SREC Branch</p>
                  </div>
                </div>);
              })}
            </div>
          </div>

          {/* ── BENTO ROW 4: EVENT PARTICIPATION & CERTIFICATION LOG ── */}
          <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar size={16} className="text-[#002855]" />
                <span>Verified Event Participations &amp; Logs</span>
              </h4>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {currentUser.events_attended?.length || 1} Participations
              </span>
            </div>

            <div className="space-y-2.5">
              {(currentUser.events_attended || [
                { title: "IEEE Student Branch Orientation", date: "Sep 2025", category: "Collegiate Event" }
              ]).map((event, idx) => (<div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 hover:bg-white transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 uppercase truncate">
                      {event.title}
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      <span className="text-[#002855] font-bold">{event.category}</span> · {event.date}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase tracking-wider shrink-0">
                  Verified
                </span>
              </div>))}
            </div>
          </div>

          {/* ── BENTO ROW 4.5: OFFICIAL MEMBERSHIP & CREDENTIALS DIRECTORY TABLE ── */}
          <div className="p-6 rounded-[28px] bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileText size={16} className="text-[#002855]" />
                <span>Official Membership Directory Table</span>
              </h4>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Verified Record
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#002855] text-white">
                    <th className="p-3 font-black text-[10.5px] uppercase tracking-wider">Field Name</th>
                    <th className="p-3 font-black text-[10.5px] uppercase tracking-wider">Member Data Record</th>
                    <th className="p-3 font-black text-[10.5px] uppercase tracking-wider text-right">Status / Info</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white font-medium">
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-800">IEEE Member ID</td>
                    <td className="p-3 font-mono font-black text-[#002855]">#{currentUser.ieee_id}</td>
                    <td className="p-3 text-right"><span className="px-2 py-0.5 rounded bg-blue-100 text-[#002855] text-[9.5px] font-extrabold uppercase">Official ID</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-800">Full Name</td>
                    <td className="p-3 font-black text-slate-900">{currentUser.first_name} {currentUser.last_name}</td>
                    <td className="p-3 text-right"><span className="text-slate-500 text-[10px]">{currentUser.member_type}</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-800">Roll Number</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{currentUser.roll_number}</td>
                    <td className="p-3 text-right"><span className="text-slate-500 text-[10px]">SREC Student</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-800">Department / Standing</td>
                    <td className="p-3 font-bold text-slate-900">{currentUser.department} ({currentUser.year_of_study})</td>
                    <td className="p-3 text-right"><span className="text-slate-500 text-[10px]">Active Academic</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-800">Official Email</td>
                    <td className="p-3 font-mono text-slate-700">{currentUser.email}</td>
                    <td className="p-3 text-right"><span className="text-emerald-700 text-[10px] font-bold">Verified</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-800">Registration Date</td>
                    <td className="p-3 font-semibold text-slate-900">{currentUser.join_date || "16 Aug 2025"}</td>
                    <td className="p-3 text-right"><span className="text-slate-500 text-[10px]">Enrollment Date</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/80 bg-emerald-50/30">
                    <td className="p-3 font-bold text-slate-900">Membership Expiry</td>
                    <td className="p-3 font-black text-emerald-700">{membershipValidityDate}</td>
                    <td className="p-3 text-right"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9.5px] font-black uppercase">Dec 31st Next Year Rule</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* ── BENTO ROW 5: QUICK IEEE MEMBER RESOURCES DOCK ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <a href="https://ieeexplore.ieee.org" target="_blank" rel="noreferrer" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] shadow-2xs text-center space-y-1 transition-all group">
              <Globe size={18} className="mx-auto text-[#002855] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black text-slate-800 block">IEEE Xplore</span>
              <span className="text-[9px] text-slate-400 block">Digital Library</span>
            </a>

            <a href="https://spectrum.ieee.org" target="_blank" rel="noreferrer" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] shadow-2xs text-center space-y-1 transition-all group">
              <BookOpen size={18} className="mx-auto text-[#002855] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black text-slate-800 block">Spectrum</span>
              <span className="text-[9px] text-slate-400 block">Tech Magazine</span>
            </a>

            <a href="https://ieee-collabratec.ieee.org" target="_blank" rel="noreferrer" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] shadow-2xs text-center space-y-1 transition-all group">
              <Users size={18} className="mx-auto text-[#002855] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black text-slate-800 block">Collabratec</span>
              <span className="text-[9px] text-slate-400 block">Member Network</span>
            </a>

            <Link to="/activities" className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-[#002855] shadow-2xs text-center space-y-1 transition-all group">
              <Sparkles size={18} className="mx-auto text-[#002855] group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-black text-slate-800 block">Activities</span>
              <span className="text-[9px] text-slate-400 block">Branch Calendar</span>
            </Link>
          </div>

        </div>

      </div>

      {/* ════════════════════════════════════════════════════════════════════
            OFFICIAL IEEE PDF MEMBERSHIP CARD VIEWER MODAL
           ════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isPdfModalOpen && (<div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto animate-fadeIn">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} transition={{ duration: 0.25, ease: "easeOut" }} className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] text-slate-900">
            {/* Modal Top Header Bar */}
            <div className="bg-gradient-to-r from-[#001838] via-[#002855] to-[#004899] text-white px-5 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20 shrink-0">
                  <FileText className="text-cyan-300" size={22} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                      Official IEEE Membership Card (PDF)
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 font-mono text-[10px] font-black border border-cyan-300/30">
                      #{currentUser.ieee_id}
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-200 truncate mt-0.5">
                    {currentUser.first_name} {currentUser.last_name} · {currentUser.department} · SREC IEEE SB
                  </p>
                </div>
              </div>

              {/* Toolbar Actions */}
              <div className="flex items-center gap-2">
                {/* Open in New Window Button */}
                <a href={activePdfUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 border border-white/20 shadow-xs" title="Open PDF in a new browser tab">
                  <ExternalLink size={13} />
                  <span className="hidden sm:inline">Open New Tab</span>
                </a>

                {/* Download PDF Button */}
                <a href={activePdfUrl} download={`IEEE_Membership_Card_${currentUser.ieee_id || currentUser.roll_number}.pdf`} className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md" title="Download PDF file">
                  <Download size={13} />
                  <span>Download PDF</span>
                </a>

                {/* Close Modal */}
                <button type="button" onClick={() => setIsPdfModalOpen(false)} className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer border border-white/20" title="Close viewer">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* PDF Viewer Body & Interactive Iframe */}
            <div className="p-4 sm:p-5 flex-1 overflow-hidden flex flex-col bg-slate-100 gap-3">
              <div className="relative flex-1 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-300 shadow-inner flex flex-col min-h-[55vh]">
                <iframe src={`${activePdfUrl}#view=FitH&toolbar=1`} title="Official IEEE Membership Card PDF" className="w-full h-full flex-1 rounded-2xl bg-slate-900" />
              </div>

              {/* Bottom Information & Action Bar (Read-Only Official Verification) */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-700 min-w-0">
                  <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                  <span className="truncate font-medium">
                    Official Verified Record · <span className="font-bold text-[#002855]">IEEE Student Branch SREC (SB 64581)</span>
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <a href={activePdfUrl} download={`IEEE_Membership_Card_${currentUser.ieee_id || currentUser.roll_number}.pdf`} className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 border border-slate-200 shadow-xs cursor-pointer" title="Download PDF file">
                    <Download size={13} />
                    <span>Download PDF</span>
                  </a>

                  <button type="button" onClick={() => setIsPdfModalOpen(false)} className="px-4 py-2 rounded-xl bg-[#002855] text-white hover:bg-[#001c3d] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm">
                    Done
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>)}
      </AnimatePresence>

    </main>

    {/* Official Footer */}
    <Footer />
  </div>);
};
export default StudentDashboardPage;
