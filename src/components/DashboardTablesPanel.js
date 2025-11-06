'use client';

import { useMemo, useState } from 'react';
import { FaEye, FaReceipt, FaTimes, FaMinus, FaChevronUp, FaWindowMaximize } from 'react-icons/fa';
import apiClient from '../lib/api';
import OrderSummary from './OrderSummary';

const statusStyles = {
  available: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  serving: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  // occupied: switch to yellow theme
  occupied: { bg: '#fef9c3', text: '#92400e', border: '#fde68a' },
  // reserved: switch to blue theme
  reserved: { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  'out-of-service': { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
  maintenance: { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' }
};

export default function DashboardTablesPanel({
  floors = [],
  tables = [],
  isRefreshing = false,
  onTakeOrder,
  onViewOrder,
  selectedRestaurant,
  onSliderClose,
  // OrderSummary props
  cart,
  setCart,
  orderType,
  setOrderType,
  paymentMethod,
  setPaymentMethod,
  onClearCart,
  onProcessOrder,
  onSaveOrder,
  onPlaceOrder,
  onRemoveFromCart,
  onAddToCart,
  onUpdateCartItemQuantity,
  onTableNumberChange,
  onCustomerNameChange,
  onCustomerMobileChange,
  processing,
  placingOrder,
  orderSuccess,
  setOrderSuccess,
  error,
  getTotalAmount,
  tableNumber,
  customerName,
  customerMobile,
  orderLookup,
  setOrderLookup,
  currentOrder,
  setCurrentOrder,
  onShowQRCode,
  restaurantName,
  taxSettings,
  menuItems
}) {
  const [sliderOpen, setSliderOpen] = useState(false);
  const [sliderMinimized, setSliderMinimized] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [orderError, setOrderError] = useState(null);
  // Prefer floor.tables if present; fall back to flat tables prop
  const grouped = useMemo(() => {
    let allGroups = [];
    if (Array.isArray(floors) && floors.length > 0 && floors.some(f => Array.isArray(f.tables))) {
      allGroups = floors.map(f => ({ info: { id: f.id, name: f.name || f.floorName || 'Floor' }, tables: f.tables || [] }));
    } else {
      // Group flat tables by floor
      const byFloor = {};
      floors.forEach(f => { byFloor[f.id || f.name || 'default'] = { info: { name: f.name || 'Floor' }, tables: [] }; });
      (tables || []).forEach(t => {
        const key = t.floorId || t.floor || t.floorName || 'default';
        if (!byFloor[key]) byFloor[key] = { info: { name: t.floorName || t.floor || 'Floor' }, tables: [] };
        byFloor[key].tables.push(t);
      });
      allGroups = Object.values(byFloor);
    }
    // Filter out floors with no tables
    return allGroups.filter(group => group.tables && group.tables.length > 0);
  }, [floors, tables]);

  const handleViewOrderClick = async (orderId, table) => {
    if (sliderOpen && selectedOrder?.id === orderId && !sliderMinimized) {
      // If clicking the same order and slider is open (not minimized), close the slider
      handleSliderClose();
      setCurrentOrder(null);
      setCart([]);
      return;
    }

    if (!orderId || !selectedRestaurant?.id) return;

    setLoadingOrder(true);
    setOrderError(null);
    setSliderOpen(true);
    // If slider was minimized, restore it
    if (sliderMinimized) {
      setSliderMinimized(false);
    }

    try {
      const response = await apiClient.getOrders(selectedRestaurant.id, {
        search: orderId,
        limit: 1
      });

      if (response.orders && response.orders.length > 0) {
        const order = response.orders[0];
        setSelectedOrder(order);
        
        // Convert order items to cart format
        const cartItems = (order.items || []).map(item => ({
          id: item.menuItemId || item.id,
          name: item.name,
          price: item.price || 0,
          quantity: item.quantity || 1,
          selectedVariant: item.selectedVariant,
          selectedCustomizations: item.selectedCustomizations,
          basePrice: item.basePrice || item.price || 0,
          cartId: `${item.menuItemId || item.id}-${Date.now()}-${Math.random()}`
        }));
        
        setCart(cartItems);
        setCurrentOrder(order);
        
        // Set order details
        if (order.tableNumber) {
          onTableNumberChange(order.tableNumber);
        }
        if (order.orderType) {
          setOrderType(order.orderType);
        }
        if (order.paymentMethod) {
          setPaymentMethod(order.paymentMethod);
        }
        if (order.customerInfo) {
          if (order.customerInfo.name) {
            onCustomerNameChange(order.customerInfo.name);
          }
          if (order.customerInfo.phone) {
            onCustomerMobileChange(order.customerInfo.phone);
          }
        }
      } else {
        setOrderError('Order not found');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setOrderError('Failed to load order details');
    } finally {
      setLoadingOrder(false);
    }
  };

  const closeSlider = () => {
    setSliderOpen(false);
    setSliderMinimized(false);
    setSelectedOrder(null);
    setOrderError(null);
    // Don't clear cart or currentOrder here - let user decide
  };

  // Expose close function to parent via callback
  const handleSliderClose = () => {
    closeSlider();
    if (onSliderClose) {
      onSliderClose();
    }
  };

  const minimizeSlider = () => {
    setSliderMinimized(true);
  };

  const restoreSlider = () => {
    setSliderMinimized(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 24px', maxWidth: '100%' }}>
      <style jsx>{`
        @keyframes tableSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes slideUpBottom {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      {grouped.map((group, idx) => (
        <div key={idx} style={{ background: '#fff', border: grouped.length > 1 ? '1px solid #e5e7eb' : 'none', borderRadius: '12px' }}>
          {grouped.length > 1 && (
            <div style={{
              padding: '10px 12px',
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ fontWeight: 700, color: '#1f2937' }}>{group.info?.name || `Floor ${idx + 1}`}</div>
              {isRefreshing && (
                <div style={{ fontSize: '11px', color: '#6b7280' }}>Refreshing…</div>
              )}
            </div>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '24px',
            padding: '20px'
          }}>
            {(group.tables || []).map((t, tIdx) => {
              const st = statusStyles[t.status] || statusStyles.available;
              const isOccupied = (t.status === 'occupied');
              const isReserved = (t.status === 'reserved');
              const isBooked = isOccupied || isReserved;
              const occupiedBorderColor = '#f59e0b';
              return (
                <div key={t.id || tIdx}
                  style={{
                    position: 'relative',
                    background: st.bg,
                    border: `${isOccupied ? '1px solid transparent' : '1px solid ' + st.border}`,
                    borderRadius: '12px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '8px',
                    height: '130px',
                    minHeight: '130px',
                    maxHeight: '130px',
                    width: '100%',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease',
                    overflow: 'visible',
                    boxSizing: 'border-box'
                  }}>
                  {isOccupied && (
                    <svg
                      viewBox="0 0 300 200"
                      preserveAspectRatio="none"
                      style={{
                        position: 'absolute',
                        inset: '-6px',
                        width: 'calc(100% + 12px)',
                        height: 'calc(100% + 12px)',
                        pointerEvents: 'none',
                        overflow: 'visible',
                        zIndex: 1
                      }}
                    >
                      <rect
                        x="1.5"
                        y="1.5"
                        width="297"
                        height="197"
                        rx="12"
                        ry="12"
                        fill="none"
                        stroke={occupiedBorderColor}
                        strokeWidth="2.5"
                        strokeDasharray="5,5"
                        strokeDashoffset="100"
                      >
                        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
                      </rect>
                    </svg>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, color: '#111827', fontSize: '16px', flex: 1 }}>{t.name || t.number}</div>
                    <div style={{ fontSize: '9px', color: st.text, fontWeight: 700, background: st.bg, borderRadius: '999px', padding: '3px 8px', border: `1px solid ${st.border}`, whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {t.status || 'available'}
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 500, flexShrink: 0 }}>Seats: {t.capacity || '-'}</div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: 'auto', flexShrink: 0, minHeight: '28px' }}>
                    {isOccupied && t.currentOrderId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrderClick(t.currentOrderId, t);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: sliderOpen && selectedOrder?.id === t.currentOrderId ? '#d97706' : '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(245, 158, 11, 0.3)',
                          zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#d97706';
                          e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = sliderOpen && selectedOrder?.id === t.currentOrderId ? '#d97706' : '#f59e0b';
                          e.target.style.transform = 'scale(1)';
                        }}
                        title={sliderOpen && selectedOrder?.id === t.currentOrderId ? "Close Order" : "View Order"}
                      >
                        <FaReceipt size={10} />
                      </button>
                    )}
                    {isReserved && t.currentOrderId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onViewOrder) {
                            onViewOrder(t.currentOrderId, t);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          flexShrink: 0,
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(59, 130, 246, 0.3)'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#2563eb';
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#3b82f6';
                          e.target.style.transform = 'scale(1)';
                        }}
                        title="View Order"
                      >
                        <FaEye size={12} />
                      </button>
                    )}
                    {(t.status === 'available' || t.status === 'serving') ? (
                      <button
                        onClick={() => {
                          // Close slider if open when taking new order
                          if (sliderOpen) {
                            handleSliderClose();
                          }
                          if (onTakeOrder) {
                            onTakeOrder(t.name || t.number);
                          }
                        }}
                        style={{
                          flex: 1,
                          background: t.status === 'available' ? '#22c55e' : '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '9px',
                          fontWeight: 600,
                          padding: '4px 8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(34, 197, 94, 0.2)',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 8px rgba(34, 197, 94, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 2px 4px rgba(34, 197, 94, 0.2)';
                        }}
                      >
                        {t.status === 'available' ? 'TAKE ORDER' : 'ADD ITEMS'}
                      </button>
                    ) : isBooked && !t.currentOrderId ? (
                      <div style={{ flex: 1, height: '28px', borderRadius: '8px', visibility: 'hidden' }} />
                    ) : null}
                  </div>
                </div>
              );
            })}
            {(!group.tables || group.tables.length === 0) && (
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>No tables on this floor.</div>
            )}
          </div>
        </div>
      ))}
      {grouped.length === 0 && (
        <div style={{ textAlign: 'center', color: '#9ca3af', padding: '12px' }}>No floors/tables found.</div>
      )}

      {/* Order Summary Slider */}
      {sliderOpen && (
        <div
          style={{
            position: 'fixed',
            top: sliderMinimized ? 'auto' : 0,
            bottom: sliderMinimized ? 0 : 'auto',
            right: 0,
            width: sliderMinimized ? '300px' : '600px',
            maxWidth: sliderMinimized ? '90vw' : '90vw',
            height: sliderMinimized ? '60px' : '100vh',
            background: '#ffffff',
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            animation: sliderMinimized ? 'slideUpBottom 0.3s ease' : 'slideInRight 0.3s ease',
            overflow: 'hidden',
            borderRadius: sliderMinimized ? '12px 12px 0 0' : '0',
            cursor: sliderMinimized ? 'default' : 'default'
          }}
        >
            {/* Header */}
            <div style={{
              padding: sliderMinimized ? '8px 12px' : '8px 12px',
              borderBottom: sliderMinimized ? 'none' : '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f9fafb',
              flexShrink: 0,
              height: sliderMinimized ? '100%' : 'auto',
              minHeight: sliderMinimized ? '60px' : 'auto'
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (sliderMinimized) {
                restoreSlider();
              }
            }}
            >
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: sliderMinimized ? '12px' : '14px', fontWeight: 600, color: '#111827', lineHeight: '1.2' }}>
                  {sliderMinimized ? 'Order Details' : 'Order Details'}
                </h3>
                {selectedOrder && !sliderMinimized && (
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#6b7280', lineHeight: '1.2' }}>
                    Order #{selectedOrder.orderNumber || selectedOrder.id}
                  </p>
                )}
                {selectedOrder && sliderMinimized && (
                  <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#6b7280', lineHeight: '1.2' }}>
                    #{selectedOrder.orderNumber || selectedOrder.id} • {cart?.length || 0} items • ₹{getTotalAmount ? getTotalAmount().toFixed(2) : '0.00'}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {sliderMinimized ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      restoreSlider();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b7280',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f3f4f6';
                      e.target.style.color = '#111827';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#6b7280';
                    }}
                    title="Maximize"
                  >
                    <FaWindowMaximize size={12} />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      minimizeSlider();
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b7280',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#f3f4f6';
                      e.target.style.color = '#111827';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#6b7280';
                    }}
                    title="Minimize"
                  >
                    <FaMinus size={12} />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSliderClose();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#f3f4f6';
                    e.target.style.color = '#111827';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#6b7280';
                  }}
                  title="Close"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>

            {/* Content - OrderSummary Component */}
            {!sliderMinimized && (
              <div style={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
              >
                {loadingOrder ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                    <div style={{ fontSize: '14px' }}>Loading order details...</div>
                  </div>
                ) : orderError ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#ef4444' }}>
                    <div style={{ fontSize: '14px' }}>{orderError}</div>
                  </div>
                ) : selectedOrder ? (
                  <OrderSummary
                    cart={cart}
                    setCart={setCart}
                    orderType={orderType}
                    setOrderType={setOrderType}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    onClearCart={onClearCart}
                    onProcessOrder={onProcessOrder}
                    onSaveOrder={onSaveOrder}
                    onPlaceOrder={onPlaceOrder}
                    onRemoveFromCart={onRemoveFromCart}
                    onAddToCart={onAddToCart}
                    onUpdateCartItemQuantity={onUpdateCartItemQuantity}
                    onTableNumberChange={onTableNumberChange}
                    onCustomerNameChange={onCustomerNameChange}
                    onCustomerMobileChange={onCustomerMobileChange}
                    processing={processing}
                    placingOrder={placingOrder}
                    orderSuccess={orderSuccess}
                    setOrderSuccess={setOrderSuccess}
                    error={error}
                    getTotalAmount={getTotalAmount}
                    tableNumber={tableNumber}
                    customerName={customerName}
                    customerMobile={customerMobile}
                    orderLookup={orderLookup}
                    setOrderLookup={setOrderLookup}
                    currentOrder={currentOrder}
                    setCurrentOrder={setCurrentOrder}
                    onShowQRCode={onShowQRCode}
                    restaurantId={selectedRestaurant?.id}
                    restaurantName={restaurantName}
                    taxSettings={taxSettings}
                    menuItems={menuItems}
                    onClose={handleSliderClose}
                  />
                ) : null}
              </div>
            )}
          </div>
      )}
    </div>
  );
}


