import React, { Component } from "react";
import { AlertTriangle, RefreshCw, Home, Bug, Copy, Check, ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import ieeeLogo from "@/assets/ieees.png";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("IEEE SREC Uncaught Error Boundary:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleCopyDiagnostic = () => {
    const diagnostic = [
      `IEEE SREC Platform Error Diagnostic`,
      `Time: ${new Date().toISOString()}`,
      `URL: ${window.location.href}`,
      `User Agent: ${navigator.userAgent}`,
      `Error: ${this.state.error?.toString()}`,
      `Component Stack: ${this.state.errorInfo?.componentStack || "N/A"}`,
    ].join("\n");

    navigator.clipboard.writeText(diagnostic);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2500);
  };

  handleReportBug = () => {
    const title = encodeURIComponent(`[Bug Report] ${this.state.error?.message || "Runtime Error"}`);
    const body = encodeURIComponent(
      `### Error Description\n${this.state.error?.toString()}\n\n### Page URL\n${window.location.href}\n\n### Stack Trace\n\`\`\`\n${this.state.errorInfo?.componentStack || this.state.error?.stack || "N/A"}\n\`\`\`\n\n### Environment\n${navigator.userAgent}`
    );
    window.open(`https://github.com/Surya-Narayanan-K-S/SRECIEEESB/issues/new?title=${title}&body=${body}`, "_blank");
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#000814] text-white flex flex-col items-center justify-center p-4 sm:p-6 font-sans relative overflow-hidden selection:bg-cyan-500 selection:text-black">
          {/* Ethereal Cyber Light Glows */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="relative z-10 w-full max-w-xl bg-gradient-to-b from-slate-900/90 via-slate-900/95 to-slate-950 border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_80px_rgba(239,68,68,0.15)] backdrop-blur-2xl text-center space-y-6 animate-in fade-in zoom-in-95">
            {/* Shield / Logo Header */}
            <div className="flex flex-col items-center space-y-3">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-amber-500 to-cyan-400 p-0.5 shadow-lg shadow-red-500/20 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center p-2">
                    <img
                      src={ieeeLogo}
                      alt="IEEE SREC"
                      className="w-full h-full object-contain filter drop-shadow"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-red-500 text-white shadow-md">
                  <AlertTriangle size={12} className="stroke-[3]" />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-extrabold tracking-widest uppercase mb-2">
                  <ShieldAlert size={12} /> System Runtime Protection
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-black text-white tracking-tight">
                  Unexpected Error Encountered
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed max-w-md mx-auto">
                  The IEEE SREC portal intercepted a runtime exception. Our automated telemetry has logged this event.
                </p>
              </div>
            </div>

            {/* Error Message Pill */}
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 text-left flex items-start gap-3">
              <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1 font-mono text-xs text-red-200 break-words">
                <p className="font-bold text-red-300">
                  {this.state.error?.name || "Runtime Error"}:
                </p>
                <p className="text-[11px] mt-0.5 text-red-300/80">
                  {this.state.error?.message || "An unknown exception occurred during rendering."}
                </p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-[#00629B] via-cyan-500 to-teal-400 hover:from-[#005282] hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <RefreshCw size={14} />
                <span>Reload Portal</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Home size={14} />
                <span>Return to Home</span>
              </button>
            </div>

            {/* Report Bug & Copy Diagnostics Bar */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <button
                onClick={this.handleReportBug}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 text-xs font-bold transition-colors"
              >
                <Bug size={14} />
                <span>Report Bug on GitHub</span>
              </button>

              <button
                onClick={this.handleCopyDiagnostic}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                {this.state.copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{this.state.copied ? "Copied!" : "Copy Diagnostics"}</span>
              </button>
            </div>

            {/* Technical Stack Trace Accordion */}
            <div className="pt-2 border-t border-slate-800/80 text-left">
              <button
                onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-slate-300 py-1 transition-colors font-mono"
              >
                <span>Technical Stack Trace</span>
                {this.state.showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>

              {this.state.showDetails && (
                <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-400 overflow-x-auto max-h-48 whitespace-pre-wrap">
                  {this.state.errorInfo?.componentStack || this.state.error?.stack || "No additional stack trace available."}
                </div>
              )}
            </div>

            <p className="text-[10px] text-slate-600 font-mono">
              IEEE Student Branch SREC • STB64071 / STB32131
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
