// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

const config = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        serif: ['Merriweather', ...defaultTheme.fontFamily.serif],
        mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            maxWidth: 'none',
            fontWeight: '300',
            fontSize: '1rem',
            p: {
              fontWeight: '300',
            },
            h1: {
              fontWeight: '300',
              fontSize: '2rem',
            },
            h2: {
              fontWeight: '300',
              fontSize: '1.5rem',
            },
            h3: {
              fontWeight: '300',
              fontSize: '1.25rem',
            },
            a: {
              color: theme('colors.blue.600'),
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            code: {
              backgroundColor: theme('colors.gray.100'),
              padding: '0.2em 0.4em',
              borderRadius: '0.2em',
              fontWeight: '400',
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
              overflowX: 'auto',
              fontWeight: '400',
            },
            blockquote: {
              borderLeftWidth: '2px',
              borderLeftColor: theme('colors.gray.300'),
              fontStyle: 'normal',
              fontWeight: '300',
              color: theme('colors.gray.600'),
            },
          },
        },
      }),
      colors: {
        blue: {
          50: '#f0f4f9',
          100: '#d9e2f3',
          200: '#b3c6e7',
          300: '#8da9db',
          400: '#668dcf',
          500: '#4071c3',
          600: '#3d5a80', // Primary accent
          700: '#2c4160',
          800: '#1b2940',
          900: '#0a1320',
        },
      },
    },
  },
  plugins: [
    typography,
  ],
};

export default config;