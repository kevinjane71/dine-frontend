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

