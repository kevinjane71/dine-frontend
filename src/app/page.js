'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '../components/Navigation';
import Onboarding from '../components/Onboarding';
import EmptyMenuPrompt from '../components/EmptyMenuPrompt';
import MenuItemCard from '../components/MenuItemCard';
import CategoryButton from '../components/CategoryButton';
import OrderSummary from '../components/OrderSummary';
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
  const [tableNumber, setTableNumber] = useState('');
  
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
      const successData = { 
        orderId, 
        show: true, 
        message: 'Billing Complete! 💳' 
      };
      console.log('Setting order success:', successData);
      setOrderSuccess(successData);
      
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

  const saveOrder = async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const orderData = {
        restaurantId: selectedRestaurantId,
        tableNumber: tableNumber || selectedTable?.number || null,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          notes: ''
        })),
        customerInfo: {},
      orderType,
        paymentMethod,
        staffInfo: {
          name: 'Staff Member',
          id: 'staff-001'
        },
        notes: '',
        status: 'pending' // Save as draft
      };

      const response = await apiClient.post('/orders', orderData);
      
      if (response.data) {
        setOrderSuccess({
          orderId: response.data.order.id,
          show: true,
          message: 'Order Saved Successfully! 💾'
        });
        // Don't clear cart for saved orders
      }
    } catch (error) {
      console.error('Save order error:', error);
      setError('Failed to save order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      setError('Cart is empty');
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const orderData = {
        restaurantId: selectedRestaurantId,
        tableNumber: tableNumber || selectedTable?.number || null,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          notes: ''
        })),
        customerInfo: {},
        orderType,
        paymentMethod,
        staffInfo: {
          name: 'Staff Member',
          id: 'staff-001'
        },
        notes: '',
        status: 'confirmed' // Place order to kitchen
      };

      const response = await apiClient.post('/orders', orderData);
      
      if (response.data) {
        // Update order status to confirmed (sent to kitchen)
        await apiClient.patch(`/orders/${response.data.order.id}/status`, {
          status: 'confirmed'
        });

        setOrderSuccess({
          orderId: response.data.order.id,
          show: true,
          message: 'Order Placed to Kitchen! 👨‍🍳'
        });
        clearCart();
      }
    } catch (error) {
      console.error('Place order error:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
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

  // Removed full screen success - using inline success instead

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#f8fafc', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>
      {/* Header */}
      <Header handleLogout={handleLogout} />
      
      {/* Mobile Top Bar */}
      {isMobile && (
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* Search Bar */}
          <div style={{ flex: 1, position: 'relative' }}>
            <FaSearch style={{ 
              position: 'absolute', 
              left: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: '#9ca3af' 
            }} size={16} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '12px',
                paddingTop: '12px',
                paddingBottom: '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                backgroundColor: '#f9fafb',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>
          
          {/* Category Filter Button */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            style={{
              padding: '12px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
            }}
          >
            <FaBars size={16} />
            Categories
          </button>
          
          {/* Cart Button */}
          <button
            onClick={() => setShowMobileCart(true)}
            style={{
              padding: '12px',
              backgroundColor: cart.length > 0 ? '#10b981' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: '600',
              fontSize: '14px',
              position: 'relative',
              boxShadow: cart.length > 0 ? '0 2px 8px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(107, 114, 128, 0.3)'
            }}
          >
            <FaShoppingCart size={16} />
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'hidden',
        flexDirection: isMobile ? 'column' : 'row'
      }}>
        {/* Desktop Menu Sections Sidebar */}
        {!isMobile && (
          <div style={{ 
            width: '280px', 
            backgroundColor: 'white', 
            borderRight: '2px solid #e5e7eb', 
            boxShadow: '4px 0 20px rgba(0,0,0,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaUtensils style={{ fontSize: '14px', color: '#ef4444' }} />
              Menu Sections
            </h2>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 12px 0' }}>Browse by dish type</p>
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
                : menuItems.filter(item => item.category?.toLowerCase() === category.id);
              const isSelected = selectedCategory === category.id;
              
              return (
                <CategoryButton
                  key={category.id}
                  category={category}
                  isSelected={isSelected}
                  onClick={() => setSelectedCategory(category.id)}
                  itemCount={categoryItems.length}
                />
              );
            })}
          </div>
          </div>
        )}

        {/* Menu Items */}
        <div style={{ 
          flex: 1, 
          backgroundColor: '#f8fafc', 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Show empty menu prompt if no menu items */}
          {filteredItems.length === 0 && menuItems.length === 0 && !loading ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              width: '100%'
            }}>
              <EmptyMenuPrompt 
                restaurantName={selectedRestaurant?.name} 
                onAddMenu={() => router.push('/menu')}
              />
            </div>
          ) : (
          <>
            {/* Menu Header */}
          <div style={{ padding: '8px 12px', backgroundColor: 'white', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {categories.find(c => c.id === selectedCategory)?.name || 'All Items'}
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
          
          <div style={{ flex: 1, padding: isMobile ? '16px' : '8px', overflowY: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile 
                ? 'repeat(auto-fill, minmax(140px, 1fr))' 
                : 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: isMobile ? '8px' : '10px',
              justifyContent: 'center',
              padding: '0 4px'
            }}>
              {filteredItems.map((item) => {
                const quantityInCart = getItemQuantityInCart(item.id);
                
                return (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    quantityInCart={quantityInCart}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCart}
                    isMobile={isMobile}
                  />
                );
              })}
            </div>
          </div>
          </>
          )}
        </div>

       
        {/* Order Summary - Only show when there are menu items */}
        {!(filteredItems.length === 0 && menuItems.length === 0 && !loading) && (
          <div style={{ width: '30%', minWidth: '320px' }}>
          <OrderSummary
            cart={cart}
            orderType={orderType}
            setOrderType={setOrderType}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            onClearCart={clearCart}
            onProcessOrder={processOrder}
            onSaveOrder={saveOrder}
            onPlaceOrder={placeOrder}
            onRemoveFromCart={removeFromCart}
            onAddToCart={addToCart}
            onTableNumberChange={setTableNumber}
            processing={processing}
            orderSuccess={orderSuccess}
            setOrderSuccess={setOrderSuccess}
            error={error}
            getTotalAmount={getTotalAmount}
          />
        </div>
        )}
      </div>

      {/* Mobile Category Sidebar */}
      {isMobile && showMobileSidebar && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998
            }}
            onClick={() => setShowMobileSidebar(false)}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '280px',
            backgroundColor: 'white',
            zIndex: 999,
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
            transform: showMobileSidebar ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.3s ease',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Mobile Sidebar Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Menu Categories
              </h2>
              <button
                onClick={() => setShowMobileSidebar(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                <FaTimes size={18} color="#6b7280" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
              {categories.map((category) => {
                const categoryItems = category.id === 'all-items' 
                  ? menuItems 
                  : menuItems.filter(item => item.category?.toLowerCase() === category.id);
                const isSelected = selectedCategory === category.id;
                
                return (
                  <div key={category.id} onClick={() => {
                    setSelectedCategory(category.id);
                    setShowMobileSidebar(false);
                  }}>
                    <CategoryButton
                      category={category}
                      isSelected={isSelected}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowMobileSidebar(false);
                    }}
                      itemCount={categoryItems.length}
                    />
                    </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Mobile Cart Modal */}
      {isMobile && showMobileCart && (
        <>
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 998
            }}
            onClick={() => setShowMobileCart(false)}
          />
          <div style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            width: '90%',
            maxWidth: '400px',
            backgroundColor: 'white',
            zIndex: 999,
            boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.1)',
            transform: showMobileCart ? 'translateX(0)' : 'translateX(100%)',
            transition: 'transform 0.3s ease',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Mobile Cart Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                Your Order ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
              </h2>
              <button
                onClick={() => setShowMobileCart(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '6px'
                }}
              >
                <FaTimes size={18} color="#6b7280" />
              </button>
            </div>

            {/* Mobile Cart Content */}
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
              {cart.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280'
                }}>
                  <FaShoppingCart size={48} style={{ marginBottom: '16px', color: '#d1d5db' }} />
                  <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Your cart is empty</p>
                  <p style={{ fontSize: '14px' }}>Add some delicious items to get started!</p>
                </div>
              ) : (
                cart.map((item, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    backgroundColor: '#fef7f0',
                    borderRadius: '16px',
                    marginBottom: '12px',
                    border: '1px solid #fed7aa'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1f2937', margin: '0 0 4px 0' }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>
                          Rs.{item.price} each
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        style={{
                          padding: '6px',
                          backgroundColor: '#fee2e2',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          marginLeft: '8px'
                        }}
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <button
                          onClick={() => updateCartQuantity(index, Math.max(0, item.quantity - 1))}
                          style={{
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ef4444',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '8px 0 0 8px',
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
                          {item.quantity}
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
                            borderRadius: '0 8px 8px 0',
                            cursor: 'pointer'
                          }}
                        >
                          <FaPlus size={12} />
                        </button>
                      </div>
                      
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#374151' }}>
                        Rs.{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb', padding: '20px' }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #1f2937, #111827)', 
                  color: 'white', 
                  padding: '16px', 
                  borderRadius: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Grand Total</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>Rs.{getTotalAmount()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowMobileCart(false);
                    processOrder();
                  }}
                  disabled={processing}
                  style={{
                    width: '100%',
                    background: processing 
                      ? 'linear-gradient(135deg, #9ca3af, #6b7280)' 
                      : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    fontWeight: '700',
                    fontSize: '16px',
                    border: 'none',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  {processing ? (
                    <>
                      <FaSpinner style={{ animation: 'spin 1s linear infinite' }} size={16} />
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle size={16} />
                      COMPLETE ORDER • Rs.{getTotalAmount()}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </>
      )}

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