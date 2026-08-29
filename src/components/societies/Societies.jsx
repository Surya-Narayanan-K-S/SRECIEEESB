import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Cpu, Loader2, Layers, ArrowRight, Users, ExternalLink, Search, Sparkles, Crown, ChevronDown, Zap, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import wieLogo from "@/assets/societies/WIE.jpg";
import embsLogo from "@/assets/societies/EMBS.jpg";
import csLogo from "@/assets/societies/CS.png";
import comsocLogo from "@/assets/societies/ComSoc.jpg";
import pelsLogo from "@/assets/societies/pels.png";
import ieeeSrecLogo from "@/assets/ieees.png";
import cisLogo from "@/assets/societies/CIS.png";
import imlogo from "@/assets/societies/IM.jpg";
import casLogo from "@/assets/societies/css.svg";
const logoMapping = {
  wie: wieLogo,
  embs: embsLogo,
  cs: csLogo,
  comsoc: comsocLogo,
  pels: pelsLogo,
  srec: ieeeSrecLogo,
  cis: cisLogo,
  im: imlogo,
  cas: casLogo,
};
const ENRICHED_SOCIETIES = [
  {
    id: 1,
    slug: "srec",
    name: "IEEE SREC Student Branch",
    shortCode: "IEEE SB",
    tagline: "The Core Umbrella of Student Leadership & Global Tech Initiatives",
    description: "The overarching student branch connecting all technical chapters, hosting flagship hackathons, symposiums, and professional growth opportunities at SREC.",
    category: "general",
    color: "#002855",
    gradient: "from-blue-900 via-indigo-900 to-slate-900",
    badgeBg: "bg-blue-50 text-blue-900 border-blue-200",
    tags: ["Student Leadership", "Flagship Events", "Global IEEE Outreach"],
  },
  {
    id: 2,
    slug: "cs",
    name: "IEEE Computer Society (CS)",
    shortCode: "CS",
    tagline: "Computing, Cloud Architecture, Artificial Intelligence & Software Systems",
    description: "The premier global source for information, inspiration, and collaboration in computer science, algorithm design, cybersecurity, and emerging software paradigms.",
    category: "computing",
    color: "#ea580c",
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    badgeBg: "bg-orange-50 text-orange-900 border-orange-200",
    tags: ["Cloud & DevOps", "AI & ML", "Algorithms", "Cybersecurity"],
  },
  {
    id: 3,
    slug: "pels",
    name: "IEEE Power Electronics Society (PELS)",
    shortCode: "PELS",
    tagline: "Power Systems, Electric Mobility, Inverters & Renewable Grids",
    description: "Advancing power electronics, clean energy conversion, electric vehicles, microgrids, motor drives, and next-generation energy storage solutions.",
    category: "power",
    color: "#008542",
    gradient: "from-emerald-700 via-green-600 to-teal-600",
    badgeBg: "bg-emerald-50 text-emerald-900 border-emerald-200",
    tags: ["Electric Vehicles", "Clean Energy", "Grid Inverters", "Converters"],
  },
  {
    id: 4,
    slug: "cis",
    name: "IEEE Computational Intelligence Society (CIS)",
    shortCode: "CIS",
    tagline: "Neural Networks, Deep Learning & Evolutionary Artificial Intelligence",
    description: "Pioneering research and applications in biological neural modeling, fuzzy logic systems, evolutionary computing, and nature-inspired intelligent architectures.",
    category: "computing",
    color: "#6366f1",
    gradient: "from-indigo-700 via-purple-700 to-pink-700",
    badgeBg: "bg-indigo-50 text-indigo-900 border-indigo-200",
    tags: ["Deep Neural Nets", "Fuzzy Logic", "Genetic Algorithms", "Ethical AI"],
  },
  {
    id: 5,
    slug: "comsoc",
    name: "IEEE Communications Society (ComSoc)",
    shortCode: "ComSoc",
    tagline: "5G/6G Networks, Optical Fiber & Wireless Telecommunications",
    description: "Nurturing innovation in telecommunications, next-gen mobile networks, optical communications, internet-of-things protocols, and global connectivity.",
    category: "comms",
    color: "#0284c7",
    gradient: "from-sky-700 via-cyan-600 to-blue-700",
    badgeBg: "bg-sky-50 text-sky-900 border-sky-200",
    tags: ["5G/6G Wireless", "IoT Protocols", "Optical Telecom", "Edge Networks"],
  },
  {
    id: 6,
    slug: "embs",
    name: "IEEE Engineering in Medicine & Biology Society (EMBS)",
    shortCode: "EMBS",
    tagline: "Medical Technology, Neural Engineering, Biosensors & Digital Healthcare",
    description: "Integrating engineering with medicine and biology to enhance healthcare diagnostics, robotic prosthetics, medical imaging, and biosensor technology.",
    category: "health",
    color: "#059669",
    gradient: "from-teal-700 via-emerald-600 to-green-700",
    badgeBg: "bg-teal-50 text-teal-900 border-teal-200",
    tags: ["Biosensors", "Medical Robotics", "Neural Interfaces", "Healthcare AI"],
  },
  {
    id: 7,
    slug: "wie",
    name: "IEEE Women in Engineering (WIE)",
    shortCode: "WIE",
    tagline: "Empowering Women Leaders, Researchers & Innovators Worldwide",
    description: "Dedicated to promoting female engineers, scientists, and researchers, inspiring girls around the world to pursue academic and professional STEM excellence.",
    category: "diversity",
    color: "#7e22ce",
    gradient: "from-purple-800 via-fuchsia-700 to-pink-600",
    badgeBg: "bg-purple-50 text-purple-900 border-purple-200",
    tags: ["Women in STEM", "Leadership Mentorship", "Technical Summits"],
  },
  {
    id: 8,
    slug: "cas",
    name: "IEEE Circuits and Systems Society (CAS)",
    shortCode: "CAS",
    tagline: "VLSI Microchips, Analog/Digital Silicon & Hardware AI Accelerators",
    description: "Advancing the theory, design, and practical fabrication of microelectronic circuits, custom VLSI chips, signal processors, and neural hardware accelerators.",
    category: "power",
    color: "#1d4ed8",
    gradient: "from-blue-800 via-indigo-700 to-cyan-600",
    badgeBg: "bg-blue-50 text-blue-900 border-blue-200",
    tags: ["VLSI Design", "Silicon Microchips", "Analog & Digital", "Hardware AI"],
  },
  {
    id: 9,
    slug: "im",
    name: "IEEE Instrumentation & Measurement Society (IMS)",
    shortCode: "IMS",
    tagline: "Precision Measurement, Automated Sensor Systems & Calibration",
    description: "Dedicated to measurement science, automated sensor networks, precision data acquisition, high-fidelity testing instrumentation, and standards calibration.",
    category: "comms",
    color: "#e11d48",
    gradient: "from-rose-700 via-pink-600 to-red-600",
    badgeBg: "bg-rose-50 text-rose-900 border-rose-200",
    tags: ["Sensor Systems", "Precision Metrology", "Automated Testing", "Data Acquisition"],
  },
];
const internalSocietyLinks = {
  srec: "/societies/srec",
  wie: "/societies/wie",
  embs: "/societies/embs",
  cs: "/societies/cs",
  comsoc: "/societies/comsoc",
  pels: "/societies/pels",
  im: "/societies/im",
  cis: "/societies/cis",
  cas: "/societies/cas",
};
const externalSocietyLinks = {
  srec: "https://www.ieee.org/",
  wie: "https://wie.ieee.org/about/",
  embs: "https://www.embs.org/about/",
  cs: "https://www.computer.org/about/",
  comsoc: "https://www.comsoc.org/about/",
  pels: "https://www.ieee-pels.org/about/",
  im: "https://ieee-ims.org/about/about-ims",
  cis: "https://cis.ieee.org/about/",
  cas: "https://ieee-cas.org/society-involvement/join-cas",
};
const getSlugForSociety = (name, id) => {
  const n = name.toLowerCase();
  if (n.includes("srec"))
    return "srec";
  if (/\bwie\b/.test(n) || n.includes("women"))
    return "wie";
  if (/\bembs\b/.test(n) || n.includes("medicine"))
    return "embs";
  if (/\bcs\b/.test(n) || n.includes("computer"))
    return "cs";
  if (/\bcomsoc\b/.test(n) || n.includes("communication"))
    return "comsoc";
  if (/\bpels\b/.test(n) || n.includes("power"))
    return "pels";
  if (/\bim\b/.test(n) || n.includes("instrumentation"))
    return "im";
  if (/\bcis\b/.test(n) || n.includes("computational"))
    return "cis";
  if (/\bcas\b/.test(n) || /\bcass\b/.test(n) || n.includes("circuits"))
    return "cas";
  return id.toString();
};
const Societies = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // 1. Fetch Dynamic Page CMS Content (Hero text, subtext, badges, CTA)
  const { data: pageContents = [] } = useQuery({
    queryKey: ["page_contents_societies"],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_contents")
        .select("*")
        .in("page_key", ["societies", "landing", "global"]);
      return data || [];
    },
  });
  // Helper to extract content by key from database
  const getCms = (key, fallback) => {
    const item = pageContents.find((c) => c.content_key === key);
    return item?.content_text?.trim() || fallback;
  };
  // 2. Fetch All Societies from Supabase Database
  const { data: dbSocieties = [], isLoading } = useQuery({
    queryKey: ["societies"],
    queryFn: async () => {
      const { data } = await supabase.from("societies").select("*").order("id", { ascending: true });
      return data || [];
    },
  });
  const mergedSocieties = useMemo(() => {
    return ENRICHED_SOCIETIES.map((meta) => {
      const dbMatch = dbSocieties.find((d) => {
        const slug = getSlugForSociety(d.name || "", d.id || 0);
        return slug === meta.slug;
      });
      return {
        ...meta,
        ...(dbMatch
          ? {
            dbId: dbMatch.id,
            name: dbMatch.name || meta.name,
            tagline: dbMatch.tagline || dbMatch.short_description || meta.tagline,
            description: dbMatch.description || meta.description,
            shortCode: dbMatch.short_code || meta.shortCode,
          }
          : {}),
      };
    });
  }, [dbSocieties]);
  const filteredSocieties = useMemo(() => {
    return mergedSocieties.filter((s) => {
      const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.tagline.toLowerCase().includes(q) ||
        s.shortCode.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [mergedSocieties, selectedCategory, searchQuery]);
  // On Landing page, only showcase top flagship societies instead of the entire long list
  const displaySocieties = useMemo(() => {
    if (isHomePage) {
      return mergedSocieties.filter((s) => ["cs", "cis", "pels", "wie"].includes(s.slug));
    }
    return filteredSocieties;
  }, [isHomePage, mergedSocieties, filteredSocieties]);
  if (isLoading) {
    return (<section className="py-32 bg-slate-50 flex flex-col justify-center items-center min-h-[500px]">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />
      <p className="text-slate-500 font-bold text-xs tracking-widest uppercase animate-pulse">
        Loading IEEE Societies &amp; Chapters...
      </p>
    </section>);
  }
  // Dynamic CMS Text Tokens from Database
  const heroBadge = getCms("societies_hero_badge", "IEEE SREC Technical Affiliations");
  const heroTitle = isHomePage
    ? getCms("societies_landing_title", "Featured Technical Chapters & Societies")
    : getCms("societies_hero_title", "Specialized Technical Societies & Chapters");
  const heroSubtitle = isHomePage
    ? "Discover student-led innovation across computer science, artificial intelligence, power electronics, and women in engineering."
    : getCms("societies_hero_subtitle", "Explore SREC's 8 specialized IEEE technical societies and student branch wings. Engage in global hackathons, cutting-edge research symposiums, industry certifications, and leadership roles.");
  const ctaBadge = getCms("societies_cta_badge", "Join IEEE SREC Student Branch");
  const ctaTitle = getCms("societies_cta_title", "Ready to Accelerate Your Engineering Career?");
  const ctaSubtitle = getCms("societies_cta_subtitle", "Join 500+ student engineers at SREC. Get access to IEEE Xplore digital library, global society memberships, technical workshops, paper publications, and leadership credentials.");
  return (<section id="societies" className="py-12 md:py-20 relative overflow-hidden bg-slate-50/70 font-sans">
    {/* Background Soft Glows */}
    <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-b from-blue-100/40 via-indigo-50/20 to-transparent blur-3xl pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3" />
    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-emerald-100/40 via-teal-50/20 to-transparent blur-3xl pointer-events-none rounded-full -translate-x-1/4 translate-y-1/4" />

    <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

      {/* ─── HERO HEADER SECTION (DATABASE-DRIVEN) ─── */}
      <div className="border border-slate-200/80 bg-white/90 backdrop-blur-xl p-8 sm:p-12 md:p-14 mb-10 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-extrabold text-[11px] uppercase tracking-wider mb-4 shadow-xs">
              <Sparkles size={14} className="text-blue-600" />
              <span>{heroBadge}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              {heroTitle}
            </h1>
            <p className="mt-4 text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
              {heroSubtitle}
            </p>
          </div>

          {/* Quick Summary Counter Cards */}
          {!isHomePage && (<div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 w-full lg:w-auto shrink-0">
            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-400 flex items-center justify-center mb-3">
                <Cpu size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Chapters</p>
                <p className="text-xl font-extrabold text-white mt-0.5">8 + 1 SB</p>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 flex items-center justify-center mb-3">
                <Users size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Members</p>
                <p className="text-xl font-extrabold text-white mt-0.5">500+ Active</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-400 flex items-center justify-center mb-3">
                <Crown size={16} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Leadership</p>
                <p className="text-xl font-extrabold text-white mt-0.5">Live Leadership</p>
              </div>
            </div>
          </div>)}
        </div>
      </div>

        {/* ─── SEARCH & CATEGORY FILTER TOOLBAR (ONLY ON SOCIETIES PAGE) ─── */}
        {!isHomePage && (
          <div className="mb-10 pb-6 border-b border-slate-200/80 space-y-4">
            {/* Top Tier: Sleek Horizontal Scrollable Segmented Category Strip */}
            <div className="w-full">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1.5">
                  <span>Filter by Technical Domain</span>
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  {displaySocieties.length} {displaySocieties.length === 1 ? "Chapter" : "Chapters"} Shown
                </span>
              </div>

              {/* Seamless Pill Segment Strip */}
              <div className="bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/90 shadow-inner overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex items-center gap-1.5 min-w-max">
                  {[
                    { id: "all", label: "All Societies", count: ENRICHED_SOCIETIES.length, icon: "🌐" },
                    { id: "computing", label: "Computing & AI", count: 2, icon: "💻" },
                    { id: "power", label: "Power & Hardware", count: 2, icon: "⚡" },
                    { id: "comms", label: "Comms & Sensing", count: 2, icon: "📡" },
                    { id: "health", label: "Healthcare & Bio", count: 1, icon: "🧬" },
                    { id: "diversity", label: "Diversity & WIE", count: 1, icon: "👑" },
                  ].map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`group px-3.5 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 select-none ${isSelected
                            ? "bg-gradient-to-r from-[#002855] to-blue-700 text-white shadow-md shadow-blue-950/20 scale-[1.02]"
                            : "bg-white/90 text-slate-700 hover:bg-white hover:text-slate-950 border border-slate-200/80 hover:border-slate-300 shadow-2xs"
                          }`}
                      >
                        <span className="text-sm shrink-0 drop-shadow-xs">{cat.icon}</span>
                        <span className="whitespace-nowrap">{cat.label}</span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-colors ${isSelected
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                            }`}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Tier: Search and Quick Leadership Links */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search societies, keywords, fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to="/societies/office-bearers"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#002855] to-blue-700 hover:from-[#001c3d] hover:to-blue-800 text-white font-black text-xs uppercase tracking-wider transition-all rounded-xl shadow-md whitespace-nowrap hover:scale-102 cursor-pointer"
                >
                  <Crown size={14} className="text-amber-400" />
                  <span>Society Bearers</span>
                </Link>
                <Link
                  to="/office-bearers"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all rounded-xl shadow-2xs whitespace-nowrap cursor-pointer"
                >
                  <span>Branch Bearers</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ─── SOCIETIES GRID ─── */}
        {displaySocieties.length === 0 ? (<div className="py-20 text-center bg-white border border-slate-200 rounded-3xl p-8">
          <Layers size={48} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-serif text-xl font-bold text-slate-800">No Societies Found</h3>
          <p className="text-slate-500 text-xs mt-1">Try clearing your search query or selecting a different category.</p>
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displaySocieties.map((society, idx) => {
            const logo = logoMapping[society.slug];
            const internalUrl = internalSocietyLinks[society.slug] || `/societies/${society.slug}`;
            const externalUrl = externalSocietyLinks[society.slug] || "https://www.ieee.org/";
            return (<motion.div key={society.slug || idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: (idx % 6) * 0.05 }} className="group relative rounded-3xl overflow-hidden bg-white border-2 border-slate-200/90 hover:border-[#00629b] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              {/* Top Chapter Header Banner */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Logo and Badges */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-white border-2 border-slate-100 shadow-sm p-1.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                      {logo ? (<img src={logo} alt={`${society.name} logo`} className="w-full h-full object-contain" />) : (<div className="w-full h-full rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                        {society.shortCode}
                      </div>)}
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-black uppercase tracking-wider ${society.badgeBg}`}>
                        {society.shortCode}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active Chapter
                      </span>
                    </div>
                  </div>

                  {/* Society Name & Tagline */}
                  <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors leading-snug mb-1.5">
                    {society.name}
                  </h3>

                  <p className="text-xs font-bold text-slate-600 mb-2 line-clamp-1">
                    {society.tagline}
                  </p>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {society.description}
                  </p>

                  {/* Technical Pillar Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {society.tags.slice(0, 2).map((tag) => (<span key={tag} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200/80">
                      {tag}
                    </span>))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link to={internalUrl} className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-blue-700 hover:text-blue-900 group-hover:translate-x-0.5 transition-all">
                      <span>Explore Hub</span>
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to={`/societies/office-bearers?society=${society.slug}`} className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-cyan-700 transition-colors" title="View Office Bearers">
                      <Crown size={12} className="text-amber-500" />
                      <span>Bearers</span>
                    </Link>
                  </div>

                  <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors" title="Global IEEE Portal" onClick={(e) => e.stopPropagation()}>
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </motion.div>);
          })}
        </div>)}

        {/* ─── EXPLORE ALL SOCIETIES PROMINENT BUTTON (ONLY ON HOME/LANDING PAGE) ─── */}
        {isHomePage && (<div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/societies" className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#002855] hover:bg-[#001c3d] text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-105 group">
            <span>Explore All 8 Technical Societies &amp; Chapters</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform text-cyan-400" />
          </Link>
          <Link to="/office-bearers" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all shadow-xs">
            <Crown size={15} className="text-amber-500" />
            <span>View All Office Bearers</span>
          </Link>
        </div>)}

        {/* ─── MEMBERSHIP REGISTRATION CTA BANNER (DATABASE-DRIVEN) ─── */}
        <div className="mt-16 bg-gradient-to-r from-slate-950 via-[#002855] to-blue-900 text-white rounded-3xl p-8 sm:p-12 md:p-14 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
              <Zap size={13} className="text-amber-400" />
              <span>{ctaBadge}</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
              {ctaTitle}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base mt-2.5 leading-relaxed font-medium">
              {ctaSubtitle}
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3.5 shrink-0 w-full md:w-auto">
            <Link to="/membership-registration" className="px-7 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all text-center">
              Register Membership
            </Link>
            <Link to="/office-bearers" className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider rounded-xl backdrop-blur-md transition-all text-center">
              View Leadership
            </Link>
          </div>
        </div>

      </div>
  </section>);
};
export default Societies;
