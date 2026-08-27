import { describe, it, expect, vi, beforeEach } from "vitest";
import { calculateMembershipFeeINR, fetchUsdToInrRate, formatINR, formatUSD, DEFAULT_USD_INR_RATE, DEFAULT_BRANCH_SURCHARGE_INR, } from "@/utils/currency";
describe("Currency Exchange & Conversion System (fawazahmed0/exchange-api)", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        try {
            sessionStorage.clear();
        }
        catch {
            // ignore
        }
    });
    describe("calculateMembershipFeeINR()", () => {
        it("should calculate base INR and add default +₹200 branch surcharge", () => {
            const usdAmount = 14;
            const rate = 87.5;
            const result = calculateMembershipFeeINR(usdAmount, rate, 200);
            expect(result.usdAmount).toBe(14);
            expect(result.rate).toBe(87.5);
            expect(result.baseINR).toBe(Math.round(14 * 87.5)); // 1225
            expect(result.surchargeINR).toBe(200);
            expect(result.totalINR).toBe(1225 + 200); // 1425
        });
        it("should correctly handle custom rates and custom surcharges", () => {
            const result = calculateMembershipFeeINR(100, 90, 200);
            expect(result.baseINR).toBe(9000);
            expect(result.totalINR).toBe(9200);
        });
        it("should use default rate if not specified", () => {
            const result = calculateMembershipFeeINR(10);
            expect(result.rate).toBe(DEFAULT_USD_INR_RATE);
            expect(result.surchargeINR).toBe(DEFAULT_BRANCH_SURCHARGE_INR);
        });
    });
    describe("formatINR() and formatUSD()", () => {
        it("should format INR string with rupee sign", () => {
            expect(formatINR(1425)).toBe("₹1,425");
            expect(formatINR(50000)).toBe("₹50,000");
        });
        it("should format USD string with dollar sign", () => {
            expect(formatUSD(14)).toBe("$14.00 USD");
            expect(formatUSD(27.5)).toBe("$27.50 USD");
        });
    });
    describe("fetchUsdToInrRate()", () => {
        it("should parse exchange rate correctly from API response mock", async () => {
            const mockApiResponse = {
                date: "2026-08-27",
                usd: {
                    inr: 87.42,
                },
            };
            vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
                ok: true,
                json: async () => mockApiResponse,
            }));
            const data = await fetchUsdToInrRate();
            expect(data.rate).toBe(87.42);
            expect(data.date).toBe("2026-08-27");
        });
        it("should fallback gracefully to DEFAULT_USD_INR_RATE if network fails", async () => {
            vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network connection failed")));
            const data = await fetchUsdToInrRate();
            expect(data.rate).toBe(DEFAULT_USD_INR_RATE);
            expect(data.source).toBe("fallback-default");
        });
    });
});
