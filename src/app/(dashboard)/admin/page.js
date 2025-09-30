'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../lib/api';
import { 
  FaStore, 
  FaUsers, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEye, 
  FaEyeSlash,
  FaSearch,
  FaUserCheck,
  FaUserTimes,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaShieldAlt,
  FaCrown,
  FaUserShield,
  FaUtensils,
  FaTabs,
  FaArrowRight,
  FaKey,
  FaIdBadge,
  FaCopy,
  FaUserCog
} from 'react-icons/fa';

const Admin = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('restaurants');
  const [restaurants, setRestaurants] = useState([]);
  const [staff, setStaff] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAddRestaurantModal, setShowAddRestaurantModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    cuisine: '',
    description: ''
  });
  const [newStaff, setNewStaff] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    role: 'employee',
    startDate: new Date().toISOString().split('T')[0]
  });
  const [showPassword, setShowPassword] = useState({});
  const [customRoles, setCustomRoles] = useState(['employee', 'manager', 'admin']);
  const [newCustomRole, setNewCustomRole] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState('owner');
  const [copiedCredentials, setCopiedCredentials] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Client-side hydration and mobile detection
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check authorization
  useEffect(() => {
    const checkAuth = () => {
      try {
        console.log('Admin page: Checking authorization...');
        const userData = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');
        
        console.log('Admin page: User data exists:', !!userData);
        console.log('Admin page: Auth token exists:', !!authToken);
        
        if (!userData || !authToken) {
          console.log('Admin page: No user data or token, redirecting to login');
          router.push('/login');
          return;
        }

        const user = JSON.parse(userData);
        console.log('Admin page: User role:', user.role);
        
        setCurrentUserRole(user.role || 'owner');
        
        // Allow owners and admin roles to access admin page
        if (user.role && !['owner', 'admin'].includes(user.role)) {
          console.log('Admin page: User does not have admin access, redirecting to home');
          router.push('/');
          return;
        }

        console.log('Admin page: Authorization successful');
        setAuthorized(true);
      } catch (error) {
        console.error('Admin page: Auth check error:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Fetch restaurants data from API
  useEffect(() => {
    const fetchRestaurants = async () => {
      if (!authorized) return;
      
      try {
        setLoading(true);
        const response = await apiClient.getRestaurants();
        setRestaurants(response.restaurants || []);
        
        // Set the first restaurant as selected by default
        if (response.restaurants && response.restaurants.length > 0) {
          setSelectedRestaurant(response.restaurants[0]);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        // Don't redirect on API failure - just show empty state or allow user to add restaurants
        setRestaurants([]);
        setSelectedRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [authorized]);

  // Fetch staff data when restaurant is selected
  useEffect(() => {
    const fetchStaff = async () => {
      if (!authorized || !selectedRestaurant) return;
      
      try {
        setLoading(true);
        const response = await apiClient.getStaff(selectedRestaurant.id);
        setStaff(response.staff || []);
      } catch (error) {
        console.error('Error fetching staff:', error);
        // Don't redirect on API failure - just show empty state
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [authorized, selectedRestaurant]);

  // Fetch menu data when restaurant is selected and menu tab is active
  useEffect(() => {
    const fetchMenu = async () => {
      if (!authorized || !selectedRestaurant || activeTab !== 'menu') return;
      
      try {
        setLoading(true);
        const response = await apiClient.getMenu(selectedRestaurant.id);
        setMenuItems(response.menuItems || []);
      } catch (error) {
        console.error('Error fetching menu:', error);
        // Don't redirect on API failure - just show empty state
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [authorized, selectedRestaurant, activeTab]);

  const getRoleInfo = (role) => {
    const roleMap = {
      owner: {
        label: 'Owner',
        icon: FaCrown,
        color: '#dc2626',
        bg: '#fee2e2'
      },
      admin: {
        label: 'Admin',
        icon: FaUserShield,
        color: '#7c3aed',
        bg: '#e9d5ff'
      },
      manager: {
        label: 'Manager',
        icon: FaUserCog,
        color: '#059669',
        bg: '#d1fae5'
      },
      employee: {
        label: 'Employee',
        icon: FaUsers,
        color: '#3b82f6',
        bg: '#dbeafe'
      },
      waiter: {
        label: 'Waiter',
        icon: FaUtensils,
        color: '#f59e0b',
        bg: '#fef3c7'
      },
      cashier: {
        label: 'Cashier',
        icon: FaUserCheck,
        color: '#8b5cf6',
        bg: '#f3e8ff'
      },
      chef: {
        label: 'Chef',
        icon: FaUtensils,
        color: '#ef4444',
        bg: '#fecaca'
      },
      cook: {
        label: 'Cook',
        icon: FaUtensils,
        color: '#f97316',
        bg: '#fed7aa'
      },
      supervisor: {
        label: 'Supervisor',
        icon: FaUserShield,
        color: '#10b981',
        bg: '#dcfce7'
      }
    };
    
    // Handle custom roles or roles not in the predefined map
    return roleMap[role] || {
      label: role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Staff',
      icon: FaUsers,
      color: '#6b7280',
      bg: '#f3f4f6'
    };
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      active: {
        label: 'Active',
        color: '#10b981',
        bg: '#dcfce7',
        icon: FaUserCheck
      },
      inactive: {
        label: 'Inactive',
        color: '#6b7280',
        bg: '#f3f4f6',
        icon: FaUserTimes
      },
      suspended: {
        label: 'Suspended',
        color: '#ef4444',
        bg: '#fee2e2',
        icon: FaUserTimes
      }
    };
    return statusMap[status] || statusMap.active;
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const restaurantData = {
        ...newRestaurant,
        cuisine: newRestaurant.cuisine.split(',').map(c => c.trim()).filter(c => c)
      };
      
      const response = await apiClient.createRestaurant(restaurantData);
      
      // Add the new restaurant to the local state
      setRestaurants([...restaurants, response.restaurant]);
      
      setNewRestaurant({
        name: '',
        address: '',
        phone: '',
        email: '',
        cuisine: '',
        description: ''
      });
      setShowAddRestaurantModal(false);
      
      alert('Restaurant added successfully!');
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert(`Failed to add restaurant: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Generate unique credentials for new staff
  const generateCredentials = () => {
    // Generate unique user ID: RES001, RES002, etc.
    const existingIds = staff.map(member => member.loginId).filter(Boolean);
    let counter = 1;
    let userId;
    do {
      userId = `${selectedRestaurant?.name?.substring(0, 3).toUpperCase() || 'RES'}${counter.toString().padStart(3, '0')}`;
      counter++;
    } while (existingIds.includes(userId));
    
    // Generate random 6-character alphanumeric password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return { userId, password };
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!selectedRestaurant) {
      alert('Please select a restaurant first');
      return;
    }

    // Validate role permissions
    if (currentUserRole !== 'owner' && newStaff.role === 'admin') {
      alert('Only owners can create admin roles');
      return;
    }

    try {
      setLoading(true);
      
      // Generate unique credentials
      const credentials = generateCredentials();
      
      const staffData = {
        ...newStaff,
        loginId: credentials.userId,
        password: credentials.password,
        restaurantId: selectedRestaurant.id
      };
      
      const response = await apiClient.addStaff(selectedRestaurant.id, staffData);
      
      // Add the new staff member with credentials to local state
      const newStaffMember = {
        ...response.staff,
        loginId: credentials.userId,
        tempPassword: credentials.password // Store temporarily for display
      };
      setStaff([...staff, newStaffMember]);
      
      setNewStaff({
        name: '',
        phone: '',
        email: '',
        address: '',
        role: 'employee',
        startDate: new Date().toISOString().split('T')[0]
      });
      setShowAddStaffModal(false);
      
      alert(`Staff member added successfully!\n\nLogin Credentials:\nUser ID: ${credentials.userId}\nPassword: ${credentials.password}\n\nPlease save these credentials securely.`);
    } catch (error) {
      console.error('Error adding staff:', error);
      alert(`Failed to add staff member: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleStaffStatus = async (staffId) => {
    try {
      const member = staff.find(m => m.id === staffId);
      if (!member) return;
      
      const newStatus = member.status === 'active' ? 'inactive' : 'active';
      
      await apiClient.updateStaff(staffId, { status: newStatus });
      
      setStaff(staff.map(member => {
        if (member.id === staffId) {
          return { ...member, status: newStatus };
        }
        return member;
      }));
      
      alert(`Staff member ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      console.error('Error updating staff status:', error);
      alert(`Failed to update staff status: ${error.message}`);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.phone && restaurant.phone.includes(searchTerm))
  );

  const filteredStaff = staff.filter(member =>
    (member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.phone && member.phone.includes(searchTerm)) ||
    (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (member.role && member.role.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async (text, type, memberId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCredentials(prev => ({
        ...prev,
        [`${memberId}_${type}`]: true
      }));
      setTimeout(() => {
        setCopiedCredentials(prev => ({
          ...prev,
          [`${memberId}_${type}`]: false
        }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const togglePasswordVisibility = (memberId) => {
    setShowPassword(prev => ({
      ...prev,
      [memberId]: !prev[memberId]
    }));
  };

  // Menu management functions
  const toggleMenuItemAvailability = async (itemId, currentStatus) => {
    try {
      setLoading(true);
      const updatedData = { isAvailable: !currentStatus };
      await apiClient.updateMenuItem(itemId, updatedData);
      setMenuItems(items => items.map(item => 
        item.id === itemId ? { ...item, isAvailable: !currentStatus } : item
      ));
    } catch (error) {
      console.error('Error updating menu item availability:', error);
      alert(`Failed to update item availability: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteMenuItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      setLoading(true);
      await apiClient.deleteMenuItem(itemId);
      setMenuItems(items => items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      alert(`Failed to delete menu item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const canManageStaff = (targetRole) => {
    const roleHierarchy = {
      'owner': 4,
      'admin': 3,
      'manager': 2,
      'employee': 1
    };
    
    const currentLevel = roleHierarchy[currentUserRole] || 0;
    const targetLevel = roleHierarchy[targetRole] || 1;
    
    // Owners can manage everyone, admins can manage managers and below, etc.
    return currentLevel > targetLevel;
  };

  const getPerformanceStats = (member) => {
    // Different stats based on role
    switch (member.role) {
      case 'waiter':
        return {
          todayLabel: 'Orders Today',
          todayValue: member.ordersToday || 0,
          totalLabel: 'Total Orders',
          totalValue: member.totalOrders || 0
        };
      case 'manager':
        return {
          todayLabel: 'Staff Managed',
          todayValue: member.staffCount || 0,
          totalLabel: 'Total Revenue',
          totalValue: `₹${(member.totalRevenue || 0).toLocaleString()}`
        };
      case 'cashier':
        return {
          todayLabel: 'Transactions',
          todayValue: member.transactionsToday || 0,
          totalLabel: 'Total Sales',
          totalValue: `₹${(member.totalSales || 0).toLocaleString()}`
        };
      case 'chef':
      case 'cook':
        return {
          todayLabel: 'Dishes Made',
          todayValue: member.dishesToday || 0,
          totalLabel: 'Total Dishes',
          totalValue: member.totalDishes || 0
        };
      default:
        return {
          todayLabel: 'Tasks Today',
          todayValue: member.tasksToday || 0,
          totalLabel: 'Total Tasks',
          totalValue: member.totalTasks || 0
        };
    }
  };

  // Don't render anything until authorization is checked
  if (!authorized) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#fef7f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          textAlign: 'center',
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #fce7f3',
            borderTop: '4px solid #ec4899',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <p style={{ color: '#6b7280', margin: 0 }}>Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fef7f0' }}>
      
      <div style={{ padding: isClient && isMobile ? '16px' : '24px' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: isClient && isMobile ? '16px' : '24px', 
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: isClient && isMobile ? '16px' : '24px',
          border: '1px solid #fce7f3'
        }}>
          {isClient && isMobile ? (
            // Mobile Header Layout
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  background: 'linear-gradient(135deg, #ec4899, #db2777)', 
                  borderRadius: '12px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                }}>
                  <FaShieldAlt color="white" size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 2px 0' }}>
                    Admin Dashboard
                  </h1>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '12px' }}>
                    {restaurants.length} restaurants • {staff.length} staff
                  </p>
                </div>
              </div>
              
              {/* Mobile Tab Navigation */}
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setActiveTab('restaurants')}
                  style={{
                    flex: 1,
                    backgroundColor: activeTab === 'restaurants' ? '#ec4899' : 'transparent',
                    color: activeTab === 'restaurants' ? 'white' : '#6b7280',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '12px',
                    border: activeTab === 'restaurants' ? 'none' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <FaStore size={10} />
                  Restaurants
                </button>
                <button
                  onClick={() => setActiveTab('staff')}
                  style={{
                    flex: 1,
                    backgroundColor: activeTab === 'staff' ? '#ec4899' : 'transparent',
                    color: activeTab === 'staff' ? 'white' : '#6b7280',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '12px',
                    border: activeTab === 'staff' ? 'none' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <FaUsers size={10} />
                  Staff
                </button>
                <button
                  onClick={() => setActiveTab('menu')}
                  style={{
                    flex: 1,
                    backgroundColor: activeTab === 'menu' ? '#ec4899' : 'transparent',
                    color: activeTab === 'menu' ? 'white' : '#6b7280',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '12px',
                    border: activeTab === 'menu' ? 'none' : '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <FaUtensils size={10} />
                  Menu
                </button>
              </div>
            </div>
          ) : (
            // Desktop Header Layout
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  background: 'linear-gradient(135deg, #ec4899, #db2777)', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                }}>
                  <FaShieldAlt color="white" size={24} />
                </div>
                <div>
                  <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                    Admin Dashboard
                  </h1>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                    Manage restaurants and staff • {restaurants.length} restaurants • {staff.length} staff members
                  </p>
                </div>
              </div>
              
              {/* Desktop Tab Navigation */}
              <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('restaurants')}
                style={{
                  backgroundColor: activeTab === 'restaurants' ? '#ec4899' : 'transparent',
                  color: activeTab === 'restaurants' ? 'white' : '#6b7280',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: activeTab === 'restaurants' ? 'none' : '2px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaStore size={14} />
                Restaurants
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                style={{
                  backgroundColor: activeTab === 'staff' ? '#ec4899' : 'transparent',
                  color: activeTab === 'staff' ? 'white' : '#6b7280',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: activeTab === 'staff' ? 'none' : '2px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaUsers size={14} />
                Staff
              </button>
              <button
                onClick={() => setActiveTab('menu')}
                style={{
                  backgroundColor: activeTab === 'menu' ? '#ec4899' : 'transparent',
                  color: activeTab === 'menu' ? 'white' : '#6b7280',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: activeTab === 'menu' ? 'none' : '2px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <FaUtensils size={14} />
                Menu
              </button>
            </div>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: isClient && isMobile ? '16px' : '20px',
          marginBottom: isClient && isMobile ? '16px' : '24px',
          border: '1px solid #fce7f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: isClient && isMobile ? 'column' : 'row',
          gap: isClient && isMobile ? '12px' : '0'
        }}>
          {/* Search Bar */}
          <div style={{ 
            position: 'relative', 
            maxWidth: isClient && isMobile ? '100%' : '400px', 
            flex: 1,
            width: isClient && isMobile ? '100%' : 'auto'
          }}>
            <FaSearch style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af',
              fontSize: isClient && isMobile ? '12px' : '14px'
            }} />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: isClient && isMobile ? '36px' : '40px',
                paddingRight: isClient && isMobile ? '12px' : '16px',
                paddingTop: isClient && isMobile ? '10px' : '12px',
                paddingBottom: isClient && isMobile ? '10px' : '12px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: isClient && isMobile ? '13px' : '14px',
                outline: 'none',
                backgroundColor: '#fef7f0',
                transition: 'all 0.2s'
              }}
            />
          </div>
          
          {/* Add Button */}
          {activeTab !== 'menu' && (
            <button
              onClick={() => activeTab === 'restaurants' ? setShowAddRestaurantModal(true) : setShowAddStaffModal(true)}
              style={{
                background: 'linear-gradient(135deg, #ec4899, #db2777)',
                color: 'white',
                padding: isClient && isMobile ? '10px 16px' : '12px 20px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: isClient && isMobile ? '13px' : '14px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                width: isClient && isMobile ? '100%' : 'auto',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                marginLeft: isClient && isMobile ? '0' : '16px'
              }}
            >
              <FaPlus size={14} />
              Add {activeTab === 'restaurants' ? 'Restaurant' : 'Staff'}
            </button>
          )}
          
          {/* Menu Management Button */}
          {activeTab === 'menu' && (
            <button
              onClick={() => router.push('/menu')}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                marginLeft: '16px'
              }}
            >
              <FaEdit size={14} />
              Full Menu Management
            </button>
          )}
        </div>

        {/* Restaurant Selection for Staff Tab */}
        {activeTab === 'staff' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '20px',
            marginBottom: '24px',
            border: '1px solid #fce7f3'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaStore size={16} />
              Select Restaurant
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {restaurants.map((restaurant) => (
                <button
                  key={restaurant.id}
                  onClick={() => setSelectedRestaurant(restaurant)}
                  style={{
                    backgroundColor: selectedRestaurant?.id === restaurant.id ? '#ec4899' : '#f8fafc',
                    color: selectedRestaurant?.id === restaurant.id ? 'white' : '#374151',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontWeight: '500',
                    fontSize: '14px',
                    border: selectedRestaurant?.id === restaurant.id ? 'none' : '2px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FaStore size={12} />
                  {restaurant.name}
                  <FaArrowRight size={10} style={{ opacity: 0.7 }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        {activeTab === 'restaurants' ? (
          // Restaurants Grid
          <div style={{
            display: 'grid',
            gridTemplateColumns: isClient && isMobile ? '1fr' : 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: isClient && isMobile ? '16px' : '20px'
          }}>
            {filteredRestaurants.map((restaurant) => (
              <div key={restaurant.id} style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid #fce7f3',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}>
                {/* Restaurant Header */}
                <div style={{ padding: '20px', borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <FaStore color="white" size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{restaurant.name}</h3>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{restaurant.phone}</p>
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: '600',
                      backgroundColor: '#dcfce7',
                      color: '#166534',
                      border: '1px solid #22c55e',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      Active
                    </div>
                  </div>
                </div>
                
                {/* Restaurant Details */}
                <div style={{ padding: '20px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <FaMapMarkerAlt style={{ color: '#9ca3af', fontSize: '12px' }} />
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Address</span>
                    </div>
                    <p style={{ fontSize: '14px', color: '#1f2937', margin: 0, paddingLeft: '20px' }}>
                      {restaurant.address}
                    </p>
                  </div>

                  {restaurant.email && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <FaEnvelope style={{ color: '#9ca3af', fontSize: '12px' }} />
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Email</span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#1f2937', margin: 0, paddingLeft: '20px' }}>
                        {restaurant.email}
                      </p>
                    </div>
                  )}

                  {restaurant.cuisine && restaurant.cuisine.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <FaUtensils style={{ color: '#9ca3af', fontSize: '12px' }} />
                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Cuisine</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', paddingLeft: '20px', flexWrap: 'wrap' }}>
                        {restaurant.cuisine.map((c, index) => (
                          <span key={index} style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '500',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                            border: '1px solid #f59e0b'
                          }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div style={{ 
                  padding: '16px 20px', 
                  backgroundColor: '#fef7f0', 
                  display: 'flex', 
                  gap: '8px',
                  borderTop: '1px solid #fce7f3'
                }}>
                  <button
                    onClick={() => {
                      setSelectedRestaurant(restaurant);
                      setActiveTab('staff');
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaUsers size={12} />
                    Manage Staff
                  </button>
                  
                  <button
                    style={{
                      flex: 1,
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '10px 16px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <FaEdit size={12} />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Staff Grid
          <div style={{
            display: 'grid',
            gridTemplateColumns: isClient && isMobile ? '1fr' : 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: isClient && isMobile ? '16px' : '20px'
          }}>
            {filteredStaff.map((member) => {
              const roleInfo = getRoleInfo(member.role);
              const statusInfo = getStatusInfo(member.status);
              const RoleIcon = roleInfo.icon;
              const StatusIcon = statusInfo.icon;

              return (
                <div key={member.id} style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  border: '1px solid #fce7f3',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isClient || !isMobile) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isClient || !isMobile) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }
                }}>
                  {/* Staff Header */}
                  <div style={{ padding: isClient && isMobile ? '16px' : '20px', borderBottom: '1px solid #f3f4f6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: `linear-gradient(135deg, ${roleInfo.color}, ${roleInfo.color}dd)`,
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <RoleIcon color="white" size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: isClient && isMobile ? '16px' : '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>{member.name || 'Unknown'}</h3>
                          <p style={{ fontSize: isClient && isMobile ? '12px' : '13px', color: '#6b7280', margin: 0 }}>{member.phone || member.email || 'No contact'}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: isClient && isMobile ? '4px' : '6px', flexWrap: 'wrap' }}>
                        <div style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                          backgroundColor: roleInfo.bg,
                          color: roleInfo.color,
                          border: `1px solid ${roleInfo.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <RoleIcon size={10} />
                          {roleInfo.label}
                        </div>
                        <div style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                          backgroundColor: statusInfo.bg,
                          color: statusInfo.color,
                          border: `1px solid ${statusInfo.color}`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <StatusIcon size={10} />
                          {statusInfo.label}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Staff Details */}
                  <div style={{ padding: isClient && isMobile ? '16px' : '20px' }}>
                    {/* Login Credentials Section */}
                    {(member.loginId || member.tempPassword) && (
                      <div style={{ 
                        backgroundColor: '#f0f9ff', 
                        padding: isClient && isMobile ? '12px' : '16px', 
                        borderRadius: '12px',
                        marginBottom: isClient && isMobile ? '12px' : '16px',
                        border: '1px solid #0ea5e9'
                      }}>
                        <h4 style={{ 
                          fontSize: '14px', 
                          fontWeight: '600', 
                          color: '#0c4a6e', 
                          marginBottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <FaKey size={12} />
                          Login Credentials
                        </h4>
                        
                        {/* User ID Badge */}
                        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FaIdBadge style={{ color: '#0ea5e9', fontSize: '14px' }} />
                          <div style={{ flex: 1 }}>
                            <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>User ID</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ 
                                fontSize: '13px', 
                                fontWeight: '600', 
                                color: '#0c4a6e',
                                backgroundColor: '#e0f2fe',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                fontFamily: 'monospace'
                              }}>
                                {member.loginId || 'N/A'}
                              </span>
                              {member.loginId && (
                                <button
                                  onClick={() => copyToClipboard(member.loginId, 'userId', member.id)}
                                  style={{
                                    backgroundColor: copiedCredentials[`${member.id}_userId`] ? '#10b981' : '#0ea5e9',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  <FaCopy size={10} />
                                  {copiedCredentials[`${member.id}_userId`] ? 'Copied!' : 'Copy'}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Password with show/hide */}
                        {(member.tempPassword || member.password) && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaKey style={{ color: '#0ea5e9', fontSize: '14px' }} />
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Password</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ 
                                  fontSize: '13px', 
                                  fontWeight: '600', 
                                  color: '#0c4a6e',
                                  backgroundColor: '#e0f2fe',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontFamily: 'monospace',
                                  minWidth: '60px'
                                }}>
                                  {showPassword[member.id] 
                                    ? (member.tempPassword || member.password || 'N/A')
                                    : '••••••'
                                  }
                                </span>
                                <button
                                  onClick={() => togglePasswordVisibility(member.id)}
                                  style={{
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '4px 8px',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  {showPassword[member.id] ? <FaEyeSlash size={10} /> : <FaEye size={10} />}
                                  {showPassword[member.id] ? 'Hide' : 'Show'}
                                </button>
                                {(member.tempPassword || member.password) && (
                                  <button
                                    onClick={() => copyToClipboard(member.tempPassword || member.password, 'password', member.id)}
                                    style={{
                                      backgroundColor: copiedCredentials[`${member.id}_password`] ? '#10b981' : '#0ea5e9',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '6px',
                                      padding: '4px 8px',
                                      cursor: 'pointer',
                                      fontSize: '11px',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <FaCopy size={10} />
                                    {copiedCredentials[`${member.id}_password`] ? 'Copied!' : 'Copy'}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: isClient && isMobile ? '1fr' : '1fr 1fr', gap: isClient && isMobile ? '12px' : '16px', marginBottom: isClient && isMobile ? '12px' : '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCalendarAlt style={{ color: '#9ca3af', fontSize: '12px' }} />
                        <div>
                          <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Start Date</span>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                            {member.startDate ? new Date(member.startDate).toLocaleDateString('en-IN') : 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCalendarAlt style={{ color: '#9ca3af', fontSize: '12px' }} />
                        <div>
                          <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Last Login</span>
                          <span style={{ fontSize: '13px', fontWeight: '500', color: '#1f2937' }}>
                            {formatDateTime(member.lastLogin)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Performance Stats */}
                    {(() => {
                      const stats = getPerformanceStats(member);
                      return (
                        <div style={{ 
                          backgroundColor: '#f8fafc', 
                          padding: isClient && isMobile ? '10px' : '12px', 
                          borderRadius: '10px',
                          marginBottom: isClient && isMobile ? '12px' : '16px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                                {stats.todayValue}
                              </div>
                              <div style={{ fontSize: '11px', color: '#6b7280' }}>{stats.todayLabel}</div>
                            </div>
                            <div style={{ width: '1px', height: '30px', backgroundColor: '#e2e8f0' }} />
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                                {stats.totalValue}
                              </div>
                              <div style={{ fontSize: '11px', color: '#6b7280' }}>{stats.totalLabel}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Actions */}
                  <div style={{ 
                    padding: isClient && isMobile ? '12px 16px' : '16px 20px', 
                    backgroundColor: '#fef7f0', 
                    display: 'flex', 
                    gap: isClient && isMobile ? '6px' : '8px',
                    borderTop: '1px solid #fce7f3',
                    flexWrap: isClient && isMobile ? 'wrap' : 'nowrap'
                  }}>
                    {/* View button - available to everyone */}
                    <button
                      onClick={() => setSelectedStaff(member)}
                      style={{
                        flex: isClient && isMobile ? '1 1 100%' : (canManageStaff(member.role) ? 1 : 2),
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: isClient && isMobile ? '8px 12px' : '10px 16px',
                        borderRadius: '10px',
                        fontWeight: '600',
                        fontSize: isClient && isMobile ? '12px' : '13px',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: isClient && isMobile ? '4px' : '6px'
                      }}
                    >
                      <FaEye size={isClient && isMobile ? 10 : 12} />
                      View Details
                    </button>
                    
                    {/* Status toggle - only if user can manage this staff member */}
                    {canManageStaff(member.role) && (
                      <button
                        onClick={() => toggleStaffStatus(member.id)}
                        style={{
                          flex: isClient && isMobile ? '1 1 45%' : 1,
                          backgroundColor: member.status === 'active' ? '#ef4444' : '#10b981',
                          color: 'white',
                          padding: isClient && isMobile ? '8px 12px' : '10px 16px',
                          borderRadius: '10px',
                          fontWeight: '600',
                          fontSize: isClient && isMobile ? '12px' : '13px',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: isClient && isMobile ? '4px' : '6px'
                        }}
                      >
                        {member.status === 'active' ? <FaUserTimes size={isClient && isMobile ? 10 : 12} /> : <FaUserCheck size={isClient && isMobile ? 10 : 12} />}
                        {member.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}

                    {/* Edit button - only for higher-level roles and if can manage */}
                    {(currentUserRole === 'owner' || currentUserRole === 'admin') && canManageStaff(member.role) && (
                      <button
                        style={{
                          flex: isClient && isMobile ? '1 1 45%' : 1,
                          backgroundColor: '#f59e0b',
                          color: 'white',
                          padding: isClient && isMobile ? '8px 12px' : '10px 16px',
                          borderRadius: '10px',
                          fontWeight: '600',
                          fontSize: isClient && isMobile ? '12px' : '13px',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: isClient && isMobile ? '4px' : '6px'
                        }}
                      >
                        <FaEdit size={12} />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty States */}
        {activeTab === 'restaurants' && filteredRestaurants.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '20px',
            border: '1px solid #fce7f3'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#fef7f0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FaStore size={32} style={{ color: '#d1d5db' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              No restaurants found
            </h3>
            <p style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '14px'
            }}>
              {searchTerm ? 'Try adjusting your search criteria.' : 'Add your first restaurant to get started.'}
            </p>
          </div>
        )}

        {activeTab === 'staff' && filteredStaff.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '20px',
            border: '1px solid #fce7f3'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#fef7f0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <FaUsers size={32} style={{ color: '#d1d5db' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              {!selectedRestaurant ? 'Select a restaurant first' : 'No staff members found'}
            </h3>
            <p style={{
              color: '#6b7280',
              margin: 0,
              fontSize: '14px'
            }}>
              {!selectedRestaurant ? 'Please select a restaurant to manage its staff.' : 
                searchTerm ? 'Try adjusting your search criteria.' : 'Add your first staff member to get started.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Restaurant Modal */}
      {showAddRestaurantModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%',
            maxWidth: '500px',
            border: '1px solid #fce7f3'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #f3f4f6',
              background: 'linear-gradient(135deg, #fef7f0, #fce7f3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Add New Restaurant
                </h2>
                <button
                  onClick={() => setShowAddRestaurantModal(false)}
                  style={{
                    color: '#6b7280',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddRestaurant} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  required
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter restaurant name"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Address
                </label>
                <textarea
                  value={newRestaurant.address}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Enter complete address"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  City
                </label>
                <input
                  type="text"
                  value={newRestaurant.city || ''}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Mumbai, Delhi, Bangalore"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newRestaurant.phone}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="+91-9876543210"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newRestaurant.email}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="restaurant@example.com"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Cuisine Types
                </label>
                <input
                  type="text"
                  value={newRestaurant.cuisine}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Indian, Chinese, Continental (comma-separated)"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Description
                </label>
                <textarea
                  value={newRestaurant.description}
                  onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Brief description of your restaurant"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddRestaurantModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #ec4899, #db2777)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Adding...' : 'Add Restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%',
            maxWidth: '500px',
            border: '1px solid #fce7f3'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #f3f4f6',
              background: 'linear-gradient(135deg, #fef7f0, #fce7f3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Add New Staff Member
                </h2>
                <button
                  onClick={() => setShowAddStaffModal(false)}
                  style={{
                    color: '#6b7280',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddStaff} style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter staff member full name"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="+91-9876543210"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="staff@restaurant.com (used for login)"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Address
                </label>
                <textarea
                  value={newStaff.address}
                  onChange={(e) => setNewStaff({ ...newStaff, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Staff residential address"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Role *
                </label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                >
                  {customRoles.map(role => {
                    // Only show admin option to owners
                    if (role === 'admin' && currentUserRole !== 'owner') {
                      return null;
                    }
                    return (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    );
                  })}
                  <option value="custom" style={{ fontStyle: 'italic', color: '#6b7280' }}>+ Add Custom Role</option>
                </select>
              </div>

              {/* Custom Role Input */}
              {newStaff.role === 'custom' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#374151', 
                    marginBottom: '8px' 
                  }}>
                    Custom Role Name *
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={newCustomRole}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                        if (!['owner', 'admin'].includes(value)) {
                          setNewCustomRole(value);
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '14px',
                        outline: 'none',
                        backgroundColor: '#fef7f0',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box'
                      }}
                      placeholder="supervisor, cashier, cook, etc."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newCustomRole && !customRoles.includes(newCustomRole)) {
                          setCustomRoles([...customRoles, newCustomRole]);
                          setNewStaff({ ...newStaff, role: newCustomRole });
                          setNewCustomRole('');
                        }
                      }}
                      disabled={!newCustomRole || customRoles.includes(newCustomRole)}
                      style={{
                        padding: '12px 16px',
                        backgroundColor: newCustomRole && !customRoles.includes(newCustomRole) ? '#10b981' : '#d1d5db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: newCustomRole && !customRoles.includes(newCustomRole) ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    Note: Cannot create &apos;owner&apos; or &apos;admin&apos; roles
                  </p>
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  color: '#374151', 
                  marginBottom: '8px' 
                }}>
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={newStaff.startDate}
                  onChange={(e) => setNewStaff({ ...newStaff, startDate: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#6b7280',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #ec4899, #db2777)',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? 'Adding...' : 'Add Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #fce7f3'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #f3f4f6',
              background: 'linear-gradient(135deg, #fef7f0, #fce7f3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#ec4899',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaUsers color="white" size={18} />
                  </div>
                  <h2 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Staff Details - {selectedStaff.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  style={{
                    color: '#6b7280',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    border: 'none',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  ×
                </button>
              </div>
            </div>
            
            <div style={{ padding: '24px' }}>
              {/* Login Credentials - Full Width */}
              {(selectedStaff.loginId || selectedStaff.tempPassword) && (
                <div style={{ 
                  backgroundColor: '#f0f9ff', 
                  padding: '20px', 
                  borderRadius: '16px',
                  marginBottom: '24px',
                  border: '1px solid #0ea5e9'
                }}>
                  <h3 style={{ 
                    fontWeight: '600', 
                    color: '#0c4a6e', 
                    marginBottom: '16px', 
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <FaKey size={16} />
                    Login Credentials
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* User ID */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <FaIdBadge style={{ color: '#0ea5e9', fontSize: '16px' }} />
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#0c4a6e' }}>User ID</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontSize: '16px', 
                          fontWeight: '700', 
                          color: '#0c4a6e',
                          backgroundColor: '#e0f2fe',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontFamily: 'monospace',
                          flex: 1
                        }}>
                          {selectedStaff.loginId || 'N/A'}
                        </span>
                        {selectedStaff.loginId && (
                          <button
                            onClick={() => copyToClipboard(selectedStaff.loginId, 'userId', selectedStaff.id)}
                            style={{
                              backgroundColor: copiedCredentials[`${selectedStaff.id}_userId`] ? '#10b981' : '#0ea5e9',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: '600'
                            }}
                          >
                            <FaCopy size={12} />
                            {copiedCredentials[`${selectedStaff.id}_userId`] ? 'Copied!' : 'Copy'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Password */}
                    {(selectedStaff.tempPassword || selectedStaff.password) && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <FaKey style={{ color: '#0ea5e9', fontSize: '16px' }} />
                          <span style={{ fontSize: '14px', fontWeight: '600', color: '#0c4a6e' }}>Password</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ 
                            fontSize: '16px', 
                            fontWeight: '700', 
                            color: '#0c4a6e',
                            backgroundColor: '#e0f2fe',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontFamily: 'monospace',
                            flex: 1,
                            minWidth: '100px'
                          }}>
                            {showPassword[selectedStaff.id] 
                              ? (selectedStaff.tempPassword || selectedStaff.password || 'N/A')
                              : '••••••••'
                            }
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(selectedStaff.id)}
                            style={{
                              backgroundColor: '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: '600'
                            }}
                          >
                            {showPassword[selectedStaff.id] ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                            {showPassword[selectedStaff.id] ? 'Hide' : 'Show'}
                          </button>
                          <button
                            onClick={() => copyToClipboard(selectedStaff.tempPassword || selectedStaff.password, 'password', selectedStaff.id)}
                            style={{
                              backgroundColor: copiedCredentials[`${selectedStaff.id}_password`] ? '#10b981' : '#0ea5e9',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontWeight: '600'
                            }}
                          >
                            <FaCopy size={12} />
                            {copiedCredentials[`${selectedStaff.id}_password`] ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Staff Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ 
                  backgroundColor: '#fef7f0', 
                  padding: '16px', 
                  borderRadius: '12px',
                  border: '1px solid #fce7f3'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '12px', fontSize: '16px' }}>Personal Information</h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '8px' }}><strong>Name:</strong> {selectedStaff.name || 'N/A'}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Phone:</strong> {selectedStaff.phone || 'N/A'}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Email:</strong> {selectedStaff.email || 'N/A'}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Role:</strong> {getRoleInfo(selectedStaff.role || 'employee').label}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Status:</strong> {getStatusInfo(selectedStaff.status || 'active').label}</div>
                  </div>
                </div>
                
                <div style={{ 
                  backgroundColor: '#fef7f0', 
                  padding: '16px', 
                  borderRadius: '12px',
                  border: '1px solid #fce7f3'
                }}>
                  <h3 style={{ fontWeight: '600', color: '#1f2937', marginBottom: '12px', fontSize: '16px' }}>Work Information</h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '8px' }}><strong>Start Date:</strong> {selectedStaff.startDate ? new Date(selectedStaff.startDate).toLocaleDateString('en-IN') : 'N/A'}</div>
                    <div style={{ marginBottom: '8px' }}><strong>Last Login:</strong> {formatDateTime(selectedStaff.lastLogin)}</div>
                    {(() => {
                      const stats = getPerformanceStats(selectedStaff);
                      return (
                        <>
                          <div style={{ marginBottom: '8px' }}><strong>{stats.todayLabel}:</strong> {stats.todayValue}</div>
                          <div style={{ marginBottom: '8px' }}><strong>{stats.totalLabel}:</strong> {stats.totalValue}</div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ 
              padding: '24px', 
              backgroundColor: '#fef7f0', 
              display: 'flex', 
              gap: '12px',
              borderTop: '1px solid #fce7f3'
            }}>
              <button
                onClick={() => setSelectedStaff(null)}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Close
              </button>
              <button style={{
                flex: 1,
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <FaEdit size={14} />
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideUp {
          from { 
            transform: translateY(100%);
          }
          to { 
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .mobile-modal {
            transform: translateY(0) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Admin;