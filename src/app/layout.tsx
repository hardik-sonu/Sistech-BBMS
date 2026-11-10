import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sistech BBMS - Blood Bank Management System',
  description: 'Blood Bank Management System - Sistech Sukkur, Sindh. Clinical Division.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      primary: { DEFAULT: '#701921', container: '#8f3036' },
                      'on-primary': '#ffffff',
                      'on-primary-container': '#ffafaf',
                      secondary: { DEFAULT: '#94474c', container: '#ff9ea2' },
                      'on-secondary': '#ffffff',
                      'on-secondary-container': '#793238',
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
                      outline: { DEFAULT: '#897171', variant: '#dcc0bf' },
                      error: { DEFAULT: '#ba1a1a', container: '#ffdad6' },
                    },
                    fontFamily: {
                      manrope: ['var(--font-manrope)', 'sans-serif'],
                      inter: ['var(--font-inter)', 'sans-serif'],
                    }
                  }
                }
              }
            `,
          }}
        />
      </head>
      <body className="font-inter bg-[#f8faf1] text-[#191c17]">{children}</body>
    </html>
  );
}
