'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Navigation';
import apiClient from '../../lib/api';
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

const Orders = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('dine_cart');
    localStorage.removeItem('dine_saved_order');
    router.push('/login');
  };

  // Fetch real orders from backend - NO MOCK DATA FALLBACK
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is authenticated
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Please log in to view orders');
          setLoading(false);
          return;
        }
        
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
          notes: order.notes,
          paymentMethod: order.paymentMethod || 'cash',
          staffInfo: order.staffInfo || null
        }));
        
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to fetch orders. Please ensure you are logged in and try again.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
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
      await apiClient.updateOrderStatus(orderId, newStatus);
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
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
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
        <Header handleLogout={handleLogout} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '16px', color: '#6b7280' }}>Loading orders...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Header handleLogout={handleLogout} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <FaExclamationTriangle size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
              Unable to load orders
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>{error}</div>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '16px',
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header handleLogout={handleLogout} />
      
      <div style={{ padding: '16px' }}>
        {/* Compact Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
              Orders
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              {filteredOrders.length} orders found
            </p>
          </div>
        </div>

        {/* Compact Filters */}
        <div style={{ 
          display: 'flex', 
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
        </div>

        {/* Compact Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                  borderRadius: '8px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
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
                      {order.paymentMethod || 'cash'} • {order.staffInfo?.role || 'waiter'}
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
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && !loading && !error && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: 'white',
            borderRadius: '8px',
            border: '1px solid #e5e7eb'
          }}>
            <FaUtensils size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151', margin: '0 0 8px 0' }}>
              No orders found
            </h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
              {searchTerm || selectedStatus !== 'all' || selectedType !== 'all' 
                ? 'Try adjusting your filters.' 
                : 'Orders will appear here once customers place them.'}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal - Compact */}
      {selectedOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                  Order {selectedOrder.id}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{
                    color: '#6b7280',
                    fontSize: '20px',
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

            {/* Modal Content */}
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Customer</div>
                <div style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937' }}>{selectedOrder.customerName}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>{selectedOrder.phone}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Items</div>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}>
                    <div>
                      <span style={{ fontWeight: '500' }}>{item.quantity}x</span> {item.name}
                    </div>
                    <div style={{ fontWeight: '500' }}>₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              {/* Staff & Payment Info */}
              {selectedOrder.staffInfo && (
                <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>Order Taken By</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                        {selectedOrder.staffInfo.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {selectedOrder.staffInfo.role} • Payment: {selectedOrder.paymentMethod}
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
                borderTop: '2px solid #e5e7eb'
              }}>
                <span style={{ fontSize: '16px', fontWeight: '600' }}>Total</span>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937' }}>₹{selectedOrder.total}</span>
              </div>

              {selectedOrder.notes && (
                <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', color: '#92400e' }}><strong>Notes:</strong> {selectedOrder.notes}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;