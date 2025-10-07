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
  FaPrint,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaCreditCard,
  FaBoxes,
  FaWarehouse,
  FaStore,
  FaUserCircle,
  FaBell,
  FaSearch,
  FaMoon,
  FaSun,
  FaEllipsisV,
  FaCheck,
  FaBuilding
} from 'react-icons/fa';
import { HiSwitchHorizontal } from 'react-icons/hi';
import { BiRestaurant } from 'react-icons/bi';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import apiClient from '../lib/api';

function NavigationContent({ isHidden = false }) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [showRestaurantDropdown, setShowRestaurantDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pageAccess, setPageAccess] = useState(null);
  
  // Debug dropdown states
  useEffect(() => {
    console.log('Dropdown states:', { showRestaurantDropdown, showUserDropdown });
  }, [showRestaurantDropdown, showUserDropdown]);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024); // Changed to 1024 for better tablet experience
      if (window.innerWidth > 1024) {
        setShowMobileMenu(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside the dropdown containers
      if (showRestaurantDropdown && !event.target.closest('[data-restaurant-dropdown]')) {
        console.log('Clicking outside restaurant dropdown, closing it');
        setShowRestaurantDropdown(false);
      }
      if (showUserDropdown && !event.target.closest('[data-user-dropdown]')) {
        console.log('Clicking outside user dropdown, closing it');
        setShowUserDropdown(false);
      }
      if (showMobileMenu && !event.target.closest('[data-mobile-menu]')) {
        setShowMobileMenu(false);
      }
    };

    // Add a small delay to prevent immediate closing
    const timeoutId = setTimeout(() => {
    document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showRestaurantDropdown, showUserDropdown, showMobileMenu]);
  
  // Load restaurant and user data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data from localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Fetch page access for staff users
          if (parsedUser.role === 'employee' || parsedUser.role === 'manager') {
            try {
              const accessData = await apiClient.getUserPageAccess();
              setPageAccess(accessData.pageAccess);
            } catch (error) {
              console.error('Error fetching page access:', error);
              // Set default access for staff
              setPageAccess({
                dashboard: true,
                history: true,
                tables: true,
                menu: true,
                analytics: false,
                inventory: false,
                kot: false,
                admin: false
              });
            }
          }
          
          // Set restaurant data for staff and owners
          if (parsedUser.restaurantId) {
            // First try to use restaurant data from login response
            if (parsedUser.restaurant) {
              setSelectedRestaurant(parsedUser.restaurant);
            } else {
              // Fallback: fetch restaurant data from API
            try {
              const token = localStorage.getItem('authToken');
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/api/restaurants`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              if (response.ok) {
                const data = await response.json();
                const userRestaurant = data.restaurants.find(r => r.id === parsedUser.restaurantId);
                if (userRestaurant) {
                  setSelectedRestaurant(userRestaurant);
                }
              }
            } catch (error) {
              console.error('Error fetching restaurant data:', error);
              }
            }
          } else if (parsedUser.role === 'owner' || parsedUser.role === 'customer') {
            // For owners, get all their restaurants
            try {
              const token = localStorage.getItem('authToken');
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'}/api/restaurants`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              if (response.ok) {
                const data = await response.json();
                if (data.restaurants && data.restaurants.length > 0) {
                  setAllRestaurants(data.restaurants);
                  
                  // Check if there's a previously selected restaurant in localStorage
                  const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
                  const savedRestaurant = data.restaurants.find(r => r.id === savedRestaurantId);
                  
                  // Use saved restaurant or default to first one
                  setSelectedRestaurant(savedRestaurant || data.restaurants[0]);
                  if (!savedRestaurant) {
                    localStorage.setItem('selectedRestaurantId', data.restaurants[0].id);
                  }
                }
              }
            } catch (error) {
              console.error('Error fetching restaurant data:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  const handleLogout = () => {
    apiClient.clearToken();
    setShowMobileMenu(false);
    setShowUserDropdown(false);
    router.push('/login');
  };

  const handleRestaurantChange = (restaurant) => {
    setSelectedRestaurant(restaurant);
    localStorage.setItem('selectedRestaurantId', restaurant.id);
    setShowRestaurantDropdown(false);
    
    // Dispatch custom event for other components to listen to
    window.dispatchEvent(new CustomEvent('restaurantChanged', { 
      detail: { restaurant } 
    }));
  };
  
  const getAllNavItems = () => [
    { id: 'pos', name: 'Orders', icon: FaHome, href: '/dashboard', color: '#ef4444', gradient: 'from-red-500 to-red-600', roles: ['owner', 'manager', 'waiter'] },
    { id: 'orders', name: 'History', icon: FaClipboardList, href: '/orderhistory', color: '#f59e0b', gradient: 'from-amber-500 to-amber-600', roles: ['owner', 'manager', 'waiter'] },
    { id: 'tables', name: 'Tables', icon: FaChair, href: '/tables', color: '#3b82f6', gradient: 'from-blue-500 to-blue-600', roles: ['owner', 'manager', 'waiter'] },
    { id: 'customers', name: 'Customers', icon: FaUsers, href: '/customers', color: '#8b5cf6', gradient: 'from-violet-500 to-violet-600', roles: ['owner', 'manager'] },
    { id: 'menu', name: 'Menu', icon: FaUtensils, href: '/menu', color: '#10b981', gradient: 'from-emerald-500 to-emerald-600', roles: ['owner', 'manager'] },
    { id: 'inventory', name: 'Inventory', icon: FaBoxes, href: '/inventory', color: '#059669', gradient: 'from-teal-500 to-teal-600', roles: ['owner', 'manager'] },
    { id: 'analytics', name: 'Analytics', icon: FaChartBar, href: '/analytics', color: '#8b5cf6', gradient: 'from-violet-500 to-violet-600', roles: ['owner', 'manager'] },
    { id: 'billing', name: 'Billing', icon: FaCreditCard, href: '/billing', color: '#06b6d4', gradient: 'from-cyan-500 to-cyan-600', roles: ['owner'] },
    { id: 'admin', name: 'Admin', icon: FaUsers, href: '/admin', color: '#ec4899', gradient: 'from-pink-500 to-pink-600', roles: ['owner'] },
    { id: 'kot', name: 'KOT', icon: FaPrint, href: '/kot', color: '#f97316', gradient: 'from-orange-500 to-orange-600', roles: ['owner', 'manager', 'waiter'] },
  ];

  // Filter navigation items based on user role and page access
  const navItems = getAllNavItems().filter(item => {
    if (!user || !user.role) {
      return true;
    }
    
    // For staff users, check page access
    if (user.role === 'employee' || user.role === 'manager') {
      if (!pageAccess) return false;
      
      // Map navigation IDs to page access keys
      const accessMap = {
        'pos': 'dashboard',
        'orders': 'history',
        'tables': 'tables',
        'customers': 'customers',
        'menu': 'menu',
        'inventory': 'inventory',
        'analytics': 'analytics',
        'kot': 'kot',
        'admin': 'admin'
      };
      
      const accessKey = accessMap[item.id];
      return accessKey ? pageAccess[accessKey] : false;
    }
    
    // For owners, use role-based filtering
    if (['owner', 'manager', 'waiter'].includes(user.role)) {
      return item.roles.includes(user.role);
    }
    
    return true;
  });

  const handleNavItemClick = () => {
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return user?.role ? user.role.substring(0, 2).toUpperCase() : 'U';
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'owner': return '#ec4899';
      case 'manager': return '#8b5cf6';
      case 'waiter': return '#10b981';
      default: return '#6b7280';
    }
  };

  const mobileNavStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 998,
      opacity: showMobileMenu ? 1 : 0,
      visibility: showMobileMenu ? 'visible' : 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    },
    menu: {
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100vh',
      width: '320px',
      backgroundColor: '#ffffff',
      zIndex: 999,
      boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.12)',
      transform: showMobileMenu ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto'
    }
  };

  return (
    <>
      <nav style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
        borderBottom: '1px solid #e5e7eb',
        padding: isMobile ? '8px 16px' : '8px 24px', // Reduced padding for shorter height
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(12px)',
        height: '64px', // Fixed shorter height
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {/* Logo - Modern Design */}
          <div 
            onClick={() => router.push('/dashboard')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '12px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              background: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #fef7f0 0%, #fed7aa 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ 
              width: '40px', 
              height: '40px', 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)', 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                transform: 'rotate(45deg)',
                animation: 'shine 3s infinite'
              }} />
              <FaUtensils color="white" size={20} />
            </div>
            <div style={{ display: isMobile ? 'none' : 'block' }}>
              <h1 style={{ 
                fontSize: '22px', 
                fontWeight: '800', 
                background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                DineOpen
              </h1>
              <p style={{ 
                fontSize: '10px', 
                color: '#9ca3af', 
                margin: 0,
                fontWeight: '500',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Restaurant OS
              </p>
            </div>
          </div>
          
          {/* Desktop Navigation - Modern Pills */}
          {!isMobile && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(12px)',
              padding: '6px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              {navItems.map((item) => { // Show all navigation items
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link key={item.id} href={item.href}>
                    <div
                      style={{
                        padding: '6px 12px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '12px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: isActive ? `linear-gradient(135deg, ${item.color}e6 0%, ${item.color} 100%)` : 'transparent',
                        color: isActive ? 'white' : '#64748b',
                        textDecoration: 'none',
                        boxShadow: isActive ? `0 8px 25px ${item.color}40` : 'none',
                        transform: isActive ? 'translateY(-1px)' : 'none',
                        position: 'relative',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = `linear-gradient(135deg, ${item.color}15 0%, ${item.color}10 100%)`;
                          e.currentTarget.style.color = item.color;
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = `0 4px 15px ${item.color}25`;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = '#64748b';
                          e.currentTarget.style.transform = 'none';
                          e.currentTarget.style.boxShadow = 'none';
                        }
                      }}
                    >
                      {isActive && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                          animation: 'shine 2s infinite'
                        }} />
                      )}
                      <IconComponent size={12} />
                      <span style={{ position: 'relative', zIndex: 1 }}>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        
          {/* Right Side - Modern Design */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Restaurant Selector - Modern Design */}
            {!isMobile && (user?.role === 'owner' || user?.role === 'customer') && allRestaurants.length > 1 && (
              <div style={{ position: 'relative', zIndex: 1000 }} data-restaurant-dropdown>
                <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Restaurant dropdown clicked, current state:', showRestaurantDropdown);
                      setShowRestaurantDropdown(!showRestaurantDropdown);
                    }}
                    style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    background: showRestaurantDropdown 
                      ? 'linear-gradient(135deg, #fef7f0 0%, #fed7aa 100%)' 
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '12px',
                      cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: showRestaurantDropdown 
                      ? '0 8px 25px rgba(239, 68, 68, 0.15)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.04)',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#374151'
                    }}
                    onMouseEnter={(e) => {
                    if (!showRestaurantDropdown) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                    }
                    }}
                    onMouseLeave={(e) => {
                    if (!showRestaurantDropdown) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    }
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}>
                    <BiRestaurant color="white" size={12} />
                  </div>
                  
                  <div style={{ textAlign: 'left', minWidth: '120px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                          {selectedRestaurant?.name || 'Select Restaurant'}
                      </div>
                    <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '1px' }}>
                      Switch Location
                    </div>
                  </div>
                  
                  <FaChevronDown 
                    style={{ 
                      fontSize: '10px', 
                      color: '#9ca3af',
                      transform: showRestaurantDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                </button>

                {/* Restaurant Dropdown - Modern Design */}
                {showRestaurantDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    zIndex: 10000,
                    minWidth: '300px',
                    marginTop: '8px',
                    overflow: 'hidden'
                  }}>
                    {console.log('Rendering restaurant dropdown')}
                    <div style={{ 
                      padding: '16px 20px', 
                      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                      background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <HiSwitchHorizontal style={{ color: '#ef4444', fontSize: '16px' }} />
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                        Switch Restaurant
                      </h4>
                    </div>
                      <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0 0' }}>
                        Choose your active location
                      </p>
                    </div>
                    
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {allRestaurants.map((restaurant) => (
                      <div
                        key={restaurant.id}
                        onClick={() => handleRestaurantChange(restaurant)}
                        style={{
                            padding: '16px 20px',
                          cursor: 'pointer',
                            backgroundColor: selectedRestaurant?.id === restaurant.id ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                            borderLeft: selectedRestaurant?.id === restaurant.id ? '3px solid #ef4444' : '3px solid transparent',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedRestaurant?.id !== restaurant.id) {
                              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRestaurant?.id !== restaurant.id) {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              background: selectedRestaurant?.id === restaurant.id 
                                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                                : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                              borderRadius: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: selectedRestaurant?.id === restaurant.id 
                                ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                                : '0 2px 4px rgba(0, 0, 0, 0.1)'
                            }}>
                              <FaBuilding 
                                color={selectedRestaurant?.id === restaurant.id ? 'white' : '#6b7280'} 
                                size={14} 
                              />
                            </div>
                          <div>
                              <p style={{ 
                                fontSize: '14px', 
                                fontWeight: '600', 
                                color: selectedRestaurant?.id === restaurant.id ? '#ef4444' : '#1f2937', 
                                margin: 0 
                              }}>
                              {restaurant.name}
                            </p>
                            {restaurant.phone && (
                                <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>
                                📞 {restaurant.phone}
                              </p>
                            )}
                          </div>
                          </div>
                          
                          {selectedRestaurant?.id === restaurant.id && (
                            <div style={{ 
                              width: '20px', 
                              height: '20px', 
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                            }}>
                              <FaCheck color="white" size={10} />
                            </div>
                          )}
                      </div>
                    ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Staff Restaurant Chip - Non-clickable display */}
            {!isMobile && (user?.role === 'waiter' || user?.role === 'manager' || user?.role === 'employee') && selectedRestaurant && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#374151',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                cursor: 'default'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}>
                  <BiRestaurant color="white" size={12} />
                  </div>
                
                <div style={{ textAlign: 'left', minWidth: '120px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                    {selectedRestaurant.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '1px' }}>
                    Current Location
                  </div>
                </div>
              </div>
            )}

            {/* User Menu - Modern Design */}
            {!isMobile && (
              <div style={{ position: 'relative', zIndex: 1000 }} data-user-dropdown>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('User dropdown clicked, current state:', showUserDropdown);
                    setShowUserDropdown(!showUserDropdown);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    background: showUserDropdown 
                      ? 'linear-gradient(135deg, #fef7f0 0%, #fed7aa 100%)' 
                      : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: showUserDropdown 
                      ? '0 8px 25px rgba(239, 68, 68, 0.15)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.04)'
                  }}
                  onMouseEnter={(e) => {
                    if (!showUserDropdown) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showUserDropdown) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                    }
                  }}
                >
                  {/* User Avatar */}
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: user?.photoURL 
                      ? 'transparent'
                      : `linear-gradient(135deg, ${getRoleColor(user?.role)} 0%, ${getRoleColor(user?.role)}dd 100%)`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'white',
                    boxShadow: `0 4px 12px ${getRoleColor(user?.role)}40`,
                    border: '2px solid rgba(255, 255, 255, 0.9)',
                    overflow: 'hidden'
                  }}>
                    {user?.photoURL ? (
                      <img 
                        src={user.photoURL} 
                        alt={user?.name || 'User'} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    ) : (
                      getUserInitials()
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span style={{ 
                      fontSize: '13px', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      lineHeight: '1.2'
                    }}>
                      {user?.name || user?.email?.split('@')[0] || 'User'}
                    </span>
                    <span style={{ 
                      fontSize: '10px', 
                      color: getRoleColor(user?.role), 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      lineHeight: '1.2'
                    }}>
                      {user?.role || 'Staff'}
                  </span>
                  </div>
                  
                  <FaChevronDown 
                    style={{ 
                      fontSize: '10px', 
                      color: '#9ca3af',
                      transform: showUserDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                </button>

                {/* User Dropdown - Modern Design */}
                {showUserDropdown && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                    zIndex: 10000,
                    minWidth: '220px',
                    marginTop: '8px',
                    overflow: 'hidden'
                  }}>
                    {console.log('Rendering user dropdown')}
                    {/* User Info Header */}
                    <div style={{
                      padding: '16px 20px',
                      borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
                      background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: user?.photoURL 
                            ? 'transparent'
                            : `linear-gradient(135deg, ${getRoleColor(user?.role)} 0%, ${getRoleColor(user?.role)}dd 100%)`,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: 'white',
                          boxShadow: `0 4px 12px ${getRoleColor(user?.role)}40`,
                          overflow: 'hidden'
                        }}>
                          {user?.photoURL ? (
                            <img 
                              src={user.photoURL} 
                              alt={user?.name || 'User'} 
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '10px'
                              }}
                            />
                          ) : (
                            getUserInitials()
                          )}
                        </div>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                            {user?.name || user?.email?.split('@')[0] || 'User'}
                          </p>
                          <p style={{ fontSize: '11px', color: getRoleColor(user?.role), fontWeight: '600', margin: '2px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {user?.role || 'Staff'}
                          </p>
                        </div>
                      </div>
                </div>

                {/* Logout Button */}
                    <div style={{ padding: '12px' }}>
                <button
                  onClick={handleLogout}
                  style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    color: '#dc2626',
                          border: '1px solid rgba(220, 38, 38, 0.2)',
                          borderRadius: '12px',
                    fontWeight: '600',
                          fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                          e.currentTarget.style.boxShadow = '0 8px 25px rgba(220, 38, 38, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
                          e.currentTarget.style.color = '#dc2626';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaSignOutAlt size={12} />
                        Sign Out
                </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Staff Restaurant Chip */}
            {isMobile && (user?.role === 'waiter' || user?.role === 'manager' || user?.role === 'employee') && selectedRestaurant && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#374151',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                cursor: 'default',
                maxWidth: '200px'
              }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                }}>
                  <BiRestaurant color="white" size={10} />
                </div>
                
                <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {selectedRestaurant.name}
                  </div>
                  <div style={{ fontSize: '9px', color: '#6b7280', marginTop: '1px' }}>
                    Current Location
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Button - Modern Design */}
            {isMobile && (
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
                }}
              >
                <FaBars size={18} color="#374151" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay and Sidebar - Modern Design */}
      {isMobile && (
        <>
          <div style={mobileNavStyles.overlay} onClick={() => setShowMobileMenu(false)} />
          <div style={mobileNavStyles.menu} data-mobile-menu>
            {/* Mobile Menu Header - Modern */}
            <div style={{
              padding: '24px 20px',
              background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div 
                onClick={() => {
                  router.push('/dashboard');
                  setShowMobileMenu(false);
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ 
                  width: '36px', 
                  height: '36px', 
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(239, 68, 68, 0.3)'
                }}>
                  <FaUtensils color="white" size={16} />
                </div>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1f2937', margin: 0 }}>
                  DineOpen
                </h2>
                  <p style={{ fontSize: '10px', color: '#9ca3af', margin: 0, fontWeight: '500', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Restaurant OS
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                style={{
                  padding: '10px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaTimes size={16} color="#6b7280" />
              </button>
            </div>

            {/* User Info - Mobile */}
            <div style={{ 
              padding: '20px', 
              borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: user?.photoURL 
                    ? 'transparent'
                    : `linear-gradient(135deg, ${getRoleColor(user?.role)} 0%, ${getRoleColor(user?.role)}dd 100%)`,
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '700',
                  color: 'white',
                  boxShadow: `0 6px 20px ${getRoleColor(user?.role)}40`,
                  overflow: 'hidden'
                }}>
                  {user?.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt={user?.name || 'User'} 
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px'
                      }}
                    />
                  ) : (
                    getUserInitials()
                  )}
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    {user?.name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p style={{ fontSize: '12px', color: getRoleColor(user?.role), fontWeight: '600', margin: '2px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {user?.role || 'Staff'}
                  </p>
                  {selectedRestaurant && (
                    <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0 0 0' }}>
                      {selectedRestaurant.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Navigation Items - Modern */}
            <div style={{ flex: 1, padding: '20px 0' }}>
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link key={item.id} href={item.href} onClick={handleNavItemClick}>
                    <div
                      style={{
                        margin: '0 20px 8px 20px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        background: isActive 
                          ? `linear-gradient(135deg, ${item.color}15 0%, ${item.color}08 100%)` 
                          : 'transparent',
                        borderRadius: '16px',
                        color: isActive ? item.color : '#374151',
                        textDecoration: 'none',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        fontWeight: isActive ? '600' : '500',
                        border: isActive ? `1px solid ${item.color}30` : '1px solid transparent',
                        boxShadow: isActive ? `0 4px 15px ${item.color}20` : 'none'
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: isActive 
                          ? `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`
                          : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isActive ? `0 4px 12px ${item.color}40` : '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}>
                        <IconComponent size={18} color={isActive ? 'white' : '#6b7280'} />
                      </div>
                      <span style={{ fontSize: '16px', fontWeight: 'inherit' }}>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Footer - Logout */}
            <div style={{ padding: '20px', borderTop: '1px solid rgba(0, 0, 0, 0.05)' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                  color: '#dc2626',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  borderRadius: '16px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <FaSignOutAlt size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add shine animation styles */}
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }
      `}</style>
    </>
  );
}

function NavigationFallback() {
  return (
    <nav style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
      borderBottom: '1px solid #e5e7eb',
      padding: '8px 24px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      height: '64px',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
            borderRadius: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)'
          }}>
            <FaUtensils color="white" size={20} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              Dine
            </h1>
            <p style={{ 
              fontSize: '10px', 
              color: '#9ca3af', 
              margin: 0,
              fontWeight: '500',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Restaurant OS
            </p>
          </div>
        </div>
        <div style={{ 
          width: '24px', 
          height: '24px', 
          border: '3px solid #f3f4f6',
          borderTop: '3px solid #ef4444',
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