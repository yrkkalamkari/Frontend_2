/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF3E7",
        beige: "#F3E4D0",
        brown: "#7B2632",
        brownDark: "#5E1E28",
        navy: "#23233B",
        gold: "#C89B3C",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        xl2: "18px",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(59, 42, 34, 0.08)",
        softer: "0 2px 10px rgba(59, 42, 34, 0.05)",
      },
      keyframes: {
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: { shimmer: "shimmer 1.5s infinite" },
    },
  },
  plugins: [],
};
