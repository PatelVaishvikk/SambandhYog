/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./pages/**/*.{js,jsx}", "./app/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F14",
        glass: "rgba(255,255,255,0.08)",
        edge: "rgba(255,255,255,0.12)",
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      boxShadow: {
        glass: "0 10px 30px rgba(0,0,0,0.35)",
      },
      keyframes: {
        aurora: {
          "0%": { transform: "translateY(-10%) translateX(-10%)" },
          "50%": { transform: "translateY(10%) translateX(10%)" },
          "100%": { transform: "translateY(-10%) translateX(-10%)" },
        },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-4px)" } },
        pop:   { "0%": { transform: "scale(.5)", opacity: .2 }, "80%": { transform: "scale(1.15)" }, "100%": { transform: "scale(1)", opacity: 1 } },
        fadeUp:{ "0%": { transform: "translateY(8px)", opacity: 0 }, "100%": { transform: "translateY(0)", opacity: 1 } }
      },
      animation: {
        aurora: "aurora 28s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        pop: "pop .25s ease-out",
        fadeUp: "fadeUp .35s ease-out",
      },
    },
  },
  plugins: [],
};