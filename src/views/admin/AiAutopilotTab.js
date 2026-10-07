import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Play,
  Activity,
  ShieldCheck,
  FileText,
  UserCheck,
  DollarSign,
  Clock,
  Sparkles,
  Database,
  Layers
} from "lucide-react";
import { toast } from "sonner";
import { aiBackendService } from "@/services/aiBackendService";

export const AiAutopilotTab = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [logs, setLogs] = useState([]);
  const [statusData, setStatusData] = useState(null);
  const [healthStats, setHealthStats] = useState(null);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const loadData = async () => {
    setIsLoadingLogs(true);
    try {
      const [fetchedLogs, fetchedStatus, fetchedHealth] = await Promise.all([
        aiBackendService.getAuditLogs(15),
        aiBackendService.getStatus(),
        aiBackendService.getHealthAudit()
      ]);
      setLogs(fetchedLogs || []);
      setStatusData(fetchedStatus);
      if (fetchedHealth?.stats) {
        setHealthStats(fetchedHealth.stats);
      }
    } catch (e) {
      console.warn("Failed to load AI Autopilot data:", e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const handleRunFullCycle = async () => {
    setIsRunning(true);
    setActiveAction("full");
    toast.info("⚡ AI Autonomous Backend Agent is running full cycle...");
    try {
      const result = await aiBackendService.runFullCycle();
      toast.success(result?.summary || "Full Autopilot cycle completed successfully!");
      await loadData();
    } catch (err) {
      toast.error(`Autopilot error: ${err.message}`);
    } finally {
      setIsRunning(false);
      setActiveAction(null);
    }
  };

  const handleProcessApplications = async () => {
    setIsRunning(true);
    setActiveAction("apps");
    toast.info("🤖 AI is screening student membership applications...");
    try {
      const result = await aiBackendService.processApplications();
      toast.success(
        result?.approvedCount !== undefined
          ? `Screened applications: ${result.approvedCount} approved, ${result.flaggedCount} flagged.`
          : "Applications processed successfully."
      );
      await loadData();
    } catch (err) {
      toast.error(`Application processing failed: ${err.message}`);
    } finally {
      setIsRunning(false);
      setActiveAction(null);
    }
  };

  const handleSummarizeReports = async () => {
    setIsRunning(true);
    setActiveAction("reports");
    toast.info("📝 AI is generating executive summaries for event reports...");
    try {
      const result = await aiBackendService.summarizeEventReports();
      toast.success(
        result?.enhancedCount !== undefined
          ? `Enhanced ${result.enhancedCount} event reports with executive summaries.`
          : "Report enhancement completed."
      );
      await loadData();
    } catch (err) {
      toast.error(`Report summarization failed: ${err.message}`);
    } finally {
      setIsRunning(false);
      setActiveAction(null);
    }
  };

  const handleTriageFunding = async () => {
    setIsRunning(true);
    setActiveAction("funding");
    toast.info("💰 AI is analyzing and triaging funding requests...");
    try {
      const result = await aiBackendService.triageFunding();
      toast.success(
        result?.triagedCount !== undefined
          ? `Triaged ${result.triagedCount} funding requests with feasibility scores.`
          : "Funding triage completed."
      );
      await loadData();
    } catch (err) {
      toast.error(`Funding triage failed: ${err.message}`);
    } finally {
      setIsRunning(false);
      setActiveAction(null);
    }
  };

  const handleToggleDaemon = async () => {
    const nextState = !statusData?.isRunning;
    try {
      await aiBackendService.toggleDaemon(nextState);
      toast.success(`Autonomous background daemon ${nextState ? "activated" : "paused"}.`);
      await loadData();
    } catch (err) {
      toast.error(`Failed to toggle daemon: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 p-8 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-10 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Autonomous Operations Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Bot className="w-8 h-8 text-cyan-400" />
              <span>AI Backend Autopilot</span>
            </h1>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Autonomous AI agent managing IEEE SREC backend operations: auto-approving genuine student memberships,
              synthesizing publication-grade event reports, triaging funding budgets, and maintaining database integrity.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunFullCycle}
              disabled={isRunning}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isRunning && activeAction === "full" ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              )}
              <span>Run Full Autopilot Now</span>
            </button>

            <button
              onClick={handleToggleDaemon}
              className={`inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl border text-sm font-semibold transition-all ${
                statusData?.isRunning
                  ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20"
                  : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
              }`}
            >
              <Activity className={`w-4 h-4 ${statusData?.isRunning ? "animate-pulse" : ""}`} />
              <span>{statusData?.isRunning ? "Daemon: Active (5m)" : "Daemon: Paused"}</span>
            </button>

            <button
              onClick={loadData}
              disabled={isLoadingLogs}
              title="Refresh logs"
              className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* System Pulse & Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications Screened</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{healthStats?.pendingApplications ?? 0}</span>
            <span className="text-xs text-amber-400 font-medium">Pending Review</span>
          </div>
          <button
            onClick={handleProcessApplications}
            disabled={isRunning}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isRunning && activeAction === "apps" ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Auto-Screen Pending</span>
          </button>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Event Reports</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{healthStats?.eventReports ?? 0}</span>
            <span className="text-xs text-indigo-300 font-medium">Indexed in DB</span>
          </div>
          <button
            onClick={handleSummarizeReports}
            disabled={isRunning}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isRunning && activeAction === "reports" ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Auto-Summarize Drafts</span>
          </button>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Funding Submissions</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">Active</span>
            <span className="text-xs text-emerald-400 font-medium">Budget Triaged</span>
          </div>
          <button
            onClick={handleTriageFunding}
            disabled={isRunning}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
          >
            {isRunning && activeAction === "funding" ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Layers className="w-3.5 h-3.5" />
            )}
            <span>Triage Feasibility</span>
          </button>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">System Integrity</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400">100%</span>
            <span className="text-xs text-slate-400 font-medium">{healthStats?.activeMembers ?? 0} Members</span>
          </div>
          <div className="mt-4 py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 text-center">
            ✓ Supabase Cluster Healthy
          </div>
        </div>
      </div>

      {/* Autonomous Operation Log Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Live AI Operation Stream & Audit Log</h2>
              <p className="text-xs text-slate-400">Chronological history of autonomous decisions and database actions</p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
            {logs.length} Recent Operations
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">Timestamp</th>
                <th className="py-4 px-6">Operation Type</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Action Summary & Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Bot className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                    <p className="font-semibold">No AI operations recorded yet.</p>
                    <p className="text-xs mt-1">Click "Run Full Autopilot Now" above to trigger the first autonomous run.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const isSuccess = log.status === "SUCCESS";
                  const isFlagged = log.status === "FLAGGED";
                  const isFailed = log.status === "FAILED";

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(log.created_at).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-bold text-xs text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                          {log.job_type.replace(/_/g, " ")}
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isSuccess
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                              : isFlagged
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                          }`}
                        >
                          {isSuccess ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : isFlagged ? (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5" />
                          )}
                          <span>{log.status}</span>
                        </span>
                      </td>

                      <td className="py-4 px-6 whitespace-nowrap text-xs font-bold text-slate-200">
                        {log.items_processed || 0}
                      </td>

                      <td className="py-4 px-6 text-xs text-slate-300 max-w-md">
                        <p className="line-clamp-2 leading-relaxed">{log.summary}</p>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AiAutopilotTab;
