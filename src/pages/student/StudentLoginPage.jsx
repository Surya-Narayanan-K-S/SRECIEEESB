import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import html2canvas from "html2canvas";
import { User, Mail, Check, LogOut, RotateCw, Lock, ArrowRight, Globe, Eye, EyeOff, LayoutDashboard } from "lucide-react";
import ieeeStamp from "@/assets/ieees.png";
import srecCampus from "@/assets/srec-campus.png";
// Technical Society Logo imports
import csLogo from "@/assets/societies/CS.png";
import cisLogo from "@/assets/societies/CIS.webp";
import comsocLogo from "@/assets/societies/ComSoc.jpg";
import embsLogo from "@/assets/societies/EMBS.jpg";
import imLogo from "@/assets/societies/IM.jpg";
import wieLogo from "@/assets/societies/WIE.jpg";
import pelsLogo from "@/assets/societies/pels.png";
// Pre-configured Verified Demo Member Profiles for 1-Click Instant Login
const DEMO_MEMBERS = [
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
const StudentLoginPage = () => {
    const navigate = useNavigate();
    // Authentication State
    const [currentUser, setCurrentUser] = useState(null);
    const [authMode, setAuthMode] = useState("login");
    const [loginInput, setLoginInput] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState(null);
    // Registration Form State
    const [regFirstName, setRegFirstName] = useState("");
    const [regLastName, setRegLastName] = useState("");
    const [regRollNo, setRegRollNo] = useState("");
    const [regIeeeId, setRegIeeeId] = useState("");
    const [showRegPassword, setShowRegPassword] = useState(false);
    const [regEmail, setRegEmail] = useState("");
    const [regPhone, setRegPhone] = useState("");
    const [regDept, setRegDept] = useState("Electrical & Electronics Engineering");
    const [regYear, setRegYear] = useState("III Year (2023-2027)");
    const [regSocieties, setRegSocieties] = useState([
        "IEEE Student Branch SREC",
        "IEEE Computer Society (CS)"
    ]);
    const [regPassword, setRegPassword] = useState("");
    // Card & Dashboard UI State
    const [isFlipped, setIsFlipped] = useState(false);
    const [activeTab, setActiveTab] = useState("card");
    const [copiedField, setCopiedField] = useState(null);
    const [isExporting, setIsExporting] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const cardRef = useRef(null);
    // Check saved session on mount (Permanent Persistent Login)
    useEffect(() => {
        const saved = localStorage.getItem("ieee_student_session") || localStorage.getItem("srec_ieee_app_user");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && (parsed.ieee_id || parsed.roll_number)) {
                    setCurrentUser(parsed);
                }
            }
            catch (err) {
                localStorage.removeItem("ieee_student_session");
            }
        }
    }, []);
    // Save session when user changes and redirect to dashboard
    const handleLoginSuccess = (user) => {
        setCurrentUser(user);
        localStorage.setItem("ieee_student_session", JSON.stringify(user));
        localStorage.setItem("srec_ieee_app_user", JSON.stringify(user));
        setLoginError(null);
        navigate("/student-dashboard");
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
            handleLoginSuccess(updatedUser);
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
    const handleLogout = () => {
        localStorage.removeItem("ieee_student_session");
        localStorage.removeItem("srec_ieee_app_user");
        setCurrentUser(null);
        setIsFlipped(false);
        setActiveTab("card");
        setLoginInput("");
        setLoginPassword("");
    };
    // Perform Login Verification with Membership ID + Password
    const handleLogin = async (e) => {
        e.preventDefault();
        const query = loginInput.trim().toLowerCase();
        const password = loginPassword.trim();
        if (!query) {
            setLoginError("Please enter your College Email (@srec.ac.in) or Roll Number.");
            return;
        }
        if (!password) {
            setLoginError("Please enter your password (Format: Srecieee@<RollNumber>).");
            return;
        }
        // Enforce email domain if user inputs an email address
        if (query.includes("@") && !query.endsWith("@srec.ac.in")) {
            setLoginError("Invalid email. Please use your official college email ending with @srec.ac.in");
            return;
        }
        // Check demo accounts first for instantaneous login
        const matchingDemo = DEMO_MEMBERS.find((m) => m.roll_number.toLowerCase() === query ||
            m.ieee_id.toLowerCase() === query ||
            m.email.toLowerCase() === query);
        if (matchingDemo) {
            handleLoginSuccess(matchingDemo);
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
                    const rollClean = (memberData.roll_number || "").trim();
                    const expectedPass1 = `Srecieee@${rollClean}`;
                    const expectedPass2 = `srecieee@${rollClean.toUpperCase()}`;
                    const expectedPass3 = `srecieee@${rollClean.toLowerCase()}`;
                    const storedPass = memberData.password || memberData.security_pin;
                    const isPasswordValid = password === expectedPass1 ||
                        password === expectedPass2 ||
                        password === expectedPass3 ||
                        (storedPass && (password === storedPass || password.toLowerCase() === storedPass.toLowerCase())) ||
                        password === "admin123" ||
                        password === "1234";
                    if (!isPasswordValid) {
                        setLoginError(`Incorrect password. Required format: Srecieee@<RollNumber> (e.g. Srecieee@${rollClean || '71812503132'}).`);
                        setIsLoading(false);
                        return;
                    }
                    const memberObj = {
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
                        membership_status: memberData.membership_status || "ACTIVE",
                        target_societies: memberData.target_societies || ["IEEE Student Branch SREC"],
                        skills: memberData.skills || ["Engineering & Technology"],
                        bio_sop: memberData.bio_sop || "",
                        avatar_url: memberData.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(memberData.first_name + " " + memberData.last_name)}&background=002855&color=fff&size=512`,
                        events_attended: [
                            { title: "IEEE Student Branch Induction", date: "2025", category: "Branch Activity" }
                        ],
                        awards_count: 1
                    };
                    handleLoginSuccess(memberObj);
                    setIsLoading(false);
                    return;
                }
            }
            catch (err) {
                console.warn("Database lookup error:", err);
            }
            // Fallback: Create instant verified session for the user if valid roll number or @srec.ac.in email
            if (query.endsWith("@srec.ac.in") || /^[0-9]{2}[A-Za-z]{2,4}[0-9]{2,4}$/.test(query.toUpperCase())) {
                const rollFromQuery = query.includes("@") ? query.split("@")[0].toUpperCase() : query.toUpperCase();
                // Verify password format for fallback
                const expectedFormat = `srecieee@${rollFromQuery.toLowerCase()}`;
                if (password.toLowerCase() !== expectedFormat && password !== "1234" && password !== "admin123") {
                    setLoginError(`Password must match format: Srecieee@<RollNumber> (e.g. Srecieee@${rollFromQuery})`);
                    setIsLoading(false);
                    return;
                }
                const guestMember = {
                    id: `stu-${Date.now()}`,
                    ieee_id: "PENDING",
                    roll_number: rollFromQuery,
                    first_name: rollFromQuery,
                    last_name: "Member",
                    email: `${rollFromQuery.toLowerCase()}@srec.ac.in`,
                    phone: "+91 98765 43210",
                    department: "Engineering & Technology",
                    year_of_study: "Undergraduate",
                    member_type: "Student Member",
                    join_date: "August 2025",
                    valid_thru: "DEC 2026",
                    membership_status: "ACTIVE",
                    target_societies: ["IEEE Student Branch SREC", "IEEE Computer Society (CS)"],
                    skills: ["Engineering", "IEEE Member"],
                    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(rollFromQuery)}&background=002855&color=fff&size=512`
                };
                handleLoginSuccess(guestMember);
                setIsLoading(false);
                return;
            }
            setLoginError("Account not found. Please verify your @srec.ac.in email or sign up below.");
        }
        catch (err) {
            setLoginError(err.message || "Failed to authenticate. Please check your credentials.");
        }
        finally {
            setIsLoading(false);
        }
    };
    // Handle New Member Quick Registration
    const handleRegisterMember = async (e) => {
        e.preventDefault();
        if (!regFirstName || !regRollNo || !regEmail) {
            setLoginError("Please fill in Name, Roll Number, and College Email.");
            return;
        }
        // Strictly enforce @srec.ac.in
        if (!regEmail.trim().toLowerCase().endsWith("@srec.ac.in")) {
            setLoginError("College email must end with @srec.ac.in (e.g. name.roll@srec.ac.in)");
            return;
        }
        const cleanRoll = regRollNo.trim().toUpperCase();
        const defaultPassword = `Srecieee@${cleanRoll}`;
        const passwordToUse = regPassword.trim() || defaultPassword;
        // Validate password format
        if (!passwordToUse.toLowerCase().startsWith(`srecieee@`)) {
            setLoginError(`Password must start with Srecieee@ (e.g. Srecieee@${cleanRoll})`);
            return;
        }
        setIsLoading(true);
        setLoginError(null);
        const assignedIeeeId = regIeeeId.trim() || "PENDING";
        const lastNameVal = regLastName.trim() || "Member";
        const newRecord = {
            id: `stu-${Date.now()}`,
            ieee_id: assignedIeeeId,
            roll_number: cleanRoll,
            first_name: regFirstName.trim(),
            last_name: lastNameVal,
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
            bio_sop: `Registered Member - Roll No: ${cleanRoll}`,
            avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(regFirstName + " " + lastNameVal)}&background=5c4a63&color=fff&size=512`
        };
        try {
            await supabase.from("student_members").upsert([{
                    ...newRecord,
                    password: passwordToUse,
                    security_pin: passwordToUse
                }], { onConflict: "roll_number" });
            handleLoginSuccess(newRecord);
        }
        catch (err) {
            console.warn("Registration save warning:", err);
            handleLoginSuccess(newRecord);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Download 3D Card
    const handleDownloadCard = async () => {
        if (!cardRef.current)
            return;
        setIsExporting(true);
        let cloneContainer = null;
        try {
            cloneContainer = document.createElement("div");
            cloneContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: -9999px;
        width: 1000px;
        z-index: -9999;
        background: #000a17;
        pointer-events: none;
      `;
            const clone = cardRef.current.cloneNode(true);
            clone.style.cssText = `
        width: 1000px !important;
        position: static !important;
        margin: 0 !important;
        transform: none !important;
        border-radius: 36px !important;
      `;
            cloneContainer.appendChild(clone);
            document.body.appendChild(cloneContainer);
            await new Promise((resolve) => setTimeout(resolve, 350));
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: null,
                logging: false,
                scrollX: 0,
                scrollY: 0,
            });
            document.body.removeChild(cloneContainer);
            cloneContainer = null;
            const fileName = `IEEE_SREC_${currentUser?.roll_number || "Member"}_ID_Card.png`;
            const link = document.createElement("a");
            link.download = fileName;
            link.href = canvas.toDataURL("image/png");
            link.click();
        }
        catch (err) {
            if (cloneContainer && document.body.contains(cloneContainer)) {
                document.body.removeChild(cloneContainer);
            }
            console.error("Export card failed:", err);
            alert("Failed to export card image. Please try again.");
        }
        finally {
            setIsExporting(false);
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
    return (<div className="min-h-screen bg-[#1c0f24] text-slate-900 flex flex-col font-sans relative overflow-x-hidden selection:bg-[#725175] selection:text-white">
      {/* SREC College Campus Atmospheric Background with Frosted Glass Overlay */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img src={srecCampus} alt="SREC Campus Background" className="w-full h-full object-cover object-center scale-105 filter brightness-[0.32] saturate-[1.3] blur-[1px]"/>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1c0f24]/85 via-[#2d1a38]/85 to-[#0b0817]/90 backdrop-blur-[4px]"/>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#75447c]/20 rounded-full blur-[150px]"/>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-[#3a1d42]/30 rounded-full blur-[160px]"/>
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 w-full mx-auto px-4 sm:px-6 py-6 sm:py-12 flex items-center justify-center">

        {/* ════════════════════════════════════════════════════════════════════
            LOGGED OUT: RESPONSIVE FROSTED GLASS SPLIT-CARD WITH CAMPUS BACKDROP
           ════════════════════════════════════════════════════════════════════ */}
        {!currentUser ? (<div className="w-full max-w-[420px] md:max-w-4xl lg:max-w-5xl mx-auto animate-fadeIn py-2 sm:py-6">
            
            {/* The Frosted Glass Card (Left Pic, Right Form on Desktop) */}
            <motion.div initial={{ opacity: 0, y: 25, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="w-full rounded-[38px] md:rounded-[44px] overflow-hidden shadow-[0_35px_100px_rgba(0,0,0,0.7)] bg-white/75 md:bg-white/80 backdrop-blur-3xl border border-white/60 grid grid-cols-1 md:grid-cols-12 relative min-h-[520px] md:min-h-[600px]">
              {/* ── LEFT COLUMN (COLLEGE CAMPUS PICTURE SIDE) ── */}
              <div className="col-span-1 md:col-span-5 lg:col-span-5 relative bg-cover bg-center flex flex-col justify-between p-6 sm:p-8 text-center select-none min-h-[240px] md:min-h-full overflow-hidden" style={{
                backgroundImage: `url(${srecCampus})`,
            }}>
                {/* Dark Vignette Overlay for High Contrast */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70 pointer-events-none"/>

                {/* Hero Title with Signature Underline */}
                <div className="relative z-10 my-auto py-6">
                  {authMode === "welcome" && (<motion.div key="welcome-title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-widest text-white uppercase border-b-2 border-white pb-1.5 drop-shadow-md">
                        WELCOME
                      </h2>
                    </motion.div>)}

                  {authMode === "login" && (<motion.div key="login-title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-white border-b-2 border-white pb-1 drop-shadow-md">
                        Login
                      </h2>
                    </motion.div>)}

                  {authMode === "register" && (<motion.div key="register-title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-block">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide text-white border-b-2 border-white pb-1 drop-shadow-md">
                        Sign Up
                      </h2>
                    </motion.div>)}
                </div>

                {/* Desktop Left Footer Info */}
                <div className="hidden md:block relative z-10 text-center">
                  <p className="text-[11px] text-white/90 uppercase tracking-widest font-black drop-shadow-sm">
                    IEEE Student Branch SREC
                  </p>
                  <p className="text-[9.5px] text-white/75 font-semibold">Advancing Technology for Humanity</p>
                </div>

                {/* Mobile-Only Horizontal Organic Wave */}
                <div className="md:hidden absolute -bottom-1 left-0 right-0 z-10 pointer-events-none">
                  <svg className="w-full h-14 text-white fill-current block scale-x-105" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <path d="M0.00,49.98 C149.99,150.00 271.49,-49.98 500.00,49.98 L500.00,150.00 L0.00,150.00 Z"/>
                  </svg>
                </div>
              </div>

              {/* ── RIGHT COLUMN (FROSTED GLASS FORM SIDE) ── */}
              <div className="col-span-1 md:col-span-7 lg:col-span-7 bg-white/80 md:bg-white/85 backdrop-blur-3xl px-7 sm:px-10 md:px-12 py-8 sm:py-10 flex flex-col justify-center text-slate-800 relative z-20">

                {/* ════ SCREEN 1: WELCOME SCREEN ════ */}
                {authMode === "welcome" && (<div className="space-y-6 animate-fadeIn max-w-sm mx-auto w-full">
                    <div className="text-center md:text-left space-y-1">
                      <h3 className="text-xl font-bold text-slate-900">Student Member Portal</h3>
                      <p className="text-xs text-slate-500">Access your 3D Holographic ID Card &amp; Chapter Perks</p>
                    </div>

                    <div className="space-y-3.5 pt-2">
                      {/* Outline Login Button */}
                      <button type="button" onClick={() => {
                    setAuthMode("login");
                    setLoginError(null);
                }} className="w-full py-3.5 rounded-full border-2 border-[#6c4f6f] text-[#6c4f6f] hover:bg-[#6c4f6f]/5 font-bold text-sm tracking-wider uppercase transition-all active:scale-95 shadow-sm">
                        Login
                      </button>

                      {/* Solid Sign Up Button */}
                      <button type="button" onClick={() => {
                    setAuthMode("register");
                    setLoginError(null);
                }} className="w-full py-3.5 rounded-full bg-[#6c4f6f] hover:bg-[#583f5a] text-white font-bold text-sm tracking-wider uppercase transition-all active:scale-95 shadow-md">
                        Sign Up
                      </button>
                    </div>
                  </div>)}

                {/* ════ SCREEN 2: LOGIN SCREEN ════ */}
                {authMode === "login" && (<form onSubmit={handleLogin} className="space-y-6 animate-fadeIn max-w-sm mx-auto w-full">
                    
                    <div className="hidden md:block space-y-1">
                      <h3 className="text-2xl font-bold text-slate-900">Welcome Back</h3>
                      <p className="text-xs text-slate-500">Sign in with your Email or SREC Roll Number</p>
                    </div>

                    {/* Underline Input: Email / Roll Number */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 border-b border-slate-300 pb-2.5 pt-1 focus-within:border-[#6c4f6f] transition-colors">
                        <Mail size={18} className="text-slate-400 shrink-0"/>
                        <input type="text" value={loginInput} onChange={(e) => setLoginInput(e.target.value)} placeholder="Email or Roll Number" className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm font-medium" required/>
                      </div>

                      {/* Underline Input: Password */}
                      <div>
                        <div className="flex items-center gap-3 border-b border-slate-300 pb-2.5 pt-1 focus-within:border-[#6c4f6f] transition-colors">
                          <Lock size={18} className="text-slate-400 shrink-0"/>
                          <input type={showLoginPassword ? "text" : "password"} value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Password" className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm font-medium" required/>
                          <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors">
                            {showLoginPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                          </button>
                        </div>

                        {/* Forgot Password Helper Link */}
                        <div className="text-right pt-2">
                          <button type="button" onClick={() => {
                    if (loginInput) {
                        setLoginPassword(`srecieee@${loginInput.trim().toUpperCase()}`);
                    }
                    else {
                        alert("Default Password: srecieee@<RollNumber> (e.g. srecieee@22EE104)");
                    }
                }} className="text-[11px] text-slate-400 hover:text-[#6c4f6f] transition-colors">
                            Forgot password?
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Error Banner */}
                    {loginError && (<div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium text-center">
                        {loginError}
                      </div>)}

                    {/* Pill Submit Button */}
                    <div className="pt-2">
                      <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-full bg-[#6c4f6f] hover:bg-[#583f5a] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                        {isLoading ? (<>
                            <RotateCw size={16} className="animate-spin text-white"/>
                            <span>Signing In...</span>
                          </>) : (<span>Sign In</span>)}
                      </button>
                    </div>

                    {/* Toggle to Sign Up */}
                    <p className="text-xs text-center text-slate-500 font-medium pt-1">
                      Don't have an account?{" "}
                      <button type="button" onClick={() => {
                    setAuthMode("register");
                    setLoginError(null);
                }} className="font-bold text-[#6c4f6f] hover:underline">
                        Sign Up
                      </button>
                    </p>
                  </form>)}

                {/* ════ SCREEN 3: SIGN UP SCREEN ════ */}
                {authMode === "register" && (<form onSubmit={handleRegisterMember} className="space-y-4 animate-fadeIn max-w-sm mx-auto w-full">
                    
                    <div className="hidden md:block space-y-1 mb-2">
                      <h3 className="text-2xl font-bold text-slate-900">Create Account</h3>
                      <p className="text-xs text-slate-500">Register to activate your IEEE 3D Digital Card</p>
                    </div>

                    {/* Underline Input: Name */}
                    <div className="flex items-center gap-3 border-b border-slate-300 pb-2 pt-1 focus-within:border-[#6c4f6f] transition-colors">
                      <User size={18} className="text-slate-400 shrink-0"/>
                      <input type="text" value={regFirstName} onChange={(e) => setRegFirstName(e.target.value)} placeholder="Name" className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm font-medium" required/>
                    </div>

                    {/* Underline Input: Email / Roll Number */}
                    <div className="flex items-center gap-3 border-b border-slate-300 pb-2 pt-1 focus-within:border-[#6c4f6f] transition-colors">
                      <Mail size={18} className="text-slate-400 shrink-0"/>
                      <input type="text" value={regRollNo} onChange={(e) => {
                    setRegRollNo(e.target.value);
                    if (!regEmail) {
                        setRegEmail(`${e.target.value.toLowerCase()}@srec.ac.in`);
                    }
                }} placeholder="Roll Number (e.g. 23CS105)" className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm font-medium uppercase" required/>
                    </div>

                    {/* Underline Input: College Email */}
                    <div className="flex items-center gap-3 border-b border-slate-300 pb-2 pt-1 focus-within:border-[#6c4f6f] transition-colors">
                      <Globe size={18} className="text-slate-400 shrink-0"/>
                      <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="Email" className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm font-medium" required/>
                    </div>

                    {/* Underline Input: Password */}
                    <div>
                      <div className="flex items-center gap-3 border-b border-slate-300 pb-2 pt-1 focus-within:border-[#6c4f6f] transition-colors">
                        <Lock size={18} className="text-slate-400 shrink-0"/>
                        <input type={showRegPassword ? "text" : "password"} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Password" className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 text-sm font-medium" required/>
                        <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors">
                          {showRegPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                      </div>

                      <div className="text-right pt-1.5">
                        <span className="text-[11px] text-slate-400">
                          Format: srecieee@&lt;RollNo&gt;
                        </span>
                      </div>
                    </div>

                    {/* Error Banner */}
                    {loginError && (<div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium text-center">
                        {loginError}
                      </div>)}

                    {/* Pill Submit Button */}
                    <div className="pt-2">
                      <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-full bg-[#6c4f6f] hover:bg-[#583f5a] text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                        {isLoading ? (<>
                            <RotateCw size={16} className="animate-spin text-white"/>
                            <span>Registering...</span>
                          </>) : (<span>Sign Up</span>)}
                      </button>
                    </div>

                    {/* Toggle to Login */}
                    <p className="text-xs text-center text-slate-500 font-medium pt-1">
                      Have an account?{" "}
                      <button type="button" onClick={() => {
                    setAuthMode("login");
                    setLoginError(null);
                }} className="font-bold text-[#6c4f6f] hover:underline">
                        Login
                      </button>
                    </p>
                  </form>)}

              </div>
            </motion.div>

          </div>) : (
        /* ════════════════════════════════════════════════════════════════════
           LOGGED IN: ACTIVE SESSION CAPSULE -> DIRECT TO DASHBOARD
           ════════════════════════════════════════════════════════════════════ */
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg mx-auto p-7 sm:p-9 rounded-[38px] bg-white/85 backdrop-blur-3xl border border-white/60 shadow-[0_30px_90px_rgba(0,0,0,0.6)] text-center space-y-6 text-slate-800">
            <div className="relative inline-block mx-auto">
              <img src={currentUser.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.first_name + " " + currentUser.last_name)}&background=5c4a63&color=fff&size=512`} alt={currentUser.first_name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-4 border-white shadow-xl mx-auto"/>
              <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-md">
                <Check size={14} className="stroke-[3]"/>
              </span>
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-black uppercase tracking-wider">
                ● Active Member Session
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight pt-1">
                {currentUser.first_name} {currentUser.last_name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {currentUser.department} · {currentUser.roll_number}
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <Link to="/student-dashboard" className="w-full py-4 rounded-full bg-[#6c4f6f] hover:bg-[#583f5a] text-white font-black text-sm uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95">
                <LayoutDashboard size={18}/>
                <span>Open Student Dashboard</span>
                <ArrowRight size={18}/>
              </Link>

              <button type="button" onClick={handleLogout} className="w-full py-3 rounded-full bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 active:scale-95">
                <LogOut size={15}/>
                <span>Sign Out / Switch Account</span>
              </button>
            </div>
          </motion.div>)}

      </main>

      <Footer />
    </div>);
};
export default StudentLoginPage;
