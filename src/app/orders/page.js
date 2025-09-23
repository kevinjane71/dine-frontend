'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import apiClient from '../../lib/api';
import { 
  FaEye, 
  FaEdit, 
  FaCheck, 
  FaClock, 
  FaUtensils, 
  FaSearch,
  FaFilter,
  FaPrint,
  FaDownload,
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaHashtag,
  FaClipboardList,
  FaTruck,
  FaHome,
  FaShoppingBag,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use hardcoded restaurant ID for now - should come from auth context
        const restaurantId = 'vsPjRhR9pRZDwzv4MxvL';
        
        const response = await apiClient.getOrders(restaurantId);
        
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
          notes: order.notes
        }));
        
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please try again.');
        // Fall back to empty array instead of mock data
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { 
        bg: '#fef3c7', 
        text: '#92400e', 
        label: 'Pending',
        icon: FaClock,
        border: '#fbbf24'
      },
      confirmed: { 
        bg: '#dbeafe', 
        text: '#1e40af', 
        label: 'Confirmed',
        icon: FaCheckCircle,
        border: '#3b82f6'
      },
      preparing: { 
        bg: '#fed7aa', 
        text: '#c2410c', 
        label: 'Preparing',
        icon: FaUtensils,
        border: '#f97316'
      },
      ready: { 
        bg: '#dcfce7', 
        text: '#166534', 
        label: 'Ready',
        icon: FaCheck,
        border: '#22c55e'
      },
      served: { 
        bg: '#f3f4f6', 
        text: '#374151', 
        label: 'Served',
        icon: FaCheckCircle,
        border: '#6b7280'
      },
      cancelled: { 
        bg: '#fecaca', 
        text: '#991b1b', 
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
        bg: '#e9d5ff', 
        text: '#7c2d12', 
        label: 'Dine In',
        icon: FaHome,
        border: '#a855f7'
      },
      'delivery': { 
        bg: '#dbeafe', 
        text: '#1e40af', 
        label: 'Delivery',
        icon: FaTruck,
        border: '#3b82f6'
      },
      'pickup': { 
        bg: '#dcfce7', 
        text: '#166534', 
        label: 'Pickup',
        icon: FaShoppingBag,
        border: '#22c55e'
      }
    };
    return typeMap[type] || typeMap['dine-in'];
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiClient.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesType = selectedType === 'all' || order.type === selectedType;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeElapsed = (orderTime) => {
    const now = new Date();
    const orderDate = new Date(orderTime);
    const diffInMinutes = Math.floor((now - orderDate) / (1000 * 60));
    return diffInMinutes;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fef7f0' }}>
      <Navigation />
      
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '24px',
          border: '1px solid #fed7aa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                <FaClipboardList color="white" size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                  Order Management
                </h1>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                  Track and manage all restaurant orders • {filteredOrders.length} orders
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
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
                gap: '8px',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}>
                <FaPrint size={14} />
                Print KOT
              </button>
              <button style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
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
                gap: '8px',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <FaDownload size={14} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid #fed7aa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
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
                placeholder="Search orders by ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '40px',
                  paddingRight: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#fef7f0',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#f59e0b';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#fef7f0';
                }}
              />
            </div>
            
            {/* Status Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFilter style={{ color: '#6b7280', fontSize: '14px' }} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#fef7f0',
                  color: '#374151',
                  fontWeight: '500',
                  minWidth: '140px'
                }}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="served">Served</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              style={{
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#fef7f0',
                color: '#374151',
                fontWeight: '500',
                minWidth: '140px'
              }}
            >
              <option value="all">All Types</option>
              <option value="dine-in">Dine In</option>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>

            {/* Quick Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                  {orders.length}
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                  Total Orders
                </div>
              </div>
              <div style={{ width: '1px', height: '30px', backgroundColor: '#e5e7eb' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>
                  {orders.filter(o => o.status === 'preparing').length}
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                  In Kitchen
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '20px',
            border: '1px solid #fed7aa'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #fed7aa',
              borderTop: '4px solid #f59e0b',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }} />
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              Loading orders...
            </h3>
            <p style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '14px'
            }}>
              Please wait while we fetch your orders.
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '20px',
            border: '1px solid #fecaca'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#fef2f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FaExclamationTriangle size={32} style={{ color: '#ef4444' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              Error loading orders
            </h3>
            <p style={{
              color: '#6b7280',
              margin: '0 0 16px 0',
              fontSize: '14px'
            }}>
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders Grid */}
        {!loading && !error && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: '20px'
          }}>
            {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const typeInfo = getTypeInfo(order.type);
            const timeElapsed = getTimeElapsed(order.orderTime);
            const StatusIcon = statusInfo.icon;
            const TypeIcon = typeInfo.icon;

            return (
              <div key={order.id} style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid #fed7aa',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}>
                {/* Order Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{order.id}</h3>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.text,
                        border: `1px solid ${statusInfo.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <StatusIcon size={10} />
                        {statusInfo.label}
                      </div>
                      <div style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        backgroundColor: typeInfo.bg,
                        color: typeInfo.text,
                        border: `1px solid ${typeInfo.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <TypeIcon size={10} />
                        {typeInfo.label}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaClock style={{ color: '#9ca3af', fontSize: '12px' }} />
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>{formatTime(order.orderTime)}</span>
                      <span style={{ 
                        fontSize: '11px', 
                        color: timeElapsed > 30 ? '#ef4444' : '#6b7280',
                        fontWeight: '500'
                      }}>
                        ({timeElapsed}m ago)
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FaUser style={{ color: '#9ca3af', fontSize: '12px' }} />
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>{order.customerName}</span>
                    </div>
                    
                    {order.tableNumber && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaHashtag style={{ color: '#9ca3af', fontSize: '12px' }} />
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Table {order.tableNumber}</span>
                      </div>
                    )}
                    
                    {order.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaPhone style={{ color: '#9ca3af', fontSize: '12px' }} />
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>{order.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Order Items */}
                <div style={{ padding: '20px' }}>
                  <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '12px', fontSize: '14px' }}>
                    Items ({order.items.length})
                  </h4>
                  <div style={{ marginBottom: '16px' }}>
                    {order.items.map((item, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        paddingBottom: '6px',
                        borderBottom: index < order.items.length - 1 ? '1px solid #f3f4f6' : 'none',
                        marginBottom: index < order.items.length - 1 ? '6px' : '0'
                      }}>
                        <span style={{ fontSize: '13px', color: '#374151' }}>
                          <span style={{ fontWeight: '600' }}>{item.quantity}x</span> {item.name}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  
                  {order.notes && (
                    <div style={{ 
                      backgroundColor: '#fef3c7', 
                      padding: '8px 12px', 
                      borderRadius: '8px', 
                      marginBottom: '16px',
                      border: '1px solid #fbbf24'
                    }}>
                      <p style={{ fontSize: '12px', color: '#92400e', margin: 0 }}>
                        <strong>Notes:</strong> {order.notes}
                      </p>
                    </div>
                  )}
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    fontWeight: 'bold', 
                    fontSize: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid #f3f4f6'
                  }}>
                    <span style={{ color: '#374151' }}>Total:</span>
                    <span style={{ color: '#ef4444', fontSize: '18px' }}>₹{order.total}</span>
                  </div>
                </div>
                
                {/* Actions */}
                <div style={{ 
                  padding: '16px 20px', 
                  backgroundColor: '#fef7f0', 
                  display: 'flex', 
                  gap: '8px',
                  borderTop: '1px solid #fed7aa'
                }}>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      flex: 1,
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaEye size={12} />
                    View
                  </button>
                  
                  {order.status !== 'served' && order.status !== 'cancelled' && (
                    <button
                      onClick={() => {
                        const statusFlow = {
                          pending: 'confirmed',
                          confirmed: 'preparing',
                          preparing: 'ready',
                          ready: 'served'
                        };
                        updateOrderStatus(order.id, statusFlow[order.status]);
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: '13px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <FaCheck size={12} />
                      Next Stage
                    </button>
                  )}

                  {timeElapsed > 45 && order.status !== 'served' && (
                    <div style={{
                      padding: '8px',
                      backgroundColor: '#fecaca',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FaExclamationTriangle style={{ color: '#dc2626', fontSize: '14px' }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        )}

        {!loading && !error && filteredOrders.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '20px',
            border: '1px solid #fed7aa'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#fef7f0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FaClipboardList size={32} style={{ color: '#d1d5db' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              No orders found
            </h3>
            <p style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '14px'
            }}>
              Orders will appear here when customers place them.
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #fed7aa'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #f3f4f6',
              background: 'linear-gradient(135deg, #fef7f0, #fed7aa)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#f59e0b',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaClipboardList color="white" size={18} />
                  </div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Order Details - {selectedOrder.id}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    color: '#6b7280',
                    fontSize: '24px',
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
            
            <div style={{ padding: '24px' }}>
              {/* Order Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ 
                  backgroundColor: '#fef7f0', 
                  padding: '16px', 
                  borderRadius: '12px',
                  border: '1px solid #fed7aa'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '12px', fontSize: '16px' }}>Order Information</h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '4px' }}><strong>Order ID:</strong> {selectedOrder.id}</div>
                    <div style={{ marginBottom: '4px' }}><strong>Time:</strong> {formatTime(selectedOrder.orderTime)}</div>
                    <div style={{ marginBottom: '4px' }}><strong>Type:</strong> {getTypeInfo(selectedOrder.type).label}</div>
                    {selectedOrder.tableNumber && (
                      <div style={{ marginBottom: '4px' }}><strong>Table:</strong> {selectedOrder.tableNumber}</div>
                    )}
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: '#fef7f0', 
                  padding: '16px', 
                  borderRadius: '12px',
                  border: '1px solid #fed7aa'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '12px', fontSize: '16px' }}>Customer Information</h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '4px' }}><strong>Name:</strong> {selectedOrder.customerName}</div>
                    {selectedOrder.phone && (
                      <div style={{ marginBottom: '4px' }}><strong>Phone:</strong> {selectedOrder.phone}</div>
                    )}
                    {selectedOrder.address && (
                      <div style={{ marginBottom: '4px' }}><strong>Address:</strong> {selectedOrder.address}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Items */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px', fontSize: '16px' }}>Order Items</h3>
                <div>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '12px 16px', 
                      backgroundColor: '#fef7f0', 
                      borderRadius: '10px',
                      marginBottom: '8px',
                      border: '1px solid #fed7aa'
                    }}>
                      <div>
                        <span style={{ fontWeight: '600', fontSize: '15px' }}>{item.name}</span>
                        <span style={{ color: '#6b7280', marginLeft: '8px', fontSize: '14px' }}>x{item.quantity}</span>
                      </div>
                      <span style={{ fontWeight: '600', fontSize: '15px' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  fontWeight: 'bold', 
                  fontSize: '20px',
                  marginTop: '16px', 
                  paddingTop: '16px', 
                  borderTop: '2px solid #fed7aa'
                }}>
                  <span style={{ color: '#374151' }}>Total Amount:</span>
                  <span style={{ color: '#ef4444' }}>₹{selectedOrder.total}</span>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '8px', fontSize: '16px' }}>Special Instructions</h3>
                  <div style={{ 
                    backgroundColor: '#fef3c7', 
                    padding: '12px', 
                    borderRadius: '10px',
                    border: '1px solid #fbbf24'
                  }}>
                    <p style={{ color: '#92400e', margin: 0 }}>{selectedOrder.notes}</p>
                  </div>
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
                onClick={() => setSelectedOrder(null)}
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
              <button style={{
                flex: 1,
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
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
              }}>
                <FaPrint size={14} />
                Print KOT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;