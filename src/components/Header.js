'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  FaChair, 
  FaSignOutAlt, 
  FaUtensils, 
  FaClipboardList, 
  FaTable, 
  FaChartBar, 
  FaUsers,
  FaTimes
} from 'react-icons/fa';

const Header = ({ 
  selectedTable, 
  clearSelectedTable, 
  orderType, 
  setOrderType, 
  setShowTableSelector,
  navigateToPage,
  handleLogout,
  showPOSControls = false 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getFilteredNavItems = () => {
    const allItems = [
      { path: '/orders', label: 'Orders', icon: FaClipboardList },
      { path: '/orders', label: 'History', icon: FaClipboardList },
      { path: '/tables', label: 'Tables', icon: FaTable },
      { path: '/menu', label: 'Menu', icon: FaUtensils },
      { path: '/analytics', label: 'Analytics', icon: FaChartBar }
    ];

    if (!user) return allItems;

    // Role-based filtering
    if (user.role === 'waiter') {
      return allItems.filter(item => 
        ['Orders', 'History', 'Tables', 'Menu'].includes(item.label)
      );
    }

    return allItems; // Owner and Manager get all items
  };

  const navItems = getFilteredNavItems();

  return (
    <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
      {/* Main Navigation */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left Side - Logo/Title and Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Logo/Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#e53e3e',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaUtensils color="white" size={16} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                Dine POS
              </span>
            </div>

            {/* Navigation Items */}
            {pathname !== '/' && (
              <nav style={{ display: 'flex', gap: '16px' }}>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => router.push(item.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: isActive ? '#e53e3e' : 'transparent',
                        color: isActive ? 'white' : '#6b7280',
                        fontWeight: '500',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.target.style.backgroundColor = '#f3f4f6';
                          e.target.style.color = '#374151';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.color = '#6b7280';
                        }
                      }}
                    >
                      <Icon size={14} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Side - User Info and Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' }}>
                <span>Welcome, {user.name}</span>
                <span style={{ 
                  backgroundColor: user.role === 'owner' ? '#dc2626' : user.role === 'manager' ? '#7c3aed' : '#2563eb',
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {user.role}
                </span>
              </div>
            )}
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

      {/* POS Controls - Only show on main page */}
      {showPOSControls && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {/* Left Side - Table and Order Type */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Current Table Display */}
              {selectedTable && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#fef2f2', padding: '8px 12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                  <FaChair size={16} color="#e53e3e" />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626' }}>
                    {selectedTable.name} - {selectedTable.floor}
                  </span>
                  <button
                    onClick={clearSelectedTable}
                    style={{
                      marginLeft: '6px',
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: '#dc2626',
                      border: 'none',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              )}

              {/* Order Type Selection */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
                {[
                  { value: 'dine-in', label: 'Dine In' },
                  { value: 'delivery', label: 'Delivery' },
                  { value: 'pickup', label: 'Pickup' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setOrderType(type.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: orderType === type.value ? '#e53e3e' : 'transparent',
                      color: orderType === type.value ? 'white' : '#6b7280',
                      fontWeight: '500',
                      fontSize: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Side - Table Selection Button */}
            <div>
              {orderType === 'dine-in' && !selectedTable && (
                <button
                  onClick={() => setShowTableSelector(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <FaChair size={12} />
                  Select Table
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;