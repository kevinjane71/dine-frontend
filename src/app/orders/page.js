'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { 
  FaEye, 
  FaEdit, 
  FaCheck, 
  FaClock, 
  FaUtensils, 
  FaSearch,
  FaFilter,
  FaPrint,
  FaDownload
} from 'react-icons/fa';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mock data
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        tableNumber: '12',
        customerName: 'Rahul Sharma',
        items: [
          { name: 'Butter Chicken', quantity: 2, price: 399 },
          { name: 'Naan', quantity: 4, price: 59 },
          { name: 'Lassi', quantity: 2, price: 149 }
        ],
        total: 1334,
        status: 'preparing',
        type: 'dine-in',
        orderTime: '2024-01-15T19:30:00',
        notes: 'Extra spicy, no onions'
      },
      {
        id: 'ORD-002',
        tableNumber: null,
        customerName: 'Priya Patel',
        phone: '+91-9876543210',
        address: '123 MG Road, Bangalore',
        items: [
          { name: 'Veg Biryani', quantity: 1, price: 299 },
          { name: 'Raita', quantity: 1, price: 89 }
        ],
        total: 388,
        status: 'ready',
        type: 'delivery',
        orderTime: '2024-01-15T19:15:00',
        notes: 'Ring doorbell twice'
      },
      {
        id: 'ORD-003',
        tableNumber: '5',
        customerName: 'Amit Kumar',
        items: [
          { name: 'Paneer Tikka', quantity: 1, price: 249 },
          { name: 'Dal Makhani', quantity: 1, price: 249 },
          { name: 'Roti', quantity: 3, price: 35 }
        ],
        total: 603,
        status: 'served',
        type: 'dine-in',
        orderTime: '2024-01-15T18:45:00',
        notes: ''
      },
      {
        id: 'ORD-004',
        tableNumber: null,
        customerName: 'Sneha Gupta',
        phone: '+91-9123456789',
        items: [
          { name: 'Chicken Wings', quantity: 2, price: 299 },
          { name: 'Cold Coffee', quantity: 1, price: 129 }
        ],
        total: 727,
        status: 'confirmed',
        type: 'pickup',
        orderTime: '2024-01-15T20:00:00',
        notes: 'Call when ready'
      }
    ];
    setOrders(mockOrders);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      preparing: 'bg-orange-100 text-orange-700',
      ready: 'bg-green-100 text-green-700',
      served: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getTypeColor = (type) => {
    const colors = {
      'dine-in': 'bg-purple-100 text-purple-700',
      'delivery': 'bg-blue-100 text-blue-700',
      'pickup': 'bg-green-100 text-green-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesType = selectedType === 'all' || order.type === selectedType;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
            <p className="text-gray-600">Track and manage all restaurant orders</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200">
              <FaPrint size={16} />
              Print KOT
            </button>
            <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200">
              <FaDownload size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="served">Served</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="dine-in">Dine In</option>
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Order Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-800">{order.id}</h3>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(order.type)}`}>
                      {order.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-gray-400" size={14} />
                    <span className="text-sm text-gray-600">{formatTime(order.orderTime)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FaUtensils className="text-gray-400" size={14} />
                    <span className="text-sm font-medium text-gray-800">{order.customerName}</span>
                  </div>
                  
                  {order.tableNumber && (
                    <div className="text-sm text-gray-600">Table: {order.tableNumber}</div>
                  )}
                  
                  {order.phone && (
                    <div className="text-sm text-gray-600">Phone: {order.phone}</div>
                  )}
                </div>
              </div>
              
              {/* Order Items */}
              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-3">Items ({order.items.length})</h4>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{item.quantity}x {item.name}</span>
                      <span className="font-medium text-gray-800">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                {order.notes && (
                  <div className="bg-yellow-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Notes:</strong> {order.notes}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center font-bold text-lg border-t border-gray-100 pt-4">
                  <span>Total:</span>
                  <span className="text-primary">₹{order.total}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="p-6 bg-gray-50 flex gap-2">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaEye size={14} />
                  View
                </button>
                
                {order.status !== 'served' && order.status !== 'cancelled' && (
                  <button
                    onClick={() => {
                      const statusFlow = {
                        pending: 'confirmed',
                        confirmed: 'preparing',
                        preparing: 'ready',
                        ready: 'served'
                      };
                      updateOrderStatus(order.id, statusFlow[order.status]);
                    }}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaCheck size={14} />
                    Next
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-20">
            <FaUtensils size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500">Orders will appear here when customers place them.</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Order ID:</strong> {selectedOrder.id}</div>
                    <div><strong>Time:</strong> {formatTime(selectedOrder.orderTime)}</div>
                    <div><strong>Type:</strong> {selectedOrder.type.replace('-', ' ')}</div>
                    {selectedOrder.tableNumber && (
                      <div><strong>Table:</strong> {selectedOrder.tableNumber}</div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedOrder.customerName}</div>
                    {selectedOrder.phone && (
                      <div><strong>Phone:</strong> {selectedOrder.phone}</div>
                    )}
                    {selectedOrder.address && (
                      <div><strong>Address:</strong> {selectedOrder.address}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-semibold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center font-bold text-xl mt-4 pt-4 border-t border-gray-200">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{selectedOrder.total}</span>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Special Instructions</h3>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-yellow-800">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gray-50 flex gap-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200"
              >
                Close
              </button>
              <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2">
                <FaPrint size={16} />
                Print KOT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;