import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        ieee: {
          blue: "#00629B",
          dark: "#002855",
          navy: "#001428",
          light: "#00B5E2",
          electric: "#0077C8",
          cyan: "#00D2FF",
          gold: "#FFC72C",
          goldGlow: "#F59E0B",
          goldDark: "#B45309",
        },
      },
      boxShadow: {
        "glow-blue": "0 0 25px -3px rgba(0, 119, 200, 0.45), 0 0 10px -2px rgba(0, 210, 255, 0.3)",
        "glow-gold": "0 0 25px -3px rgba(255, 199, 44, 0.5), 0 0 10px -2px rgba(245, 158, 11, 0.35)",
        "glow-cyan": "0 0 25px -3px rgba(0, 210, 255, 0.5), 0 0 10px -2px rgba(56, 189, 248, 0.35)",
        "glass-card": "0 10px 30px -5px rgba(0, 40, 85, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.8)",
        "glass-card-hover": "0 20px 45px -10px rgba(0, 98, 155, 0.2), 0 0 0 1px rgba(0, 210, 255, 0.35)",
        "elevated-gold": "0 15px 35px -5px rgba(245, 158, 11, 0.3), 0 0 0 1px rgba(255, 199, 44, 0.4)",
      },
      backgroundImage: {
        "gradient-ieee-hero": "linear-gradient(135deg, #001428 0%, #002855 40%, #00629B 80%, #0077C8 100%)",
        "gradient-ieee-card": "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 247, 255, 0.92) 100%)",
        "gradient-ieee-gold": "linear-gradient(135deg, #FFC72C 0%, #F59E0B 50%, #D97706 100%)",
        "gradient-ieee-cyan": "linear-gradient(135deg, #00D2FF 0%, #00B5E2 50%, #00629B 100%)",
        "gradient-radial-at-t": "radial-gradient(ellipse at top, var(--tw-gradient-stops))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Outfit", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        heading: ["Space Grotesk", "Outfit", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-out": {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(10px)" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.04)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(1deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "gradient-x": {
          "0%, 100%": { "background-size": "200% 200%", "background-position": "left center" },
          "50%": { "background-size": "200% 200%", "background-position": "right center" },
        },
        "aurora": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "spin-slow": "spin-slow 20s linear infinite",
        "bounce-subtle": "bounce-subtle 2.5s ease-in-out infinite",
        marquee: "marquee 35s linear infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        "aurora": "aurora 14s ease-in-out infinite",
        enter: "fade-in 0.3s ease-out, scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
