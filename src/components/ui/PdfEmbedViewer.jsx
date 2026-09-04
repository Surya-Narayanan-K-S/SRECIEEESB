import React, { useState, useRef } from "react";
import {
  FileText,
  Download,
  Maximize2,
  Minimize2,
  ExternalLink,
  ShieldCheck,
  Loader2,
  X,
  RefreshCw
} from "lucide-react";

/**
 * Universal In-Website PDF Viewer Component
 * Embeds and displays PDF documents directly inside the web page without navigating
 * away or triggering external PDF viewer tabs.
 */
export const PdfEmbedViewer = ({
  fileUrl,
  title = "Official IEEE Document",
  subtitle = "IEEE Student Branch SREC",
  height = "h-[78vh]",
  showControls = true,
  onClose = null,
  className = "",
  downloadFileName = "IEEE_SREC_Document.pdf"
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const containerRef = useRef(null);

  // Clean URL with inline view parameters (Fit Width & standard toolbar)
  const resolvedUrl = fileUrl ? `${fileUrl}#toolbar=1&navpanes=0&view=FitH` : "";

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setReloadKey(prev => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      className={`w-full rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col transition-all ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen w-screen" : height
      } ${className}`}
    >
      {/* ── Top Header & Control Toolbar ── */}
      {showControls && (
        <div className="bg-gradient-to-r from-[#001838] via-[#002855] to-[#004899] text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 shrink-0 shadow-md select-none">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/10 p-1 flex items-center justify-center border border-white/20 shrink-0">
              <FileText className="text-cyan-300" size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-tight truncate">
                {title}
              </h3>
              <p className="text-[11px] text-sky-200/90 truncate">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Refresh */}
            <button
              type="button"
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/15"
              title="Reload document"
            >
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer border border-white/15 hidden sm:flex items-center justify-center"
              title={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>

            {/* Download */}
            {fileUrl && (
              <a
                href={fileUrl}
                download={downloadFileName}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
                title="Download PDF file"
              >
                <Download size={13} />
                <span className="hidden sm:inline">Download</span>
              </a>
            )}

            {/* Close Button (if inside a modal) */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-white transition-all cursor-pointer border border-red-400/30"
                title="Close viewer"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── In-Website PDF Canvas Container ── */}
      <div className="relative flex-1 w-full bg-slate-900 overflow-hidden flex flex-col">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white">
            <Loader2 className="animate-spin text-cyan-400" size={32} />
            <p className="text-xs font-semibold text-slate-300">Rendering document inside website...</p>
          </div>
        )}

        {/* Embedded PDF Object + Iframe Fallback */}
        {fileUrl ? (
          <object
            key={reloadKey}
            data={resolvedUrl}
            type="application/pdf"
            className="w-full h-full flex-1 border-0"
            onLoad={() => setIsLoading(false)}
          >
            {/* Secondary embedded fallback inside object */}
            <iframe
              src={resolvedUrl}
              title={title}
              className="w-full h-full flex-1 border-0"
              onLoad={() => setIsLoading(false)}
            >
              {/* No-embed browser fallback */}
              <div className="p-8 text-center text-slate-300 flex flex-col items-center justify-center h-full">
                <FileText size={48} className="text-slate-500 mb-3" />
                <p className="font-bold text-sm text-white mb-2">This browser doesn't support inline PDF rendering.</p>
                <a
                  href={fileUrl}
                  download={downloadFileName}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase"
                >
                  Download PDF Instead
                </a>
              </div>
            </iframe>
          </object>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400">
            <FileText size={40} className="mb-2 text-slate-600" />
            <p className="text-sm font-medium">No PDF file URL specified.</p>
          </div>
        )}
      </div>

      {/* ── Official Footer Strip ── */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 select-none">
        <div className="flex items-center gap-1.5 font-medium text-slate-600">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Verified IEEE Document · In-App Secure Viewer</span>
        </div>
        <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
          SREC IEEE SB (STB32131 / 64071)
        </span>
      </div>
    </div>
  );
};

export default PdfEmbedViewer;
