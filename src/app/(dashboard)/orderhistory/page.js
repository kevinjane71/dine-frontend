'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../lib/api';
import { extractTokenFromUrl, hasTokenInUrl } from '../../../utils/urlTokenExtractor';
import { 
  FaSearch,
  FaFilter,
  FaChevronLeft, 
  FaChevronRight,
  FaClock,
  FaUser,
  FaTable,
  FaPhone,
  FaCheckCircle,
  FaUtensils,
  FaReceipt,
  FaSpinner,
  FaCalendarAlt,
  FaSortAmountDown,
  FaEye,
  FaEdit
} from 'react-icons/fa';

const OrderHistory = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrderType, setSelectedOrderType] = useState('all');
  const [selectedWaiter, setSelectedWaiter] = useState('all');
  const [waiters, setWaiters] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit] = useState(10);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge color
  const getStatusColor = (status, orderFlow) => {
    if (orderFlow?.isDirectBilling) {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (orderFlow?.isKitchenOrder) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (status === 'completed') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (status === 'confirmed') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (status === 'pending') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Get status display text
  const getStatusText = (status, orderFlow) => {
    if (orderFlow?.isDirectBilling) {
      return 'Direct Billing';
    }
    if (orderFlow?.isKitchenOrder) {
      return 'Kitchen Order';
    }
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
  };

  // Get order flow icon
  const getOrderFlowIcon = (orderFlow) => {
    if (orderFlow?.isDirectBilling) {
      return <FaReceipt className="text-green-600" />;
    }
    if (orderFlow?.isKitchenOrder) {
      return <FaUtensils className="text-blue-600" />;
    }
    return <FaCheckCircle className="text-gray-600" />;
  };

  const fetchOrders = useCallback(async () => {
    if (!restaurantId) return;

      try {
        setLoading(true);
        setError(null);
        
      const filters = {
        page: currentPage,
        limit: limit,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        orderType: selectedOrderType !== 'all' ? selectedOrderType : undefined,
        waiterId: selectedWaiter !== 'all' ? selectedWaiter : undefined,
        search: searchTerm.trim() || undefined
      };

      console.log('Orders page: Fetching orders with filters:', filters);
      const response = await apiClient.getOrders(restaurantId, filters);
      
      console.log('Orders page: API response:', response);
      
      setOrders(response.orders || []);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalOrders(response.pagination?.totalOrders || 0);
      
    } catch (error) {
      console.error('Orders page: Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
      setOrders([]);
    } finally {
          setLoading(false);
    }
  }, [restaurantId, currentPage, limit, selectedStatus, selectedOrderType, selectedWaiter, searchTerm]);

  const fetchWaiters = useCallback(async () => {
    if (!restaurantId) return;

    try {
      const response = await apiClient.getWaiters(restaurantId);
      setWaiters(response.waiters || []);
    } catch (error) {
      console.error('Error fetching waiters:', error);
      setWaiters([]);
    }
  }, [restaurantId]);

  useEffect(() => {
    // First, check if there's a token in the URL
    if (hasTokenInUrl()) {
      console.log('🔗 Order History: Token found in URL, extracting...');
      const urlData = extractTokenFromUrl();
      
      if (urlData.token) {
        console.log('🔑 Order History: Setting token from URL');
        apiClient.setToken(urlData.token);
      }
      
      if (urlData.user) {
        console.log('👤 Order History: Setting user data from URL');
        apiClient.setUser(urlData.user);
      }
    }
    
    const token = apiClient.getToken();
    const userData = apiClient.getUser();

    if (!token || !userData?.id) {
      router.push('/login');
      return;
    }
        
    setUser(userData);
    
    // Get restaurant ID from user data (same approach as dashboard)
    let restaurantId = null;
    let restaurant = null;
    
    // First, try to use default restaurant from user data
    if (userData?.defaultRestaurant) {
      restaurant = userData.defaultRestaurant;
      restaurantId = restaurant.id;
      console.log('🏢 Order History: Using default restaurant from user data:', restaurant.name);
    }
    // For staff members, use their assigned restaurant
    else if (userData?.restaurantId) {
      restaurantId = userData.restaurantId;
      // Try to get restaurant data from user object
      if (userData.restaurant) {
        restaurant = userData.restaurant;
      } else {
        // Fallback to localStorage or create basic restaurant object
        const savedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}');
        restaurant = savedRestaurant.id === restaurantId ? savedRestaurant : { id: restaurantId, name: 'Restaurant' };
      }
      console.log('👨‍💼 Order History: Staff user, using assigned restaurant:', restaurant?.name);
    }
    // For owners/customers, try localStorage fallback
    else {
      const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
      const savedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}');
      
      if (savedRestaurantId && savedRestaurant.id === savedRestaurantId) {
        restaurantId = savedRestaurantId;
        restaurant = savedRestaurant;
        console.log('🏢 Order History: Using saved restaurant from localStorage:', restaurant?.name);
      } else {
        console.log('❌ Order History: No restaurant ID found');
        setError('No restaurant found. Please select a restaurant.');
        setLoading(false);
        return;
      }
    }
    
    if (restaurantId) {
      console.log('✅ Order History: Restaurant ID found:', restaurantId);
      setRestaurantId(restaurantId);
      setRestaurant(restaurant);
      fetchWaiters();
    } else {
      console.log('❌ Order History: No restaurant ID found');
      setError('No restaurant found. Please select a restaurant.');
      setLoading(false);
    }
  }, [router, fetchWaiters]);

  useEffect(() => {
    if (restaurantId) {
      fetchOrders();
    }
  }, [fetchOrders]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedStatus, selectedOrderType, selectedWaiter, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleViewOrder = (orderId) => {
    // Navigate to order details or open modal
    console.log('View order:', orderId);
  };

  const handleEditOrder = (orderId) => {
    // Navigate to edit order or open modal
    console.log('Edit order:', orderId);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading order history...</p>
        </div>
      </div>
    );
  }

    return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
                <p className="text-gray-600 mt-1">
                  {restaurant?.name} • {totalOrders} total orders
                </p>
            </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
          </div>
        </div>
      </div>
            </div>
          </div>
            </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                  placeholder="Search by order ID, table, customer..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </form>
                </div>
                
            {/* Status Filter */}
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
            {/* Order Type Filter */}
                <div>
                  <select
                value={selectedOrderType}
                onChange={(e) => setSelectedOrderType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Types</option>
                    <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
                    <option value="delivery">Delivery</option>
                  </select>
                </div>
                
            {/* Waiter Filter */}
                <div>
                  <select
                    value={selectedWaiter}
                    onChange={(e) => setSelectedWaiter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  >
                    <option value="all">All Waiters</option>
                {waiters.map((waiter) => (
                      <option key={waiter.id} value={waiter.id}>
                    {waiter.name}
                      </option>
                    ))}
                  </select>
            </div>
          </div>
                </div>
                
        {/* Orders Timeline */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <FaReceipt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">
                {searchTerm || selectedStatus !== 'all' || selectedOrderType !== 'all' || selectedWaiter !== 'all'
                  ? 'Try adjusting your filters to see more orders.'
                  : 'Orders will appear here once they are placed.'}
              </p>
              </div>
          ) : (
            orders.map((order, index) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Timeline Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          {getOrderFlowIcon(order.orderFlow)}
            </div>
          </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.orderNumber || order.id.slice(-8).toUpperCase()}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status, order.orderFlow)}`}>
                            {getStatusText(order.status, order.orderFlow)}
                          </span>
          </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          {/* Customer Info */}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FaUser className="text-gray-400" />
                            <span>{order.customerDisplay?.name}</span>
                            {order.customerDisplay?.phone && (
                              <>
                                <FaPhone className="text-gray-400 ml-2" />
                                <span>{order.customerDisplay.phone}</span>
                              </>
                            )}
                    </div>
                    
                          {/* Table Info */}
                          {order.customerDisplay?.tableNumber && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <FaTable className="text-gray-400" />
                              <span>Table {order.customerDisplay.tableNumber}</span>
                          </div>
                        )}

                          {/* Staff Info */}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FaUser className="text-gray-400" />
                            <span>{order.staffDisplay?.name}</span>
                    </div>
                    
                          {/* Order Type */}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FaUtensils className="text-gray-400" />
                            <span className="capitalize">{order.orderType?.replace('-', ' ')}</span>
                    </div>
                  </div>

                        {/* Items */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Items ({Array.isArray(order.items) ? order.items.length : 0})</h4>
                          <div className="space-y-1">
                            {Array.isArray(order.items) && order.items.slice(0, 3).map((item, itemIndex) => (
                              <div key={itemIndex} className="flex justify-between text-sm text-gray-600">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.total}</span>
                    </div>
                            ))}
                            {Array.isArray(order.items) && order.items.length > 3 && (
                              <div className="text-sm text-gray-500">
                                +{order.items.length - 3} more items
                    </div>
                            )}
                    </div>
                  </div>

                        {/* Timestamps */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FaClock className="text-gray-400" />
                            <span>Created: {formatDate(order.createdAt)}</span>
                    </div>
                          {order.completedAt && (
                            <div className="flex items-center space-x-1">
                              <FaCheckCircle className="text-gray-400" />
                              <span>Completed: {formatDate(order.completedAt)}</span>
                    </div>
                          )}
                  </div>
                  </div>
                </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">
                          ₹{order.totalAmount?.toFixed(2) || '0.00'}
                  </div>
                        <div className="text-sm text-gray-500">
                          {order.paymentMethod?.toUpperCase() || 'CASH'}
                  </div>
                    </div>
                      <div className="flex space-x-2">
                  <button
                          onClick={() => handleViewOrder(order.id)}
                          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="View Order"
                        >
                          <FaEye />
                  </button>
                        {order.status !== 'completed' && (
                  <button
                            onClick={() => handleEditOrder(order.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Edit Order"
                          >
                            <FaEdit />
                  </button>
                )}
              </div>
            </div>
          </div>
                </div>
              </div>
            ))
        )}
      </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalOrders)} of {totalOrders} orders
                </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="w-4 h-4" />
                </button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-md ${
                          currentPage === pageNum
                            ? 'bg-red-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
              </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronRight className="w-4 h-4" />
                </button>
                    </div>
                  </div>
                </div>
              )}
              </div>
                  </div>
  );
};

export default OrderHistory;