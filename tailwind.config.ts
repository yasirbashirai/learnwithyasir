import type { Config } from "tailwindcss";

/**
 * learnfromyasir — brand tokens mirror Yasir's teal/cream/gold identity so the
 * LMS feels part of the same family as yasirbashir.com and chatwithyasir.
 */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#288672",
          light: "#36c8a9",
          dark: "#165a4c",
        },
        ink: "#0f2e27",
        cream: {
          DEFAULT: "#f9ebdc",
          muted: "#fdf6ee",
        },
        gold: {
          DEFAULT: "#e2a93c",
          light: "#f7d365",
          dark: "#c89a3c",
        },
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 4px 18px -6px rgba(40,134,114,0.18)",
        card: "0 10px 40px -14px rgba(40,134,114,0.20)",
        glow: "0 0 0 4px rgba(54,200,169,0.15)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.32,0.72,0,1) both",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
