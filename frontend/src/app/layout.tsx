import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'sonner';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'College Discovery Platform',
  description: 'Find and compare the best colleges for your future.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_#312e81,_transparent_30%),radial-gradient(circle_at_bottom_right,_#1e1b4b,_transparent_30%)] opacity-30"></div>
        <Navbar />
        <Toaster richColors position="top-right" />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-white/10 mt-16 py-8 text-center text-gray-400 text-sm">
          © 2026 CollegeDiscovery • Built with Next.js, Prisma & PostgreSQL
        </footer>
      </body>
    </html>
  );
}
