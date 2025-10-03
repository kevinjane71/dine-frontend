'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../lib/api';
import { 
  FaPlus, 
  FaTrash,
  FaCog,
  FaUsers,
  FaClock,
  FaUtensils,
  FaCheck,
  FaBan,
  FaChair,
  FaHome,
  FaEdit,
  FaEllipsisV,
  FaCalendarAlt,
  FaTools,
  FaTimes,
  FaPhoneAlt,
  FaUser,
  FaChevronDown
} from 'react-icons/fa';

const TableManagement = () => {
  const router = useRouter();
  const [floors, setFloors] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Mobile responsive state
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddTable, setShowAddTable] = useState(false);
  const [showAddFloor, setShowAddFloor] = useState(false);
  const [showEditFloor, setShowEditFloor] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedFloorForTable, setSelectedFloorForTable] = useState(null);
  const [editingFloor, setEditingFloor] = useState(null);
  const [showNewFloorForm, setShowNewFloorForm] = useState(false);
  
  // Dropdown state
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  // Form states
  const [newFloor, setNewFloor] = useState({ name: '', description: '' });
  const [newTable, setNewTable] = useState({
    name: '',
    capacity: 4,
    type: 'regular',
    floorId: null
  });
  const [bookingData, setBookingData] = useState({
    customerName: '',
    customerPhone: '',
    partySize: 2,
    bookingDate: '',
    bookingTime: '',
    notes: ''
  });

  const scrollContainerRef = useRef(null);

  // Mobile detection hook
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      const isMobileView = width <= 768;
      setIsMobile(isMobileView);
    };
    
    // Check immediately and also with a delay for hydration
    checkMobile();
    const timeoutId = setTimeout(checkMobile, 100);
    
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timeoutId);
    };
  }, []);

  // Load data on component mount
  useEffect(() => {
    loadInitialData();
  }, []);

  // Refresh data when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && selectedRestaurant?.id) {
        console.log('🔄 Tables page visible, refreshing data...');
        loadFloorsAndTables(selectedRestaurant.id, true); // Force refresh
      }
    };

    const handleFocus = () => {
      if (selectedRestaurant?.id) {
        console.log('🔄 Tables page focused, refreshing data...');
        loadFloorsAndTables(selectedRestaurant.id, true); // Force refresh
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [selectedRestaurant?.id]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Get user data and restaurant context
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      
      // Load restaurants
      const restaurantsResponse = await apiClient.getRestaurants();
      const restaurants = restaurantsResponse.restaurants || [];
      
      let restaurant = null;
      
      // Determine selected restaurant
      if (user?.restaurantId) {
        restaurant = restaurants.find(r => r.id === user.restaurantId);
      } else if (restaurants.length > 0) {
        const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
        restaurant = restaurants.find(r => r.id === savedRestaurantId) || restaurants[0];
      }
      
      if (restaurant) {
        setSelectedRestaurant(restaurant);
        await loadFloorsAndTables(restaurant.id);
      } else {
        setError('No restaurant found');
      }
      
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFloorsAndTables = async (restaurantId, forceRefresh = false) => {
    try {
      // Clear cache if force refresh
      if (forceRefresh) {
        localStorage.removeItem(`floors_${restaurantId}`);
        console.log('🗑️ Cleared floors cache for fresh data');
      }
      
      // Try to get floors first
      const floorsResponse = await apiClient.getFloors(restaurantId);
      if (floorsResponse.floors && floorsResponse.floors.length > 0) {
        setFloors(floorsResponse.floors);
      } else {
        // If no floors, get tables and create a default floor structure
        const tablesResponse = await apiClient.getTables(restaurantId);
        const tables = tablesResponse.tables || [];
        
        // Create default floor with all tables
        const defaultFloor = {
          id: 'default',
          name: 'Main Floor',
          description: 'Main dining area',
          tables: tables,
          restaurantId: restaurantId
        };
        setFloors([defaultFloor]);
      }
    } catch (err) {
      console.error('Error loading floors and tables:', err);
      setError('Failed to load tables');
    }
  };

  const getTableStatusInfo = (status) => {
    const statusMap = {
      available: { 
        bg: '#f0fdf4', 
        text: '#166534', 
        label: 'Available',
        icon: FaCheck,
        border: '#86efac',
        pulse: false
      },
      occupied: { 
        bg: '#fef2f2', 
        text: '#dc2626', 
        label: 'Occupied',
        icon: FaUsers,
        border: '#fca5a5',
        pulse: false
      },
      serving: { 
        bg: '#fefce8', 
        text: '#ca8a04', 
        label: 'Serving',
        icon: FaUtensils,
        border: '#fde047',
        pulse: true
      },
      reserved: { 
        bg: '#f0f9ff', 
        text: '#0369a1', 
        label: 'Reserved',
        icon: FaClock,
        border: '#7dd3fc',
        pulse: false
      },
      cleaning: { 
        bg: '#f8fafc', 
        text: '#475569', 
        label: 'Cleaning',
        icon: FaUtensils,
        border: '#cbd5e1',
        pulse: false
      },
      'out-of-service': { 
        bg: '#faf5ff', 
        text: '#7c3aed', 
        label: 'Out of Service',
        icon: FaBan,
        border: '#c4b5fd',
        pulse: false
      }
    };
    return statusMap[status] || statusMap.available;
  };

  const getTableTypeInfo = (type) => {
    const typeMap = {
      small: { seats: '2', color: '#e53e3e' },
      regular: { seats: '4', color: '#10b981' },
      large: { seats: '6+', color: '#f59e0b' },
      vip: { seats: 'VIP', color: '#8b5cf6' },
      private: { seats: 'PVT', color: '#ef4444' }
    };
    return typeMap[type] || typeMap.regular;
  };

  // API operations
  const addFloor = async () => {
    if (!newFloor.name.trim() || !selectedRestaurant) return;
    
    try {
      const floorData = {
        name: newFloor.name.trim(),
        description: newFloor.description.trim() || null
      };
      
      const response = await apiClient.createFloor(selectedRestaurant.id, floorData);
      const newFloorData = { ...response.floor, tables: [] };
      
      setFloors(prev => [...prev, newFloorData]);
      setNewFloor({ name: '', description: '' });
      setShowAddFloor(false);
      
    } catch (err) {
      console.error('Error adding floor:', err);
      alert(`Failed to add floor: ${err.message}`);
    }
  };

  const editFloor = async () => {
    if (!editingFloor || !newFloor.name.trim() || !selectedRestaurant) return;
    
    try {
      const floorData = {
        name: newFloor.name.trim(),
        description: newFloor.description.trim() || null,
        restaurantId: selectedRestaurant.id
      };
      
      await apiClient.updateFloor(editingFloor.id, floorData);
      
      setFloors(prev => prev.map(floor => 
        floor.id === editingFloor.id 
          ? { ...floor, name: newFloor.name.trim(), description: newFloor.description.trim() || null }
          : floor
      ));
      
      setNewFloor({ name: '', description: '' });
      setEditingFloor(null);
      setShowEditFloor(false);
      
    } catch (err) {
      console.error('Error editing floor:', err);
      alert(`Failed to edit floor: ${err.message}`);
    }
  };

  const deleteFloor = async (floorId) => {
    if (!confirm('Are you sure you want to delete this floor and all its tables?')) return;
    
    try {
      await apiClient.deleteFloor(floorId, { restaurantId: selectedRestaurant.id });
      setFloors(prev => prev.filter(floor => floor.id !== floorId));
    } catch (err) {
      console.error('Error deleting floor:', err);
      alert(`Failed to delete floor: ${err.message}`);
    }
  };

  const startEditFloor = (floor) => {
    setEditingFloor(floor);
    setNewFloor({ name: floor.name, description: floor.description || '' });
    setShowEditFloor(true);
  };

  const addTable = async () => {
    if (!newTable.name.trim() || !selectedFloorForTable || !selectedRestaurant) return;
    
    try {
      // Find the selected floor to get its name
      const selectedFloor = floors.find(floor => floor.id === selectedFloorForTable);
      if (!selectedFloor) {
        alert('Selected floor not found');
        return;
      }

      const tableData = {
        name: newTable.name.trim(),
        capacity: parseInt(newTable.capacity),
        type: newTable.type,
        floor: selectedFloor.name, // Send floor name instead of floorId
        status: 'available'
      };
      
      const response = await apiClient.createTable(selectedRestaurant.id, tableData);
      
      // Update floors state with new table
      setFloors(prev => prev.map(floor => {
        if (floor.id === selectedFloorForTable) {
          return {
            ...floor,
            tables: [...(floor.tables || []), response.table]
          };
        }
        return floor;
      }));
      
      setNewTable({ name: '', capacity: 4, type: 'regular', floorId: null });
      setSelectedFloorForTable(null);
      setShowAddTable(false);
      
    } catch (err) {
      console.error('Error adding table:', err);
      alert(`Failed to add table: ${err.message}`);
    }
  };

  const updateTableStatus = async (tableId, newStatus, additionalData = {}) => {
    try {
      await apiClient.updateTableStatus(tableId, newStatus, additionalData.orderId);
      
      // Update local state
      setFloors(prev => prev.map(floor => ({
        ...floor,
        tables: (floor.tables || []).map(table => {
          if (table.id === tableId) {
            const updatedTable = { ...table, status: newStatus, ...additionalData };
            if (newStatus === 'available') {
              updatedTable.customerName = null;
              updatedTable.startTime = null;
              updatedTable.reservationTime = null;
            }
            return updatedTable;
          }
          return table;
        })
      })));
      
      setActiveDropdown(null);
    } catch (err) {
      console.error('Error updating table status:', err);
      alert(`Failed to update table: ${err.message}`);
    }
  };

  const deleteTable = async (tableId) => {
    if (!confirm('Are you sure you want to delete this table?')) return;
    
    try {
      await apiClient.deleteTable(tableId);
      
      setFloors(prev => prev.map(floor => ({
        ...floor,
        tables: (floor.tables || []).filter(t => t.id !== tableId)
      })));
      
      setActiveDropdown(null);
    } catch (err) {
      console.error('Error deleting table:', err);
      alert(`Failed to delete table: ${err.message}`);
    }
  };

  const createBooking = async () => {
    if (!selectedTable || !bookingData.customerName.trim() || !selectedRestaurant) return;
    
    try {
      const booking = {
        tableId: selectedTable.id,
        customerName: bookingData.customerName.trim(),
        customerPhone: bookingData.customerPhone.trim() || null,
        partySize: parseInt(bookingData.partySize),
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        notes: bookingData.notes.trim() || null,
        status: 'confirmed'
      };
      
      await apiClient.createBooking(selectedRestaurant.id, booking);
      
      // Update table status to reserved
      await updateTableStatus(selectedTable.id, 'reserved', {
        customerName: bookingData.customerName,
        reservationTime: bookingData.bookingTime
      });
      
      // Reset form
      setBookingData({
        customerName: '',
        customerPhone: '',
        partySize: 2,
        bookingDate: '',
        bookingTime: '',
        notes: ''
      });
      setShowBookingForm(false);
      setSelectedTable(null);
      
    } catch (err) {
      console.error('Error creating booking:', err);
      alert(`Failed to create booking: ${err.message}`);
    }
  };

  // Handle table actions
  const handleTableAction = (action, table) => {
    setSelectedTable(table);
    setActiveDropdown(null);
    
    switch (action) {
      case 'take-order':
        // Redirect to order page with table info
        const floor = floors.find(f => (f.tables || []).some(t => t.id === table.id));
        const params = new URLSearchParams({
          table: table.name,
          capacity: table.capacity.toString(),
          floor: floor?.name || 'Main Floor'
        });
        router.push(`/?${params.toString()}`);
        break;
        
      case 'book-table':
        // Set default date and time
        const now = new Date();
        setBookingData(prev => ({
          ...prev,
          bookingDate: now.toISOString().split('T')[0],
          bookingTime: now.toTimeString().slice(0, 5),
          partySize: table.capacity
        }));
        setShowBookingForm(true);
        break;
        
      case 'out-of-service':
        updateTableStatus(table.id, 'out-of-service');
        break;
        
      case 'cleaning':
        updateTableStatus(table.id, 'cleaning');
        break;
        
      case 'make-available':
        updateTableStatus(table.id, 'available');
        break;
        
      default:
        break;
    }
  };

  const scrollToFloor = (floorId) => {
    const element = document.getElementById(`floor-${floorId}`);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.table-dropdown')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  if (loading) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#fef7f0', display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
          flex: 1,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid #fed7aa',
              borderTop: '4px solid #f97316',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px auto'
            }} />
            <div style={{ fontSize: '18px', color: '#6b7280', fontWeight: '600' }}>Loading table management...</div>
            <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '8px' }}>Setting up your restaurant layout</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        height: '100vh', 
        background: 'linear-gradient(135deg, rgb(255 246 241) 0%, rgb(254 245 242) 50%, rgb(255 244 243) 100%)',
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)
          `,
          zIndex: 0
        }} />
        
        <div style={{ 
          flex: 1,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ 
            textAlign: 'center', 
            maxWidth: '500px', 
            padding: '40px 20px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '24px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              backgroundColor: '#fef2f2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              animation: 'bounce 2s infinite'
            }}>
              <FaChair size={40} style={{ color: '#ef4444' }} />
            </div>
            
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Table Management Ready! 🪑
            </h1>
            
            <p style={{ 
              fontSize: '18px', 
              color: '#374151', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Organize Your Restaurant Layout
            </p>
            <p style={{ 
              fontSize: '16px', 
              color: '#6b7280', 
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              Set up floors and tables to manage your restaurant seating efficiently. Create different sections and track table availability in real-time.
            </p>
            
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                  transform: 'translateY(0)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(239, 68, 68, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.3)';
                }}
              >
                Set Up Restaurant First
              </button>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', backgroundColor: '#fef7f0', overflow: 'hidden' }}>
            
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        {/* Mobile Top Bar */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }} className="block md:hidden">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              backgroundColor: '#e53e3e', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(229, 62, 62, 0.3)'
            }}>
              <FaChair color="white" size={16} />
            </div>
            <div>
              <h1 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Tables</h1>
              <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>{selectedRestaurant?.name}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              style={{
                padding: '8px 10px',
                backgroundColor: showMobileFilters ? '#e53e3e' : '#f3f4f6',
                color: showMobileFilters ? 'white' : '#374151',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FaChevronDown size={10} />
              Floors
            </button>
            
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '8px 10px',
                backgroundColor: '#e53e3e',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <FaPlus size={10} />
              Add
            </button>
          </div>
        </div>
        
        {/* Mobile Floors Filter Modal */}
        {isMobile && showMobileFilters && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'flex-end'
          }}>
            <div style={{
              backgroundColor: 'white',
              width: '100%',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px',
              maxHeight: '60vh',
              overflowY: 'auto',
              padding: '20px',
              transform: showMobileFilters ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Select Floor</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  style={{
                    padding: '6px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  <FaTimes size={16} color="#6b7280" />
                </button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {floors.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => {
                      scrollToFloor(floor.id);
                      setShowMobileFilters(false);
                    }}
                    style={{
                      padding: '12px 16px',
                      backgroundColor: '#fef7f0',
                      border: '1px solid #fed7aa',
                      borderRadius: '8px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FaHome size={14} color="#e53e3e" />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{floor.name}</span>
                    </div>
                    <div style={{
                      backgroundColor: '#e53e3e',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {(floor.tables || []).length}
                    </div>
                  </button>
                ))}
                
                <button
                  onClick={() => {
                    setShowAddFloor(true);
                    setShowMobileFilters(false);
                  }}
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#e53e3e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px'
                  }}
                >
                  <FaPlus size={12} />
                  Add New Floor
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px 20px', 
          borderBottom: '1px solid #f3e8ff', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
        }} className="hidden md:block">
          {/* Status Legend */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '16px', 
            flexWrap: 'wrap',
            marginBottom: '16px',
            padding: '12px 16px',
            backgroundColor: '#fef7f0',
            borderRadius: '12px',
            border: '1px solid #fed7aa'
          }}>
            {Object.entries({
              available: getTableStatusInfo('available'),
              occupied: getTableStatusInfo('occupied'),
              reserved: getTableStatusInfo('reserved'),
              cleaning: getTableStatusInfo('cleaning'),
              'out-of-service': getTableStatusInfo('out-of-service')
            }).map(([status, info]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '3px',
                  backgroundColor: info.bg,
                  border: `2px solid ${info.border}`
                }} />
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#374151' }}>
                  {info.label}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  backgroundColor: '#e53e3e', 
                  borderRadius: '10px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(229, 62, 62, 0.3)'
                }}>
                  <FaChair color="white" size={18} />
                </div>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 2px 0' }}>
                    Table Management
                  </h1>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '12px' }}>
                    {selectedRestaurant?.name} • Interactive table actions
                  </p>
                </div>
              </div>
              
              {/* Floor Navigation */}
              <div style={{ display: 'flex', backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '3px', gap: '2px' }}>
                {floors.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => scrollToFloor(floor.id)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '7px',
                      fontWeight: '600',
                      fontSize: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      backgroundColor: 'transparent',
                      color: '#6b7280',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e53e3e';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#6b7280';
                    }}
                  >
                    <FaHome size={10} />
                    {floor.name}
                    <span style={{
                      backgroundColor: '#e0e7ff',
                      color: '#3730a3',
                      padding: '1px 5px',
                      borderRadius: '6px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {(floor.tables || []).length}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => setShowAddFloor(true)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '7px',
                    fontWeight: '600',
                    fontSize: '11px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}
                >
                  <FaPlus size={8} />
                  Add Floor
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setShowAddModal(true)}
                style={{
                  background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                  color: 'white',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 6px rgba(229, 62, 62, 0.3)'
                }}
              >
                <FaPlus size={12} />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Status Legend */}
        <div style={{
          backgroundColor: 'white',
          padding: '12px 16px',
          borderBottom: '1px solid #e5e7eb',
          overflowX: 'auto'
        }} className="block md:hidden">
          <div style={{
            display: 'flex',
            gap: '12px',
            minWidth: 'max-content'
          }}>
            {Object.entries({
              available: getTableStatusInfo('available'),
              occupied: getTableStatusInfo('occupied'),
              reserved: getTableStatusInfo('reserved'),
              cleaning: getTableStatusInfo('cleaning'),
              'out-of-service': getTableStatusInfo('out-of-service')
            }).map(([status, info]) => (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: info.bg,
                  border: `1px solid ${info.border}`
                }} />
                <span style={{ fontSize: '10px', fontWeight: '600', color: '#374151', whiteSpace: 'nowrap' }}>
                  {info.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Floor Content */}
        <div 
          ref={scrollContainerRef}
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            backgroundColor: '#fef7f0',
            padding: isMobile ? '16px' : '20px'
          }}
        >
          {floors.map((floor) => (
            <div key={floor.id} id={`floor-${floor.id}`} style={{ marginBottom: '40px' }}>
              <div style={{ position: 'relative' }}>
                {/* Floor Label & Stats Row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: isMobile ? '20px' : '30px',
                  padding: isMobile ? '0 4px' : '0 20px'
                }}>
                  {/* Floor Label with Actions */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      backgroundColor: '#e53e3e',
                      color: 'white',
                      padding: isMobile ? '6px 12px' : '8px 16px',
                      borderRadius: isMobile ? '6px' : '8px',
                      fontSize: isMobile ? '12px' : '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 8px rgba(229, 62, 62, 0.3)'
                    }}>
                      {floor.name}
                    </div>
                    
                    {/* Floor Actions */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => startEditFloor(floor)}
                        style={{
                          padding: isMobile ? '4px 6px' : '6px 8px',
                          backgroundColor: '#f3f4f6',
                          border: 'none',
                          borderRadius: isMobile ? '4px' : '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e5e7eb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#f3f4f6';
                        }}
                      >
                        <FaEdit size={isMobile ? 10 : 12} color="#6b7280" />
                      </button>
                      
                      <button
                        onClick={() => deleteFloor(floor.id)}
                        style={{
                          padding: isMobile ? '4px 6px' : '6px 8px',
                          backgroundColor: '#fef2f2',
                          border: 'none',
                          borderRadius: isMobile ? '4px' : '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#fee2e2';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#fef2f2';
                        }}
                      >
                        <FaTrash size={isMobile ? 10 : 12} color="#dc2626" />
                      </button>
                    </div>
                  </div>

                  {/* Compact Stats */}
                  <div style={{ 
                    display: 'flex', 
                    gap: isMobile ? '6px' : '8px',
                    backgroundColor: 'white',
                    padding: isMobile ? '6px 8px' : '8px 12px',
                    borderRadius: isMobile ? '6px' : '8px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                  }}>
                    <div style={{ 
                      textAlign: 'center',
                      minWidth: isMobile ? '24px' : '32px'
                    }}>
                      <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: '#1f2937' }}>
                        {(floor.tables || []).length}
                      </div>
                      <div style={{ fontSize: isMobile ? '8px' : '9px', color: '#6b7280', fontWeight: '500' }}>
                        Total
                      </div>
                    </div>
                    <div style={{ width: '1px', backgroundColor: '#e5e7eb' }} />
                    <div style={{ 
                      textAlign: 'center',
                      minWidth: isMobile ? '24px' : '32px'
                    }}>
                      <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: '#10b981' }}>
                        {(floor.tables || []).filter(t => t.status === 'available').length}
                      </div>
                      <div style={{ fontSize: isMobile ? '8px' : '9px', color: '#6b7280', fontWeight: '500' }}>
                        Free
                      </div>
                    </div>
                    <div style={{ width: '1px', backgroundColor: '#e5e7eb' }} />
                    <div style={{ 
                      textAlign: 'center',
                      minWidth: isMobile ? '24px' : '32px'
                    }}>
                      <div style={{ fontSize: isMobile ? '14px' : '16px', fontWeight: 'bold', color: '#ef4444' }}>
                        {(floor.tables || []).filter(t => t.status === 'occupied').length}
                      </div>
                      <div style={{ fontSize: isMobile ? '8px' : '9px', color: '#6b7280', fontWeight: '500' }}>
                        Busy
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tables Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile 
                    ? 'repeat(auto-fill, minmax(120px, 1fr))' 
                    : 'repeat(auto-fill, minmax(110px, 1fr))',
                  gap: isMobile ? '20px' : '16px',
                  maxWidth: isMobile ? '100%' : 'calc(100% - 160px)',
                  margin: '0 auto',
                  justifyContent: 'center',
                  justifyItems: 'center',
                  padding: isMobile ? '0 4px' : '0'
                }}>
                  {(floor.tables || []).map((table) => {
                    const statusInfo = getTableStatusInfo(table.status);
                    const isDropdownOpen = activeDropdown === table.id;
                    
                    return (
                      <div key={table.id} style={{ position: 'relative' }} className="table-dropdown">
                        {/* Table Card */}
                        <div
                          onClick={() => setActiveDropdown(isDropdownOpen ? null : table.id)}
                          style={{
                            width: isMobile ? '100px' : '90px',
                            height: isMobile ? '100px' : '90px',
                            backgroundColor: statusInfo.bg,
                            borderRadius: isMobile ? '16px' : '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            border: `2px dashed ${statusInfo.border}`,
                            boxShadow: isMobile ? '0 4px 12px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.08)',
                            animation: statusInfo.pulse ? 'pulse 2s infinite' : 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                          }}
                        >
                          {/* Table Number */}
                          <div style={{ 
                            fontSize: isMobile ? '24px' : '22px', 
                            fontWeight: 'bold', 
                            color: statusInfo.text
                          }}>
                            {table.name}
                          </div>

                          {/* Enhanced Dropdown indicator */}
                          <div style={{
                            position: 'absolute',
                            bottom: isMobile ? '3px' : '2px',
                            right: isMobile ? '3px' : '2px',
                            width: isMobile ? '24px' : '20px',
                            height: isMobile ? '24px' : '20px',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            borderRadius: isMobile ? '8px' : '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            border: '1px solid rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease'
                          }}>
                            <div style={{
                              width: '8px',
                              height: '2px',
                              backgroundColor: '#4b5563',
                              borderRadius: '1px',
                              position: 'relative'
                            }}>
                              <div style={{
                                position: 'absolute',
                                top: '-3px',
                                left: '0',
                                width: '8px',
                                height: '2px',
                                backgroundColor: '#4b5563',
                                borderRadius: '1px'
                              }} />
                              <div style={{
                                position: 'absolute',
                                top: '3px',
                                left: '0',
                                width: '8px',
                                height: '2px',
                                backgroundColor: '#4b5563',
                                borderRadius: '1px'
                              }} />
                            </div>
                          </div>
                        </div>

                        {/* Table Info */}
                        <div style={{ 
                          marginTop: isMobile ? '8px' : '6px',
                          fontSize: isMobile ? '11px' : '9px',
                          color: '#6b7280',
                          textAlign: 'center',
                          lineHeight: '1.2'
                        }}>
                          <div>{table.capacity} seats</div>
                          {table.customerName && (
                            <div style={{ color: '#ef4444', fontWeight: '600', marginTop: '2px' }}>
                              {table.customerName.length > 10 ? table.customerName.substring(0, 10) + '...' : table.customerName}
                            </div>
                          )}
                        </div>

                        {/* Action Dropdown */}
                        {isDropdownOpen && (
                          <div style={{
                            position: 'absolute',
                            top: isMobile ? '90px' : '80px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'white',
                            borderRadius: isMobile ? '12px' : '8px',
                            boxShadow: isMobile ? '0 12px 32px rgba(0,0,0,0.2)' : '0 8px 25px rgba(0,0,0,0.15)',
                            border: '1px solid #e5e7eb',
                            zIndex: 20,
                            minWidth: isMobile ? '160px' : '140px',
                            overflow: 'hidden'
                          }}>
                            {table.status === 'available' && (
                              <>
                                <button
                                  onClick={() => handleTableAction('take-order', table)}
                                  style={{
                                    width: '100%',
                                    padding: isMobile ? '14px 16px' : '10px 12px',
                                    border: 'none',
                                    backgroundColor: 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '14px' : '12px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: isMobile ? '10px' : '8px',
                                    color: '#059669'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f0fdf4'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                >
                                  <FaUtensils size={isMobile ? 14 : 12} />
                                  Take Order
                                </button>
                                <button
                                  onClick={() => handleTableAction('book-table', table)}
                                  style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: 'none',
                                    backgroundColor: 'white',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#d97706'
                                  }}
                                  onMouseEnter={(e) => e.target.style.backgroundColor = '#fefbf0'}
                                  onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                                >
                                  <FaCalendarAlt size={isMobile ? 14 : 12} />
                                  Book Table
                                </button>
                              </>
                            )}
                            
                            <button
                              onClick={() => handleTableAction('out-of-service', table)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: 'none',
                                backgroundColor: 'white',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#7c3aed'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f3ff'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                              <FaTools size={isMobile ? 14 : 12} />
                              Out of Service
                            </button>
                            
                            <button
                              onClick={() => handleTableAction('cleaning', table)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: 'none',
                                backgroundColor: 'white',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#4b5563'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                              <FaUtensils size={12} />
                              Cleaning
                            </button>
                            
                            {table.status !== 'available' && (
                              <button
                                onClick={() => handleTableAction('make-available', table)}
                                style={{
                                  width: '100%',
                                  padding: '10px 12px',
                                  border: 'none',
                                  backgroundColor: 'white',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px',
                                  color: '#059669'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0fdf4'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                              >
                                <FaCheck size={isMobile ? 14 : 12} />
                                Make Available
                              </button>
                            )}
                            
                            <hr style={{ margin: '4px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                            
                            <button
                              onClick={() => deleteTable(table.id)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                border: 'none',
                                backgroundColor: 'white',
                                textAlign: 'left',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#dc2626'
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = '#fef2f2'}
                              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                            >
                              <FaTrash size={isMobile ? 14 : 12} />
                              Delete Table
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unified Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: isMobile ? 'flex-end' : 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: isMobile ? '0' : '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: isMobile ? '16px 16px 0 0' : '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: isMobile ? '100%' : '500px',
            maxHeight: isMobile ? '80vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Add Table or Floor</h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '4px 0 0 0' }}>Choose what you want to add</p>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Floor Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Select Floor *
                </label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={selectedFloorForTable || ''}
                    onChange={(e) => setSelectedFloorForTable(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select a floor</option>
                    {floors.map(floor => (
                      <option key={floor.id} value={floor.id}>{floor.name}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => setShowNewFloorForm(true)}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: '#f3f4f6',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e5e7eb';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                    }}
                  >
                    <FaPlus size={14} color="#6b7280" />
                  </button>
                </div>
              </div>

              {/* New Floor Form */}
              {showNewFloorForm && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', margin: 0 }}>Add New Floor</h3>
                    <button
                      onClick={() => setShowNewFloorForm(false)}
                      style={{
                        padding: '4px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        borderRadius: '4px'
                      }}
                    >
                      <FaTimes size={12} color="#6b7280" />
                    </button>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                      type="text"
                      value={newFloor.name}
                      onChange={(e) => setNewFloor({...newFloor, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Floor name (e.g., Ground Floor, Terrace)"
                    />
                    
                    <input
                      type="text"
                      value={newFloor.description}
                      onChange={(e) => setNewFloor({...newFloor, description: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: 'white',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Description (optional)"
                    />
                    
                    <button
                      onClick={async () => {
                        await addFloor();
                        setShowNewFloorForm(false);
                      }}
                      disabled={!newFloor.name.trim()}
                      style={{
                        padding: '8px 12px',
                        background: newFloor.name.trim() 
                          ? 'linear-gradient(135deg, #e53e3e, #dc2626)'
                          : 'linear-gradient(135deg, #d1d5db, #9ca3af)',
                        color: 'white',
                        borderRadius: '6px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: newFloor.name.trim() ? 'pointer' : 'not-allowed',
                        fontSize: '12px'
                      }}
                    >
                      Create Floor
                    </button>
                  </div>
                </div>
              )}

              {/* Table Details */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Table Name *
                  </label>
                  <input
                    type="text"
                    value={newTable.name}
                    onChange={(e) => setNewTable({...newTable, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., T1, V1"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newTable.capacity}
                    onChange={(e) => setNewTable({...newTable, capacity: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Table Type
                </label>
                <select
                  value={newTable.type}
                  onChange={(e) => setNewTable({...newTable, type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="small">Small (1-2 seats)</option>
                  <option value="regular">Regular (3-4 seats)</option>
                  <option value="large">Large (5-8 seats)</option>
                  <option value="vip">VIP</option>
                  <option value="private">Private Room</option>
                </select>
              </div>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#fef7f0', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedFloorForTable(null);
                  setNewTable({ name: '', capacity: 4, type: 'regular', floorId: null });
                  setNewFloor({ name: '', description: '' });
                  setShowNewFloorForm(false);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await addTable();
                  setShowAddModal(false);
                }}
                disabled={!newTable.name.trim() || !selectedFloorForTable}
                style={{
                  flex: 1,
                  background: (newTable.name.trim() && selectedFloorForTable)
                    ? 'linear-gradient(135deg, #e53e3e, #dc2626)'
                    : 'linear-gradient(135deg, #d1d5db, #9ca3af)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: (newTable.name.trim() && selectedFloorForTable) ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Floor Modal */}
      {showAddFloor && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: isMobile ? 'flex-end' : 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: isMobile ? '0' : '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: isMobile ? '16px 16px 0 0' : '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: isMobile ? '100%' : '400px',
            maxHeight: isMobile ? '80vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Add New Floor</h2>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Floor Name *
                </label>
                <input
                  type="text"
                  value={newFloor.name}
                  onChange={(e) => setNewFloor({...newFloor, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., Ground Floor, Terrace"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Description
                </label>
                <input
                  type="text"
                  value={newFloor.description}
                  onChange={(e) => setNewFloor({...newFloor, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., Main dining area"
                />
              </div>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#fef7f0', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowAddFloor(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={addFloor}
                disabled={!newFloor.name.trim()}
                style={{
                  flex: 1,
                  background: newFloor.name.trim() 
                    ? 'linear-gradient(135deg, #e53e3e, #dc2626)'
                    : 'linear-gradient(135deg, #d1d5db, #9ca3af)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: newFloor.name.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                Add Floor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Floor Modal */}
      {showEditFloor && editingFloor && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: isMobile ? 'flex-end' : 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: isMobile ? '0' : '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: isMobile ? '16px 16px 0 0' : '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: isMobile ? '100%' : '400px',
            maxHeight: isMobile ? '80vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Edit Floor</h2>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Floor Name *
                </label>
                <input
                  type="text"
                  value={newFloor.name}
                  onChange={(e) => setNewFloor({...newFloor, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., Ground Floor, Terrace"
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Description
                </label>
                <input
                  type="text"
                  value={newFloor.description}
                  onChange={(e) => setNewFloor({...newFloor, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., Main dining area"
                />
              </div>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#fef7f0', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowEditFloor(false);
                  setEditingFloor(null);
                  setNewFloor({ name: '', description: '' });
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={editFloor}
                disabled={!newFloor.name.trim()}
                style={{
                  flex: 1,
                  background: newFloor.name.trim() 
                    ? 'linear-gradient(135deg, #e53e3e, #dc2626)'
                    : 'linear-gradient(135deg, #d1d5db, #9ca3af)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: newFloor.name.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                Update Floor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Table Modal */}
      {showAddTable && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: isMobile ? 'flex-end' : 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: isMobile ? '0' : '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: isMobile ? '16px 16px 0 0' : '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: isMobile ? '100%' : '400px',
            maxHeight: isMobile ? '80vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Add New Table</h2>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Select Floor *
                </label>
                <select
                  value={selectedFloorForTable || ''}
                  onChange={(e) => setSelectedFloorForTable(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select a floor</option>
                  {floors.map(floor => (
                    <option key={floor.id} value={floor.id}>{floor.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Table Name *
                  </label>
                  <input
                    type="text"
                    value={newTable.name}
                    onChange={(e) => setNewTable({...newTable, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      boxSizing: 'border-box'
                    }}
                    placeholder="e.g., T1, V1"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={newTable.capacity}
                    onChange={(e) => setNewTable({...newTable, capacity: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Table Type
                </label>
                <select
                  value={newTable.type}
                  onChange={(e) => setNewTable({...newTable, type: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="small">Small (1-2 seats)</option>
                  <option value="regular">Regular (3-4 seats)</option>
                  <option value="large">Large (5-8 seats)</option>
                  <option value="vip">VIP</option>
                  <option value="private">Private Room</option>
                </select>
              </div>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#fef7f0', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowAddTable(false);
                  setSelectedFloorForTable(null);
                  setNewTable({ name: '', capacity: 4, type: 'regular', floorId: null });
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={addTable}
                disabled={!newTable.name.trim() || !selectedFloorForTable}
                style={{
                  flex: 1,
                  background: (newTable.name.trim() && selectedFloorForTable)
                    ? 'linear-gradient(135deg, #e53e3e, #dc2626)'
                    : 'linear-gradient(135deg, #d1d5db, #9ca3af)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: (newTable.name.trim() && selectedFloorForTable) ? 'pointer' : 'not-allowed',
                  fontSize: '14px'
                }}
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && selectedTable && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: isMobile ? 'flex-end' : 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: isMobile ? '0' : '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: isMobile ? '16px 16px 0 0' : '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: isMobile ? '100%' : '500px',
            maxHeight: isMobile ? '80vh' : 'auto',
            overflowY: isMobile ? 'auto' : 'visible'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                Book Table {selectedTable.name}
              </h2>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Capacity: {selectedTable.capacity} people
              </p>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={bookingData.customerName}
                    onChange={(e) => setBookingData({...bookingData, customerName: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter customer name"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={bookingData.customerPhone}
                    onChange={(e) => setBookingData({...bookingData, customerPhone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      boxSizing: 'border-box'
                    }}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Party Size *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTable.capacity}
                    value={bookingData.partySize}
                    onChange={(e) => setBookingData({...bookingData, partySize: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Date *
                  </label>
                  <input
                    type="date"
                    value={bookingData.bookingDate}
                    onChange={(e) => setBookingData({...bookingData, bookingDate: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Time *
                  </label>
                  <input
                    type="time"
                    value={bookingData.bookingTime}
                    onChange={(e) => setBookingData({...bookingData, bookingTime: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Special Notes
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    boxSizing: 'border-box',
                    minHeight: '60px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Any special requirements or notes..."
                />
              </div>
            </div>
            
            <div style={{ padding: '20px', backgroundColor: '#fef7f0', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setShowBookingForm(false);
                  setSelectedTable(null);
                  setBookingData({
                    customerName: '',
                    customerPhone: '',
                    partySize: 2,
                    bookingDate: '',
                    bookingTime: '',
                    notes: ''
                  });
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={createBooking}
                disabled={!bookingData.customerName.trim() || !bookingData.bookingDate || !bookingData.bookingTime}
                style={{
                  flex: 2,
                  background: (bookingData.customerName.trim() && bookingData.bookingDate && bookingData.bookingTime)
                    ? 'linear-gradient(135deg, #d97706, #b45309)'
                    : 'linear-gradient(135deg, #d1d5db, #9ca3af)',
                  color: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: (bookingData.customerName.trim() && bookingData.bookingDate && bookingData.bookingTime) ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FaCalendarAlt size={14} />
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 4px 16px rgba(234, 179, 8, 0.4);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TableManagement;