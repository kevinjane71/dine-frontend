'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../lib/api';
import { t, getCurrentLanguage } from '../../../lib/i18n';
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
  FaCopy,
  FaTimesCircle,
  FaList,
  FaTh,
  FaTimes
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
  const [todayOrdersOnly, setTodayOrdersOnly] = useState(true);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [taxSettings, setTaxSettings] = useState(null);
  const [isCompactView, setIsCompactView] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [selectedOrderForModal, setSelectedOrderForModal] = useState(null);

  useEffect(() => {
    // Initialize language
    setCurrentLanguage(getCurrentLanguage());

    const handleLanguageChange = (e) => {
      setCurrentLanguage(e.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    return () => window.removeEventListener('languageChanged', handleLanguageChange);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.custom-dropdown')) {
        setStatusDropdownOpen(false);
        setTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit] = useState(isCompactView ? 20 : 10);

  const toggleOrderExpansion = (orderId) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) newExpanded.delete(orderId);
    else newExpanded.add(orderId);
    setExpandedOrders(newExpanded);
  };

  const copyToClipboard = async (text) => {
    try { await navigator.clipboard.writeText(text); } catch (err) { console.error('Failed to copy text: ', err); }
  };

  const formatDate = (date, compact = false) => {
    if (!date) return 'N/A';
    try {
      let d;
      if (date.toDate && typeof date.toDate === 'function') d = date.toDate();
      else if (date._seconds) d = new Date(date._seconds * 1000);
      else if (date instanceof Date) d = date;
      else if (typeof date === 'string' || typeof date === 'number') d = new Date(date);
      else return 'N/A';
      
      if (isNaN(d.getTime())) return 'N/A';
      
      const locale = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';

      if (compact) {
        const now = new Date();
        const isToday = d.toDateString() === now.toDateString();
        return isToday 
          ? d.toLocaleString(locale, { hour: '2-digit', minute: '2-digit', hour12: true })
          : d.toLocaleString(locale, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
      }
      return d.toLocaleString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'N/A';
    }
  };

  const getStatusStyle = (status, orderFlow) => {
    if (orderFlow?.isDirectBilling) return { bg: '#dcfce7', text: '#166534', border: '#86efac', label: t('common.billing') || 'Billing' };
    if (orderFlow?.isKitchenOrder) return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', label: t('common.kot') || 'Kitchen' };
    if (status === 'completed') return { bg: '#dcfce7', text: '#166534', border: '#86efac', label: t('orderHistory.status.completed') };
    if (status === 'confirmed') return { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', label: t('orderHistory.status.confirmed') };
    if (status === 'pending') return { bg: '#fef3c7', text: '#92400e', border: '#fde68a', label: t('orderHistory.status.pending') };
    if (status === 'cancelled') return { bg: '#fee2e2', text: '#991b1b', border: '#fecaca', label: t('orderHistory.status.cancelled') };
    return { bg: '#f3f4f6', text: '#374151', border: '#d1d5db', label: status };
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
      const response = await apiClient.getOrders(restaurantId, filters);
      let filteredOrders = response.orders || [];
      
      filteredOrders.sort((a, b) => {
        let dateA = a.createdAt?.toDate ? a.createdAt.toDate() : (a.createdAt?._seconds ? new Date(a.createdAt._seconds * 1000) : new Date(a.createdAt));
        let dateB = b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt?._seconds ? new Date(b.createdAt._seconds * 1000) : new Date(b.createdAt));
        return dateB - dateA;
      });
      
      setOrders(filteredOrders);
      setTotalPages(response.pagination?.totalPages || 1);
      setTotalOrders(response.pagination?.totalOrders || filteredOrders.length);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(t('common.error'));
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
    const loadTaxSettings = async () => {
      if (!restaurantId) return;
      try {
        const taxSettingsResponse = await apiClient.getTaxSettings(restaurantId);
        if (taxSettingsResponse.success) setTaxSettings(taxSettingsResponse.taxSettings);
      } catch (error) { console.error('Error loading tax settings:', error); }
    };
    loadTaxSettings();
  }, [restaurantId]);

  useEffect(() => { if (restaurantId) fetchOrders(); }, [fetchOrders]);

  useEffect(() => { if (currentPage !== 1) setCurrentPage(1); }, [selectedStatus, selectedOrderType, myOrdersOnly, searchTerm, todayOrdersOnly]);

  const handleSearch = (e) => { e.preventDefault(); fetchOrders(); };
  const handlePageChange = (newPage) => { if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage); };
  
  const handleViewOrder = (order) => {
    setSelectedOrderForModal(order);
  };

  const handleCancelOrder = async (orderId) => {
    const reason = prompt(t('common.cancel') + ' reason:'); // Ideally translate prompt message too
    if (reason === null) return;
    try {
      await apiClient.cancelOrder(orderId, reason);
      fetchOrders();
      alert(t('orderHistory.status.cancelled'));
    } catch (error) {
      console.error('Error cancelling:', error);
      alert(t('common.error') + ': ' + (error.message || 'Unknown error'));
    }
  };
  const handleEditOrder = (orderId) => router.push(`/dashboard?orderId=${orderId}&mode=edit`);

  const calculateOrderTotal = (order) => {
    let subtotal = 0;
    if (order.items && Array.isArray(order.items)) {
      subtotal = order.items.reduce((sum, item) => sum + (item.total || (item.price * item.quantity) || 0), 0);
    } else if (order.totalAmount && order.totalAmount > 0) subtotal = order.totalAmount;

    if (order.finalAmount && order.finalAmount > 0) return order.finalAmount.toFixed(2);
    if (order.taxAmount && order.taxAmount > 0) return (subtotal + order.taxAmount).toFixed(2);

    if (taxSettings?.enabled && subtotal > 0) {
      let totalTax = 0;
      if (taxSettings.taxes && taxSettings.taxes.length > 0) {
        taxSettings.taxes.forEach(tax => { if (tax.enabled) totalTax += subtotal * (tax.rate / 100); });
      } else if (taxSettings.defaultTaxRate) {
        totalTax = subtotal * (taxSettings.defaultTaxRate / 100);
      }
      return (subtotal + totalTax).toFixed(2);
    }
    return subtotal.toFixed(2);
  };

  const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;
    const statusStyle = getStatusStyle(order.status, order.orderFlow);
    const orderTotal = calculateOrderTotal(order);
    const subtotal = order.items?.reduce((sum, item) => sum + (item.total || item.price * item.quantity), 0) || 0;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  #{order.dailyOrderId || order.orderNumber || order.id.slice(-4).toUpperCase()}
                </h2>
                <span 
                  className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border"
                  style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.border }}
                >
                  {statusStyle.label}
                </span>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1.5">
                <FaClock className="text-gray-400" /> {formatDate(order.createdAt)}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FaTimes className="text-gray-400 text-lg" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaUser size={10}/> {t('orderHistory.customer')}</div>
                <div className="font-medium text-sm text-gray-900">{order.customerDisplay?.name || 'Walk-in'}</div>
                <div className="text-xs text-gray-500">{order.customerDisplay?.phone || ''}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaTable size={10}/> {t('orderHistory.table')}</div>
                <div className="font-medium text-sm text-gray-900">{order.customerDisplay?.tableNumber || 'N/A'}</div>
                <div className="text-xs text-gray-500 capitalize">{order.customerDisplay?.floorName || ''}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><FaUtensils size={10}/> {t('common.category')}</div>
                <div className="font-medium text-sm text-gray-900 capitalize">{order.orderType?.replace('-', ' ') || t('orderHistory.type.dineIn')}</div>
                <div className="text-xs text-gray-500 capitalize">{order.paymentMethod || 'Unpaid'}</div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FaReceipt className="text-gray-400" /> {t('orderHistory.items')}
              </h3>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-medium">
                    <tr>
                      <th className="px-4 py-3 text-left">{t('common.items')}</th>
                      <th className="px-4 py-3 text-center">{t('common.quantity')}</th>
                      <th className="px-4 py-3 text-right">{t('common.price')}</th>
                      <th className="px-4 py-3 text-right">{t('common.total')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {order.items?.map((item, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{item.name}</div>
                          {item.variant && <div className="text-xs text-gray-500">{t('orderHistory.variant')}: {item.variant.name}</div>}
                          {item.addons?.length > 0 && (
                            <div className="text-xs text-gray-500 mt-0.5">
                              + {item.addons.map(a => a.name).join(', ')}
                            </div>
                          )}
                          {item.notes && <div className="text-xs text-amber-600 mt-0.5 italic">{t('common.notes')}: {item.notes}</div>}
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-gray-600">x{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-gray-600">₹{item.price}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">₹{item.total || (item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {order.notes && (
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                <span className="font-semibold">{t('orderHistory.orderNote')}:</span> {order.notes}
              </div>
            )}
          </div>

          <div className="bg-gray-50 border-t border-gray-100 p-6">
            <div className="flex flex-col gap-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t('orderHistory.subtotal')}</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              {order.taxAmount > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('orderHistory.tax')}</span>
                  <span>₹{order.taxAmount.toFixed(2)}</span>
                </div>
              )}
              {(!order.taxAmount && taxSettings?.enabled) && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t('orderHistory.estimatedTax')}</span>
                  <span>₹{(parseFloat(orderTotal) - subtotal).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200 mt-1">
                <span>{t('orderHistory.total')}</span>
                <span>₹{orderTotal}</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
               <button 
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t('orderHistory.close')}
              </button>
              <button 
                onClick={() => {
                    handleEditOrder(order.id);
                    onClose();
                }}
                className="px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                {t('orderHistory.editOrder')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const FilterDropdown = ({ isOpen, onToggle, selectedValue, options, onSelect, placeholder, icon: Icon }) => (
    <div className="relative custom-dropdown">
      <button
        onClick={onToggle}
        className={`w-full px-3 py-2 text-left bg-white border rounded-lg flex items-center justify-between text-xs font-medium transition-all ${isOpen ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200 hover:border-gray-300'}`}
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="text-gray-400 text-xs" />}
          <span className="text-gray-700">{options.find(opt => opt.value === selectedValue)?.label || placeholder}</span>
        </div>
        <FaChevronDown className={`text-gray-400 text-[10px] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onSelect(option.value); onToggle(); }}
                className={`w-full px-3 py-1.5 text-left text-xs transition-colors ${selectedValue === option.value ? 'bg-red-50 text-red-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {option.label}
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
        <div className="flex flex-col items-center">
          <FaSpinner className="animate-spin text-3xl text-red-600 mb-3" />
          <p className="text-sm text-gray-500">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  const statusOptions = [
    { value: 'all', label: t('orderHistory.status.all') },
    { value: 'pending', label: t('orderHistory.status.pending') },
    { value: 'confirmed', label: t('orderHistory.status.confirmed') },
    { value: 'completed', label: t('orderHistory.status.completed') },
    { value: 'cancelled', label: t('orderHistory.status.cancelled') }
  ];

  const typeOptions = [
    { value: 'all', label: t('orderHistory.type.all') },
    { value: 'dine-in', label: t('orderHistory.type.dineIn') },
    { value: 'takeaway', label: t('orderHistory.type.takeaway') },
    { value: 'delivery', label: t('orderHistory.type.delivery') }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded-lg"><FaReceipt className="text-red-600 text-lg" /></div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">{t('orderHistory.title')}</h1>
                <p className="text-xs text-gray-500">{restaurant?.name} • {totalOrders} {t('orderHistory.total')}</p>
              </div>
                </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">{t('orderHistory.page')} {currentPage}/{totalPages}</div>
              <div className="flex bg-gray-100 p-0.5 rounded-lg">
                <button onClick={() => setIsCompactView(true)} className={`p-1.5 rounded-md transition-all ${isCompactView ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`} title="Compact View"><FaList size={14} /></button>
                <button onClick={() => setIsCompactView(false)} className={`p-1.5 rounded-md transition-all ${!isCompactView ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`} title="Detailed View"><FaTh size={14} /></button>
              </div>
            </div>
          </div>
          <div className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-4 lg:col-span-5 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs" />
              <input type="text" placeholder={t('orderHistory.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all" />
        </div>
            <div className="sm:col-span-3 lg:col-span-2">
              <FilterDropdown isOpen={statusDropdownOpen} onToggle={() => setStatusDropdownOpen(!statusDropdownOpen)} selectedValue={selectedStatus} options={statusOptions} onSelect={setSelectedStatus} placeholder={t('common.status')} icon={FaFilter} />
            </div>
            <div className="sm:col-span-3 lg:col-span-2">
              <FilterDropdown isOpen={typeDropdownOpen} onToggle={() => setTypeDropdownOpen(!typeDropdownOpen)} selectedValue={selectedOrderType} options={typeOptions} onSelect={setSelectedOrderType} placeholder={t('common.category')} icon={FaUtensils} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3 flex items-center gap-3 sm:justify-end">
              <label className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${todayOrdersOnly ? 'bg-red-50 text-red-700' : 'hover:bg-gray-100 text-gray-600'}`}>
                <input type="checkbox" checked={todayOrdersOnly} onChange={(e) => setTodayOrdersOnly(e.target.checked)} className="w-3.5 h-3.5 text-red-600 rounded focus:ring-red-500 border-gray-300" />
                <span className="text-xs font-medium">{t('orderHistory.today')}</span>
                </label>
              <label className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${myOrdersOnly ? 'bg-red-50 text-red-700' : 'hover:bg-gray-100 text-gray-600'}`}>
                <input type="checkbox" checked={myOrdersOnly} onChange={(e) => setMyOrdersOnly(e.target.checked)} className="w-3.5 h-3.5 text-red-600 rounded focus:ring-red-500 border-gray-300" />
                <span className="text-xs font-medium">{t('orderHistory.mine')}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        
      <div className="flex-1 bg-gray-50 p-3 sm:px-6 sm:py-4 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-3">
          {orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4"><FaSearch className="text-2xl text-gray-300" /></div>
              <h3 className="text-sm font-semibold text-gray-900">{t('orderHistory.noOrders')}</h3>
              <p className="text-xs text-gray-500 mt-1">{t('orderHistory.adjustFilters')}</p>
            </div>
          ) : (
            orders.map((order) => {
              const statusStyle = getStatusStyle(order.status, order.orderFlow);
              const orderTotal = calculateOrderTotal(order);
              const itemCount = Array.isArray(order.items) ? order.items.length : 0;
              
              if (isCompactView) {
                return (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-red-200 hover:shadow-md transition-all duration-200 group">
                    <div className="p-3 flex items-center gap-3">
                      <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: statusStyle.border }} />
                      <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-12 sm:col-span-3 flex sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2">
                          <div onClick={() => copyToClipboard(order.dailyOrderId?.toString() || order.id)} className="font-bold text-gray-900 cursor-pointer hover:text-red-600 flex items-center gap-1.5 transition-colors">
                            <span>#{order.dailyOrderId || order.orderNumber || order.id.slice(-4).toUpperCase()}</span>
                            <FaCopy className="text-gray-300 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500"><FaClock className="text-[9px]" />{formatDate(order.createdAt, true)}</div>
                        </div>
                        <div className="col-span-12 sm:col-span-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5" title="Customer"><FaUser className="text-gray-400 text-[10px]" /><span className="truncate max-w-[100px] font-medium">{order.customerDisplay?.name || 'Walk-in'}</span></div>
                          <div className="flex items-center gap-1.5" title="Table"><FaTable className="text-gray-400 text-[10px]" /><span>{order.customerDisplay?.tableNumber || 'N/A'}</span></div>
                          <div className="flex items-center gap-1.5" title="Type"><FaUtensils className="text-gray-400 text-[10px]" /><span className="capitalize">{order.orderType?.replace('-', ' ') || t('orderHistory.type.dineIn')}</span></div>
                        </div>
                        <div className="col-span-6 sm:col-span-3 flex flex-col sm:items-start gap-1">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border" style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, borderColor: statusStyle.border }}>{statusStyle.label}</span>
                          <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{order.paymentMethod || 'Cash'}</span>
                        </div>
                        <div className="col-span-6 sm:col-span-2 flex flex-col items-end gap-1.5">
                          <span className="font-bold text-gray-900">₹{orderTotal}</span>
                          <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditOrder(order.id)} className="p-1 text-white bg-red-500 hover:bg-red-600 rounded transition-colors" title={t('orderHistory.edit')}><FaEdit size={10} /></button>
                            <button onClick={() => handleViewOrder(order)} className="p-1 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded transition-colors" title={t('orderHistory.view')}><FaEye size={10} /></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:border-red-200 transition-all duration-200 group">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-600"><FaReceipt /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-bold text-gray-900">#{order.dailyOrderId || order.orderNumber || order.id.slice(-4).toUpperCase()}</h3>
                          <span className="font-bold text-gray-900">₹{orderTotal}</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-600 mb-3">
                          <div className="flex items-center gap-1.5"><FaUser className="text-gray-400" /> {order.customerDisplay?.name || 'Walk-in'}</div>
                          <div className="flex items-center gap-1.5"><FaTable className="text-gray-400" /> {t('orderHistory.table')} {order.customerDisplay?.tableNumber || 'N/A'}</div>
                          <div className="flex items-center gap-1.5"><FaClock className="text-gray-400" /> {formatDate(order.createdAt, true)}</div>
                          <div className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: statusStyle.text }}></span>{statusStyle.label}</div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-2 text-xs text-gray-500 mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{itemCount} {t('orderHistory.items')}</span>
                            <button onClick={() => toggleOrderExpansion(order.id)} className="text-red-600 hover:text-red-700 flex items-center gap-1">{expandedOrders.has(order.id) ? t('common.close') : t('common.view')} {expandedOrders.has(order.id) ? <FaChevronUp size={10} /> : <FaChevronDown size={10} />}</button>
                          </div>
                          {(expandedOrders.has(order.id) ? order.items : order.items.slice(0, 2)).map((item, idx) => (
                            <div key={idx} className="flex justify-between py-0.5"><span>{item.quantity}x {item.name}</span><span>₹{item.total}</span></div>
                          ))}
                          {!expandedOrders.has(order.id) && itemCount > 2 && <div className="text-[10px] text-gray-400 pt-0.5">+{itemCount - 2} {t('common.more')}...</div>}
                        </div>
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleViewOrder(order)} className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5"><FaEye /> {t('orderHistory.view')}</button>
                          {order.status !== 'completed' && order.status !== 'cancelled' && <button onClick={() => handleCancelOrder(order.id)} className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1.5"><FaTimesCircle /> {t('orderHistory.cancel')}</button>}
                          <button onClick={() => handleEditOrder(order.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5 shadow-sm"><FaEdit /> {t('orderHistory.edit')}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {totalPages > 1 && (
          <div className="max-w-7xl mx-auto mt-6 flex items-center justify-between text-xs text-gray-500">
            <span>{t('orderHistory.showing')} {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalOrders)} {t('orderHistory.of')} {totalOrders} {t('orderHistory.orders')}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"><FaChevronLeft /></button>
              <span className="font-medium text-gray-900">{t('orderHistory.page')} {currentPage}</span>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"><FaChevronRight /></button>
            </div>
          </div>
        )}
      </div>

      {selectedOrderForModal && (
        <OrderDetailsModal 
          order={selectedOrderForModal} 
          onClose={() => setSelectedOrderForModal(null)} 
        />
      )}
    </div>
  );
};

export default OrderHistory;