import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import BottomNav from '@/components/bottom-nav';
import { EventsProvider } from '@/context/events-context';

export const metadata: Metadata = {
  title: 'CineSchedule',
  description: 'Your personal movie and show scheduling app.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#E63946" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className="font-body antialiased bg-background">
        <EventsProvider>
          <div className="relative flex flex-col h-screen">
            <main className="flex-grow pb-20">
              {children}
            </main>
            <BottomNav />
          </div>
          <Toaster />
        </EventsProvider>
      </body>
    </html>
  );
}
