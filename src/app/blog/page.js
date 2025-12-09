import BlogCard from '../../components/BlogCard';
import StaticBlogCard from '../../components/StaticBlogCard';
import { blogPosts } from './blogData';

// This page is statically generated at build time
export const dynamic = 'force-static';

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
          margin: '0 auto 48px',
          padding: '24px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 30%, #ffffff 100%)',
          boxShadow: '0 16px 45px rgba(220, 38, 38, 0.18)',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <a
              href="https://www.dineopen.com"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                padding: '10px 14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                boxShadow: '0 8px 24px rgba(220, 38, 38, 0.28)',
              }}
              title="Go to DineOpen.com"
            >
              <span style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#ef4444',
                letterSpacing: '-0.5px',
                fontSize: '18px',
              }}>
                DO
              </span>
              <span style={{
                color: 'white',
                fontWeight: 800,
                fontSize: '17px',
                letterSpacing: '0.6px',
              }}>
                DineOpen
              </span>
            </a>
          </div>
          <a
            href="https://www.dineopen.com#contact"
            style={{
              padding: '12px 20px',
              borderRadius: '12px',
              background: '#111827',
              color: 'white',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 10px 28px rgba(17,24,39,0.18)',
              letterSpacing: '0.4px',
              whiteSpace: 'nowrap',
            }}
          >
            Book a Demo
          </a>
        </div>
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
            {/* Static HTML Blog Post - Increase Footfall 2026 */}
            <StaticBlogCard />
            
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
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

