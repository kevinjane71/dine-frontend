'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import apiClient from '../../../lib/api';
import { 
  FaEye, 
  FaCheck, 
  FaClock, 
  FaUtensils, 
  FaSearch,
  FaFilter,
  FaChair,
  FaTruck,
  FaShoppingBag,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const OrderHistory = () => {
  console.log('Orders page: Component rendering');
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedWaiter, setSelectedWaiter] = useState('all');
  const [waiters, setWaiters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Mobile detection hook
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const isMobileView = width <= 768;
      setIsMobile(isMobileView);
    };
    
    // Check immediately and also with a delay for hydration
    checkMobile();
    const timeoutId = setTimeout(checkMobile, 100);
    
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('dine_cart');
    localStorage.removeItem('dine_saved_order');
    router.push('/login');
  };

  // Fetch real orders from backend
  useEffect(() => {
    console.log('Orders page: useEffect triggered');
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Orders page: Starting fetchOrders');
        
        // Check if user is authenticated
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        console.log('Orders page: Token exists:', !!token);
        console.log('Orders page: User data exists:', !!userData);
        
        if (!token || !userData) {
          console.log('Orders page: Missing authentication data');
          setError('Please log in to view orders');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        console.log('Orders page: User role:', user.role);
        console.log('Orders page: User restaurantId:', user.restaurantId);
        
        let restaurantId = null;

        // For staff members, use their assigned restaurant
        if (user.restaurantId) {
          restaurantId = user.restaurantId;
          console.log('Orders page: Using staff restaurant ID:', restaurantId);
        } 
        // For owners or customers (legacy), get selected restaurant from localStorage or first restaurant
        else if (user.role === 'owner' || user.role === 'customer') {
          try {
            console.log('Orders page: Fetching restaurants for owner');
            const restaurantsResponse = await apiClient.getRestaurants();
            console.log('Orders page: Restaurants response:', restaurantsResponse);
            
            if (restaurantsResponse.restaurants && restaurantsResponse.restaurants.length > 0) {
              const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
              console.log('Orders page: Saved restaurant ID:', savedRestaurantId);
              
              const selectedRestaurant = restaurantsResponse.restaurants.find(r => r.id === savedRestaurantId) || 
                                        restaurantsResponse.restaurants[0];
              restaurantId = selectedRestaurant.id;
              console.log('Orders page: Selected restaurant:', selectedRestaurant);
            } else {
              console.log('Orders page: No restaurants found');
              setError('No restaurants found. Please add a restaurant first.');
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Orders page: Error fetching restaurants:', err);
            setError('Failed to fetch restaurant information');
            setLoading(false);
            return;
          }
        } else {
          console.log('Orders page: Unknown user role - showing empty state');
          setError('No restaurant found. Please set up a restaurant first.');
          setLoading(false);
          return;
        }
        
        console.log('Orders page: Making API call with restaurant ID:', restaurantId);
        
        // Fetch waiters for filtering
        const waitersResponse = await apiClient.getWaiters(restaurantId);
        setWaiters(waitersResponse.waiters || []);
        
        // Fetch orders with waiter filter - only include defined values
        const filters = {};
        
        // For staff users, automatically filter by their own waiter ID unless they specifically select "all"
        if (user.role === 'staff' && selectedWaiter === 'all') {
          // Staff users see only their own orders by default
          filters.waiterId = user.id;
        } else if (selectedWaiter && selectedWaiter !== 'all') {
          // Admin/owner users can filter by specific waiter
          filters.waiterId = selectedWaiter;
        }
        
        if (searchTerm && searchTerm.trim()) {
          filters.search = searchTerm.trim();
        }
        
        const response = await apiClient.getOrders(restaurantId, filters);
        console.log('Orders page: API response:', response);
        console.log('Orders page: Filters sent:', filters);
        console.log('Orders page: User ID:', user.id);
        
        // Transform backend order data to match frontend format
        const transformedOrders = response.orders.map(order => ({
          id: order.id,
          tableNumber: order.tableNumber,
          customerName: order.customerInfo?.name || 'Customer',
          phone: order.customerInfo?.phone,
          address: order.customerInfo?.address,
          items: order.items,
          total: order.totalAmount,
          status: order.status,
          type: order.orderType,
          orderTime: order.createdAt.toDate ? order.createdAt.toDate().toISOString() : order.createdAt,
          notes: order.notes,
          paymentMethod: order.paymentMethod || 'cash',
          staffInfo: order.staffInfo || null
        }));
        
        console.log('Orders page: Transformed orders:', transformedOrders);
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Orders page: Error fetching orders:', error);
        setError('Failed to fetch orders. Please ensure you are logged in and try again.');
        setOrders([]);
      } finally {
        console.log('Orders page: Setting loading to false');
        setLoading(false);
      }
    };

    console.log('Orders page: About to call fetchOrders');
    fetchOrders().catch(err => {
      console.error('Orders page: Unhandled error in fetchOrders:', err);
      setError('Unexpected error occurred');
      setLoading(false);
    });
  }, [selectedWaiter, searchTerm]);

  // Listen for restaurant changes from navigation
  useEffect(() => {
    const handleRestaurantChange = (event) => {
      console.log('🏪 Order History page: Restaurant changed, reloading data', event.detail);
      // Trigger a re-fetch by updating searchTerm (which will trigger the main useEffect)
      setSearchTerm(prev => prev + ' '); // Add space to trigger re-fetch
      setTimeout(() => setSearchTerm(prev => prev.trim()), 100); // Remove space after fetch
    };

    window.addEventListener('restaurantChanged', handleRestaurantChange);

    return () => {
      window.removeEventListener('restaurantChanged', handleRestaurantChange);
    };
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      'pending': { 
        bg: '#fef3c7', 
        text: '#92400e', 
        label: 'Pending',
        icon: FaClock,
        border: '#f59e0b'
      },
      'confirmed': { 
        bg: '#dbeafe', 
        text: '#1e40af', 
        label: 'Confirmed',
        icon: FaCheckCircle,
        border: '#3b82f6'
      },
      'preparing': { 
        bg: '#fed7aa', 
        text: '#c2410c', 
        label: 'Preparing',
        icon: FaUtensils,
        border: '#ea580c'
      },
      'ready': { 
        bg: '#dcfce7', 
        text: '#166534', 
        label: 'Ready',
        icon: FaCheck,
        border: '#22c55e'
      },
      'delivered': { 
        bg: '#f3e8ff', 
        text: '#7c2d92', 
        label: 'Delivered',
        icon: FaCheckCircle,
        border: '#a855f7'
      },
      'cancelled': { 
        bg: '#fee2e2', 
        text: '#dc2626', 
        label: 'Cancelled',
        icon: FaTimesCircle,
        border: '#ef4444'
      }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getTypeInfo = (type) => {
    const typeMap = {
      'dine-in': { 
        bg: '#f0fdf4', 
        text: '#166534', 
        label: 'Dine In',
        icon: FaChair,
        border: '#22c55e'
      },
      'delivery': { 
        bg: '#eff6ff', 
        text: '#1e40af', 
        label: 'Delivery',
        icon: FaTruck,
        border: '#3b82f6'
      },
      'pickup': { 
        bg: '#fef3c7', 
        text: '#92400e', 
        label: 'Pickup',
        icon: FaShoppingBag,
        border: '#f59e0b'
      }
    };
    return typeMap[type] || typeMap['dine-in'];
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Get current restaurant ID for validation
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);
      let restaurantId = user.restaurantId; // For staff users
      
      if (!restaurantId && (user.role === 'owner' || user.role === 'admin')) {
        // For owners/admins, get selected restaurant
        restaurantId = localStorage.getItem('selectedRestaurantId');
      }
      
      await apiClient.updateOrderStatus(orderId, newStatus, restaurantId);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesType = selectedType === 'all' || order.type === selectedType;
    // Search is now handled by the backend API
    return matchesStatus && matchesType;
  });

  const getTimeAgo = (orderTime) => {
    const now = new Date();
    const orderDate = new Date(orderTime);
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #fed7aa',
              borderTop: '4px solid #f97316',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px auto'
            }} />
            <div style={{ fontSize: '18px', color: '#6b7280', fontWeight: '600' }}>Loading orders...</div>
            <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>Getting order history</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, rgb(255 246 241) 0%, rgb(254 245 242) 50%, rgb(255 244 243) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0
        }} />
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            textAlign: 'center', 
            maxWidth: '500px', 
            padding: '40px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              width: '100px', 
              height: '100px', 
              backgroundColor: '#fef2f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              animation: 'bounce 2s infinite'
            }}>
              <FaUtensils size={40} style={{ color: '#ef4444' }} />
            </div>
            
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Order History Ready! 📋
            </h1>
            
            <p style={{ 
              fontSize: '18px', 
              color: '#374151', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              View Your Order History
            </p>
            
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280', 
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Set up your restaurant first, then start taking orders from customers. All order history will appear here with complete transaction details.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                }}
              >
                Set Up Restaurant First
              </button>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Order History - DineOpen</title>
      </Head>
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      
      <div style={{ padding: isMobile ? '12px' : '16px' }}>
        {/* Mobile Header */}
        {isMobile && (
          <div style={{
            backgroundColor: 'white',
            margin: '-12px -12px 16px -12px',
            padding: '16px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: 0 }}>Order History</h1>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                {filteredOrders.length} orders in history
              </p>
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              style={{
                padding: '8px 12px',
                backgroundColor: showMobileFilters ? '#3b82f6' : '#f3f4f6',
                color: showMobileFilters ? 'white' : '#374151',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FaFilter size={12} />
              Filters
            </button>
          </div>
        )}
        
        {/* Desktop Header */}
        {!isMobile && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                Order History
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
                {filteredOrders.length} orders in history
              </p>
            </div>
          </div>
        )}

        {/* Mobile Filters Modal */}
        {isMobile && showMobileFilters && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'flex-end'
          }}>
            <div style={{
              backgroundColor: 'white',
              width: '100%',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              maxHeight: '70vh',
              overflowY: 'auto',
              padding: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', margin: 0 }}>Filter Orders</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    fontSize: '18px',
                    color: '#6b7280'
                  }}
                >
                  ×
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Mobile Search */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Search Orders
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FaSearch style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#9ca3af',
                      fontSize: '14px'
                    }} />
                    <input
                      type="text"
                      placeholder="Search by ID or customer name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        paddingLeft: '36px',
                        paddingRight: '12px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
                
                {/* Mobile Status Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Order Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                {/* Mobile Type Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Order Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="all">All Types</option>
                    <option value="dine-in">Dine In</option>
                    <option value="delivery">Delivery</option>
                    <option value="pickup">Pickup</option>
                  </select>
                </div>
                
                {/* Mobile Waiter Filter */}
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    Waiter
                  </label>
                  <select
                    value={selectedWaiter}
                    onChange={(e) => setSelectedWaiter(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      backgroundColor: 'white',
                      outline: 'none'
                    }}
                  >
                    <option value="all">All Waiters</option>
                    {waiters.map(waiter => (
                      <option key={waiter.id} value={waiter.id}>
                        {waiter.name} ({waiter.loginId})
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={() => setShowMobileFilters(false)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '8px'
                  }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Desktop Filters */}
        <div style={{ 
          display: isMobile ? 'none' : 'flex', 
          gap: '12px', 
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <FaSearch style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: '14px'
            }} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '36px',
                paddingRight: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: 'white'
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              minWidth: '120px'
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              minWidth: '120px'
            }}
          >
            <option value="all">All Types</option>
            <option value="dine-in">Dine In</option>
            <option value="delivery">Delivery</option>
            <option value="pickup">Pickup</option>
          </select>

          {/* Waiter Filter */}
          <select
            value={selectedWaiter}
            onChange={(e) => setSelectedWaiter(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              minWidth: '120px'
            }}
          >
            <option value="all">All Waiters</option>
            {waiters.map(waiter => (
              <option key={waiter.id} value={waiter.id}>
                {waiter.name} ({waiter.loginId})
              </option>
            ))}
          </select>
        </div>

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '8px' }}>
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const typeInfo = getTypeInfo(order.type);
            const StatusIcon = statusInfo.icon;
            const TypeIcon = typeInfo.icon;

            return (
              <div 
                key={order.id} 
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: isMobile ? '12px' : '8px',
                  padding: isMobile ? '16px' : '16px',
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: isMobile ? 'stretch' : 'center',
                  justifyContent: 'space-between',
                  gap: isMobile ? '12px' : '16px',
                  transition: 'all 0.2s',
                  boxShadow: isMobile ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {/* Mobile Order Layout */}
                {isMobile ? (
                  <>
                    {/* Mobile Order Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '16px', color: '#1f2937' }}>
                            {order.id}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {getTimeAgo(order.orderTime)}
                          </div>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 8px',
                          backgroundColor: typeInfo.bg,
                          color: typeInfo.text,
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600'
                        }}>
                          <TypeIcon size={10} />
                          {typeInfo.label}
                        </div>
                      </div>
                      <div style={{ fontWeight: '700', fontSize: '18px', color: '#1f2937' }}>
                        ₹{order.total}
                      </div>
                    </div>
                    
                    {/* Mobile Customer & Table */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>
                          {order.customerName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {order.tableNumber ? `Table ${order.tableNumber}` : order.phone}
                        </div>
                        {order.staffInfo && (
                          <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                            Waiter: {order.staffInfo.name} ({order.staffInfo.loginId})
                          </div>
                        )}
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 10px',
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.text,
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        <StatusIcon size={12} />
                        {statusInfo.label}
                      </div>
                    </div>
                    
                    {/* Mobile Items Preview */}
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.4' }}>
                        {order.items.slice(0, 2).map(item => `${item.quantity}× ${item.name}`).join(', ')}
                        {order.items.length > 2 && (
                          <span style={{ color: '#6b7280' }}>
                            {' '}+{order.items.length - 2} more items
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Mobile Action Button */}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <FaEye size={12} />
                      View Details
                    </button>
                  </>
                ) : (
                  // Desktop Order Layout
                  <>
                    {/* Order Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                  {/* Order ID & Time */}
                  <div style={{ minWidth: '100px' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937' }}>
                      {order.id}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {getTimeAgo(order.orderTime)}
                    </div>
                  </div>

                  {/* Customer & Table */}
                  <div style={{ minWidth: '140px' }}>
                    <div style={{ fontWeight: '500', fontSize: '14px', color: '#1f2937' }}>
                      {order.customerName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {order.tableNumber ? `Table ${order.tableNumber}` : order.phone}
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ fontSize: '13px', color: '#4b5563' }}>
                      {order.items.slice(0, 2).map(item => `${item.quantity}x ${item.name}`).join(', ')}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </div>
                  </div>

                  {/* Staff & Payment */}
                  <div style={{ minWidth: '120px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                      {order.staffInfo?.name || 'Staff'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {order.paymentMethod || 'cash'} • {order.staffInfo?.loginId || order.staffInfo?.role || 'waiter'}
                    </div>
                  </div>

                  {/* Total */}
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#1f2937', minWidth: '60px' }}>
                    ₹{order.total}
                  </div>
                </div>

                    {/* Status & Type & Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Type Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    backgroundColor: typeInfo.bg,
                    color: typeInfo.text,
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    <TypeIcon size={10} />
                    {typeInfo.label}
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    backgroundColor: statusInfo.bg,
                    color: statusInfo.text,
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    minWidth: '80px',
                    justifyContent: 'center'
                  }}>
                    <StatusIcon size={10} />
                    {statusInfo.label}
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaEye size={10} />
                    View
                  </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && !loading && !error && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'linear-gradient(135deg, rgb(255 246 241) 0%, rgb(254 245 242) 50%, rgb(255 244 243) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)
              `,
              zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                animation: 'bounce 2s infinite'
              }}>
                <FaUtensils size={40} style={{ color: '#ef4444' }} />
              </div>
              
              <h3 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {searchTerm || selectedStatus !== 'all' || selectedType !== 'all' 
                  ? 'No orders found' 
                  : 'Order History Ready! 📋'}
              </h3>
              
              <p style={{
                fontSize: '18px',
                color: '#374151',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                {searchTerm || selectedStatus !== 'all' || selectedType !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'View Your Order History'}
              </p>
              
              <p style={{
                color: '#6b7280',
                marginBottom: '32px',
                maxWidth: '500px',
                margin: '0 auto 32px auto',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                {searchTerm || selectedStatus !== 'all' || selectedType !== 'all' 
                  ? 'Try adjusting your filters or clear them to see all orders.' 
                  : 'Set up your restaurant first, then start taking orders from customers. All order history will appear here with complete transaction details.'
                }
              </p>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {searchTerm || selectedStatus !== 'all' || selectedType !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('all');
                      setSelectedType('all');
                      setSelectedWaiter('all');
                    }}
                    style={{
                      padding: '16px 32px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                    }}
                  >
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/dashboard')}
                    style={{
                      padding: '16px 32px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                    }}
                  >
                    Set Up Restaurant First
                  </button>
                )}
              </div>
            </div>
            
            <style jsx>{`
              @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                  transform: translateY(0);
                }
                40% {
                  transform: translateY(-10px);
                }
                60% {
                  transform: translateY(-5px);
                }
              }
            `}</style>
          </div>
        )}
      </div>

      {/* Order Details Modal - Mobile Responsive */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: isMobile ? 'flex-end' : 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: isMobile ? '0' : '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: isMobile ? '16px 16px 0 0' : '12px',
            width: '100%',
            maxWidth: isMobile ? '100%' : '500px',
            maxHeight: isMobile ? '85vh' : '80vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ padding: isMobile ? '16px 20px' : '20px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                    Order {selectedOrder.id}
                  </h3>
                  {isMobile && (
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                      {getTimeAgo(selectedOrder.orderTime)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    color: '#6b7280',
                    fontSize: isMobile ? '24px' : '20px',
                    fontWeight: 'bold',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    padding: isMobile ? '8px' : '4px',
                    borderRadius: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: isMobile ? '16px 20px' : '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer Information</div>
                <div style={{ 
                  padding: isMobile ? '12px' : '12px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0' 
                }}>
                  <div style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: '600', color: '#1f2937', marginBottom: '4px' }}>{selectedOrder.customerName}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{selectedOrder.phone}</div>
                  {selectedOrder.tableNumber && (
                    <div style={{ fontSize: '13px', color: '#3b82f6', fontWeight: '500', marginTop: '2px' }}>Table {selectedOrder.tableNumber}</div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Items</div>
                <div style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: isMobile ? '12px' : '12px',
                      borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #e2e8f0' : 'none'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            backgroundColor: '#3b82f6', 
                            color: 'white', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            fontSize: '11px', 
                            fontWeight: '600',
                            minWidth: '20px',
                            textAlign: 'center'
                          }}>{item.quantity}</span>
                          <span style={{ fontSize: isMobile ? '14px' : '14px', fontWeight: '500', color: '#1f2937' }}>{item.name}</span>
                        </div>
                      </div>
                      <div style={{ fontWeight: '600', fontSize: isMobile ? '14px' : '14px', color: '#1f2937' }}>₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff & Payment Info */}
              {selectedOrder.staffInfo && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order Details</div>
                  <div style={{ padding: isMobile ? '12px' : '12px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: isMobile ? '8px' : '0' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                          {selectedOrder.staffInfo.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {selectedOrder.staffInfo.role}
                        </div>
                      </div>
                      <div style={{ 
                        backgroundColor: '#22c55e', 
                        color: 'white', 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '11px', 
                        fontWeight: '600',
                        textTransform: 'uppercase'
                      }}>
                        {selectedOrder.paymentMethod || 'Cash'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '2px solid #e5e7eb',
                marginTop: '8px'
              }}>
                <span style={{ fontSize: isMobile ? '16px' : '16px', fontWeight: '700', color: '#1f2937' }}>Total Amount</span>
                <span style={{ fontSize: isMobile ? '20px' : '18px', fontWeight: '700', color: '#059669' }}>₹{selectedOrder.total}</span>
              </div>

              {selectedOrder.notes && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Special Notes</div>
                  <div style={{ padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
                    <div style={{ fontSize: '14px', color: '#92400e', fontStyle: 'italic' }}>{selectedOrder.notes}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default OrderHistory;