/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f6f7',
          100: '#e6e6e9',
          200: '#c8c8d0',
          300: '#a0a0ad',
          400: '#72727f',
          500: '#52525e',
          600: '#3e3e48',
          700: '#2b2b33',
          800: '#1a1a20',
          900: '#0f0f13',
          950: '#08080b',
        },
        nude: {
          50: '#fbf8f5',
          100: '#f5ede4',
          200: '#ebd9c8',
          300: '#dec0a8',
          400: '#cfa582',
          500: '#c08d65',
          600: '#b07a54',
          700: '#926345',
          800: '#76523b',
          900: '#614433',
        },
        gold: {
          50: '#fdfbf3',
          100: '#faf4e0',
          200: '#f4e8bd',
          300: '#ecd68f',
          400: '#e2c060',
          500: '#d4a93f',
          600: '#bd8c31',
          700: '#9c6b2a',
          800: '#7e5526',
          900: '#684722',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'soft': '0 2px 20px rgba(0,0,0,0.06)',
        'card': '0 4px 30px rgba(0,0,0,0.08)',
        'gold': '0 0 20px rgba(212,169,63,0.15)',
      },
    },
  },
  plugins: [],
};
