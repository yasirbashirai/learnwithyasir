import type { Config } from "tailwindcss";

/**
 * Palette is bound to CSS variables (see src/index.css) so every utility class
 * — text-ink, bg-surface, border-line, text-teal — automatically responds to
 * light/dark mode. `<alpha-value>` keeps Tailwind's /opacity modifiers working.
 */
const v = (name: string) => `hsl(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: v("bg"),
        surface: { DEFAULT: v("surface"), 2: v("surface-2") },
        ink: v("text"),
        soft: v("text-soft"),
        line: v("border"),
        cream: { DEFAULT: v("surface-2"), muted: v("bg") },
        teal: { DEFAULT: v("teal"), light: v("teal-light"), dark: v("teal") },
        gold: { DEFAULT: v("gold"), light: v("gold"), dark: v("gold") },
      },
      fontFamily: {
        heading: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 4px 18px -6px hsl(var(--teal) / 0.18)",
        card: "0 18px 50px -22px hsl(var(--teal) / 0.32)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        "pop-in": { "0%": { opacity: "0", transform: "scale(0.9)" }, "100%": { opacity: "1", transform: "scale(1)" } },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.32,0.72,0,1) both",
        float: "float 5s ease-in-out infinite",
        "pop-in": "pop-in 0.4s cubic-bezier(0.32,0.72,0,1) both",
      },
    },
  },
  plugins: [],
} satisfies Config;
