export default function SEOStructuredData() {
  const baseUrl = 'https://www.dineopen.com';
  const currentDate = new Date().toISOString();

  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DineOpen",
    "url": baseUrl,
    "logo": `${baseUrl}/favicon.png`,
    "description": "AI-powered restaurant management system with POS, inventory management, order tracking, and real-time analytics",
    "foundingDate": "2024",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "support@dineopen.com",
      "availableLanguage": ["en", "hi"]
    },
    "sameAs": [
      "https://twitter.com/dineopen",
      "https://www.linkedin.com/company/dineopen",
      "https://www.facebook.com/dineopen"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    }
  };

  // SoftwareApplication Schema
  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "DineOpen",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web, iOS, Android",
    "offers": {
      "@type": "Offer",
      "price": "999",
      "priceCurrency": "INR",
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127"
    },
    "description": "Complete AI-powered restaurant management solution with multi-restaurant support, POS system, inventory management, order tracking, QR menus, and real-time analytics",
    "featureList": [
      "Menu Management",
      "POS System",
      "Kitchen Order Tickets (KOT)",
      "Inventory Management",
      "Table Management",
      "Staff Management",
      "Real-time Analytics",
      "QR Code Menus",
      "AI-powered Voice Ordering",
      "Multi-restaurant Support"
    ]
  };

  // LocalBusiness Schema (for GEO SEO)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "DineOpen",
    "image": `${baseUrl}/og-image.jpg`,
    "@id": baseUrl,
    "url": baseUrl,
    "telephone": "+91-XXX-XXX-XXXX",
    "priceRange": "₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressLocality": "India"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "28.6139",
      "longitude": "77.2090"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      }
    ]
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is DineOpen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DineOpen is an AI-powered restaurant management system that includes POS, inventory management, order tracking, kitchen order tickets, table management, staff management, and real-time analytics. It's designed to help restaurants streamline operations and increase efficiency."
        }
      },
      {
        "@type": "Question",
        "name": "How much does DineOpen cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DineOpen offers flexible pricing starting at ₹999 per month for the Starter plan, perfect for small cafes. We also offer Pro and Enterprise plans with more features. All plans include a 1-month free trial with no credit card required."
        }
      },
      {
        "@type": "Question",
        "name": "Does DineOpen support multiple restaurants?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, DineOpen supports multi-restaurant management, allowing you to manage multiple locations from a single dashboard. This is perfect for restaurant chains or franchise owners."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use DineOpen on mobile devices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, DineOpen is fully responsive and works seamlessly on phones, tablets, and computers. You can manage your restaurant operations from anywhere with an internet connection."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods does DineOpen accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DineOpen integrates with multiple payment gateways including Razorpay, supporting cash, card, UPI, and digital wallet payments. We don't charge any transaction fees."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a free trial available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer a 1-month free trial for all new users. No credit card required. You can explore all features during the trial period."
        }
      },
      {
        "@type": "Question",
        "name": "What is the best restaurant POS system in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DineOpen is the best AI-powered restaurant POS system in India, starting at ₹999/month with zero transaction fees. Unlike competitors like Petpooja (₹1,999/month + 1.5-2% fees) or POSist (₹1,799/month + 1.5% fees), DineOpen offers AI features, unlimited multi-restaurant support, and saves restaurants ₹53,000-₹60,000+ per year."
        }
      },
      {
        "@type": "Question",
        "name": "Which restaurant POS system has no transaction fees?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DineOpen is the only major restaurant POS system in India with zero transaction fees. Competitors like Petpooja, POSist, Gofrugal, Razorpay POS, and Zomato Base all charge 1.5-2.6% transaction fees, which can cost restaurants ₹40,000-₹60,000+ per year."
        }
      },
      {
        "@type": "Question",
        "name": "What is the cheapest restaurant management software in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DineOpen is the most cost-effective restaurant management software in India at ₹999/month. Combined with zero transaction fees, it costs ₹11,988 per year, compared to competitors that cost ₹50,000-₹72,000+ per year including fees."
        }
      },
      {
        "@type": "Question",
        "name": "Which restaurant POS supports multiple locations?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DineOpen offers unlimited multi-restaurant support included in all plans. Unlike Petpooja, POSist, and Gofrugal which charge additional fees for multiple locations, DineOpen allows you to manage unlimited restaurants from a single dashboard at no extra cost."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a restaurant POS system cost in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Restaurant POS systems in India cost ₹999-₹2,500/month plus 1.5-2.6% transaction fees. DineOpen costs ₹999/month with zero transaction fees (total: ₹11,988/year). Petpooja costs ₹1,999/month + fees (₹67,188/year), POSist costs ₹1,799/month + fees (₹64,788/year), making DineOpen the most affordable option."
        }
      },
      {
        "@type": "Question",
        "name": "Does DineOpen have AI features?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, DineOpen is the only restaurant POS system in India with comprehensive AI features including AI-powered voice ordering, AI menu extraction from images, and intelligent order matching. Competitors like Petpooja, POSist, Zomato Base, and Swiggy do not offer AI capabilities."
        }
      },
      {
        "@type": "Question",
        "name": "Compare DineOpen vs Petpooja vs POSist",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DineOpen (₹999/month, 0% fees) vs Petpooja (₹1,999/month, 1.5-2% fees) vs POSist (₹1,799/month, 1.5% fees). DineOpen is 50% cheaper, includes AI features, unlimited multi-restaurant support, and saves ₹53,000-₹60,000+ per year compared to competitors."
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

