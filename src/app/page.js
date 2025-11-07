import HomePageClient from './HomePageClient';

// Force static generation for SEO
export const dynamic = 'force-static';

// SEO Metadata for homepage
export const metadata = {
  title: 'DineOpen - AI-Powered Restaurant Management System | POS, Inventory & Order Tracking',
  description: 'Complete AI-powered restaurant management solution with multi-restaurant support, POS system, inventory management, order tracking, QR menus, and real-time analytics. Streamline your restaurant operations with DineOpen.',
  keywords: 'restaurant management, POS system, inventory management, order tracking, QR menu, restaurant analytics, multi-restaurant management, AI restaurant, food service management, restaurant software, table management, kitchen display system, restaurant POS, order management system',
  authors: [{ name: 'DineOpen Team' }],
  creator: 'DineOpen',
  publisher: 'DineOpen',
  robots: 'index, follow',
  openGraph: {
    title: 'DineOpen - AI-Powered Restaurant Management System',
    description: 'Complete AI-powered restaurant management solution with multi-restaurant support, POS system, inventory management, and order tracking.',
    url: 'https://www.dineopen.com',
    siteName: 'DineOpen',
    images: [
      {
        url: 'https://www.dineopen.com/favicon.png',
        width: 1200,
        height: 630,
        alt: 'DineOpen Restaurant Management System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DineOpen - AI-Powered Restaurant Management System',
    description: 'Complete AI-powered restaurant management solution with multi-restaurant support, POS system, inventory management, and order tracking.',
    images: ['https://www.dineopen.com/favicon.png'],
  },
  alternates: {
    canonical: 'https://www.dineopen.com',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
