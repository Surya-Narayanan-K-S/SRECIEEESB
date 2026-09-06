import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  RotateCcw,
  Fingerprint,
  Radio,
  Tv,
  Zap,
  Award,
  CheckCircle2,
  ExternalLink,
  Layers
} from "lucide-react";

import srecLogo from "@/assets/srec-logo.png";
import ieeeSrecLogo from "@/assets/ieees.png";
import snrLogo from "@/assets/snr-trust-logo.png";

// Technical Society & Affinity Group Logos
import csLogo from "@/assets/societies/CS.png";
import cisLogo from "@/assets/societies/CIS.webp";
import comsocLogo from "@/assets/societies/ComSoc.jpg";
import embsLogo from "@/assets/societies/EMBS.jpg";
import pelsLogo from "@/assets/societies/pels.png";
import casLogo from "@/assets/societies/css.svg";
import imLogo from "@/assets/societies/IM.jpg";
import wieLogo from "@/assets/societies/WIE.jpg";

const SOCIETY_CHAPTERS = [
  { name: "Computer Society", code: "CS", logo: csLogo },
  { name: "Computational Intelligence", code: "CIS", logo: cisLogo },
  { name: "Communications Society", code: "ComSoc", logo: comsocLogo },
  { name: "Engineering in Medicine & Biology", code: "EMBS", logo: embsLogo },
  { name: "Power Electronics", code: "PELS", logo: pelsLogo },
  { name: "Circuits & Systems", code: "CAS", logo: casLogo },
  { name: "Instrumentation & Measurement", code: "IMS", logo: imLogo },
  { name: "Women in Engineering", code: "WIE", logo: wieLogo },
];

export const LaunchRemote = () => {
  const [launchState, setLaunchState] = useState("standby"); // "standby" | "countdown" | "launched"
  const [countdown, setCountdown] = useState(5);
  const fixedDuration = 5; // Fixed 5-second inauguration countdown
  const [chiefGuest, setChiefGuest] = useState("Dr. M. Venkateshkumar");
  const [chiefGuestTitle, setChiefGuestTitle] = useState("Chairman, IEEE Power and Electronics Society");
  const [lastActionStatus, setLastActionStatus] = useState("");
  const [ripples, setRipples] = useState([]);
  const broadcastChannelRef = useRef(null);
  const realtimeChannelRef = useRef(null);

  // Tactile haptic vibration for mobile devices (Silent)
  const triggerHaptic = (pattern = [60]) => {
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore
      }
    }
  };

  // Load configuration & state from Supabase
  const loadState = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("page_content")
        .select("*")
        .eq("page_key", "launch_config");

      if (data && data.length > 0) {
        const confMap = {};
        data.forEach(item => {
          confMap[item.content_key] = item.content_text;
        });

        if (confMap.launch_state) {
          setLaunchState(confMap.launch_state);
        }
        if (confMap.launch_chief_guest) {
          setChiefGuest(confMap.launch_chief_guest);
        }
        if (confMap.launch_chief_guest_title) {
          setChiefGuestTitle(confMap.launch_chief_guest_title);
        }
      }
    } catch {
      // Offline fallback
    }
  }, []);

  // Broadcast command to Auditorium Stage Display
  const broadcastCommand = async (action, cd = fixedDuration) => {
    triggerHaptic([80, 40, 80]);

    // 1. Supabase Realtime broadcast via persistent channel
    try {
      if (realtimeChannelRef.current) {
        realtimeChannelRef.current.send({
          type: "broadcast",
          event: "launch_event",
          payload: { action, countdown: cd, timestamp: Date.now() },
        });
      }
    } catch {
      // Ignore broadcast errors
    }

    // 2. BroadcastChannel for instant local browser multi-window sync
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ action, countdown: cd, timestamp: Date.now() });
    }

    // 3. Persist state in Supabase DB
    const stateValue = action === "countdown" ? "countdown" : action === "instant_launch" ? "launched" : "standby";
    setLaunchState(stateValue);
    if (action === "countdown") {
      setCountdown(cd);
    }

    if (action === "countdown") {
      setLastActionStatus("🚀 5-Second Auditorium Countdown Triggered!");
    } else if (action === "instant_launch") {
      setLastActionStatus("✨ Inaugurated Instantly!");
    } else if (action === "reset") {
      setLastActionStatus("🔄 Stage Reset to Standby");
    }

    try {
      await supabase.from("page_content").upsert({
        page_key: "launch_config",
        content_key: "launch_state",
        content_text: stateValue,
      }, { onConflict: "page_key,content_key" });

      if (action === "countdown") {
        await supabase.from("page_content").upsert({
          page_key: "launch_config",
          content_key: "launch_countdown_seconds",
          content_text: String(cd),
        }, { onConflict: "page_key,content_key" });
      }
    } catch {
      // Local sync
    }

    setTimeout(() => setLastActionStatus(""), 3500);
  };

  const handleLaunchClick = (e) => {
    if (launchState === "launched") {
      return;
    }

    triggerHaptic([120, 50, 120]);

    const newRipple = {
      id: Date.now(),
      x: e?.clientX || window.innerWidth / 2,
      y: e?.clientY || window.innerHeight / 2
    };
    setRipples(prev => [...prev.slice(-2), newRipple]);

    broadcastCommand("countdown", fixedDuration);
  };

  // Local countdown tick (Silent)
  useEffect(() => {
    if (launchState !== "countdown") return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        triggerHaptic([40]);
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setLaunchState("launched");
      try {
        supabase.from("page_content").upsert([
          { page_key: "launch_config", content_key: "launch_active", content_text: "false" },
          { page_key: "launch_config", content_key: "launch_state", content_text: "launched" }
        ], { onConflict: "page_key,content_key" }).then(() => { });
        localStorage.setItem("ieee_launch_mode_active", "false");
      } catch {
        // Ignore
      }
    }
  }, [launchState, countdown]);

  useEffect(() => {
    loadState();

    if (typeof BroadcastChannel !== "undefined") {
      broadcastChannelRef.current = new BroadcastChannel("ieee_launch_channel");
      broadcastChannelRef.current.onmessage = (e) => {
        const { action, countdown: cd } = e.data || {};
        if (action === "countdown") {
          setLaunchState("countdown");
          if (cd) setCountdown(cd);
        } else if (action === "instant_launch") {
          setLaunchState("launched");
        } else if (action === "reset") {
          setLaunchState("standby");
        }
      };
    }

    try {
      const ch = supabase
        .channel("launch_control_room")
        .on("broadcast", { event: "launch_event" }, (payload) => {
          const { action, countdown: cd } = payload.payload || {};
          if (action === "countdown") {
            setLaunchState("countdown");
            if (cd) setCountdown(cd);
          } else if (action === "instant_launch") {
            setLaunchState("launched");
          } else if (action === "reset") {
            setLaunchState("standby");
          }
        })
        .subscribe();

      realtimeChannelRef.current = ch;
    } catch {
      // Offline fallback
    }

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current);
      }
    };
  }, [loadState]);

  return (
    <div className="min-h-screen w-full bg-[#050a14] text-white flex flex-col justify-between font-sans select-none overflow-x-hidden relative p-3 sm:p-5 md:p-6 antialiased">
      {/* ── AMBIENT BACKGROUND LIGHTING ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-[140px] transition-all duration-700 ${
            launchState === "countdown"
              ? "bg-amber-600/30 scale-125"
              : launchState === "launched"
                ? "bg-emerald-600/25 scale-110"
                : "bg-[#0066cc]/25 scale-100"
          }`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#0066cc_1px,transparent_1px)] [background-size:32px_32px] opacity-10" />
      </div>

      {/* ── TOP BAR: LARGER LOGOS (SREC, IEEE SREC, SNR TRUST) & STATUS ── */}
      <header className="relative z-10 w-full max-w-lg mx-auto flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-3 px-4 shadow-xl">
        {/* Institutional Logos (Enlarged + SNR Trust) */}
        <div className="flex items-center gap-3 sm:gap-4 bg-white/95 px-3.5 sm:px-4 py-2 rounded-xl shadow-inner border border-white">
          <img src={srecLogo} alt="SREC" className="h-8 sm:h-9 w-auto object-contain" />
          <div className="w-[1.5px] h-6 bg-slate-300" />
          <img src={ieeeSrecLogo} alt="IEEE SREC" className="h-8 sm:h-9 w-auto object-contain" />
          <div className="w-[1.5px] h-6 bg-slate-300" />
          <img src={snrLogo} alt="SNR Trust" className="h-8 sm:h-9 w-auto object-contain" />
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 border border-white/10 text-xs font-mono font-bold">
            <Radio
              size={14}
              className={`animate-pulse ${
                launchState === "countdown"
                  ? "text-amber-400"
                  : launchState === "launched"
                    ? "text-emerald-400"
                    : "text-cyan-400"
              }`}
            />
            <span className="uppercase text-[11px] tracking-wider text-slate-300 font-sans font-bold">
              {launchState === "countdown" ? "ARMED" : launchState === "launched" ? "LIVE" : "SYNCED"}
            </span>
          </div>
        </div>
      </header>

      {/* ── CENTER LAUNCH PAD / MASTER TRIGGER ── */}
      <main className="relative z-10 w-full max-w-lg mx-auto my-auto flex flex-col items-center justify-center py-5 px-2">
        {/* Chief Guest Recognition Banner */}
        <div className="text-center mb-5 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
            <Award size={13} className="text-amber-400" />
            <span>Grand Inauguration Ceremony</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-heading">
            {chiefGuest}
          </h2>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto line-clamp-1">
            {chiefGuestTitle}
          </p>
        </div>

        {/* Biometric Interactive Launch Trigger Button */}
        <div className="relative flex items-center justify-center my-3">
          {/* Animated Glowing Wave Rings */}
          <div
            className={`absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border-2 transition-all duration-1000 ${
              launchState === "countdown"
                ? "border-amber-400/50 animate-ping"
                : launchState === "launched"
                  ? "border-emerald-400/40 animate-pulse"
                  : "border-cyan-400/30 animate-spin-slow"
            }`}
          />
          <div
            className={`absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full border transition-all duration-700 ${
              launchState === "countdown"
                ? "border-amber-400/30"
                : launchState === "launched"
                  ? "border-emerald-400/30"
                  : "border-blue-500/20"
            }`}
          />

          {/* Touch Ripples */}
          {ripples.map((rip) => (
            <motion.div
              key={rip.id}
              initial={{ scale: 0.8, opacity: 0.9 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute w-52 h-52 rounded-full bg-cyan-400/20 pointer-events-none"
            />
          ))}

          {/* Main Push Button */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleLaunchClick}
            disabled={launchState === "launched"}
            className={`relative w-52 h-52 sm:w-60 sm:h-60 rounded-full flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-500 shadow-2xl border-4 ${
              launchState === "countdown"
                ? "bg-gradient-to-b from-amber-500 to-orange-600 border-amber-300 shadow-[0_0_60px_rgba(245,158,11,0.6)] text-slate-950"
                : launchState === "launched"
                  ? "bg-gradient-to-b from-emerald-600 to-teal-800 border-emerald-300 shadow-[0_0_60px_rgba(16,185,129,0.5)] text-white cursor-default"
                  : "bg-gradient-to-b from-cyan-500 via-blue-600 to-[#002b66] border-cyan-300 shadow-[0_0_60px_rgba(0,210,255,0.45)] text-white hover:shadow-[0_0_80px_rgba(0,210,255,0.7)]"
            }`}
          >
            {launchState === "countdown" ? (
              <motion.div
                key="countdown-mode"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center"
              >
                <span className="text-6xl sm:text-7xl font-black font-mono leading-none tracking-tighter text-slate-950 drop-shadow-md">
                  {countdown}
                </span>
                <span className="text-xs font-black uppercase tracking-widest mt-2 text-slate-900">
                  Launching...
                </span>
              </motion.div>
            ) : launchState === "launched" ? (
              <motion.div
                key="launched-mode"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center"
              >
                <CheckCircle2 size={54} className="text-white mb-2 animate-bounce" />
                <span className="text-lg font-black uppercase tracking-wider">Inaugurated</span>
                <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-widest mt-0.5">
                  Platform Live
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="standby-mode"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-white/15 border border-white/30 flex items-center justify-center mb-1.5 shadow-inner">
                  <Fingerprint size={32} className="text-white animate-pulse" />
                </div>
                <span className="text-lg sm:text-xl font-black uppercase tracking-wider font-heading leading-tight">
                  TOUCH TO<br />INAUGURATE
                </span>
                <span className="text-[10px] font-bold text-cyan-200 uppercase tracking-widest mt-1">
                  Tap to Start 5s Countdown
                </span>
              </motion.div>
            )}
          </motion.button>
        </div>

        {/* Live Feedback Notification Toast */}
        <AnimatePresence>
          {lastActionStatus && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-3 px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <Zap size={14} className="text-cyan-400" />
              <span>{lastActionStatus}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── BOTTOM DOCK: TECHNICAL SOCIETIES & RESET CONTROL ── */}
      <footer className="relative z-10 w-full max-w-lg mx-auto bg-slate-900/85 backdrop-blur-xl border border-white/10 rounded-2xl p-3.5 sm:p-4 shadow-2xl space-y-3">
        {/* Technical Chapters & Affinity Groups Logo Showcase (Logos Only) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Layers size={12} className="text-cyan-400" />
              <span>IEEE TECHNICAL CHAPTERS &amp; AFFINITY GROUPS</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-cyan-400">8 CHAPTERS</span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2.5 rounded-2xl bg-slate-950/70 border border-white/10 shadow-inner">
            {SOCIETY_CHAPTERS.map((soc) => (
              <div
                key={soc.code}
                className="group flex items-center justify-center p-2 rounded-xl bg-white/95 hover:bg-white transition-all duration-300 shadow-md hover:shadow-cyan-500/20 hover:scale-105 h-11 sm:h-12 border border-white"
                title={soc.name}
              >
                <img
                  src={soc.logo}
                  alt={soc.name}
                  className="h-7 sm:h-8 w-full object-contain transition-transform group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => broadcastCommand("reset")}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-white/15 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all active:scale-98 shadow-sm"
        >
          <RotateCcw size={14} className="text-slate-300" />
          <span>Reset Stage to Standby</span>
        </button>

        {/* Open Stage Preview Link */}
        <div className="text-center pt-0.5">
          <a
            href="/stage"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider transition-colors"
          >
            <Tv size={12} />
            <span>Open Auditorium Projector Display</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default LaunchRemote;
