import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import {
  BadgeIndianRupee,
  FileText,
  Mail,
  Layers3,
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  Rows3,
  Loader2,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Database,
  ArrowRightLeft,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from "recharts";

type Funding = {
  id: number;
  s_no?: number;
  title: string;
  submission_type: string;
  description: string | null;
  budget_amount: number | null;
  contact_email: string | null;
  created_at?: string | null;
};

const CHART_COLORS = [
  "#2563eb", // blue-600
  "#0ea5e9", // sky-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // purple-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
];

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const formatCurrency = (value: number | null | undefined) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value?: string | null) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getYearFromFunding = (item: Funding) => {
  if (item.created_at) {
    const d = new Date(item.created_at);
    if (!Number.isNaN(d.getTime())) return String(d.getFullYear());
  }

  const text = `${item.title} ${item.description || ""}`;
  const match = text.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : "Unknown";
};

const FundingsPage = () => {
  const [fundings, setFundings] = useState<Funding[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [sortBy, setSortBy] = useState<"latest" | "highest" | "lowest">("latest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchFundings();
  }, []);

  const fetchFundings = async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("funding_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setErrorMessage(error.message || "Failed to load funding records.");
      toast.error("Failed to load funding records.");
      setFundings([]);
    } else {
      setFundings((data as Funding[]) || []);
      toast.success("Funding records loaded");
    }

    setLoading(false);
  };

  const submissionTypes = useMemo(() => {
    const types = new Set(
      fundings.map((f) => f.submission_type).filter((v): v is string => Boolean(v))
    );
    return ["All", ...Array.from(types).sort()];
  }, [fundings]);

  const years = useMemo(() => {
    const values = Array.from(new Set(fundings.map((f) => getYearFromFunding(f))))
      .filter((y) => y !== "Unknown")
      .sort((a, b) => Number(b) - Number(a));
    return ["All", ...values];
  }, [fundings]);

  const filteredFundings = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    const result = fundings.filter((f) => {
      const matchesSearch =
        !term ||
        f.title?.toLowerCase().includes(term) ||
        f.submission_type?.toLowerCase().includes(term) ||
        (f.description || "").toLowerCase().includes(term) ||
        (f.contact_email || "").toLowerCase().includes(term);

      const matchesType =
        selectedType === "All" || f.submission_type === selectedType;

      const matchesYear =
        selectedYear === "All" || getYearFromFunding(f) === selectedYear;

      return matchesSearch && matchesType && matchesYear;
    });

    result.sort((a, b) => {
      if (sortBy === "highest") return (b.budget_amount || 0) - (a.budget_amount || 0);
      if (sortBy === "lowest") return (a.budget_amount || 0) - (b.budget_amount || 0);

      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });

    return result;
  }, [fundings, searchTerm, selectedType, selectedYear, sortBy]);

  const totalFilteredAmount = useMemo(
    () => filteredFundings.reduce((sum, f) => sum + Number(f.budget_amount || 0), 0),
    [filteredFundings]
  );

  const highestFunding = useMemo(
    () =>
      filteredFundings.reduce((max, curr) => {
        return Number(curr.budget_amount || 0) > Number(max?.budget_amount || 0)
          ? curr
          : max;
      }, filteredFundings[0]),
    [filteredFundings]
  );

  const chartByType = useMemo(() => {
    const grouped = filteredFundings.reduce<Record<string, number>>((acc, item) => {
      const key = item.submission_type || "Other";
      acc[key] = (acc[key] || 0) + Number(item.budget_amount || 0);
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, amount]) => ({
      name,
      amount,
    }));
  }, [filteredFundings]);

  const chartByYear = useMemo(() => {
    const grouped = filteredFundings.reduce<Record<string, number>>((acc, item) => {
      const key = getYearFromFunding(item);
      acc[key] = (acc[key] || 0) + Number(item.budget_amount || 0);
      return acc;
    }, {});

    return Object.entries(grouped)
      .filter(([year]) => year !== "Unknown")
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([year, amount]) => ({
        year,
        amount,
      }));
  }, [filteredFundings]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("All");
    setSelectedYear("All");
    setSortBy("latest");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden flex flex-col">
      
      {/* Background ambient glowing spheres */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[700px] h-[700px] bg-indigo-400/5 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-70 pointer-events-none" />

      <Navbar />

      <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 relative z-20 flex-grow w-full space-y-8">
        
        {/* Intro Header Banner */}
        <div className="text-left max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-bold text-xs tracking-wider uppercase mb-4 shadow-sm">
             <BadgeIndianRupee size={12} className="animate-pulse" />
             Finance Hub
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight mb-4">
             Funding <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Records</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
             Search, filter, and analyze records of rebates, grants, sponsorships, and budget allocations for SREC IEEE events.
          </p>
        </div>

        {/* 1. TOP ROW: Premium Grid Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full pointer-events-none" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Total Records</span>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{filteredFundings.length}</h3>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-blue-600 font-bold">
              <Database size={14} /> Active Database Records
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-3xl p-5 shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full pointer-events-none" />
            <span className="text-xs text-blue-100 font-bold uppercase tracking-widest">Visible Total</span>
            <h3 className="text-3xl font-black mt-2">{formatCurrency(totalFilteredAmount)}</h3>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-blue-100 font-bold">
              <BadgeIndianRupee size={14} /> Aggregated Budget Sum
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Categories</span>
            <h3 className="text-3xl font-black text-slate-800 mt-2">{submissionTypes.length - 1}</h3>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-amber-600 font-bold">
              <Layers3 size={14} /> Distinct Funding Types
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
            <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Highest Record</span>
            <h3 className="text-xl font-black text-slate-800 mt-2 line-clamp-1">
              {highestFunding ? formatCurrency(highestFunding.budget_amount) : "₹0"}
            </h3>
            <div className="mt-4 flex items-center gap-1.5 text-sm text-purple-600 font-bold">
              <TrendingUp size={14} /> Max Single Allocation
            </div>
          </div>

        </div>

        {/* 2. MIDDLE ROW: Control & Filter Dashboard Panel (Full-Width Flex) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row gap-4 lg:items-center justify-between text-left">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, description, email..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm text-slate-800 placeholder-slate-400 transition"
            />
          </div>

          {/* Filters & Actions dropdowns */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            
            <div className="relative select-none shrink-0">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none" size={12} />
              <select
                aria-label="Filter by Category"
                className="pl-8 pr-6 py-2 bg-slate-50 border border-slate-255 rounded-xl outline-none text-sm font-bold text-slate-700 cursor-pointer appearance-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {submissionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All Categories" : type}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative select-none shrink-0">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
              <select
                aria-label="Filter by Year"
                className="pl-8 pr-6 py-2 bg-slate-50 border border-slate-255 rounded-xl outline-none text-sm font-bold text-slate-700 cursor-pointer appearance-none"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year === "All" ? "All Years" : year}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative select-none shrink-0">
              <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450 pointer-events-none" size={12} />
              <select
                aria-label="Sort by"
                className="pl-8 pr-6 py-2 bg-slate-50 border border-slate-255 rounded-xl outline-none text-sm font-bold text-slate-750 cursor-pointer appearance-none"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "latest" | "highest" | "lowest")}
              >
                <option value="latest">Newest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold uppercase transition"
              >
                Reset
              </button>
              <button
                onClick={fetchFundings}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5"
              >
                <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
              </button>
            </div>

          </div>
        </div>

        {/* 3. CHARTS ROW: Category Breakdown & Trend LineChart Side-By-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
          
          {/* Category breakdown bar chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                <BarChart3 size={16} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Breakdown by Category</h3>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Budget Amount allocation per type</p>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartByType}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 600 }} />
                  <Tooltip
                    cursor={{ fill: "rgba(59, 130, 246, 0.01)" }}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: '#334155', fontSize: '10px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 4, 4]} barSize={24}>
                    {chartByType.map((_, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                        className="hover:opacity-85 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Yearly trend line chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                <TrendingUp size={16} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Yearly Funding Trend</h3>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Historical budget allocation trend</p>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartByYear} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 600 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 600 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: '#334155', fontSize: '10px' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ fill: "#1d4ed8", r: 4, strokeWidth: 1.5, stroke: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#1d4ed8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM SECTION: Database Records Directory (Full-Width Grid) */}
        <div className="space-y-6">
          
          {/* Toolbar display mode toggle */}
          <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-550 uppercase tracking-wider">
                Showing {filteredFundings.length} allocations
              </span>
            </div>

            <div className="flex bg-slate-100 border border-slate-200/60 p-0.5 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-blue-650 shadow-sm text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "list"
                    ? "bg-blue-650 shadow-sm text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                aria-label="List view"
              >
                <Rows3 size={14} />
              </button>
            </div>
          </div>

          {/* Database display blocks */}
          {loading ? (
            <div className="py-24 bg-white border border-slate-100 rounded-3xl flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
              <p className="text-slate-400 font-bold text-sm tracking-widest uppercase animate-pulse">Loading database...</p>
            </div>
          ) : errorMessage ? (
            <div className="py-20 text-center bg-white border border-red-150 rounded-3xl px-4">
              <FileText className="mx-auto text-red-500 w-12 h-12 mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">Unable to load records</h3>
              <p className="text-slate-550 text-sm max-w-sm mx-auto">{errorMessage}</p>
              <button onClick={fetchFundings} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold transition hover:bg-red-750">
                Retry
              </button>
            </div>
          ) : filteredFundings.length === 0 ? (
            <div className="py-20 text-center bg-white border border-slate-100 rounded-3xl px-4">
              <FileText className="mx-auto text-slate-350 w-14 h-14 mb-4" />
              <h3 className="text-base font-bold text-slate-800 mb-1">No Records Found</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">
                Try adjusting your search terms or filter configurations.
              </p>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
                  : "flex flex-col gap-4 text-left"
              }
            >
              <AnimatePresence>
                {filteredFundings.map((fund) => (
                  <motion.div
                    key={fund.id}
                    variants={itemVariants}
                    layout
                    className="bg-white border border-slate-100 hover:border-slate-200/80 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between group relative"
                  >
                    {/* Left category accent stripe */}
                    <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-gradient-to-b from-blue-500 to-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <span className="inline-flex items-center rounded-full bg-blue-50 border border-blue-100/50 text-blue-600 px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
                          {fund.submission_type}
                        </span>
                        {fund.s_no && (
                          <span className="text-slate-400 text-xs font-semibold">#{fund.s_no}</span>
                        )}
                      </div>

                      <h3 className="font-serif font-extrabold text-lg text-slate-850 group-hover:text-blue-650 transition-colors leading-snug mb-3">
                        {fund.title}
                      </h3>

                      {fund.description && (
                        <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-3">
                          {fund.description}
                        </p>
                      )}
                      
                      {fund.contact_email && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-2 border-t border-slate-50 pt-3">
                          <Mail size={12} className="text-slate-350" />
                          <span className="truncate">{fund.contact_email}</span>
                        </div>
                      )}
                    </div>

                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Allocated Amount</span>
                      <span className="text-lg font-black text-blue-600">
                        {formatCurrency(fund.budget_amount)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default FundingsPage;