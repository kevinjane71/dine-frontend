'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
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
  FaShoppingBag
} from 'react-icons/fa';

const KitchenOrderTicket = () => {
  const [kotOrders, setKotOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedKot, setSelectedKot] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock KOT data - replace with real data from API
  useEffect(() => {
    const mockKotOrders = [
      {
        id: 'KOT-001',
        orderId: 'ORD-001',
        tableNumber: '12',
        customerName: 'Rahul Sharma',
        orderType: 'dine-in',
        items: [
          { id: 1, name: 'Butter Chicken', quantity: 2, spiceLevel: 'medium', notes: 'Extra gravy', category: 'main-course', estimatedTime: 15 },
          { id: 2, name: 'Garlic Naan', quantity: 4, spiceLevel: 'mild', notes: '', category: 'bread', estimatedTime: 8 },
          { id: 3, name: 'Mango Lassi', quantity: 2, spiceLevel: 'mild', notes: 'Less sugar', category: 'beverages', estimatedTime: 3 }
        ],
        status: 'pending',
        priority: 'normal',
        orderTime: '2024-01-15T19:30:00',
        kotTime: '2024-01-15T19:32:00',
        estimatedTime: 18,
        specialInstructions: 'Customer is allergic to nuts',
        waiter: 'Amit Kumar'
      },
      {
        id: 'KOT-002',
        orderId: 'ORD-002',
        tableNumber: null,
        customerName: 'Priya Patel',
        orderType: 'delivery',
        items: [
          { id: 4, name: 'Veg Biryani', quantity: 1, spiceLevel: 'medium', notes: 'Extra raita', category: 'main-course', estimatedTime: 20 },
          { id: 5, name: 'Papad', quantity: 2, spiceLevel: 'mild', notes: 'Roasted not fried', category: 'starters', estimatedTime: 5 }
        ],
        status: 'preparing',
        priority: 'urgent',
        orderTime: '2024-01-15T19:15:00',
        kotTime: '2024-01-15T19:17:00',
        estimatedTime: 25,
        specialInstructions: 'Pack separately for delivery',
        waiter: 'Delivery Team'
      },
      {
        id: 'KOT-003',
        orderId: 'ORD-003',
        tableNumber: '5',
        customerName: 'Amit Kumar',
        orderType: 'dine-in',
        items: [
          { id: 6, name: 'Paneer Tikka', quantity: 1, spiceLevel: 'hot', notes: 'Well done', category: 'starters', estimatedTime: 12 },
          { id: 7, name: 'Dal Makhani', quantity: 1, spiceLevel: 'medium', notes: '', category: 'main-course', estimatedTime: 10 },
          { id: 8, name: 'Tandoori Roti', quantity: 3, spiceLevel: 'mild', notes: '', category: 'bread', estimatedTime: 6 }
        ],
        status: 'ready',
        priority: 'normal',
        orderTime: '2024-01-15T18:45:00',
        kotTime: '2024-01-15T18:47:00',
        estimatedTime: 15,
        specialInstructions: '',
        waiter: 'Sunita Sharma'
      },
      {
        id: 'KOT-004',
        orderId: 'ORD-004',
        tableNumber: null,
        customerName: 'Sneha Gupta',
        orderType: 'pickup',
        items: [
          { id: 9, name: 'Chicken Wings', quantity: 2, spiceLevel: 'hot', notes: 'Extra spicy sauce', category: 'starters', estimatedTime: 15 },
          { id: 10, name: 'Cold Coffee', quantity: 1, spiceLevel: 'mild', notes: 'No ice', category: 'beverages', estimatedTime: 3 }
        ],
        status: 'served',
        priority: 'normal',
        orderTime: '2024-01-15T20:00:00',
        kotTime: '2024-01-15T20:02:00',
        estimatedTime: 18,
        specialInstructions: 'Call customer when ready: +91-9123456789',
        waiter: 'Pickup Counter'
      }
    ];
    setKotOrders(mockKotOrders);
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
      }
    };
    return statusMap[status] || statusMap.pending;
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

  const updateKotStatus = (kotId, newStatus) => {
    setKotOrders(orders => orders.map(order => 
      order.id === kotId ? { ...order, status: newStatus } : order
    ));
    
    // Play notification sound if enabled
    if (soundEnabled && newStatus === 'ready') {
      // In a real app, you'd play a sound here
      console.log('🔔 Order ready notification sound');
    }
  };

  const filteredOrders = kotOrders.filter(order => {
    return selectedStatus === 'all' || order.status === selectedStatus;
  });

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeElapsed = (kotTime) => {
    const now = new Date();
    const kotDate = new Date(kotTime);
    const diffInMinutes = Math.floor((now - kotDate) / (1000 * 60));
    return diffInMinutes;
  };

  const printKot = (kot) => {
    // In a real application, this would trigger a printer
    console.log('Printing KOT:', kot.id);
    alert(`Printing KOT ${kot.id} to kitchen printer...`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fef7f0' }}>
      <Navigation />
      
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px 24px',
          borderBottom: '1px solid #fed7aa',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}>
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
                    Live order tracking • {filteredOrders.length} orders in queue
                  </p>
                </div>
              </div>
              
              {/* Status Filter Tabs */}
              <div style={{ 
                display: 'flex', 
                backgroundColor: '#fef7f0', 
                borderRadius: '16px', 
                padding: '4px',
                border: '1px solid #fed7aa'
              }}>
                {[
                  { key: 'all', label: 'All Orders', count: kotOrders.length },
                  { key: 'pending', label: 'Pending', count: kotOrders.filter(o => o.status === 'pending').length },
                  { key: 'preparing', label: 'Preparing', count: kotOrders.filter(o => o.status === 'preparing').length },
                  { key: 'ready', label: 'Ready', count: kotOrders.filter(o => o.status === 'ready').length }
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
                      gap: '6px'
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
        </div>

        {/* KOT Grid */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {filteredOrders.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: '20px'
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
                    {/* KOT Header */}
                    <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{kot.id}</h3>
                          <div style={{
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '700',
                            backgroundColor: priorityInfo.bg,
                            color: priorityInfo.text,
                            border: `1px solid ${priorityInfo.border}`
                          }}>
                            {priorityInfo.label}
                          </div>
                        </div>
                        <div style={{
                          padding: '6px 12px',
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
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
                        <div>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ color: '#6b7280' }}>Order:</span>
                            <span style={{ fontWeight: '600', color: '#1f2937', marginLeft: '6px' }}>{kot.orderId}</span>
                          </div>
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ color: '#6b7280' }}>Customer:</span>
                            <span style={{ fontWeight: '600', color: '#1f2937', marginLeft: '6px' }}>{kot.customerName}</span>
                          </div>
                        </div>
                        <div>
                          {kot.tableNumber ? (
                            <div style={{ marginBottom: '4px' }}>
                              <span style={{ color: '#6b7280' }}>Table:</span>
                              <span style={{ fontWeight: '600', color: '#1f2937', marginLeft: '6px' }}>{kot.tableNumber}</span>
                            </div>
                          ) : (
                            <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <TypeIcon size={12} style={{ color: typeInfo.color }} />
                              <span style={{ fontWeight: '600', color: '#1f2937' }}>{typeInfo.label}</span>
                            </div>
                          )}
                          <div style={{ marginBottom: '4px' }}>
                            <span style={{ color: '#6b7280' }}>Waiter:</span>
                            <span style={{ fontWeight: '600', color: '#1f2937', marginLeft: '6px' }}>{kot.waiter}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        marginTop: '12px', 
                        paddingTop: '12px', 
                        borderTop: '1px solid #f3f4f6'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaClock style={{ color: '#9ca3af', fontSize: '12px' }} />
                          <span style={{ fontSize: '13px', color: '#6b7280' }}>
                            KOT: {formatTime(kot.kotTime)}
                          </span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: isOverdue ? '#ef4444' : timeElapsed > kot.estimatedTime * 0.8 ? '#f59e0b' : '#10b981'
                        }}>
                          <FaStopwatch size={12} />
                          {timeElapsed}m / {kot.estimatedTime}m
                          {isOverdue && <FaExclamationTriangle size={12} />}
                        </div>
                      </div>
                    </div>
                    
                    {/* Items List */}
                    <div style={{ padding: '20px' }}>
                      <h4 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '16px', fontSize: '15px' }}>
                        Items ({kot.items.length})
                      </h4>
                      <div style={{ marginBottom: '16px' }}>
                        {kot.items.map((item, index) => (
                          <div key={index} style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            padding: '10px 12px', 
                            backgroundColor: '#fef7f0', 
                            borderRadius: '10px',
                            marginBottom: '8px',
                            border: '1px solid #fed7aa'
                          }}>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ 
                                  fontWeight: 'bold', 
                                  color: '#1f2937',
                                  backgroundColor: 'white',
                                  padding: '2px 6px',
                                  borderRadius: '6px',
                                  fontSize: '12px'
                                }}>
                                  {item.quantity}x
                                </span>
                                <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>{item.name}</span>
                                {getSpiceIcon(item.spiceLevel)}
                              </div>
                              {item.notes && (
                                <p style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '500', margin: '0 0 2px 0' }}>
                                  📝 {item.notes}
                                </p>
                              )}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ 
                                  fontSize: '10px', 
                                  color: '#6b7280', 
                                  textTransform: 'uppercase', 
                                  letterSpacing: '0.5px',
                                  backgroundColor: '#e5e7eb',
                                  padding: '2px 6px',
                                  borderRadius: '4px'
                                }}>
                                  {item.category}
                                </span>
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>{item.estimatedTime}m</div>
                              <div style={{ fontSize: '10px', color: '#9ca3af' }}>prep time</div>
                            </div>
                          </div>
                        ))}
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
                    
                    {/* Actions */}
                    <div style={{ 
                      padding: '16px 20px', 
                      backgroundColor: '#fef7f0', 
                      borderTop: '1px solid #fed7aa',
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => setSelectedKot(kot)}
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
                      
                      {kot.status === 'pending' && (
                        <button
                          onClick={() => updateKotStatus(kot.id, 'preparing')}
                          style={{
                            flex: 1,
                            backgroundColor: '#f59e0b',
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
                          <FaPlay size={12} />
                          Start Cooking
                        </button>
                      )}
                      
                      {kot.status === 'preparing' && (
                        <button
                          onClick={() => updateKotStatus(kot.id, 'ready')}
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
                          Mark Ready
                        </button>
                      )}
                      
                      {kot.status === 'ready' && (
                        <button
                          onClick={() => updateKotStatus(kot.id, 'served')}
                          style={{
                            flex: 1,
                            backgroundColor: '#8b5cf6',
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
                          <FaCheckCircle size={12} />
                          Served
                        </button>
                      )}
                      
                      <button
                        onClick={() => printKot(kot)}
                        style={{
                          backgroundColor: '#6b7280',
                          color: 'white',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FaPrint size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
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
                marginBottom: '16px'
              }}>
                <FaUtensils size={32} style={{ color: '#d1d5db' }} />
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#374151',
                margin: '0 0 8px 0'
              }}>
                No orders in kitchen
              </h3>
              <p style={{
                color: '#6b7280',
                margin: 0,
                textAlign: 'center',
                maxWidth: '400px',
                fontSize: '14px'
              }}>
                {selectedStatus === 'all' 
                  ? 'Kitchen orders will appear here when customers place orders.'
                  : `No orders with ${selectedStatus} status found.`
                }
              </p>
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
            maxWidth: '800px',
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
                    backgroundColor: '#f97316',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaChefHat color="white" size={18} />
                  </div>
                  <h2 style={{
                    fontSize: '24px',
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
              {/* Order Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
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
                    {selectedKot.tableNumber && (
                      <div><strong>Table:</strong> {selectedKot.tableNumber}</div>
                    )}
                    <div><strong>Waiter:</strong> {selectedKot.waiter}</div>
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
                  {selectedKot.items.map((item, index) => (
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
    </div>
  );
};

export default KitchenOrderTicket;