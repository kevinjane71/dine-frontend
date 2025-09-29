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
            Streamline your restaurant operations with our all-in-one platform. From digital menus to kitchen management, we've got you covered.
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