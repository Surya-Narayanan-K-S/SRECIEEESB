import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, Calendar, MapPin, Building2, Award, Sparkles, Printer, Search, X, Loader2, CheckCircle2, Maximize2, BookOpen, Images, Image as ImageIcon, Share2, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw, LayoutGrid, Columns, Tv, Check, Tag, ShieldCheck, GraduationCap } from "lucide-react";
// Helper to resolve Supabase storage images or external HTTP URLs
export const resolveReportImage = (url) => {
    if (!url || !url.trim())
        return "";
    const target = url.trim();
    if (target.startsWith("http://") ||
        target.startsWith("https://") ||
        target.startsWith("data:") ||
        target.startsWith("/")) {
        return target;
    }
    const { data } = supabase.storage.from("reports").getPublicUrl(target);
    if (data?.publicUrl)
        return data.publicUrl;
    const { data: actData } = supabase.storage.from("activities").getPublicUrl(target);
    return actData?.publicUrl || target;
};
export const EventReportsPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeReportId, setActiveReportId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedYear, setSelectedYear] = useState("ALL");
    const [galleryViewMode, setGalleryViewMode] = useState("masonry");
    const [cinemaPhotoIndex, setCinemaPhotoIndex] = useState(0);
    const [copiedLink, setCopiedLink] = useState(false);
    // Lightbox Modal state
    const [lightbox, setLightbox] = useState({
        isOpen: false,
        images: [],
        activeIndex: 0,
        zoom: 1,
        title: ""
    });
    // Extract all photos attached to an item
    const getReportPhotos = useCallback((item) => {
        if (!item)
            return [];
        const list = [];
        if (item.photo_urls && item.photo_urls.trim()) {
            try {
                if (item.photo_urls.startsWith("[") && item.photo_urls.endsWith("]")) {
                    const parsed = JSON.parse(item.photo_urls);
                    if (Array.isArray(parsed))
                        list.push(...parsed.filter(Boolean));
                }
                else {
                    list.push(...item.photo_urls.split(",").map((s) => s.trim()).filter(Boolean));
                }
            }
            catch {
                list.push(...item.photo_urls.split(",").map((s) => s.trim()).filter(Boolean));
            }
        }
        if (item.photo_url && item.photo_url.trim() && !list.includes(item.photo_url.trim())) {
            list.unshift(item.photo_url.trim());
        }
        return Array.from(new Set(list)).map(resolveReportImage);
    }, []);
    // Extract all certificate URLs attached to an item
    const getReportCertificates = useCallback((item) => {
        if (!item || !item.certificate_urls)
            return [];
        const list = [];
        const raw = item.certificate_urls.trim();
        if (raw) {
            try {
                if (raw.startsWith("[") && raw.endsWith("]")) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed))
                        list.push(...parsed.filter(Boolean));
                }
                else {
                    list.push(...raw.split(",").map((s) => s.trim()).filter(Boolean));
                }
            }
            catch {
                list.push(...raw.split(",").map((s) => s.trim()).filter(Boolean));
            }
        }
        return Array.from(new Set(list)).map(resolveReportImage);
    }, []);
    // Fetch reports from Supabase `event_reports` table
    const fetchReports = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("event_reports")
                .select("*")
                .order("id", { ascending: false });
            if (error) {
                console.warn("Could not fetch event_reports:", error.message);
                setReports([]);
                setActiveReportId(null);
            }
            else if (data && data.length > 0) {
                setReports(data);
                setActiveReportId((prev) => {
                    if (prev && data.some((d) => d.id === prev))
                        return prev;
                    return data[0].id;
                });
            }
            else {
                setReports([]);
                setActiveReportId(null);
            }
        }
        catch (err) {
            console.warn("Error in fetchReports:", err);
            setReports([]);
            setActiveReportId(null);
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        fetchReports();
        // Supabase Realtime listener on `event_reports` table
        const channel = supabase
            .channel("event-reports-realtime-sync")
            .on("postgres_changes", { event: "*", schema: "public", table: "event_reports" }, () => {
            fetchReports();
        })
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchReports]);
    // Derived active report
    const activeReport = useMemo(() => {
        if (!reports.length)
            return null;
        return reports.find((r) => r.id === activeReportId) || reports[0];
    }, [reports, activeReportId]);
    // Available categories & years for filtering
    const categories = useMemo(() => {
        const set = new Set();
        reports.forEach((r) => {
            if (r.category)
                set.add(r.category);
        });
        return ["ALL", ...Array.from(set)];
    }, [reports]);
    const academicYears = useMemo(() => {
        const set = new Set();
        reports.forEach((r) => {
            if (r.academic_year)
                set.add(r.academic_year);
        });
        return ["ALL", ...Array.from(set)];
    }, [reports]);
    // Filtered reports list for search and chips
    const filteredReports = useMemo(() => {
        return reports.filter((r) => {
            const matchCategory = selectedCategory === "ALL" || r.category === selectedCategory;
            const matchYear = selectedYear === "ALL" || r.academic_year === selectedYear;
            const q = searchQuery.toLowerCase().trim();
            const matchSearch = !q ||
                r.title?.toLowerCase().includes(q) ||
                r.venue?.toLowerCase().includes(q) ||
                r.organized_by?.toLowerCase().includes(q) ||
                r.category?.toLowerCase().includes(q) ||
                r.event_overview?.toLowerCase().includes(q) ||
                r.key_highlights?.toLowerCase().includes(q);
            return matchCategory && matchYear && matchSearch;
        });
    }, [reports, selectedCategory, selectedYear, searchQuery]);
    // Active report parsed items
    const activePhotos = useMemo(() => getReportPhotos(activeReport), [activeReport, getReportPhotos]);
    const activeCertificates = useMemo(() => getReportCertificates(activeReport), [activeReport, getReportCertificates]);
    const highlightsList = useMemo(() => {
        if (!activeReport?.key_highlights)
            return [];
        return activeReport.key_highlights
            .split("\n")
            .map((line) => line.replace(/^[•\-*]\s*/, "").trim())
            .filter((line) => line.length > 0);
    }, [activeReport?.key_highlights]);
    // Total statistics across all reports
    const stats = useMemo(() => {
        const totalPhotos = reports.reduce((acc, r) => acc + getReportPhotos(r).length, 0);
        const totalCerts = reports.reduce((acc, r) => acc + getReportCertificates(r).length, 0) + reports.length * 2;
        return {
            reportsCount: reports.length,
            photosCount: totalPhotos,
            certificatesCount: totalCerts,
            categoriesCount: new Set(reports.map((r) => r.category).filter(Boolean)).size || 1
        };
    }, [reports, getReportPhotos, getReportCertificates]);
    // Open Lightbox handler
    const openLightbox = (images, index = 0, title = "") => {
        setLightbox({
            isOpen: true,
            images,
            activeIndex: index,
            zoom: 1,
            title: title || activeReport?.title || "Event Photo"
        });
    };
    const closeLightbox = () => {
        setLightbox((prev) => ({ ...prev, isOpen: false, zoom: 1 }));
    };
    const nextLightboxImage = useCallback(() => {
        setLightbox((prev) => ({
            ...prev,
            activeIndex: (prev.activeIndex + 1) % prev.images.length,
            zoom: 1
        }));
    }, []);
    const prevLightboxImage = useCallback(() => {
        setLightbox((prev) => ({
            ...prev,
            activeIndex: (prev.activeIndex - 1 + prev.images.length) % prev.images.length,
            zoom: 1
        }));
    }, []);
    // Keyboard navigation for Lightbox
    useEffect(() => {
        if (!lightbox.isOpen)
            return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape")
                closeLightbox();
            if (e.key === "ArrowRight")
                nextLightboxImage();
            if (e.key === "ArrowLeft")
                prevLightboxImage();
            if (e.key === "+" || e.key === "=")
                setLightbox((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.25, 3) }));
            if (e.key === "-")
                setLightbox((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.25, 0.75) }));
            if (e.key === "0")
                setLightbox((prev) => ({ ...prev, zoom: 1 }));
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightbox.isOpen, nextLightboxImage, prevLightboxImage]);
    // Handle Share link
    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2500);
        }
    };
    return (<div className="min-h-screen bg-[#000814] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* ─── AMBIENT NEON FLARE MESH ─── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden select-none -z-0">
        <div className="absolute -top-32 -left-20 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[160px]"/>
        <div className="absolute top-1/3 -right-20 w-[550px] h-[550px] bg-blue-600/15 rounded-full blur-[160px]"/>
        <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[160px]"/>
      </div>

      {/* Universal Navbar */}
      <div className="print:hidden relative z-20">
        <Navbar />
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 relative z-10">
        {/* ─── PAGE HERO BANNER & STATS ─── */}
        <section className="print:hidden relative rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-[#00142e]/90 via-[#000e24]/90 to-[#000814]/95 backdrop-blur-2xl p-6 sm:p-10 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <FileText size={320} className="text-cyan-400"/>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Sparkles size={14} className="text-cyan-400 animate-pulse"/>
                <span>Official Activity &amp; Congress Archives</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <ShieldCheck size={14}/>
                <span>STB 28191 • IEEE Madras Section</span>
              </div>
            </div>

            <div className="space-y-3 max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white font-serif leading-tight">
                Activity Reports &amp; Congress Proceedings
              </h1>
              <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-3xl leading-relaxed font-light">
                Comprehensive documented proceedings, executive summaries, photographic archives, and recognition accolades of official IEEE Student Branch activities at Sri Ramakrishna Engineering College.
              </p>
            </div>

            {/* Live KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">
                  Published Reports
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {stats.reportsCount.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">
                  Photos Documented
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {stats.photosCount.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">
                  Honors &amp; Seals
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                  {stats.certificatesCount.toString().padStart(2, "0")}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-300 block">
                  Activity Categories
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {stats.categoriesCount.toString().padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* ─── SEARCH & FILTER CONTROLS ─── */}
            <div className="pt-2 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input type="text" placeholder="Search by event title, venue, organizer, key learnings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#001026] border border-white/15 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition-colors"/>
                {searchQuery && (<button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white">
                    <X size={16}/>
                  </button>)}
              </div>

              {/* Category Dropdown/Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
                {categories.map((cat) => (<button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 cursor-pointer ${selectedCategory === cat
                ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 font-black"
                : "bg-white/[0.05] text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"}`}>
                    {cat === "ALL" ? "All Categories" : cat}
                  </button>))}
              </div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading ? (<div className="p-20 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4 shadow-xl backdrop-blur-xl">
            <Loader2 size={44} className="mx-auto text-cyan-400 animate-spin"/>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest font-mono">
              Loading Official Event Archives from Database...
            </h3>
          </div>) : reports.length === 0 ? (
        /* Empty State */
        <div className="p-16 sm:p-20 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-5 shadow-xl max-w-3xl mx-auto backdrop-blur-xl">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/30 flex items-center justify-center mx-auto">
              <FileText size={32}/>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase text-white font-serif">
                No Event Reports Published Yet
              </h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                No published event or congress reports are currently in the database. When an administrator creates and publishes a report in the Admin Dashboard, it will automatically appear here with full photography and certificates.
              </p>
            </div>
          </div>) : filteredReports.length === 0 ? (
        /* Filter No Match State */
        <div className="p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
            <p className="text-base text-slate-300 font-medium">
              No reports matched your search query <span className="text-cyan-400 font-mono">"{searchQuery}"</span> or filter.
            </p>
            <button type="button" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
                setSelectedYear("ALL");
            }} className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 text-xs font-bold uppercase tracking-wider">
              Reset Filters
            </button>
          </div>) : activeReport ? (<>
            {/* ─── EVENT SELECTOR STRIP (CAROUSEL / TABS) ─── */}
            <div className="print:hidden space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-cyan-400"/>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Select Event Dossier ({filteredReports.length} Available)
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Active ID: #{activeReport.id}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredReports.map((rep) => {
                const repPhotos = getReportPhotos(rep);
                const isSelected = activeReport.id === rep.id;
                return (<motion.button key={rep.id} type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => {
                        setActiveReportId(rep.id);
                        setCinemaPhotoIndex(0);
                    }} className={`text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3 relative overflow-hidden cursor-pointer ${isSelected
                        ? "bg-gradient-to-r from-cyan-950/80 to-[#001c3d] border-cyan-400/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400"
                        : "bg-white/[0.03] border-white/10 hover:bg-white/[0.07] hover:border-white/20"}`}>
                      {/* Event thumbnail preview */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-white/10 shrink-0 flex items-center justify-center relative">
                        {repPhotos[0] ? (<img src={repPhotos[0]} alt={rep.title} className="w-full h-full object-cover"/>) : (<FileText size={20} className="text-slate-500"/>)}
                        {repPhotos.length > 0 && (<span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-cyan-300 font-bold">
                            {repPhotos.length}p
                          </span>)}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                            {rep.category || "Report"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {rep.date}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-snug">
                          {rep.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {rep.venue}
                        </p>
                      </div>

                      {isSelected && (<div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 animate-ping"/>)}
                    </motion.button>);
            })}
              </div>
            </div>

            {/* ─── ACTIVE REPORT HERO DOSSIER HEADER ─── */}
            <article className="space-y-10">
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#001838] via-[#00244d] to-[#001026] text-white p-6 sm:p-10 md:p-12 shadow-2xl border border-blue-800/40 space-y-6">
                <div className="absolute -right-20 -top-20 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"/>
                <div className="absolute right-1/3 -bottom-20 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"/>

                <div className="relative z-10 space-y-6">
                  {/* Top Badges & Action Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-300/30 text-cyan-200 text-xs font-black uppercase tracking-wider">
                        <Sparkles size={13} className="text-cyan-300"/>
                        <span>Official IEEE Activity Report</span>
                      </span>
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold">
                        {activeReport.category || "Hub Congress"}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 size={13}/>
                        <span>Verified by IEEE Madras Section</span>
                      </span>
                      {activeReport.academic_year && (<span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold font-mono">
                          AY {activeReport.academic_year}
                        </span>)}
                    </div>

                    {/* Action buttons */}
                    <div className="print:hidden flex items-center gap-2">
                      <button type="button" onClick={handleShare} className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer" title="Copy Share Link">
                        {copiedLink ? <Check size={14} className="text-emerald-400"/> : <Share2 size={14}/>}
                        <span>{copiedLink ? "Link Copied!" : "Share"}</span>
                      </button>

                      <button type="button" onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all cursor-pointer">
                        <Printer size={14}/>
                        <span>Print Dossier</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Event Title */}
                  <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight font-serif">
                    {activeReport.title}
                  </h2>

                  {/* Metadata Info Ribbon */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0 text-cyan-300">
                        <Calendar size={20}/>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-cyan-200 tracking-wider block">
                          Event Date
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {activeReport.date}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0 text-cyan-300">
                        <MapPin size={20}/>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase text-cyan-200 tracking-wider block">
                          Venue Location
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white truncate block">
                          {activeReport.venue}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center shrink-0 text-cyan-300">
                        <Building2 size={20}/>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-cyan-200 tracking-wider block">
                          Organized / Hosted By
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-white">
                          {activeReport.organized_by}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── FULL UNCLIPPED PHOTO GALLERY SECTION ─── */}
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                      <Images size={22}/>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-serif tracking-tight">
                        Event Photo Gallery ({activePhotos.length} High-Res Photos)
                      </h3>
                      <p className="text-xs text-slate-400">
                        Showing full uncropped event photography without clipping. Click any photo to inspect in full resolution.
                      </p>
                    </div>
                  </div>

                  {/* Gallery Layout Switcher */}
                  {activePhotos.length > 0 && (<div className="print:hidden flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.05] border border-white/10 self-start sm:self-auto">
                      <button type="button" onClick={() => setGalleryViewMode("masonry")} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${galleryViewMode === "masonry"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"}`} title="Natural Full-Height Masonry (100% Uncropped)">
                        <Columns size={14}/>
                        <span className="hidden sm:inline">Natural Full</span>
                      </button>

                      <button type="button" onClick={() => setGalleryViewMode("framed")} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${galleryViewMode === "framed"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"}`} title="Showcase Framed Grid">
                        <LayoutGrid size={14}/>
                        <span className="hidden sm:inline">Framed Grid</span>
                      </button>

                      <button type="button" onClick={() => setGalleryViewMode("cinema")} className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${galleryViewMode === "cinema"
                    ? "bg-cyan-500 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"}`} title="Cinema Spotlight View">
                        <Tv size={14}/>
                        <span className="hidden sm:inline">Cinema Spotlight</span>
                      </button>
                    </div>)}
                </div>

                {activePhotos.length > 0 ? (<>
                    {/* MODE 1: NATURAL MASONRY FLOW (100% Full Uncropped Proportions) */}
                    {galleryViewMode === "masonry" && (<div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-5">
                        {activePhotos.map((photoUrl, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} onClick={() => openLightbox(activePhotos, idx, `${activeReport.title} - Photo #${idx + 1}`)} className="break-inside-avoid relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#00142e] to-[#000c1e] border border-white/10 hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group cursor-pointer">
                            {/* Ambient image container with 100% full view */}
                            <div className="relative w-full p-2.5">
                              <img src={photoUrl} alt={`Event moment ${idx + 1} - ${activeReport.title}`} className="w-full h-auto object-contain rounded-2xl transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy"/>

                              {/* Subtle glass badges */}
                              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-cyan-300 font-mono font-bold uppercase border border-white/15">
                                {idx === 0 ? "Featured Moment" : `Photo #${idx + 1}`}
                              </div>

                              <div className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/15 shadow-md">
                                <Maximize2 size={14} className="text-cyan-300"/>
                              </div>
                            </div>

                            {/* Card Footer Caption */}
                            <div className="px-4 py-3 bg-[#001026]/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                              <span className="font-bold text-[11px] truncate text-white">
                                {idx === 0 ? "Official Delegation / Stage" : `Congress Moment ${idx + 1}`}
                              </span>
                              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                                Full View
                              </span>
                            </div>
                          </motion.div>))}
                      </div>)}

                    {/* MODE 2: FRAMED SHOWCASE GRID (Guaranteed Full Image within Uniform Height Cards) */}
                    {galleryViewMode === "framed" && (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {activePhotos.map((photoUrl, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.05 }} onClick={() => openLightbox(activePhotos, idx, `${activeReport.title} - Photo #${idx + 1}`)} className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#00142e] to-[#000a17] border border-white/10 hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group cursor-pointer flex flex-col justify-between">
                            <div className="h-72 w-full p-3 flex items-center justify-center relative overflow-hidden bg-[#000e24]">
                              {/* Background soft ambient blur */}
                              <img src={photoUrl} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-xl opacity-25 scale-125"/>

                              {/* Full, unclipped crisp image in front */}
                              <img src={photoUrl} alt={`Event moment ${idx + 1}`} className="relative z-10 max-h-full max-w-full object-contain rounded-xl drop-shadow-xl group-hover:scale-105 transition-transform duration-300"/>

                              <div className="absolute top-4 left-4 z-20 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-cyan-300 font-mono font-bold uppercase border border-white/15">
                                #{idx + 1}
                              </div>

                              <div className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/70 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity border border-white/15">
                                <Maximize2 size={14} className="text-cyan-300"/>
                              </div>
                            </div>

                            <div className="px-4 py-3 bg-[#001026] border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                              <span className="font-bold text-[11px] truncate text-white">
                                {idx === 0 ? "Hub Congress Delegation" : `Event Scene ${idx + 1}`}
                              </span>
                              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                                Full View
                              </span>
                            </div>
                          </motion.div>))}
                      </div>)}

                    {/* MODE 3: CINEMA SPOTLIGHT CAROUSEL */}
                    {galleryViewMode === "cinema" && (<div className="space-y-4">
                        <div className="relative rounded-3xl overflow-hidden bg-[#000c1e] border border-cyan-500/30 shadow-2xl h-[420px] sm:h-[520px] md:h-[580px] flex items-center justify-center p-4">
                          {/* Ambient background blur */}
                          {activePhotos[cinemaPhotoIndex] && (<img src={activePhotos[cinemaPhotoIndex]} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-125"/>)}

                          {/* Full active image */}
                          <AnimatePresence mode="wait">
                            {activePhotos[cinemaPhotoIndex] && (<motion.img key={cinemaPhotoIndex} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.25 }} src={activePhotos[cinemaPhotoIndex]} alt={`Cinema view photo ${cinemaPhotoIndex + 1}`} onClick={() => openLightbox(activePhotos, cinemaPhotoIndex)} className="relative z-10 max-h-full max-w-full object-contain rounded-2xl cursor-pointer drop-shadow-2xl hover:scale-[1.01] transition-transform"/>)}
                          </AnimatePresence>

                          {/* Previous & Next overlay buttons */}
                          <button type="button" onClick={() => setCinemaPhotoIndex((prev) => (prev - 1 + activePhotos.length) % activePhotos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer shadow-lg">
                            <ChevronLeft size={24}/>
                          </button>
                          <button type="button" onClick={() => setCinemaPhotoIndex((prev) => (prev + 1) % activePhotos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-cyan-500 hover:text-slate-950 transition-all cursor-pointer shadow-lg">
                            <ChevronRight size={24}/>
                          </button>

                          {/* Top badge */}
                          <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-xl bg-black/70 backdrop-blur-md text-xs font-mono text-cyan-300 font-bold border border-white/20">
                            Photo {cinemaPhotoIndex + 1} of {activePhotos.length}
                          </div>

                          {/* Fullscreen trigger */}
                          <button type="button" onClick={() => openLightbox(activePhotos, cinemaPhotoIndex)} className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md text-xs font-bold text-white hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-1.5 border border-white/20">
                            <Maximize2 size={13}/> Fullscreen
                          </button>
                        </div>

                        {/* Cinema Thumbnail Strip */}
                        <div className="flex items-center gap-3 overflow-x-auto pb-2">
                          {activePhotos.map((photo, idx) => (<button key={idx} type="button" onClick={() => setCinemaPhotoIndex(idx)} className={`h-20 w-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${cinemaPhotoIndex === idx
                            ? "border-cyan-400 scale-105 shadow-md shadow-cyan-500/20"
                            : "border-white/15 opacity-60 hover:opacity-100"}`}>
                              <img src={photo} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover"/>
                            </button>))}
                        </div>
                      </div>)}
                  </>) : (<div className="p-12 rounded-3xl bg-white/[0.03] border border-white/10 text-center space-y-3 text-slate-400">
                    <ImageIcon size={38} className="mx-auto text-slate-500"/>
                    <p className="text-sm font-bold text-slate-300">
                      No event photographs attached to this report dossier.
                    </p>
                  </div>)}
              </section>

              {/* ─── OFFICIAL ACCOLADES & CERTIFICATES RECOGNITION ─── */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Award size={22}/>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-serif tracking-tight">
                      Official Recognition &amp; Accreditations
                    </h3>
                    <p className="text-xs text-slate-400">
                      Formal accolades conferred by IEEE Madras Section and institutional leadership.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Certificate Card 1: Dr. K. Balamurugan Counselor Honor */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-950/40 via-[#1a1205] to-[#0d0902] border border-amber-500/30 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none text-amber-400">
                      <Award size={160}/>
                    </div>

                    <div className="flex items-start justify-between gap-2 relative z-10">
                      <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
                        <Award size={20} className="text-amber-400"/>
                        <span>Certificate of Appreciation</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-300 text-[10px] font-black font-mono uppercase border border-amber-400/30">
                        IEEE 2024
                      </span>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <h4 className="font-serif text-lg sm:text-xl font-black text-amber-100">
                        Dr. K. BALAMURUGAN, SB Counsellor
                      </h4>
                      <p className="text-xs font-bold text-amber-300/80 uppercase tracking-wider">
                        Sri Ramakrishna Engineering College, Coimbatore
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                        Conferred in recognition of dedicated service and distinguished guidance as the IEEE Student Branch Counselor during the year 2024.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-amber-500/20 flex flex-wrap items-center justify-between text-xs text-amber-300/70 font-bold relative z-10">
                      <span>Dr. S. Radha (Secretary)</span>
                      <span>Dr. P. Sakthivel (Chairman)</span>
                    </div>
                  </div>

                  {/* Certificate Card 2: Student Branch STB 28191 Honor */}
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-950/40 via-[#001c3d]/60 to-[#000e24] border border-cyan-500/30 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none text-cyan-400">
                      <GraduationCap size={160}/>
                    </div>

                    <div className="flex items-start justify-between gap-2 relative z-10">
                      <div className="flex items-center gap-2 text-cyan-300 font-black text-xs uppercase tracking-wider">
                        <ShieldCheck size={20} className="text-cyan-400"/>
                        <span>Student Branch Activity Honor</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-400/20 text-cyan-200 text-[10px] font-black font-mono uppercase border border-cyan-400/30">
                        STB 28191
                      </span>
                    </div>

                    <div className="space-y-2 relative z-10">
                      <h4 className="font-serif text-lg sm:text-xl font-black text-white">
                        SRI RAMAKRISHNA ENGINEERING COLLEGE
                      </h4>
                      <p className="text-xs font-bold text-cyan-300/80 uppercase tracking-wider">
                        IEEE Student Branch STB 28191
                      </p>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                        Awarded for organizing exemplary Student Branch activities towards the advancement of IEEE and Engineering Profession during the year 2024.
                      </p>
                    </div>

                    <div className="pt-4 border-t border-cyan-500/20 flex flex-wrap items-center justify-between text-xs text-cyan-300/70 font-bold relative z-10">
                      <span>IEEE Madras Section</span>
                      <span className="text-cyan-300">Advancement of Engineering</span>
                    </div>
                  </div>
                </div>

                {/* Additional Attached Certificate Photos */}
                {activeCertificates.length > 0 && (<div className="space-y-4 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      Attached Document Scans ({activeCertificates.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {activeCertificates.map((certUrl, idx) => (<div key={idx} onClick={() => openLightbox(activeCertificates, idx, "Attached Document / Certificate")} className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 hover:border-amber-400/50 p-2 group cursor-pointer transition-all">
                          <img src={certUrl} alt={`Certificate ${idx + 1}`} className="w-full h-auto object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"/>
                          <div className="absolute top-4 right-4 p-1.5 rounded-lg bg-black/70 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Maximize2 size={14}/>
                          </div>
                        </div>))}
                    </div>
                  </div>)}
              </section>

              {/* ─── EXECUTIVE OVERVIEW & NARRATIVE ─── */}
              {activeReport.event_overview && (<section className="p-6 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 shadow-xl backdrop-blur-xl space-y-4">
                  <div className="flex items-center gap-3 text-cyan-400">
                    <BookOpen size={24}/>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-serif text-white">
                      Event Overview &amp; Executive Summary
                    </h3>
                  </div>

                  <div className="relative pl-6 sm:pl-8 border-l-4 border-cyan-500 text-slate-200 text-sm sm:text-base leading-relaxed space-y-3 font-light">
                    <p className="first-letter:text-4xl first-letter:font-serif first-letter:font-black first-letter:text-cyan-400 first-letter:mr-2 first-letter:float-left">
                      {activeReport.event_overview}
                    </p>
                  </div>
                </section>)}

              {/* ─── KEY HIGHLIGHTS & CORE LEARNINGS ─── */}
              {highlightsList.length > 0 && (<section className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
                      <Sparkles size={22}/>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-serif tracking-tight">
                        Key Highlights &amp; Strategic Learnings
                      </h3>
                      <p className="text-xs text-slate-400">
                        Critical takeaways and direct knowledge gained during the activity.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {highlightsList.map((highlight, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: idx * 0.05 }} className="p-6 rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-cyan-400/50 shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 space-y-4 flex flex-col justify-between group">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-400 font-mono font-black text-sm flex items-center justify-center border border-cyan-400/30 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                            0{idx + 1}
                          </div>
                          <CheckCircle2 size={18} className="text-emerald-400"/>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                          {highlight}
                        </p>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <span>IEEE Focus Objective</span>
                          <span className="text-cyan-400">Active</span>
                        </div>
                      </motion.div>))}
                  </div>
                </section>)}

              {/* ─── CONCLUDING REMARKS & IMPACT ─── */}
              {activeReport.conclusion_text && (<section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-[#001838] to-[#00244d] text-white shadow-2xl space-y-4 border border-blue-800/40 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-cyan-300 text-xs font-black uppercase tracking-widest">
                    <Award size={18}/>
                    <span>Broader Professional Impact &amp; Roadmap</span>
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed text-slate-200 font-light">
                    {activeReport.conclusion_text}
                  </p>
                  <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between text-xs text-cyan-200">
                    <span className="font-bold">IEEE Student Branch SREC (STB 28191)</span>
                    <span className="font-mono text-[11px] text-slate-400">Advancing Technology for Humanity</span>
                  </div>
                </section>)}
            </article>
          </>) : null}

        {/* ─── PRO-GRADE FULLSCREEN LIGHTBOX MODAL ─── */}
        <AnimatePresence>
          {lightbox.isOpen && lightbox.images.length > 0 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 select-none">
              {/* Lightbox Top Control Bar */}
              <div className="flex items-center justify-between gap-4 z-20 pb-3 border-b border-white/15">
                <div className="min-w-0">
                  <span className="text-xs font-mono text-cyan-300 font-bold block">
                    Photo {lightbox.activeIndex + 1} of {lightbox.images.length}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate max-w-md">
                    {lightbox.title}
                  </h4>
                </div>

                {/* Toolbar Buttons */}
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setLightbox((prev) => ({ ...prev, zoom: Math.min(prev.zoom + 0.25, 3) }))} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer" title="Zoom In (+)">
                    <ZoomIn size={18}/>
                  </button>

                  <button type="button" onClick={() => setLightbox((prev) => ({ ...prev, zoom: Math.max(prev.zoom - 0.25, 0.75) }))} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer" title="Zoom Out (-)">
                    <ZoomOut size={18}/>
                  </button>

                  {lightbox.zoom !== 1 && (<button type="button" onClick={() => setLightbox((prev) => ({ ...prev, zoom: 1 }))} className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer" title="Reset Zoom (0)">
                      <RotateCcw size={14}/> 100%
                    </button>)}

                  <a href={lightbox.images[lightbox.activeIndex]} download={`IEEE_SREC_Event_Photo_${lightbox.activeIndex + 1}.jpg`} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors" title="Open Full Image">
                    <Download size={18}/>
                  </a>

                  <button type="button" onClick={closeLightbox} className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 border border-red-500/40 text-red-200 hover:text-white transition-colors cursor-pointer" title="Close (Esc)">
                    <X size={20}/>
                  </button>
                </div>
              </div>

              {/* Lightbox Center Stage (100% Full Uncropped Image View) */}
              <div className="relative flex-1 flex items-center justify-center overflow-hidden p-2">
                <motion.img key={lightbox.activeIndex} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: lightbox.zoom }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} src={lightbox.images[lightbox.activeIndex]} alt="Full preview" style={{ transform: `scale(${lightbox.zoom})` }} className="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl transition-transform duration-150"/>

                {/* Left / Right Nav Arrows */}
                {lightbox.images.length > 1 && (<>
                    <button type="button" onClick={prevLightboxImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/60 hover:bg-cyan-500 hover:text-slate-950 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl">
                      <ChevronLeft size={28}/>
                    </button>
                    <button type="button" onClick={nextLightboxImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-black/60 hover:bg-cyan-500 hover:text-slate-950 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl">
                      <ChevronRight size={28}/>
                    </button>
                  </>)}
              </div>

              {/* Lightbox Bottom Thumbnail Filmstrip */}
              {lightbox.images.length > 1 && (<div className="z-20 pt-3 border-t border-white/15 flex items-center justify-center gap-2 overflow-x-auto pb-1">
                  {lightbox.images.map((img, i) => (<button key={i} type="button" onClick={() => setLightbox((prev) => ({ ...prev, activeIndex: i, zoom: 1 }))} className={`h-14 w-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${lightbox.activeIndex === i
                        ? "border-cyan-400 scale-105 shadow-md shadow-cyan-500/30"
                        : "border-white/20 opacity-50 hover:opacity-100"}`}>
                      <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover"/>
                    </button>))}
                </div>)}
            </motion.div>)}
        </AnimatePresence>
      </main>

      {/* Universal Footer */}
      <div className="print:hidden relative z-20">
        <Footer />
      </div>
    </div>);
};
export default EventReportsPage;
