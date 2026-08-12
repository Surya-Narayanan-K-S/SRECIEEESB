import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Capacitor } from "@capacitor/core";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      setIsVisible(false);
      return;
    }

    // Use standard PWA installation prompt for all devices (Android, iOS, Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => {
        setIsVisible(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-6 w-[220px] sm:w-[280px] md:w-auto md:max-w-sm z-[99] bg-[#002855] border border-white/10 text-white p-4 rounded-2xl shadow-2xl flex flex-col gap-3 backdrop-blur-md bg-opacity-95"
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="bg-white/10 p-2.5 rounded-xl text-white">
                <Download size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-sm tracking-wide">
                  Install SREC IEEE
                </h3>
                <p className="text-[11px] text-white/75 mt-0.5">
                  Add to your home screen for fast, offline access!
                </p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/60 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
            >
              <X size={16} />
            </button>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full py-2 bg-white text-[#002855] hover:bg-white/95 active:scale-[0.98] transition-all font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg"
          >
            Install App
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InstallPrompt;
