import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DIST_DIR = path.resolve(__dirname, '..', 'dist');
export const PORT = parseInt(process.env.PORT || '3000', 10);
export const HOST = process.env.HOST || '0.0.0.0';

export const MIME_TYPES = {
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
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8'
};

export const COMPRESSIBLE_EXTENSIONS = new Set([
  '.html', '.js', '.mjs', '.css', '.json', '.webmanifest', '.svg', '.txt', '.xml', '.wasm'
]);

export const FALLBACK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IEEE SREC Portal</title>
  <meta http-equiv="refresh" content="3">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #020617;
      color: #f8fafc;
      text-align: center;
    }
    .card {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 1.5rem;
      padding: 2.5rem;
      max-width: 420px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .spinner {
      width: 44px;
      height: 44px;
      border: 3px solid rgba(56, 189, 248, 0.2);
      border-top-color: #38bdf8;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    h2 { margin: 0 0 0.5rem; font-size: 1.5rem; color: #38bdf8; font-weight: 700; }
    p { margin: 0; color: #94a3b8; font-size: 0.95rem; line-height: 1.5; }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>IEEE Student Branch SREC</h2>
    <p>Application runtime initializing. Loading portal assets...</p>
  </div>
</body>
</html>`;
