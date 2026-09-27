import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F6F3EC",
          soft: "#EFEAE0",
        },
        ink: {
          DEFAULT: "#1E2A44",
          deep: "#12192B",
          muted: "#4A5568",
        },
        brass: {
          DEFAULT: "#A7823B",
          light: "#C9A46C",
          dark: "#8A6A2E",
        },
        sage: {
          DEFAULT: "#4C7A5D",
        },
        wine: {
          DEFAULT: "#A23E48",
        },
        hairline: {
          DEFAULT: "#D9D3C6",
          dark: "#2A3550",
        },
      },
      fontFamily: {
        display: ["\"Fraunces\"", "ui-serif", "Georgia", "serif"],
        sans: ["\"Inter\"", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18, 25, 43, 0.04)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "swap-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(180deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.35s ease-out",
        "swap-spin": "swap-spin 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
