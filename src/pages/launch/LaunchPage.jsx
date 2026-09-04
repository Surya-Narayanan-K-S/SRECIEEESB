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

// Audio Synthesizer using Web Audio API (Zero external assets needed, 100% reliable)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playCountdown(step) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const isFinal = step <= 0;
    const isCritical = step <= 3;

    // Rich dual oscillator synth sound
    osc.type = isFinal ? "sawtooth" : isCritical ? "triangle" : "sine";
    const baseFreq = isFinal ? 980 : isCritical ? 620 + (3 - step) * 120 : 440 + (10 - step) * 35;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * (isCritical ? 1.5 : 1.2), this.ctx.currentTime + (isFinal ? 0.5 : 0.3));

    gain.gain.setValueAtTime(isCritical ? 0.5 : 0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (isFinal ? 0.6 : 0.35));

    // Sub-bass thud on critical ticks
    if (isCritical && !isFinal) {
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(90, this.ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.3);
      subGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      subGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start();
      subOsc.stop(this.ctx.currentTime + 0.3);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + (isFinal ? 0.6 : 0.35));
  }

  playLaunch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Massive Sub-bass sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 2.0);

    gain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 2.5);

    // Chime chords
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, i) => {
      const chordOsc = this.ctx.createOscillator();
      const chordGain = this.ctx.createGain();
      chordOsc.type = "triangle";
      chordOsc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.08);

      chordGain.gain.setValueAtTime(0.3, this.ctx.currentTime + i * 0.08);
      chordGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.0);

      chordOsc.connect(chordGain);
      chordGain.connect(this.ctx.destination);
      chordOsc.start(this.ctx.currentTime + i * 0.08);
      chordOsc.stop(this.ctx.currentTime + 3.0);
    });
  }
}

const sfx = new SoundFX();

export const LaunchPage = () => {
  const navigate = useNavigate();

  // Launch Page Configuration
  const [config, setConfig] = useState({
    title: "IEEE STUDENT BRANCH SREC",
    subtitle: "Official Digital Platform & Innovation Ecosystem Inauguration",
    eventNote: "STB32131 / STB64071 • Sri Ramakrishna Engineering College",
    chiefGuest: "Dr. M. Venkateshkumar",
    chiefGuestTitle: "Chairman, IEEE Power & Energy Society",
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
    sfx.playLaunch();
    setLaunchState("launched");
    fireConfetti();
  }, [fireConfetti]);

  // Start countdown sequence
  const startCountdown = useCallback((startSec = 5) => {
    sfx.init();
    setCountdown(startSec);
    setLaunchState("countdown");
  }, []);

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
          triggerLaunch();
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
          triggerLaunch();
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
  }, [loadConfig, startCountdown, triggerLaunch, resetLaunch]);

  // Manage video playback based on launchState (Standby -> Image, Countdown -> Video plays!)
  useEffect(() => {
    if (videoRef.current) {
      if (launchState === "countdown") {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play was prevented
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
      sfx.playCountdown(countdown);
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

  // Ambient Starfield Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || launchState === "launched") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
      {/* 1. STANDBY: High-Resolution Background Image */}
      {/* 2. TIMER / COUNTDOWN: Dynamic Video Plays (FULLY VISIBLE) */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-black">
        {/* STANDBY BACKGROUND IMAGE LAYER WITH BLUR EFFECT */}
        <div
          className={`absolute -inset-6 w-[calc(100%+3rem)] h-[calc(100%+3rem)] bg-cover bg-center bg-no-repeat transition-opacity duration-1000 transform filter blur-md sm:blur-lg scale-105 ${
            launchState === "standby" ? "opacity-95" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${inaugurationPoster})`,
          }}
        />

        {/* TIMER / COUNTDOWN VIDEO LAYER (100% Fully Visible) */}
        <video
          ref={videoRef}
          src={launchVideo}
          autoPlay
          loop
          muted
          playsInline
          className={`w-full h-full object-cover object-center transition-all duration-700 ${
            launchState === "countdown" || launchState === "launched"
              ? "opacity-100 scale-100"
              : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Subtle Overlay (Clear during countdown so video is fully visible) */}
        <div
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
            launchState === "standby"
              ? "bg-gradient-to-t from-[#050b14]/80 via-[#050b14]/40 to-[#050b14]/70"
              : "bg-black/10"
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
                      {config.chiefGuestTitle || "Chairman, IEEE Power & Energy Society"}
                    </p>
                  </div>

                  {/* 7. All Technical Chapters & Affinity Groups Logos (Centered) */}
                  <div className="w-full flex flex-col items-center mb-4">
                    <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 flex items-center justify-center gap-2">
                      <span className="w-5 sm:w-8 h-[1px] bg-slate-200" />
                      <span>TECHNICAL CHAPTERS &amp; AFFINITY GROUPS</span>
                      <span className="w-5 sm:w-8 h-[1px] bg-slate-200" />
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 max-w-lg px-1">
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

                  {/* 8. Dark Countdown Stage HUD Box */}
                  <div className="w-full max-w-lg bg-[#0a1628] text-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-800 flex flex-col items-center">
                    <div className="text-[10px] sm:text-[11px] font-black text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-2">
                      <span>⏱️</span>
                      <span>COUNTDOWN TO INAUGURATION LAUNCH</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 w-full max-w-xs text-center">
                      <div className="bg-[#12233b] rounded-xl py-1 px-2 border border-slate-700/60">
                        <div className="text-base sm:text-lg font-black text-white font-mono">00</div>
                        <div className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider">DAYS</div>
                      </div>
                      <div className="bg-[#12233b] rounded-xl py-1 px-2 border border-slate-700/60">
                        <div className="text-base sm:text-lg font-black text-white font-mono">00</div>
                        <div className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider">HOURS</div>
                      </div>
                      <div className="bg-[#12233b] rounded-xl py-1 px-2 border border-slate-700/60">
                        <div className="text-base sm:text-lg font-black text-white font-mono">00</div>
                        <div className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-wider">MINS</div>
                      </div>
                      <div className="bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-slate-950 rounded-xl py-1 px-2 font-black shadow-md border border-white/50">
                        <div className="text-base sm:text-lg font-black font-mono">
                          {countdown < 10 ? `0${countdown}` : countdown}
                        </div>
                        <div className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider">SECS</div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 2: CEREMONY COUNTDOWN (BOTTOM-MIDDLE OF SCREEN - ZERO BUTTONS) */}
          {/* ========================================================================= */}
          {launchState === "countdown" && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative flex flex-col items-center justify-end flex-1 w-full pb-8 mx-auto mt-auto max-w-2xl sm:max-w-3xl px-4"
            >
              {/* Bottom-Middle Luxury Glass HUD Bar */}
              <div className="w-full bg-[#030914]/85 backdrop-blur-2xl border border-cyan-400/60 rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(0,210,255,0.3)] flex flex-col items-center text-center ring-1 ring-white/10">
                {/* Top Row: Badge + Countdown Digit */}
                <div className="flex items-center justify-between w-full mb-2.5 px-2">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-black uppercase tracking-widest shadow-sm">
                    <Sparkles size={13} className="text-cyan-400 animate-pulse" />
                    <span>INAUGURATION COUNTDOWN</span>
                  </div>

                  {/* Large Floating Glowing Countdown Digit */}
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">T-MINUS</span>
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center font-serif shadow-[0_0_30px_rgba(245,158,11,0.9)] border-2 border-white">
                      <AnimatePresence mode="popLayout">
                        <motion.span
                          key={countdown}
                          initial={{ scale: 1.6, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          {countdown > 0 ? countdown : "0"}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Wide Bottom-Middle Progress Bar */}
                <div className="w-full my-2">
                  <div className="h-3 w-full rounded-full bg-slate-900/90 border border-white/20 overflow-hidden shadow-inner p-[1.5px]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-amber-400 shadow-[0_0_15px_#00d2ff]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.max(5, 100 - (countdown / (config.countdownSeconds || 5)) * 100)}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {/* Bottom Row: Ceremony Subtitle (Zero Buttons) */}
                <div className="flex flex-col items-center text-center w-full pt-2 border-t border-white/10">
                  <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-wider font-serif drop-shadow">
                    IEEE STUDENT BRANCH SREC
                  </h2>
                  <p className="text-[10px] sm:text-xs font-bold text-cyan-300 uppercase tracking-wider mt-0.5">
                    Induction of Office Bearers (2026–2027) &amp; Digital Platform Launch
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3: LAUNCHED & DEDICATED (BOTTOM-MIDDLE OF SCREEN - ZERO BUTTONS) */}
          {/* ========================================================================= */}
          {launchState === "launched" && (
            <motion.div
              key="launched"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex flex-col items-center justify-end flex-1 w-full pb-8 mx-auto mt-auto max-w-2xl sm:max-w-3xl px-4"
            >
              {/* Bottom-Middle Luxury Glass HUD Bar */}
              <div className="w-full bg-[#030914]/90 backdrop-blur-2xl border-2 border-emerald-400/80 rounded-3xl p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_50px_rgba(16,185,129,0.4)] flex flex-col items-center text-center ring-1 ring-white/15">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.8)] border border-white/80">
                    <CheckCircle2 size={24} className="text-slate-950 animate-bounce" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] font-black text-emerald-300 uppercase tracking-widest drop-shadow">
                      OFFICIALLY INAUGURATED
                    </div>
                    <h1 className="text-base sm:text-xl font-black text-white uppercase tracking-wider font-serif drop-shadow">
                      WELCOME TO IEEE SREC 2026–2027
                    </h1>
                  </div>
                </div>

                {/* Progress bar loading redirect */}
                <div className="w-full my-2">
                  <div className="h-2.5 w-full rounded-full bg-slate-900 border border-emerald-500/40 overflow-hidden shadow-inner p-[1px]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_15px_#10b981]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5, ease: "easeInOut" }}
                    />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 text-xs font-black shadow-lg animate-pulse mt-1">
                  <Rocket size={14} className="animate-pulse text-cyan-300" />
                  <span>🚀 Launching Digital Platform Home Page...</span>
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
