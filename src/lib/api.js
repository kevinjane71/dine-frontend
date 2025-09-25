const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dine-backend-lake.vercel.app';

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
    }
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

  async updateOrderStatus(orderId, status) {
    return this.request(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status },
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
}

const apiClient = new ApiClient();
export default apiClient;