import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
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
  Maximize2
} from "lucide-react";

// Default Preset Videos (High quality, freely available ambient tech/particles loops)
export const LAUNCH_VIDEO_PRESETS = [
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

    osc.type = isFinal ? "sawtooth" : "sine";
    osc.frequency.setValueAtTime(isFinal ? 880 : 440 + (10 - step) * 40, this.ctx.currentTime);
    if (isFinal) {
      osc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.4);
    }

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (isFinal ? 0.6 : 0.25));

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + (isFinal ? 0.6 : 0.25));
  }

  playLaunch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    // Sub-bass sweep
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 2.0);

    // Chime chords
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const chordOsc = this.ctx.createOscillator();
      const chordGain = this.ctx.createGain();
      chordOsc.type = "triangle";
      chordOsc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.1);

      chordGain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.1);
      chordGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

      chordOsc.connect(chordGain);
      chordGain.connect(this.ctx.destination);
      chordOsc.start(this.ctx.currentTime + i * 0.1);
      chordOsc.stop(this.ctx.currentTime + 2.5);
    });
  }
}

const sfx = new SoundFX();

export const LaunchPage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({
    title: "IEEE STUDENT BRANCH SREC",
    subtitle: "Official Digital Platform & Innovation Ecosystem Inauguration",
    eventNote: "STB32131 / STB64071 • Sri Ramakrishna Engineering College",
    videoUrl: LAUNCH_VIDEO_PRESETS[0].url,
    countdownSeconds: 5,
    autoRedirect: true,
    redirectUrl: "/web",
    allowGuestTrigger: true,
  });

  // State: "standby" | "countdown" | "launched"
  const [launchState, setLaunchState] = useState("standby");
  const [countdown, setCountdown] = useState(5);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [guestHolding, setGuestHolding] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showRemoteModal, setShowRemoteModal] = useState(false);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const holdIntervalRef = useRef(null);

  // Load config from Supabase / localStorage
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
          videoUrl: confMap.launch_video_url || prev.videoUrl,
          countdownSeconds: Number(confMap.launch_countdown_seconds) || 5,
          redirectUrl: confMap.launch_redirect_url || "/web",
        }));

        if (confMap.launch_state === "countdown" && launchState === "standby") {
          startCountdown(Number(confMap.launch_countdown_seconds) || 5);
        } else if (confMap.launch_state === "launched" && launchState !== "launched") {
          triggerLaunch();
        }
      }
    } catch {
      // Use defaults
    }
  }, [launchState]);

  useEffect(() => {
    loadConfig();

    // Listen for realtime broadcast / channel events
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

    // BroadcastChannel for same-browser multi-tab instant sync
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

    // Polling fallback every 3 seconds
    const interval = setInterval(loadConfig, 3000);

    return () => {
      supabase.removeChannel(channel);
      if (bc) bc.close();
      clearInterval(interval);
    };
  }, [loadConfig]);

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
    setHoldProgress(0);
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

    for (let i = 0; i < 240; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.6,
        vx: (Math.random() - 0.5) * 22,
        vy: (Math.random() - 0.8) * 26,
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
    const step = 4; // 100 / 25 steps = ~1 second hold
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

  return (
    <div className="relative min-h-screen w-full bg-[#050b14] text-white overflow-hidden flex flex-col items-center justify-between select-none font-sans">
      {/* BACKGROUND VIDEO LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          src={config.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? "opacity-35 scale-105" : "opacity-0"
          }`}
        />
        {/* Dynamic Vignette & Dark Cyberpunk Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050b14] via-[#050b14]/70 to-[#050b14]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,102,204,0.18),transparent_70%)]" />
      </div>

      {/* CANVAS FX (Stars & Confetti) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />

      {/* TOP BAR / CONTROLS */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-[#050b14]/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#071326] rounded-[10px] flex items-center justify-center">
              <Zap size={20} className="text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="text-xs font-black tracking-widest uppercase text-cyan-400 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              LIVE LAUNCH SEQUENCE
            </div>
            <div className="text-[11px] font-bold text-slate-400">IEEE SREC • STB32131</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Toggle */}
          <button
            onClick={toggleSound}
            className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition flex items-center gap-2 text-xs font-bold cursor-pointer"
            title="Toggle Sound Effects"
          >
            {soundEnabled ? <Volume2 size={16} className="text-cyan-400" /> : <VolumeX size={16} className="text-slate-500" />}
            <span className="hidden sm:inline">{soundEnabled ? "SFX On" : "SFX Muted"}</span>
          </button>

          {/* Fullscreen Button for Projectors */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            <Maximize2 size={16} />
          </button>

          {/* Quick Remote Toggle */}
          <button
            onClick={() => setShowRemoteModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition cursor-pointer flex items-center gap-1.5"
          >
            <Radio size={14} className="animate-spin text-slate-950" />
            Remote
          </button>
        </div>
      </header>

      {/* CENTER STAGE CONTENT */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto py-8">
        <AnimatePresence mode="wait">
          {/* ========================================================================= */}
          {/* STAGE 1: STANDBY / READY TO LAUNCH */}
          {/* ========================================================================= */}
          {launchState === "standby" && (
            <motion.div
              key="standby"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Glowing IEEE SREC Crest */}
              <div className="relative mb-8 group">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/30 via-blue-600/30 to-purple-600/30 rounded-full blur-2xl animate-pulse" />
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-cyan-400/40 bg-[#071326]/80 backdrop-blur-xl p-3 flex items-center justify-center shadow-2xl shadow-cyan-500/20">
                  <div className="w-full h-full rounded-full border border-dashed border-cyan-500/60 animate-spin-slow flex items-center justify-center p-4">
                    <Rocket size={64} className="text-cyan-400 -rotate-45 drop-shadow-[0_0_20px_rgba(0,210,255,0.6)]" />
                  </div>
                </div>
              </div>

              {/* Title & Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-widest mb-4 backdrop-blur-md">
                <Sparkles size={14} />
                GRAND INAUGURATION CEREMONY
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-cyan-200 mb-4 font-serif">
                {config.title}
              </h1>

              <p className="text-base sm:text-xl text-slate-300 max-w-2xl font-medium leading-relaxed mb-8">
                {config.subtitle}
              </p>

              <div className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-10 pb-4 border-b border-white/10">
                {config.eventNote}
              </div>

              {/* Dignitary Touch & Hold Button */}
              {config.allowGuestTrigger && (
                <div className="flex flex-col items-center gap-3">
                  <div className="text-xs font-bold uppercase tracking-widest text-cyan-400/80">
                    Chief Guest / Dignitary Launch Pad
                  </div>
                  <button
                    onMouseDown={startHold}
                    onMouseUp={endHold}
                    onMouseLeave={endHold}
                    onTouchStart={startHold}
                    onTouchEnd={endHold}
                    className="relative group w-48 h-48 rounded-full bg-gradient-to-b from-cyan-500 to-blue-700 p-[3px] shadow-[0_0_40px_rgba(0,210,255,0.4)] hover:shadow-[0_0_60px_rgba(0,210,255,0.7)] active:scale-95 transition-all cursor-pointer select-none"
                  >
                    <div className="w-full h-full rounded-full bg-[#071326] flex flex-col items-center justify-center p-4 relative overflow-hidden">
                      {/* Hold Progress Fill */}
                      <div
                        className="absolute inset-0 bg-gradient-to-t from-cyan-500/40 via-blue-600/40 to-transparent transition-all duration-75"
                        style={{ height: `${holdProgress}%` }}
                      />

                      <Fingerprint
                        size={48}
                        className={`relative z-10 transition-colors duration-300 ${
                          guestHolding ? "text-white animate-bounce" : "text-cyan-400"
                        }`}
                      />
                      <span className="relative z-10 text-xs font-black uppercase tracking-wider text-white mt-2">
                        {guestHolding ? `${Math.round(holdProgress)}%` : "PRESS & HOLD"}
                      </span>
                      <span className="relative z-10 text-[10px] font-extrabold text-cyan-300/80 uppercase">
                        TO LAUNCH
                      </span>
                    </div>
                  </button>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Hold for 2 seconds to ignite the official launch sequence
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 2: COUNTDOWN IN PROGRESS */}
          {/* ========================================================================= */}
          {launchState === "countdown" && (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-sm font-black uppercase tracking-widest mb-6 animate-pulse">
                <Flame size={16} className="text-red-400" />
                SYSTEM IGNITION IN PROGRESS
              </div>

              {/* Giant Digital Countdown */}
              <div className="relative my-4">
                <div className="absolute -inset-10 bg-cyan-500/30 rounded-full blur-3xl animate-pulse" />
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative text-8xl sm:text-[14rem] font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-200 to-blue-500 drop-shadow-[0_0_40px_rgba(0,210,255,0.8)]"
                >
                  {countdown > 0 ? countdown : "0"}
                </motion.div>
              </div>

              <p className="text-lg sm:text-2xl font-black uppercase tracking-widest text-cyan-300 mt-4 animate-pulse">
                PREPARE FOR DIGITAL INAUGURATION...
              </p>

              <button
                onClick={resetLaunch}
                className="mt-10 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-slate-300 hover:text-white transition flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} /> Abort / Reset Countdown
              </button>
            </motion.div>
          )}

          {/* ========================================================================= */}
          {/* STAGE 3: LAUNCHED & WEBSITE LIVE */}
          {/* ========================================================================= */}
          {launchState === "launched" && (
            <motion.div
              key="launched"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              {/* Success Badge */}
              <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-sm font-black uppercase tracking-widest mb-6 shadow-lg shadow-emerald-500/30">
                <CheckCircle2 size={18} />
                OFFICIALLY INAUGURATED & LIVE
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-amber-200 mb-6 font-serif">
                WELCOME TO THE FUTURE OF IEEE SREC
              </h1>

              <p className="text-lg sm:text-2xl text-slate-200 max-w-3xl font-semibold mb-10 leading-relaxed">
                The new web portal and member intelligence ecosystem is now officially open to all students, faculty, and global researchers.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  onClick={() => navigate(config.redirectUrl || "/web")}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-base uppercase tracking-wider shadow-2xl shadow-cyan-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Globe size={20} />
                  <span>Enter Official Website</span>
                  <ChevronRight size={20} />
                </button>

                <button
                  onClick={() => navigate("/student-portal")}
                  className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base transition hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 backdrop-blur-md"
                >
                  <Award size={20} className="text-cyan-400" />
                  <span>Student Portal & ID Cards</span>
                </button>
              </div>

              <div className="mt-12">
                <button
                  onClick={resetLaunch}
                  className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-1.5 transition"
                >
                  <RotateCcw size={12} /> Reset Launch Screen
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="relative z-20 w-full px-6 py-4 border-t border-white/10 backdrop-blur-md bg-[#050b14]/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2 font-bold">
          <span>IEEE Student Branch</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Sri Ramakrishna Engineering College</span>
        </div>
        <div className="text-[11px] font-semibold text-slate-500">
          Powered by IEEE SREC Web &amp; Technical Operations Team
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* ADMIN REMOTE MODAL (Quick Trigger from Launch Page) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showRemoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-[#0a1628] border-2 border-cyan-500/40 p-6 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2">
                  <Radio size={18} className="text-cyan-400 animate-pulse" />
                  <h3 className="text-base font-black text-white uppercase tracking-wider">
                    Stage Launch Remote
                  </h3>
                </div>
                <button
                  onClick={() => setShowRemoteModal(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300">
                  Current Status:{" "}
                  <span className="font-extrabold text-cyan-400 uppercase">{launchState}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      startCountdown(10);
                      setShowRemoteModal(false);
                    }}
                    className="p-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer flex flex-col items-center gap-1 shadow-md"
                  >
                    <Flame size={18} />
                    <span>10s Countdown</span>
                  </button>

                  <button
                    onClick={() => {
                      startCountdown(5);
                      setShowRemoteModal(false);
                    }}
                    className="p-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer flex flex-col items-center gap-1 shadow-md"
                  >
                    <Zap size={18} />
                    <span>5s Countdown</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    triggerLaunch();
                    setShowRemoteModal(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} />
                  <span>Instant Grand Launch</span>
                </button>

                <button
                  onClick={() => {
                    resetLaunch();
                    setShowRemoteModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <RotateCcw size={14} /> Reset State to Standby
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LaunchPage;
