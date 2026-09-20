import React from "react";
import { motion } from "framer-motion";

/**
 * SRiSHTi / Avengers Quantum Holographic Arc-Reactor Engine
 * Interactive Multi-Layered Concentric Rotating Rings & HUD Targeting Core
 */
export const ArcReactorBackdrop = ({ className = "" }) => {
  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0 ${className}`}>
      {/* 10-Layer Quantum Ambience */}
      <div className="absolute inset-0 bg-[#020208]/90 z-0" />
      
      {/* Cyan & Gold Ambient Flare Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/4 right-10 w-[350px] h-[350px] bg-red-600/15 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Cybernetic Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.4)_51%)] bg-[length:100%_4px] opacity-40 z-[1]" />
      
      {/* HUD Hexagonal / Square Matrix Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,240,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,240,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60 z-[1]" />

      {/* Quantum Holographic Arc Reactor Core (SVG concentric rings) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[540px] md:w-[680px] h-[320px] sm:h-[540px] md:h-[680px] flex items-center justify-center opacity-70 z-[2]">
        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-[0_0_40px_rgba(0,240,255,0.8)]">
          {/* Outer Rotating Glyph Ring */}
          <g className="reactor-ring-outer">
            <circle cx="250" cy="250" r="230" fill="none" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="12 8 4 8" opacity="0.6" />
            <circle cx="250" cy="250" r="218" fill="none" stroke="#ffbe30" strokeWidth="1" strokeDasharray="30 15 5 15" opacity="0.5" />
            {/* Tech Notches */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={`outer-${deg}`}
                x1="250"
                y1="12"
                x2="250"
                y2="28"
                stroke="#00f0ff"
                strokeWidth="2.5"
                transform={`rotate(${deg} 250 250)`}
              />
            ))}
          </g>

          {/* Mid Counter-Rotating Circuit Ring */}
          <g className="reactor-ring-mid">
            <circle cx="250" cy="250" r="175" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeDasharray="60 20 10 20" opacity="0.8" />
            <circle cx="250" cy="250" r="160" fill="none" stroke="#ff2b2b" strokeWidth="1.5" strokeDasharray="25 10 5 10" opacity="0.6" />
            {[30, 90, 150, 210, 270, 330].map((deg) => (
              <polygon
                key={`mid-${deg}`}
                points="250,85 244,97 256,97"
                fill="#00f0ff"
                transform={`rotate(${deg} 250 250)`}
              />
            ))}
          </g>

          {/* Inner Fast-Rotating Energy Ring */}
          <g className="reactor-ring-inner">
            <circle cx="250" cy="250" r="115" fill="none" stroke="#ffbe30" strokeWidth="2" strokeDasharray="18 6" opacity="0.85" />
            <circle cx="250" cy="250" r="95" fill="none" stroke="#00f0ff" strokeWidth="2.5" strokeDasharray="40 12" opacity="0.9" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <rect
                key={`inner-${deg}`}
                x="246"
                y="142"
                width="8"
                height="16"
                rx="2"
                fill="#ffbe30"
                transform={`rotate(${deg} 250 250)`}
              />
            ))}
          </g>

          {/* Pulsing Arc Reactor Tesseract Core */}
          <g className="reactor-core-glow">
            <circle cx="250" cy="250" r="60" fill="url(#reactorCoreGlow)" />
            <circle cx="250" cy="250" r="45" fill="none" stroke="#ffffff" strokeWidth="2.5" />
            <polygon points="250,215 280,268 220,268" fill="none" stroke="#00f0ff" strokeWidth="2" />
            <polygon points="250,285 280,232 220,232" fill="none" stroke="#ffbe30" strokeWidth="1.5" opacity="0.8" />
            <circle cx="250" cy="250" r="12" fill="#ffffff" filter="drop-shadow(0 0 15px #00f0ff)" />
          </g>

          {/* Gradients */}
          <defs>
            <radialGradient id="reactorCoreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#00f0ff" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#006699" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020208" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,#020208_90%)] z-[3]" />
    </div>
  );
};

export default ArcReactorBackdrop;
