'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch, FaShoppingCart, FaPlus, FaMinus, FaTrash, FaArrowLeft, FaPhone, FaChair, FaUtensils, FaLeaf, FaDrumstickBite, FaSpinner, FaLock, FaTimes } from 'react-icons/fa';
import ImageCarousel from '../../components/ImageCarousel';
import apiClient from '../../lib/api.js';

// Try to import Firebase modules with error handling
let firebaseAuth = null;
let firebaseConfig = null;

try {
  firebaseAuth = require('firebase/auth');
  firebaseConfig = require('../../../firebase');
  console.log('✅ Firebase modules loaded successfully');
} catch (error) {
  console.warn('⚠️ Firebase modules not available:', error.message);
}

// Helper function to get category-specific colors
const getCategoryColor = (category, opacity = 1) => {
  const colors = {
    'Pizza': `rgba(239, 68, 68, ${opacity})`,      // Red
    'Burgers': `rgba(249, 115, 22, ${opacity})`,   // Orange
    'Salads': `rgba(34, 197, 94, ${opacity})`,     // Green
    'Pasta': `rgba(168, 85, 247, ${opacity})`,     // Purple
    'Desserts': `rgba(236, 72, 153, ${opacity})`,  // Pink
    'appetizer': `rgba(59, 130, 246, ${opacity})`, // Blue
    'Tea': `rgba(245, 158, 11, ${opacity})`,       // Yellow
    'Samosa': `rgba(16, 185, 129, ${opacity})`,    // Teal
    'Main Course': `rgba(107, 114, 128, ${opacity})`, // Gray
    'default': `rgba(99, 102, 241, ${opacity})`    // Indigo
  };
  return colors[category] || colors['default'];
};

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
  const [isScrolled, setIsScrolled] = useState(false);
  
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

  // Handle scroll for compact header with throttling to prevent flickering
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          setIsScrolled(scrollTop > 100);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      try {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      } catch (error) {
        console.warn('Error cleaning up reCAPTCHA:', error);
      }
    };
  }, []);

  // Load restaurant data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load from API
        try {
          console.log('🔍 Fetching public menu for restaurant:', restaurantId);
          const response = await apiClient.getPublicMenu(restaurantId);
          console.log('✅ API response:', response);
          
          if (response.success && response.restaurant && response.menu) {
            setRestaurant(response.restaurant);
            setMenu(response.menu);
            
            // Extract categories from real menu data
            const uniqueCategories = [...new Set(response.menu.map(item => item.category).filter(Boolean))];
            setCategories(['all', ...uniqueCategories]);
            
            console.log('✅ Loaded restaurant:', response.restaurant.name);
            console.log('✅ Loaded menu items:', response.menu.length);
            console.log('✅ Categories:', uniqueCategories);
          } else {
            throw new Error('Invalid API response format');
          }
        } catch (apiError) {
          console.error('❌ API error:', apiError);
          
          // Check if it's a 404 error (restaurant not found)
          if (apiError.status === 404 || apiError.message?.includes('Restaurant not found') || apiError.message?.includes('not found')) {
            setError(`Restaurant not found. The restaurant ID "${restaurantId}" does not exist in our database. Please check the QR code or contact the restaurant.`);
            setLoading(false);
            return;
          }
          
          // Check if it's a 500 error (server error)
          if (apiError.status === 500 || apiError.message?.includes('Internal Server Error')) {
            setError(`Server error occurred while loading restaurant data. Please try again later or contact support.`);
            setLoading(false);
            return;
          }
          
          // For other errors, show generic error message
          setError(`Failed to load restaurant data: ${apiError.message || 'Unknown error'}. Please check your internet connection and try again.`);
          setLoading(false);
          return;
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

      // Check if Firebase is available
      try {
        // Check if Firebase modules are available
        if (!firebaseAuth || !firebaseConfig) {
          throw new Error('Firebase modules not available');
        }

        const { signInWithPhoneNumber, RecaptchaVerifier } = firebaseAuth;
        const { auth, isFirebaseConfigured } = firebaseConfig;

        // Check if Firebase is properly configured
        if (!isFirebaseConfigured || !isFirebaseConfigured()) {
          throw new Error('Firebase not configured - using demo mode');
        }

        // Format phone number
        let phoneNumber = customerInfo.phone.trim();
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = '+91' + phoneNumber;
        }

        // Clear any existing reCAPTCHA
        if (window.recaptchaVerifier) {
          try {
            window.recaptchaVerifier.clear();
          } catch (clearError) {
            console.warn('Error clearing reCAPTCHA:', clearError);
          }
        }

        // Setup reCAPTCHA with proper configuration
        try {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: (response) => {
              console.log('reCAPTCHA solved');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              setError('reCAPTCHA expired. Please try again.');
            },
            'error-callback': (error) => {
              console.log('reCAPTCHA error:', error);
              setError('reCAPTCHA error. Please refresh and try again.');
            }
          });

          // Render reCAPTCHA
          await window.recaptchaVerifier.render();

          // Send OTP
          const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
          setVerificationId(confirmationResult);
          setOtpSent(true);
          setShowOtpModal(true);
          setSendingOtp(false);
          
        } catch (recaptchaError) {
          console.warn('reCAPTCHA setup failed:', recaptchaError);
          throw new Error('reCAPTCHA setup failed');
        }
        
      } catch (firebaseError) {
        console.error('Firebase OTP error:', firebaseError);
        
        // Provide specific error messages based on Firebase error codes
        if (firebaseError.code === 'auth/argument-error') {
          console.log('Firebase argument error - likely reCAPTCHA or config issue');
        } else if (firebaseError.code === 'auth/invalid-phone-number') {
          console.log('Invalid phone number format');
        } else if (firebaseError.code === 'auth/too-many-requests') {
          console.log('Too many OTP requests');
        }
        
        // Re-throw the Firebase error
        throw firebaseError;
      }
      
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError(`Failed to send OTP: ${err.message}`);
      setSendingOtp(false);
      
      // Clear reCAPTCHA on error
      try {
        if (window.recaptchaVerifier) {
          window.recaptchaVerifier.clear();
          window.recaptchaVerifier = null;
        }
      } catch (clearError) {
        console.warn('Error clearing reCAPTCHA on error:', clearError);
      }
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

      // Check if it's a demo verification
      if (verificationId === 'demo-verification-id') {
        if (otp === '123456') {
          // Demo OTP verification successful
          await placeOrderWithVerification('demo-firebase-uid');
          setOtpSent(false);
          setShowOtpModal(false);
          setOtp('');
          setSendingOtp(false);
          return;
        } else {
          setError('Invalid OTP. Use 123456 for demo.');
          setSendingOtp(false);
          return;
        }
      }

      // Real Firebase OTP verification
      try {
        const result = await verificationId.confirm(otp);
        const user = result.user;
        
        // Get Firebase UID and proceed to place order
        await placeOrderWithVerification(user.uid);
        
        setOtpSent(false);
        setShowOtpModal(false);
        setOtp('');
        setSendingOtp(false);
        
      } catch (firebaseError) {
        console.error('Firebase OTP verification error:', firebaseError);
        setError(`Invalid OTP: ${firebaseError.message}`);
        setSendingOtp(false);
      }
      
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

    try {
      setError('');
      setSendingOtp(true);
      
      console.log('🚀 Starting OTP process for phone:', customerInfo.phone);
      
      // Use real Firebase OTP
      await sendOtp();
      
    } catch (err) {
      console.error('Error in placeOrder:', err);
      setError('Failed to initiate order process');
      setSendingOtp(false);
    }
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
      
      // Close all modals and stay on the same page
      setShowOtpModal(false);
      setShowCart(false);
      setOtpSent(false);
      setOtp('');

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
      paddingBottom: showCart ? '20px' : '100px'
    }}>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        /* Prevent flickering and improve performance */
        * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Hardware acceleration for smooth animations */
        .header-container {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* Optimize transitions */
        .transition-optimized {
          will-change: transform, opacity;
          transform: translateZ(0);
        }
        
        /* Pulse animation for cart badge */
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        /* Smooth scrollbar styling */
        ::-webkit-scrollbar {
          width: 4px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 2px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
      {/* Mobile-Optimized Header */}
      <div className="header-container" style={{
        position: 'sticky',
        top: 0,
        backgroundColor: 'white',
        zIndex: 100,
        padding: isScrolled ? '6px 12px' : '12px 16px',
        boxShadow: isScrolled ? '0 2px 12px rgba(0,0,0,0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
        transition: 'all 0.2s ease-out',
        willChange: 'transform, box-shadow, padding',
        backdropFilter: 'blur(10px)',
        borderBottom: isScrolled ? '1px solid rgba(0,0,0,0.05)' : 'none'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: isScrolled ? '8px' : '12px'
        }}>
          {/* Restaurant Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ 
              fontSize: isScrolled ? '14px' : '18px', 
              fontWeight: '700', 
              color: '#1f2937', 
              margin: 0,
              lineHeight: '1.2',
              transition: 'font-size 0.2s ease-out',
              willChange: 'font-size',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {restaurant?.name || 'My Restaurant'}
            </h1>
            {!isScrolled && restaurant?.description && (
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                margin: '2px 0 0 0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {restaurant.description}
              </p>
            )}
          </div>
          
          {/* Cart Button */}
          <button
            onClick={() => setShowCart(!showCart)}
            style={{
              position: 'relative',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              padding: isScrolled ? '8px' : '10px',
              borderRadius: isScrolled ? '8px' : '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
              transition: 'all 0.2s ease-out',
              willChange: 'transform, box-shadow',
              minWidth: isScrolled ? '36px' : '44px',
              height: isScrolled ? '36px' : '44px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px) scale(1.05)';
              e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
            }}
          >
            <FaShoppingCart size={isScrolled ? 14 : 16} />
            {getCartItemCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                backgroundColor: '#f59e0b',
                color: 'white',
                borderRadius: '50%',
                width: isScrolled ? '16px' : '20px',
                height: isScrolled ? '16px' : '20px',
                fontSize: isScrolled ? '9px' : '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                border: '2px solid white',
                animation: 'pulse 2s infinite'
              }}>
                {getCartItemCount()}
              </span>
            )}
          </button>
        </div>

        {/* Mobile-Optimized Search */}
        <div style={{ 
          position: 'relative', 
          marginBottom: isScrolled ? '6px' : '12px',
          maxWidth: '100%',
          padding: '0 4px'
        }}>
          <FaSearch size={isScrolled ? 12 : 14} color="#9ca3af" style={{
            position: 'absolute',
            left: isScrolled ? '12px' : '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1,
            transition: 'all 0.2s ease-out'
          }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search food items..."
            style={{
              width: '100%',
              padding: isScrolled ? '10px 10px 10px 36px' : '12px 12px 12px 40px',
              border: '2px solid #f3f4f6',
              borderRadius: isScrolled ? '10px' : '12px',
              fontSize: isScrolled ? '13px' : '14px',
              outline: 'none',
              backgroundColor: '#f9fafb',
              boxSizing: 'border-box',
              transition: 'all 0.2s ease-out',
              lineHeight: '1.4',
              height: isScrolled ? '36px' : '44px',
              display: 'flex',
              alignItems: 'center'
            }}
            onFocus={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.borderColor = '#ef4444';
              e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.borderColor = '#f3f4f6';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Mobile-Optimized Category Filter */}
        <div style={{
          display: 'flex',
          gap: isScrolled ? '3px' : '6px',
          overflowX: 'auto',
          padding: `0 4px ${isScrolled ? '4px' : '8px'} 4px`,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          alignItems: 'center',
          transition: 'all 0.2s ease-out',
          WebkitOverflowScrolling: 'touch'
        }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                background: selectedCategory === category 
                  ? 'linear-gradient(135deg, #ef4444, #dc2626)' 
                  : '#ffffff',
                color: selectedCategory === category ? 'white' : '#64748b',
                border: selectedCategory === category ? 'none' : '1px solid #e5e7eb',
                padding: isScrolled ? '6px 10px' : '8px 14px',
                borderRadius: isScrolled ? '16px' : '20px',
                fontSize: isScrolled ? '11px' : '12px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease-out',
                boxShadow: selectedCategory === category 
                  ? '0 2px 8px rgba(239, 68, 68, 0.3)' 
                  : '0 1px 3px rgba(0,0,0,0.1)',
                minWidth: 'auto',
                width: 'auto',
                textAlign: 'center',
                flexShrink: 0,
                transform: selectedCategory === category ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.target.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                  e.target.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                  e.target.style.transform = 'scale(1)';
                }
              }}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Firebase Status Notice */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        backgroundColor: firebaseAuth && firebaseConfig ? '#dcfce7' : '#fef2f2',
        color: firebaseAuth && firebaseConfig ? '#166534' : '#dc2626',
        padding: '8px 12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: '600',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 50,
        border: firebaseAuth && firebaseConfig ? '1px solid #22c55e' : '1px solid #fecaca'
      }}>
        {firebaseAuth && firebaseConfig ? '🔥 Firebase Ready' : '⚠️ Firebase Not Available'}
      </div>
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
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#f0fdf4',
          border: '2px solid #22c55e',
          color: '#166534',
          padding: '20px',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          textAlign: 'center',
          zIndex: 1000,
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          maxWidth: '90%',
          width: '400px'
        }}>
          <div style={{ marginBottom: '12px' }}>
            ✅ {success}
          </div>
          <button
            onClick={() => setSuccess('')}
            style={{
              backgroundColor: '#22c55e',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Menu */}
      <div style={{ 
        padding: '0 16px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {selectedCategory === 'all' ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {filteredMenu.length > 0 ? (
              filteredMenu.map(item => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  cartQuantity={cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                />
              ))
            ) : (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  🍽️
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 8px 0'
                }}>
                  {searchTerm ? 'No items found' : 'No menu items available'}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: '0 0 16px 0'
                }}>
                  {searchTerm 
                    ? `No items match "${searchTerm}". Try a different search term.`
                    : 'This restaurant has not added any menu items yet.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            {Object.keys(groupedMenu).length > 0 ? (
              Object.entries(groupedMenu).map(([category, items]) => (
                <div key={category} style={{ marginTop: '20px' }}>
                  <h2 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: '0 0 20px 0',
                    padding: '16px 20px',
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    border: '1px solid #e5e7eb'
                  }}>
                    {category}
                  </h2>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '20px', 
                    marginBottom: '32px' 
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
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb',
                marginTop: '20px'
              }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px'
                }}>
                  🍽️
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#374151',
                  margin: '0 0 8px 0'
                }}>
                  {searchTerm ? 'No items found' : 'No menu items available'}
                </h3>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: '0 0 16px 0'
                }}>
                  {searchTerm 
                    ? `No items match "${searchTerm}". Try a different search term.`
                    : 'This restaurant has not added any menu items yet.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile-Optimized Cart Modal */}
      {showCart && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          padding: 0
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowCart(false);
          }
        }}
        >
          <div style={{
            backgroundColor: 'white',
            width: '100%',
            maxHeight: '85vh',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Cart Header */}
            <div style={{ 
              padding: '16px 20px 12px 20px',
              borderBottom: '1px solid #f1f5f9',
              backgroundColor: '#fafbfc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  Your Order ({getCartItemCount()} items)
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setShowCart(false)}
                    style={{
                      background: '#f1f5f9',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#64748b',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e2e8f0';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f1f5f9';
                    }}
                  >
                    <FaTimes size={14} />
                  </button>
                  <button
                    onClick={() => setCart([])}
                    style={{
                      background: '#fef2f2',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      color: '#dc2626',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#fee2e2';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#fef2f2';
                    }}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
              
              {/* Cart Summary */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '8px 12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                  Total: ₹{getCartTotal().toFixed(2)}
                </span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>
                  {getCartItemCount()} items
                </span>
              </div>
            </div>

            {/* Scrollable Cart Items */}
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '0 20px',
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 transparent'
            }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    backgroundColor: '#f3f4f6', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    margin: '0 auto 16px auto',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }}>
                    <FaShoppingCart size={24} color="#9ca3af" />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 4px 0' }}>
                    Your cart is empty
                  </h3>
                  <p style={{ fontSize: '13px', margin: 0, opacity: 0.7 }}>
                    Add some delicious items to get started
                  </p>
                </div>
              ) : (
                <div style={{ padding: '16px 0' }}>
                  {cart.map(item => (
                    <div key={item.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      marginBottom: '8px',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#1f2937', 
                          margin: '0 0 2px 0',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.name}
                        </h4>
                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                          ₹{item.price} each
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: '#f1f5f9',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                            minWidth: '28px',
                            height: '28px'
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
                        
                        <span style={{ 
                          fontSize: '14px', 
                          fontWeight: '700', 
                          color: '#1f2937', 
                          minWidth: '20px', 
                          textAlign: 'center' 
                        }}>
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                            transition: 'all 0.2s ease',
                            minWidth: '28px',
                            height: '28px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <FaPlus size={10} color="white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Customer Info & Checkout Section */}
            {cart.length > 0 && (
              <div style={{
                padding: '20px',
                borderTop: '1px solid #f1f5f9',
                backgroundColor: '#fafbfc'
              }}>
                {/* Customer Info */}
                <div style={{
                  backgroundColor: '#ffffff',
                  padding: '16px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', margin: '0 0 12px 0' }}>
                    Contact Information
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        color: '#374151', 
                        marginBottom: '6px' 
                      }}>
                        <FaPhone size={10} style={{ marginRight: '4px' }} />
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
                          border: '2px solid #f3f4f6',
                          borderRadius: '8px',
                          fontSize: '13px',
                          outline: 'none',
                          backgroundColor: '#f9fafb',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#ef4444';
                          e.target.style.backgroundColor = '#ffffff';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#f3f4f6';
                          e.target.style.backgroundColor = '#f9fafb';
                        }}
                      />
                    </div>
                    
                    <div>
                      <label style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        color: '#374151', 
                        marginBottom: '6px' 
                      }}>
                        <FaChair size={10} style={{ marginRight: '4px' }} />
                        Table Number
                      </label>
                      <input
                        type="text"
                        value={customerInfo.seatNumber}
                        onChange={(e) => setCustomerInfo({...customerInfo, seatNumber: e.target.value})}
                        placeholder="Table/Seat number"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          border: '2px solid #f3f4f6',
                          borderRadius: '8px',
                          fontSize: '13px',
                          outline: 'none',
                          backgroundColor: '#f9fafb',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#ef4444';
                          e.target.style.backgroundColor = '#ffffff';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#f3f4f6';
                          e.target.style.backgroundColor = '#f9fafb';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={placeOrder}
                  disabled={placingOrder || !customerInfo.phone.trim() || sendingOtp}
                  style={{
                    width: '100%',
                    background: placingOrder || !customerInfo.phone.trim() || sendingOtp
                      ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' 
                      : 'linear-gradient(135deg, #ef4444, #dc2626)',
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
                    transition: 'all 0.2s ease',
                    boxShadow: placingOrder || !customerInfo.phone.trim() 
                      ? 'none' 
                      : '0 4px 12px rgba(239, 68, 68, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    if (!placingOrder && customerInfo.phone.trim()) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!placingOrder && customerInfo.phone.trim()) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                    }
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
                      <FaUtensils size={16} />
                      Place Order - ₹{getCartTotal().toFixed(2)}
                    </>
                  )}
                </button>
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
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '350px',
            width: '100%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <FaLock size={32} color="#e53e3e" style={{ marginBottom: '12px' }} />
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 6px 0' }}>
                Verify Your Phone
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
                We&apos;ve sent a 6-digit code to {customerInfo.phone}
              </p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                maxLength="6"
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  textAlign: 'center',
                  outline: 'none',
                  backgroundColor: '#f9fafb',
                  boxSizing: 'border-box',
                  letterSpacing: '2px'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#f9fafb';
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
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '13px',
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
                  padding: '10px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: (sendingOtp || otp.length !== 6) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
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
  
  // Use simple colored placeholders instead of external images
  const getImageStyle = (category) => {
    const colors = {
      'Pizza': '#ff6b6b',
      'Burgers': '#4ecdc4', 
      'Salads': '#45b7d1',
      'Pasta': '#96ceb4',
      'Desserts': '#feca57',
      'appetizer': '#ff9ff3',
      'Tea': '#8b4513',
      'Samosa': '#ffa500',
      'default': '#ddd6fe'
    };
    return {
      backgroundColor: colors[category] || colors.default,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontWeight: 'bold'
    };
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
        width: '100px',
        height: '100px',
        borderRadius: '12px',
        flexShrink: 0,
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        {(item.images && item.images.length > 0) ? (
          <ImageCarousel
            images={item.images}
            itemName={item.name}
            maxHeight="100px"
            showControls={false}
            showDots={false}
            autoPlay={true}
            autoPlayInterval={4000}
            className="w-full h-full"
          />
        ) : (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${getCategoryColor(item.category)} 0%, ${getCategoryColor(item.category, 0.7)} 100%)`,
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Beautiful Background Pattern */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: `
                radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 60%, rgba(255,255,255,0.05) 0%, transparent 50%)
              `,
              animation: 'float 6s ease-in-out infinite'
            }} />
            
            {/* Main Icon */}
            <div style={{
              fontSize: '36px',
              color: 'rgba(255, 255, 255, 0.9)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              zIndex: 2,
              position: 'relative'
            }}>
              {item.category === 'Pizza' && '🍕'}
              {item.category === 'Burgers' && '🍔'}
              {item.category === 'Salads' && '🥗'}
              {item.category === 'Pasta' && '🍝'}
              {item.category === 'Desserts' && '🍰'}
              {item.category === 'appetizer' && '🥟'}
              {item.category === 'Tea' && '☕'}
              {item.category === 'Samosa' && '🥟'}
              {!['Pizza', 'Burgers', 'Salads', 'Pasta', 'Desserts', 'appetizer', 'Tea', 'Samosa'].includes(item.category) && '🍽️'}
            </div>
            
            {/* Decorative Elements */}
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              left: '8px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }} />
          </div>
        )}
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

      {/* Hidden reCAPTCHA container for Firebase OTP */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
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











