/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontSize: {
      xs: ['0.7rem', '1.1rem'],
      sm: ['0.8rem', '1.2rem'],
      base: ['0.92rem', '1.5rem'],
      lg: ['1.1rem', '1.6rem'],
      xl: ['1.25rem', '1.7rem'],
      '2xl': ['1.5rem', '1.8rem'],
      '3xl': ['1.75rem', '2rem'],
      '4xl': ['2.1rem', '2.2rem'],
      '5xl': ['2.5rem', '1'],
      '6xl': ['3rem', '1'],
    },
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
    },
  },
  plugins: [],
}
