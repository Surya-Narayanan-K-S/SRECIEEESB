import http from 'http';
import { DIST_DIR } from './config.js';
import { handleHealthCheck } from './handlers/healthHandler.js';
import { handleStaticRequest } from './handlers/staticHandler.js';
import { handleAiRequest } from './handlers/aiHandler.js';
import { startAutonomousDaemon, stopAutonomousDaemon } from './aiBackendManager.js';

/**
 * IEEE Student Branch SREC - Production Web Server & AI Autopilot Engine
 */
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Health and uptime telemetry
  if (urlPath === '/health' || urlPath === '/_health' || urlPath === '/healthz' || urlPath === '/ping') {
    handleHealthCheck(req, res);
    return;
  }

  // AI Autonomous Backend Endpoints (/api/ai/*)
  if (urlPath.startsWith('/api/ai')) {
    handleAiRequest(req, res);
    return;
  }

  // Static files & SPA route handling
  handleStaticRequest(req, res);
});

// Configure port for cloud platforms (e.g. Render, Railway, Heroku) & local environments
const port = process.env.PORT || 3000;
const app = server;

// Start Server & Autonomous AI Daemon
server.listen(port, () => {
  console.log(`[IEEE SREC] Production Server running on port ${port}`);
  console.log(`[IEEE SREC] Serving static assets from: ${DIST_DIR}`);

  // Automatically start background AI Autopilot worker (runs every 5 mins)
  try {
    startAutonomousDaemon(300000);
    console.log('[IEEE SREC] ⚡ AI Autonomous Backend Agent activated.');
  } catch (err) {
    console.warn('[IEEE SREC] AI Autopilot failed to start automatically:', err.message);
  }
});

// Graceful Shutdown Management
const handleShutdown = (signal) => {
  console.log(`[IEEE SREC] ${signal} received. Closing HTTP server gracefully...`);
  try {
    stopAutonomousDaemon();
  } catch (_) {}
  server.close(() => {
    console.log('[IEEE SREC] Server closed successfully.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('[IEEE SREC] Forceful shutdown initiated after timeout.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
export { app, server, port };
export default server;
