import { DIST_DIR } from './config.js';
import path from 'path';

/**
 * Generate ETag based on file size and modification time
 */
export const generateETag = (stats) => {
  const mtime = stats.mtime.getTime().toString(16);
  const size = stats.size.toString(16);
  return `W/"${size}-${mtime}"`;
};

/**
 * Build standard secure headers for responses
 */
export const buildSecurityHeaders = ({
  contentType,
  etag,
  stats,
  isNoCache,
  isHashedAsset
}) => {
  return {
    'Content-Type': contentType,
    'ETag': etag,
    'Last-Modified': stats.mtime.toUTCString(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Cache-Control': isNoCache
      ? 'no-cache, no-store, must-revalidate, max-age=0'
      : isHashedAsset
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=86400, stale-while-revalidate=604800'
  };
};

/**
 * Validate that resolved file path does not escape DIST_DIR
 */
export const isPathSafe = (resolvedPath) => {
  return resolvedPath.startsWith(DIST_DIR);
};
