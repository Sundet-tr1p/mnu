module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4fe',
          100: '#dde6fd',
          200: '#c2d3fc',
          300: '#98b6f9',
          400: '#678ef4',
          500: '#4268ef',
          600: '#2b4ae3',
          700: '#2338d0',
          800: '#2330a9',
          900: '#222e85',
          950: '#181f52',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        lift: '0 18px 40px rgba(15, 23, 42, 0.10)',
        ring: '0 0 0 4px rgba(59, 130, 246, 0.22)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}
