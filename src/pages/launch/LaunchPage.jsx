import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Rocket,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Shield,
  Zap,
  Radio,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  Globe,
  Award,
  Flame,
  CheckCircle2,
  Maximize2,
  QrCode,
  Share2,
  Smartphone,
  Tv,
  Users
} from "lucide-react";
import { LaunchRemote } from "./LaunchRemote";
import srecLogo from "@/assets/srec-logo.png";
import ieeeSrecLogo from "@/assets/ieees.png";
import snrLogo from "@/assets/snr-trust-logo.png";
import inaugurationPoster from "@/assets/inauguration-2026.jpg";
import launchVideo from "@/assets/launch-video.mp4";

// Curated High-Resolution Background Images for Standby
export const LAUNCH_BG_PRESETS = [
  {
    id: "cyber_nebula",
    name: "Cyber Innovation Nebula",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=85",
    description: "Deep cosmic blue starlight with quantum nebula"
  },
  {
    id: "tech_datacenter",
    name: "Digital Quantum Grid",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=2000&q=85",
    description: "Futuristic glowing matrix architecture"
  },
  {
    id: "campus_aerial",
    name: "SREC Campus & Tech Aurora",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=2000&q=85",
    description: "Modern technological institution night lights"
  },
  {
    id: "ieee_cyan_glow",
    name: "IEEE Cybernetic Horizon",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=2000&q=85",
    description: "Vibrant sapphire blue & cyan digital energy grid"
  }
];

// Curated High-Definition Ambient Tech Video Loops for Countdown
export const LAUNCH_VIDEO_PRESETS = [
  {
    id: "ieee_sb_logo_reveal",
    name: "IEEE SB Logo Reveal (Official Ceremony)",
    url: "/launch-video.mp4",
    poster: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: "tech_particles",
    name: "Cyber Holographic Particles",
    url: "https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-connection-dots-loop-41584-large.mp4",
    poster: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: "deep_space",
    name: "Cosmic Nebula & Starlight",
    url: "https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-star-field-in-outer-space-41539-large.mp4",
    poster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: "circuit_grid",
    name: "Digital Circuit Stream",
    url: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-and-data-31913-large.mp4",
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80"
  },
  {
    id: "cyber_network",
    name: "Global Tech Grid",
    url: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-technology-digital-grid-loop-41587-large.mp4",
    poster: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
  }
];

// Audio Synthesizer using Web Audio API (Zero external assets needed, 100% reliable)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
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

export const LaunchPage = ({ forceMode }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // View Mode: Only show remote if explicitly requested via forceMode="remote" or ?mode=remote
  const isExplicitRemote = forceMode === "remote" || searchParams.get("mode") === "remote" || searchParams.get("view") === "remote";
  const isMobileMode = isExplicitRemote;

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
  const [redirectCountdown, setRedirectCountdown] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showRemoteQrModal, setShowRemoteQrModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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
  }, [loadConfig]);

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

  // Audio mute toggle
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sfx.enabled = next;
    if (next) sfx.init();
  };

  // Start countdown sequence
  const startCountdown = (startSec = 5) => {
    sfx.init();
    setCountdown(startSec);
    setLaunchState("countdown");
  };

  // Trigger grand launch
  const triggerLaunch = () => {
    sfx.playLaunch();
    setLaunchState("launched");
    fireConfetti();
  };

  // Reset launch state
  const resetLaunch = () => {
    setLaunchState("standby");
    setCountdown(config.countdownSeconds || 5);
  };

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
  }, [launchState, countdown]);

  // Auto redirect to Home page after launch celebration
  useEffect(() => {
    if (launchState !== "launched") return;

    const timer = setTimeout(() => {
      navigate("/web?inaugurated=true");
    }, 2600);

    return () => clearTimeout(timer);
  }, [launchState, navigate]);

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

  // Handle Dignitary Touch / Hold Launch
  const startHold = () => {
    sfx.init();
    setGuestHolding(true);
    setHoldProgress(0);
    const step = 4;
    holdIntervalRef.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current);
          startCountdown(config.countdownSeconds || 5);
          return 100;
        }
        return prev + step;
      });
    }, 40);
  };

  const endHold = () => {
    setGuestHolding(false);
    if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };

  // Fullscreen toggle for auditorium projector
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const copyRemoteUrl = () => {
    const url = window.location.origin + "/remote";
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  // =========================================================================
  // IF MOBILE: RENDER ONLY THE MOBILE REMOTE CONTROL!
  // =========================================================================
  if (isMobileMode) {
    return <LaunchRemote onSwitchToStage={() => setForcedView("stage")} />;
  }

  // =========================================================================
  // IF DESKTOP: RENDER THE GRAND STAGE LAUNCH PAGE!
  // =========================================================================
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

      {/* TOP PRESENTATION BAR (CENTERED 3 INSTITUTIONAL LOGOS) */}
      <header className="relative z-20 w-full px-4 sm:px-8 pt-4 pb-2 flex items-center justify-center bg-transparent">
        {/* Three Institutional Logos in Frosted Glass Badge */}
        <div className="flex items-center justify-center gap-4 sm:gap-8 bg-white/[0.96] backdrop-blur-md px-6 sm:px-10 py-2 sm:py-2.5 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6)] border-2 border-white/90">
          <img src={srecLogo} alt="SREC Logo" className="h-7 sm:h-12 md:h-14 w-auto object-contain transition-transform" title="Sri Ramakrishna Engineering College" />
          <div className="w-[1.5px] h-6 sm:h-10 bg-slate-300" />
          <img src={ieeeSrecLogo} alt="IEEE SREC Logo" className="h-7 sm:h-12 md:h-14 w-auto object-contain transition-transform" title="IEEE Student Branch SREC" />
          <div className="w-[1.5px] h-6 sm:h-10 bg-slate-300" />
          <img src={snrLogo} alt="SNR Trust Logo" className="h-7 sm:h-12 md:h-14 w-auto object-contain transition-transform" title="SNR Sons Charitable Trust" />
        </div>
      </header>

      {/* CENTER STAGE CONTENT */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-between text-center px-4 sm:px-8 w-full max-w-[1400px] mx-auto py-3">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STAGE 1: STANDBY / CEREMONY SENTENCES IN EXPANSIVE GLASS CARD */}
          {/* ========================================================================= */}
          {launchState === "standby" && (
            <motion.div
              key="standby"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center flex-1 w-full my-auto"
            >
              {/* Floating Glassmorphism Center Card with Ceremony Sentences */}
              <div className="relative group w-full max-w-5xl rounded-3xl bg-[#030914]/80 backdrop-blur-3xl border-2 border-white/20 p-8 sm:p-14 shadow-[0_30px_100px_rgba(0,0,0,0.9),0_0_80px_rgba(0,210,255,0.25)] ring-1 ring-white/20 overflow-hidden flex flex-col items-center text-center">
                {/* Glass Glow Highlights */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />

                {/* Glowing IEEE Crest / Sparkles */}
                <div className="inline-flex items-center gap-2.5 px-6 py-2 rounded-full bg-cyan-500/15 border border-cyan-400/50 text-cyan-300 text-sm font-black uppercase tracking-[0.2em] mb-6 backdrop-blur-md shadow-inner">
                  <Sparkles size={18} className="text-cyan-400 animate-pulse" />
                  <span>GRAND INAUGURATION CEREMONY</span>
                </div>

                {/* Main Title Sentences */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-200 mb-4 font-serif drop-shadow-lg leading-tight">
                  {config.title}
                </h1>

                <p className="text-lg sm:text-2xl md:text-3xl text-slate-200 max-w-3xl font-medium leading-relaxed mb-6 drop-shadow">
                  {config.subtitle}
                </p>

                <div className="text-xs sm:text-base font-bold text-slate-300 tracking-widest uppercase mb-4 pb-3 border-b border-white/15 w-full max-w-xl">
                  {config.eventNote}
                </div>

                {/* Chief Guest Spotlight Presentation */}
                <div className="px-6 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/15 to-cyan-500/10 border border-cyan-400/40 backdrop-blur-md shadow-lg flex flex-col items-center text-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 mb-1">
                    CHIEF GUEST
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-serif tracking-wide drop-shadow">
                    {config.chiefGuest || "Dr. M. Venkateshkumar"}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-amber-300 tracking-wider uppercase mt-1">
                    {config.chiefGuestTitle || "Chairman, IEEE Power & Energy Society"}
                  </p>
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
