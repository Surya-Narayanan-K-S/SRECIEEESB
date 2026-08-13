import { useState, useRef, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ieeeLogo from "@/assets/ieee-logo.png";
import ieeeStamp from "@/assets/ieees.png";
import srecLogo from "@/assets/srec-logo.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import receiptHeader from "@/assets/receipt-header.jpg";
import html2canvas from "html2canvas";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Building2, 
  Calendar, 
  CreditCard, 
  HelpCircle, 
  ChevronDown, 
  Zap, 
  Award, 
  BookOpen, 
  Users, 
  Copy, 
  FileText, 
  QrCode, 
  AlertCircle,
  ExternalLink,
  Lock,
  ShieldAlert,
  Download,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, Link } from "react-router-dom";

// Technical Societies List with exact USD Pricing (Professional vs Student)
const societiesList = [
  { 
    id: "IEEE Student Branch SREC", 
    name: "IEEE Student Branch SREC (Parent Branch)", 
    badge: "Core Branch",
    desc: "Primary membership giving full access to all SB flagship events, workshops, and IEEE global portal.",
    isMandatory: true,
    priceStudentUSD: 7, // UG $7 (PG=$13.50)
    priceProfUSD: 90.50
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
    priceStudentUSD: 5,
    priceProfUSD: 10
  },
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

const MembershipRegistrationPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);

  // Wizard Step State
  const [step, setStep] = useState<number>(1);
  const [applicantType, setApplicantType] = useState<"undergraduate" | "postgraduate" | "professional" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form Fields - Step 1: Personal & Academic
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("");
  const [gender, setGender] = useState("");
  const [designation, setDesignation] = useState("");

  // Form Fields - Step 2: IEEE Status
  const [membershipType, setMembershipType] = useState<"new" | "renewal">("new");
  const [ieeeMemberId, setIeeeMemberId] = useState("");

  // Form Fields - Step 3: Societies & Skills
  const [selectedSocieties, setSelectedSocieties] = useState<string[]>([
    "IEEE Student Branch SREC",
    "IEEE Women in Engineering (WIE)"
  ]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sop, setSop] = useState("");

  // Form Fields - Step 4: Payment & Submission
  const [paymentMode, setPaymentMode] = useState<"upi" | "ieee_portal">("upi");
  const [transactionRef, setTransactionRef] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Registration Open/Closed status state
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(() => {
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
      } catch (e) {
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
  const handleSocietyToggle = (socId: string) => {
    const targetSoc = societiesList.find(s => s.id === socId);
    if (targetSoc?.isMandatory) {
      toast({
        title: "Mandatory Membership",
        description: `${socId} is mandatory for all registrations.`,
      });
      return;
    }
    setSelectedSocieties(prev => 
      prev.includes(socId) ? prev.filter(id => id !== socId) : [...prev, socId]
    );
  };

  // Handle skill toggle
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  // Step 1 Validation
  const validateStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantType) {
      toast({
        title: "Applicant Category Required",
        description: "Please select whether you are registering as Under Graduate, Post Graduate, or Professional.",
        variant: "destructive"
      });
      return;
    }
    if (!rollNumber.trim() || !email.trim() || !firstName.trim() || !lastName.trim() || !phone.trim() || !department || !designation) {
      toast({
        title: "Missing Required Fields",
        description: "Please complete all required fields (ID, Official Email, Name, Mobile, Department, and Designation).",
        variant: "destructive"
      });
      return;
    }
    setStep(2);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  // Step 2 Validation
  const validateStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (membershipType === "renewal" && !ieeeMemberId.trim()) {
      toast({
        title: "IEEE Member ID Required",
        description: "Please enter your existing 8-digit IEEE Member Number for renewal.",
        variant: "destructive"
      });
      return;
    }
    setStep(3);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  // Step 3 Validation
  const validateStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSocieties.length === 0) {
      toast({
        title: "Select at least one Society",
        description: "Please select at least one technical chapter or society interest.",
        variant: "destructive"
      });
      return;
    }
    setStep(4);
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  // Download Receipt as Official PDF Document
  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;
    setIsDownloadingPDF(true);

    // Offscreen clone container
    let cloneContainer: HTMLDivElement | null = null;

    try {
      // 1. Clone the receipt into an offscreen fixed div
      cloneContainer = document.createElement("div");
      cloneContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: -9999px;
        width: 1122px;
        z-index: -9999;
        background: #ffffff;
        pointer-events: none;
      `;

      const clone = receiptRef.current.cloneNode(true) as HTMLElement;
      clone.style.cssText = `
        width: 1122px !important;
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

      // 3. Capture the clone at position (0,0) with high resolution (scale 3)
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1122,
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
    } catch (err) {
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
    } finally {
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
  const handleSubmit = async (e: React.FormEvent) => {
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
      const enrichedSop = `[Type: ${membershipType.toUpperCase()}] [Societies: ${selectedSocieties.join(", ")}] ${ieeeMemberId ? `[IEEE ID: ${ieeeMemberId}] ` : ''}${phone ? `[Phone: ${phone}] ` : ''}${rollNumber ? `[Roll No: ${rollNumber}] ` : ''}${transactionRef ? `[Txn Ref: ${transactionRef}] ` : ''}\n\nStatement of Purpose: ${sop || 'N/A'}`;

      const { error } = await supabase.from('applications').insert([
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

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Registration Submitted Successfully!",
        description: "Your application has been received. Check your email for further instructions.",
      });
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err.message || "Failed to submit registration. Please verify network and try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Copy helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: text,
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 selection:bg-[#00629b] selection:text-white flex flex-col font-sans">
      <Navbar />

      {/* HEADER BANNER - MULTI-FONT & VIBRANT STYLING */}
      <section className="pt-10 pb-4 bg-gradient-to-b from-white via-slate-50 to-[#f8fafc] border-b border-slate-200/80">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3.5 rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/60 backdrop-blur-md"
          >
            {/* Branding Part - Serif + Deep IEEE Navy Gradient */}
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-cyan-500 animate-pulse" />
              <span className="font-serif font-black text-xl sm:text-2xl bg-gradient-to-r from-[#003366] via-[#00629b] to-[#00a6d6] bg-clip-text text-transparent tracking-tight">
                IEEE SREC
              </span>
            </div>
            
            <span className="text-slate-300 font-light text-lg">|</span>
            
            {/* Title Part - Modern Bold Sans in Royal Blue */}
            <span className="font-extrabold font-sans text-sm sm:text-base md:text-lg uppercase tracking-wider text-[#003366]">
              Membership Registration
            </span>

            <span className="text-slate-300 font-light text-lg hidden sm:inline">•</span>


          </motion.div>
        </div>
      </section>
      {/* MAIN REGISTRATION WIZARD & SUMMARY CONTAINER */}
      <main className="flex-1 w-full py-16">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-12">

          {!isRegistrationOpen ? (
            /* REGISTRATION CLOSED ALERT VIEW */
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-12 text-center font-sans my-8"
            >
              <div className="w-20 h-20 rounded-3xl bg-red-50 border-2 border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-inner mb-6">
                <ShieldAlert size={40} />
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-200 text-red-700 font-extrabold text-xs uppercase tracking-wider mb-4">
                <Lock size={14} />
                <span>Registrations Disabled</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 tracking-tight">
                Registrations Opening Soon!
              </h2>

              <p className="text-slate-600 text-base mt-4 leading-relaxed max-w-lg mx-auto font-medium">
                IEEE SREC Membership registrations for the upcoming academic cycle are currently <strong>CLOSED</strong> by the branch administration.
              </p>

              <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-sm font-medium leading-relaxed text-left flex items-start gap-4 shadow-sm">
                <Sparkles size={24} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-900 mb-1">Need assistance or membership inquiries?</span>
                  Please check back during the next registration window or contact the IEEE Student Branch Counsellor for direct onboarding assistance.
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/contact"
                  className="px-8 py-4 bg-[#003366] hover:bg-[#002244] text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  <span>Contact Branch Counsellor</span>
                </Link>
                <Link
                  to="/"
                  className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-widest rounded-xl transition flex items-center justify-center gap-2 border border-slate-200"
                >
                  <span>Return to Home</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ) : isSubmitted ? (
            /* OFFICIAL IEEE SREC PRINTABLE REGISTRATION RECEIPT — REDESIGNED */
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto w-full max-w-[1122px] px-2 sm:px-0"
            >
              <div
                ref={receiptRef}
                className="w-full max-w-[1122px] bg-white text-slate-900 font-sans overflow-hidden shadow-xl rounded-2xl border border-slate-200/80 mx-auto"
              >
                {/* ── INSTITUTIONAL LETTERHEAD HEADER IMAGE ── */}
                <div className="w-full bg-white">
                  <img src={receiptHeader} alt="Sri Ramakrishna Engineering College Header" className="w-full h-auto object-contain block" />
                </div>

                {/* ── IEEE MEMBERSHIP REGISTRATION TITLE BAND ── */}
                <div style={{ background: "linear-gradient(90deg, #003366 0%, #00629b 60%, #00a6d6 100%)" }} className="w-full px-8 py-4 relative flex items-center justify-center">
                  {/* Centred title text */}
                  <div className="flex flex-col items-center text-center">
                    <span className="text-white font-black text-[22px] uppercase tracking-[0.18em] leading-none">IEEE Membership Registration</span>
                    <span className="text-sky-200 font-bold text-[12px] tracking-widest mt-1 uppercase">Official Enrollment Receipt — Sri Ramakrishna Engineering College</span>
                  </div>
                  
                </div>

                {/* ── BODY ── */}
                <div className="px-8 py-6 space-y-5">

                  {/* Section 1: Applicant Credentials */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-5 rounded-full bg-[#003366]" />
                      <h3 className="font-black text-[12px] uppercase tracking-widest text-[#003366]">1. Applicant Credentials</h3>
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }} className="text-xs">
                      <tbody>
                        <tr style={{ backgroundColor: "#f8fafc" }}>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px", width: "135px" }} className="font-extrabold text-slate-800 uppercase text-[10.5px] tracking-wider">Full Name</td>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-black text-slate-950 text-[13px]">{firstName} {lastName}</td>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px", width: "135px" }} className="font-extrabold text-slate-800 uppercase text-[10.5px] tracking-wider">Academic Email</td>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-mono font-bold text-slate-950 text-[12px]">{email}</td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-extrabold text-slate-800 uppercase text-[10.5px] tracking-wider">Mobile Number</td>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-mono font-bold text-slate-950 text-[12px]">{phone || '—'}</td>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-extrabold text-slate-800 uppercase text-[10.5px] tracking-wider">Roll Number</td>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-mono font-black text-slate-950 text-[12px]">{rollNumber || '—'}</td>
                        </tr>
                        <tr style={{ backgroundColor: "#f8fafc" }}>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-extrabold text-slate-800 uppercase text-[10.5px] tracking-wider">Department</td>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-bold text-slate-950 text-[12px]">{department || '—'}{yearOfStudy ? ` (Year ${yearOfStudy})` : ''}</td>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-extrabold text-slate-800 uppercase text-[10.5px] tracking-wider">Gender</td>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-bold text-slate-950 text-[12px]">{gender || '—'}</td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-extrabold text-slate-800 uppercase text-[10.5px] tracking-wider">IEEE Membership ID</td>
                          <td colSpan={3} style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-mono font-black text-[#003366] text-[13px] tracking-widest">
                            {ieeeMemberId || '—'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Section 2: Membership & Chapter Affiliation */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-5 rounded-full bg-[#003366]" />
                      <h3 className="font-black text-[12px] uppercase tracking-widest text-[#003366]">2. Membership &amp; Chapter Affiliation</h3>
                    </div>
                    <div style={{ border: "1px solid #cbd5e1" }} className="rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 border-b border-slate-300">
                        <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-800">Registration Category</span>
                        <span style={{ backgroundColor: "#003366" }} className="text-white text-[10px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                          {membershipType === "new" ? "New Student Member" : `Renewal — ID: ${ieeeMemberId || 'N/A'}`}
                        </span>
                      </div>
                      <div className="px-4 py-3 bg-white">
                        <div className="text-[10.5px] font-black uppercase tracking-wider text-slate-800 mb-2">Affiliated Technical Societies &amp; Chapters</div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSocieties.map((soc, i) => (
                            <span key={i} style={{ backgroundColor: "#003366" }} className="text-white text-[11px] font-bold px-3.5 py-1 rounded-full shadow-sm">{soc}</span>
                          ))}
                        </div>
                        {selectedSkills.length > 0 && (
                          <div className="mt-3">
                            <div className="text-[10.5px] font-black uppercase tracking-wider text-slate-800 mb-1.5">Technical &amp; Skill Domains</div>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedSkills.map((sk, i) => (
                                <span key={i} className="px-3 py-1 bg-slate-800 text-white text-[11px] font-bold rounded-lg shadow-sm border border-slate-900">{sk}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {sop && (
                          <div className="mt-3">
                            <div className="text-[10.5px] font-black uppercase tracking-wider text-slate-800 mb-1">Statement of Purpose</div>
                            <p className="text-[11px] text-slate-900 font-medium italic border-l-4 border-[#00629b] pl-3 py-1.5 bg-slate-50 rounded-r">&ldquo;{sop}&rdquo;</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Fee Summary */}
                  {(() => {
                    const getBasePriceUSD = () => {
                      if (applicantType === "postgraduate") return 13.5;
                      if (applicantType === "professional") return 90.5;
                      return 7.0;
                    };
                    const getItemUSD = (socId: string) => {
                      if (socId === "IEEE Student Branch SREC") return getBasePriceUSD();
                      const item = societiesList.find(s => s.id === socId);
                      if (!item) return 0;
                      return applicantType === "professional" ? item.priceProfUSD : item.priceStudentUSD;
                    };
                    const typeTag = applicantType === "postgraduate" ? "PG" : applicantType === "professional" ? "Prof" : "UG";
                    const subtotal = selectedSocieties.reduce((sum, id) => sum + getItemUSD(id), 0);
                    const tax = +(subtotal * 0.18).toFixed(2);
                    const grandTotal = +(subtotal + tax).toFixed(2);
                    return (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-5 rounded-full bg-[#003366]" />
                          <h3 className="font-black text-[12px] uppercase tracking-widest text-[#003366]">3. Official Fee &amp; Tax Summary (Itemized USD Breakdown)</h3>
                        </div>
                        <table style={{ width: "100%", borderCollapse: "collapse" }} className="text-xs">
                          <thead>
                            <tr style={{ backgroundColor: "#003366" }}>
                              <th style={{ padding: "9px 12px", textAlign: "left" }} className="text-white font-black text-[11px] uppercase tracking-wider">Chapter / Society</th>
                              <th style={{ padding: "9px 12px", textAlign: "right" }} className="text-white font-black text-[11px] uppercase tracking-wider">Amount (USD)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSocieties.map((socId, i) => {
                              const price = getItemUSD(socId);
                              const displayName = socId === "IEEE Student Branch SREC" ? `IEEE Student Branch SREC — Parent Branch (${typeTag})` : socId;
                              return (
                                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc" }}>
                                  <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="text-slate-950 font-bold text-[12px]">• {displayName}</td>
                                  <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px", textAlign: "right" }} className="font-mono font-black text-slate-950 text-[12px]">${price.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                            <tr style={{ backgroundColor: "#f1f5f9" }}>
                              <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-black text-slate-800 text-[12px]">Subtotal ({selectedSocieties.length} item{selectedSocieties.length > 1 ? 's' : ''})</td>
                              <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px", textAlign: "right" }} className="font-mono font-black text-slate-950 text-[12px]">${subtotal.toFixed(2)}</td>
                            </tr>
                            <tr style={{ backgroundColor: "#ffffff" }}>
                              <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px" }} className="font-black text-slate-800 text-[12px]">GST @ 18%</td>
                              <td style={{ border: "1px solid #cbd5e1", padding: "8px 12px", textAlign: "right" }} className="font-mono font-black text-slate-950 text-[12px]">${tax.toFixed(2)}</td>
                            </tr>
                            <tr style={{ backgroundColor: "#003366" }}>
                              <td style={{ padding: "12px 14px" }} className="text-white font-black text-[14px] uppercase tracking-wider">Total Paid Amount</td>
                              <td style={{ padding: "12px 14px", textAlign: "right" }}>
                                <span className="text-white font-black font-mono text-[20px] block leading-none">${grandTotal.toFixed(2)} USD</span>
                                <span className="text-amber-300 font-mono text-[12px] font-black block mt-1 tracking-wider">≈ ₹{Math.round(grandTotal * 83).toLocaleString()} INR</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

                {/* ── FOOTER ── */}
                <div style={{ backgroundColor: "#f1f5f9", borderTop: "2px solid #cbd5e1" }} className="px-6 py-4 flex items-center justify-between gap-4">

                  {/* Left: Verification badge */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-700 shrink-0">
                      <ShieldCheck size={22} />
                    </div>
                    <div className="text-[10px] text-slate-700">
                      <p className="font-black text-slate-950 uppercase text-[11px] tracking-wide">IEEE SREC Roster Verification</p>
                      <p className="font-bold text-slate-800">Electronically verified student enrollment</p>
                      <p className="font-mono text-[#003366] font-black text-[11px] tracking-wider">STB61491 • SREC COIMBATORE</p>
                    </div>
                  </div>

                  {/* Centre: Seal + Counselor Signature */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    {/* Official IEEE SREC Stamp Emblem */}
                    <img src={ieeeStamp} alt="Official IEEE SREC Stamp" className="w-20 h-20 object-contain drop-shadow" />
                    {/* Counselor */}
                    <div style={{ borderTop: "2px solid #94a3b8", paddingTop: "6px" }} className="min-w-[140px]">
                      <p className="font-serif italic font-extrabold text-[#003366] text-[12px]">Dr. K. Balamurugan</p>
                      <p className="uppercase tracking-wider text-[8px] text-slate-400 font-bold mt-0.5">Branch Counselor</p>
                    </div>
                  </div>
                </div>

              </div>


              {/* Action Buttons (Direct PDF Download - No extraneous options) */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-center gap-4 print:hidden">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isDownloadingPDF}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#003366] via-[#00629b] to-[#00a6d6] hover:from-[#002244] hover:to-[#0088b8] text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50"
                >
                  <Download size={16} /> {isDownloadingPDF ? "Generating Image..." : "Download Receipt (PNG)"}
                </button>
                <Link
                  to="/"
                  className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-300"
                >
                  Return to Home <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ) : (
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
                        id: "undergraduate" as const,
                        label: "Under Graduate",
                        sub: "BE / B.Tech Students",
                        price: "$7.00 USD",
                        emoji: "🎓",
                        color: "#00629b",
                        bg: "bg-blue-50",
                        activeBorder: "border-[#00629b]",
                        activeBg: "bg-blue-50/90",
                        activeText: "text-[#003366]",
                      },
                      {
                        id: "postgraduate" as const,
                        label: "Post Graduate",
                        sub: "ME / M.Tech / MBA / Ph.D",
                        price: "$13.50 USD",
                        emoji: "🏛️",
                        color: "#5b21b6",
                        bg: "bg-violet-50",
                        activeBorder: "border-violet-600",
                        activeBg: "bg-violet-50/90",
                        activeText: "text-violet-800",
                      },
                      {
                        id: "professional" as const,
                        label: "Professional",
                        sub: "Faculty / Industry Member",
                        price: "$90.50 USD",
                        emoji: "💼",
                        color: "#b45309",
                        bg: "bg-amber-50",
                        activeBorder: "border-amber-600",
                        activeBg: "bg-amber-50/90",
                        activeText: "text-amber-800",
                      },
                    ].map((type) => {
                      const isActive = applicantType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setApplicantType(type.id)}
                          className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 group hover:shadow-md ${
                            isActive
                              ? `${type.activeBorder} ${type.activeBg} shadow-md`
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-2xl leading-none block mb-2">{type.emoji}</span>
                              <div className="flex items-center gap-2">
                                <p className={`font-extrabold text-sm ${ isActive ? type.activeText : "text-slate-800"}`}>
                                  {type.label}
                                </p>
                                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-[#003366] border border-blue-200">
                                  {type.price}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{type.sub}</p>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                              isActive
                                ? `border-[${type.color}] bg-[${type.color}]`
                                : "border-slate-300"
                            }`}
                              style={isActive ? { backgroundColor: type.color, borderColor: type.color } : {}}
                            >
                              {isActive && <Check size={11} className="text-white stroke-[3]" />}
                            </div>
                          </div>
                          {isActive && (
                            <span className="absolute bottom-2 right-2 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-white/80 border"
                              style={{ color: type.color, borderColor: type.color }}
                            >
                              Selected
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {!applicantType && (
                    <p className="text-[11px] text-amber-700 font-semibold mt-3 flex items-center gap-1.5">
                      <span className="text-amber-500">⚠</span> Please select your applicant category to proceed.
                    </p>
                  )}
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

                      return (
                        <div 
                          key={item.stepNum} 
                          className="flex-1 flex flex-col items-center cursor-pointer group"
                          onClick={() => isDone && setStep(item.stepNum)}
                        >
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                            isActive 
                              ? "bg-[#003366] text-white shadow-lg shadow-blue-900/30 scale-110 border-2 border-cyan-400"
                              : isDone
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}>
                            {isDone ? <Check size={20} className="stroke-[3]" /> : <IconComp size={20} />}
                          </div>
                          <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider mt-2.5 hidden sm:block transition-colors ${
                            isActive ? "text-[#003366]" : isDone ? "text-slate-800" : "text-slate-400"
                          }`}>
                            {item.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#003366] via-[#00629b] to-[#00a6d6]"
                      initial={{ width: "33%" }}
                      animate={{ width: `${(step / 3) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                {/* FORM CARDS - WHITE CONTAINER WITH ELEGANT SHADOWS */}
                <div className="p-8 md:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
                  
                  <AnimatePresence mode="wait">

                    {/* STEP 1: PERSONAL & ACADEMIC DETAILS */}
                    {step === 1 && (
                      <motion.form
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={validateStep1}
                        className="space-y-6"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[#00629b] text-xs font-black uppercase tracking-widest">Step 1 of 3</span>
                            {applicantType && (
                              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                applicantType === "undergraduate" ? "bg-blue-100 text-[#003366] border border-blue-200"
                                : applicantType === "postgraduate" ? "bg-violet-100 text-violet-800 border border-violet-200"
                                : "bg-amber-100 text-amber-800 border border-amber-200"
                              }`}>
                                {applicantType === "undergraduate" ? "🎓 UG" : applicantType === "postgraduate" ? "🏛️ PG" : "💼 Professional"}
                              </span>
                            )}
                          </div>
                          <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900">
                            Personal & Academic Credentials
                          </h2>
                          <p className="text-slate-500 text-sm mt-1">Provide your verified SREC student information for official membership roster records.</p>
                        </div>

                        {/* Staff ID / Roll Number & Official Email */}
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              {applicantType === "professional"
                                ? <><Building2 size={14} className="text-amber-600" /> Staff ID <span className="text-red-500">*</span></>
                                : <><GraduationCap size={14} className="text-[#00629b]" /> Roll / Register Number <span className="text-red-500">*</span></>}
                            </label>
                            <input
                              required
                              type="text"
                              value={rollNumber}
                              onChange={(e) => setRollNumber(e.target.value)}
                              placeholder={applicantType === "professional" ? "e.g. SREC-FAC-045" : "e.g. 21CS045"}
                              className="w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Mail size={14} className="text-[#00629b]" />
                              Official Email
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              required
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder={applicantType === "professional" ? "faculty@srec.ac.in" : "student@srec.ac.in"}
                              className="w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium"
                            />
                          </div>
                        </div>

                        {/* First Name & Last Name */}
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <User size={14} className="text-[#00629b]" /> First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              required
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              placeholder="e.g. Surya"
                              className="w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <User size={14} className="text-[#00629b]" /> Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              required
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              placeholder="e.g. Prakash"
                              className="w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium"
                            />
                          </div>
                        </div>

                        {/* Directly Below Name: Designation & Department */}
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Award size={14} className={applicantType === "professional" ? "text-amber-600" : "text-[#00629b]"} />
                              Designation <span className="text-red-500">*</span>
                            </label>
                            <select
                              required
                              value={designation}
                              onChange={(e) => setDesignation(e.target.value)}
                              className="w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium cursor-pointer"
                            >
                              <option value="">Select Designation</option>
                              {applicantType === "professional" ? (
                                <>
                                  <option value="Professor">Professor</option>
                                  <option value="Associate Professor (AsP)">Associate Professor (AsP)</option>
                                  <option value="Assistant Professor (Sl.G)">Assistant Professor (Sl.G)</option>
                                  <option value="Assistant Professor (Sr.G)">Assistant Professor (Sr.G)</option>
                                  <option value="Assistant Professor (O.G)">Assistant Professor (O.G)</option>
                                  <option value="Other">Other</option>
                                </>
                              ) : (
                                <>
                                  <option value="1st Year">1st Year (BE / B.Tech)</option>
                                  <option value="2nd Year">2nd Year (BE / B.Tech)</option>
                                  <option value="3rd Year">3rd Year (BE / B.Tech)</option>
                                  <option value="4th Year">4th Year (BE / B.Tech)</option>
                                  <option value="ME/M.Tech">ME / M.Tech Student</option>
                                  <option value="MBA">MBA Student</option>
                                  <option value="PhD">Ph.D. / Research Scholar</option>
                                </>
                              )}
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Building2 size={14} className="text-[#00629b]" /> Department <span className="text-red-500">*</span>
                            </label>
                            <select
                              required
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              className="w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium cursor-pointer"
                            >
                              <option value="">Select Department</option>
                              <option value="CSE">Computer Science & Engg (CSE)</option>
                              <option value="ECE">Electronics & Comm Engg (ECE)</option>
                              <option value="EEE">Electrical & Electronics Engg (EEE)</option>
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

                        {/* WhatsApp Mobile No & Gender */}
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <Phone size={14} className="text-[#00629b]" /> WhatsApp Mobile No. <span className="text-red-500">*</span>
                            </label>
                            <input
                              required
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+91 9876543210"
                              className="w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                              <User size={14} className="text-[#00629b]" /> Gender
                            </label>
                            <select
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                              className="w-full rounded-xl custom-input-field px-4 py-3.5 text-sm font-medium cursor-pointer"
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                          </div>
                        </div>

                        {/* Navigation CTA */}
                        <div className="pt-6 border-t border-slate-200 flex justify-end">
                          <button
                            type="submit"
                            className="px-8 py-4 rounded-2xl btn-gradient-ieee font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 group active:scale-95"
                          >
                            <span>Proceed to IEEE Tier Selection</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* STEP 2: IEEE CATEGORY SELECTION */}
                    {step === 2 && (
                      <motion.form
                        key="step2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={validateStep2}
                        className="space-y-8"
                      >
                        <div>
                          <span className="text-[#00629b] text-xs font-black uppercase tracking-widest block mb-1">Step 2 of 3</span>
                          <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900">
                            IEEE Category Selection
                          </h2>
                          <p className="text-slate-500 text-sm mt-1">Select your membership type and pick an annual tier tailored to your career aspirations.</p>
                        </div>

                        {/* Membership Type Radio Cards */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div
                            onClick={() => setMembershipType("new")}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                              membershipType === "new"
                                ? "bg-blue-50/60 border-[#00629b] shadow-md shadow-blue-500/10"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                              membershipType === "new" ? "border-[#00629b] bg-[#00629b]" : "border-slate-400"
                            }`}>
                              {membershipType === "new" && <Check size={12} className="text-white stroke-[3]" />}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-base">New IEEE Member</h4>
                              <p className="text-xs text-slate-500 mt-1">First-time student applicant joining IEEE global network.</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setMembershipType("renewal")}
                            className={`p-6 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                              membershipType === "renewal"
                                ? "bg-blue-50/60 border-[#00629b] shadow-md shadow-blue-500/10"
                                : "bg-white border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                              membershipType === "renewal" ? "border-[#00629b] bg-[#00629b]" : "border-slate-400"
                            }`}>
                              {membershipType === "renewal" && <Check size={12} className="text-white stroke-[3]" />}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-base">Existing Member Renewal</h4>
                              <p className="text-xs text-slate-500 mt-1">Renew your existing IEEE membership or add societies.</p>
                            </div>
                          </div>
                        </div>

                        {/* IEEE Member ID Input for Renewals */}
                        {membershipType === "renewal" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="p-5 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2"
                          >
                            <label className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-2">
                              <ShieldCheck size={16} /> Existing 8-Digit IEEE Member Number <span className="text-red-500">*</span>
                            </label>
                            <input
                              required
                              type="text"
                              value={ieeeMemberId}
                              onChange={(e) => setIeeeMemberId(e.target.value)}
                              placeholder="e.g. 98451234"
                              className="w-full rounded-xl bg-white border border-amber-300 px-4 py-3 text-sm text-slate-900 font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                          </motion.div>
                        )}


                        {/* Navigation CTAs */}
                        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-300"
                          >
                            <ArrowLeft size={16} /> Back
                          </button>
                          <button
                            type="submit"
                            className="px-8 py-4 rounded-2xl btn-gradient-ieee font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 group active:scale-95"
                          >
                            <span>Select Society & Skills</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* STEP 3: SOCIETY & SKILLS SELECTION */}
                    {step === 3 && (
                      <motion.form
                        key="step3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        onSubmit={handleSubmit}
                        className="space-y-8"
                      >
                        <div>
                          <span className="text-[#00629b] text-xs font-black uppercase tracking-widest block mb-1">Step 3 of 3</span>
                          <h2 className="text-2xl md:text-3xl font-serif font-black text-slate-900">
                            Chapter Affiliation & Registration
                          </h2>
                          <p className="text-slate-500 text-sm mt-1">Select your technical chapters and competencies to complete your membership registration.</p>
                        </div>

                        {/* Target Society Grid */}
                        <div className="space-y-3">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                            Choose Technical Chapters / Societies (Select all that apply) <span className="text-red-500">*</span>
                          </label>

                          <div className="grid sm:grid-cols-2 gap-3">
                            {societiesList.map((soc) => {
                              const isSelected = selectedSocieties.includes(soc.id);
                              const isMandatory = soc.isMandatory;

                              // Calculate USD price for card display
                              let displayPriceUSD = applicantType === "professional" ? soc.priceProfUSD : soc.priceStudentUSD;
                              if (soc.id === "IEEE Student Branch SREC") {
                                displayPriceUSD = applicantType === "postgraduate" ? 13.5 : applicantType === "professional" ? 90.5 : 7.0;
                              }

                              return (
                                <button
                                  key={soc.id}
                                  type="button"
                                  onClick={() => handleSocietyToggle(soc.id)}
                                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                                    isMandatory
                                      ? "bg-blue-100/90 border-[#003366] shadow-md text-slate-900"
                                      : isSelected
                                      ? "bg-blue-50/80 border-[#00629b] shadow-md text-slate-900"
                                      : "bg-white border-slate-200 hover:border-slate-300 text-slate-600"
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                          isMandatory
                                            ? "bg-[#003366] text-white"
                                            : isSelected
                                            ? "bg-[#003366] text-white"
                                            : "bg-slate-100 text-slate-600"
                                        }`}>
                                          {soc.badge}
                                        </span>
                                        {isMandatory && (
                                          <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 flex items-center gap-1">
                                            <Lock size={9} /> MANDATORY
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-[#003366] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                          ${displayPriceUSD} USD
                                        </span>
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                          isMandatory
                                            ? "bg-[#003366] border-[#003366] text-white"
                                            : isSelected
                                            ? "bg-[#00629b] border-[#00629b] text-white"
                                            : "border-slate-300 bg-white"
                                        }`}>
                                          {isSelected && <Check size={12} className="stroke-[3]" />}
                                        </div>
                                      </div>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                      {soc.name}
                                    </h4>
                                    <p className="text-[11px] text-slate-500 leading-snug mt-1 font-medium">{soc.desc}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Technical & Professional Skills List */}
                        <div className="space-y-3">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                            Technical & Professional Interests (Select all that apply)
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {skillsList.map((skill) => {
                              const isChecked = selectedSkills.includes(skill);
                              return (
                                <button
                                  key={skill}
                                  type="button"
                                  onClick={() => handleSkillToggle(skill)}
                                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                    isChecked
                                      ? "bg-[#003366] border-[#003366] text-white shadow-sm"
                                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                  }`}
                                >
                                  {isChecked && <Check size={12} className="inline mr-1 stroke-[3]" />}
                                  {skill}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Statement of Purpose */}
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                            <span>Statement of Purpose / Objective in joining IEEE SREC</span>
                            <span className="text-[10px] text-slate-400">Optional</span>
                          </label>
                          <textarea
                            rows={3}
                            value={sop}
                            onChange={(e) => setSop(e.target.value)}
                            placeholder="Briefly explain your expectations or technical goals..."
                            className="w-full rounded-xl custom-input-field p-4 text-sm font-medium resize-none"
                          />
                        </div>

                        {/* Code of Ethics Checkbox */}
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded border-slate-300 text-[#00629b] focus:ring-[#00629b]"
                            />
                            <span className="text-xs text-slate-600 leading-relaxed font-medium">
                              I agree to abide by the <strong className="text-slate-900">IEEE Code of Ethics</strong> and understand that my membership details will be registered with IEEE Student Branch SREC.
                            </span>
                          </label>
                        </div>

                        {/* Navigation CTAs */}
                        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 border border-slate-300"
                          >
                            <ArrowLeft size={16} /> Back
                          </button>
                          <button
                            type="submit"
                            disabled={!termsAccepted || isSubmitting}
                            className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl ${
                              termsAccepted && !isSubmitting
                                ? "btn-gradient-ieee active:scale-95 cursor-pointer"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                            }`}
                          >
                            {isSubmitting ? (
                              <>Submitting Registration...</>
                            ) : (
                              <>
                                <ShieldCheck size={18} /> Complete Registration & Generate Receipt
                              </>
                            )}
                          </button>
                        </div>
                      </motion.form>
                    )}

                  </AnimatePresence>

                </div>

              </div>

              {/* RIGHT SIDEBAR: LIVE ROSTER CALCULATOR & HELP BOX (4 COLS) */}
              <div className="lg:col-span-4 space-y-6">

                {/* LIVE ROSTER SUMMARY CARD - PRISTINE WHITE CARD */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-200/60 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-[#00629b] block">Live Roster Calculator</span>
                      <h3 className="text-lg font-serif font-black text-slate-900">Summary Review</h3>
                    </div>
                    <Lock size={16} className="text-[#00629b]" />
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
                      if (applicantType === "postgraduate") return 13.5;
                      if (applicantType === "professional") return 90.5;
                      return 7.0;
                    };
                    const getItemUSD = (socId: string) => {
                      if (socId === "IEEE Student Branch SREC") return getBasePriceUSD();
                      const item = societiesList.find(s => s.id === socId);
                      if (!item) return 0;
                      return applicantType === "professional" ? item.priceProfUSD : item.priceStudentUSD;
                    };
                    const subtotal = selectedSocieties.reduce((sum, id) => sum + getItemUSD(id), 0);
                    const tax = +(subtotal * 0.18).toFixed(2);
                    const grandTotal = +(subtotal + tax).toFixed(2);

                    return (
                      <div className="space-y-3 pt-3 border-t border-slate-200 text-xs font-medium">
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

                            return (
                              <div key={socId} className="flex justify-between items-center text-slate-700 text-[11px]">
                                <span className="truncate max-w-[170px]" title={socId}>• {label}</span>
                                <span className="font-mono font-bold text-slate-900">
                                  ${price.toFixed(2)} USD
                                </span>
                              </div>
                            );
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
                        <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between items-center text-slate-900">
                          <div>
                            <span className="font-extrabold text-sm block leading-none">Total Investment</span>
                            <span className="text-[9.5px] text-slate-500 font-normal">Official IEEE USD Fee</span>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-lg text-[#003366] block leading-none">${grandTotal.toFixed(2)} USD</span>
                            <span className="text-[9.5px] font-mono font-bold text-emerald-700">~ ₹{Math.round(grandTotal * 83).toLocaleString()} INR</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Included Member Perks */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                      Included Member Advantages:
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700 font-medium">
                      <li className="flex items-center gap-2">
                        <Check size={15} className="text-[#00629b] shrink-0 stroke-[3]" />
                        <span>IEEE Xplore discounts (5M+ papers)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={15} className="text-[#00629b] shrink-0 stroke-[3]" />
                        <span>Free entry to SREC technical workshops</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={15} className="text-[#00629b] shrink-0 stroke-[3]" />
                        <span>Official IEEE membership card & ID</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={15} className="text-[#00629b] shrink-0 stroke-[3]" />
                        <span>Eligibility for executive officer board</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* HELPDESK & SUPPORT BOX */}
                <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-lg text-xs text-slate-600 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                    <HelpCircle size={16} className="text-[#00629b]" /> Need Help with Registration?
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

            </div>
          )}

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
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">IEEE Xplore Access</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Access over 5 million peer-reviewed journal papers, conference proceedings, and technical standards to accelerate your academic research.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-[#00629b]/40 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#003366] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Global Networking</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Connect with global researchers, industry leaders, IEEE Fellows, and alumni across 160+ countries for career mentorship and research collaborations.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-[#00629b]/40 hover:bg-white hover:shadow-xl transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-[#003366] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award size={28} />
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
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-6 text-left font-bold text-slate-900 text-base md:text-lg flex items-center justify-between gap-4 hover:text-[#00629b] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={20} className={`text-[#00629b] transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 font-medium"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MembershipRegistrationPage;
