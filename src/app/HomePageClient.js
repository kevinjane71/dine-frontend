'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '../lib/api';
import SEOStructuredData from '../components/SEOStructuredData';
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
  FaRocket,
  FaChevronDown,
  FaRobot,
  FaStore,
  FaBoxes,
  FaWarehouse,
  FaBuilding
} from 'react-icons/fa';

export default function LandingPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoContactType, setDemoContactType] = useState('phone'); // 'phone' or 'email'
  const [demoPhone, setDemoPhone] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoComment, setDemoComment] = useState('');
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [demoError, setDemoError] = useState('');
  const [currency, setCurrency] = useState('INR'); // 'INR' or 'USD'
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024); // Increased breakpoint for better tablet support
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Background authentication check
  useEffect(() => {
    const checkAuthInBackground = async () => {
      if (apiClient.isAuthenticated()) {
        const redirectPath = apiClient.getRedirectPath();
        console.log('🔄 User already authenticated, redirecting to:', redirectPath);
        router.replace(redirectPath);
      }
    };

    // Check after a short delay to not block initial render
    const timeoutId = setTimeout(checkAuthInBackground, 500);
    return () => clearTimeout(timeoutId);
  }, [router]);

  const features = [
    {
      icon: <FaRobot size={28} />,
      title: "AI Agent (Voice & Chat)",
      description: "Intelligent assistant that takes orders via voice, answers questions, manages tables, and handles operations through natural conversation.",
      gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      color: '#8b5cf6'
    },
    {
      icon: <FaStore size={28} />,
      title: "Restaurant Management",
      description: "Complete POS system with menu management, order tracking, billing, and real-time kitchen integration.",
      gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
      color: '#ef4444'
    },
    {
      icon: <FaBoxes size={28} />,
      title: "Inventory Management",
      description: "Track stock levels, manage suppliers, handle purchase orders, and get AI-powered reorder suggestions.",
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      color: '#10b981'
    },
    {
      icon: <FaWarehouse size={28} />,
      title: "Supply Chain Management",
      description: "End-to-end supply chain with GRN, invoices, returns, stock transfers, and supplier performance tracking.",
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      color: '#3b82f6'
    },
    {
      icon: <FaTable size={28} />,
      title: "Table Management",
      description: "Smart table booking, floor management, real-time status tracking, and seamless order-to-table flow.",
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      color: '#f59e0b'
    },
    {
      icon: <FaBuilding size={28} />,
      title: "Hotel Management (PMS)",
      description: "Complete Property Management System for hotels with room booking, guest management, and housekeeping.",
      gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
      color: '#ec4899'
    }
  ];

  const plans = [
    {
      name: "Starter",
      priceINR: 999,
      priceUSD: 12,
      period: "per month",
      description: "Perfect for small cafes and food stalls",
      features: [
        "AI Agent (Voice/Chat): 500 credits/month",
        "Up to 500 menu items",
        "1 restaurant location",
        "Basic POS system",
        "Table management (up to 200 tables)",
        "Kitchen order tracking",
        "Mobile app access",
        "Email support"
      ],
      popular: false,
      buttonText: "Start 1 Month Free Trial"
    },
    {
      name: "Professional",
      priceINR: 2499,
      priceUSD: 30,
      period: "per month",
      description: "Ideal for growing restaurants",
      features: [
        "AI Agent (Voice/Chat): 1,000 credits/month",
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
      buttonText: "Start 1 Month Free Trial"
    },
    {
      name: "Enterprise",
      priceINR: 4999,
      priceUSD: 60,
      period: "per month",
      description: "For restaurant chains and large operations",
      features: [
        "AI Agent (Voice/Chat): 2,000 credits/month",
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
    // Check if user is already authenticated
    if (apiClient.isAuthenticated()) {
      const redirectPath = apiClient.getRedirectPath();
      console.log('🔄 User already authenticated, redirecting to:', redirectPath);
      router.replace(redirectPath);
    } else {
      router.push('/login');
    }
  };

  const handleDemoLogin = () => {
    router.push('/login?demo=true');
  };

  const handleSubmitDemoRequest = async () => {
    // Validate required fields
    if (demoContactType === 'phone' && !demoPhone.trim()) {
      setDemoError('Phone number is required');
      return;
    }
    if (demoContactType === 'email' && !demoEmail.trim()) {
      setDemoError('Email is required');
      return;
    }

    setDemoSubmitting(true);
    setDemoError('');

    try {
      await apiClient.submitDemoRequest(
        demoContactType,
        demoPhone.trim(),
        demoEmail.trim(),
        demoComment.trim()
      );

      setDemoSuccess(true);
      setTimeout(() => {
        setShowDemoModal(false);
        setDemoSuccess(false);
        setDemoPhone('');
        setDemoEmail('');
        setDemoComment('');
        setDemoContactType('phone');
      }, 2000);
    } catch (error) {
      setDemoError(error.message || 'Failed to submit demo request. Please try again.');
    } finally {
      setDemoSubmitting(false);
    }
  };

    return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(239, 68, 68, 0.1)',
        padding: '12px 0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.1)',
        transition: 'all 0.3s ease'
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
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                borderRadius: '12px',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  animation: 'shimmer 2s ease-in-out infinite'
                }} />
                <FaUtensils color="white" size={20} style={{ position: 'relative', zIndex: 1 }} />
          </div>
              <span style={{
                fontSize: '24px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.5px'
              }}>
                DineOpen
              </span>
        </div>
          
          {/* Desktop Navigation */}
          {!isMobile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                {/* Products Dropdown */}
                <div 
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setShowProductsDropdown(true)}
                  onMouseLeave={() => setShowProductsDropdown(false)}
                >
                  <a 
                    href="#" 
                    style={{
                      color: '#374151',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '15px',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      padding: '6px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer'
                    }} 
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ef4444';
                      e.target.style.transform = 'translateY(-1px)';
                      setShowProductsDropdown(true);
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#374151';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Products
                    <FaChevronDown size={12} />
                  </a>
                  
                  {showProductsDropdown && (
                    <>
                      {/* Invisible bridge to prevent gap */}
                      <div 
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          height: '8px',
                          zIndex: 101
                        }}
                        onMouseEnter={() => setShowProductsDropdown(true)}
                      />
                      <div 
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          marginTop: '8px',
                          backgroundColor: 'white',
                          borderRadius: '12px',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                          padding: '12px 0',
                          minWidth: '280px',
                          zIndex: 100,
                          border: '1px solid rgba(239, 68, 68, 0.1)'
                        }}
                        onMouseEnter={() => setShowProductsDropdown(true)}
                        onMouseLeave={() => setShowProductsDropdown(false)}
                      >
                      <a 
                        href="/products/ai-agent" 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 20px',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        <FaRobot size={18} color="#ef4444" />
                        <span style={{ fontWeight: '500', fontSize: '14px' }}>AI Agent for Restaurant</span>
                      </a>
                      <a 
                        href="/products/restaurant-management" 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 20px',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        <FaStore size={18} color="#ef4444" />
                        <span style={{ fontWeight: '500', fontSize: '14px' }}>Restaurant Management System</span>
                      </a>
                      <a 
                        href="/products/inventory-management" 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 20px',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        <FaBoxes size={18} color="#ef4444" />
                        <span style={{ fontWeight: '500', fontSize: '14px' }}>Inventory Management</span>
                      </a>
                      <a 
                        href="/products/supply-management" 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 20px',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        <FaWarehouse size={18} color="#ef4444" />
                        <span style={{ fontWeight: '500', fontSize: '14px' }}>Supply Management</span>
                      </a>
                      <a 
                        href="/products/hotel-management" 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 20px',
                          color: '#374151',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }}
                      >
                        <FaBuilding size={18} color="#ef4444" />
                        <span style={{ fontWeight: '500', fontSize: '14px' }}>Hotel Management</span>
                      </a>
                      </div>
                    </>
                  )}
                </div>
                
                <a href="#features" style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  padding: '6px 0'
                }} 
                onMouseEnter={(e) => {
                  e.target.style.color = '#ef4444';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#374151';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  Features
                </a>
                <Link href="/blog" style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  padding: '6px 0'
                }} 
                onMouseEnter={(e) => {
                  e.target.style.color = '#ef4444';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#374151';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  Blog
                </Link>
                <a href="#pricing" style={{
                  color: '#374151',
                  textDecoration: 'none',
                  fontWeight: '600',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  padding: '6px 0'
                }} 
                onMouseEnter={(e) => {
                  e.target.style.color = '#ef4444';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#374151';
                  e.target.style.transform = 'translateY(0)';
                }}>
                  Pricing
                </a>
          </div>
          
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setShowDemoModal(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: '2px solid #ef4444',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#ef4444';
                    e.target.style.color = 'white';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#ef4444';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Book Demo
                </button>
          <button
                  onClick={handleLogin}
            style={{
                    padding: '8px 16px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '2px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                    e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Sign In
          </button>
          <button
                  onClick={handleGetStarted}
            style={{
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
              fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
              position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 1 }}>Get Started Free</span>
                  <div style={{
                position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.5s ease'
                  }} />
          </button>
        </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                  style={{
                  padding: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '2px solid rgba(239, 68, 68, 0.2)',
                  borderRadius: '8px',
                    cursor: 'pointer',
                  color: '#ef4444',
                  fontSize: '16px',
                    transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                  e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                  e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                }}
              >
                {showMobileMenu ? <FaTimes size={18} /> : <FaBars size={18} />}
                </button>
          </div>
        )}
          </div>
          
        {/* Mobile Menu */}
        {isMobile && showMobileMenu && (
            <div style={{ 
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.1)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
            zIndex: 40,
            padding: '16px 20px',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.1)', paddingBottom: '12px' }}>
                <div style={{ 
                  color: '#374151',
                  fontWeight: '600',
                  fontSize: '16px',
                  marginBottom: '12px'
                }}>
                  Products
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '12px' }}>
                  <a href="/products/ai-agent" style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }} 
                  onClick={() => setShowMobileMenu(false)}
                  onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                    <FaRobot size={16} />
                    AI Agent for Restaurant
                  </a>
                  <a href="/products/restaurant-management" style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }} 
                  onClick={() => setShowMobileMenu(false)}
                  onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                    <FaStore size={16} />
                    Restaurant Management
                  </a>
                  <a href="/products/inventory-management" style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }} 
                  onClick={() => setShowMobileMenu(false)}
                  onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                    <FaBoxes size={16} />
                    Inventory Management
                  </a>
                  <a href="/products/supply-management" style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }} 
                  onClick={() => setShowMobileMenu(false)}
                  onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                    <FaWarehouse size={16} />
                    Supply Management
                  </a>
                  <a href="/products/hotel-management" style={{
                    color: '#6b7280',
                    textDecoration: 'none',
                    fontSize: '14px',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }} 
                  onClick={() => setShowMobileMenu(false)}
                  onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.target.style.color = '#6b7280'}>
                    <FaBuilding size={16} />
                    Hotel Management
                  </a>
                </div>
              </div>
              <a href="#features" style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                padding: '8px 0',
                borderBottom: '1px solid rgba(239, 68, 68, 0.1)',
                transition: 'color 0.3s ease'
              }} 
              onClick={() => setShowMobileMenu(false)}
              onMouseEnter={(e) => e.target.style.color = '#ef4444'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}>
                Features
              </a>
              <Link href="/blog" style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                padding: '8px 0',
                borderBottom: '1px solid rgba(239, 68, 68, 0.1)',
                transition: 'color 0.3s ease'
              }} 
              onClick={() => setShowMobileMenu(false)}
              onMouseEnter={(e) => e.target.style.color = '#ef4444'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}>
                Blog
              </Link>
              <a href="#pricing" style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '16px',
                padding: '8px 0',
                borderBottom: '1px solid rgba(239, 68, 68, 0.1)',
                transition: 'color 0.3s ease'
              }} 
              onClick={() => setShowMobileMenu(false)}
              onMouseEnter={(e) => e.target.style.color = '#ef4444'}
              onMouseLeave={(e) => e.target.style.color = '#374151'}>
                Pricing
              </a>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                <button
                  onClick={() => {
                    setShowDemoModal(true);
                    setShowMobileMenu(false);
                  }}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: '2px solid #ef4444',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Book Demo
                </button>
                <button
                  onClick={() => {
                    handleLogin();
                    setShowMobileMenu(false);
                  }}
                    style={{
                    padding: '12px 20px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '2px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)'
                  }}
                    onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                    e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                    e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    handleGetStarted();
                    setShowMobileMenu(false);
                  }}
                  style={{
                    padding: '12px 20px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                  }}
                >
                  Get Started Free
                </button>
              </div>
            </div>
                      </div>
                    )}
      </nav>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
        padding: isMobile ? '40px 16px' : '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: isMobile ? '80vh' : '100vh',
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Background Pattern */}
        <div style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0
        }} />
        
        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '120px',
          height: '120px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '5%',
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '50%',
          animation: 'float 10s ease-in-out infinite'
        }} />
        
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          position: 'relative', 
          zIndex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: isMobile ? '40px' : '80px',
          width: '100%'
        }}>
          {/* Left Side: Text Content */}
          <div style={{
            flex: 0.8,
            textAlign: isMobile ? 'center' : 'left',
            maxWidth: isMobile ? '100%' : '500px'
          }}>
                    
            {/* AI Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              borderRadius: '50px',
              marginBottom: '24px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <FaRobot size={18} color="white" />
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                letterSpacing: '0.5px'
              }}>
                AI-Powered Restaurant Assistant
              </span>
            </div>
                    
            {/* Main Heading */}
            <h1 style={{
              fontSize: isMobile ? '32px' : '56px',
              fontWeight: '900',
              color: 'white',
              marginBottom: isMobile ? '20px' : '28px',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              lineHeight: '1.1'
            }}>
              AI Agent for
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #fef3c7, #fde68a, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
                marginTop: '8px'
              }}>
                Your Restaurant
              </span>
            </h1>
            
            {/* Subtitle */}
            <p style={{
              fontSize: isMobile ? '18px' : '22px',
              color: 'rgba(255, 255, 255, 0.95)',
              marginBottom: isMobile ? '16px' : '24px',
              fontWeight: '500',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              lineHeight: '1.5',
              maxWidth: '600px',
              margin: '0 auto 24px auto'
            }}>
              Voice & Chat AI Assistant that takes orders, manages tables, 
              answers questions, and handles your restaurant operations - 
              all through natural conversation.
            </p>
            
            {/* Key Benefits */}
            <div style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '16px',
              justifyContent: 'center',
              marginBottom: '40px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <FaCheckCircle size={16} color="white" />
                <span style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                  Voice Order Taking
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <FaCheckCircle size={16} color="white" />
                <span style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                  Smart Table Management
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <FaCheckCircle size={16} color="white" />
                <span style={{ fontSize: '14px', color: 'white', fontWeight: '500' }}>
                  Instant Answers
                </span>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div style={{ 
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '16px',
              justifyContent: isMobile ? 'center' : 'flex-start',
              alignItems: 'center',
              flexWrap: 'nowrap'
            }}>
              <button
                onClick={handleGetStarted}
                style={{
                  padding: '18px 36px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#dc2626',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  fontWeight: '700',
                  fontSize: isMobile ? '14px' : '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(0)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: isMobile ? '100%' : 'auto',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)';
                  e.target.style.background = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                }}
              >
                <FaRocket size={20} />
                <span>Start 1 Month Free Trial</span>
              </button>
              {/* Book Demo Button */}
              <button
                onClick={() => setShowDemoModal(true)}
                style={{
                  padding: '18px 36px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: isMobile ? '14px' : '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: isMobile ? '100%' : 'auto',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                <FaClock size={16} />
                <span>Book Demo</span>
              </button>
              
              {/* See Real Demo Button - Commented out */}
              {/* <button
                onClick={handleDemoLogin}
                style={{
                  padding: '18px 36px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: isMobile ? '14px' : '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  width: isMobile ? '100%' : 'auto',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                <FaPlay size={16} />
                <span>See Real Demo</span>
              </button> */}
            </div>
            
            {/* Key Features */}
            <div style={{ 
              marginTop: '40px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <p style={{
                fontSize: isMobile ? '12px' : '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                fontWeight: '500',
                textAlign: 'center',
                whiteSpace: isMobile ? 'normal' : 'nowrap',
                lineHeight: '1.6'
              }}>
                🏪 Multi-Restaurant Management • 🪑 Tables Booking & Management
              </p>
            </div>
          </div>

          {/* Right Side: Product Image */}
          <div style={{
            flex: 1.2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: isMobile ? '100%' : '100%'
          }}>
            <div style={{
              position: 'relative',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
              border: '3px solid rgba(255, 255, 255, 0.2)',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              padding: '20px',
              minHeight: '650px'
            }}>
              <img
                src="https://storage.googleapis.com/demoimage-7189/menu-items/LUETVd1eMwu4Bm7PvP9K/item_1760637762769_df90sl6pe/1760767605179-0-Screenshot%202025-10-18%20at%2011.36.31%C3%A2%C2%80%C2%AFAM.png"
                alt="DineOpen Restaurant Management Dashboard - Complete POS System"
                style={{
                  width: '100%',
                  height: '600px',
                  objectFit: 'cover',
                  borderRadius: '15px',
                  maxWidth: '100%',
                  display: 'block'
                }}
                onError={(e) => {
                  // Fallback if image doesn't load
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div style="
                      width: 100%; 
                      height: 600px; 
                      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); 
                      border-radius: 15px; 
                      display: flex; 
                      flex-direction: column; 
                      align-items: center; 
                      justify-content: center; 
                      color: #6b7280;
                      text-align: center;
                      padding: 40px;
                    ">
                      <div style="font-size: 48px; margin-bottom: 16px;">🍽️</div>
                      <div style="font-size: 24px; font-weight: bold; margin-bottom: 8px;">DineOpen Dashboard</div>
                      <div style="font-size: 16px;">Complete Restaurant Management System</div>
                      <div style="font-size: 14px; margin-top: 16px; opacity: 0.7;">Menu • Orders • Kitchen • Billing</div>
                    </div>
                  `;
                }}
              />
              
              {/* Live Demo Badge */}
              <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(239, 68, 68, 0.9)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)'
              }}>
                LIVE DEMO
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section id="features" style={{
        padding: isMobile ? '80px 20px' : '120px 20px',
        backgroundColor: '#fafafa',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '50px' : '80px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '50px',
              marginBottom: '20px'
            }}>
              <FaRocket size={16} color="#ef4444" />
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>
                Complete Solution
              </span>
            </div>
            <h2 style={{
              fontSize: isMobile ? '32px' : '48px',
              fontWeight: '900',
                          color: '#1f2937',
              marginBottom: '20px',
              lineHeight: '1.2'
            }}>
              Everything You Need to
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Run Your Restaurant
              </span>
                </h2>
            <p style={{
              fontSize: isMobile ? '16px' : '20px',
              color: '#6b7280',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              From AI-powered order taking to complete inventory management, 
              DineOpen provides all the tools you need in one unified platform.
            </p>
              </div>
              
            <div style={{
              display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: isMobile ? '24px' : '32px'
          }}>
            {features.map((feature, index) => (
              <div
                key={index}
                    style={{
                  padding: isMobile ? '32px 24px' : '40px 32px',
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  textAlign: 'left',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  border: '1px solid #e5e7eb',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}
                    onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = feature.color;
                    }}
                    onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
              >
                {/* Gradient Background Effect */}
                        <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: feature.gradient,
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0';
                }}
                />
                
                <div style={{
                  width: isMobile ? '56px' : '64px',
                  height: isMobile ? '56px' : '64px',
                  background: feature.gradient,
                  borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                            justifyContent: 'center',
                  marginBottom: '24px',
                  color: 'white',
                  boxShadow: `0 8px 24px ${feature.color}40`
                        }}>
                  {feature.icon}
                        </div>
                <h3 style={{
                  fontSize: isMobile ? '20px' : '24px',
                  fontWeight: '700',
                  color: '#1f2937',
                  marginBottom: '12px',
                  lineHeight: '1.3'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: '1.7',
                  fontSize: isMobile ? '15px' : '16px',
                  margin: 0
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
        padding: isMobile ? '40px 16px' : '100px 20px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '40px' : '60px' }}>
            <h2 style={{
              fontSize: isMobile ? '24px' : '36px',
                            fontWeight: 'bold',
                        color: '#1f2937',
              marginBottom: '16px'
            }}>
              Simple, Transparent Pricing
            </h2>
            <p style={{
              fontSize: isMobile ? '16px' : '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
                  lineHeight: '1.5',
                  marginBottom: '20px'
                }}>
              Start free and scale as you grow. All plans include 14-day free trial.
            </p>
            
            {/* Currency Toggle */}
          <div style={{
            display: 'flex',
              justifyContent: 'center',
                        alignItems: 'center',
                  gap: '12px',
              marginBottom: '40px'
            }}>
              <button
                onClick={() => setCurrency('INR')}
            style={{
                  padding: '8px 20px',
                  backgroundColor: currency === 'INR' ? '#ef4444' : 'transparent',
                  color: currency === 'INR' ? 'white' : '#6b7280',
                  border: `2px solid ${currency === 'INR' ? '#ef4444' : '#e5e7eb'}`,
                  borderRadius: '8px',
                    fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                INR (₹)
              </button>
            <button 
                onClick={() => setCurrency('USD')}
            style={{
                  padding: '8px 20px',
                  backgroundColor: currency === 'USD' ? '#ef4444' : 'transparent',
                  color: currency === 'USD' ? 'white' : '#6b7280',
                  border: `2px solid ${currency === 'USD' ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                USD ($)
                </button>
              </div>
            </div>
            
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: isMobile ? '24px' : '32px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {plans.map((plan, index) => {
              const price = currency === 'INR' ? plan.priceINR : plan.priceUSD;
              const period = currency === 'INR' ? 'month' : plan.period;
              
              return (
              <div
                key={index}
                  style={{
                  position: 'relative',
                    padding: isMobile ? '32px 24px' : '40px 32px',
            backgroundColor: 'white',
                    borderRadius: '20px',
                  border: plan.popular ? '2px solid #ef4444' : '1px solid #e5e7eb',
                    boxShadow: plan.popular ? '0 8px 32px rgba(239, 68, 68, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = plan.popular 
                      ? '0 12px 40px rgba(239, 68, 68, 0.2)' 
                      : '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = plan.popular 
                      ? '0 8px 32px rgba(239, 68, 68, 0.15)' 
                      : '0 2px 8px rgba(0,0,0,0.05)';
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                      top: '-16px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                      backgroundColor: '#ef4444',
                    color: 'white',
                      padding: '8px 20px',
                    borderRadius: '20px',
                      fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                      zIndex: 10,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                  }}>
                    Most Popular
              </div>
                )}

                  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <h3 style={{
                      fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                      marginBottom: '12px'
                  }}>
                    {plan.name}
                  </h3>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{
                        fontSize: '48px',
                        fontWeight: '900',
                        color: '#1f2937',
                        lineHeight: '1'
                      }}>
                        {currency === 'INR' ? '₹' : '$'}{price.toLocaleString()}
                  </span>
                      <span style={{
                        fontSize: '18px',
                        color: '#6b7280',
                        marginLeft: '4px'
                      }}>
                        /{period}
                      </span>
                </div>
                <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginTop: '8px'
                    }}>
                    {plan.description}
                </p>
            </div>
            
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                    margin: '0 0 32px 0'
                  }}>
                    {plan.features.map((feature, featureIndex) => {
                      const isAIFeature = feature.includes('AI Agent');
                      return (
                        <li key={featureIndex} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                  gap: '12px',
                          padding: isAIFeature ? '12px 14px' : '8px 0',
                          fontSize: '14px',
                          color: isAIFeature ? '#000000' : '#374151',
                          fontWeight: isAIFeature ? 'bold' : 'normal',
                          backgroundColor: isAIFeature ? '#f3f4f6' : 'transparent',
                          borderRadius: isAIFeature ? '8px' : '0',
                          marginBottom: isAIFeature ? '8px' : '0'
                        }}>
                          <FaCheckCircle size={16} color={isAIFeature ? "#000000" : "#10b981"} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{feature}</span>
                    </li>
                      );
                    })}
                </ul>

              <button
                    onClick={() => handleGetStarted()}
                style={{
                    width: '100%',
                      padding: '16px 24px',
                    background: plan.popular 
                      ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                      : 'transparent',
                    color: plan.popular ? 'white' : '#ef4444',
                      border: `2px solid ${plan.popular ? 'transparent' : '#ef4444'}`,
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '16px',
                  cursor: 'pointer',
                      transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                      if (!plan.popular) {
                      e.target.style.backgroundColor = '#ef4444';
                      e.target.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                      if (!plan.popular) {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#ef4444';
                    }
                  }}
                >
                    {plan.buttonText || 'Get Started'}
              </button>
                </div>
              );
            })}
              </div>
            </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: isMobile ? '80px 20px' : '120px 20px',
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: isMobile ? '32px' : '48px',
            fontWeight: '900',
            color: 'white',
            marginBottom: '24px',
            lineHeight: '1.2'
                }}>
            Ready to Transform Your Restaurant?
          </h2>
          <p style={{
            fontSize: isMobile ? '18px' : '22px',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '40px',
            lineHeight: '1.6'
          }}>
            Join thousands of restaurants using DineOpen to streamline operations, 
            increase efficiency, and boost revenue.
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
                padding: '18px 36px',
                background: 'white',
                color: '#ef4444',
                  border: 'none',
                borderRadius: '16px',
                fontWeight: '700',
                fontSize: '16px',
                  cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                          display: 'flex',
                  alignItems: 'center',
              gap: '8px',
                width: isMobile ? '100%' : 'auto',
                whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-4px)';
                e.target.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
            >
              <FaRocket size={20} />
              <span>Start 1 Month Free Trial</span>
            </button>
            <button 
              onClick={() => setShowDemoModal(true)}
            style={{
                padding: '18px 36px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '16px',
              fontWeight: '600',
                    fontSize: '16px',
                  cursor: 'pointer',
              transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                    display: 'flex',
                    alignItems: 'center',
              gap: '8px',
                width: isMobile ? '100%' : 'auto',
                whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              }}
            >
              <FaClock size={16} />
              <span>Book Demo</span>
              </button>
              </div>
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
                  DineOpen
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
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      setShowDemoModal(true);
                    }}
                    style={{ color: '#9ca3af', textDecoration: 'none', cursor: 'pointer' }}
                  >
                    Contact
                  </a>
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
              © 2024 DineOpen. All rights reserved.
            </p>
      </div>
    </div>
      </footer>
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Demo Booking Modal */}
      {showDemoModal && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDemoModal(false);
              setDemoError('');
              setDemoPhone('');
              setDemoEmail('');
              setDemoComment('');
              setDemoContactType('phone');
            }
          }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'slideUp 0.3s ease',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ef4444',
                margin: '0 0 12px 0'
              }}>
                Contact Us
              </h2>
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '12px'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#991b1b',
                  margin: '0 0 4px 0',
                  fontWeight: '600'
                }}>
                  📧 Email us at:
                </p>
                <a 
                  href="mailto:info@dineopen.com" 
                  style={{
                    fontSize: '16px',
                    color: '#ef4444',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  info@dineopen.com
                </a>
              </div>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '12px 0 0 0',
                fontWeight: '500'
              }}>
                Or fill the form below to get in touch
              </p>
            </div>

            {/* Success Message */}
            {demoSuccess && (
              <div style={{
                backgroundColor: '#f0fdf4',
                border: '2px solid #22c55e',
                color: '#166534',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'center',
                fontWeight: '600'
              }}>
                ✅ {demoSuccess ? 'Demo request submitted successfully! We\'ll contact you soon.' : ''}
              </div>
            )}

            {/* Error Message */}
            {demoError && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '2px solid #ef4444',
                color: '#dc2626',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                {demoError}
              </div>
            )}

            {/* Contact Type Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '12px'
              }}>
                How would you like us to contact you?
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setDemoContactType('phone');
                    setDemoError('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: demoContactType === 'phone' ? '#ef4444' : '#f3f4f6',
                    color: demoContactType === 'phone' ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  📞 Phone
                </button>
                <button
                  onClick={() => {
                    setDemoContactType('email');
                    setDemoError('');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: demoContactType === 'email' ? '#ef4444' : '#f3f4f6',
                    color: demoContactType === 'email' ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  ✉️ Email
                </button>
              </div>
            </div>

            {/* Phone Input (if phone selected) */}
            {demoContactType === 'phone' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Phone Number <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="tel"
                  value={demoPhone}
                  onChange={(e) => setDemoPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {/* Email Input (if email selected) */}
            {demoContactType === 'email' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Email Address <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="email"
                  value={demoEmail}
                  onChange={(e) => setDemoEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            )}

            {/* Comment Text Area */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Additional Comments (Optional)
              </label>
              <textarea
                value={demoComment}
                onChange={(e) => setDemoComment(e.target.value)}
                placeholder="Tell us about your restaurant or any specific requirements..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowDemoModal(false);
                  setDemoError('');
                  setDemoPhone('');
                  setDemoEmail('');
                  setDemoComment('');
                  setDemoContactType('phone');
                }}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDemoRequest}
                disabled={demoSubmitting || demoSuccess}
                style={{
                  flex: 1,
                  padding: '12px 24px',
                  background: (demoSubmitting || demoSuccess) 
                    ? '#d1d5db' 
                    : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: (demoSubmitting || demoSuccess) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!demoSubmitting && !demoSuccess) {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                {demoSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SEO Structured Data */}
      <SEOStructuredData />
    </div>
  );
}

