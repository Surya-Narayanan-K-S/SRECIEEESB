import { supabase } from "@/lib/supabase";
/**
 * Returns an ordered list of candidate URLs where a member's IEEE Card PDF may be found.
 * 1. Custom/Explicit URL in DB (card_pdf_url)
 * 2. Static public folder: /cards/{ieee_id}.pdf
 * 3. Supabase Storage: 'ieee-cards' bucket with {ieee_id}.pdf
 * 4. Static public folder: /cards/{roll_number}.pdf
 * 5. Supabase Storage: 'ieee-cards' bucket with {roll_number}.pdf
 */
export const getMemberCardPdfCandidates = (member) => {
    const candidates = [];
    const cleanIeeeId = (member.ieee_id || "").trim().replace(/^#/, "");
    const cleanRoll = (member.roll_number || "").trim().toUpperCase();
    // 1. Direct explicit DB URL
    if (member.card_pdf_url && member.card_pdf_url.trim()) {
        candidates.push(member.card_pdf_url.trim());
    }
    // 2. Static local paths by IEEE ID
    if (cleanIeeeId && cleanIeeeId !== "PENDING") {
        candidates.push(`/cards/${cleanIeeeId}.pdf`);
        candidates.push(`/ieee-cards/${cleanIeeeId}.pdf`);
        candidates.push(`/pdf/${cleanIeeeId}.pdf`);
        // Supabase Storage Public URL
        try {
            const { data } = supabase.storage
                .from("ieee-cards")
                .getPublicUrl(`${cleanIeeeId}.pdf`);
            if (data?.publicUrl) {
                candidates.push(data.publicUrl);
            }
        }
        catch {
            // ignore
        }
    }
    // 3. Fallback static local paths by Roll Number
    if (cleanRoll) {
        candidates.push(`/cards/${cleanRoll}.pdf`);
        try {
            const { data } = supabase.storage
                .from("ieee-cards")
                .getPublicUrl(`${cleanRoll}.pdf`);
            if (data?.publicUrl) {
                candidates.push(data.publicUrl);
            }
        }
        catch {
            // ignore
        }
    }
    // Deduplicate
    return Array.from(new Set(candidates));
};
/**
 * Resolves the primary URL to display or check for a member's IEEE PDF Card.
 */
export const getPrimaryMemberCardPdfUrl = (member) => {
    if (member.card_pdf_url && member.card_pdf_url.trim()) {
        return member.card_pdf_url.trim();
    }
    const cleanIeeeId = (member.ieee_id || "").trim().replace(/^#/, "");
    if (cleanIeeeId && cleanIeeeId !== "PENDING") {
        return `/cards/${cleanIeeeId}.pdf`;
    }
    const cleanRoll = (member.roll_number || "").trim().toUpperCase();
    if (cleanRoll) {
        return `/cards/${cleanRoll}.pdf`;
    }
    return "/cards/sample.pdf";
};
/**
 * Uploads a member's IEEE PDF card to Supabase storage.
 * Checks candidate buckets in priority order: ['ieee-cards', 'member-avatars', 'office_bearers', 'activities']
 * and returns the public URL.
 */
export const uploadMemberCardPdf = async (file, identifier // ieee_id or roll_number
) => {
    const cleanId = identifier.trim().replace(/[^a-zA-Z0-9_-]/g, "") || "member";
    const fileName = `cards/${cleanId}_${Date.now()}.pdf`;
    const rootFileName = `${cleanId}_${Date.now()}.pdf`;
    const bucketCandidates = ["ieee-cards", "member-avatars", "office_bearers", "activities"];
    let lastError = null;
    for (const bucket of bucketCandidates) {
        try {
            const uploadPath = bucket === "ieee-cards" ? rootFileName : fileName;
            const { data, error } = await supabase.storage
                .from(bucket)
                .upload(uploadPath, file, {
                upsert: true,
                contentType: "application/pdf",
            });
            if (!error && data?.path) {
                const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(uploadPath);
                if (urlData?.publicUrl) {
                    return urlData.publicUrl;
                }
            }
            if (error) {
                lastError = error;
                // If error is bucket not found, continue trying other existing buckets
                if (error.message?.toLowerCase().includes("not found") || error.statusCode === "404") {
                    continue;
                }
            }
        }
        catch (err) {
            lastError = err;
        }
    }
    // If all candidate buckets failed because they don't exist:
    const errorMsg = lastError?.message || "Storage bucket not found";
    if (errorMsg.toLowerCase().includes("not found") || lastError?.statusCode === "404") {
        throw new Error("Supabase Storage bucket 'ieee-cards' does not exist. Please create a public bucket named 'ieee-cards' in your Supabase Dashboard under Storage > New Bucket, or run the provided SQL script.");
    }
    throw lastError || new Error("Failed to upload PDF card to Supabase storage.");
};
