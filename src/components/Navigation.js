'use client';

import { useState } from 'react';
import { 
  FaHome, 
  FaUtensils, 
  FaChartBar, 
  FaUsers, 
  FaCog, 
  FaQrcode, 
  FaClipboardList, 
  FaTags,
  FaChair 
} from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();
  
  const navItems = [
    { id: 'pos', name: 'POS', icon: FaHome, href: '/', color: '#ef4444' },
    { id: 'tables', name: 'Tables', icon: FaChair, href: '/tables', color: '#3b82f6' },
    { id: 'menu', name: 'Menu', icon: FaUtensils, href: '/menu', color: '#10b981' },
    { id: 'orders', name: 'Orders', icon: FaClipboardList, href: '/orders', color: '#f59e0b' },
    { id: 'kot', name: 'Kitchen', icon: FaClipboardList, href: '/kot', color: '#f97316' },
    { id: 'analytics', name: 'Analytics', icon: FaChartBar, href: '/analytics', color: '#8b5cf6' },
    { id: 'customers', name: 'Customers', icon: FaUsers, href: '/customers', color: '#06b6d4' },
    { id: 'qr-menu', name: 'QR Menu', icon: FaQrcode, href: '/qr-menu', color: '#84cc16' },
    { id: 'offers', name: 'Offers', icon: FaTags, href: '/offers', color: '#ec4899' },
    { id: 'settings', name: 'Settings', icon: FaCog, href: '/settings', color: '#6b7280' },
  ];

  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f1f5f9',
      padding: '12px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              width: '36px', 
              height: '36px', 
              background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}>
              <FaUtensils color="white" size={18} />
            </div>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Dine
              </h1>
              <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>
                Restaurant System
              </p>
            </div>
          </div>
          
          {/* Navigation Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.id} href={item.href}>
                  <div
                    style={{
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: isActive ? item.color : 'transparent',
                      color: isActive ? 'white' : '#64748b',
                      textDecoration: 'none',
                      boxShadow: isActive ? `0 4px 14px ${item.color}40` : 'none',
                      transform: isActive ? 'translateY(-1px)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = '#f8fafc';
                        e.currentTarget.style.color = item.color;
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#64748b';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  >
                    <IconComponent size={14} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Right Side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              Restaurant Name
            </p>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>
              📞 9034142334
            </p>
          </div>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            background: 'linear-gradient(135deg, #ef4444, #dc2626)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: 'white', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            R
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;