import http from 'http';
import { PORT, HOST, DIST_DIR } from './server/config.js';
import { handleHealthCheck } from './server/handlers/healthHandler.js';
import { handleStaticRequest } from './server/handlers/staticHandler.js';

/**
 * IEEE Student Branch SREC - Production Web Server
 */
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Health and uptime telemetry
  if (urlPath === '/health' || urlPath === '/_health' || urlPath === '/healthz' || urlPath === '/ping') {
    handleHealthCheck(req, res);
    return;
  }

  // Static files & SPA route handling
  handleStaticRequest(req, res);
});

// Start Server
server.listen(PORT, HOST, () => {
  console.log(`[IEEE SREC] Production Server running at http://${HOST}:${PORT}`);
  console.log(`[IEEE SREC] Serving static assets from: ${DIST_DIR}`);
});

// Graceful Shutdown Management
const handleShutdown = (signal) => {
  console.log(`[IEEE SREC] ${signal} received. Closing HTTP server gracefully...`);
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
