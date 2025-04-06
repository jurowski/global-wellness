/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'background-dark': 'var(--background-dark)',
        'background-light': 'var(--background-light)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'accent-primary': 'var(--accent-primary)',
        'accent-secondary': 'var(--accent-secondary)',
        'border-color': 'var(--border-color)',
        'card-bg': 'var(--card-bg)',
        'hover-bg': 'var(--hover-bg)',
      },
    },
  },
  plugins: [],
} 