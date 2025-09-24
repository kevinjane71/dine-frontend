'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
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
  FaHome
} from 'react-icons/fa';

const TableManagement = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('dine_cart');
    localStorage.removeItem('dine_saved_order');
    router.push('/login');
  };

  const [floors, setFloors] = useState([]);
  const [showAddTable, setShowAddTable] = useState(false);
  const [showAddFloor, setShowAddFloor] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const scrollContainerRef = useRef(null);

  // Form states
  const [newFloor, setNewFloor] = useState({ name: '', description: '' });
  const [newTable, setNewTable] = useState({
    name: '',
    capacity: 4,
    type: 'regular'
  });

  // Fix hydration by using useEffect for client-side only code
  useEffect(() => {
    setIsClient(true);
    
    // Use static IDs to prevent hydration issues
    const defaultFloors = [
      {
        id: 1,
        name: 'Ground Floor',
        description: 'Main dining area',
        tables: [
          { id: 1, name: '1', capacity: 4, status: 'available', type: 'regular' },
          { id: 2, name: '2', capacity: 2, status: 'occupied', type: 'small', customerName: 'John Doe', startTime: '19:30' },
          { id: 3, name: '3', capacity: 6, status: 'reserved', type: 'large', customerName: 'Smith Family', reservationTime: '20:00' },
          { id: 4, name: '4', capacity: 4, status: 'cleaning', type: 'regular' },
          { id: 5, name: '5', capacity: 8, status: 'available', type: 'large' },
          { id: 6, name: '6', capacity: 4, status: 'available', type: 'regular' },
          { id: 7, name: '7', capacity: 2, status: 'available', type: 'small' },
          { id: 8, name: '8', capacity: 4, status: 'available', type: 'regular' },
          { id: 9, name: '9', capacity: 6, status: 'available', type: 'large' },
          { id: 10, name: '10', capacity: 4, status: 'available', type: 'regular' },
        ]
      },
      {
        id: 2,
        name: 'First Floor',
        description: 'Premium dining & private rooms',
        tables: [
          { id: 11, name: 'V1', capacity: 6, status: 'occupied', type: 'vip', customerName: 'Patel Family', startTime: '19:15' },
          { id: 12, name: 'V2', capacity: 8, status: 'reserved', type: 'vip', customerName: 'Corporate Event', reservationTime: '21:00' },
          { id: 13, name: 'P1', capacity: 10, status: 'available', type: 'private' },
          { id: 14, name: '11', capacity: 4, status: 'available', type: 'regular' },
          { id: 15, name: '12', capacity: 4, status: 'available', type: 'regular' },
          { id: 16, name: '13', capacity: 2, status: 'available', type: 'small' },
          { id: 17, name: '14', capacity: 6, status: 'available', type: 'large' },
          { id: 18, name: '15', capacity: 4, status: 'available', type: 'regular' },
          { id: 19, name: '16', capacity: 4, status: 'available', type: 'regular' },
          { id: 20, name: '17', capacity: 8, status: 'available', type: 'large' },
        ]
      },
      {
        id: 3,
        name: 'Second Floor',
        description: 'Rooftop & Events',
        tables: [
          { id: 21, name: '18', capacity: 4, status: 'available', type: 'regular' },
          { id: 22, name: '19', capacity: 4, status: 'available', type: 'regular' },
          { id: 23, name: '20', capacity: 6, status: 'available', type: 'large' },
          { id: 24, name: '21', capacity: 8, status: 'available', type: 'large' },
          { id: 25, name: '22', capacity: 20, status: 'available', type: 'private' },
        ]
      }
    ];
    setFloors(defaultFloors);
  }, []);

  const getTableStatusInfo = (status) => {
    const statusMap = {
      available: { 
        bg: '#a7f3d0', 
        text: '#065f46', 
        label: 'Available',
        icon: FaCheck,
        border: '#059669'
      },
      occupied: { 
        bg: '#fecaca', 
        text: '#991b1b', 
        label: 'Occupied',
        icon: FaUsers,
        border: '#dc2626'
      },
      reserved: { 
        bg: '#fed7aa', 
        text: '#9a3412', 
        label: 'Reserved',
        icon: FaClock,
        border: '#d97706'
      },
      cleaning: { 
        bg: '#d1d5db', 
        text: '#374151', 
        label: 'Cleaning',
        icon: FaUtensils,
        border: '#4b5563'
      },
      'out-of-service': { 
        bg: '#ddd6fe', 
        text: '#5b21b6', 
        label: 'Out of Service',
        icon: FaBan,
        border: '#7c3aed'
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

  const addFloor = () => {
    if (!newFloor.name.trim()) return;
    
    const newId = floors.length > 0 ? Math.max(...floors.map(f => f.id)) + 1 : 1;
    const floor = {
      id: newId,
      name: newFloor.name,
      description: newFloor.description,
      tables: []
    };
    
    setFloors([...floors, floor]);
    setNewFloor({ name: '', description: '' });
    setShowAddFloor(false);
  };

  const addTable = (floorId) => {
    if (!newTable.name.trim()) return;
    
    const allTables = floors.flatMap(f => f.tables);
    const newId = allTables.length > 0 ? Math.max(...allTables.map(t => t.id)) + 1 : 1;
    
    const table = {
      id: newId,
      name: newTable.name,
      capacity: parseInt(newTable.capacity),
      status: 'available',
      type: newTable.type
    };
    
    const updatedFloors = floors.map(floor => {
      if (floor.id === floorId) {
        return { ...floor, tables: [...floor.tables, table] };
      }
      return floor;
    });
    
    setFloors(updatedFloors);
    setNewTable({
      name: `T${updatedFloors.find(f => f.id === floorId).tables.length + 1}`,
      capacity: 4,
      type: 'regular'
    });
    setShowAddTable(false);
  };

  const updateTableStatus = (tableId, newStatus) => {
    const updatedFloors = floors.map(floor => ({
      ...floor,
      tables: floor.tables.map(table => {
        if (table.id === tableId) {
          const updatedTable = { ...table, status: newStatus };
          if (newStatus === 'available') {
            updatedTable.customerName = null;
            updatedTable.startTime = null;
            updatedTable.reservationTime = null;
          }
          return updatedTable;
        }
        return table;
      })
    }));
    setFloors(updatedFloors);
  };

  const deleteTable = (tableId) => {
    if (confirm('Are you sure you want to delete this table?')) {
      const updatedFloors = floors.map(floor => ({
        ...floor,
        tables: floor.tables.filter(t => t.id !== tableId)
      }));
      setFloors(updatedFloors);
    }
  };

  const handleTableClick = (table) => {
    if (editMode) {
      setSelectedTable(table);
    } else if (table.status === 'available') {
      const floor = floors.find(f => f.tables.some(t => t.id === table.id));
      const params = new URLSearchParams({
        table: table.name,
        capacity: table.capacity.toString(),
        floor: floor.name
      });
      window.location.href = `/?${params.toString()}`;
    }
  };

  const scrollToFloor = (floorId) => {
    const element = document.getElementById(`floor-${floorId}`);
    if (element && scrollContainerRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return (
      <div style={{ height: '100vh', backgroundColor: '#fef7f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6b7280', fontSize: '16px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', backgroundColor: '#fef7f0', overflow: 'hidden' }}>
      <Header handleLogout={handleLogout} />
      
      <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '12px 20px', 
          borderBottom: '1px solid #f3e8ff', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
        }}>
          {/* Color Coding Legend at Top */}
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
                    Cinema seat style • Quick selection
                  </p>
                </div>
              </div>
              
              {/* Floor Navigation Tabs */}
              <div style={{ display: 'flex', backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '3px', gap: '2px' }}>
                {floors.map((floor, index) => (
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
                      {floor.tables.length}
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
                  Add
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: editMode ? '#f59e0b' : '#f3f4f6',
                  color: editMode ? 'white' : '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <FaCog size={12} />
                {editMode ? 'Exit Edit' : 'Edit'}
              </button>
              
              <button
                onClick={() => setShowAddTable(true)}
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
                Add Table
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Floor Content */}
        <div 
          ref={scrollContainerRef}
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            backgroundColor: '#fef7f0',
            padding: '20px'
          }}
        >
          {floors.map((floor) => (
            <div key={floor.id} id={`floor-${floor.id}`} style={{ marginBottom: '40px' }}>
              {/* Floor Section */}
              <div style={{ position: 'relative' }}>
                {/* Floor Label on Right - Horizontal */}
                <div style={{
                  position: 'absolute',
                  right: '20px',
                  top: '20px',
                  backgroundColor: '#e53e3e',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(229, 62, 62, 0.3)',
                  whiteSpace: 'nowrap'
                }}>
                  {floor.name}
                </div>

                {/* Tables Grid - Compact Colored Cards */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                  gap: '8px',
                  maxWidth: 'calc(100% - 160px)', // Leave space for floor label
                  margin: '0 auto',
                  justifyContent: 'center',
                  justifyItems: 'center'
                }}>
                  {floor.tables.map((table) => {
                    const statusInfo = getTableStatusInfo(table.status);
                    const isClickable = !editMode && table.status === 'available';
                    
                    return (
                      <div key={table.id} style={{ position: 'relative' }}>
                        {/* Table Card - Full Background Color */}
                        <div
                          onClick={() => handleTableClick(table)}
                          style={{
                            width: '60px',
                            height: '60px',
                            backgroundColor: statusInfo.bg,
                            borderRadius: '8px',
                            cursor: isClickable ? 'pointer' : editMode ? 'pointer' : 'default',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            boxShadow: table.status === 'available' 
                              ? '0 2px 6px rgba(167, 243, 208, 0.5)'
                              : '0 2px 4px rgba(0,0,0,0.1)',
                            border: `2px solid ${statusInfo.border}`
                          }}
                          onMouseEnter={(e) => {
                            if (isClickable) {
                              e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                              e.currentTarget.style.boxShadow = '0 4px 12px rgba(167, 243, 208, 0.6)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (isClickable) {
                              e.currentTarget.style.transform = 'translateY(0) scale(1)';
                              e.currentTarget.style.boxShadow = '0 2px 6px rgba(167, 243, 208, 0.5)';
                            }
                          }}
                        >
                          {/* Edit Controls */}
                          {editMode && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTable(table.id);
                              }}
                              style={{
                                position: 'absolute',
                                top: '2px',
                                right: '2px',
                                width: '16px',
                                height: '16px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '8px'
                              }}
                            >
                              <FaTrash size={6} />
                            </button>
                          )}

                          {/* Table Number - Large and Centered */}
                          <div style={{ 
                            fontSize: '18px', 
                            fontWeight: 'bold', 
                            color: statusInfo.text,
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                          }}>
                            {table.name}
                          </div>

                          {/* Quick Action for Non-Available Tables */}
                          {!editMode && table.status !== 'available' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateTableStatus(table.id, 'available');
                              }}
                              style={{
                                position: 'absolute',
                                bottom: '2px',
                                right: '2px',
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                color: '#10b981',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <FaCheck size={4} />
                            </button>
                          )}
                        </div>

                        {/* Info Below Card - Small Text */}
                        <div style={{ 
                          marginTop: '4px',
                          fontSize: '8px',
                          color: '#6b7280',
                          textAlign: 'center',
                          lineHeight: '1.2'
                        }}>
                          <div>{table.capacity} seats • {getTableTypeInfo(table.type).seats}</div>
                          {table.customerName && (
                            <div style={{ color: '#ef4444', fontWeight: '600' }}>
                              {table.customerName.length > 8 ? table.customerName.substring(0, 8) + '...' : table.customerName}
                            </div>
                          )}
                          {table.startTime && <div>Since {table.startTime}</div>}
                          {table.reservationTime && <div>@ {table.reservationTime}</div>}
                        </div>
                      </div>
                    );
                  })}

                  {/* Add Table Button for Each Floor */}
                  {editMode && (
                    <div style={{ position: 'relative' }}>
                      <div
                        onClick={() => setShowAddTable(true)}
                        style={{
                          width: '60px',
                          height: '60px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          border: '2px dashed #cbd5e1',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#6b7280'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#e53e3e';
                          e.currentTarget.style.color = '#e53e3e';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#cbd5e1';
                          e.currentTarget.style.color = '#6b7280';
                        }}
                      >
                        <FaPlus size={12} />
                        <span style={{ fontSize: '7px', fontWeight: '600', marginTop: '2px' }}>ADD</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Floor Statistics */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '12px', 
                  flexWrap: 'wrap',
                  marginTop: '20px',
                  padding: '10px 16px',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                  maxWidth: 'calc(100% - 160px)',
                  margin: '20px auto 0'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                      {floor.tables.length}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                      Total Tables
                    </div>
                  </div>
                  <div style={{ width: '1px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                      {floor.tables.filter(t => t.status === 'available').length}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                      Available
                    </div>
                  </div>
                  <div style={{ width: '1px', backgroundColor: '#e5e7eb', margin: '0 4px' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ef4444' }}>
                      {floor.tables.filter(t => t.status === 'occupied').length}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                      Occupied
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Floor Modal */}
      {showAddFloor && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Add New Floor</h2>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                  Floor Name
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
                    backgroundColor: '#fef7f0'
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
                    backgroundColor: '#fef7f0'
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
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Add Floor
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
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Add New Table</h2>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Table Name
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
                      backgroundColor: '#fef7f0'
                    }}
                    placeholder="e.g., T1, V1"
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                    Capacity
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
                      backgroundColor: '#fef7f0'
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
                    backgroundColor: '#fef7f0'
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
                onClick={() => setShowAddTable(false)}
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
                onClick={() => addTable(floors[0]?.id)}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                  color: 'white',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement;