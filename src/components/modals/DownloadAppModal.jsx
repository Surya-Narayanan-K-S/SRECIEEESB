import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { X, QrCode } from "lucide-react";

export const DownloadAppModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const appUrl = typeof window !== "undefined"
    ? `${window.location.origin}/app`
    : "https://srecieee.org/app";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg">
        {/* Backdrop click to close */}
        <div className="absolute inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-sm rounded-3xl bg-[#000d20] border-2 border-cyan-400/50 p-6 sm:p-7 shadow-[0_25px_90px_rgba(0,0,0,0.9),0_0_50px_rgba(0,210,255,0.3)] text-slate-100 flex flex-col items-center text-center my-auto overflow-hidden z-10 select-none"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>

          {/* Title Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider mb-4 shadow-inner">
            <QrCode size={14} className="text-cyan-400" />
            <span>IEEE SREC MOBILE APP</span>
          </div>

          {/* High-Resolution QR Code */}
          <div className="p-4 rounded-3xl bg-white text-slate-950 shadow-[0_0_40px_rgba(0,210,255,0.45)] border-4 border-cyan-400/80 inline-flex flex-col items-center mb-4">
            <QRCodeSVG
              value={appUrl}
              size={210}
              level="H"
              includeMargin={false}
              imageSettings={{
                src: "/favicon.ico",
                x: undefined,
                y: undefined,
                height: 28,
                width: 28,
                excavate: true,
              }}
            />
          </div>

          {/* Simple Clean Instruction Word */}
          <div className="space-y-1">
            <h4 className="text-sm font-black text-white uppercase tracking-wider">
              SCAN WITH ANY PHONE CAMERA
            </h4>
            <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto">
              Opens the full IEEE SREC Mobile App instantly on your device.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DownloadAppModal;
