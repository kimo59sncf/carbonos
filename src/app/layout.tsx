import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers/providers';
import { Toaster } from '@/components/ui/toaster';
import { ConsentBanner } from '@/components/rgpd/consent-banner';
import { ThemeProvider } from 'next-themes';
import { OrganizationStructuredData, WebSiteStructuredData } from '@/components/seo/structured-data';
import { generateBaseMetadata, sanitizeMetadata } from '@/lib/seo';
import { SkipLinks } from '@/components/accessibility/skip-links';
import { LazyWrapper } from '@/components/performance/lazy-wrapper';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = sanitizeMetadata(
  generateBaseMetadata({
    alternates: {
      canonical: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  })
);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <OrganizationStructuredData />
        <WebSiteStructuredData />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <SkipLinks />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <LazyWrapper priority>
              {children}
            </LazyWrapper>
            <Toaster />
            <ConsentBanner />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}