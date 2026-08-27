import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Mail, ExternalLink, GraduationCap, Award, Search, LayoutGrid, Users, List, TrendingUp, BarChart3, Download, ChevronRight, Shield, History, Loader2, X, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip as ChartTooltip, Legend, } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, ChartTooltip, Legend);
const ROLE_HIERARCHY = [
    "Program Coordinator",
    "Program Co-ordinator",
    "Faculty Advisor",
    "Stu. Branch Counsellor",
    "Student Branch Counsellor",
    "Branch Counsellor",
    "Counsellor",
    "Chairperson",
    "Chair",
    "Vice-Chairperson",
    "Vice Chairperson",
    "Vice Chair",
    "Secretary",
    "Joint Secretary",
    "Activities Coordinator",
    "Joint Activity Coordinator",
    "Joint Activity Coordinators",
    "Treasurer",
    "Joint Treasurer",
    "Web Designer",
    "Webmaster",
    "Editor",
    "Technical Head",
    "Technical Lead",
    "Design Head",
    "Design Lead",
    "Content Head",
    "Executive Member",
    "PRO",
    "Public Relations",
];
const getRoleWeight = (role) => {
    const r = role.trim().toLowerCase();
    const index = ROLE_HIERARCHY.findIndex(h => r.includes(h.toLowerCase()));
    return index === -1 ? 999 : index;
};
// --- ANIMATION CONFIGS ---
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
    },
};
const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    },
};
// --- MEMBERSHIP DASHBOARD STAT CARD ---
const pct = (a, b) => b ? Math.round(((a - b) / b) * 100) : null;
const StatCard = ({ label, value, delta, refYear, icon: Icon }) => (<motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }} className="relative bg-gradient-to-br from-white via-slate-50/60 to-blue-50/30 border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-blue-500/35 transition-all overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl group-hover:bg-blue-500/15 transition-all pointer-events-none"/>
    <div className="flex items-center justify-between mb-2">
      <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black">{label}</p>
      {Icon && (<div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs group-hover:scale-110 transition-transform">
          <Icon size={16}/>
        </div>)}
    </div>
    <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100/80">
      {delta !== null && delta !== undefined ? (<>
          <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${delta >= 0 ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-rose-50 text-rose-700 border border-rose-200/60"}`}>
            <span>{delta >= 0 ? "▲" : "▼"}</span>
            <span>{Math.abs(delta)}%</span>
          </span>
          <span className="text-xs text-slate-400 font-semibold">vs {refYear}</span>
        </>) : (<span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold border border-slate-200/60">Historical Archive</span>)}
    </div>
  </motion.div>);
const TrendBars = ({ data, currentId }) => {
    const idx = data.findIndex((r) => r.id === currentId);
    const slice = data.slice(Math.max(0, idx - 3), idx + 1).reverse();
    const max = Math.max(...slice.map((r) => r.total_members), 1);
    return (<div className="flex items-end gap-1">
      <style>{slice.map((r) => `.tb-${currentId}-${r.id} { height: ${Math.round((r.total_members / max) * 18)}px; }`).join(' ')}</style>
      {slice.map((r) => (<div key={r.id} className={`w-1.5 rounded-full bg-gradient-to-t from-blue-600 to-sky-400 tb-${currentId}-${r.id} shadow-xs`}/>))}
    </div>);
};
const RankBadge = ({ rank }) => {
    const styles = {
        0: "bg-amber-100/90 text-amber-900 border-amber-300 shadow-amber-500/20",
        1: "bg-slate-200/90 text-slate-800 border-slate-300 shadow-slate-500/10",
        2: "bg-amber-700/10 text-amber-800 border-amber-600/30 shadow-amber-700/10",
    };
    return (<div className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-black shadow-xs ${styles[rank] ?? "bg-slate-100 text-slate-500 border-slate-200"}`}>
      {rank + 1}
    </div>);
};
// --- ADVISORY BOARD CARDS ---
const ExecutiveCard = ({ member }) => {
    const roleParts = member.current_role ? member.current_role.split(" - ") : ["Executive Leadership"];
    const primaryRole = roleParts[0];
    const secondaryRole = roleParts.slice(1).join(" - ");
    return (<motion.div variants={fadeUp} whileHover={{ y: -6 }} className="group relative bg-white border border-slate-200/90 rounded-3xl shadow-md hover:shadow-2xl hover:border-blue-500/40 transition-all duration-500 overflow-hidden flex flex-col md:flex-row h-full items-stretch">
      {/* Dynamic left glow line */}
      <div className="absolute top-0 bottom-0 left-0 w-2 bg-gradient-to-b from-blue-600 via-sky-500 to-indigo-600 hidden md:block"/>
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 md:hidden"/>

      <div className="relative w-full md:w-56 aspect-square md:aspect-auto shrink-0 bg-gradient-to-br from-slate-50 to-blue-50/40 overflow-hidden border-b md:border-b-0 md:border-r border-slate-150 flex items-center justify-center p-6">
        <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-700 ring-4 ring-white">
          <img src={member.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2563EB&color=fff&size=512`} alt={member.name} className="w-full h-full object-cover object-top"/>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-80"/>
          <div className="absolute bottom-2 left-2 right-2 flex justify-center">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur text-[10px] font-extrabold text-white uppercase tracking-wider border border-white/20">
              IEEE Faculty
            </span>
          </div>
        </div>
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"/>
      </div>

      <div className="p-8 flex flex-col justify-between flex-grow relative bg-white">
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-indigo-50/60 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"/>

        <div className="relative z-10">
          <div className="flex flex-wrap gap-2 items-center mb-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-black uppercase tracking-wider text-blue-700 shadow-xs">
              <Award size={13} className="text-blue-600 animate-pulse"/>
              {primaryRole}
            </span>
            {secondaryRole && (<span className="text-slate-600 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
                {secondaryRole}
              </span>)}
          </div>

          {member.linkedin_url ? (<a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-2xl font-black text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-2 group/link mb-2">
              {member.name}
              <ExternalLink size={17} className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-500"/>
            </a>) : (<h3 className="text-2xl font-black text-slate-900 mb-2">{member.name}</h3>)}

          <p className="text-slate-600 text-xs md:text-sm font-medium leading-relaxed max-w-xl mb-4 italic">
            "Providing academic mentorship, driving technological research, and steering the student branch toward exceptional milestones."
          </p>
        </div>

        <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs font-bold text-slate-600 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <MapPin size={13}/>
            </div>
            <span className="truncate">{member.college || "Sri Ramakrishna Engineering College"}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Mail size={13}/>
            </div>
            <a href={`mailto:${member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in`} className="hover:text-blue-600 transition-colors truncate font-semibold">
              {member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in
            </a>
          </div>
        </div>
      </div>
    </motion.div>);
};
const getSeniorMemberImage = (member) => {
    const dbUrl = member.image_url;
    if (dbUrl) {
        if (dbUrl.startsWith("http"))
            return dbUrl;
        const safePath = encodeURIComponent(dbUrl.trim());
        const { data } = supabase.storage.from("office_bearers").getPublicUrl(safePath);
        return data?.publicUrl;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=2563EB&color=fff&size=256`;
};
const AdvisoryCard = ({ member, isFeatured }) => {
    const roleParts = member.current_role ? member.current_role.split(" - ") : ["Senior Member"];
    const primaryRole = roleParts[0];
    const secondaryRole = roleParts.slice(1).join(" - ");
    return (<motion.div variants={fadeUp} whileHover={{ y: -5 }} className={`group relative bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-row overflow-hidden h-full items-center p-4 gap-4 ${isFeatured ? "ring-1 ring-blue-500/20 bg-gradient-to-br from-white via-white to-blue-50/20" : ""}`}>
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-600 to-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

      {/* Left side: picture */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 shadow-inner group-hover:scale-102 transition-transform">
        <img src={getSeniorMemberImage(member)} alt={member.name} className="w-full h-full object-cover object-top group-hover:scale-108 transition-transform duration-500"/>
      </div>

      {/* Right side: details */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="mb-2">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50/90 border border-blue-100 text-[9.5px] font-black uppercase tracking-wider text-blue-700 mb-1.5">
            {isFeatured ? (<Award size={11} className="text-blue-600 shrink-0"/>) : (<GraduationCap size={11} className="text-slate-600 shrink-0"/>)}
            <span className="truncate">{primaryRole}</span>
          </div>

          <div className="flex items-center gap-1.5">
            {member.linkedin_url ? (<a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[15px] font-black text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group/link truncate">
                <span className="truncate">{member.name}</span>
                <ExternalLink size={12} className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-500 shrink-0"/>
              </a>) : (<h3 className="text-[15px] font-black text-slate-900 truncate">{member.name}</h3>)}
          </div>
          {secondaryRole && (<p className="text-slate-500 text-[10px] font-extrabold mt-0.5 truncate uppercase tracking-wide">{secondaryRole}</p>)}
        </div>

        <div className="space-y-1 text-[11px] font-semibold text-slate-500 border-t border-slate-100 pt-2">
          <div className="flex items-center gap-1.5">
            <MapPin size={11} className="text-blue-500 shrink-0"/>
            <span className="truncate">{member.college || "Sri Ramakrishna Engineering College"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail size={11} className="text-blue-500 shrink-0"/>
            <a href={`mailto:${member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in`} className="hover:text-blue-600 transition-colors truncate">
              {member.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in
            </a>
          </div>
        </div>
      </div>
    </motion.div>);
};
// --- OFFICE BEARERS RENDERING UTILS ---
const formatRoleDisplay = (roleText) => {
    if (!roleText)
        return "Office Bearer";
    if (roleText.toLowerCase().includes("executive member joint")) {
        return (<>
        <span className="block">Executive Member</span>
        <span className="block mt-0.5 font-medium opacity-80 text-[9px] uppercase tracking-wider">Joint Activities Co-ordinator</span>
      </>);
    }
    return roleText;
};
const getAvatarFallback = (_id) => {
    return `https://ui-avatars.com/api/?name=IEEE+SREC&background=2563EB&color=fff&size=256`;
};
const getPersonImage = (person) => {
    const dbUrl = person.image_url || person.photo || person.photo_url;
    if (dbUrl) {
        if (dbUrl.startsWith("http"))
            return dbUrl;
        const safePath = encodeURIComponent(dbUrl.trim());
        const { data } = supabase.storage.from("office_bearers").getPublicUrl(safePath);
        return data?.publicUrl;
    }
    return getAvatarFallback(person.id);
};
const OfficeCard = ({ person }) => (<motion.div variants={fadeUp} whileHover={{ y: -4 }} className="group relative bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-500/35 transition-all duration-300 flex flex-row overflow-hidden h-full items-center p-4 gap-4 font-sans">
    <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>

    {/* Left side: picture */}
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200/80 shadow-inner">
      <img src={getPersonImage(person)} alt={person.name || "Member"} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={(e) => {
        e.currentTarget.src = getAvatarFallback(person.id);
    }}/>
    </div>

    {/* Right side: details */}
    <div className="flex-1 min-w-0 pr-1">
      <div className="mb-2">
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[9px] font-black uppercase tracking-wider text-blue-700 mb-1.5">
          <GraduationCap size={10} className="text-blue-600 shrink-0"/>
          <span className="truncate">{formatRoleDisplay(person.role)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {person.website || person.linkedin_url || person.linkedin || person.linkedin_profile ? (<a href={person.website || person.linkedin_url || person.linkedin || person.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-[15px] font-extrabold text-slate-900 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group/link truncate">
              <span className="truncate">{person.name || "Unnamed"}</span>
              <ExternalLink size={11} className="opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all text-blue-400 shrink-0"/>
            </a>) : (<h3 className="text-[15px] font-extrabold text-slate-900 truncate">{person.name || "Unnamed"}</h3>)}
        </div>
        {person.department && (<p className="text-slate-500 text-[10px] font-bold mt-0.5 truncate uppercase tracking-wide">{person.department}</p>)}
      </div>

      <div className="space-y-1 text-[11px] font-semibold text-slate-500 border-t border-slate-100 pt-2">
        <div className="flex items-center gap-1.5">
          <MapPin size={11} className="text-blue-500 shrink-0"/>
          <span className="truncate">Sri Ramakrishna Engineering College</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Mail size={11} className="text-blue-500 shrink-0"/>
          <a href={`mailto:${person.email || `${person.name?.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in`}`} className="hover:text-blue-600 transition-colors truncate">
            {person.email || `${person.name?.toLowerCase().replace(/[^a-z0-9]/g, "")}@srec.ac.in`}
          </a>
        </div>
      </div>
    </div>
  </motion.div>);
// --- MAIN TEAM PAGE COMPONENT ---
const TeamPage = () => {
    const CURRENT_YEAR = 2026;
    // --- DATA STATES ---
    const [seniorMembers, setSeniorMembers] = useState([]);
    const [officeBearers, setOfficeBearers] = useState([]);
    const [memberCounts, setMemberCounts] = useState([]);
    // Loading & Error States
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");
    // Search & Filter States
    const [seniorSearch, setSeniorSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState("tiers");
    const [selectedYear, setSelectedYear] = useState("all");
    const [analyticsSearch, setAnalyticsSearch] = useState("");
    const [sortField, setSortField] = useState("year");
    const [sortAsc, setSortAsc] = useState(false);
    const [selectedPopupYear, setSelectedPopupYear] = useState(null);
    const [modalMembers, setModalMembers] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    // Memos for popup modal details
    const staffMembers = useMemo(() => {
        return modalMembers.filter((m) => m.member_type?.toLowerCase() === "staff" || m.member_type?.toLowerCase() === "professional");
    }, [modalMembers]);
    const studentMembers = useMemo(() => {
        return modalMembers.filter((m) => m.member_type?.toLowerCase() === "student" || m.member_type?.toLowerCase() === "student member" || m.member_type?.toLowerCase() === "student members");
    }, [modalMembers]);
    // Fetch yearly member directory from Supabase on-demand when year is clicked
    useEffect(() => {
        if (selectedPopupYear === null) {
            setModalMembers([]);
            return;
        }
        const fetchYearMembers = async () => {
            setModalLoading(true);
            try {
                const { data, error } = await supabase
                    .from("ieee_member_directory")
                    .select("*")
                    .eq("year", selectedPopupYear)
                    .order("s_no", { ascending: true });
                if (data && data.length > 0) {
                    setModalMembers(data);
                }
                else if (selectedPopupYear === CURRENT_YEAR) {
                    // Fallback to active memory states for CURRENT_YEAR
                    const bearersList = officeBearers.map((b, idx) => {
                        const isStaff = b.role?.toLowerCase().includes("counsellor") ||
                            b.role?.toLowerCase().includes("counselor") ||
                            b.role?.toLowerCase().includes("advisor");
                        return {
                            id: `bearer-${b.id || idx}`,
                            name: b.name,
                            designation_course: b.role ? `${b.role}${b.department ? ` (${b.department})` : ""}` : (b.department || ""),
                            member_type: isStaff ? "Staff" : "Student",
                            year: CURRENT_YEAR
                        };
                    });
                    const combined = [...bearersList].map((item, idx) => ({
                        ...item,
                        s_no: idx + 1
                    }));
                    setModalMembers(combined);
                }
                else {
                    setModalMembers([]);
                }
            }
            catch (err) {
                console.error("Error fetching year members:", err);
            }
            finally {
                setModalLoading(false);
            }
        };
        fetchYearMembers();
    }, [selectedPopupYear, officeBearers]);
    // --- SUPABASE DATA FETCH ---
    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            try {
                const [seniorsRes, bearersRes, countsRes] = await Promise.all([
                    supabase.from("senior_members").select("*").order("s_no", { ascending: true }),
                    supabase.from("new_office_bearers").select("*").order("year", { ascending: false }).order("id", { ascending: true }),
                    supabase.from("member_counts").select("*").order("year", { ascending: false })
                ]);
                if (seniorsRes.data)
                    setSeniorMembers(seniorsRes.data);
                if (bearersRes.data)
                    setOfficeBearers(bearersRes.data);
                if (countsRes.data)
                    setMemberCounts(countsRes.data);
                if (countsRes.error)
                    setErrorMsg(countsRes.error.message);
            }
            catch (err) {
                setErrorMsg(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        loadAllData();
    }, []);
    // --- ADVISORY BOARD MEMOS ---
    const filteredSeniors = useMemo(() => {
        const term = seniorSearch.trim().toLowerCase();
        let result = seniorMembers.filter(m => !term ||
            m.name.toLowerCase().includes(term) ||
            (m.current_role || "").toLowerCase().includes(term) ||
            (m.college || "").toLowerCase().includes(term));
        if (selectedCategory !== "all") {
            result = result.filter(m => {
                const role = (m.current_role || "").toLowerCase();
                if (selectedCategory === "leadership") {
                    return role.includes("counsellor") || role.includes("counselor");
                }
                else if (selectedCategory === "advisory") {
                    return role.includes("advisor") || role.includes("advisory");
                }
                else {
                    return !role.includes("counsellor") && !role.includes("counselor") && !role.includes("advisor") && !role.includes("advisory");
                }
            });
        }
        return result;
    }, [seniorMembers, seniorSearch, selectedCategory]);
    const groupedSeniors = useMemo(() => {
        const leadership = [];
        const advisors = [];
        const others = [];
        filteredSeniors.forEach(m => {
            const role = (m.current_role || "").toLowerCase();
            if (role.includes("counsellor") || role.includes("counselor")) {
                leadership.push(m);
            }
            else if (role.includes("advisor") || role.includes("advisory")) {
                advisors.push(m);
            }
            else {
                others.push(m);
            }
        });
        return { leadership, advisors, others };
    }, [filteredSeniors]);
    // --- MEMBERSHIP ANALYTICS MEMOS ---
    const years = useMemo(() => [...new Set(memberCounts.map((r) => r.year))].sort((a, b) => b - a), [memberCounts]);
    const yearsAsc = useMemo(() => [...years].reverse(), [years]);
    const latestCount = memberCounts[0];
    const prevCount = memberCounts[1];
    const maxTotal = Math.max(...memberCounts.map((r) => r.total_members), 1);
    const filteredMembers = useMemo(() => {
        let r = memberCounts;
        if (selectedYear !== "all")
            r = r.filter((x) => x.year === Number(selectedYear));
        if (analyticsSearch)
            r = r.filter((x) => String(x.year).includes(analyticsSearch));
        return [...r].sort((a, b) => sortAsc ? a[sortField] - b[sortField] : b[sortField] - a[sortField]);
    }, [memberCounts, selectedYear, analyticsSearch, sortField, sortAsc]);
    const handleSort = (field) => {
        if (sortField === field)
            setSortAsc((p) => !p);
        else {
            setSortField(field);
            setSortAsc(false);
        }
    };
    const exportCSV = () => {
        const csv = "Year,Professional Members,Student Members,Total Members\n"
            + filteredMembers.map((r) => `${r.year},${r.professional_members},${r.student_members},${r.total_members}`).join("\n");
        const a = document.createElement("a");
        a.href = "data:text/csv," + encodeURIComponent(csv);
        a.download = "ieee_members.csv";
        a.click();
    };
    const sortedByTotal = useMemo(() => [...filteredMembers].sort((a, b) => b.total_members - a.total_members), [filteredMembers]);
    const barData = {
        labels: [...memberCounts].reverse().map((r) => r.year),
        datasets: [
            { label: "Professional", data: [...memberCounts].reverse().map((r) => r.professional_members), backgroundColor: "#185FA5", borderRadius: 4 },
            { label: "Student", data: [...memberCounts].reverse().map((r) => r.student_members), backgroundColor: "#1D9E75", borderRadius: 4 },
        ],
    };
    const donutData = latestCount ? {
        labels: ["Professional", "Student"],
        datasets: [{ data: [latestCount.professional_members, latestCount.student_members], backgroundColor: ["#185FA5", "#1D9E75"], borderWidth: 0 }],
    } : null;
    return (<div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
      {/* Ambient background designs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2"/>
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-400/5 rounded-full blur-[150px] pointer-events-none"/>
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[130px] pointer-events-none"/>
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none"/>

      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-12 md:pt-14 md:pb-16 overflow-hidden bg-gradient-to-b from-blue-900/90 via-slate-900 to-slate-950 text-white border-b border-slate-800">
        {/* Glowing mesh background inside hero */}
        <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none"/>
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-indigo-600/30 rounded-full blur-[120px] pointer-events-none"/>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-cyan-400/30 backdrop-blur-md text-xs font-black uppercase tracking-widest text-cyan-300 shadow-lg mb-4">
            <Users size={14} className="text-cyan-400 animate-pulse"/>
            IEEE SREC Student Branch
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 text-white">
            Team &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400">Community Hub</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed font-normal mb-8">
            Explore our distinguished faculty advisors, student office bearers, and multi-year membership growth metrics powering Sri Ramakrishna Engineering College's IEEE Student Branch.
          </motion.p>

          {/* Quick Stats Pill Row inside Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-3xl">
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3.5 backdrop-blur-md flex flex-col items-center">
              <span className="text-2xl font-black text-cyan-400">{seniorMembers.length || 8}+</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Faculty Mentors</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3.5 backdrop-blur-md flex flex-col items-center">
              <span className="text-2xl font-black text-sky-400">{latestCount?.total_members || 500}+</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Active Members</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3.5 backdrop-blur-md flex flex-col items-center">
              <span className="text-2xl font-black text-indigo-400">{officeBearers.length || 30}+</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Office Bearers</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-3.5 backdrop-blur-md flex flex-col items-center">
              <span className="text-2xl font-black text-emerald-400">{memberCounts.length || 5}+</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Years Tracked</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STICKY QUICK SECTION NAVIGATOR TOOLBAR */}
      <div className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/90 shadow-lg py-3 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2.5 shrink-0">
            <a href="#advisory-board" className="px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white border border-cyan-400/30 shadow-[0_0_16px_rgba(0,170,255,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <GraduationCap size={15}/>
              Senior Advisors
            </a>
            <a href="#office-bearers" className="px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-slate-800/80 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:text-cyan-400 hover:border-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <Shield size={15}/>
              Office Bearers
            </a>
            <a href="#membership-analytics" className="px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider bg-slate-800/80 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:text-cyan-400 hover:border-cyan-500/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
              <BarChart3 size={15}/>
              Membership Analytics
            </a>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 text-xs font-bold text-slate-400 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shadow-[0_0_10px_rgba(52,211,153,0.8)]"/>
            <span className="text-slate-300">Active Term 2026</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12 relative z-10 flex-grow w-full space-y-16">
        {loading ? (<div className="py-24 flex flex-col items-center">
            <Loader2 className="w-10 h-10 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin shadow-md"/>
            <p className="mt-4 text-slate-500 text-sm font-medium tracking-wide">Fetching Team Data...</p>
          </div>) : (<>
            {/* SECTION 1: ADVISORY BOARD */}
            <section id="advisory-board" className="space-y-8 scroll-mt-24">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/90 pb-5">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2.5 tracking-tight">
                    <GraduationCap className="text-blue-600" size={26}/> Senior Members
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-semibold">Distinguished faculty mentors guiding SREC IEEE Student Branch</p>
                </div>

                <div className="flex flex-wrap gap-2.5 items-center">
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14}/>
                    <input type="text" placeholder="Search advisors..." className="pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-xs font-bold placeholder-slate-400 w-48 shadow-2xs transition-all" value={seniorSearch} onChange={(e) => setSeniorSearch(e.target.value)}/>
                  </div>

                  <select aria-label="Category Filter" className="bg-white border border-slate-200 rounded-2xl py-2 px-3.5 text-xs font-extrabold text-slate-700 outline-none cursor-pointer shadow-2xs hover:border-blue-300 transition-all" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="all">All Advisors</option>
                    <option value="leadership">Leadership</option>
                    <option value="advisory">Advisors</option>
                    <option value="others">Faculty Board</option>
                  </select>

                  <div className="flex bg-slate-100 border border-slate-200/80 p-1 rounded-2xl shadow-inner">
                    {[{ id: "tiers", icon: Users }, { id: "grid", icon: LayoutGrid }, { id: "directory", icon: List }].map(tab => (<button key={tab.id} onClick={() => setViewMode(tab.id)} className={`p-2 rounded-xl transition-all ${viewMode === tab.id ? "bg-white text-blue-600 shadow-sm border border-slate-200/60 font-black" : "text-slate-500 hover:text-slate-900"}`} title={`${tab.id.toUpperCase()} View`}>
                        <tab.icon size={14}/>
                      </button>))}
                  </div>
                </div>
              </div>

              {filteredSeniors.length === 0 ? (<p className="text-center text-slate-400 py-10 font-semibold">No Advisory Members found matching search criteria.</p>) : (<div>
                  {viewMode === "tiers" && (<div className="space-y-10">
                      {groupedSeniors.leadership.length > 0 && (<div className="space-y-4">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Executive Leadership</h3>
                          <div className="grid grid-cols-1 gap-6 animate-fade-in">
                            {groupedSeniors.leadership.map(member => (<ExecutiveCard key={member.id} member={member}/>))}
                          </div>
                        </div>)}
                      {groupedSeniors.advisors.length > 0 && (<div className="space-y-4">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Advisory Council</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupedSeniors.advisors.map(member => (<AdvisoryCard key={member.id} member={member} isFeatured={true}/>))}
                          </div>
                        </div>)}
                      {groupedSeniors.others.length > 0 && (<div className="space-y-4">
                          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Faculty Board</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groupedSeniors.others.map(member => (<AdvisoryCard key={member.id} member={member} isFeatured={false}/>))}
                          </div>
                        </div>)}
                    </div>)}

                  {viewMode === "grid" && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSeniors.map(member => {
                        const role = (member.current_role || "").toLowerCase();
                        return (<AdvisoryCard key={member.id} member={member} isFeatured={role.includes("advisor") || role.includes("counselor")}/>);
                    })}
                    </div>)}

                  {viewMode === "directory" && (<div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                      <table className="w-full border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase border-b border-slate-200">
                          <tr>
                            <th className="px-6 py-4 text-left">Advisor Details</th>
                            <th className="px-6 py-4 text-left">Designation</th>
                            <th className="px-6 py-4 text-left">Institution</th>
                            <th className="px-6 py-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSeniors.map(member => (<tr key={member.id} className="border-b hover:bg-slate-50/50 transition">
                              <td className="px-6 py-4 font-semibold text-slate-900">{member.name}</td>
                              <td className="px-6 py-4 text-xs font-bold text-blue-750 uppercase">{member.current_role}</td>
                              <td className="px-6 py-4 text-xs font-medium text-slate-500">{member.college || "Sri Ramakrishna Engineering College"}</td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex gap-2 justify-center">
                                  {member.linkedin_url && (<a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-2xs">
                                      <ExternalLink size={14}/>
                                    </a>)}
                                </div>
                              </td>
                            </tr>))}
                        </tbody>
                      </table>
                    </div>)}
                </div>)}
            </section>

            {/* SECTION 2: OFFICE BEARERS — DYNAMIC SHOWCASE LAYOUT */}
            <section id="office-bearers" className="space-y-8 scroll-mt-24">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative rounded-3xl overflow-hidden shadow-xl" style={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #f1f5f9 100%)",
                border: "1px solid rgba(226, 232, 240, 0.9)",
            }}>
                {/* Animated circuit background mesh */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.4]">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="circuit-grid-light" width="60" height="60" patternUnits="userSpaceOnUse">
                        <path d="M0 30 H20 V10 H40 V30 H60" stroke="#cbd5e1" strokeWidth="0.8" fill="none"/>
                        <circle cx="20" cy="10" r="2" fill="#94a3b8"/>
                        <circle cx="40" cy="30" r="2" fill="#94a3b8"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#circuit-grid-light)"/>
                  </svg>
                </div>

                {/* Glowing ambient light orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none"/>
                <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-sky-400/10 blur-[90px] pointer-events-none"/>

                <div className="relative z-10 p-8 md:p-12 space-y-8">
                  {/* Banner Header */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 mb-3 shadow-2xs">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"/>
                        IEEE SREC Committee 2026
                      </div>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight" style={{ fontFamily: "'Space Grotesk', 'Outfit', sans-serif" }}>
                        MEET OUR <br className="hidden sm:block"/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-sky-600 to-indigo-700">
                          OFFICE BEARERS
                        </span>
                      </h2>
                      <p className="text-slate-600 text-sm max-w-lg mt-3 leading-relaxed font-semibold">
                        Meet the student leaders guiding events, technical research, professional development, and community impact at IEEE SREC Student Branch.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <Link to="/office-bearers" className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider text-white transition-all hover:scale-105 active:scale-95 shadow-[0_0_24px_rgba(2,132,199,0.35)] overflow-hidden" style={{
                background: "linear-gradient(135deg, #00629B 0%, #0088cc 50%, #0284c7 100%)",
            }}>
                        <Shield size={16} className="text-cyan-200"/>
                        View Full Committee
                        <ChevronRight size={16} className="group-hover:translate-x-1.5 transition-transform"/>
                      </Link>

                      <Link to="/past-bearers" className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-700 bg-white hover:bg-slate-100 border border-slate-200/90 hover:text-blue-700 transition-all shadow-2xs hover:scale-105 active:scale-95">
                        <History size={15}/>
                        Archive
                      </Link>
                    </div>
                  </div>

                  {/* Featured Bearers Card Grid with Real Database Photos */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-4 border-t border-slate-200/90">
                    {officeBearers.slice(0, 6).length > 0 ? (officeBearers.slice(0, 6).map((bearer) => (<motion.div key={bearer.id} whileHover={{ y: -5, scale: 1.03 }} className="bg-white/90 border border-slate-200/90 rounded-2xl p-4 flex flex-col items-center text-center group hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 shadow-sm">
                          <div className="relative w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 border-2 border-blue-500/30 group-hover:border-blue-600 transition-colors shadow-md">
                            <img src={getPersonImage(bearer)} alt={bearer.name || "Office Bearer"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onError={(e) => {
                    e.currentTarget.src = getAvatarFallback(bearer.id);
                }}/>
                          </div>
                          <h4 className="text-xs font-black text-slate-900 truncate w-full group-hover:text-blue-700 transition-colors">
                            {bearer.name || "Officer"}
                          </h4>
                          <p className="text-[10px] text-blue-700 font-extrabold uppercase tracking-wide truncate w-full mt-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                            {bearer.role || "Bearer"}
                          </p>
                        </motion.div>))) : (Array.from({ length: 6 }).map((_, i) => (<div key={i} className="bg-white/90 border border-slate-200/90 rounded-2xl p-4 flex flex-col items-center text-center shadow-sm">
                          <div className="w-[72px] h-[72px] rounded-full bg-slate-100 overflow-hidden mb-3 border-2 border-slate-200 shadow-inner">
                            <img src={`https://ui-avatars.com/api/?name=IEEE+Bearer+${i + 1}&background=00629B&color=fff&size=128`} alt="" className="w-full h-full object-cover"/>
                          </div>
                          <span className="text-xs font-black text-slate-900">Office Bearer</span>
                          <span className="text-[10px] text-blue-700 font-extrabold uppercase tracking-wide mt-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">2026 Term</span>
                        </div>)))}
                  </div>
                </div>
              </motion.div>
            </section>

            {/* SECTION 4: MEMBERSHIP ANALYTICS */}
            <section id="membership-analytics" className="space-y-8 scroll-mt-24">
              <div className="border-b border-slate-200/90 pb-5">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 flex items-center gap-2.5 tracking-tight">
                  <BarChart3 className="text-blue-600" size={26}/> Membership Analytics
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-semibold">IEEE Professional &amp; Student member analytics and historical growth</p>
              </div>

              {errorMsg && <p className="text-red-650 text-sm">Error: {errorMsg}</p>}

              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard label="Total members (latest)" value={latestCount?.total_members ?? "—"} delta={pct(latestCount?.total_members, prevCount?.total_members)} refYear={prevCount?.year} icon={Users}/>
                <StatCard label="Professional members" value={latestCount?.professional_members ?? "—"} delta={pct(latestCount?.professional_members, prevCount?.professional_members)} refYear={prevCount?.year} icon={Award}/>
                <StatCard label="Student members" value={latestCount?.student_members ?? "—"} delta={pct(latestCount?.student_members, prevCount?.student_members)} refYear={prevCount?.year} icon={GraduationCap}/>
                <StatCard label="Years tracked" value={memberCounts.length} icon={History}/>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div>
                      <p className="text-base font-black text-slate-900 flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-600"/>
                        Membership Growth Trend
                      </p>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Professional vs Student distribution across tracking years</p>
                    </div>
                  </div>
                  <div className="h-64 relative flex items-center justify-center">
                    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } } } }}/>
                  </div>
                  <div className="flex gap-5 mt-4 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                      <span className="w-3 h-3 rounded-md inline-block bg-[#185FA5] shadow-xs"/>Professional Members
                    </span>
                    <span className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                      <span className="w-3 h-3 rounded-md inline-block bg-[#1D9E75] shadow-xs"/>Student Members
                    </span>
                  </div>
                </div>

                <div className="md:col-span-2 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <div>
                      <p className="text-base font-black text-slate-900 flex items-center gap-2">
                        <Users size={18} className="text-teal-600"/>
                        Member Split (Latest Year)
                      </p>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Professional vs student ratio breakdown</p>
                    </div>
                  </div>
                  <div className="h-64 relative flex items-center justify-center">
                    {donutData && <Doughnut data={donutData} options={{ cutout: "68%", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}/>}
                  </div>
                  <div className="flex flex-col gap-2 mt-4 pt-3 border-t border-slate-100">
                    {donutData?.labels?.map((l, i) => (<span key={String(l)} className="flex items-center justify-between text-xs text-slate-700 font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                        <span className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-md inline-block ${i === 0 ? "bg-[#185FA5]" : "bg-[#1D9E75]"}`}/>
                          {String(l)}
                        </span>
                        <span className="text-slate-900 font-black">
                          {donutData.datasets[0].data[i]} ({Math.round((donutData.datasets[0].data[i] / (latestCount?.total_members || 1)) * 100)}%)
                        </span>
                      </span>))}
                  </div>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5 border-b border-slate-200 bg-slate-50/60">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Year Filter:</span>
                    <select aria-label="Filter by year" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="text-xs font-extrabold text-slate-700 border border-slate-200 rounded-2xl px-3.5 py-2 bg-white outline-none focus:border-blue-500 transition shadow-2xs hover:border-blue-300">
                      <option value="all">All Years</option>
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <input value={analyticsSearch} onChange={(e) => setAnalyticsSearch(e.target.value)} placeholder="Search year…" className="text-xs font-bold border border-slate-200 rounded-2xl px-3.5 py-2 w-40 outline-none focus:border-blue-500 transition shadow-2xs"/>
                  </div>
                  <button onClick={exportCSV} className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white px-5 py-2.5 rounded-2xl transition-all flex items-center gap-2 shadow-[0_0_16px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95">
                    <Download size={15}/>
                    Export CSV
                  </button>
                </div>

                {filteredMembers.length === 0 ? (<p className="text-center text-gray-400 text-sm py-10">No records found.</p>) : (<>
                    <style>
                      {filteredMembers.map(r => {
                    const p = Math.round((r.professional_members / r.total_members) * 100);
                    const t = Math.round((r.total_members / maxTotal) * 100);
                    return `.bar-p-${r.id}{width:${p}%} .bar-s-${r.id}{width:${100 - p}%} .bar-t-${r.id}{width:${t}%}`;
                }).join(' ')}
                    </style>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-700 text-xs font-extrabold uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-4 text-left w-20">Rank</th>
                            {["year", "professional_members", "student_members", "total_members"].map((f) => (<th key={f} className="px-5 py-4 text-left cursor-pointer hover:bg-slate-100 transition-colors select-none" onClick={() => handleSort(f)}>
                                <span className="flex items-center gap-1">
                                  {f === "year" ? "Year" : f === "professional_members" ? "Professional" : f === "student_members" ? "Student" : "Total"}
                                  <span className="text-[10px] text-slate-450 font-normal">
                                    {sortField === f ? (sortAsc ? " ▲" : " ▼") : " ⇅"}
                                  </span>
                                </span>
                              </th>))}
                            <th className="px-5 py-4 text-left">Share</th>
                            <th className="px-5 py-4 text-left">Trend</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredMembers.map((row, index) => {
                    const profPct = Math.round((row.professional_members / row.total_members) * 100);
                    return (<tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-5 py-4"><RankBadge rank={index}/></td>
                                <td className="px-5 py-4">
                                  <button onClick={() => setSelectedPopupYear(row.year)} className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black px-4 py-1.5 rounded-2xl shadow-[0_0_12px_rgba(37,99,235,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5" title="Click to view office bearers and committee directory">
                                    <span>{row.year}</span>
                                    <span className="text-[10px] text-cyan-200">ℹ️</span>
                                  </button>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-800 w-7">{row.professional_members}</span>
                                    <div className="flex-1 h-2 bg-slate-105 rounded-full overflow-hidden min-w-[60px] md:min-w-[100px]">
                                      <div className={`h-full bg-blue-600 rounded-full bar-p-${row.id}`}/>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-semibold">{profPct}%</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-slate-800 w-7">{row.student_members}</span>
                                    <div className="flex-1 h-2 bg-slate-105 rounded-full overflow-hidden min-w-[60px] md:min-w-[100px]">
                                      <div className={`h-full bg-teal-500 rounded-full bar-s-${row.id}`}/>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-semibold">{100 - profPct}%</span>
                                  </div>
                                </td>
                                <td className="px-5 py-4 font-extrabold text-blue-800 text-sm">{row.total_members}</td>
                                <td className="px-5 py-4">
                                  <div className="w-20 h-2 bg-slate-105 rounded-full overflow-hidden">
                                    <div className={`h-full bg-indigo-400 rounded-full bar-t-${row.id}`}/>
                                  </div>
                                </td>
                                <td className="px-5 py-4"><TrendBars data={memberCounts} currentId={row.id}/></td>
                              </tr>);
                })}
                        </tbody>
                      </table>
                    </div>
                  </>)}
              </div>
            </section>
          </>)}
      </main>

      <Footer />

      {/* Year Details Modal */}
      <AnimatePresence>
        {selectedPopupYear !== null && (<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 15 }} className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-slate-200/80">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/80 bg-slate-50/50">
                <div className="flex items-center gap-3.5">
                  {/* Previous Year Button */}
                  <button disabled={selectedPopupYear === null || yearsAsc.indexOf(selectedPopupYear) <= 0} onClick={() => {
                const idx = selectedPopupYear !== null ? yearsAsc.indexOf(selectedPopupYear) : -1;
                if (idx > 0)
                    setSelectedPopupYear(yearsAsc[idx - 1]);
            }} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center" title="Previous Year">
                    <ChevronLeft size={16}/>
                  </button>

                  <div>
                    <h3 className="text-lg font-black text-slate-900">
                      IEEE Members Directory - Year {selectedPopupYear}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Official record of Staff and Student Members
                    </p>
                  </div>

                  {/* Next Year Button */}
                  <button disabled={selectedPopupYear === null || yearsAsc.indexOf(selectedPopupYear) >= yearsAsc.length - 1} onClick={() => {
                const idx = selectedPopupYear !== null ? yearsAsc.indexOf(selectedPopupYear) : -1;
                if (idx !== -1 && idx < yearsAsc.length - 1)
                    setSelectedPopupYear(yearsAsc[idx + 1]);
            }} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-25 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center" title="Next Year">
                    <ChevronRight size={16}/>
                  </button>
                </div>
                <button onClick={() => setSelectedPopupYear(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Close modal">
                  <X size={20}/>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 flex-grow">
                {modalLoading ? (<div className="py-12 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin"/>
                    <p className="mt-2 text-slate-500 text-xs font-semibold">Loading members directory...</p>
                  </div>) : modalMembers.length === 0 ? (<div className="py-12 text-center text-slate-500">
                    <Users className="w-12 h-12 mx-auto text-slate-300 mb-2"/>
                    <p className="text-sm font-semibold">No member records found for this year.</p>
                    <p className="text-xs text-gray-400 mt-1">Please populate the Supabase table <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono">ieee_member_directory</code>.</p>
                  </div>) : (<div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full border-collapse">
                      <thead className="bg-[#0C447C] text-white text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left w-20">S.No.</th>
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Designation / Course</th>
                          <th className="px-4 py-3 text-left w-24">Year</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs text-slate-800">
                        {/* Staff Category */}
                        {staffMembers.length > 0 && (<>
                            <tr className="bg-slate-50 border-y border-slate-200">
                              <td colSpan={4} className="px-4 py-2.5 text-slate-800 font-bold uppercase tracking-wider text-[11px] text-center bg-slate-100/80">
                                Staff
                              </td>
                            </tr>
                            {staffMembers.map((m, index) => (<tr key={m.id || index} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                                <td className="px-4 py-2.5 font-medium text-slate-500">{m.s_no || index + 1}.</td>
                                <td className="px-4 py-2.5 font-bold text-slate-900">{m.name}</td>
                                <td className="px-4 py-2.5 text-slate-600 font-medium">{m.designation_course}</td>
                                <td className="px-4 py-2.5 text-slate-500 font-medium">{m.year}</td>
                              </tr>))}
                          </>)}

                        {/* Student Category */}
                        {studentMembers.length > 0 && (<>
                            <tr className="bg-slate-50 border-y border-slate-200">
                              <td colSpan={4} className="px-4 py-2.5 text-slate-800 font-bold uppercase tracking-wider text-[11px] text-center bg-slate-100/80">
                                Student Members
                              </td>
                            </tr>
                            {studentMembers.map((m, index) => (<tr key={m.id || index} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                                <td className="px-4 py-2.5 font-medium text-slate-500">{m.s_no || (staffMembers.length + index + 1)}.</td>
                                <td className="px-4 py-2.5 font-bold text-slate-900">{m.name}</td>
                                <td className="px-4 py-2.5 text-slate-600 font-medium">{m.designation_course}</td>
                                <td className="px-4 py-2.5 text-slate-500 font-medium">{m.year}</td>
                              </tr>))}
                          </>)}
                      </tbody>
                    </table>
                  </div>)}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-slate-150 bg-slate-50 flex justify-end">
                <button onClick={() => setSelectedPopupYear(null)} className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition shadow-sm hover:shadow">
                  Close Directory
                </button>
              </div>
            </motion.div>
          </div>)}
      </AnimatePresence>
    </div>);
};
export default TeamPage;
