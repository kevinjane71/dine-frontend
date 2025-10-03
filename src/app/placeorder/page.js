'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch, FaShoppingCart, FaPlus, FaMinus, FaTrash, FaArrowLeft, FaPhone, FaChair, FaUtensils, FaLeaf, FaDrumstickBite, FaSpinner } from 'react-icons/fa';
import apiClient from '../../lib/api.js';

const PlaceOrderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({
    phone: '',
    seatNumber: searchParams.get('seat') || '',
    name: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const categoryRefs = useRef({});
  const restaurantId = searchParams.get('restaurant') || 'default';

  useEffect(() => {
    loadRestaurantData();
  }, [restaurantId, loadRestaurantData]);

  const loadRestaurantData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load restaurant info
      const restaurantData = await apiClient.getRestaurant(restaurantId);
      setRestaurant(restaurantData);
      
      // Load menu
      const menuData = await apiClient.getMenu(restaurantId);
      setMenu(menuData);
      
      // Extract categories
      const uniqueCategories = [...new Set(menuData.map(item => item.category))];
      setCategories(['all', ...uniqueCategories]);
      
    } catch (err) {
      console.error('Error loading restaurant data:', err);
      setError('Failed to load restaurant menu. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  const scrollToCategory = (category) => {
    if (category === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const element = categoryRefs.current[category];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  const placeOrder = async () => {
    if (!customerInfo.phone.trim()) {
      setError('Phone number is required');
      return;
    }

    if (cart.length === 0) {
      setError('Please add items to cart');
      return;
    }

    try {
      setPlacingOrder(true);
      setError('');

      const orderData = {
        restaurantId: restaurantId,
        customerPhone: customerInfo.phone.trim(),
        customerName: customerInfo.name.trim() || 'Customer',
        seatNumber: customerInfo.seatNumber.trim() || 'Walk-in',
        orderType: 'customer_self_order', // Special order type for customer orders
        items: cart.map(item => ({
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          shortCode: item.shortCode
        })),
        totalAmount: getCartTotal(),
        status: 'pending',
        notes: `Customer self-order from seat ${customerInfo.seatNumber || 'Walk-in'}`
      };

      const response = await apiClient.createOrder(orderData);
      
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
          <FaUtensils size={60} color="#e53e3e" style={{ marginBottom: '20px' }} />
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
      backgroundColor: '#fef7f0',
      paddingBottom: showCart ? '200px' : '100px'
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        zIndex: 100,
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FaArrowLeft size={20} color="#6b7280" />
          </button>
          
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {restaurant?.name || 'Restaurant'}
            </h1>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '2px 0 0 0' }}>
              Place Your Order
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
              justifyContent: 'center'
            }}
          >
            <FaShoppingCart size={20} />
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
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {getCartItemCount()}
              </span>
            )}
          </button>
        </div>

        {/* Customer Info */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
              <FaPhone size={12} style={{ marginRight: '4px' }} />
              Phone Number *
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              placeholder="Enter phone number"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#fef7f0',
                boxSizing: 'border-box'
              }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>
              <FaChair size={12} style={{ marginRight: '4px' }} />
              Seat Number
            </label>
            <input
              type="text"
              value={customerInfo.seatNumber}
              onChange={(e) => setCustomerInfo({...customerInfo, seatNumber: e.target.value})}
              placeholder="Table/Seat number"
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                backgroundColor: '#fef7f0',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <FaSearch size={16} color="#9ca3af" style={{
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
              padding: '12px 12px 12px 40px',
              border: '1px solid #d1d5db',
              borderRadius: '12px',
              fontSize: '14px',
              outline: 'none',
              backgroundColor: '#f9fafb',
              boxSizing: 'border-box'
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
              onClick={() => {
                setSelectedCategory(category);
                scrollToCategory(category);
              }}
              style={{
                background: selectedCategory === category 
                  ? 'linear-gradient(135deg, #e53e3e, #dc2626)' 
                  : 'white',
                color: selectedCategory === category ? 'white' : '#6b7280',
                border: `1px solid ${selectedCategory === category ? '#dc2626' : '#d1d5db'}`,
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {category === 'all' ? 'All Items' : category}
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
          <div style={{ display: 'grid', gap: '16px' }}>
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
              <div key={category} ref={el => categoryRefs.current[category] = el}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '24px 0 16px 0',
                  padding: '12px 16px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  {category}
                </h2>
                <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
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
          borderTop: '1px solid #e5e7eb',
          boxShadow: '0 -4px 6px rgba(0,0,0,0.1)',
          zIndex: 200,
          maxHeight: '60vh',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Your Order ({getCartItemCount()} items)
              </h3>
              <button
                onClick={() => setShowCart(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <FaTrash size={16} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
                <FaShoppingCart size={40} style={{ marginBottom: '12px', opacity: 0.5 }} />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 4px 0' }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                          ₹{item.price} each
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: '#f3f4f6',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FaMinus size={12} color="#6b7280" />
                        </button>
                        
                        <span style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', minWidth: '20px', textAlign: 'center' }}>
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => addToCart(item)}
                          style={{
                            background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FaPlus size={12} color="white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
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
                      padding: '16px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: (placingOrder || !customerInfo.phone.trim() || cart.length === 0) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {placingOrder ? (
                      <>
                        <FaSpinner size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <FaUtensils size={16} />
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
  const [isVeg] = useState(item.isVeg !== false);
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #f3f4f6',
      position: 'relative'
    }}>
      {/* Veg/Non-Veg Indicator */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: isVeg ? '#22c55e' : '#ef4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {isVeg ? <FaLeaf size={10} color="white" /> : <FaDrumstickBite size={10} color="white" />}
      </div>

      {/* Short Code */}
      {item.shortCode && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: '600'
        }}>
          {item.shortCode}
        </div>
      )}

      <div style={{ marginTop: '8px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#1f2937',
          margin: '0 0 8px 0',
          lineHeight: '1.3'
        }}>
          {item.name}
        </h3>
        
        {item.description && (
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0 0 12px 0',
            lineHeight: '1.4'
          }}>
            {item.description}
          </p>
        )}

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#1f2937'
            }}>
              ₹{item.price}
            </span>
            {item.category && (
              <span style={{
                fontSize: '12px',
                color: '#6b7280',
                marginLeft: '8px',
                backgroundColor: '#f3f4f6',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {item.category}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {cartQuantity > 0 && (
              <button
                onClick={() => onRemoveFromCart(item.id)}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  padding: '8px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FaMinus size={14} color="#6b7280" />
              </button>
            )}
            
            {cartQuantity > 0 && (
              <span style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                minWidth: '24px',
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
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaPlus size={14} color="white" />
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
