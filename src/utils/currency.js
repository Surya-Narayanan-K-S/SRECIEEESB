/**
 * Currency Exchange Helper using fawazahmed0/exchange-api
 * API Sources:
 * 1. Primary: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json
 * 2. Fallback: https://latest.currency-api.pages.dev/v1/currencies/usd.json
 */
const CACHE_KEY = "ieee_usd_inr_rate";
const CACHE_TIME_KEY = "ieee_usd_inr_timestamp";
const FIVE_MINUTES_MS = 5 * 60 * 1000;
export const DEFAULT_USD_INR_RATE = 87.5;
export const DEFAULT_BRANCH_SURCHARGE_INR = 200; // Extra ₹200 added to receipt
/**
 * Fetch live USD to INR exchange rate from fawazahmed0/exchange-api
 */
export async function fetchUsdToInrRate() {
    const primaryUrl = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";
    const fallbackUrl = "https://latest.currency-api.pages.dev/v1/currencies/usd.json";
    const fetchWithTimeout = async (url, timeoutMs = 6000) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!response.ok)
                throw new Error(`HTTP error ${response.status}`);
            return await response.json();
        }
        finally {
            clearTimeout(timeoutId);
        }
    };
    try {
        let data;
        let source = "cdn.jsdelivr.net";
        try {
            data = await fetchWithTimeout(primaryUrl);
        }
        catch {
            source = "currency-api.pages.dev";
            data = await fetchWithTimeout(fallbackUrl);
        }
        const inrRate = data?.usd?.inr || data?.usd?.INR;
        if (typeof inrRate === "number" && inrRate > 0) {
            const result = {
                rate: +inrRate.toFixed(2),
                date: data?.date || new Date().toISOString().split("T")[0],
                source,
                timestamp: Date.now(),
            };
            try {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify(result));
                sessionStorage.setItem(CACHE_TIME_KEY, result.timestamp.toString());
            }
            catch {
                // Storage might be unavailable
            }
            return result;
        }
        throw new Error("Invalid INR rate format");
    }
    catch (err) {
        // Attempt cache recovery
        try {
            const cached = sessionStorage.getItem(CACHE_KEY);
            if (cached) {
                return JSON.parse(cached);
            }
        }
        catch {
            // Ignore cache parse error
        }
        return {
            rate: DEFAULT_USD_INR_RATE,
            date: new Date().toISOString().split("T")[0],
            source: "fallback-default",
            timestamp: Date.now(),
        };
    }
}
/**
 * Calculate converted INR amount with +₹200 branch charge
 */
export function calculateMembershipFeeINR(usdAmount, rate = DEFAULT_USD_INR_RATE, surchargeINR = DEFAULT_BRANCH_SURCHARGE_INR) {
    const baseINR = Math.round(usdAmount * rate);
    const totalINR = baseINR + surchargeINR;
    return {
        usdAmount,
        rate,
        baseINR,
        surchargeINR,
        totalINR,
    };
}
/**
 * Format Indian Rupee Currency string
 */
export function formatINR(amount) {
    return `₹${amount.toLocaleString("en-IN")}`;
}
/**
 * Format US Dollar Currency string
 */
export function formatUSD(amount) {
    return `$${amount.toFixed(2)} USD`;
}
