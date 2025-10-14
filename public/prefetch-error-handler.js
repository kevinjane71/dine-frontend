// Global prefetch error handler
(function() {
  'use strict';
  
  // Store original fetch
  const originalFetch = window.fetch;
  
  // Override fetch to handle prefetch errors
  window.fetch = function(...args) {
    const [url, options = {}] = args;
    
    // Check if this is a prefetch request
    const isPrefetch = options.headers && (
      options.headers['Next-Router-Prefetch'] === '1' ||
      options.headers['next-router-prefetch'] === '1' ||
      (typeof options.headers.get === 'function' && options.headers.get('Next-Router-Prefetch') === '1')
    );
    
    // For prefetch requests, catch errors and don't let them bubble up
    if (isPrefetch) {
      console.log('🚫 Intercepting prefetch request:', url);
      
      return originalFetch.apply(this, args).catch(error => {
        console.log('🚫 Prefetch error caught and ignored:', url, error.message);
        
        // Return a mock response to prevent the error from causing issues
        return Promise.resolve({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          json: () => Promise.resolve({ error: 'Prefetch blocked' }),
          text: () => Promise.resolve('Prefetch blocked'),
        });
      });
    }
    
    // For non-prefetch requests, use original fetch
    return originalFetch.apply(this, args);
  };
  
  // Handle unhandled promise rejections from prefetch
  window.addEventListener('unhandledrejection', function(event) {
    const error = event.reason;
    
    // Check if this is a prefetch-related error
    if (error && (
      error.message && (
        error.message.includes('prefetch') ||
        error.message.includes('Next-Router-Prefetch') ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized')
      )
    )) {
      console.log('🚫 Unhandled prefetch error caught and ignored:', error.message);
      event.preventDefault(); // Prevent the error from being logged to console
      return;
    }
    
    // Let other errors through normally
  });
  
  // Handle fetch errors specifically
  window.addEventListener('error', function(event) {
    const error = event.error;
    
    if (error && error.message && (
      error.message.includes('prefetch') ||
      error.message.includes('Next-Router-Prefetch')
    )) {
      console.log('🚫 Fetch error caught and ignored:', error.message);
      event.preventDefault();
      return;
    }
  });
  
  console.log('🛡️ Prefetch error handler initialized');
})();
