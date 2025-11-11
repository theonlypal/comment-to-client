import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Comment to Client - Turn Instagram Comments Into Revenue',
  description: 'Automatically convert Instagram comments into qualified leads. Send DMs, capture contact info, and sync to your CRM in seconds.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.className} antialiased`}>{children}</body>
    </html>
  );
}
