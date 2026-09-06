import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LAUNCH_BG_PRESETS, LAUNCH_VIDEO_PRESETS } from "@/pages/launch/launchPresets";
import {
  Rocket,
  Radio,
  Power,
  Play,
  RotateCcw,
  Sparkles,
  Video,
  Settings2,
  ExternalLink,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Volume2,
  Tv,
  CheckCircle2,
  AlertTriangle,
  MonitorPlay,
  Zap,
  Globe,
  Film,
  Image as ImageIcon,
  Smartphone,
  Share2,
  QrCode
} from "lucide-react";

export const LaunchControlRoom = () => {
  // Master Switch & State
  const [isLaunchModeActive, setIsLaunchModeActive] = useState(false);
  const [launchState, setLaunchState] = useState("standby"); // "standby" | "countdown" | "launched"
  const [isArmed, setIsArmed] = useState(false);
  const [selectedCountdown, setSelectedCountdown] = useState(5);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copiedRemoteUrl, setCopiedRemoteUrl] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    title: "IEEE STUDENT BRANCH SREC",
    subtitle: "Official Digital Platform & Innovation Ecosystem Inauguration",
    eventNote: "STB32131 / STB64071 • Sri Ramakrishna Engineering College",
    chiefGuest: "Dr. M. Venkateshkumar",
    chiefGuestTitle: "Chairman, IEEE Power and Electronics Society",
    bgImageUrl: LAUNCH_BG_PRESETS[0].url,
    videoUrl: LAUNCH_VIDEO_PRESETS[0].url,
    redirectUrl: "/web",
    countdownSeconds: 5,
    allowGuestTrigger: "true",
  });

  // Load configuration from Supabase
  const loadConfig = async () => {
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

        setIsLaunchModeActive(confMap.launch_active === "true");
        setLaunchState(confMap.launch_state || "standby");
        setSettings(prev => ({
          ...prev,
          title: confMap.launch_title || prev.title,
          subtitle: confMap.launch_subtitle || prev.subtitle,
          eventNote: confMap.launch_note || prev.eventNote,
          chiefGuest: confMap.launch_chief_guest || prev.chiefGuest,
          chiefGuestTitle: confMap.launch_chief_guest_title || prev.chiefGuestTitle,
          bgImageUrl: confMap.launch_bg_image_url || prev.bgImageUrl,
          videoUrl: confMap.launch_video_url || prev.videoUrl,
          redirectUrl: confMap.launch_redirect_url || prev.redirectUrl,
          countdownSeconds: Number(confMap.launch_countdown_seconds) || 5,
          allowGuestTrigger: confMap.launch_guest_trigger || "true",
        }));
      }
    } catch {
      // Use local defaults
    }
  };

  useEffect(() => {
    loadConfig();

    // Listen to realtime updates from other devices / remotes
    const channel = supabase
      .channel("launch_control_room")
      .on("broadcast", { event: "launch_event" }, payload => {
        const { action, countdown } = payload.payload || {};
        if (action === "countdown") {
          setLaunchState("countdown");
        } else if (action === "instant_launch") {
          setLaunchState("launched");
        } else if (action === "reset") {
          setLaunchState("standby");
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Save specific key
  const saveKey = async (contentKey, contentText) => {
    try {
      const { error } = await supabase.from("page_content").upsert({
        page_key: "launch_config",
        content_key: contentKey,
        content_text: String(contentText),
      }, { onConflict: "page_key,content_key" });

      if (error) {
        await supabase.from("page_content").delete().match({ page_key: "launch_config", content_key: contentKey });
        await supabase.from("page_content").insert([{
          page_key: "launch_config",
          content_key: contentKey,
          content_text: String(contentText),
        }]);
      }
    } catch {
      // Local sync fallback
    }
  };

  // Broadcast Launch Event to all open screens
  const broadcastLaunch = async (action, countdown = 5) => {
    // 1. Supabase Realtime Broadcast
    try {
      const channel = supabase.channel("launch_control_room");
      channel.subscribe(status => {
        if (status === "SUBSCRIBED") {
          channel.send({
            type: "broadcast",
            event: "launch_event",
            payload: { action, countdown },
          });
        }
      });
    } catch {
      // Ignore broadcast errors
    }

    // 2. BroadcastChannel (Instant same-browser sync across tabs & projector windows)
    if (typeof BroadcastChannel !== "undefined") {
      const bc = new BroadcastChannel("ieee_launch_channel");
      bc.postMessage({ action, countdown });
      bc.close();
    }

    // 3. Persist State in DB
    const stateValue = action === "countdown" ? "countdown" : action === "instant_launch" ? "launched" : "standby";
    setLaunchState(stateValue);
    await saveKey("launch_state", stateValue);
    if (action === "countdown") {
      await saveKey("launch_countdown_seconds", countdown);
    }
  };

  // Master Launch Mode Toggle
  const handleToggleLaunchMode = async (enabled) => {
    setIsLaunchModeActive(enabled);
    localStorage.setItem("ieee_launch_mode_active", enabled ? "true" : "false");
    await saveKey("launch_active", enabled ? "true" : "false");
  };

  // Save All Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await Promise.all([
        saveKey("launch_title", settings.title),
        saveKey("launch_subtitle", settings.subtitle),
        saveKey("launch_note", settings.eventNote),
        saveKey("launch_chief_guest", settings.chiefGuest),
        saveKey("launch_chief_guest_title", settings.chiefGuestTitle),
        saveKey("launch_bg_image_url", settings.bgImageUrl),
        saveKey("launch_video_url", settings.videoUrl),
        saveKey("launch_redirect_url", settings.redirectUrl),
        saveKey("launch_countdown_seconds", settings.countdownSeconds),
        saveKey("launch_guest_trigger", settings.allowGuestTrigger),
      ]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert("Error saving launch settings: " + (err?.message || "Check connection"));
    } finally {
      setIsSaving(false);
    }
  };

  const copyRemoteUrl = () => {
    const url = (typeof window !== "undefined" ? window.location.origin : "https://srecieee.org") + "/remote";
    navigator.clipboard.writeText(url).then(() => {
      setCopiedRemoteUrl(true);
      setTimeout(() => setCopiedRemoteUrl(false), 2500);
    });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-widest mb-2">
            <Radio size={13} className="animate-pulse" />
            MISSION CONTROL &amp; AUDITORIUM LAUNCH
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 font-serif">
            Launch Control Room &amp; Remote Hub
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Control the official website grand inauguration ceremony. On Desktop, displays the presentation stage with background image on standby and dynamic video on timer; on Mobile, displays the dedicated stage remote.
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/stage"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition flex items-center gap-2"
          >
            <MonitorPlay size={16} />
            <span>Open Stage View (/stage)</span>
            <ExternalLink size={14} />
          </a>

          <a
            href="/remote"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-cyan-500/30 font-black text-xs uppercase tracking-wider transition flex items-center gap-2"
          >
            <Smartphone size={16} />
            <span>Open Mobile Remote (/remote)</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: MASTER LAUNCH MODE STATUS & INTERLOCK */}
      {/* ========================================================================= */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Card 1: Master Launch Mode Switch */}
        <div className="rounded-3xl border border-slate-800 bg-[#0c1626] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Power size={14} className={isLaunchModeActive ? "text-emerald-400" : "text-slate-500"} />
                MASTER LAUNCH GATEWAY
              </span>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider border ${isLaunchModeActive
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                  }`}
              >
                {isLaunchModeActive ? "GATEWAY ACTIVE" : "GATEWAY OFF"}
              </span>
            </div>

            <h3 className="text-lg font-black text-white">Public Launch Gate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When switched <strong>ON</strong>, visitors arriving at the root domain will be held at the Grand Inauguration Screen (Desktop) or Mobile Remote (Phone) until the launch trigger is fired.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              {isLaunchModeActive ? "Launch Gate Enabled" : "Normal Website Mode"}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isLaunchModeActive}
                onChange={(e) => handleToggleLaunchMode(e.target.checked)}
              />
              <div className="w-12 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
          </div>
        </div>

        {/* Card 2: Live Stage Status */}
        <div className="rounded-3xl border border-slate-800 bg-[#0c1626] p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Tv size={14} className="text-cyan-400" />
              STAGE BROADCAST STATUS
            </span>
            <div className="flex items-center gap-3 pt-2">
              <div
                className={`w-4 h-4 rounded-full ${launchState === "countdown"
                    ? "bg-red-500 animate-ping"
                    : launchState === "launched"
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-cyan-400"
                  }`}
              />
              <span className="text-2xl font-black text-white uppercase font-mono tracking-wider">
                {launchState}
              </span>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              {launchState === "standby"
                ? "Desktop screen is showing Background Image in Standby. Dignitaries and audience see the Inauguration Pad."
                : launchState === "countdown"
                  ? "Countdown in progress! Dynamic Background Video & Ignition audio sirens active on desktop."
                  : "Official Launch Complete! Confetti & live website portal unlocked on stage."}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Emergency Reset</span>
            <button
              onClick={() => broadcastLaunch("reset")}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} /> Reset Stage
            </button>
          </div>
        </div>

        {/* Card 3: Remote Safety Lock */}
        <div className="rounded-3xl border border-slate-800 bg-[#0c1626] p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield size={14} className={isArmed ? "text-amber-400" : "text-blue-400"} />
              SAFETY INTERLOCK
            </span>
            <div className="flex items-center gap-2 pt-1">
              {isArmed ? (
                <ShieldAlert size={26} className="text-amber-400 animate-bounce" />
              ) : (
                <ShieldCheck size={26} className="text-blue-400" />
              )}
              <span className={`text-xl font-black ${isArmed ? "text-amber-400" : "text-slate-300"}`}>
                {isArmed ? "REMOTE ARMED" : "REMOTE LOCKED"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isArmed
                ? "Safety key is disengaged. Firing buttons below are live!"
                : "Safety key is locked to prevent accidental triggers during speeches."}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">
              {isArmed ? "Arm Switch (Live)" : "Disarm Switch (Safe)"}
            </span>
            <button
              onClick={() => setIsArmed(!isArmed)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${isArmed
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
            >
              {isArmed ? "Lock Safety" : "Unlock to Arm"}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: INTERACTIVE HARDWARE LAUNCH REMOTE & MOBILE HANDOFF */}
      {/* ========================================================================= */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Remote Trigger Controls */}
        <div className="lg:col-span-2 rounded-3xl border-2 border-cyan-500/30 bg-gradient-to-b from-[#0e1e36] to-[#081220] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Info */}
            <div className="space-y-4 max-w-md text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-extrabold uppercase">
                <Zap size={14} className="text-cyan-400" />
                TACTICAL STAGE CONTROLLER
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-serif">
                Master Stage Trigger Remote
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                When the Chief Guest finishes their address, use this remote or the mobile controller to fire the synchronized audio-visual countdown and switch the background video on stage.
              </p>

              {/* Countdown Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Countdown Duration:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[3, 5, 10, 15].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSelectedCountdown(sec)}
                      className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${selectedCountdown === sec
                          ? "bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30 scale-105"
                          : "bg-slate-800/80 text-slate-300 border border-slate-700 hover:bg-slate-700"
                        }`}
                    >
                      {sec} Seconds
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Remote Physical Controls */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4 bg-[#050b14]/70 p-6 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
              {/* Big Trigger Button */}
              <div className="flex flex-col items-center gap-2">
                <button
                  disabled={!isArmed}
                  onClick={() => broadcastLaunch("countdown", selectedCountdown)}
                  className={`relative group w-36 h-36 sm:w-40 sm:h-40 rounded-full p-[4px] transition-all select-none ${isArmed
                      ? "bg-gradient-to-b from-red-500 via-orange-500 to-amber-600 shadow-[0_0_50px_rgba(239,68,68,0.6)] hover:shadow-[0_0_70px_rgba(239,68,68,0.9)] hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
                      : "bg-slate-800 opacity-40 cursor-not-allowed"
                    }`}
                >
                  <div className="w-full h-full rounded-full bg-gradient-to-b from-[#1a0808] to-[#2a0c0c] flex flex-col items-center justify-center p-3 text-center border-2 border-red-500/40">
                    <Flame size={36} className={isArmed ? "text-red-400 animate-bounce" : "text-slate-500"} />
                    <span className="text-xs font-black uppercase tracking-wider text-white mt-1">
                      START COUNTDOWN
                    </span>
                    <span className="text-[10px] font-bold text-red-300/80 uppercase">
                      ({selectedCountdown}s Video Ignition)
                    </span>
                  </div>
                </button>
                <span className="text-[11px] font-bold text-slate-400">
                  {isArmed ? "Ready to Fire" : "Unlock Safety to Fire"}
                </span>
              </div>

              {/* Quick Action Side Buttons */}
              <div className="flex flex-col gap-2.5 w-full sm:w-48">
                <button
                  disabled={!isArmed}
                  onClick={() => broadcastLaunch("instant_launch")}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 ${isArmed
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25 cursor-pointer"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                >
                  <Sparkles size={16} />
                  <span>Instant Launch</span>
                </button>

                <button
                  onClick={() => broadcastLaunch("reset")}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>Reset to Standby</span>
                </button>

                <a
                  href="/stage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-white border border-cyan-500/20 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
                >
                  <Tv size={14} />
                  <span>Open Projector</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Remote QR Card */}
        <div className="rounded-3xl border border-slate-800 bg-[#0c1626] p-6 shadow-xl flex flex-col justify-between items-center text-center">
          <div className="w-full flex flex-col items-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-widest mb-3">
              <QrCode size={13} />
              PHONE REMOTE ACCESS
            </div>
            <h4 className="text-base font-black text-white mb-1">Pass Remote to Dignitary</h4>
            <p className="text-xs text-slate-400 mb-4">
              Scan this QR code with any smartphone to open the Chief Guest touch controller.
            </p>

            <div className="bg-white p-3 rounded-2xl inline-block shadow-lg mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                  (typeof window !== "undefined" ? window.location.origin : "https://srecieee.org") + "/remote"
                )}`}
                alt="Mobile Remote QR Code"
                className="w-32 h-32 object-contain"
              />
            </div>
          </div>

          <div className="w-full space-y-2">
            <button
              onClick={copyRemoteUrl}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedRemoteUrl ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              <span>{copiedRemoteUrl ? "Remote URL Copied!" : "Copy Remote URL (/remote)"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: VISUAL ASSETS (STANDBY IMAGE & COUNTDOWN VIDEO) */}
      {/* ========================================================================= */}
      <form onSubmit={handleSaveSettings} className="rounded-3xl border border-slate-800 bg-[#0c1626] p-6 sm:p-8 shadow-xl space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Settings2 size={20} className="text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Visual Customization (Standby Image &amp; Timer Video)</h3>
          </div>
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 size={13} /> Settings Saved
            </span>
          )}
        </div>

        {/* 1. STANDBY BACKGROUND IMAGE CONFIG */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <ImageIcon size={14} /> 1. Standby State Background Image (Shown on Desktop before countdown)
            </label>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an ambient inaugural backdrop wallpaper or provide a custom image URL.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LAUNCH_BG_PRESETS.map((preset) => {
              const isSelected = settings.bgImageUrl === preset.url;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSettings({ ...settings, bgImageUrl: preset.url })}
                  className={`group relative rounded-2xl border p-3 cursor-pointer transition-all overflow-hidden ${isSelected
                      ? "border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60"
                    }`}
                >
                  <div className="h-24 rounded-xl overflow-hidden mb-2 relative bg-slate-950">
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    {isSelected && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-cyan-500 text-slate-950 font-black text-[10px] uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white">{preset.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{preset.description}</div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Custom Standby Background Image URL
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... or https://your-domain.com/wallpaper.jpg"
              value={settings.bgImageUrl}
              onChange={(e) => setSettings({ ...settings, bgImageUrl: e.target.value })}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* 2. TIMER / COUNTDOWN VIDEO CONFIG */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-red-400 flex items-center gap-1.5">
              <Video size={14} /> 2. Countdown Timer Video (Plays dynamically when ignition sequence is fired)
            </label>
            <p className="text-xs text-slate-400 mt-0.5">
              Select an ambient high-tech particle/cosmic loop or provide a custom direct MP4 video link.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {LAUNCH_VIDEO_PRESETS.map((preset) => {
              const isSelected = settings.videoUrl === preset.url;
              return (
                <div
                  key={preset.id}
                  onClick={() => setSettings({ ...settings, videoUrl: preset.url })}
                  className={`group relative rounded-2xl border p-3 cursor-pointer transition-all overflow-hidden ${isSelected
                      ? "border-red-400 bg-red-500/10 shadow-lg shadow-red-500/20 ring-1 ring-red-400"
                      : "border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/60"
                    }`}
                >
                  <div className="h-24 rounded-xl overflow-hidden mb-2 relative bg-slate-950">
                    <img src={preset.poster} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    {isSelected && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-red-500 text-slate-950 font-black text-[10px] uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white">{preset.name}</div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Custom MP4 Video URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://assets.mixkit.co/... or https://your-domain.com/video.mp4"
              value={settings.videoUrl}
              onChange={(e) => setSettings({ ...settings, videoUrl: e.target.value })}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white font-mono placeholder:text-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        {/* 3. CEREMONY TEXT & DESTINATION */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ceremony Main Title
              </label>
              <input
                type="text"
                value={settings.title}
                onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white font-bold focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Branch Tagline / Subtitle
              </label>
              <input
                type="text"
                value={settings.subtitle}
                onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white font-medium focus:border-cyan-400 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Chief Guest Name
              </label>
              <input
                type="text"
                value={settings.chiefGuest}
                onChange={(e) => setSettings({ ...settings, chiefGuest: e.target.value })}
                className="rounded-xl border border-amber-500/40 bg-slate-900 px-4 py-3 text-sm text-white font-bold focus:border-amber-400 focus:outline-none"
                placeholder="Dr. M. Venkateshkumar"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Chief Guest Designation
              </label>
              <input
                type="text"
                value={settings.chiefGuestTitle}
                onChange={(e) => setSettings({ ...settings, chiefGuestTitle: e.target.value })}
                className="rounded-xl border border-amber-500/40 bg-slate-900 px-4 py-3 text-sm text-white font-medium focus:border-amber-400 focus:outline-none"
                placeholder="Chairman, IEEE Power and Electronics Society"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Event Details / Affiliation Line
              </label>
              <input
                type="text"
                value={settings.eventNote}
                onChange={(e) => setSettings({ ...settings, eventNote: e.target.value })}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white font-medium focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Destination URL After Launch
              </label>
              <input
                type="text"
                value={settings.redirectUrl}
                onChange={(e) => setSettings({ ...settings, redirectUrl: e.target.value })}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                placeholder="/web"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? "Saving Configuration..." : "Save Launch Configuration"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LaunchControlRoom;
