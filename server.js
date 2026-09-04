import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const port = parseInt(process.env.PORT || '3000', 10);
const host = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.webmanifest': 'application/manifest+json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];

  // Health check endpoints for cloud load balancers & GoDaddy uptime monitor
  if (urlPath === '/health' || urlPath === '/_health' || urlPath === '/healthz' || urlPath === '/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() }));
    return;
  }

  let reqPath = decodeURIComponent(urlPath);
  if (reqPath === '/') reqPath = '/index.html';
  
  let filePath = path.join(DIST_DIR, reqPath);
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback: serve index.html for all client-side routes (e.g. /activities, /admin, /launch, /remote)
      filePath = path.join(DIST_DIR, 'index.html');
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isNoCache = ext === '.html' || filePath.endsWith('sw.js') || filePath.endsWith('manifest.json');
    
    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        // Return 200 with friendly splash if dist is still building so health checks do not fail
        res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
        res.end('<!DOCTYPE html><html><head><title>IEEE SREC Portal</title><meta http-equiv="refresh" content="5"></head><body style="font-family:system-ui,-apple-system,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#050b14;color:#fff;text-align:center;"><div><h2>IEEE Student Branch SREC</h2><p style="color:#94a3b8;">Application runtime ready. Loading portal assets...</p></div></body></html>');
        return;
      }
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': isNoCache ? 'no-cache, no-store, must-revalidate, max-age=0' : 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff'
      });
      res.end(content);
    });
  });
});

server.listen(port, host, () => {
  console.log(`[IEEE SREC] Server listening on http://${host}:${port} (serving from ${DIST_DIR})`);
});

// Handle graceful termination
process.on('SIGTERM', () => {
  console.log('[IEEE SREC] SIGTERM received, closing server...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[IEEE SREC] SIGINT received, closing server...');
  server.close(() => process.exit(0));
});
