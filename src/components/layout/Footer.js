import { Link } from "react-router-dom";
import ieeeSrecLogo from "@/assets/ieees.png";
import srecLogo from "@/assets/srec-logo.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import { Mail, MapPin, Phone, ChevronRight, Network, Sparkles } from "lucide-react";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
const linkGroups = [
    {
        title: "Explore",
        links: [
            { label: "Home", href: "/" },
            { label: "About Us", href: "/about" },
            { label: "Our Activities", href: "/activities" },
            { label: "Technical Societies", href: "/societies" },
            { label: "Student Member Portal", href: "/student-login" },
            { label: "Membership Registration", href: "/membership-registration" },
            { label: "Photo Gallery", href: "/gallery" },
        ],
    },
    {
        title: "Societies & Wings",
        links: [
            { label: "IEEE CS (Computer Society)", href: "/societies/cs" },
            { label: "IEEE PELS (Power Electronics)", href: "/societies/pels" },
            { label: "IEEE WIE (Women in Engineering)", href: "/societies/wie" },
            { label: "IEEE CIS (Computational Intelligence)", href: "/societies/cis" },
            { label: "IEEE ComSoc (Communications)", href: "/societies/comsoc" },
            { label: "IEEE EMBS (Medicine & Biology)", href: "/societies/embs" },
            { label: "IEEE SREC Student Branch Hub", href: "/societies/srec" },
        ],
    },
    {
        title: "Leadership",
        links: [
            { label: "Meet the Team", href: "/team" },
            { label: "Branch Office Bearers", href: "/office-bearers" },
            { label: "Society Office Bearers", href: "/societies/office-bearers" },
            { label: "Advisory Board", href: "/team#advisory-board" },
            { label: "Leadership Alumni", href: "/past-bearers" },
            { label: "Annual Roadmaps", href: "/annual-plans" },
            { label: "Contact Us", href: "/contact" },
        ],
    },
];
const Footer = () => (<footer className="relative bg-[#000814] text-slate-300 overflow-hidden font-sans border-t border-cyan-500/30">
    {/* Dynamic Background Glows */}
    <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none -translate-y-1/2"/>
    <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none translate-y-1/2"/>

    <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 pt-12 sm:pt-16 pb-8 sm:pb-12">

      {/* ─── INSTITUTIONAL BRANDING HEADER (DARK GLASSMORPHISM) ─── */}
      <div className="p-6 sm:p-8 md:p-10 mb-12 sm:mb-16 rounded-3xl bg-gradient-to-r from-white/[0.05] via-white/[0.08] to-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] relative overflow-hidden">
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent"/>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Institution Logos Badge */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-white/[0.92] backdrop-blur-md px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl border border-white w-full lg:w-auto">
            <Link to="/" className="flex items-center shrink-0 hover:scale-105 transition-transform" title="Sri Ramakrishna Engineering College">
              <img src={srecLogo} alt="SREC Logo" className="h-9 sm:h-12 w-auto object-contain"/>
            </Link>
            <div className="w-[1px] h-7 sm:h-9 bg-slate-300"/>
            <Link to="/" className="flex items-center shrink-0 hover:scale-105 transition-transform" title="IEEE Student Branch SREC">
              <img src={ieeeSrecLogo} alt="IEEE SREC Logo" className="h-9 sm:h-12 w-auto object-contain"/>
            </Link>
            <div className="w-[1px] h-7 sm:h-9 bg-slate-300"/>
            <div className="flex items-center shrink-0 hover:scale-105 transition-transform" title="SNR Sons Charitable Trust">
              <img src={snrLogo} alt="SNR Trust Logo" className="h-9 sm:h-12 w-auto object-contain"/>
            </div>
          </div>

          {/* Section & Branch Credentials */}
          <div className="text-center lg:text-right space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
              <span>IEEE Madras Section (Region 10)</span>
            </div>
            <h2 className="text-white font-serif text-lg sm:text-xl font-bold tracking-tight">
              IEEE Student Branch SREC
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-medium">
              Sri Ramakrishna Engineering College • School Code: 41347756 • Branch Code: 61491
            </p>
          </div>

        </div>
      </div>

      {/* ─── MAIN FOOTER CONTENT GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 mb-12 sm:mb-16">

        {/* Brand & Mission Column */}
        <div className="lg:col-span-4 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">
              <Sparkles size={14} className="text-cyan-400"/>
              <span>About IEEE SREC</span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Established on 11 June 2001, IEEE SREC empowers student engineers through cutting-edge technical projects, global hackathons, research publications, and transformative leadership under IEEE Madras Section.
            </p>
          </div>

          {/* Social Links Bar */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Follow Our Channels</p>
            <div className="flex flex-wrap gap-2.5">
              <a href="https://www.instagram.com/ieee_srec?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-600 hover:to-purple-600 hover:text-white transition-all shadow-md active:scale-95">
                <FaInstagram size={17}/>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95">
                <FaLinkedin size={17}/>
              </a>
              <a href="https://youtube.com/@ieeesrec6081?si=ZkggKQhViaBN_kA3" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-95">
                <FaYoutube size={17}/>
              </a>
              <a href="mailto:ieeestudentbranch@srec.ac.in" aria-label="Official Email" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-cyan-600 hover:text-white transition-all shadow-md active:scale-95">
                <Mail size={17}/>
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Link Groups */}
        <div className="lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
          {linkGroups.map((group) => (<div key={group.title}>
              <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 sm:mb-5 font-heading">
                {group.title}
              </h3>
              <ul className="space-y-2.5 sm:space-y-3 text-xs">
                {group.links.map((link) => (<li key={link.label}>
                    <Link to={link.href} className="group flex items-center text-slate-400 hover:text-cyan-300 transition-colors">
                      <ChevronRight size={12} className="opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400 mr-1 shrink-0"/>
                      <span className="group-hover:translate-x-0.5 transition-transform truncate">{link.label}</span>
                    </Link>
                  </li>))}
              </ul>
            </div>))}
        </div>

        {/* Campus & Direct Contact */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 sm:mb-5 font-heading">
            Campus Desk
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm">
            <li>
              <a href="mailto:ieeestudentbranch@srec.ac.in" className="flex items-start gap-3 text-slate-400 hover:text-cyan-300 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-950/80 group-hover:border-cyan-400/40 text-cyan-400 transition-all">
                  <Mail size={15}/>
                </div>
                <div className="pt-1 text-xs truncate">ieeestudentbranch@srec.ac.in</div>
              </a>
            </li>
            <li>
              <a href="tel:+919080296675" className="flex items-start gap-3 text-slate-400 hover:text-cyan-300 transition-colors group">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-cyan-950/80 group-hover:border-cyan-400/40 text-cyan-400 transition-all">
                  <Phone size={15}/>
                </div>
                <div className="pt-1 text-xs">+91 90802 96675</div>
              </a>
            </li>
            <li className="flex items-start gap-3 text-slate-400">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-cyan-400">
                <MapPin size={15}/>
              </div>
              <div className="pt-1 text-xs leading-relaxed">
                Sri Ramakrishna Engineering College, Vattamalaipalayam, Coimbatore – 641022, Tamil Nadu, India.
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* ─── BOTTOM COPYRIGHT & PORTAL STRIP ─── */}
      <div className="pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] sm:text-xs font-semibold text-slate-400 tracking-wide">
        <p className="flex items-center flex-wrap justify-center gap-1">
          © {new Date().getFullYear()} IEEE Student Branch SREC. All rights reserved.
          <a href="https://surya-ruddy.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-300 transition-colors ml-1 inline-flex items-center gap-1" title="Developer Portfolio">
            <Network size={14} className="text-cyan-400"/>
          </a>
        </p>

        <div className="flex flex-wrap gap-3 sm:gap-4 items-center justify-center uppercase tracking-wider text-[10px] sm:text-[11px]">
          <span className="text-slate-400">School Code: 41347756</span>
          <span className="w-1 h-1 rounded-full bg-slate-700"/>
          <span className="text-slate-400">Branch Code: 61491</span>
          <span className="w-1 h-1 rounded-full bg-slate-700"/>
          <Link to="/student-login" className="hover:text-cyan-300 transition-colors text-cyan-400 font-bold">
            Member Portal
          </Link>
          <span className="w-1 h-1 rounded-full bg-slate-700"/>
          <Link to="/admin-login" className="hover:text-cyan-300 transition-colors text-slate-400 font-bold">
            Admin Portal
          </Link>
        </div>
      </div>

    </div>
  </footer>);
export default Footer;
