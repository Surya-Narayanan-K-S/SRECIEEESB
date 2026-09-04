import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  RotateCcw,
  Fingerprint,
  Sparkles,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Award
} from "lucide-react";

import srecLogo from "@/assets/srec-logo.png";
import ieeeSrecLogo from "@/assets/ieees.png";
import snrLogo from "@/assets/snr-trust-logo.png";

// Tactile Audio Synthesizer for Remote Pad Feedback
class RemoteAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTap() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(560, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  playLaunchTrigger() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Harmonic fanfare chord progression
    [440, 554.37, 659.25, 880, 1108.73].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.06);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.06);
      osc.stop(this.ctx.currentTime + 0.7);
    });
  }

  playCountdownTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(780, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }
}

const remoteAudio = new RemoteAudio();

export const LaunchRemote = () => {
  const [launchState, setLaunchState] = useState("standby"); // "standby" | "countdown" | "launched"
  const [countdown, setCountdown] = useState(5);
  const [totalCountdown, setTotalCountdown] = useState(5);
  const [chiefGuest, setChiefGuest] = useState("Dr. M. Venkateshkumar");
  const [chiefGuestTitle, setChiefGuestTitle] = useState("Chairman, IEEE Power & Energy Society");
  const [lastActionStatus, setLastActionStatus] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState([]);
  const broadcastChannelRef = useRef(null);

  // Trigger tactile haptic vibration on mobile devices
  const triggerHaptic = (pattern = [60]) => {
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore vibration errors
      }
    }
  };

  // Load config & state from Supabase
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
        if (confMap.launch_countdown_seconds) {
          const sec = Number(confMap.launch_countdown_seconds) || 5;
          setCountdown(sec);
          setTotalCountdown(sec);
        }
        if (confMap.launch_chief_guest) {
          setChiefGuest(confMap.launch_chief_guest);
        }
        if (confMap.launch_chief_guest_title) {
          setChiefGuestTitle(confMap.launch_chief_guest_title);
        }
      }
    } catch {
      // Local fallback
    }
  }, []);

  // Broadcast command to Auditorium Screen
  const broadcastCommand = async (action, cd = 5) => {
    triggerHaptic([80, 40, 80]);

    if (action === "countdown" || action === "instant_launch") {
      remoteAudio.playLaunchTrigger();
    } else {
      remoteAudio.playTap();
    }

    // 1. Supabase Realtime broadcast
    try {
      const channel = supabase.channel("launch_control_room");
      channel.subscribe(status => {
        if (status === "SUBSCRIBED") {
          channel.send({
            type: "broadcast",
            event: "launch_event",
            payload: { action, countdown: cd, timestamp: Date.now() },
          });
        }
      });
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
      setTotalCountdown(cd);
    }

    if (action === "countdown") {
      setLastActionStatus("🚀 Stage Ignition Triggered!");
    } else if (action === "reset") {
      setLastActionStatus("🔄 Reset to Standby");
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
    triggerHaptic([120, 50, 120]);
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 300);

    // Create ripple effect
    const newRipple = {
      id: Date.now(),
      x: e?.clientX || window.innerWidth / 2,
      y: e?.clientY || window.innerHeight / 2
    };
    setRipples(prev => [...prev.slice(-3), newRipple]);

    broadcastCommand("countdown", 5);
  };

  // Local countdown tick when countdown is active
  useEffect(() => {
    if (launchState !== "countdown") return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        remoteAudio.playCountdownTick();
        triggerHaptic([40]);
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setLaunchState("launched");
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
          if (cd) {
            setCountdown(cd);
            setTotalCountdown(cd);
          }
        } else if (action === "instant_launch") {
          setLaunchState("launched");
        } else if (action === "reset") {
          setLaunchState("standby");
        }
      };
    }

    let channel;
    try {
      channel = supabase
        .channel("launch_control_room_remote")
        .on("broadcast", { event: "launch_event" }, (payload) => {
          const { action, countdown: cd } = payload.payload || {};
          if (action === "countdown") {
            setLaunchState("countdown");
            if (cd) {
              setCountdown(cd);
              setTotalCountdown(cd);
            }
          } else if (action === "instant_launch") {
            setLaunchState("launched");
          } else if (action === "reset") {
            setLaunchState("standby");
          }
        })
        .subscribe();
    } catch {
      // Offline fallback
    }

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [loadState]);

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white flex flex-col justify-between font-sans select-none overflow-x-hidden relative p-4 sm:p-6 antialiased">
      {/* ========================================================================= */}
      {/* 1. FUTURISTIC AMBIENT GLOW & QUANTUM MATRIX BACKGROUND */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Dynamic State-driven Aurora Orbs */}
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full blur-[120px] transition-all duration-700 ${
            launchState === "countdown"
              ? "bg-gradient-to-b from-red-600/35 via-amber-600/30 to-transparent scale-125 animate-pulse"
              : launchState === "launched"
              ? "bg-gradient-to-b from-emerald-500/35 via-teal-500/25 to-transparent scale-110"
              : "bg-gradient-to-b from-cyan-500/30 via-blue-600/20 to-transparent scale-100"
          }`}
        />
        <div
          className={`absolute -bottom-32 right-1/2 translate-x-1/2 w-[400px] h-[400px] rounded-full blur-[100px] transition-all duration-700 ${
            launchState === "countdown"
              ? "bg-amber-600/25"
              : launchState === "launched"
              ? "bg-emerald-600/20"
              : "bg-blue-600/15"
          }`}
        />

        {/* High-tech radial dot grid matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(#00d2ff_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />

        {/* Subtle holographic diagonal scan lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Ripple Animation Rings */}
      {ripples.map(r => (
        <motion.div
          key={r.id}
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 3.5, opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="fixed pointer-events-none rounded-full border-2 border-cyan-400/80 -translate-x-1/2 -translate-y-1/2 z-30"
          style={{ left: r.x, top: r.y, width: "120px", height: "120px" }}
        />
      ))}

      {/* ========================================================================= */}
      {/* 2. TOP VIP COMMAND HEADER: 3 LOGOS + CHIEF GUEST DOSSIER + STAGE TELEMETRY */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full flex flex-col items-center pt-2 max-w-md mx-auto">
        {/* Three Institutional Logos in Frosted Glass Card */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 bg-white/[0.97] backdrop-blur-xl px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(0,210,255,0.2)] border-2 border-white/90">
          <img
            src={srecLogo}
            alt="SREC Logo"
            className="h-8 sm:h-11 w-auto object-contain"
            title="Sri Ramakrishna Engineering College"
          />
          <div className="w-[1.5px] h-6 sm:h-8 bg-slate-300" />
          <img
            src={ieeeSrecLogo}
            alt="IEEE SREC Logo"
            className="h-8 sm:h-11 w-auto object-contain"
            title="IEEE Student Branch SREC"
          />
          <div className="w-[1.5px] h-6 sm:h-8 bg-slate-300" />
          <img
            src={snrLogo}
            alt="SNR Trust Logo"
            className="h-8 sm:h-11 w-auto object-contain"
            title="SNR Sons Charitable Trust"
          />
        </div>

        {/* Luxury Chief Guest Executive Dossier Card */}
        <div className="mt-3.5 w-full p-4 rounded-3xl bg-gradient-to-b from-[#0a172e]/90 via-[#071124]/90 to-[#040a17]/95 border-2 border-cyan-500/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(0,210,255,0.15)] ring-1 ring-white/10 relative overflow-hidden flex flex-col items-center text-center">
          {/* Top Gold Foil Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

          {/* Badge Label */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm mb-1.5">
            <Award size={12} className="text-amber-400" />
            <span>CHIEF GUEST VIP INAUGURATOR</span>
          </div>

          {/* Chief Guest Name */}
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-amber-200 font-serif drop-shadow-md">
            {chiefGuest || "Dr. M. Venkateshkumar"}
          </h1>

          {/* Chief Guest Title */}
          <p className="text-xs sm:text-sm font-bold text-amber-300/90 tracking-wide uppercase mt-0.5 font-sans">
            {chiefGuestTitle || "Chairman, IEEE Power & Energy Society"}
          </p>

          <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1 pt-1.5 border-t border-white/10 w-full max-w-xs">
            IEEE STUDENT BRANCH SREC • STB32131
          </div>
        </div>

        {/* Live Stage Telemetry Status Pill */}
        <div className="mt-3 flex items-center justify-between w-full px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/15 backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                launchState === "countdown"
                  ? "bg-red-500 animate-ping shadow-[0_0_12px_#ef4444]"
                  : launchState === "launched"
                  ? "bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse"
                  : "bg-cyan-400 shadow-[0_0_12px_#00d2ff] animate-pulse"
              }`}
            />
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
              AUDITORIUM STAGE:{" "}
              <span
                className={
                  launchState === "countdown"
                    ? "text-red-400 font-black"
                    : launchState === "launched"
                    ? "text-emerald-400 font-black"
                    : "text-cyan-300 font-black"
                }
              >
                {launchState === "countdown"
                  ? `COUNTDOWN T-${countdown}s`
                  : launchState === "launched"
                  ? "INAUGURATED"
                  : "STANDBY READY"}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
            <Radio size={12} className={launchState === "countdown" ? "text-red-400 animate-bounce" : "text-cyan-400"} />
            <span>LIVE SYNC</span>
          </div>
        </div>

        {/* Action status notification toast */}
        <AnimatePresence>
          {lastActionStatus && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="mt-2 text-center text-xs font-black text-cyan-300 bg-cyan-500/20 py-1.5 px-5 rounded-xl border border-cyan-400/50 backdrop-blur-xl shadow-lg w-full"
            >
              {lastActionStatus}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ========================================================================= */}
      {/* 3. CENTER HERO: THE MAJESTIC BIOMETRIC QUANTUM CORE LAUNCH PAD */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 w-full max-w-sm mx-auto my-auto">
        <div className="relative flex flex-col items-center justify-center">
          {/* Multi-layered Pulsing Orbital Aura */}
          <div
            className={`absolute -inset-12 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
              launchState === "countdown"
                ? "bg-red-500/45 scale-125 animate-pulse"
                : launchState === "launched"
                ? "bg-emerald-500/40 scale-110"
                : "bg-cyan-500/35 scale-105 animate-pulse"
            }`}
          />

          {/* SVG Rotating Holographic Compass & Orbital Energy Rings */}
          <svg
            className={`absolute w-80 h-80 sm:w-96 sm:h-96 pointer-events-none transition-all duration-700 ${
              launchState === "countdown"
                ? "animate-spin-slow text-amber-400 opacity-60"
                : launchState === "launched"
                ? "text-emerald-400 opacity-50"
                : "animate-spin-slow text-cyan-400 opacity-40"
            }`}
            viewBox="0 0 240 240"
          >
            {/* Outer segmented ring */}
            <circle cx="120" cy="120" r="114" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="12 16" />
            <circle cx="120" cy="120" r="102" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 8" opacity="0.6" />
            <circle cx="120" cy="120" r="90" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="32 48" />
          </svg>

          {/* Inner Counter-Rotating Orbit */}
          <svg
            className="absolute w-72 h-72 sm:w-80 sm:h-80 pointer-events-none text-white/20 animate-spin-reverse"
            viewBox="0 0 200 200"
          >
            <circle cx="100" cy="100" r="88" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="18 24" />
          </svg>

          {/* ========================================================================= */}
          {/* THE CAPACITIVE ACTIVATOR DISC */}
          {/* ========================================================================= */}
          <motion.button
            whileTap={{ scale: 0.91 }}
            whileHover={{ scale: 1.03 }}
            onClick={handleLaunchClick}
            className={`relative z-10 w-64 h-64 sm:w-72 sm:h-72 rounded-full p-[6px] transition-all duration-300 cursor-pointer flex items-center justify-center select-none ${
              launchState === "countdown"
                ? "bg-gradient-to-tr from-red-500 via-amber-500 to-orange-400 shadow-[0_0_80px_rgba(239,68,68,0.8),0_0_40px_rgba(245,158,11,0.6)] animate-pulse"
                : launchState === "launched"
                ? "bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 shadow-[0_0_70px_rgba(16,185,129,0.7)]"
                : "bg-gradient-to-tr from-cyan-400 via-blue-500 to-amber-400 shadow-[0_0_70px_rgba(0,210,255,0.6),0_0_35px_rgba(245,158,11,0.4)] hover:shadow-[0_0_90px_rgba(0,210,255,0.9)]"
            }`}
          >
            {/* Outer Ring Inset */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#061226] via-[#030a17] to-[#02050d] border-2 border-white/30 flex flex-col items-center justify-center p-4 relative overflow-hidden group shadow-inner">
              {/* Radial Sweep Holographic Flare */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(0,210,255,0.3),transparent_70%)] group-hover:opacity-100 transition-opacity" />

              {/* Dynamic State Display inside Core Pad */}
              <AnimatePresence mode="wait">
                {launchState === "countdown" ? (
                  <motion.div
                    key="countdown-core"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="relative z-10 flex flex-col items-center justify-center"
                  >
                    <span className="text-[11px] font-black uppercase tracking-[0.25em] text-red-400 mb-1 animate-pulse">
                      IGNITING IN
                    </span>
                    <span className="text-6xl sm:text-7xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-red-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.9)]">
                      {countdown}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 mt-1">
                      SECONDS
                    </span>
                  </motion.div>
                ) : launchState === "launched" ? (
                  <motion.div
                    key="launched-core"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="relative z-10 flex flex-col items-center justify-center text-center px-2"
                  >
                    <CheckCircle2 size={56} className="text-emerald-400 drop-shadow-[0_0_25px_#10b981] mb-2 animate-bounce" />
                    <span className="text-xl sm:text-2xl font-black font-serif text-white uppercase tracking-wider drop-shadow">
                      INAUGURATED
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mt-1">
                      STAGE BROADCAST ACTIVE
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="standby-core"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="relative z-10 flex flex-col items-center justify-center"
                  >
                    {/* Glowing Biometric Sensor Icon */}
                    <div className="relative mb-2">
                      <Fingerprint
                        size={84}
                        className="text-cyan-300 drop-shadow-[0_0_30px_#00d2ff] group-hover:scale-110 group-hover:text-amber-300 transition-all duration-300"
                      />
                      <Sparkles
                        size={20}
                        className="absolute -top-1 -right-1 text-amber-400 animate-pulse"
                      />
                    </div>

                    {/* Button Bold Action Title */}
                    <span className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-200 font-serif drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                      LAUNCH
                    </span>

                    {/* Subtitle */}
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-cyan-300/90 mt-1 drop-shadow">
                      TAP TO INAUGURATE
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          {/* Instructional subtitle below button */}
          <div className="mt-7 flex flex-col items-center text-center max-w-xs">
            <p className="text-xs text-slate-300 font-medium leading-relaxed drop-shadow">
              {launchState === "countdown"
                ? "Synchronized ignition video & countdown running on auditorium screen..."
                : launchState === "launched"
                ? "Digital platform successfully dedicated and launched to the world!"
                : "Chief Guest touch activator — Tap once to ignite the auditorium launch sequence"}
            </p>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 4. BOTTOM DOCK: STANDBY RESET BUTTON & SYSTEM TELEMETRY */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full max-w-md mx-auto flex flex-col items-center gap-3 pb-2 pt-2">
        {/* Reset to Standby Button */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => broadcastCommand("reset")}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-[#0a172e]/90 to-slate-900/90 hover:from-slate-800 hover:to-slate-800 active:bg-slate-700 border border-white/20 text-slate-200 hover:text-white text-xs sm:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.6)] backdrop-blur-2xl ring-1 ring-white/10"
        >
          <RotateCcw size={16} className="text-cyan-400" />
          <span>RESET STAGE TO STANDBY</span>
        </motion.button>

        {/* Security & Branch Endmark */}
        <div className="flex items-center justify-between w-full px-2 text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>ENCRYPTED TELEMETRY ACTIVE</span>
          </div>
          <span>IEEE SREC • 2026–2027</span>
        </div>
      </footer>
    </div>
  );
};

export default LaunchRemote;
