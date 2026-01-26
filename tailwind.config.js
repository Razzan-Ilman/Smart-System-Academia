/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        '4.5': '1.125rem', // 18px
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slower': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-very-slow': 'spin 20s linear infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'bounce-subtle': 'bounce-subtle 3s ease-in-out infinite',
        'slide-in-out': 'slide-in-out 4s ease-in-out infinite',
        'float-particle': 'float-particle 4s ease-in-out infinite',
        'gradient-slow': 'gradient-slow 15s ease infinite',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-shift': {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
            opacity: '0.8'
          },
          '50%': {
            backgroundPosition: '100% 50%',
            opacity: '1'
          },
        },
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)',
            opacity: '0.7'
          },
          '50%': {
            transform: 'translateY(-5px) scale(1.05)',
            opacity: '1'
          },
        },
        'slide-in-out': {
          '0%, 100%': {
            transform: 'translateX(-20px)',
            opacity: '0.5'
          },
          '50%': {
            transform: 'translateX(0px)',
            opacity: '1'
          },
        },
        'float-particle': {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
            opacity: '0.3'
          },
          '50%': {
            transform: 'translateY(-30px) translateX(10px)',
            opacity: '0.8'
          },
        },
        'gradient-slow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}
