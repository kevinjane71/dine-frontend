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
  FaDoorOpen,
  FaCalendar,
  FaMoneyBillWave,
  FaFileInvoice,
  FaSignOutAlt,
  FaUtensils,
  FaBed,
  FaUserCheck,
  FaIdCard,
  FaTimes,
  FaReceipt,
  FaEdit
} from 'react-icons/fa';

const Hotel = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Data
  const [checkIns, setCheckIns] = useState([]);
  const [activeFilter, setActiveFilter] = useState('active'); // active, all, checked-out

  // Modals
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedCheckIn, setSelectedCheckIn] = useState(null);
  const [invoice, setInvoice] = useState(null);

  // Check-in form
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

  // Checkout form
  const [checkOutForm, setCheckOutForm] = useState({
    finalPayment: '',
    paymentMode: 'cash',
    discount: '',
    notes: ''
  });

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#f9fafb' }}>
        <div style={{ textAlign: 'center' }}>
          <FaSpinner className="animate-spin" size={32} style={{ color: '#ef4444', marginBottom: '16px' }} />
          <p style={{ color: '#6b7280' }}>Loading hotel data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', paddingTop: isMobile ? '60px' : '80px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: isMobile ? '8px' : '24px' }}>
        {/* Header */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: isMobile ? '16px' : '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <FaHotel size={isMobile ? 20 : 24} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: isMobile ? '20px' : '28px', fontWeight: '700', color: '#1f2937' }}>Hotel Management</h1>
                <p style={{ margin: '4px 0 0 0', color: '#6b7280', fontSize: isMobile ? '13px' : '15px' }}>Manage check-ins, check-outs & room billing</p>
              </div>
            </div>
            <button
              onClick={() => setShowCheckInModal(true)}
              style={{ padding: isMobile ? '10px 16px' : '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '10px', fontSize: isMobile ? '14px' : '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)' }}
            >
              <FaPlus size={14} />
              New Check-In
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px', marginTop: '20px' }}>
            <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '2px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#22c55e', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <FaBed size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#166534' }}>{activeCheckInsCount}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#166534' }}>Active Rooms</p>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#eff6ff', borderRadius: '12px', border: '2px solid #bfdbfe' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <FaMoneyBillWave size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e40af' }}>₹{totalRevenue.toFixed(0)}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1e40af' }}>Total Revenue</p>
                </div>
              </div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#fef3c7', borderRadius: '12px', border: '2px solid #fde68a' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f59e0b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <FaReceipt size={20} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#92400e' }}>₹{pendingAmount.toFixed(0)}</p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#92400e' }}>Pending Dues</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '2px solid #fecaca', borderRadius: '12px', padding: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#dc2626' }}>
            <FaExclamationTriangle size={18} />
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
              <FaTimes />
            </button>
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '12px', padding: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: '#16a34a' }}>
            <FaCheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        {/* Filters */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px', marginBottom: '16px', display: 'flex', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {['active', 'all', 'checked-out'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                padding: '8px 16px',
                backgroundColor: activeFilter === filter ? '#667eea' : '#f3f4f6',
                color: activeFilter === filter ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {filter === 'active' ? 'Active' : filter === 'all' ? 'All' : 'Checked Out'}
            </button>
          ))}
        </div>

        {/* Check-ins List */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {checkIns.length > 0 ? (
            checkIns.map((checkIn, index) => (
              <div key={checkIn.id} style={{ padding: isMobile ? '16px' : '20px', borderBottom: index < checkIns.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between' }}>
                  {/* Room & Guest Info */}
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <div style={{ width: '48px', height: '48px', background: checkIn.status === 'checked-in' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : '#9ca3af', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: '700' }}>
                        {checkIn.roomNumber}
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <FaUser size={12} />
                          {checkIn.guestName}
                        </h3>
                        <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaPhone size={10} />
                          {checkIn.guestPhone}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '12px', color: '#6b7280' }}>
                      <span><FaCalendar size={10} /> {new Date(checkIn.checkInDate).toLocaleDateString()} - {new Date(checkIn.checkOutDate).toLocaleDateString()}</span>
                      <span>• {checkIn.stayDuration} nights</span>
                      {checkIn.numberOfGuests > 1 && <span>• {checkIn.numberOfGuests} guests</span>}
                    </div>
                  </div>

                  {/* Billing Info */}
                  <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '4px' }}>
                      Room: ₹{checkIn.totalRoomCharges?.toFixed(2) || '0.00'}
                      {checkIn.totalFoodCharges > 0 && (
                        <span style={{ marginLeft: '8px' }}>
                          <FaUtensils size={10} style={{ marginRight: '4px' }} />
                          Food: ₹{checkIn.totalFoodCharges.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '4px 0', fontSize: '20px', fontWeight: '700', color: checkIn.status === 'checked-in' ? '#f59e0b' : '#16a34a' }}>
                      {checkIn.status === 'checked-in' ? `₹${checkIn.balanceAmount?.toFixed(2) || '0.00'}` : 'Paid'}
                    </p>
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>
                      {checkIn.status === 'checked-in' ? 'Balance Due' : `Total: ₹${checkIn.totalPaid?.toFixed(2) || '0.00'}`}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {checkIn.status === 'checked-in' ? (
                      <button
                        onClick={() => openCheckOut(checkIn)}
                        style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaSignOutAlt size={12} />
                        Check Out
                      </button>
                    ) : (
                      <button
                        onClick={() => viewInvoice(checkIn)}
                        style={{ padding: '10px 16px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FaFileInvoice size={12} />
                        Invoice
                      </button>
                    )}
                  </div>
                </div>

                {/* Food Orders */}
                {checkIn.foodOrders && checkIn.foodOrders.length > 0 && (
                  <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600', color: '#92400e' }}>
                      <FaUtensils size={10} style={{ marginRight: '6px' }} />
                      Food Orders ({checkIn.foodOrders.length})
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: '#92400e' }}>
                      {checkIn.foodOrders.map((order, i) => (
                        <span key={i}>• ₹{order.amount.toFixed(2)}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <FaHotel size={48} style={{ color: '#d1d5db', marginBottom: '16px' }} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#6b7280' }}>No check-ins found</h3>
              <p style={{ margin: '8px 0 16px 0', fontSize: '14px', color: '#9ca3af' }}>Create your first check-in to get started</p>
              <button
                onClick={() => setShowCheckInModal(true)}
                style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
              >
                <FaPlus size={12} style={{ marginRight: '6px' }} />
                New Check-In
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Check-In Modal */}
      {showCheckInModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Quick Check-In</h2>
              <button onClick={() => setShowCheckInModal(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', color: 'white', padding: '8px', cursor: 'pointer' }}>
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleCheckIn} style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Guest Name *</label>
                  <input type="text" required value={checkInForm.guestName} onChange={e => setCheckInForm({ ...checkInForm, guestName: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Phone *</label>
                  <input type="tel" required value={checkInForm.guestPhone} onChange={e => setCheckInForm({ ...checkInForm, guestPhone: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Email</label>
                  <input type="email" value={checkInForm.guestEmail} onChange={e => setCheckInForm({ ...checkInForm, guestEmail: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Room Number *</label>
                  <input type="text" required value={checkInForm.roomNumber} onChange={e => setCheckInForm({ ...checkInForm, roomNumber: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Check-In *</label>
                  <input type="date" required value={checkInForm.checkInDate} onChange={e => setCheckInForm({ ...checkInForm, checkInDate: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Check-Out *</label>
                  <input type="date" required value={checkInForm.checkOutDate} onChange={e => setCheckInForm({ ...checkInForm, checkOutDate: e.target.value })} min={checkInForm.checkInDate} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Room Tariff/Night</label>
                  <input type="number" step="0.01" value={checkInForm.roomTariff} onChange={e => setCheckInForm({ ...checkInForm, roomTariff: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Advance Payment</label>
                  <input type="number" step="0.01" value={checkInForm.advancePayment} onChange={e => setCheckInForm({ ...checkInForm, advancePayment: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>ID Proof Type</label>
                  <select value={checkInForm.idProofType} onChange={e => setCheckInForm({ ...checkInForm, idProofType: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white' }}>
                    <option value="aadhar">Aadhar</option>
                    <option value="passport">Passport</option>
                    <option value="driving_license">Driving License</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>ID Number</label>
                  <input type="text" value={checkInForm.idProofNumber} onChange={e => setCheckInForm({ ...checkInForm, idProofNumber: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>GST Number</label>
                  <input type="text" value={checkInForm.gstNumber} onChange={e => setCheckInForm({ ...checkInForm, gstNumber: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Company Name</label>
                  <input type="text" value={checkInForm.gstCompanyName} onChange={e => setCheckInForm({ ...checkInForm, gstCompanyName: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
                </div>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowCheckInModal(false)} style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {loading ? <><FaSpinner className="animate-spin" size={14} /> Processing...</> : <><FaUserCheck size={14} /> Check In</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-Out Modal */}
      {showCheckOutModal && selectedCheckIn && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Check Out - Room {selectedCheckIn.roomNumber}</h2>
              <button onClick={() => { setShowCheckOutModal(false); setSelectedCheckIn(null); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', color: 'white', padding: '8px', cursor: 'pointer' }}>
                <FaTimes size={16} />
              </button>
            </div>
            <form onSubmit={handleCheckOut} style={{ padding: '20px' }}>
              <div style={{ padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '10px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>Room Charges:</span>
                  <span style={{ fontWeight: '600' }}>₹{selectedCheckIn.totalRoomCharges?.toFixed(2)}</span>
                </div>
                {selectedCheckIn.totalFoodCharges > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>Food Charges:</span>
                    <span style={{ fontWeight: '600' }}>₹{selectedCheckIn.totalFoodCharges.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>Advance Paid:</span>
                  <span style={{ fontWeight: '600', color: '#16a34a' }}>- ₹{selectedCheckIn.advancePayment?.toFixed(2) || '0.00'}</span>
                </div>
                <div style={{ height: '1px', backgroundColor: '#bbf7d0', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '700', color: '#166534' }}>
                  <span>Balance Due:</span>
                  <span>₹{selectedCheckIn.balanceAmount?.toFixed(2)}</span>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Final Payment Amount</label>
                <input type="number" step="0.01" required value={checkOutForm.finalPayment} onChange={e => setCheckOutForm({ ...checkOutForm, finalPayment: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Payment Mode</label>
                <select value={checkOutForm.paymentMode} onChange={e => setCheckOutForm({ ...checkOutForm, paymentMode: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', backgroundColor: 'white' }}>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Discount (Optional)</label>
                <input type="number" step="0.01" value={checkOutForm.discount} onChange={e => setCheckOutForm({ ...checkOutForm, discount: e.target.value })} style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>Notes</label>
                <textarea value={checkOutForm.notes} onChange={e => setCheckOutForm({ ...checkOutForm, notes: e.target.value })} rows="2" style={{ width: '100%', padding: '10px', border: '2px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => { setShowCheckOutModal(false); setSelectedCheckIn(null); }} style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {loading ? <><FaSpinner className="animate-spin" size={14} /> Processing...</> : <><FaSignOutAlt size={14} /> Complete Checkout</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && invoice && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>Invoice - Room {invoice.roomNumber}</h2>
              <button onClick={() => { setShowInvoiceModal(false); setInvoice(null); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px', color: 'white', padding: '8px', cursor: 'pointer' }}>
                <FaTimes size={16} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>{invoice.guestName}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{invoice.guestPhone}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af' }}>
                  {new Date(invoice.checkInDate).toLocaleDateString()} - {new Date(invoice.checkOutDate).toLocaleDateString()} ({invoice.stayDuration} nights)
                </p>
              </div>
              <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span>Room Charges ({invoice.stayDuration} × ₹{invoice.roomTariff}):</span>
                  <span>₹{invoice.roomCharges?.toFixed(2)}</span>
                </div>
                {invoice.foodCharges > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Food Charges:</span>
                    <span>₹{invoice.foodCharges.toFixed(2)}</span>
                  </div>
                )}
                {invoice.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#16a34a' }}>
                    <span>Discount:</span>
                    <span>- ₹{invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ height: '1px', backgroundColor: '#e5e7eb', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: '600' }}>
                  <span>Total Amount:</span>
                  <span>₹{invoice.totalAmount?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#16a34a' }}>
                  <span>Total Paid:</span>
                  <span>₹{invoice.totalPaid?.toFixed(2)}</span>
                </div>
                {invoice.balanceAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', color: '#dc2626' }}>
                    <span>Balance:</span>
                    <span>₹{invoice.balanceAmount.toFixed(2)}</span>
                  </div>
                )}
                {invoice.balanceAmount === 0 && (
                  <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '8px', textAlign: 'center', color: '#166534', fontWeight: '600', marginTop: '12px' }}>
                    <FaCheckCircle size={16} style={{ marginRight: '8px' }} />
                    Fully Paid
                  </div>
                )}
              </div>
              <button onClick={() => { setShowInvoiceModal(false); setInvoice(null); }} style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hotel;
