import { Metadata } from 'next';
import { Merriweather } from 'next/font/google';
import { PropsWithChildren } from 'react';
import '../globals.css';
import { logout } from '@/actions/authAction';

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

export const metadata: Metadata = {
  title: 'Next Auth',
  description: 'Next.js Authentication',
};

export default function AuthRootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={merriweather.className}>
        <header id="auth-header">
          <p>Welcome Back!</p>
          <form action={logout}>
            <button>Logout</button>
          </form>
        </header>
        {children}
      </body>
    </html>
  );
}
