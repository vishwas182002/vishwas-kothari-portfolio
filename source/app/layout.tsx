import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vishwas Kothari — ML Engineer & Researcher',
  description:
    'Vishwas Kothari. MS Computer Science at CU Boulder. Machine learning, model evaluation, document intelligence, trustworthy AI, and scientific data systems.',
  icons: { icon: '/favicon.svg' },
};

const themeInit =
  "try{const t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch{}";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
