/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/components/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/context/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/hooks/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/lib/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./src/utils/**/*.{js,jsx,ts,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "dawn-sand": "#f9fafb",
        "dawn-haze": "#ffffff",
        "dawn-blush": "#fef3f7",
        "dawn-sky": "#f2f6ff",
        "aura-deep": "#101828",
        aura: {
          soft: "#eef2ff",
          DEFAULT: "#c7d2fe",
          strong: "#a5b4fc"
        },
        lotus: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87"
        },
        sage: {
          50: "#f5fdf7",
          100: "#e7fbef",
          200: "#c9f4dc",
          300: "#a2e6c3",
          400: "#6fd3a5",
          500: "#46ba88",
          600: "#33996f",
          700: "#2d7a5b",
          800: "#255f48",
          900: "#1f4d3b"
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a"
        }
      },
      boxShadow: {
        aura: "0 30px 60px -35px rgba(148, 163, 184, 0.45)",
        "soft-inner": "inset 0 1px 0 rgba(255,255,255,0.9)"
      },
      borderRadius: {
        fluid: "24px"
      },
      fontFamily: {
        display: ["Geist", "var(--font-geist-sans)", "sans-serif"],
        body: ["Geist", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

