'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaBars,
  FaTimes,
  FaChevronDown,
  FaStore,
  FaBoxes,
  FaWarehouse,
  FaBuilding,
  FaUtensils,
  FaRobot
} from 'react-icons/fa';

export default function ProductPageNav({ currentProduct }) {
  const [isMobile, setIsMobile] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav style={{
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(239, 68, 68, 0.1)',
      padding: '12px 0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.1)'
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
        <Link href="/" style={{ textDecoration: 'none' }}>
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
              boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
            }}>
              <FaUtensils color="white" size={20} />
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
        </Link>
        
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
                    <Link 
                      href="/products/ai-agent" 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        color: currentProduct === 'ai-agent' ? '#ef4444' : '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        backgroundColor: currentProduct === 'ai-agent' ? '#fef2f2' : 'transparent',
                        fontWeight: currentProduct === 'ai-agent' ? '600' : '500'
                      }}
                      onMouseEnter={(e) => {
                        if (currentProduct !== 'ai-agent') {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentProduct !== 'ai-agent') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }
                      }}
                    >
                      <FaRobot size={18} color="#ef4444" />
                      <span style={{ fontSize: '14px' }}>AI Agent for Restaurant</span>
                    </Link>
                    <Link 
                      href="/products/restaurant-management" 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        color: currentProduct === 'restaurant-management' ? '#ef4444' : '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        backgroundColor: currentProduct === 'restaurant-management' ? '#fef2f2' : 'transparent',
                        fontWeight: currentProduct === 'restaurant-management' ? '600' : '500'
                      }}
                      onMouseEnter={(e) => {
                        if (currentProduct !== 'restaurant-management') {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentProduct !== 'restaurant-management') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }
                      }}
                    >
                      <FaStore size={18} color="#ef4444" />
                      <span style={{ fontSize: '14px' }}>Restaurant Management System</span>
                    </Link>
                    <Link 
                      href="/products/inventory-management" 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        color: currentProduct === 'inventory-management' ? '#ef4444' : '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        backgroundColor: currentProduct === 'inventory-management' ? '#fef2f2' : 'transparent',
                        fontWeight: currentProduct === 'inventory-management' ? '600' : '500'
                      }}
                      onMouseEnter={(e) => {
                        if (currentProduct !== 'inventory-management') {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentProduct !== 'inventory-management') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }
                      }}
                    >
                      <FaBoxes size={18} color="#ef4444" />
                      <span style={{ fontSize: '14px' }}>Inventory Management</span>
                    </Link>
                    <Link 
                      href="/products/supply-management" 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        color: currentProduct === 'supply-management' ? '#ef4444' : '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        backgroundColor: currentProduct === 'supply-management' ? '#fef2f2' : 'transparent',
                        fontWeight: currentProduct === 'supply-management' ? '600' : '500'
                      }}
                      onMouseEnter={(e) => {
                        if (currentProduct !== 'supply-management') {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentProduct !== 'supply-management') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }
                      }}
                    >
                      <FaWarehouse size={18} color="#ef4444" />
                      <span style={{ fontSize: '14px' }}>Supply Management</span>
                    </Link>
                    <Link 
                      href="/products/hotel-management" 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        color: currentProduct === 'hotel-management' ? '#ef4444' : '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        backgroundColor: currentProduct === 'hotel-management' ? '#fef2f2' : 'transparent',
                        fontWeight: currentProduct === 'hotel-management' ? '600' : '500'
                      }}
                      onMouseEnter={(e) => {
                        if (currentProduct !== 'hotel-management') {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.color = '#ef4444';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentProduct !== 'hotel-management') {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '#374151';
                        }
                      }}
                    >
                      <FaBuilding size={18} color="#ef4444" />
                      <span style={{ fontSize: '14px' }}>Hotel Management</span>
                    </Link>
                    </div>
                  </>
                )}
              </div>
              
              <Link href="/#features" style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.3s ease',
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
              </Link>
              <Link href="/blog" style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.3s ease',
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
              <Link href="/#pricing" style={{
                color: '#374151',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '15px',
                transition: 'all 0.3s ease',
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
              </Link>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => window.location.href = '/#pricing'}
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
                onClick={() => window.location.href = '/login'}
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
                Get Started Free
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
              }}
            >
              {showMobileMenu ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

