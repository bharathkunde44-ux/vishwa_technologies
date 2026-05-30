/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        midnight: "#050b1f",
        navy: "#071229",
        electric: "#38bdf8",
        royal: "#2563eb",
      },
      boxShadow: {
        glow: "0 0 45px rgba(56, 189, 248, 0.28)",
        glass: "0 24px 80px rgba(0, 0, 0, 0.35)",
      },
      fontFamily: {
        display: ["Inter", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};
