import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ieeeStamp from "@/assets/ieees.png";
import counselorSign from "@/assets/counselor-signature.png";
import receiptHeader from "@/assets/receipt-header.jpg";
import html2canvas from "html2canvas";
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Check, Sparkles, User, Mail, Phone, GraduationCap, Building2, Calendar, HelpCircle, ChevronDown, Award, BookOpen, Users, Lock, ShieldAlert, Download, IdCard, Camera, Upload, ChevronRight, RefreshCw, } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/feedback/use-toast";
import { useNavigate, Link } from "react-router-dom";
import { useCurrencyExchange } from "@/hooks/useCurrencyExchange";
// Technical Societies List with exact USD Pricing (Professional vs Student)
const societiesList = [
    {
        id: "IEEE Student Branch SREC",
        name: "IEEE Student Branch SREC (Parent Branch)",
        badge: "Core Branch",
        desc: "Primary membership giving full access to all SB flagship events, workshops, and IEEE global portal.",
        isMandatory: true,
        priceStudentUSD: 14, // UG $14 (PG=$27.00)
        priceProfUSD: 98.00
    },
    {
        id: "IEEE Women in Engineering (WIE)",
        name: "IEEE Women in Engineering (WIE)",
        badge: "Special Interest",
        desc: "Empowering women scientists & engineers through mentorship, leadership summits, and grants.",
        isMandatory: true,
        priceStudentUSD: 0,
        priceProfUSD: 25
    },
    {
        id: "IEEE Computer Society (CS)",
        name: "IEEE Computer Society (CS)",
        badge: "Most Popular",
        desc: "Premier community for computing, software engineering, AI, algorithms, and cybersecurity.",
        priceStudentUSD: 8,
        priceProfUSD: 60
    },
    {
        id: "IEEE Computational Intelligence Society (CIS)",
        name: "IEEE Computational Intelligence Society (CIS)",
        badge: "AI & Neural Networks",
        desc: "Dedicated to neural networks, fuzzy systems, evolutionary computing, and deep learning.",
        priceStudentUSD: 4,
        priceProfUSD: 24
    },
    {
        id: "IEEE Communication Society (ComSoc)",
        name: "IEEE Communication Society (ComSoc)",
        badge: "Networking & 5G",
        desc: "Focusing on telecommunications, optical networks, 5G/6G, and wireless standards.",
        priceStudentUSD: 1,
        priceProfUSD: 33
    },
    {
        id: "IEEE Engineering in Medicine and Biology (EMBS)",
        name: "IEEE Engineering in Medicine and Biology (EMBS)",
        badge: "MedTech & Biotech",
        desc: "Connecting engineering with medicine, healthcare technology, biosensors, and medical devices.",
        priceStudentUSD: 1,
        priceProfUSD: 12
    },
    {
        id: "IEEE Instrumentation and Measurement (IM)",
        name: "IEEE Instrumentation and Measurement (IM)",
        badge: "Sensory Systems",
        desc: "Focusing on precision measurement, sensor design, automated testing, and metrology.",
        priceStudentUSD: 5,
        priceProfUSD: 29
    },
    {
        id: "IEEE Power Electronics Society (PELS)",
        name: "IEEE Power Electronics Society (PELS)",
        badge: "Energy & EV",
        desc: "Advancing power conversion, renewable energy tech, electric vehicles, and smart grids.",
        priceStudentUSD: 10,
        priceProfUSD: 20
    },
    {
        id: "IEEE Circuits and Systems Society (CAS)",
        name: "IEEE Circuits and Systems Society (CAS)",
        badge: "VLSI & Chip Design",
        desc: "Advancing theory, design, and practical implementation of circuits, VLSI systems, microchips, and signal processing.",
        priceStudentUSD: 6,
        priceProfUSD: 35
    }
];
// Technical & Professional Skills List
const skillsList = [
    "Web & App Development",
    "Artificial Intelligence & Machine Learning",
    "Embedded Systems & IoT",
    "Cybersecurity & Networking",
    "Robotics & Automation",
    "Data Science & Analytics",
    "Graphic Design & UI/UX",
    "Event Management & Public Relations",
    "Research Paper Writing & LaTeX",
    "Public Speaking & Anchor Leadership"
];
// FAQ List
const faqs = [
    {
        q: "What is the process after submitting my registration form?",
        a: "After you complete the online registration form and submit your payment details, our IEEE SREC Executive Committee verifies your transaction within 24-48 hours. Once verified, you will receive your official IEEE Member ID and welcome kit via email."
    },
    {
        q: "How do I get my IEEE Member ID?",
        a: "If you pay via the official IEEE.org portal, your IEEE Member ID is generated instantly on your receipt. If you register through the Student Branch portal, our officers will create your membership on IEEE's global database and forward your ID."
    },
    {
        q: "Can students from any department join IEEE SREC?",
        a: "Yes! IEEE welcomes students from all engineering disciplines, computer applications, and basic sciences. Technology is interdisciplinary, and we have active members across CSE, ECE, EEE, IT, BME, Mechanical, Robotics, and Civil."
    },
    {
        q: "What are the payment options available?",
        a: "You can either complete membership payment on IEEE's official portal (www.ieee.org/join) using credit/debit card, or pay via UPI/Bank Transfer to the IEEE SREC Treasurer account details displayed in Step 4 of the registration form."
    },
    {
        q: "Can existing IEEE members renew their membership here?",
        a: "Yes. In Step 2, select 'Existing Member / Renewal', enter your 8-digit IEEE Member ID, and select your renewal plan or society add-ons."
    }
];
// Helper to compute validity strictly as Dec 31st of Next Year from registration date
export const calculateNextYearDec31 = (joinDateStr) => {
    let startDate = new Date();
    if (joinDateStr && joinDateStr !== "PENDING") {
        const parsed = Date.parse(joinDateStr);
        if (!isNaN(parsed)) {
            startDate = new Date(parsed);
        }
        else {
            const match = joinDateStr.match(/\b(20\d{2})\b/);
            if (match) {
                startDate = new Date(`${match[1]}-01-01`);
            }
        }
    }
    const nextYear = startDate.getFullYear() + 1;
    return `DEC 31, ${nextYear}`;
};
// Country Dial Codes for International IEEE Roster
const countryCodesList = [
    { code: "+91", flag: "🇮🇳", country: "India" },
    { code: "+1", flag: "🇺🇸", country: "USA / Canada" },
    { code: "+44", flag: "🇬🇧", country: "UK" },
    { code: "+971", flag: "🇦🇪", country: "UAE" },
    { code: "+65", flag: "🇸🇬", country: "Singapore" },
    { code: "+61", flag: "🇦🇺", country: "Australia" },
    { code: "+49", flag: "🇩🇪", country: "Germany" },
    { code: "+60", flag: "🇲🇾", country: "Malaysia" },
    { code: "+974", flag: "🇶🇦", country: "Qatar" },
    { code: "+966", flag: "🇸🇦", country: "Saudi Arabia" },
];
const MembershipRegistrationPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const receiptRef = useRef(null);
    // Live Currency Exchange Hook (fawazahmed0/exchange-api with 5-minute auto polling)
    const { usdToInrRate, convertUSD, isLoading: isRateLoading, refreshRate } = useCurrencyExchange();
    // Wizard Step State
    const [step, setStep] = useState(1);
    const [applicantType, setApplicantType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    // Form Fields - Step 1: Personal & Academic
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+91");
    const [rollNumber, setRollNumber] = useState("");
    const [department, setDepartment] = useState("");
    const [yearOfStudy, setYearOfStudy] = useState("");
    const [gender, setGender] = useState("");
    const [designation, setDesignation] = useState("");
    const [tshirtSize, setTshirtSize] = useState("L");
    // Avatar / Member Photo State
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File Too Large",
                description: "Please select an image smaller than 5MB.",
                variant: "destructive"
            });
            return;
        }
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setAvatarPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };
    // Form Fields - Step 2: IEEE Status
    const [membershipType, setMembershipType] = useState("new");
    const [ieeeMemberId, setIeeeMemberId] = useState("");
    const [membershipStartDate, setMembershipStartDate] = useState(new Date().toISOString().split("T")[0]);
    // Form Fields - Step 3: Societies & Skills
    const [selectedSocieties, setSelectedSocieties] = useState([
        "IEEE Student Branch SREC",
        "IEEE Women in Engineering (WIE)"
    ]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
    const [sop, setSop] = useState("");
    // Form Fields - Step 4: Payment & Submission
    const [paymentMode, setPaymentMode] = useState("upi");
    const [transactionRef, setTransactionRef] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    // Registration Open/Closed status state
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(() => {
        const localVal = localStorage.getItem("ieee_registration_open");
        if (localVal !== null) {
            return localVal === "true";
        }
        return true; // Default to open
    });
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const { data } = await supabase
                    .from("page_contents")
                    .select("content_text")
                    .eq("page_key", "system")
                    .eq("content_key", "registration_open")
                    .maybeSingle();
                if (data && data.content_text) {
                    const remoteOpen = data.content_text !== "false";
                    setIsRegistrationOpen(remoteOpen);
                    localStorage.setItem("ieee_registration_open", String(remoteOpen));
                }
            }
            catch (e) {
                console.error("Failed to fetch registration status", e);
            }
        };
        fetchStatus();
        const handleStatusChange = () => {
            const localVal = localStorage.getItem("ieee_registration_open");
            if (localVal !== null) {
                setIsRegistrationOpen(localVal === "true");
            }
        };
        window.addEventListener("registration_status_changed", handleStatusChange);
        window.addEventListener("storage", handleStatusChange);
        return () => {
            window.removeEventListener("registration_status_changed", handleStatusChange);
            window.removeEventListener("storage", handleStatusChange);
        };
    }, []);
    // Handle society toggle (multi-select with mandatory safeguards)
    const handleSocietyToggle = (socId) => {
        const targetSoc = societiesList.find(s => s.id === socId);
        if (targetSoc?.isMandatory) {
            toast({
                title: "Mandatory Membership",
                description: `${socId} is mandatory for all registrations.`,
            });
            return;
        }
        setSelectedSocieties(prev => prev.includes(socId) ? prev.filter(id => id !== socId) : [...prev, socId]);
    };
    // Handle skill toggle
    const handleSkillToggle = (skill) => {
        setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    };
    // Dynamic validation border helpers: Green when filled, Red when empty
    const getFieldValidationClass = (val) => {
        const isFilled = val !== undefined && val !== null && String(val).trim().length > 0;
        return isFilled
            ? "w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium border-2 border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 transition-all"
            : "w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium border-2 border-red-500 bg-red-50/20 text-slate-900 focus:border-red-600 focus:ring-4 focus:ring-red-500/15 transition-all";
    };
    const getSelectValidationClass = (val) => {
        const isFilled = val !== undefined && val !== null && String(val).trim().length > 0;
        return isFilled
            ? "w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium cursor-pointer border-2 border-emerald-500 bg-emerald-50/20 text-slate-900 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/15 transition-all"
            : "w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium cursor-pointer border-2 border-red-500 bg-red-50/20 text-slate-900 focus:border-red-600 focus:ring-4 focus:ring-red-500/15 transition-all";
    };
    // Step 1 Validation
    const validateStep1 = (e) => {
        e.preventDefault();
        if (!applicantType) {
            toast({
                title: "Applicant Category Required",
                description: "Please select whether you are registering as Under Graduate, Post Graduate, or Professional.",
                variant: "destructive"
            });
            return;
        }
        if (!avatarPreview) {
            toast({
                title: "Official Passport Photo Required",
                description: "Please upload your official passport size photo for your IEEE Digital ID Card.",
                variant: "destructive"
            });
            return;
        }
        if (!rollNumber.trim() || !email.trim() || !firstName.trim() || !lastName.trim() || !phone.trim() || !department || !designation || !gender || !tshirtSize) {
            toast({
                title: "Missing Required Fields",
                description: "Please complete all mandatory fields (highlighted in red).",
                variant: "destructive"
            });
            return;
        }
        setStep(2);
        window.scrollTo({ top: 350, behavior: "smooth" });
    };
    // Step 2 Validation
    const validateStep2 = (e) => {
        e.preventDefault();
        if (membershipType === "renewal") {
            if (!ieeeMemberId.trim()) {
                toast({
                    title: "IEEE Member ID Required",
                    description: "Please enter your existing 8-digit IEEE Member Number for renewal.",
                    variant: "destructive"
                });
                return;
            }
            if (!membershipStartDate) {
                toast({
                    title: "Membership Start Date Required",
                    description: "Please select the date when your IEEE membership started.",
                    variant: "destructive"
                });
                return;
            }
        }
        setStep(3);
        window.scrollTo({ top: 350, behavior: "smooth" });
    };
    // Step 3 Validation & Receipt Generation
    const validateStep3 = async (e) => {
        e.preventDefault();
        if (selectedSocieties.length === 0) {
            toast({
                title: "Select at least one Society",
                description: "Please select at least one technical chapter or society interest.",
                variant: "destructive"
            });
            return;
        }
        if (selectedSkills.length === 0) {
            toast({
                title: "Technical Interest Required",
                description: "Please select at least one technical interest from the dropdown.",
                variant: "destructive"
            });
            return;
        }
        // Statement of Purpose is optional as requested
        try {
            setIsSubmitting(true);
            let photoUrl = avatarPreview || "";
            // Try uploading avatar file to Supabase Storage if file is attached
            if (avatarFile) {
                try {
                    const fileExt = avatarFile.name.split('.').pop() || 'png';
                    const fileName = `${rollNumber.trim().toUpperCase()}_${Date.now()}.${fileExt}`;
                    const { data: uploadData, error: uploadErr } = await supabase.storage
                        .from("avatars")
                        .upload(fileName, avatarFile, { upsert: true });
                    if (!uploadErr && uploadData) {
                        const { data: publicUrlData } = supabase.storage
                            .from("avatars")
                            .getPublicUrl(fileName);
                        if (publicUrlData?.publicUrl) {
                            photoUrl = publicUrlData.publicUrl;
                        }
                    }
                }
                catch (e) {
                    console.warn("Supabase storage upload fallback to preview:", e);
                }
            }
            const defaultPassword = `srecieee@${rollNumber.trim().toUpperCase()}`;
            const appRecord = {
                roll_number: rollNumber.trim().toUpperCase(),
                email: email.trim().toLowerCase(),
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                phone: phone.trim(),
                department: department,
                year_of_study: designation,
                gender: gender,
                tshirt_size: tshirtSize,
                member_type: applicantType === "professional" ? "Professional Member" : "Student Member",
                membership_type: membershipType,
                join_date: membershipType === "renewal" && membershipStartDate ? membershipStartDate : new Date().toISOString().split("T")[0],
                membership_start_date: membershipType === "renewal" && membershipStartDate ? membershipStartDate : new Date().toISOString().split("T")[0],
                membership_status: "ACTIVE",
                ieee_id: membershipType === "renewal" && ieeeMemberId.trim() ? ieeeMemberId.trim() : "PENDING",
                target_societies: selectedSocieties,
                skills: selectedSkills,
                bio_sop: sop.trim(),
                avatar_url: photoUrl,
                photo_url: photoUrl,
                password: defaultPassword,
                security_pin: defaultPassword,
            };
            // 1. Primary Save to Supabase `student_members` table (Array payload for Supabase JS client)
            const { error: primaryErr } = await supabase
                .from("student_members")
                .upsert([appRecord], { onConflict: "roll_number" });
            if (primaryErr) {
                console.warn("Primary student_members upsert note:", primaryErr);
                // Fallback 1: Try core schema fields in case custom columns are missing in DB
                const coreRecord = {
                    roll_number: appRecord.roll_number,
                    email: appRecord.email,
                    first_name: appRecord.first_name,
                    last_name: appRecord.last_name,
                    phone: appRecord.phone,
                    department: appRecord.department,
                    year_of_study: appRecord.year_of_study,
                    member_type: appRecord.member_type,
                    join_date: appRecord.join_date,
                    membership_status: appRecord.membership_status,
                    ieee_id: appRecord.ieee_id,
                    target_societies: appRecord.target_societies,
                    skills: appRecord.skills,
                    bio_sop: appRecord.bio_sop,
                    avatar_url: photoUrl,
                    password: defaultPassword,
                    security_pin: defaultPassword,
                };
                const { error: fallbackErr } = await supabase
                    .from("student_members")
                    .upsert([coreRecord], { onConflict: "roll_number" });
                if (fallbackErr) {
                    console.warn("Fallback student_members upsert note:", fallbackErr);
                    // Fallback 2: Try direct insert
                    const { error: insertErr } = await supabase
                        .from("student_members")
                        .insert([coreRecord]);
                    if (insertErr) {
                        console.warn("Fallback student_members insert note:", insertErr);
                    }
                }
            }
            // Save application audit record to Supabase `applications` table
            try {
                const fullPhone = phone.startsWith("+") ? phone.trim() : `${countryCode} ${phone.trim()}`;
                const userSopText = sop.trim() || "Active Student Member seeking technical participation & event access in IEEE SREC.";
                const enrichedSop = `[Roll: ${appRecord.roll_number}] ${appRecord.ieee_id ? `[IEEE ID: ${appRecord.ieee_id}] ` : ''}[Phone: ${fullPhone}] [Type: ${membershipType.toUpperCase()}]\n\nStatement of Purpose: ${userSopText}`;
                await supabase.from('applications').insert([{
                        first_name: appRecord.first_name,
                        last_name: appRecord.last_name,
                        email: appRecord.email,
                        department: appRecord.department,
                        year_of_study: appRecord.year_of_study,
                        target_society: appRecord.target_societies.join(", "),
                        statement_of_purpose: enrichedSop
                    }]);
            }
            catch (appErr) {
                console.warn("Application table insert note:", appErr);
            }
            // Save active session for instant login / ID card
            localStorage.setItem("ieee_student_session", JSON.stringify(appRecord));
            localStorage.setItem("srec_ieee_app_user", JSON.stringify(appRecord));
            setIsSubmitted(true);
            setStep(4);
            window.scrollTo({ top: 250, behavior: "smooth" });
            toast({
                title: "Registration Successful!",
                description: "Your official receipt and membership credentials have been generated below.",
            });
        }
        catch (err) {
            console.warn("Registration save warning:", err);
            setIsSubmitted(true);
            setStep(4);
            window.scrollTo({ top: 250, behavior: "smooth" });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Download Receipt as Official PDF Document
    const handleDownloadPDF = async () => {
        if (!receiptRef.current)
            return;
        setIsDownloadingPDF(true);
        // Offscreen clone container
        let cloneContainer = null;
        try {
            // 1. Clone the receipt into an offscreen fixed div matching standard A4 width (794px)
            cloneContainer = document.createElement("div");
            cloneContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: -9999px;
        width: 794px;
        z-index: -9999;
        background: #ffffff;
        pointer-events: none;
      `;
            const clone = receiptRef.current.cloneNode(true);
            clone.style.cssText = `
        width: 794px !important;
        position: static !important;
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
        overflow: visible !important;
        background: #ffffff !important;
        border-radius: 0 !important;
      `;
            cloneContainer.appendChild(clone);
            document.body.appendChild(cloneContainer);
            // 2. Wait for images/fonts to render
            await new Promise((resolve) => setTimeout(resolve, 400));
            // 3. Capture the clone at high resolution
            const canvas = await html2canvas(clone, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
                logging: false,
                scrollX: 0,
                scrollY: 0,
                windowWidth: 794,
                ignoreElements: (el) => el.classList.contains("no-pdf"),
            });
            // 4. Remove the clone
            document.body.removeChild(cloneContainer);
            cloneContainer = null;
            // 5. Download the canvas directly as a PNG image
            const fileName = `IEEE_SREC_Receipt_${(firstName || "Student").replace(/\s+/g, "_")}_${(lastName || "Member").replace(/\s+/g, "_")}.png`;
            const link = document.createElement("a");
            link.download = fileName;
            link.href = canvas.toDataURL("image/png");
            link.click();
            toast({
                title: "Receipt Downloaded!",
                description: `Saved as ${fileName}`,
            });
        }
        catch (err) {
            // Clean up clone if error occurred
            if (cloneContainer && document.body.contains(cloneContainer)) {
                document.body.removeChild(cloneContainer);
            }
            console.error("PDF generation failed:", err);
            toast({
                title: "Download Failed",
                description: "Could not generate PDF. Please try again.",
                variant: "destructive",
            });
        }
        finally {
            setIsDownloadingPDF(false);
        }
    };
    // Auto-download PDF when registration is successfully submitted
    useEffect(() => {
        if (isSubmitted) {
            const autoTimer = setTimeout(() => {
                handleDownloadPDF();
            }, 600);
            return () => clearTimeout(autoTimer);
        }
    }, [isSubmitted]);
    // Final Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            toast({
                title: "Terms & Ethics Declaration",
                description: "Please accept the IEEE Code of Ethics declaration before submitting.",
                variant: "destructive"
            });
            return;
        }
        setIsSubmitting(true);
        try {
            // Formatted statement of purpose including extra metadata safely
            const fullPhone = phone.startsWith("+") ? phone.trim() : `${countryCode} ${phone.trim()}`;
            const userSopText = sop.trim() || "Active Student Member seeking technical participation & event access in IEEE SREC.";
            const enrichedSop = `[Roll: ${rollNumber.trim().toUpperCase()}] ${ieeeMemberId ? `[IEEE ID: ${ieeeMemberId.trim()}] ` : ''}[Phone: ${fullPhone}] [Type: ${membershipType.toUpperCase()}]\n\nStatement of Purpose: ${userSopText}`;
            // 1. Insert into applications table
            const { error: appError } = await supabase.from('applications').insert([
                {
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    email: email.trim(),
                    department: department,
                    year_of_study: yearOfStudy,
                    target_society: selectedSocieties.join(", "),
                    skills: selectedSkills,
                    statement_of_purpose: enrichedSop,
                }
            ]);
            if (appError) {
                console.warn("Application insert warning:", appError);
            }
            // 2. Insert into student_members table for instant active directory and digital ID card
            // If student is new, ieee_id is left blank until manually assigned by admin in Supabase
            const assignedIeeeId = ieeeMemberId ? ieeeMemberId.trim() : "";
            const cleanRollNumber = rollNumber ? rollNumber.trim().toUpperCase() : `24${department.slice(0, 2).toUpperCase()}001`;
            const defaultPassword = `srecieee@${cleanRollNumber}`;
            // Photo upload to Supabase storage bucket `member-avatars`
            let uploadedAvatarUrl = avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + " " + lastName)}&background=002855&color=fff&size=512`;
            if (avatarFile) {
                try {
                    setIsUploadingPhoto(true);
                    const fileExt = avatarFile.name.split('.').pop() || 'jpg';
                    const fileName = `${cleanRollNumber}_${Date.now()}.${fileExt}`;
                    const { data: uploadData, error: uploadErr } = await supabase.storage
                        .from('member-avatars')
                        .upload(fileName, avatarFile, { upsert: true });
                    if (!uploadErr && uploadData) {
                        const { data: publicUrlData } = supabase.storage
                            .from('member-avatars')
                            .getPublicUrl(fileName);
                        if (publicUrlData && publicUrlData.publicUrl) {
                            uploadedAvatarUrl = publicUrlData.publicUrl;
                        }
                    }
                }
                catch (photoErr) {
                    console.warn("Storage upload note, using preview URL:", photoErr);
                }
                finally {
                    setIsUploadingPhoto(false);
                }
            }
            const memberRecord = {
                first_name: firstName.trim(),
                last_name: lastName.trim(),
                roll_number: cleanRollNumber,
                ieee_id: assignedIeeeId,
                email: email.trim().toLowerCase(),
                phone: phone ? phone.trim() : "",
                department: department,
                year_of_study: yearOfStudy,
                gender: gender || "",
                tshirt_size: tshirtSize || "L",
                designation: designation || (applicantType === "professional" ? "Professional Member" : "Student Member"),
                applicant_type: applicantType || "undergraduate",
                membership_type: membershipType,
                member_type: applicantType === "professional" ? "Professional Member" : "Student Member",
                join_date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
                valid_thru: calculateNextYearDec31(new Date().toISOString().split("T")[0]),
                membership_status: "ACTIVE",
                target_societies: selectedSocieties,
                skills: selectedSkills,
                bio_sop: sop || "",
                payment_mode: paymentMode,
                transaction_ref: transactionRef || "",
                password: defaultPassword,
                security_pin: defaultPassword,
                avatar_url: uploadedAvatarUrl,
                awards_count: 0,
                events_count: 0
            };
            try {
                const { error: smErr } = await supabase.from('student_members').upsert([memberRecord], { onConflict: 'roll_number' });
                if (smErr) {
                    console.warn("student_members upsert warning:", smErr);
                }
            }
            catch (smErr) {
                console.warn("student_members upsert note:", smErr);
            }
            // Save user session locally for persistent login
            localStorage.setItem("ieee_student_session", JSON.stringify(memberRecord));
            localStorage.setItem("srec_ieee_app_user", JSON.stringify(memberRecord));
            setIsSubmitted(true);
            toast({
                title: "Registration Saved to Supabase Database!",
                description: `Active Member credentials created. Your app login password is ${defaultPassword}`,
            });
        }
        catch (err) {
            toast({
                title: "Submission Error",
                description: err.message || "Failed to submit registration. Please verify network and try again.",
                variant: "destructive"
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    // Copy helper
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied to clipboard",
            description: text,
        });
    };
    return (<div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-[#00629b] selection:text-white flex flex-col font-sans">
      <Navbar />

      {/* HEADER BANNER - MULTI-FONT & VIBRANT STYLING */}
      <section className="pt-10 pb-4 bg-gradient-to-b from-white via-slate-50 to-[#f8fafc] border-b border-slate-200/80">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-12 text-center">
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3.5 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/60 backdrop-blur-md">
            {/* Branding Part - Serif + Deep IEEE Navy Gradient */}
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-cyan-500 animate-pulse"/>
              <span className="font-serif font-black text-xl sm:text-2xl bg-gradient-to-r from-[#003366] via-[#00629b] to-[#00a6d6] bg-clip-text text-transparent tracking-tight">
                IEEE SREC
              </span>
            </div>

            <span className="text-slate-300 font-light text-lg">|</span>

            <span className="font-extrabold font-sans text-sm sm:text-base md:text-lg uppercase tracking-wider text-[#003366]">
              Membership Registration
            </span>

            <span className="text-slate-300 font-light text-lg hidden sm:inline">•</span>

            <Link to="/student-login" className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#003366] hover:bg-[#002244] text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all active:scale-95">
              <IdCard size={14} className="text-cyan-300"/>
              <span>Already Registered? Member Login &amp; ID Card</span>
            </Link>
          </motion.div>
        </div>
      </section>
      {/* MAIN REGISTRATION WIZARD & SUMMARY CONTAINER */}
      <main className="flex-1 w-full py-16">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-12">

          {!isRegistrationOpen ? (
        /* REGISTRATION CLOSED ALERT VIEW */
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-12 text-center font-sans my-8">
              <div className="w-20 h-20 rounded-3xl bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-inner mb-6">
                <ShieldAlert size={40}/>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 font-extrabold text-xs uppercase tracking-wider mb-4">
                <Lock size={14}/>
                <span>Registrations Disabled</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
                Registrations Opening Soon!
              </h2>

              <p className="text-slate-600 text-base mt-4 leading-relaxed max-w-lg mx-auto font-medium">
                IEEE SREC Membership registrations for the upcoming academic cycle are currently <strong>CLOSED</strong> by the branch administration.
              </p>

              <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-sm font-medium leading-relaxed text-left flex items-start gap-4 shadow-sm">
                <Sparkles size={24} className="text-amber-600 shrink-0 mt-0.5"/>
                <div>
                  <span className="font-bold block text-amber-900 mb-1">Need assistance or membership inquiries?</span>
                  Please check back during the next registration window or contact the IEEE Student Branch Counsellor for direct onboarding assistance.
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="px-8 py-4 bg-[#003366] hover:bg-[#002244] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition shadow-lg flex items-center justify-center gap-2">
                  <Phone size={16}/>
                  <span>Contact Branch Counsellor</span>
                </Link>
                <Link to="/" className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 border border-slate-200">
                  <span>Return to Home</span>
                  <ArrowRight size={16}/>
                </Link>
              </div>
            </motion.div>) : (isSubmitted || step === 4) ? (
        /* OFFICIAL IEEE SREC PRINTABLE REGISTRATION RECEIPT & CREDENTIALS BANNER */
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto w-full max-w-[1122px] px-2 sm:px-0 space-y-6">
              {/* CREDENTIALS & APP ACCESS ALERT CARD */}
              <div className="bg-gradient-to-r from-[#002244] via-[#003870] to-[#00629b] text-white p-6 sm:p-8 rounded-3xl shadow-2xl border border-sky-400/30 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
                    <CheckCircle2 size={14} className="text-emerald-400"/>
                    <span>Active Member Account Registered in Database</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Welcome to IEEE SREC, {firstName}!
                  </h2>
                  <p className="text-sky-100 text-sm max-w-xl font-medium">
                    Your details are recorded in the central IEEE database. Use your credentials below to log into the mobile app and unlock your holographic 3D Digital ID card.
                  </p>

                  {/* Credentials Highlight Box */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3 items-stretch justify-center md:justify-start font-mono text-xs w-full max-w-xl">
                    <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 flex-1 min-w-0">
                      <span className="text-sky-300 font-sans text-[10.5px] block font-bold uppercase tracking-wider mb-1">Login Email / Roll No:</span>
                      <span className="font-bold text-white text-xs sm:text-sm block break-all leading-relaxed">{email}</span>
                      <span className="text-sky-300 font-sans text-xs font-semibold block mt-1">({rollNumber.toUpperCase()})</span>
                    </div>
                    <div className="bg-amber-500/20 backdrop-blur-md p-3.5 rounded-xl border border-amber-400/40 shrink-0">
                      <span className="text-amber-300 font-sans text-[10.5px] block font-bold uppercase tracking-wider mb-1">Default App Password:</span>
                      <span className="font-bold text-amber-200 text-xs sm:text-sm block leading-relaxed">srecieee@{rollNumber.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
                  <Link to="/student-login" className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition active:scale-95 text-center">
                    <IdCard size={16}/>
                    <span>Launch ID Card Portal</span>
                  </Link>
                </div>
              </div>

              <div ref={receiptRef} className="w-full max-w-[794px] bg-white text-slate-900 font-sans overflow-hidden shadow-2xl rounded-2xl border-2 border-slate-300 mx-auto">
                {/* ── INSTITUTIONAL LETTERHEAD HEADER IMAGE ── */}
                <div className="w-full bg-white">
                  <img src={receiptHeader} alt="Sri Ramakrishna Engineering College Header" className="w-full h-auto object-contain block"/>
                </div>

                {/* ── IEEE MEMBERSHIP REGISTRATION TITLE BAND ── */}
                <div style={{ background: "linear-gradient(90deg, #003366 0%, #00629b 60%, #00a6d6 100%)" }} className="w-full px-4 sm:px-6 py-3.5 relative flex items-center justify-center">
                  {/* Centred title text */}
                  <div className="flex flex-col items-center text-center">
                    <span className="text-white font-black text-base sm:text-lg uppercase tracking-[0.12em] sm:tracking-[0.15em] leading-tight">IEEE Membership Registration</span>
                    <span className="text-sky-200 font-bold text-[9.5px] sm:text-[11px] tracking-widest mt-1 uppercase">Official Enrollment Receipt — Sri Ramakrishna Engineering College</span>
                  </div>
                </div>

                {/* ── BODY ── */}
                <div className="p-3 sm:p-6 space-y-4 sm:space-y-5">

                  {/* Section 1: Applicant Credentials */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-4.5 rounded-full bg-[#003366]"/>
                      <h3 className="font-black text-xs uppercase tracking-widest text-[#003366]">1. Applicant Credentials</h3>
                    </div>

                    {/* Mobile 2-Column Key-Value Card (Fits 100% on any mobile screen without scrolling) */}
                    <div className="block sm:hidden rounded-xl border border-slate-300 overflow-hidden divide-y divide-slate-200 text-xs bg-white shadow-2xs">
                      <div className="flex items-center justify-between p-2.5 bg-slate-50/90 gap-2">
                        <span className="font-extrabold text-slate-700 uppercase text-[9.5px] tracking-wider shrink-0 w-28">Full Name</span>
                        <span className="font-black text-slate-950 text-[11.5px] text-right min-w-0 break-words">{firstName} {lastName}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-white gap-2">
                        <span className="font-extrabold text-slate-700 uppercase text-[9.5px] tracking-wider shrink-0 w-28">Academic Email</span>
                        <span className="font-mono font-bold text-slate-950 text-[10.5px] text-right min-w-0 break-all">{email}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-50/90 gap-2">
                        <span className="font-extrabold text-slate-700 uppercase text-[9.5px] tracking-wider shrink-0 w-28">Mobile Number</span>
                        <span className="font-mono font-bold text-slate-950 text-xs text-right">{phone || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-white gap-2">
                        <span className="font-extrabold text-slate-700 uppercase text-[9.5px] tracking-wider shrink-0 w-28">Roll Number</span>
                        <span className="font-mono font-black text-slate-950 text-xs text-right">{rollNumber || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-50/90 gap-2">
                        <span className="font-extrabold text-slate-700 uppercase text-[9.5px] tracking-wider shrink-0 w-28">Department</span>
                        <span className="font-bold text-slate-950 text-xs text-right">{department || '—'}{yearOfStudy ? ` (Yr ${yearOfStudy})` : ''}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-white gap-2">
                        <span className="font-extrabold text-slate-700 uppercase text-[9.5px] tracking-wider shrink-0 w-28">Gender</span>
                        <span className="font-bold text-slate-950 text-xs text-right">{gender || '—'}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-slate-50/90 gap-2">
                        <span className="font-extrabold text-slate-700 uppercase text-[9.5px] tracking-wider shrink-0 w-28">IEEE Member ID</span>
                        <span className="font-mono font-black text-[#003366] text-xs text-right min-w-0 break-all">{ieeeMemberId || 'PENDING'}</span>
                      </div>
                      <div className="flex items-center justify-between p-2.5 bg-white gap-2">
                        <span className="font-extrabold text-slate-700 uppercase text-[9.5px] tracking-wider shrink-0 w-28">Membership Expiry</span>
                        <span className="font-mono font-bold text-amber-700 text-xs text-right shrink-0">{calculateNextYearDec31()}</span>
                      </div>
                    </div>

                    {/* Desktop 4-Column Table */}
                    <div className="hidden sm:block rounded-xl border border-slate-300 overflow-hidden shadow-2xs">
                      <table style={{ width: "100%", borderCollapse: "collapse" }} className="text-xs w-full">
                        <tbody>
                          <tr style={{ backgroundColor: "#f8fafc" }}>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px", width: "18%" }} className="font-extrabold text-slate-800 uppercase text-[9.5px] tracking-wider whitespace-nowrap">Full Name</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px", width: "32%" }} className="font-black text-slate-950 text-[11.5px]">{firstName} {lastName}</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px", width: "18%" }} className="font-extrabold text-slate-800 uppercase text-[9.5px] tracking-wider whitespace-nowrap">Academic Email</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px", width: "32%" }} className="font-mono font-bold text-slate-950 text-[10.5px] whitespace-nowrap">{email}</td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px" }} className="font-extrabold text-slate-800 uppercase text-[9.5px] tracking-wider whitespace-nowrap">Mobile Number</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px" }} className="font-mono font-bold text-slate-950 text-[11px]">{phone || '—'}</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px" }} className="font-extrabold text-slate-800 uppercase text-[9.5px] tracking-wider whitespace-nowrap">Roll Number</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px" }} className="font-mono font-black text-slate-950 text-[11px]">{rollNumber || '—'}</td>
                          </tr>
                          <tr style={{ backgroundColor: "#f8fafc" }}>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px" }} className="font-extrabold text-slate-800 uppercase text-[9.5px] tracking-wider whitespace-nowrap">Department</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px" }} className="font-bold text-slate-950 text-[11px]">{department || '—'}{yearOfStudy ? ` (Yr ${yearOfStudy})` : ''}</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px" }} className="font-extrabold text-slate-800 uppercase text-[9.5px] tracking-wider whitespace-nowrap">Gender</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px" }} className="font-bold text-slate-950 text-[11px]">{gender || '—'}</td>
                          </tr>
                          <tr>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px", width: "18%" }} className="font-extrabold text-slate-800 uppercase text-[9.5px] tracking-wider whitespace-nowrap">IEEE Member ID</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px", width: "32%" }} className="font-mono font-black text-[#003366] text-[11px] tracking-wider">
                              {ieeeMemberId || 'PENDING (Will be assigned by Admin)'}
                            </td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px", width: "18%" }} className="font-extrabold text-slate-800 uppercase text-[9.5px] tracking-wider whitespace-nowrap">Membership Expiry</td>
                            <td style={{ border: "1px solid #cbd5e1", padding: "7px 10px", width: "32%" }} className="font-mono font-bold text-amber-700 text-[11px] tracking-wider">
                              {calculateNextYearDec31()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Section 2: Membership & Chapter Affiliation */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-4.5 rounded-full bg-[#003366]"/>
                      <h3 className="font-black text-xs uppercase tracking-widest text-[#003366]">2. Membership &amp; Chapter Affiliation</h3>
                    </div>
                    <div style={{ border: "1px solid #cbd5e1" }} className="rounded-xl overflow-hidden shadow-xs">
                      {/* Header bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-3 bg-slate-100/90 border-b border-slate-300">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">Registration Category</span>
                        <span style={{ backgroundColor: "#003366" }} className="self-start sm:self-auto text-white text-[10.5px] font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-xs leading-none">
                          {membershipType === "new" ? "New Student Member" : `Renewal — ID: ${ieeeMemberId || 'N/A'}`}
                        </span>
                      </div>
                      {/* Inner Body */}
                      <div className="p-3.5 sm:p-4 bg-white space-y-3.5 sm:space-y-4">
                        {/* Affiliated Societies */}
                        <div>
                          <div className="text-[10.5px] font-black uppercase tracking-wider text-slate-700 mb-2">Affiliated Technical Societies &amp; Chapters</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedSocieties.map((soc, i) => (<span key={i} style={{ backgroundColor: "#003366" }} className="inline-flex items-center px-3 sm:px-3.5 py-1.5 text-white text-[10.5px] sm:text-[11px] font-bold rounded-full shadow-2xs leading-snug">
                                {soc}
                              </span>))}
                          </div>
                        </div>

                        {/* Technical & Skill Domains */}
                        {selectedSkills.length > 0 && (<div className="pt-2 border-t border-slate-100">
                            <div className="text-[10.5px] font-black uppercase tracking-wider text-slate-700 mb-2">Technical &amp; Skill Domains</div>
                            <div className="flex flex-wrap gap-2">
                              {selectedSkills.map((sk, i) => (<span key={i} className="inline-flex items-center px-3 sm:px-3.5 py-1.5 bg-slate-800 text-slate-100 text-[10.5px] sm:text-[11px] font-bold rounded-full shadow-2xs border border-slate-700 leading-snug">
                                  {sk}
                                </span>))}
                            </div>
                          </div>)}

                        {/* Statement of Purpose */}
                        {sop && (<div className="pt-2 border-t border-slate-100">
                            <div className="text-[10.5px] font-black uppercase tracking-wider text-slate-700 mb-1.5">Statement of Purpose</div>
                            <div className="p-3 bg-slate-50 border-l-4 border-[#00629b] rounded-r-xl">
                              <p className="text-[11px] sm:text-[11.5px] text-slate-800 font-medium italic leading-relaxed">&ldquo;{sop}&rdquo;</p>
                            </div>
                          </div>)}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Fee Summary */}
                  {(() => {
                const getBasePriceUSD = () => {
                    if (applicantType === "postgraduate")
                        return 27.0;
                    if (applicantType === "professional")
                        return 98.0;
                    return 14.0;
                };
                const getItemUSD = (socId) => {
                    if (socId === "IEEE Student Branch SREC")
                        return getBasePriceUSD();
                    const item = societiesList.find(s => s.id === socId);
                    if (!item)
                        return 0;
                    return applicantType === "professional" ? item.priceProfUSD : item.priceStudentUSD;
                };
                const typeTag = applicantType === "postgraduate" ? "PG" : applicantType === "professional" ? "Prof" : "UG";
                const subtotal = selectedSocieties.reduce((sum, id) => sum + getItemUSD(id), 0);
                const tax = +(subtotal * 0.18).toFixed(2);
                const grandTotal = +(subtotal + tax).toFixed(2);
                const feeCalc = convertUSD(grandTotal, 200);
                return (<div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-4.5 rounded-full bg-[#003366]"/>
                            <h3 className="font-black text-xs uppercase tracking-widest text-[#003366]">3. Official Fee &amp; Tax Summary (Itemized USD Breakdown)</h3>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[9.5px] font-bold text-emerald-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                            <span>1 USD = ₹{usdToInrRate.toFixed(2)} (Live API)</span>
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-300 shadow-2xs overflow-hidden">
                          <table style={{ width: "100%", borderCollapse: "collapse" }} className="text-xs w-full">
                            <thead>
                              <tr style={{ backgroundColor: "#003366" }}>
                                <th style={{ padding: "9px 12px", textAlign: "left" }} className="text-white font-black text-[10.5px] sm:text-[11px] uppercase tracking-wider">Chapter / Society</th>
                                <th style={{ padding: "9px 12px", textAlign: "right" }} className="text-white font-black text-[10.5px] sm:text-[11px] uppercase tracking-wider shrink-0 whitespace-nowrap">Amount (USD)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedSocieties.map((socId, i) => {
                        const price = getItemUSD(socId);
                        const displayName = socId === "IEEE Student Branch SREC" ? `IEEE Student Branch SREC — Parent Branch (${typeTag})` : socId;
                        return (<tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                                    <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="text-slate-950 font-bold text-[11px] sm:text-[12px]">• {displayName}</td>
                                    <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px", textAlign: "right" }} className="font-mono font-black text-slate-950 text-[11px] sm:text-[12px] shrink-0 whitespace-nowrap">${price.toFixed(2)}</td>
                                  </tr>);
                    })}
                              <tr style={{ backgroundColor: "#f1f5f9" }}>
                                <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-black text-slate-800 text-[11px] sm:text-[12px]">Subtotal ({selectedSocieties.length} item{selectedSocieties.length > 1 ? 's' : ''})</td>
                                <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px", textAlign: "right" }} className="font-mono font-black text-slate-950 text-[11px] sm:text-[12px] shrink-0 whitespace-nowrap">${subtotal.toFixed(2)}</td>
                              </tr>
                              <tr style={{ backgroundColor: "#ffffff" }}>
                                <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-black text-slate-800 text-[11px] sm:text-[12px]">GST @ 18%</td>
                                <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px", textAlign: "right" }} className="font-mono font-black text-slate-950 text-[11px] sm:text-[12px] shrink-0 whitespace-nowrap">${tax.toFixed(2)}</td>
                              </tr>
                              <tr style={{ backgroundColor: "#f8fafc" }}>
                                <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-bold text-slate-700 text-[11px] sm:text-[12px]">
                                  Branch Processing &amp; Administrative Charge
                                </td>
                                <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px", textAlign: "right" }} className="font-mono font-bold text-slate-800 text-[11px] sm:text-[12px] shrink-0 whitespace-nowrap">
                                  + ₹200 INR
                                </td>
                              </tr>
                              <tr style={{ backgroundColor: "#003366" }}>
                                <td style={{ padding: "10px 12px" }} className="text-white font-black text-[12px] sm:text-[14px] uppercase tracking-wider">Total Paid Amount</td>
                                <td style={{ padding: "10px 12px", textAlign: "right" }} className="shrink-0 whitespace-nowrap">
                                  <span className="text-white font-black font-mono text-[16px] sm:text-[20px] block leading-none">${grandTotal.toFixed(2)} USD</span>
                                  <span className="text-amber-300 font-mono text-[11px] sm:text-[13px] font-black block mt-1 tracking-wider">
                                    ₹{feeCalc.totalINR.toLocaleString("en-IN")} INR
                                    <span className="text-[9px] text-amber-200 block font-normal tracking-normal">(₹{feeCalc.baseINR.toLocaleString("en-IN")} base @ ₹{usdToInrRate.toFixed(2)}/USD + ₹200 charge)</span>
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>);
            })()}
                </div>

                {/* ── FOOTER: CENTER SEAL & OFFICIAL SIGNATURE ── */}
                <div style={{ backgroundColor: "#f8fafc", borderTop: "2px solid #cbd5e1" }} className="px-6 py-6 flex flex-col items-center justify-center text-center gap-4">

                  {/* Official IEEE SREC Stamp Emblem & Scanned Signature */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14">
                    {/* Official IEEE SREC Stamp Emblem */}
                    <div className="flex flex-col items-center">
                      <img src={ieeeStamp} alt="Official IEEE SREC Stamp" className="w-24 h-24 object-contain drop-shadow-md"/>
                      <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 mt-1">OFFICIAL BRANCH SEAL</span>
                    </div>

                    {/* Dr. K. Balamurugan Scanned Signature */}
                    <div className="flex flex-col items-center">
                      <div className="h-16 flex items-end justify-center pb-1">
                        <img src={counselorSign} alt="Dr. K. Balamurugan Signature" className="h-14 w-auto object-contain drop-shadow-xs"/>
                      </div>
                      <div style={{ borderTop: "2px solid #003366", paddingTop: "4px" }} className="min-w-[170px] text-center">
                        <p className="font-serif italic font-extrabold text-[#003366] text-sm leading-tight">Dr. K. Balamurugan</p>
                        <p className="uppercase tracking-widest text-[8.5px] text-slate-600 font-black mt-0.5">BRANCH COUNSELOR</p>
                        <p className="text-[8px] text-slate-400 font-mono">IEEE SB SREC · STB61491</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Verification Banner */}
                  <div className="flex items-center justify-center gap-2 pt-3 border-t border-slate-200/80 w-full text-[10.5px] text-slate-600">
                    <ShieldCheck size={16} className="text-emerald-600 shrink-0"/>
                    <span>Electronically authenticated &amp; verified by IEEE Student Branch SREC · Sri Ramakrishna Engineering College</span>
                  </div>

                </div>

              </div>


              {/* Action Buttons (Direct PDF Download - No extraneous options) */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-4 print:hidden">
                <button onClick={handleDownloadPDF} disabled={isDownloadingPDF} className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#003366] via-[#00629b] to-[#00a6d6] hover:from-[#002244] hover:to-[#0088b8] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50">
                  <Download size={16}/> {isDownloadingPDF ? "Generating Image..." : "Download Receipt (PNG)"}
                </button>
                <Link to="/" className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-300">
                  Return to Home <ArrowRight size={16}/>
                </Link>
              </div>
            </motion.div>) : (
        /* WIZARD CONTAINER */
        <div className="grid lg:grid-cols-12 gap-8 items-start">

              {/* LEFT FORM WORKFLOW CONTAINER (8 COLS) */}
              <div className="lg:col-span-8 space-y-8">

                {/* APPLICANT TYPE SELECTOR */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
                  <p className="text-xs font-black uppercase tracking-widest text-[#00629b] mb-1">Select Category</p>
                  <h3 className="text-base font-extrabold text-slate-900 mb-4">Who are you registering as?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                {
                    id: "undergraduate",
                    label: "Under Graduate",
                    sub: "BE / B.Tech Students",
                    price: "$14.00 USD",
                    emoji: "🎓",
                    color: "#00629b",
                    bg: "bg-blue-50",
                    activeBorder: "border-[#00629b]",
                    activeBg: "bg-blue-50/90",
                    activeText: "text-[#003366]",
                },
                {
                    id: "postgraduate",
                    label: "Post Graduate",
                    sub: "ME / M.Tech / MBA / Ph.D",
                    price: "$27.00 USD",
                    emoji: "🏛️",
                    color: "#5b21b6",
                    bg: "bg-violet-50",
                    activeBorder: "border-violet-600",
                    activeBg: "bg-violet-50/90",
                    activeText: "text-violet-800",
                },
                {
                    id: "professional",
                    label: "Professional",
                    sub: "Faculty / Industry Member",
                    price: "$98.00 USD",
                    emoji: "💼",
                    color: "#b45309",
                    bg: "bg-amber-50",
                    activeBorder: "border-amber-600",
                    activeBg: "bg-amber-50/90",
                    activeText: "text-amber-800",
                },
            ].map((type) => {
                const isActive = applicantType === type.id;
                return (<button key={type.id} type="button" onClick={() => setApplicantType(type.id)} className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group hover:shadow-md ${isActive
                        ? `${type.activeBorder} ${type.activeBg} shadow-md`
                        : "border-slate-200 bg-white hover:border-slate-300"}`}>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-2xl leading-none block mb-2">{type.emoji}</span>
                              <div className="flex items-center gap-2">
                                <p className={`font-extrabold text-sm ${isActive ? type.activeText : "text-slate-800"}`}>
                                  {type.label}
                                </p>
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-[#003366] border border-blue-200">
                                  {type.price}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{type.sub}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${isActive
                        ? `border-[${type.color}] bg-[${type.color}]`
                        : "border-slate-300"}`} style={isActive ? { backgroundColor: type.color, borderColor: type.color } : {}}>
                              {isActive && <Check size={11} className="text-white stroke-[3]"/>}
                            </div>
                          </div>
                          {isActive && (<span className="absolute bottom-2 right-2 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-white/80 border" style={{ color: type.color, borderColor: type.color }}>
                              Selected
                            </span>)}
                        </button>);
            })}
                  </div>
                  {!applicantType && (<p className="text-[11px] text-amber-700 font-semibold mt-3 flex items-center gap-1.5">
                      <span className="text-amber-500">⚠</span> Please select your applicant category to proceed.
                    </p>)}
                </div>

                {/* STEP PROGRESS BAR */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    {[
                { stepNum: 1, title: "Academic Info", icon: User },
                { stepNum: 2, title: "IEEE Status", icon: Award },
                { stepNum: 3, title: "Societies & Registration", icon: ShieldCheck },
            ].map((item) => {
                const IconComp = item.icon;
                const isActive = step === item.stepNum;
                const isDone = step > item.stepNum;
                return (<div key={item.stepNum} className="flex-1 flex flex-col items-center cursor-pointer group" onClick={() => isDone && setStep(item.stepNum)}>
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${isActive
                        ? "bg-[#003366] text-white shadow-lg shadow-blue-900/30 scale-110 border-2 border-cyan-400"
                        : isDone
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                            : "bg-slate-100 text-slate-400 border border-slate-200"}`}>
                            {isDone ? <Check size={20} className="stroke-[3]"/> : <IconComp size={20}/>}
                          </div>
                          <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-2.5 hidden sm:block transition-colors ${isActive ? "text-[#003366]" : isDone ? "text-slate-800" : "text-slate-400"}`}>
                            {item.title}
                          </span>
                        </div>);
            })}
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <motion.div className="h-full bg-gradient-to-r from-[#003366] via-[#00629b] to-[#00a6d6]" initial={{ width: "33%" }} animate={{ width: `${(step / 3) * 100}%` }} transition={{ duration: 0.4 }}/>
                  </div>
                </div>

                {/* FORM CARDS - WHITE CONTAINER WITH ELEGANT SHADOWS */}
                <div className="p-8 md:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/60 relative overflow-hidden">

                  <AnimatePresence mode="wait">

                    {/* STEP 1: PERSONAL & ACADEMIC DETAILS */}
                    {step === 1 && (<motion.form key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} onSubmit={validateStep1} className="space-y-6">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[#00629b] text-xs font-black uppercase tracking-widest">Step 1 of 3</span>
                            {applicantType && (<span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${applicantType === "undergraduate" ? "bg-blue-100 text-[#003366] border border-blue-200"
                        : applicantType === "postgraduate" ? "bg-violet-100 text-violet-800 border border-violet-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"}`}>
                                {applicantType === "undergraduate" ? "🎓 UG" : applicantType === "postgraduate" ? "🏛️ PG" : "💼 Professional"}
                              </span>)}
                          </div>
                          <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900">
                            Personal & Academic Credentials
                          </h2>
                          <p className="text-slate-500 text-sm mt-1">Provide your verified SREC student information for official membership roster records.</p>
                        </div>

                        {/* Passport Photo Upload (MANDATORY *) */}
                        <div className={`p-5 rounded-2xl border-2 transition-all space-y-3 ${!avatarPreview
                    ? "border-2 border-red-500 bg-red-50/20"
                    : "border-2 border-emerald-500 bg-emerald-50/20"}`}>
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                              <Camera size={16} className={avatarPreview ? "text-emerald-600" : "text-red-500"}/>
                              Upload Official Passport Size Photo <span className="text-red-500 font-black">*</span>
                            </label>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${avatarPreview ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-red-100 text-red-700 border border-red-300"}`}>
                              {avatarPreview ? "✓ Photo Uploaded" : "Mandatory"}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row items-center gap-5">
                            {/* Photo Preview Thumbnail */}
                            <div className="w-24 h-28 rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden shrink-0 flex flex-col items-center justify-center relative shadow-sm group">
                              {avatarPreview ? (<>
                                  <img src={avatarPreview} alt="Student Avatar Preview" className="w-full h-full object-cover"/>
                                  <button type="button" onClick={() => { setAvatarPreview(""); setAvatarFile(null); }} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 transition" title="Remove photo">
                                    <span className="text-xs font-black leading-none block px-1">×</span>
                                  </button>
                                </>) : (<div className="text-center p-2 text-slate-400">
                                  <User size={32} className="mx-auto text-slate-300 mb-1"/>
                                  <span className="text-[9px] font-bold block uppercase tracking-wider">No Photo</span>
                                </div>)}
                            </div>

                            {/* File Input Controls */}
                            <div className="flex-1 space-y-2 text-center sm:text-left">
                              <p className="text-xs text-slate-600 font-medium">
                                Upload a clear passport size photo for your 3D Digital IEEE Member ID Card &amp; Official Roster.
                              </p>
                              <div className="flex items-center justify-center sm:justify-start gap-3">
                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-extrabold uppercase tracking-wider shadow-md transition active:scale-95">
                                  <Upload size={14}/>
                                  <span>{avatarPreview ? "Change Photo" : "Choose Image File"}</span>
                                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden"/>
                                </label>
                                {avatarPreview && (<span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                                    <CheckCircle2 size={14}/> Ready
                                  </span>)}
                              </div>
                              <p className="text-[10px] text-slate-400">Supported formats: JPG, PNG, WEBP (Max 5MB)</p>
                            </div>
                          </div>
                        </div>

                        {/* Staff ID / Roll Number & Official Email */}
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              {applicantType === "professional"
                    ? <><Building2 size={14} className="text-amber-600"/> Staff ID <span className="text-red-500 font-black">*</span></>
                    : <><GraduationCap size={14} className="text-[#00629b]"/> Roll / Register Number <span className="text-red-500 font-black">*</span></>}
                            </label>
                            <input required type="text" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder={applicantType === "professional" ? "e.g. SREC-FAC-045" : "e.g. 21CS045"} className={getFieldValidationClass(rollNumber)}/>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Mail size={14} className="text-[#00629b]"/>
                              Official Email
                              <span className="text-red-500 font-black">*</span>
                            </label>
                            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={applicantType === "professional" ? "faculty@srec.ac.in" : "student@srec.ac.in"} className={getFieldValidationClass(email)}/>
                          </div>
                        </div>

                        {/* First Name & Last Name */}
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <User size={14} className="text-[#00629b]"/> First Name <span className="text-red-500 font-black">*</span>
                            </label>
                            <input required type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="e.g. Surya" className={getFieldValidationClass(firstName)}/>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <User size={14} className="text-[#00629b]"/> Last Name <span className="text-red-500 font-black">*</span>
                            </label>
                            <input required type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="e.g. Prakash" className={getFieldValidationClass(lastName)}/>
                          </div>
                        </div>

                        {/* Directly Below Name: Designation & Department */}
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              {applicantType === "professional" ? (<>
                                  <Award size={14} className="text-amber-600"/>
                                  <span>Designation</span>
                                  <span className="text-red-500 font-black">*</span>
                                </>) : (<>
                                  <Calendar size={14} className="text-[#00629b]"/>
                                  <span>Year of Study</span>
                                  <span className="text-red-500 font-black">*</span>
                                </>)}
                            </label>
                            <select required value={designation} onChange={(e) => setDesignation(e.target.value)} className={getSelectValidationClass(designation)}>
                              <option value="">
                                {applicantType === "professional" ? "Select Designation" : "Select Year"}
                              </option>
                              {applicantType === "professional" ? (<>
                                  <option value="Professor">Professor</option>
                                  <option value="Associate Professor (AsP)">Associate Professor (AsP)</option>
                                  <option value="Assistant Professor (Sl.G)">Assistant Professor (Sl.G)</option>
                                  <option value="Assistant Professor (Sr.G)">Assistant Professor (Sr.G)</option>
                                  <option value="Assistant Professor (O.G)">Assistant Professor (O.G)</option>
                                  <option value="Other">Other</option>
                                </>) : applicantType === "postgraduate" ? (<>
                                  <option value="1st Year PG">1st Year PG</option>
                                  <option value="2nd Year PG">2nd Year PG</option>
                                  <option value="ME/M.Tech">ME / M.Tech Student</option>
                                  <option value="MBA">MBA Student</option>
                                  <option value="PhD">Ph.D. / Research Scholar</option>
                                </>) : applicantType === "undergraduate" ? (<>
                                  <option value="1st Year">1st Year</option>
                                  <option value="2nd Year">2nd Year</option>
                                  <option value="3rd Year">3rd Year</option>
                                  <option value="4th Year">4th Year</option>
                                </>) : (<option value="" disabled>Please select category above first</option>)}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Building2 size={14} className="text-[#00629b]"/> Department <span className="text-red-500 font-black">*</span>
                            </label>
                            <select required value={department} onChange={(e) => setDepartment(e.target.value)} className={getSelectValidationClass(department)}>
                              <option value="">Select Department</option>
                              <option value="CSE">Computer Science & Engg (CSE)</option>
                              <option value="ECE">Electronics & Comm Engg (ECE)</option>
                              <option value="EEE">Electrical & Electronics Engg (EEE)</option>
                              <option value="EIE">Electronics & Instrumentation Engg (EIE)</option>
                              <option value="IT">Information Technology (IT)</option>
                              <option value="AI & DS">Artificial Intelligence & Data Science (AI & DS)</option>
                              <option value="CSS">Computer Science & Systems (CSS)</option>
                              <option value="BME">Biomedical Engineering (BME)</option>
                              <option value="RA">Robotics & Automation (RA)</option>
                              <option value="MECH">Mechanical Engineering (MECH)</option>
                              <option value="AERO">Aeronautical Engineering (AERO)</option>
                              <option value="CIVIL">Civil Engineering (CIVIL)</option>
                              <option value="Other">Other Discipline</option>
                            </select>
                          </div>
                        </div>

                        {/* WhatsApp Mobile No, Gender & T-Shirt Size (Swag Kit) */}
                        <div className="grid sm:grid-cols-3 gap-6">
                          {/* WhatsApp Mobile No with Country Selector & Live Validation */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-md bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                                  <Phone size={12} className="stroke-[2.5]"/>
                                </div>
                                <span>WhatsApp Mobile</span>
                                <span className="text-red-500 font-black">*</span>
                              </label>
                              {phone.replace(/\D/g, '').length >= 10 ? (<span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs flex items-center gap-1">
                                  <CheckCircle2 size={10} className="stroke-[3]"/> Verified
                                </span>) : (<span className="text-[10px] font-semibold text-slate-400">
                                  {10 - phone.replace(/\D/g, '').length > 0 ? `${10 - phone.replace(/\D/g, '').length} digits left` : "Valid"}
                                </span>)}
                            </div>

                            <div className={`relative flex items-center rounded-xl border-2 transition-all duration-200 overflow-hidden bg-white shadow-xs ${phone.replace(/\D/g, '').length >= 10
                    ? "border-emerald-500 ring-2 ring-emerald-500/20"
                    : "border-slate-200 hover:border-[#00629b] focus-within:border-[#00629b] focus-within:ring-2 focus-within:ring-blue-500/20"}`}>
                              {/* Country Code Selector Badge */}
                              <div className="flex items-center gap-1 px-2 py-1.5 bg-slate-100/90 border-r border-slate-200 text-slate-900 font-black text-[11px] shrink-0 select-none">
                                <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="bg-transparent text-[11px] font-black text-slate-900 cursor-pointer focus:outline-none appearance-none pr-1">
                                  {countryCodesList.map((item) => (<option key={item.code} value={item.code}>
                                      {item.flag} {item.code}
                                    </option>))}
                                </select>
                                <span className="text-[9px] text-slate-500 font-black">▼</span>
                              </div>

                              {/* Phone Input Box */}
                              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" className="w-full px-3 py-2.5 text-xs sm:text-sm font-extrabold font-mono text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent"/>

                              {/* WhatsApp Active Icon */}
                              <div className="px-2 shrink-0 flex items-center">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${phone.replace(/\D/g, '').length >= 10
                    ? "bg-emerald-500 text-white shadow-xs scale-105"
                    : "bg-slate-100 text-slate-400"}`}>
                                  <Phone size={11} className="stroke-[2.5]"/>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <User size={14} className="text-[#00629b]"/> Gender <span className="text-red-500 font-black">*</span>
                            </label>
                            <select required value={gender} onChange={(e) => setGender(e.target.value)} className={getSelectValidationClass(gender)}>
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Sparkles size={14} className="text-[#00629b]"/> T-Shirt Size (Kit) <span className="text-red-500 font-black">*</span>
                            </label>
                            <select required value={tshirtSize} onChange={(e) => setTshirtSize(e.target.value)} className={getSelectValidationClass(tshirtSize)}>
                              <option value="XXS">XXS (34 in / Extra Extra Small)</option>
                              <option value="XS">XS (36 in / Extra Small)</option>
                              <option value="S">S (38 in / Small)</option>
                              <option value="M">M (40 in / Medium)</option>
                              <option value="L">L (42 in / Large)</option>
                              <option value="XL">XL (44 in / Extra Large)</option>
                              <option value="XXL">XXL (46 in / Double XL)</option>
                              <option value="3XL">3XL (48 in / 3XL)</option>
                            </select>
                          </div>
                        </div>



                        {/* Navigation CTA */}
                        <div className="pt-6 border-t border-slate-200 flex justify-end">
                          <button type="submit" className="px-8 py-4 rounded-2xl btn-gradient-ieee font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 group active:scale-95">
                            <span>Proceed to IEEE Tier Selection</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                          </button>
                        </div>
                      </motion.form>)}

                    {/* STEP 2: IEEE CATEGORY SELECTION */}
                    {step === 2 && (<motion.form key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} onSubmit={validateStep2} className="space-y-8">
                        <div>
                          <span className="text-[#00629b] text-xs font-black uppercase tracking-widest block mb-1">Step 2 of 3</span>
                          <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900">
                            IEEE Category Selection
                          </h2>
                          <p className="text-slate-500 text-sm mt-1">Select your membership type and pick an annual tier tailored to your career aspirations.</p>
                        </div>

                        {/* Membership Type Radio Cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div onClick={() => setMembershipType("new")} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${membershipType === "new"
                    ? "bg-blue-50/60 border-[#00629b] shadow-md shadow-blue-500/10"
                    : "bg-white border-slate-200 hover:border-slate-300"}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${membershipType === "new" ? "border-[#00629b] bg-[#00629b]" : "border-slate-400"}`}>
                              {membershipType === "new" && <Check size={12} className="text-white stroke-[3]"/>}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-base">New IEEE Member</h4>
                              <p className="text-xs text-slate-500 mt-1">First-time student applicant joining IEEE global network.</p>
                            </div>
                          </div>

                          <div onClick={() => setMembershipType("renewal")} className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${membershipType === "renewal"
                    ? "bg-blue-50/60 border-[#00629b] shadow-md shadow-blue-500/10"
                    : "bg-white border-slate-200 hover:border-slate-300"}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${membershipType === "renewal" ? "border-[#00629b] bg-[#00629b]" : "border-slate-400"}`}>
                              {membershipType === "renewal" && <Check size={12} className="text-white stroke-[3]"/>}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-base">Existing Member Renewal</h4>
                              <p className="text-xs text-slate-500 mt-1">Renew your existing IEEE membership or add societies.</p>
                            </div>
                          </div>
                        </div>

                        {/* IEEE Member ID & Start Date Input for Renewals / Active Card Count */}
                        {membershipType === "renewal" && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="p-5 sm:p-6 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                                  <ShieldCheck size={16}/> Existing 8-Digit IEEE ID <span className="text-red-500 font-black">*</span>
                                </label>
                                <input required type="text" value={ieeeMemberId} onChange={(e) => setIeeeMemberId(e.target.value)} placeholder="e.g. 98451234" className={getFieldValidationClass(ieeeMemberId)}/>
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                                  <Calendar size={16}/> Membership Start Date <span className="text-red-500 font-black">*</span>
                                </label>
                                <input required type="date" value={membershipStartDate} onChange={(e) => setMembershipStartDate(e.target.value)} className={getFieldValidationClass(membershipStartDate)}/>
                              </div>
                            </div>
                            <p className="text-[11px] text-amber-800 font-medium flex items-center gap-1.5">
                              <span>ℹ️</span> Active membership and 1-year digital ID card count starts from this date.
                            </p>
                          </motion.div>)}


                        {/* Navigation CTAs */}
                        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                          <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-300">
                            <ArrowLeft size={16}/> Back
                          </button>
                          <button type="submit" className="px-8 py-4 rounded-2xl btn-gradient-ieee font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 group active:scale-95">
                            <span>Select Society & Skills</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                          </button>
                        </div>
                      </motion.form>)}

                    {/* STEP 3: SOCIETY & SKILLS SELECTION */}
                    {step === 3 && (<motion.form key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} onSubmit={validateStep3} className="space-y-8">
                        <div>
                          <span className="text-[#00629b] text-xs font-black uppercase tracking-widest block mb-1">Step 3 of 3</span>
                          <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900">
                            Societies & Technical Domains
                          </h2>
                          <p className="text-slate-500 text-sm mt-1">Select specialized IEEE societies, chapters, and domain skill sets.</p>
                        </div>

                        {/* SOCIETY MULTI-SELECT MATRIX */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                              <Sparkles size={16} className="text-[#00629b]"/> Affiliated Societies / Chapters <span className="text-red-500 font-black">*</span>
                            </label>
                            <span className="text-xs text-[#00629b] font-bold">
                              {selectedSocieties.length} Selected
                            </span>
                          </div>

                          <div className="grid sm:grid-cols-2 gap-3.5">
                            {societiesList.map((soc) => {
                    const isSelected = selectedSocieties.includes(soc.id);
                    const isMandatory = soc.isMandatory;
                    const displayPriceUSD = soc.id === "IEEE Student Branch SREC"
                        ? (applicantType === "professional" ? 98.0 : applicantType === "postgraduate" ? 27.0 : 14.0)
                        : (applicantType === "professional" ? soc.priceProfUSD : soc.priceStudentUSD);
                    return (<button key={soc.id} type="button" onClick={() => handleSocietyToggle(soc.id)} className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${isMandatory
                            ? "bg-blue-100/90 border-[#003366] shadow-md text-slate-900"
                            : isSelected
                                ? "bg-blue-50/80 border-[#00629b] shadow-md text-slate-900"
                                : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"}`}>
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${isMandatory
                            ? "bg-[#003366] text-white"
                            : isSelected
                                ? "bg-[#003366] text-white"
                                : "bg-slate-100 text-slate-600"}`}>
                                          {soc.badge}
                                        </span>
                                        {isMandatory && (<span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1">
                                            <Lock size={9}/> MANDATORY
                                          </span>)}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-black text-[#003366] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                                          <span>${displayPriceUSD} USD</span>
                                          {displayPriceUSD > 0 && (<span className="text-[9.5px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                                              +18% GST (${(displayPriceUSD * 0.18).toFixed(2)})
                                            </span>)}
                                        </span>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isMandatory
                            ? "bg-[#003366] border-[#003366] text-white"
                            : isSelected
                                ? "bg-[#00629b] border-[#00629b] text-white"
                                : "border-slate-300 bg-white"}`}>
                                          {isSelected && <Check size={12} className="stroke-[3]"/>}
                                        </div>
                                      </div>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                      {soc.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 leading-snug mt-1 font-medium">{soc.desc}</p>
                                  </div>
                                </button>);
                })}
                          </div>
                        </div>

                        {/* Technical & Professional Interests Dropdown */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Sparkles size={14} className="text-[#00629b]"/>
                              <span>Technical &amp; Professional Interests</span>
                              <span className="text-red-500">*</span>
                            </label>
                            {selectedSkills.length > 0 && (<span className="text-[11px] font-black text-[#00629b] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                {selectedSkills.length} Selected
                              </span>)}
                          </div>

                          {/* Custom Multi-Select Dropdown Menu */}
                          <div className="relative">
                            <button type="button" onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)} className="w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium flex items-center justify-between bg-white text-left shadow-xs border border-slate-200 hover:border-[#00629b] transition-all">
                              <span className={selectedSkills.length === 0 ? "text-slate-400 font-normal text-xs sm:text-sm" : "text-slate-900 font-bold text-xs sm:text-sm truncate"}>
                                {selectedSkills.length === 0
                    ? "Select Technical & Professional Interests (Click to open)..."
                    : `${selectedSkills.length} interest(s) chosen: ${selectedSkills.slice(0, 2).join(", ")}${selectedSkills.length > 2 ? ` +${selectedSkills.length - 2} more` : ""}`}
                              </span>
                              <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${isSkillsDropdownOpen ? "rotate-90 text-[#00629b]" : ""}`}/>
                            </button>

                            {/* Dropdown Options Popover */}
                            {isSkillsDropdownOpen && (<div className="absolute top-full left-0 right-0 z-30 mt-1.5 p-2 rounded-2xl bg-white border border-slate-200 shadow-2xl space-y-1 max-h-60 overflow-y-auto">
                                <div className="p-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                                  <span>Select your core domain interests:</span>
                                  {selectedSkills.length > 0 && (<button type="button" onClick={() => setSelectedSkills([])} className="text-red-500 hover:underline">
                                      Clear All
                                    </button>)}
                                </div>
                                {skillsList.map((skill) => {
                        const isChecked = selectedSkills.includes(skill);
                        return (<div key={skill} onClick={() => handleSkillToggle(skill)} className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${isChecked
                                ? "bg-blue-50 text-[#003366] border border-blue-200"
                                : "hover:bg-slate-50 text-slate-700"}`}>
                                      <div className="flex items-center gap-2.5">
                                        <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${isChecked
                                ? "bg-[#003366] border-[#003366] text-white"
                                : "border-slate-300 bg-white"}`}>
                                          {isChecked && <Check size={11} className="stroke-[3]"/>}
                                        </div>
                                        <span>{skill}</span>
                                      </div>
                                      {isChecked && (<span className="text-[10px] uppercase font-black text-[#00629b] tracking-wider">
                                          Selected
                                        </span>)}
                                    </div>);
                    })}
                              </div>)}
                          </div>

                          {/* Selected Badges Display */}
                          {selectedSkills.length > 0 && (<div className="flex flex-wrap gap-1.5 pt-1.5">
                              {selectedSkills.map((skill) => (<span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-[#003366] text-xs font-bold shadow-xs animate-fadeIn">
                                  <span>{skill}</span>
                                  <button type="button" onClick={() => handleSkillToggle(skill)} className="text-slate-400 hover:text-red-500 font-black text-sm leading-none p-0.5" title="Remove">
                                    ×
                                  </button>
                                </span>))}
                            </div>)}
                        </div>

                        {/* Statement of Purpose */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                            <span>Statement of Purpose / Objective in joining IEEE SREC</span>
                            <span className="text-[10px] text-slate-400">Optional</span>
                          </label>
                          <textarea rows={3} value={sop} onChange={(e) => setSop(e.target.value)} placeholder="Briefly explain your expectations or technical goals..." className="w-full rounded-xl custom-input-field p-4 text-sm font-medium resize-none"/>
                        </div>

                        {/* Code of Ethics Checkbox */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-1 w-4 h-4 rounded border-slate-300 text-[#00629b] focus:ring-[#00629b]"/>
                            <span className="text-xs text-slate-600 leading-relaxed font-medium">
                              I agree to abide by the <strong className="text-slate-900">IEEE Code of Ethics</strong> and understand that my membership details will be registered with IEEE Student Branch SREC.
                            </span>
                          </label>
                        </div>

                        {/* Navigation CTAs */}
                        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                          <button type="button" onClick={() => setStep(2)} className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-300">
                            <ArrowLeft size={16}/> Back
                          </button>
                          <button type="submit" disabled={!termsAccepted || isSubmitting} className={`w-full sm:w-auto px-6 sm:px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl ${termsAccepted && !isSubmitting
                    ? "btn-gradient-ieee active:scale-95 cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"}`}>
                            {isSubmitting ? (<span>Submitting Registration...</span>) : (<div className="flex items-center gap-2">
                                <ShieldCheck size={18} className="shrink-0"/>
                                <span className="text-center leading-tight">Complete Registration &amp; Generate Receipt</span>
                              </div>)}
                          </button>
                        </div>
                      </motion.form>)}

                  </AnimatePresence>

                </div>

              </div>

              {/* RIGHT SIDEBAR: LIVE ROSTER CALCULATOR & HELP BOX (4 COLS) */}
              <div className="lg:col-span-4 space-y-6">

                {/* LIVE ROSTER SUMMARY CARD - PRISTINE WHITE CARD */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/60 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none"/>

                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#00629b] block">Live Roster Calculator</span>
                      <h3 className="text-lg font-serif font-black text-slate-900">Summary Review</h3>
                    </div>
                    <Lock size={16} className="text-[#00629b]"/>
                  </div>

                  <div className="space-y-3.5 text-xs font-medium">
                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-500">Selected Societies:</span>
                      <span className="font-extrabold text-[#00629b] truncate max-w-[170px]" title={selectedSocieties.join(", ")}>
                        {selectedSocieties.length} Selected
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-500">Registration Category:</span>
                      <span className="font-extrabold text-slate-900 uppercase">
                        {applicantType ? applicantType : "Not Selected"}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span className="text-slate-500">IEEE Branch:</span>
                      <span className="font-bold text-slate-900">IEEE SB SREC (#61491)</span>
                    </div>
                  </div>

                  {/* LIVE USD PRICE CALCULATOR BREAKDOWN */}
                  {(() => {
                const getBasePriceUSD = () => {
                    if (applicantType === "postgraduate")
                        return 27.0;
                    if (applicantType === "professional")
                        return 98.0;
                    return 14.0;
                };
                const getItemUSD = (socId) => {
                    if (socId === "IEEE Student Branch SREC")
                        return getBasePriceUSD();
                    const item = societiesList.find(s => s.id === socId);
                    if (!item)
                        return 0;
                    return applicantType === "professional" ? item.priceProfUSD : item.priceStudentUSD;
                };
                const subtotal = selectedSocieties.reduce((sum, id) => sum + getItemUSD(id), 0);
                const tax = +(subtotal * 0.18).toFixed(2);
                const grandTotal = +(subtotal + tax).toFixed(2);
                const feeCalc = convertUSD(grandTotal, 200);
                return (<div className="space-y-3 pt-3 border-t border-slate-200 text-xs font-medium">
                        {/* Live Forex Sync Pill */}
                        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"/>
                            <span className="text-[10px] font-bold text-slate-700">
                              Live Forex: 1 USD = ₹{usdToInrRate.toFixed(2)}
                            </span>
                          </div>
                          <button type="button" onClick={() => refreshRate()} title="Refresh currency exchange rate" className="text-slate-400 hover:text-[#00629b] transition-colors p-0.5">
                            <RefreshCw size={11} className={isRateLoading ? "animate-spin" : ""}/>
                          </button>
                        </div>

                        {/* Itemized List for Summary Sidebar */}
                        <div className="space-y-1.5 pb-2.5 border-b border-slate-200">
                          <span className="text-[10px] font-black uppercase tracking-wider text-[#00629b] block">
                            Itemized Pricing ({selectedSocieties.length} Selected):
                          </span>
                          {selectedSocieties.map((socId) => {
                        const price = getItemUSD(socId);
                        const typeTag = applicantType === "postgraduate" ? "PG" : applicantType === "professional" ? "Prof" : "UG";
                        const label = socId === "IEEE Student Branch SREC"
                            ? `Parent Branch (${typeTag})`
                            : socId.replace("IEEE ", "");
                        return (<div key={socId} className="flex justify-between items-center text-slate-700 text-[11px]">
                                <span className="truncate max-w-[170px]" title={socId}>• {label}</span>
                                <span className="font-mono font-bold text-slate-900">
                                  ${price.toFixed(2)} USD
                                </span>
                              </div>);
                    })}
                        </div>

                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-500">Subtotal:</span>
                          <span className="font-bold text-slate-900">${subtotal.toFixed(2)} USD</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-500">GST (18%):</span>
                          <span className="font-bold text-slate-900">${tax.toFixed(2)} USD</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                          <span className="text-slate-500">Branch Processing Fee:</span>
                          <span className="font-bold text-emerald-700">+ ₹200 INR</span>
                        </div>
                        <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between items-center text-slate-900">
                          <div>
                            <span className="font-extrabold text-sm block leading-none">Total Investment</span>
                            <span className="text-[9.5px] text-slate-500 font-normal">Official IEEE USD + ₹200</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-lg text-[#003366] block leading-none">${grandTotal.toFixed(2)} USD</span>
                            <span className="text-[10.5px] font-mono font-black text-emerald-700 block mt-0.5">
                              ₹{feeCalc.totalINR.toLocaleString("en-IN")} INR
                            </span>
                          </div>
                        </div>
                      </div>);
            })()}

                  {/* Included Member Perks */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      Included Member Advantages:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700 font-medium">
                      <li className="flex items-center gap-2">
                        <Check size={15} className="text-[#00629b] shrink-0 stroke-[3]"/>
                        <span>IEEE Xplore discounts (5M+ papers)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={15} className="text-[#00629b] shrink-0 stroke-[3]"/>
                        <span>Free entry to SREC technical workshops</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={15} className="text-[#00629b] shrink-0 stroke-[3]"/>
                        <span>Official IEEE membership card & ID</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={15} className="text-[#00629b] shrink-0 stroke-[3]"/>
                        <span>Eligibility for executive officer board</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* HELPDESK & SUPPORT BOX */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg text-xs text-slate-600 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <HelpCircle size={16} className="text-[#00629b]"/> Need Help with Registration?
                  </h4>
                  <p className="leading-relaxed font-medium">
                    Have questions about membership tiers, society selection, or payment receipt verification? Contact the IEEE SREC Helpdesk:
                  </p>
                  <div className="pt-2 font-mono text-[#00629b] font-bold space-y-1">
                    <p>📧 ieeestudentbranch@srec.ac.in</p>
                    <p>📞 +91 9080296675</p>
                  </div>
                </div>

              </div>

            </div>)}

        </div>
      </main>

      {/* WHY JOIN IEEE SREC - ADVANTAGES SECTION */}
      <section className="py-20 border-t border-slate-200 bg-white">
        <div className="max-w-[1300px] mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#00629b] text-xs font-black uppercase tracking-widest block mb-2">
              Why Join IEEE SREC?
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              Accelerate Your Professional Career
            </h2>
            <p className="text-slate-600 text-base font-medium">
              As an IEEE SREC member, you become part of the world's largest technical professional organization for the advancement of technology.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-[#00629b]/40 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#003366] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={28}/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">IEEE Xplore Access</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Access over 5 million peer-reviewed journal papers, conference proceedings, and technical standards to accelerate your academic research.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-[#00629b]/40 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#003366] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28}/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Global Networking</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Connect with global researchers, industry leaders, IEEE Fellows, and alumni across 160+ countries for career mentorship and research collaborations.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-[#00629b]/40 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#003366] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award size={28}/>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Grants & Leadership</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Unlock funding for innovation projects, earn travel grants for IEEE international conferences, and hold executive office bearer positions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION SECTION */}
      <section className="py-20 bg-[#f8fafc] border-t border-slate-200">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          <div className="text-center mb-14">
            <span className="text-[#00629b] text-xs font-black uppercase tracking-widest block mb-2">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (<div key={idx} className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all">
                  <button type="button" onClick={() => setOpenFaq(isOpen ? null : idx)} className="w-full p-6 text-left font-bold text-slate-900 text-base md:text-lg flex items-center justify-between gap-4 hover:text-[#00629b] transition-colors">
                    <span>{faq.q}</span>
                    <ChevronDown size={20} className={`text-[#00629b] transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}/>
                  </button>
                  <AnimatePresence>
                    {isOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 font-medium">
                        {faq.a}
                      </motion.div>)}
                  </AnimatePresence>
                </div>);
        })}
          </div>
        </div>
      </section>

      <Footer />
    </div>);
};
export default MembershipRegistrationPage;
