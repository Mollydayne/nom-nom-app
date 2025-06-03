/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      animation: {
        wiggle: 'wiggle 0.4s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(3deg)' },
          '75%': { transform: 'rotate(-3deg)' },
        },
      },
      boxShadow: {
        'glow-on': '0 0 20px hsla(50, 100%, 70%, calc(var(--on) * 0.8))',
      },
      colors: {
        // Tu peux ensuite utiliser via `text-background` par ex.
        background: 'hsl(0, 0%, calc(100% - var(--on) * 90%))',
        foreground: 'hsl(0, 0%, calc(0% + var(--on) * 100%))',
      },
    },
  },
  plugins: [],
}
