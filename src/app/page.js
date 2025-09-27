'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../components/Navigation';
import Onboarding from '../components/Onboarding';
import EmptyMenuPrompt from '../components/EmptyMenuPrompt';
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

function RestaurantPOSContent() {
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
  
  // Multi-step ordering workflow
  const [currentStep, setCurrentStep] = useState('table'); // 'table', 'menu', 'review', 'payment'
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '' });
  
  // API state
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null); // { orderId: 'ORD-123', show: true }
  
  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Generate dynamic categories based on actual menu items
  const getDynamicCategories = () => {
    if (!menuItems || menuItems.length === 0) {
      return [{ id: 'all-items', name: 'All Items', emoji: '🍽️', count: 0 }];
    }
    
    // Get unique categories from menu items
    const categoryMap = new Map();
    categoryMap.set('all-items', { id: 'all-items', name: 'All Items', emoji: '🍽️', count: menuItems.length });
    
    menuItems.forEach(item => {
      if (item.category) {
        const categoryId = item.category.toLowerCase();
        if (categoryMap.has(categoryId)) {
          categoryMap.get(categoryId).count++;
        } else {
          // Create dynamic category with appropriate emoji
          const emoji = getCategoryEmoji(item.category);
          categoryMap.set(categoryId, {
            id: categoryId,
            name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
            emoji: emoji,
            count: 1
          });
        }
      }
    });
    
    return Array.from(categoryMap.values());
  };
  
  // Get appropriate emoji for category
  const getCategoryEmoji = (category) => {
    const categoryLower = category.toLowerCase();
    const emojiMap = {
      'appetizer': '🥗', 'appetizers': '🥗', 'starter': '🥗', 'starters': '🥗',
      'main': '🍛', 'main-course': '🍛', 'mains': '🍛', 'entree': '🍛', 'entrees': '🍛',
      'rice': '🍚', 'biryani': '🍚', 'biryanis': '🍚', 'fried-rice': '🍚',
      'dal': '🍲', 'curry': '🍲', 'curries': '🍲', 'gravy': '🍲',
      'bread': '🍞', 'breads': '🍞', 'naan': '🍞', 'roti': '🍞', 'chapati': '🍞',
      'beverage': '🥤', 'beverages': '🥤', 'drinks': '🥤', 'juice': '🧃', 'tea': '☕', 'coffee': '☕',
      'dessert': '🍰', 'desserts': '🍰', 'sweet': '🧁', 'sweets': '🧁', 'ice-cream': '🍨',
      'snack': '🍿', 'snacks': '🍿', 'chaat': '🍿',
      'pizza': '🍕', 'pizzas': '🍕',
      'burger': '🍔', 'burgers': '🍔',
      'sandwich': '🥪', 'sandwiches': '🥪',
      'salad': '🥙', 'salads': '🥙',
      'soup': '🍜', 'soups': '🍜',
      'pasta': '🍝', 'pastas': '🍝',
      'chinese': '🥢', 'asian': '🥢',
      'tandoor': '🔥', 'grilled': '🔥', 'bbq': '🔥'
    };
    
    return emojiMap[categoryLower] || '🍽️';
  };
  
  const categories = getDynamicCategories();

  // Mobile detection hook
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Authentication check and onboarding detection
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // Check if user needs onboarding
    const userData = localStorage.getItem('user');
    const onboardingSkipped = localStorage.getItem('onboarding_skipped');
    const hasCompletedOnboarding = localStorage.getItem('onboarding_completed');
    
    if (userData && !onboardingSkipped && !hasCompletedOnboarding) {
      const user = JSON.parse(userData);
      // Show onboarding for owners who haven't set up a restaurant
      if (user.role === 'owner' || !user.role) {
        setIsFirstTimeUser(true);
        setShowOnboarding(true);
      }
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
      
      // Get user data to determine restaurant context
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      // Load restaurants
      const restaurantsResponse = await apiClient.getRestaurants();
      setRestaurants(restaurantsResponse.restaurants || []);
      
      let restaurant = null;
      
      // For staff members, use their assigned restaurant
      if (user?.restaurantId) {
        restaurant = restaurantsResponse.restaurants.find(r => r.id === user.restaurantId);
      }
      // For owners or customers (legacy), use selected restaurant from localStorage or first restaurant
      else if (restaurantsResponse.restaurants && restaurantsResponse.restaurants.length > 0) {
        const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
        restaurant = restaurantsResponse.restaurants.find(r => r.id === savedRestaurantId) || 
                    restaurantsResponse.restaurants[0];
        
        // Save the selected restaurant ID if not already saved
        if (!savedRestaurantId) {
          localStorage.setItem('selectedRestaurantId', restaurant.id);
        }
      }
      
      if (restaurant) {
        setSelectedRestaurant(restaurant);
        // Load menu for selected restaurant
        await loadMenu(restaurant.id);
      } else {
        // Check if user should see onboarding or create sample restaurant
        if (isFirstTimeUser && !localStorage.getItem('onboarding_skipped')) {
          setShowOnboarding(true);
        } else {
          // Create a sample restaurant for users who skipped onboarding
          await createSampleRestaurant();
        }
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
  
  // Handle onboarding completion
  const handleOnboardingComplete = async (restaurant) => {
    setShowOnboarding(false);
    setIsFirstTimeUser(false);
    localStorage.setItem('onboarding_completed', 'true');
    
    // Update restaurant list and selected restaurant
    setSelectedRestaurant(restaurant);
    setRestaurants(prev => [...prev, restaurant]);
    
    // Load menu for the new restaurant
    await loadMenu(restaurant.id);
  };
  
  // Handle onboarding skip
  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setIsFirstTimeUser(false);
    localStorage.setItem('onboarding_skipped', 'true');
    
    // Continue with loading initial data
    loadInitialData();
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
    const matchesCategory = selectedCategory === 'all-items' || item.category?.toLowerCase() === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    // Hide success message when adding new items
    if (orderSuccess?.show) {
      setOrderSuccess(null);
    }
    
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

      // Get current user/staff info
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Prepare order data
      const orderData = {
        restaurantId: selectedRestaurant.id,
        tableNumber: selectedTable?.name || null,
        orderType,
        paymentMethod,
        staffInfo: {
          id: currentUser.id,
          name: currentUser.name || 'Staff',
          role: currentUser.role || 'waiter'
        },
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          notes: '',
          name: item.name,
          price: item.price
        })),
        customerInfo: {
          name: orderType === 'takeaway' ? customerInfo.name : 'Walk-in Customer',
          phone: orderType === 'takeaway' ? customerInfo.phone : ''
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

      // Process payment based on method
      if (paymentMethod === 'cash') {
        await apiClient.verifyPayment({
          orderId,
          razorpay_payment_id: `cash_payment_${Date.now()}`,
          razorpay_order_id: `cash_order_${Date.now()}`,
          razorpay_signature: 'cash_signature',
          paymentMethod: 'cash'
        });
      } else if (paymentMethod === 'upi') {
        await apiClient.verifyPayment({
          orderId,
          razorpay_payment_id: `upi_payment_${Date.now()}`,
          razorpay_order_id: `upi_order_${Date.now()}`,
          razorpay_signature: 'upi_signature',
          paymentMethod: 'upi'
        });
      } else if (paymentMethod === 'card') {
        await apiClient.verifyPayment({
          orderId,
          razorpay_payment_id: `card_payment_${Date.now()}`,
          razorpay_order_id: `card_order_${Date.now()}`,
          razorpay_signature: 'card_signature',
          paymentMethod: 'card'
        });
      }

      // Clear cart and show inline success
      setCart([]);
      localStorage.removeItem('dine_cart');
      setOrderSuccess({ orderId, show: true });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setOrderSuccess(null);
        if (selectedTable && selectedTable.id) {
          // Release table
          apiClient.updateTableStatus(selectedTable.id, 'available');
          setSelectedTable(null);
        }
      }, 5000);

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

  // Multi-step workflow functions
  const handleTableSelection = (table) => {
    setSelectedTable(table);
    setCurrentStep('menu');
  };

  const proceedToReview = () => {
    if (cart.length > 0) {
      setCurrentStep('review');
    }
  };

  const proceedToPayment = () => {
    setCurrentStep('payment');
  };

  const goBackToStep = (step) => {
    setCurrentStep(step);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'table': return 'Select Table & Order Type';
      case 'menu': return 'Choose Items';
      case 'review': return 'Review Order';
      case 'payment': return 'Payment & Checkout';
      default: return 'Place Order';
    }
  };

  const getStepProgress = () => {
    const steps = ['table', 'menu', 'review', 'payment'];
    return steps.indexOf(currentStep) + 1;
  };

  // Show onboarding if needed
  if (showOnboarding && isFirstTimeUser) {
    return (
      <>
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
          <Header handleLogout={handleLogout} />
        </div>
        <Onboarding 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      </>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <Header handleLogout={handleLogout} />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 80px)' 
        }}>
          <div style={{ textAlign: 'center' }}>
            <FaSpinner style={{ 
              fontSize: '48px', 
              color: '#ef4444', 
              animation: 'spin 1s linear infinite',
              marginBottom: '16px'
            }} />
            <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading your restaurant...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Header handleLogout={handleLogout} />
      
      {/* Progress Bar */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: isMobile ? '12px 16px' : '16px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h1 style={{ fontSize: isMobile ? '18px' : '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            {getStepTitle()}
          </h1>
          <div style={{ 
            padding: '6px 12px', 
            backgroundColor: '#ef4444', 
            color: 'white', 
            borderRadius: '20px', 
            fontSize: '12px', 
            fontWeight: '600' 
          }}>
            Step {getStepProgress()} of 4
          </div>
        </div>
        
        {/* Progress Indicators */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['table', 'menu', 'review', 'payment'].map((step, index) => {
            const isActive = ['table', 'menu', 'review', 'payment'].indexOf(currentStep) >= index;
            const isCurrent = currentStep === step;
            return (
              <div
                key={step}
                style={{
                  flex: 1,
                  height: '4px',
                  backgroundColor: isActive ? '#ef4444' : '#e5e7eb',
                  borderRadius: '2px',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {currentStep === 'table' && (
          // Table Selection Step
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: isMobile ? '20px' : '40px',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              padding: isMobile ? '32px 24px' : '48px 40px',
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
                }}>
                  <FaChair size={32} color="white" />
                </div>
                <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Welcome to {selectedRestaurant?.name || 'Restaurant'}
                </h2>
                <p style={{ color: '#6b7280', fontSize: isMobile ? '14px' : '16px', margin: 0 }}>
                  Let's start by setting up your order
                </p>
              </div>

              {/* Order Type Selection */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Order Type
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                  <button
                    onClick={() => setOrderType('dine-in')}
                    style={{
                      padding: '20px',
                      backgroundColor: orderType === 'dine-in' ? '#fef2f2' : 'white',
                      border: orderType === 'dine-in' ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: orderType === 'dine-in' ? '#ef4444' : '#f3f4f6',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '20px' }}>🍽️</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px' }}>Dine In</div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>Eat at the restaurant</div>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setOrderType('takeaway')}
                    style={{
                      padding: '20px',
                      backgroundColor: orderType === 'takeaway' ? '#fef2f2' : 'white',
                      border: orderType === 'takeaway' ? '2px solid #ef4444' : '2px solid #e5e7eb',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: orderType === 'takeaway' ? '#ef4444' : '#f3f4f6',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <span style={{ fontSize: '20px' }}>📦</span>
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px' }}>Takeaway</div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>Order to go</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Table Selection for Dine-in */}
              {orderType === 'dine-in' && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Table Selection
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input
                      type="text"
                      value={manualTableNumber}
                      onChange={(e) => setManualTableNumber(e.target.value)}
                      placeholder="Enter table number (e.g., T1, Table 5)"
                      style={{
                        flex: 1,
                        padding: '16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '16px',
                        outline: 'none',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                    <button
                      onClick={() => {
                        if (manualTableNumber.trim()) {
                          handleTableSelection({
                            name: manualTableNumber.trim(),
                            floor: 'Manual Entry',
                            capacity: 'N/A'
                          });
                          setManualTableNumber('');
                        }
                      }}
                      disabled={!manualTableNumber.trim()}
                      style={{
                        padding: '16px 24px',
                        backgroundColor: manualTableNumber.trim() ? '#ef4444' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: manualTableNumber.trim() ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s'
                      }}
                    >
                      Select
                    </button>
                  </div>
                  
                  <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FaChair size={16} color="#0284c7" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#0284c7' }}>
                        Quick Setup
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#075985', margin: 0, lineHeight: '1.4' }}>
                      For full table management with floor layouts, visit the Tables page to set up your restaurant layout.
                    </p>
                  </div>
                </div>
              )}

              {/* Customer Info for Takeaway */}
              {orderType === 'takeaway' && (
                <div style={{ marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                    Customer Information
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      placeholder="Customer name"
                      style={{
                        padding: '16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '16px',
                        outline: 'none',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      placeholder="Phone number"
                      style={{
                        padding: '16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '16px',
                        outline: 'none',
                        backgroundColor: '#f9fafb'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <button
                onClick={() => {
                  if (orderType === 'dine-in' && !selectedTable) {
                    alert('Please select a table first');
                    return;
                  }
                  if (orderType === 'takeaway' && !customerInfo.name.trim()) {
                    alert('Please enter customer name');
                    return;
                  }
                  setCurrentStep('menu');
                }}
                disabled={
                  (orderType === 'dine-in' && !selectedTable) ||
                  (orderType === 'takeaway' && !customerInfo.name.trim())
                }
                style={{
                  width: '100%',
                  padding: '20px',
                  backgroundColor: 
                    (orderType === 'dine-in' && selectedTable) || 
                    (orderType === 'takeaway' && customerInfo.name.trim()) 
                      ? '#ef4444' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '18px',
                  fontWeight: '700',
                  cursor: 
                    (orderType === 'dine-in' && selectedTable) || 
                    (orderType === 'takeaway' && customerInfo.name.trim())
                      ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: 
                    (orderType === 'dine-in' && selectedTable) || 
                    (orderType === 'takeaway' && customerInfo.name.trim())
                      ? '0 4px 14px rgba(239, 68, 68, 0.3)' : 'none'
                }}
              >
                <span>Start Ordering</span>
                <FaUtensils size={20} />
              </button>
              
              {selectedTable && (
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px 16px', 
                  backgroundColor: '#dcfce7', 
                  borderRadius: '12px',
                  border: '1px solid #22c55e',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#166534' }}>
                    ✓ Table {selectedTable.name} selected
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 'menu' && (
          // Menu Selection Step  
          <div style={{ 
            display: 'flex', 
            flex: 1, 
            overflow: 'hidden',
            flexDirection: 'column',
            position: 'relative'
          }}>
            {/* Back Button */}
            <div style={{
              position: 'absolute',
              top: '20px',
              left: '24px',
              zIndex: 10
            }}>
              <button
                onClick={() => goBackToStep('table')}
                style={{
                  padding: '12px 16px',
                  backgroundColor: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#6b7280',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.color = '#6b7280';
                }}
              >
                ← Back
              </button>
            </div>
            
            {/* Continue with menu content */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', paddingTop: '60px' }}>
              {/* Cart Preview Bar */}
              {cart.length > 0 && (
                <div style={{
                  position: 'fixed',
                  bottom: isMobile ? '20px' : '40px',
                  right: isMobile ? '20px' : '40px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '16px 24px',
                  borderRadius: '50px',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.3)',
                  zIndex: 20,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  transition: 'all 0.2s'
                }}
                onClick={proceedToReview}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 6px 25px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.3)';
                }}
                >
                  <FaShoppingCart size={20} />
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                  <span>•</span>
                  <span>Rs.{getTotalAmount()}</span>
                  <span>→</span>
                </div>
              )}
              
              {/* Simple menu display */}
              <div style={{ padding: isMobile ? '20px' : '40px', textAlign: 'center', flex: 1 }}>
                <h3 style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                  Menu Items
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: isMobile ? '14px' : '16px' }}>
                  Browse and add items to your cart
                </p>
                
                {/* Search bar */}
                <div style={{ 
                  maxWidth: '400px', 
                  margin: '0 auto 32px auto',
                  position: 'relative'
                }}>
                  <FaSearch style={{ 
                    position: 'absolute', 
                    left: '16px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#9ca3af' 
                  }} size={16} />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '48px',
                      paddingRight: '16px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '16px',
                      backgroundColor: '#f9fafb',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                  />
                </div>
                
                {/* Show menu items grid */}
                {filteredItems.length > 0 ? (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile 
                      ? 'repeat(auto-fill, minmax(150px, 1fr))' 
                      : 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: isMobile ? '16px' : '24px',
                    maxWidth: '1200px',
                    margin: '0 auto'
                  }}>
                    {filteredItems.map((item) => (
                      <div key={item.id} style={{
                        backgroundColor: 'white',
                        borderRadius: isMobile ? '16px' : '20px',
                        padding: isMobile ? '16px' : '20px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        border: getItemQuantityInCart(item.id) > 0 ? '2px solid #ef4444' : '1px solid #e5e7eb',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      }}
                      >
                        {/* Item image placeholder */}
                        <div style={{
                          height: isMobile ? '60px' : '80px',
                          background: 'linear-gradient(135deg, #fed7aa, #fecaca)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '16px',
                          position: 'relative'
                        }}>
                          <span style={{ fontSize: isMobile ? '24px' : '32px', opacity: 0.6 }}>
                            {getCategoryEmoji(item.category)}
                          </span>
                          
                          {/* Veg/Non-veg indicator */}
                          <div style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '8px',
                            fontWeight: 'bold',
                            backgroundColor: item.isVeg ? '#10b981' : '#ef4444',
                            color: 'white'
                          }}>
                            {item.isVeg ? 'VEG' : 'NON-VEG'}
                          </div>
                        </div>
                        
                        <h4 style={{ 
                          fontSize: isMobile ? '14px' : '18px', 
                          fontWeight: '700', 
                          color: '#1f2937', 
                          marginBottom: '8px',
                          lineHeight: '1.2'
                        }}>
                          {item.name}
                        </h4>
                        
                        <p style={{ 
                          fontSize: isMobile ? '12px' : '14px', 
                          color: '#6b7280', 
                          marginBottom: '12px',
                          lineHeight: '1.3',
                          height: isMobile ? '36px' : '42px',
                          overflow: 'hidden'
                        }}>
                          {isMobile 
                            ? (item.description?.length > 40 ? item.description.substring(0, 40) + '...' : item.description)
                            : (item.description?.length > 60 ? item.description.substring(0, 60) + '...' : item.description)
                          }
                        </p>
                        
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          marginBottom: '16px'
                        }}>
                          <span style={{ 
                            fontSize: isMobile ? '16px' : '20px', 
                            fontWeight: 'bold', 
                            color: '#ef4444' 
                          }}>
                            Rs.{item.price}
                          </span>
                        </div>
                        
                        {getItemQuantityInCart(item.id) === 0 ? (
                          <button
                            onClick={() => addToCart(item)}
                            style={{
                              width: '100%',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              padding: isMobile ? '8px 12px' : '12px 16px',
                              border: 'none',
                              borderRadius: '12px',
                              fontSize: isMobile ? '12px' : '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <FaPlus size={isMobile ? 10 : 12} />
                            Add to Cart
                          </button>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              backgroundColor: '#f3f4f6', 
                              borderRadius: '8px', 
                              border: '1px solid #e5e7eb'
                            }}>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#ef4444',
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  borderRadius: '6px 0 0 6px',
                                  cursor: 'pointer'
                                }}
                              >
                                <FaMinus size={12} />
                              </button>
                              <span style={{
                                width: '40px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                color: '#1f2937',
                                borderLeft: '1px solid #e5e7eb',
                                borderRight: '1px solid #e5e7eb',
                                fontSize: '14px'
                              }}>
                                {getItemQuantityInCart(item.id)}
                              </span>
                              <button
                                onClick={() => addToCart(item)}
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#10b981',
                                  backgroundColor: 'transparent',
                                  border: 'none',
                                  borderRadius: '0 6px 6px 0',
                                  cursor: 'pointer'
                                }}
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              fontWeight: '600', 
                              color: '#ef4444',
                              textAlign: 'center'
                            }}>
                              Rs.{item.price * getItemQuantityInCart(item.id)} total
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: '#6b7280'
                  }}>
                    <FaUtensils size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontSize: '18px', fontWeight: '600' }}>No menu items found</p>
                    <p style={{ fontSize: '14px' }}>Try adjusting your search or check back later</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'review' && (
          // Order Review Step
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: isMobile ? '20px' : '40px',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              padding: isMobile ? '32px 24px' : '48px 40px',
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                }}>
                  <FaClipboardList size={32} color="white" />
                </div>
                <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Review Your Order
                </h2>
                <p style={{ color: '#6b7280', fontSize: isMobile ? '14px' : '16px', margin: 0 }}>
                  {orderType === 'dine-in' ? `Table ${selectedTable?.name}` : `Takeaway for ${customerInfo.name}`}
                </p>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Items ({cart.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {cart.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px',
                      backgroundColor: '#f9fafb',
                      borderRadius: '12px',
                      border: '1px solid #e5e7eb'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px' }}>{item.name}</div>
                        <div style={{ color: '#6b7280', fontSize: '14px' }}>Rs.{item.price} each</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px' }}>
                          {item.quantity}x = Rs.{item.price * item.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#1f2937', 
                borderRadius: '16px', 
                color: 'white',
                marginBottom: '32px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '18px', fontWeight: '600' }}>Total Amount</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Rs.{getTotalAmount()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => goBackToStep('menu')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  ← Back to Menu
                </button>
                <button
                  onClick={proceedToPayment}
                  style={{
                    flex: 2,
                    padding: '16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  Proceed to Payment →
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'payment' && (
          // Payment Step
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: isMobile ? '20px' : '40px',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              borderRadius: '24px', 
              padding: isMobile ? '32px 24px' : '48px 40px',
              maxWidth: '600px',
              width: '100%',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#8b5cf6',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 4px 14px rgba(139, 92, 246, 0.3)'
                }}>
                  <FaCreditCard size={32} color="white" />
                </div>
                <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 8px 0' }}>
                  Payment & Checkout
                </h2>
                <p style={{ color: '#6b7280', fontSize: isMobile ? '14px' : '16px', margin: 0 }}>
                  Choose payment method and complete order
                </p>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                  Payment Method
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '12px' }}>
                  {[
                    { id: 'cash', label: 'Cash', icon: FaMoneyBillWave, color: '#10b981' },
                    { id: 'upi', label: 'UPI', icon: FaCreditCard, color: '#3b82f6' },
                    { id: 'card', label: 'Card', icon: FaCreditCard, color: '#8b5cf6' }
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        style={{
                          padding: '20px',
                          backgroundColor: isSelected ? '#fef2f2' : 'white',
                          border: isSelected ? '2px solid #ef4444' : '2px solid #e5e7eb',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: isSelected ? '#ef4444' : '#f3f4f6',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 12px auto'
                        }}>
                          <Icon size={20} color={isSelected ? 'white' : '#6b7280'} />
                        </div>
                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px' }}>{method.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#1f2937', 
                borderRadius: '16px', 
                color: 'white',
                marginBottom: '32px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '16px' }}>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  <span style={{ fontSize: '16px' }}>Rs.{getTotalAmount()}</span>
                </div>
                <div style={{ borderTop: '1px solid #374151', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>Total Amount</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Rs.{getTotalAmount()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={() => goBackToStep('review')}
                  style={{
                    flex: 1,
                    padding: '16px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={processOrder}
                  disabled={processing}
                  style={{
                    flex: 2,
                    padding: '16px',
                    backgroundColor: processing ? '#d1d5db' : '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '700',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: processing ? 'none' : '0 4px 14px rgba(34, 197, 94, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  {processing ? (
                    <>
                      <FaSpinner style={{ animation: 'spin 1s linear infinite' }} size={16} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle size={16} />
                      Complete Order
                    </>
                  )}
                </button>
              </div>

              {orderSuccess?.show && (
                <div style={{ 
                  marginTop: '20px',
                  padding: '20px', 
                  backgroundColor: '#dcfce7', 
                  border: '2px solid #22c55e',
                  borderRadius: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                    <FaCheckCircle size={24} style={{ color: '#22c55e' }} />
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#166534' }}>Order Complete!</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#166534', marginBottom: '16px' }}>
                    Order #{orderSuccess.orderId} sent to kitchen
                  </div>
                  <button
                    onClick={() => {
                      setOrderSuccess(null);
                      setCart([]);
                      setCurrentStep('table');
                      setSelectedTable(null);
                      setCustomerInfo({ name: '', phone: '' });
                    }}
                    style={{
                      backgroundColor: '#22c55e',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Start New Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fef7f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
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
        <p style={{ color: '#6b7280', margin: 0 }}>Loading restaurant system...</p>
      </div>
    </div>
  );
}

export default function RestaurantPOS() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RestaurantPOSContent />
    </Suspense>
  );
}