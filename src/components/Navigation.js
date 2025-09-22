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
  FaTags 
} from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();
  
  const navItems = [
    { id: 'pos', name: 'POS System', icon: FaHome, href: '/', color: '#e53e3e' },
    { id: 'menu', name: 'Menu Management', icon: FaUtensils, href: '/menu', color: '#38a169' },
    { id: 'orders', name: 'Orders', icon: FaClipboardList, href: '/orders', color: '#3182ce' },
    { id: 'kot', name: 'Kitchen Orders', icon: FaClipboardList, href: '/kot', color: '#f97316' },
    { id: 'analytics', name: 'Analytics', icon: FaChartBar, href: '/analytics', color: '#805ad5' },
    { id: 'customers', name: 'Customers', icon: FaUsers, href: '/customers', color: '#d69e2e' },
    { id: 'qr-menu', name: 'QR Menu', icon: FaQrcode, href: '/qr-menu', color: '#319795' },
    { id: 'offers', name: 'Offers & Coupons', icon: FaTags, href: '/offers', color: '#e53e3e' },
    { id: 'settings', name: 'Settings', icon: FaCog, href: '/settings', color: '#718096' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <FaUtensils className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">🍽️ Dine</h1>
              <p className="text-xs text-gray-500">Restaurant Management</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.id} href={item.href}>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      isActive
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    <IconComponent 
                      size={16} 
                      style={{ color: isActive ? 'white' : item.color }} 
                    />
                    {item.name}
                  </button>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">Restaurant Name</p>
            <p className="text-xs text-gray-500">Ground Floor</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-red-600 rounded-full flex items-center justify-center text-white font-bold">
            R
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;