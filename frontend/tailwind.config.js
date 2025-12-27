/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: '#0a0a0a',
          dark: '#121212',
          gray: '#1f1f1f',
          neon: '#00f3ff', // Cyan
          pink: '#ff00ff', // Neon Pink
          yellow: '#fcee0a', // Cyber Yellow
        }
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'], // Tech feel
      }
    },
  },
  plugins: [],
}
