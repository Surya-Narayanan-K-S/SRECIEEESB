import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { DIST_DIR, MIME_TYPES, COMPRESSIBLE_EXTENSIONS, FALLBACK_HTML } from '../config.js';
import { generateETag, buildSecurityHeaders, isPathSafe } from '../security.js';

/**
 * Handle static file requests, Range streaming, compression, and SPA fallback
 */
export const handleStaticRequest = (req, res) => {
  const urlPath = req.url.split('?')[0];
  let reqPath = decodeURIComponent(urlPath);
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.resolve(DIST_DIR, '.' + reqPath);

  // Security check: Must reside within DIST_DIR
  if (!isPathSafe(filePath)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    let targetPath = filePath;
    let isFallback = false;

    if (err || !stats.isFile()) {
      // SPA Fallback: serve index.html for client-side routing
      targetPath = path.join(DIST_DIR, 'index.html');
      isFallback = true;
    }

    fs.stat(targetPath, (targetErr, targetStats) => {
      if (targetErr || !targetStats.isFile()) {
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=UTF-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end(FALLBACK_HTML);
        return;
      }

      const ext = path.extname(targetPath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      const isHashedAsset = targetPath.includes(path.sep + 'assets' + path.sep);
      const isNoCache = ext === '.html' || isFallback || targetPath.endsWith('sw.js') || targetPath.endsWith('manifest.json');
      const etag = generateETag(targetStats);

      // Conditional 304 check
      if (req.headers['if-none-match'] === etag) {
        res.writeHead(304, {
          'ETag': etag,
          'Cache-Control': isNoCache ? 'no-cache, no-store, must-revalidate, max-age=0' : 'public, max-age=31536000, immutable'
        });
        res.end();
        return;
      }

      const headers = buildSecurityHeaders({
        contentType,
        etag,
        stats: targetStats,
        isNoCache,
        isHashedAsset
      });

      // HTTP Range requests for video/audio seeking
      const range = req.headers.range;
      if (range && (ext === '.mp4' || ext === '.webm' || ext === '.pdf')) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : targetStats.size - 1;

        if (start >= targetStats.size || end >= targetStats.size || start > end) {
          res.writeHead(416, {
            'Content-Range': `bytes */${targetStats.size}`,
            ...headers
          });
          res.end();
          return;
        }

        const chunkSize = (end - start) + 1;
        headers['Content-Range'] = `bytes ${start}-${end}/${targetStats.size}`;
        headers['Accept-Ranges'] = 'bytes';
        headers['Content-Length'] = chunkSize;

        res.writeHead(206, headers);
        const stream = fs.createReadStream(targetPath, { start, end });
        stream.pipe(res);
        return;
      }

      headers['Accept-Ranges'] = 'bytes';

      // Compression for text/JS/CSS/SVG
      const acceptEncoding = req.headers['accept-encoding'] || '';
      const shouldCompress = COMPRESSIBLE_EXTENSIONS.has(ext) && targetStats.size > 1024;

      if (shouldCompress && acceptEncoding.includes('gzip')) {
        headers['Content-Encoding'] = 'gzip';
        res.writeHead(200, headers);
        const rawStream = fs.createReadStream(targetPath);
        const gzip = zlib.createGzip({ level: 6 });
        rawStream.pipe(gzip).pipe(res);
      } else if (shouldCompress && acceptEncoding.includes('deflate')) {
        headers['Content-Encoding'] = 'deflate';
        res.writeHead(200, headers);
        const rawStream = fs.createReadStream(targetPath);
        const deflate = zlib.createDeflate();
        rawStream.pipe(deflate).pipe(res);
      } else {
        headers['Content-Length'] = targetStats.size;
        res.writeHead(200, headers);
        const rawStream = fs.createReadStream(targetPath);
        rawStream.pipe(res);
      }
    });
  });
};
