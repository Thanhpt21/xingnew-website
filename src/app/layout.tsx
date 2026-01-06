// src/app/layout.tsx
'use client';

import { ReactNode } from 'react';
import { Poppins } from 'next/font/google';
import '@/styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppContent from '@/components/layout/AppContent';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});



const queryClient = new QueryClient();


export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="vi" className={poppins.className}>
      <body>
        <QueryClientProvider client={queryClient}>
            <AppContent>
              {children}
            </AppContent>
        </QueryClientProvider>
      </body>
    </html>
  );
}
