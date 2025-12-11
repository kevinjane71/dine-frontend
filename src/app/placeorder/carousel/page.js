'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaShoppingCart, FaSpinner } from 'react-icons/fa';
import apiClient from '../../../lib/api';
import dynamic from 'next/dynamic';

// Dynamically load the Carousel 3D menu
const Carousel3DMenu = dynamic(() => import('./Carousel3DMenu'), { ssr: false });

// Try to import Firebase modules with error handling
let firebaseAuth = null;
let firebaseConfig = null;

try {
  firebaseAuth = require('firebase/auth');
  firebaseConfig = require('../../../../firebase');
} catch (error) {
  console.warn('⚠️ Firebase modules not available:', error.message);
}

const PlaceOrderCarouselContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({ phone: '', seatNumber: '', name: '' });
  const [showCart, setShowCart] = useState(false);
  const [error, setError] = useState('');

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

  // Note: OTP and Order Placement logic would go here, 
  // but for this visual demo we pass basic cart props. 
  // Ideally, reuse the CartModal/OtpModal from parent or duplicate logic.
  // For brevity, we assume the CarouselMenu might trigger a simple cart view or just add items.
  // I will pass the core props needed for the display.

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white p-4 text-center">
        <div>
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Menu</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-black relative">
       {/* Cart Icon Button - Top Right - Only show when cart has items */}
       {getCartItemCount() > 0 && (
        <button
          onClick={() => alert(`Cart contains ${getCartItemCount()} items. Total: ₹${getCartTotal()}`)}
          style={{
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: 100,
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.2s ease-out',
            minWidth: '48px',
            height: '48px',
          }}
        >
          <FaShoppingCart size={20} />
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '8px',
              fontWeight: 'bold'
            }}
          >
            {getCartItemCount()}
          </span>
        </button>
      )}

      <Carousel3DMenu 
        menu={menu} 
        categories={categories} 
        restaurant={restaurant} 
        addToCart={addToCart}
        cart={cart}
      />
    </div>
  );
};

const PlaceOrderCarouselPage = () => (
  <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>}>
    <PlaceOrderCarouselContent />
  </Suspense>
);

export default PlaceOrderCarouselPage;

