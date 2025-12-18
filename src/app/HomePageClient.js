'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import apiClient from '../lib/api';
import SEOStructuredData from '../components/SEOStructuredData';
import FAQSchema from '../components/FAQSchema';
import CommonHeader from '../components/CommonHeader';
import { 
  FaUtensils, FaChartBar, FaTable, FaMobile, FaCloud, FaClock, FaUsers, FaCheckCircle, 
  FaArrowRight, FaBars, FaTimes, FaPlay, FaShieldAlt, FaHeadset, FaRocket, FaChevronDown, 
  FaRobot, FaStore, FaBoxes, FaWarehouse, FaBuilding, FaWhatsapp, FaQrcode, FaReceipt, 
  FaMicrophone, FaStar, FaCamera, FaMagic, FaBolt, FaFilePdf, FaImage, FaSpinner, FaPaperPlane
} from 'react-icons/fa';

export default function LandingPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  
  // Animation States
  const [activeProcessStep, setActiveProcessStep] = useState(0);
  const [chatStep, setChatStep] = useState(0);

  // Demo Form State
  const [demoContactType, setDemoContactType] = useState('phone');
  const [demoPhone, setDemoPhone] = useState('');
  const [demoEmail, setDemoEmail] = useState('');
  const [demoComment, setDemoComment] = useState('');
  const [demoSubmitting, setDemoSubmitting] = useState(false);
  const [demoSuccess, setDemoSuccess] = useState(false);
  const [demoError, setDemoError] = useState('');
  const [currency, setCurrency] = useState('INR');
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cycle Process Steps
  useEffect(() => {
    const interval = setInterval(() => setActiveProcessStep(p => (p + 1) % 3), 4000); 
    return () => clearInterval(interval);
  }, []);

  // AI Chat Animation
  useEffect(() => {
    let mounted = true;
    const runChatSequence = async () => {
      while (mounted) {
        setChatStep(0); await new Promise(r => setTimeout(r, 1000));
        if(!mounted) break; setChatStep(1); await new Promise(r => setTimeout(r, 2000));
        if(!mounted) break; setChatStep(2); await new Promise(r => setTimeout(r, 2500));
        if(!mounted) break; setChatStep(3); await new Promise(r => setTimeout(r, 5000));
      }
    };
    runChatSequence();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const checkAuthInBackground = async () => {
      if (apiClient.isAuthenticated()) router.replace(apiClient.getRedirectPath());
    };
    setTimeout(checkAuthInBackground, 500);
  }, [router]);

  const handleLogin = () => {
    if (apiClient.isAuthenticated()) router.replace(apiClient.getRedirectPath());
    else router.push('/login');
  };

  const handleSubmitDemoRequest = async () => {
    if (demoContactType === 'phone' && !demoPhone.trim()) return setDemoError('Phone number is required');
    if (demoContactType === 'email' && !demoEmail.trim()) return setDemoError('Email is required');
    setDemoSubmitting(true); setDemoError('');
    try {
      await apiClient.submitDemoRequest(demoContactType, demoPhone.trim(), demoEmail.trim(), demoComment.trim());
      setDemoSuccess(true);
      setTimeout(() => { setShowDemoModal(false); setDemoSuccess(false); setDemoPhone(''); setDemoEmail(''); setDemoComment(''); }, 2000);
    } catch (error) { setDemoError(error.message || 'Failed to submit demo request.'); } 
    finally { setDemoSubmitting(false); }
  };

  const plans = [
    {
      name: "Pay as You Go",
      type: "payg",
      price: currency === 'INR' ? '₹300' : '$5',
      period: 'one-time',
      subPrice: currency === 'INR' ? 'Then ₹150 / 500 orders' : 'Then $3 / 500 orders',
      features: ["Restaurant Billing Software", "AI Agent (Voice/Chat)", "QR Menu", "Unlimited Tables", "KOT & Inventory", "CRM & Loyalty"],
      button: "Get Started Free",
      popular: true
    },
    {
      name: "Monthly Fixed",
      type: "fixed",
      price: currency === 'INR' ? '₹600' : '$15',
      period: 'per month',
      subPrice: 'Unlimited Orders',
      features: ["All Features Included", "Priority Support", "Dedicated Account Manager", "Custom Onboarding", "API Access"],
      button: "Start 1 Month Trial",
      popular: false
    }
  ];

  const processSteps = [
    { icon: <FaCamera size={24} /> },
    { icon: <FaMagic size={24} /> },
    { icon: <FaQrcode size={24} /> }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <SEOStructuredData />
      <FAQSchema />
      
      <style jsx global>{`
        @keyframes float-y { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes typing { 0% { opacity: 0.3; transform: translateY(0px); } 50% { opacity: 1; transform: translateY(-3px); } 100% { opacity: 0.3; transform: translateY(0px); } }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .glass-panel { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(0,0,0,0.05); }
        .hero-gradient { background: radial-gradient(circle at 50% 0%, rgba(254, 226, 226, 0.4) 0%, rgba(255, 255, 255, 0) 50%); }
        .text-gradient { background: linear-gradient(135deg, #111827 0%, #4b5563 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .red-gradient-text { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .feature-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.1); }
      `}</style>

      {/* Enhanced Professional Navigation */}
      <nav style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100, 
        backgroundColor: 'rgba(255,255,255,0.95)', 
        backdropFilter: 'blur(20px)', 
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto', 
          padding: isMobile ? '0 16px' : '0 32px', 
          height: isMobile ? '64px' : '72px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ 
              width: isMobile ? '36px' : '40px', 
              height: isMobile ? '36px' : '40px', 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'white', 
              fontWeight: '800',
              fontSize: isMobile ? '16px' : '18px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}>
              DO
          </div>
            <span style={{ 
              fontSize: isMobile ? '18px' : '22px', 
              fontWeight: '800', 
              color: '#111827',
              letterSpacing: '-0.5px'
            }}>
              DineOpen
            </span>
          </Link>
          
          {!isMobile && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, justifyContent: 'center', maxWidth: '800px' }}>
              <Link 
                href="/restaurants" 
                style={{ 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  color: '#111827', 
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3f4f6'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
              >
                Restaurants
              </Link>
              
              <div style={{ position: 'relative' }} onMouseEnter={() => setShowProductsDropdown(true)} onMouseLeave={() => setShowProductsDropdown(false)}>
                <button style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  color: '#111827', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3f4f6'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
                >
                  Products <FaChevronDown size={10} />
                </button>
                {showProductsDropdown && (
                  <div style={{ 
                    position: 'absolute', 
                    top: '48px', 
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'white', 
                    border: '1px solid #e5e7eb', 
                    borderRadius: '16px', 
                    padding: '16px 8px', 
                    minWidth: '420px', 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                    animation: 'fade-in-up 0.2s ease-out'
                  }}>
                    {/* POS Software Section */}
                    <div style={{ 
                      padding: '12px 16px', 
                      background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                      borderRadius: '10px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#dc2626', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                        🏪 POS Software
                      </div>
                      <Link href="/products/pos-software.html" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none', color: '#111827', borderRadius: '8px', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', marginBottom: '6px', background: 'white' }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#fee2e2'; e.target.style.color = '#dc2626'; e.target.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#111827'; e.target.style.transform = 'translateX(0)'; }}
                      >
                        POS Software Overview
                      </Link>
                      <div style={{ paddingLeft: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <Link href="/products/pos-software/small-restaurants.html" style={{ display: 'block', padding: '8px 12px', textDecoration: 'none', color: '#6b7280', borderRadius: '6px', fontSize: '13px', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.target.style.backgroundColor = '#fee2e2'; e.target.style.color = '#dc2626'; }}
                          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#6b7280'; }}
                        >
                          → Small Restaurants
                        </Link>
                        <Link href="/products/pos-software/cafes.html" style={{ display: 'block', padding: '8px 12px', textDecoration: 'none', color: '#6b7280', borderRadius: '6px', fontSize: '13px', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.target.style.backgroundColor = '#fee2e2'; e.target.style.color = '#dc2626'; }}
                          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#6b7280'; }}
                        >
                          → Cafes
                        </Link>
                        <Link href="/products/pos-software/cloud-kitchens.html" style={{ display: 'block', padding: '8px 12px', textDecoration: 'none', color: '#6b7280', borderRadius: '6px', fontSize: '13px', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.target.style.backgroundColor = '#fee2e2'; e.target.style.color = '#dc2626'; }}
                          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#6b7280'; }}
                        >
                          → Cloud Kitchens
                        </Link>
                      </div>
                    </div>

                    {/* Billing Software Section */}
                    <div style={{ 
                      padding: '12px 16px', 
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                      borderRadius: '10px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                        💰 Billing Software
                      </div>
                      <Link href="/products/billing-software.html" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none', color: '#111827', borderRadius: '8px', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', marginBottom: '6px', background: 'white' }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#dbeafe'; e.target.style.color = '#2563eb'; e.target.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#111827'; e.target.style.transform = 'translateX(0)'; }}
                      >
                        Billing Software Overview
                      </Link>
                      <div style={{ paddingLeft: '12px' }}>
                        <Link href="/products/billing-software/gst-billing.html" style={{ display: 'block', padding: '8px 12px', textDecoration: 'none', color: '#6b7280', borderRadius: '6px', fontSize: '13px', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => { e.target.style.backgroundColor = '#dbeafe'; e.target.style.color = '#2563eb'; }}
                          onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; e.target.style.color = '#6b7280'; }}
                        >
                          → GST Billing
                        </Link>
                      </div>
                    </div>

                    {/* Core Features Section */}
                    <div style={{ 
                      padding: '12px 16px', 
                      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                      borderRadius: '10px',
                      marginBottom: '12px'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                        📦 Core Features
                      </div>
                      <Link href="/products/inventory-management.html" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none', color: '#111827', borderRadius: '8px', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', marginBottom: '6px', background: 'white' }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#dcfce7'; e.target.style.color = '#16a34a'; e.target.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#111827'; e.target.style.transform = 'translateX(0)'; }}
                      >
                        Inventory Management
                      </Link>
                      <Link href="/products/online-orders.html" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none', color: '#111827', borderRadius: '8px', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', background: 'white' }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#dcfce7'; e.target.style.color = '#16a34a'; e.target.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#111827'; e.target.style.transform = 'translateX(0)'; }}
                      >
                        Online Orders
                      </Link>
                    </div>

                    {/* Comparisons Section */}
                    <div style={{ 
                      padding: '12px 16px', 
                      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                      borderRadius: '10px'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: '#9333ea', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                        ⚖️ Comparisons
                      </div>
                      <Link href="/products/comparisons/dineopen-vs-zomato.html" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none', color: '#111827', borderRadius: '8px', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', marginBottom: '6px', background: 'white' }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3e8ff'; e.target.style.color = '#9333ea'; e.target.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#111827'; e.target.style.transform = 'translateX(0)'; }}
                      >
                        DineOpen vs Zomato
                      </Link>
                      <Link href="/products/comparisons/dineopen-vs-petpooja.html" style={{ display: 'block', padding: '10px 12px', textDecoration: 'none', color: '#111827', borderRadius: '8px', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s', background: 'white' }}
                        onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3e8ff'; e.target.style.color = '#9333ea'; e.target.style.transform = 'translateX(4px)'; }}
                        onMouseLeave={(e) => { e.target.style.backgroundColor = 'white'; e.target.style.color = '#111827'; e.target.style.transform = 'translateX(0)'; }}
                      >
                        DineOpen vs Petpooja
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link href="/blog" style={{ 
                fontSize: '15px', 
                fontWeight: '600', 
                color: '#111827', 
                textDecoration: 'none',
                padding: '8px 12px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.target.style.backgroundColor = '#f3f4f6'; }}
              onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
              >
                Blog
              </Link>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
              onClick={handleLogin} 
              style={{ 
                padding: isMobile ? '8px 16px' : '10px 20px', 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb', 
                background: 'white', 
                fontWeight: '600', 
                cursor: 'pointer',
                fontSize: '14px',
                color: '#374151',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.backgroundColor = '#f9fafb'; }}
              onMouseLeave={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.backgroundColor = 'white'; }}
            >
              Login
            </button>
            <button 
              onClick={handleLogin} 
              style={{ 
                padding: isMobile ? '8px 16px' : '10px 20px', 
                borderRadius: '8px', 
                background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)', 
                color: 'white', 
                fontWeight: '600', 
                border: 'none', 
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; }}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION - Restored Original Design */}
      <section className="hero-gradient" style={{ paddingTop: isMobile ? '60px' : '100px', paddingBottom: isMobile ? '60px' : '120px', textAlign: 'center', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '0 20px' : '0 40px' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '8px 20px', 
            background: 'linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%)', 
            color: '#be123c', 
            borderRadius: '30px', 
            fontSize: '13px', 
            fontWeight: '700', 
            marginBottom: '32px', 
            border: '1px solid #fecdd3',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)'
          }}>
            <FaStar /> #1 Rated Restaurant Billing Software
          </div>
          
          <h1 style={{ 
            fontSize: isMobile ? '36px' : '64px', 
            fontWeight: '900', 
            lineHeight: '1.1', 
            color: '#111827', 
            marginBottom: '24px', 
            letterSpacing: '-2px' 
          }}>
            Restaurant Billing <br/>
            <span className="red-gradient-text">& AI Agent Staff</span>
          </h1>
          
          <p style={{ 
            fontSize: isMobile ? '18px' : '22px', 
            color: '#4b5563', 
            lineHeight: '1.6', 
            maxWidth: '700px', 
            margin: '0 auto 48px',
            fontWeight: '400'
          }}>
            Restaurant Billing, Inventory, and a <strong>Free E-Menu</strong> for your restaurant. The all-in-one OS designed to <strong>engage more customers</strong> with AI-powered automation.
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px', 
            flexDirection: isMobile ? 'column' : 'row', 
            marginBottom: isMobile ? '40px' : '80px',
            alignItems: 'center'
          }}>
            <button 
              onClick={handleLogin} 
              style={{ 
                padding: isMobile ? '14px 32px' : '18px 48px', 
                fontSize: isMobile ? '15px' : '17px', 
                fontWeight: '700', 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                color: 'white', 
                border: 'none', 
                cursor: 'pointer', 
                boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.4)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 15px 35px -5px rgba(239, 68, 68, 0.5)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 25px -5px rgba(239, 68, 68, 0.4)'; }}
            >
              Create Free Menu
            </button>
            <button 
              onClick={() => setShowDemoModal(true)} 
              style={{ 
                padding: isMobile ? '14px 32px' : '18px 48px', 
                fontSize: isMobile ? '15px' : '17px', 
                fontWeight: '700', 
                borderRadius: '14px', 
                background: 'white', 
                color: '#111827', 
                border: '1px solid #e5e7eb', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '8px', 
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = '0 8px 16px -4px rgba(0,0,0,0.1)'; }}
              onMouseLeave={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.05)'; }}
            >
              <FaPlay size={12} /> Watch Demo
            </button>
          </div>

          {/* Hero Visual - Dashboard & Phone Composition */}
          <div style={{ position: 'relative', height: isMobile ? '300px' : '500px', perspective: '1000px' }}>
            {/* Dashboard Mockup (Back) */}
            <div style={{ 
              position: 'absolute', top: 0, left: '50%', transform: isMobile ? 'translateX(-50%)' : 'translateX(-50%) rotateX(10deg)', 
              width: isMobile ? '95%' : '900px', height: isMobile ? '250px' : '550px', 
              background: '#f8fafc', borderRadius: '24px', border: '1px solid #e2e8f0', 
              boxShadow: '0 50px 100px -20px rgba(0,0,0,0.15)', overflow: 'hidden' 
            }}>
              <Image 
                src="https://storage.googleapis.com/demoimage-7189/menu-items/LUETVd1eMwu4Bm7PvP9K/item_1760637762769_df90sl6pe/1760767605179-0-Screenshot%202025-10-18%20at%2011.36.31%C3%A2%C2%80%C2%AFAM.png" 
                alt="DineOpen Dashboard Interface"
                fill
                sizes="(max-width: 768px) 95vw, 900px"
                priority
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>

            {/* Phone Mockup (Front/Floating) */}
            <div style={{ 
              position: 'absolute', bottom: isMobile ? '-20px' : '-40px', right: isMobile ? '10px' : '0px', 
              width: isMobile ? '140px' : '240px', height: isMobile ? '280px' : '480px', 
              background: '#111827', borderRadius: '32px', border: '8px solid #1f2937', 
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', overflow: 'hidden',
              animation: 'float-y 6s ease-in-out infinite'
            }}>
              <div style={{ background: '#fff', height: '100%', overflow: 'hidden', position: 'relative' }}>
                <div style={{ height: '120px', background: 'url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80)', backgroundSize: 'cover' }}></div>
                <div style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>Spice Garden</div>
                  <div style={{ fontSize: '10px', color: '#666' }}>Indian • Chinese</div>
                  <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ width: '32px', height: '32px', background: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍗</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '10px', fontWeight: 'bold' }}>Butter Chicken</div>
                        <div style={{ fontSize: '10px', color: '#ef4444' }}>₹320</div>
                      </div>
                      <div style={{ width: '20px', height: '20px', background: '#111', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>+</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <div style={{ width: '32px', height: '32px', background: '#f3f4f6', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🧀</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '10px', fontWeight: 'bold' }}>Paneer Tikka</div>
                        <div style={{ fontSize: '10px', color: '#ef4444' }}>₹280</div>
                      </div>
                      <div style={{ width: '20px', height: '20px', background: '#111', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>+</div>
                    </div>
                  </div>
                </div>
                {/* Cart Float */}
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px', background: '#ef4444', borderRadius: '8px', padding: '8px', color: 'white', fontSize: '10px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                  <span>2 Items</span><span>View Cart &gt;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI CAPTAIN SECTION (Centered) */}
      <section style={{ padding: '100px 20px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>POWERED BY GPT-4</div>
          <h2 style={{ fontSize: isMobile ? '32px' : '48px', fontWeight: '800', color: '#111827', marginBottom: '24px' }}>Meet Your New <span style={{ color: '#7c3aed' }}>AI Captain</span></h2>
          <p style={{ fontSize: '18px', color: '#6b7280', maxWidth: '600px', margin: '0 auto 60px' }}>
            Forget waiting for staff. DineOpen AI acts as a personal concierge. It takes orders via <strong>Voice or Chat</strong>, checks real-time inventory, and punches orders directly into your POS.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '60px', alignItems: 'center' }}>
            {/* AI Visual - Chat Interface */}
            <div style={{ background: 'white', borderRadius: '32px', boxShadow: '0 20px 50px -10px rgba(124, 58, 237, 0.15)', padding: '24px', border: '1px solid #f3f4f6' }}>
              <div style={{ background: '#f9fafb', borderRadius: '24px', padding: '24px', minHeight: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '40px', height: '40px', background: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaRobot color="white" size={20}/></div>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>DineOpen AI</div>
                    <div style={{ fontSize: '12px', color: '#10b981' }}>● Online</div>
                  </div>
                </div>
                
                {/* Chat Bubbles */}
                <div className="chat-bubble" style={{ alignSelf: 'flex-start', background: 'white', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  Hi! 👋 I&apos;m your AI waiter. Ask me for recommendations or order directly here!
                </div>
                
                {chatStep >= 1 && (
                  <div className="chat-bubble" style={{ alignSelf: 'flex-end', background: '#7c3aed', color: 'white', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', fontSize: '14px' }}>
                    I want something spicy. 🌶️
                  </div>
                )}

                {chatStep === 2 && (
                  <div className="chat-bubble" style={{ alignSelf: 'flex-start', background: 'white', padding: '12px', borderRadius: '16px', width: '60px', display: 'flex', justifyContent: 'center', gap: '4px' }}>
                    <div style={{ width: '6px', height: '6px', background: '#ccc', borderRadius: '50%', animation: 'typing 1s infinite' }}></div>
                    <div style={{ width: '6px', height: '6px', background: '#ccc', borderRadius: '50%', animation: 'typing 1s infinite 0.2s' }}></div>
                    <div style={{ width: '6px', height: '6px', background: '#ccc', borderRadius: '50%', animation: 'typing 1s infinite 0.4s' }}></div>
                  </div>
                )}

                {chatStep >= 3 && (
                  <div className="chat-bubble" style={{ alignSelf: 'flex-start', width: '100%' }}>
                    <div style={{ background: 'white', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '8px' }}>
                      How about our <strong>Schezwan Noodles?</strong> 🔥 It&apos;s a customer favorite!
                    </div>
                    <div style={{ background: 'white', padding: '12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f3f4f6' }}>
                      <div style={{ fontSize: '24px' }}>🍜</div>
                      <div style={{ flex: 1, textAlign: 'left' }}>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>Schezwan Noodles</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>₹ 180</div>
                      </div>
                      <button style={{ padding: '6px 12px', background: '#7c3aed', color: 'white', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 'bold' }}>Add</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', textAlign: 'left' }}>
              {[
                { title: "Voice & Text", desc: "Takes complex orders naturally.", icon: <FaMicrophone/> },
                { title: "Inventory Sync", desc: "Checks stock before confirming.", icon: <FaBoxes/> },
                { title: "Auto-Upsell", desc: "Suggests drinks & desserts.", icon: <FaChartBar/> },
                { title: "Instant KOT", desc: "Sends straight to kitchen.", icon: <FaReceipt/> }
              ].map((f, i) => (
                <div key={i} className="feature-card" style={{ padding: '24px', background: 'white', borderRadius: '20px', border: '1px solid #f3f4f6', transition: 'all 0.3s' }}>
                  <div style={{ width: '40px', height: '40px', background: '#f5f3ff', color: '#7c3aed', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{f.icon}</div>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>{f.title}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. MENU ECOSYSTEM (Bento Grid) */}
      <section style={{ padding: '100px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: isMobile ? '32px' : '48px', fontWeight: '800', color: '#111827', marginBottom: '16px' }}>The Smart Menu Ecosystem</h2>
            <p style={{ fontSize: '18px', color: '#6b7280' }}>Everything starts with a QR.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: '32px' }}>
            
            {/* Card 1: WhatsApp Ordering */}
            <div className="feature-card" style={{ background: '#f0fdf4', borderRadius: '32px', padding: '40px', position: 'relative', overflow: 'hidden', border: '1px solid #dcfce7' }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', color: '#15803d', marginBottom: '24px' }}>
                  <FaWhatsapp /> ZERO HARDWARE
                </div>
                <h3 style={{ fontSize: '32px', fontWeight: '800', color: '#14532d', marginBottom: '16px' }}>WhatsApp Ordering</h3>
                <p style={{ fontSize: '16px', color: '#166534', maxWidth: '400px', marginBottom: '32px', lineHeight: '1.6' }}>
                  Customers scan QR → View Menu → Order on WhatsApp. Simple, fast, and builds your customer database automatically.
                </p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <FaQrcode size={32} color="#15803d" />
                    <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '8px' }}>Scan</div>
                  </div>
                  <FaArrowRight color="#15803d" />
                  <div style={{ background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <FaWhatsapp size={32} color="#15803d" />
                    <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '8px' }}>Order</div>
                  </div>
                </div>
              </div>
              {/* Decorative phone partially visible */}
              <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '250px', height: '400px', background: '#111827', borderRadius: '32px', transform: 'rotate(-15deg)', opacity: 0.9 }}>
                <div style={{ padding: '20px', paddingTop: '60px' }}>
                  <div style={{ background: '#dcf8c6', padding: '10px', borderRadius: '10px', marginBottom: '10px', fontSize: '12px' }}>New Order: 1x Pizza</div>
                </div>
              </div>
            </div>

            {/* Card 2: PDF to QR */}
            <div className="feature-card" style={{ background: 'white', borderRadius: '32px', padding: '40px', border: '1px solid #f3f4f6', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ marginBottom: 'auto' }}>
                <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', marginBottom: '12px' }}>PDF to QR in 5 Mins</h3>
                <p style={{ fontSize: '16px', color: '#6b7280' }}>AI scans your menu photo and builds your digital catalog.</p>
              </div>
              
              {/* Interactive Steps Visual */}
              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '24px', left: '0', right: '0', height: '2px', background: '#e5e7eb', zIndex: 0 }}></div>
                {processSteps.map((step, i) => (
                  <div key={i} style={{ position: 'relative', zIndex: 1, textAlign: 'center', opacity: activeProcessStep === i ? 1 : 0.5, transform: activeProcessStep === i ? 'scale(1.1)' : 'scale(1)', transition: 'all 0.3s' }}>
                    <div style={{ width: '48px', height: '48px', background: activeProcessStep === i ? '#111827' : 'white', border: '2px solid #111827', color: activeProcessStep === i ? 'white' : '#111827', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      {step.icon}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '700' }}>Step {i+1}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. BILLING OS SECTION (Full Width) */}
      <section style={{ padding: '80px 20px', backgroundColor: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? '32px' : '48px', fontWeight: '800', marginBottom: '40px' }}>Full-Stack <span style={{ color: '#ef4444' }}>Restaurant OS</span></h2>
          
          <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #e5e7eb', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)', overflow: 'hidden', textAlign: 'left' }}>
            <div style={{ borderBottom: '1px solid #e5e7eb', padding: '16px 24px', display: 'flex', gap: '32px', background: '#fff' }}>
              <div style={{ fontWeight: '700', color: '#ef4444', borderBottom: '2px solid #ef4444', paddingBottom: '14px', marginBottom: '-17px' }}>Tables</div>
              <div style={{ fontWeight: '600', color: '#6b7280' }}>Orders</div>
              <div style={{ fontWeight: '600', color: '#6b7280' }}>Inventory</div>
              <div style={{ fontWeight: '600', color: '#6b7280' }}>Reports</div>
            </div>
            <div style={{ padding: '32px', minHeight: '400px', backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: '24px' }}>
                {[1,2,3,4,5,6,7,8].map(t => (
                  <div key={t} style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '700', color: '#374151' }}>Table {t}</span>
                      <span style={{ fontSize: '12px', padding: '2px 8px', background: t < 4 ? '#fee2e2' : '#ecfdf5', color: t < 4 ? '#ef4444' : '#10b981', borderRadius: '10px' }}>{t < 4 ? 'Occupied' : 'Free'}</span>
                    </div>
                    {t < 4 && (
                      <>
                        <div style={{ fontSize: '24px', fontWeight: '800' }}>₹{t * 450 + 120}</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>{t+1} items • 20m ago</div>
                      </>
                    )}
                    {t >= 4 && <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: 'auto' }}>Ready for guests</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Clean Cards */}
      <section id="pricing" style={{ padding: '100px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '60px' }}>Simple Pricing</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '32px' }}>
            {plans.map((plan, i) => (
              <div key={i} style={{ padding: '40px', borderRadius: '32px', border: plan.popular ? '2px solid #111827' : '1px solid #e5e7eb', background: plan.popular ? '#111827' : 'white', color: plan.popular ? 'white' : '#111827', textAlign: 'left', position: 'relative' }}>
                {plan.popular && <div style={{ position: 'absolute', top: '-12px', right: '40px', background: '#ef4444', color: 'white', fontSize: '12px', fontWeight: '700', padding: '4px 12px', borderRadius: '20px' }}>POPULAR</div>}
                <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>{plan.name}</h3>
                <div style={{ fontSize: '42px', fontWeight: '800', marginBottom: '8px' }}>{plan.price}</div>
                <p style={{ opacity: 0.7, marginBottom: '32px' }}>{plan.subPrice}</p>
                <button style={{ width: '100%', padding: '16px', borderRadius: '12px', background: plan.popular ? 'white' : '#111827', color: plan.popular ? '#111827' : 'white', border: 'none', fontWeight: '700', marginBottom: '32px', cursor: 'pointer' }}>{plan.button}</button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <FaCheckCircle color={plan.popular ? '#ef4444' : '#10b981'} /> {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AEO SECTIONS - Added at the end of page */}
      
      {/* What is DineOpen Section */}
      <section style={{ padding: isMobile ? '60px 16px' : '80px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '800', color: '#111827', marginBottom: '24px', textAlign: 'center' }}>
            What is DineOpen?
          </h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151', marginBottom: '20px' }}>
              DineOpen is a cloud-based restaurant POS software and billing system designed for small and mid-sized restaurants in India. It combines point-of-sale billing, menu management, inventory tracking, and online order processing in one platform.
            </p>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151', marginBottom: '20px' }}>
              DineOpen is suitable for small restaurants, cafes, cloud kitchens, and food service businesses in India. It does not require hardware installation and works on any device with internet access. The system includes GST-ready billing, automatic tax calculations, and invoice generation compliant with Indian tax regulations.
            </p>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151' }}>
              Pricing starts at ₹300 one-time payment or ₹600 per month for unlimited orders. DineOpen offers an affordable alternative to Zomato POS and Petpooja, with similar features at lower costs.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section style={{ padding: isMobile ? '60px 16px' : '80px 20px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '800', color: '#111827', marginBottom: isMobile ? '32px' : '48px', textAlign: 'center' }}>
            Core Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: isMobile ? '24px' : '32px' }}>
            <div style={{ background: 'white', padding: isMobile ? '24px' : '32px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                What is POS billing in DineOpen?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                POS billing in DineOpen allows restaurants to process orders, generate bills, accept payments, and print receipts. The system supports multiple payment methods including cash, card, UPI, and digital wallets. Bills are automatically saved and can be retrieved for reporting.
              </p>
            </div>

            <div style={{ background: 'white', padding: isMobile ? '24px' : '32px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                How does menu management work in DineOpen?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                Menu management in DineOpen lets restaurants create digital menus, add items with prices and descriptions, organize items by categories, and update availability in real-time. Menus can be shared via QR codes for contactless ordering. Changes to menu items reflect immediately across all devices.
              </p>
            </div>

            <div style={{ background: 'white', padding: isMobile ? '24px' : '32px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                What is inventory management in DineOpen?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                Inventory management in DineOpen tracks stock levels, records purchases, monitors ingredient usage, and sends low-stock alerts. The system automatically deducts ingredients when orders are placed and generates purchase order suggestions based on consumption patterns.
              </p>
            </div>

            <div style={{ background: 'white', padding: isMobile ? '24px' : '32px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                How does online order management work?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                Online order management in DineOpen processes orders from WhatsApp, QR menus, and web platforms. Orders appear in real-time on the POS system, can be accepted or rejected, and are automatically sent to the kitchen via KOT. The system tracks order status from placement to delivery.
              </p>
            </div>

            <div style={{ background: 'white', padding: isMobile ? '24px' : '32px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                Does DineOpen support GST billing?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                Yes, DineOpen includes GST-ready billing software. It automatically calculates GST at applicable rates, generates tax-compliant invoices with HSN codes, maintains tax records, and exports data for GST filing. The system supports all GST slabs and formats invoices according to Indian regulations.
              </p>
            </div>

            <div style={{ background: 'white', padding: isMobile ? '24px' : '32px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '24px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                What reports and analytics does DineOpen provide?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                DineOpen provides sales reports, daily and monthly revenue summaries, item-wise sales analysis, inventory reports, customer order history, and profit margin calculations. Reports can be exported as PDF or Excel files and are available in real-time through the dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section style={{ padding: isMobile ? '60px 16px' : '80px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '800', color: '#111827', marginBottom: isMobile ? '24px' : '32px', textAlign: 'center' }}>
            How is DineOpen different from Zomato or Petpooja?
          </h2>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151', marginBottom: '20px' }}>
              DineOpen offers similar features to Zomato POS and Petpooja but at lower costs. DineOpen pricing starts at ₹300 one-time or ₹600 per month, while Zomato and Petpooja typically charge higher monthly fees.
            </p>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151', marginBottom: '20px' }}>
              DineOpen is cloud-based and does not require hardware installation, similar to Zomato POS. Both systems offer POS billing, menu management, inventory tracking, and online order processing. DineOpen focuses on simplicity and affordability for small restaurants.
            </p>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151', marginBottom: '20px' }}>
              Petpooja requires hardware setup and has higher upfront costs. DineOpen works on any device with internet access, reducing initial investment. Both systems support GST billing and provide restaurant management features.
            </p>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151' }}>
              DineOpen is designed specifically for small and mid-sized restaurants in India, with simpler interfaces and lower pricing. Zomato POS and Petpooja target larger restaurant chains with more complex requirements and higher costs.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section style={{ padding: isMobile ? '60px 16px' : '80px 20px', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '800', color: '#111827', marginBottom: isMobile ? '32px' : '48px', textAlign: 'center' }}>
            Use Cases
          </h2>
          
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
              Who should use DineOpen?
            </h3>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151', marginBottom: '12px' }}>
              DineOpen is suitable for small restaurants, cafes, cloud kitchens, food trucks, bakeries, and any food service business in India that needs affordable POS software and billing system.
            </p>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151' }}>
              Restaurants with 1-20 tables, cafes serving 50-500 customers daily, and cloud kitchens processing 20-200 orders per day will benefit from DineOpen. The system is designed for businesses that want simple, affordable restaurant management software without complex features or high costs.
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>
              Is DineOpen good for small restaurants in India?
            </h3>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151', marginBottom: '12px' }}>
              Yes, DineOpen is specifically designed for small restaurants in India. It offers affordable pricing starting at ₹300 one-time, making it accessible for small businesses with limited budgets.
            </p>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151', marginBottom: '12px' }}>
              DineOpen includes all essential features small restaurants need: POS billing, menu management, inventory tracking, GST billing, and online orders. The system is simple to use and does not require technical expertise or hardware installation.
            </p>
            <p style={{ fontSize: isMobile ? '16px' : '18px', lineHeight: '1.8', color: '#374151' }}>
              Small restaurants can start using DineOpen immediately without setup fees or long-term contracts. The cloud-based system works on smartphones, tablets, or computers, eliminating the need for expensive POS hardware.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: isMobile ? '60px 16px' : '80px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: '800', color: '#111827', marginBottom: isMobile ? '32px' : '48px', textAlign: 'center' }}>
            Frequently Asked Questions
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '24px' : '32px' }}>
            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: isMobile ? '24px' : '32px' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                What is DineOpen?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                DineOpen is a restaurant POS software and billing system designed for small and mid-sized restaurants in India. It includes menu management, inventory tracking, online order management, and GST-ready billing. DineOpen is a cloud-based alternative to Zomato POS and Petpooja, offering affordable pricing starting at ₹300 one-time or ₹600 per month.
              </p>
            </div>

            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: isMobile ? '24px' : '32px' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                Is DineOpen a POS system?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                Yes, DineOpen is a complete POS system for restaurants. It includes billing software, table management, KOT (Kitchen Order Ticket) generation, inventory management, menu management, and online order processing. It works on any device with internet access and does not require hardware installation.
              </p>
            </div>

            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: isMobile ? '24px' : '32px' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                Is DineOpen suitable for small restaurants?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                Yes, DineOpen is specifically designed for small and mid-sized restaurants in India. It offers affordable pricing starting at ₹300 one-time payment, making it accessible for small cafes, restaurants, and cloud kitchens. The system is simple to use and does not require technical expertise.
              </p>
            </div>

            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: isMobile ? '24px' : '32px' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                Does DineOpen support GST billing in India?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                Yes, DineOpen includes GST-ready billing software. It automatically calculates GST, generates compliant invoices, and maintains records required for tax filing. The system supports all GST rates and formats invoices according to Indian tax regulations.
              </p>
            </div>

            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: isMobile ? '24px' : '32px' }}>
              <h3 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                Can DineOpen replace Zomato POS?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                Yes, DineOpen can replace Zomato POS for restaurants. It offers similar features including POS billing, menu management, inventory tracking, and online orders. DineOpen is more affordable with pricing starting at ₹300 one-time compared to Zomato&apos;s monthly fees, and it does not require hardware installation.
              </p>
            </div>

            <div>
              <h3 style={{ fontSize: isMobile ? '20px' : '22px', fontWeight: '700', color: '#111827', marginBottom: '12px' }}>
                Is DineOpen cloud-based?
              </h3>
              <p style={{ fontSize: isMobile ? '15px' : '16px', lineHeight: '1.7', color: '#374151' }}>
                Yes, DineOpen is a cloud-based restaurant management software. It runs entirely in a web browser and does not require software installation or hardware setup. You can access DineOpen from any device with internet access, including computers, tablets, and smartphones.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: isMobile ? '60px 16px' : '80px 20px', background: '#fafafa', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
              <div style={{ width: '32px', height: '32px', background: '#ef4444', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>DO</div>
              <span style={{ fontSize: '20px', fontWeight: '700' }}>DineOpen</span>
            </div>
            <p style={{ color: '#6b7280' }}>The operating system for modern restaurants.</p>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Product</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#6b7280' }}>
              <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Features</Link>
              <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Pricing</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Company</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#6b7280' }}>
              <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>About</Link>
              <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Contact</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: '700', marginBottom: '16px' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', color: '#6b7280' }}>
              <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Privacy</Link>
              <Link href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Terms</Link>
            </div>
          </div>
        </div>
      </footer>

      {showDemoModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '480px', position: 'relative' }}>
            <button onClick={() => setShowDemoModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}><FaTimes /></button>
            <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>Get a Free Demo</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="text" placeholder="Phone Number" value={demoPhone} onChange={(e) => setDemoPhone(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <button onClick={handleSubmitDemoRequest} style={{ padding: '12px', borderRadius: '8px', background: '#111827', color: 'white', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>Request Demo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}