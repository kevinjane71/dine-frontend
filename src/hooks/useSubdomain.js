import { useState, useEffect } from 'react';

// Hook to detect and manage subdomain context
export const useSubdomain = () => {
  const [subdomain, setSubdomain] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const detectSubdomain = async () => {
      try {
        setLoading(true);
        setError(null);

        // Skip if we're on the login page
        if (window.location.pathname === '/login') {
          setLoading(false);
          return;
        }

        // Get hostname
        const hostname = window.location.hostname;
        
        // Skip if it's main domain without subdomain
        if (hostname === 'localhost' || hostname === 'dineopen.com' || hostname === 'www.dineopen.com') {
          setLoading(false);
          return;
        }

        // Extract subdomain
        let currentSubdomain = null;
        
        // Check for localhost subdomains (e.g., myrestaurant.localhost)
        if (hostname.includes('localhost')) {
          const localhostParts = hostname.split('.localhost');
          if (localhostParts.length > 1) {
            currentSubdomain = localhostParts[0];
          }
        }
        // Check for production subdomains (e.g., restaurant-name.dineopen.com)
        else {
          const subdomainParts = hostname.split('.');
          if (subdomainParts.length > 2) {
            currentSubdomain = subdomainParts[0];
          }
        }
        
        // Check if it's a valid restaurant subdomain
        const reservedSubdomains = ['www', 'api', 'admin', 'app', 'support', 'localhost'];
        const isValidSubdomain = currentSubdomain && 
                               !reservedSubdomains.includes(currentSubdomain) && 
                               currentSubdomain.length > 2;

        if (isValidSubdomain) {
          console.log(`🏢 Frontend: Subdomain detected: ${currentSubdomain}`);
          setSubdomain(currentSubdomain);

          // Check if user is authenticated
          const token = localStorage.getItem('authToken');
          const isAuthenticated = !!token;

          // Load restaurant data by subdomain
          try {
            const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
            let response;
            
            if (isAuthenticated) {
              // Use authenticated API for logged-in users
              console.log(`🔐 Frontend: Using authenticated API for subdomain: ${currentSubdomain}`);
              response = await fetch(`${apiBaseUrl}/api/restaurants/by-subdomain/${currentSubdomain}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
            } else {
              // Use public API for non-authenticated users (QR code scanning)
              console.log(`🌐 Frontend: Using public API for subdomain: ${currentSubdomain}`);
              response = await fetch(`${apiBaseUrl}/api/public/restaurant-by-subdomain/${currentSubdomain}`);
            }
            
            if (response.ok) {
              const data = await response.json();
              setRestaurant(data.restaurant);
              console.log(`✅ Frontend: Restaurant loaded: ${data.restaurant.name}`);
            } else if (response.status === 404) {
              setError('Restaurant not found');
              console.log(`❌ Frontend: Restaurant not found for subdomain: ${currentSubdomain}`);
            } else if (response.status === 401) {
              // If authenticated API fails with 401, check if token is available
              console.log(`🔐 Frontend: Auth failed for subdomain: ${currentSubdomain}`);
              
              // Check if token is available now (might have been set after initial check)
              const currentToken = localStorage.getItem('authToken');
              if (currentToken && currentToken !== token) {
                console.log(`🔐 Frontend: Token now available, retrying authenticated API`);
                const retryResponse = await fetch(`${apiBaseUrl}/api/restaurants/by-subdomain/${currentSubdomain}`, {
                  headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (retryResponse.ok) {
                  const retryData = await retryResponse.json();
                  setRestaurant(retryData.restaurant);
                  console.log(`✅ Frontend: Restaurant loaded via retry: ${retryData.restaurant.name}`);
                  return;
                }
              }
              
              // Fallback to public API only if no token available
              console.log(`🌐 Frontend: Falling back to public API for subdomain: ${currentSubdomain}`);
              const publicResponse = await fetch(`${apiBaseUrl}/api/public/restaurant-by-subdomain/${currentSubdomain}`);
              if (publicResponse.ok) {
                const publicData = await publicResponse.json();
                setRestaurant(publicData.restaurant);
                console.log(`✅ Frontend: Restaurant loaded via public API: ${publicData.restaurant.name}`);
              } else {
                setError('Restaurant not found');
              }
            } else {
              setError('Failed to load restaurant');
              console.error('Failed to load restaurant:', response.statusText);
            }
          } catch (fetchError) {
            console.error('Error fetching restaurant:', fetchError);
            setError('Failed to load restaurant');
          }
        } else {
          console.log(`ℹ️ Frontend: No valid subdomain detected: ${hostname}`);
        }
      } catch (error) {
        console.error('Subdomain detection error:', error);
        setError('Failed to detect subdomain');
      } finally {
        setLoading(false);
      }
    };

    detectSubdomain();
  }, []);

  return {
    subdomain,
    restaurant,
    loading,
    error,
    isSubdomainMode: !!subdomain
  };
};

// Helper function to check if we're in subdomain mode
export const isSubdomainMode = () => {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  const subdomainParts = hostname.split('.');
  const currentSubdomain = subdomainParts[0];
  
  const reservedSubdomains = ['www', 'api', 'admin', 'app', 'support', 'dineopen'];
  return !reservedSubdomains.includes(currentSubdomain) && 
         hostname.includes('.') && 
         currentSubdomain.length > 2;
};

// Helper function to get current subdomain
export const getCurrentSubdomain = () => {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  const subdomainParts = hostname.split('.');
  return subdomainParts[0];
};

// Helper function to get restaurant ID from subdomain context
export const getRestaurantIdFromSubdomain = () => {
  // This will be used by components that need restaurant ID
  // The actual restaurant data should be loaded via useSubdomain hook
  return null; // Placeholder - actual implementation will use context
};