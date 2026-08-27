import React, { useState, useEffect, useRef } from "react";
import { ShieldAlert, Lock, KeyRound, Eye, EyeOff, AlertTriangle, CheckCircle2, X, ArrowLeft } from "lucide-react";
import ieeeLogo from "@/assets/ieees.png";

// Authorized IEEE SREC Administrator Passwords for Developer Tools Inspection
const AUTHORIZED_ADMIN_PASSWORDS = [
  "One@Two@Three@Four@Five@Six@Seven@Eight@Nine@Ten",
  "ieeesrec2026",
  "srecieeeadmin",
  "STB64071",
  "STB32131",
  "ieee@srec.ac.in",
  "admin@srecieee",
];

const UNLOCK_STORAGE_KEY = "ieee_security_devtools_unlocked";

export const InspectionSecurityGuard = ({ children }) => {
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return sessionStorage.getItem(UNLOCK_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isUnlocked) {
      document.body.classList.remove("devtools-security-locked");
      return;
    }

    // Keyboard inspection shortcut blocker
    const handleKeyDown = (e) => {
      // F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        e.stopPropagation();
        setShowAdminModal(true);
        return false;
      }

      // Ctrl+Shift+I / Cmd+Opt+I (Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "I" || e.key === "i")) {
        e.preventDefault();
        e.stopPropagation();
        setShowAdminModal(true);
        return false;
      }

      // Ctrl+Shift+J / Cmd+Opt+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "J" || e.key === "j")) {
        e.preventDefault();
        e.stopPropagation();
        setShowAdminModal(true);
        return false;
      }

      // Ctrl+Shift+C / Cmd+Opt+C (Inspect Element selector)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "C" || e.key === "c")) {
        e.preventDefault();
        e.stopPropagation();
        setShowAdminModal(true);
        return false;
      }

      // Ctrl+U / Cmd+Opt+U (View Page Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === "U" || e.key === "u")) {
        e.preventDefault();
        e.stopPropagation();
        setShowAdminModal(true);
        return false;
      }
    };

    // Right Click (Context Menu / Inspect) Interception
    const handleContextMenu = (e) => {
      if (!isUnlocked) {
        e.preventDefault();
        setShowAdminModal(true);
        return false;
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("contextmenu", handleContextMenu, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("contextmenu", handleContextMenu, true);
    };
  }, [isUnlocked]);

  // Apply or remove cloaking class on body only when modal is active
  useEffect(() => {
    if (showAdminModal && !isUnlocked) {
      document.body.classList.add("devtools-security-locked");
    } else {
      document.body.classList.remove("devtools-security-locked");
    }
  }, [showAdminModal, isUnlocked]);

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanInput = password.trim();
    const isMatch = AUTHORIZED_ADMIN_PASSWORDS.some(
      (p) => p.toLowerCase() === cleanInput.toLowerCase()
    );

    if (isMatch) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsUnlocked(true);
        setShowAdminModal(false);
        try {
          sessionStorage.setItem(UNLOCK_STORAGE_KEY, "true");
        } catch {
          // ignore
        }
      }, 600);
    } else {
      setIsShaking(true);
      setErrorMsg("Invalid Administrator Password. Access Denied.");
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  const handleDismissModal = () => {
    setShowAdminModal(false);
    setPassword("");
    setErrorMsg("");
  };

  return (
    <>
      {/* Normal Website Content */}
      <div className={showAdminModal && !isUnlocked ? "filter blur-2xl opacity-20 pointer-events-none transition-all duration-300 select-none" : ""}>
        {children}
      </div>

      {/* Admin Password Prompt - ONLY SHOWS WHEN INSPECT OR SHORTCUT IS CLICKED */}
      {showAdminModal && !isUnlocked && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Ambient Cyber Lighting */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div
            className={`relative w-full max-w-md bg-gradient-to-b from-slate-900/95 via-slate-900/98 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(0,181,226,0.2)] backdrop-blur-3xl text-center space-y-6 transition-all ${
              isShaking ? "animate-shake" : ""
            }`}
          >
            {/* Top Close Button */}
            <button
              onClick={handleDismissModal}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Close and return to website"
            >
              <X size={16} />
            </button>

            {/* Header Shield & Brand */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#002855] via-[#00629B] to-cyan-400 p-0.5 shadow-lg shadow-cyan-500/25 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-2">
                    <img
                      src={ieeeLogo}
                      alt="IEEE SREC"
                      className="w-full h-full object-contain filter drop-shadow"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                  <Lock size={12} className="stroke-[3]" />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-extrabold tracking-widest uppercase mb-2">
                  <AlertTriangle size={12} /> Inspection Restricted
                </span>
                <h2 className="text-xl sm:text-2xl font-serif font-black text-white tracking-tight">
                  Admin Authorization Required
                </h2>
                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">
                  Source code inspection and media assets are protected under IEEE SREC Intellectual Property policy.
                </p>
              </div>
            </div>

            {/* Password Form */}
            <form onSubmit={handleUnlockSubmit} className="space-y-4 text-left">
              <div className="space-y-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <KeyRound size={13} className="text-cyan-400" />
                  <span>Branch Administrator Password</span>
                </label>
                <div className="relative">
                  <input
                    ref={inputRef}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMsg("");
                    }}
                    placeholder="Enter admin password..."
                    autoFocus
                    required
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-950/80 border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-2">
                  <ShieldAlert size={15} className="shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                  <span>Credentials Verified! Unlocking inspection mode...</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!password || isSuccess}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00629B] via-cyan-500 to-teal-400 hover:from-[#005080] hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Lock size={14} />
                <span>Authorize &amp; Unlock DevTools</span>
              </button>
            </form>

            {/* Back to website button */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <button
                onClick={handleDismissModal}
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <ArrowLeft size={13} />
                <span>Return to Website</span>
              </button>
              <span className="font-mono text-[10px] text-slate-500">IEEE SB SREC • STB64071</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
