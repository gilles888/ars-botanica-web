/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ee',
          100: '#ddefd9',
          200: '#bddeb5',
          300: '#93c888',
          400: '#6aae5d',
          500: '#5a8a4a',
          600: '#47723a',
          700: '#395c2f',
          800: '#2f4a27',
          900: '#273d21',
        },
        rose: {
          pastel: '#e8a0b4',
          light: '#f4c5d0',
          dark: '#d4708a',
        },
        cream: {
          DEFAULT: '#fafaf8',
          dark: '#f0efe9',
        },
        charcoal: '#2d3748',
      },
      fontFamily: {
        'heading': ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        'body': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'hero-pattern': "radial-gradient(ellipse at top, #f0f7ee 0%, #fafaf8 70%)",
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
