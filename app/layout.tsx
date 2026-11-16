import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '8 Долоо Хоног · 2 Шийдэл — Find My School × Yarii Mongola',
  description: 'Interactive 3D pitch deck',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Unbounded:wght@600;700;800;900&family=Geologica:wght@400;600;700&family=Commissioner:wght@400;500;600;700&family=Montserrat:wght@600;700;800&family=Onest:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
