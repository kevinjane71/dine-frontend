import AIAgentProductClient from './AIAgentProductClient';

// Force static generation for SEO
export const dynamic = 'force-static';

// SEO Metadata for AI Agent product page
export const metadata = {
  title: 'AI Agent for Restaurant | Voice & Chat Assistant | DineOpen',
  description: 'Intelligent AI agent for restaurants with voice order taking, chat support, table management, and instant answers. Transform your restaurant operations with DineOpen AI Agent. Start free trial.',
  keywords: 'AI agent for restaurant, voice order taking, restaurant AI assistant, voice POS system, restaurant chatbot, AI restaurant software, voice ordering system, restaurant automation, AI order taking, restaurant voice assistant, smart restaurant assistant, conversational AI for restaurant',
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
    title: 'AI Agent for Restaurant | Voice & Chat Assistant | DineOpen',
    description: 'Intelligent AI agent for restaurants with voice order taking, chat support, and instant answers. Transform your restaurant operations.',
    url: 'https://www.dineopen.com/products/ai-agent',
    siteName: 'DineOpen',
    images: [
      {
        url: 'https://www.dineopen.com/favicon.png',
        width: 1200,
        height: 630,
        alt: 'DineOpen AI Agent for Restaurant',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Agent for Restaurant | Voice & Chat Assistant',
    description: 'Intelligent AI agent for restaurants with voice order taking and chat support.',
    images: ['https://www.dineopen.com/favicon.png'],
  },
  alternates: {
    canonical: 'https://www.dineopen.com/products/ai-agent',
  },
};

export default function AIAgentProductPage() {
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "AI Agent for Restaurant",
    "description": "Intelligent voice and chat assistant for restaurants that takes orders via voice commands, answers questions, manages tables, and handles operations through natural conversation.",
    "brand": {
      "@type": "Brand",
      "name": "DineOpen"
    },
    "offers": {
      "@type": "Offer",
      "price": "999",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": "https://www.dineopen.com/products/ai-agent"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "featureList": [
      "Voice Order Taking",
      "Chat Support",
      "Smart Table Management",
      "Instant Answers",
      "Natural Language Processing",
      "Indian Accent Support"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <AIAgentProductClient />
    </>
  );
}

