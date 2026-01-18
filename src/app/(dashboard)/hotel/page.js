'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../lib/api';
import {
  FaHotel,
  FaPlus,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaUser,
  FaPhone,
  FaCalendar,
  FaMoneyBillWave,
  FaFileInvoice,
  FaSignOutAlt,
  FaUtensils,
  FaBed,
  FaUserCheck,
  FaTimes,
  FaReceipt,
  FaPrint,
  FaEnvelope,
  FaIdCard,
  FaBuilding,
  FaClock
} from 'react-icons/fa';

const Hotel = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

  // Data
  const [checkIns, setCheckIns] = useState([]);
  const [activeFilter, setActiveFilter] = useState('active');

  // Modals
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [invoice, setInvoice] = useState(null);

  // Forms
  const [checkInForm, setCheckInForm] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    roomNumber: '',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    numberOfGuests: 1,
    roomTariff: '',
    advancePayment: '',
    paymentMode: 'cash',
    idProofType: 'aadhar',
    idProofNumber: '',
    gstNumber: '',
    gstCompanyName: ''
  });

  const [checkOutForm, setCheckOutForm] = useState({
    finalPayment: '',
    paymentMode: 'cash',
    discount: '',
    notes: ''
  });

  // Load restaurant
  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        let finalRestaurantId = null;

        if (userData.restaurantId) {
          finalRestaurantId = userData.restaurantId;
        } else {
          const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
          if (savedRestaurantId) {
            finalRestaurantId = savedRestaurantId;
          } else {
            const restaurantsResponse = await apiClient.getRestaurants();
            if (restaurantsResponse.restaurants?.length > 0) {
              finalRestaurantId = restaurantsResponse.restaurants[0].id;
            }
          }
        }

        setRestaurantId(finalRestaurantId);
      } catch (error) {
        console.error('Error loading restaurant:', error);
        setError('Failed to load restaurant');
      }
    };

    loadRestaurant();
  }, []);

  // Load check-ins
  useEffect(() => {
    if (restaurantId) {
      loadCheckIns();
    }
  }, [restaurantId, activeFilter]);

  const loadCheckIns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getHotelCheckIns(restaurantId, activeFilter);
      setCheckIns(response.checkIns || []);
    } catch (error) {
      console.error('Error loading check-ins:', error);
      setError('Failed to load hotel data');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const checkIn = new Date(checkInForm.checkInDate);
      const checkOut = new Date(checkInForm.checkOutDate);
      const stayDuration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

      if (stayDuration < 1) {
        throw new Error('Check-out must be after check-in');
      }

      await apiClient.hotelCheckIn({
        restaurantId,
        guestInfo: {
          name: checkInForm.guestName,
          phone: checkInForm.guestPhone,
          email: checkInForm.guestEmail || null
        },
        roomNumber: checkInForm.roomNumber,
        checkInDate: checkInForm.checkInDate,
        checkOutDate: checkInForm.checkOutDate,
        numberOfGuests: parseInt(checkInForm.numberOfGuests) || 1,
        roomTariff: parseFloat(checkInForm.roomTariff) || 0,
        advancePayment: parseFloat(checkInForm.advancePayment) || 0,
        paymentMode: checkInForm.paymentMode,
        idProof: {
          type: checkInForm.idProofType,
          number: checkInForm.idProofNumber || null
        },
        gstInfo: checkInForm.gstNumber ? {
          gstNumber: checkInForm.gstNumber,
          companyName: checkInForm.gstCompanyName || null
        } : null
      });

      setSuccess(`Guest checked in to Room ${checkInForm.roomNumber}`);
      setShowCheckInModal(false);
      setCheckInForm({
        guestName: '',
        guestPhone: '',
        guestEmail: '',
        roomNumber: '',
        checkInDate: new Date().toISOString().split('T')[0],
        checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        numberOfGuests: 1,
        roomTariff: '',
        advancePayment: '',
        paymentMode: 'cash',
        idProofType: 'aadhar',
        idProofNumber: '',
        gstNumber: '',
        gstCompanyName: ''
      });
      loadCheckIns();
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError(error.message || 'Check-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const discounts = checkOutForm.discount ? [{
        description: 'Discount',
        amount: parseFloat(checkOutForm.discount)
      }] : [];

      const response = await apiClient.hotelCheckOut(selectedCheckIn.id, {
        finalPayment: parseFloat(checkOutForm.finalPayment) || 0,
        paymentMode: checkOutForm.paymentMode,
        discounts,
        notes: checkOutForm.notes || null
      });

      setSuccess(`Room ${selectedCheckIn.roomNumber} checked out successfully`);
      setShowCheckOutModal(false);
      setCheckOutForm({ finalPayment: '', paymentMode: 'cash', discount: '', notes: '' });
      setSelectedCheckIn(null);
      loadCheckIns();
      setTimeout(() => setSuccess(null), 3000);

      // Show invoice
      setInvoice(response.invoice);
      setShowInvoiceModal(true);
    } catch (error) {
      setError(error.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const openCheckOut = (checkIn) => {
    setSelectedCheckIn(checkIn);
    setCheckOutForm({
      finalPayment: checkIn.balanceAmount?.toFixed(2) || '0.00',
      paymentMode: 'cash',
      discount: '',
      notes: ''
    });
    setShowCheckOutModal(true);
  };

  const viewInvoice = async (checkIn) => {
    try {
      const response = await apiClient.getHotelInvoice(checkIn.id);
      setInvoice(response.invoice);
      setShowInvoiceModal(true);
    } catch (error) {
      setError('Failed to load invoice');
    }
  };

  // Stats
  const activeCheckInsCount = checkIns.filter(c => c.status === 'checked-in').length;
  const totalRevenue = checkIns.reduce((sum, c) => sum + (c.totalPaid || 0), 0);
  const pendingAmount = checkIns.filter(c => c.status === 'checked-in').reduce((sum, c) => sum + (c.balanceAmount || 0), 0);

  if (loading && !checkIns.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-red-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading hotel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <FaHotel className="text-red-600" />
                Hotel Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage check-ins, check-outs & room billing
              </p>
            </div>
            <button
              onClick={() => setShowCheckInModal(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <FaPlus /> New Check-In
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Rooms</p>
                <p className="text-3xl font-bold mt-2">{activeCheckInsCount}</p>
                <p className="text-green-100 text-xs mt-1">Currently occupied</p>
              </div>
              <FaBed className="text-4xl opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-2">₹{totalRevenue.toFixed(0)}</p>
                <p className="text-red-100 text-xs mt-1">All bookings</p>
              </div>
              <FaMoneyBillWave className="text-4xl opacity-50" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending Dues</p>
                <p className="text-3xl font-bold mt-2">₹{pendingAmount.toFixed(0)}</p>
                <p className="text-yellow-100 text-xs mt-1">To be collected</p>
              </div>
              <FaReceipt className="text-4xl opacity-50" />
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
            <FaExclamationTriangle className="text-red-600" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600">
              <FaTimes />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center gap-3">
            <FaCheckCircle className="text-green-600" />
            <span className="text-sm text-green-800">{success}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                { id: 'active', label: 'Active' },
                { id: 'all', label: 'All' },
                { id: 'checked-out', label: 'Checked Out' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                    ${activeFilter === tab.id
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Check-ins List */}
        <div className="bg-white rounded-lg shadow-sm border">
          {checkIns.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {checkIns.map((checkIn) => (
                <div key={checkIn.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    {/* Room & Guest Info */}
                    <div className="flex items-center gap-4 flex-1 min-w-[250px]">
                      <div className={`w-16 h-16 rounded-lg ${checkIn.status === 'checked-in' ? 'bg-green-600' : 'bg-gray-400'} flex items-center justify-center text-white text-xl font-bold`}>
                        {checkIn.roomNumber}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          <FaUser className="text-gray-400" size={12} />
                          {checkIn.guestName}
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <FaPhone className="text-gray-400" size={10} />
                          {checkIn.guestPhone}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaCalendar size={10} />
                            {new Date(checkIn.checkInDate).toLocaleDateString()} - {new Date(checkIn.checkOutDate).toLocaleDateString()}
                          </span>
                          <span>• {checkIn.stayDuration} nights</span>
                          {checkIn.numberOfGuests > 1 && <span>• {checkIn.numberOfGuests} guests</span>}
                        </div>
                      </div>
                    </div>

                    {/* Billing Info */}
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">
                        Room: ₹{checkIn.totalRoomCharges?.toFixed(2) || '0.00'}
                        {checkIn.totalFoodCharges > 0 && (
                          <span className="ml-2 text-yellow-600">
                            | Food: ₹{checkIn.totalFoodCharges.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <p className={`text-2xl font-bold ${checkIn.status === 'checked-in' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {checkIn.status === 'checked-in' ? `₹${checkIn.balanceAmount?.toFixed(2) || '0.00'}` : 'Paid'}
                      </p>
                      <span className="text-xs text-gray-500">
                        {checkIn.status === 'checked-in' ? 'Balance Due' : `Total: ₹${checkIn.totalPaid?.toFixed(2) || '0.00'}`}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {checkIn.status === 'checked-in' ? (
                        <button
                          onClick={() => openCheckOut(checkIn)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium"
                        >
                          <FaSignOutAlt size={12} />
                          Check Out
                        </button>
                      ) : (
                        <button
                          onClick={() => viewInvoice(checkIn)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm font-medium"
                        >
                          <FaFileInvoice size={12} />
                          Invoice
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Food Orders */}
                  {checkIn.foodOrders && checkIn.foodOrders.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs font-semibold text-yellow-900 mb-2">
                        <FaUtensils className="inline mr-1" size={10} />
                        Food Orders ({checkIn.foodOrders.length})
                      </p>
                      <div className="flex gap-2 flex-wrap text-xs text-yellow-800">
                        {checkIn.foodOrders.map((order, i) => (
                          <span key={i} className="bg-yellow-100 px-2 py-1 rounded">
                            Order #{order.orderNumber || i+1}: ₹{order.amount.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FaHotel className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No check-ins found</h3>
              <p className="text-sm text-gray-600 mb-4">Create your first check-in to get started</p>
              <button
                onClick={() => setShowCheckInModal(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center gap-2"
              >
                <FaPlus /> New Check-In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Check-In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-red-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-bold">New Check-In</h2>
              <button onClick={() => setShowCheckInModal(false)} className="text-white hover:text-gray-200">
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleCheckIn} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={checkInForm.guestName}
                    onChange={e => setCheckInForm({ ...checkInForm, guestName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={checkInForm.guestPhone}
                    onChange={e => setCheckInForm({ ...checkInForm, guestPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={checkInForm.guestEmail}
                    onChange={e => setCheckInForm({ ...checkInForm, guestEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                  <input
                    type="text"
                    required
                    value={checkInForm.roomNumber}
                    onChange={e => setCheckInForm({ ...checkInForm, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-In Date *</label>
                  <input
                    type="date"
                    required
                    value={checkInForm.checkInDate}
                    onChange={e => setCheckInForm({ ...checkInForm, checkInDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out Date *</label>
                  <input
                    type="date"
                    required
                    value={checkInForm.checkOutDate}
                    onChange={e => setCheckInForm({ ...checkInForm, checkOutDate: e.target.value })}
                    min={checkInForm.checkInDate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Tariff/Night</label>
                  <input
                    type="number"
                    step="0.01"
                    value={checkInForm.roomTariff}
                    onChange={e => setCheckInForm({ ...checkInForm, roomTariff: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advance Payment</label>
                  <input
                    type="number"
                    step="0.01"
                    value={checkInForm.advancePayment}
                    onChange={e => setCheckInForm({ ...checkInForm, advancePayment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Proof Type</label>
                  <select
                    value={checkInForm.idProofType}
                    onChange={e => setCheckInForm({ ...checkInForm, idProofType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="aadhar">Aadhar Card</option>
                    <option value="passport">Passport</option>
                    <option value="driving_license">Driving License</option>
                    <option value="voter_id">Voter ID</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  <input
                    type="text"
                    value={checkInForm.idProofNumber}
                    onChange={e => setCheckInForm({ ...checkInForm, idProofNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
                  <input
                    type="text"
                    value={checkInForm.gstNumber}
                    onChange={e => setCheckInForm({ ...checkInForm, gstNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={checkInForm.gstCompanyName}
                    onChange={e => setCheckInForm({ ...checkInForm, gstCompanyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:bg-gray-400"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" size={14} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaUserCheck size={14} />
                      Check In
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-Out Modal */}
      {showCheckOutModal && selectedCheckIn && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
              <h2 className="text-xl font-bold">Check Out - Room {selectedCheckIn.roomNumber}</h2>
              <button onClick={() => { setShowCheckOutModal(false); setSelectedCheckIn(null); }} className="text-white hover:text-gray-200">
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleCheckOut} className="p-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Room Charges:</span>
                    <span className="font-semibold">₹{selectedCheckIn.totalRoomCharges?.toFixed(2)}</span>
                  </div>
                  {selectedCheckIn.totalFoodCharges > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Food Charges:</span>
                      <span className="font-semibold">₹{selectedCheckIn.totalFoodCharges.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Advance Paid:</span>
                    <span className="font-semibold text-green-600">- ₹{selectedCheckIn.advancePayment?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="h-px bg-green-200 my-2" />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold text-green-900">Balance Due:</span>
                    <span className="font-bold text-green-900">₹{selectedCheckIn.balanceAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Final Payment Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={checkOutForm.finalPayment}
                    onChange={e => setCheckOutForm({ ...checkOutForm, finalPayment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                  <select
                    value={checkOutForm.paymentMode}
                    onChange={e => setCheckOutForm({ ...checkOutForm, paymentMode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={checkOutForm.discount}
                    onChange={e => setCheckOutForm({ ...checkOutForm, discount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={checkOutForm.notes}
                    onChange={e => setCheckOutForm({ ...checkOutForm, notes: e.target.value })}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowCheckOutModal(false); setSelectedCheckIn(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:bg-gray-400"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" size={14} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaSignOutAlt size={14} />
                      Complete Checkout
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal - Detailed & Professional */}
      {showInvoiceModal && invoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FaFileInvoice />
                    Hotel Invoice
                  </h2>
                  <p className="text-red-100 text-sm mt-1">Room #{invoice.roomNumber}</p>
                </div>
                <button onClick={() => { setShowInvoiceModal(false); setInvoice(null); }} className="text-white hover:text-gray-200">
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="p-6">
              {/* Guest Details */}
              <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaUser className="text-red-600" />
                    Guest Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{invoice.guestName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{invoice.guestPhone}</span>
                    </div>
                    {invoice.guestEmail && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{invoice.guestEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaCalendar className="text-red-600" />
                    Booking Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-In:</span>
                      <span className="font-medium">{new Date(invoice.checkInDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-Out:</span>
                      <span className="font-medium">{new Date(invoice.checkOutDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{invoice.stayDuration} night(s)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ID & GST Info */}
              {(invoice.idProof || invoice.gstInfo) && (
                <div className="grid md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                  {invoice.idProof && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaIdCard className="text-red-600" />
                        ID Proof
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Type:</span>
                          <span className="font-medium capitalize">{invoice.idProof.type?.replace('_', ' ')}</span>
                        </div>
                        {invoice.idProof.number && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Number:</span>
                            <span className="font-medium">{invoice.idProof.number}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {invoice.gstInfo && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaBuilding className="text-red-600" />
                        GST Information
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">GST No:</span>
                          <span className="font-medium">{invoice.gstInfo.gstNumber}</span>
                        </div>
                        {invoice.gstInfo.companyName && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Company:</span>
                            <span className="font-medium">{invoice.gstInfo.companyName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Charges Breakdown */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-red-600" />
                  Charges Breakdown
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Room Charges ({invoice.stayDuration} × ₹{invoice.roomTariff})</span>
                    <span className="font-semibold text-gray-900">₹{invoice.roomCharges?.toFixed(2)}</span>
                  </div>
                  {invoice.foodCharges > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 flex items-center gap-2">
                        <FaUtensils className="text-yellow-600" size={12} />
                        Food & Beverage Charges
                      </span>
                      <span className="font-semibold text-gray-900">₹{invoice.foodCharges.toFixed(2)}</span>
                    </div>
                  )}
                  {invoice.additionalCharges && invoice.additionalCharges.length > 0 && (
                    invoice.additionalCharges.map((charge, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-gray-700">{charge.description}</span>
                        <span className="font-semibold text-gray-900">₹{charge.amount.toFixed(2)}</span>
                      </div>
                    ))
                  )}
                  {invoice.discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span>Discount</span>
                      <span className="font-semibold">- ₹{invoice.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="h-px bg-gray-300 my-2" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold text-gray-900">Grand Total</span>
                    <span className="font-bold text-gray-900">₹{invoice.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaReceipt className="text-red-600" />
                  Payment Summary
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Advance Payment</span>
                    <span className="font-semibold text-green-700">₹{invoice.advancePayment?.toFixed(2) || '0.00'}</span>
                  </div>
                  {invoice.finalPayment > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Final Payment</span>
                      <span className="font-semibold text-green-700">₹{invoice.finalPayment.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="h-px bg-green-300 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total Paid</span>
                    <span className="font-bold text-green-700">₹{invoice.totalPaid?.toFixed(2)}</span>
                  </div>
                  {invoice.balanceAmount > 0 ? (
                    <div className="flex justify-between items-center text-red-600">
                      <span className="font-bold">Balance Due</span>
                      <span className="font-bold">₹{invoice.balanceAmount.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg text-center">
                      <FaCheckCircle className="inline mr-2 text-green-600" />
                      <span className="font-semibold text-green-800">Fully Paid</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <div className="text-center text-xs text-gray-500 mb-4 flex items-center justify-center gap-2">
                <FaClock />
                Invoice generated on {new Date().toLocaleString()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
                >
                  <FaPrint />
                  Print Invoice
                </button>
                <button
                  onClick={() => { setShowInvoiceModal(false); setInvoice(null); }}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
                >
                  <FaTimes />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotel;
