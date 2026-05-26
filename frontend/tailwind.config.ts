import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: {
          950: "#02040a",
          900: "#050b14",
          800: "#0a1324",
          700: "#111c33",
        },
        neon: {
          blue: "#3b82f6",
          purple: "#8b5cf6",
          green: "#10b981",
          cyan: "#06b6d4",
          teal: "#14b8a6",
          pink: "#ec4899",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        "scanner-sweep": "linear-gradient(to bottom, transparent, rgba(6, 182, 212, 0.4) 50%, transparent)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "sweep": "sweep 2s linear infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(6, 182, 212, 0.15)" },
          "100%": { boxShadow: "0 0 25px rgba(6, 182, 212, 0.5), 0 0 45px rgba(139, 92, 246, 0.2)" },
        },
        sweep: {
          "0%": { top: "-100%" },
          "100%": { top: "200%" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        }
      }
    },
  },
  plugins: [],
};
export default config;
