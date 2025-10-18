'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaPrint, 
  FaClock, 
  FaCheck, 
  FaFire,
  FaExclamationTriangle,
  FaBell,
  FaUtensils,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaPlay,
  FaPause,
  FaSync,
  FaKitchenSet,
  FaStopwatch,
  FaClipboardCheck,
  FaHome,
  FaTruck,
  FaShoppingBag,
  FaSpinner,
  FaTable,
  FaFilter,
  FaTrash,
  FaReceipt
} from 'react-icons/fa';
import { GiChefToque } from "react-icons/gi";
import apiClient from '../../../lib/api';
import Notification from '../../../components/Notification';

const KitchenOrderTicket = () => {
  const router = useRouter();
  const [kotOrders, setKotOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedKot, setSelectedKot] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [timers, setTimers] = useState({}); // For cooking timers
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [notification, setNotification] = useState({ show: false });
  const [isPollingActive, setIsPollingActive] = useState(false);
  const [pollCount, setPollCount] = useState(0);

  // Load restaurant and KOT data
  const loadKotData = useCallback(async (showSpinner = true) => {
    try {
      if (showSpinner) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setError('');
      
      // Prevent layout shift by maintaining current state during refresh
      const currentOrders = kotOrders;

      // Get current restaurant from localStorage or user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        setError('User not authenticated');
        setCurrentRestaurant(null);
        setKotOrders([]);
        return;
      }

      const user = JSON.parse(userData);
      let restaurantId = null;

      // For staff members, use their assigned restaurant
      if (user.restaurantId) {
        restaurantId = user.restaurantId;
        console.log('KOT: Using staff restaurant ID:', restaurantId);
      } 
      // For owners, get selected restaurant from localStorage or first restaurant
      else if (user.role === 'owner' || user.role === 'admin') {
        try {
          const restaurants = await apiClient.getRestaurants();
          if (!restaurants.restaurants || restaurants.restaurants.length === 0) {
            setError('No restaurants found');
            setCurrentRestaurant(null);
            setKotOrders([]);
            return;
          }
          
          const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
          const selectedRestaurant = restaurants.restaurants.find(r => r.id === savedRestaurantId) || 
                                    restaurants.restaurants[0];
          restaurantId = selectedRestaurant.id;
          setCurrentRestaurant(selectedRestaurant);
          console.log('KOT: Using selected restaurant:', selectedRestaurant);
        } catch (error) {
          console.error('Error fetching restaurants:', error);
          setError('Failed to load restaurants');
          return;
        }
      } else {
        setError('Invalid user role');
        return;
      }

      if (!restaurantId) {
        setError('No restaurant selected');
        setCurrentRestaurant(null);
        setKotOrders([]);
        return;
      }

      // Get KOT orders for this restaurant using the specific API endpoint
      const kotApiUrl = `https://dine-backend-lake.vercel.app/api/kot/${restaurantId}`;
      console.log('🌐 Making KOT API call to:', kotApiUrl);
      console.log('🔑 Auth token present:', !!localStorage.getItem('authToken'));
      
      const response = await fetch(kotApiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 KOT API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ KOT API error response:', errorText);
        throw new Error(`Failed to fetch KOT orders: ${response.status} - ${errorText}`);
      }

      const kotData = await response.json();
      console.log('📦 KOT API response data:', kotData);
      
      if (kotData.orders) {
        setKotOrders(kotData.orders);
      } else {
        setKotOrders([]);
      }

    } catch (error) {
      console.error('Error loading KOT data:', error);
      setError(error.message || 'Failed to load kitchen orders');
      setKotOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Mobile detection with client-side hydration safety
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initial load and auto-refresh setup with page visibility detection
  useEffect(() => {
    console.log('🚀 KOT page useEffect - setting up polling');
    loadKotData();

    let interval = null;
    
    // Function to start polling
    const startPolling = () => {
      console.log('🔄 Starting KOT polling...');
      if (interval) clearInterval(interval);
      setIsPollingActive(true);
      interval = setInterval(() => {
        console.log('⏰ Polling interval triggered');
        console.log('📊 Page visibility check:', {
          documentHidden: document.hidden,
          documentHasFocus: document.hasFocus(),
          windowFocused: document.hasFocus()
        });
        
        // Simplified visibility check - just check if document is not hidden
        if (!document.hidden) {
          console.log('🔄 Polling KOT data...');
          setPollCount(prev => prev + 1);
          loadKotData(false); // Refresh without showing loader
        } else {
          console.log('⏸️ Page hidden, skipping poll');
        }
      }, 10000); // 10 seconds as requested
      console.log('✅ Polling started with interval:', interval);
    };

    // Function to stop polling
    const stopPolling = () => {
      console.log('⏹️ Stopping KOT polling...');
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      setIsPollingActive(false);
    };

    // Start polling initially
    startPolling();

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      console.log('👁️ Visibility changed:', document.hidden ? 'hidden' : 'visible');
      if (document.hidden) {
        console.log('🔍 KOT page hidden - stopping polling');
        stopPolling();
      } else {
        console.log('🔍 KOT page visible - starting polling');
        startPolling();
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      console.log('🧹 Cleaning up KOT polling...');
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadKotData]);

  // Listen for restaurant changes from navigation
  useEffect(() => {
    const handleRestaurantChange = (event) => {
      console.log('KOT: Restaurant changed, reloading data', event.detail);
      loadKotData();
    };

    // Listen for custom restaurant change events
    window.addEventListener('restaurantChanged', handleRestaurantChange);

    return () => {
      window.removeEventListener('restaurantChanged', handleRestaurantChange);
    };
  }, [loadKotData]);

  // Cleanup on route changes to prevent memory leaks
  useEffect(() => {
    const handleRouteChange = () => {
      console.log('🔍 KOT page route change detected - cleaning up polling');
      // Clear any ongoing timers/intervals
      setKotOrders([]);
      setSelectedKot(null);
      setError('');
    };

    // Listen for route changes (Next.js router events)
    const handleBeforeUnload = () => {
      console.log('🔍 KOT page unloading - cleaning up polling');
      handleRouteChange();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleRouteChange();
    };
  }, []);

  // Update cooking timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => {
        const newTimers = { ...prevTimers };
        kotOrders.forEach(order => {
          if (order.status === 'preparing' && order.cookingStartTime) {
            const startTime = new Date(order.cookingStartTime);
            const now = new Date();
            const elapsed = Math.floor((now - startTime) / 1000); // seconds
            newTimers[order.id] = elapsed;
          }
        });
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [kotOrders]);

  // Handle authentication check and user role
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/auth');
      return;
    }
    
    // Get user role
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [router]);

  const getStatusInfo = (status) => {
    const statusMap = {
      confirmed: { 
        bg: '#fef3c7', 
        text: '#92400e', 
        label: 'Confirmed',
        icon: FaClock,
        border: '#fbbf24'
      },
      preparing: { 
        bg: '#dbeafe', 
        text: '#1e40af', 
        label: 'Preparing',
        icon: FaUtensils,
        border: '#3b82f6'
      },
      ready: { 
        bg: '#dcfce7', 
        text: '#166534', 
        label: 'Ready',
        icon: FaCheckCircle,
        border: '#22c55e'
      },
      served: { 
        bg: '#f3f4f6', 
        text: '#374151', 
        label: 'Served',
        icon: FaCheck,
        border: '#6b7280'
      },
      completed: { 
        bg: '#dcfce7', 
        text: '#166534', 
        label: 'Completed',
        icon: FaCheckCircle,
        border: '#22c55e'
      }
    };
    return statusMap[status] || statusMap.confirmed;
  };

  const getPriorityInfo = (priority) => {
    const priorityMap = {
      urgent: { 
        bg: '#fecaca', 
        text: '#991b1b', 
        label: 'URGENT',
        border: '#ef4444'
      },
      normal: { 
        bg: '#dbeafe', 
        text: '#1e40af', 
        label: 'NORMAL',
        border: '#3b82f6'
      },
      low: { 
        bg: '#f3f4f6', 
        text: '#374151', 
        label: 'LOW',
        border: '#6b7280'
      }
    };
    return priorityMap[priority] || priorityMap.normal;
  };

  const getOrderTypeInfo = (type) => {
    const typeMap = {
      'dine-in': { icon: FaHome, label: 'Dine In', color: '#8b5cf6' },
      'delivery': { icon: FaTruck, label: 'Delivery', color: '#3b82f6' },
      'pickup': { icon: FaShoppingBag, label: 'Pickup', color: '#10b981' }
    };
    return typeMap[type] || typeMap['dine-in'];
  };

  const getSpiceIcon = (level) => {
    const spiceColors = {
      mild: '#10b981',
      medium: '#f59e0b', 
      hot: '#ef4444'
    };
    return <FaFire style={{ color: spiceColors[level] }} size={12} />;
  };

  const updateKotStatus = async (kotId, orderId, newStatus) => {
    try {
      // Update status via API
      await apiClient.updateKotStatus(orderId, newStatus);
      
      // Update local state optimistically
      setKotOrders(orders => orders.map(order => 
        order.kotId === kotId ? { ...order, status: newStatus } : order
      ));
      
      // Play notification sound if enabled
      if (soundEnabled && newStatus === 'ready') {
        // In a real app, you'd play a sound here
        console.log('🔔 Order ready notification sound');
      }

      // Refresh data after a short delay to get updated server state
      setTimeout(() => {
        loadKotData(false);
      }, 1000);

    } catch (error) {
      console.error('Error updating KOT status:', error);
      setError('Failed to update order status');
      
      // Refresh data to ensure consistency
      loadKotData(false);
    }
  };

  const startCooking = async (kotId, orderId) => {
    try {
      await apiClient.startCooking(orderId);
      
      // Update local state
      setKotOrders(orders => orders.map(order => 
        order.kotId === kotId ? { 
          ...order, 
          status: 'preparing',
          cookingStartTime: new Date().toISOString()
        } : order
      ));

      // Refresh to get server state
      setTimeout(() => {
        loadKotData(false);
      }, 1000);

    } catch (error) {
      console.error('Error starting cooking:', error);
      setError('Failed to start cooking timer');
    }
  };

  const markReady = async (kotId, orderId) => {
    try {
      await apiClient.markReady(orderId);
      
      // Update local state
      setKotOrders(orders => orders.map(order => 
        order.kotId === kotId ? { 
          ...order, 
          status: 'ready',
          cookingEndTime: new Date().toISOString()
        } : order
      ));

      // Play notification sound
      if (soundEnabled) {
        console.log('🔔 Order ready notification sound');
      }

      // Refresh to get server state
      setTimeout(() => {
        loadKotData(false);
      }, 1000);

    } catch (error) {
      console.error('Error marking ready:', error);
      setError('Failed to mark order as ready');
    }
  };

  const markServed = async (kotId, orderId) => {
    try {
      await apiClient.markServed(orderId);
      
      // Update local state
      setKotOrders(orders => orders.map(order => 
        order.kotId === kotId ? { ...order, status: 'served' } : order
      ));

      // Refresh to get server state
      setTimeout(() => {
        loadKotData(false);
      }, 1000);

    } catch (error) {
      console.error('Error marking served:', error);
      setError('Failed to mark order as served');
    }
  };

  const deleteOrder = async (orderId, kotId) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }
    
    try {
      await apiClient.deleteOrder(orderId);
      
      // Remove from local state
      setKotOrders(prev => prev.filter(order => order.id !== kotId));
      
      // Close modal if this order was selected
      if (selectedKot && selectedKot.id === kotId) {
        setSelectedKot(null);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      setError(error.message || 'Failed to delete order');
    }
  };

  const markCompleted = async (kotId, orderId) => {
    try {
      await apiClient.completeOrder(orderId);
      
      // Remove from local state since completed orders don't show in KOT
      setKotOrders(orders => orders.filter(order => order.kotId !== kotId));

      // Refresh to get server state
      setTimeout(() => {
        loadKotData(false);
      }, 1000);

    } catch (error) {
      console.error('Error marking completed:', error);
      setError('Failed to mark order as completed');
    }
  };

  const filteredOrders = kotOrders.filter(order => {
    return selectedStatus === 'all' || order.status === selectedStatus;
  });

  const formatTime = (timeString) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return '--:--';
    }
  };

  const getTimeElapsed = (kotTime) => {
    try {
      const now = new Date();
      const kotDate = new Date(kotTime);
      const diffInMinutes = Math.floor((now - kotDate) / (1000 * 60));
      return Math.max(0, diffInMinutes);
    } catch (error) {
      return 0;
    }
  };

  const formatCookingTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPriorityFromOrder = (order) => {
    // Determine priority based on order age and type
    const elapsed = getTimeElapsed(order.kotTime);
    const isOverdue = elapsed > (order.estimatedTime || 15);
    
    if (isOverdue) return 'urgent';
    if (order.orderType === 'delivery') return 'urgent';
    return 'normal';
  };

  const printKot = (kot) => {
    // In a real application, this would trigger a printer
    console.log('Printing KOT:', kot.kotId || kot.id);
    alert(`Printing KOT ${kot.kotId || kot.id} to kitchen printer...`);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fef7f0' }}>
                <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 80px)' 
        }}>
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
            <p style={{ fontSize: '18px', color: '#6b7280', fontWeight: '600' }}>Loading kitchen orders...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && kotOrders.length === 0) {
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
              <FaReceipt size={40} style={{ color: '#ef4444' }} />
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
              Kitchen Order Tickets Ready! 🧾
            </h1>
            
            <p style={{ 
              fontSize: '18px', 
              color: '#374151', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Manage Your Kitchen Orders
            </p>
            
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280', 
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Set up your restaurant first, then start taking orders. Kitchen Order Tickets will appear here for your kitchen staff to prepare meals.
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
    <div style={{ minHeight: '100vh', backgroundColor: '#fef7f0' }}>
            
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: isClient && isMobile ? '12px 16px' : '20px 24px',
          borderBottom: '1px solid #fed7aa',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          overflow: 'hidden'
        }}>
          {isClient && isMobile ? (
            // Mobile Header Layout
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    background: 'linear-gradient(135deg, #f97316, #ea580c)', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <FaUtensils color="white" size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Kitchen Display
                    </h1>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {filteredOrders.length} orders{currentRestaurant?.name && ` • ${currentRestaurant.name}`}
                      {refreshing && <span style={{ color: '#f97316' }}> • Syncing...</span>}
                      {isPollingActive && <span style={{ color: '#10b981' }}> • Live ({pollCount})</span>}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => {
                      console.log('🔄 Manual refresh clicked');
                      loadKotData(false);
                    }}
                    style={{
                      padding: '6px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: '#3b82f6',
                      color: 'white'
                    }}
                    title="Manual Refresh"
                  >
                    <FaSync size={12} />
                  </button>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    style={{
                      padding: '6px',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: soundEnabled ? '#dcfce7' : '#f3f4f6',
                      color: soundEnabled ? '#166534' : '#6b7280'
                    }}
                  >
                    <FaBell size={12} />
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid #fed7aa',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: showMobileFilters ? '#f97316' : 'white',
                      color: showMobileFilters ? 'white' : '#f97316',
                      fontSize: '10px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}
                  >
                    <FaFilter size={10} />
                    Filter
                  </button>
                </div>
              </div>
              
              {/* Mobile Status Quick View */}
              <div style={{ 
                display: 'flex', 
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '2px',
                scrollBehavior: 'smooth',
                marginTop: '8px',
                minHeight: '32px', // Prevent height changes
                alignItems: 'center' // Center align
              }}>
                {[
                  { key: 'all', label: 'All', count: kotOrders.length },
                  { key: 'confirmed', label: 'New', count: kotOrders.filter(o => o.status === 'confirmed').length },
                  { key: 'preparing', label: 'Cooking', count: kotOrders.filter(o => o.status === 'preparing').length },
                  { key: 'ready', label: 'Ready', count: kotOrders.filter(o => o.status === 'ready').length },
                  { key: 'completed', label: 'Done', count: kotOrders.filter(o => o.status === 'completed').length }
                ].map((status) => (
                  <button
                    key={status.key}
                    onClick={() => setSelectedStatus(status.key)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '16px',
                      fontWeight: '600',
                      fontSize: '10px',
                      border: selectedStatus === status.key ? 'none' : '1px solid #fed7aa',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: selectedStatus === status.key ? '#f97316' : 'white',
                      color: selectedStatus === status.key ? 'white' : '#f97316',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      whiteSpace: 'nowrap',
                      minWidth: 'fit-content',
                      minHeight: '24px', // Prevent height changes
                      justifyContent: 'center' // Center content
                    }}
                  >
                    {status.label}
                    {status.count > 0 && (
                      <span style={{
                        backgroundColor: selectedStatus === status.key ? 'rgba(255,255,255,0.3)' : '#fed7aa',
                        color: selectedStatus === status.key ? 'white' : '#c2410c',
                        padding: '1px 3px',
                        borderRadius: '6px',
                        fontSize: '8px',
                        fontWeight: 'bold',
                        minWidth: '14px',
                        textAlign: 'center'
                      }}>
                        {status.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Desktop Header Layout
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    background: 'linear-gradient(135deg, #f97316, #ea580c)', 
                    borderRadius: '16px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
                  }}>
                    <FaUtensils color="white" size={24} />
                  </div>
                  <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                      Kitchen Display
                    </h1>
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                      {currentRestaurant?.name || 'Restaurant'} • {filteredOrders.length} orders in queue
                      {refreshing && <span style={{ color: '#f97316' }}> • Refreshing...</span>}
                      {isPollingActive && <span style={{ color: '#10b981' }}> • Live ({pollCount})</span>}
                    </p>
                  </div>
                </div>
                
                {/* Desktop Status Filter Tabs */}
                <div className="filter-container" style={{ 
                  display: 'flex', 
                  backgroundColor: '#fef7f0', 
                  borderRadius: '16px', 
                  padding: '4px',
                  border: '1px solid #fed7aa',
                  minHeight: '48px', // Prevent height changes
                  alignItems: 'center' // Center align to prevent vertical shifts
                }}>
                  {[
                    { key: 'all', label: 'All Orders', count: kotOrders.length },
                    { key: 'confirmed', label: 'Confirmed', count: kotOrders.filter(o => o.status === 'confirmed').length },
                    { key: 'preparing', label: 'Preparing', count: kotOrders.filter(o => o.status === 'preparing').length },
                    { key: 'ready', label: 'Ready', count: kotOrders.filter(o => o.status === 'ready').length },
                    { key: 'completed', label: 'Completed', count: kotOrders.filter(o => o.status === 'completed').length }
                  ].map((status) => (
                    <button
                      key={status.key}
                      onClick={() => setSelectedStatus(status.key)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '13px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: selectedStatus === status.key ? 'white' : 'transparent',
                        color: selectedStatus === status.key ? '#f97316' : '#6b7280',
                        boxShadow: selectedStatus === status.key ? '0 2px 6px rgba(0,0,0,0.1)' : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        minHeight: '32px', // Prevent height changes
                        minWidth: '80px', // Prevent width changes
                        justifyContent: 'center' // Center content
                      }}
                    >
                      {status.label}
                      {status.count > 0 && (
                        <span style={{
                          backgroundColor: selectedStatus === status.key ? '#fed7aa' : '#e5e7eb',
                          color: selectedStatus === status.key ? '#c2410c' : '#6b7280',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          fontSize: '11px',
                          fontWeight: 'bold'
                        }}>
                          {status.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={() => {
                    console.log('🔄 Manual refresh clicked (desktop)');
                    loadKotData(false);
                  }}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: '#3b82f6',
                    color: 'white'
                  }}
                  title="Manual Refresh"
                >
                  <FaSync size={16} />
                </button>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  style={{
                    padding: '10px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: soundEnabled ? '#dcfce7' : '#f3f4f6',
                    color: soundEnabled ? '#166534' : '#6b7280'
                  }}
                >
                  <FaBell size={16} />
                </button>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                    Kitchen Orders
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    Live • {new Date().toLocaleTimeString('en-IN', { hour12: true })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* KOT Grid */}
        <div style={{ flex: 1, padding: isClient && isMobile ? '16px' : '24px', overflowY: 'auto' }}>
          {filteredOrders.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: isClient && isMobile 
                ? '1fr' 
                : 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: isClient && isMobile ? '12px' : '16px'
            }}>
              {filteredOrders.map((kot) => {
                const timeElapsed = getTimeElapsed(kot.kotTime);
                const isOverdue = timeElapsed > kot.estimatedTime;
                const statusInfo = getStatusInfo(kot.status);
                const priorityInfo = getPriorityInfo(kot.priority);
                const typeInfo = getOrderTypeInfo(kot.orderType);
                const StatusIcon = statusInfo.icon;
                const TypeIcon = typeInfo.icon;
                
                return (
                  <div
                    key={kot.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      border: `2px solid ${kot.priority === 'urgent' ? '#ef4444' : '#fed7aa'}`,
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      ...(isOverdue && kot.status !== 'served' ? {
                        backgroundColor: '#fef2f2',
                        borderColor: '#ef4444',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
                      } : {})
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = isOverdue && kot.status !== 'served' 
                        ? '0 4px 12px rgba(239, 68, 68, 0.2)' 
                        : '0 4px 12px rgba(0,0,0,0.08)';
                    }}
                  >
                    {/* Compact Header */}
                    <div style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#fef7f0', 
                      borderBottom: '1px solid #fed7aa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(kot.id);
                            // Show copy notification
                            setNotification && setNotification({
                              type: 'success',
                              title: 'Copied! 📋',
                              message: `Order ID ${kot.id} copied to clipboard`,
                              show: true
                            });
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#1f2937',
                            fontSize: isClient && isMobile ? '14px' : '16px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#fed7aa';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                          }}
                          title="Click to copy Order ID"
                        >
                          #{kot.id.slice(-6)}
                        </button>
                        
                        {kot.tableNumber && (
                          <div style={{ fontSize: '12px', color: '#f97316', fontWeight: '600' }}>
                            Table {kot.tableNumber}
                          </div>
                        )}
                        
                        {(kot.waiterName || kot.waiter) && (
                          <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            {kot.waiterName || kot.waiter}
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{
                          padding: '2px 6px',
                          borderRadius: '12px',
                          fontSize: '9px',
                          fontWeight: '700',
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.text,
                          border: `1px solid ${statusInfo.border}`
                        }}>
                          {statusInfo.label}
                        </div>
                        
                        <div style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          color: isOverdue ? '#ef4444' : timeElapsed > kot.estimatedTime * 0.8 ? '#f59e0b' : '#10b981'
                        }}>
                          {timeElapsed}m
                          {isOverdue && <span style={{ marginLeft: '2px' }}>⚠️</span>}
                        </div>
                      </div>
                    </div>
                    
                    {/* Items List - Compact Menu Style */}
                    <div style={{ padding: '12px', backgroundColor: 'white' }}>
                      <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#6b7280', textAlign: 'center' }}>
                        {Array.isArray(kot.items) ? kot.items.length : 0} ITEM{(Array.isArray(kot.items) ? kot.items.length : 0) > 1 ? 'S' : ''} TO PREPARE
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {Array.isArray(kot.items) && kot.items.map((item, index) => {
                          // Check if this is an updated item
                          const isUpdatedItem = kot.updateHistory && kot.updateHistory.length > 0 && item.isUpdated;
                          const isNewItem = kot.updateHistory && kot.updateHistory.length > 0 && item.isNew;
                          
                          return (
                            <div key={index} style={{ 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '8px 10px',
                              backgroundColor: isNewItem ? '#f0fdf4' : isUpdatedItem ? '#fefce8' : '#f8fafc',
                              borderRadius: '6px',
                              borderLeft: isNewItem ? '3px solid #22c55e' : isUpdatedItem ? '3px solid #f59e0b' : '3px solid #e2e8f0',
                              position: 'relative'
                            }}>
                              {(isNewItem || isUpdatedItem) && (
                                <span style={{
                                  position: 'absolute',
                                  top: '2px',
                                  right: '2px',
                                  backgroundColor: isNewItem ? '#22c55e' : '#f59e0b',
                                  color: 'white',
                                  fontSize: '7px',
                                  fontWeight: 'bold',
                                  padding: '1px 3px',
                                  borderRadius: '3px'
                                }}>
                                  {isNewItem ? 'NEW' : 'UPD'}
                                </span>
                              )}
                              
                              {/* Quantity */}
                              <div style={{
                                fontSize: '16px',
                                fontWeight: 'bold',
                                color: '#f97316',
                                backgroundColor: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                minWidth: '32px',
                                textAlign: 'center',
                                border: '1px solid #fed7aa'
                              }}>
                                {item.quantity}
                              </div>
                              
                              {/* Item Name & Details */}
                              <div style={{ flex: 1, marginLeft: '10px' }}>
                                <div style={{
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  color: '#1f2937',
                                  marginBottom: '2px'
                                }}>
                                  {item.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {getSpiceIcon(item.spiceLevel)}
                                  {item.notes && (
                                    <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '500' }}>
                                      📝 {item.notes}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {/* Prep Time */}
                              <div style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#ef4444',
                                backgroundColor: '#fef2f2',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                border: '1px solid #fecaca',
                                minWidth: '28px',
                                textAlign: 'center'
                              }}>
                                {item.estimatedTime}m
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {kot.specialInstructions && (
                        <div style={{ 
                          padding: '12px', 
                          backgroundColor: '#fef3c7', 
                          border: '1px solid #fbbf24', 
                          borderRadius: '10px',
                          marginBottom: '16px'
                        }}>
                          <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                            <strong>⚠️ Special Instructions:</strong> {kot.specialInstructions}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Compact Actions */}
                    <div style={{ 
                      padding: '8px 12px', 
                      backgroundColor: '#f8fafc', 
                      borderTop: '1px solid #e2e8f0',
                      display: 'flex',
                      gap: '6px',
                      flexWrap: 'wrap',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => setSelectedKot(kot)}
                        style={{
                          backgroundColor: '#64748b',
                          color: 'white',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontWeight: '500',
                          fontSize: '11px',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <FaEye size={10} />
                        View
                      </button>
                      
                      {kot.status === 'confirmed' && (
                        <button
                          onClick={() => startCooking(kot.kotId, kot.id)}
                          style={{
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '13px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)'
                          }}
                        >
                          <FaPlay size={12} />
                          START COOKING
                        </button>
                      )}
                      
                      {kot.status === 'preparing' && (
                        <>
                          <div style={{
                            flex: isClient && isMobile ? '1 1 48%' : 1,
                            backgroundColor: '#dbeafe',
                            color: '#1e40af',
                            padding: isClient && isMobile ? '8px 12px' : '10px 16px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: isClient && isMobile ? '12px' : '13px',
                            border: '1px solid #3b82f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}>
                            <FaStopwatch size={isClient && isMobile ? 10 : 12} />
                            {formatCookingTime(timers[kot.id] || 0)}
                          </div>
                          <button
                            onClick={() => markReady(kot.kotId, kot.id)}
                            style={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              padding: '10px 16px',
                              borderRadius: '8px',
                              fontWeight: '700',
                              fontSize: '13px',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            <FaCheck size={12} />
                            READY
                          </button>
                        </>
                      )}
                      
                      {kot.status === 'ready' && (
                        <button
                          onClick={() => markServed(kot.kotId, kot.id)}
                          style={{
                            flex: isClient && isMobile ? '1 1 48%' : 1,
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            padding: isClient && isMobile ? '8px 12px' : '10px 16px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: isClient && isMobile ? '12px' : '13px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <FaCheckCircle size={isClient && isMobile ? 10 : 12} />
                          Served
                        </button>
                      )}
                      
                      {kot.status === 'served' && (
                        <button
                          onClick={() => markCompleted(kot.kotId, kot.id)}
                          style={{
                            flex: isClient && isMobile ? '1 1 48%' : 1,
                            backgroundColor: '#059669',
                            color: 'white',
                            padding: isClient && isMobile ? '8px 12px' : '10px 16px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: isClient && isMobile ? '12px' : '13px',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <FaClipboardCheck size={isClient && isMobile ? 10 : 12} />
                          Complete Order
                        </button>
                      )}
                      
                      <button
                        onClick={() => printKot(kot)}
                        style={{
                          backgroundColor: '#9ca3af',
                          color: 'white',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontWeight: '500',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px'
                        }}
                      >
                        <FaPrint size={10} />
                      </button>

                      {/* Delete button - only for admin/owner */}
                      {(userRole === 'admin' || userRole === 'owner') && (
                        <button
                          onClick={() => deleteOrder(kot.id, kot.id)}
                          style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            padding: '6px 8px',
                            borderRadius: '6px',
                            fontWeight: '500',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#b91c1c';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#dc2626';
                          }}
                        >
                          <FaTrash size={10} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
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
                  <FaReceipt size={40} style={{ color: '#ef4444' }} />
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
                  {selectedStatus === 'all' 
                    ? 'Kitchen Order Tickets Ready! 🧾'
                    : 'No KOTs found'
                  }
                </h3>
                
                <p style={{
                  fontSize: '18px',
                  color: '#374151',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  {selectedStatus === 'all' 
                    ? 'Manage Your Kitchen Orders'
                    : 'Try adjusting your filters'
                  }
                </p>
                
                <p style={{
                  color: '#6b7280',
                  marginBottom: '32px',
                  maxWidth: '500px',
                  margin: '0 auto 32px auto',
                  fontSize: '16px',
                  lineHeight: '1.6'
                }}>
                  {selectedStatus === 'all' 
                    ? 'Set up your restaurant first, then start taking orders. Kitchen Order Tickets will appear here for your kitchen staff to prepare meals.'
                    : 'Try adjusting your filters or clear them to see all KOTs.'
                  }
                </p>
                
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap'
                }}>
                  {selectedStatus === 'all' ? (
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
                  ) : (
                    <button
                      onClick={() => setSelectedStatus('all')}
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
      </div>

      {/* KOT Detail Modal */}
      {selectedKot && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: isClient && isMobile ? 'flex-end' : 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: isClient && isMobile ? '0' : '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: isClient && isMobile ? '20px 20px 0 0' : '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%',
            maxWidth: isClient && isMobile ? '100%' : '800px',
            maxHeight: isClient && isMobile ? '85vh' : '90vh',
            overflowY: 'auto',
            border: '1px solid #fed7aa',
            animation: isClient && isMobile ? 'slideUp 0.3s ease-out' : 'none'
          }}>
            <div style={{
              padding: isClient && isMobile ? '20px 16px' : '24px',
              borderBottom: '1px solid #f3f4f6',
              background: 'linear-gradient(135deg, #fef7f0, #fed7aa)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: isClient && isMobile ? '8px' : '12px' }}>
                  <div style={{
                    width: isClient && isMobile ? '32px' : '40px',
                    height: isClient && isMobile ? '32px' : '40px',
                    backgroundColor: '#f97316',
                    borderRadius: isClient && isMobile ? '8px' : '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <GiChefToque color="white" size={isClient && isMobile ? 14 : 18} />
                  </div>
                  <h2 style={{
                    fontSize: isClient && isMobile ? '18px' : '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    KOT Details - {selectedKot.id}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedKot(null)}
                  style={{
                    color: '#6b7280',
                    fontSize: isClient && isMobile ? '20px' : '24px',
                    fontWeight: 'bold',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div style={{ padding: isClient && isMobile ? '16px' : '24px' }}>
              {/* Order Info Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isClient && isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: isClient && isMobile ? '12px' : '16px', 
                marginBottom: isClient && isMobile ? '20px' : '24px' 
              }}>
                <div style={{ 
                  backgroundColor: '#fef7f0', 
                  padding: '16px', 
                  borderRadius: '12px',
                  border: '1px solid #fed7aa'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}>Order Info</h3>
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    <div><strong>Order ID:</strong> {selectedKot.orderId}</div>
                    <div><strong>KOT ID:</strong> {selectedKot.id}</div>
                    <div><strong>Type:</strong> {getOrderTypeInfo(selectedKot.orderType).label}</div>
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: '#fef7f0', 
                  padding: '16px', 
                  borderRadius: '12px',
                  border: '1px solid #fed7aa'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}>Customer</h3>
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                      <div><strong>Name:</strong> {selectedKot.customerName}</div>
                    {selectedKot.tableInfo ? (
                      <div><strong>Table:</strong> {selectedKot.tableInfo.floorName} - {selectedKot.tableInfo.number} ({selectedKot.tableInfo.capacity} seats)</div>
                    ) : selectedKot.tableNumber && (
                      <div><strong>Table:</strong> {selectedKot.tableNumber}</div>
                    )}
                    <div><strong>Waiter:</strong> {selectedKot.waiterName || selectedKot.waiter}</div>
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: '#fef7f0', 
                  padding: '16px', 
                  borderRadius: '12px',
                  border: '1px solid #fed7aa'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}>Timing</h3>
                  <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    <div><strong>Order:</strong> {formatTime(selectedKot.orderTime)}</div>
                    <div><strong>KOT:</strong> {formatTime(selectedKot.kotTime)}</div>
                    <div><strong>Estimated:</strong> {selectedKot.estimatedTime}m</div>
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: '#fef7f0', 
                  padding: '16px', 
                  borderRadius: '12px',
                  border: '1px solid #fed7aa'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px', fontSize: '14px' }}>Status</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(() => {
                      const statusInfo = getStatusInfo(selectedKot.status);
                      const priorityInfo = getPriorityInfo(selectedKot.priority);
                      return (
                        <>
                          <div style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: statusInfo.bg,
                            color: statusInfo.text,
                            border: `1px solid ${statusInfo.border}`,
                            textAlign: 'center'
                          }}>
                            {statusInfo.label}
                          </div>
                          <div style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: priorityInfo.bg,
                            color: priorityInfo.text,
                            border: `1px solid ${priorityInfo.border}`,
                            textAlign: 'center'
                          }}>
                            {priorityInfo.label}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              
              {/* Items Detail */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px', fontSize: '16px' }}>Order Items</h3>
                <div>
                  {Array.isArray(selectedKot.items) && selectedKot.items.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '16px', 
                      backgroundColor: '#fef7f0', 
                      borderRadius: '12px',
                      marginBottom: '12px',
                      border: '1px solid #fed7aa'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <span style={{ 
                            fontWeight: 'bold', 
                            fontSize: '16px',
                            backgroundColor: '#f97316',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            minWidth: '32px',
                            textAlign: 'center'
                          }}>
                            {item.quantity}x
                          </span>
                          <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px' }}>{item.name}</span>
                          {getSpiceIcon(item.spiceLevel)}
                          <span style={{ 
                            fontSize: '11px', 
                            color: '#6b7280', 
                            textTransform: 'uppercase', 
                            letterSpacing: '0.5px',
                            backgroundColor: '#e5e7eb',
                            padding: '2px 8px',
                            borderRadius: '6px'
                          }}>
                            {item.category}
                          </span>
                        </div>
                        {item.notes && (
                          <p style={{ fontSize: '14px', color: '#f59e0b', fontWeight: '500', margin: 0 }}>
                            📝 {item.notes}
                          </p>
                        )}
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>{item.estimatedTime}m</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>prep time</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedKot.specialInstructions && (
                <div style={{ 
                  backgroundColor: '#fef3c7', 
                  border: '1px solid #fbbf24', 
                  padding: '16px', 
                  borderRadius: '12px',
                  marginBottom: '24px'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#92400e', marginBottom: '8px', fontSize: '16px' }}>⚠️ Special Instructions</h3>
                  <p style={{ color: '#92400e', margin: 0 }}>{selectedKot.specialInstructions}</p>
                </div>
              )}
            </div>
            
            <div style={{ 
              padding: '24px', 
              backgroundColor: '#fef7f0', 
              display: 'flex', 
              gap: '12px',
              borderTop: '1px solid #fed7aa'
            }}>
              <button
                onClick={() => setSelectedKot(null)}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Close
              </button>
              <button
                onClick={() => printKot(selectedKot)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <FaPrint size={14} />
                Print KOT
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Notification for copy feedback */}
      <Notification
        show={notification.show}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ show: false })}
      />
    </div>
  );
};

export default KitchenOrderTicket;