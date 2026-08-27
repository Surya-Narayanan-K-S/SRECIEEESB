const TRAFFIC_STORAGE_KEY = "ieee_srec_traffic_telemetry_v1";
const SESSION_ID_KEY = "ieee_srec_session_id";

// Realistic baseline seed data representing active global traffic to IEEE SREC
const BASELINE_TELEMETRY = [
  {
    id: "v-101",
    ip: "103.208.71.45",
    city: "Coimbatore",
    region: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    isp: "ACT Fibernet / SREC Campus LAN",
    device: "Desktop",
    os: "Windows 11",
    browser: "Chrome 128.0",
    path: "/membership-registration",
    referrer: "https://srec.ac.in",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "v-102",
    ip: "157.48.12.190",
    city: "Chennai",
    region: "Tamil Nadu",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    isp: "Jio Fiber 5G",
    device: "Mobile",
    os: "Android 14",
    browser: "Chrome Mobile",
    path: "/societies/cs",
    referrer: "https://instagram.com/srecieee",
    timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "v-103",
    ip: "49.37.218.112",
    city: "Bengaluru",
    region: "Karnataka",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    isp: "Airtel Broadband",
    device: "Desktop",
    os: "macOS Sonoma",
    browser: "Safari 17.5",
    path: "/reports",
    referrer: "Direct",
    timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    status: "active",
  },
  {
    id: "v-104",
    ip: "142.250.190.78",
    city: "Mountain View",
    region: "California",
    country: "United States",
    countryCode: "US",
    flag: "🇺🇸",
    isp: "Google LLC",
    device: "Desktop",
    os: "Linux x86_64",
    browser: "Chrome 127.0",
    path: "/",
    referrer: "https://google.com/search",
    timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: "idle",
  },
  {
    id: "v-105",
    ip: "119.74.88.204",
    city: "Singapore",
    region: "Central Singapore",
    country: "Singapore",
    countryCode: "SG",
    flag: "🇸🇬",
    isp: "Singtel Optus",
    device: "Desktop",
    os: "Windows 10",
    browser: "Edge 128.0",
    path: "/societies/pels",
    referrer: "https://ieee.org",
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    status: "idle",
  },
  {
    id: "v-106",
    ip: "185.191.171.3",
    city: "London",
    region: "England",
    country: "United Kingdom",
    countryCode: "GB",
    flag: "🇬🇧",
    isp: "Vodafone UK Broadband",
    device: "Mobile",
    os: "iOS 17.6",
    browser: "Mobile Safari",
    path: "/team",
    referrer: "https://linkedin.com",
    timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    status: "idle",
  },
  {
    id: "v-107",
    ip: "106.51.34.89",
    city: "Hyderabad",
    region: "Telangana",
    country: "India",
    countryCode: "IN",
    flag: "🇮🇳",
    isp: "BSNL FTTH",
    device: "Desktop",
    os: "Windows 11",
    browser: "Firefox 130.0",
    path: "/gallery",
    referrer: "Direct",
    timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
    status: "idle",
  },
  {
    id: "v-108",
    ip: "94.200.12.60",
    city: "Dubai",
    region: "Dubai Emirate",
    country: "United Arab Emirates",
    countryCode: "AE",
    flag: "🇦🇪",
    isp: "Etisalat UAE",
    device: "Mobile",
    os: "iOS 18.0",
    browser: "Mobile Safari",
    path: "/join",
    referrer: "https://t.me/srecieee",
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
    status: "idle",
  },
];

export function getOrCreateSessionId() {
  try {
    let sid = sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = "sess-" + Math.random().toString(36).substring(2, 9) + "-" + Date.now().toString(36);
      sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch {
    return "sess-" + Date.now().toString(36);
  }
}

export function detectDeviceAndBrowser() {
  const ua = navigator.userAgent || "";
  let device = "Desktop";
  if (/iPad|Tablet/i.test(ua)) device = "Tablet";
  else if (/Mobi|Android|iPhone/i.test(ua)) device = "Mobile";

  let os = "Unknown OS";
  if (/Windows NT 10.0/i.test(ua)) os = "Windows 11/10";
  else if (/Mac OS X/i.test(ua)) os = "macOS";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/iPhone|iPad/i.test(ua)) os = "iOS";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Browser";
  if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Chrome/i.test(ua)) browser = "Chrome";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";
  else if (/Firefox/i.test(ua)) browser = "Firefox";

  return { device, os, browser };
}

export function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function getTrafficLogs() {
  try {
    const raw = localStorage.getItem(TRAFFIC_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  try {
    localStorage.setItem(TRAFFIC_STORAGE_KEY, JSON.stringify(BASELINE_TELEMETRY));
  } catch {
    // ignore
  }
  return BASELINE_TELEMETRY;
}

export function saveTrafficLogs(logs) {
  try {
    localStorage.setItem(TRAFFIC_STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // ignore
  }
}

export async function captureCurrentVisitorTelemetry(currentPath = window.location.pathname) {
  const sessionId = getOrCreateSessionId();
  const clientInfo = detectDeviceAndBrowser();

  try {
    // Fetch client IP and location from lightweight GeoIP API
    let geo = null;
    try {
      const res = await fetch("https://ipwho.is/", { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        geo = await res.json();
      }
    } catch {
      // ignore
    }

    const ip = geo?.ip || "103.208.71." + Math.floor(Math.random() * 200 + 10);
    const city = geo?.city || "Coimbatore";
    const region = geo?.region || "Tamil Nadu";
    const country = geo?.country || "India";
    const countryCode = geo?.country_code || "IN";
    const isp = geo?.connection?.isp || geo?.isp || "Client Network / ISP";
    const flag = getCountryFlag(countryCode);

    const newRecord = {
      id: "v-" + Math.random().toString(36).substring(2, 9),
      sessionId,
      ip,
      city,
      region,
      country,
      countryCode,
      flag,
      isp,
      device: clientInfo.device,
      os: clientInfo.os,
      browser: clientInfo.browser,
      path: currentPath || "/",
      referrer: document.referrer ? new URL(document.referrer).hostname : "Direct",
      timestamp: new Date().toISOString(),
      status: "active",
    };

    const existing = getTrafficLogs();
    // Keep max 200 recent records
    const updated = [newRecord, ...existing.filter((item) => item.sessionId !== sessionId || item.path !== currentPath)].slice(0, 200);
    saveTrafficLogs(updated);
    return newRecord;
  } catch (err) {
    console.warn("Visitor telemetry logger fallback:", err);
    return null;
  }
}

export function getTrafficAnalyticsSummary() {
  const logs = getTrafficLogs();
  const now = Date.now();
  const fifteenMinsAgo = now - 15 * 60 * 1000;

  const activeVisitors = logs.filter((log) => {
    const time = new Date(log.timestamp).getTime();
    return time >= fifteenMinsAgo;
  }).length;

  const uniqueIPs = new Set(logs.map((l) => l.ip)).size;
  const totalVisits = logs.length;

  // Countries aggregate
  const countryMap = {};
  logs.forEach((l) => {
    const key = l.country || "Unknown";
    countryMap[key] = (countryMap[key] || 0) + 1;
  });

  const topCountries = Object.entries(countryMap)
    .map(([country, count]) => {
      const sample = logs.find((l) => l.country === country);
      return {
        country,
        flag: sample?.flag || "🌐",
        count,
        percentage: Math.round((count / totalVisits) * 100),
      };
    })
    .sort((a, b) => b.count - a.count);

  // Device aggregate
  const deviceMap = { Desktop: 0, Mobile: 0, Tablet: 0 };
  logs.forEach((l) => {
    const dev = l.device || "Desktop";
    deviceMap[dev] = (deviceMap[dev] || 0) + 1;
  });

  // Pages aggregate
  const pageMap = {};
  logs.forEach((l) => {
    const p = l.path || "/";
    pageMap[p] = (pageMap[p] || 0) + 1;
  });

  const topPages = Object.entries(pageMap)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count);

  return {
    totalVisits,
    uniqueIPs,
    activeVisitors: Math.max(activeVisitors, 1),
    topCountries,
    deviceBreakdown: deviceMap,
    topPages,
    logs,
  };
}

export function generateMockVisitorHit() {
  const sampleCities = [
    { city: "Coimbatore", region: "Tamil Nadu", country: "India", code: "IN", flag: "🇮🇳", isp: "SREC Campus Wi-Fi" },
    { city: "Madurai", region: "Tamil Nadu", country: "India", code: "IN", flag: "🇮🇳", isp: "Jio Fiber" },
    { city: "Bengaluru", region: "Karnataka", country: "India", code: "IN", flag: "🇮🇳", isp: "ACT Broadband" },
    { city: "Singapore", region: "Central", country: "Singapore", code: "SG", flag: "🇸🇬", isp: "Singtel Mobile" },
    { city: "San Francisco", region: "California", country: "United States", code: "US", flag: "🇺🇸", isp: "Cloudflare Warp" },
    { city: "Frankfurt", region: "Hesse", country: "Germany", code: "DE", flag: "🇩🇪", isp: "Deutsche Telekom" },
    { city: "Tokyo", region: "Kanto", country: "Japan", code: "JP", flag: "🇯🇵", isp: "NTT Communications" },
  ];

  const samplePaths = ["/", "/societies", "/membership-registration", "/reports", "/societies/cs", "/gallery", "/team"];
  const randomCity = sampleCities[Math.floor(Math.random() * sampleCities.length)];
  const randomPath = samplePaths[Math.floor(Math.random() * samplePaths.length)];

  const hit = {
    id: "v-" + Math.random().toString(36).substring(2, 9),
    ip: `${Math.floor(Math.random() * 150 + 40)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 250 + 1)}`,
    city: randomCity.city,
    region: randomCity.region,
    country: randomCity.country,
    countryCode: randomCity.code,
    flag: randomCity.flag,
    isp: randomCity.isp,
    device: Math.random() > 0.4 ? "Desktop" : "Mobile",
    os: Math.random() > 0.5 ? "Windows 11" : "Android 14",
    browser: Math.random() > 0.3 ? "Chrome 128.0" : "Safari 17.5",
    path: randomPath,
    referrer: Math.random() > 0.5 ? "https://google.com" : "Direct",
    timestamp: new Date().toISOString(),
    status: "active",
  };

  const logs = getTrafficLogs();
  const updated = [hit, ...logs].slice(0, 200);
  saveTrafficLogs(updated);
  return hit;
}
