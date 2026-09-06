import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Rocket,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { LAUNCH_BG_PRESETS, LAUNCH_VIDEO_PRESETS } from "./launchPresets";
import srecLogo from "@/assets/srec-logo.png";
import ieeeSrecLogo from "@/assets/ieees.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import inaugurationPoster from "@/assets/inauguration-2026.jpg";
import launchVideo from "@/assets/launch-video.mp4";
import srecCampus from "@/assets/srec-campus.png";
import csLogo from "@/assets/societies/CS.png";
import cisLogo from "@/assets/societies/CIS.webp";
import comsocLogo from "@/assets/societies/ComSoc.jpg";
import embsLogo from "@/assets/societies/EMBS.jpg";
import pelsLogo from "@/assets/societies/pels.png";
import casLogo from "@/assets/societies/css.svg";
import imLogo from "@/assets/societies/IM.jpg";
import wieLogo from "@/assets/societies/WIE.jpg";

// All Technical Chapters & Affinity Groups of IEEE SREC SB
const SOCIETY_CHAPTERS = [
  { name: "Computer Society", shortName: "CS", logo: csLogo },
  { name: "Computational Intelligence Society", shortName: "CIS", logo: cisLogo },
  { name: "Communications Society", shortName: "ComSoc", logo: comsocLogo },
  { name: "Engineering in Medicine & Biology Society", shortName: "EMBS", logo: embsLogo },
  { name: "Power Electronics Society", shortName: "PELS", logo: pelsLogo },
  { name: "Circuits & Systems Society", shortName: "CAS", logo: casLogo },
  { name: "Instrumentation & Measurement Society", shortName: "IMS", logo: imLogo },
  { name: "Women in Engineering Affinity Group", shortName: "WIE", logo: wieLogo },
];

export const LaunchPage = () => {
  const navigate = useNavigate();

  // Launch Page Configuration
  const [config, setConfig] = useState({
    title: "IEEE STUDENT BRANCH SREC",
    subtitle: "Official Digital Platform & Innovation Ecosystem Inauguration",
    eventNote: "STB32131 / STB64071 • Sri Ramakrishna Engineering College",
    chiefGuest: "Dr. M. Venkateshkumar",
    chiefGuestTitle: "Chairman, IEEE Power and Electronics Society",
    bgImageUrl: LAUNCH_BG_PRESETS[0].url,
    videoUrl: LAUNCH_VIDEO_PRESETS[0].url,
    countdownSeconds: 5,
    autoRedirect: true,
    redirectUrl: "/web",
    allowGuestTrigger: true,
  });

  // State: "standby" | "countdown" | "launched"
  const [launchState, setLaunchState] = useState("standby");
  const [countdown, setCountdown] = useState(5);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  // Load config from Supabase
  const loadConfig = useCallback(async () => {
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

        setConfig(prev => ({
          ...prev,
          title: confMap.launch_title || prev.title,
          subtitle: confMap.launch_subtitle || prev.subtitle,
          eventNote: confMap.launch_note || prev.eventNote,
          chiefGuest: confMap.launch_chief_guest || prev.chiefGuest,
          chiefGuestTitle: confMap.launch_chief_guest_title || prev.chiefGuestTitle,
          bgImageUrl: confMap.launch_bg_image_url || prev.bgImageUrl,
          videoUrl: confMap.launch_video_url || prev.videoUrl,
          countdownSeconds: Number(confMap.launch_countdown_seconds) || 5,
          redirectUrl: confMap.launch_redirect_url || "/web",
        }));
      }
    } catch {
      // Use defaults
    }
  }, []);

  // Canvas particle / fireworks effects
  const fireConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#0066cc", "#00d2ff", "#ffb800", "#ff3366", "#00ff88", "#ffffff", "#9933ff"];

    for (let i = 0; i < 260; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.6,
        vx: (Math.random() - 0.5) * 24,
        vy: (Math.random() - 0.8) * 28,
        size: Math.random() * 8 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        alpha: 1,
        decay: Math.random() * 0.008 + 0.004,
      });
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.rotation += p.rSpeed;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          ctx.restore();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(render);
      }
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, []);

  // Trigger grand launch
  const triggerLaunch = useCallback(() => {
    setLaunchState("launched");
    fireConfetti();

    // Deactivate launch mode in Supabase & localStorage so the entire website unlocks for everyone
    try {
      supabase.from("page_content").upsert([
        { page_key: "launch_config", content_key: "launch_active", content_text: "false" },
        { page_key: "launch_config", content_key: "launch_state", content_text: "launched" }
      ], { onConflict: "page_key,content_key" }).then(() => { });
      localStorage.setItem("ieee_launch_mode_active", "false");
    } catch {
      // Ignore
    }
  }, [fireConfetti]);

  // Start countdown sequence
  const startCountdown = useCallback((startSec = 5) => {
    // If already launched, ignore countdown commands from remote
    if (launchState === "launched") return;
    setCountdown(startSec);
    setLaunchState("countdown");
  }, [launchState]);

  // Reset launch state
  const resetLaunch = useCallback(() => {
    setLaunchState("standby");
    setCountdown(config.countdownSeconds || 5);
  }, [config.countdownSeconds]);

  useEffect(() => {
    loadConfig();

    // Listen for realtime broadcast / channel events from Mobile Remote or Admin
    const channel = supabase
      .channel("launch_control_room")
      .on("broadcast", { event: "launch_event" }, payload => {
        const { action, countdown: cd } = payload.payload || {};
        if (action === "countdown") {
          startCountdown(cd || 5);
        } else if (action === "instant_launch") {
          if (launchState !== "launched") triggerLaunch();
        } else if (action === "reset") {
          resetLaunch();
        }
      })
      .subscribe();

    // BroadcastChannel for instant same-browser multi-window / tab sync
    let bc = null;
    if (typeof BroadcastChannel !== "undefined") {
      bc = new BroadcastChannel("ieee_launch_channel");
      bc.onmessage = (e) => {
        const { action, countdown: cd } = e.data || {};
        if (action === "countdown") {
          startCountdown(cd || 5);
        } else if (action === "instant_launch") {
          if (launchState !== "launched") triggerLaunch();
        } else if (action === "reset") {
          resetLaunch();
        }
      };
    }

    // Polling fallback every 2.5 seconds
    const interval = setInterval(loadConfig, 2500);

    return () => {
      supabase.removeChannel(channel);
      if (bc) bc.close();
      clearInterval(interval);
    };
  }, [loadConfig, startCountdown, triggerLaunch, resetLaunch, launchState]);

  // Manage video playback based on launchState (Standby -> Image, Countdown/Launched -> Video plays!)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      if (launchState === "countdown" || launchState === "launched") {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play fallback
          });
        }
      } else if (launchState === "standby") {
        videoRef.current.pause();
      }
    }
  }, [launchState]);

  // Countdown timer effect
  useEffect(() => {
    if (launchState !== "countdown") return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      triggerLaunch();
    }
  }, [launchState, countdown, triggerLaunch]);

  // Auto redirect to Home page after launch celebration
  useEffect(() => {
    if (launchState !== "launched") return;

    const timer = setTimeout(() => {
      navigate("/web?inaugurated=true");
    }, 2600);

    return () => clearTimeout(timer);
  }, [launchState, navigate]);

  // Ambient Starfield Canvas (Only during standby so countdown video stays 100% crisp & clear)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (launchState !== "standby") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let animId;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.3 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = canvas.height;
          star.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 210, 255, ${star.alpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#00d2ff";
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [launchState]);

  return (
    <div className="fixed inset-0 min-h-screen w-screen bg-[#050b14] text-white overflow-hidden flex flex-col items-center justify-between select-none font-sans z-50">
      {/* ========================================================================= */}
      {/* BACKGROUND LAYERS (FULL SCREEN 100vw x 100vh) */}
      {/* 1. SREC COLLEGE CAMPUS BACKGROUND WITH FROSTED GLASS BLUR EFFECT */}
      {/* 2. TIMER / COUNTDOWN: Dynamic Video Plays (FULLY VISIBLE & SEAMLESS) */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-slate-950">
        {/* SREC COLLEGE CAMPUS PHOTO LAYER (Clearer, Recognizable Architecture) */}
        <div
          className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] bg-cover bg-center bg-no-repeat scale-105 opacity-85 transition-all duration-1000"
          style={{
            backgroundImage: `url(${srecCampus})`,
          }}
        />

        {/* LUXURY FROSTED GLASS BLUR OVERLAY (Backdrop Glassmorphism Effect) */}
        <div className="absolute inset-0 backdrop-blur-md sm:backdrop-blur-lg bg-slate-950/40 border-b border-white/10" />

        {/* Subtle Ambient Vignette & Cyan Flare Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/60 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vh] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />

        {/* TIMER / COUNTDOWN MAIN VIDEO LAYER (100% Sharp, Centered, Glass Glow) */}
        <video
          ref={videoRef}
          src={launchVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-contain object-center transition-opacity duration-700 drop-shadow-[0_0_40px_rgba(0,102,204,0.35)] ${
            launchState === "countdown" || launchState === "launched"
              ? "opacity-100 z-10"
              : "opacity-0 pointer-events-none z-0"
          }`}
        />
      </div>

      {/* CANVAS FX (Stars & Confetti) */}
      <canvas ref={canvasRef} className="fixed inset-0 w-screen h-screen z-10 pointer-events-none" />

      {/* TOP PRESENTATION BAR (Only on Countdown/Launched or Fallback) */}
      {launchState !== "standby" && (
        <header className="relative z-20 w-full px-4 sm:px-8 pt-4 pb-2 flex items-center justify-center bg-transparent">
          <div className="flex items-center justify-center gap-4 sm:gap-8 bg-white/[0.96] backdrop-blur-md px-6 sm:px-10 py-2 sm:py-2.5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] border-2 border-white/90">
            <img src={srecLogo} alt="SREC Logo" className="h-7 sm:h-12 md:h-14 w-auto object-contain transition-transform" title="Sri Ramakrishna Engineering College" />
            <div className="w-[1.5px] h-6 sm:h-10 bg-slate-300" />
            <img src={ieeeSrecLogo} alt="IEEE SREC Logo" className="h-7 sm:h-12 md:h-14 w-auto object-contain transition-transform" title="IEEE Student Branch SREC" />
            <div className="w-[1.5px] h-6 sm:h-10 bg-slate-300" />
            <img src={snrLogo} alt="SNR Trust Logo" className="h-7 sm:h-12 md:h-14 w-auto object-contain transition-transform" title="SNR Sons Charitable Trust" />
          </div>
        </header>
      )}

      {/* CENTER STAGE CONTENT */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-3 sm:px-6 lg:px-8 w-full max-w-[1400px] mx-auto py-3">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STAGE 1: STANDBY / SPLIT-HERO LUXURY CONFERENCE CARD (MATCHING REFERENCE) */}
          {/* ========================================================================= */}
          {launchState === "standby" && (
            <motion.div
              key="standby"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center w-full max-w-6xl my-auto"
            >
              {/* Grand Split Presentation Card */}
              <div className="relative group w-full rounded-[2.5rem] bg-white text-slate-900 shadow-[0_30px_90px_rgba(0,0,0,0.7),0_0_60px_rgba(0,102,204,0.2)] border-2 border-white overflow-hidden flex flex-col lg:flex-row items-stretch text-left">

                {/* ── LEFT COLUMN: AERIAL CAMPUS PHOTO WITH ORGANIC S-CURVE WAVE ── */}
                <div className="relative w-full lg:w-[46%] min-h-[260px] sm:min-h-[320px] lg:min-h-[620px] flex items-stretch overflow-hidden bg-slate-900">
                  <img
                    src={srecCampus}
                    alt="Sri Ramakrishna Engineering College Campus Aerial"
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-1000"
                  />
                  {/* Soft architectural vignette overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />

                  {/* Desktop S-Curve Organic Wave Cutout */}
                  <div className="hidden lg:block absolute -top-1 -bottom-1 -right-[1px] w-24 xl:w-32 z-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
                      <path d="M100 0 C65 20, 20 28, 42 50 C65 72, 10 82, 100 100 Z" />
                    </svg>
                  </div>

                  {/* Mobile Bottom Wave Cutout */}
                  <div className="lg:hidden absolute -left-1 -right-1 -bottom-[1px] h-10 z-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
                      <path d="M0 100 C30 30, 70 30, 100 100 Z" />
                    </svg>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: PRESENTATION CONTENT & LOGOS ── */}
                <div className="relative flex-1 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between items-center text-center bg-white z-10">
                  {/* 1. Top Three Institutional Logos */}
                  <div className="flex items-center justify-center gap-4 sm:gap-7 md:gap-9 mb-3">
                    <img src={srecLogo} alt="SREC Emblem" className="h-10 sm:h-14 md:h-16 w-auto object-contain" title="Sri Ramakrishna Engineering College" />
                    <img src={ieeeSrecLogo} alt="IEEE SB SREC Logo" className="h-12 sm:h-16 md:h-18 w-auto object-contain drop-shadow-xs" title="IEEE Student Branch SREC" />
                    <img src={snrLogo} alt="SNR Sons Trust" className="h-10 sm:h-14 md:h-16 w-auto object-contain" title="SNR Sons Charitable Trust" />
                  </div>

                  {/* 2. Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/90 text-amber-800 text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] mb-2.5 shadow-2xs">
                    <Sparkles size={14} className="text-amber-500 animate-pulse" />
                    <span>GRAND INAUGURATION CEREMONY</span>
                  </div>

                  {/* 3. Main Title */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.08] mb-1 font-serif">
                    <span className="text-[#0f2b48]">IEEE SB </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0066cc] via-[#0284c7] to-[#f59e0b]">SREC</span>
                  </h1>

                  {/* 4. Subtitle & Institution */}
                  <p className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wider max-w-lg mb-1 leading-snug">
                    {config.subtitle || "Official Digital Platform & Innovation Ecosystem Inauguration"}
                  </p>
                  <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3.5">
                    {config.eventNote || "Sri Ramakrishna Engineering College (Autonomous)"}
                  </p>

                  {/* 5. Date & Venue Golden Capsule */}
                  <div className="w-full max-w-lg bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-2xl shadow-md flex items-center justify-center gap-3 sm:gap-5 mb-3.5">
                    <div className="flex items-center gap-1.5">
                      <span>📅</span>
                      <span>Academic Year 2026–2027</span>
                    </div>
                    <span className="opacity-60">|</span>
                    <div className="flex items-center gap-1.5">
                      <span>🏛️</span>
                      <span>Sri Ramakrishna Eng. College</span>
                    </div>
                  </div>

                  {/* 6. Chief Guest Presentation */}
                  <div className="w-full max-w-lg px-4 py-2 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 shadow-2xs flex flex-col items-center mb-3.5">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#0066cc] mb-0.5">
                      CHIEF GUEST
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 font-serif">
                      {config.chiefGuest || "Dr. M. Venkateshkumar"}
                    </h3>
                    <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
                      {config.chiefGuestTitle || "Chairman, IEEE Power and Electronics Society"}
                    </p>
                  </div>

                  {/* 7. All Technical Chapters & Affinity Groups Logos (Centered) */}
                  <div className="w-full flex flex-col items-center mt-1">
                    <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center justify-center gap-2">
                      <span className="w-5 sm:w-8 h-[1px] bg-slate-200" />
                      <span>TECHNICAL CHAPTERS &amp; AFFINITY GROUPS</span>
                      <span className="w-5 sm:w-8 h-[1px] bg-slate-200" />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-lg px-1">
                      {SOCIETY_CHAPTERS.map((soc) => (
                        <div
                          key={soc.shortName}
                          className="flex items-center justify-center bg-slate-50 hover:bg-white rounded-xl p-1.5 sm:p-2 border border-slate-200/90 shadow-2xs transition-all duration-300 hover:scale-110 hover:shadow-md cursor-default"
                          title={`${soc.name} (${soc.shortName})`}
                        >
                          <img
                            src={soc.logo}
                            alt={soc.name}
                            className="h-6 sm:h-7 md:h-8 w-auto max-w-[50px] sm:max-w-[65px] object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 2: CEREMONY COUNTDOWN (ULTRA-SLEEK BROADCAST HUD) */}
          {/* ========================================================================= */}
          {launchState === "countdown" && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative flex flex-col items-center justify-end flex-1 w-full pb-6 mx-auto mt-auto max-w-xl sm:max-w-2xl px-4 z-30"
            >
              {/* Sleek Floating Glass Capsule */}
              <div className="w-full bg-slate-950/80 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(0,102,204,0.2)] flex flex-col items-center text-center relative overflow-hidden">
                {/* Subtle top ambient sheen */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

                {/* Top Row: Ceremony Badge + Sleek Glowing Counter */}
                <div className="flex items-center justify-between w-full mb-3 px-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider shadow-inner">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>INAUGURATION COUNTDOWN</span>
                  </div>

                  {/* High-Tech Glowing Numeric Badge */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">T-MINUS</span>
                    <div className="min-w-[42px] h-[42px] sm:min-w-[48px] sm:h-[48px] px-2.5 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-500 text-white font-black text-xl sm:text-2xl flex items-center justify-center font-mono shadow-[0_0_25px_rgba(0,163,255,0.7)] border border-cyan-300/40">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={countdown}
                          initial={{ scale: 1.5, opacity: 0, y: -5 }}
                          animate={{ scale: 1, opacity: 1, y: 0 }}
                          exit={{ scale: 0.6, opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {countdown > 0 ? countdown : "0"}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Laser Progress Bar */}
                <div className="w-full my-1.5">
                  <div className="h-2 w-full rounded-full bg-slate-900/90 border border-white/10 overflow-hidden shadow-inner p-[1px]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 shadow-[0_0_12px_#38bdf8]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.max(8, 100 - (countdown / (config.countdownSeconds || 5)) * 100)}%` }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Bottom Row: Typography */}
                <div className="flex flex-col items-center text-center w-full pt-2.5 border-t border-white/10">
                  <h2 className="text-sm sm:text-base font-extrabold text-white uppercase tracking-wider">
                    IEEE STUDENT BRANCH SREC
                  </h2>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                    Induction of Office Bearers (2026–2027) &amp; Digital Platform Launch
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3: LAUNCHED & DEDICATED (ULTRA-SLEEK BROADCAST HUD) */}
          {/* ========================================================================= */}
          {launchState === "launched" && (
            <motion.div
              key="launched"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative flex flex-col items-center justify-end flex-1 w-full pb-6 mx-auto mt-auto max-w-xl sm:max-w-2xl px-4 z-30"
            >
              <div className="w-full bg-slate-950/85 backdrop-blur-2xl border border-emerald-400/50 rounded-3xl p-4 sm:p-5 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(16,185,129,0.3)] flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.8)] border border-white/80">
                    <CheckCircle2 size={20} className="text-slate-950 animate-bounce" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      OFFICIALLY INAUGURATED
                    </div>
                    <h1 className="text-sm sm:text-lg font-black text-white uppercase tracking-wider">
                      WELCOME TO IEEE SREC 2026–2027
                    </h1>
                  </div>
                </div>

                {/* Progress bar loading redirect */}
                <div className="w-full my-1.5">
                  <div className="h-2 w-full rounded-full bg-slate-900 border border-emerald-500/30 overflow-hidden shadow-inner p-[1px]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_12px_#10b981]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold shadow-lg mt-1">
                  <Rocket size={13} className="animate-pulse text-emerald-400" />
                  <span>Entering Official IEEE SREC Platform...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default LaunchPage;
