import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Rocket,
  Flame,
  RotateCcw,
  Sparkles,
  Fingerprint,
  CheckCircle2,
  Radio,
  Users,
  Globe,
  ExternalLink
} from "lucide-react";

import srecLogo from "@/assets/srec-logo.png";
import ieeeSrecLogo from "@/assets/ieees.png";
import snrLogo from "@/assets/snr-trust-logo.png";

export const LaunchRemote = ({ onSwitchToStage }) => {
  const [launchState, setLaunchState] = useState("standby"); // "standby" | "countdown" | "launched"
  const [countdown, setCountdown] = useState(5);
  const [isPressing, setIsPressing] = useState(false);
  const [lastActionStatus, setLastActionStatus] = useState("");
  const broadcastChannelRef = useRef(null);

  // Trigger tactile haptic vibration on mobile
  const triggerHaptic = (pattern = [60]) => {
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore
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
          setCountdown(Number(confMap.launch_countdown_seconds) || 5);
        }
      }
    } catch {
      // Local fallback
    }
  }, []);

  // Broadcast command to Auditorium Screen
  const broadcastCommand = async (action, cd = 5) => {
    triggerHaptic([70, 30, 70]);

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

    // 2. BroadcastChannel for instant local browser sync
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ action, countdown: cd, timestamp: Date.now() });
    }

    // 3. Persist state in Supabase DB
    const stateValue = action === "countdown" ? "countdown" : action === "instant_launch" ? "launched" : "standby";
    setLaunchState(stateValue);

    if (action === "countdown") {
      setLastActionStatus("🚀 Stage Countdown Triggered!");
    } else if (action === "instant_launch") {
      setLastActionStatus("✨ Grand Launch Triggered!");
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

  const handleLaunchClick = () => {
    setIsPressing(true);
    triggerHaptic([100]);
    broadcastCommand("countdown", 5);
    setTimeout(() => setIsPressing(false), 600);
  };

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
    <div className="min-h-screen w-full bg-[#030712] text-white flex flex-col justify-between font-sans select-none overflow-x-hidden relative p-4 sm:p-6">
      {/* Background Cinematic Glow Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 right-0 w-80 h-80 bg-amber-500/15 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#00d2ff_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP HEADER: 3 LOGOS + LIVE CONNECTION STATUS */}
      {/* ========================================================================= */}
      <header className="relative z-20 w-full flex flex-col items-center pt-2">
        {/* Three Institutional Logos in Frosted Glass Card */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 bg-white/[0.97] backdrop-blur-md px-6 sm:px-8 py-3 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] border-2 border-white/90">
          <img
            src={srecLogo}
            alt="SREC Logo"
            className="h-10 sm:h-12 w-auto object-contain"
            title="Sri Ramakrishna Engineering College"
          />
          <div className="w-[1.5px] h-8 sm:h-9 bg-slate-300" />
          <img
            src={ieeeSrecLogo}
            alt="IEEE SREC Logo"
            className="h-10 sm:h-12 w-auto object-contain"
            title="IEEE Student Branch SREC"
          />
          <div className="w-[1.5px] h-8 sm:h-9 bg-slate-300" />
          <img
            src={snrLogo}
            alt="SNR Trust Logo"
            className="h-10 sm:h-12 w-auto object-contain"
            title="SNR Sons Charitable Trust"
          />
        </div>

        {/* Live Stage Status Indicator */}
        <div className="mt-3.5 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md shadow-lg">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              launchState === "countdown"
                ? "bg-red-500 animate-ping"
                : launchState === "launched"
                ? "bg-emerald-400 shadow-[0_0_10px_#34d399]"
                : "bg-cyan-400 animate-pulse"
            }`}
          />
          <span className="text-[11px] font-black tracking-widest uppercase text-slate-300">
            AUDITORIUM STAGE:{" "}
            <span
              className={
                launchState === "countdown"
                  ? "text-red-400 font-extrabold"
                  : launchState === "launched"
                  ? "text-emerald-400 font-extrabold"
                  : "text-cyan-400 font-extrabold"
              }
            >
              {launchState === "countdown" ? `COUNTDOWN IN PROGRESS` : launchState.toUpperCase()}
            </span>
          </span>
        </div>

        {/* Action status toast */}
        {lastActionStatus && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center text-xs font-black text-cyan-300 bg-cyan-500/15 py-1.5 px-4 rounded-xl border border-cyan-500/40 backdrop-blur-md shadow-lg"
          >
            {lastActionStatus}
          </motion.div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. CENTER: LUXURY VIP LAUNCH BUTTON */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center py-4 w-full max-w-sm mx-auto">
        <div className="relative flex flex-col items-center justify-center">
          {/* Ambient Glow Aura */}
          <div
            className={`absolute -inset-10 rounded-full blur-3xl transition-all duration-500 pointer-events-none ${
              launchState === "countdown"
                ? "bg-red-500/40 scale-125 animate-pulse"
                : launchState === "launched"
                ? "bg-emerald-500/40 scale-110"
                : "bg-cyan-500/35 scale-110 animate-pulse"
            }`}
          />

          {/* Concentric Halo Ring */}
          <svg
            className="absolute w-72 h-72 sm:w-84 sm:h-84 animate-spin-slow opacity-30 text-cyan-400 pointer-events-none"
            viewBox="0 0 200 200"
          >
            <circle cx="100" cy="100" r="92" stroke="currentColor" strokeWidth="1.5" fill="none" strokeDasharray="8 12" />
            <circle cx="100" cy="100" r="82" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="24 36" />
          </svg>

          {/* Majestic Circular Launch Pad */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleLaunchClick}
            className="relative z-10 w-56 h-56 sm:w-64 sm:h-64 rounded-full p-[4px] bg-gradient-to-tr from-cyan-400 via-blue-600 to-amber-500 shadow-[0_0_50px_rgba(0,210,255,0.45)] cursor-pointer active:shadow-[0_0_80px_rgba(245,158,11,0.8)] transition-all flex items-center justify-center"
          >
            {/* Inner Button Disc */}
            <div className="w-full h-full rounded-full bg-[#050f22] border-2 border-white/20 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/25 via-transparent to-amber-500/10 opacity-70 group-hover:opacity-100 transition" />

              <Fingerprint
                size={70}
                className="relative z-10 text-cyan-300 mb-2 drop-shadow-[0_0_20px_#00d2ff] group-hover:scale-110 transition-transform duration-300"
              />

              <span className="relative z-10 text-xl font-black uppercase tracking-wider text-white font-serif drop-shadow">
                LAUNCH
              </span>

              <span className="relative z-10 text-[10px] sm:text-xs font-black uppercase tracking-widest text-cyan-300/90 mt-1">
                TAP TO INAUGURATE
              </span>
            </div>
          </motion.button>

          <p className="text-xs text-slate-400 text-center font-medium mt-5 max-w-xs">
            Tap to ignite the ceremony countdown &amp; launch the portal on the auditorium screen
          </p>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. BOTTOM CONTROLS: RESET & DIRECT LINKS */}
      {/* ========================================================================= */}
      <footer className="relative z-20 w-full max-w-sm mx-auto flex flex-col items-center gap-2.5 pb-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => broadcastCommand("reset")}
          className="w-full py-3 px-6 rounded-2xl bg-white/10 hover:bg-white/15 active:bg-white/20 border border-white/20 text-slate-200 hover:text-white text-xs sm:text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg backdrop-blur-xl"
        >
          <RotateCcw size={15} className="text-slate-300" />
          <span>RESET TO STANDBY</span>
        </motion.button>

        <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
          IEEE STUDENT BRANCH SREC • STB32131
        </div>
      </footer>
    </div>
  );
};

export default LaunchRemote;
