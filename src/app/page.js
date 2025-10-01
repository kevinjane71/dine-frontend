'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaUtensils,
  FaChartBar,
  FaTable, 
  FaMobile,
  FaCloud,
  FaClock,
  FaUsers,
  FaCheckCircle,
  FaArrowRight,
  FaBars,
  FaTimes,
  FaPlay,
  FaShieldAlt,
  FaHeadset,
  FaRocket
} from 'react-icons/fa';

export default function LandingPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const features = [
    {
      icon: <FaUtensils size={24} />,
      title: "Digital Menu Management",
      description: "Create beautiful digital menus with photos, categories, and real-time updates"
    },
    {
      icon: <FaTable size={24} />,
      title: "Table Management",
      description: "Track table status, manage floor layouts, and optimize seating arrangements"
    },
    {
      icon: <FaChartBar size={24} />,
      title: "Kitchen Order Tracking",
      description: "Real-time KOT system with cooking timers and order status updates"
    },
    {
      icon: <FaMobile size={24} />,
      title: "Mobile-First Design",
      description: "Works perfectly on tablets, phones, and POS terminals"
    },
    {
      icon: <FaCloud size={24} />,
      title: "Cloud-Based",
      description: "Access your restaurant data from anywhere, anytime with automatic backups"
    },
    {
      icon: <FaClock size={24} />,
      title: "Real-Time Updates",
      description: "Live order updates between kitchen, waitstaff, and management"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "₹999",
      period: "per month",
      description: "Perfect for small cafes and food stalls",
      features: [
        "Up to 50 menu items",
        "1 restaurant location",
        "Basic POS system",
        "Table management (up to 20 tables)",
        "Kitchen order tracking",
        "Mobile app access",
        "Email support"
      ],
      popular: false,
      buttonText: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "₹2,499",
      period: "per month",
      description: "Ideal for growing restaurants",
      features: [
        "Unlimited menu items",
        "Up to 3 restaurant locations",
        "Advanced POS with payments",
        "Unlimited tables & floors",
        "Real-time kitchen display",
        "Staff management",
        "Analytics & reports",
        "Priority support",
        "Custom branding"
      ],
      popular: true,
      buttonText: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "₹4,999",
      period: "per month",
      description: "For restaurant chains and large operations",
      features: [
        "Everything in Professional",
        "Unlimited locations",
        "Multi-restaurant dashboard",
        "Advanced analytics",
        "Inventory management",
        "Customer loyalty programs",
        "API access",
        "24/7 phone support",
        "Custom integrations"
      ],
      popular: false,
      buttonText: "Contact Sales"
    }
  ];

  const handleGetStarted = () => {
    router.push('/login');
  };

  const handleLogin = () => {
    router.push('/login');
  };

    return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
            gap: '12px',
            cursor: 'pointer'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FaUtensils color="white" size={20} />
          </div>
            <span style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              DineFlow
            </span>
        </div>
          
          {/* Desktop Navigation */}
          {!isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <a href="#features" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                transition: 'color 0.2s'
              }} onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                Features
              </a>
              <a href="#blog" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                transition: 'color 0.2s'
              }} onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                Blog
              </a>
              <a href="#pricing" style={{
                color: '#6b7280',
                textDecoration: 'none',
                fontWeight: '500',
                fontSize: '16px',
                transition: 'color 0.2s'
              }} onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                 onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                Pricing
              </a>
          <button
                onClick={handleLogin}
            style={{
                  padding: '10px 20px',
                  backgroundColor: 'transparent',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                }}
              >
                Sign In
          </button>
          <button
                onClick={handleGetStarted}
            style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
                  borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(239, 68, 68, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.3)';
                }}
              >
                Get Started Free
          </button>
      </div>
          ) : (
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {showMobileMenu ? <FaTimes size={24} color="#374151" /> : <FaBars size={24} color="#374151" />}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobile && showMobileMenu && (
        <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '20px',
          display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <a href="#features" style={{
              color: '#374151',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '16px',
              padding: '8px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              Features
            </a>
            <a href="#pricing" style={{
              color: '#374151',
              textDecoration: 'none',
              fontWeight: '500',
              fontSize: '16px',
              padding: '8px 0',
              borderBottom: '1px solid #f3f4f6'
            }}>
              Pricing
            </a>
            <button
              onClick={handleLogin}
              style={{
                padding: '12px 20px',
                backgroundColor: 'transparent',
                color: '#374151',
                border: '1px solid #d1d5db',
                  borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={handleGetStarted}
              style={{
                padding: '12px 20px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Get Started Free
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #fef7f0 0%, #fef2f2 100%)',
        padding: isMobile ? '60px 20px' : '100px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: isMobile ? '32px' : '56px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '24px',
            lineHeight: '1.1'
          }}>
            Modern Restaurant Management Made <span style={{ color: '#ef4444' }}>Simple</span>
          </h1>
          <p style={{
            fontSize: isMobile ? '18px' : '20px',
            color: '#6b7280',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Streamline your restaurant operations with our all-in-one platform. From digital menus to kitchen management, we haveve got you covered.
          </p>
          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '16px',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          <button
              onClick={handleGetStarted}
            style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
                fontWeight: 'bold',
                fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
                    transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
                width: isMobile ? '100%' : 'auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
              }}
            >
              <FaRocket size={20} />
              Start Free Trial
          </button>
          <button
            style={{
                padding: '16px 32px',
                backgroundColor: 'transparent',
                color: '#374151',
                border: '2px solid #d1d5db',
              borderRadius: '12px',
                fontWeight: '600',
                fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
                transition: 'all 0.3s ease',
                width: isMobile ? '100%' : 'auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = '#d1d5db';
              }}
            >
              <FaPlay size={16} />
              Watch Demo
                </button>
          </div>
          </div>
      </section>

      {/* Social Proof Banner */}
      <section style={{
        background: 'linear-gradient(135deg, rgb(255 246 241) 0%, rgb(254 245 242) 50%, rgb(255 244 243) 100%)',
        padding: isMobile ? '30px 20px' : '40px 20px',
        color: '#1f2937',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid #f3f4f6',
        borderBottom: '1px solid #f3f4f6'
      }}>
        {/* Background Pattern */}
        <div style={{
                position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ef4444" fill-opacity="0.08"%3E%3Ccircle cx="20" cy="20" r="1.5"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: '0.7'
        }}></div>
        
        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
                display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
                alignItems: 'center',
            justifyContent: 'space-around',
            gap: isMobile ? '20px' : '40px'
          }}>
            {/* Statistic 1 */}
      <div style={{ 
        display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}>
          <div style={{ 
                fontSize: isMobile ? '32px' : '42px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1'
              }}>
                1000+
              </div>
              <div style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                color: '#374151'
              }}>
                Restaurants Using
              </div>
              <div style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                DineFlow
            </div>
          </div>
          
            {/* Divider */}
            <div style={{
              width: isMobile ? '40px' : '2px',
              height: isMobile ? '2px' : '40px',
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
              borderRadius: '2px',
              opacity: '0.4'
            }}></div>

            {/* Statistic 2 */}
                  <div style={{
                    display: 'flex',
              flexDirection: 'column',
                    alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{
                fontSize: isMobile ? '32px' : '42px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1'
              }}>
                30%
                  </div>
                    <div style={{ 
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                color: '#374151'
              }}>
                More Savings
              </div>
              <div style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#6b7280',
                      fontWeight: '500'
              }}>
                vs Traditional Software
                  </div>
          </div>

            {/* Divider */}
            <div style={{
              width: isMobile ? '40px' : '2px',
              height: isMobile ? '2px' : '40px',
              background: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
              borderRadius: '2px',
              opacity: '0.4'
            }}></div>

            {/* Statistic 3 */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              gap: '6px'
            }}>
              <div style={{
                fontSize: isMobile ? '32px' : '42px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1'
              }}>
                40%
            </div>
              <div style={{
                fontSize: isMobile ? '14px' : '16px',
                fontWeight: '600',
                color: '#374151'
              }}>
                Faster Processing
              </div>
              <div style={{
                fontSize: isMobile ? '12px' : '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Average Improvement
              </div>
            </div>
          </div>
          
          {/* Trust Indicators */}
            <div style={{
            marginTop: '25px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(239, 68, 68, 0.1)'
          }}>
                      <div style={{
                        display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
              gap: isMobile ? '15px' : '30px',
              flexWrap: 'wrap'
            }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                <div style={{
                  width: '14px',
                  height: '14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaCheckCircle color="white" size={8} />
                </div>
                <span>Trusted by 1000+ Restaurants</span>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                gap: '6px',
                        fontSize: '13px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                <div style={{
                  width: '14px',
                  height: '14px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaShieldAlt color="white" size={8} />
                </div>
                <span>Bank-Level Security</span>
              </div>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                color: '#6b7280',
                fontWeight: '500'
                      }}>
                        <div style={{
                  width: '14px',
                  height: '14px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaHeadset color="white" size={8} />
                      </div>
                <span>24/7 Customer Support</span>
                    </div>
                  </div>
            </div>
          </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: isMobile ? '60px 20px' : '100px 20px',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              Everything You Need to Run Your Restaurant
                </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              From order management to kitchen operations, our platform handles it all seamlessly
            </p>
              </div>
              
            <div style={{
              display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                style={{
                  padding: '32px 24px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  textAlign: 'center',
                      transition: 'all 0.3s ease',
                  border: '1px solid #e5e7eb'
                }}
                    onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                  e.target.style.borderColor = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
                      <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: 'white'
                }}>
                  {feature.icon}
            </div>
                <h3 style={{
                  fontSize: '20px',
                        fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '12px'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.6'
                }}>
                  {feature.description}
                </p>
          </div>
            ))}
                </div>
              </div>
      </section>

      {/* Blog Section */}
      <section id="blog" style={{
        padding: isMobile ? '60px 20px' : '100px 20px',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: isMobile ? '28px' : '36px',
                            fontWeight: 'bold',
                        color: '#1f2937',
              marginBottom: '16px'
            }}>
              Latest Insights & Updates
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Stay updated with restaurant industry trends, product updates, and success stories.
            </p>
                      </div>
                      
                    <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '32px',
            marginBottom: '40px'
          }}>
            {/* Featured Blog Post */}
            <div 
              onClick={() => router.push('/blog/why-dineflow-future-restaurant-management')}
                          style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.borderColor = '#ef4444';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = 'transparent';
              }}>
              <div style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                padding: '24px',
                color: 'white'
              }}>
                      <div style={{
                          display: 'flex',
                          alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <FaRocket size={16} />
                        <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                    Featured
                        </span>
                      </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  lineHeight: '1.3'
                }}>
                  Why DineFlow is the Future of Restaurant Management
                </h3>
                <p style={{
                  fontSize: '16px',
                  opacity: '0.9',
                  lineHeight: '1.5',
                  marginBottom: '16px'
                }}>
                  Discover how our AI-powered POS system is revolutionizing restaurant operations and why it's outperforming traditional competitors.
                </p>
                <div style={{
                            display: 'flex',
                            alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  opacity: '0.8'
                }}>
                  <span>December 15, 2024</span>
                  <span>•</span>
                  <span>8 min read</span>
                      </div>
                    </div>
                    
              <div style={{ padding: '24px' }}>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                    <div style={{ 
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                    <FaUtensils color="#6b7280" size={16} />
                    </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937' }}>DineFlow Team</div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>Product Team</div>
                  </div>
                  </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    fontSize: '18px',
                      fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '12px'
                  }}>
                    🚀 The Restaurant Industry is Evolving
                  </h4>
                  <p style={{
                    fontSize: '15px',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    marginBottom: '16px'
                  }}>
                    Traditional POS systems are becoming obsolete. Restaurants need intelligent, cloud-based solutions that adapt to modern business needs. DineFlow delivers exactly that.
                  </p>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '12px'
                  }}>
                    💡 Key Advantages Over Competitors
                        </h4>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <FaCheckCircle color="#10b981" size={16} />
                      <span style={{ fontSize: '15px', color: '#4b5563' }}>
                        <strong>AI-Powered Menu Management:</strong> Automatically extract menu items from photos/PDFs
                      </span>
                    </div>
                    <div style={{
                              display: 'flex',
                              alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <FaCheckCircle color="#10b981" size={16} />
                      <span style={{ fontSize: '15px', color: '#4b5563' }}>
                        <strong>Multi-Staff Support:</strong> Unlimited staff members with individual tracking
                      </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <FaCheckCircle color="#10b981" size={16} />
                      <span style={{ fontSize: '15px', color: '#4b5563' }}>
                        <strong>Real-Time Kitchen Integration:</strong> Instant order updates to KOT system
                        </span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      <FaCheckCircle color="#10b981" size={16} />
                      <span style={{ fontSize: '15px', color: '#4b5563' }}>
                        <strong>Comprehensive Inventory:</strong> End-to-end stock management with supplier tracking
                      </span>
                      </div>
                    </div>
                  </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '12px'
                  }}>
                    💰 Competitive Pricing Advantage
                  </h4>
                <div style={{ 
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                      borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px'
                }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px'
                        }}>
                      <FaChartBar color="#10b981" size={16} />
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>Cost Comparison</span>
                        </div>
                    <div style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>
                      <div>• <strong>Square:</strong> $60-120/month + 2.6% transaction fees</div>
                      <div>• <strong>Toast:</strong> $165-300/month + hardware costs</div>
                      <div>• <strong>DineFlow:</strong> $29-79/month, no transaction fees, includes AI features</div>
                  </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{
                    fontSize: '18px',
                      fontWeight: '600',
                    color: '#1f2937',
                    marginBottom: '12px'
                  }}>
                    🎯 Why Restaurants Choose DineFlow
                  </h4>
                  <p style={{
                    fontSize: '15px',
                    color: '#4b5563',
                    lineHeight: '1.6',
                    marginBottom: '16px'
                  }}>
                    Our customers report 40% faster order processing, 60% reduction in menu management time, and 25% increase in staff efficiency. The AI-powered features that competitors charge extra for are included in our base plans.
                  </p>
                        </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                  gap: '8px',
                  color: '#ef4444',
                      fontWeight: '600',
                  fontSize: '15px'
                    }}>
                  <span>Read Full Article</span>
                  <FaArrowRight size={14} />
                    </div>
                </div>
      </div>

            {/* Additional Blog Posts */}
          <div 
              onClick={() => router.push('/blog/restaurant-analytics-data-driven-success')}
            style={{
            backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}>
            <div style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              padding: '20px',
                color: 'white'
              }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <FaChartBar size={16} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Analytics
                  </span>
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  lineHeight: '1.3'
                }}>
                  Restaurant Analytics: Data-Driven Success
                </h3>
                <p style={{
                  fontSize: '14px',
                  opacity: '0.9',
                  lineHeight: '1.5'
                }}>
                  Learn how to leverage restaurant analytics to boost revenue and optimize operations.
                </p>
            </div>

              <div style={{ padding: '20px' }}>
                <div style={{
                      display: 'flex',
                      alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                    <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                          borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                    justifyContent: 'center'
                        }}>
                    <FaChartBar color="#6b7280" size={14} />
                    </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>Analytics Team</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>December 10, 2024</div>
                    </div>
            </div>
                    <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#3b82f6',
                      fontWeight: '600',
                  fontSize: '14px'
                    }}>
                  <span>Read More</span>
                  <FaArrowRight size={12} />
          </div>
                </div>
      </div>

          <div 
              onClick={() => router.push('/blog/bellas-kitchen-revenue-increase')}
            style={{
            backgroundColor: 'white',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}>
            <div style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '20px',
                color: 'white'
              }}>
                <div style={{
              display: 'flex',
              alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <FaUsers size={16} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Success Story
                  </span>
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  lineHeight: '1.3'
                }}>
                  How Bella's Kitchen Increased Revenue by 35%
                </h3>
                <p style={{
                  fontSize: '14px',
                  opacity: '0.9',
                  lineHeight: '1.5'
                }}>
                  Real customer success story: How DineFlow transformed a local restaurant's operations.
                </p>
                    </div>
                    
              <div style={{ padding: '20px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                      }}>
                    <div style={{
                            width: '32px',
                            height: '32px',
                    background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaUsers color="#6b7280" size={14} />
                    </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>Customer Success</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>December 5, 2024</div>
                    </div>
            </div>
          <div style={{
                          display: 'flex',
                          alignItems: 'center',
                  gap: '8px',
                  color: '#10b981',
                  fontWeight: '600',
                          fontSize: '14px'
                        }}>
                  <span>Read More</span>
                  <FaArrowRight size={12} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button style={{
              padding: '12px 24px',
                  backgroundColor: 'transparent',
              color: '#ef4444',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '16px',
                  cursor: 'pointer',
              transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#ef4444';
            }}>
              <span>View All Articles</span>
              <FaArrowRight size={14} />
                        </button>
                      </div>
                      </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{
        padding: isMobile ? '60px 20px' : '100px 20px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: isMobile ? '28px' : '36px',
              fontWeight: 'bold',
              color: '#1f2937',
                  marginBottom: '16px'
                }}>
              Choose Your Perfect Plan
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Start free and scale as you grow. All plans include 14-day free trial.
            </p>
                </div>

                      <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: '24px',
            alignItems: 'stretch'
          }}>
            {plans.map((plan, index) => (
              <div
                key={index}
                  style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  position: 'relative',
                  border: plan.popular ? '2px solid #ef4444' : '1px solid #e5e7eb',
                  boxShadow: plan.popular ? '0 8px 32px rgba(239, 68, 68, 0.15)' : '0 4px 16px rgba(0,0,0,0.05)',
                    display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    padding: '6px 20px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    Most Popular
              </div>
                )}

                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <h3 style={{
                    fontSize: '24px',
                          fontWeight: 'bold',
                          color: '#1f2937',
                    marginBottom: '8px'
                  }}>
                    {plan.name}
                  </h3>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{
                      fontSize: '36px',
                      fontWeight: 'bold',
                      color: '#1f2937'
                    }}>
                      {plan.price}
                        </span>
                    <span style={{ color: '#6b7280' }}>/{plan.period}</span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>
                    {plan.description}
                  </p>
            </div>
            
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '0 0 32px 0',
                  flex: 1
                }}>
                  {plan.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                  style={{
                        padding: '8px 0',
                            display: 'flex',
                            alignItems: 'center',
                        gap: '12px',
                    fontSize: '14px',
                        color: '#374151'
                      }}
                    >
                      <FaCheckCircle size={16} color="#10b981" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={handleGetStarted}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    background: plan.popular 
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                      : 'transparent',
                    color: plan.popular ? 'white' : '#ef4444',
                    border: plan.popular ? 'none' : '2px solid #ef4444',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (plan.popular) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
                    } else {
                      e.target.style.backgroundColor = '#ef4444';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.popular) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    } else {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#ef4444';
                    }
                  }}
                >
                  {plan.buttonText}
                        </button>
                </div>
            ))}
              </div>
            </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: isMobile ? '60px 20px' : '100px 20px',
        backgroundColor: '#1f2937',
                  color: 'white', 
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: isMobile ? '28px' : '36px',
            fontWeight: 'bold',
                  marginBottom: '16px'
                }}>
            Ready to Transform Your Restaurant?
          </h2>
          <p style={{
            fontSize: '18px',
            color: '#d1d5db',
            marginBottom: '40px'
          }}>
            Join thousands of restaurants already using DineFlow to streamline their operations
          </p>
              <button
            onClick={handleGetStarted}
                style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
              borderRadius: '12px',
              fontWeight: 'bold',
              fontSize: '18px',
                  cursor: 'pointer',
              display: 'inline-flex',
                    alignItems: 'center',
              gap: '8px',
                    transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
            }}
          >
            Get Started Today
            <FaArrowRight size={16} />
              </button>
              </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#111827',
                  color: 'white',
        padding: isMobile ? '40px 20px' : '60px 20px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
            gap: '40px',
            marginBottom: '40px'
          }}>
            <div>
              <div style={{
          display: 'flex',
          alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
        }}>
          <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaUtensils color="white" size={16} />
            </div>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 'bold'
                }}>
                  DineFlow
                  </span>
          </div>
              <p style={{
                color: '#9ca3af',
                fontSize: '14px',
                lineHeight: '1.6'
              }}>
                Modern restaurant management platform designed to streamline operations and boost efficiency.
                </p>
        </div>

            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: 'white'
              }}>
                Product
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#features" style={{ color: '#9ca3af', textDecoration: 'none' }}>Features</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="#pricing" style={{ color: '#9ca3af', textDecoration: 'none' }}>Pricing</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/api-docs" style={{ color: '#9ca3af', textDecoration: 'none' }}>API</a>
                </li>
              </ul>
    </div>
            
            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: 'white'
              }}>
                Support
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/help" style={{ color: '#9ca3af', textDecoration: 'none' }}>Help Center</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/contact" style={{ color: '#9ca3af', textDecoration: 'none' }}>Contact</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/status" style={{ color: '#9ca3af', textDecoration: 'none' }}>Status</a>
                </li>
              </ul>
            </div>

            <div>
              <h4 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: 'white'
              }}>
                Legal
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/privacy" style={{ color: '#9ca3af', textDecoration: 'none' }}>Privacy Policy</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/terms" style={{ color: '#9ca3af', textDecoration: 'none' }}>Terms of Service</a>
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <a href="/cookies" style={{ color: '#9ca3af', textDecoration: 'none' }}>Cookie Policy</a>
                </li>
              </ul>
          </div>
        </div>

        <div style={{
            borderTop: '1px solid #374151',
            paddingTop: '20px',
            textAlign: 'center'
          }}>
            <p style={{
              color: '#9ca3af',
              fontSize: '14px',
              margin: 0
            }}>
              © 2024 DineFlow. All rights reserved.
            </p>
      </div>
        </div>
      </footer>
    </div>
  );
}
