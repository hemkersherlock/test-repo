import type {Metadata} from 'next';
import { Poppins, PT_Sans } from 'next/font/google'
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import BottomNav from '@/components/bottom-nav';
import { EventsProvider } from '@/context/events-context';
import AppLayoutClient from '@/components/app-layout-client';

export const metadata: Metadata = {
  title: 'CineSchedule',
  description: 'Your personal movie and show scheduling app.',
  manifest: '/manifest.json',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-headline',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <head>
        <meta name="theme-color" content="#E63946" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={`${poppins.variable} ${ptSans.variable} font-body antialiased bg-background`}>
        <EventsProvider>
          <AppLayoutClient>
            {children}
          </AppLayoutClient>
          <Toaster />
        </EventsProvider>
      </body>
    </html>
  );
}
