/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FDFBF7',
          100: '#F6F4EE',
          200: '#EFE9DF',
          300: '#E2DBD0',
          400: '#AAA398',
          500: '#6E665A',
          600: '#5E554A',
          800: '#1F1B16',
          900: '#161513',
          950: '#12110F',
        },
        terracotta: {
          DEFAULT: '#C45525',
          hover: '#A9441B',
          muted: '#E6DDD4',
          dark: '#8C3814',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      transitionTimingFunction: {
        'emil': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'drawer': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        '120': '120ms',
        '160': '160ms',
        '200': '200ms',
        '250': '250ms',
      },
    },
  },
  plugins: [],
}
