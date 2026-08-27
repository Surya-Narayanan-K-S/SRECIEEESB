import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Capacitor } from "@capacitor/core";
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
export function resolveAssetUrl(url) {
    if (!url)
        return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
        return url;
    }
    if (Capacitor.isNativePlatform()) {
        const baseUrl = import.meta.env.VITE_MEDIA_BASE_URL || "https://new-ieee.vercel.app";
        const cleanPath = url.startsWith("/") ? url.slice(1) : url;
        return `${baseUrl}/${cleanPath}`;
    }
    return url;
}
