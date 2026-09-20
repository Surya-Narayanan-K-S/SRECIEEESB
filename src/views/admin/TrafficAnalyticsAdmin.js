import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Globe,
  Users,
  Eye,
  Smartphone,
  Monitor,
  Tablet,
  Search,
  RefreshCw,
  Download,
  Trash2,
  Zap,
  ArrowLeft,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Clock,
  Radio,
  Check,
  Copy,
  SlidersHorizontal,
} from "lucide-react";
import {
  getTrafficLogs,
  getTrafficAnalyticsSummary,
  generateMockVisitorHit,
  saveTrafficLogs,
} from "@/utils/visitorTracker";
import { useToast } from "@/hooks/use-toast";

export const TrafficAnalyticsAdmin = () => {
  const { toast } = useToast();
  const [logs, setLogs] = useState(() => getTrafficLogs());
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [copiedIp, setCopiedIp] = useState(null);
  const [isLivePulsing, setIsLivePulsing] = useState(true);

  const refreshData = () => {
    setLogs(getTrafficLogs());
  };

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      refreshData();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const summary = useMemo(() => getTrafficAnalyticsSummary(), [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.ip?.toLowerCase().includes(q) ||
        log.city?.toLowerCase().includes(q) ||
        log.country?.toLowerCase().includes(q) ||
        log.region?.toLowerCase().includes(q) ||
        log.path?.toLowerCase().includes(q) ||
        log.isp?.toLowerCase().includes(q) ||
        log.browser?.toLowerCase().includes(q);

      const matchesCountry = countryFilter === "all" || log.country === countryFilter;
      const matchesDevice = deviceFilter === "all" || log.device === deviceFilter;

      return matchesSearch && matchesCountry && matchesDevice;
    });
  }, [logs, searchQuery, countryFilter, deviceFilter]);

  const handleSimulateHit = () => {
    const newHit = generateMockVisitorHit();
    refreshData();
    toast({
      title: "⚡ Live Telemetry Event Recorded",
      description: `New visitor from ${newHit.city}, ${newHit.country} (${newHit.ip}) visited ${newHit.path}`,
    });
  };

  const handleCopyIp = (ip) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    toast({ title: "IP Copied to Clipboard", description: ip });
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleClearLogs = () => {
    if (window.confirm("Are you sure you want to clear all visitor telemetry logs?")) {
      saveTrafficLogs([]);
      refreshData();
      toast({ title: "Traffic Logs Cleared" });
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ["ID,IP,City,Region,Country,ISP,Device,OS,Browser,Path,Referrer,Timestamp"];
    const rows = logs.map((l) =>
      [
        l.id,
        `"${l.ip}"`,
        `"${l.city}"`,
        `"${l.region}"`,
        `"${l.country}"`,
        `"${l.isp || ""}"`,
        `"${l.device}"`,
        `"${l.os}"`,
        `"${l.browser}"`,
        `"${l.path}"`,
        `"${l.referrer}"`,
        `"${l.timestamp}"`,
      ].join(",")
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ieee_srec_traffic_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const countriesList = useMemo(() => {
    const set = new Set(logs.map((l) => l.country).filter(Boolean));
    return Array.from(set);
  }, [logs]);

  const getTimeAgo = (timestamp) => {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans">
      {/* Background cyber ambiance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Link
                to="/admin"
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
              </Link>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <Activity size={20} />
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Real-time Traffic &amp; Visitor Telemetry
                </h1>
              </div>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm pl-11">
              Live viewer IPs, geographic locations, device metrics, and portal route access logs.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                autoRefresh
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                  : "bg-slate-900 border-slate-800 text-slate-400"
              }`}
            >
              <Radio size={14} className={autoRefresh ? "animate-pulse text-emerald-400" : ""} />
              <span>{autoRefresh ? "Live 5s Polling" : "Polling Paused"}</span>
            </button>

            <button
              onClick={handleSimulateHit}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#00629B] to-cyan-500 hover:from-[#005282] hover:to-cyan-600 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Zap size={14} />
              <span>Simulate Hit</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={refreshData}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Now */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Viewers</span>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{summary.activeVisitors}</span>
              <span className="text-xs text-emerald-400 font-medium">live on portal</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Sessions active in the last 15 mins</p>
          </div>

          {/* Total Visitors */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Visits</span>
              <Users size={18} className="text-cyan-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{summary.totalVisits}</span>
              <span className="text-xs text-cyan-400 font-medium">recorded sessions</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Cumulative telemetry hits</p>
          </div>

          {/* Unique IPs */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Unique IPs</span>
              <ShieldCheck size={18} className="text-blue-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{summary.uniqueIPs}</span>
              <span className="text-xs text-blue-400 font-medium">distinct networks</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Unique client IP signatures</p>
          </div>

          {/* Geographic Reach */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Global Reach</span>
              <Globe size={18} className="text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{summary.topCountries.length}</span>
              <span className="text-xs text-amber-400 font-medium">countries</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">International audience footprint</p>
          </div>
        </div>

        {/* Visual Analytics Grid: Countries & Devices */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Geographic Breakdown */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-cyan-400" />
                <h2 className="text-base font-bold text-white">Audience by Country &amp; Region</h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">{summary.topCountries.length} active regions</span>
            </div>

            <div className="space-y-3 pt-2">
              {summary.topCountries.slice(0, 6).map((c) => (
                <div key={c.country} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-200">
                      <span className="text-base">{c.flag}</span>
                      <span>{c.country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-mono">{c.count} visits</span>
                      <span className="text-cyan-400 font-bold w-10 text-right">{c.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00629B] to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(c.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device & OS Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-5">
            <div className="flex items-center gap-2">
              <Monitor size={18} className="text-blue-400" />
              <h2 className="text-base font-bold text-white">Device Breakdown</h2>
            </div>

            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Monitor size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Desktop &amp; Laptop</p>
                    <p className="text-[11px] text-slate-400">Workstations &amp; PC</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-white">{summary.deviceBreakdown.Desktop || 0}</p>
                  <p className="text-[10px] text-blue-400 font-bold">
                    {summary.totalVisits ? Math.round(((summary.deviceBreakdown.Desktop || 0) / summary.totalVisits) * 100) : 0}%
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Mobile Handsets</p>
                    <p className="text-[11px] text-slate-400">iOS &amp; Android phones</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-white">{summary.deviceBreakdown.Mobile || 0}</p>
                  <p className="text-[10px] text-emerald-400 font-bold">
                    {summary.totalVisits ? Math.round(((summary.deviceBreakdown.Mobile || 0) / summary.totalVisits) * 100) : 0}%
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
                    <Tablet size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Tablets &amp; iPads</p>
                    <p className="text-[11px] text-slate-400">Touch surfaces</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-white">{summary.deviceBreakdown.Tablet || 0}</p>
                  <p className="text-[10px] text-purple-400 font-bold">
                    {summary.totalVisits ? Math.round(((summary.deviceBreakdown.Tablet || 0) / summary.totalVisits) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Visitor & IP Telemetry Stream Table */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-5">
          {/* Table Header & Search Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-cyan-400" />
              <h2 className="text-base font-bold text-white">Live Viewer &amp; IP Telemetry Log</h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] font-mono text-cyan-400">
                {filteredLogs.length} records
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search input */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search IP, city, path..."
                  className="pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-52 sm:w-64"
                />
              </div>

              {/* Country select */}
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Countries</option>
                {countriesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {/* Device filter */}
              <select
                value={deviceFilter}
                onChange={(e) => setDeviceFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">All Devices</option>
                <option value="Desktop">Desktop</option>
                <option value="Mobile">Mobile</option>
                <option value="Tablet">Tablet</option>
              </select>

              <button
                onClick={handleClearLogs}
                className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
                title="Clear Logs"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Viewer / IP</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Device &amp; OS</th>
                  <th className="py-3 px-4">Page Visited</th>
                  <th className="py-3 px-4">Referrer</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-sans text-xs">
                      No matching visitor records found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* IP & ISP */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{log.ip}</span>
                          <button
                            onClick={() => handleCopyIp(log.ip)}
                            className="text-slate-500 hover:text-cyan-400 p-0.5 transition-colors"
                            title="Copy IP"
                          >
                            {copiedIp === log.ip ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-500 font-sans truncate max-w-[160px]">{log.isp || "Network"}</p>
                      </td>

                      {/* Location */}
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm">{log.flag || "🌐"}</span>
                          <span className="font-semibold text-slate-200">{log.city}</span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {log.region ? `${log.region}, ` : ""}
                          {log.country}
                        </p>
                      </td>

                      {/* Device & OS */}
                      <td className="py-3 px-4 font-sans">
                        <div className="flex items-center gap-1.5">
                          {log.device === "Mobile" ? (
                            <Smartphone size={13} className="text-emerald-400" />
                          ) : (
                            <Monitor size={13} className="text-blue-400" />
                          )}
                          <span className="text-slate-300 font-medium">{log.os}</span>
                        </div>
                        <p className="text-[10px] text-slate-500">{log.browser}</p>
                      </td>

                      {/* Page Visited */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px]">
                          {log.path}
                        </span>
                      </td>

                      {/* Referrer */}
                      <td className="py-3 px-4 font-sans text-slate-400 text-[11px] truncate max-w-[130px]">
                        {log.referrer || "Direct"}
                      </td>

                      {/* Time */}
                      <td className="py-3 px-4 font-sans text-[11px] text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-slate-500" />
                          <span>{getTimeAgo(log.timestamp)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          onClick={() => setSelectedVisitor(log)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Visitor Inspection Modal */}
      {selectedVisitor && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedVisitor.flag || "🌐"}</span>
                <div>
                  <h3 className="font-bold text-white text-base">Telemetry Details: {selectedVisitor.ip}</h3>
                  <p className="text-xs text-slate-400">
                    {selectedVisitor.city}, {selectedVisitor.country}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVisitor(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Network ISP</p>
                <p className="text-slate-200 font-mono mt-0.5">{selectedVisitor.isp || "Direct"}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Device &amp; OS</p>
                <p className="text-slate-200 font-mono mt-0.5">{selectedVisitor.device} • {selectedVisitor.os}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Browser Client</p>
                <p className="text-slate-200 font-mono mt-0.5">{selectedVisitor.browser}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <p className="text-slate-500 text-[10px] uppercase font-bold">Route Path</p>
                <p className="text-cyan-400 font-mono mt-0.5">{selectedVisitor.path}</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 break-all space-y-1">
              <p><span className="text-slate-500">Timestamp:</span> {selectedVisitor.timestamp}</p>
              <p><span className="text-slate-500">Session ID:</span> {selectedVisitor.sessionId || "N/A"}</p>
              <p><span className="text-slate-500">Referrer:</span> {selectedVisitor.referrer || "Direct"}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedVisitor(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
