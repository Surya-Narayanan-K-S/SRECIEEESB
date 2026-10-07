import {
  runFullAutopilotCycle,
  processPendingApplications,
  autoSummarizeEventReports,
  triageFundingSubmissions,
  runSystemHealthCheck,
  getAutopilotStatus,
  startAutonomousDaemon,
  stopAutonomousDaemon,
  getRecentAuditLogs,
  callGemini
} from '../aiBackendManager.js';

/**
 * Utility to parse JSON body from incoming HTTP request
 */
function parseJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (_) {
        resolve({});
      }
    });
  });
}

/**
 * Send JSON HTTP response with CORS headers
 */
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

/**
 * Master Router for /api/ai/* endpoints
 */
export async function handleAiRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;
  const method = req.method.toUpperCase();

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  try {
    // 1. Trigger Full Autopilot Cycle
    if (pathname === '/api/ai/autopilot' && method === 'POST') {
      const result = await runFullAutopilotCycle();
      sendJson(res, 200, { success: true, result });
      return;
    }

    // 2. Process Pending Applications
    if (pathname === '/api/ai/applications' && method === 'POST') {
      const result = await processPendingApplications();
      sendJson(res, 200, { success: true, result });
      return;
    }

    // 3. Summarize Event Reports
    if (pathname === '/api/ai/summarize-report' && method === 'POST') {
      const result = await autoSummarizeEventReports();
      sendJson(res, 200, { success: true, result });
      return;
    }

    // 4. Triage Funding Submissions
    if (pathname === '/api/ai/triage-funding' && method === 'POST') {
      const result = await triageFundingSubmissions();
      sendJson(res, 200, { success: true, result });
      return;
    }

    // 5. System Health Check
    if (pathname === '/api/ai/health' && method === 'GET') {
      const result = await runSystemHealthCheck();
      sendJson(res, 200, { success: true, result });
      return;
    }

    // 6. Get Current Autopilot Status & Telemetry
    if (pathname === '/api/ai/status' && method === 'GET') {
      const status = getAutopilotStatus();
      sendJson(res, 200, { success: true, status });
      return;
    }

    // 7. Toggle Autonomous Daemon (Enable/Disable)
    if (pathname === '/api/ai/toggle-daemon' && method === 'POST') {
      const body = await parseJsonBody(req);
      const enable = body.enable !== false;
      const intervalMs = body.intervalMs || 300000;
      const result = enable ? startAutonomousDaemon(intervalMs) : stopAutonomousDaemon();
      sendJson(res, 200, { success: true, daemon: result });
      return;
    }

    // 8. Fetch Recent Operation Audit Logs
    if (pathname === '/api/ai/logs' && method === 'GET') {
      const limit = parseInt(url.searchParams.get('limit') || '20', 10);
      const logs = await getRecentAuditLogs(limit);
      sendJson(res, 200, { success: true, logs });
      return;
    }

    // 9. Secure Server-Side Gemini Chat Proxy (for Nexus Chatbot)
    if (pathname === '/api/ai/chat' && method === 'POST') {
      const body = await parseJsonBody(req);
      const userPrompt = body.prompt || '';
      const systemPrompt = body.systemInstruction || 'You are Nexus, AI assistant for IEEE Student Branch SREC.';

      if (!userPrompt) {
        sendJson(res, 400, { success: false, error: 'Prompt is required' });
        return;
      }

      const reply = await callGemini(userPrompt, systemPrompt);
      sendJson(res, 200, {
        success: true,
        reply: reply || "I'm having trouble processing that right now. Please explore our activities or reach out directly!"
      });
      return;
    }

    // Fallthrough 404 for unknown AI routes
    sendJson(res, 404, { success: false, error: `AI endpoint not found: ${pathname}` });
  } catch (err) {
    console.error(`[AI Handler] Error servicing ${pathname}:`, err);
    sendJson(res, 500, { success: false, error: err.message });
  }
}
