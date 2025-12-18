import HomePageClient from './HomePageClient';

// Force static generation for SEO - This ensures the page is pre-rendered at build time
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate - fully static

// Enhanced SEO Metadata for homepage - Optimized for search engines and AI chatbots
export const metadata = {
  title: 'Restaurant POS Software India | Billing & Inventory System',
  description: 'DineOpen is restaurant POS software for small restaurants in India. Includes billing software, menu management, inventory tracking, and GST billing. Affordable pricing from ₹300. Alternative to Zomato POS and Petpooja.',
  keywords: 'restaurant billing software, restaurant management software, restaurant POS system, restaurant management system, POS for restaurants, restaurant management, restaurant software India, restaurant POS software, restaurant management platform, restaurant inventory management, restaurant table management, restaurant KOT system, restaurant order management, cloud restaurant POS, restaurant automation software, AI restaurant management, voice order taking restaurant, restaurant management solution, restaurant operations software, restaurant technology platform, restaurant management tools, restaurant management app, restaurant management system India, restaurant POS India, restaurant management software free trial',
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
    title: 'DineOpen - Restaurant POS + AI Agent | Restaurant Management Software',
    description: 'Restaurant POS + AI Agent in One Platform. Fast Billing, KOT, Menu Management, Table Orders & Voice-AI Assistant. Complete restaurant management software. Pay as you go (₹300 one-time) or fixed monthly (₹600/month).',
    url: 'https://www.dineopen.com',
    siteName: 'DineOpen',
    images: [
      {
        url: 'https://www.dineopen.com/favicon.png',
        width: 1200,
        height: 630,
        alt: 'DineOpen Restaurant Management System - POS + AI Agent',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DineOpen - Restaurant POS + AI Agent | Restaurant Management Software',
    description: 'Restaurant POS + AI Agent in One Platform. Fast Billing, KOT, Menu Management, Table Orders & Voice-AI Assistant. Pay as you go (₹300 one-time) or fixed monthly (₹600/month).',
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
