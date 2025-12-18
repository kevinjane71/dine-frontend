'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';

export default function CommonHeader() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogin = () => {
    router.push('/login');
  };

  return (
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
  );
}

