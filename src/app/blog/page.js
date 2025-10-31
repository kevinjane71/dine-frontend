import Link from 'next/link';

export const metadata = {
  title: 'Restaurant Management Blog | DineOpen - Tips, Guides & Industry Insights',
  description: 'Learn about restaurant management, POS systems, inventory management, staff management, and industry best practices. Expert guides and tips from DineOpen.',
  keywords: 'restaurant management blog, POS system guide, restaurant inventory tips, restaurant operations, food service management articles',
  openGraph: {
    title: 'Restaurant Management Blog | DineOpen',
    description: 'Expert guides and insights on restaurant management, POS systems, and operations.',
    url: 'https://www.dineopen.com/blog',
  },
};

const blogPosts = [
  {
    slug: 'why-dineopen-future-restaurant-management',
    title: 'Why DineOpen is the Future of Restaurant Management',
    excerpt: 'Discover how our AI-powered POS system is revolutionizing restaurant operations and why it\'s outperforming traditional competitors.',
    date: '2024-12-15',
    category: 'Industry Insights',
  },
  {
    slug: 'how-to-reduce-restaurant-operating-costs',
    title: 'How to Reduce Restaurant Operating Costs by 30%',
    excerpt: 'Practical strategies and tools to cut costs without compromising quality or customer experience.',
    date: '2024-12-10',
    category: 'Cost Management',
  },
  {
    slug: 'ultimate-guide-restaurant-inventory-management',
    title: 'The Ultimate Guide to Restaurant Inventory Management',
    excerpt: 'Learn best practices for managing restaurant inventory, reducing waste, and optimizing stock levels.',
    date: '2024-12-05',
    category: 'Operations',
  },
  {
    slug: 'why-qr-code-menus-are-essential-in-2024',
    title: 'Why QR Code Menus Are Essential in 2024',
    excerpt: 'Discover how QR code menus improve customer experience, reduce costs, and streamline operations.',
    date: '2024-11-28',
    category: 'Technology',
  },
  {
    slug: 'ai-powered-restaurant-management-guide',
    title: 'AI-Powered Restaurant Management: Complete Guide',
    excerpt: 'Explore how artificial intelligence is transforming restaurant operations and what it means for your business.',
    date: '2024-11-20',
    category: 'Technology',
  },
  {
    slug: 'best-practices-restaurant-staff-management',
    title: 'Best Practices for Restaurant Staff Management',
    excerpt: 'Essential tips for managing your restaurant team, improving productivity, and reducing turnover.',
    date: '2024-11-15',
    category: 'Staff Management',
  },
  {
    slug: 'how-to-increase-restaurant-revenue',
    title: 'How to Increase Restaurant Revenue: 10 Proven Strategies',
    excerpt: 'Actionable strategies to boost your restaurant\'s revenue and profitability.',
    date: '2024-11-10',
    category: 'Revenue',
  },
  {
    slug: 'restaurant-technology-trends-2024',
    title: 'Restaurant Technology Trends to Watch in 2024',
    excerpt: 'Stay ahead with the latest technology trends shaping the restaurant industry.',
    date: '2024-11-05',
    category: 'Technology',
  },
  {
    slug: 'best-restaurant-pos-systems-india-comparison-2024',
    title: 'Best Restaurant POS Systems in India 2024: Complete Comparison Guide',
    excerpt: 'Compare top restaurant POS systems in India including Zomato Base, Razorpay POS, Square, and more. See pricing, features, and why DineOpen\'s AI-powered solution leads the market.',
    date: '2024-12-20',
    category: 'Comparison',
  },
];

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "DineOpen Blog",
            "description": "Restaurant management tips, guides, and industry insights",
            "url": "https://www.dineopen.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "DineOpen",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.dineopen.com/favicon.png"
              }
            }
          })
        }}
      />
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f9fafb',
        padding: '80px 20px 40px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <header style={{ marginBottom: '48px', textAlign: 'center' }}>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#111827',
              marginBottom: '16px',
            }}>
              Restaurant Management Blog
            </h1>
            <p style={{
              fontSize: '20px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Expert guides, tips, and insights to help you run a successful restaurant business
            </p>
          </header>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '32px',
            marginBottom: '48px',
          }}>
            {blogPosts.map((post) => (
              <article
                key={post.slug}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '24px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
                }}
              >
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#ef4444',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '12px',
                  }}>
                    {post.category}
                  </div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: '#111827',
                    marginBottom: '12px',
                    lineHeight: '1.3',
                  }}>
                    {post.title}
                  </h2>
                  <p style={{
                    fontSize: '16px',
                    color: '#6b7280',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                  }}>
                    {post.excerpt}
                  </p>
                  <div style={{
                    fontSize: '14px',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}>
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <footer style={{
            textAlign: 'center',
            padding: '32px',
            color: '#6b7280',
          }}>
            <p>Stay updated with the latest restaurant management insights</p>
          </footer>
        </div>
      </div>
    </>
  );
}

