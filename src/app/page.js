'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  FaSearch, 
  FaShoppingCart, 
  FaPlus, 
  FaMinus, 
  FaCreditCard, 
  FaMoneyBillWave,
  FaPrint,
  FaSave,
  FaUtensils,
  FaCoffee,
  FaHamburger,
  FaHeart,
  FaFire,
  FaChair,
  FaEdit,
  FaTimes,
  FaSpinner,
  FaCheckCircle,
  FaHome,
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars
} from 'react-icons/fa';
import apiClient from '../lib/api';

export default function RestaurantPOS() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Core state
  const [selectedCategory, setSelectedCategory] = useState('all-items');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickSearch, setQuickSearch] = useState('');
  const [orderType, setOrderType] = useState('dine-in');
  const [selectedTable, setSelectedTable] = useState(null);
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [manualTableNumber, setManualTableNumber] = useState('');
  
  // API state
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderComplete, setOrderComplete] = useState(false);

  const categories = [
    { id: 'all-items', name: 'All Items', emoji: '🍽️' },
    { id: 'appetizer', name: 'Appetizers', emoji: '🥗' },
    { id: 'main-course', name: 'Main Course', emoji: '🍛' },
    { id: 'rice', name: 'Rice & Biryani', emoji: '🍚' },
    { id: 'dal', name: 'Dal & Curry', emoji: '🍲' },
    { id: 'bread', name: 'Bread', emoji: '🍞' },
    { id: 'beverages', name: 'Beverages', emoji: '🥤' },
    { id: 'dessert', name: 'Desserts', emoji: '🍰' },
  ];

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
  }, [router]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('dine_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('dine_cart', JSON.stringify(cart));
  }, [cart]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load restaurants
      const restaurantsResponse = await apiClient.getRestaurants();
      setRestaurants(restaurantsResponse.restaurants || []);
      
      // Select first restaurant or create one if none exist
      if (restaurantsResponse.restaurants && restaurantsResponse.restaurants.length > 0) {
        const restaurant = restaurantsResponse.restaurants[0];
        setSelectedRestaurant(restaurant);
        
        // Load menu for selected restaurant
        await loadMenu(restaurant.id);
      } else {
        // Create a sample restaurant
        await createSampleRestaurant();
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load restaurant data');
    } finally {
      setLoading(false);
    }
  };

  const createSampleRestaurant = async () => {
    try {
      const restaurantData = {
        name: 'Sample Restaurant',
        address: '123 Food Street, City',
        phone: '+91 9876543210',
        cuisine: ['Indian', 'Continental'],
        description: 'A sample restaurant for demo',
        operatingHours: {
          open: '09:00',
          close: '23:00'
        }
      };
      
      const response = await apiClient.createRestaurant(restaurantData);
      const restaurant = response.restaurant;
      setSelectedRestaurant(restaurant);
      setRestaurants([restaurant]);
      
      // Seed sample menu data
      await apiClient.seedData(restaurant.id);
      await loadMenu(restaurant.id);
      
    } catch (error) {
      console.error('Error creating sample restaurant:', error);
      setError('Failed to create sample restaurant');
    }
  };

  const loadMenu = async (restaurantId) => {
    try {
      const response = await apiClient.getMenu(restaurantId);
      setMenuItems(response.menuItems || []);
    } catch (error) {
      console.error('Error loading menu:', error);
      setError('Failed to load menu');
    }
  };

  // Handle table parameters from URL
  useEffect(() => {
    const tableParam = searchParams.get('table');
    const floorParam = searchParams.get('floor');
    const capacityParam = searchParams.get('capacity');
    
    if (tableParam) {
      setSelectedTable({
        name: tableParam,
        floor: floorParam,
        capacity: capacityParam
      });
      setOrderType('dine-in'); // Force dine-in when table is selected
    }
  }, [searchParams]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all-items' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        // Move updated item to top
        const updatedCart = prevCart.filter(cartItem => cartItem.id !== item.id);
        return [{ ...existingItem, quantity: existingItem.quantity + 1 }, ...updatedCart];
      }
      // Add new item to top
      return [{ ...item, quantity: 1 }, ...prevCart];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      return prevCart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0);
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleQuickSearch = (e) => {
    if (e.key === 'Enter' && quickSearch.trim()) {
      const searchValue = quickSearch.trim().toLowerCase();
      const foundItem = menuItems.find(item => 
        item.shortCode?.toLowerCase() === searchValue || 
        item.name.toLowerCase().includes(searchValue)
      );
      
      if (foundItem) {
        addToCart(foundItem);
        setQuickSearch('');
      }
    }
  };

  const processOrder = async () => {
    if (cart.length === 0 || !selectedRestaurant) return;

    try {
      setProcessing(true);
      setError('');

      // Prepare order data
      const orderData = {
        restaurantId: selectedRestaurant.id,
        tableNumber: selectedTable?.name || null,
        orderType,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          notes: ''
        })),
        customerInfo: {
          name: 'Walk-in Customer',
          phone: ''
        },
        notes: ''
      };

      // Create order
      const orderResponse = await apiClient.createOrder(orderData);
      const orderId = orderResponse.order.id;

      // Update table status if table is selected
      if (selectedTable && selectedTable.id) {
        await apiClient.updateTableStatus(selectedTable.id, 'occupied', orderId);
      }

      // Process payment (mock for cash payments)
      if (paymentMethod === 'cash') {
        await apiClient.verifyPayment({
          orderId,
          razorpay_payment_id: `cash_payment_${Date.now()}`,
          razorpay_order_id: `cash_order_${Date.now()}`,
          razorpay_signature: 'cash_signature'
        });
      }

      // Clear cart and show success
      setCart([]);
      localStorage.removeItem('dine_cart');
      setOrderComplete(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setOrderComplete(false);
        if (selectedTable && selectedTable.id) {
          // Release table
          apiClient.updateTableStatus(selectedTable.id, 'available');
          setSelectedTable(null);
        }
      }, 3000);

    } catch (error) {
      console.error('Order processing error:', error);
      setError('Failed to process order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const saveOrder = () => {
    // Save current cart state
    localStorage.setItem('dine_saved_order', JSON.stringify({
      cart,
      orderType,
      selectedTable,
      timestamp: new Date().toISOString()
    }));
    alert('Order saved successfully!');
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('dine_cart');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('dine_cart');
    localStorage.removeItem('dine_saved_order');
    router.push('/login');
  };

  const navigateToPage = (page) => {
    router.push(page);
  };

  const getItemQuantityInCart = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleManualTableSelection = () => {
    if (manualTableNumber.trim()) {
      setSelectedTable({
        name: manualTableNumber.trim(),
        floor: 'Manual Entry',
        capacity: 'N/A'
      });
      setManualTableNumber('');
      setShowTableSelector(false);
    }
  };

  const clearSelectedTable = () => {
    setSelectedTable(null);
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        backgroundColor: '#f9fafb', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <FaSpinner className="animate-spin" size={32} color="#e53e3e" />
        <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: '600' }}>Loading restaurant data...</p>
      </div>
    );
  }

  // Order complete state
  if (orderComplete) {
    return (
      <div style={{ 
        height: '100vh', 
        backgroundColor: '#f0f9ff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '24px'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          backgroundColor: '#10b981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <FaCheckCircle size={60} color="white" />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
            Order Complete!
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px', margin: 0 }}>
            Payment processed successfully
          </p>
          {selectedTable && (
            <p style={{ color: '#10b981', fontSize: '14px', fontWeight: '600', marginTop: '8px' }}>
              Table {selectedTable.name} will be released shortly
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Brand - Clickable Home Link */}
            <button
              onClick={() => navigateToPage('/')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '8px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <div style={{ width: '32px', height: '32px', backgroundColor: '#e53e3e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaUtensils color="white" size={16} />
              </div>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Dine POS</h1>
                {selectedTable && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <FaChair size={12} color="#e53e3e" />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#e53e3e' }}>
                      {selectedTable.name} - {selectedTable.floor} {selectedTable.capacity !== 'N/A' && `(${selectedTable.capacity} seats)`}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearSelectedTable();
                      }}
                      style={{
                        marginLeft: '6px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280'
                      }}
                    >
                      <FaTimes size={8} />
                    </button>
                  </div>
                )}
              </div>
            </button>

            {/* Navigation Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f9fafb', borderRadius: '12px', padding: '4px' }}>
              <button
                onClick={() => navigateToPage('/')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'white',
                  color: '#e53e3e',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FaHome size={12} />
                Orders
              </button>
              
              <button
                onClick={() => navigateToPage('/orders')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#e53e3e';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                <FaClipboardList size={12} />
                History
              </button>

              <button
                onClick={() => navigateToPage('/tables')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#e53e3e';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                <FaChair size={12} />
                Tables
              </button>

              <button
                onClick={() => navigateToPage('/menu')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#e53e3e';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                <FaUtensils size={12} />
                Menu
              </button>

              <button
                onClick={() => navigateToPage('/analytics')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#e53e3e';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                <FaChartBar size={12} />
                Analytics
              </button>

              <button
                onClick={() => navigateToPage('/kot')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.color = '#e53e3e';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6b7280';
                }}
              >
                <FaPrint size={12} />
                KOT
              </button>
            </div>
            
            {/* Order Type Selector */}
            <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '4px' }}>
              {['dine-in', 'delivery', 'pickup'].map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: orderType === type ? 'white' : 'transparent',
                    color: orderType === type ? '#e53e3e' : '#6b7280',
                    boxShadow: orderType === type ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {type === 'dine-in' ? '🍽️ Dine In' : type === 'delivery' ? '🚚 Delivery' : '🥡 Pickup'}
                </button>
              ))}
            </div>
            
            {/* Table Selection Button - Only show for dine-in without table */}
            {orderType === 'dine-in' && !selectedTable && (
              <button
                onClick={() => setShowTableSelector(true)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <FaChair size={12} />
                Select Table
              </button>
            )}
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Restaurant Info */}
            <div style={{ color: '#374151', textAlign: 'right' }}>
              <p style={{ fontWeight: '600', margin: 0, fontSize: '14px' }}>
                {selectedRestaurant?.name || 'Restaurant'}
              </p>
              <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>
                📞 {selectedRestaurant?.phone || '+91 9876543210'}
              </p>
            </div>

            {/* User Menu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* User Info */}
              <div style={{
                padding: '6px 12px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaUsers size={12} color="white" />
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                  Waiter
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fecaca';
                  e.target.style.borderColor = '#f87171';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fee2e2';
                  e.target.style.borderColor = '#fecaca';
                }}
              >
                <FaSignOutAlt size={12} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Categories Sidebar */}
        <div style={{ width: '240px', backgroundColor: 'white', borderRight: '2px solid #e5e7eb', boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>Categories</h2>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={14} />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          
          <div style={{ padding: '8px', overflowY: 'auto', height: 'calc(100% - 100px)' }}>
            
            {categories.map((category) => {
              const categoryItems = category.id === 'all-items' 
                ? menuItems 
                : menuItems.filter(item => item.category === category.id);
              const isSelected = selectedCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isSelected ? '#e53e3e' : 'transparent',
                    color: isSelected ? 'white' : '#374151',
                    transition: 'all 0.2s',
                    fontSize: '13px'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#f3f4f6'
                  }}>
                    {category.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{category.name}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{categoryItems.length} items</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 12px', backgroundColor: 'white', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {selectedCategory}
                </h2>
                <p style={{ color: '#6b7280', margin: '2px 0 0 0', fontSize: '11px' }}>{filteredItems.length} items</p>
              </div>
              
              {/* Quick Search */}
              <div style={{ position: 'relative', width: '240px' }}>
                <FaSearch style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={12} />
                <input
                  type="text"
                  placeholder="Quick add: type name or code..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  onKeyPress={handleQuickSearch}
                  style={{
                    width: '100%',
                    paddingLeft: '28px',
                    paddingRight: '8px',
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: '#f9fafb',
                    fontSize: '11px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>
          
          <div style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '8px'
            }}>
              {filteredItems.map((item) => {
                const quantityInCart = getItemQuantityInCart(item.id);
                
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      height: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      border: quantityInCart > 0 ? '2px solid #e53e3e' : '1px solid #e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Item Image */}
                    <div style={{
                      height: '60px',
                      background: 'linear-gradient(135deg, #fed7aa, #fecaca)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ fontSize: '24px', opacity: 0.3 }}>
                        {categories.find(c => c.id === item.category)?.emoji || '🍽️'}
                      </div>
                      
                      {/* Badges */}
                      <div style={{ position: 'absolute', top: '2px', left: '2px' }}>
                        <div style={{
                          padding: '1px 4px',
                          borderRadius: '8px',
                          fontSize: '7px',
                          fontWeight: 'bold',
                          backgroundColor: item.isVeg ? '#10b981' : '#ef4444',
                          color: 'white'
                        }}>
                          {item.isVeg ? 'VEG' : 'NON-VEG'}
                        </div>
                      </div>
                      
                      {/* Short Code */}
                      {item.shortCode && (
                        <div style={{ position: 'absolute', top: '2px', right: '2px', fontSize: '8px', fontWeight: 'bold', color: '#6b7280', backgroundColor: 'rgba(255,255,255,0.8)', padding: '2px 4px', borderRadius: '4px' }}>
                          {item.shortCode}
                        </div>
                      )}
                    </div>
                    
                    {/* Item Details */}
                    <div style={{ padding: '8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontWeight: 'bold', fontSize: '12px', color: '#1f2937', margin: '0 0 2px 0', lineHeight: '1.2' }}>
                        {item.name.length > 18 ? item.name.substring(0, 18) + '...' : item.name}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '9px', margin: '0 0 6px 0', lineHeight: '1.3', flex: 1, overflow: 'hidden' }}>
                        {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#e53e3e' }}>
                            ₹{item.price}
                          </span>
                        </div>
                        
                        {quantityInCart === 0 ? (
                          <button
                            onClick={() => addToCart(item)}
                            style={{
                              background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              transition: 'all 0.2s',
                              fontSize: '9px'
                            }}
                          >
                            <FaPlus size={8} />
                            ADD
                          </button>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              style={{
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#e53e3e',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderRadius: '3px 0 0 3px',
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
                              fontSize: '10px'
                            }}>
                              {quantityInCart}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              style={{
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#10b981',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderRadius: '0 3px 3px 0',
                                cursor: 'pointer'
                              }}
                            >
                              <FaPlus size={8} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        <div style={{ width: '30%', minWidth: '320px', backgroundColor: 'white', borderLeft: '2px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
          {/* Cart Header */}
          <div style={{ background: 'linear-gradient(135deg, #e53e3e, #dc2626)', padding: '16px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaShoppingCart size={16} />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Order Summary</h2>
                <p style={{ opacity: 0.9, margin: 0, fontSize: '12px' }}>Review items</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{cart.length}</div>
                <div style={{ fontSize: '10px', fontWeight: '600', opacity: 0.9 }}>ITEMS</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
                <div style={{ fontSize: '10px', fontWeight: '600', opacity: 0.9 }}>QTY</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{getTotalAmount()}</div>
                <div style={{ fontSize: '10px', fontWeight: '600', opacity: 0.9 }}>TOTAL</div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '30px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <FaShoppingCart size={16} color="#9ca3af" />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 4px 0' }}>Cart is Empty</h3>
                <p style={{ color: '#9ca3af', fontSize: '10px' }}>Add items to get started</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '8px', border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0', fontSize: '11px', lineHeight: '1.2' }}>
                          {item.name.length > 16 ? item.name.substring(0, 16) + '...' : item.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#e53e3e' }}>₹{item.price}</span>
                          <div style={{
                            padding: '1px 4px',
                            borderRadius: '8px',
                            fontSize: '6px',
                            fontWeight: 'bold',
                            backgroundColor: item.isVeg ? '#dcfce7' : '#fee2e2',
                            color: item.isVeg ? '#166534' : '#dc2626'
                          }}>
                            {item.isVeg ? 'V' : 'N'}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e5e7eb', marginLeft: '8px' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#e53e3e',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px 0 0 4px',
                            cursor: 'pointer'
                          }}
                        >
                          <FaMinus size={8} />
                        </button>
                        <span style={{
                          width: '28px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: '#1f2937',
                          borderLeft: '1px solid #e5e7eb',
                          borderRight: '1px solid #e5e7eb',
                          fontSize: '11px'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
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
                            cursor: 'pointer'
                          }}
                        >
                          <FaPlus size={8} />
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>
                      Subtotal: ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              {/* Total */}
              <div style={{ padding: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg, #1f2937, #111827)', color: 'white', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Grand Total</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{getTotalAmount()}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Actions */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    onClick={() => setPaymentMethod('cash')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px',
                      backgroundColor: paymentMethod === 'cash' ? '#10b981' : 'white',
                      color: paymentMethod === 'cash' ? 'white' : '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '11px'
                    }}>
                    <FaMoneyBillWave size={12} />
                    Cash
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px',
                      backgroundColor: paymentMethod === 'card' ? '#10b981' : 'white',
                      color: paymentMethod === 'card' ? 'white' : '#374151',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontSize: '11px'
                    }}>
                    <FaCreditCard size={12} />
                    Card/UPI
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button 
                    onClick={saveOrder}
                    style={{
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      color: 'white',
                      padding: '8px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontSize: '11px'
                    }}>
                    <FaSave size={10} />
                    Save
                  </button>
                  <button 
                    onClick={clearCart}
                    style={{
                      background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                      color: 'white',
                      padding: '8px',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontSize: '11px'
                    }}>
                    <FaTimes size={10} />
                    Clear
                  </button>
                </div>
                
                {/* Process Order Button */}
                <button 
                  onClick={processOrder}
                  disabled={processing || cart.length === 0}
                  style={{
                    width: '100%',
                    backgroundColor: processing || cart.length === 0 ? '#d1d5db' : '#10b981',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: processing || cart.length === 0 ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                  {processing ? (
                    <>
                      <FaSpinner className="animate-spin" size={12} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle size={12} />
                      Complete Order (₹{getTotalAmount()})
                    </>
                  )}
                </button>

                {/* Error Message */}
                {error && (
                  <div style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    padding: '8px',
                    fontSize: '11px',
                    color: '#dc2626',
                    fontWeight: '600'
                  }}>
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Selector Modal */}
      {showTableSelector && (
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
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Select Table</h2>
              <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>Choose a table for this order</p>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Enter Table Number/Name
                </label>
                <input
                  type="text"
                  value={manualTableNumber}
                  onChange={(e) => setManualTableNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualTableSelection()}
                  placeholder="e.g., T1, Table 5, VIP1"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#f9fafb'
                  }}
                />
              </div>

              <div style={{ padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FaChair size={16} color="#0284c7" />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0284c7' }}>
                    Need to manage tables?
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#075985', margin: 0, lineHeight: '1.4' }}>
                  Visit the Table Management page to set up floor layouts, add tables, and track table status.
                </p>
              </div>
            </div>
            
            <div style={{ padding: '24px', backgroundColor: '#f9fafb', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowTableSelector(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleManualTableSelection}
                disabled={!manualTableNumber.trim()}
                style={{
                  flex: 1,
                  backgroundColor: manualTableNumber.trim() ? '#e53e3e' : '#d1d5db',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: manualTableNumber.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FaChair size={14} />
                Select Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}