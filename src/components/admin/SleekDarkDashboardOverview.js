import { useState, useMemo } from "react";
import {
  Filter,
  MoreHorizontal,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Layers,
  Users,
  Activity,
  Calendar,
  CreditCard,
  Video,
  Database,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

/**
 * Apple SVG Icon for the Apple Transaction row
 */
const AppleIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 170 170"
    fill="currentColor"
    className={className}
  >
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.83-8.1-12.42-15.07-6.08-9.19-10.96-19.86-14.64-32.02-3.69-12.16-5.53-23.78-5.53-34.87 0-14.13 3.69-25.79 11.07-34.98 7.38-9.19 16.63-13.88 27.75-14.08 4.8.12 10.12 1.43 15.96 3.93 5.84 2.5 9.61 3.8 11.31 3.9 1.34 0 5.42-1.39 12.24-4.17 6.82-2.78 12.49-4.04 17.01-3.78 13.24 1.03 23.72 6.09 31.44 15.19-11.75 7.15-17.51 16.9-17.29 29.26.23 9.68 3.98 17.65 11.24 23.91 7.26 6.26 15.93 9.77 26.01 10.53-2.34 7.27-5.22 14.86-8.64 22.77zM119.22 33.15c0-7.39 2.65-14.28 7.95-20.67 5.3-6.39 11.83-10.74 19.59-13.06.63 7.61-1.84 14.74-7.41 21.39-5.57 6.65-12.28 10.77-20.13 12.34z" />
  </svg>
);

/**
 * 4-Dots Clover Grid Logo
 */
export const CloverGridIcon = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <rect x="3" y="3" width="7.5" height="7.5" rx="3" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="3" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="3" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="3" />
  </svg>
);

const SleekDarkDashboardOverview = ({
  studentMembers = [],
  activities = [],
  officeRows = [],
  societies = [],
  applications = [],
  onNavigateTab,
}) => {
  // Active hovered month for the dual curve chart (default is June, index 5)
  const [activeMonthIdx, setActiveMonthIdx] = useState(5);
  const [dateFilter, setDateFilter] = useState("Last 7 Days");
  const [showLiveDbToggle, setShowLiveDbToggle] = useState(false);

  // Month data points for spline curve (Jan - Dec)
  const chartPoints = useMemo(() => [
    { month: "Jan", val1: 20, val2: 18, label: "12 Jan", time: "10:15" },
    { month: "Feb", val1: 22, val2: 24, label: "18 Feb", time: "14:20" },
    { month: "Mar", val1: 28, val2: 26, label: "05 Mar", time: "09:40" },
    { month: "Apr", val1: 19, val2: 21, label: "22 Apr", time: "16:05" },
    { month: "May", val1: 25, val2: 23, label: "14 May", time: "11:50" },
    { month: "June", val1: 21, val2: 29, label: "2 June", time: "12:30" }, // Selected point in screenshot
    { month: "July", val1: 30, val2: 27, label: "19 July", time: "15:10" },
    { month: "Aug", val1: 26, val2: 24, label: "08 Aug", time: "13:25" },
    { month: "Sept", val1: 27, val2: 29, label: "11 Sept", time: "17:45" },
    { month: "Oct", val1: 39, val2: 36, label: "26 Oct", time: "18:00" },
    { month: "Nov", val1: 33, val2: 35, label: "04 Nov", time: "08:30" },
    { month: "Dec", val1: 32, val2: 31, label: "30 Dec", time: "20:00" },
  ], []);

  // SVG dimensions for Tasks Overview chart
  const svgWidth = 840;
  const svgHeight = 240;
  const paddingLeft = 46;
  const paddingRight = 24;
  const paddingTop = 25;
  const paddingBottom = 40;
  const graphWidth = svgWidth - paddingLeft - paddingRight;
  const graphHeight = svgHeight - paddingTop - paddingBottom;
  const maxVal = 44; // scale up to 44K

  // Coordinate mapper
  const getCoords = (data, key) =>
    data.map((item, index) => {
      const x = paddingLeft + (index / (data.length - 1)) * graphWidth;
      const y = paddingTop + graphHeight - (item[key] / maxVal) * graphHeight;
      return { x, y, ...item };
    });

  const coords1 = useMemo(() => getCoords(chartPoints, "val1"), [chartPoints]);
  const coords2 = useMemo(() => getCoords(chartPoints, "val2"), [chartPoints]);

  // Generate smooth cubic bezier SVG path
  const makeSmoothPath = (pts) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[0];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i !== pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const smoothPath1 = useMemo(() => makeSmoothPath(coords1), [coords1]);
  const smoothPath2 = useMemo(() => makeSmoothPath(coords2), [coords2]);

  // Area fill under path 1 with bottom close
  const areaPath1 = useMemo(() => {
    if (coords1.length === 0) return "";
    const last = coords1[coords1.length - 1];
    const first = coords1[0];
    const baseline = paddingTop + graphHeight;
    return `${smoothPath1} L ${last.x} ${baseline} L ${first.x} ${baseline} Z`;
  }, [smoothPath1, coords1, paddingTop, graphHeight]);

  const activeCoord = coords1[activeMonthIdx] || coords1[5];

  // Demo Transactions Data matching screenshot exactly
  const screenshotTransactions = [
    {
      name: "Willum Bickham",
      category: "IT Info",
      amount: "$740.000",
      date: "June 20.2026",
    },
    {
      name: "Guy Hawkins",
      category: "SaaS",
      amount: "$740.000",
      date: "June 20.2026",
    },
    {
      name: "Kristin Watson",
      category: "Design",
      amount: "$320.000",
      date: "June 19.2026",
    },
    {
      name: "Cameron Williamson",
      category: "Dev",
      amount: "$580.000",
      date: "June 18.2026",
    },
  ];

  // Right column transactions stream matching screenshot
  const activityStream = [
    {
      id: "apple",
      title: "Apple",
      subtitle: "Software",
      amount: "+ $ 240",
      time: "20:20",
      iconType: "apple",
    },
    {
      id: "zoom",
      title: "Zoom",
      subtitle: "Subscription",
      amount: "+ $ 240",
      time: "20:20",
      iconType: "zoom",
    },
    {
      id: "woody",
      title: "Woody Alen",
      subtitle: "Transfer",
      amount: "+ $ 240",
      time: "20:20",
      iconType: "avatar",
      letter: "W",
    },
    {
      id: "owen",
      title: "Owen Wilson",
      subtitle: "Deposit",
      amount: "+ $ 240",
      time: "20:20",
      iconType: "avatar",
      letter: "O",
    },
  ];

  return (
    <div className="w-full text-slate-100 font-sans select-none animate-admin-fade-in pb-12">
      {/* ── TOP SECTION HEADER: Dashboard Title + Filter Pill ── */}
      <div className="flex items-center justify-between mb-5 px-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
            <span>Dashboard</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-[11px] font-semibold text-violet-300">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Live Workspace
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Quick Data Source Switcher (Demo vs Supabase Live) */}
          <button
            onClick={() => setShowLiveDbToggle((prev) => !prev)}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
              showLiveDbToggle
                ? "bg-violet-600/30 border-violet-500/50 text-violet-200"
                : "bg-[#14161f] border-white/10 text-slate-400 hover:text-white"
            }`}
            title="Toggle between Reference Layout & Database View"
          >
            <Database size={13} />
            <span>{showLiveDbToggle ? "Live IEEE DB Active" : "Snapshot Mode"}</span>
          </button>

          {/* Filter Pill Button with Funnel */}
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#14161f]/90 hover:bg-[#1c1e2b] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition shadow-sm active:scale-95 cursor-pointer backdrop-blur-xl"
            title="Open Data Filters"
          >
            <span>Filter</span>
            <Filter size={13} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* ── BENTO GRID: Left 2/3 and Right 1/3 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ══════════════════════════════════════════════════
            LEFT COLUMN (lg:col-span-8)
            Contains:
            1. Tasks Overview (Full Width of Column)
            2. Split Row: Recent Transactions (Left) + Total Balance (Right)
            ══════════════════════════════════════════════════ */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* ── CARD 1: Tasks Overview (Spline Wave Chart) ── */}
          <div className="relative rounded-[28px] bg-[#12131a]/90 border border-white/[0.08] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden group">
            {/* Subtle background ambient glow */}
            <div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-violet-600/[0.07] blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-24 right-10 w-96 h-96 rounded-full bg-indigo-600/[0.05] blur-[120px]" />

            {/* Card Header */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Tasks Overview
                </h2>
                <p className="text-[11px] text-slate-400 font-normal mt-0.5">
                  Monthly operational progress &amp; activity velocity
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#191b24] hover:bg-[#232533] border border-white/10 text-xs font-medium text-slate-300 hover:text-white transition active:scale-95 cursor-pointer"
                >
                  <span>Filter</span>
                  <Filter size={13} className="text-slate-400" />
                </button>
              </div>
            </div>

            {/* Wavy Spline Line Chart Area */}
            <div className="relative z-10 w-full overflow-x-auto no-scrollbar">
              <div className="min-w-[620px] w-full relative">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-auto overflow-visible select-none"
                  style={{ minHeight: "220px" }}
                >
                  <defs>
                    {/* Vertical gradient under main curve */}
                    <linearGradient id="curveGlowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.32" />
                      <stop offset="45%" stopColor="#818cf8" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>

                    {/* Glow filter for active curve */}
                    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#c4b5fd" floodOpacity="0.65" />
                    </filter>
                  </defs>

                  {/* Horizontal Guideline Scales (0K, 10K, 20K, 30K, 40K) */}
                  {[
                    { label: "40K", val: 40 },
                    { label: "30K", val: 30 },
                    { label: "20K", val: 20 },
                    { label: "10K", val: 10 },
                    { label: "0K", val: 0 },
                  ].map((gridItem, gIdx) => {
                    const yPos = paddingTop + graphHeight - (gridItem.val / maxVal) * graphHeight;
                    return (
                      <g key={gIdx}>
                        <text
                          x={paddingLeft - 10}
                          y={yPos + 4}
                          textAnchor="end"
                          fill="#64748b"
                          fontSize="11"
                          fontFamily="sans-serif"
                          fontWeight="500"
                        >
                          {gridItem.label}
                        </text>
                        <line
                          x1={paddingLeft}
                          y1={yPos}
                          x2={svgWidth - paddingRight}
                          y2={yPos}
                          stroke="#ffffff"
                          strokeOpacity="0.04"
                          strokeDasharray="4 4"
                          strokeWidth="1"
                        />
                      </g>
                    );
                  })}

                  {/* Fine vertical cadence lines (soundwave style fading down) */}
                  {coords1.map((c, cIdx) => {
                    const baseline = paddingTop + graphHeight;
                    return (
                      <line
                        key={`cadence-${cIdx}`}
                        x1={c.x}
                        y1={c.y}
                        x2={c.x}
                        y2={baseline}
                        stroke="#a78bfa"
                        strokeOpacity="0.12"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                      />
                    );
                  })}

                  {/* Area fill under curve 1 */}
                  <path d={areaPath1} fill="url(#curveGlowGradient)" />

                  {/* Curve 2: Secondary dotted/dashed comparison wave */}
                  <path
                    d={smoothPath2}
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity="0.38"
                    strokeWidth="1.8"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />

                  {/* Curve 1: Main crisp glowing spline curve */}
                  <path
                    d={smoothPath1}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    filter="url(#neonGlow)"
                  />

                  {/* Active Pinpoint Vertical Line indicator */}
                  <line
                    x1={activeCoord.x}
                    y1={paddingTop - 6}
                    x2={activeCoord.x}
                    y2={paddingTop + graphHeight}
                    stroke="#ffffff"
                    strokeOpacity="0.65"
                    strokeWidth="1.2"
                  />

                  {/* Glowing Pin Dot on the Curve */}
                  <circle
                    cx={activeCoord.x}
                    cy={activeCoord.y}
                    r="5"
                    fill="#ffffff"
                    stroke="#a78bfa"
                    strokeWidth="2.5"
                    className="drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                  />

                  {/* Floating Dark Tooltip Pill Badge ("2 June \n 12:30") */}
                  <g
                    transform={`translate(${activeCoord.x - 38}, ${Math.max(activeCoord.y - 56, paddingTop - 10)})`}
                    className="transition-transform duration-200 pointer-events-none"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="76"
                      height="40"
                      rx="12"
                      fill="#12131a"
                      stroke="#ffffff"
                      strokeOpacity="0.18"
                      strokeWidth="1"
                      className="shadow-2xl"
                    />
                    <text
                      x="38"
                      y="17"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {activeCoord.label}
                    </text>
                    <text
                      x="38"
                      y="31"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="9"
                      fontWeight="500"
                    >
                      {activeCoord.time}
                    </text>
                  </g>

                  {/* X-Axis Month Labels (Jan - Dec) with hover triggers */}
                  {chartPoints.map((item, idx) => {
                    const xPos = paddingLeft + (idx / (chartPoints.length - 1)) * graphWidth;
                    const isSelected = idx === activeMonthIdx;
                    return (
                      <g
                        key={`x-label-${idx}`}
                        className="cursor-pointer"
                        onMouseEnter={() => setActiveMonthIdx(idx)}
                        onClick={() => setActiveMonthIdx(idx)}
                      >
                        {/* Invisible hover hitbox */}
                        <rect
                          x={xPos - 18}
                          y={paddingTop + graphHeight + 6}
                          width="36"
                          height="26"
                          fill="transparent"
                        />
                        <text
                          x={xPos}
                          y={paddingTop + graphHeight + 22}
                          textAnchor="middle"
                          fill={isSelected ? "#ffffff" : "#64748b"}
                          fontSize="11"
                          fontWeight={isSelected ? "bold" : "500"}
                          className="transition-colors duration-150"
                        >
                          {item.month}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* ── SPLIT LOWER ROW: Recent Transactions (Left) + Total Balance (Right) ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
            {/* ── CARD 2: Recent Transactions Table (md:col-span-7) ── */}
            <div className="md:col-span-7 rounded-[28px] bg-[#12131a]/90 border border-white/[0.08] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl flex flex-col justify-between">
              <div>
                {/* Header with Title & Dropdown Pill */}
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    Recent Transactions
                  </h3>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setDateFilter((prev) =>
                          prev === "Last 7 Days" ? "Last 30 Days" : "Last 7 Days"
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181a24] hover:bg-[#202230] border border-white/10 text-[11px] font-medium text-slate-300 hover:text-white transition"
                    >
                      <span>{dateFilter}</span>
                      <ChevronDown size={11} className="text-slate-400" />
                    </button>

                    <button
                      className="p-1.5 rounded-full bg-[#181a24] hover:bg-[#202230] border border-white/10 text-slate-300 hover:text-white transition"
                      title="Filter transactions"
                    >
                      <Filter size={12} className="text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-slate-400 border-b border-white/[0.06]">
                  <div className="col-span-4">Name</div>
                  <div className="col-span-3">Category</div>
                  <div className="col-span-2 text-right">Amount</div>
                  <div className="col-span-3 text-right">Date</div>
                </div>

                {/* Table Rows */}
                <div className="divide-y divide-white/[0.04]">
                  {(showLiveDbToggle && studentMembers.length > 0
                    ? studentMembers.slice(0, 4).map((member, mIdx) => ({
                        name: member.first_name || member.full_name || "Member Record",
                        category: member.department || member.membership_type || "Student",
                        amount: member.ieee_id ? `#${member.ieee_id}` : "$740.000",
                        date: member.created_at ? new Date(member.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "June 20.2026",
                      }))
                    : screenshotTransactions
                  ).map((tx, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 items-center px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors text-xs font-normal"
                    >
                      <div className="col-span-4 font-semibold text-white truncate pr-2">
                        {tx.name}
                      </div>
                      <div className="col-span-3 text-slate-400 truncate pr-2">
                        {tx.category}
                      </div>
                      <div className="col-span-2 text-right font-semibold text-white whitespace-nowrap">
                        {tx.amount}
                      </div>
                      <div className="col-span-3 text-right text-slate-400 text-[11px] whitespace-nowrap">
                        {tx.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* View all footer */}
              {onNavigateTab && (
                <div className="pt-3 mt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-normal">
                    {studentMembers.length} Total database records
                  </span>
                  <button
                    onClick={() => onNavigateTab("student_roster")}
                    className="text-violet-300 hover:text-white font-medium flex items-center gap-1 transition"
                  >
                    <span>View Roster</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              )}
            </div>

            {/* ── CARD 3: Total Balance Card (md:col-span-5) ── */}
            <div className="md:col-span-5 rounded-[28px] bg-[#12131a]/90 border border-white/[0.08] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl flex flex-col justify-between">
              {/* Top row: 4-square clover icon + Title + "..." menu */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-[#1c1e2b] border border-white/10 flex items-center justify-center text-slate-200 shadow-sm">
                      <CloverGridIcon size={16} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-300">
                      Total Balance
                    </span>
                  </div>

                  <button
                    className="p-1.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition"
                    title="Balance options"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                </div>

                {/* Big Currency Value */}
                <div className="my-3">
                  <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    $ 80.440
                  </div>
                </div>
              </div>

              {/* Bottom Growth Pill Badge ("+8% To the last month") */}
              <div className="pt-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs text-slate-300 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-emerald-400 font-bold">+8%</span>
                  <span className="text-slate-400">To the last month</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            RIGHT COLUMN (lg:col-span-4)
            Contains:
            Card 4: Transactions with EIR Radial Gauge
            ══════════════════════════════════════════════════ */}
        <div className="lg:col-span-4">
          <div className="rounded-[28px] bg-[#12131a]/90 border border-white/[0.08] p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl relative overflow-hidden">
            {/* Ambient glow in corner */}
            <div className="pointer-events-none absolute -top-10 -right-10 w-60 h-60 rounded-full bg-violet-600/[0.09] blur-[90px]" />

            {/* Header: "Transactions" + "..." button */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Transactions
              </h2>
              <button
                className="p-1.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition"
                title="Options"
              >
                <MoreHorizontal size={16} />
              </button>
            </div>

            {/* ── SUB-WIDGET: EIR Radial Efficiency Gauge ── */}
            <div className="rounded-2xl bg-[#161722]/80 border border-white/[0.06] p-4 mb-6 relative overflow-hidden">
              {/* EIR Title and Top-Right Arrow button */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  EIR
                </span>
                <button
                  className="w-7 h-7 rounded-full bg-[#1f212f] hover:bg-[#282a3c] border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95"
                  title="View EIR Details"
                >
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Gauge Graphic with Center Percentage */}
              <div className="flex flex-col items-center justify-center py-2 relative">
                {/* Center Stat */}
                <div className="text-center z-10 mb-1">
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    44.80%
                  </div>
                  <div className="text-xs font-medium text-slate-400 mt-0.5">
                    Efficiency
                  </div>
                </div>

                {/* Semicircular SVG Radial Arc Gauge */}
                <div className="w-56 h-28 relative overflow-hidden flex items-end justify-center">
                  <svg
                    viewBox="0 0 200 105"
                    className="w-56 h-28 overflow-visible"
                  >
                    <defs>
                      <linearGradient id="eirLavenderGlow" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
                        <stop offset="35%" stopColor="#a78bfa" stopOpacity="0.95" />
                        <stop offset="75%" stopColor="#c4b5fd" stopOpacity="1" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.4" />
                      </linearGradient>

                      <radialGradient id="eirCenterGlow" cx="50%" cy="100%" r="90%">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                      </radialGradient>
                    </defs>

                    {/* Ambient glow fan */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100 Z"
                      fill="url(#eirCenterGlow)"
                    />

                    {/* Background track (semi-circle arc) */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#272938"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />

                    {/* Segment 1: Inactive dark purple arc */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 65 38"
                      fill="none"
                      stroke="#35374d"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />

                    {/* Segment 2: Glowing active lavender arc (44.80% highlight) */}
                    <path
                      d="M 68 36 A 80 80 0 0 1 138 40"
                      fill="none"
                      stroke="url(#eirLavenderGlow)"
                      strokeWidth="16"
                      strokeLinecap="round"
                      className="drop-shadow-[0_0_12px_rgba(167,139,250,0.65)]"
                    />

                    {/* Segment 3: Right inactive arc */}
                    <path
                      d="M 142 43 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#35374d"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date Header: "4 June" */}
            <div className="mb-3 px-1">
              <span className="text-xs font-semibold text-slate-400">
                4 June
              </span>
            </div>

            {/* Transaction Item List */}
            <div className="space-y-2">
              {activityStream.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#161722]/60 hover:bg-[#1a1c29] border border-white/[0.04] hover:border-white/[0.08] transition-all cursor-pointer group"
                >
                  {/* Left: Icon + Title & Subtitle */}
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Item Icon */}
                    <div className="w-10 h-10 rounded-2xl bg-[#1f212e] border border-white/10 flex items-center justify-center text-slate-200 shrink-0 group-hover:scale-105 transition-transform">
                      {item.iconType === "apple" && (
                        <AppleIcon size={18} className="text-white" />
                      )}
                      {item.iconType === "zoom" && (
                        <Video size={17} className="text-blue-400" />
                      )}
                      {item.iconType === "avatar" && (
                        <span className="text-xs font-bold text-slate-200">
                          {item.letter}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate leading-tight group-hover:text-violet-300 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: Amount & Timestamp */}
                  <div className="text-right shrink-0 pl-2">
                    <p className="text-xs font-bold text-white whitespace-nowrap">
                      {item.amount}
                    </p>
                    <p className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Quick Action */}
            <div className="mt-5 pt-4 border-t border-white/[0.04] flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Auto-Syncing</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active &amp; Secure
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleekDarkDashboardOverview;
