'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSubdomain } from '../hooks/useSubdomain';

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const { subdomain, restaurant, loading, error, isSubdomainMode } = useSubdomain();
  const [fallbackRestaurant, setFallbackRestaurant] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessLoading, setAccessLoading] = useState(false);
  const [userRestaurants, setUserRestaurants] = useState([]);

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

  // Validate user access to subdomain restaurant
  useEffect(() => {
    const validateSubdomainAccess = async () => {
      if (!isSubdomainMode || !restaurant || !subdomain) {
        return;
      }

      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.log('🔒 No auth token found, redirecting to login');
        window.location.href = 'https://www.dineopen.com/login';
        return;
      }

      setAccessLoading(true);
      setAccessDenied(false);

      try {
        // Validate user access to this specific restaurant
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
        const response = await fetch(`${apiBaseUrl}/api/restaurants/by-subdomain/${subdomain}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 403) {
          console.log('🚫 Access denied to subdomain:', subdomain);
          // Redirect to user's own restaurant subdomain
          await redirectToUserRestaurant();
        } else if (response.status === 404) {
          console.log('❌ Restaurant not found for subdomain:', subdomain);
          // Redirect to user's own restaurant subdomain
          await redirectToUserRestaurant();
        } else if (response.ok) {
          console.log('✅ Access granted to subdomain:', subdomain);
          setAccessDenied(false);
        } else {
          console.log('⚠️ Unexpected response:', response.status);
          // Redirect to user's own restaurant subdomain
          await redirectToUserRestaurant();
        }
      } catch (error) {
        console.error('Error validating subdomain access:', error);
        // Redirect to user's own restaurant subdomain on error
        await redirectToUserRestaurant();
      } finally {
        setAccessLoading(false);
      }
    };

    // Function to redirect user to their own restaurant subdomain
    const redirectToUserRestaurant = async () => {
      try {
        console.log('🔄 Redirecting user to their own restaurant subdomain...');
        
        // Get user's restaurants
        const restaurantsResponse = await fetch(`${apiBaseUrl}/api/restaurants`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (restaurantsResponse.ok) {
          const restaurantsData = await restaurantsResponse.json();
          const userRestaurants = restaurantsData.restaurants || [];
          
          if (userRestaurants.length > 0) {
            // Find restaurant with subdomain
            const restaurantWithSubdomain = userRestaurants.find(r => r.subdomain);
            
            if (restaurantWithSubdomain) {
              const redirectUrl = `https://${restaurantWithSubdomain.subdomain}.dineopen.com/dashboard`;
              console.log('🏢 Redirecting to user restaurant:', redirectUrl);
              window.location.href = redirectUrl;
              return;
            }
          }
        }
        
        // Fallback: redirect to main domain
        console.log('🏠 No subdomain found, redirecting to main domain');
        window.location.href = 'https://www.dineopen.com/dashboard';
        
      } catch (error) {
        console.error('Error redirecting to user restaurant:', error);
        // Final fallback
        window.location.href = 'https://www.dineopen.com/dashboard';
      }
    };

    validateSubdomainAccess();
  }, [isSubdomainMode, restaurant, subdomain]);

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
    loading: loading || accessLoading,
    error,
    
    // Access control
    accessDenied,
    accessLoading,
    
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
