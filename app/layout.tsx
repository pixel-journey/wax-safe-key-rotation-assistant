import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Safe Key Rotation Assistant | Pixel Journey',
  description: 'Guided, ultra-safe key rotation wizard for WAX/Antelope accounts with live previews and strong safety warnings.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white antialiased">{children}</body>
    </html>
  );
}
