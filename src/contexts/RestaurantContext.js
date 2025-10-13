'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSubdomain } from '../hooks/useSubdomain';

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const { subdomain, restaurant, loading, error, isSubdomainMode } = useSubdomain();
  const [fallbackRestaurant, setFallbackRestaurant] = useState(null);

  // Load fallback restaurant from localStorage for non-subdomain mode
  useEffect(() => {
    if (!isSubdomainMode && !fallbackRestaurant) {
      try {
        const savedRestaurant = localStorage.getItem('selectedRestaurant');
        if (savedRestaurant) {
          const parsedRestaurant = JSON.parse(savedRestaurant);
          setFallbackRestaurant(parsedRestaurant);
        }
      } catch (error) {
        console.error('Error loading fallback restaurant:', error);
      }
    }
  }, [isSubdomainMode, fallbackRestaurant]);

  // Get the current restaurant (subdomain or fallback)
  const currentRestaurant = restaurant || fallbackRestaurant;
  const currentRestaurantId = currentRestaurant?.id;

  // Get restaurant ID for API calls
  const getRestaurantId = () => {
    if (isSubdomainMode && restaurant) {
      return restaurant.id;
    }
    
    if (fallbackRestaurant) {
      return fallbackRestaurant.id;
    }
    
    // Fallback to localStorage
    const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
    return savedRestaurantId;
  };

  // Update restaurant context
  const updateRestaurant = (newRestaurant) => {
    if (isSubdomainMode) {
      // In subdomain mode, restaurant is loaded from subdomain
      console.log('Cannot update restaurant in subdomain mode');
      return;
    }
    
    setFallbackRestaurant(newRestaurant);
    localStorage.setItem('selectedRestaurant', JSON.stringify(newRestaurant));
    localStorage.setItem('selectedRestaurantId', newRestaurant.id);
  };

  const contextValue = {
    // Subdomain context
    subdomain,
    isSubdomainMode,
    
    // Restaurant data
    restaurant: currentRestaurant,
    restaurantId: currentRestaurantId,
    getRestaurantId,
    
    // State
    loading,
    error,
    
    // Actions
    updateRestaurant
  };

  return (
    <RestaurantContext.Provider value={contextValue}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
};

// Hook for components that need restaurant ID
export const useRestaurantId = () => {
  const { getRestaurantId } = useRestaurant();
  return getRestaurantId();
};
