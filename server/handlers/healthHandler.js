/**
 * Health check & uptime telemetry handler
 */
export const handleHealthCheck = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Access-Control-Allow-Origin': '*'
  });

  const payload = {
    status: 'ok',
    service: 'ieee-srec-portal',
    uptime: Math.floor(process.uptime()),
    timestamp: Date.now(),
    memory: process.memoryUsage(),
    node_version: process.version
  };

  res.end(JSON.stringify(payload, null, 2));
};
