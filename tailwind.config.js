/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#5B4EE9',
        secondary: '#8B7FF0',
        accent: '#FF6B6B',
        surface: '#FFFFFF',
        background: '#F8F9FB',
        success: '#4ECDC4',
        warning: '#FFD93D',
        error: '#FF6B6B',
        info: '#4D96FF',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'] 
      },
      animation: {
        'pulse-border': 'pulse-border 2s infinite',
        'checkmark-burst': 'checkmark-burst 0.4s ease-out',
        'task-complete': 'task-complete 0.6s ease-out'
      },
      keyframes: {
        'pulse-border': {
          '0%, 100%': { borderColor: 'currentColor' },
          '50%': { borderColor: 'rgba(255, 107, 107, 0.8)' }
        },
        'checkmark-burst': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'task-complete': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.98)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '0.6' }
        }
      }
    },
  },
  plugins: [],
}