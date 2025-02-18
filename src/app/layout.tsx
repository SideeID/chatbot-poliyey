import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://jempol.side.my.id'),
  title: {
    default: 'JEMPOL - Pusat Informasi Terpadu Politeknik Negeri Jember',
    template: '%s | JEMPOL - Chatbot PINTU Polije',
  },
  description:
    'JEMPOL adalah chatbot AI dari PINTU Politeknik Negeri Jember, memberikan layanan terpadu untuk mahasiswa, dosen, dan calon mahasiswa. Temukan informasi layanan akademik, penyewaan gedung, dan pengaduan masyarakat.',
  applicationName: 'JEMPOL - Chatbot PINTU Polije',
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
    url: 'https://jempol.side.my.id',
    title: 'JEMPOL - Pusat Informasi Terpadu Politeknik Negeri Jember',
    description:
      'Chatbot pintar PINTU untuk informasi dan layanan terpadu di Politeknik Negeri Jember',
    siteName: 'JEMPOL - Chatbot PINTU Polije',
    images: [
      {
        url: '/logo-jempol.webp',
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
    canonical: 'https://jempol.side.my.id',
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
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://jempol.side.my.id',
    name: 'JEMPOL - Pusat Informasi Terpadu Politeknik Negeri Jember',
    description:
      'JEMPOL adalah chatbot AI untuk layanan terpadu PINTU di Politeknik Negeri Jember. Temukan informasi akademik, layanan mahasiswa, dan banyak lagi.',
    publisher: {
      '@type': 'Organization',
      name: 'Politeknik Negeri Jember',
      url: 'https://www.polije.ac.id',
      logo: {
        '@type': 'ImageObject',
        url: 'https://jempol.side.my.id/logo-jempol.webp',
        width: 1200,
        height: 630,
      },
    },
  };

  return (
    <html lang='id' suppressHydrationWarning>
      <head>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {children}
          <SpeedInsights />
          <Analytics />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
