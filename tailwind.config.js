/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'ipad': '768px',
        'ipad-pro': '1024px',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        'xl': '1rem',
        '2xl': '1.25rem',
        'pill': '100px',
        'full': '9999px',
      },
      colors: {
        primary: {
          50:  '#FFF8F4',
          100: '#FFEAD8',
          200: '#FFD0B0',
          300: '#FFAE80',
          400: '#FC8B55',
          500: '#FB7938', // Sagomini orange
          600: '#E85E1F',
          700: '#C44A12',
          800: '#9A3809',
          900: '#55504F', // Sagomini warm dark — used for headings/body text
        },
        secondary: {
          50:  '#E8F8F7',
          100: '#C8EEEC',
          200: '#95DDD9',
          300: '#6ECBC6',
          400: '#51BDB5', // Sagomini turquoise
          500: '#3EA89F',
          600: '#2D8F87',
          700: '#1D736D',
          800: '#125651',
          900: '#0A3A36',
        },
        accent: {
          50:  '#FDF0F8',
          100: '#FAD9EE',
          200: '#F5B3DC',
          300: '#EE8DC9',
          400: '#E988BD', // Sagomini pink
          500: '#D96AA9',
          600: '#C44D93',
          700: '#A33577',
        },
        sage: {
          50:  '#EEF7E4',
          100: '#D4ECBA',
          200: '#B1DD86',
          300: '#8DCE52',
          400: '#72BE44', // Sagomini green
          500: '#5CA834',
          600: '#468D26',
          700: '#327018',
        },
        warm: {
          50:  '#FFFBF0',
          100: '#FFF3CC',
          200: '#FEE499',
          300: '#FDD066',
          400: '#FBBD33',
          500: '#FAA61A', // Sagomini yellow
          600: '#E08C0A',
          700: '#B86E07',
        },
      },
      fontFamily: {
        'sans': ['Nunito', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft':    '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'card':    '0 4px 20px rgba(0, 0, 0, 0.08)',
        'float':   '0 8px 30px rgba(0, 0, 0, 0.14)',
        'colored': '0 4px 20px rgba(251, 121, 56, 0.25)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow':  'pulse 3s infinite',
        'float':       'float 3s ease-in-out infinite',
        'pop-in':      'popIn 0.5s cubic-bezier(0.2, 0.65, 0.35, 1.5) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        popIn: {
          '0%':   { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)',   opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'sago':        'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'sago-bounce': 'cubic-bezier(0.2, 0.65, 0.35, 1.5)',
      },
    },
  },
  plugins: [],
}
