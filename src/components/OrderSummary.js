'use client';

import { 
  FaShoppingCart, 
  FaTimes, 
  FaUtensils, 
  FaMinus, 
  FaPlus, 
  FaCreditCard, 
  FaMoneyBillWave, 
  FaSave, 
  FaCheckCircle, 
  FaSpinner 
} from 'react-icons/fa';

const OrderSummary = ({ 
  cart, 
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
  onTableNumberChange,
  processing, 
  placingOrder,
  orderSuccess, 
  setOrderSuccess, 
  error, 
  getTotalAmount,
  tableNumber,
  orderLookup,
  setOrderLookup,
  currentOrder,
  setCurrentOrder
}) => {
  // Debug logging
  console.log('OrderSummary orderSuccess:', orderSuccess);
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      backgroundColor: 'white', 
      borderLeft: '2px solid #e5e7eb', 
      display: 'flex', 
      flexDirection: 'column',
      boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.08)'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)', 
        padding: '16px', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
        borderRadius: '5px'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100px',
          height: '100px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(30px, -30px)'
        }} />
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: '8px',
          position: 'relative',
          zIndex: 2
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <FaShoppingCart size={14} />
            </div>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>
                Order Summary
              </h2>
              <p style={{ fontSize: '10px', margin: '2px 0 0 0', opacity: 0.8 }}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </p>
            </div>
          </div>
          
          <button
            onClick={onClearCart}
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              padding: '4px 8px',
              color: 'white',
              fontSize: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backdropFilter: 'blur(10px)'
            }}
          >
            <FaTimes size={8} />
            Clear
          </button>
        </div>
        
        {/* Order Type Selector */}
        <div style={{ display: 'flex', gap: '4px', position: 'relative', zIndex: 2 }}>
          <button
            onClick={() => setOrderType('dine-in')}
            style={{
              flex: 1,
              backgroundColor: orderType === 'dine-in' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              padding: '6px 8px',
              fontSize: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              backdropFilter: 'blur(10px)'
            }}
          >
            🍽️ DINE IN
          </button>
          <button
            onClick={() => setOrderType('takeaway')}
            style={{
              flex: 1,
              backgroundColor: orderType === 'takeaway' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              padding: '6px 8px',
              fontSize: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              backdropFilter: 'blur(10px)'
            }}
          >
            📦 TAKEAWAY
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '8px',
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 transparent'
      }}>
        {cart.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            paddingTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <FaUtensils size={16} color="#9ca3af" />
            </div>
            <div>
              <h3 style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 4px 0' }}>
                No Items Added
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '10px', margin: 0 }}>
                Add items from the menu
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {cart.map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '8px', 
                  padding: '8px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ 
                      fontWeight: 'bold', 
                      color: '#1f2937', 
                      margin: '0 0 2px 0', 
                      fontSize: '12px', 
                      lineHeight: '1.3' 
                    }}>
                      {item.name}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontSize: '10px', 
                          fontWeight: '600', 
                          color: '#6b7280' 
                        }}>
                          Subtotal: ₹{item.price * item.quantity}
                        </span>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: 'bold', 
                          color: '#ef4444' 
                        }}>
                          ₹{item.price}
                        </span>
                        <div style={{
                          padding: '1px 4px',
                          borderRadius: '4px',
                          fontSize: '6px',
                          fontWeight: 'bold',
                          backgroundColor: (item.isVeg === true || item.category === 'veg') ? '#dcfce7' : '#fee2e2',
                          color: (item.isVeg === true || item.category === 'veg') ? '#166534' : '#dc2626'
                        }}>
                          {(item.isVeg === true || item.category === 'veg') ? 'V' : 'N'}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    backgroundColor: 'white', 
                    borderRadius: '6px', 
                    border: '1px solid #e5e7eb',
                    marginLeft: '8px',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    gap: '2px'
                  }}>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '4px 0 0 4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#fef2f2';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FaMinus size={10} />
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 1;
                        if (newQuantity > 0) {
                          // Update quantity directly
                          const currentItem = cart.find(cartItem => cartItem.id === item.id);
                          if (currentItem) {
                            const diff = newQuantity - currentItem.quantity;
                            if (diff > 0) {
                              for (let i = 0; i < diff; i++) {
                                onAddToCart(item);
                              }
                            } else if (diff < 0) {
                              for (let i = 0; i < Math.abs(diff); i++) {
                                onRemoveFromCart(item.id);
                              }
                            }
                          }
                        }
                      }}
                      onBlur={(e) => {
                        // Ensure minimum quantity of 1
                        if (parseInt(e.target.value) < 1) {
                          e.target.value = 1;
                          const currentItem = cart.find(cartItem => cartItem.id === item.id);
                          if (currentItem && currentItem.quantity !== 1) {
                            const diff = 1 - currentItem.quantity;
                            if (diff > 0) {
                              for (let i = 0; i < diff; i++) {
                                onAddToCart(item);
                              }
                            } else if (diff < 0) {
                              for (let i = 0; i < Math.abs(diff); i++) {
                                onRemoveFromCart(item.id);
                              }
                            }
                          }
                        }
                      }}
                      style={{
                        width: '40px',
                        height: '24px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        border: 'none',
                        fontSize: '11px',
                        backgroundColor: '#f9fafb',
                        outline: 'none',
                        borderRadius: '0'
                      }}
                    />
                    <button
                      onClick={() => onAddToCart(item)}
                      style={{
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#10b981',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '0 4px 4px 0',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f0fdf4';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                      }}
                    >
                      <FaPlus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Message - Show regardless of cart state */}
      {orderSuccess?.show && (
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#dcfce7', 
          border: '2px solid #22c55e',
          borderRadius: '12px',
          margin: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#22c55e', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              animation: 'bounce 1s infinite'
            }}>
              <FaCheckCircle size={16} style={{ color: 'white' }} />
            </div>
            <div style={{ fontWeight: '800', color: '#166534', fontSize: '16px' }}>
              {orderSuccess.message || 'Order Complete! ✅'}
            </div>
          </div>
          <div style={{ fontSize: '14px', color: '#166534', marginBottom: '12px', fontWeight: '600' }}>
            Order #{orderSuccess.orderId} {orderSuccess.message?.includes('placed') ? 'sent to kitchen' : 'billing completed'}
          </div>
          <div style={{ fontSize: '12px', color: '#166534', marginBottom: '16px' }}>
            {orderSuccess.message?.includes('placed') 
              ? 'Your order has been sent to the kitchen for preparation' 
              : 'Payment processed successfully. Thank you for your order!'
            }
          </div>
          <button
            onClick={() => {
              setOrderSuccess(null);
              onClearCart();
            }}
            style={{
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              margin: '0 auto',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(34, 197, 94, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.4)';
            }}
          >
            <FaPlus size={10} />
            Start New Order
          </button>
        </div>
      )}

      {/* Footer */}
      {cart.length > 0 && (
        <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          {/* Total */}
          <div style={{ padding: '12px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)', 
              color: 'white', 
              padding: '12px', 
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Grand Total</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>₹{getTotalAmount()}</span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          {!orderSuccess?.show && (
            <div style={{ padding: '20px' }}>
              {/* Table Number Input */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px'
                }}>
                  <label style={{ 
                    fontSize: '11px', 
                    fontWeight: '600', 
                    color: '#374151',
                    minWidth: '50px'
                  }}>
                    Table:
                  </label>
                  <input
                    type="text"
                    placeholder="Optional"
                    value={tableNumber || ''}
                    style={{
                      width: '80px',
                      padding: '4px 6px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                      fontSize: '11px',
                      outline: 'none',
                      backgroundColor: '#f9fafb'
                    }}
                    onChange={(e) => {
                      if (typeof onTableNumberChange === 'function') {
                        onTableNumberChange(e.target.value);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '700', 
                  color: '#1f2937', 
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <FaCreditCard size={12} />
                  Payment Method
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'cash', label: 'Cash', icon: FaMoneyBillWave },
                    { id: 'upi', label: 'UPI', icon: FaCreditCard },
                    { id: 'card', label: 'Card', icon: FaCreditCard }
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        style={{
                          flex: 1,
                          padding: '8px 6px',
                          backgroundColor: isSelected ? '#ef4444' : 'white',
                          color: isSelected ? 'white' : '#6b7280',
                          border: isSelected ? '1px solid #ef4444' : '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '10px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 2px 6px rgba(239, 68, 68, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <Icon size={12} />
                        {method.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Workflow Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {/* First Row - Save and Place Order */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={onSaveOrder}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)'
                    }}
                  >
                    <FaSave size={10} />
                    SAVE ORDER
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (typeof onPlaceOrder === 'function') {
                        onPlaceOrder();
                      }
                    }}
                    disabled={placingOrder || cart.length === 0}
                    style={{
                      flex: 1,
                      background: placingOrder || cart.length === 0
                        ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' 
                        : 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: placingOrder || cart.length === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      transition: 'all 0.2s',
                      boxShadow: placingOrder || cart.length === 0 ? 'none' : '0 2px 8px rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    {placingOrder ? (
                      <>
                        <FaSpinner size={10} style={{ animation: 'spin 1s linear infinite' }} />
                        PLACING...
                      </>
                    ) : (
                      <>
                        <FaUtensils size={10} />
                        PLACE ORDER
                      </>
                    )}
                  </button>
                </div>

                {/* Second Row - Complete Billing and Clear */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={onProcessOrder}
                    disabled={processing || cart.length === 0}
                    style={{
                      flex: 1,
                      background: processing || cart.length === 0 
                        ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' 
                        : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: processing || cart.length === 0 ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      transition: 'all 0.2s',
                      boxShadow: processing || cart.length === 0 ? 'none' : '0 2px 8px rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    {processing ? (
                      <>
                        <FaSpinner size={10} style={{ animation: 'spin 1s linear infinite' }} />
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle size={10} />
                        COMPLETE BILLING
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear this order?')) {
                        onClearCart();
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                      color: 'white',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      minWidth: '80px',
                      transition: 'all 0.2s',
                      boxShadow: '0 2px 8px rgba(107, 114, 128, 0.3)'
                    }}
                  >
                    <FaTimes size={10} />
                    CLEAR
                  </button>
                </div>
              </div>


              {/* Error Message */}
              {error && (
                <div style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px',
                  color: '#dc2626',
                  fontWeight: '600',
                  marginTop: '12px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
