import { Link } from "react-router-dom";
import ieeeLogo from "@/assets/ieee-logo.png";
import srecLogo from "@/assets/srec-logo.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import { Mail, MapPin, Phone, ChevronRight, Network } from "lucide-react";
import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const linkGroups = [
  {
    title: "Explore",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Our Activities", href: "/activities" },
      { label: "Societies", href: "/societies" },
      { label: "Student Member Portal", href: "/student-login" },
      { label: "Membership Registration", href: "/membership-registration" },
      { label: "Gallery", href: "/gallery" },
    ]
  },
  {
    title: "People",
    links: [
      { label: "Meet the Team", href: "/team" },
      { label: "Office Bearers", href: "/team#office-bearers" },
      { label: "Advisory Board", href: "/team#advisory-board" },
      { label: "Leadership Alumni", href: "/past-bearers" },
      { label: "Contact Us", href: "/contact" },
    ]
  }
];

const Footer = () => (
  <footer className="relative bg-[#000d20] text-slate-300 overflow-hidden font-sans border-t-[4px] border-cyan-500">
    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />
    <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none translate-y-1/2" />

    <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-8 md:px-10 pt-12 sm:pt-16 pb-8 sm:pb-10">
      {/* Institutional Logos Header Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 p-4 sm:p-6 mb-10 sm:mb-12 rounded-2xl sm:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
         <div className="flex items-center justify-center gap-3 sm:gap-6 bg-white px-4 sm:px-7 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg border border-white w-full sm:w-auto">
            <img src={srecLogo} alt="SREC Logo" className="h-8 sm:h-11 w-auto object-contain" />
            <div className="w-[1px] h-6 sm:h-8 bg-slate-300" />
            <img src={ieeeLogo} alt="IEEE Logo" className="h-8 sm:h-11 w-auto object-contain" />
            <div className="w-[1px] h-6 sm:h-8 bg-slate-300" />
            <img src={snrLogo} alt="SNR Trust Logo" className="h-8 sm:h-11 w-auto object-contain" />
         </div>
         <div className="text-center sm:text-right">
            <span className="text-cyan-400 font-black text-xs sm:text-sm uppercase tracking-wider block">IEEE Student Branch SREC</span>
            <span className="text-slate-400 text-[11px] sm:text-xs font-semibold">Sri Ramakrishna Engineering College</span>
         </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 mb-12 sm:mb-16">
        
        {/* About Section */}
        <div className="lg:col-span-4">
          <h3 className="text-white text-base sm:text-lg font-bold mb-4 sm:mb-6 flex items-center gap-2 font-heading">
            <span className="w-6 h-1 bg-cyan-400 rounded-full inline-block"></span>
            Our Mission
          </h3>
          <p className="text-slate-400 leading-relaxed mb-6 sm:mb-8 pr-0 lg:pr-4 text-xs sm:text-sm md:text-base">
            Functioning since 2001 under the IEEE Madras Section, we empower students through technological innovation, collaborative leadership, and global professional networking.
          </p>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/ieee_srec?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:bg-pink-600 hover:text-white transition-all shadow-md active:scale-95">
              <FaInstagram size={17} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-all shadow-md active:scale-95">
              <FaLinkedin size={17} />
            </a>
            <a href="https://youtube.com/@ieeesrec6081?si=ZkggKQhViaBN_kA3" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-slate-300 hover:bg-red-600 hover:text-white transition-all shadow-md active:scale-95">
              <FaYoutube size={17} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-6 sm:gap-8">
          {linkGroups.map((group) => (
             <div key={group.title}>
               <h3 className="text-white text-base sm:text-lg font-bold mb-4 sm:mb-6 font-heading">{group.title}</h3>
               <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                 {group.links.map((link) => (
                   <li key={link.label}>
                     <Link to={link.href} className="group flex items-center text-slate-400 hover:text-cyan-300 transition-colors">
                       <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-cyan-400 mr-1 shrink-0" />
                       <span className="group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                     </Link>
                   </li>
                 ))}
               </ul>
             </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="lg:col-span-4">
          <h3 className="text-white text-base sm:text-lg font-bold mb-4 sm:mb-6 font-heading">Connect With Us</h3>
          <ul className="space-y-4 sm:space-y-5 text-xs sm:text-sm">
            <li>
              <a href="mailto:ieeestudentbranch@srec.ac.in" className="flex items-start gap-3.5 text-slate-400 hover:text-cyan-300 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 group-hover:bg-cyan-950 border border-transparent group-hover:border-cyan-500/30 transition-all text-cyan-400">
                  <Mail size={17} />
                </div>
                <div className="pt-2 truncate">ieeestudentbranch@srec.ac.in</div>
              </a>
            </li>
            <li>
              <a href="tel:+919080296675" className="flex items-start gap-3.5 text-slate-400 hover:text-cyan-300 transition-colors group">
                <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 group-hover:bg-cyan-950 border border-transparent group-hover:border-cyan-500/30 transition-all text-cyan-400">
                  <Phone size={17} />
                </div>
                <div className="pt-2">+91 9080296675</div>
              </a>
            </li>
            <li className="flex items-start gap-3.5 text-slate-400 group">
              <div className="w-9 h-9 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 border border-transparent transition-all text-cyan-400">
                <MapPin size={17} />
              </div>
              <div className="pt-1.5 leading-relaxed">
                Vattamalaipalayam, N.G.G.O Colony P.O, <br />Coimbatore – 641022
              </div>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="pt-6 sm:pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs font-medium text-slate-400 tracking-wide uppercase">
        <p className="flex items-center flex-wrap justify-center gap-1">
          © {new Date().getFullYear()} IEEE Student Branch SREC. All rights reserved.
          <a href="https://surya-ruddy.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-300 transition-colors ml-1 inline-flex items-center gap-1" aria-label="Surya Ruddy Portfolio" title="Developer Portfolio">
            <Network size={14} className="text-cyan-400" />
          </a>
        </p>
        <div className="flex flex-wrap gap-2.5 sm:gap-4 items-center justify-center">
          <span>School Code: 41347756</span>
          <span className="w-1 h-1 rounded-full bg-slate-600 inline-block"></span>
          <span>Branch Code: 61491</span>
          <span className="w-1 h-1 rounded-full bg-slate-600 inline-block"></span>
          <Link to="/student-login" className="hover:text-cyan-300 transition-colors text-cyan-400 font-bold">Member Portal</Link>
          <span className="w-1 h-1 rounded-full bg-slate-600 inline-block"></span>
          <Link to="/admin-login" className="hover:text-cyan-300 transition-colors text-slate-300 font-bold">Admin Portal</Link>
        </div>
      </div>

    </div>
  </footer>
);

export default Footer;