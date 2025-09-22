'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { 
  FaPrint, 
  FaClock, 
  FaCheck, 
  FaFire,
  FaExclamationTriangle,
  FaBell,
  FaUtensils,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaPlay,
  FaPause,
  FaSync
} from 'react-icons/fa';

const KitchenOrderTicket = () => {
  const [kotOrders, setKotOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedKot, setSelectedKot] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mock KOT data - replace with real data from API
  useEffect(() => {
    const mockKotOrders = [
      {
        id: 'KOT-001',
        orderId: 'ORD-001',
        tableNumber: '12',
        customerName: 'Rahul Sharma',
        orderType: 'dine-in',
        items: [
          { id: 1, name: 'Butter Chicken', quantity: 2, spiceLevel: 'medium', notes: 'Extra gravy', category: 'main-course', estimatedTime: 15 },
          { id: 2, name: 'Garlic Naan', quantity: 4, spiceLevel: 'mild', notes: '', category: 'bread', estimatedTime: 8 },
          { id: 3, name: 'Mango Lassi', quantity: 2, spiceLevel: 'mild', notes: 'Less sugar', category: 'beverages', estimatedTime: 3 }
        ],
        status: 'pending',
        priority: 'normal',
        orderTime: '2024-01-15T19:30:00',
        kotTime: '2024-01-15T19:32:00',
        estimatedTime: 18,
        specialInstructions: 'Customer is allergic to nuts',
        waiter: 'Amit Kumar'
      },
      {
        id: 'KOT-002',
        orderId: 'ORD-002',
        tableNumber: null,
        customerName: 'Priya Patel',
        orderType: 'delivery',
        items: [
          { id: 4, name: 'Veg Biryani', quantity: 1, spiceLevel: 'medium', notes: 'Extra raita', category: 'main-course', estimatedTime: 20 },
          { id: 5, name: 'Papad', quantity: 2, spiceLevel: 'mild', notes: 'Roasted not fried', category: 'starters', estimatedTime: 5 }
        ],
        status: 'preparing',
        priority: 'urgent',
        orderTime: '2024-01-15T19:15:00',
        kotTime: '2024-01-15T19:17:00',
        estimatedTime: 25,
        specialInstructions: 'Pack separately for delivery',
        waiter: 'Delivery Team'
      },
      {
        id: 'KOT-003',
        orderId: 'ORD-003',
        tableNumber: '5',
        customerName: 'Amit Kumar',
        orderType: 'dine-in',
        items: [
          { id: 6, name: 'Paneer Tikka', quantity: 1, spiceLevel: 'hot', notes: 'Well done', category: 'starters', estimatedTime: 12 },
          { id: 7, name: 'Dal Makhani', quantity: 1, spiceLevel: 'medium', notes: '', category: 'main-course', estimatedTime: 10 },
          { id: 8, name: 'Tandoori Roti', quantity: 3, spiceLevel: 'mild', notes: '', category: 'bread', estimatedTime: 6 }
        ],
        status: 'ready',
        priority: 'normal',
        orderTime: '2024-01-15T18:45:00',
        kotTime: '2024-01-15T18:47:00',
        estimatedTime: 15,
        specialInstructions: '',
        waiter: 'Sunita Sharma'
      },
      {
        id: 'KOT-004',
        orderId: 'ORD-004',
        tableNumber: null,
        customerName: 'Sneha Gupta',
        orderType: 'pickup',
        items: [
          { id: 9, name: 'Chicken Wings', quantity: 2, spiceLevel: 'hot', notes: 'Extra spicy sauce', category: 'starters', estimatedTime: 15 },
          { id: 10, name: 'Cold Coffee', quantity: 1, spiceLevel: 'mild', notes: 'No ice', category: 'beverages', estimatedTime: 3 }
        ],
        status: 'served',
        priority: 'normal',
        orderTime: '2024-01-15T20:00:00',
        kotTime: '2024-01-15T20:02:00',
        estimatedTime: 18,
        specialInstructions: 'Call customer when ready: +91-9123456789',
        waiter: 'Pickup Counter'
      }
    ];
    setKotOrders(mockKotOrders);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      preparing: 'bg-blue-100 text-blue-800 border-blue-200',
      ready: 'bg-green-100 text-green-800 border-green-200',
      served: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'bg-red-500 text-white',
      normal: 'bg-blue-500 text-white',
      low: 'bg-gray-500 text-white'
    };
    return colors[priority] || 'bg-gray-500 text-white';
  };

  const getSpiceIcon = (level) => {
    const spiceColors = {
      mild: '#10b981',
      medium: '#f59e0b', 
      hot: '#ef4444'
    };
    return <FaFire style={{ color: spiceColors[level] }} size={12} />;
  };

  const updateKotStatus = (kotId, newStatus) => {
    setKotOrders(orders => orders.map(order => 
      order.id === kotId ? { ...order, status: newStatus } : order
    ));
    
    // Play notification sound if enabled
    if (soundEnabled && newStatus === 'ready') {
      // In a real app, you'd play a sound here
      console.log('🔔 Order ready notification sound');
    }
  };

  const filteredOrders = kotOrders.filter(order => {
    return selectedStatus === 'all' || order.status === selectedStatus;
  });

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getTimeElapsed = (kotTime) => {
    const now = new Date();
    const kotDate = new Date(kotTime);
    const diffInMinutes = Math.floor((now - kotDate) / (1000 * 60));
    return diffInMinutes;
  };

  const printKot = (kot) => {
    // In a real application, this would trigger a printer
    console.log('Printing KOT:', kot.id);
    alert(`Printing KOT ${kot.id} to kitchen printer...`);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      <Navigation />
      
      <div className="h-[calc(100vh-80px)] flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-lg border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FaUtensils className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Kitchen Order Tickets</h1>
                  <p className="text-sm text-gray-500">Manage kitchen orders and cooking status</p>
                </div>
              </div>
              
              {/* Status Filter */}
              <div className="flex bg-gray-100 rounded-2xl p-2 shadow-inner">
                {[
                  { key: 'all', label: 'All Orders', count: kotOrders.length },
                  { key: 'pending', label: 'Pending', count: kotOrders.filter(o => o.status === 'pending').length },
                  { key: 'preparing', label: 'Preparing', count: kotOrders.filter(o => o.status === 'preparing').length },
                  { key: 'ready', label: 'Ready', count: kotOrders.filter(o => o.status === 'ready').length }
                ].map((status) => (
                  <button
                    key={status.key}
                    onClick={() => setSelectedStatus(status.key)}
                    className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      selectedStatus === status.key
                        ? 'bg-white text-orange-600 shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {status.label}
                    {status.count > 0 && (
                      <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                        {status.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-3 rounded-xl font-semibold transition-all duration-200 ${
                  soundEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <FaBell size={16} />
              </button>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">Kitchen Display</p>
                <p className="text-xs text-gray-500">Live Updates • {new Date().toLocaleTimeString('en-IN', { hour12: true })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOT Grid */}
        <div className="flex-1 p-6 overflow-y-auto">
          {filteredOrders.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrders.map((kot) => {
                const timeElapsed = getTimeElapsed(kot.kotTime);
                const isOverdue = timeElapsed > kot.estimatedTime;
                
                return (
                  <div
                    key={kot.id}
                    className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${
                      kot.priority === 'urgent' ? 'border-red-500' : 
                      kot.priority === 'normal' ? 'border-blue-500' : 'border-gray-400'
                    } ${isOverdue && kot.status !== 'served' ? 'ring-2 ring-red-300 bg-red-50' : ''}`}
                  >
                    {/* KOT Header */}
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-800">{kot.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(kot.priority)}`}>
                            {kot.priority.toUpperCase()}
                          </span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(kot.status)}`}>
                          {kot.status.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Order: <span className="font-semibold text-gray-800">{kot.orderId}</span></p>
                          <p className="text-gray-600">Customer: <span className="font-semibold text-gray-800">{kot.customerName}</span></p>
                        </div>
                        <div>
                          {kot.tableNumber ? (
                            <p className="text-gray-600">Table: <span className="font-semibold text-gray-800">{kot.tableNumber}</span></p>
                          ) : (
                            <p className="text-gray-600">Type: <span className="font-semibold text-gray-800 capitalize">{kot.orderType}</span></p>
                          )}
                          <p className="text-gray-600">Waiter: <span className="font-semibold text-gray-800">{kot.waiter}</span></p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-400" size={14} />
                          <span className="text-sm text-gray-600">
                            KOT: {formatTime(kot.kotTime)}
                          </span>
                        </div>
                        <div className={`text-sm font-semibold ${
                          isOverdue ? 'text-red-600' : timeElapsed > kot.estimatedTime * 0.8 ? 'text-orange-600' : 'text-green-600'
                        }`}>
                          {timeElapsed}m / {kot.estimatedTime}m
                          {isOverdue && <FaExclamationTriangle className="inline ml-1" size={12} />}
                        </div>
                      </div>
                    </div>
                    
                    {/* Items List */}
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-800 mb-4">Items ({kot.items.length})</h4>
                      <div className="space-y-3">
                        {kot.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-800">{item.quantity}x {item.name}</span>
                                {getSpiceIcon(item.spiceLevel)}
                              </div>
                              {item.notes && (
                                <p className="text-sm text-orange-600 font-medium">Note: {item.notes}</p>
                              )}
                              <p className="text-xs text-gray-500 uppercase tracking-wide">{item.category}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-semibold text-gray-700">{item.estimatedTime}m</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {kot.specialInstructions && (
                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Special Instructions:</strong> {kot.specialInstructions}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="p-6 bg-gray-50 border-t border-gray-100">
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSelectedKot(kot)}
                          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <FaEye size={14} />
                          View
                        </button>
                        
                        {kot.status === 'pending' && (
                          <button
                            onClick={() => updateKotStatus(kot.id, 'preparing')}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <FaPlay size={14} />
                            Start
                          </button>
                        )}
                        
                        {kot.status === 'preparing' && (
                          <button
                            onClick={() => updateKotStatus(kot.id, 'ready')}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <FaCheck size={14} />
                            Ready
                          </button>
                        )}
                        
                        {kot.status === 'ready' && (
                          <button
                            onClick={() => updateKotStatus(kot.id, 'served')}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                          >
                            <FaCheckCircle size={14} />
                            Served
                          </button>
                        )}
                        
                        <button
                          onClick={() => printKot(kot)}
                          className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center"
                        >
                          <FaPrint size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <FaUtensils size={32} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-600 mb-3">No orders in kitchen</h3>
              <p className="text-gray-500 text-center max-w-md">
                {selectedStatus === 'all' 
                  ? 'Kitchen orders will appear here when customers place orders.'
                  : `No orders with ${selectedStatus} status found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* KOT Detail Modal */}
      {selectedKot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">KOT Details - {selectedKot.id}</h2>
                <button
                  onClick={() => setSelectedKot(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Order Info Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Order Info</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Order ID:</strong> {selectedKot.orderId}</div>
                    <div><strong>KOT ID:</strong> {selectedKot.id}</div>
                    <div><strong>Type:</strong> {selectedKot.orderType}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Customer</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Name:</strong> {selectedKot.customerName}</div>
                    {selectedKot.tableNumber && (
                      <div><strong>Table:</strong> {selectedKot.tableNumber}</div>
                    )}
                    <div><strong>Waiter:</strong> {selectedKot.waiter}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Timing</h3>
                  <div className="space-y-1 text-sm">
                    <div><strong>Order:</strong> {formatTime(selectedKot.orderTime)}</div>
                    <div><strong>KOT:</strong> {formatTime(selectedKot.kotTime)}</div>
                    <div><strong>Estimated:</strong> {selectedKot.estimatedTime}m</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-2">Status</h3>
                  <div className="space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedKot.status)}`}>
                      {selectedKot.status.toUpperCase()}
                    </span>
                    <span className={`block px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedKot.priority)}`}>
                      {selectedKot.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Items Detail */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedKot.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-lg">{item.quantity}x</span>
                          <span className="font-semibold text-gray-800">{item.name}</span>
                          {getSpiceIcon(item.spiceLevel)}
                          <span className="text-xs text-gray-500 uppercase tracking-wide bg-gray-200 px-2 py-1 rounded">
                            {item.category}
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-orange-600 font-medium">📝 {item.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-700">{item.estimatedTime}m</div>
                        <div className="text-xs text-gray-500">prep time</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedKot.specialInstructions && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
                  <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Special Instructions</h3>
                  <p className="text-yellow-800">{selectedKot.specialInstructions}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gray-50 flex gap-4">
              <button
                onClick={() => setSelectedKot(null)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() => printKot(selectedKot)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
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

export default KitchenOrderTicket;