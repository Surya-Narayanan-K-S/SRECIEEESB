import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Capacitor } from "@capacitor/core";
import srecLogo from "@/assets/srec-logo.png";
import ieeeLogo from "@/assets/ieee-logo.png";
export const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
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
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isMobile = window.innerWidth < 768 || /android|iphone|ipad|ipod|mobile/.test(userAgent);
        // Capture standard PWA install event and automatically prompt to add to app screen
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            const promptEvent = e;
            setDeferredPrompt(promptEvent);
            if (isMobile) {
                setIsVisible(true);
                const autoTriggerAdd = async () => {
                    try {
                        await promptEvent.prompt();
                        const { outcome } = await promptEvent.userChoice;
                        if (outcome === "accepted") {
                            setInstalled(true);
                            setIsVisible(false);
                            setIsDismissed(true);
                        }
                    }
                    catch (err) {
                        console.log("Auto prompt note:", err);
                    }
                };
                // Try immediate trigger after short delay
                setTimeout(() => {
                    autoTriggerAdd().catch(() => { });
                }, 500);
                // Also bind to first interaction
                window.addEventListener("touchstart", autoTriggerAdd, { once: true, passive: true });
                window.addEventListener("pointerdown", autoTriggerAdd, { once: true, passive: true });
                window.addEventListener("click", autoTriggerAdd, { once: true });
            }
        };
        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        // If mobile, show prompt card immediately
        if (isMobile) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 500);
            return () => {
                clearTimeout(timer);
                window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            };
        }
        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);
    const [isPrompting, setIsPrompting] = useState(false);
    const handleInstallClick = async () => {
        // 1. If native beforeinstallprompt is ready, trigger Chrome's installation prompt
        if (deferredPrompt) {
            try {
                await deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === "accepted") {
                    setInstalled(true);
                    setTimeout(() => {
                        setIsVisible(false);
                        setIsDismissed(true);
                    }, 1500);
                }
            }
            catch (err) {
                console.error("Install prompt error", err);
            }
            setDeferredPrompt(null);
            return;
        }
        // 2. If deferredPrompt was not yet captured, listen and prompt as soon as available
        setIsPrompting(true);
        const oneTimePrompt = async (e) => {
            e.preventDefault();
            const promptEvent = e;
            try {
                await promptEvent.prompt();
                const { outcome } = await promptEvent.userChoice;
                if (outcome === "accepted") {
                    setInstalled(true);
                    setTimeout(() => {
                        setIsVisible(false);
                        setIsDismissed(true);
                    }, 1500);
                }
            }
            catch (err) {
                console.log("Install prompt error", err);
            }
            window.removeEventListener("beforeinstallprompt", oneTimePrompt);
            setIsPrompting(false);
        };
        window.addEventListener("beforeinstallprompt", oneTimePrompt, { once: true });
        setTimeout(() => {
            setIsPrompting(false);
        }, 2000);
    };
    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
    };
    // If dismissed, show a small floating pill on mobile so user can install anytime
    if (isDismissed && !Capacitor.isNativePlatform()) {
        return (<motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} onClick={() => {
                setIsDismissed(false);
                setIsVisible(true);
            }} className="fixed bottom-4 right-4 z-[999] px-3 py-2 rounded-full bg-[#002855] text-white shadow-xl flex items-center gap-1.5 text-xs font-black uppercase tracking-wider border border-white/20 active:scale-95 transition-all md:hidden">
        <Download size={14} className="text-cyan-300 animate-bounce"/>
        <span>Install App</span>
      </motion.button>);
    }
    if (!isVisible)
        return null;
    return (<AnimatePresence>
      <motion.div initial={{ opacity: 0, y: 100, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.92 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:w-96 z-[999] bg-white/95 backdrop-blur-2xl border border-white/80 p-3.5 rounded-3xl shadow-[0_15px_50px_rgba(0,40,85,0.25)] text-slate-900 space-y-2.5 ring-1 ring-black/5 pointer-events-auto font-sans">
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-50 border border-slate-200 shadow-sm shrink-0">
              <img src={srecLogo} alt="SREC" className="h-6 w-auto object-contain"/>
              <div className="w-[1px] h-4 bg-slate-300"/>
              <img src={ieeeLogo} alt="IEEE" className="h-6 w-auto object-contain"/>
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1">
                <h4 className="text-xs font-black text-[#002855] uppercase tracking-wide">
                  Install SREC IEEE App
                </h4>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[8px] border border-emerald-200">
                  Direct
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                Fast 1-tap 3D ID Cards &amp; Offline Directory
              </p>
            </div>
          </div>

          <button onClick={handleDismiss} className="p-1 rounded-full text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors shrink-0" aria-label="Close">
            <X size={14}/>
          </button>
        </div>

        {/* Actions Row */}
        <div className="flex items-center gap-2 pt-0.5">
          <button onClick={handleInstallClick} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#002855] to-[#00629B] hover:from-[#001c3d] hover:to-[#004780] text-white font-black text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5">
            <Download size={13}/>
            <span>{installed ? "Installed!" : "Install App"}</span>
          </button>

          <button onClick={handleDismiss} className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider transition-colors active:scale-95">
            Later
          </button>
        </div>
      </motion.div>
    </AnimatePresence>);
};
export default InstallPrompt;
