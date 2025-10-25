'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../lib/api';
import { 
  FaSearch,
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
  FaEye,
  FaEdit,
  FaChevronDown,
  FaFilter,
  FaChevronUp,
  FaChevronDown as FaChevronDownIcon,
  FaCopy
} from 'react-icons/fa';

const OrderHistory = () => {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrderType, setSelectedOrderType] = useState('all');
  const [myOrdersOnly, setMyOrdersOnly] = useState(false);
  const [todayOrdersOnly, setTodayOrdersOnly] = useState(true); // Default to today only
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  
  // Custom dropdown states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  
  // Expanded orders state for showing full item lists
  const [expandedOrders, setExpandedOrders] = useState(new Set());

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-dropdown')) {
        setStatusDropdownOpen(false);
        setTypeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit] = useState(10);

  // Get today's midnight timestamp
  const getTodayMidnight = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Check if order is from today
  const isOrderFromToday = (orderDate) => {
    if (!orderDate) return false;
    
    try {
      let d;
      if (orderDate.toDate && typeof orderDate.toDate === 'function') {
        d = orderDate.toDate();
      } else if (orderDate._seconds) {
        // Handle Firestore timestamp format
        d = new Date(orderDate._seconds * 1000);
      } else if (orderDate instanceof Date) {
        d = orderDate;
      } else if (typeof orderDate === 'string' || typeof orderDate === 'number') {
        d = new Date(orderDate);
      } else {
        return false;
      }
      
      if (isNaN(d.getTime())) return false;
      
      const todayMidnight = getTodayMidnight();
      return d >= todayMidnight;
    } catch (error) {
      console.error('Date comparison error:', error);
      return false;
    }
  };

  // Toggle order expansion
  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  // Copy to clipboard functionality
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Improved date formatting
  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    try {
      let d;
      if (date.toDate && typeof date.toDate === 'function') {
        // Firestore timestamp
        d = date.toDate();
      } else if (date._seconds) {
        // Handle Firestore timestamp format
        d = new Date(date._seconds * 1000);
      } else if (date instanceof Date) {
        d = date;
      } else if (typeof date === 'string' || typeof date === 'number') {
        d = new Date(date);
      } else {
        return 'N/A';
      }
      
      // Check if date is valid
      if (isNaN(d.getTime())) {
        return 'N/A';
      }
      
      return d.toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
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
      return 'Billing Completed';
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
        myOrdersOnly: myOrdersOnly ? user?.id : undefined,
        search: searchTerm.trim() || undefined,
        todayOnly: todayOrdersOnly
      };

      console.log('Orders page: Fetching orders with filters:', filters);
      const response = await apiClient.getOrders(restaurantId, filters);
      
      console.log('Orders page: API response:', response);
      
      // Since backend now supports todayOnly, we don't need client-side filtering
      let filteredOrders = response.orders || [];
      
      // Sort by latest first
      filteredOrders.sort((a, b) => {
        let dateA, dateB;
        
        if (a.createdAt?.toDate && typeof a.createdAt.toDate === 'function') {
          dateA = a.createdAt.toDate();
        } else if (a.createdAt?._seconds) {
          dateA = new Date(a.createdAt._seconds * 1000);
        } else {
          dateA = new Date(a.createdAt);
        }
        
        if (b.createdAt?.toDate && typeof b.createdAt.toDate === 'function') {
          dateB = b.createdAt.toDate();
        } else if (b.createdAt?._seconds) {
          dateB = new Date(b.createdAt._seconds * 1000);
        } else {
          dateB = new Date(b.createdAt);
        }
        
        return dateB - dateA; // Latest first
      });
      
      setOrders(filteredOrders);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalOrders(response.pagination?.totalOrders || filteredOrders.length);
      
    } catch (error) {
      console.error('Orders page: Error fetching orders:', error);
      setError('Failed to fetch orders. Please try again.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, currentPage, limit, selectedStatus, selectedOrderType, myOrdersOnly, searchTerm, todayOrdersOnly, user?.id]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
    const savedRestaurant = JSON.parse(localStorage.getItem('selectedRestaurant') || '{}');

    if (!token || !userData.id) {
      router.push('/login');
      return;
    }
        
    setUser(userData);
    setRestaurantId(savedRestaurantId);
    setRestaurant(savedRestaurant);
  }, [router]);

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
  }, [selectedStatus, selectedOrderType, myOrdersOnly, searchTerm, todayOrdersOnly]);

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
    console.log('View order:', orderId);
  };

  const handleEditOrder = (orderId) => {
    console.log('Edit order:', orderId);
    
    // Redirect to dashboard with order ID in URL
    router.push(`/dashboard?orderId=${orderId}&mode=edit`);
  };

  // Cool Custom Dropdown Component
  const CustomDropdown = ({ 
    isOpen, 
    onToggle, 
    selectedValue, 
    options, 
    onSelect, 
    placeholder,
    className = ""
  }) => (
    <div className={`relative custom-dropdown ${className}`}>
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 text-left bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 flex items-center justify-between text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300"
      >
        <span className="truncate text-gray-700">
          {options.find(opt => opt.value === selectedValue)?.label || placeholder}
        </span>
        <div className={`ml-3 transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <FaChevronDown className="text-gray-500 text-xs" />
        </div>
      </button>
      
      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto backdrop-blur-sm">
          <div className="py-2">
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => {
                  onSelect(option.value);
                  onToggle();
                }}
                className={`w-full px-4 py-3 text-left text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 ${
                  selectedValue === option.value 
                    ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 font-semibold border-l-4 border-red-500' 
                    : 'text-gray-700 hover:text-gray-900'
                } ${index === 0 ? 'rounded-t-lg' : ''} ${index === options.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  {selectedValue === option.value && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                  <span>{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

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

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'dine-in', label: 'Dine In' },
    { value: 'takeaway', label: 'Takeaway' },
    { value: 'delivery', label: 'Delivery' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Order History</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6 backdrop-blur-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6">
            {/* Search */}
            <div className="sm:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search by daily order ID, table, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 font-medium"
                />
              </form>
            </div>
            
            {/* Status Filter */}
            <CustomDropdown
              isOpen={statusDropdownOpen}
              onToggle={() => setStatusDropdownOpen(!statusDropdownOpen)}
              selectedValue={selectedStatus}
              options={statusOptions}
              onSelect={setSelectedStatus}
              placeholder="All Status"
            />
            
            {/* Order Type Filter */}
            <CustomDropdown
              isOpen={typeDropdownOpen}
              onToggle={() => setTypeDropdownOpen(!typeDropdownOpen)}
              selectedValue={selectedOrderType}
              options={typeOptions}
              onSelect={setSelectedOrderType}
              placeholder="All Types"
            />
            
            {/* Today Orders Checkbox */}
            <div className="flex items-center justify-center lg:justify-start">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={todayOrdersOnly}
                    onChange={(e) => setTodayOrdersOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                    todayOrdersOnly 
                      ? 'bg-red-600 border-red-600' 
                      : 'bg-white border-gray-300 group-hover:border-red-400'
                  }`}>
                    {todayOrdersOnly && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                  Today Orders
                </span>
              </label>
            </div>
            
            {/* My Orders Checkbox */}
            <div className="flex items-center justify-center lg:justify-start">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={myOrdersOnly}
                    onChange={(e) => setMyOrdersOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 flex items-center justify-center ${
                    myOrdersOnly 
                      ? 'bg-red-600 border-red-600' 
                      : 'bg-white border-gray-300 group-hover:border-red-400'
                  }`}>
                    {myOrdersOnly && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
                  My Orders
                </span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Orders Timeline */}
        <div className="space-y-3 sm:space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-8 sm:p-12 text-center">
              <FaReceipt className="text-4xl sm:text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-sm sm:text-base text-gray-500">
                {searchTerm || selectedStatus !== 'all' || selectedOrderType !== 'all' || myOrdersOnly
                  ? 'Try adjusting your filters to see more orders.'
                  : 'Orders will appear here once they are placed.'}
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-lg shadow-sm border overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start space-x-3 sm:space-x-4 mb-4 lg:mb-0 lg:flex-1">
                      {/* Timeline Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                          {getOrderFlowIcon(order.orderFlow)}
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 sm:mb-0">
                            {/* Order Number - Clickable */}
                            <div className="flex items-center space-x-1">
                              <h3 
                                className="text-base sm:text-lg font-semibold text-gray-900 cursor-pointer hover:text-red-600 transition-colors duration-200 flex items-center space-x-1"
                                onClick={() => copyToClipboard(order.dailyOrderId?.toString() || order.id.slice(-8).toUpperCase())}
                                title="Click to copy order number"
                              >
                                <span>Order #{order.dailyOrderId || order.orderNumber || order.id.slice(-8).toUpperCase()}</span>
                                <FaCopy className="text-gray-400 text-sm hover:text-red-500 transition-colors duration-200" />
                              </h3>
                            </div>
                            
                            {/* Order ID - Clickable */}
                            <div className="flex items-center space-x-1">
                              <span 
                                className="text-xs text-gray-500 font-mono cursor-pointer hover:text-red-600 transition-colors duration-200 flex items-center space-x-1"
                                onClick={() => copyToClipboard(order.id)}
                                title="Click to copy order ID"
                              >
                                <span>ID: {order.id}</span>
                                <FaCopy className="text-gray-400 text-xs hover:text-red-500 transition-colors duration-200" />
                              </span>
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border w-fit ${getStatusColor(order.status, order.orderFlow)}`}>
                            {getStatusText(order.status, order.orderFlow)}
                          </span>
                        </div>

                        {/* Compact Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3">
                          {/* Customer Info */}
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                            <FaUser className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{order.customerDisplay?.name || 'Walk-in Customer'}</span>
                          </div>
                          
                          {/* Phone */}
                          {order.customerDisplay?.phone && (
                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                              <FaPhone className="text-gray-400 flex-shrink-0" />
                              <span className="truncate">{order.customerDisplay.phone}</span>
                            </div>
                          )}
                          
                          {/* Table Info */}
                          {order.customerDisplay?.tableNumber && (
                            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                              <FaTable className="text-gray-400 flex-shrink-0" />
                              <span>Table {order.customerDisplay.tableNumber}</span>
                            </div>
                          )}

                          {/* Staff Info */}
                          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                            <FaUser className="text-gray-400 flex-shrink-0" />
                            <span className="truncate">{order.staffDisplay?.name || 'Restaurant Owner'}</span>
                          </div>
                        </div>

                        {/* Items - Enhanced with Expand/Collapse */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <h4 className="text-xs sm:text-sm font-medium text-gray-900">
                              Items ({Array.isArray(order.items) ? order.items.length : 0})
                            </h4>
                            {Array.isArray(order.items) && order.items.length > 2 && (
                              <button
                                onClick={() => toggleOrderExpansion(order.id)}
                                className="flex items-center space-x-1 text-xs text-red-600 hover:text-red-700 transition-colors duration-200"
                              >
                                <span>{expandedOrders.has(order.id) ? 'Show Less' : 'Show All'}</span>
                                {expandedOrders.has(order.id) ? (
                                  <FaChevronUp className="text-xs" />
                                ) : (
                                  <FaChevronDownIcon className="text-xs" />
                                )}
                              </button>
                            )}
                          </div>
                          
                          {/* Items Display */}
                          <div className="space-y-1">
                            {Array.isArray(order.items) && (
                              <>
                                {/* Always show first 2 items */}
                                {order.items.slice(0, 2).map((item, itemIndex) => (
                                  <div key={itemIndex} className="flex justify-between text-xs sm:text-sm text-gray-600">
                                    <span className="truncate">{item.name} x {item.quantity}</span>
                                    <span className="ml-2 flex-shrink-0">₹{item.total}</span>
                                  </div>
                                ))}
                                
                                {/* Show remaining items if expanded */}
                                {expandedOrders.has(order.id) && order.items.length > 2 && (
                                  <div className="mt-2 pt-2 border-t border-gray-100">
                                    {order.items.slice(2).map((item, itemIndex) => (
                                      <div key={itemIndex + 2} className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
                                        <span className="truncate">{item.name} x {item.quantity}</span>
                                        <span className="ml-2 flex-shrink-0">₹{item.total}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {/* Show "+X more items" if not expanded */}
                                {!expandedOrders.has(order.id) && order.items.length > 2 && (
                                  <div className="text-xs sm:text-sm text-gray-500">
                                    +{order.items.length - 2} more items
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Timestamps - Compact */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FaClock className="text-gray-400 flex-shrink-0" />
                            <span>Created: {formatDate(order.createdAt)}</span>
                          </div>
                          {order.completedAt && (
                            <div className="flex items-center space-x-1">
                              <FaCheckCircle className="text-gray-400 flex-shrink-0" />
                              <span>Completed: {formatDate(order.completedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between lg:flex-col lg:items-end lg:space-y-2 mt-4 lg:mt-0">
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-semibold text-gray-900">
                          ₹{order.totalAmount?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {order.paymentMethod?.toUpperCase() || 'CASH'}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <button
                          onClick={() => handleViewOrder(order.id)}
                          className="px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center space-x-1"
                          title="View Order"
                        >
                          <FaEye className="text-xs" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleEditOrder(order.id)}
                          className="px-3 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 flex items-center justify-center space-x-1 shadow-md hover:shadow-lg"
                          title="Edit Order"
                        >
                          <FaEdit className="text-xs" />
                          <span>Edit</span>
                        </button>
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
          <div className="bg-white rounded-lg shadow-sm border p-4 mt-4 sm:mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalOrders)} of {totalOrders} orders
              </div>
              <div className="flex items-center justify-center sm:justify-end space-x-2">
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