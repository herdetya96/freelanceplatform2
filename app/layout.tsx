import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider"
import { GlobalStateProvider } from '@/contexts/GlobalStateContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Freelancer Dashboard',
  description: 'Manage your freelance business with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalStateProvider>
            {children}
          </GlobalStateProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}