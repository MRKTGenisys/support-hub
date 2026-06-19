/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Geist",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      colors: {
        navy: "#00243B",
        "deep-teal": "#005E82",
        teal: "#0097A5",
        aqua: "#88D1CF",
        mist: "#DAD9DC",
        porcelain: "#FCFCFC",
      },
      boxShadow: {
        panel: "0 22px 60px rgba(0, 36, 59, 0.11)",
        tile: "0 14px 34px rgba(0, 36, 59, 0.09)",
        glow:
          "0 0 0 1px rgba(136, 209, 207, 0.24), 0 28px 80px rgba(0, 151, 165, 0.18)",
        soft: "0 18px 50px rgba(0, 36, 59, 0.075)",
      },
    },
  },
  plugins: [],
};
