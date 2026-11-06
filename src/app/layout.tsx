import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RunRoute Art | GPS Art Planner & Running Route Generator',
  description:
    'Rancang rute lari kreatif, random 5K/10K loop, dan GPS art (hati, bintang, anjing, kucing) 100% gratis dengan OpenStreetMap & OSRM routing. Ekspor ke GPX (Strava/Garmin) dan GeoJSON.',
  keywords: [
    'GPS Art',
    'Run Route Generator',
    'Strava Art',
    'Garmin Route',
    'GPX Export',
    '5K Loop',
    '10K Loop',
    'Marathon Route Planner',
    'Leaflet',
    'OSRM',
  ],
  authors: [{ name: 'RunRoute Art' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#080c14',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased bg-[#080c14] text-slate-100 overflow-hidden w-screen h-screen">
        {children}
      </body>
    </html>
  );
}
