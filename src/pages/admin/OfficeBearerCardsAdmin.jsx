import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Crown, ShieldCheck, Search, Printer, Upload, ExternalLink, Edit2, RefreshCw, X, FileText, FileSpreadsheet, CheckCircle2, AlertCircle, AlertTriangle, Sparkles, Phone, Building2, Calendar, Layers, ArrowRight, Loader2, Check, Maximize2, Copy, Zap, UserCheck, ChevronDown, Clock } from "lucide-react";
import srecCampus from "@/assets/srec-campus.png";
import ieeeCustomCardLogo from "@/assets/ieee-custom-card-logo.png";
import counselorSignature from "@/assets/counselor-signature.png";
import snrTrustLogo from "@/assets/snr-trust-logo.png";
import { getPrimaryMemberCardPdfUrl, uploadMemberCardPdf } from "@/utils/cardPdfHelper";
export const SOCIETIES_METADATA = [
    { code: "all", name: "All Societies & Main Branch", shortName: "All Chapters", color: "from-blue-600 to-indigo-600", glow: "shadow-blue-500/25", accent: "#0066cc", badgeBg: "bg-blue-500/10", border: "border-blue-500/30" },
    { code: "cs", name: "IEEE Computer Society (CS)", shortName: "CS Chapter", color: "from-blue-600 to-cyan-600", glow: "shadow-cyan-500/25", accent: "#06b6d4", badgeBg: "bg-cyan-500/10", border: "border-cyan-500/40" },
    { code: "cis", name: "IEEE Computational Intelligence Society (CIS)", shortName: "CIS Chapter", color: "from-purple-600 to-indigo-600", glow: "shadow-purple-500/25", accent: "#8b5cf6", badgeBg: "bg-purple-500/10", border: "border-purple-500/40" },
    { code: "comsoc", name: "IEEE Communications Society (ComSoc)", shortName: "ComSoc Chapter", color: "from-emerald-600 to-teal-600", glow: "shadow-emerald-500/25", accent: "#10b981", badgeBg: "bg-emerald-500/10", border: "border-emerald-500/40" },
    { code: "embs", name: "IEEE Engineering in Medicine & Biology (EMBS)", shortName: "EMBS Chapter", color: "from-rose-600 to-pink-600", glow: "shadow-rose-500/25", accent: "#f43f5e", badgeBg: "bg-rose-500/10", border: "border-rose-500/40" },
    { code: "im", name: "IEEE Instrumentation & Measurement (IMS)", shortName: "IMS Chapter", color: "from-amber-600 to-orange-600", glow: "shadow-amber-500/25", accent: "#f59e0b", badgeBg: "bg-amber-500/10", border: "border-amber-500/40" },
    { code: "pels", name: "IEEE Power Electronics Society (PELS)", shortName: "PELS Chapter", color: "from-yellow-600 to-amber-600", glow: "shadow-yellow-500/25", accent: "#eab308", badgeBg: "bg-yellow-500/10", border: "border-yellow-500/40" },
    { code: "cas", name: "IEEE Circuits and Systems Society (CAS)", shortName: "CAS Chapter", color: "from-teal-600 to-cyan-700", glow: "shadow-teal-500/25", accent: "#14b8a6", badgeBg: "bg-teal-500/10", border: "border-teal-500/40" },
    { code: "wie", name: "IEEE Women in Engineering (WIE)", shortName: "WIE Affinity", color: "from-pink-600 to-purple-700", glow: "shadow-pink-500/25", accent: "#ec4899", badgeBg: "bg-pink-500/10", border: "border-pink-500/40" },
    { code: "srec", name: "IEEE Student Branch SREC (Main SB)", shortName: "Main SB SREC", color: "from-blue-700 to-indigo-900", glow: "shadow-blue-500/30", accent: "#3b82f6", badgeBg: "bg-blue-500/10", border: "border-blue-500/40" },
];
export const OfficeBearerCardsAdmin = () => {
    // State
    const [allOfficers, setAllOfficers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [syncingDatabase, setSyncingDatabase] = useState(false);
    const [viewMode, setViewMode] = useState("grid");
    const [copiedId, setCopiedId] = useState(null);
    // Filters
    const [selectedSociety, setSelectedSociety] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [cardStatusFilter, setCardStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [yearFilter, setYearFilter] = useState("all");
    // Custom Dropdowns UI State
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
    const statusDropdownRef = useRef(null);
    const yearDropdownRef = useRef(null);
    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
                setIsStatusDropdownOpen(false);
            }
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(e.target)) {
                setIsYearDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // Modals & Active Inspector State
    const [previewCardOfficer, setPreviewCardOfficer] = useState(null);
    const [flippedCardIds, setFlippedCardIds] = useState({});
    const [activePdfOfficer, setActivePdfOfficer] = useState(null);
    const [uploadingOfficer, setUploadingOfficer] = useState(null);
    const [editingOfficer, setEditingOfficer] = useState(null);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    // Edit Form State
    const [editForm, setEditForm] = useState({
        name: "",
        role: "",
        department: "",
        academic_year: "",
        ieee_id: "",
        roll_number: "",
        card_pdf_url: "",
        email: "",
        phone: "",
        linkedin_url: "",
    });
    // ─── 1. FETCH ALL OFFICE BEARERS & CROSS-MATCH WITH STUDENT ROSTER ───
    const fetchAllBearerData = useCallback(async () => {
        setLoading(true);
        try {
            const safeFetch = async (table) => {
                try {
                    const { data, error } = await supabase.from(table).select("*").order("id", { ascending: true });
                    if (error)
                        return [];
                    return data || [];
                }
                catch {
                    return [];
                }
            };
            // 1. Fetch Student Members Master Directory for cross-referencing
            const studentMembersData = await safeFetch("student_members");
            // Normalization helper for resilient fuzzy name matching
            const normalize = (name) => (name || "")
                .toLowerCase()
                .replace(/^(mr\.|ms\.|mrs\.|dr\.|prof\.)\s*/i, "")
                .replace(/[^a-z0-9]/g, " ")
                .replace(/\s+/g, " ")
                .trim();
            // Flexible Match Finder against student_members
            const findStudentMatch = (bearer) => {
                const bRawName = (bearer.name || "").trim();
                const bNorm = normalize(bRawName);
                const bTokens = bNorm.split(" ").filter((t) => t.length >= 2);
                const bRoll = (bearer.roll_number || "").toUpperCase().trim();
                const bEmail = (bearer.email || "").toLowerCase().trim();
                const bIeee = (bearer.ieee_id || bearer.membership_id || "").trim();
                return studentMembersData.find((s) => {
                    const sFullName = `${s.first_name || ""} ${s.last_name || ""}`.trim();
                    const sNorm = normalize(sFullName);
                    const sTokens = sNorm.split(" ").filter((t) => t.length >= 2);
                    const sRoll = (s.roll_number || "").toUpperCase().trim();
                    const sEmail = (s.email || "").toLowerCase().trim();
                    const sIeee = (s.ieee_id || "").trim();
                    // 1. Exact Roll Number Match
                    if (bRoll && sRoll && bRoll === sRoll)
                        return true;
                    // 2. Exact Email Match
                    if (bEmail && sEmail && bEmail === sEmail)
                        return true;
                    // 3. Exact IEEE ID Match
                    if (bIeee && sIeee && bIeee !== "PENDING" && bIeee === sIeee)
                        return true;
                    // 4. Exact/Substring Normalized Name Match
                    if (bNorm && sNorm && (bNorm === sNorm || bNorm.includes(sNorm) || sNorm.includes(bNorm)))
                        return true;
                    // 5. Multi-token overlap
                    if (bTokens.length > 0 && sTokens.length > 0) {
                        const overlap = bTokens.filter((t) => sTokens.includes(t));
                        if (overlap.length >= 2 || (overlap.length === 1 && (bTokens.length === 1 || sTokens.length === 1))) {
                            return true;
                        }
                    }
                    return false;
                });
            };
            const collectedOfficers = [];
            // 2. Fetch for each society
            const societiesToFetch = [
                { code: "srec", name: "IEEE Student Branch SREC (Main SB)", bTable: "srec_office_bearers", eTable: "srec_executive_members", altB: "new_office_bearers", altE: "new_executive_members" },
                { code: "cs", name: "IEEE Computer Society (CS)", bTable: "cs_office_bearers", eTable: "cs_executive_members" },
                { code: "cis", name: "IEEE Computational Intelligence Society (CIS)", bTable: "cis_office_bearers", eTable: "cis_executive_members" },
                { code: "comsoc", name: "IEEE Communications Society (ComSoc)", bTable: "comsoc_office_bearers", eTable: "comsoc_executive_members" },
                { code: "embs", name: "IEEE Engineering in Medicine & Biology (EMBS)", bTable: "embs_office_bearers", eTable: "embs_executive_members" },
                { code: "im", name: "IEEE Instrumentation & Measurement (IMS)", bTable: "im_office_bearers", eTable: "im_executive_members", altB: "ims_office_bearers", altE: "ims_executive_members" },
                { code: "pels", name: "IEEE Power Electronics Society (PELS)", bTable: "pels_office_bearers", eTable: "pels_executive_members" },
                { code: "cas", name: "IEEE Circuits and Systems Society (CAS)", bTable: "cas_office_bearers", eTable: "cas_executive_members", altB: "cass_office_bearers", altE: "cass_executive_members" },
                { code: "wie", name: "IEEE Women in Engineering (WIE)", bTable: "wie_office_bearers", eTable: "wie_executive_members" },
            ];
            for (const soc of societiesToFetch) {
                let [bRows, eRows] = await Promise.all([
                    safeFetch(soc.bTable),
                    safeFetch(soc.eTable),
                ]);
                if (bRows.length === 0 && soc.altB) {
                    bRows = await safeFetch(soc.altB);
                }
                if (eRows.length === 0 && soc.altE) {
                    eRows = await safeFetch(soc.altE);
                }
                // Process Office Bearers
                bRows.forEach((row) => {
                    const matched = findStudentMatch(row);
                    const ieeeId = row.ieee_id || row.membership_id || (matched?.ieee_id && matched?.ieee_id !== "PENDING" ? matched?.ieee_id : null);
                    const rollNumber = row.roll_number || matched?.roll_number || null;
                    const phone = row.phone || matched?.phone || null;
                    const email = row.email || matched?.email || null;
                    const cardPdf = row.card_pdf_url || row.ieee_card_pdf || matched?.card_pdf_url || null;
                    const department = row.department || matched?.department || "SREC Engineering";
                    collectedOfficers.push({
                        ...row,
                        category: "bearers",
                        society_code: soc.code,
                        society_name: soc.name,
                        _sourceTable: soc.bTable,
                        ieee_id: ieeeId,
                        membership_id: ieeeId,
                        roll_number: rollNumber,
                        phone,
                        email,
                        department,
                        card_pdf_url: cardPdf,
                        security_pin: matched?.security_pin,
                        membership_status: matched?.membership_status || (ieeeId && ieeeId !== "PENDING" ? "Active" : "Pending"),
                        matched_student_id: matched?.id,
                        matched_student_name: matched ? `${matched.first_name || ""} ${matched.last_name || ""}`.trim() : null,
                        is_matched_roster: Boolean(matched),
                    });
                });
                // Process Executive Members
                eRows.forEach((row) => {
                    const matched = findStudentMatch(row);
                    const ieeeId = row.ieee_id || row.membership_id || (matched?.ieee_id && matched?.ieee_id !== "PENDING" ? matched?.ieee_id : null);
                    const rollNumber = row.roll_number || matched?.roll_number || null;
                    const phone = row.phone || matched?.phone || null;
                    const email = row.email || matched?.email || null;
                    const cardPdf = row.card_pdf_url || row.ieee_card_pdf || matched?.card_pdf_url || null;
                    const department = row.department || matched?.department || "SREC Engineering";
                    collectedOfficers.push({
                        ...row,
                        category: "executives",
                        society_code: soc.code,
                        society_name: soc.name,
                        _sourceTable: soc.eTable,
                        ieee_id: ieeeId,
                        membership_id: ieeeId,
                        roll_number: rollNumber,
                        phone,
                        email,
                        department,
                        card_pdf_url: cardPdf,
                        security_pin: matched?.security_pin,
                        membership_status: matched?.membership_status || (ieeeId && ieeeId !== "PENDING" ? "Active" : "Pending"),
                        matched_student_id: matched?.id,
                        matched_student_name: matched ? `${matched.first_name || ""} ${matched.last_name || ""}`.trim() : null,
                        is_matched_roster: Boolean(matched),
                    });
                });
            }
            setAllOfficers(collectedOfficers);
        }
        catch (err) {
            console.error("Error fetching office bearers cards directory:", err);
        }
        finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);
    useEffect(() => {
        fetchAllBearerData();
    }, [fetchAllBearerData]);
    const handleRefresh = () => {
        setRefreshing(true);
        fetchAllBearerData();
    };
    // ─── 2. AUTO-SYNC ALL NUMBERS TO SUPABASE TABLES ───
    const handleAutoSyncDatabase = async () => {
        const matchedWithDetails = allOfficers.filter((o) => o.is_matched_roster && o._sourceTable);
        if (matchedWithDetails.length === 0) {
            alert("All officer details are already synchronized or no matches found.");
            return;
        }
        try {
            setSyncingDatabase(true);
            let updatedCount = 0;
            for (const officer of matchedWithDetails) {
                const payload = {};
                if (officer.ieee_id) {
                    payload.ieee_id = officer.ieee_id;
                    payload.membership_id = officer.ieee_id;
                }
                if (officer.roll_number)
                    payload.roll_number = officer.roll_number;
                if (officer.phone)
                    payload.phone = officer.phone;
                if (officer.email)
                    payload.email = officer.email;
                if (officer.card_pdf_url)
                    payload.card_pdf_url = officer.card_pdf_url;
                if (Object.keys(payload).length > 0 && officer._sourceTable) {
                    try {
                        const { error } = await supabase
                            .from(officer._sourceTable)
                            .update(payload)
                            .eq("id", officer.id);
                        if (!error)
                            updatedCount++;
                    }
                    catch {
                        // ignore schema cache errors
                    }
                }
            }
            alert(`✓ Synchronized ${updatedCount} office bearers with verified IEEE Membership IDs, Phone Numbers & Roll Numbers from student_members table!`);
            fetchAllBearerData();
        }
        catch (err) {
            console.error("Sync error:", err);
            alert(`Sync completed with partial updates: ${err?.message || "Finished."}`);
        }
        finally {
            setSyncingDatabase(false);
        }
    };
    // ─── 3. FILTER & SEARCH COMPUTATION ───
    const filteredOfficers = useMemo(() => {
        return allOfficers.filter((officer) => {
            // Society filter
            if (selectedSociety !== "all" && officer.society_code !== selectedSociety) {
                return false;
            }
            // Category filter
            if (categoryFilter !== "all" && officer.category !== categoryFilter) {
                return false;
            }
            // Card status filter
            if (cardStatusFilter === "has_pdf") {
                const hasPdf = Boolean(officer.card_pdf_url || (officer.ieee_id && officer.ieee_id !== "PENDING"));
                if (!hasPdf)
                    return false;
            }
            else if (cardStatusFilter === "needs_pdf") {
                const hasPdf = Boolean(officer.card_pdf_url || (officer.ieee_id && officer.ieee_id !== "PENDING"));
                if (hasPdf)
                    return false;
            }
            else if (cardStatusFilter === "has_id") {
                if (!officer.ieee_id || officer.ieee_id === "PENDING")
                    return false;
            }
            else if (cardStatusFilter === "pending_id") {
                if (officer.ieee_id && officer.ieee_id !== "PENDING")
                    return false;
            }
            // Academic Year filter
            if (yearFilter !== "all") {
                const curYr = (officer.academic_year || String(officer.year || "")).toLowerCase();
                if (!curYr.includes(yearFilter.toLowerCase()))
                    return false;
            }
            // Search Query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const matchField = [
                    officer.name,
                    officer.role,
                    officer.department,
                    officer.society_name,
                    officer.society_code,
                    officer.academic_year,
                    officer.ieee_id,
                    officer.roll_number,
                    officer.phone,
                    officer.email,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();
                if (!matchField.includes(q))
                    return false;
            }
            return true;
        });
    }, [allOfficers, selectedSociety, categoryFilter, cardStatusFilter, yearFilter, searchQuery]);
    // Statistics Summary
    const stats = useMemo(() => {
        const total = allOfficers.length;
        const withIeeeId = allOfficers.filter((o) => o.ieee_id && o.ieee_id !== "PENDING").length;
        const pendingIeeeId = total - withIeeeId;
        const withPdf = allOfficers.filter((o) => o.card_pdf_url || (o.ieee_id && o.ieee_id !== "PENDING")).length;
        const matchedRoster = allOfficers.filter((o) => o.is_matched_roster).length;
        const bearersCount = allOfficers.filter((o) => o.category === "bearers").length;
        const execsCount = allOfficers.filter((o) => o.category === "executives").length;
        return { total, withIeeeId, pendingIeeeId, withPdf, matchedRoster, bearersCount, execsCount };
    }, [allOfficers]);
    // Distinct academic years for filter dropdown
    const availableYears = useMemo(() => {
        const years = new Set();
        allOfficers.forEach((o) => {
            if (o.academic_year)
                years.add(o.academic_year);
            if (o.year)
                years.add(String(o.year));
        });
        return Array.from(years);
    }, [allOfficers]);
    // ─── 4. CARD FLIP HELPER ───
    const toggleCardFlip = (key) => {
        setFlippedCardIds((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };
    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };
    // ─── 5. IMAGE RESOLVER ───
    const getOfficerPhoto = (officer) => {
        const raw = (officer.image_url || officer.photo || officer.photo_url || "").trim();
        if (!raw) {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(officer.name)}&background=002855&color=ffffff&size=512`;
        }
        if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("data:") || raw.startsWith("blob:")) {
            return raw;
        }
        const safePath = raw.startsWith("/") ? raw.slice(1) : raw;
        const knownBuckets = ["office_bearers", "member-avatars", "avatars", "photos", "societies"];
        for (const b of knownBuckets) {
            if (safePath.startsWith(`${b}/`)) {
                const sub = safePath.slice(b.length + 1);
                const { data } = supabase.storage.from(b).getPublicUrl(sub);
                if (data?.publicUrl)
                    return data.publicUrl;
            }
        }
        const { data } = supabase.storage.from("office_bearers").getPublicUrl(encodeURIComponent(safePath));
        return data?.publicUrl || raw;
    };
    // ─── 6. PDF UPLOAD HANDLER ───
    const handlePdfUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingOfficer)
            return;
        try {
            setUploadLoading(true);
            const identifier = uploadingOfficer.ieee_id || uploadingOfficer.roll_number || uploadingOfficer.name.replace(/\s+/g, "_");
            const uploadedUrl = await uploadMemberCardPdf(file, identifier);
            // 1. Update in source bearer table
            const targetTable = uploadingOfficer._sourceTable;
            if (targetTable) {
                try {
                    await supabase
                        .from(targetTable)
                        .update({ card_pdf_url: uploadedUrl })
                        .eq("id", uploadingOfficer.id);
                }
                catch (e) {
                    console.warn("Could not update card_pdf_url in bearer table:", e);
                }
            }
            // 2. Also update student_members record if matched
            if (uploadingOfficer.matched_student_id) {
                try {
                    await supabase
                        .from("student_members")
                        .update({ card_pdf_url: uploadedUrl })
                        .eq("id", uploadingOfficer.matched_student_id);
                }
                catch (e) {
                    console.warn("Could not update student_members card_pdf_url:", e);
                }
            }
            alert(`✓ Original IEEE ID Card uploaded successfully for ${uploadingOfficer.name}!`);
            setUploadingOfficer(null);
            fetchAllBearerData();
        }
        catch (err) {
            console.error("PDF upload failed:", err);
            alert(`Upload failed: ${err?.message || "Please check Supabase storage configuration."}`);
        }
        finally {
            setUploadLoading(false);
        }
    };
    // ─── 7. EDIT MEMBERSHIP ID & DETAILS HANDLER ───
    const handleOpenEditModal = (officer) => {
        setEditingOfficer(officer);
        setEditForm({
            name: officer.name || "",
            role: officer.role || "",
            department: officer.department || "",
            academic_year: officer.academic_year || "2024-2026",
            ieee_id: officer.ieee_id || "",
            roll_number: officer.roll_number || "",
            card_pdf_url: officer.card_pdf_url || "",
            email: officer.email || "",
            phone: officer.phone || "",
            linkedin_url: officer.linkedin_url || "",
        });
    };
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editingOfficer)
            return;
        try {
            setSaveLoading(true);
            const targetTable = editingOfficer._sourceTable;
            const payload = {
                name: editForm.name.trim(),
                role: editForm.role.trim(),
                department: editForm.department.trim(),
                academic_year: editForm.academic_year.trim(),
                linkedin_url: editForm.linkedin_url.trim(),
            };
            if (editForm.ieee_id.trim()) {
                payload.ieee_id = editForm.ieee_id.trim();
                payload.membership_id = editForm.ieee_id.trim();
            }
            if (editForm.roll_number.trim()) {
                payload.roll_number = editForm.roll_number.trim();
            }
            if (editForm.card_pdf_url.trim()) {
                payload.card_pdf_url = editForm.card_pdf_url.trim();
            }
            if (editForm.email.trim()) {
                payload.email = editForm.email.trim();
            }
            if (editForm.phone.trim()) {
                payload.phone = editForm.phone.trim();
            }
            if (targetTable) {
                const { error } = await supabase
                    .from(targetTable)
                    .update(payload)
                    .eq("id", editingOfficer.id);
                if (error) {
                    const cleanBasic = {
                        name: editForm.name.trim(),
                        role: editForm.role.trim(),
                        department: editForm.department.trim(),
                        academic_year: editForm.academic_year.trim(),
                        linkedin_url: editForm.linkedin_url.trim(),
                    };
                    await supabase.from(targetTable).update(cleanBasic).eq("id", editingOfficer.id);
                }
            }
            // Also update student_members table if matched
            if (editingOfficer.matched_student_id) {
                const studentPayload = {};
                if (editForm.ieee_id.trim())
                    studentPayload.ieee_id = editForm.ieee_id.trim();
                if (editForm.roll_number.trim())
                    studentPayload.roll_number = editForm.roll_number.trim();
                if (editForm.card_pdf_url.trim())
                    studentPayload.card_pdf_url = editForm.card_pdf_url.trim();
                if (editForm.department.trim())
                    studentPayload.department = editForm.department.trim();
                if (editForm.phone.trim())
                    studentPayload.phone = editForm.phone.trim();
                if (editForm.email.trim())
                    studentPayload.email = editForm.email.trim();
                if (Object.keys(studentPayload).length > 0) {
                    await supabase
                        .from("student_members")
                        .update(studentPayload)
                        .eq("id", editingOfficer.matched_student_id);
                }
            }
            alert(`✓ Updated record for ${editForm.name}!`);
            setEditingOfficer(null);
            fetchAllBearerData();
        }
        catch (err) {
            console.error("Failed to save officer edit:", err);
            alert(`Save error: ${err?.message || "Check database permissions."}`);
        }
        finally {
            setSaveLoading(false);
        }
    };
    // ─── 8. EXPORT TO EXCEL CSV ───
    const exportToExcelCSV = () => {
        if (filteredOfficers.length === 0) {
            alert("No officer records to export with current filters.");
            return;
        }
        const headers = [
            "S.No",
            "Full Name",
            "Designated Role",
            "Society Chapter",
            "Category",
            "IEEE Membership ID",
            "Roll / Reg Number",
            "Phone / Mobile Number",
            "Department",
            "Academic Year",
            "Email Address",
            "Student Roster Status",
            "Original PDF Card URL",
            "Card Status",
        ];
        const rows = filteredOfficers.map((o, idx) => [
            idx + 1,
            `"${(o.name || "").replace(/"/g, '""')}"`,
            `"${(o.role || "").replace(/"/g, '""')}"`,
            `"${(o.society_name || "").replace(/"/g, '""')}"`,
            o.category === "bearers" ? "Office Bearer" : "Executive Member",
            o.ieee_id && o.ieee_id !== "PENDING" ? `"${o.ieee_id}"` : "PENDING",
            o.roll_number ? `"${o.roll_number}"` : "N/A",
            o.phone ? `"${o.phone}"` : "N/A",
            `"${(o.department || "SREC").replace(/"/g, '""')}"`,
            `"${(o.academic_year || "2024-2026").replace(/"/g, '""')}"`,
            `"${(o.email || "").replace(/"/g, '""')}"`,
            o.is_matched_roster ? "Matched (student_members)" : "Custom Entry",
            `"${(o.card_pdf_url || getPrimaryMemberCardPdfUrl(o)).replace(/"/g, '""')}"`,
            o.card_pdf_url || (o.ieee_id && o.ieee_id !== "PENDING") ? "Verified / Available" : "Needs PDF Upload",
        ]);
        const csvContent = "data:text/csv;charset=utf-8,\uFEFF" +
            [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `IEEE_SREC_Office_Bearers_Membership_Cards_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    // ─── 9. BATCH PRINT ───
    const handlePrintAll = () => {
        window.print();
    };
    // Status Filter Options Mapping
    const STATUS_OPTIONS = [
        { value: "all", label: "All Card Statuses", icon: <Layers size={14} className="text-cyan-400"/> },
        { value: "has_pdf", label: "✓ Has Original PDF Card", icon: <FileText size={14} className="text-emerald-400"/> },
        { value: "needs_pdf", label: "⚠️ Needs PDF Card Upload", icon: <AlertTriangle size={14} className="text-amber-400"/> },
        { value: "has_id", label: "✓ Assigned IEEE ID", icon: <ShieldCheck size={14} className="text-cyan-400"/> },
        { value: "pending_id", label: "⏳ Pending IEEE ID", icon: <Clock size={14} className="text-amber-400"/> },
    ];
    const currentStatusObj = STATUS_OPTIONS.find((s) => s.value === cardStatusFilter) || STATUS_OPTIONS[0];
    return (<div className="space-y-8 font-sans text-slate-100 animate-fadeIn selection:bg-cyan-500 selection:text-slate-950">
      {/* ─── CUSTOM EMBEDDED STYLES FOR CARD SHEEN & GLOWS ─── */}
      <style>{`
        .card-shimmer-foil {
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0) 20%,
            rgba(255, 255, 255, 0.45) 50%,
            rgba(255, 255, 255, 0) 80%
          );
          background-size: 200% 200%;
          transition: opacity 0.4s ease;
        }
        .group:hover .card-shimmer-foil {
          animation: foilSheen 2.5s infinite;
        }
        @keyframes foilSheen {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
        .smart-card-shadow {
          box-shadow: 0 15px 35px -5px rgba(0, 24, 68, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.9) inset;
        }
        /* Custom dark scrollbar for dropdown menus */
        .custom-dark-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-dark-scroll::-webkit-scrollbar-track {
          background: #070e17;
          border-radius: 8px;
        }
        .custom-dark-scroll::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 8px;
        }
        .custom-dark-scroll::-webkit-scrollbar-thumb:hover {
          background: #06b6d4;
        }
      `}</style>

      {/* ─── 1. EXECUTIVE HEADER BANNER ─── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-[#071938] to-[#040e20] border border-cyan-500/30 p-6 md:p-8 shadow-2xl">
        {/* Glow backdrop decorative spots */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"/>
        <div className="absolute bottom-0 left-1/3 -mb-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"/>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider shadow-sm">
              <CreditCard size={14} className="text-cyan-400"/>
              <span>Executive Identity &amp; Credentials Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Office Bearers Membership IDs &amp; Original ID Cards
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-3xl leading-relaxed">
              Official verification hub for leadership credentials. Live-synced with the <strong className="text-cyan-300">`student_members`</strong> table to automatically fetch IEEE Membership IDs, Phone Numbers, Roll Numbers, and official IEEE PDF ID cards across all 9 technical societies.
            </p>
          </div>

          {/* Action Ribbon */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Sync from student_members */}
            <button type="button" onClick={handleAutoSyncDatabase} disabled={syncingDatabase} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition flex items-center gap-2 cursor-pointer active:scale-95 border border-cyan-300/40" title="Sync matched IEEE IDs, Phones and Roll numbers permanently to all society tables">
              <Zap size={15} className={syncingDatabase ? "animate-spin text-slate-950" : "fill-slate-950"}/>
              <span>{syncingDatabase ? "Syncing..." : "⚡ Sync from student_members"}</span>
            </button>

            <button type="button" onClick={exportToExcelCSV} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition flex items-center gap-2 cursor-pointer active:scale-95 border border-emerald-400/30" title="Download filtered directory as Excel CSV">
              <FileSpreadsheet size={15}/>
              <span>Export Excel ({filteredOfficers.length})</span>
            </button>

            <button type="button" onClick={handlePrintAll} className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer" title="Print current ID cards view">
              <Printer size={15}/>
              <span>Print</span>
            </button>

            <button type="button" onClick={handleRefresh} className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer" title="Reload from database">
              <RefreshCw size={14} className={refreshing || loading ? "animate-spin text-cyan-400" : ""}/>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 2. METRICS & KPI RIBBON ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Officers */}
        <div className="bg-gradient-to-br from-[#0e1b2f] to-[#08111e] p-5 rounded-3xl border border-slate-800/80 shadow-xl flex items-center justify-between hover:border-cyan-500/40 transition">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Total Officers Enrolled</p>
            <p className="text-3xl font-black text-white mt-1 tracking-tight">{stats.total}</p>
            <p className="text-[11px] text-cyan-400 font-bold mt-0.5">
              {stats.bearersCount} Bearers · {stats.execsCount} Execs
            </p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
            <Crown size={24}/>
          </div>
        </div>

        {/* Verified IEEE IDs */}
        <div className="bg-gradient-to-br from-[#0e1b2f] to-[#08111e] p-5 rounded-3xl border border-slate-800/80 shadow-xl flex items-center justify-between hover:border-emerald-500/40 transition">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-emerald-400">Verified IEEE IDs</p>
            <p className="text-3xl font-black text-emerald-400 mt-1 tracking-tight">{stats.withIeeeId}</p>
            <p className="text-[11px] text-emerald-300/80 font-bold mt-0.5">
              {stats.matchedRoster} Auto-matched with Directory
            </p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <ShieldCheck size={24}/>
          </div>
        </div>

        {/* Pending Assignment */}
        <div className="bg-gradient-to-br from-[#0e1b2f] to-[#08111e] p-5 rounded-3xl border border-slate-800/80 shadow-xl flex items-center justify-between hover:border-amber-500/40 transition">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-amber-400">Pending IEEE IDs</p>
            <p className="text-3xl font-black text-amber-400 mt-1 tracking-tight">{stats.pendingIeeeId}</p>
            <button type="button" onClick={() => setCardStatusFilter("pending_id")} className="text-[11px] text-amber-400 hover:underline font-bold mt-0.5 inline-flex items-center gap-1 cursor-pointer">
              <span>Filter Pending IDs</span>
              <ArrowRight size={11}/>
            </button>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <span className="text-xl">⏳</span>
          </div>
        </div>

        {/* Original PDF Cards Available */}
        <div className="bg-gradient-to-br from-[#0e1b2f] to-[#08111e] p-5 rounded-3xl border border-slate-800/80 shadow-xl flex items-center justify-between hover:border-blue-500/40 transition">
          <div>
            <p className="text-[10px] uppercase font-black tracking-widest text-blue-400">Original PDF Cards</p>
            <p className="text-3xl font-black text-blue-400 mt-1 tracking-tight">{stats.withPdf}</p>
            <p className="text-[11px] text-slate-400 font-bold mt-0.5">
              {stats.total > 0 ? Math.round((stats.withPdf / stats.total) * 100) : 0}% Verified Coverage
            </p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 shadow-inner">
            <FileText size={24}/>
          </div>
        </div>
      </div>

      {/* ─── 3. SOCIETY SELECTOR TABS ─── */}
      <div className="space-y-3">
        <label className="text-xs font-black text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
          <Layers size={14}/>
          <span>Filter by Society Chapter</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {SOCIETIES_METADATA.map((soc) => {
            const isSelected = selectedSociety === soc.code;
            const count = soc.code === "all"
                ? allOfficers.length
                : allOfficers.filter((o) => o.society_code === soc.code).length;
            return (<button key={soc.code} type="button" onClick={() => setSelectedSociety(soc.code)} className={`p-3.5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden flex flex-col justify-between cursor-pointer ${isSelected
                    ? "bg-gradient-to-br " + soc.color + " border-white/40 text-white shadow-xl " + soc.glow + " scale-[1.03] ring-2 ring-cyan-400/40"
                    : "bg-[#0c1626] border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-[#0f1d33]"}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-black/40 text-cyan-300">
                    {soc.code.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono font-black px-2 py-0.5 rounded-full bg-white/15 text-white">
                    {count}
                  </span>
                </div>
                <span className="font-extrabold text-xs leading-tight line-clamp-1">
                  {soc.shortName}
                </span>
              </button>);
        })}
        </div>
      </div>

      {/* ─── 4. SEARCH & ADVANCED FILTERS BAR WITH CUSTOM DROPDOWNS ─── */}
      <div className="p-5 rounded-3xl bg-[#0c1626] border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={16}/>
            <input type="text" placeholder="Search by Officer Name, Role, IEEE ID, Phone Number, Roll Number, Department..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-700/80 bg-[#070e17] text-xs font-bold text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none shadow-inner"/>
            {searchQuery && (<button type="button" onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
                <X size={14}/>
              </button>)}
          </div>

          {/* Filter Dropdowns & View Toggles */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-[#070e17] p-1 rounded-2xl border border-slate-700/80">
              <button type="button" onClick={() => setCategoryFilter("all")} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${categoryFilter === "all" ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-slate-200"}`}>
                All Roles
              </button>
              <button type="button" onClick={() => setCategoryFilter("bearers")} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${categoryFilter === "bearers" ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-slate-200"}`}>
                Office Bearers
              </button>
              <button type="button" onClick={() => setCategoryFilter("executives")} className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${categoryFilter === "executives" ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-slate-200"}`}>
                Executives
              </button>
            </div>

            {/* ─── CUSTOM FLOATING DROPDOWN 1: CARD STATUS ─── */}
            <div className="relative" ref={statusDropdownRef}>
              <button type="button" onClick={() => {
            setIsStatusDropdownOpen(!isStatusDropdownOpen);
            setIsYearDropdownOpen(false);
        }} className={`flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-inner cursor-pointer ${isStatusDropdownOpen || cardStatusFilter !== "all"
            ? "border-cyan-400 bg-[#091526] text-cyan-300 ring-2 ring-cyan-400/20"
            : "border-slate-700/80 bg-[#070e17] text-slate-200 hover:border-cyan-400/60"}`}>
                <div className="flex items-center gap-2">
                  {currentStatusObj.icon}
                  <span className="font-extrabold">{currentStatusObj.label}</span>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isStatusDropdownOpen ? "rotate-180 text-cyan-400" : ""}`}/>
              </button>

              <AnimatePresence>
                {isStatusDropdownOpen && (<motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.15, ease: "easeOut" }} className="absolute top-full left-0 mt-2 min-w-[240px] rounded-2xl bg-[#0c1626]/98 border border-cyan-500/40 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.2)] backdrop-blur-2xl z-50 flex flex-col gap-1">
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-400/80 border-b border-slate-800/80 mb-1 flex items-center justify-between">
                      <span>Filter by Status</span>
                      <Sparkles size={11} className="text-cyan-400"/>
                    </div>

                    {STATUS_OPTIONS.map((opt) => {
                const isSelected = cardStatusFilter === opt.value;
                return (<button key={opt.value} type="button" onClick={() => {
                        setCardStatusFilter(opt.value);
                        setIsStatusDropdownOpen(false);
                    }} className={`flex items-center justify-between gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${isSelected
                        ? "bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-cyan-300 border border-cyan-400/40 shadow-sm"
                        : "text-slate-300 hover:bg-slate-800/90 hover:text-white"}`}>
                          <div className="flex items-center gap-2.5">
                            {opt.icon}
                            <span>{opt.label}</span>
                          </div>
                          {isSelected && <Check size={13} className="text-cyan-400 stroke-[3]"/>}
                        </button>);
            })}
                  </motion.div>)}
              </AnimatePresence>
            </div>

            {/* ─── CUSTOM FLOATING DROPDOWN 2: ACADEMIC YEAR ─── */}
            {availableYears.length > 0 && (<div className="relative" ref={yearDropdownRef}>
                <button type="button" onClick={() => {
                setIsYearDropdownOpen(!isYearDropdownOpen);
                setIsStatusDropdownOpen(false);
            }} className={`flex items-center justify-between gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-bold transition-all shadow-inner cursor-pointer ${isYearDropdownOpen || yearFilter !== "all"
                ? "border-cyan-400 bg-[#091526] text-cyan-300 ring-2 ring-cyan-400/20"
                : "border-slate-700/80 bg-[#070e17] text-slate-200 hover:border-cyan-400/60"}`}>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-cyan-400"/>
                    <span>{yearFilter === "all" ? "All Academic Years" : yearFilter}</span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isYearDropdownOpen ? "rotate-180 text-cyan-400" : ""}`}/>
                </button>

                <AnimatePresence>
                  {isYearDropdownOpen && (<motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.15, ease: "easeOut" }} className="absolute top-full left-0 mt-2 min-w-[210px] max-h-64 overflow-y-auto custom-dark-scroll rounded-2xl bg-[#0c1626]/98 border border-cyan-500/40 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(6,182,212,0.2)] backdrop-blur-2xl z-50 flex flex-col gap-1">
                      <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-400/80 border-b border-slate-800/80 mb-1">
                        Select Academic Year
                      </div>

                      <button type="button" onClick={() => {
                    setYearFilter("all");
                    setIsYearDropdownOpen(false);
                }} className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${yearFilter === "all"
                    ? "bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-cyan-300 border border-cyan-400/40"
                    : "text-slate-300 hover:bg-slate-800/90 hover:text-white"}`}>
                        <span>All Academic Years</span>
                        {yearFilter === "all" && <Check size={13} className="text-cyan-400 stroke-[3]"/>}
                      </button>

                      {availableYears.map((yr) => {
                    const isSelected = yearFilter === yr;
                    return (<button key={yr} type="button" onClick={() => {
                            setYearFilter(yr);
                            setIsYearDropdownOpen(false);
                        }} className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${isSelected
                            ? "bg-gradient-to-r from-blue-600/30 to-cyan-600/30 text-cyan-300 border border-cyan-400/40"
                            : "text-slate-300 hover:bg-slate-800/90 hover:text-white"}`}>
                            <span>{yr}</span>
                            {isSelected && <Check size={13} className="text-cyan-400 stroke-[3]"/>}
                          </button>);
                })}
                    </motion.div>)}
                </AnimatePresence>
              </div>)}

            {/* View Mode Buttons */}
            <div className="flex items-center bg-[#070e17] p-1 rounded-2xl border border-slate-700/80">
              <button type="button" onClick={() => setViewMode("grid")} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${viewMode === "grid" ? "bg-blue-600 text-white font-black shadow-md shadow-blue-500/25" : "text-slate-400 hover:text-slate-200"}`} title="3D Holographic ID Cards Grid">
                <CreditCard size={14}/>
                <span>Cards</span>
              </button>
              <button type="button" onClick={() => setViewMode("table")} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${viewMode === "table" ? "bg-blue-600 text-white font-black shadow-md shadow-blue-500/25" : "text-slate-400 hover:text-slate-200"}`} title="Master Directory Table">
                <Layers size={14}/>
                <span>Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {(selectedSociety !== "all" || categoryFilter !== "all" || cardStatusFilter !== "all" || yearFilter !== "all" || searchQuery) && (<div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
            <span className="text-slate-500 font-bold">Active Filters:</span>
            {selectedSociety !== "all" && (<span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-bold flex items-center gap-1">
                Society: {selectedSociety.toUpperCase()}
                <button type="button" onClick={() => setSelectedSociety("all")} className="hover:text-white">
                  <X size={12}/>
                </button>
              </span>)}
            {categoryFilter !== "all" && (<span className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1">
                Role: {categoryFilter}
                <button type="button" onClick={() => setCategoryFilter("all")} className="hover:text-white">
                  <X size={12}/>
                </button>
              </span>)}
            {cardStatusFilter !== "all" && (<span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1">
                Status: {cardStatusFilter}
                <button type="button" onClick={() => setCardStatusFilter("all")} className="hover:text-white">
                  <X size={12}/>
                </button>
              </span>)}
            {yearFilter !== "all" && (<span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold flex items-center gap-1">
                Year: {yearFilter}
                <button type="button" onClick={() => setYearFilter("all")} className="hover:text-white">
                  <X size={12}/>
                </button>
              </span>)}
            {searchQuery && (<span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold flex items-center gap-1">
                Search: "{searchQuery}"
                <button type="button" onClick={() => setSearchQuery("")} className="hover:text-white">
                  <X size={12}/>
                </button>
              </span>)}
            <button type="button" onClick={() => {
                setSelectedSociety("all");
                setCategoryFilter("all");
                setCardStatusFilter("all");
                setYearFilter("all");
                setSearchQuery("");
            }} className="text-xs text-rose-400 hover:underline font-bold ml-2 cursor-pointer">
              Clear All
            </button>
          </div>)}
      </div>

      {/* ─── 5. CONTENT VIEWPORT ─── */}
      {loading ? (<div className="p-20 flex flex-col items-center justify-center gap-4 bg-[#0c1626] border border-slate-800 rounded-3xl shadow-2xl">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400"/>
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Cross-referencing Office Bearers &amp; Student Members Directory...
          </span>
        </div>) : filteredOfficers.length === 0 ? (<div className="p-16 text-center bg-[#0c1626] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <AlertCircle size={40} className="mx-auto text-amber-400"/>
          <h4 className="text-xl font-bold text-white">No office bearers match your current filter query</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Try adjusting your search keywords, selecting a different technical society, or resetting the card filters.
          </p>
          <button type="button" onClick={() => {
                setSelectedSociety("all");
                setCategoryFilter("all");
                setCardStatusFilter("all");
                setSearchQuery("");
            }} className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20">
            Reset Filters
          </button>
        </div>) : viewMode === "grid" ? (
        /* ══════════════════════════════════════════════════════════════════
           GRID VIEW: 3D HOLOGRAPHIC DIGITAL SMART CARDS
           ══════════════════════════════════════════════════════════════════ */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          {filteredOfficers.map((officer, index) => {
                const cardKey = `${officer.society_code}-${officer.id}-${index}`;
                const isFlipped = Boolean(flippedCardIds[cardKey]);
                const photoSrc = getOfficerPhoto(officer);
                const primaryPdf = getPrimaryMemberCardPdfUrl(officer);
                const hasExplicitPdf = Boolean(officer.card_pdf_url);
                const hasIeeeId = Boolean(officer.ieee_id && officer.ieee_id !== "PENDING");
                return (<div key={cardKey} className="bg-gradient-to-b from-[#0f1e36]/90 via-[#0a1527]/95 to-[#060e1b] border border-slate-800 hover:border-cyan-500/60 rounded-3xl p-5 shadow-2xl transition-all duration-300 hover:shadow-[0_15px_40px_rgba(6,182,212,0.18)] hover:-translate-y-1.5 backdrop-blur-xl relative overflow-hidden group flex flex-col gap-4">
                {/* Top Subtle Cyan Edge Glow */}
                <div className="absolute top-0 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity"/>

                {/* Header Info Strip */}
                <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-cyan-300 font-extrabold text-[10px] uppercase tracking-wider border border-blue-500/30">
                      {officer.society_code.toUpperCase()}
                    </span>
                    <span className="text-slate-300 font-bold text-xs truncate max-w-[140px]">
                      {officer.society_name.split("(")[0]}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {officer.is_matched_roster && (<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[9.5px] font-black uppercase">
                        <UserCheck size={11}/>
                        <span>Verified</span>
                      </span>)}

                    {hasIeeeId ? (<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10.5px] font-black font-mono">
                        <Check size={11} className="stroke-[3]"/>
                        {officer.ieee_id}
                      </span>) : (<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                        ⏳ ID Pending
                      </span>)}
                  </div>
                </div>

                {/* ─── 3D PERSPECTIVE CARD DISPLAY (FLIPS IN EXACT SAME PLACE) ─── */}
                <div className="[perspective:1200px] w-full h-[235px] relative cursor-pointer select-none" onClick={() => toggleCardFlip(cardKey)} title="Click anywhere on card to flip between Front and Back">
                  <motion.div animate={{ rotateY: isFlipped ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="w-full h-full [transform-style:preserve-3d] relative">
                    {/* ══════════════════════════════════════════════════════════
                        CARD FRONT FACE (Executive Holographic Smart Card)
                        ══════════════════════════════════════════════════════════ */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-white via-slate-50 to-sky-50 text-slate-900 overflow-hidden smart-card-shadow border border-slate-200 [backface-visibility:hidden] p-3.5 sm:p-4 flex flex-col justify-between [transform:rotateY(0deg)] z-10">
                      {/* Foil shimmer overlay on hover */}
                      <div className="absolute inset-0 card-shimmer-foil pointer-events-none opacity-0 group-hover:opacity-100 z-20"/>

                      {/* SREC Campus Architectural Watermark */}
                      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.08]">
                        <img src={srecCampus} alt="SREC Campus" className="w-full h-full object-cover object-center filter grayscale"/>
                      </div>

                      {/* Right High-Tech Navy & Blue Shield Geometric Polygon */}
                      <div className="absolute top-0 right-0 bottom-0 w-[42%] pointer-events-none overflow-hidden z-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#003882] via-[#002255] to-[#00102b] shadow-2xl" style={{
                        clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 50%)",
                    }}/>
                        <div className="absolute inset-[2.5px] left-[5px] bg-gradient-to-br from-[#001c44] via-[#00112c] to-[#000818]" style={{
                        clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 50%)",
                    }}>
                          <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 20 15 L 60 15 L 80 40 L 120 40" stroke="#0099ff" strokeWidth="1.2" fill="none" strokeDasharray="3 3"/>
                            <path d="M 10 80 L 40 80 L 60 100 L 100 100" stroke="#00d4ff" strokeWidth="1.2" fill="none"/>
                            <circle cx="80" cy="40" r="2.5" fill="#00d4ff"/>
                            <circle cx="60" cy="100" r="2.5" fill="#38bdf8"/>
                          </svg>
                        </div>
                      </div>

                      {/* ── CARD TOP HEADER ── */}
                      <div className="relative z-10 flex items-center justify-between pb-1.5 border-b border-slate-200/80">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-[#002855] animate-pulse"/>
                          <div>
                            <p className="text-[9.5px] font-black uppercase text-[#002855] tracking-wider leading-none">
                              SRI RAMAKRISHNA ENGINEERING COLLEGE
                            </p>
                            <p className="text-[7.5px] font-bold text-slate-600 tracking-tight mt-0.5">
                              IEEE STUDENT BRANCH · STB 64581
                            </p>
                          </div>
                        </div>

                        {/* IEEE Official Crest */}
                        <div className="w-[32px] h-[32px] rounded-full p-[2px] bg-gradient-to-tr from-[#001c3d] via-[#002855] to-[#0066ff] shadow-md flex items-center justify-center shrink-0">
                          <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
                            <img src={ieeeCustomCardLogo} alt="IEEE" className="w-full h-full object-contain"/>
                          </div>
                        </div>
                      </div>

                      {/* ── CARD CENTER: PORTRAIT & CREDENTIALS ── */}
                      <div className="relative z-10 py-1.5 flex items-center gap-3">
                        {/* Officer Photo */}
                        <div className="shrink-0 relative">
                          <div className="w-[66px] h-[80px] rounded-2xl border-2 border-white shadow-lg overflow-hidden bg-slate-900">
                            <img src={photoSrc} alt={officer.name} className="w-full h-full object-cover object-top"/>
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white bg-gradient-to-tr from-emerald-600 to-green-400 text-white flex items-center justify-center shadow-md">
                            <Crown size={9} className="stroke-[2.5]"/>
                          </div>
                        </div>

                        {/* Officer Info */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div>
                            <h3 className="text-xs sm:text-sm font-black text-[#00204d] uppercase tracking-tight leading-tight truncate">
                              {officer.name}
                            </h3>
                            <div className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-md bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white font-black text-[8px] uppercase tracking-wider shadow-xs">
                              <span className="truncate max-w-[130px]">{officer.role}</span>
                            </div>
                          </div>

                          <div className="space-y-0.5 text-[8px] text-slate-800 font-semibold pt-0.5">
                            {/* IEEE ID */}
                            <div className="flex items-center gap-1">
                              <span className="text-[7.5px] font-black text-[#002855] uppercase w-7">IEEE:</span>
                              <span className="font-mono font-black text-[#002855] bg-blue-50 px-1 py-0.2 rounded border border-blue-200">
                                {hasIeeeId ? `#${officer.ieee_id}` : "PENDING"}
                              </span>
                            </div>

                            {/* Roll Number */}
                            {officer.roll_number && (<div className="flex items-center gap-1">
                                <span className="text-[7.5px] font-black text-slate-500 uppercase w-7">ROLL:</span>
                                <span className="font-mono font-bold text-slate-800">
                                  {officer.roll_number}
                                </span>
                              </div>)}

                            {/* Phone */}
                            {officer.phone && (<div className="flex items-center gap-1 text-slate-700">
                                <Phone size={7.5} className="text-[#002855] shrink-0"/>
                                <span className="font-bold truncate">{officer.phone}</span>
                              </div>)}

                            {/* Dept */}
                            <div className="flex items-center gap-1 text-slate-600">
                              <Building2 size={7.5} className="text-[#002855] shrink-0"/>
                              <span className="font-semibold truncate max-w-[130px]">
                                {officer.department || "SREC"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* ── CARD BOTTOM FOOTER ── */}
                      <div className="relative z-10 flex items-center justify-between pt-1.5 border-t border-slate-200/80 text-[7px] text-slate-600">
                        <div className="flex items-center gap-1.5">
                          {/* Simulated Golden Chip */}
                          <div className="w-4.5 h-3 rounded-sm bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 border border-amber-600 shadow-2xs"/>
                          <span className="font-black text-[#002855] uppercase">
                            OFFICER VALID: {officer.academic_year || "2024-2026"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 font-mono font-black text-[#002855]">
                          <span>FLIP</span>
                          <ArrowRight size={8}/>
                        </div>
                      </div>
                    </div>

                    {/* ══════════════════════════════════════════════════════════
                        CARD BACK FACE (Executive Governance & Verification)
                        ══════════════════════════════════════════════════════════ */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-[#001538] via-[#000d24] to-[#000512] text-white overflow-hidden smart-card-shadow border border-slate-700 [backface-visibility:hidden] p-3.5 sm:p-4 flex flex-col justify-between [transform:rotateY(180deg)] z-10">
                      {/* Magnetic Stripe */}
                      <div className="absolute top-3 left-0 right-0 h-5 bg-[#09090e] border-y border-slate-700/80"/>

                      {/* Top Bar with Trust Logo */}
                      <div className="flex items-center justify-between pt-5 pb-1 border-b border-white/10">
                        <div className="flex items-center gap-1">
                          <img src={snrTrustLogo} alt="SNR Trust" className="h-3.5 object-contain brightness-200"/>
                          <span className="text-[7.5px] font-black uppercase text-cyan-300">Sri Ramakrishna Engineering College</span>
                        </div>
                        <span className="text-[7px] font-mono text-slate-400">REGION 10 · MADRAS</span>
                      </div>

                      {/* Middle Verification & Signature */}
                      <div className="grid grid-cols-2 gap-2 my-auto py-1 text-[7.5px] text-slate-300">
                        <div className="space-y-1">
                          <p className="font-black text-cyan-400 uppercase text-[8px]">Leadership Certification</p>
                          <p className="leading-tight text-slate-400 text-[7px]">
                            Official Office Bearer credential for IEEE Student Branch STB 64581.
                          </p>
                          <p className="font-mono text-slate-300 text-[7px]">
                            Chapter: <strong className="text-white">{officer.society_code.toUpperCase()}</strong>
                          </p>
                          {officer.phone && (<p className="font-mono text-cyan-300 text-[7px]">
                              Helpline: {officer.phone}
                            </p>)}
                        </div>

                        <div className="flex flex-col items-center justify-center text-center space-y-0.5 bg-white/5 p-1 rounded-xl border border-white/10">
                          <img src={counselorSignature} alt="Signature" className="h-5 object-contain filter invert opacity-95"/>
                          <p className="text-[6.5px] font-black uppercase text-slate-200 leading-none">Branch Counsellor</p>
                          <p className="text-[6px] text-slate-400">IEEE SREC Student Branch</p>
                        </div>
                      </div>

                      {/* Bottom Footer */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[6.5px] text-slate-400">
                        <span>www.srec.ac.in · ieee.org</span>
                        <span className="font-mono text-cyan-300 font-bold">STB 64581 VERIFIED</span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* ─── CARD ACTION BUTTONS RIBBON ─── */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5">
                    {/* View Original PDF Button */}
                    <button type="button" onClick={() => setActivePdfOfficer(officer)} className={`px-3.5 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition flex items-center gap-1.5 shadow-md cursor-pointer ${hasExplicitPdf || hasIeeeId
                        ? "bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:brightness-110 text-white font-extrabold shadow-cyan-500/20"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"}`} title="Inspect original IEEE ID Card PDF document">
                      <FileText size={13}/>
                      <span>Original PDF</span>
                    </button>

                    {/* Upload PDF Card Button */}
                    <button type="button" onClick={() => setUploadingOfficer(officer)} className="p-2 rounded-xl bg-slate-800/90 hover:bg-cyan-600 text-slate-300 hover:text-white transition border border-slate-700 cursor-pointer" title="Upload or replace original IEEE ID Card PDF">
                      <Upload size={14}/>
                    </button>

                    {/* Edit Details Button */}
                    <button type="button" onClick={() => handleOpenEditModal(officer)} className="p-2 rounded-xl bg-slate-800/90 hover:bg-amber-600 text-slate-300 hover:text-white transition border border-slate-700 cursor-pointer" title="Edit Membership ID & details">
                      <Edit2 size={14}/>
                    </button>
                  </div>

                  {/* Expand 3D Preview Button */}
                  <button type="button" onClick={() => {
                        setPreviewCardOfficer(officer);
                    }} className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-bold transition flex items-center gap-1 cursor-pointer border border-slate-700/60" title="Fullscreen Preview & Print Smart Card">
                    <Maximize2 size={12}/>
                    <span>Expand</span>
                  </button>
                </div>
              </div>);
            })}
        </div>) : (
        /* ══════════════════════════════════════════════════════════════════
           TABLE VIEW: MASTER CREDENTIALS DIRECTORY WITH PHONE & ROLL NO
           ══════════════════════════════════════════════════════════════════ */
        <div className="rounded-3xl bg-[#0c1626] border border-slate-800/80 overflow-hidden shadow-2xl">
          <div className="p-5 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <Crown size={18} className="text-amber-400"/>
              <h4 className="font-extrabold text-sm sm:text-base">
                Office Bearers &amp; Executives ID Credentials Directory
              </h4>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase">
              {filteredOfficers.length} Officers Listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#070e17] text-slate-400 uppercase tracking-widest font-black border-b border-slate-800 text-[10px]">
                  <th className="py-4 px-5 w-12">#</th>
                  <th className="py-4 px-5">Officer Name &amp; Roll Number</th>
                  <th className="py-4 px-5">Society Chapter</th>
                  <th className="py-4 px-5">Designated Role</th>
                  <th className="py-4 px-5">IEEE Membership ID</th>
                  <th className="py-4 px-5">Phone / Contact</th>
                  <th className="py-4 px-5">Original ID Card</th>
                  <th className="py-4 px-5">Department &amp; Term</th>
                  <th className="py-4 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {filteredOfficers.map((officer, idx) => {
                const photoSrc = getOfficerPhoto(officer);
                const hasIeeeId = Boolean(officer.ieee_id && officer.ieee_id !== "PENDING");
                const hasPdf = Boolean(officer.card_pdf_url || hasIeeeId);
                return (<tr key={officer.id || idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-5 text-slate-500 font-bold">{idx + 1}</td>

                      {/* Photo, Name & Roll Number */}
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-slate-800 overflow-hidden border border-slate-700 flex items-center justify-center shrink-0 shadow-md">
                            <img src={photoSrc} alt={officer.name} className="w-full h-full object-cover object-top"/>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-bold text-white text-sm">{officer.name}</p>
                              {officer.is_matched_roster && (<span className="inline-flex items-center px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold" title="Matched with student_members table">
                                  ✓ Verified Member
                                </span>)}
                            </div>
                            <p className="text-[11px] text-slate-400 font-mono">
                              Roll: <strong className="text-slate-300">{officer.roll_number || "N/A"}</strong>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Society */}
                      <td className="py-3 px-5">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-cyan-300 font-bold text-[11px] uppercase">
                          {officer.society_code.toUpperCase()}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="py-3 px-5">
                        <span className="font-bold text-slate-200">
                          {officer.role}
                        </span>
                      </td>

                      {/* IEEE Membership ID */}
                      <td className="py-3 px-5">
                        {hasIeeeId ? (<div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
                              <Check size={12} className="stroke-[3]"/>
                              {officer.ieee_id}
                            </span>
                            <button type="button" onClick={() => copyToClipboard(officer.ieee_id || "", String(officer.id))} className="p-1 rounded text-slate-400 hover:text-white" title="Copy IEEE ID">
                              {copiedId === String(officer.id) ? (<Check size={12} className="text-emerald-400"/>) : (<Copy size={12}/>)}
                            </button>
                          </div>) : (<button type="button" onClick={() => handleOpenEditModal(officer)} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-bold transition cursor-pointer">
                            <span>+ Assign ID</span>
                          </button>)}
                      </td>

                      {/* Phone / Contact */}
                      <td className="py-3 px-5">
                        {officer.phone ? (<div>
                            <a href={`tel:${officer.phone}`} className="font-mono font-bold text-cyan-400 hover:underline flex items-center gap-1">
                              <Phone size={11} className="text-cyan-500"/>
                              <span>{officer.phone}</span>
                            </a>
                            {officer.email && (<span className="text-[10px] text-slate-400 truncate block max-w-[140px]">
                                {officer.email}
                              </span>)}
                          </div>) : (<span className="text-slate-500 italic">Not set</span>)}
                      </td>

                      {/* Original Card PDF */}
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setActivePdfOfficer(officer)} className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase transition flex items-center gap-1 shadow-md cursor-pointer">
                            <FileText size={12}/>
                            <span>View Card</span>
                          </button>
                          <button type="button" onClick={() => setUploadingOfficer(officer)} className="p-1.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition border border-slate-700 cursor-pointer" title="Upload PDF Card">
                            <Upload size={13}/>
                          </button>
                        </div>
                      </td>

                      {/* Dept & Year */}
                      <td className="py-3 px-5 text-slate-400 font-medium">
                        <div className="font-semibold text-slate-300">{officer.department || "SREC"}</div>
                        <div className="text-[10px] font-mono text-slate-500">{officer.academic_year || "2024-2026"}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button type="button" onClick={() => setPreviewCardOfficer(officer)} className="p-2 rounded-xl bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition cursor-pointer shadow-sm" title="3D Card Preview">
                            <CreditCard size={13}/>
                          </button>
                          <button type="button" onClick={() => handleOpenEditModal(officer)} className="p-2 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-300 hover:text-white transition cursor-pointer shadow-sm" title="Edit details">
                            <Edit2 size={13}/>
                          </button>
                        </div>
                      </td>
                    </tr>);
            })}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* ══════════════════════════════════════════════════════════════════
            MODAL 1: ORIGINAL IEEE ID CARD (PDF) VIEWER
           ══════════════════════════════════════════════════════════════════ */}
      {activePdfOfficer && (<div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-4xl bg-[#0c1626] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Top Header */}
            <div className="bg-gradient-to-r from-slate-950 via-[#002855] to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center shadow-md">
                  <FileText size={22}/>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Official IEEE Identity Document</span>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {activePdfOfficer.name} — IEEE ID Card (PDF)
                  </h3>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    IEEE ID: {activePdfOfficer.ieee_id || "PENDING"} · {activePdfOfficer.society_name}
                  </p>
                </div>
              </div>

              <button type="button" onClick={() => setActivePdfOfficer(null)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer">
                <X size={18}/>
              </button>
            </div>

            {/* Embedded PDF Viewer Body */}
            <div className="p-6 flex-1 overflow-y-auto space-y-4 bg-[#070e17]">
              {/* PDF Toolbar */}
              <div className="p-3.5 rounded-2xl bg-[#0c1626] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="text-slate-300">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Document Path: </span>
                  <span className="font-mono text-cyan-300 break-all text-[11px]">
                    {activePdfOfficer.card_pdf_url || getPrimaryMemberCardPdfUrl(activePdfOfficer)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => window.open(getPrimaryMemberCardPdfUrl(activePdfOfficer), "_blank")} className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md">
                    <ExternalLink size={13}/>
                    <span>Open in New Tab</span>
                  </button>

                  <button type="button" onClick={() => {
                const cur = activePdfOfficer;
                setActivePdfOfficer(null);
                setUploadingOfficer(cur);
            }} className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 border border-slate-700 cursor-pointer shadow-sm">
                    <Upload size={13}/>
                    <span>Replace PDF</span>
                  </button>
                </div>
              </div>

              {/* IFrame Embedded PDF Container */}
              <div className="w-full h-[450px] sm:h-[550px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-inner relative flex flex-col items-center justify-center">
                <iframe src={getPrimaryMemberCardPdfUrl(activePdfOfficer)} title={`${activePdfOfficer.name} IEEE ID Card`} className="w-full h-full border-0"/>

                {/* Candidate Fallback links below if iframe doesn't render */}
                <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-[10px] text-slate-400">
                  <span>If PDF preview is blank, </span>
                  <a href={getPrimaryMemberCardPdfUrl(activePdfOfficer)} target="_blank" rel="noreferrer" className="text-cyan-400 font-bold hover:underline">
                    click here to open direct file
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0c1626] border-t border-slate-800 flex justify-end gap-3">
              <button type="button" onClick={() => setActivePdfOfficer(null)} className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer">
                Close Viewer
              </button>
            </div>
          </div>
        </div>)}

      {/* ══════════════════════════════════════════════════════════════════
            MODAL 2: UPLOAD ORIGINAL PDF CARD
           ══════════════════════════════════════════════════════════════════ */}
      {uploadingOfficer && (<div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0c1626] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="bg-[#002855] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Document Upload Portal</span>
                <h3 className="text-xl font-black text-white">Upload Original IEEE ID Card</h3>
                <p className="text-xs text-sky-200 mt-0.5">{uploadingOfficer.name} · {uploadingOfficer.society_name}</p>
              </div>
              <button type="button" onClick={() => setUploadingOfficer(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer">
                <X size={16}/>
              </button>
            </div>

            <div className="p-6 space-y-5 text-slate-200">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles size={14}/>
                  <span>Cloud Storage Bucket: `ieee-cards` / `office_bearers`</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Select the official IEEE digital ID card PDF issued by IEEE HQ or SREC. The file will be securely uploaded to Supabase Storage and linked to this officer.
                </p>
              </div>

              {/* Upload Dropzone */}
              <label className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-[#070e17] group">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 transition shadow-md">
                  <Upload size={24}/>
                </div>
                <p className="font-black text-sm text-white">
                  {uploadLoading ? "Uploading PDF..." : "Click to select PDF document"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Accepts .PDF, .PNG, .JPG (Max 25MB)</p>
                <input type="file" accept="application/pdf,image/*" onChange={handlePdfUpload} disabled={uploadLoading} className="hidden"/>
              </label>

              {uploadLoading && (<div className="flex items-center justify-center gap-2 text-xs font-bold text-cyan-400">
                  <Loader2 size={16} className="animate-spin"/>
                  <span>Processing file upload to Supabase Storage...</span>
                </div>)}

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setUploadingOfficer(null)} disabled={uploadLoading} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>)}

      {/* ══════════════════════════════════════════════════════════════════
            MODAL 3: EDIT MEMBERSHIP ID & DETAILS
           ══════════════════════════════════════════════════════════════════ */}
      {editingOfficer && (<div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0c1626] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
            <div className="bg-[#002855] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Credential Editor</span>
                <h3 className="text-xl font-black text-white">Edit Officer Membership &amp; Credentials</h3>
                <p className="text-xs text-sky-200 mt-0.5">{editingOfficer.name} · {editingOfficer.society_name}</p>
              </div>
              <button type="button" onClick={() => setEditingOfficer(null)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer">
                <X size={16}/>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name *</label>
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#070e17] text-white font-bold text-xs focus:border-cyan-400 focus:outline-none" required/>
                </div>

                {/* Designated Role */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Designated Role *</label>
                  <input type="text" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#070e17] text-white font-bold text-xs focus:border-cyan-400 focus:outline-none" required/>
                </div>

                {/* IEEE Membership ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    IEEE Membership ID (e.g. 98765432)
                  </label>
                  <input type="text" value={editForm.ieee_id} onChange={(e) => setEditForm({ ...editForm, ieee_id: e.target.value })} placeholder="e.g. 99451234 or PENDING" className="w-full px-3.5 py-2.5 rounded-xl border border-cyan-500/40 bg-[#070e17] text-cyan-300 font-mono font-bold text-xs focus:border-cyan-400 focus:outline-none"/>
                </div>

                {/* Roll / Register Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Roll / Register Number</label>
                  <input type="text" value={editForm.roll_number} onChange={(e) => setEditForm({ ...editForm, roll_number: e.target.value })} placeholder="e.g. 21CS045" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#070e17] text-white font-mono font-bold text-xs focus:border-cyan-400 focus:outline-none"/>
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Department</label>
                  <input type="text" value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })} placeholder="e.g. III B.E CSE" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#070e17] text-white font-bold text-xs focus:border-cyan-400 focus:outline-none"/>
                </div>

                {/* Academic Year */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Year</label>
                  <input type="text" value={editForm.academic_year} onChange={(e) => setEditForm({ ...editForm, academic_year: e.target.value })} placeholder="e.g. 2024-2026" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#070e17] text-white font-bold text-xs focus:border-cyan-400 focus:outline-none"/>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-cyan-400">Phone Number (from student_members)</label>
                  <input type="text" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="e.g. +91 98765 43210" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#070e17] text-white font-bold text-xs focus:border-cyan-400 focus:outline-none"/>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#070e17] text-white font-bold text-xs focus:border-cyan-400 focus:outline-none"/>
                </div>
              </div>

              {/* Card PDF Direct URL */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-blue-400">Original ID Card PDF URL (or /cards/ID.pdf)</label>
                <input type="text" value={editForm.card_pdf_url} onChange={(e) => setEditForm({ ...editForm, card_pdf_url: e.target.value })} placeholder="https://... or /cards/98765432.pdf" className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#070e17] text-cyan-300 font-mono text-xs focus:border-cyan-400 focus:outline-none"/>
              </div>

              {/* LinkedIn */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">LinkedIn Profile Link</label>
                <input type="url" value={editForm.linkedin_url} onChange={(e) => setEditForm({ ...editForm, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#070e17] text-white text-xs focus:border-cyan-400 focus:outline-none"/>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingOfficer(null)} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saveLoading} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-500/20 flex items-center gap-2 cursor-pointer">
                  {saveLoading ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle2 size={16}/>}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* ══════════════════════════════════════════════════════════════════
            MODAL 4: FULLSCREEN EXPANDED 3D SMART CARD PREVIEW
           ══════════════════════════════════════════════════════════════════ */}
      {previewCardOfficer && (<div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-xl bg-[#0c1626] rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Interactive 3D Preview</span>
                <h3 className="text-xl font-black text-white">{previewCardOfficer.name}</h3>
                <p className="text-xs text-slate-400">{previewCardOfficer.role} · {previewCardOfficer.society_name}</p>
              </div>
              <button type="button" onClick={() => setPreviewCardOfficer(null)} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer">
                <X size={18}/>
              </button>
            </div>

            {/* Card display with interactive flip and print action */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full max-w-[480px] h-[260px] relative [perspective:1200px] cursor-pointer select-none" onClick={() => {
                const k = `modal-${previewCardOfficer.id}`;
                setFlippedCardIds((prev) => ({ ...prev, [k]: !prev[k] }));
            }} title="Click to flip card between Front and Back">
                <motion.div animate={{ rotateY: flippedCardIds[`modal-${previewCardOfficer.id}`] ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="w-full h-full relative [transform-style:preserve-3d]">
                  {/* 3D Smart Card Front */}
                  <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-white via-slate-50 to-sky-50 text-slate-900 overflow-hidden smart-card-shadow border-2 border-slate-200 p-5 sm:p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(0deg)] z-10">
                    {/* Watermarks */}
                    <div className="absolute left-0 top-0 bottom-0 w-[55%] opacity-[0.08] pointer-events-none" style={{
                backgroundImage: `radial-gradient(#002855 1.5px, transparent 1.5px)`,
                backgroundSize: "12px 12px",
            }}/>
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.08]">
                      <img src={srecCampus} alt="Campus" className="w-full h-full object-cover object-center filter grayscale"/>
                    </div>

                    {/* Shield */}
                    <div className="absolute top-0 right-0 bottom-0 w-[45%] pointer-events-none overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#003882] via-[#002255] to-[#00102b] shadow-2xl" style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 50%)" }}/>
                      <div className="absolute inset-[3px] left-[6px] bg-gradient-to-br from-[#001c44] via-[#00112c] to-[#000818]" style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%, 15% 50%)" }}/>
                    </div>

                    {/* Header */}
                    <div className="relative z-10 flex items-center justify-between pb-2 border-b border-slate-200/80">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#002855]"/>
                        <div>
                          <p className="text-[11px] font-black uppercase text-[#002855] tracking-wider leading-none">
                            SRI RAMAKRISHNA ENGINEERING COLLEGE
                          </p>
                          <p className="text-[9px] font-bold text-slate-600 tracking-tight mt-0.5">
                            IEEE STUDENT BRANCH · STB 64581
                          </p>
                        </div>
                      </div>
                      <div className="w-[42px] h-[42px] rounded-full p-[2px] bg-gradient-to-tr from-[#001c3d] via-[#002855] to-[#0066ff] shadow-md flex items-center justify-center shrink-0">
                        <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
                          <img src={ieeeCustomCardLogo} alt="IEEE" className="w-full h-full object-contain"/>
                        </div>
                      </div>
                    </div>

                    {/* Body Details */}
                    <div className="relative z-10 my-auto py-2.5 flex items-center justify-between gap-4">
                      {/* Portrait Photo */}
                      <div className="w-[80px] h-[98px] rounded-2xl border-[3px] border-white shadow-xl overflow-hidden bg-slate-900 shrink-0">
                        <img src={getOfficerPhoto(previewCardOfficer)} alt={previewCardOfficer.name} className="w-full h-full object-cover object-top"/>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div>
                          <h3 className="text-base sm:text-lg font-black text-[#00204d] uppercase tracking-tight leading-tight truncate">
                            {previewCardOfficer.name}
                          </h3>
                          <div className="mt-1 inline-flex items-center px-3 py-0.5 rounded-md bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-black text-[10px] uppercase tracking-wider">
                            <span className="truncate max-w-[150px]">{previewCardOfficer.role}</span>
                          </div>
                        </div>

                        <div className="space-y-0.5 text-[9.5px] text-slate-800 font-bold">
                          <p className="font-mono font-black text-[#002855]">
                            IEEE ID: #{previewCardOfficer.ieee_id || "PENDING"}
                          </p>
                          {previewCardOfficer.roll_number && (<p className="font-mono text-slate-700">Roll: {previewCardOfficer.roll_number}</p>)}
                          {previewCardOfficer.phone && (<p className="text-slate-800 flex items-center gap-1">
                              <Phone size={10}/>
                              <span>{previewCardOfficer.phone}</span>
                            </p>)}
                          <p className="text-slate-600 font-semibold truncate max-w-[150px]">{previewCardOfficer.department || "SREC"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="relative z-10 flex items-center justify-between pt-2 border-t border-slate-200/80 text-[8.5px] text-slate-600">
                      <span className="font-black text-[#002855] uppercase">OFFICER CREDENTIAL VALID</span>
                      <span className="font-mono font-black">{previewCardOfficer.academic_year || "2024-2026"}</span>
                    </div>
                  </div>

                  {/* 3D Smart Card Back */}
                  <div className="absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-br from-[#001538] via-[#000d24] to-[#000512] text-white overflow-hidden smart-card-shadow border-2 border-slate-700 p-5 sm:p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] z-10">
                    <div className="absolute top-4 left-0 right-0 h-7 bg-[#09090e] border-y border-slate-700/80"/>
                    <div className="flex items-center justify-between pt-7 pb-1 border-b border-white/10">
                      <div className="flex items-center gap-1.5">
                        <img src={snrTrustLogo} alt="SNR Trust" className="h-4 object-contain brightness-200"/>
                        <span className="text-[9px] font-black uppercase text-cyan-300">Sri Ramakrishna Engineering College</span>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400">REGION 10 · MADRAS</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 my-auto py-1 text-[9px] text-slate-300">
                      <div className="space-y-1">
                        <p className="font-black text-cyan-400 uppercase text-[9.5px]">Leadership Certification</p>
                        <p className="leading-tight text-slate-400 text-[8.5px]">
                          Official Office Bearer credential for IEEE Student Branch STB 64581.
                        </p>
                        <p className="font-mono text-slate-300 text-[8.5px]">
                          Chapter: <strong className="text-white">{previewCardOfficer.society_code.toUpperCase()}</strong>
                        </p>
                        {previewCardOfficer.phone && (<p className="font-mono text-cyan-300 text-[8.5px]">
                            Helpline: {previewCardOfficer.phone}
                          </p>)}
                      </div>

                      <div className="flex flex-col items-center justify-center text-center space-y-1 bg-white/5 p-1.5 rounded-xl border border-white/10">
                        <img src={counselorSignature} alt="Signature" className="h-7 object-contain filter invert opacity-95"/>
                        <p className="text-[8px] font-black uppercase text-slate-200 leading-none">Branch Counsellor</p>
                        <p className="text-[7.5px] text-slate-400">IEEE SREC Student Branch</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-[8px] text-slate-400">
                      <span>www.srec.ac.in · ieee.org</span>
                      <span className="font-mono text-cyan-300 font-bold">STB 64581 VERIFIED</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button type="button" onClick={() => {
                const officer = previewCardOfficer;
                setPreviewCardOfficer(null);
                setActivePdfOfficer(officer);
            }} className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/20">
                <FileText size={14}/>
                <span>Open Original PDF</span>
              </button>

              <button type="button" onClick={() => window.print()} className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer">
                <Printer size={14}/>
                <span>Print Card</span>
              </button>
            </div>
          </div>
        </div>)}
    </div>);
};
export default OfficeBearerCardsAdmin;
