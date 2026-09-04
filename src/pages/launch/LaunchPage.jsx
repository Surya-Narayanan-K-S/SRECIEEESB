import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Rocket,
  Sparkles,
  CheckCircle2,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Crown,
  Award,
  Globe2,
  Radio,
  Layers,
  Users,
  ShieldCheck,
  Zap,
  Activity,
  QrCode
} from "lucide-react";
import { PageQrModal } from "@/components/ui/PageQrModal";
import { LAUNCH_BG_PRESETS, LAUNCH_VIDEO_PRESETS } from "./launchPresets";
import srecLogo from "@/assets/srec-logo.png";
import ieeeSrecLogo from "@/assets/ieees.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import inaugurationPoster from "@/assets/inauguration-2026.jpg";
import launchVideo from "@/assets/launch-video.mp4";

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

    osc.type = isFinal ? "sawtooth" : isCritical ? "triangle" : "sine";
    const baseFreq = isFinal ? 980 : isCritical ? 620 + (3 - step) * 120 : 440 + (10 - step) * 35;
    osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * (isCritical ? 1.5 : 1.2), this.ctx.currentTime + (isFinal ? 0.5 : 0.3));

    gain.gain.setValueAtTime(isCritical ? 0.5 : 0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (isFinal ? 0.6 : 0.35));

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
    title: "IEEE STUDENT BRANCH",
    collegeName: "SRI RAMAKRISHNA ENGINEERING COLLEGE",
    subtitle: "Official Digital Platform & Innovation Ecosystem Inauguration",
    eventNote: "Induction of Office Bearers (2026–2027) • Region 10 Madras Section",
    chiefGuest: "Dr. M. Venkateshkumar",
    chiefGuestTitle: "Chairman, IEEE Power & Energy Society (Madras Section)",
    chiefGuestOrg: "Distinguished Guest & Senior IEEE Member",
    bgImageUrl: LAUNCH_BG_PRESETS[0].url,
    videoUrl: LAUNCH_VIDEO_PRESETS[0].url,
    countdownSeconds: 5,
    autoRedirect: true,
    redirectUrl: "/web",
  });

  // State: "standby" | "countdown" | "launched"
  const [launchState, setLaunchState] = useState("standby");
  const [countdown, setCountdown] = useState(5);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

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

  // Confetti / Fireworks FX
  const fireConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ["#0066cc", "#00d2ff", "#ffb800", "#ff3366", "#00ff88", "#ffffff", "#e0b0ff"];

    for (let i = 0; i < 280; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.5,
        vx: (Math.random() - 0.5) * 28,
        vy: (Math.random() - 0.7) * 32,
        size: Math.random() * 9 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 14,
        gravity: 0.38,
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
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
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

  // Trigger launch
  const triggerLaunch = useCallback(() => {
    if (!isSoundMuted) sfx.playLaunch();
    setLaunchState("launched");
    fireConfetti();
  }, [fireConfetti, isSoundMuted]);

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

  // Fullscreen helper
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

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

    const interval = setInterval(loadConfig, 2500);

    return () => {
      supabase.removeChannel(channel);
      if (bc) bc.close();
      clearInterval(interval);
    };
  }, [loadConfig, startCountdown, triggerLaunch, resetLaunch]);

  // Manage video playback
  useEffect(() => {
    if (videoRef.current) {
      if (launchState === "countdown") {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
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
      if (!isSoundMuted) sfx.playCountdown(countdown);
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      triggerLaunch();
    }
  }, [launchState, countdown, triggerLaunch, isSoundMuted]);

  // Auto redirect to Home page after launch celebration
  useEffect(() => {
    if (launchState !== "launched") return;

    const timer = setTimeout(() => {
      navigate("/web?inaugurated=true");
    }, 2800);

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

    const stars = Array.from({ length: 110 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.6,
      alpha: Math.random() * 0.85 + 0.2,
      speed: Math.random() * 0.4 + 0.12,
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
        ctx.shadowBlur = 8;
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
    <div className="fixed inset-0 min-h-screen w-screen bg-[#020617] text-white overflow-hidden flex flex-col justify-between select-none font-sans z-50">
      {/* ========================================================================= */}
      {/* BACKGROUND LAYERS */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 w-screen h-screen z-0 overflow-hidden bg-black">
        {/* STANDBY BACKGROUND IMAGE WITH CINEMATIC LIGHTING */}
        <div
          className={`absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] bg-cover bg-center bg-no-repeat transition-opacity duration-1000 transform filter blur-sm scale-102 ${
            launchState === "standby" ? "opacity-40" : "opacity-0 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url(${inaugurationPoster})`,
          }}
        />

        {/* Dynamic Atmospheric Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020817]/95 via-[#020c22]/85 to-[#010614]/95 pointer-events-none" />
        
        {/* Ambient Radial Spotlight Beams */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,163,255,0.22),transparent_70%)] pointer-events-none blur-2xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.12),transparent_70%)] pointer-events-none blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)] pointer-events-none blur-3xl" />

        {/* TIMER / COUNTDOWN VIDEO LAYER (100% Fully Visible during countdown) */}
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
      </div>

      {/* CANVAS FX (Stars & Confetti) */}
      <canvas ref={canvasRef} className="fixed inset-0 w-screen h-screen z-10 pointer-events-none" />

      {/* ========================================================================= */}
      {/* TOP ARCHITECTURAL STAGE HEADER BAR (EDGE-TO-EDGE LUXURY BRANDING) */}
      {/* ========================================================================= */}
      <header className="relative z-30 w-full px-6 sm:px-12 pt-5 pb-3 flex items-center justify-between border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
        {/* Left: College Entity */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-white/95 p-2 sm:p-2.5 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.2)] border border-white/80 shrink-0">
            <img src={srecLogo} alt="SREC Logo" className="h-8 sm:h-11 md:h-12 w-auto object-contain" />
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-[13px] font-black tracking-wider text-white uppercase font-serif">
              Sri Ramakrishna Engineering College
            </span>
            <span className="text-[10px] font-semibold text-cyan-300/90 tracking-widest uppercase">
              Autonomous Institution · Re-Accredited by NAAC with 'A+' Grade
            </span>
          </div>
        </div>

        {/* Center: Stage Status Capsule */}
        <div className="flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/25 to-cyan-500/20 border border-cyan-400/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,210,255,0.25)]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-cyan-200">
              OFFICIAL CEREMONIAL STAGE
            </span>
            <span className="text-white/40 text-[10px]">•</span>
            <span className="text-[10px] font-bold text-amber-300 tracking-wider">
              2026–2027
            </span>
          </div>
        </div>

        {/* Right: IEEE Student Branch & Trust Badges */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex flex-col text-right">
            <span className="text-[12px] font-black tracking-wider text-white uppercase">
              IEEE Student Branch SREC
            </span>
            <span className="text-[10px] font-mono text-cyan-300 tracking-wider">
              STB32131 / STB64071
            </span>
          </div>
          <div className="bg-white/95 p-2 sm:p-2.5 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.2)] border border-white/80 shrink-0">
            <img src={ieeeSrecLogo} alt="IEEE SREC Logo" className="h-8 sm:h-11 md:h-12 w-auto object-contain" />
          </div>
          <div className="bg-white/95 p-2 sm:p-2.5 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.2)] border border-white/80 shrink-0 hidden sm:block">
            <img src={snrLogo} alt="SNR Trust Logo" className="h-8 sm:h-11 md:h-12 w-auto object-contain" />
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN STAGE PRESENTATION CANVAS */}
      {/* ========================================================================= */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 sm:px-8 lg:px-14 py-4 max-w-[1550px] w-full mx-auto">
        <AnimatePresence mode="wait">
          {/* ======================================================================= */}
          {/* STAGE 1: STANDBY CEREMONY DISPLAY (CINEMATIC OPEN STAGE ARCHITECTURE) */}
          {/* ======================================================================= */}
          {launchState === "standby" && (
            <motion.div
              key="standby"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.04 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-full flex flex-col items-center justify-between gap-6 my-auto"
            >
              {/* ── HERO CEREMONIAL TITLES (TOP HERO) ── */}
              <div className="flex flex-col items-center text-center max-w-5xl mx-auto pt-2">
                {/* Gold Crest Ribbon */}
                <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-400/50 text-amber-200 text-xs sm:text-sm font-black uppercase tracking-[0.25em] mb-4 shadow-[0_0_30px_rgba(245,158,11,0.25)] backdrop-blur-md">
                  <Sparkles size={16} className="text-amber-400 animate-spin-slow" />
                  <span>GRAND INAUGURATION &amp; INDUCTION CEREMONY</span>
                  <Sparkles size={16} className="text-amber-400 animate-spin-slow" />
                </div>

                {/* College Super-Title */}
                <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold text-cyan-300 tracking-[0.15em] uppercase font-serif drop-shadow-md mb-2">
                  {config.collegeName}
                </h2>

                {/* Main Majestic Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight uppercase font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-sky-300 drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)] leading-none my-1">
                  {config.title}
                </h1>

                {/* Subtitle / Theme */}
                <p className="text-base sm:text-2xl md:text-3xl text-slate-200 font-medium max-w-4xl tracking-wide leading-relaxed mt-2 drop-shadow-md">
                  {config.subtitle}
                </p>

                {/* Branch Info Bar */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm font-bold text-slate-300 tracking-wider">
                  <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 backdrop-blur-sm">
                    IEEE REGION 10 (ASIA-PACIFIC)
                  </span>
                  <span className="text-cyan-400 font-black">•</span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 backdrop-blur-sm">
                    MADRAS SECTION
                  </span>
                  <span className="text-cyan-400 font-black">•</span>
                  <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/15 backdrop-blur-sm text-cyan-300 font-mono">
                    STB32131
                  </span>
                </div>
              </div>

              {/* ── LOWER WIDE STAGE SHOWCASE (TRIPLE PODIUM GRID) ── */}
              <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 mt-4 items-stretch">
                {/* LEFT PODIUM: CHAPTERS & SOCIETIES (Col 1-4) */}
                <div className="md:col-span-4 rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/15 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,102,204,0.15)] flex flex-col justify-between relative overflow-hidden group hover:border-cyan-400/40 transition-all">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  
                  <div>
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">
                      <Layers size={16} />
                      <span>8 Technical Societies &amp; Affinity Groups</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center my-3">
                      {["CS", "WIE", "EMBS", "COMSOC", "PELS", "IM", "CIS", "CAS"].map(soc => (
                        <div key={soc} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white font-extrabold text-xs tracking-wider shadow-inner group-hover:bg-cyan-500/10 group-hover:border-cyan-400/30 transition-all">
                          {soc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <ShieldCheck size={14} />
                      Office Bearers Induction
                    </span>
                    <span className="font-mono text-cyan-300">2026–2027</span>
                  </div>
                </div>

                {/* CENTER PODIUM: HONORABLE CHIEF GUEST (Col 5-8) - ROYAL GOLD PEDESTAL */}
                <div className="md:col-span-4 rounded-3xl bg-gradient-to-b from-[#0a1b38]/90 via-[#071329]/90 to-[#030914]/95 backdrop-blur-3xl border-2 border-amber-400/50 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(245,158,11,0.25)] flex flex-col items-center text-center justify-center relative overflow-hidden ring-1 ring-amber-300/30">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400" />
                  <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

                  {/* VIP Crown Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-[11px] font-black uppercase tracking-[0.25em] mb-2 shadow-sm">
                    <Crown size={14} className="text-amber-400 animate-pulse" />
                    <span>HONORABLE CHIEF GUEST</span>
                  </div>

                  {/* Dignitary Name */}
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-300 font-serif tracking-wide drop-shadow-lg my-1">
                    {config.chiefGuest}
                  </h3>

                  {/* Dignitary Title */}
                  <p className="text-xs sm:text-sm font-extrabold text-cyan-300 tracking-wider uppercase mt-1 leading-snug">
                    {config.chiefGuestTitle}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-amber-400/20 w-full text-[11px] text-amber-200/90 font-medium">
                    Keynote Address &amp; Official Platform Inauguration
                  </div>
                </div>

                {/* RIGHT PODIUM: LIVE STAGE READINESS (Col 9-12) */}
                <div className="md:col-span-4 rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/15 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,102,204,0.15)] flex flex-col justify-between relative overflow-hidden group hover:border-cyan-400/40 transition-all">
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                  
                  <div>
                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-widest mb-3">
                      <span className="flex items-center gap-1.5 text-cyan-400">
                        <Radio size={16} className="animate-pulse" />
                        Live Stage Signal
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px]">
                        CONNECTED
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-200 mt-2 leading-relaxed">
                      Awaiting remote launch trigger from VIP podium...
                    </p>

                    {/* Animated sound wave bars */}
                    <div className="flex items-center gap-1.5 my-3 h-8 px-3 rounded-xl bg-white/5 border border-white/10">
                      {[40, 75, 100, 60, 85, 45, 90, 70, 95, 50, 80, 65, 90, 40].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-cyan-500 to-sky-300 rounded-full animate-pulse"
                          style={{
                            height: `${h}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: "1.2s"
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-semibold">
                    <span className="text-slate-400">Auditorium Main Feed</span>
                    <span className="font-mono text-cyan-300">srecieee.org</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ======================================================================= */}
          {/* STAGE 2: CEREMONY COUNTDOWN (CINEMATIC STADIUM HUD OVERLAY) */}
          {/* ======================================================================= */}
          {launchState === "countdown" && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="relative flex flex-col items-center justify-center flex-1 w-full my-auto max-w-4xl px-4"
            >
              {/* Massive Stadium Glow HUD */}
              <div className="w-full bg-[#020914]/90 backdrop-blur-3xl border-2 border-cyan-400/80 rounded-3xl p-8 sm:p-12 shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_80px_rgba(0,210,255,0.4)] flex flex-col items-center text-center ring-1 ring-white/20 relative overflow-hidden">
                <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/30 rounded-full blur-3xl pointer-events-none" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 text-xs sm:text-sm font-black uppercase tracking-[0.25em] mb-4 shadow-lg">
                  <Sparkles size={16} className="text-cyan-400 animate-spin" />
                  <span>OFFICIAL INAUGURATION COUNTDOWN</span>
                  <Sparkles size={16} className="text-cyan-400 animate-spin" />
                </div>

                <h2 className="text-xl sm:text-3xl font-black text-white uppercase font-serif tracking-wider mb-4 drop-shadow">
                  IEEE STUDENT BRANCH SREC
                </h2>

                {/* Giant Holographic Number Ring */}
                <div className="relative my-4 flex items-center justify-center">
                  <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 text-slate-950 font-black text-6xl sm:text-8xl md:text-9xl flex items-center justify-center font-serif shadow-[0_0_80px_rgba(245,158,11,0.9)] border-4 border-white">
                    <AnimatePresence mode="popLayout">
                      <motion.span
                        key={countdown}
                        initial={{ scale: 1.8, opacity: 0, rotate: -15 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0.3, opacity: 0, rotate: 15 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        {countdown > 0 ? countdown : "0"}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Widescreen Stadium Progress Bar */}
                <div className="w-full max-w-2xl my-4">
                  <div className="h-4 w-full rounded-full bg-slate-950 border-2 border-white/30 overflow-hidden shadow-inner p-0.5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-400 shadow-[0_0_25px_#00d2ff]"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.max(5, 100 - (countdown / (config.countdownSeconds || 5)) * 100)}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-black text-amber-300 uppercase tracking-widest mt-1">
                  Dr. M. Venkateshkumar · Chairman, IEEE Power &amp; Energy Society
                </p>
              </div>
            </motion.div>
          )}

          {/* ======================================================================= */}
          {/* STAGE 3: INAUGURATED CELEBRATION HUD */}
          {/* ======================================================================= */}
          {launchState === "launched" && (
            <motion.div
              key="launched"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex flex-col items-center justify-center flex-1 w-full my-auto max-w-4xl px-4"
            >
              <div className="w-full bg-[#020914]/95 backdrop-blur-3xl border-2 border-emerald-400 rounded-3xl p-8 sm:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.95),0_0_100px_rgba(16,185,129,0.5)] flex flex-col items-center text-center ring-2 ring-emerald-300/40 relative overflow-hidden">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-500 text-slate-950 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.9)] border-2 border-white mb-5">
                  <CheckCircle2 size={48} className="animate-bounce text-slate-950" />
                </div>

                <div className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-[0.3em] mb-2 drop-shadow">
                  🎉 CEREMONY COMPLETE · OFFICIALLY DEDICATED
                </div>

                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white uppercase font-serif tracking-wide drop-shadow-lg mb-3">
                  WELCOME TO IEEE SREC 2026–2027
                </h1>

                <p className="text-base sm:text-xl text-slate-200 font-medium max-w-2xl leading-relaxed mb-6">
                  The Official Digital Platform &amp; Innovation Ecosystem is now live for all students, faculty, and global members!
                </p>

                {/* Redirect Progress */}
                <div className="w-full max-w-lg mb-4">
                  <div className="h-3 w-full rounded-full bg-slate-950 border border-emerald-500/50 overflow-hidden shadow-inner p-0.5">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 shadow-[0_0_20px_#10b981]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.7, ease: "easeInOut" }}
                    />
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/60 text-cyan-200 text-xs sm:text-sm font-black shadow-lg animate-pulse">
                  <Rocket size={16} className="text-cyan-300 animate-pulse" />
                  <span>Entering Official IEEE SREC Portal...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ========================================================================= */}
      {/* BOTTOM CONTROL & STATUS FOOTER STRIP */}
      {/* ========================================================================= */}
      <footer className="relative z-30 w-full px-6 sm:px-12 py-3 flex items-center justify-between border-t border-white/10 bg-slate-950/40 backdrop-blur-xl text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-emerald-400" />
          <span className="font-semibold text-slate-300">Auditorium Main Stage Display</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">STB32131 Section Madras</span>
        </div>

        {/* Stage Utilities */}
        <div className="flex items-center gap-2">
          {/* Quick Open Website QR Code */}
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-white transition-all border border-cyan-400/40 cursor-pointer flex items-center gap-1.5 font-bold text-xs shadow-[0_0_15px_rgba(0,210,255,0.25)]"
            title="Scan QR to open website"
          >
            <QrCode size={15} className="text-cyan-400" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSoundMuted(!isSoundMuted)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 cursor-pointer"
            title={isSoundMuted ? "Unmute sound FX" : "Mute sound FX"}
          >
            {isSoundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>
      </footer>

      {/* High-Resolution Interactive Page QR Modal */}
      <PageQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        url={typeof window !== "undefined" ? window.location.href : "https://srecieee.org"}
        title="IEEE SREC Digital Platform"
        subtitle="Point your phone camera to open and view the website live on your device"
      />
    </div>
  );
};

export default LaunchPage;
