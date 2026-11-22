/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          charcoal: '#07090e',
          darkCard: '#0f141f',
          darkerCard: '#0a0d14',
          borderDark: '#232938',
          gold: '#c99e32',
          goldLight: '#e4c36d',
          goldHover: '#dfb03e',
          ivory: '#f8f6f0',
          muted: '#9ca3af',
        }
      },
      fontFamily: {
        cinzel: ['var(--font-cinzel)', 'serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};