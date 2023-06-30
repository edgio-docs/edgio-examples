import './globals.css';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
//import { useServiceWorker } from '@edgio/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js App on Edgio v7',
  description: 'Routing and caching for Next.js apps on Edgio v7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#9a1ab1] via-[#004966] to-[#01B18D]">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}
