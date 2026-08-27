import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getTrafficLogs,
  saveTrafficLogs,
  getTrafficAnalyticsSummary,
  generateMockVisitorHit,
  getCountryFlag,
  detectDeviceAndBrowser,
} from "@/utils/visitorTracker";

describe("Visitor Telemetry & Traffic Tracker", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("should initialize default baseline telemetry logs if storage is empty", () => {
    const logs = getTrafficLogs();
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0]).toHaveProperty("ip");
    expect(logs[0]).toHaveProperty("city");
    expect(logs[0]).toHaveProperty("country");
  });

  it("should calculate correct traffic analytics summary", () => {
    const summary = getTrafficAnalyticsSummary();
    expect(summary.totalVisits).toBeGreaterThan(0);
    expect(summary.uniqueIPs).toBeGreaterThan(0);
    expect(summary.activeVisitors).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(summary.topCountries)).toBe(true);
    expect(summary.deviceBreakdown).toHaveProperty("Desktop");
    expect(summary.deviceBreakdown).toHaveProperty("Mobile");
  });

  it("should generate and append mock visitor hits", () => {
    const initialCount = getTrafficLogs().length;
    const hit = generateMockVisitorHit();

    expect(hit).toHaveProperty("ip");
    expect(hit).toHaveProperty("city");
    expect(hit).toHaveProperty("country");
    expect(hit).toHaveProperty("path");

    const updated = getTrafficLogs();
    expect(updated.length).toBe(initialCount + 1);
    expect(updated[0].ip).toBe(hit.ip);
  });

  it("should generate correct flag emoji for ISO country code", () => {
    expect(getCountryFlag("IN")).toBe("🇮🇳");
    expect(getCountryFlag("US")).toBe("🇺🇸");
    expect(getCountryFlag("SG")).toBe("🇸🇬");
  });

  it("should detect client device and browser environment", () => {
    const info = detectDeviceAndBrowser();
    expect(info).toHaveProperty("device");
    expect(info).toHaveProperty("os");
    expect(info).toHaveProperty("browser");
  });
});
