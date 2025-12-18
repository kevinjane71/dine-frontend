export default function FAQSchema() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is DineOpen?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "DineOpen is a restaurant POS software and billing system designed for small and mid-sized restaurants in India. It includes menu management, inventory tracking, online order management, and GST-ready billing. DineOpen is a cloud-based alternative to Zomato POS and Petpooja, offering affordable pricing starting at ₹300 one-time or ₹600 per month."
        }
      },
      {
        "@type": "Question",
        "name": "Is DineOpen a POS system?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, DineOpen is a complete POS system for restaurants. It includes billing software, table management, KOT (Kitchen Order Ticket) generation, inventory management, menu management, and online order processing. It works on any device with internet access and does not require hardware installation."
        }
      },
      {
        "@type": "Question",
        "name": "Is DineOpen suitable for small restaurants?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, DineOpen is specifically designed for small and mid-sized restaurants in India. It offers affordable pricing starting at ₹300 one-time payment, making it accessible for small cafes, restaurants, and cloud kitchens. The system is simple to use and does not require technical expertise."
        }
      },
      {
        "@type": "Question",
        "name": "Does DineOpen support GST billing in India?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, DineOpen includes GST-ready billing software. It automatically calculates GST, generates compliant invoices, and maintains records required for tax filing. The system supports all GST rates and formats invoices according to Indian tax regulations."
        }
      },
      {
        "@type": "Question",
        "name": "Can DineOpen replace Zomato POS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, DineOpen can replace Zomato POS for restaurants. It offers similar features including POS billing, menu management, inventory tracking, and online orders. DineOpen is more affordable with pricing starting at ₹300 one-time compared to Zomato's monthly fees, and it does not require hardware installation."
        }
      },
      {
        "@type": "Question",
        "name": "Is DineOpen cloud-based?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, DineOpen is a cloud-based restaurant management software. It runs entirely in a web browser and does not require software installation or hardware setup. You can access DineOpen from any device with internet access, including computers, tablets, and smartphones."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

