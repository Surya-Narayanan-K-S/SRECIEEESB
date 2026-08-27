import { describe, it, expect } from "vitest";
import { cn, resolveAssetUrl } from "@/lib/utils";
describe("Utility Functions (src/lib/utils.ts)", () => {
    describe("cn() - Class Name Merger", () => {
        it("should merge basic class names correctly", () => {
            const result = cn("bg-blue-500", "text-white");
            expect(result).toBe("bg-blue-500 text-white");
        });
        it("should handle conflicting tailwind classes with twMerge", () => {
            const result = cn("p-4", "p-8");
            expect(result).toBe("p-8");
        });
        it("should ignore falsy values (null, undefined, false)", () => {
            const isHidden = false;
            const result = cn("text-sm", isHidden && "hidden", null, undefined, "font-bold");
            expect(result).toBe("text-sm font-bold");
        });
        it("should merge conditional class objects", () => {
            const result = cn("btn", { "btn-primary": true, "btn-disabled": false });
            expect(result).toBe("btn btn-primary");
        });
    });
    describe("resolveAssetUrl()", () => {
        it("should return empty string for null/undefined/empty input", () => {
            expect(resolveAssetUrl(null)).toBe("");
            expect(resolveAssetUrl(undefined)).toBe("");
            expect(resolveAssetUrl("")).toBe("");
        });
        it("should return full HTTP / HTTPS URLs unchanged", () => {
            const httpUrl = "http://example.com/image.png";
            const httpsUrl = "https://srecieee.org/assets/logo.png";
            expect(resolveAssetUrl(httpUrl)).toBe(httpUrl);
            expect(resolveAssetUrl(httpsUrl)).toBe(httpsUrl);
        });
        it("should return data URIs unchanged", () => {
            const dataUri = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
            expect(resolveAssetUrl(dataUri)).toBe(dataUri);
        });
        it("should return relative URLs correctly on web", () => {
            const relativeUrl = "/assets/gallery/photo1.jpg";
            expect(resolveAssetUrl(relativeUrl)).toBe(relativeUrl);
        });
    });
});
