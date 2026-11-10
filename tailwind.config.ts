import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary
        primary: { DEFAULT: '#701921', container: '#8f3036' },
        'on-primary': '#ffffff',
        'on-primary-container': '#ffafaf',
        // Secondary
        secondary: { DEFAULT: '#94474c', container: '#ff9ea2' },
        'on-secondary': '#ffffff',
        'on-secondary-container': '#793238',
        // Tertiary
        tertiary: { DEFAULT: '#6a2027', container: '#88373c' },
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#ffb0b1',
        // Error
        error: { DEFAULT: '#ba1a1a', container: '#ffdad6' },
        'on-error': '#ffffff',
        'on-error-container': '#93000a',
        // Surface
        surface: {
          DEFAULT: '#f8faf1',
          dim: '#d9dbd2',
          bright: '#f8faf1',
          'container-lowest': '#ffffff',
          'container-low': '#f3f4ec',
          container: '#edefe6',
          'container-high': '#e7e9e0',
          'container-highest': '#e1e3db',
          variant: '#e1e3db',
        },
        'on-surface': { DEFAULT: '#191c17', variant: '#564242' },
        // Others
        outline: { DEFAULT: '#897171', variant: '#dcc0bf' },
        'inverse-surface': '#2e312c',
        'inverse-on-surface': '#f0f2e9',
        'inverse-primary': '#ffb3b3',
        background: '#f8faf1',
        'on-background': '#191c17',
        'surface-tint': '#a03d42',
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'headline-lg': ['28px', { lineHeight: '36px', fontWeight: '600' }],
        'headline-md': ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '18px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'label-md': ['12px', { lineHeight: '16px', fontWeight: '500' }],
        'label-sm': ['11px', { lineHeight: '14px', fontWeight: '600' }],
      },
      spacing: {
        'space-xs': '0.25rem',
        'space-sm': '0.5rem',
        'space-md': '1rem',
        'space-lg': '1.5rem',
        'space-xl': '2.5rem',
        gutter: '1.25rem',
        margin: '2rem',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
    },
  },
  plugins: [],
};
export default config;
