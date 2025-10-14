'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaCheckCircle,
  FaChartBar,
  FaRocket,
  FaUsers,
  FaUtensils
} from 'react-icons/fa';

export default function BlogDetail() {
  const params = useParams();
  const router = useRouter();
  const [blogPost, setBlogPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Blog posts data dd
  const blogPosts = {
    'why-dineopen-future-restaurant-management': {
      id: 'why-dineopen-future-restaurant-management',
      title: 'Why DineOpen is the Future of Restaurant Management',
      excerpt: 'Discover how our AI-powered POS system is revolutionizing restaurant operations and why it\'s outperforming traditional competitors.',
      content: `
        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Modern Restaurant Interior" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Modern restaurant interior showcasing the evolution of dining spaces</p>
        </div>

        <p>The restaurant industry is transforming rapidly. Traditional POS systems struggle to meet modern demands.</p>
        
        <p>DineOpen represents the next generation of restaurant technology. We combine AI, cloud computing, and intuitive design.</p>

        <h2>🚀 The Restaurant Industry is Evolving</h2>
        <p>Traditional POS systems are becoming obsolete. Restaurants need intelligent, cloud-based solutions.</p>

        <p>DineOpen delivers exactly what modern restaurants need.</p>

        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Restaurant Staff Taking Orders" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Restaurant staff efficiently managing orders with modern technology</p>
        </div>

        <p>Today's restaurants face complex challenges:</p>
        <ul>
          <li>Managing multiple staff members across different shifts</li>
          <li>Keeping up with changing menu items and pricing</li>
          <li>Integrating kitchen operations with front-of-house service</li>
          <li>Tracking inventory and supplier relationships</li>
          <li>Analyzing customer data and sales patterns</li>
        </ul>

        <h2>💡 Key Advantages Over Competitors</h2>
        
        <h3>AI-Powered Menu Management</h3>
        <p>Our revolutionary AI technology automatically extracts menu items from photos or PDFs.</p>
        
        <p>Simply upload your existing menu, and our system will:</p>
        <ul>
          <li>Identify individual menu items</li>
          <li>Extract pricing information</li>
          <li>Categorize items automatically</li>
          <li>Suggest optimal pricing based on market data</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Delicious Food Menu" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Beautiful food presentation that AI can automatically catalog</p>
        </div>

        <h3>Multi-Staff Support</h3>
        <p>Unlike competitors who limit staff accounts, DineOpen offers unlimited staff members.</p>
        
        <p>Each staff member gets individual tracking with:</p>
        <ul>
          <li>Unique login credentials</li>
          <li>Individual order tracking</li>
          <li>Performance analytics</li>
          <li>Customized access permissions</li>
        </ul>

        <h3>Real-Time Kitchen Integration</h3>
        <p>Our Kitchen Order Ticket (KOT) system provides instant updates to kitchen staff.</p>
        
        <p>This ensures:</p>
        <ul>
          <li>Immediate order notifications</li>
          <li>Real-time status updates</li>
          <li>Efficient order prioritization</li>
          <li>Reduced communication errors</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Kitchen Staff Preparing Food" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Kitchen staff efficiently preparing orders with real-time updates</p>
        </div>

        <h3>Comprehensive Inventory Management</h3>
        <p>DineOpen's inventory system goes beyond basic stock tracking.</p>
        
        <p>It includes:</p>
        <ul>
          <li>Supplier relationship management</li>
          <li>Automated reorder suggestions</li>
          <li>Cost analysis and optimization</li>
          <li>Waste tracking and reduction</li>
        </ul>

        <h2>💰 Competitive Pricing Advantage</h2>
        <p>When comparing DineOpen to major competitors, the value proposition becomes clear.</p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0;">
          <h3 style="color: #1f2937; margin-bottom: 15px;">Cost Comparison</h3>
          <div style="display: grid; gap: 10px;">
            <div><strong>Square:</strong> $60-120/month + 2.6% transaction fees</div>
            <div><strong>Toast:</strong> $165-300/month + hardware costs</div>
            <div><strong>Clover:</strong> $95-200/month + processing fees</div>
            <div><strong>DineOpen:</strong> $29-79/month, no transaction fees, includes AI features</div>
          </div>
        </div>

        <p>DineOpen eliminates transaction fees entirely. This saves restaurants thousands of dollars annually.</p>
        
        <p>Our AI-powered features that competitors charge extra for are included in our base plans.</p>

        <h2>🎯 Why Restaurants Choose DineOpen</h2>
        <p>Our customers report impressive results:</p>
        <ul>
          <li><strong>40% faster order processing</strong> - Streamlined workflows reduce wait times</li>
          <li><strong>60% reduction in menu management time</strong> - AI automation handles routine tasks</li>
          <li><strong>25% increase in staff efficiency</strong> - Better tools lead to better performance</li>
          <li><strong>30% reduction in inventory waste</strong> - Smart tracking prevents overstocking</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Happy Customers Dining" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Happy customers enjoying their dining experience</p>
        </div>

        <h2>🔮 The Future is Here</h2>
        <p>DineOpen isn't just another POS system. It's a complete restaurant management ecosystem.</p>
        
        <p>As we develop new AI-powered features, restaurants using DineOpen stay ahead of the curve.</p>

        <p>The question isn't whether your restaurant needs to modernize. It's whether you'll do it with DineOpen or watch competitors gain the advantage.</p>
      `,
      author: 'DineOpen Team',
      authorRole: 'Product Team',
      publishDate: 'December 15, 2024',
      readTime: '8 min read',
      category: 'Featured',
      categoryColor: '#ef4444',
      tags: ['AI', 'POS', 'Restaurant Technology', 'Innovation']
    },
    'restaurant-analytics-data-driven-success': {
      id: 'restaurant-analytics-data-driven-success',
      title: 'Restaurant Analytics: Data-Driven Success',
      excerpt: 'Learn how to leverage restaurant analytics to boost revenue and optimize operations.',
      content: `
        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Restaurant Analytics Dashboard" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Data-driven insights powering restaurant success</p>
        </div>

        <p>In today's competitive restaurant landscape, data isn't just helpful - it's essential for survival.</p>
        
        <p>Restaurant analytics provide the insights needed to make informed decisions, optimize operations, and maximize profitability.</p>

        <h2>📊 The Power of Restaurant Data</h2>
        <p>Every interaction in your restaurant generates valuable data.</p>
        
        <p>From customer orders to staff performance, this information holds the key to unlocking your restaurant's full potential.</p>

        <h3>Key Metrics to Track</h3>
        <ul>
          <li><strong>Sales Performance:</strong> Daily, weekly, and monthly revenue trends</li>
          <li><strong>Menu Analysis:</strong> Best and worst performing items</li>
          <li><strong>Customer Behavior:</strong> Peak hours, popular items, average order value</li>
          <li><strong>Staff Efficiency:</strong> Order processing times, table turnover rates</li>
          <li><strong>Inventory Metrics:</strong> Stock levels, waste tracking, supplier performance</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Restaurant Charts and Graphs" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Visual analytics helping restaurants make data-driven decisions</p>
        </div>

        <h2>🎯 Turning Data into Action</h2>
        <p>Collecting data is only the first step.</p>
        
        <p>The real value comes from analyzing this information and implementing changes based on insights.</p>

        <h3>Menu Optimization</h3>
        <p>Use sales data to identify your most profitable items.</p>
        
        <p>Optimize your menu by removing underperforming items and promoting high-margin dishes during peak hours.</p>

        <h3>Staff Scheduling</h3>
        <p>Analyze customer traffic patterns to optimize staff scheduling.</p>
        
        <p>Ensure you have enough staff during busy periods while avoiding overstaffing during slow times.</p>

        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Restaurant Staff Working Efficiently" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Optimized staff scheduling leads to better customer service</p>
        </div>

        <h3>Pricing Strategy</h3>
        <p>Use customer behavior data to implement dynamic pricing strategies.</p>
        
        <p>Adjust prices based on demand, time of day, and customer preferences.</p>
      `,
      author: 'Analytics Team',
      authorRole: 'Data Science',
      publishDate: 'December 10, 2024',
      readTime: '6 min read',
      category: 'Analytics',
      categoryColor: '#3b82f6',
      tags: ['Analytics', 'Data', 'Optimization', 'Revenue']
    },
    'bellas-kitchen-revenue-increase': {
      id: 'bellas-kitchen-revenue-increase',
      title: 'How Bella\'s Kitchen Increased Revenue by 35%',
      excerpt: 'Real customer success story: How DineOpen transformed a local restaurant\'s operations.',
      content: `
        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Bella's Kitchen Restaurant" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Bella's Kitchen - A family-owned Italian restaurant success story</p>
        </div>

        <p>Bella's Kitchen, a family-owned Italian restaurant in downtown Chicago, was struggling to keep up with increasing competition.</p>
        
        <p>After implementing DineOpen, they achieved remarkable results that transformed their business.</p>

        <h2>🏪 The Challenge</h2>
        <p>Before DineOpen, Bella's Kitchen faced several challenges:</p>
        <ul>
          <li>Manual order taking was slow and error-prone</li>
          <li>Kitchen communication was inefficient</li>
          <li>Inventory management was chaotic</li>
          <li>Staff scheduling was based on guesswork</li>
          <li>Customer data was not being utilized</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Restaurant Staff Taking Orders" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Staff efficiently managing orders with DineOpen's modern system</p>
        </div>

        <h2>🚀 The Solution</h2>
        <p>Bella's Kitchen implemented DineOpen's complete restaurant management system.</p>
        
        <p>This included:</p>
        <ul>
          <li>Digital menu management with AI-powered updates</li>
          <li>Real-time kitchen order tracking</li>
          <li>Comprehensive inventory management</li>
          <li>Staff performance analytics</li>
          <li>Customer behavior insights</li>
        </ul>

        <h2>📈 The Results</h2>
        <p>The transformation was immediate and dramatic:</p>
        <ul>
          <li><strong>35% increase in revenue</strong> within 3 months</li>
          <li><strong>50% reduction in order errors</strong></li>
          <li><strong>25% faster table turnover</strong></li>
          <li><strong>40% improvement in inventory accuracy</strong></li>
          <li><strong>60% reduction in food waste</strong></li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="Happy Customers Dining" style="width: 100%; max-width: 600px; height: 300px; object-fit: cover; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.1);" />
          <p style="font-size: 14px; color: #6b7280; margin-top: 8px; font-style: italic;">Happy customers enjoying their improved dining experience</p>
        </div>

        <h2>💬 Customer Testimonial</h2>
        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px;">
          <p style="font-style: italic; font-size: 18px; color: #1f2937; margin: 0;">
            "DineOpen didn't just improve our operations - it revolutionized our entire business model. We're now more efficient, profitable, and able to focus on what we do best: creating amazing food experiences for our customers."
          </p>
          <p style="font-weight: 600; color: #10b981; margin: 10px 0 0 0;">
            - Maria Rodriguez, Owner, Bella's Kitchen
          </p>
        </div>

        <h2>🎯 Key Takeaways</h2>
        <p>Bella's Kitchen's success demonstrates that with the right technology and implementation, any restaurant can achieve significant improvements.</p>
        
        <p>The key is choosing a solution that grows with your business and provides real, measurable value.</p>
      `,
      author: 'Customer Success',
      authorRole: 'Success Team',
      publishDate: 'December 5, 2024',
      readTime: '5 min read',
      category: 'Success Story',
      categoryColor: '#10b981',
      tags: ['Success Story', 'Case Study', 'Revenue Growth', 'Customer']
    }
  };

  useEffect(() => {
    const slug = params.slug;
    const post = blogPosts[slug];
    
    if (post) {
      setBlogPost(post);
    }
    setLoading(false);
  }, [params.slug, blogPosts]);

  const handleBack = () => {
    router.push('/#blog');
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blogPost?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #fed7aa',
            borderTop: '4px solid #f97316',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', padding: '40px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Blog Post Not Found
          </h1>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px' }}>
            The blog post you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <button
            onClick={handleBack}
            style={{
              padding: '12px 24px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            <FaArrowLeft size={16} />
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <button
            onClick={handleBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#6b7280';
            }}
          >
            <FaArrowLeft size={14} />
            Back to Blog
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>Share:</span>
            <button
              onClick={() => handleShare('facebook')}
              style={{
                padding: '8px',
                backgroundColor: '#1877f2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <FaFacebook size={14} />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              style={{
                padding: '8px',
                backgroundColor: '#1da1f2',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <FaTwitter size={14} />
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              style={{
                padding: '8px',
                backgroundColor: '#0077b5',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <FaLinkedin size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Blog Content */}
      <main style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Blog Header */}
          <div style={{ marginBottom: '40px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              backgroundColor: blogPost.categoryColor,
              color: 'white',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '20px'
            }}>
              {blogPost.category === 'Featured' && <FaRocket size={14} />}
              {blogPost.category === 'Analytics' && <FaChartBar size={14} />}
              {blogPost.category === 'Success Story' && <FaUsers size={14} />}
              {blogPost.category}
            </div>
            
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '20px',
              lineHeight: '1.2'
            }}>
              {blogPost.title}
            </h1>
            
            <p style={{
              fontSize: '20px',
              color: '#6b7280',
              marginBottom: '30px',
              lineHeight: '1.6'
            }}>
              {blogPost.excerpt}
            </p>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              padding: '20px 0',
              borderTop: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaUtensils color="#6b7280" size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px' }}>
                    {blogPost.author}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {blogPost.authorRole}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                <FaCalendarAlt size={14} />
                <span style={{ fontSize: '14px' }}>{blogPost.publishDate}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280' }}>
                <FaClock size={14} />
                <span style={{ fontSize: '14px' }}>{blogPost.readTime}</span>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <article style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            lineHeight: '1.8',
            fontSize: '18px',
            color: '#374151'
          }}>
            <div dangerouslySetInnerHTML={{ __html: blogPost.content }} />
          </article>

          {/* Tags */}
          <div style={{ marginTop: '40px', padding: '20px 0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
              Tags
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {blogPost.tags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
            Ready to Transform Your Restaurant?
          </h3>
          <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '32px' }}>
            Join thousands of restaurants already using DineOpen to streamline their operations.
          </p>
          <button
            onClick={() => router.push('/#pricing')}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
            }}
          >
            Get Started Today
          </button>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        article h2 {
          font-size: 28px;
          font-weight: bold;
          color: #1f2937;
          margin: 32px 0 16px 0;
        }
        
        article h3 {
          font-size: 22px;
          font-weight: 600;
          color: #1f2937;
          margin: 24px 0 12px 0;
        }
        
        article p {
          margin-bottom: 16px;
        }
        
        article ul {
          margin: 16px 0;
          padding-left: 24px;
        }
        
        article li {
          margin-bottom: 8px;
        }
        
        article strong {
          color: #1f2937;
        }
      `}</style>
    </div>
  );
}
