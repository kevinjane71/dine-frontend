'use client';

import { useState, useEffect, Suspense } from 'react';
import { 
  FaHome, 
  FaUtensils, 
  FaChartBar, 
  FaUsers, 
  FaCog, 
  FaQrcode, 
  FaClipboardList, 
  FaTags,
  FaChair,
  FaSignOutAlt,
  FaPrint
} from 'react-icons/fa';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

function NavigationContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  
  // Load restaurant and user data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
        
        // This could be improved to fetch from API
        setSelectedRestaurant({
          name: 'Sample Restaurant',
          phone: '+91 9876543210'
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('dine_cart');
    localStorage.removeItem('dine_saved_order');
    router.push('/login');
  };
  
  const getAllNavItems = () => [
    { id: 'pos', name: 'Orders', icon: FaHome, href: '/', color: '#ef4444', roles: ['owner', 'manager', 'waiter'] },
    { id: 'orders', name: 'History', icon: FaClipboardList, href: '/orders', color: '#f59e0b', roles: ['owner', 'manager', 'waiter'] },
    { id: 'tables', name: 'Tables', icon: FaChair, href: '/tables', color: '#3b82f6', roles: ['owner', 'manager', 'waiter'] },
    { id: 'menu', name: 'Menu', icon: FaUtensils, href: '/menu', color: '#10b981', roles: ['owner', 'manager'] },
    { id: 'analytics', name: 'Analytics', icon: FaChartBar, href: '/analytics', color: '#8b5cf6', roles: ['owner', 'manager'] },
    { id: 'admin', name: 'Admin', icon: FaUsers, href: '/admin', color: '#ec4899', roles: ['owner'] },
    { id: 'kot', name: 'KOT', icon: FaPrint, href: '/kot', color: '#f97316', roles: ['owner', 'manager', 'waiter'] },
  ];

  // Filter navigation items based on user role
  // Filter navigation items based on user role
  const navItems = getAllNavItems().filter(item => {
    if (!user || !user.role) {
      // No user or role not found → show everything
      return true;
    }
    // If user.role matches known roles → filter accordingly
    if (['owner', 'manager', 'waiter'].includes(user.role)) {
      return item.roles.includes(user.role);
    }
    // Any other role → show everything
    return true;
  });


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
          {/* Restaurant Info */}
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
              {selectedRestaurant?.name || 'Restaurant'}
            </p>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>
              📞 {selectedRestaurant?.phone || '+91 9876543210'}
            </p>
          </div>

          {/* User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* User Info */}
            <div style={{
              padding: '6px 12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaUsers size={12} color="white" />
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                padding: '8px 12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#fecaca';
                e.target.style.borderColor = '#f87171';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#fee2e2';
                e.target.style.borderColor = '#fecaca';
              }}
            >
              <FaSignOutAlt size={12} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavigationFallback() {
  return (
    <nav style={{
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #f1f5f9',
      padding: '12px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
        <div style={{ 
          width: '20px', 
          height: '20px', 
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #ef4444',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    </nav>
  );
}

const Navigation = () => {
  return (
    <Suspense fallback={<NavigationFallback />}>
      <NavigationContent />
    </Suspense>
  );
};

export default Navigation;