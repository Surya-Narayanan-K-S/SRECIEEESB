/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Crown, ArrowRight, ExternalLink, ShieldCheck, UserCheck, Award, Loader2, X, Search, Zap, GraduationCap, Briefcase, Linkedin, Sparkles, CheckCircle2, ChevronDown, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
export const getSocietyKey = (name) => {
    const lower = (name || "").toLowerCase().trim();
    if (lower.includes("pels") || lower.includes("power electronics"))
        return "pels";
    if (lower.includes("comsoc") || lower.includes("communication"))
        return "comsoc";
    if (lower.includes("embs") || lower.includes("medicine") || lower.includes("biology"))
        return "embs";
    if (lower.includes("cis") || lower.includes("computational"))
        return "cis";
    if (lower.includes("cas") || lower.includes("circuits"))
        return "cas";
    if (lower.includes("ims") || lower.includes("instrumentation") || lower.includes("measurement") || /\bims?\b/i.test(lower))
        return "im";
    if (lower.includes("wie") || lower.includes("women"))
        return "wie";
    if (lower.includes("computer") || /\bcs\b/i.test(lower))
        return "cs";
    if (lower.includes("student branch") || lower.includes("srec") || lower === "sb")
        return "srec";
    return "srec";
};
const SOCIETY_THEMES = {
    wie: {
        name: "Women in Engineering",
        code: "WIE",
        primary: "#7e22ce",
        primaryHover: "#6b21a8",
        accent: "#c026d3",
        gradient: "from-purple-900 via-purple-700 to-fuchsia-600",
        softBg: "bg-purple-50/60",
        borderLight: "border-purple-200",
        badgeBg: "bg-purple-100 text-purple-900 border-purple-300",
        ringColor: "ring-purple-600",
        glow: "rgba(168,85,247,0.35)",
    },
    pels: {
        name: "Power Electronics Society",
        code: "PELS",
        primary: "#008542",
        primaryHover: "#006d36",
        accent: "#10b981",
        gradient: "from-emerald-900 via-green-700 to-teal-600",
        softBg: "bg-emerald-50/60",
        borderLight: "border-emerald-200",
        badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
        ringColor: "ring-emerald-600",
        glow: "rgba(16,185,129,0.35)",
    },
    cs: {
        name: "Computer Society",
        code: "CS",
        primary: "#ea580c",
        primaryHover: "#c2410c",
        accent: "#f97316",
        gradient: "from-orange-950 via-orange-700 to-amber-600",
        softBg: "bg-orange-50/60",
        borderLight: "border-orange-200",
        badgeBg: "bg-orange-100 text-orange-900 border-orange-300",
        ringColor: "ring-orange-600",
        glow: "rgba(249,115,22,0.35)",
    },
    cis: {
        name: "Computational Intelligence Society",
        code: "CIS",
        primary: "#6366f1",
        primaryHover: "#4f46e5",
        accent: "#8b5cf6",
        gradient: "from-indigo-950 via-indigo-700 to-purple-600",
        softBg: "bg-indigo-50/60",
        borderLight: "border-indigo-200",
        badgeBg: "bg-indigo-100 text-indigo-900 border-indigo-300",
        ringColor: "ring-indigo-600",
        glow: "rgba(99,102,241,0.35)",
    },
    comsoc: {
        name: "Communications Society",
        code: "ComSoc",
        primary: "#0284c7",
        primaryHover: "#0369a1",
        accent: "#06b6d4",
        gradient: "from-sky-950 via-sky-700 to-cyan-600",
        softBg: "bg-sky-50/60",
        borderLight: "border-sky-200",
        badgeBg: "bg-sky-100 text-sky-900 border-sky-300",
        ringColor: "ring-sky-600",
        glow: "rgba(14,165,233,0.35)",
    },
    embs: {
        name: "Engineering in Medicine & Biology",
        code: "EMBS",
        primary: "#059669",
        primaryHover: "#047857",
        accent: "#14b8a6",
        gradient: "from-teal-950 via-teal-700 to-emerald-600",
        softBg: "bg-teal-50/60",
        borderLight: "border-teal-200",
        badgeBg: "bg-teal-100 text-teal-900 border-teal-300",
        ringColor: "ring-teal-600",
        glow: "rgba(20,184,166,0.35)",
    },
    im: {
        name: "Instrumentation & Measurement",
        code: "IMS",
        primary: "#e11d48",
        primaryHover: "#be123c",
        accent: "#f43f5e",
        gradient: "from-rose-950 via-rose-700 to-pink-600",
        softBg: "bg-rose-50/60",
        borderLight: "border-rose-200",
        badgeBg: "bg-rose-100 text-rose-900 border-rose-300",
        ringColor: "ring-rose-600",
        glow: "rgba(244,63,94,0.35)",
    },
    cas: {
        name: "Circuits & Systems Society",
        code: "CAS",
        primary: "#1d4ed8",
        primaryHover: "#1e40af",
        accent: "#3b82f6",
        gradient: "from-blue-950 via-blue-700 to-indigo-600",
        softBg: "bg-blue-50/60",
        borderLight: "border-blue-200",
        badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
        ringColor: "ring-blue-600",
        glow: "rgba(59,130,246,0.35)",
    },
    srec: {
        name: "IEEE SREC Student Branch",
        code: "IEEE SB",
        primary: "#002855",
        primaryHover: "#001c3d",
        accent: "#00629b",
        gradient: "from-slate-950 via-[#002855] to-blue-700",
        softBg: "bg-blue-50/60",
        borderLight: "border-blue-200",
        badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
        ringColor: "ring-[#00629b]",
        glow: "rgba(0,98,155,0.35)",
    },
};
export const resolveImageUrl = (url) => {
    if (!url)
        return null;
    const raw = url.trim();
    if (!raw)
        return null;
    // Auto-convert Google Drive links to direct high-res image format
    if (raw.includes("drive.google.com")) {
        const idMatch = raw.match(/id=([a-zA-Z0-9_-]+)/) || raw.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (idMatch && idMatch[1]) {
            return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
        }
    }
    if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:") || raw.startsWith("blob:")) {
        return raw;
    }
    // Clean path
    const safePath = raw.startsWith("/") ? raw.slice(1) : raw;
    // If path starts with a known bucket prefix, query that bucket directly
    const knownBuckets = [
        "office_bearers",
        "society_members",
        "leadership_portraits",
        "member_profiles",
        "member-avatars",
        "avatars",
        "photos",
        "societies",
        "activities",
        "gallery",
    ];
    for (const bucket of knownBuckets) {
        if (safePath.startsWith(`${bucket}/`)) {
            const subPath = safePath.slice(bucket.length + 1);
            const { data } = supabase.storage.from(bucket).getPublicUrl(subPath);
            if (data?.publicUrl)
                return data.publicUrl;
        }
    }
    // Default: resolve from office_bearers storage bucket
    const { data } = supabase.storage.from("office_bearers").getPublicUrl(safePath);
    return data.publicUrl || raw;
};
// ─── ROLE PRIORITY HIERARCHY (Program Coordinator before Chairperson) ──
export const getRolePriority = (role = "") => {
    const r = (role || "").toLowerCase().trim();
    // 1. Program & Society Coordinators, Faculty Advisors (Highest Rank - Placed Above Chairperson)
    if (r.includes("program coordinator") ||
        r.includes("program co-ordinator") ||
        r.includes("programme coordinator") ||
        r.includes("faculty coordinator") ||
        r.includes("faculty co-ordinator") ||
        r.includes("society coordinator") ||
        r.includes("chapter coordinator") ||
        r.includes("wie coordinator") ||
        r.includes("pels coordinator") ||
        r.includes("cs coordinator") ||
        r.includes("cis coordinator") ||
        r.includes("comsoc coordinator") ||
        r.includes("embs coordinator") ||
        r.includes("im coordinator") ||
        r.includes("cas coordinator") ||
        (r.includes("coordinator") && !r.includes("activity") && !r.includes("activities") && !r.includes("event") && !r.includes("social") && !r.includes("media") && !r.includes("technical") && !r.includes("design") && !r.includes("content") && !r.includes("student")) ||
        r.includes("counsellor") ||
        r.includes("counselor") ||
        r.includes("advisor")) {
        return 1;
    }
    // 2. Chairperson / President / Chair
    if ((r.includes("chairperson") || r.includes("chair") || r.includes("president")) &&
        !r.includes("vice") &&
        !r.includes("co-chair")) {
        return 2;
    }
    // 3. Vice Chairperson / Vice President / Vice Chair
    if (r.includes("vice") || r.includes("co-chair")) {
        return 3;
    }
    // 4. Secretary / Joint Secretary
    if (r.includes("secretary")) {
        return r.includes("joint") ? 4.5 : 4;
    }
    // 5. Treasurer / Joint Treasurer
    if (r.includes("treasurer")) {
        return r.includes("joint") ? 5.5 : 5;
    }
    // 6. Activity Coordinator / Event Coordinator
    if (r.includes("activity") || r.includes("activities") || r.includes("event coordinator")) {
        return 6;
    }
    // 7. Webmaster / Technical Head / Design Head / Content Head / Lead
    if (r.includes("webmaster") ||
        r.includes("technical") ||
        r.includes("design") ||
        r.includes("content") ||
        r.includes("lead") ||
        r.includes("editor")) {
        return 7;
    }
    // 8. Social Media Lead / Media Relation Officer / PRO
    if (r.includes("social") ||
        r.includes("media") ||
        r.includes("relation") ||
        r.includes("pro") ||
        r.includes("public relations")) {
        return 8;
    }
    // 9. Committee Coordinator / Volunteer Lead
    if (r.includes("coordinator") || r.includes("co-ordinator")) {
        return 9;
    }
    // 10. Executive Member
    if (r.includes("executive")) {
        return 10;
    }
    return 11;
};
// ─── ROLE BADGE STYLING ────────────────────────────────────────────────
export const getRoleBadgeStyle = (role = "") => {
    const r = (role || "").toLowerCase().trim();
    if (r.includes("program coordinator") ||
        r.includes("faculty coordinator") ||
        r.includes("society coordinator") ||
        r.includes("chapter coordinator") ||
        r.includes("wie coordinator") ||
        (r.includes("coordinator") && !r.includes("activity") && !r.includes("event") && !r.includes("social") && !r.includes("media") && !r.includes("technical") && !r.includes("design") && !r.includes("content") && !r.includes("student")) ||
        r.includes("counsellor") ||
        r.includes("counselor") ||
        r.includes("advisor") ||
        r.includes("chair") ||
        r.includes("president")) {
        return {
            badgeBg: "bg-amber-500/15 text-amber-900 border-amber-300/80",
            accentGrad: "from-amber-500 to-orange-600",
            icon: Crown,
            tier: 1,
        };
    }
    if (r.includes("secretary") || r.includes("treasurer") || r.includes("vice")) {
        return {
            badgeBg: "bg-blue-500/15 text-blue-900 border-blue-300/80",
            accentGrad: "from-blue-600 to-indigo-700",
            icon: ShieldCheck,
            tier: 2,
        };
    }
    if (r.includes("activity") ||
        r.includes("social") ||
        r.includes("media") ||
        r.includes("webmaster") ||
        r.includes("technical") ||
        r.includes("lead") ||
        r.includes("editor") ||
        r.includes("head") ||
        r.includes("coordinator") ||
        r.includes("co-ordinator")) {
        return {
            badgeBg: "bg-cyan-500/15 text-cyan-900 border-cyan-300/80",
            accentGrad: "from-cyan-500 to-blue-600",
            icon: Zap,
            tier: 3,
        };
    }
    return {
        badgeBg: "bg-purple-500/15 text-purple-900 border-purple-300/80",
        accentGrad: "from-purple-600 to-pink-600",
        icon: Award,
        tier: 4,
    };
};
const SocietyOfficeBearers = ({ societyName = "Society", isStandalonePage = false, }) => {
    const [filterTab, setFilterTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [bearers, setBearers] = useState([]);
    const [executives, setExecutives] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
    const key = getSocietyKey(societyName);
    const theme = SOCIETY_THEMES[key] || SOCIETY_THEMES.srec;
    // Formatted uppercase chapter name for clean display
    const displaySocietyName = useMemo(() => {
        if (!societyName || societyName.toLowerCase() === "society")
            return "Chapter";
        const lower = societyName.toLowerCase().trim();
        if (lower === "pels" || lower === "ieee pels")
            return "IEEE PELS";
        if (lower === "cs" || lower === "ieee cs")
            return "IEEE CS";
        if (lower === "cis" || lower === "ieee cis")
            return "IEEE CIS";
        if (lower === "comsoc" || lower === "ieee comsoc")
            return "IEEE ComSoc";
        if (lower === "embs" || lower === "ieee embs")
            return "IEEE EMBS";
        if (lower === "im" || lower === "ims" || lower === "ieee im" || lower === "ieee ims")
            return "IEEE IMS";
        if (lower === "cas" || lower === "cass" || lower === "ieee cas")
            return "IEEE CAS";
        if (lower === "wie" || lower === "ieee wie")
            return "IEEE WIE";
        if (lower === "srec" || lower === "ieee sb")
            return "IEEE SREC Student Branch";
        return societyName.toUpperCase().startsWith("IEEE") ? societyName : `IEEE ${societyName.toUpperCase()}`;
    }, [societyName]);
    // ─── 100% PURE DATABASE FETCHING FROM SOCIETY'S DEDICATED TABLE ALONE ─────
    const fetchLeadership = useCallback(async () => {
        setLoading(true);
        try {
            const safeFetch = async (table) => {
                try {
                    const { data, error } = await supabase.from(table).select("*").order("id", { ascending: true });
                    if (error) {
                        return [];
                    }
                    return data || [];
                }
                catch {
                    return [];
                }
            };
            // Society-specific table key: "cs" | "pels" | "wie" | "cis" | "comsoc" | "embs" | "im" | "cas" | "srec"
            const societyKey = key;
            // Table mapping strictly for this specific society
            let bearerTables = [];
            let execTables = [];
            switch (societyKey) {
                case "pels":
                    bearerTables = ["pels_office_bearers"];
                    execTables = ["pels_executive_members"];
                    break;
                case "cs":
                    bearerTables = ["cs_office_bearers"];
                    execTables = ["cs_executive_members"];
                    break;
                case "wie":
                    bearerTables = ["wie_office_bearers"];
                    execTables = ["wie_executive_members"];
                    break;
                case "cas":
                    bearerTables = ["cas_office_bearers", "cass_office_bearers"];
                    execTables = ["cas_executive_members", "cass_executive_members"];
                    break;
                case "cis":
                    bearerTables = ["cis_office_bearers"];
                    execTables = ["cis_executive_members"];
                    break;
                case "comsoc":
                    bearerTables = ["comsoc_office_bearers"];
                    execTables = ["comsoc_executive_members"];
                    break;
                case "embs":
                    bearerTables = ["embs_office_bearers"];
                    execTables = ["embs_executive_members"];
                    break;
                case "im":
                    bearerTables = ["im_office_bearers", "ims_office_bearers"];
                    execTables = ["im_executive_members", "ims_executive_members"];
                    break;
                case "srec":
                default:
                    bearerTables = ["srec_office_bearers", "new_office_bearers"];
                    execTables = ["srec_executive_members", "new_executive_members"];
                    break;
            }
            // Fetch ONLY from this society's dedicated tables
            const bearerResults = await Promise.all(bearerTables.map((t) => safeFetch(t)));
            const execResults = await Promise.all(execTables.map((t) => safeFetch(t)));
            const bearerList = [];
            const execList = [];
            for (const res of bearerResults) {
                if (res && res.length > 0) {
                    bearerList.push(...res);
                    break; // Use first table that contains data
                }
            }
            for (const res of execResults) {
                if (res && res.length > 0) {
                    execList.push(...res);
                    break; // Use first table that contains data
                }
            }
            const normalizeName = (rawName = "") => {
                return rawName
                    .toLowerCase()
                    .replace(/^dr\.?\s*/i, "")
                    .replace(/^prof\.?\s*/i, "")
                    .replace(/^mr\.?\s*/i, "")
                    .replace(/^ms\.?\s*/i, "")
                    .replace(/^mrs\.?\s*/i, "")
                    .replace(/[^a-z0-9]/g, "")
                    .trim();
            };
            const bearerMap = new Map();
            const execMap = new Map();
            // 1. Populate office bearers strictly from this society's table with unique prefixed IDs
            bearerList.forEach((item, idx) => {
                if (!item || !item.name || !item.name.trim())
                    return;
                const normalized = normalizeName(item.name);
                const uniqueKey = `ob-${item.id || idx}-${normalized}`;
                bearerMap.set(uniqueKey, {
                    ...item,
                    id: item.id ? `ob-${item.id}` : `ob-${idx}-${normalized}`,
                    categoryBadge: "Office Bearer",
                });
            });
            // 2. Populate executive members strictly from this society's table with unique prefixed IDs
            execList.forEach((item, idx) => {
                if (!item || !item.name || !item.name.trim())
                    return;
                const normalized = normalizeName(item.name);
                const uniqueKey = `em-${item.id || idx}-${normalized}`;
                execMap.set(uniqueKey, {
                    ...item,
                    id: item.id ? `em-${item.id}` : `em-${idx}-${normalized}`,
                    categoryBadge: "Executive Member",
                });
            });
            // Strictly set leadership from database query results
            setBearers(Array.from(bearerMap.values()));
            setExecutives(Array.from(execMap.values()));
        }
        catch (err) {
            console.error("Error fetching leadership from database:", err);
            setBearers([]);
            setExecutives([]);
        }
        finally {
            setLoading(false);
        }
    }, [key]);
    useEffect(() => {
        fetchLeadership();

        // 15-second auto-refresh interval for live office bearer roster
        const refreshInterval = setInterval(() => {
            fetchLeadership();
        }, 15000);

        // Supabase Realtime synchronization strictly for this society's dedicated tables
        const channel = supabase
            .channel(`society-leadership-${key}-${Date.now()}`)
            .on("postgres_changes", { event: "*", schema: "public", table: `${key}_office_bearers` }, () => fetchLeadership())
            .on("postgres_changes", { event: "*", schema: "public", table: `${key}_executive_members` }, () => fetchLeadership());
        if (key === "im") {
            channel
                .on("postgres_changes", { event: "*", schema: "public", table: "ims_office_bearers" }, () => fetchLeadership())
                .on("postgres_changes", { event: "*", schema: "public", table: "ims_executive_members" }, () => fetchLeadership());
        }
        else if (key === "cas") {
            channel
                .on("postgres_changes", { event: "*", schema: "public", table: "cass_office_bearers" }, () => fetchLeadership())
                .on("postgres_changes", { event: "*", schema: "public", table: "cass_executive_members" }, () => fetchLeadership());
        }
        else if (key === "srec") {
            channel
                .on("postgres_changes", { event: "*", schema: "public", table: "new_office_bearers" }, () => fetchLeadership())
                .on("postgres_changes", { event: "*", schema: "public", table: "new_executive_members" }, () => fetchLeadership());
        }
        channel.subscribe();
        return () => {
            clearInterval(refreshInterval);
            supabase.removeChannel(channel);
        };
    }, [fetchLeadership, key]);
    // Filtered and hierarchy-sorted lists (Program Coordinator placed before Chairperson)
    const sortedBearers = useMemo(() => {
        let list = bearers;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = bearers.filter((b) => b.name?.toLowerCase().includes(q) ||
                b.role?.toLowerCase().includes(q) ||
                b.department?.toLowerCase().includes(q));
        }
        return [...list].sort((a, b) => getRolePriority(a.role) - getRolePriority(b.role));
    }, [bearers, searchQuery]);
    const sortedExecutives = useMemo(() => {
        let list = executives;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = executives.filter((e) => e.name?.toLowerCase().includes(q) ||
                e.role?.toLowerCase().includes(q) ||
                e.department?.toLowerCase().includes(q));
        }
        return [...list].sort((a, b) => getRolePriority(a.role) - getRolePriority(b.role));
    }, [executives, searchQuery]);
    // Combine for all members with hierarchy priority sorting
    const allFilteredMembers = useMemo(() => {
        if (filterTab === "bearers")
            return sortedBearers.map((b) => ({ ...b, categoryBadge: "Office Bearer" }));
        if (filterTab === "executives")
            return sortedExecutives.map((e) => ({ ...e, categoryBadge: "Executive Member" }));
        return [
            ...sortedBearers.map((b) => ({ ...b, categoryBadge: "Office Bearer" })),
            ...sortedExecutives.map((e) => ({ ...e, categoryBadge: "Executive Member" })),
        ];
    }, [filterTab, sortedBearers, sortedExecutives]);
    // ─── CARD RENDERER ────────────────────────────────────────────────────
    const renderCard = (person, idx, categoryBadge) => {
        const imgSrc = resolveImageUrl(person.image_url || person.photo || person.photo_url);
        const { badgeBg, accentGrad, icon: RoleIcon } = getRoleBadgeStyle(person.role);
        const initials = (person.name || "M")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2);
        return (<motion.div key={person.id || idx} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: (idx % 6) * 0.06 }} onClick={() => setSelectedPerson(person)} className="group relative bg-[#001026]/90 border border-white/10 hover:border-cyan-400/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(0,210,255,0.2)] backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer">
        {/* Portrait Media Area - Large & Prominent */}
        <div className="relative w-full h-80 sm:h-96 bg-slate-950 overflow-hidden flex items-center justify-center">
          {imgSrc ? (<img src={imgSrc} alt={person.name} className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"/>) : (<div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${accentGrad} text-white p-6 relative overflow-hidden`}>
              {/* Subtle background insignia */}
              <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
                <Crown size={200}/>
              </div>

              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/40 flex items-center justify-center text-4xl sm:text-5xl font-black font-sans shadow-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {initials}
              </div>
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white/95 text-center px-4 drop-shadow-md">
                {societyName}
              </span>
            </div>)}

          {/* Frosted Dark Gradient Overlay for Crisp Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#001026] via-slate-950/20 to-transparent pointer-events-none opacity-90 group-hover:opacity-75 transition-opacity"/>

          {/* Top Category Badge */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 backdrop-blur-md border border-white/25 text-white text-[11px] font-black uppercase tracking-wider shadow-lg">
              <RoleIcon size={13} className="text-amber-400"/>
              <span>{categoryBadge}</span>
            </span>
          </div>

          {/* Chapter Code Seal */}
          <div className="absolute top-4 right-4 z-10">
            <span className="px-3 py-1.5 rounded-xl bg-white/25 backdrop-blur-md border border-white/35 text-white text-xs font-black uppercase tracking-widest shadow-md">
              {theme.code}
            </span>
          </div>

          {/* Role Overlay Bar */}
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md ${badgeBg} bg-slate-900/90 text-white truncate max-w-full`}>
              <RoleIcon size={14} className="shrink-0"/>
              <span className="truncate">{person.role}</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 flex-1 flex flex-col justify-between bg-[#001026]/95 text-white">
          <div>
            <h4 className="font-serif text-lg sm:text-xl font-bold text-white group-hover:text-cyan-300 transition-colors leading-tight mb-2 truncate">
              {person.name}
            </h4>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {person.department && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 font-bold text-xs border border-white/10">
                  <GraduationCap size={13} className="text-slate-400" />
                  <span>{person.department}</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-[11px] border border-cyan-400/30">
                <Briefcase size={12} />
                <span>{person.academic_year || "Active 2024-2026"}</span>
              </span>
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="pt-3.5 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Official Leadership
              </span>
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              {person.linkedin_url ? (
                <a
                  href={person.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0077b5] hover:bg-[#005885] text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  <Linkedin size={13} />
                  <span>LinkedIn</span>
                  <ExternalLink size={11} />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedPerson(person)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-cyan-600 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  <span>Profile</span>
                  <ExternalLink size={11} />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>);
    };
    // ─── TIER COMPONENT RENDERER ──────────────────────────────────────────
    const renderTierSection = (title, subtitle, membersList, iconComp, badgeColor, isCentered = false) => {
        if (membersList.length === 0)
            return null;
        const IconComp = iconComp;
        return (<div className="mb-14 last:mb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl ${badgeColor} flex items-center justify-center shrink-0`}>
              <IconComp size={18}/>
            </div>
            <div>
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-white">{title}</h4>
              <p className="text-xs text-slate-400 font-semibold">{subtitle}</p>
            </div>
          </div>
          <span className="self-start sm:self-center px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-black uppercase">
            {membersList.length} Personnel
          </span>
        </div>

        {/* When centered or <= 2 items, place cards in the middle of all */}
        {isCentered || membersList.length <= 2 ? (<div className="flex flex-wrap justify-center items-center gap-6">
            {membersList.map((person, idx) => (<div key={person.id || idx} className="w-full sm:w-[320px] md:w-[350px]">
                {renderCard(person, idx, person.categoryBadge || "Leadership")}
              </div>))}
          </div>) : (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {membersList.map((person, idx) => renderCard(person, idx, person.categoryBadge || "Leadership"))}
          </div>)}
      </div>);
    };
    // Group into Hierarchy Tiers (Program & Society Coordinators placed above Chairperson)
    const advisorTier = useMemo(() => allFilteredMembers
        .filter((m) => {
        const r = (m.role || "").toLowerCase().trim();
        return (r.includes("program coordinator") ||
            r.includes("program co-ordinator") ||
            r.includes("programme coordinator") ||
            r.includes("faculty coordinator") ||
            r.includes("faculty co-ordinator") ||
            r.includes("society coordinator") ||
            r.includes("chapter coordinator") ||
            r.includes("wie coordinator") ||
            r.includes("pels coordinator") ||
            r.includes("cs coordinator") ||
            r.includes("cis coordinator") ||
            r.includes("comsoc coordinator") ||
            r.includes("embs coordinator") ||
            r.includes("im coordinator") ||
            r.includes("cas coordinator") ||
            (r.includes("coordinator") && !r.includes("activity") && !r.includes("activities") && !r.includes("event") && !r.includes("social") && !r.includes("media") && !r.includes("technical") && !r.includes("design") && !r.includes("content") && !r.includes("student")) ||
            r.includes("counsellor") ||
            r.includes("counselor") ||
            r.includes("faculty advisor") ||
            r.includes("advisor"));
    })
        .sort((a, b) => getRolePriority(a.role) - getRolePriority(b.role)), [allFilteredMembers]);
    const chairTier = useMemo(() => allFilteredMembers
        .filter((m) => {
        const r = (m.role || "").toLowerCase().trim();
        if (advisorTier.some((a) => a.id === m.id))
            return false;
        return ((r.includes("chair") || r.includes("president")) &&
            !r.includes("vice") &&
            !r.includes("co-chair"));
    })
        .sort((a, b) => getRolePriority(a.role) - getRolePriority(b.role)), [allFilteredMembers, advisorTier]);
    const coreOfficersTier = useMemo(() => allFilteredMembers
        .filter((m) => {
        const r = (m.role || "").toLowerCase().trim();
        return ((r.includes("secretary") || r.includes("treasurer") || (r.includes("vice") && !chairTier.some((c) => c.id === m.id))) &&
            !advisorTier.some((a) => a.id === m.id) &&
            !chairTier.some((c) => c.id === m.id));
    })
        .sort((a, b) => getRolePriority(a.role) - getRolePriority(b.role)), [allFilteredMembers, advisorTier, chairTier]);
    const coordinatorAndMediaTier = useMemo(() => allFilteredMembers
        .filter((m) => {
        const r = (m.role || "").toLowerCase().trim();
        return ((r.includes("activity") ||
            r.includes("activities") ||
            r.includes("social") ||
            r.includes("media") ||
            r.includes("webmaster") ||
            r.includes("technical") ||
            r.includes("editor") ||
            r.includes("head") ||
            r.includes("lead") ||
            r.includes("design") ||
            r.includes("content") ||
            r.includes("pro") ||
            r.includes("coordinator") ||
            r.includes("co-ordinator")) &&
            !advisorTier.some((a) => a.id === m.id) &&
            !chairTier.some((c) => c.id === m.id) &&
            !coreOfficersTier.some((o) => o.id === m.id));
    })
        .sort((a, b) => getRolePriority(a.role) - getRolePriority(b.role)), [allFilteredMembers, advisorTier, chairTier, coreOfficersTier]);
    const execMembersTier = useMemo(() => allFilteredMembers
        .filter((m) => {
        if (advisorTier.some((a) => a.id === m.id) ||
            chairTier.some((c) => c.id === m.id) ||
            coreOfficersTier.some((o) => o.id === m.id) ||
            coordinatorAndMediaTier.some((cm) => cm.id === m.id)) {
            return false;
        }
        return true;
    })
        .sort((a, b) => getRolePriority(a.role) - getRolePriority(b.role)), [allFilteredMembers, advisorTier, chairTier, coreOfficersTier, coordinatorAndMediaTier]);
    return (<div className="w-full col-span-full font-sans relative">
      {/* ─── HEADER BANNER WITH DYNAMIC SOCIETY ACCENTS (DARK THEME) ─── */}
      <div className="border border-white/10 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-6 sm:p-10 md:p-12 mb-8 rounded-3xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        {/* Subtle background accent glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ background: theme.primary }}/>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-extrabold text-[11px] uppercase tracking-wider mb-3.5 shadow-xs">
            <Sparkles size={14} className="text-blue-400"/>
            <span>Official Chapter Leadership</span>
          </div>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif font-extrabold text-white tracking-tight leading-tight">
            {displaySocietyName} Leadership &amp; Office Bearers
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2 leading-relaxed font-normal">
            Meet the distinguished student chairs, faculty advisors, and executive members advancing technical initiatives and chapter excellence for {displaySocietyName} at SREC.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-2.5 shrink-0">
          {!isStandalonePage && (<Link to={`/societies/office-bearers?society=${key}`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all rounded-xl shadow-lg hover:shadow-cyan-500/25 hover:scale-102" title="Open Society Office Bearers in a dedicated full-screen page">
              <span>Dedicated Page</span>
              <ExternalLink size={13}/>
            </Link>)}

          <Link to="/office-bearers" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all rounded-xl shadow-md hover:shadow-lg backdrop-blur-md">
            <span>All SB Bearers</span>
            <ArrowRight size={14}/>
          </Link>
        </div>
      </div>

      {/* ─── SEARCH & FILTER TOOLBAR ─── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        {/* Mobile Filter Custom Animated Dropdown Menu */}
        <div className="relative w-full sm:hidden">
          {(() => {
            const filterOptions = [
                { id: "all", label: "All Leadership", count: allFilteredMembers.length, icon: Sparkles, color: "text-blue-400" },
                { id: "bearers", label: "Office Bearers", count: bearers.length, icon: Crown, color: "text-amber-400" },
                { id: "executives", label: "Executives", count: executives.length, icon: ShieldCheck, color: "text-purple-400" },
            ];
            const activeOption = filterOptions.find((o) => o.id === filterTab) || filterOptions[0];
            const ActiveIcon = activeOption.icon;
            return (<>
                <button type="button" onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 bg-[#001026] border border-white/15 rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:border-cyan-400/50">
                  <div className="flex items-center gap-2.5">
                    <ActiveIcon size={16} className={activeOption.color}/>
                    <span>{activeOption.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-extrabold text-slate-300">
                      {activeOption.count}
                    </span>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isFilterDropdownOpen ? "rotate-180" : ""}`}/>
                </button>

                <AnimatePresence>
                  {isFilterDropdownOpen && (<>
                      <div className="fixed inset-0 z-20" onClick={() => setIsFilterDropdownOpen(false)}/>
                      <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.15 }} className="absolute left-0 right-0 top-full mt-2 z-30 bg-[#00142e]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-1.5 space-y-1 overflow-hidden">
                        {filterOptions.map((opt) => {
                        const isSelected = filterTab === opt.id;
                        const OptIcon = opt.icon;
                        return (<button key={opt.id} type="button" onClick={() => {
                                setFilterTab(opt.id);
                                setIsFilterDropdownOpen(false);
                            }} className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${isSelected
                                ? "bg-blue-600 text-white font-black shadow-md"
                                : "text-slate-300 hover:bg-white/10 hover:text-white"}`}>
                              <div className="flex items-center gap-2.5">
                                <OptIcon size={16} className={isSelected ? "text-white" : opt.color}/>
                                <span>{opt.label}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isSelected ? "bg-white/20 text-white" : "bg-white/10 text-slate-300"}`}>
                                {opt.count}
                              </span>
                            </button>);
                    })}
                      </motion.div>
                    </>)}
                </AnimatePresence>
              </>);
        })()}
        </div>

        {/* Desktop Filter Pills */}
        <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
          <button type="button" onClick={() => setFilterTab("all")} className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-xl ${filterTab === "all"
            ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]"
            : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"}`}>
            <Sparkles size={14}/>
            <span>All Leadership ({allFilteredMembers.length})</span>
          </button>
          <button type="button" onClick={() => setFilterTab("bearers")} className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-xl ${filterTab === "bearers"
            ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30 scale-[1.02]"
            : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"}`}>
            <Crown size={14}/>
            <span>Office Bearers ({bearers.length})</span>
          </button>
          <button type="button" onClick={() => setFilterTab("executives")} className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider transition-all rounded-xl ${filterTab === "executives"
            ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-[1.02]"
            : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"}`}>
            <ShieldCheck size={14}/>
            <span>Executives ({executives.length})</span>
          </button>
        </div>

        {/* Instant Search Bar */}
        <div className="relative w-full max-w-md md:w-72 mx-auto md:mx-0">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
          <input type="text" placeholder="Search by name, role, department..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-white bg-white/5 placeholder-slate-400 focus:border-cyan-400 focus:outline-none backdrop-blur-md shadow-inner"/>
          {searchQuery && (<button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
              <X size={13}/>
            </button>)}
        </div>
      </div>

      {/* ─── MAIN HIERARCHICAL GRID CONTENT DISPLAY ─── */}
      {loading ? (<div className="p-16 flex flex-col items-center justify-center gap-3 bg-[#001026]/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl">
          <Loader2 className="w-9 h-9 animate-spin text-cyan-400"/>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Loading Chapter Leadership from Database...
          </span>
        </div>) : allFilteredMembers.length === 0 ? (<div className="py-16 text-center bg-[#001026]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
          <UserCheck size={40} className="mx-auto text-slate-500 mb-3"/>
          <p className="text-white font-bold text-lg">No Members Found</p>
          <p className="text-slate-400 text-xs mt-1">
            {searchQuery
                ? "No matching personnel found for your search."
                : "No personnel records found in the database table."}
          </p>
        </div>) : (<div className="space-y-14">
          {(filterTab === "all" || filterTab === "bearers") &&
                renderTierSection("Program & Society Coordinators", "Faculty guidance, chapter mentoring & institutional leadership", advisorTier, Crown, "bg-amber-500/20 text-amber-300 border border-amber-400/40", true)}

          {(filterTab === "all" || filterTab === "bearers") &&
                renderTierSection("Executive Chairs & Presidents", "Leading chapter strategy, symposiums, and student branch outreach", chairTier, Crown, "bg-blue-500/20 text-blue-300 border border-blue-400/40")}

          {(filterTab === "all" || filterTab === "bearers") &&
                renderTierSection("Core Officers & Secretaries", "Managing governance, treasury, and operational records", coreOfficersTier, ShieldCheck, "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40")}

          {(filterTab === "all" || filterTab === "bearers") &&
                renderTierSection("Activity & Social Media Coordinators", "Coordinating events, workshops, technical initiatives & media outreach", coordinatorAndMediaTier, Zap, "bg-teal-500/20 text-teal-300 border border-teal-400/40")}

          {(filterTab === "all" || filterTab === "executives") &&
                renderTierSection("Executive Committee Members", "Driving technical workshops, creative design, and digital media", execMembersTier, Award, "bg-purple-500/20 text-purple-300 border border-purple-400/40")}
        </div>)}

      {/* ─── INTERACTIVE PROFILE DETAIL MODAL (DARK THEME) ─── */}
      <AnimatePresence>
        {selectedPerson && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPerson(null)} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.92, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-lg bg-[#001026] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/15 overflow-hidden text-white">
              {/* Close Button */}
              <button type="button" onClick={() => setSelectedPerson(null)} className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10">
                <X size={16}/>
              </button>

              {/* Portrait Hero - Large & Prominent */}
              <div className="relative w-full h-80 sm:h-96 bg-slate-950 flex items-center justify-center overflow-hidden">
                {resolveImageUrl(selectedPerson.image_url || selectedPerson.photo || selectedPerson.photo_url) ? (<img src={resolveImageUrl(selectedPerson.image_url || selectedPerson.photo || selectedPerson.photo_url)} alt={selectedPerson.name} className="w-full h-full object-cover object-center"/>) : (<div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${getRoleBadgeStyle(selectedPerson.role).accentGrad} text-white p-6 relative overflow-hidden`}>
                    <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
                      <Crown size={200}/>
                    </div>
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-white/20 backdrop-blur-xl border-2 border-white/40 flex items-center justify-center text-4xl sm:text-5xl font-black mb-3 shadow-2xl">
                      {selectedPerson.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                    </div>
                    <span className="text-sm font-extrabold uppercase tracking-widest text-white/95">
                      {displaySocietyName}
                    </span>
                  </div>)}

                <div className="absolute inset-0 bg-gradient-to-t from-[#001026] via-slate-950/20 to-transparent pointer-events-none"/>

                <div className="absolute bottom-4 left-5 right-5 z-10 text-white">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-md backdrop-blur-md">
                    {selectedPerson.role}
                  </span>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 bg-[#001026]">
                <h3 className="font-serif text-2xl font-bold text-white mb-1">
                  {selectedPerson.name}
                </h3>
                <p className="text-xs font-semibold text-cyan-400 mb-4">
                  {displaySocietyName} • Verified Database Record
                </p>

                <div className="space-y-3 mb-6">
                  {selectedPerson.department && (<div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                      <GraduationCap size={16} className="text-cyan-400 shrink-0"/>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400">Department</p>
                        <p className="text-xs font-bold text-slate-200">{selectedPerson.department}</p>
                      </div>
                    </div>)}

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0"/>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
                      <p className="text-xs font-bold text-slate-200">Verified Chapter Officer</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {selectedPerson.linkedin_url ? (<a href={selectedPerson.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 px-4 rounded-xl bg-[#0077b5] hover:bg-[#005885] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md">
                      <Linkedin size={15}/>
                      <span>Connect on LinkedIn</span>
                      <ExternalLink size={12}/>
                    </a>) : (<Link to="/office-bearers" className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md backdrop-blur-md">
                      <span>View All Chapter Bearers</span>
                      <ArrowRight size={13}/>
                    </Link>)}
                  <button type="button" onClick={() => setSelectedPerson(null)} className="py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs transition-all">
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>
    </div>);
};
export default SocietyOfficeBearers;
