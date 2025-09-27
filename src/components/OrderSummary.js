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
  onRemoveFromCart, 
  onAddToCart, 
  processing, 
  orderSuccess, 
  setOrderSuccess, 
  error, 
  getTotalAmount 
}) => {
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
        background: 'linear-gradient(135deg, #1f2937, #111827)', 
        padding: '12px', 
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
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
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
                        backgroundColor: item.category === 'veg' ? '#dcfce7' : '#fee2e2',
                        color: item.category === 'veg' ? '#166534' : '#dc2626'
                      }}>
                        {item.category === 'veg' ? 'V' : 'N'}
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
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}>
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      style={{
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ef4444',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '4px 0 0 4px',
                        cursor: 'pointer'
                      }}
                    >
                      <FaMinus size={8} />
                    </button>
                    <span style={{
                      width: '24px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      borderLeft: '1px solid #e5e7eb',
                      borderRight: '1px solid #e5e7eb',
                      fontSize: '10px',
                      backgroundColor: '#f9fafb'
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onAddToCart(item)}
                      style={{
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#10b981',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderRadius: '0 4px 4px 0',
                        cursor: 'pointer'
                      }}
                    >
                      <FaPlus size={8} />
                    </button>
                  </div>
                </div>
                
                <div style={{ 
                  fontSize: '10px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  textAlign: 'right',
                  paddingTop: '4px',
                  borderTop: '1px solid #e5e7eb'
                }}>
                  Subtotal: ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
          {/* Total */}
          <div style={{ padding: '20px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #1f2937, #111827)', 
              color: 'white', 
              padding: '20px', 
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Grand Total</span>
                <span style={{ fontSize: '28px', fontWeight: 'bold' }}>₹{getTotalAmount()}</span>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {orderSuccess?.show && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#dcfce7', 
              border: '2px solid #22c55e',
              borderRadius: '12px',
              margin: '0 20px 20px 20px',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: '#22c55e', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>
                  <FaCheckCircle size={20} style={{ color: 'white' }} />
                </div>
              </div>
              <div style={{ fontWeight: '700', color: '#166534', fontSize: '18px', marginBottom: '8px' }}>
                Order Complete!
              </div>
              <div style={{ fontSize: '14px', color: '#166534', marginBottom: '16px' }}>
                Order #{orderSuccess.orderId} processed successfully
              </div>
              <button
                onClick={() => {
                  setOrderSuccess(null);
                  onClearCart();
                }}
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  margin: '0 auto',
                  boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                }}
              >
                <FaPlus size={12} />
                Start New Order
              </button>
            </div>
          )}

          {/* Actions Section */}
          {!orderSuccess?.show && (
            <div style={{ padding: '20px' }}>
              {/* Payment Method Selection */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ 
                  fontSize: '14px', 
                  fontWeight: '700', 
                  color: '#1f2937', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaCreditCard size={14} />
                  Payment Method
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
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
                          padding: '12px 8px',
                          backgroundColor: isSelected ? '#22c55e' : 'white',
                          color: isSelected ? 'white' : '#6b7280',
                          border: isSelected ? '2px solid #22c55e' : '2px solid #e5e7eb',
                          borderRadius: '10px',
                          fontWeight: '600',
                          fontSize: '12px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 4px 12px rgba(34, 197, 94, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.05)'
                        }}
                      >
                        <Icon size={16} />
                        {method.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <button 
                  onClick={onSaveOrder}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  <FaSave size={12} />
                  SAVE
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
                    padding: '12px 16px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    minWidth: '100px',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)'
                  }}
                >
                  <FaTimes size={12} />
                  CLEAR
                </button>
              </div>

              {/* Complete Order Button */}
              <button 
                onClick={onProcessOrder}
                disabled={processing || cart.length === 0}
                style={{
                  width: '100%',
                  background: processing || cart.length === 0 
                    ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' 
                    : 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: 'white',
                  padding: '18px 24px',
                  borderRadius: '12px',
                  fontWeight: '800',
                  border: 'none',
                  cursor: processing || cart.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: processing || cart.length === 0 ? 'none' : '0 6px 20px rgba(34, 197, 94, 0.4)',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {processing ? (
                  <>
                    <FaSpinner size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <FaCheckCircle size={16} />
                    <span>COMPLETE ORDER</span>
                    <div style={{
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '800'
                    }}>
                      ₹{getTotalAmount()}
                    </div>
                  </>
                )}
              </button>

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
