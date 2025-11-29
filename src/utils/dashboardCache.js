/**
 * Dashboard Cache Utility
 * Stores and retrieves dashboard data for instant page loads
 * Uses stale-while-revalidate pattern
 */

const CACHE_PREFIX = 'dashboard_cache_';
const TABLES_CACHE_PREFIX = 'tables_cache_';
const ORDERHISTORY_CACHE_PREFIX = 'orderhistory_cache_';
const CUSTOMERS_CACHE_PREFIX = 'customers_cache_';
const MENU_CACHE_PREFIX = 'menu_cache_';
const ANALYTICS_CACHE_PREFIX = 'analytics_cache_';
const KOT_CACHE_PREFIX = 'kot_cache_';
const AUTOMATION_CACHE_PREFIX = 'automation_cache_';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

/**
 * Get cached dashboard data for a restaurant
 * @param {string} restaurantId - Restaurant ID
 * @returns {Object|null} Cached data or null
 */
export function getCachedDashboardData(restaurantId) {
  try {
    const cacheKey = `${CACHE_PREFIX}${restaurantId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const data = JSON.parse(cached);
    const cacheAge = Date.now() - data.timestamp;
    
    // Return cached data even if expired (stale data is better than nothing)
    return {
      ...data.data,
      isStale: cacheAge > CACHE_EXPIRY,
      cacheAge
    };
  } catch (error) {
    console.error('Error reading dashboard cache:', error);
    return null;
  }
}

/**
 * Store dashboard data in cache
 * @param {string} restaurantId - Restaurant ID
 * @param {Object} data - Data to cache
 */
export function setCachedDashboardData(restaurantId, data) {
  try {
    const cacheKey = `${CACHE_PREFIX}${restaurantId}`;
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('✅ Dashboard data cached for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error caching dashboard data:', error);
    // If storage is full, try to clear old cache
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      // Retry once
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
}

/**
 * Clear cached data for a restaurant
 * @param {string} restaurantId - Restaurant ID
 */
export function clearDashboardCache(restaurantId) {
  try {
    const cacheKey = `${CACHE_PREFIX}${restaurantId}`;
    localStorage.removeItem(cacheKey);
    console.log('🗑️ Dashboard cache cleared for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error clearing dashboard cache:', error);
  }
}

/**
 * Clear all old cache entries
 */
function clearOldCache() {
  try {
    const now = Date.now();
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        try {
          const cached = JSON.parse(localStorage.getItem(key));
          if (now - cached.timestamp > CACHE_EXPIRY * 2) {
            // Remove cache older than 2x expiry time
            keysToRemove.push(key);
          }
        } catch (e) {
          // Invalid cache entry, remove it
          keysToRemove.push(key);
        }
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`🗑️ Cleared ${keysToRemove.length} old cache entries`);
  } catch (error) {
    console.error('Error clearing old cache:', error);
  }
}

/**
 * Check if cached data exists and is valid
 * @param {string} restaurantId - Restaurant ID
 * @returns {boolean} True if valid cache exists
 */
export function hasValidCache(restaurantId) {
  const cached = getCachedDashboardData(restaurantId);
  return cached !== null && !cached.isStale;
}

// ========== TABLES PAGE CACHE ==========

export function getCachedTablesData(restaurantId) {
  try {
    const cacheKey = `${TABLES_CACHE_PREFIX}${restaurantId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const data = JSON.parse(cached);
    return {
      ...data.data,
      isStale: Date.now() - data.timestamp > CACHE_EXPIRY,
      cacheAge: Date.now() - data.timestamp
    };
  } catch (error) {
    console.error('Error reading tables cache:', error);
    return null;
  }
}

export function setCachedTablesData(restaurantId, data) {
  try {
    const cacheKey = `${TABLES_CACHE_PREFIX}${restaurantId}`;
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('✅ Tables data cached for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error caching tables data:', error);
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
}

export function clearTablesCache(restaurantId) {
  try {
    const cacheKey = `${TABLES_CACHE_PREFIX}${restaurantId}`;
    localStorage.removeItem(cacheKey);
    console.log('🗑️ Tables cache cleared for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error clearing tables cache:', error);
  }
}

// ========== ORDERHISTORY PAGE CACHE ==========

export function getCachedOrderHistoryData(restaurantId, cacheKey = 'default') {
  try {
    const fullCacheKey = `${ORDERHISTORY_CACHE_PREFIX}${restaurantId}_${cacheKey}`;
    const cached = localStorage.getItem(fullCacheKey);
    
    if (!cached) {
      return null;
    }
    
    const data = JSON.parse(cached);
    return {
      ...data.data,
      isStale: Date.now() - data.timestamp > CACHE_EXPIRY,
      cacheAge: Date.now() - data.timestamp
    };
  } catch (error) {
    console.error('Error reading orderhistory cache:', error);
    return null;
  }
}

export function setCachedOrderHistoryData(restaurantId, data, cacheKey = 'default') {
  try {
    const fullCacheKey = `${ORDERHISTORY_CACHE_PREFIX}${restaurantId}_${cacheKey}`;
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(fullCacheKey, JSON.stringify(cacheData));
    console.log('✅ Order history data cached for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error caching order history data:', error);
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      try {
        localStorage.setItem(fullCacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
}

export function clearOrderHistoryCache(restaurantId) {
  try {
    // Clear all order history cache entries for this restaurant
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${ORDERHISTORY_CACHE_PREFIX}${restaurantId}_`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('🗑️ Order history cache cleared for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error clearing order history cache:', error);
  }
}

// ========== CUSTOMERS PAGE CACHE ==========

export function getCachedCustomersData(restaurantId) {
  try {
    const cacheKey = `${CUSTOMERS_CACHE_PREFIX}${restaurantId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const data = JSON.parse(cached);
    return {
      ...data.data,
      isStale: Date.now() - data.timestamp > CACHE_EXPIRY,
      cacheAge: Date.now() - data.timestamp
    };
  } catch (error) {
    console.error('Error reading customers cache:', error);
    return null;
  }
}

export function setCachedCustomersData(restaurantId, data) {
  try {
    const cacheKey = `${CUSTOMERS_CACHE_PREFIX}${restaurantId}`;
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('✅ Customers data cached for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error caching customers data:', error);
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
}

export function clearCustomersCache(restaurantId) {
  try {
    const cacheKey = `${CUSTOMERS_CACHE_PREFIX}${restaurantId}`;
    localStorage.removeItem(cacheKey);
    console.log('🗑️ Customers cache cleared for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error clearing customers cache:', error);
  }
}

// ========== MENU PAGE CACHE ==========

export function getCachedMenuData(restaurantId) {
  try {
    const cacheKey = `${MENU_CACHE_PREFIX}${restaurantId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const data = JSON.parse(cached);
    return {
      ...data.data,
      isStale: Date.now() - data.timestamp > CACHE_EXPIRY,
      cacheAge: Date.now() - data.timestamp
    };
  } catch (error) {
    console.error('Error reading menu cache:', error);
    return null;
  }
}

export function setCachedMenuData(restaurantId, data) {
  try {
    const cacheKey = `${MENU_CACHE_PREFIX}${restaurantId}`;
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('✅ Menu data cached for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error caching menu data:', error);
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
}

export function clearMenuCache(restaurantId) {
  try {
    const cacheKey = `${MENU_CACHE_PREFIX}${restaurantId}`;
    localStorage.removeItem(cacheKey);
    console.log('🗑️ Menu cache cleared for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error clearing menu cache:', error);
  }
}

// ========== ANALYTICS PAGE CACHE ==========

export function getCachedAnalyticsData(restaurantId, period = 'today') {
  try {
    const cacheKey = `${ANALYTICS_CACHE_PREFIX}${restaurantId}_${period}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const data = JSON.parse(cached);
    return {
      ...data.data,
      isStale: Date.now() - data.timestamp > CACHE_EXPIRY,
      cacheAge: Date.now() - data.timestamp
    };
  } catch (error) {
    console.error('Error reading analytics cache:', error);
    return null;
  }
}

export function setCachedAnalyticsData(restaurantId, data, period = 'today') {
  try {
    const cacheKey = `${ANALYTICS_CACHE_PREFIX}${restaurantId}_${period}`;
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('✅ Analytics data cached for restaurant:', restaurantId, 'period:', period);
  } catch (error) {
    console.error('Error caching analytics data:', error);
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
}

export function clearAnalyticsCache(restaurantId) {
  try {
    // Clear all analytics cache entries for this restaurant
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${ANALYTICS_CACHE_PREFIX}${restaurantId}_`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log('🗑️ Analytics cache cleared for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error clearing analytics cache:', error);
  }
}

// ========== KOT PAGE CACHE ==========

export function getCachedKotData(restaurantId) {
  try {
    const cacheKey = `${KOT_CACHE_PREFIX}${restaurantId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const data = JSON.parse(cached);
    return {
      ...data.data,
      isStale: Date.now() - data.timestamp > CACHE_EXPIRY,
      cacheAge: Date.now() - data.timestamp
    };
  } catch (error) {
    console.error('Error reading KOT cache:', error);
    return null;
  }
}

export function setCachedKotData(restaurantId, data) {
  try {
    const cacheKey = `${KOT_CACHE_PREFIX}${restaurantId}`;
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('✅ KOT data cached for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error caching KOT data:', error);
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
}

export function clearKotCache(restaurantId) {
  try {
    const cacheKey = `${KOT_CACHE_PREFIX}${restaurantId}`;
    localStorage.removeItem(cacheKey);
    console.log('🗑️ KOT cache cleared for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error clearing KOT cache:', error);
  }
}

// ========== AUTOMATION PAGE CACHE ==========

export function getCachedAutomationData(restaurantId) {
  try {
    const cacheKey = `${AUTOMATION_CACHE_PREFIX}${restaurantId}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }
    
    const data = JSON.parse(cached);
    return {
      ...data.data,
      isStale: Date.now() - data.timestamp > CACHE_EXPIRY,
      cacheAge: Date.now() - data.timestamp
    };
  } catch (error) {
    console.error('Error reading automation cache:', error);
    return null;
  }
}

export function setCachedAutomationData(restaurantId, data) {
  try {
    const cacheKey = `${AUTOMATION_CACHE_PREFIX}${restaurantId}`;
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    console.log('✅ Automation data cached for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error caching automation data:', error);
    if (error.name === 'QuotaExceededError') {
      clearOldCache();
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.error('Failed to cache after cleanup:', retryError);
      }
    }
  }
}

export function clearAutomationCache(restaurantId) {
  try {
    const cacheKey = `${AUTOMATION_CACHE_PREFIX}${restaurantId}`;
    localStorage.removeItem(cacheKey);
    console.log('🗑️ Automation cache cleared for restaurant:', restaurantId);
  } catch (error) {
    console.error('Error clearing automation cache:', error);
  }
}

