/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: 'var(--brand-navy)',
          blue: 'var(--brand-blue)',
          support: 'var(--blue-support)',
          soft: 'var(--soft-lavender)',
          mist: 'var(--lavender-mist)',
          tint: 'var(--brand-tint)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          elevated: 'var(--surface-elevated)',
          bg: 'var(--bg-main)',
        },
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        border: {
          DEFAULT: 'var(--border-color)',
        },
        semantic: {
          success: '#16A477',
          warning: '#D99736',
          danger: '#DC626F',
          info: '#6485C7',
        }
      },
      fontFamily: {
        heading: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '14px',
        'subtle': '8px',
        'pill': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 16px -2px rgba(36, 59, 128, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'elevated': '0 10px 25px -5px rgba(36, 59, 128, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'dropdown': '0 10px 30px rgba(16, 23, 40, 0.15)',
        'dark-card': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}

