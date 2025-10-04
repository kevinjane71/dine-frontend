'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch, FaShoppingCart, FaPlus, FaMinus, FaTrash, FaArrowLeft, FaPhone, FaChair, FaUtensils, FaLeaf, FaDrumstickBite, FaSpinner, FaLock } from 'react-icons/fa';
import apiClient from '../../lib/api.js';

const PlaceOrderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State variables
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    phone: '',
    seatNumber: '',
    name: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [verificationId, setVerificationId] = useState(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  
  // Derived values
  const restaurantId = searchParams.get('restaurant') || 'default';
  const seatNumber = searchParams.get('seat') || '';

  // Initialize customer info from URL params
  useEffect(() => {
    setCustomerInfo(prev => ({
      ...prev,
      seatNumber
    }));
  }, [seatNumber]);

  // Load restaurant data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Mock data for testing
        const mockRestaurant = {
          id: restaurantId,
          name: 'Dino Restaurant',
          description: 'Delicious food and great service'
        };
        
        const mockMenu = [
          {
            id: '1',
            name: 'Margherita Pizza',
            description: 'Classic tomato and mozzarella pizza',
            price: 299,
            category: 'Pizza',
            isVeg: true,
            shortCode: 'MP',
            spiceLevel: 'Mild',
            available: true
          },
          {
            id: '2',
            name: 'Chicken Burger',
            description: 'Juicy chicken patty with fresh vegetables',
            price: 199,
            category: 'Burgers',
            isVeg: false,
            shortCode: 'CB',
            spiceLevel: 'Medium',
            available: true
          },
          {
            id: '3',
            name: 'Caesar Salad',
            description: 'Fresh lettuce with caesar dressing',
            price: 149,
            category: 'Salads',
            isVeg: true,
            shortCode: 'CS',
            spiceLevel: 'Mild',
            available: true
          },
          {
            id: '4',
            name: 'Pasta Carbonara',
            description: 'Creamy pasta with bacon and cheese',
            price: 249,
            category: 'Pasta',
            isVeg: false,
            shortCode: 'PC',
            spiceLevel: 'Mild',
            available: true
          },
          {
            id: '5',
            name: 'Chocolate Cake',
            description: 'Rich chocolate cake with vanilla ice cream',
            price: 179,
            category: 'Desserts',
            isVeg: true,
            shortCode: 'CC',
            spiceLevel: 'Sweet',
            available: true
          }
        ];
        
        // Try to load from API first, fallback to mock data
        try {
          const response = await apiClient.getPublicMenu(restaurantId);
          setRestaurant(response.restaurant);
          setMenu(response.menu);
          
          // Extract categories
          const uniqueCategories = [...new Set(response.menu.map(item => item.category))];
          setCategories(['all', ...uniqueCategories]);
        } catch (apiError) {
          console.log('API not available, using mock data:', apiError.message);
          setRestaurant(mockRestaurant);
          setMenu(mockMenu);
          
          // Extract categories from mock data
          const uniqueCategories = [...new Set(mockMenu.map(item => item.category))];
          setCategories(['all', ...uniqueCategories]);
        }
        
      } catch (err) {
        console.error('Error loading restaurant data:', err);
        setError('Failed to load restaurant menu. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [restaurantId]);

  // Cart functions
  const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prev.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prev.filter(item => item.id !== itemId);
      }
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Filter menu
  const filteredMenu = menu.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedMenu = categories.reduce((acc, category) => {
    if (category === 'all') return acc;
    
    const categoryItems = filteredMenu.filter(item => item.category === category);
    if (categoryItems.length > 0) {
      acc[category] = categoryItems;
    }
    return acc;
  }, {});

  // OTP functions
  const sendOtp = async () => {
    if (!customerInfo.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    try {
      setSendingOtp(true);
      setError('');

      // Simulate OTP sending
      setTimeout(() => {
        setVerificationId('simulated-verification-id');
        setOtpSent(true);
        setShowOtpModal(true);
        setSendingOtp(false);
      }, 1000);
      
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(`Failed to send OTP: ${err.message}`);
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

      // Simulate OTP verification
      setTimeout(async () => {
        setOtpSent(false);
        setShowOtpModal(false);
        setOtp('');
        setSendingOtp(false);
        // Proceed to place order
        await placeOrderWithVerification('simulated-firebase-uid');
      }, 1000);
      
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError(`Invalid OTP: ${err.message}`);
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

    // Start OTP verification process
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
        items: cart.map(item => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          shortCode: item.shortCode
        })),
        totalAmount: getCartTotal(),
        notes: `Customer self-order from seat ${customerInfo.seatNumber || 'Walk-in'}`,
        otp: 'verified',
        verificationId: firebaseUid
      };

      const response = await apiClient.placePublicOrder(restaurantId, orderData);
      
      setSuccess('Order placed successfully! Your order will be prepared shortly.');
      setCart([]);
      setCustomerInfo({ phone: '', seatNumber: customerInfo.seatNumber, name: '' });
      
      // Redirect after 3 seconds
      setTimeout(() => {
        router.push('/');
      }, 3000);

    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef7f0',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <FaSpinner size={40} color="#e53e3e" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading menu...</p>
        
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error && !restaurant) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef7f0',
        padding: '20px',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h2 style={{ color: '#1f2937', marginBottom: '10px' }}>Restaurant Not Found</h2>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            We couldn&apos;t find the restaurant menu. Please check the QR code or contact the restaurant.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      paddingBottom: showCart ? '200px' : '100px'
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 100,
        padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {restaurant?.name || 'Restaurant'}
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0 0 0' }}>
              Order from your table
            </p>
          </div>
          
          <button
            onClick={() => setShowCart(!showCart)}
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(229, 62, 62, 0.3)'
            }}
          >
            <FaShoppingCart size={18} />
            {getCartItemCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#f59e0b',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}>
                {getCartItemCount()}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <FaSearch size={14} color="#9ca3af" style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)'
          }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search food items..."
            style={{
              width: '100%',
              padding: '12px 12px 12px 36px',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#f1f5f9',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.boxShadow = '0 0 0 2px rgba(229, 62, 62, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = '#f1f5f9';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                background: selectedCategory === category 
                  ? 'linear-gradient(135deg, #e53e3e, #dc2626)' 
                  : '#ffffff',
                color: selectedCategory === category ? 'white' : '#64748b',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                boxShadow: selectedCategory === category 
                  ? '0 2px 8px rgba(229, 62, 62, 0.3)' 
                  : '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 16px',
          margin: '16px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534',
          padding: '12px 16px',
          margin: '16px',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          {success}
        </div>
      )}

      {/* Menu */}
      <div style={{ padding: '0 16px' }}>
        {selectedCategory === 'all' ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            marginTop: '16px'
          }}>
            {filteredMenu.map(item => (
              <MenuItemCard
                key={item.id}
                item={item}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                cartQuantity={cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
              />
            ))}
          </div>
        ) : (
          <div>
            {Object.entries(groupedMenu).map(([category, items]) => (
              <div key={category} style={{ marginTop: '16px' }}>
                <h2 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 16px 0',
                  padding: '12px 16px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                }}>
                  {category}
                </h2>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '16px', 
                  marginBottom: '24px' 
                }}>
                  {items.map(item => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      onAddToCart={addToCart}
                      onRemoveFromCart={removeFromCart}
                      cartQuantity={cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.12)',
          zIndex: 200,
          maxHeight: '70vh',
          overflowY: 'auto',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px'
        }}>
          <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Your Order ({getCartItemCount()} items)
              </h3>
              <button
                onClick={() => setShowCart(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: '#64748b',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                }}
              >
                <FaTrash size={16} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <FaShoppingCart size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p style={{ fontSize: '16px', margin: 0 }}>Your cart is empty</p>
                <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.7 }}>Add some delicious items to get started</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
                          ₹{item.price} each
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: '#f1f5f9',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#e2e8f0';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#f1f5f9';
                          }}
                        >
                          <FaMinus size={14} color="#64748b" />
                        </button>
                        
                        <span style={{ fontSize: '18px', fontWeight: '700', color: '#1f2937', minWidth: '24px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => addToCart(item)}
                          style={{
                            background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                            border: 'none',
                            padding: '8px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(229, 62, 62, 0.3)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <FaPlus size={14} color="white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Customer Info Section */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '20px',
                  borderRadius: '16px',
                  marginBottom: '24px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', margin: '0 0 16px 0' }}>
                    Contact Information
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        <FaPhone size={12} style={{ marginRight: '6px' }} />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        placeholder="Enter phone number"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                        <FaChair size={12} style={{ marginRight: '6px' }} />
                        Table Number
                      </label>
                      <input
                        type="text"
                        value={customerInfo.seatNumber}
                        onChange={(e) => setCustomerInfo({...customerInfo, seatNumber: e.target.value})}
                        placeholder="Table/Seat number"
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: 'white',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.boxShadow = '0 0 0 3px rgba(229, 62, 62, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>
                      Total: ₹{getCartTotal()}
                    </span>
                  </div>
                  
                  <button
                    onClick={placeOrder}
                    disabled={placingOrder || !customerInfo.phone.trim() || cart.length === 0}
                    style={{
                      width: '100%',
                      background: (placingOrder || !customerInfo.phone.trim() || cart.length === 0)
                        ? '#d1d5db'
                        : 'linear-gradient(135deg, #e53e3e, #dc2626)',
                      color: 'white',
                      border: 'none',
                      padding: '18px',
                      borderRadius: '16px',
                      fontSize: '18px',
                      fontWeight: '700',
                      cursor: (placingOrder || !customerInfo.phone.trim() || cart.length === 0) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                      boxShadow: (placingOrder || !customerInfo.phone.trim() || cart.length === 0)
                        ? 'none'
                        : '0 8px 24px rgba(229, 62, 62, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!placingOrder && customerInfo.phone.trim() && cart.length > 0) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 12px 32px rgba(229, 62, 62, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!placingOrder && customerInfo.phone.trim() && cart.length > 0) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(229, 62, 62, 0.3)';
                      }
                    }}
                  >
                    {placingOrder ? (
                      <>
                        <FaSpinner size={18} style={{ animation: 'spin 1s linear infinite' }} />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <FaUtensils size={18} />
                        Place Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <FaLock size={40} color="#e53e3e" style={{ marginBottom: '16px' }} />
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                Verify Your Phone
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                We&apos;ve sent a 6-digit code to {customerInfo.phone}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength="6"
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '18px',
                  textAlign: 'center',
                  outline: 'none',
                  backgroundColor: '#f9fafb',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpSent(false);
                  setOtp('');
                }}
                style={{
                  flex: 1,
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                disabled={sendingOtp || otp.length !== 6}
                style={{
                  flex: 1,
                  background: (sendingOtp || otp.length !== 6)
                    ? '#d1d5db'
                    : 'linear-gradient(135deg, #e53e3e, #dc2626)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: (sendingOtp || otp.length !== 6) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                {sendingOtp ? (
                  <>
                    <FaSpinner size={14} style={{ animation: 'spin 1s linear infinite' }} />
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

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Menu Item Card Component
const MenuItemCard = ({ item, onAddToCart, onRemoveFromCart, cartQuantity }) => {
  const isVeg = item.isVeg !== false;
  
  // Default food images based on category
  const getDefaultImage = (category) => {
    const images = {
      'Pizza': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop',
      'Burgers': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop',
      'Salads': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=150&fit=crop',
      'Pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=200&h=150&fit=crop',
      'Desserts': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=200&h=150&fit=crop'
    };
    return images[category] || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200&h=150&fit=crop';
  };
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      position: 'relative',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    }}>
      {/* Food Image */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '8px',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: '#f1f5f9'
      }}>
        <img 
          src={item.image || getDefaultImage(item.category)} 
          alt={item.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = getDefaultImage(item.category);
          }}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header with Veg/Non-Veg Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1f2937',
            margin: 0,
            lineHeight: '1.3',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {item.name}
          </h3>
          
          {/* Veg/Non-Veg Indicator */}
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: isVeg ? '#22c55e' : '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginLeft: '8px'
          }}>
            {isVeg ? <FaLeaf size={8} color="white" /> : <FaDrumstickBite size={8} color="white" />}
          </div>
        </div>
        
        {/* Description */}
        {item.description && (
          <p style={{
            fontSize: '12px',
            color: '#64748b',
            margin: '0 0 8px 0',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {item.description}
          </p>
        )}

        {/* Price and Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937'
            }}>
              ₹{item.price}
            </span>
            {item.category && (
              <span style={{
                fontSize: '10px',
                color: '#64748b',
                backgroundColor: '#f1f5f9',
                padding: '2px 6px',
                borderRadius: '6px',
                fontWeight: '500'
              }}>
                {item.category}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {cartQuantity > 0 && (
              <button
                onClick={() => onRemoveFromCart(item.id)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  padding: '6px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#e2e8f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                }}
              >
                <FaMinus size={10} color="#64748b" />
              </button>
            )}
            
            {cartQuantity > 0 && (
              <span style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1f2937',
                minWidth: '20px',
                textAlign: 'center'
              }}>
                {cartQuantity}
              </span>
            )}
            
            <button
              onClick={() => onAddToCart(item)}
              style={{
                background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                border: 'none',
                padding: '6px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(229, 62, 62, 0.3)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(229, 62, 62, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(229, 62, 62, 0.3)';
              }}
            >
              <FaPlus size={10} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceOrderPage = () => {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fef7f0',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <FaSpinner size={40} color="#e53e3e" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#6b7280', fontSize: '16px' }}>Loading...</p>
        
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    }>
      <PlaceOrderContent />
    </Suspense>
  );
};

export default PlaceOrderPage;
