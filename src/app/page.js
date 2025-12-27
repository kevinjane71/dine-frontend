import HomePageClient from './HomePageClient';

// Force static generation for SEO - This ensures the page is pre-rendered at build time
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate - fully static

// Enhanced SEO Metadata for homepage - Optimized for search engines and AI chatbots
export const metadata = {
  title: 'Best Restaurant POS Software India 2025 | Free QR Menu + AI Agent + Inventory Management',
  description: 'DineOpen - Complete Restaurant POS Software for India. Free QR Code Menu, AI Voice Assistant, Billing Software, Inventory Management & GST Billing. Affordable pricing from ₹300. Best alternative to Zomato POS & Petpooja. Perfect for small restaurants, cafes & cloud kitchens.',
  keywords: 'restaurant POS software India, restaurant billing software, restaurant management software, free QR menu, AI restaurant assistant, inventory management software, restaurant POS system, GST billing software, cloud kitchen POS, cafe management software, restaurant software India, digital menu QR code, POS for small restaurants, restaurant billing system, online ordering system, KOT system, table management software, restaurant automation, voice AI waiter, cloud based POS, affordable restaurant software, zomato POS alternative, petpooja alternative, restaurant tech India, food business software, hospitality management system',
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
    title: 'Best Restaurant POS Software India 2025 | Free QR Menu + AI Agent',
    description: 'Complete Restaurant Management Software with Free QR Code Menu, AI Voice Assistant, Billing, Inventory Management & GST Billing. Starting ₹300. Best alternative to Zomato POS. Perfect for small restaurants & cafes.',
    url: 'https://www.dineopen.com',
    siteName: 'DineOpen',
    images: [
      {
        url: 'https://www.dineopen.com/favicon.png',
        width: 1200,
        height: 630,
        alt: 'DineOpen - Best Restaurant POS Software India with Free QR Menu and AI Agent',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Restaurant POS Software India | Free QR Menu + AI Agent',
    description: 'Complete Restaurant POS with Free QR Menu, AI Voice Assistant, Billing & Inventory Management. Starting ₹300. Best Zomato POS alternative for small restaurants.',
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
