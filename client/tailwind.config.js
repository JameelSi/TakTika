/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    safelist: [
      {
        pattern: /(bg|border)-(black|white|neutral|red|orange|amber|yellow|lime|green|emerald|cyan|blue|violet|purple|fuchsia|pink|rose)-\d{3}/,
      },
    ],
  theme: {
    extend: {
      colors: {
        ice: '#E8F0F7',
        sky: '#034A6F',
        teal: '#5DA6A7',
      },
      backgroundImage: {
        'loading-bg': "url('assets/loading_bg.png')",
        'lobby-bg': "url('assets/bg_lobby.png')",
        'day-theme': 'linear-gradient(to top, #87ceeb, #e4f1fe)',
        'night-theme': 'linear-gradient(to bottom, #1a1a40, #3a3a75)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
    },
  },
  plugins: [],
}