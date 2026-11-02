/** @type {import('tailwindcss').Config} */
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
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
      },
      animation: {
        marquee: "marquee 40s linear infinite",
      },
    },
  },
  plugins: [],
};
