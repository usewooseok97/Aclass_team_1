/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-card-bg': 'var(--card-bg)',
        'theme-card-border': 'var(--card-border)',
        'theme-text-primary': 'var(--text-primary)',
        'theme-text-secondary': 'var(--text-secondary)',
        'theme-btn-primary': 'var(--btn-primary)',
        'theme-btn-hover': 'var(--btn-hover)',
        'theme-badge-bg': 'var(--badge-bg, rgba(147, 51, 234, 0.1))',
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
}