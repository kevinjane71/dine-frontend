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
  
  // Redirect to main domain login page
  window.location.href = 'https://dineopen.com/login';
};

export default performLogout;



