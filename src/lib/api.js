const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  setToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  clearToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('restaurant');
      localStorage.removeItem('selectedRestaurant');
      localStorage.removeItem('selectedRestaurantId');
      localStorage.removeItem('cart');
      localStorage.removeItem('dine_cart');
      localStorage.removeItem('dine_saved_order');
      localStorage.removeItem('order');
      localStorage.removeItem('currentOrder');
      localStorage.removeItem('menuItems');
      localStorage.removeItem('categories');
      localStorage.removeItem('staff');
      localStorage.removeItem('settings');
      localStorage.removeItem('tables');
      localStorage.removeItem('floors');
      localStorage.removeItem('analytics');
      localStorage.removeItem('inventory');
      localStorage.removeItem('payments');
      localStorage.removeItem('customers');
      localStorage.removeItem('bookings');
      localStorage.removeItem('loyalty');
      localStorage.removeItem('feedback');
      localStorage.removeItem('suppliers');
      localStorage.removeItem('userRestaurants');
      localStorage.removeItem('restaurantSettings');
      localStorage.removeItem('discountSettings');
      
      // Clear session storage as well
      sessionStorage.clear();
    }
  }

  // Authentication utilities
  isAuthenticated() {
    if (typeof window === 'undefined') return false;
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  getUser() {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getRedirectPath() {
    if (typeof window === 'undefined') return '/login';
    const user = this.getUser();
    if (!user) return '/login';
    
    // Check if user has restaurants
    const hasRestaurants = localStorage.getItem('selectedRestaurantId');
    
    if (user.role === 'owner' || user.role === 'customer') {
      return hasRestaurants ? '/dashboard' : '/admin';
    } else if (user.role === 'staff') {
      return '/dashboard';
    }
    
    return '/login';
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: userData,
    });
  }

  async verifyEmail(email, otp) {
    return this.request('/api/auth/verify-email', {
      method: 'POST',
      body: { email, otp },
    });
  }

  async login(credentials) {
    const response = await this.request('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async googleLogin(token) {
    const response = await this.request('/api/auth/google', {
      method: 'POST',
      body: { token },
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async sendPhoneOTP(phone) {
    return this.request('/api/auth/phone/send-otp', {
      method: 'POST',
      body: { phone },
    });
  }

  async verifyPhoneOTP(phone, otp, name) {
    const response = await this.request('/api/auth/phone/verify-otp', {
      method: 'POST',
      body: { phone, otp, name },
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Restaurant endpoints
  async getRestaurants() {
    return this.request('/api/restaurants');
  }

  async createRestaurant(restaurantData) {
    return this.request('/api/restaurants', {
      method: 'POST',
      body: restaurantData,
    });
  }

  async updateRestaurant(restaurantId, updateData) {
    return this.request(`/api/restaurants/${restaurantId}`, {
      method: 'PATCH',
      body: updateData,
    });
  }

  async deleteRestaurant(restaurantId) {
    return this.request(`/api/restaurants/${restaurantId}`, {
      method: 'DELETE',
    });
  }

  // Menu endpoints
  async getMenu(restaurantId, category = null) {
    const query = category ? `?category=${category}` : '';
    return this.request(`/api/menus/${restaurantId}${query}`);
  }

  async createMenuItem(restaurantId, menuItemData) {
    return this.request(`/api/menus/${restaurantId}`, {
      method: 'POST',
      body: menuItemData,
    });
  }

  async updateMenuItem(itemId, updateData) {
    return this.request(`/api/menus/item/${itemId}`, {
      method: 'PATCH',
      body: updateData,
    });
  }

  async deleteMenuItem(itemId) {
    return this.request(`/api/menus/item/${itemId}`, {
      method: 'DELETE',
    });
  }

  // Bulk menu upload endpoints
  async bulkUploadMenu(restaurantId, formData) {
    const url = `${this.baseURL}/api/menus/bulk-upload/${restaurantId}`;
    const token = this.getToken();

    const config = {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type, let the browser set it for FormData
        ...(token && { Authorization: `Bearer ${token}` }),
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async bulkSaveMenuItems(restaurantId, menuItems) {
    return this.request(`/api/menus/bulk-save/${restaurantId}`, {
      method: 'POST',
      body: { menuItems },
    });
  }

  async getUploadStatus(restaurantId) {
    return this.request(`/api/menus/upload-status/${restaurantId}`);
  }

  // Public API endpoints (no authentication required)
  async getPublicMenu(restaurantId) {
    return this.request(`/api/public/menu/${restaurantId}`);
  }

  async placePublicOrder(restaurantId, orderData) {
    return this.request(`/api/public/orders/${restaurantId}`, {
      method: 'POST',
      body: orderData,
    });
  }

  // Order endpoints
  async createOrder(orderData) {
    return this.request('/api/orders', {
      method: 'POST',
      body: orderData,
    });
  }

  async getOrders(restaurantId, filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const queryString = query ? `?${query}` : '';
    return this.request(`/api/orders/${restaurantId}${queryString}`);
  }

  async updateOrderStatus(orderId, status, restaurantId = null) {
    const body = { status };
    if (restaurantId) {
      body.restaurantId = restaurantId;
    }
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body,
    });
  }

  async updateOrder(orderId, updateData) {
    return this.request(`/api/orders/${orderId}`, {
      method: 'PATCH',
      body: updateData,
    });
  }

  // Payment endpoints
  async createPayment(orderData) {
    return this.request('/api/payments/create', {
      method: 'POST',
      body: orderData,
    });
  }

  async verifyPayment(paymentData) {
    return this.request('/api/payments/verify', {
      method: 'POST',
      body: paymentData,
    });
  }

  async completeOrder(orderId) {
    return this.request(`/api/orders/${orderId}/complete`, {
      method: 'POST',
    });
  }

  // Category Management APIs
  async getCategories(restaurantId) {
    return this.request(`/api/categories/${restaurantId}`, {
      method: 'GET',
    });
  }

  async createCategory(restaurantId, categoryData) {
    return this.request(`/api/categories/${restaurantId}`, {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(restaurantId, categoryId, categoryData) {
    return this.request(`/api/categories/${restaurantId}/${categoryId}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(restaurantId, categoryId) {
    return this.request(`/api/categories/${restaurantId}/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // Analytics endpoints
  async getAnalytics(restaurantId, period = '7d') {
    return this.request(`/api/analytics/${restaurantId}?period=${period}`);
  }

  // Table management endpoints
  async getTables(restaurantId) {
    return this.request(`/api/tables/${restaurantId}`);
  }

  async createTable(restaurantId, tableData) {
    return this.request(`/api/tables/${restaurantId}`, {
      method: 'POST',
      body: tableData,
    });
  }

  async updateTableStatus(tableId, status, orderId = null) {
    return this.request(`/api/tables/${tableId}/status`, {
      method: 'PATCH',
      body: { status, orderId },
    });
  }

  async updateTable(tableId, updateData) {
    return this.request(`/api/tables/${tableId}`, {
      method: 'PATCH',
      body: updateData,
    });
  }

  async deleteTable(tableId) {
    return this.request(`/api/tables/${tableId}`, {
      method: 'DELETE',
    });
  }

  // Floor management endpoints
  async getFloors(restaurantId) {
    return this.request(`/api/floors/${restaurantId}`);
  }

  async createFloor(restaurantId, floorData) {
    return this.request(`/api/floors/${restaurantId}`, {
      method: 'POST',
      body: floorData,
    });
  }

  async updateFloor(floorId, updateData) {
    return this.request(`/api/floors/${floorId}`, {
      method: 'PATCH',
      body: updateData,
    });
  }

  async deleteFloor(floorId) {
    return this.request(`/api/floors/${floorId}`, {
      method: 'DELETE',
    });
  }

  // Table booking endpoints
  async createBooking(restaurantId, bookingData) {
    return this.request(`/api/bookings/${restaurantId}`, {
      method: 'POST',
      body: bookingData,
    });
  }

  async getBookings(restaurantId, filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const queryString = query ? `?${query}` : '';
    return this.request(`/api/bookings/${restaurantId}${queryString}`);
  }

  async updateBooking(bookingId, updateData) {
    return this.request(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      body: updateData,
    });
  }

  async cancelBooking(bookingId) {
    return this.request(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  }

  // Utility endpoints
  async seedData(restaurantId) {
    return this.request(`/api/seed-data/${restaurantId}`, {
      method: 'POST',
    });
  }

  async seedOrders(restaurantId) {
    return this.request(`/api/seed-orders/${restaurantId}`, {
      method: 'POST',
    });
  }

  async getWaiters(restaurantId) {
    return this.request(`/api/waiters/${restaurantId}`);
  }

  // Staff Management endpoints
  async getStaff(restaurantId) {
    return this.request(`/api/staff/${restaurantId}`);
  }

  async addStaff(restaurantId, staffData) {
    return this.request(`/api/staff/${restaurantId}`, {
      method: 'POST',
      body: staffData,
    });
  }

  async updateStaff(staffId, updateData) {
    return this.request(`/api/staff/${staffId}`, {
      method: 'PATCH',
      body: updateData,
    });
  }

  async deleteStaff(staffId) {
    return this.request(`/api/staff/${staffId}`, {
      method: 'DELETE',
    });
  }

  // User Page Access
  async getUserPageAccess() {
    return this.request('/api/user/page-access');
  }

  // User Profile
  async getUserProfile() {
    return this.request('/api/user/profile');
  }

  async staffLogin(loginId, password) {
    const response = await this.request('/api/auth/staff/login', {
      method: 'POST',
      body: { loginId, password },
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // KOT (Kitchen Order Ticket) endpoints
  async getKotOrders(restaurantId, status = null) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/api/kot/${restaurantId}${query}`);
  }

  async updateKotStatus(orderId, status, notes = null) {
    return this.request(`/api/kot/${orderId}/status`, {
      method: 'PATCH',
      body: { status, ...(notes && { notes }) },
    });
  }

  async getKotDetails(restaurantId, orderId) {
    return this.request(`/api/kot/${restaurantId}/${orderId}`);
  }

  async startCooking(orderId) {
    return this.request(`/api/kot/${orderId}/status`, {
      method: 'PATCH',
      body: { 
        status: 'preparing',
        cookingStartTime: new Date().toISOString()
      }
    });
  }

  async markReady(orderId) {
    return this.request(`/api/kot/${orderId}/status`, {
      method: 'PATCH',
      body: { 
        status: 'ready',
        cookingEndTime: new Date().toISOString()
      }
    });
  }

  async markServed(orderId) {
    return this.request(`/api/kot/${orderId}/status`, {
      method: 'PATCH',
      body: { status: 'served' },
    });
  }

  async completeOrder(orderId) {
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status: 'completed' },
    });
  }

  async deleteOrder(orderId) {
    return this.request(`/api/orders/${orderId}`, {
      method: 'DELETE',
    });
  }

  // Inventory Management endpoints
  async getInventoryItems(restaurantId, filters = {}) {
    const query = new URLSearchParams(filters).toString();
    const queryString = query ? `?${query}` : '';
    return this.request(`/api/inventory/${restaurantId}${queryString}`);
  }

  async getInventoryItem(restaurantId, itemId) {
    return this.request(`/api/inventory/${restaurantId}/${itemId}`);
  }

  async createInventoryItem(restaurantId, itemData) {
    return this.request(`/api/inventory/${restaurantId}`, {
      method: 'POST',
      body: itemData,
    });
  }

  async updateInventoryItem(restaurantId, itemId, updateData) {
    return this.request(`/api/inventory/${restaurantId}/${itemId}`, {
      method: 'PATCH',
      body: updateData,
    });
  }

  async deleteInventoryItem(restaurantId, itemId) {
    return this.request(`/api/inventory/${restaurantId}/${itemId}`, {
      method: 'DELETE',
    });
  }

  async getInventoryCategories(restaurantId) {
    return this.request(`/api/inventory/${restaurantId}/categories`);
  }

  async getInventoryDashboard(restaurantId) {
    return this.request(`/api/inventory/${restaurantId}/dashboard`);
  }

  // Supplier Management endpoints
  async getSuppliers(restaurantId) {
    return this.request(`/api/suppliers/${restaurantId}`);
  }

  async createSupplier(restaurantId, supplierData) {
    return this.request(`/api/suppliers/${restaurantId}`, {
      method: 'POST',
      body: supplierData,
    });
  }

  async updateSupplier(restaurantId, supplierId, updateData) {
    return this.request(`/api/suppliers/${restaurantId}/${supplierId}`, {
      method: 'PATCH',
      body: updateData,
    });
  }

  async deleteSupplier(restaurantId, supplierId) {
    return this.request(`/api/suppliers/${restaurantId}/${supplierId}`, {
      method: 'DELETE',
    });
  }

  // Admin Settings endpoints
  async getAdminSettings(restaurantId) {
    return this.request(`/api/admin/settings/${restaurantId}`);
  }

  async updateAdminSettings(restaurantId, settingsData) {
    return this.request(`/api/admin/settings/${restaurantId}`, {
      method: 'PUT',
      body: settingsData,
    });
  }

  async applyDiscount(restaurantId, discountData) {
    return this.request(`/api/admin/settings/${restaurantId}/apply-discount`, {
      method: 'POST',
      body: discountData,
    });
  }

  async getRestaurantStatus(restaurantId) {
    return this.request(`/api/admin/settings/${restaurantId}/status`);
  }

  async updateRestaurantStatus(restaurantId, statusData) {
    return this.request(`/api/admin/settings/${restaurantId}/status`, {
      method: 'PUT',
      body: statusData,
    });
  }

  // Tax Management endpoints
  async getTaxSettings(restaurantId) {
    return this.request(`/api/admin/tax/${restaurantId}`);
  }

  async updateTaxSettings(restaurantId, taxSettings) {
    return this.request(`/api/admin/tax/${restaurantId}`, {
      method: 'PUT',
      body: { taxSettings },
    });
  }

  async calculateTax(restaurantId, items, subtotal) {
    return this.request(`/api/tax/calculate/${restaurantId}`, {
      method: 'POST',
      body: { items, subtotal },
    });
  }

  // Invoice Management endpoints
  async generateInvoice(orderId) {
    return this.request(`/api/invoice/generate/${orderId}`, {
      method: 'POST',
    });
  }

  async getInvoice(invoiceId) {
    return this.request(`/api/invoice/${invoiceId}`);
  }

  async getInvoices(restaurantId, options = {}) {
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.append('limit', options.limit);
    if (options.offset) queryParams.append('offset', options.offset);
    if (options.startDate) queryParams.append('startDate', options.startDate);
    if (options.endDate) queryParams.append('endDate', options.endDate);
    
    const query = queryParams.toString();
    return this.request(`/api/invoices/${restaurantId}${query ? `?${query}` : ''}`);
  }
}

const apiClient = new ApiClient();
export default apiClient;