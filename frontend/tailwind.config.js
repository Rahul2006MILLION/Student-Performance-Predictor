/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Replaces Tailwind's default palette so blue/purple cannot appear by accident.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      cream: '#f4efe4',
      ivory: '#fbf9f4',
      sand: '#e6dfd0',
      charcoal: { DEFAULT: '#2b2a27', soft: '#5d5a52', mute: '#8c887d' },
      sage: { 100: '#e4e9dd', 300: '#b7c4a8', 500: '#8a9e78', 700: '#5f7350' },
      olive: { DEFAULT: '#6b6b3a', deep: '#4d4d2a' },
      clay: { DEFAULT: '#9a5b48', soft: '#f1e2db' },
    },
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(43,42,39,.04), 0 12px 32px -12px rgba(43,42,39,.12)',
      },
    },
  },
  plugins: [],
};
