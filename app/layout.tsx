import type { Metadata } from 'next';
import { Bebas_Neue, Space_Grotesk } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas-neue',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const OG_IMAGE = 'https://fihwweohpxcrbleidzkq.supabase.co/storage/v1/object/public/flyers/unipoli-rewind.webp';

export const metadata: Metadata = {
  metadataBase: (() => { try { return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://eventlanding-green.vercel.app'); } catch { return new URL('https://eventlanding-green.vercel.app'); } })(),
  title: {
    default:  'UP · Tu acceso a experiencias únicas',
    template: '%s | UP',
  },
  description: 'Conciertos, festivales y eventos universitarios en Ecuador. Tu entrada digital en menos de 24 horas.',
  openGraph: {
    siteName:    'UP',
    locale:      'es_EC',
    type:        'website',
    title:       'UP · Tu acceso a experiencias únicas',
    description: 'Conciertos, festivales y eventos universitarios en Ecuador. Tu entrada digital en menos de 24 horas.',
    images: [{ url: OG_IMAGE, width: 800, height: 1200, alt: 'UP · Tu acceso a experiencias únicas' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'UP · Tu acceso a experiencias únicas',
    description: 'Conciertos, festivales y eventos universitarios en Ecuador. Tu entrada digital en menos de 24 horas.',
    images:      [OG_IMAGE],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
