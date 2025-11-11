import React, { useState, useEffect } from 'react';
import { FaRobot } from 'react-icons/fa';
import { useDineBot } from './DineBotProvider';
import apiClient from '../lib/api';

const DineBotButton = () => {
  const { openDineBot } = useDineBot();
  const [currentRestaurantId, setCurrentRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Listen for restaurant changes
  useEffect(() => {
    const getRestaurantData = async () => {
      if (typeof window !== 'undefined') {
        // First try to get the full restaurant object
        const restaurantData = localStorage.getItem('selectedRestaurant');
        if (restaurantData) {
          try {
            const parsed = JSON.parse(restaurantData);
            setCurrentRestaurantId(parsed.id);
            setRestaurantName(parsed.name || 'Restaurant');
            return parsed.id;
          } catch (error) {
            console.error('Error parsing restaurant data:', error);
          }
        }
        
        // Fallback: get restaurant ID and fetch full data
        const restaurantId = localStorage.getItem('selectedRestaurantId');
        if (restaurantId) {
          try {
            // Try to get restaurant data from API
            const response = await apiClient.request(`/api/restaurants/${restaurantId}`);
            if (response.success && response.data) {
              const restaurant = response.data;
              setCurrentRestaurantId(restaurant.id);
              setRestaurantName(restaurant.name || 'Restaurant');
              // Save full restaurant object for future use
              localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
              return restaurant.id;
            }
          } catch (error) {
            console.error('Error fetching restaurant data:', error);
            // Use ID as fallback
            setCurrentRestaurantId(restaurantId);
            setRestaurantName('Restaurant');
            return restaurantId;
          }
        }
      }
      return null;
    };

    // Get initial restaurant data
    getRestaurantData();

    // Listen for restaurant changes from top navigation
    const handleRestaurantChange = (event) => {
      console.log('DineBot detected restaurant change:', event.detail);
      const restaurant = event.detail.restaurant;
      if (restaurant) {
        setCurrentRestaurantId(restaurant.id);
        setRestaurantName(restaurant.name || 'Restaurant');
        // Save full restaurant object for future use
        localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
      }
    };

    // Listen for storage changes (when restaurant is changed in another tab)
    const handleStorageChange = (event) => {
      if (event.key === 'selectedRestaurant' || event.key === 'selectedRestaurantId') {
        getRestaurantData();
      }
    };

    window.addEventListener('restaurantChanged', handleRestaurantChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('restaurantChanged', handleRestaurantChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleClick = () => {
    console.log('🤖 DineBot button clicked');
    console.log('Current restaurant ID:', currentRestaurantId);
    console.log('Restaurant name:', restaurantName);
    console.log('LocalStorage selectedRestaurant:', localStorage.getItem('selectedRestaurant'));
    console.log('LocalStorage selectedRestaurantId:', localStorage.getItem('selectedRestaurantId'));
    
    if (currentRestaurantId) {
      console.log('✅ Opening DineBot with restaurant:', currentRestaurantId);
      openDineBot(currentRestaurantId);
    } else {
      console.log('❌ No restaurant ID found');
      alert('Please select a restaurant first to use DineBot');
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: isMobile ? '20px' : '80px',
        left: '20px',
        width: isMobile ? '50px' : '60px',
        height: isMobile ? '50px' : '60px',
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
        zIndex: 999,
        transition: 'all 0.3s ease',
        animation: 'dinebotPulse 2s infinite',
        opacity: currentRestaurantId ? 1 : 0.6
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.6)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.4)';
      }}
      title={currentRestaurantId ? `Ask DineBot about ${restaurantName}` : 'Please select a restaurant first'}
    >
      <FaRobot size={isMobile ? 20 : 24} />
    </button>
  );
};

export default DineBotButton;






