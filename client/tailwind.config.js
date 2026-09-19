/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B1220',
        panel: '#111A2B',
        panelAlt: '#17233A',
        border: '#233150',
        ice: '#5FD8E8',
        muted: '#7E93B8',
        ok: '#22c55e',
        warn: '#eab308',
        crit: '#ef4444',
      },
    },
  },
  plugins: [],
};
