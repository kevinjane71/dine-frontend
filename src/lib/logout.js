/**
 * Logout utility function
 * Clears all localStorage and sessionStorage data and redirects to main domain login
 */

export const performLogout = () => {
  // Clear all localStorage data
  const keysToRemove = [
    'authToken',
    'user',
    'restaurant',
    'selectedRestaurant',
    'selectedRestaurantId',
    'cart',
    'dine_cart',
    'dine_saved_order',
    'order',
    'currentOrder',
    'menuItems',
    'categories',
    'staff',
    'settings',
    'tables',
    'floors',
    'analytics',
    'inventory',
    'payments',
    'customers',
    'bookings',
    'loyalty',
    'feedback',
    'suppliers',
    'userRestaurants',
    'restaurantSettings',
    'discountSettings',
    'language',
    'theme',
    'notifications',
    'preferences'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
  });
  
  // Clear sessionStorage as well
  sessionStorage.clear();
  
  // Clear cookies (for cross-subdomain SSO)
  if (typeof document !== 'undefined') {
    const isProduction = window.location.hostname.includes('dineopen.com');
    const domain = isProduction ? '.dineopen.com' : '';
    document.cookie = `dine_auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax${isProduction ? ';Secure' : ''}${domain ? `;domain=${domain}` : ''}`;
    document.cookie = `dine_user_data=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax${isProduction ? ';Secure' : ''}${domain ? `;domain=${domain}` : ''}`;
    // Also try without domain
    document.cookie = `dine_auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax${isProduction ? ';Secure' : ''}`;
    document.cookie = `dine_user_data=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Lax${isProduction ? ';Secure' : ''}`;
  }
  
  // Redirect to main domain login page
  window.location.href = 'https://dineopen.com/login';
};

export default performLogout;
