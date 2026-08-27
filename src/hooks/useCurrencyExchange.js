import { useState, useEffect, useCallback } from "react";
import { fetchUsdToInrRate, calculateMembershipFeeINR, DEFAULT_USD_INR_RATE, DEFAULT_BRANCH_SURCHARGE_INR, } from "@/utils/currency";
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes polling
export function useCurrencyExchange() {
    const [exchangeData, setExchangeData] = useState({
        rate: DEFAULT_USD_INR_RATE,
        date: new Date().toISOString().split("T")[0],
        source: "initializing",
        timestamp: Date.now(),
    });
    const [isLoading, setIsLoading] = useState(true);
    const [lastRefreshed, setLastRefreshed] = useState(new Date());
    const refreshRate = useCallback(async () => {
        try {
            const data = await fetchUsdToInrRate();
            setExchangeData(data);
            setLastRefreshed(new Date());
        }
        catch {
            // Fallback already handled inside fetchUsdToInrRate
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        // Initial fetch
        refreshRate();
        // Auto-polling every 5 minutes
        const timer = setInterval(() => {
            refreshRate();
        }, POLL_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [refreshRate]);
    const convertUSD = useCallback((usdAmount, surcharge = DEFAULT_BRANCH_SURCHARGE_INR) => {
        return calculateMembershipFeeINR(usdAmount, exchangeData.rate, surcharge);
    }, [exchangeData.rate]);
    return {
        usdToInrRate: exchangeData.rate,
        rateDate: exchangeData.date,
        rateSource: exchangeData.source,
        lastRefreshed,
        isLoading,
        refreshRate,
        convertUSD,
        surchargeINR: DEFAULT_BRANCH_SURCHARGE_INR,
    };
}
