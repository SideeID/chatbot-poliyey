import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://jempol.sideid.tech'),
  title: {
    default: 'JEMPOL - Pusat Informasi Terpadu Politeknik Negeri Jember',
    template: '%s | JEMPOL Polije',
  },
  description:
    'Chatbot cerdas PINTU (Pusat Informasi dan Pelayanan Terpadu) Politeknik Negeri Jember. Solusi informasi akademik dan layanan terpadu untuk mahasiswa, calon mahasiswa, dan sivitas akademika.',
  applicationName: 'JEMPOL Polije',
  authors: [
    { name: 'Politeknik Negeri Jember', url: 'https://www.polije.ac.id' },
  ],
  keywords: [
    'chatbot polije',
    'pusat informasi politeknik negeri jember',
    'PINTU polije',
    'layanan akademik',
    'informasi perguruan tinggi',
    'politeknik negeri jember',
    'chatbot akademik',
  ],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://jempol.sideid.tech',
    title: 'JEMPOL - Pusat Informasi Terpadu Politeknik Negeri Jember',
    description:
      'Chatbot pintar PINTU untuk informasi dan layanan terpadu di Politeknik Negeri Jember',
    siteName: 'JEMPOL Polije',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JEMPOL Chatbot Politeknik Negeri Jember',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JEMPOL - Pusat Informasi Terpadu Polije',
    description:
      'Chatbot pintar PINTU untuk informasi dan layanan terpadu di Politeknik Negeri Jember',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': 100,
    },
  },
  alternates: {
    canonical: 'https://jempol.sideid.tech',
  },
  category: 'Education',
  generator: 'Next.js',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='id' suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
