import HomePageClient from './HomePageClient';

// Force static generation for SEO - This ensures the page is pre-rendered at build time
export const dynamic = 'force-static';

// Enhanced SEO Metadata for homepage - Optimized for search engines and AI chatbots
export const metadata = {
  title: 'DineOpen - AI Agent for Restaurant | Voice & Chat POS System | Restaurant Management Software',
  description: 'AI-powered restaurant management system with voice & chat AI agent for order taking, complete POS system, inventory management, supply chain management, table management, and hotel PMS. Start 1 month free trial. Best restaurant software for Indian restaurants.',
  keywords: 'AI agent for restaurant, voice order taking, restaurant AI assistant, restaurant POS system, restaurant management software, inventory management for restaurant, supply chain management, table management system, hotel management system, restaurant software India, POS system for restaurant, QR code menu, kitchen order tracking, restaurant analytics, multi-restaurant management, food service management, restaurant automation, AI restaurant software, restaurant technology, cloud POS system',
  authors: [{ name: 'DineOpen Team' }],
  creator: 'DineOpen',
  publisher: 'DineOpen',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'DineOpen - AI Agent for Restaurant | Voice & Chat POS System',
    description: 'AI-powered restaurant management with voice & chat AI agent, complete POS system, inventory management, supply chain, table management, and hotel PMS. Start free trial.',
    url: 'https://www.dineopen.com',
    siteName: 'DineOpen',
    images: [
      {
        url: 'https://www.dineopen.com/favicon.png',
        width: 1200,
        height: 630,
        alt: 'DineOpen AI-Powered Restaurant Management System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DineOpen - AI Agent for Restaurant | Voice & Chat POS System',
    description: 'AI-powered restaurant management with voice & chat AI agent, complete POS system, inventory management, and more. Start free trial.',
    images: ['https://www.dineopen.com/favicon.png'],
    creator: '@dineopen',
  },
  alternates: {
    canonical: 'https://www.dineopen.com',
  },
  category: 'Restaurant Management Software',
  classification: 'Business Software',
  other: {
    'application-name': 'DineOpen',
    'apple-mobile-web-app-title': 'DineOpen',
    'format-detection': 'telephone=no',
  },
};

// This page is statically generated at build time for optimal SEO
// The metadata above is server-rendered and included in the static HTML
// HomePageClient is a client component but Next.js pre-renders the initial HTML
export default function HomePage() {
  return <HomePageClient />;
}
