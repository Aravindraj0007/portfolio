/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        night: {
          950: "#040713",
          900: "#07101f",
          800: "#0b1730",
        },
        electric: {
          cyan: "#22d3ee",
          blue: "#3b82f6",
          violet: "#8b5cf6",
          pink: "#ec4899",
          mint: "#34d399",
        },
      },
      boxShadow: {
        glow: "0 0 36px rgba(34, 211, 238, 0.22)",
        violetGlow: "0 0 40px rgba(139, 92, 246, 0.22)",
      },
      backgroundImage: {
        grid:
          "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
        "hero-lines":
          "linear-gradient(115deg, rgba(34,211,238,0.15), transparent 34%), linear-gradient(245deg, rgba(139,92,246,0.16), transparent 42%), linear-gradient(180deg, #050816, #07101f 45%, #050816)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        scan: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 8s ease-in-out infinite alternate",
        scan: "scan 4.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
