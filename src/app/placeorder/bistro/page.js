'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaSpinner, FaLock, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import apiClient from '../../../lib/api';
import dynamic from 'next/dynamic';

// Dynamically load the bistro book menu (CSS 3D)
const BistroBookMenu = dynamic(() => import('./BistroBookMenu'), { ssr: false });

// Try to import Firebase modules with error handling
let firebaseAuth = null;
let firebaseConfig = null;

try {
  firebaseAuth = require('firebase/auth');
  firebaseConfig = require('../../../../firebase');
  console.log('✅ Firebase modules loaded successfully');
} catch (error) {
  console.warn('⚠️ Firebase modules not available:', error.message);
}

const PlaceOrderBistroContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ phone: '', seatNumber: '', name: '' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [currentSheet, setCurrentSheet] = useState(0); // two categories per sheet

  const restaurantId = searchParams.get('restaurant') || 'default';
  const seatNumber = searchParams.get('seat') || '';

  useEffect(() => {
    setCustomerInfo((prev) => ({ ...prev, seatNumber }));
  }, [seatNumber]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getPublicMenu(restaurantId);
        if (response.success && response.restaurant && response.menu) {
          setRestaurant(response.restaurant);
          setMenu(response.menu);
          const uniqueCategories = [...new Set(response.menu.map((i) => i.category).filter(Boolean))];
          setCategories(uniqueCategories);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        setError(apiError.message || 'Failed to load restaurant menu.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [restaurantId]);

  // Cart helpers
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      return [...prev, { ...item, quantity: 1 }];
    });
  };
  const removeFromCart = (id) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i));
      }
      return prev.filter((i) => i.id !== id);
    });
  };
  const getCartTotal = () => cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const getCartItemCount = () => cart.reduce((t, i) => t + i.quantity, 0);

  // OTP flow
  const sendOtp = async () => {
    if (!customerInfo.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    try {
      setSendingOtp(true);
      setError('');
      if (!firebaseAuth || !firebaseConfig) throw new Error('Firebase modules not available');
      const { signInWithPhoneNumber, RecaptchaVerifier } = firebaseAuth;
      const { auth, isFirebaseConfigured } = firebaseConfig;
      if (!isFirebaseConfigured || !isFirebaseConfigured()) throw new Error('Firebase not configured - using demo mode');

      let phoneNumber = customerInfo.phone.trim();
      if (!phoneNumber.startsWith('+')) phoneNumber = '+91' + phoneNumber;

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}
      }
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
      await window.recaptchaVerifier.render();
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setVerificationId(confirmationResult);
      setOtpSent(true);
      setShowOtpModal(true);
    } catch (err) {
      setError(`Failed to send OTP: ${err.message}`);
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      setSendingOtp(true);
      setError('');
      if (verificationId === 'demo-verification-id') {
        if (otp === '123456') {
          await placeOrderWithVerification('demo-firebase-uid');
          setOtpSent(false);
          setShowOtpModal(false);
          setOtp('');
          setSendingOtp(false);
          return;
        }
        setError('Invalid OTP. Use 123456 for demo.');
        setSendingOtp(false);
        return;
      }
      const result = await verificationId.confirm(otp);
      const user = result.user;
      await placeOrderWithVerification(user.uid);
      setOtpSent(false);
      setShowOtpModal(false);
      setOtp('');
    } catch (err) {
      setError(`Invalid OTP: ${err.message}`);
    } finally {
      setSendingOtp(false);
    }
  };

  const placeOrder = async () => {
    if (!customerInfo.phone.trim()) {
      setError('Phone number is required');
      return;
    }
    if (cart.length === 0) {
      setError('Please add items to cart');
      return;
    }
    setError('');
    setSendingOtp(true);
    await sendOtp();
  };

  const placeOrderWithVerification = async (firebaseUid) => {
    try {
      setPlacingOrder(true);
      setError('');
      const orderData = {
        customerPhone: customerInfo.phone.trim(),
        customerName: customerInfo.name.trim() || 'Customer',
        seatNumber: customerInfo.seatNumber.trim() || 'Walk-in',
        items: cart.map((i) => ({
          menuItemId: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          shortCode: i.shortCode,
        })),
        totalAmount: getCartTotal(),
        notes: `Customer self-order from seat ${customerInfo.seatNumber || 'Walk-in'}`,
        otp: 'verified',
        verificationId: firebaseUid,
      };
      await apiClient.placePublicOrder(restaurantId, orderData);
      setSuccess('Order placed successfully! Your order will be prepared shortly.');
      setCart([]);
      setCustomerInfo({ phone: '', seatNumber: customerInfo.seatNumber, name: '' });
      setShowOtpModal(false);
      setShowCart(false);
      setOtpSent(false);
      setOtp('');
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0f0f',
          color: '#fff',
          gap: '12px',
        }}
      >
        <FaSpinner size={32} style={{ animation: 'spin 1s linear infinite' }} />
        Loading menu...
      </div>
    );
  }

  const totalSheets = Math.max(1, Math.ceil(categories.length / 2));

  return (
    <div style={{ minHeight: '100vh', position: 'relative', backgroundColor: '#0f0f0f' }}>
      {/* Header removed to maximize menu space */}

      {/* Main */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 0 80px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '75vh',
            position: 'relative',
          }}
        >
          <Suspense
            fallback={
              <div style={{ color: 'white', textAlign: 'center' }}>
                <FaSpinner size={36} style={{ animation: 'spin 1s linear infinite' }} />
                <p>Loading book...</p>
              </div>
            }
          >
            <BistroBookMenu
              categories={categories}
              menu={menu}
              currentSheet={currentSheet}
              onSheetChange={setCurrentSheet}
              onAddToCart={addToCart}
            />
          </Suspense>

          {/* External Controls */}
          {totalSheets > 1 && (
            <div
              style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => setCurrentSheet((s) => Math.max(0, s - 1))}
                disabled={currentSheet === 0}
                style={{
                  background: currentSheet === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.16)',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: currentSheet === 0 ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                }}
              >
                Prev
              </button>
              <div
                style={{
                  background: 'rgba(0,0,0,0.55)',
                  color: '#fff',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.25)',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                }}
              >
                Page {currentSheet + 1} / {totalSheets}
              </div>
              <button
                onClick={() => setCurrentSheet((s) => Math.min(totalSheets - 1, s + 1))}
                disabled={currentSheet === totalSheets - 1}
                style={{
                  background:
                    currentSheet === totalSheets - 1
                      ? 'rgba(255,255,255,0.08)'
                      : 'linear-gradient(135deg,#f59e0b,#d97706)',
                  color: currentSheet === totalSheets - 1 ? '#ddd' : '#1f1b12',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: currentSheet === totalSheets - 1 ? 'not-allowed' : 'pointer',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.35)',
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCart(false);
          }}
        >
          <div
            style={{
              backgroundColor: '#181818',
              width: '100%',
              maxHeight: '85vh',
              borderTopLeftRadius: '20px',
              borderTopRightRadius: '20px',
              boxShadow: '0 -10px 30px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 20px 12px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: '#0f0f0f',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                  Your Order ({getCartItemCount()} items)
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowCart(false)}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#fff',
                    }}
                  >
                    <FaTimes size={14} />
                  </button>
                  <button
                    onClick={() => setCart([])}
                    style={{
                      background: 'rgba(239, 68, 68, 0.18)',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#ef4444',
                    }}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fff',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: 600 }}>Total: ₹{getCartTotal().toFixed(2)}</span>
                <span style={{ fontSize: '12px', color: '#fca5a5' }}>{getCartItemCount()} items</span>
              </div>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#fff' }}>
                  <FaShoppingCart size={48} color="#ef4444" style={{ opacity: 0.5, marginBottom: '16px' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px 0' }}>Your cart is empty</h3>
                  <p style={{ fontSize: '13px', margin: 0, opacity: 0.7 }}>Add some delicious items to get started</p>
                </div>
              ) : (
                <div style={{ padding: '16px 0', color: '#fff' }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        marginBottom: '8px',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#fff', margin: '0 0 2px 0' }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '12px', color: '#ef4444', margin: 0 }}>₹{item.price} each</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#fff',
                          }}
                        >
                          <FaMinus size={10} />
                        </button>
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#fff',
                            minWidth: '20px',
                            textAlign: 'center',
                          }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          style={{
                            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'white',
                          }}
                        >
                          <FaPlus size={10} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkout */}
            {cart.length > 0 && (
              <div
                style={{
                  padding: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.08)',
                  backgroundColor: '#0f0f0f',
                  color: '#fff',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    padding: '16px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px 0' }}>Contact Information</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#fca5a5', marginBottom: '6px' }}>
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        placeholder="Enter phone number"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '2px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          fontSize: '13px',
                          outline: 'none',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#fca5a5', marginBottom: '6px' }}>
                        Table / Seat
                      </label>
                      <input
                        type="text"
                        value={customerInfo.seatNumber}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, seatNumber: e.target.value })}
                        placeholder="Table/Seat number"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '2px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px',
                          fontSize: '13px',
                          outline: 'none',
                          backgroundColor: 'rgba(255,255,255,0.05)',
                          color: '#fff',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={placingOrder || !customerInfo.phone.trim() || sendingOtp}
                  style={{
                    width: '100%',
                    background:
                      placingOrder || !customerInfo.phone.trim() || sendingOtp
                        ? 'rgba(255,255,255,0.2)'
                        : 'linear-gradient(135deg, #ef4444, #b91c1c)',
                    color: 'white',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: placingOrder || !customerInfo.phone.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  {placingOrder ? (
                    <>
                      <FaSpinner size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Processing Order...
                    </>
                  ) : sendingOtp ? (
                    <>
                      <FaSpinner size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <FaLock size={16} />
                      Place Order - ₹{getCartTotal().toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 220,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '350px',
              width: '100%',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <FaLock size={32} color="#ef4444" style={{ marginBottom: '12px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 6px 0' }}>Verify Your Phone</h2>
              <p style={{ fontSize: '13px', margin: 0, opacity: 0.8 }}>We&apos;ve sent a 6-digit code to {customerInfo.phone}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  fontSize: '16px',
                  textAlign: 'center',
                  outline: 'none',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  boxSizing: 'border-box',
                  letterSpacing: '2px',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpSent(false);
                  setOtp('');
                }}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                disabled={sendingOtp || otp.length !== 6}
                style={{
                  flex: 1,
                  background:
                    sendingOtp || otp.length !== 6
                      ? 'rgba(255,255,255,0.2)'
                      : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: sendingOtp || otp.length !== 6 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {sendingOtp ? (
                  <>
                    <FaSpinner size={12} style={{ animation: 'spin 1s linear infinite' }} />
                    Verifying...
                  </>
                ) : (
                  'Verify & Place Order'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div id="recaptcha-container" style={{ display: 'none' }}></div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const PlaceOrderBistroPage = () => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f0f0f',
            color: '#fff',
          }}
        >
          <FaSpinner size={40} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      }
    >
      <PlaceOrderBistroContent />
    </Suspense>
  );
};

export default PlaceOrderBistroPage;

