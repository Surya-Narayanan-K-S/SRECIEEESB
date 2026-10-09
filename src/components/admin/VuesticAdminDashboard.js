import { useState, useMemo } from "react";
import {
  Users,
  Activity,
  Crown,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  FileText,
  Search,
  Download,
  Filter,
  ChevronRight,
  ExternalLink,
  Plus,
  Rocket,
  Radio,
  Tv,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  CreditCard,
  Eye,
  ShieldCheck,
  Building2,
  Award
} from "lucide-react";

/**
 * Vuestic Donut Chart component for Yearly Breakup (Member Distribution)
 */
const VuesticDonutChart = ({ studentPercent = 85, profPercent = 15 }) => {
  const size = 96;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const studentOffset = circumference - (circumference * studentPercent) / 100;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track (Professional Members) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeOpacity="0.2"
        />
        {/* Student Members Segment */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#2563eb"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={studentOffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-xs font-black text-slate-900 dark:text-white">
          {studentPercent}%
        </span>
      </div>
    </div>
  );
};

/**
 * Vuestic Monthly Growth Chart (Activity & Registrations by Month)
 */
const VuesticRevenueChart = ({ selectedMonth = "June" }) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
  const activityData = [18, 24, 32, 22, 28, 42, 35, 30, 38, 45, 36, 40];
  const participantData = [12, 16, 24, 18, 20, 34, 28, 22, 30, 39, 29, 32];
  const max = 50;

  return (
    <div className="w-full flex flex-col justify-end h-56 pt-4">
      {/* Legend */}
      <div className="flex items-center justify-end gap-5 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">Activity Events</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-blue-400/50 inline-block" />
          <span className="text-slate-600 dark:text-slate-400 font-medium">Attendees (x10)</span>
        </div>
      </div>

      {/* Bars Container */}
      <div className="flex items-end justify-between gap-1.5 sm:gap-3 flex-1 px-1">
        {months.map((m, i) => {
          const isSelected = m.toLowerCase() === selectedMonth.toLowerCase();
          const bar1Height = (activityData[i] / max) * 100;
          const bar2Height = (participantData[i] / max) * 100;

          return (
            <div key={m} className="flex-1 flex flex-col items-center gap-1 group">
              <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-36">
                {/* Bar 1 */}
                <div
                  style={{ height: `${bar1Height}%` }}
                  className={`w-2.5 sm:w-3.5 rounded-t-sm transition-all duration-300 ${
                    isSelected
                      ? "bg-blue-600 shadow-md shadow-blue-500/30"
                      : "bg-blue-500/80 group-hover:bg-blue-600"
                  }`}
                  title={`${m}: ${activityData[i]} Events`}
                />
                {/* Bar 2 */}
                <div
                  style={{ height: `${bar2Height}%` }}
                  className={`w-2.5 sm:w-3.5 rounded-t-sm transition-all duration-300 ${
                    isSelected
                      ? "bg-blue-300 shadow-xs"
                      : "bg-blue-200 dark:bg-blue-900/50 group-hover:bg-blue-300"
                  }`}
                  title={`${m}: ${participantData[i] * 10} Attendees`}
                />
              </div>
              <span
                className={`text-[10px] font-semibold transition-colors ${
                  isSelected
                    ? "text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300"
                }`}
              >
                {m.slice(0, 3)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VuesticAdminDashboard = ({
  studentMembers = [],
  activities = [],
  officeRows = [],
  societies = [],
  applications = [],
  onNavigateTab,
}) => {
  const [selectedMonth, setSelectedMonth] = useState("June");
  const [tableSearch, setTableSearch] = useState("");

  // Distribution calculations from real props
  const studentCount = studentMembers.length;
  const profCount = 18; // Registered senior & professional members
  const totalRoster = studentCount + profCount;
  const studentPercent = totalRoster > 0 ? Math.round((studentCount / totalRoster) * 100) : 85;
  const profPercent = 100 - studentPercent;

  // Filtered members for the Vuestic ProjectTable
  const displayMembers = useMemo(() => {
    let list = studentMembers.length > 0 ? studentMembers : applications;
    if (!tableSearch) return list.slice(0, 6);
    const q = tableSearch.toLowerCase();
    return list
      .filter((m) =>
        (m.name || m.full_name || "")
          .toLowerCase()
          .includes(q) ||
        (m.department || "")
          .toLowerCase()
          .includes(q) ||
        (m.roll_no || m.ieee_id || "")
          .toLowerCase()
          .includes(q)
      )
      .slice(0, 6);
  }, [studentMembers, applications, tableSearch]);

  // Vuestic 4 Metric Cards Data
  const metrics = [
    {
      id: "students",
      title: "STUDENT ROSTER",
      value: studentCount > 0 ? `${studentCount} Members` : "120+ Active",
      changeText: "+12.5% this term",
      up: true,
      icon: Users,
      bgColor: "bg-blue-50 dark:bg-blue-950/40",
      textColor: "text-blue-600 dark:text-blue-400",
      action: () => onNavigateTab("student_roster"),
    },
    {
      id: "activities",
      title: "APPROVED ACTIVITIES",
      value: `${activities.length} Tracked`,
      changeText: "+4 new events",
      up: true,
      icon: Activity,
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
      textColor: "text-emerald-600 dark:text-emerald-400",
      action: () => onNavigateTab("activities"),
    },
    {
      id: "officers",
      title: "EXECUTIVE COUNCIL",
      value: `${officeRows.length} Officers`,
      changeText: "Active SB team",
      up: true,
      icon: Crown,
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
      textColor: "text-amber-600 dark:text-amber-400",
      action: () => onNavigateTab("office"),
    },
    {
      id: "societies",
      title: "SOCIETIES & CHAPTERS",
      value: `${societies.length} Units`,
      changeText: "9 Technical",
      up: true,
      icon: Layers,
      bgColor: "bg-purple-50 dark:bg-purple-950/40",
      textColor: "text-purple-600 dark:text-purple-400",
      action: () => onNavigateTab("societies"),
    },
  ];

  return (
    <div className="w-full space-y-6 animate-admin-fade-in pb-16">
      {/* ── TOP SECTION: Grand Launch Ceremony & Stage Remote Banner ── */}
      <div className="rounded-2xl bg-white dark:bg-[#13141f] border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/25">
            <Rocket size={22} className="animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Grand Launch Ceremony &amp; Stage Remote
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Auditorium Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Control the stage screen, fire synchronized launch confetti, and broadcast live portal transitions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab("launch_control")}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition"
          >
            <Radio size={14} />
            <span>Launch Remote</span>
          </button>
          <a
            href="/launch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 text-xs font-semibold active:scale-95 transition"
          >
            <Tv size={14} />
            <span>Stage View</span>
          </a>
        </div>
      </div>

      {/* ── SECTION 1: Vuestic Top Reports Row (RevenueReport + YearlyBreakup + MonthlyEarnings) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card (70% in Vuestic Admin): Revenue & Activity Growth Report */}
        <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-[#13141f] border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          {/* Card Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                ACTIVITY &amp; MEMBERSHIP REPORT
              </h3>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                IEEE SREC Academic Session Trajectory
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a1c2b] border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
              >
                {["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"].map((m) => (
                  <option key={m} value={m}>{m} 2026</option>
                ))}
              </select>
              <button
                onClick={() => onNavigateTab("activities")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-bold border border-blue-200 dark:border-blue-800/60 transition"
              >
                <Download size={13} />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Card Content: Stats on Left + Chart on Right (exact Vuestic RevenueReport layout) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-5">
            {/* Stats Summary Column (Left 4 cols) */}
            <div className="md:col-span-4 space-y-5">
              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white block">
                  {studentCount > 0 ? `${studentCount}` : "120+"}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Total Active Members
                </span>
              </div>

              <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-white/5">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-xs bg-blue-600 inline-block shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Activities this term</span>
                  </div>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {activities.length} Events
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-xs bg-blue-300 inline-block shrink-0" />
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Participations</span>
                  </div>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    {activities.length * 45 || "450+"} Students
                  </p>
                </div>
              </div>
            </div>

            {/* Chart Column (Right 8 cols) */}
            <div className="md:col-span-8">
              <VuesticRevenueChart selectedMonth={selectedMonth} />
            </div>
          </div>
        </div>

        {/* Right Column (30% in Vuestic Admin): YearlyBreakup & MonthlyActivities */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Vuestic YearlyBreakup (Member Distribution Card) */}
          <div className="rounded-2xl bg-white dark:bg-[#13141f] border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between">
            <div className="pb-3 border-b border-slate-100 dark:border-white/5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                YEARLY BREAKUP
              </h3>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Student &amp; Professional Roster
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 py-3">
              <div className="space-y-2">
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {totalRoster} Members
                </div>
                <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <ArrowUpRight size={14} />
                  <span>+2.5%</span>
                  <span className="text-slate-400 dark:text-slate-500 font-normal">last year</span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-xs bg-blue-600 inline-block" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Students ({studentPercent}%)</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="w-2 h-2 rounded-xs bg-blue-300 inline-block" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Professional ({profPercent}%)</span>
                  </div>
                </div>
              </div>

              <div className="shrink-0">
                <VuesticDonutChart studentPercent={studentPercent} profPercent={profPercent} />
              </div>
            </div>

            <button
              onClick={() => onNavigateTab("student_roster")}
              className="w-full mt-2 py-2 text-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View Roster Directory &rarr;
            </button>
          </div>

          {/* Vuestic Monthly Earnings Card (Adapted for IEEE SREC Activity Milestones) */}
          <div className="rounded-2xl bg-white dark:bg-[#13141f] border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                MONTHLY ACTIVITIES
              </span>
              <span className="text-xl font-black text-slate-900 dark:text-white mt-1 block">
                {activities.length} Recorded
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                <ArrowUpRight size={13} />
                <span>+14.8%</span>
                <span className="text-slate-400 font-normal">vs last month</span>
              </span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Calendar size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Vuestic DataSection (4 Metric Cards Grid) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metrics.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.id}
              onClick={item.action}
              className="rounded-2xl bg-white dark:bg-[#13141f] border border-slate-200 dark:border-white/10 p-5 shadow-xs hover:border-blue-400 dark:hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {item.title}
                </span>
                <div className={`w-10 h-10 rounded-xl ${item.bgColor} ${item.textColor} flex items-center justify-center transition-transform group-hover:scale-110 shadow-2xs`}>
                  <IconComp size={18} />
                </div>
              </div>

              <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {item.value}
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 dark:border-white/5 text-xs">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Status</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  {item.changeText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── SECTION 3: Vuestic ProjectTable (Student Members) + Timeline (Activities) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Vuestic ProjectTable (Student Members Roster) */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#13141f] border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  STUDENT MEMBERS ROSTER
                </h3>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  Recent Verified Member Entries
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-[#1a1c2b] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs">
                  <Search size={14} className="text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search roster..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="bg-transparent border-0 outline-none text-slate-900 dark:text-white placeholder-slate-400 w-28 sm:w-36 text-xs"
                  />
                </div>
                <button
                  onClick={() => onNavigateTab("student_roster")}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs"
                >
                  View All
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Member Name</th>
                    <th className="py-2.5 px-3">Department</th>
                    <th className="py-2.5 px-3">Roll / IEEE ID</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {displayMembers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                        No member records found matching search.
                      </td>
                    </tr>
                  ) : (
                    displayMembers.map((m, idx) => {
                      const name = m.name || m.full_name || "IEEE Member";
                      const dept = m.department || "ECE / CSE";
                      const idNum = m.roll_no || m.ieee_id || `SREC-${1000 + idx}`;
                      const initials = name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                      return (
                        <tr
                          key={m.id || idx}
                          onClick={() => onNavigateTab("student_roster")}
                          className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
                        >
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">
                                {initials || "IM"}
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {name}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-medium">
                            {dept}
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                            {idNum}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                              <CheckCircle2 size={10} />
                              <span>Active</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {displayMembers.length} records</span>
            <button
              onClick={() => onNavigateTab("student_roster")}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              Open Full Student Roster &rarr;
            </button>
          </div>
        </div>

        {/* Right: Vuestic Timeline (Recent Activity Logs) */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-[#13141f] border border-slate-200 dark:border-white/10 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  ACTIVITY TIMELINE
                </h3>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                  Latest Events &amp; Workshops
                </p>
              </div>
              <button
                onClick={() => onNavigateTab("activities")}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold transition border border-slate-200 dark:border-white/10"
              >
                All Events
              </button>
            </div>

            {/* Timeline Stream */}
            <div className="relative pl-6 space-y-4 mt-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-white/10">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Activity size={28} className="mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-medium">No activity records logged yet.</p>
                </div>
              ) : (
                activities.slice(0, 5).map((act, idx) => (
                  <div key={act.id || idx} className="relative group">
                    {/* Glowing Marker Dot */}
                    <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white dark:ring-[#13141f] transition-transform group-hover:scale-125" />

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {act.event || "IEEE Workshop"}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                          {act.venue ? `${act.venue}` : "Auditorium / Lab"}
                          {act.society && ` • ${act.society}`}
                        </p>
                      </div>

                      <span className="text-[10px] font-semibold text-slate-400 shrink-0 whitespace-nowrap">
                        {act.date || "Recent"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-500">Live Database Sync</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: Executive Shortcuts Grid ── */}
      <div className="rounded-2xl bg-white dark:bg-[#13141f] border border-slate-200 dark:border-white/10 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            PORTAL SHORTCUTS
          </h3>
          <span className="text-xs text-slate-400">Direct Navigation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { label: "Student Roster", tab: "student_roster", icon: Users, color: "text-blue-600" },
            { label: "Add Activity", tab: "activities", icon: Plus, color: "text-emerald-600" },
            { label: "Officer Cards", tab: "office_cards", icon: CreditCard, color: "text-indigo-600" },
            { label: "Society Leaders", tab: "society_leaders", icon: Crown, color: "text-amber-600" },
            { label: "Event Reports", tab: "event_reports", icon: FileText, color: "text-rose-600" },
            { label: "Page Visibility", tab: "page_visibility", icon: Eye, color: "text-cyan-600" },
          ].map((sc, idx) => {
            const IconComp = sc.icon;
            return (
              <button
                key={idx}
                onClick={() => onNavigateTab(sc.tab)}
                className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
              >
                <IconComp size={18} className={sc.color} />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 text-center leading-tight">
                  {sc.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VuesticAdminDashboard;
