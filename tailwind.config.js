/** @type {import('tailwindcss').Config} */
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Geist Mono", "JetBrains Mono", "ui-monospace", "monospace"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      // Colours are CSS variables (see index.css) so light/dark themes swap without dark: variants everywhere.
      colors: {
        paper: themed("paper"),
        surface: themed("surface"),
        ink: {
          DEFAULT: themed("ink"),
          soft: themed("ink-soft"),
          muted: themed("ink-muted"),
        },
        line: themed("line"),
        accent: {
          DEFAULT: themed("accent"),
          soft: themed("accent-soft"),
        },
      },
      maxWidth: {
        shell: "72rem",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        // Moves the floor grid toward the viewer by exactly one cell, so the loop is seamless.
        grid: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "0 56px" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        grid: "grid 3s linear infinite",
      },
    },
  },
  plugins: [],
};
