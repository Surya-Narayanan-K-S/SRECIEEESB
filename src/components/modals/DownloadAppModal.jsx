import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Smartphone, CheckCircle2, X, ExternalLink, ShieldCheck, Share2, Apple, Sparkles, Info } from "lucide-react";
export const DownloadAppModal = ({ isOpen, onClose, }) => {
    const [selectedPlatform, setSelectedPlatform] = useState("android");
    const [copied, setCopied] = useState(false);
    if (!isOpen)
        return null;
    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.origin + "/app");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    const handleDirectApkDownload = () => {
        // Generates/links direct download for Android APK
        const apkUrl = "/app-release.apk"; // Can be hosted in public/ or releases
        const a = document.createElement("a");
        a.href = apkUrl;
        a.download = "SREC_IEEE_SB64581.apk";
        // If local direct file doesn't exist yet, fallback to web app install or PWA
        a.click();
    };
    return (<AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }} className="relative w-full max-w-lg rounded-3xl bg-[#001026] border border-cyan-500/40 p-5 sm:p-6 shadow-[0_25px_80px_rgba(0,0,0,0.85)] text-slate-100 space-y-4 my-auto overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"/>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"/>

          {/* Modal Header */}
          <div className="flex items-start justify-between border-b border-white/10 pb-3 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg">
                <div className="w-full h-full rounded-2xl bg-[#000d20] flex items-center justify-center">
                  <Smartphone size={22} className="text-cyan-300"/>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-white text-base sm:text-lg uppercase tracking-wide">
                    Download SREC IEEE App
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-[8px] border border-cyan-400/40">
                    v1.0 Free
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Digital ID Cards · Member Directory · Technical Societies
                </p>
              </div>
            </div>

            <button onClick={onClose} className="p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors" aria-label="Close modal">
              <X size={18}/>
            </button>
          </div>

          {/* Platform Selector Tabs */}
          <div className="grid grid-cols-4 gap-1.5 bg-[#000814] p-1 rounded-2xl border border-slate-800 relative z-10">
            {[
            { id: "android", label: "Android APK", icon: Download },
            { id: "samsung", label: "Galaxy Store", icon: Sparkles },
            { id: "pwa", label: "Instant PWA", icon: Smartphone },
            { id: "ios", label: "iPhone / iOS", icon: Apple },
        ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedPlatform === tab.id;
            return (<button key={tab.id} onClick={() => setSelectedPlatform(tab.id)} className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all text-center ${isSelected
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-md scale-[1.02]"
                    : "text-slate-400 hover:text-slate-200"}`}>
                  <Icon size={14} className="mb-0.5"/>
                  <span className="text-[9px] font-extrabold uppercase leading-none truncate max-w-full">
                    {tab.label}
                  </span>
                </button>);
        })}
          </div>

          {/* Tab 1: Android Direct APK */}
          {selectedPlatform === "android" && (<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 relative z-10">
              <div className="p-3.5 rounded-2xl bg-[#000814] border border-cyan-500/30 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 shrink-0">
                  <ShieldCheck size={20}/>
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-white">Direct Android Package (.APK)</h4>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Universal package for any Android device (Samsung, OnePlus, Xiaomi, Vivo, Realme, Pixel). No store account required.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                <div>• Package: <strong className="text-white">com.srecieee.app</strong></div>
                <div>• File Size: <strong className="text-cyan-300">~6.8 MB</strong></div>
                <div>• Min Android: <strong className="text-white">Android 8.0+</strong></div>
                <div>• Price: <strong className="text-emerald-400 font-bold">100% Free (₹0)</strong></div>
              </div>

              <div className="flex gap-2 pt-1">
                <button onClick={handleDirectApkDownload} className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(0,210,255,0.4)] flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Download size={16}/>
                  <span>Download APK File</span>
                </button>
              </div>
            </motion.div>)}

          {/* Tab 2: Samsung Galaxy Store */}
          {selectedPlatform === "samsung" && (<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 relative z-10">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#001838] to-[#000814] border border-blue-400/40 flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-300 shrink-0">
                  <Sparkles size={20} className="animate-pulse text-blue-400"/>
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-white">Samsung Galaxy Store</h4>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Official store distribution for all Samsung Galaxy Phones, Foldables, and Galaxy Tab devices.
                  </p>
                </div>
              </div>

              <div className="bg-[#000814] p-3 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <p className="text-slate-300">
                  Search <strong className="text-cyan-300 font-mono">"SREC IEEE"</strong> inside Galaxy Store or tap below:
                </p>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-[10px] text-cyan-300 truncate">
                  samsungapps://ProductDetail/com.srecieee.app
                </div>
              </div>

              <a href="https://galaxystore.samsung.com/detail/com.srecieee.app" target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all">
                <span>Open in Samsung Galaxy Store</span>
                <ExternalLink size={14}/>
              </a>
            </motion.div>)}

          {/* Tab 3: Instant PWA Install */}
          {selectedPlatform === "pwa" && (<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 relative z-10">
              <div className="p-3.5 rounded-2xl bg-[#000814] border border-cyan-500/30 text-xs space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold">
                  <Smartphone size={16}/>
                  <span>Instant Install (Zero Download Waiting)</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Installs directly from your browser to your phone's Home Screen with offline storage and push notifications.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-300 space-y-1">
                  <div>1. Tap the browser menu (<strong className="text-white">⋮</strong> or <strong className="text-white">Share</strong>)</div>
                  <div>2. Select <strong className="text-cyan-300">"Install App"</strong> or <strong className="text-cyan-300">"Add to Home Screen"</strong></div>
                  <div>3. Launch SREC IEEE app from your app drawer anytime!</div>
                </div>
              </div>

              <a href="/app" className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all text-center">
                <span>Launch Web App Mode</span>
                <ExternalLink size={14}/>
              </a>
            </motion.div>)}

          {/* Tab 4: iOS / iPhone Guide */}
          {selectedPlatform === "ios" && (<motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 relative z-10">
              <div className="p-3.5 rounded-2xl bg-[#000814] border border-slate-700 text-xs space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Apple size={16}/>
                  <span>iPhone &amp; iPad Installation</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
                  <p>1. Open this website in <strong className="text-white">Safari</strong>.</p>
                  <p>2. Tap the <strong className="text-cyan-300">Share button</strong> (square with up arrow) at the bottom.</p>
                  <p>3. Scroll down and tap <strong className="text-cyan-300">"Add to Home Screen"</strong>.</p>
                  <p>4. Tap <strong className="text-white">Add</strong> in top right corner. Done!</p>
                </div>
              </div>

              <button onClick={handleCopyLink} className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all">
                {copied ? <CheckCircle2 size={15} className="text-emerald-400"/> : <Share2 size={15}/>}
                <span>{copied ? "Link Copied to Clipboard!" : "Copy App Link for iPhone"}</span>
              </button>
            </motion.div>)}

          {/* Footer Note */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
            <span className="flex items-center gap-1">
              <Info size={12} className="text-cyan-400"/>
              IEEE Student Branch SREC · Code 64581
            </span>
            <button onClick={handleCopyLink} className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold">
              <Share2 size={11}/> Share App Link
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>);
};
export default DownloadAppModal;
