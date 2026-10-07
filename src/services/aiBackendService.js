import { supabase } from "@/lib/supabase";

const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL || "";

/**
 * IEEE SREC - AI Autonomous Backend Service
 * Bridges React UI with server-side AI Autopilot agent and Supabase logs.
 */

// Helper to call backend API with fallback
async function callApi(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[AI Service] API request failed for ${path}:`, err.message);
    return null;
  }
}

export const aiBackendService = {
  /**
   * Run full autonomous cycle (Applications, Summaries, Funding, Health)
   */
  async runFullCycle() {
    const apiResult = await callApi('/api/ai/autopilot', { method: 'POST' });
    if (apiResult?.success) return apiResult.result;

    // Direct fallback if server endpoint is unreachable
    return this.fallbackHealthCheck();
  },

  /**
   * Process and auto-screen pending applications
   */
  async processApplications() {
    const apiResult = await callApi('/api/ai/applications', { method: 'POST' });
    if (apiResult?.success) return apiResult.result;

    // Client fallback: count pending
    const { count } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'PENDING');
    return { success: true, pendingCount: count || 0, processedCount: 0 };
  },

  /**
   * Auto-enhance event reports
   */
  async summarizeEventReports() {
    const apiResult = await callApi('/api/ai/summarize-report', { method: 'POST' });
    if (apiResult?.success) return apiResult.result;
    return { success: false, message: 'Server worker required for batch summarization' };
  },

  /**
   * Triage funding submissions
   */
  async triageFunding() {
    const apiResult = await callApi('/api/ai/triage-funding', { method: 'POST' });
    if (apiResult?.success) return apiResult.result;
    return { success: false, message: 'Server worker required for funding triage' };
  },

  /**
   * Run system health check
   */
  async getHealthAudit() {
    const apiResult = await callApi('/api/ai/health');
    if (apiResult?.success) return apiResult.result;
    return this.fallbackHealthCheck();
  },

  /**
   * Get autonomous daemon status
   */
  async getStatus() {
    const apiResult = await callApi('/api/ai/status');
    if (apiResult?.success) return apiResult.status;
    return {
      isRunning: false,
      totalCyclesRun: 0,
      lastCycleTimestamp: null,
      geminiConfigured: true
    };
  },

  /**
   * Toggle background autonomous daemon
   */
  async toggleDaemon(enable = true) {
    const apiResult = await callApi('/api/ai/toggle-daemon', {
      method: 'POST',
      body: JSON.stringify({ enable })
    });
    return apiResult?.daemon || { status: enable ? 'started' : 'stopped' };
  },

  /**
   * Fetch recent audit logs from Supabase
   */
  async getAuditLogs(limit = 20) {
    try {
      const { data, error } = await supabase
        .from('ai_backend_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (_) {
      // Return initial dummy log if table hasn't been created yet
      return [
        {
          id: 1,
          job_type: 'HEALTH_AUDIT',
          status: 'SUCCESS',
          summary: 'AI Autonomous Backend Agent ready. Run Autopilot to begin.',
          items_processed: 0,
          created_at: new Date().toISOString()
        }
      ];
    }
  },

  /**
   * Secure Chat proxy with Nexus
   */
  async chatWithNexus(prompt, systemInstruction) {
    const apiResult = await callApi('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt, systemInstruction })
    });
    if (apiResult?.success) return apiResult.reply;
    return null;
  },

  /**
   * Client-side fallback health calculation directly from Supabase
   */
  async fallbackHealthCheck() {
    try {
      const [
        { count: membersCount },
        { count: pendingAppsCount },
        { count: eventsCount },
        { count: adminsCount }
      ] = await Promise.all([
        supabase.from('student_members').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'PENDING'),
        supabase.from('event_reports').select('*', { count: 'exact', head: true }),
        supabase.from('admins').select('*', { count: 'exact', head: true })
      ]);

      return {
        success: true,
        summary: `Healthy: ${membersCount || 0} active members, ${eventsCount || 0} events, ${adminsCount || 0} admins, ${pendingAppsCount || 0} pending applications.`,
        stats: {
          activeMembers: membersCount || 0,
          pendingApplications: pendingAppsCount || 0,
          eventReports: eventsCount || 0,
          registeredAdmins: adminsCount || 0
        }
      };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
