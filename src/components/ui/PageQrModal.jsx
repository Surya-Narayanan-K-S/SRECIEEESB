import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  X,
  Download,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Smartphone,
  Globe,
  Radio,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import ieeeSrecLogo from "@/assets/ieees.png";

/**
 * High-Resolution QR Code Presentation Modal & Drawer
 * Generates instant, scannable QR codes for opening the website, stage, remote, or any current page.
 */
export const PageQrModal = ({
  isOpen,
  onClose,
  url = typeof window !== "undefined" ? window.location.href : "https://srecieee.org",
  title = "Scan to Open IEEE SREC",
  subtitle = "Point your smartphone camera to instantly access the live platform"
}) => {
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState("current");
  const canvasRef = useRef(null);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://srecieee.org";

  const targetUrl = activePreset === "home"
    ? `${baseUrl}/`
    : activePreset === "stage"
    ? `${baseUrl}/stage`
    : activePreset === "remote"
    ? `${baseUrl}/remote`
    : activePreset === "document"
    ? `${baseUrl}/document`
    : url;

  const handleCopy = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const canvas = document.getElementById("qr-canvas-download");
    if (!canvas) {
      toast.error("Could not find QR canvas for download");
      return;
    }
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `IEEE_SREC_QR_${activePreset}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    toast.success("QR Code downloaded successfully!");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-[#040c1e] border-2 border-cyan-400/40 rounded-3xl p-6 sm:p-7 shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_60px_rgba(0,210,255,0.25)] text-white overflow-hidden flex flex-col items-center"
        >
          {/* Top subtle glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer border border-white/10"
            title="Close modal"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-[10px] font-black uppercase tracking-widest mb-2">
              <Sparkles size={12} className="text-cyan-400 animate-pulse" />
              <span>LIVE INSTANT ACCESS QR</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white uppercase font-serif tracking-wide">
              {title}
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto font-medium">
              {subtitle}
            </p>
          </div>

          {/* Preset Selector */}
          <div className="w-full flex items-center justify-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 mb-4 text-[11px] font-bold">
            <button
              onClick={() => setActivePreset("current")}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                activePreset === "current"
                  ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              This Page
            </button>
            <button
              onClick={() => setActivePreset("home")}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                activePreset === "home"
                  ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Website
            </button>
            <button
              onClick={() => setActivePreset("stage")}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                activePreset === "stage"
                  ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Stage
            </button>
            <button
              onClick={() => setActivePreset("remote")}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                activePreset === "remote"
                  ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Remote
            </button>
          </div>

          {/* QR Code Canvas Display (High-Contrast White Tile) */}
          <div className="relative p-4 rounded-2xl bg-white shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-slate-100 flex items-center justify-center">
            <QRCodeSVG
              value={targetUrl}
              size={200}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: ieeeSrecLogo,
                x: undefined,
                y: undefined,
                height: 42,
                width: 42,
                excavate: true,
              }}
            />

            {/* Hidden Canvas for High-Res PNG Download */}
            <div className="hidden">
              <QRCodeCanvas
                id="qr-canvas-download"
                value={targetUrl}
                size={600}
                level="H"
                includeMargin={true}
                imageSettings={{
                  src: ieeeSrecLogo,
                  x: undefined,
                  y: undefined,
                  height: 120,
                  width: 120,
                  excavate: true,
                }}
              />
            </div>
          </div>

          {/* Target URL Display & Quick Actions */}
          <div className="w-full mt-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-cyan-300">
              <span className="truncate">{targetUrl}</span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0"
                title="Copy URL"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <Download size={15} />
                <span>Save QR Image</span>
              </button>

              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-white/15 cursor-pointer shrink-0"
                title="Open in new tab"
              >
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PageQrModal;
