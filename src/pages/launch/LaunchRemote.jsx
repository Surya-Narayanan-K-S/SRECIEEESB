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
  Award,
  Volume2,
  VolumeX,
  Tv,
  Zap,
  Clock,
  ExternalLink
} from "lucide-react";

import srecLogo from "@/assets/srec-logo.png";
import ieeeSrecLogo from "@/assets/ieees.png";
import snrLogo from "@/assets/snr-trust-logo.png";

// Professional Tactile Audio Synthesizer (Web Audio API)
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
    osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playLaunchTrigger() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Harmonious chord fanfare
    [440, 554.37, 659.25, 880].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(this.ctx.currentTime + i * 0.05);
      osc.stop(this.ctx.currentTime + 0.6);
    });
  }

  playCountdownTick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(750, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }
}

const remoteAudio = new RemoteAudio();

export const LaunchRemote = () => {
  const [launchState, setLaunchState] = useState("standby"); // "standby" | "countdown" | "launched"
  const [countdown, setCountdown] = useState(5);
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [chiefGuest, setChiefGuest] = useState("Dr. M. Venkateshkumar");
  const [chiefGuestTitle, setChiefGuestTitle] = useState("Chairman, IEEE Power & Energy Society");
  const [lastActionStatus, setLastActionStatus] = useState("");
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [ripples, setRipples] = useState([]);
  const broadcastChannelRef = useRef(null);

  // Toggle audio
  const toggleAudio = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    remoteAudio.enabled = !nextState;
  };

  // Tactile haptic vibration for mobile devices
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
        if (confMap.launch_countdown_seconds) {
          const sec = Number(confMap.launch_countdown_seconds) || 5;
          setCountdown(sec);
          setSelectedDuration(sec);
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
  const broadcastCommand = async (action, cd = selectedDuration) => {
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
    }

    if (action === "countdown") {
      setLastActionStatus("🚀 Auditorium Countdown Triggered!");
    } else if (action === "instant_launch") {
      setLastActionStatus("✨ Instant Launch Fired!");
    } else if (action === "reset") {
      setLastActionStatus("🔄 Reset Stage to Standby");
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
    // If already launched, ignore clicks
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

    broadcastCommand("countdown", selectedDuration);
  };

  // Local countdown tick
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
      // Deactivate launch mode in Supabase & localStorage
      try {
        supabase.from("page_content").upsert([
          { page_key: "launch_config", content_key: "launch_active", content_text: "false" },
          { page_key: "launch_config", content_key: "launch_state", content_text: "launched" }
        ], { onConflict: "page_key,content_key" }).then(() => {});
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

    let channel;
    try {
      channel = supabase
        .channel("launch_control_room_remote")
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

      {/* Ripple Animation Rings */}
      {ripples.map(r => (
        <motion.div
          key={r.id}
          initial={{ scale: 0.2, opacity: 0.8 }}
          animate={{ scale: 3.5, opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeOut" }}
          className="fixed pointer-events-none rounded-full border-2 border-cyan-400/70 -translate-x-1/2 -translate-y-1/2 z-30"
          style={{ left: r.x, top: r.y, width: "120px", height: "120px" }}
        />
      ))}

      {/* ── TOP VIP CONTROL HEADER ── */}
      <header className="relative z-20 w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Top Action Utility Row */}
        <div className="flex items-center justify-between w-full mb-3 px-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                launchState === "countdown"
                  ? "bg-amber-400 animate-ping shadow-[0_0_10px_#f59e0b]"
                  : launchState === "launched"
                  ? "bg-emerald-400 shadow-[0_0_10px_#10b981]"
                  : "bg-cyan-400 shadow-[0_0_10px_#00d2ff]"
              }`}
            />
            <span className="text-[11px] font-black tracking-wider uppercase text-slate-300">
              AUDITORIUM STAGE SYNC:{" "}
              <span
                className={
                  launchState === "countdown"
                    ? "text-amber-400 font-bold"
                    : launchState === "launched"
                    ? "text-emerald-400 font-bold"
                    : "text-cyan-400 font-bold"
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

          <div className="flex items-center gap-2">
            {/* Audio Feedback Toggle */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isAudioMuted
                  ? "bg-slate-800/80 border-slate-700 text-slate-400"
                  : "bg-cyan-500/15 border-cyan-400/40 text-cyan-300"
              }`}
              title={isAudioMuted ? "Unmute Audio Feedback" : "Mute Audio Feedback"}
            >
              {isAudioMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            {/* Stage Preview Link */}
            <a
              href="/launch"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white transition-all"
              title="Open Stage Projector Window"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Institutional Emblem Header Card */}
        <div className="w-full bg-white/[0.98] backdrop-blur-xl px-5 py-2.5 rounded-2xl shadow-xl border border-white flex items-center justify-between gap-4">
          <img src={srecLogo} alt="SREC Emblem" className="h-8 sm:h-10 w-auto object-contain" />
          <div className="h-6 w-[1px] bg-slate-300" />
          <img src={ieeeSrecLogo} alt="IEEE SB SREC Logo" className="h-9 sm:h-12 w-auto object-contain" />
          <div className="h-6 w-[1px] bg-slate-300" />
          <img src={snrLogo} alt="SNR Sons Charitable Trust" className="h-8 sm:h-10 w-auto object-contain" />
        </div>

        {/* Executive Chief Guest VIP Card */}
        <div className="mt-3 w-full p-4 rounded-3xl bg-gradient-to-b from-[#09152b] via-[#071123] to-[#040915] border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[10px] font-black uppercase tracking-[0.2em] mb-1.5">
            <Award size={12} className="text-amber-400" />
            <span>CHIEF GUEST VIP INAUGURATOR</span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white font-serif tracking-tight drop-shadow">
            {chiefGuest || "Dr. M. Venkateshkumar"}
          </h2>
          <p className="text-[11px] sm:text-xs font-bold text-amber-300/90 uppercase tracking-wider mt-0.5">
            {chiefGuestTitle || "Chairman, IEEE Power & Energy Society"}
          </p>
        </div>

        {/* Action Status Toast */}
        <AnimatePresence>
          {lastActionStatus && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-2 text-center text-xs font-black text-cyan-300 bg-cyan-500/20 py-1.5 px-4 rounded-xl border border-cyan-400/50 shadow-md w-full"
            >
              {lastActionStatus}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── CENTER LAUNCH ACTIVATOR ── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-5 w-full max-w-sm mx-auto my-auto">
        <div className="relative flex flex-col items-center justify-center">
          {/* Subtle Outer Glowing Halo */}
          <div
            className={`absolute -inset-8 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
              launchState === "countdown"
                ? "bg-amber-500/40 scale-125 animate-pulse"
                : launchState === "launched"
                ? "bg-emerald-500/35 scale-110"
                : "bg-cyan-500/30 scale-105"
            }`}
          />

          {/* Luxury Touch Core Activator Disc */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleLaunchClick}
            className={`relative z-10 w-60 h-60 sm:w-68 sm:h-68 rounded-full p-1.5 transition-all duration-300 cursor-pointer flex items-center justify-center select-none shadow-[0_20px_60px_rgba(0,0,0,0.9)] ${
              launchState === "countdown"
                ? "bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 shadow-[0_0_60px_rgba(245,158,11,0.7)] animate-pulse"
                : launchState === "launched"
                ? "bg-gradient-to-tr from-emerald-400 via-teal-400 to-cyan-400 shadow-[0_0_60px_rgba(16,185,129,0.7)]"
                : "bg-gradient-to-tr from-cyan-400 via-[#0066cc] to-amber-400 shadow-[0_0_50px_rgba(0,102,204,0.6)] hover:shadow-[0_0_70px_rgba(0,210,255,0.8)]"
            }`}
          >
            {/* Core Inset Disc */}
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#08152c] via-[#040c1a] to-[#02060e] border-2 border-white/25 flex flex-col items-center justify-center p-4 relative overflow-hidden group shadow-inner">
              
              <AnimatePresence mode="wait">
                {launchState === "countdown" ? (
                  <motion.div
                    key="countdown"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="relative z-10 flex flex-col items-center justify-center"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400 mb-1 animate-pulse">
                      IGNITING STAGE IN
                    </span>
                    <span className="text-6xl sm:text-7xl font-black font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.9)]">
                      {countdown}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-1">
                      SECONDS
                    </span>
                  </motion.div>
                ) : launchState === "launched" ? (
                  <motion.div
                    key="launched"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="relative z-10 flex flex-col items-center justify-center text-center px-2"
                  >
                    <CheckCircle2 size={52} className="text-emerald-400 drop-shadow-[0_0_20px_#10b981] mb-2 animate-bounce" />
                    <span className="text-xl font-black font-serif text-white uppercase tracking-wider drop-shadow">
                      INAUGURATED
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mt-1">
                      STAGE BROADCAST LIVE
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="standby"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.6, opacity: 0 }}
                    className="relative z-10 flex flex-col items-center justify-center"
                  >
                    <div className="relative mb-2">
                      <Fingerprint
                        size={76}
                        className="text-cyan-300 drop-shadow-[0_0_25px_#00d2ff] group-hover:scale-105 group-hover:text-amber-300 transition-all duration-300"
                      />
                      <Sparkles
                        size={18}
                        className="absolute -top-1 -right-1 text-amber-400 animate-pulse"
                      />
                    </div>

                    <span className="text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-200 font-serif drop-shadow">
                      LAUNCH
                    </span>

                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300/90 mt-0.5">
                      TAP TO INAUGURATE
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.button>

          {/* Quick Countdown Duration Selector (Only on Standby) */}
          {launchState === "standby" && (
            <div className="mt-5 flex items-center justify-center gap-2 bg-[#0a162b]/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1">
                <Clock size={12} />
                <span>Timer:</span>
              </span>
              {[3, 5, 10].map(sec => (
                <button
                  key={sec}
                  onClick={() => {
                    setSelectedDuration(sec);
                    setCountdown(sec);
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    selectedDuration === sec
                      ? "bg-cyan-500 text-slate-950 shadow-md font-bold"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {sec}s
                </button>
              ))}
            </div>
          )}

          {/* Operational Guidance & Post-Launch Action */}
          {launchState === "launched" ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex flex-col items-center gap-2.5"
            >
              <a
                href="/web"
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <ExternalLink size={15} />
                <span>Visit Live Web Portal</span>
              </a>
              <p className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider text-center">
                ✓ Public Website Unlocked &amp; Accessible to All
              </p>
            </motion.div>
          ) : (
            <p className="text-xs text-slate-400 text-center max-w-xs mt-3 leading-relaxed">
              {launchState === "countdown"
                ? "Synchronized video & countdown active on auditorium stage."
                : "Chief Guest touch activator — Tap to ignite the inauguration."}
            </p>
          )}
        </div>
      </main>

      {/* ── BOTTOM VIP DOCK ── */}
      <footer className="relative z-20 w-full max-w-lg mx-auto flex flex-col items-center gap-2.5 pb-2">
        {/* Reset / Instant Trigger Buttons */}
        <div className="grid grid-cols-2 gap-2.5 w-full">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => broadcastCommand("reset")}
            className="py-3 px-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/15 text-slate-300 hover:text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RotateCcw size={14} className="text-cyan-400" />
            <span>Reset Standby</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => broadcastCommand("instant_launch")}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            <Zap size={14} />
            <span>Instant Launch</span>
          </motion.button>
        </div>

        {/* Security & Branch Endmark */}
        <div className="flex items-center justify-between w-full px-2 text-[10px] font-bold text-slate-500 tracking-wider uppercase pt-1">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>ENCRYPTED TELEMETRY</span>
          </div>
          <span>IEEE SREC • STB32131</span>
        </div>
      </footer>
    </div>
  );
};

export default LaunchRemote;
