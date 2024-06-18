import type { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import { ReactNode } from 'react';
import './globals.css';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={merriweather.className}>{children}</body>
    </html>
  );
}
