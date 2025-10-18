'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Onboarding from '../../../components/Onboarding';
import EmptyMenuPrompt from '../../../components/EmptyMenuPrompt';
import MenuItemCard from '../../../components/MenuItemCard';
import CategoryButton from '../../../components/CategoryButton';
import OrderSummary from '../../../components/OrderSummary';
import Notification from '../../../components/Notification';
import QRCodeModal from '../../../components/QRCodeModal';
import BulkMenuUpload from '../../../components/BulkMenuUpload';
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
  FaExpand,
  FaCompress,
  FaExpandArrowsAlt,
  FaChevronDown,
  FaSignOutAlt,
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
  FaBars,
  FaTable,
  FaCloudUploadAlt
} from 'react-icons/fa';
import apiClient from '../../../lib/api';
import { performLogout } from '../../../lib/logout';
import { t } from '../../../lib/i18n';
import { useLoading } from '../../../contexts/LoadingContext';

function RestaurantPOSContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoading } = useLoading();
  
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
  const [tables, setTables] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantChangeLoading, setRestaurantChangeLoading] = useState(false); // Loading state for restaurant changes
  const [processing, setProcessing] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null); // { orderId: 'ORD-123', show: true }
  const [notification, setNotification] = useState(null); // For top-right corner notifications
  const [tableNumber, setTableNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [orderLookup, setOrderLookup] = useState(''); // For table number or order ID lookup
  const [currentOrder, setCurrentOrder] = useState(null); // Current order being viewed/updated
  const [orderSearchLoading, setOrderSearchLoading] = useState(false); // Loading state for order search
  const [taxSettings, setTaxSettings] = useState(null); // Tax settings for the restaurant
  const [isLoadingOrder, setIsLoadingOrder] = useState(false); // Flag to prevent localStorage override during order loading
  
  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);
  
  // Fullscreen mode states
  const [isNavigationHidden, setIsNavigationHidden] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenStep, setFullscreenStep] = useState(0); // 0: normal, 1: nav hidden, 2: fullscreen
  const [showLogoutDropdown, setShowLogoutDropdown] = useState(false);
  const [user, setUser] = useState(null);
  
  // QR Code modal state
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  // Authentication guard - simplified with URL token support
  useEffect(() => {
    const checkAuth = () => {
      // Check if we have a token in URL (subdomain redirect case)
      const urlParams = new URLSearchParams(window.location.search);
      const tokenInUrl = urlParams.get('token');
      const userInUrl = urlParams.get('user');
      
      if (tokenInUrl) {
        console.log('🔄 Token found in URL, processing...');
        
        // Store token and user data immediately
        localStorage.setItem('authToken', tokenInUrl);
        if (userInUrl) {
          try {
            const userData = JSON.parse(decodeURIComponent(userInUrl));
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('✅ Token and user data stored from URL');
          } catch (error) {
            console.error('Failed to parse user data from URL:', error);
          }
        }
        
        // Clean up URL
        const url = new URL(window.location.href);
        url.searchParams.delete('token');
        url.searchParams.delete('user');
        window.history.replaceState({}, document.title, url.toString());
        
        console.log('✅ User authenticated with URL data');
      } else {
        // Normal authentication check
      if (!apiClient.isAuthenticated()) {
        console.log('🚫 User not authenticated, redirecting to login');
        router.replace('/login');
        return;
      }
      
      const user = apiClient.getUser();
      if (!user) {
        console.log('🚫 No user data found, redirecting to login');
        router.replace('/login');
        return;
      }
      
      console.log('✅ User authenticated:', user.role);
      }
    };

    checkAuth();
  }, [router]);

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Logout function
  const handleLogout = () => {
    // Clear all localStorage data
    apiClient.clearToken();
    
    // Perform logout with redirect to main domain
    performLogout();
  };

  // QR Code handler
  const handleShowQRCode = () => {
    setShowQRCodeModal(true);
  };

  // Handle menu items added via bulk upload
  const handleMenuItemsAdded = async () => {
    console.log('🔄 Menu items added via upload, reloading menu data...');
    if (selectedRestaurant?.id) {
      await loadMenu(selectedRestaurant.id);
    }
  };

  // Close logout dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showLogoutDropdown && !event.target.closest('[data-logout-dropdown]')) {
        setShowLogoutDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLogoutDropdown]);

  // Language change listener
  useEffect(() => {
    const handleLanguageChange = () => {
      // Force re-render when language changes
      setUser(prevUser => ({ ...prevUser }));
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
    };
  }, []);

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
        //setShowOnboarding(true);
      }
    }
  }, [router]);

  // Load cart from localStorage
  useEffect(() => {
    if (isLoadingOrder) {
      console.log('🔄 Skipping localStorage cart load - order loading in progress');
      return;
    }
    
    const savedCart = localStorage.getItem('dine_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('🔄 Loading cart from localStorage:', parsedCart);
        console.log('🔄 localStorage cart length:', parsedCart?.length);
        if (parsedCart?.length > 0) {
          console.log('🔄 localStorage cart items:', parsedCart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })));
        }
        setCart(parsedCart);
      } catch (e) {
        console.error('Error loading cart:', e);
      }
    } else {
      console.log('🔄 No cart found in localStorage');
    }
  }, [isLoadingOrder]);

  // Save cart to localStorage
  useEffect(() => {
    console.log('💾 Saving cart to localStorage:', cart);
    console.log('💾 Cart length being saved:', cart?.length);
    if (cart?.length > 0) {
      console.log('💾 Cart items being saved:', cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })));
    }
    localStorage.setItem('dine_cart', JSON.stringify(cart));
  }, [cart]);

  // Load tax settings for the restaurant
  const loadTaxSettings = useCallback(async (restaurantId) => {
    if (!restaurantId) return;
    
    try {
      console.log('🏛️ Loading tax settings for restaurant:', restaurantId);
      const taxSettingsResponse = await apiClient.getTaxSettings(restaurantId);
      console.log('🏛️ Tax settings response:', taxSettingsResponse);
      
      if (taxSettingsResponse.success) {
        setTaxSettings(taxSettingsResponse.taxSettings);
        console.log('🏛️ Tax settings loaded and cached:', taxSettingsResponse.taxSettings);
      } else {
        console.log('🏛️ No tax settings found for restaurant');
        setTaxSettings(null);
      }
    } catch (error) {
      console.error('🏛️ Error loading tax settings:', error);
      setTaxSettings(null);
    }
  }, []);

  // Load tax settings when restaurant changes
  useEffect(() => {
    if (selectedRestaurant?.id) {
      loadTaxSettings(selectedRestaurant.id);
    }
  }, [selectedRestaurant?.id, loadTaxSettings]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get user data to determine restaurant context
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      console.log('👤 Current user:', user?.name, user?.role, 'Restaurant ID:', user?.restaurantId);
      
      // Load restaurants
      console.log('🏢 Loading restaurants...');
      const restaurantsResponse = await apiClient.getRestaurants();
      console.log('🏢 Restaurants loaded:', restaurantsResponse.restaurants?.length || 0, 'restaurants');
      setRestaurants(restaurantsResponse.restaurants || []);
      
      let restaurant = null;
      
      // For staff members, use their assigned restaurant
      if (user?.restaurantId) {
        // First try to use restaurant data from login response
        if (user.restaurant) {
          restaurant = user.restaurant;
        } else {
          // Fallback to finding restaurant in the list
        restaurant = restaurantsResponse.restaurants.find(r => r.id === user.restaurantId);
        }
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
        console.log('🏠 Loading data for restaurant:', restaurant.name, restaurant.id);
        // Load menu and floors/tables for selected restaurant
        await Promise.all([
          loadMenu(restaurant.id),
          loadFloors(restaurant.id)
        ]);
        console.log('✅ Restaurant data loaded successfully');
      } else {
        // No restaurant found - automatically create one with default name
        console.log('📋 No restaurant found for user, creating default restaurant');
        try {
          const defaultRestaurant = {
            name: 'My Restaurant',
            description: 'Welcome to your restaurant!',
            address: 'Add your address here',
            phone: '',
            email: '',
            cuisine: 'Multi-cuisine',
            timings: {
              open: '09:00',
              close: '22:00',
              days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
            },
            settings: {
              currency: 'INR',
              taxRate: 18,
              serviceCharge: 0,
              deliveryFee: 0,
              minOrderAmount: 0
            },
            menu: {
              categories: [],
              items: [],
              lastUpdated: new Date()
            },
            ownerId: user.id,
            createdAt: new Date(),
            updatedAt: new Date()
          };

          const response = await apiClient.createRestaurant(defaultRestaurant);
          const newRestaurant = response.data.restaurant;
          
          // Update local storage
          localStorage.setItem('selectedRestaurant', JSON.stringify(newRestaurant));
          setSelectedRestaurant(newRestaurant);
          
          console.log('✅ Default restaurant created successfully');
        } catch (error) {
          console.error('Error creating default restaurant:', error);
          // Continue with empty state if creation fails
        }
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('Network Error') || error.message?.includes('fetch')) {
        setError('Network connection failed. Please check your internet connection and try again.');
      } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        setError('Your session has expired. Please log in again.');
      } else if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
        setError('You do not have permission to access this restaurant data.');
      } else if (error.message?.includes('404') || error.message?.includes('Not Found')) {
        setError('Restaurant data not found. Please contact support.');
      } else {
        setError(`Failed to load restaurant data: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Listen for restaurant changes from navigation
  useEffect(() => {
    const handleRestaurantChange = async (event) => {
      console.log('🏪 Dashboard page: Restaurant changed, reloading data', event.detail);
      setRestaurantChangeLoading(true); // Show loading overlay
      try {
        await loadInitialData(); // Reload all data with new restaurant
      } catch (error) {
        console.error('Error reloading data after restaurant change:', error);
      } finally {
        setRestaurantChangeLoading(false); // Hide loading overlay
      }
    };

    window.addEventListener('restaurantChanged', handleRestaurantChange);

    return () => {
      window.removeEventListener('restaurantChanged', handleRestaurantChange);
    };
  }, [loadInitialData]);
 
  // REMOVED - createSampleRestaurant function no longer needed
  
  // Handle onboarding completion
  const handleOnboardingComplete = async (restaurant) => {
    setShowOnboarding(false);
    setIsFirstTimeUser(false);
    localStorage.setItem('onboarding_completed', 'true');
    
    // Update restaurant list and selected restaurant
    setSelectedRestaurant(restaurant);
    setRestaurants(prev => [...prev, restaurant]);
    
    // Load menu and floors/tables for the new restaurant
    await Promise.all([
      loadMenu(restaurant.id),
      loadFloors(restaurant.id)
    ]);
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
      const menuItems = response.menuItems || [];
      setMenuItems(menuItems);
      
      if (menuItems.length === 0) {
        console.log('📋 No menu items found for restaurant:', restaurantId);
        // Don't set error, just log - empty menu is valid
      } else {
        console.log('📋 Loaded menu items:', menuItems.length);
      }
    } catch (error) {
      console.error('Error loading menu:', error);
      setMenuItems([]); // Set empty array instead of leaving undefined
      // Don't set error for menu loading failures - let user continue
    }
  };

  const loadFloors = async (restaurantId) => {
    try {
      console.log('🏢 Loading floors and tables for restaurant:', restaurantId);
      
      // Check cache first
      const cacheKey = `floors_${restaurantId}`;
      const cachedFloors = localStorage.getItem(cacheKey);
      
      if (cachedFloors) {
        const floorsData = JSON.parse(cachedFloors);
        const cacheAge = Date.now() - floorsData.timestamp;
        
        // Use cache if less than 5 minutes old
        if (cacheAge < 5 * 60 * 1000) {
          console.log('🏢 Using cached floors data');
          setFloors(floorsData.floors);
          // Extract all tables from floors for validation
          const allTables = floorsData.floors.flatMap(floor => floor.tables);
          setTables(allTables);
          return floorsData.floors;
        }
      }
      
      // Fetch fresh data from floors API
      const response = await apiClient.getFloors(restaurantId);
      const floorsData = response.floors || [];
      
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify({
        floors: floorsData,
        timestamp: Date.now()
      }));
      
      console.log('🏢 Loaded floors:', floorsData.length);
      console.log('🪑 Total tables across all floors:', floorsData.reduce((sum, floor) => sum + floor.tables.length, 0));
      console.log('🏢 Floors cached in localStorage with key:', cacheKey);
      
      setFloors(floorsData);
      // Extract all tables from floors for validation
      const allTables = floorsData.flatMap(floor => floor.tables);
      setTables(allTables);
      return floorsData;
      
    } catch (error) {
      console.error('Error loading floors:', error);
      // Return empty array on error, don't set error state
      return [];
    }
  };

  const validateTableNumber = async (tableNumber) => {
    if (!tableNumber || !tableNumber.trim()) {
      return { valid: true, table: null }; // Optional table number
    }

    const tableNum = tableNumber.trim().toLowerCase();
    console.log('🔍 Validating table number:', tableNum);

    // Check in current tables state first (check both name and number fields)
    let foundTable = tables.find(table => {
      const tableName = table.name && table.name.toString().toLowerCase();
      const tableNumber = table.number && table.number.toString().toLowerCase();
      return tableName === tableNum || tableNumber === tableNum;
    });

    if (foundTable) {
      console.log('✅ Table found in cache:', foundTable);
      console.log('📝 Table details - ID:', foundTable.id, 'Name:', foundTable.name, 'Status:', foundTable.status);
      return { valid: true, table: foundTable };
    }

    // If not found in cache, refresh from API
    console.log('🔄 Table not in cache, refreshing from API...');
    const freshFloors = await loadFloors(selectedRestaurant?.id);
    const freshTables = freshFloors.flatMap(floor => floor.tables);
    
    foundTable = freshTables.find(table => {
      const tableName = table.name && table.name.toString().toLowerCase();
      const tableNumber = table.number && table.number.toString().toLowerCase();
      return tableName === tableNum || tableNumber === tableNum;
    });

    if (foundTable) {
      console.log('✅ Table found after refresh:', foundTable);
      return { valid: true, table: foundTable };
    }

    console.log('❌ Table not found:', tableNum);
    return { 
      valid: false, 
      table: null, 
      error: `Table number "${tableNumber}" not found. Please check the table number and try again.` 
    };
  };

  const updateTableStatus = async (tableId, status, orderId = null) => {
    try {
      console.log(`🪑 Updating table ${tableId} status to ${status} with orderId: ${orderId}`);
      const result = await apiClient.updateTableStatus(tableId, status, orderId);
      console.log('✅ Table status update successful:', result);
      
      // Update local tables state
      setTables(prevTables => 
        prevTables.map(table => 
          table.id === tableId 
            ? { ...table, status, currentOrderId: orderId }
            : table
        )
      );
      
      // Update floors cache
      if (selectedRestaurant?.id) {
        const cacheKey = `floors_${selectedRestaurant.id}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          const cache = JSON.parse(cachedData);
          // Update table in floors structure
          cache.floors = cache.floors.map(floor => ({
            ...floor,
            tables: floor.tables.map(table => 
              table.id === tableId 
                ? { ...table, status, currentOrderId: orderId }
                : table
            )
          }));
          localStorage.setItem(cacheKey, JSON.stringify(cache));
          console.log(`🏢 Updated table ${tableId} status in floors cache`);
        }
      }
      
    } catch (error) {
      console.error('❌ Error updating table status:', error);
      console.error('Table ID:', tableId, 'Status:', status, 'Order ID:', orderId);
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

  // Handle orderId parameter from URL (for edit mode from Order History)
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const mode = searchParams.get('mode');
    
    if (orderId && selectedRestaurant?.id) {
      console.log('🔄 Dashboard: Order ID from URL:', orderId, 'Mode:', mode);
      
      // Set the order lookup value in search box
      setOrderLookup(orderId);
      
      // Add a small delay to ensure the search box is updated, then trigger search directly
      setTimeout(async () => {
        console.log('🔄 Auto-triggering order lookup for:', orderId);
        await triggerOrderLookup(orderId);
      }, 500); // 500ms delay to handle any race conditions
    }
  }, [searchParams, selectedRestaurant?.id]);

  const filteredItems = (menuItems || []).filter(item => {
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
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      if (existingItemIndex !== -1) {
        // Update existing item in place (don't move it)
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = { 
          ...updatedCart[existingItemIndex], 
          quantity: updatedCart[existingItemIndex].quantity + 1 
        };
        return updatedCart;
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

  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCart(prevCart => {
      return prevCart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: Math.max(1, newQuantity) }
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0);
    });
  };

  const getTotalAmount = () => {
    const total = cart.reduce((sum, item) => {
      const itemTotal = item.price * item.quantity;
      console.log(`💰 Cart item: ${item.name} - Price: ${item.price}, Qty: ${item.quantity}, Total: ${itemTotal}`);
      return sum + itemTotal;
    }, 0);
    console.log(`💰 Cart total: ${total}`);
    return total;
  };

  const handleQuickSearch = (e) => {
    if (e.key === 'Enter' && quickSearch.trim()) {
      const searchValue = quickSearch.trim().toLowerCase();
      const foundItem = (menuItems || []).find(item => 
        item.shortCode?.toLowerCase() === searchValue || 
        item.name.toLowerCase().includes(searchValue)
      );
      
      if (foundItem) {
        addToCart(foundItem);
        setQuickSearch('');
      }
    }
  };

  // Reset UI state for fresh order
  const handleFreshOrder = () => {
    setCart([]);
    setTableNumber('');
    setCustomerName('');
    setCustomerMobile('');
    setOrderLookup('');
    setCurrentOrder(null);
    setSelectedTable(null);
    setManualTableNumber('');
    setError('');
    setNotification(null);
    setOrderSuccess(null);
    setOrderComplete(false);
    setPlacingOrder(false);
    
    // Show success notification
    setNotification({
      type: 'success',
      title: 'Fresh Order Started',
      message: 'Ready to take a new order!',
      show: true
    });
  };

  // Direct order lookup function (for auto-trigger from URL)
  const triggerOrderLookup = useCallback(async (orderId) => {
    if (!orderId || !selectedRestaurant?.id) return;
    
      try {
        setOrderSearchLoading(true);
      setIsLoadingOrder(true); // Set flag to prevent localStorage override
        setError(''); // Clear any existing errors
        
      console.log('🔍 Auto-triggered order lookup - Restaurant ID:', selectedRestaurant?.id);
      console.log('🔍 Auto-triggered order lookup - Search value:', orderId);
        
        const response = await apiClient.getOrders(selectedRestaurant.id, {
        search: orderId
          // Don't filter by status - let backend handle filtering out completed orders
        });
        
      console.log('🔍 Auto-triggered order lookup response:', response);
        
        if (response.orders && response.orders.length > 0) {
          const order = response.orders[0]; // Get the first matching order
        const mode = searchParams.get('mode');
        
          setCurrentOrder(order);
        
        // Clear any existing cart from localStorage to avoid conflicts
        localStorage.removeItem('dine_cart');
        console.log('🧹 Cleared localStorage cart before loading order');
          
          // Load the order items into cart for editing
        const orderItems = Array.isArray(order.items) ? order.items.map(item => {
          console.log('🔍 Order item data:', item);
          console.log('🔍 Available fields:', Object.keys(item));
          
          // Try multiple possible name fields
          let name = 'Unknown Item';
          if (item.name) {
            name = item.name;
          } else if (item.menuItem?.name) {
            name = item.menuItem.name;
          } else if (item.itemName) {
            name = item.itemName;
          } else if (item.productName) {
            name = item.productName;
          }
          
          // Try multiple possible price fields
          let price = 0;
          if (item.price && !isNaN(parseFloat(item.price))) {
            price = parseFloat(item.price);
          } else if (item.total && !isNaN(parseFloat(item.total))) {
            price = parseFloat(item.total);
          } else if (item.unitPrice && !isNaN(parseFloat(item.unitPrice))) {
            price = parseFloat(item.unitPrice);
          } else if (item.itemPrice && !isNaN(parseFloat(item.itemPrice))) {
            price = parseFloat(item.itemPrice);
          } else if (item.menuItem?.price && !isNaN(parseFloat(item.menuItem.price))) {
            price = parseFloat(item.menuItem.price);
          }
          
          // If price is still 0 or NaN, try to calculate from total/quantity
          if (!price || isNaN(price) || price <= 0) {
            const total = parseFloat(item.total) || parseFloat(item.itemTotal) || parseFloat(item.subtotal) || 0;
            const qty = parseInt(item.quantity) || 1;
            if (total > 0 && qty > 0) {
              price = total / qty;
            }
          }
          
          // Final fallback - if still no price, set to 0 but log warning
          if (!price || isNaN(price) || price <= 0) {
            console.warn(`⚠️ Could not determine price for item:`, item);
            price = 0;
          }
          
          // Try multiple possible ID fields
          let id = item.menuItemId || item.id || item.menuItem?.id || item.itemId;
          
          console.log(`🔍 Parsed - Name: ${name}, Price: ${price}, ID: ${id}, Quantity: ${item.quantity}`);
          
          return {
            id: id,
            name: name,
            price: price || 0,
            quantity: parseInt(item.quantity) || 1,
            category: item.category || item.menuItem?.category || 'main',
            // Store original data for reference
            originalData: item
          };
        }) : [];
        
        // If we have unknown items, try to fetch menu items and match them BEFORE setting cart
        const hasUnknownItems = orderItems.some(item => item.name === 'Unknown Item');
        if (hasUnknownItems && selectedRestaurant?.id) {
          console.log('🔍 Found unknown items, fetching menu items to match...');
          try {
            const menuResponse = await apiClient.getMenuItems(selectedRestaurant.id);
            if (menuResponse.success && menuResponse.items) {
              const updatedItems = orderItems.map(cartItem => {
                if (cartItem.name === 'Unknown Item') {
                  // Try to match by ID first
                  let menuItem = menuResponse.items.find(menuItem => 
                    menuItem.id === cartItem.id || 
                    menuItem.id === cartItem.originalData?.menuItemId ||
                    menuItem.id === cartItem.originalData?.id
                  );
                  
                  // If no match by ID, try to match by name (fuzzy matching)
                  if (!menuItem) {
                    const originalName = cartItem.originalData?.name || 
                                       cartItem.originalData?.menuItem?.name ||
                                       cartItem.originalData?.itemName ||
                                       cartItem.originalData?.productName;
                    
                    if (originalName) {
                      menuItem = menuResponse.items.find(menuItem => 
                        menuItem.name.toLowerCase().includes(originalName.toLowerCase()) ||
                        originalName.toLowerCase().includes(menuItem.name.toLowerCase())
                      );
                    }
                  }
                  
                  if (menuItem) {
                    console.log(`🔍 Found menu item match: ${menuItem.name} - ${menuItem.price}`);
                    return {
                      ...cartItem,
                      id: menuItem.id,
                      name: menuItem.name,
                      price: parseFloat(menuItem.price) || cartItem.price,
                      category: menuItem.category || cartItem.category
                    };
                  }
                }
                return cartItem;
              });
              
              console.log('🔍 Setting cart with matched items:', updatedItems);
              setCart(updatedItems);
              console.log('🔍 Cart state immediately after setCart:', updatedItems);
              
              // Add a small delay to ensure cart state is updated
              setTimeout(() => {
                console.log('✅ Cart state should be updated with matched items');
              }, 200);
            } else {
              console.log('🔍 No menu items found, setting cart with original items');
          setCart(orderItems);
              setTimeout(() => {
                console.log('✅ Cart state updated with original items');
              }, 200);
            }
          } catch (error) {
            console.error('🔍 Error fetching menu items for matching:', error);
            console.log('🔍 Setting cart with original items due to error');
            setCart(orderItems);
            setTimeout(() => {
              console.log('✅ Cart state updated with original items (error case)');
            }, 200);
          }
        } else {
          console.log('🔍 No unknown items, setting cart directly');
          setCart(orderItems);
          setTimeout(() => {
            console.log('✅ Cart state updated directly');
          }, 200);
        }
        
          setTableNumber(order.tableNumber || '');
          setOrderType(order.orderType || 'dine-in');
          setPaymentMethod(order.paymentMethod || 'cash');
          
        // Show appropriate notification based on mode
        if (mode === 'view') {
          setNotification({
            type: 'info',
            title: 'Order Loaded for Viewing 👁️',
            message: `Order "${orderId}" loaded - View mode`,
            show: true
          });
        } else if (mode === 'edit') {
          // Check if order is completed
          if (order.status === 'completed') {
            setNotification({
              type: 'success',
              title: 'New Order Created 📝',
              message: `New order created based on completed order "${orderId}" - Ready to modify!`,
              show: true
            });
            // Clear current order for new order creation
            setCurrentOrder(null);
          } else {
            setNotification({
              type: 'success',
              title: 'Order Ready for Editing ✏️',
              message: `Order "${orderId}" loaded successfully - Ready to edit!`,
              show: true
            });
          }
        } else if (mode === 'duplicate') {
          setNotification({
            type: 'success',
            title: 'New Order Created 📝',
            message: `New order created based on completed order "${orderId}" - Ready to modify!`,
            show: true
          });
          // Clear current order for new order creation
          setCurrentOrder(null);
        } else {
          setNotification({
            type: 'success',
            title: 'Order Found! 🎉',
            message: `Order "${orderId}" loaded successfully - Ready to edit!`,
            show: true
          });
        }
          
        // Keep the search value in the input box
        // setOrderLookup(''); // Removed this line
          
        } else {
          setNotification({
          type: 'error',
            title: 'Order Not Found',
          message: `No order found with ID "${orderId}"`,
            show: true
          });
        // Keep the search value in the input box
        // setOrderLookup(''); // Removed this line
        }
      } catch (error) {
      console.error('Auto-triggered order lookup error:', error);
        setNotification({
          type: 'error',
        title: 'Error Loading Order',
        message: error.message || 'Failed to load order',
          show: true
        });
      // Keep the search value in the input box
      // setOrderLookup(''); // Removed this line
      } finally {
        setOrderSearchLoading(false);
      setIsLoadingOrder(false); // Clear flag to allow localStorage loading
      }
  }, [selectedRestaurant?.id, searchParams]);

  const handleOrderLookup = async (e) => {
    if (e.key === 'Enter' && orderLookup.trim()) {
      await triggerOrderLookup(orderLookup.trim());
    }
  };

  const processOrder = async () => {
    if (cart.length === 0 || !selectedRestaurant?.id) return;

    try {
      setProcessing(true);
      setError('');

      // Get current user/staff info
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Check if table number changed in edit mode
      const tableToUse = tableNumber || selectedTable?.number;
      let tableChanged = false;
      
      if (currentOrder && tableToUse && tableToUse !== currentOrder.tableNumber) {
        tableChanged = true;
        console.log('⚠️ Table number changed from', currentOrder.tableNumber, 'to', tableToUse);
        
        // Show warning but continue with order completion
        setNotification({
          type: 'warning',
          title: 'Table Changed! ⚠️',
          message: `Table changed from "${currentOrder.tableNumber || 'N/A'}" to "${tableToUse}". Order will be completed if table is available.`,
          show: true
        });
      }

      // Check if we're updating an existing order or creating a new one
      if (currentOrder) {
        console.log('🔄 Updating existing order:', currentOrder.id);
        
        // Update existing order with completed status
        const updateData = {
          items: cart.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            notes: '',
            name: item.name,
            price: item.price
          })),
          tableNumber: tableToUse || currentOrder.tableNumber,
          orderType,
          paymentMethod,
          status: 'completed', // Mark as completed
          paymentStatus: 'paid', // Mark payment as completed
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastUpdatedBy: {
            name: currentUser.name || 'Staff',
            id: currentUser.id,
            role: currentUser.role || 'waiter'
          },
          customerInfo: {
            name: customerName || currentOrder.customerInfo?.name || 'Walk-in Customer',
            phone: customerMobile || currentOrder.customerInfo?.phone || null,
            tableNumber: tableToUse || currentOrder.tableNumber || null
          }
        };

        console.log('🔄 Update data for existing order:', updateData);
        const response = await apiClient.updateOrder(currentOrder.id, updateData);
        
        if (response.data) {
          // Process payment for the updated order
          console.log('💳 Processing payment for updated order:', currentOrder.id);
          await apiClient.verifyPayment({
            orderId: currentOrder.id,
            paymentMethod: paymentMethod,
            amount: getTotalAmount(),
            userId: currentUser.id,
            restaurantId: selectedRestaurant.id,
            paymentStatus: 'completed'
          });

          // Show notification for order completion
          setNotification({
            type: 'success',
            title: 'Order Completed! 💳',
            message: `Order #${currentOrder.id.slice(-8).toUpperCase()} has been completed and payment processed.`,
            show: true
          });

          setOrderSuccess({
            orderId: currentOrder.id,
            show: true,
            message: 'Order Completed! 💳'
          });
          
          // Clear current order and cart
          setCurrentOrder(null);
          clearCart();
        }
      } else {
        console.log('🆕 Creating new order for direct billing');
        
        // Create new order for direct billing
      const orderData = {
        restaurantId: selectedRestaurant.id,
          tableNumber: tableToUse || null,
        orderType,
        paymentMethod,
          status: 'completed', // Set status to completed since payment is processed immediately
        staffInfo: {
            userId: currentUser.id,
          name: currentUser.name || 'Staff',
            loginId: currentUser.loginId || currentUser.id,
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
            name: customerName || 'Walk-in Customer',
            phone: customerMobile || null,
            tableNumber: tableToUse || null
        },
        notes: ''
      };

        console.log('🛒 Creating order with data:', orderData);
        console.log('🛒 Order data status:', orderData.status);
        console.log('🛒 Order data staffInfo:', orderData.staffInfo);
      const orderResponse = await apiClient.createOrder(orderData);
      const orderId = orderResponse.order.id;
        console.log('✅ Order created successfully:', orderId);
        console.log('✅ Order response:', orderResponse);

      // Update table status if table is selected
      if (selectedTable && selectedTable.id) {
        await apiClient.updateTableStatus(selectedTable.id, 'occupied', orderId);
      }

      // Process payment based on method
        console.log('💳 Processing payment for order:', orderId, 'Method:', paymentMethod);
      if (paymentMethod === 'cash') {
          const paymentResult = await apiClient.verifyPayment({
          orderId,
            paymentMethod: 'cash',
            amount: getTotalAmount(),
            userId: currentUser.id,
            restaurantId: selectedRestaurant.id,
            paymentStatus: 'completed' // Mark payment as completed
          });
          console.log('✅ Cash payment verified:', paymentResult);
      } else if (paymentMethod === 'upi') {
          const paymentResult = await apiClient.verifyPayment({
          orderId,
            paymentMethod: 'upi',
            amount: getTotalAmount(),
            userId: currentUser.id,
            restaurantId: selectedRestaurant.id,
            paymentStatus: 'completed' // Mark payment as completed
          });
          console.log('✅ UPI payment verified:', paymentResult);
      } else if (paymentMethod === 'card') {
          const paymentResult = await apiClient.verifyPayment({
          orderId,
            paymentMethod: 'card',
            amount: getTotalAmount(),
            userId: currentUser.id,
            restaurantId: selectedRestaurant.id,
            paymentStatus: 'completed' // Mark payment as completed
          });
          console.log('✅ Card payment verified:', paymentResult);
        }

        // Note: Table status management is now handled by backend
        console.log(`🪑 Table ${tableNumber || 'N/A'} - status managed by backend`);

      // Show notification for billing completion
        console.log('🎉 Order processing completed successfully:', orderId);
      setNotification({
        type: 'success',
        title: 'Billing Complete! 💳',
        message: `Order #${orderId} has been successfully completed and payment processed.`,
        show: true
      });

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

        // Return order ID for invoice generation
        return { orderId };
      }

    } catch (error) {
      console.error('Order processing error:', error);
      
      // Extract error message from the API response
      let errorMessage = 'Failed to process order. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Show notification instead of full-page error
      setNotification({
        type: 'error',
        title: 'Billing Failed! ❌',
        message: errorMessage,
        show: true
      });
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return null;
    } finally {
      setProcessing(false);
    }
  };

  const saveOrder = async () => {
    if (cart.length === 0) {
      setNotification({
        type: 'error',
        title: 'Empty Cart! 🛒',
        message: 'Please add items to cart before saving.',
        show: true
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Check if restaurant is selected
    if (!selectedRestaurant?.id) {
      setNotification({
        type: 'error',
        title: 'No Restaurant! 🏪',
        message: 'Please set up a restaurant first.',
        show: true
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      const orderData = {
        restaurantId: selectedRestaurant?.id,
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

      const response = await apiClient.createOrder(orderData);
      
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
      
      // Extract error message from the API response
      let errorMessage = 'Failed to save order. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Show notification instead of full-page error
      setNotification({
        type: 'error',
        title: 'Save Failed! ❌',
        message: errorMessage,
        show: true
      });
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } finally {
      setProcessing(false);
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      setNotification({
        type: 'error',
        title: 'Empty Cart! 🛒',
        message: 'Please add items to cart before placing order.',
        show: true
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    // Check if restaurant is selected
    if (!selectedRestaurant?.id) {
      setNotification({
        type: 'error',
        title: 'No Restaurant! 🏪',
        message: 'Please set up a restaurant first.',
        show: true
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      setPlacingOrder(true);
      setError(null);

      // Check if table number changed in edit mode
      const tableToUse = tableNumber || selectedTable?.number;
      let tableChanged = false;
      
      if (currentOrder && tableToUse && tableToUse !== currentOrder.tableNumber) {
        tableChanged = true;
        console.log('⚠️ Table number changed from', currentOrder.tableNumber, 'to', tableToUse);
        
        // Show warning but continue with order placement
        setNotification({
          type: 'warning',
          title: 'Table Changed! ⚠️',
          message: `Table changed from "${currentOrder.tableNumber || 'N/A'}" to "${tableToUse}". Order will be placed if table is available.`,
          show: true
        });
      }

      // Check if we're updating an existing order or creating a new one
      if (currentOrder) {
        // Update existing order
        const updateData = {
          items: cart.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            notes: ''
          })),
          tableNumber: tableToUse || currentOrder.tableNumber,
          orderType,
          paymentMethod,
          updatedAt: new Date().toISOString(),
          lastUpdatedBy: {
            name: 'Staff Member',
            id: 'staff-001'
          }
        };

        const response = await apiClient.updateOrder(currentOrder.id, updateData);
        
        if (response.data) {
          // Show notification for order update
          setNotification({
            type: 'success',
            title: 'Order Updated! ✏️👨‍🍳',
            message: `Order #${currentOrder.id} has been updated and sent to kitchen with new items.`,
            show: true
          });

          setOrderSuccess({
            orderId: currentOrder.id,
            show: true,
            message: 'Order Updated! ✏️'
          });
          
          // Clear current order and cart
          setCurrentOrder(null);
          clearCart();
        }
      } else {
        // Create new order
        const orderData = {
          restaurantId: selectedRestaurant?.id,
          tableNumber: tableNumber || selectedTable?.number || null,
          items: cart.map(item => ({
            menuItemId: item.id,
            quantity: item.quantity,
            notes: ''
          })),
          customerInfo: {
            name: customerName || null,
            phone: customerMobile || null,
            tableNumber: tableNumber || selectedTable?.number || null
          },
          orderType,
          paymentMethod,
          staffInfo: {
            name: 'Staff Member',
            id: 'staff-001'
          },
          notes: '',
          status: 'confirmed' // Place order to kitchen
        };

        console.log('Creating order with data:', orderData);
      const response = await apiClient.createOrder(orderData);
      console.log('Create order response:', response);
        
        if (response.order) {
          console.log('Updating order status to confirmed...');
          // Update order status to confirmed (sent to kitchen)
          await apiClient.updateOrderStatus(response.order.id, 'confirmed', selectedRestaurant?.id);

          // Note: Table status management is now handled by backend
          console.log(`🪑 Table ${tableNumber || 'N/A'} - status managed by backend`);

          // Show notification in top-right corner
          setNotification({
            type: 'success',
            title: 'Order Sent to Chef! 👨‍🍳',
            message: `Order #${response.order.id.slice(-6)} has been placed and sent to the kitchen for preparation.`,
            show: true
          });

          // Show order success in the cart area
          setOrderSuccess({
            orderId: response.order.id,
            show: true,
            message: 'Order Placed to Kitchen! 👨‍🍳'
          });
          
          // Clear cart after showing success
          clearCart();
          
          // Hide notification after 4 seconds
          setTimeout(() => {
            setNotification(null);
          }, 4000);
        }
      }
    } catch (error) {
      console.error('Place order error:', error);
      
      // Extract error message from the API response
      let errorMessage = 'Failed to place order. Please try again.';
      if (error.message) {
        errorMessage = error.message;
      }
      
      // Show notification instead of full-page error
      setNotification({
        type: 'error',
        title: 'Order Failed! ❌',
        message: errorMessage,
        show: true
      });
      
      // Auto-hide notification after 5 seconds
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } finally {
      setPlacingOrder(false);
    }
  };

  const clearCart = () => {
    setCart([]);
    setTableNumber('');
    setCurrentOrder(null);
    setOrderLookup('');
    localStorage.removeItem('dine_cart');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setOrderSuccess(null);
    }, 3000);
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

  // Fullscreen mode toggle function
  const toggleFullscreen = useCallback(() => {
    if (fullscreenStep === 0) {
      // Step 1: Hide navigation
      setIsNavigationHidden(true);
      setFullscreenStep(1);
      // Dispatch event to layout
      window.dispatchEvent(new CustomEvent('navigationToggle', { 
        detail: { hidden: true } 
      }));
    } else if (fullscreenStep === 1) {
      // Step 2: Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
      setIsFullscreen(true);
      setFullscreenStep(2);
    } else if (fullscreenStep === 2) {
      // Step 3: Exit fullscreen and show navigation
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
      setIsNavigationHidden(false);
      setFullscreenStep(0);
      // Dispatch event to layout
      window.dispatchEvent(new CustomEvent('navigationToggle', { 
        detail: { hidden: false } 
      }));
    }
  }, [fullscreenStep]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      
      if (!isCurrentlyFullscreen && isFullscreen) {
        // User exited fullscreen manually, go back to normal state
        setIsFullscreen(false);
        setIsNavigationHidden(false);
        setFullscreenStep(0);
        // Dispatch event to layout
        window.dispatchEvent(new CustomEvent('navigationToggle', { 
          detail: { hidden: false } 
        }));
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);

  // Show onboarding if needed
  if (showOnboarding) {
    return (
      <>
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
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
            <p style={{ fontSize: '18px', color: '#6b7280' }}>{t('common.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, rgb(255 246 241) 0%, rgb(254 245 242) 50%, rgb(255 244 243) 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0
        }} />
        
        <div style={{ 
          textAlign: 'center', 
          maxWidth: '500px', 
          padding: '40px 20px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            width: '100px', 
            height: '100px', 
            backgroundColor: '#fef2f2',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px auto',
            animation: 'bounce 2s infinite'
          }}>
            <FaUtensils size={40} style={{ color: '#ef4444' }} />
          </div>
          
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Something Went Wrong! 😔
          </h1>
          
          <p style={{ 
            fontSize: '18px', 
            color: '#374151', 
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            {error}
          </p>
          
          <p style={{ 
            fontSize: '16px', 
            color: '#6b7280', 
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            We&apos;re having trouble loading your restaurant data. Please try refreshing the page or contact support if the issue persists.
          </p>
          
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => {
                setError('');
                loadInitialData();
              }}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                transform: 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/login')}
              style={{
                padding: '16px 32px',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: '2px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.15)';
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)';
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}</style>
      </div>
    );
  }

  // Show onboarding if no restaurant is selected and user hasn't completed onboarding
  if (!selectedRestaurant && !showOnboarding) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 80px)',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
            `,
            zIndex: 0
          }} />
          
          {/* Floating Elements */}
          <div style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '120px',
            height: '120px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '20%',
            right: '15%',
            width: '80px',
            height: '80px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '5%',
            width: '60px',
            height: '60px',
            background: 'rgba(255, 255, 255, 0.06)',
            borderRadius: '50%',
            animation: 'float 10s ease-in-out infinite'
          }} />
          
          <div style={{ 
            textAlign: 'center', 
            maxWidth: '800px',
            position: 'relative',
            zIndex: 1
          }}>
            {/* Hero Icon */}
            <div style={{
              fontSize: '120px',
              marginBottom: '32px',
              animation: 'pulse 2s ease-in-out infinite',
              filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.2))'
            }}>
              🍽️
            </div>
            
            {/* Main Heading */}
            <h1 style={{ 
              fontSize: '48px', 
              fontWeight: '900', 
              color: 'white', 
              marginBottom: '24px',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
              lineHeight: '1.2'
            }}>
              Restaurant Management
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #fef3c7, #fde68a)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'block',
                marginTop: '8px'
              }}>
                Revolution 🚀
              </span>
            </h1>
            
            {/* Subtitle */}
            <p style={{ 
              fontSize: '24px', 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '16px',
              fontWeight: '600',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}>
              The Future of Dining is Here
            </p>
            
            {/* Description */}
            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255, 255, 255, 0.8)', 
              marginBottom: '32px',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 32px auto'
            }}>
              Join thousands of restaurants already using our AI-powered POS system. 
              Transform your business with intelligent order management, real-time analytics, 
              and seamless customer experiences.
            </p>
            
            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '40px',
              marginBottom: '40px',
              flexWrap: 'wrap'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
                  1000+
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Restaurants
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
                  30%
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  More Savings
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
                  24/7
                </div>
                <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Support
                </div>
              </div>
            </div>
            
            {/* CTA Button */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => setShowOnboarding(true)}
                style={{
                  padding: '20px 40px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  color: '#dc2626',
                  border: 'none',
                  borderRadius: '16px',
                  fontWeight: '700',
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(0)',
                  backdropFilter: 'blur(10px)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)';
                  e.target.style.background = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                }}
              >
                🚀 Launch Restaurant System
              </button>
            </div>
            
            {/* Trust Indicators */}
            <div style={{
              marginTop: '40px',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                fontWeight: '500'
              }}>
                ✨ Bank-Level Security • 🛡️ GDPR Compliant • ⚡ Lightning Fast
              </p>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  // Removed full screen success - using inline success instead

  return (
    <div 
      className={`page-transition ${isLoading ? 'loading' : ''}`}
      style={{ 
      height: isMobile ? 'auto' : 'calc(100vh - 80px)', // Full height minus navigation on desktop
      backgroundColor: '#f8fafc', 
      display: 'flex', 
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      overflow: 'visible', // Always allow scrolling
      minHeight: isMobile ? '100vh' : 'calc(100vh - 80px)' // Ensure full viewport height minus nav
    }}>
      {/* Restaurant Change Loading Overlay */}
      {restaurantChangeLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(2px)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <FaSpinner style={{ 
              fontSize: '32px', 
              color: '#ef4444', 
              animation: 'spin 1s linear infinite',
              marginBottom: '12px'
            }} />
            <p style={{ fontSize: '16px', color: '#374151', fontWeight: '600', margin: 0 }}>
              Switching restaurant...
            </p>
            <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>
              Loading menu and data
            </p>
          </div>
        </div>
      )}
      
      {/* Header */}
      
      {/* Mobile Top Bar */}
      {isMobile && (
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          {/* Restaurant Name */}
          <div style={{
            flex: 1,
            minWidth: 0
          }}>
            <h2 style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#1f2937',
              margin: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {selectedRestaurant?.name || 'My Restaurant'}
            </h2>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              margin: '2px 0 0 0',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {filteredItems.length} items • {selectedCategory === 'all-items' ? 'All Categories' : categories.find(c => c.id === selectedCategory)?.name}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            {/* Categories Button */}
          <button
            onClick={() => setShowMobileSidebar(true)}
            style={{
                padding: '10px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
                borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
                gap: '6px',
              fontWeight: '600',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                minWidth: '80px',
                justifyContent: 'center'
              }}
            >
              <FaBars size={14} />
              Menu
          </button>
          
          {/* Cart Button */}
          <button
            onClick={() => setShowMobileCart(true)}
            style={{
                padding: '10px',
              backgroundColor: cart.length > 0 ? '#10b981' : '#6b7280',
              color: 'white',
              border: 'none',
                borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
                gap: '6px',
              fontWeight: '600',
                fontSize: '12px',
              position: 'relative',
                boxShadow: cart.length > 0 ? '0 2px 8px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(107, 114, 128, 0.3)',
                minWidth: '80px',
                justifyContent: 'center'
            }}
          >
              <FaShoppingCart size={14} />
              Cart
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                  fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div style={{ 
        display: 'flex', 
        flex: 1, 
        overflow: 'visible', // Always allow scrolling
        flexDirection: isMobile ? 'column' : 'row',
        height: isMobile ? 'auto' : '100%', // Use 100% since parent has calc(100vh - 80px)
        minHeight: isMobile ? 'calc(100vh - 80px)' : '100%' // Account for navigation height
      }}>
        {/* Desktop Menu Sections Sidebar - Redesigned */}
        {!isMobile && (
          <div style={{ 
            width: '280px', 
            height: '100%',
            backgroundColor: '#ffffff', 
            borderRight: '1px solid #f3f4f6', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
          <div style={{ 
            padding: '20px 16px', 
            borderBottom: '1px solid #f3f4f6',
            background: 'linear-gradient(135deg, #fef7f0 0%, #fed7aa 100%)',
            borderRadius: '5px'
          }}>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '6px',
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px'
            }}>
              {t('dashboard.menuCategories')}
            </h2>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={14} />
              <input
                type="text"
                placeholder={t('dashboard.searchOrder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '500',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.2)';
                  e.target.style.border = '1px solid #ef4444';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  e.target.style.border = 'none';
                }}
              />
            </div>
          </div>
          
          <div style={{ 
            padding: '12px 8px', 
            overflowY: 'auto', 
            flex: 1, // Fill remaining space
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }} className="hide-scrollbar">
            
            {categories.map((category, index) => {
              const categoryItems = category.id === 'all-items' 
                ? (menuItems || [])
                : (menuItems || []).filter(item => item.category?.toLowerCase() === category.id);
              const isSelected = selectedCategory === category.id;
              
              // Color variations for different categories
              const colors = [
                { bg: '#ef4444', light: '#fef2f2', text: '#dc2626' }, // Red
                { bg: '#f97316', light: '#fff7ed', text: '#ea580c' }, // Orange
                { bg: '#10b981', light: '#ecfdf5', text: '#059669' }, // Emerald
                { bg: '#3b82f6', light: '#eff6ff', text: '#2563eb' }, // Blue
                { bg: '#8b5cf6', light: '#f3e8ff', text: '#7c3aed' }, // Purple
                { bg: '#f59e0b', light: '#fffbeb', text: '#d97706' }, // Amber
                { bg: '#06b6d4', light: '#ecfeff', text: '#0891b2' }, // Cyan
                { bg: '#ec4899', light: '#fdf2f8', text: '#db2777' }, // Pink
              ];
              
              const colorScheme = colors[index % colors.length];
              
              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    padding: '12px 16px',
                    margin: '2px 0',
                    backgroundColor: isSelected ? colorScheme.bg : 'transparent',
                    borderRadius: '0px',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = colorScheme.light;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                      animation: 'shimmer 2s infinite'
                    }} />
                  )}
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {/* Category Icon */}
                      <div style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : colorScheme.bg,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: isSelected ? 'white' : 'white',
                        boxShadow: isSelected ? '0 2px 8px rgba(0,0,0,0.2)' : `0 2px 6px ${colorScheme.bg}40`
                      }}>
                        {category.emoji}
                      </div>
                      
                      <div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: isSelected ? 'white' : colorScheme.text,
                          marginBottom: '2px',
                          lineHeight: '1.3'
                        }}>
                          {category.name}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: isSelected ? 'rgba(255,255,255,0.8)' : '#6b7280',
                          fontWeight: '500'
                        }}>
                          {categoryItems.length} items
                        </div>
                      </div>
                    </div>
                    
                    {isSelected && (
                      <div style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: 'white',
                        borderRadius: '0px'
                      }} />
                    )}
                  </div>
                </div>
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
          overflow: 'visible', // Always allow scrolling
          height: isMobile ? 'auto' : '100%',
          minHeight: isMobile ? '400px' : '100%',
          paddingBottom: isMobile ? '80px' : '0', // Add bottom padding for mobile cart button
          maxHeight: isMobile ? 'none' : '100%'
        }}>
          {/* Show empty menu prompt if no menu items */}
          {filteredItems.length === 0 && (menuItems || []).length === 0 && !loading ? (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              width: '100%'
            }}>
              <EmptyMenuPrompt 
                restaurantName={selectedRestaurant?.name} 
                selectedRestaurant={selectedRestaurant}
                onAddMenu={() => router.push('/menu')}
                onMenuItemsAdded={loadInitialData}
              />
            </div>
          ) : (
          <>
            {/* Menu Header */}
          <div style={{ padding: '8px 12px', backgroundColor: 'white', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
              {/* <div>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {categories.find(c => c.id === selectedCategory)?.name || 'All Items'}
                </h2>
                <p style={{ color: '#6b7280', margin: '2px 0 0 0', fontSize: '11px' }}>{filteredItems.length} items</p>
              </div> */}
              
              {/* Quick Search */}
              
            </div>
            
            {/* Order Management Row - Redesigned */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              gap: '12px', 
              paddingTop: '8px', 
              borderTop: '1px solid #f3f4f6',
              minHeight: '44px' // Consistent height for all elements
            }}>
              {/* Left side - Order Search */}
              <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
                <FaSearch style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: '#6b7280', 
                  opacity: 0.7,
                  display: orderSearchLoading ? 'none' : 'block'
                }} size={14} />
                {orderSearchLoading && (
                  <FaSpinner style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#ef4444', 
                    opacity: 0.8,
                    animation: 'spin 1s linear infinite'
                  }} size={14} />
                )}
                <input
                  type="text"
                  placeholder={t('dashboard.searchOrder')}
                  value={orderLookup}
                  onChange={(e) => setOrderLookup(e.target.value)}
                  onKeyPress={handleOrderLookup}
                  disabled={orderSearchLoading}
                  style={{
                    width: '100%',
                    height: '40px', // Fixed height
                    paddingLeft: '36px',
                    paddingRight: '12px',
                    border: orderLookup.trim() ? '2px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    backgroundColor: orderSearchLoading ? '#f9fafb' : (orderLookup.trim() ? '#fef2f2' : '#ffffff'),
                    fontSize: '14px',
                    fontWeight: '500',
                    outline: 'none',
                    color: orderSearchLoading ? '#9ca3af' : '#374151',
                    transition: 'all 0.2s ease',
                    cursor: orderSearchLoading ? 'not-allowed' : 'text',
                    boxShadow: orderLookup.trim() ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = orderLookup.trim() ? '#fef2f2' : '#ffffff';
                    e.target.style.borderColor = '#ef4444';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = orderLookup.trim() ? '#fef2f2' : '#ffffff';
                    e.target.style.borderColor = orderLookup.trim() ? '#ef4444' : '#d1d5db';
                    e.target.style.boxShadow = orderLookup.trim() ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }}
                />
            </div>
            
              {/* Right side - Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Quick Add Input - Better proportions */}
              <div style={{ position: 'relative', width: '120px' }}>
                  <FaSearch style={{ 
                    position: 'absolute', 
                    left: '10px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#6b7280', 
                    opacity: 0.7 
                  }} size={12} />
                <input
                  type="text"
                    placeholder="Code"
                    value={quickSearch}
                    onChange={(e) => setQuickSearch(e.target.value)}
                    onKeyPress={handleQuickSearch}
                  style={{
                    width: '100%',
                      height: '40px', // Fixed height to match other elements
                      paddingLeft: '32px',
                      paddingRight: '10px',
                      border: quickSearch.trim() ? '2px solid #10b981' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      backgroundColor: quickSearch.trim() ? '#ecfdf5' : '#ffffff',
                      fontSize: '13px',
                      fontWeight: '600',
                      outline: 'none',
                      color: '#374151',
                      transition: 'all 0.2s ease',
                      boxShadow: quickSearch.trim() ? '0 0 0 3px rgba(16, 185, 129, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                    onFocus={(e) => {
                      e.target.style.backgroundColor = quickSearch.trim() ? '#ecfdf5' : '#ffffff';
                      e.target.style.borderColor = '#10b981';
                      e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.backgroundColor = quickSearch.trim() ? '#ecfdf5' : '#ffffff';
                      e.target.style.borderColor = quickSearch.trim() ? '#10b981' : '#d1d5db';
                      e.target.style.boxShadow = quickSearch.trim() ? '0 0 0 3px rgba(16, 185, 129, 0.1)' : '0 1px 2px rgba(0, 0, 0, 0.05)';
                  }}
                />
              </div>

                {/* Fresh Order Button */}
                <button
                  onClick={handleFreshOrder}
                  style={{
                    height: '40px',
                    padding: '0 16px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    minWidth: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#e5e7eb';
                    e.target.style.borderColor = '#9ca3af';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                >
                  <FaPlus size={12} />
                  {t('menu.freshOrder')}
                </button>

                {/* Upload Menu Button */}
                <button
                  onClick={() => setShowBulkUpload(true)}
                  style={{
                    height: '40px',
                    padding: '0 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease',
                    minWidth: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#ef4444';
                  }}
                >
                  <FaCloudUploadAlt size={12} />
                  {t('menu.uploadMenu')}
                </button>
              </div>

              {/* Current Order Status */}
              {currentOrder && (
                <div style={{ 
                  padding: '8px 12px', 
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  border: '2px solid #f59e0b',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 2px 4px rgba(245, 158, 11, 0.2)',
                  marginBottom: '8px'
                }}>
                  <FaEdit size={14} style={{ color: '#d97706' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ color: '#92400e', fontWeight: '700' }}>
                      ✏️ EDITING EXISTING ORDER
                    </div>
                    <div style={{ color: '#a16207', fontSize: '10px' }}>
                      Order #{currentOrder.id.slice(-8).toUpperCase()} • {currentOrder.status === 'confirmed' ? 'Kitchen Order' : 'Direct Billing'}
                    </div>
                    <div style={{ color: '#a16207', fontSize: '10px' }}>
                      Table: {currentOrder.tableNumber || 'N/A'} • Items: {currentOrder.items?.length || 0}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div style={{ 
            flex: 1, 
            padding: isMobile ? '16px' : '8px', 
            overflowY: isMobile ? 'visible' : 'auto',
            height: isMobile ? 'auto' : '100%',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }} className="hide-scrollbar">
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

       
        {/* Order Summary - Desktop Sidebar / Mobile Bottom Sheet */}
        {!(filteredItems.length === 0 && (menuItems || []).length === 0 && !loading) && (
          <>
            {/* Desktop Order Summary */}
            {!isMobile && (
          <div style={{ 
            width: '30%', 
            minWidth: '320px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>
          {console.log('🖥️ Dashboard: Rendering OrderSummary with cart:', cart)}
          <OrderSummary
            cart={cart}
            setCart={setCart}
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
            onUpdateCartItemQuantity={updateCartItemQuantity}
            onTableNumberChange={setTableNumber}
            onCustomerNameChange={setCustomerName}
            onCustomerMobileChange={setCustomerMobile}
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
                  onShowQRCode={handleShowQRCode}
                  restaurantId={selectedRestaurant?.id}
                  restaurantName={selectedRestaurant?.name}
            taxSettings={taxSettings}
          />
        </div>
            )}

            {/* Mobile Order Summary Bottom Sheet */}
            {isMobile && (
              <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderTop: '1px solid #e5e7eb',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
                zIndex: 1000,
                maxHeight: '70vh',
                overflowY: 'auto',
                transform: showMobileCart ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.3s ease-in-out'
              }}>
                <div style={{
                  padding: '16px',
                  borderBottom: '1px solid #f3f4f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FaShoppingCart size={16} />
                    {t('dashboard.orderSummary')}
                    {cart.length > 0 && (
                      <span style={{
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
                  </h3>
                  <button
                    onClick={() => setShowMobileCart(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '20px',
                      cursor: 'pointer',
                      color: '#6b7280',
                      padding: '4px'
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div style={{ padding: '16px' }}>
                  {console.log('📱 Dashboard: Rendering Mobile OrderSummary with cart:', cart)}
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
                    onCustomerNameChange={setCustomerName}
                    onCustomerMobileChange={setCustomerMobile}
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
                    onShowQRCode={handleShowQRCode}
                    restaurantId={selectedRestaurant?.id}
                    restaurantName={selectedRestaurant?.name}
                    taxSettings={taxSettings}
                    isMobile={true}
                  />
                </div>
              </div>
            )}
          </>
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
            <div style={{ 
              flex: 1, 
              padding: '16px', 
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }} className="hide-scrollbar">
              {categories.map((category) => {
                const categoryItems = category.id === 'all-items' 
                  ? (menuItems || [])
                  : (menuItems || []).filter(item => item.category?.toLowerCase() === category.id);
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
            <div style={{ 
              flex: 1, 
              padding: '16px', 
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }} className="hide-scrollbar">
              {cart.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#6b7280'
                }}>
                  <FaShoppingCart size={48} style={{ marginBottom: '16px', color: '#d1d5db' }} />
                  <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{t('dashboard.noItems')}</p>
                  <p style={{ fontSize: '14px' }}>{t('dashboard.addItemsFirst')}</p>
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
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{t('common.total')}</span>
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
                      {t('dashboard.orderProcessing')}
                    </>
                  ) : (
                    <>
                      <FaCheckCircle size={16} />
                      {t('dashboard.completeBilling')} • Rs.{getTotalAmount()}
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
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{t('dashboard.tableNumber')}</h2>
              <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>{t('dashboard.enterTableNumber')}</p>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  {t('dashboard.tableNumber')}
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
                {t('common.cancel')}
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
                {t('dashboard.tableNumber')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Component */}
      <Notification
        show={notification?.show || false}
        type={notification?.type || 'success'}
        title={notification?.title}
        message={notification?.message}
        onClose={() => setNotification(null)}
        duration={5000}
      />
      
      {/* Fullscreen Mode Button */}
      <button
        onClick={toggleFullscreen}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          width: '48px',
          height: '48px',
          backgroundColor: fullscreenStep === 0 ? '#ef4444' : fullscreenStep === 1 ? '#f97316' : '#10b981',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          zIndex: 1000,
          opacity: 0.9
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '1';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '0.9';
          e.target.style.transform = 'scale(1)';
        }}
        title={
          fullscreenStep === 0 ? 'Hide Navigation' :
          fullscreenStep === 1 ? 'Enter Fullscreen' :
          'Exit Fullscreen'
        }
      >
        {fullscreenStep === 0 ? <FaExpand size={18} /> :
         fullscreenStep === 1 ? <FaExpandArrowsAlt size={18} /> :
         <FaCompress size={18} />}
      </button>

      {/* Logout Dropdown - Only visible when navigation is hidden */}
      {isNavigationHidden && user && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1001 }} data-logout-dropdown>
          <button
            onClick={() => setShowLogoutDropdown(!showLogoutDropdown)}
            style={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              backgroundColor: '#ef4444',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '10px',
              fontWeight: '600'
            }}>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#1f2937' }}>
              {user.name || 'User'}
            </span>
            <FaChevronDown size={10} color="#6b7280" />
          </button>

          {/* Dropdown Menu */}
          {showLogoutDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '8px',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              overflow: 'hidden',
              minWidth: '200px',
              zIndex: 1002
            }}>
              {/* User Info */}
              <div style={{ padding: '12px', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#ef4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                      {user.name || 'User'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {user.role || 'Staff'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <div style={{ padding: '8px' }}>
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                    color: '#dc2626',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
                    e.currentTarget.style.color = '#dc2626';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <FaSignOutAlt size={10} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={showQRCodeModal}
        onClose={() => setShowQRCodeModal(false)}
        restaurantId={selectedRestaurant?.id}
        restaurantName={selectedRestaurant?.name}
        restaurant={selectedRestaurant}
      />

      {/* Bulk Upload Modal */}
      <BulkMenuUpload
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        restaurantId={selectedRestaurant?.id}
        onMenuItemsAdded={handleMenuItemsAdded}
        currentMenuItems={menuItems}
      />
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
        <p style={{ color: '#6b7280', margin: 0 }}>{t('common.loading')}</p>
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