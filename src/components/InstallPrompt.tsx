import React, { useState, useEffect } from "react";
import { Download, X, Sparkles, Smartphone, Share, PlusSquare, CheckCircle2, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import srecLogo from "@/assets/srec-logo.png";
import ieeeLogo from "@/assets/ieee-logo.png";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Never show inside native Capacitor APK or standalone PWA
    if (Capacitor.isNativePlatform()) {
      return;
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const isMobile = window.innerWidth < 768 || /android|iphone|ipad|ipod|mobile/.test(userAgent);

    // Capture standard PWA install event and automatically trigger on user interaction
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      if (isMobile) {
        setIsVisible(true);

        // Automatically prompt installation upon the very first user tap / gesture
        const autoPromptHandler = async () => {
          try {
            await promptEvent.prompt();
            const { outcome } = await promptEvent.userChoice;
            if (outcome === "accepted") {
              setInstalled(true);
              setIsVisible(false);
              setIsDismissed(true);
            }
          } catch (err) {
            console.log("Auto install prompt note:", err);
          }
        };

        // Attach one-time auto trigger on first screen tap
        window.addEventListener("touchstart", autoPromptHandler, { once: true });
        window.addEventListener("click", autoPromptHandler, { once: true });
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If mobile, show prompt card
    if (isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const [showInstructions, setShowInstructions] = useState(false);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setInstalled(true);
          setTimeout(() => {
            setIsVisible(false);
            setIsDismissed(true);
          }, 2000);
        }
      } catch (err) {
        console.error("Install prompt error", err);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  // If dismissed, show a small floating pill on mobile so user can re-open install popup anytime
  if (isDismissed && !Capacitor.isNativePlatform()) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={() => {
          setIsDismissed(false);
          setIsVisible(true);
        }}
        className="fixed bottom-4 right-4 z-[999] px-3 py-2 rounded-full bg-[#002855] text-white shadow-xl flex items-center gap-1.5 text-xs font-black uppercase tracking-wider border border-white/20 active:scale-95 transition-all md:hidden"
      >
        <Download size={14} className="text-cyan-300 animate-bounce" />
        <span>Install App</span>
      </motion.button>
    );
  }

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-[999] bg-white/95 backdrop-blur-2xl border border-white/80 p-3.5 rounded-3xl shadow-[0_15px_50px_rgba(0,40,85,0.25)] text-slate-900 space-y-2.5 ring-1 ring-black/5 pointer-events-auto font-sans"
      >
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-50 border border-slate-200 shadow-sm shrink-0">
              <img src={srecLogo} alt="SREC" className="h-6 w-auto object-contain" />
              <div className="w-[1px] h-4 bg-slate-300" />
              <img src={ieeeLogo} alt="IEEE" className="h-6 w-auto object-contain" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-black text-[#002855] uppercase tracking-wide">
                  Install SREC IEEE App
                </h4>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[8px] border border-emerald-200">
                  Chrome App
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                Fast 1-tap 3D ID Cards &amp; Offline Directory
              </p>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Chrome Android & iOS Safari Instructions if toggled */}
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-2.5 rounded-2xl bg-blue-50 border border-blue-200 text-[#002855] text-[11px] space-y-1.5"
          >
            {isIOS ? (
              <>
                <p className="font-extrabold flex items-center gap-1 text-[11px]">
                  <Share size={12} /> To Install on iPhone:
                </p>
                <p className="text-[10px] leading-snug">
                  1. Tap <strong>Share</strong> <Share size={10} className="inline mx-0.5" /> in Safari.<br />
                  2. Tap <strong>Add to Home Screen</strong> <PlusSquare size={10} className="inline mx-0.5" />.<br />
                  3. Tap <strong>Add</strong> at top-right.
                </p>
              </>
            ) : (
              <>
                <p className="font-extrabold flex items-center gap-1 text-[11px]">
                  <Smartphone size={12} /> To Install in Chrome on Android:
                </p>
                <p className="text-[10px] leading-snug">
                  1. Tap Chrome menu <strong>(⋮)</strong> at top-right.<br />
                  2. Tap <strong>Install app</strong> (or <strong>Add to Home screen</strong>).<br />
                  3. Tap <strong>Install</strong> to add directly to your app drawer!
                </p>
              </>
            )}

            <div className="pt-1">
              <a
                href="/app"
                className="w-full py-1.5 rounded-xl bg-[#002855] text-white text-center block text-[10px] font-black uppercase tracking-wider shadow-sm hover:bg-[#001c3d] transition-colors"
              >
                Launch Mobile App Now →
              </a>
            </div>
          </motion.div>
        )}

        {/* Actions Row */}
        <div className="flex items-center gap-2 pt-0.5">
          <button
            onClick={handleInstallClick}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#002855] to-[#00629B] hover:from-[#001c3d] hover:to-[#004780] text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Download size={13} />
            <span>{installed ? "Installed!" : deferredPrompt ? "Install Chrome App" : "Install App"}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider transition-colors active:scale-95"
          >
            Later
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallPrompt;

