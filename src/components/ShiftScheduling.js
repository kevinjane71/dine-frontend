'use client';

import { useState, useEffect } from 'react';
import apiClient from '../lib/api';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaRobot,
  FaSave,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCog,
  FaBuilding
} from 'react-icons/fa';

export default function ShiftScheduling({ restaurantId, staff }) {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [showAddShiftModal, setShowAddShiftModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showEditShiftModal, setShowEditShiftModal] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [newShift, setNewShift] = useState({
    staffId: '',
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    role: 'employee',
    notes: ''
  });
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [shiftSettings, setShiftSettings] = useState({
    shiftTypes: [
      { name: 'Breakfast', startTime: '06:00', endTime: '11:00', requiredEmployees: 3, requiredRoles: { cook: 1, server: 2 }, color: '#FFCC00' },
      { name: 'Lunch', startTime: '11:00', endTime: '15:00', requiredEmployees: 5, requiredRoles: { cook: 2, server: 2, bartender: 1 }, color: '#00CCFF' },
      { name: 'Dinner', startTime: '17:00', endTime: '23:00', requiredEmployees: 6, requiredRoles: { cook: 2, server: 3, bartender: 1 }, color: '#FF6B6B' }
    ],
    operatingHours: { start: '06:00', end: '23:00' },
    peakHours: { lunch: { start: '12:00', end: '14:00' }, dinner: { start: '19:00', end: '21:00' } },
    minRestHours: 8,
    maxHoursPerWeek: 40,
    maxHoursPerDay: 8,
    timeOff: []
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (restaurantId) {
      loadShifts();
      loadSettings();
    }
  }, [restaurantId, currentWeek]);

  const loadSettings = async () => {
    if (!restaurantId) return;
    
    try {
      setSettingsLoading(true);
      const response = await apiClient.getShiftSettings(restaurantId);
      if (response.success && response.settings) {
        setShiftSettings(response.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!restaurantId) return;
    
    try {
      setSettingsLoading(true);
      await apiClient.updateShiftSettings(restaurantId, shiftSettings);
      alert('Settings saved successfully!');
      setShowSettingsPanel(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings: ' + (error.message || 'Unknown error'));
    } finally {
      setSettingsLoading(false);
    }
  };

  const loadShifts = async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      const weekStart = getWeekStart(currentWeek);
      const weekEnd = getWeekEnd(currentWeek);
      
      const response = await apiClient.getShifts(
        restaurantId,
        weekStart.toISOString().split('T')[0],
        weekEnd.toISOString().split('T')[0]
      );
      
      setShifts(response.shifts || []);
    } catch (error) {
      console.error('Error loading shifts:', error);
      alert('Failed to load shifts');
    } finally {
      setLoading(false);
    }
  };

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    return new Date(d.setDate(diff));
  };

  const getWeekEnd = (date) => {
    const start = getWeekStart(date);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    return end;
  };

  const getWeekDays = () => {
    const start = getWeekStart(currentWeek);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const getShiftsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return shifts.filter(shift => shift.date === dateStr);
  };

  const handleAutoGenerate = async () => {
    if (!restaurantId || !confirm('This will generate shifts for the current week. Existing shifts may be updated. Continue?')) {
      return;
    }

    try {
      setAutoGenerating(true);
      const weekStart = getWeekStart(currentWeek);
      const weekEnd = getWeekEnd(currentWeek);
      
      const response = await apiClient.autoGenerateShifts(
        restaurantId,
        weekStart.toISOString().split('T')[0],
        weekEnd.toISOString().split('T')[0],
        {
          operatingHours: shiftSettings.operatingHours,
          peakHours: shiftSettings.peakHours,
          minRestHours: shiftSettings.minRestHours,
          maxHoursPerWeek: shiftSettings.maxHoursPerWeek,
          maxHoursPerDay: shiftSettings.maxHoursPerDay,
          timeOff: shiftSettings.timeOff
        },
        shiftSettings.shiftTypes
      );
      
      if (response.success) {
        alert(`Successfully generated ${response.count} shifts!`);
        loadShifts();
      }
    } catch (error) {
      console.error('Error auto-generating shifts:', error);
      alert('Failed to auto-generate shifts: ' + (error.message || 'Unknown error'));
    } finally {
      setAutoGenerating(false);
    }
  };

  const handleAddShift = async (e) => {
    e.preventDefault();
    if (!restaurantId || !newShift.staffId || !newShift.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await apiClient.createShift(restaurantId, newShift);
      setShowAddShiftModal(false);
      setNewShift({
        staffId: '',
        date: '',
        startTime: '09:00',
        endTime: '17:00',
        role: 'employee',
        notes: ''
      });
      loadShifts();
      alert('Shift created successfully!');
    } catch (error) {
      console.error('Error creating shift:', error);
      alert('Failed to create shift: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShift = async (shiftId) => {
    if (!confirm('Are you sure you want to delete this shift?')) return;

    try {
      setLoading(true);
      await apiClient.deleteShift(shiftId);
      loadShifts();
      alert('Shift deleted successfully!');
    } catch (error) {
      console.error('Error deleting shift:', error);
      alert('Failed to delete shift: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleEditShift = async (e) => {
    e.preventDefault();
    if (!selectedShift) return;

    try {
      setLoading(true);
      await apiClient.createShift(restaurantId, {
        staffId: selectedShift.staffId,
        date: selectedShift.date,
        startTime: selectedShift.startTime,
        endTime: selectedShift.endTime,
        role: selectedShift.role,
        notes: selectedShift.notes
      });
      setShowEditShiftModal(false);
      setSelectedShift(null);
      loadShifts();
      alert('Shift updated successfully!');
    } catch (error) {
      console.error('Error updating shift:', error);
      alert('Failed to update shift: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const getStaffName = (staffId) => {
    const member = staff.find(s => s.id === staffId);
    return member ? member.name : 'Unknown';
  };

  const getStaffRole = (staffId) => {
    const member = staff.find(s => s.id === staffId);
    return member ? member.role : 'employee';
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDayNumber = (date) => {
    return date.getDate();
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const goToToday = () => {
    setCurrentWeek(new Date());
  };

  const weekDays = getWeekDays();
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div style={{ 
      padding: isMobile ? '20px' : '24px', 
      backgroundColor: '#fafafa', 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '24px'
    }}>
      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '24px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ 
            fontSize: isMobile ? '24px' : '32px', 
            fontWeight: '900', 
            color: '#1f2937', 
            marginBottom: '8px' 
          }}>
            Shift Scheduling
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Manage staff shifts for the week. Use AI to auto-generate or create manually.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleAutoGenerate}
            disabled={autoGenerating || !restaurantId || staff.length === 0}
            style={{
              padding: '10px 20px',
              backgroundColor: autoGenerating ? '#9ca3af' : 'linear-gradient(135deg, #ef4444, #dc2626)',
              background: autoGenerating ? '#9ca3af' : 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: autoGenerating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (!autoGenerating) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!autoGenerating) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.2)';
              }
            }}
          >
            {autoGenerating ? (
              <>
                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <FaRobot size={16} />
                <span>AI Auto-Generate</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => setShowAddShiftModal(true)}
            disabled={!restaurantId || staff.length === 0}
            style={{
              padding: '10px 20px',
              backgroundColor: (!restaurantId || staff.length === 0) ? '#9ca3af' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: (!restaurantId || staff.length === 0) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
            }}
            onMouseEnter={(e) => {
              if (restaurantId && staff.length > 0) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (restaurantId && staff.length > 0) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.2)';
              }
            }}
          >
            <FaPlus size={14} />
            <span>Add Shift</span>
          </button>
          
          <button
            onClick={() => setShowSettingsPanel(!showSettingsPanel)}
            style={{
              padding: '10px 20px',
              backgroundColor: showSettingsPanel ? '#ef4444' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <FaCog size={14} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div style={{
        backgroundColor: 'white',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}>
        <button
          onClick={() => navigateWeek(-1)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#374151',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
          }}
        >
          <FaChevronLeft size={14} />
          <span>Previous</span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: '700', 
            color: '#1f2937',
            marginBottom: '4px'
          }}>
            {getWeekStart(currentWeek).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {getWeekEnd(currentWeek).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <button
            onClick={goToToday}
            style={{
              padding: '4px 12px',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              border: '1px solid #fecaca',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#fee2e2';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#fef2f2';
            }}
          >
            Go to Today
          </button>
        </div>

        <button
          onClick={() => navigateWeek(1)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#f3f4f6',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#374151',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e5e7eb';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f3f4f6';
          }}
        >
          <span>Next</span>
          <FaChevronRight size={14} />
        </button>
      </div>

      {/* Week Calendar View */}
      {loading && !shifts.length ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '12px'
        }}>
          <FaSpinner style={{ 
            animation: 'spin 1s linear infinite', 
            fontSize: '32px', 
            color: '#ef4444',
            marginBottom: '16px'
          }} />
          <p style={{ color: '#6b7280' }}>Loading shifts...</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(7, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {weekDays.map((day, index) => {
            const dayShifts = getShiftsForDay(day);
            const today = isToday(day);
            
            return (
              <div
                key={index}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  padding: '12px',
                  minHeight: '200px',
                  border: today ? '2px solid #ef4444' : '1px solid #e5e7eb',
                  boxShadow: today ? '0 4px 12px rgba(239, 68, 68, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                {/* Day Header */}
                <div style={{
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#6b7280',
                    marginBottom: '4px'
                  }}>
                    {getDayName(day)}
                  </div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: today ? '#ef4444' : '#1f2937'
                  }}>
                    {getDayNumber(day)}
                  </div>
                </div>

                {/* Shifts for this day */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {dayShifts.length === 0 ? (
                    <div style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      textAlign: 'center',
                      padding: '20px 0',
                      fontStyle: 'italic'
                    }}>
                      No shifts
                    </div>
                  ) : (
                    dayShifts.map((shift) => (
                      <div
                        key={shift.id}
                        style={{
                          backgroundColor: '#fef2f2',
                          border: '1px solid #fecaca',
                          borderRadius: '8px',
                          padding: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fee2e2';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#fef2f2';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onClick={() => {
                          setSelectedShift(shift);
                          setShowEditShiftModal(true);
                        }}
                      >
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '700',
                          color: '#1f2937',
                          marginBottom: '4px'
                        }}>
                          {getStaffName(shift.staffId)}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: '#6b7280',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '4px'
                        }}>
                          <FaClock size={10} />
                          {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                        </div>
                        <div style={{
                          fontSize: '10px',
                          color: '#9ca3af',
                          textTransform: 'capitalize'
                        }}>
                          {shift.role}
                        </div>
                        <div style={{
                          marginTop: '8px',
                          display: 'flex',
                          gap: '4px',
                          justifyContent: 'flex-end'
                        }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteShift(shift.id);
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#fecaca';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#fee2e2';
                            }}
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Shift Modal */}
      {showAddShiftModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => setShowAddShiftModal(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: isMobile ? '24px' : '32px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                Add New Shift
              </h3>
              <button
                onClick={() => setShowAddShiftModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleAddShift}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Staff Member *
                </label>
                <select
                  value={newShift.staffId}
                  onChange={(e) => setNewShift({ ...newShift, staffId: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="">Select staff member</option>
                  {staff.filter(s => s.status === 'active').map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={newShift.date}
                  onChange={(e) => setNewShift({ ...newShift, date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={newShift.startTime}
                    onChange={(e) => setNewShift({ ...newShift, startTime: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={newShift.endTime}
                    onChange={(e) => setNewShift({ ...newShift, endTime: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={newShift.notes}
                  onChange={(e) => setNewShift({ ...newShift, notes: e.target.value })}
                  placeholder="Add any notes about this shift..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setShowAddShiftModal(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaSave size={14} />
                      <span>Create Shift</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Shift Modal */}
      {showEditShiftModal && selectedShift && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}
        onClick={() => {
          setShowEditShiftModal(false);
          setSelectedShift(null);
        }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: isMobile ? '24px' : '32px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                Edit Shift
              </h3>
              <button
                onClick={() => {
                  setShowEditShiftModal(false);
                  setSelectedShift(null);
                }}
                style={{
                  padding: '8px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <FaTimes size={18} />
              </button>
            </div>

            <form onSubmit={handleEditShift}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Staff Member
                </label>
                <div style={{
                  padding: '12px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  {getStaffName(selectedShift.staffId)}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Date
                </label>
                <input
                  type="date"
                  value={selectedShift.date}
                  onChange={(e) => setSelectedShift({ ...selectedShift, date: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={selectedShift.startTime}
                    onChange={(e) => setSelectedShift({ ...selectedShift, startTime: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={selectedShift.endTime}
                    onChange={(e) => setSelectedShift({ ...selectedShift, endTime: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Notes (Optional)
                </label>
                <textarea
                  value={selectedShift.notes || ''}
                  onChange={(e) => setSelectedShift({ ...selectedShift, notes: e.target.value })}
                  placeholder="Add any notes about this shift..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditShiftModal(false);
                    setSelectedShift(null);
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FaSave size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      </div>
      {/* Settings Panel */}
      {showSettingsPanel && !isMobile && (
        <div style={{
          width: '400px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          maxHeight: 'calc(100vh - 48px)',
          overflowY: 'auto',
          position: 'sticky',
          top: '24px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e5e7eb'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBuilding size={20} />
              Restaurant Settings
            </h3>
            <button
              onClick={() => setShowSettingsPanel(false)}
              style={{
                padding: '6px',
                backgroundColor: '#f3f4f6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              <FaTimes size={14} />
            </button>
          </div>

          {/* Operating Hours */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Operating Hours
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Start</label>
                <input
                  type="time"
                  value={shiftSettings.operatingHours.start}
                  onChange={(e) => setShiftSettings({
                    ...shiftSettings,
                    operatingHours: { ...shiftSettings.operatingHours, start: e.target.value }
                  })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>End</label>
                <input
                  type="time"
                  value={shiftSettings.operatingHours.end}
                  onChange={(e) => setShiftSettings({
                    ...shiftSettings,
                    operatingHours: { ...shiftSettings.operatingHours, end: e.target.value }
                  })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Shift Types */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                Shift Types
              </label>
              <button
                onClick={() => {
                  setShiftSettings({
                    ...shiftSettings,
                    shiftTypes: [...shiftSettings.shiftTypes, {
                      name: 'New Shift',
                      startTime: '09:00',
                      endTime: '17:00',
                      requiredEmployees: 2,
                      requiredRoles: {},
                      color: '#FFCC00'
                    }]
                  });
                }}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: '#374151'
                }}
              >
                <FaPlus size={10} /> Add
              </button>
            </div>
            {shiftSettings.shiftTypes.map((shiftType, index) => (
              <div key={index} style={{
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={shiftType.name}
                    onChange={(e) => {
                      const updated = [...shiftSettings.shiftTypes];
                      updated[index].name = e.target.value;
                      setShiftSettings({ ...shiftSettings, shiftTypes: updated });
                    }}
                    placeholder="Shift Name"
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '13px',
                      marginRight: '8px'
                    }}
                  />
                  <input
                    type="color"
                    value={shiftType.color}
                    onChange={(e) => {
                      const updated = [...shiftSettings.shiftTypes];
                      updated[index].color = e.target.value;
                      setShiftSettings({ ...shiftSettings, shiftTypes: updated });
                    }}
                    style={{ width: '40px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  />
                  <button
                    onClick={() => {
                      const updated = shiftSettings.shiftTypes.filter((_, i) => i !== index);
                      setShiftSettings({ ...shiftSettings, shiftTypes: updated });
                    }}
                    style={{
                      padding: '6px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      marginLeft: '8px'
                    }}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Start</label>
                    <input
                      type="time"
                      value={shiftType.startTime}
                      onChange={(e) => {
                        const updated = [...shiftSettings.shiftTypes];
                        updated[index].startTime = e.target.value;
                        setShiftSettings({ ...shiftSettings, shiftTypes: updated });
                      }}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>End</label>
                    <input
                      type="time"
                      value={shiftType.endTime}
                      onChange={(e) => {
                        const updated = [...shiftSettings.shiftTypes];
                        updated[index].endTime = e.target.value;
                        setShiftSettings({ ...shiftSettings, shiftTypes: updated });
                      }}
                      style={{
                        width: '100%',
                        padding: '6px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '12px'
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>Required Employees</label>
                  <input
                    type="number"
                    value={shiftType.requiredEmployees}
                    onChange={(e) => {
                      const updated = [...shiftSettings.shiftTypes];
                      updated[index].requiredEmployees = parseInt(e.target.value) || 0;
                      setShiftSettings({ ...shiftSettings, shiftTypes: updated });
                    }}
                    min="0"
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Peak Hours */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
              Peak Hours
            </label>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Lunch</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="time"
                  value={shiftSettings.peakHours.lunch?.start || '12:00'}
                  onChange={(e) => setShiftSettings({
                    ...shiftSettings,
                    peakHours: {
                      ...shiftSettings.peakHours,
                      lunch: { ...shiftSettings.peakHours.lunch, start: e.target.value }
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <input
                  type="time"
                  value={shiftSettings.peakHours.lunch?.end || '14:00'}
                  onChange={(e) => setShiftSettings({
                    ...shiftSettings,
                    peakHours: {
                      ...shiftSettings.peakHours,
                      lunch: { ...shiftSettings.peakHours.lunch, end: e.target.value }
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Dinner</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <input
                  type="time"
                  value={shiftSettings.peakHours.dinner?.start || '19:00'}
                  onChange={(e) => setShiftSettings({
                    ...shiftSettings,
                    peakHours: {
                      ...shiftSettings.peakHours,
                      dinner: { ...shiftSettings.peakHours.dinner, start: e.target.value }
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <input
                  type="time"
                  value={shiftSettings.peakHours.dinner?.end || '21:00'}
                  onChange={(e) => setShiftSettings({
                    ...shiftSettings,
                    peakHours: {
                      ...shiftSettings.peakHours,
                      dinner: { ...shiftSettings.peakHours.dinner, end: e.target.value }
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '6px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Time Off */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
              Time Off (Days Closed)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <button
                  key={day}
                  onClick={() => {
                    const timeOff = shiftSettings.timeOff.includes(day)
                      ? shiftSettings.timeOff.filter(d => d !== day)
                      : [...shiftSettings.timeOff, day];
                    setShiftSettings({ ...shiftSettings, timeOff });
                  }}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: shiftSettings.timeOff.includes(day) ? '#fee2e2' : '#f3f4f6',
                    color: shiftSettings.timeOff.includes(day) ? '#dc2626' : '#374151',
                    border: `1px solid ${shiftSettings.timeOff.includes(day) ? '#fecaca' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: shiftSettings.timeOff.includes(day) ? '600' : '400'
                  }}
                >
                  {day.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Other Settings */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
              Staff Limits
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Max Hours/Day</label>
                <input
                  type="number"
                  value={shiftSettings.maxHoursPerDay}
                  onChange={(e) => setShiftSettings({ ...shiftSettings, maxHoursPerDay: parseInt(e.target.value) || 8 })}
                  min="1"
                  max="24"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Max Hours/Week</label>
                <input
                  type="number"
                  value={shiftSettings.maxHoursPerWeek}
                  onChange={(e) => setShiftSettings({ ...shiftSettings, maxHoursPerWeek: parseInt(e.target.value) || 40 })}
                  min="1"
                  max="168"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Min Rest Hours</label>
              <input
                type="number"
                value={shiftSettings.minRestHours}
                onChange={(e) => setShiftSettings({ ...shiftSettings, minRestHours: parseInt(e.target.value) || 8 })}
                min="0"
                max="24"
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            disabled={settingsLoading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: settingsLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: settingsLoading ? 0.6 : 1
            }}
          >
            {settingsLoading ? (
              <>
                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaSave size={14} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Mobile Settings Modal */}
      {showSettingsPanel && isMobile && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          padding: '20px',
          overflowY: 'auto'
        }}
        onClick={() => setShowSettingsPanel(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              margin: '0 auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Same settings content as desktop, but in modal */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
              paddingBottom: '16px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937' }}>Restaurant Settings</h3>
              <button
                onClick={() => setShowSettingsPanel(false)}
                style={{
                  padding: '6px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#6b7280'
                }}
              >
                <FaTimes size={18} />
              </button>
            </div>
            {/* Operating Hours */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Operating Hours
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Start</label>
                  <input
                    type="time"
                    value={shiftSettings.operatingHours.start}
                    onChange={(e) => setShiftSettings({
                      ...shiftSettings,
                      operatingHours: { ...shiftSettings.operatingHours, start: e.target.value }
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>End</label>
                  <input
                    type="time"
                    value={shiftSettings.operatingHours.end}
                    onChange={(e) => setShiftSettings({
                      ...shiftSettings,
                      operatingHours: { ...shiftSettings.operatingHours, end: e.target.value }
                    })}
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Shift Types - Simplified for mobile */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px', display: 'block' }}>
                Shift Types ({shiftSettings.shiftTypes.length})
              </label>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '12px' }}>
                Configure shift types in desktop view for full editing
              </p>
            </div>

            {/* Peak Hours */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                Peak Hours
              </label>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Lunch</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="time"
                    value={shiftSettings.peakHours.lunch?.start || '12:00'}
                    onChange={(e) => setShiftSettings({
                      ...shiftSettings,
                      peakHours: {
                        ...shiftSettings.peakHours,
                        lunch: { ...shiftSettings.peakHours.lunch, start: e.target.value }
                      }
                    })}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <input
                    type="time"
                    value={shiftSettings.peakHours.lunch?.end || '14:00'}
                    onChange={(e) => setShiftSettings({
                      ...shiftSettings,
                      peakHours: {
                        ...shiftSettings.peakHours,
                        lunch: { ...shiftSettings.peakHours.lunch, end: e.target.value }
                      }
                    })}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Dinner</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <input
                    type="time"
                    value={shiftSettings.peakHours.dinner?.start || '19:00'}
                    onChange={(e) => setShiftSettings({
                      ...shiftSettings,
                      peakHours: {
                        ...shiftSettings.peakHours,
                        dinner: { ...shiftSettings.peakHours.dinner, start: e.target.value }
                      }
                    })}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                  <input
                    type="time"
                    value={shiftSettings.peakHours.dinner?.end || '21:00'}
                    onChange={(e) => setShiftSettings({
                      ...shiftSettings,
                      peakHours: {
                        ...shiftSettings.peakHours,
                        dinner: { ...shiftSettings.peakHours.dinner, end: e.target.value }
                      }
                    })}
                    style={{
                      width: '100%',
                      padding: '6px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Time Off */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                Time Off (Days Closed)
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <button
                    key={day}
                    onClick={() => {
                      const timeOff = shiftSettings.timeOff.includes(day)
                        ? shiftSettings.timeOff.filter(d => d !== day)
                        : [...shiftSettings.timeOff, day];
                      setShiftSettings({ ...shiftSettings, timeOff });
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: shiftSettings.timeOff.includes(day) ? '#fee2e2' : '#f3f4f6',
                      color: shiftSettings.timeOff.includes(day) ? '#dc2626' : '#374151',
                      border: `1px solid ${shiftSettings.timeOff.includes(day) ? '#fecaca' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: shiftSettings.timeOff.includes(day) ? '600' : '400'
                    }}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Staff Limits */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>
                Staff Limits
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Max Hours/Day</label>
                  <input
                    type="number"
                    value={shiftSettings.maxHoursPerDay}
                    onChange={(e) => setShiftSettings({ ...shiftSettings, maxHoursPerDay: parseInt(e.target.value) || 8 })}
                    min="1"
                    max="24"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Max Hours/Week</label>
                  <input
                    type="number"
                    value={shiftSettings.maxHoursPerWeek}
                    onChange={(e) => setShiftSettings({ ...shiftSettings, maxHoursPerWeek: parseInt(e.target.value) || 40 })}
                    min="1"
                    max="168"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Min Rest Hours</label>
                <input
                  type="number"
                  value={shiftSettings.minRestHours}
                  onChange={(e) => setShiftSettings({ ...shiftSettings, minRestHours: parseInt(e.target.value) || 8 })}
                  min="0"
                  max="24"
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <button
              onClick={saveSettings}
              disabled={settingsLoading}
              style={{
                width: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: settingsLoading ? 'not-allowed' : 'pointer',
                marginTop: '20px'
              }}
            >
              {settingsLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

