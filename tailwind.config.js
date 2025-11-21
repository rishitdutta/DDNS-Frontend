/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,svelte}"],
  theme: {
    extend: {
      colors: {
        dark: "#0f0f0f",
        light: "#e0e0e0",
        card: "#1a1a1a",
        "card-dark": "#2a2a2a",
        input: "#242424",
        border: "#2a2a2a",
        primary: "#00b8d4",
        "primary-hover": "#008fa1",
        success: "#00c864",
        error: "#ff4646",
        muted: "#666",
        label: "#a0a0a0",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
