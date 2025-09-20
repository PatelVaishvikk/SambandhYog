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
        brand: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#3730a3",
          900: "#1e1b4b"
        },
        accent: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a"
        },
        night: {
          900: "#040615",
          800: "#06091c",
          700: "#0b1029",
          600: "#111936",
          500: "#1a2447"
        },
        mist: {
          50: "rgba(255,255,255,0.04)",
          100: "rgba(255,255,255,0.07)",
          200: "rgba(148,163,184,0.25)"
        }
      },
      boxShadow: {
        aurora: "0 20px 45px -25px rgba(56, 189, 248, 0.45)",
        surface: "0 18px 38px -20px rgba(15, 23, 42, 0.55)",
        "surface-strong": "0 30px 70px -25px rgba(14, 26, 57, 0.75)"
      },
      borderRadius: {
        fluid: "28px"
      },
      fontFamily: {
        display: ["Geist", "var(--font-geist-sans)", "sans-serif"],
        body: ["Geist", "system-ui", "sans-serif"]
      },
      backdropBlur: {
        xl: "22px"
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.95)" },
          "50%": { opacity: "0.6", transform: "scale(1.05)" }
        }
      },
      animation: {
        "pulse-glow": "pulse-glow 8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};
