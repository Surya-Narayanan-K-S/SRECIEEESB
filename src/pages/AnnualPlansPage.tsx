import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  CalendarDays,
  Search,
  RefreshCw,
  Table2,
  LayoutList,
  Grid3X3,
  ChevronRight,
  FolderOpen,
  Clock3,
  CheckCircle2,
  Star,
  Download,
  ArrowUpDown,
  Sparkles,
  Loader2,
} from "lucide-react";

type AnnualPlan = {
  id: number;
  s_no: number;
  event: string;
  sub_event: string | null;
  schedule: string;
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 }
  },
};

const AnnualPlansPage = () => {
  const [plans, setPlans] = useState<AnnualPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [viewMode, setViewMode] = useState<"timeline" | "cards" | "table">("timeline");
  const [sortBy, setSortBy] = useState<"s_no" | "event" | "schedule">("s_no");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("annual_plan")
      .select("id, s_no, event, sub_event, schedule")
      .order("s_no", { ascending: true });

    if (error) {
      toast.error("Failed to load annual plans");
      console.error(error);
    } else {
      setPlans((data as AnnualPlan[]) || []);
      setLastUpdated(new Date());
    }
    setLoading(false);
  };

  const months = useMemo(() => {
    const unique = Array.from(new Set(plans.map((item) => item.schedule)));
    return ["All", ...unique.sort()];
  }, [plans]);

  const filteredAndSortedPlans = useMemo(() => {
    const result = plans.filter((plan) => {
      const term = search.toLowerCase();
      return (
        (!term ||
          plan.event.toLowerCase().includes(term) ||
          (plan.sub_event || "").toLowerCase().includes(term) ||
          plan.schedule.toLowerCase().includes(term)) &&
        (selectedMonth === "All" || plan.schedule === selectedMonth)
      );
    });

    result.sort((a, b) => {
      if (sortBy === "s_no") return a.s_no - b.s_no;
      if (sortBy === "event") return a.event.localeCompare(b.event);
      return a.schedule.localeCompare(b.schedule);
    });

    return result;
  }, [plans, search, selectedMonth, sortBy]);

  const totalPlans = plans.length;
  const recurringCount = plans.filter((p) => p.schedule === "Every Month").length;
  const monthCount = new Set(
    plans.filter((p) => p.schedule !== "Every Month").map((p) => p.schedule)
  ).size;

  const exportToCSV = () => {
    if (filteredAndSortedPlans.length === 0) return toast.error("No data to export");

    const csvRows = [
      ["S.No", "Event", "Sub Event", "Schedule"],
      ...filteredAndSortedPlans.map(p => [
        p.s_no.toString(),
        p.event,
        p.sub_event || "",
        p.schedule
      ])
    ];

    const csvContent = csvRows.map(row => row.map(field => `"${field}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IEEE_SREC_Annual_Plans_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Downloaded successfully");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
      
      {/* Background ambient glowing spheres */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-400/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      <Navbar />

      {/* Main Roadmap Dashboard Layout */}
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 relative z-20 flex-grow w-full">
        
        {/* Intro Banner */}
        <div className="text-left mb-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs tracking-wider uppercase mb-4 shadow-sm">
             <CalendarDays size={12} className="animate-pulse" />
             Annual Roadmap
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight mb-4">
             Activity <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Roadmap</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
             Discover the complete official schedule of events, workshops, and initiatives planned by the IEEE Student Branch SREC for the academic year.
          </p>
        </div>

        {/* TOP ROW: Quick Metrics Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md flex items-center justify-between h-[100px]">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Total Scheduled Events</span>
              <p className="text-3xl font-black mt-1 text-white">{totalPlans}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-blue-400 flex items-center justify-center shrink-0">
              <CalendarDays size={18} />
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md flex items-center justify-between h-[100px]">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Months Covered</span>
              <p className="text-3xl font-black mt-1 text-white">{monthCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-emerald-450 flex items-center justify-center shrink-0">
              <Star size={18} />
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md flex items-center justify-between h-[100px]">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Recurring Monthly</span>
              <p className="text-3xl font-black mt-1 text-white">{recurringCount} Events</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-purple-400 flex items-center justify-center shrink-0">
              <Clock3 size={18} />
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: Search, Sort and Filter Control Panel (Full-Width Dashboard) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4 text-left">
          
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm text-slate-800 placeholder-slate-400 transition"
              />
            </div>

            {/* Sort Selector & Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2 text-slate-500 text-sm shrink-0">
                <ArrowUpDown size={14} className="text-blue-600" />
                <select
                  aria-label="Sort by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "s_no" | "event" | "schedule")}
                  className="bg-transparent font-bold outline-none text-slate-700 cursor-pointer w-full text-sm"
                >
                  <option value="s_no">Sort: S.No</option>
                  <option value="event">Sort: Name</option>
                  <option value="schedule">Sort: Schedule</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={fetchPlans}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5"
                >
                  <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
                </button>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5"
                >
                  <Download size={12} /> Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Monthly navigation list wrapping cleanly */}
          <div className="border-t border-slate-50 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Filter by Month</h4>
            <div className="flex flex-wrap gap-1.5">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition ${
                    selectedMonth === m
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM ROW: Main Explorer (Full-Width Timeline/Cards/Table) */}
        <div className="space-y-6">
            
            {/* View Mode Controller */}
            <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-slate-550 uppercase tracking-wider">
                  Showing {filteredAndSortedPlans.length} events
                </span>
              </div>

              <div className="flex bg-slate-100 border border-slate-200/60 rounded-xl p-0.5">
                {[
                  { mode: "timeline", icon: LayoutList, label: "Timeline" },
                  { mode: "cards", icon: Grid3X3, label: "Cards" },
                  { mode: "table", icon: Table2, label: "Table" },
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as "timeline" | "cards" | "table")}
                    className={`px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold text-xs uppercase tracking-wider transition ${
                      viewMode === mode 
                        ? "bg-blue-650 shadow-sm text-white" 
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <Icon size={12} />
                    <span>{mode}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="py-24 bg-white border border-slate-100 rounded-3xl flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                <p className="text-slate-400 font-bold text-xs tracking-widest uppercase animate-pulse">Loading roadmap...</p>
              </div>
            ) : filteredAndSortedPlans.length === 0 ? (
              <div className="py-20 text-center bg-white border border-slate-100 rounded-3xl">
                <CalendarDays className="mx-auto text-slate-350 w-14 h-14 mb-4" />
                <h3 className="text-base font-bold text-slate-800 mb-1">No Schedule Found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  Try adjusting your search terms or month filter select panels.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                
                {/* 1. TIMELINE VIEW */}
                {viewMode === "timeline" && (
                  <motion.div
                    key="timeline"
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="relative space-y-6 pl-4 md:pl-8 text-left"
                  >
                    {/* vertical connector line */}
                    <div className="absolute left-[9px] md:left-4 top-2 bottom-2 w-[2px] bg-slate-200" />
                    
                    {filteredAndSortedPlans.map((plan, index) => (
                      <motion.div
                        key={plan.id}
                        variants={fadeUp}
                        className="relative pl-8 group"
                      >
                        {/* Dot */}
                        <div className="absolute left-[3px] md:left-[10px] top-4 w-3.5 h-3.5 -translate-x-1/2 bg-white border-2 border-slate-350 rounded-full group-hover:border-blue-600 transition-colors z-10">
                          <div className="w-1.5 h-1.5 bg-slate-300 group-hover:bg-blue-600 rounded-full mx-auto my-0.5" />
                        </div>
                        
                        <div className="bg-white border border-slate-100 hover:border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-sm font-bold text-blue-600 shadow-inner shrink-0">
                              {plan.s_no}
                            </div>
                            <div>
                              <h3 className="font-serif font-extrabold text-slate-850 text-lg group-hover:text-blue-650 transition-colors leading-snug">
                                {plan.event}
                              </h3>
                              {plan.sub_event && (
                                <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                                  {plan.sub_event}
                                </p>
                              )}
                            </div>
                          </div>

                          <span className="self-start md:self-center shrink-0 text-[11px] font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50 shadow-sm">
                            {plan.schedule}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* 2. CARDS VIEW */}
                {viewMode === "cards" && (
                  <motion.div
                    key="cards"
                    initial="hidden"
                    animate="visible"
                    variants={stagger}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
                  >
                    {filteredAndSortedPlans.map((plan) => (
                      <motion.div
                        key={plan.id}
                        variants={fadeUp}
                        className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-350 flex flex-col justify-between group relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500 to-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                        
                        <div>
                          <div className="flex justify-between items-center mb-6">
                            <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-sm font-bold text-blue-600 shadow-inner">
                              #{plan.s_no}
                            </div>
                            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-100 text-slate-500 uppercase tracking-wider">{plan.schedule}</span>
                          </div>
                          
                          <h3 className="font-serif font-bold text-lg text-slate-800 group-hover:text-blue-650 transition-colors leading-snug">
                            {plan.event}
                          </h3>
                          {plan.sub_event && (
                            <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                              {plan.sub_event}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* 3. TABLE VIEW */}
                {viewMode === "table" && (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm"
                  >
                    <div className="overflow-x-auto text-left">
                      <table className="w-full text-base">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-450 uppercase tracking-widest">
                            <th className="px-6 py-4">S.No</th>
                            <th className="px-6 py-4">Event Details</th>
                            <th className="px-6 py-4">Schedule</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAndSortedPlans.map((plan) => (
                            <tr key={plan.id} className="border-b border-slate-100 hover:bg-slate-50/40 transition">
                              <td className="px-6 py-4 font-bold text-slate-400">#{plan.s_no}</td>
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-850 text-base leading-snug">{plan.event}</div>
                                {plan.sub_event && (
                                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    <ChevronRight size={12} className="text-blue-500" />
                                    <span>{plan.sub_event}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-block text-[11px] font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100/50">
                                  {plan.schedule}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            )}

          </div>

      </main>

      <Footer />
    </div>
  );
};

export default AnnualPlansPage;