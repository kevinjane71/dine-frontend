'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import apiClient from '../../lib/api';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaSave, 
  FaImage,
  FaUtensils,
  FaFire,
  FaLeaf,
  FaTags,
  FaFilter,
  FaUpload,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaStar,
  FaClock,
  FaHeart,
  FaTh,
  FaList,
  FaEye
} from 'react-icons/fa';

// Custom Dropdown Component
const CustomDropdown = ({ label, value, onChange, options, placeholder = "Select option" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(opt => opt.value === value) || null
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {label && (
        <label style={{
          display: 'block',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
          marginBottom: '6px'
        }}>
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          backgroundColor: 'white',
          fontSize: '14px',
          textAlign: 'left',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          outline: 'none'
        }}
        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
      >
        <span style={{ color: selectedOption ? '#1f2937' : '#9ca3af' }}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span style={{ 
          fontSize: '12px', 
          color: '#6b7280',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease'
        }}>
          ▼
        </span>
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '6px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          marginTop: '2px'
        }}>
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                backgroundColor: 'transparent',
                textAlign: 'left',
                fontSize: '14px',
                color: '#1f2937',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
                borderBottom: index < options.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const MenuManagement = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVegFilter, setSelectedVegFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    isVeg: true,
    spiceLevel: 'medium',
    shortCode: '',
    image: '',
    isAvailable: true,
    stockQuantity: null
  });

  // Mobile detection with client-side hydration safety
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowFilters(false);
        setShowMobileFilters(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current restaurant context
  useEffect(() => {
    const loadRestaurantContext = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          router.push('/login');
          return;
        }

        const user = JSON.parse(userData);
        let restaurantId = null;

        // For staff members, use their assigned restaurant
        if (user.restaurantId) {
          restaurantId = user.restaurantId;
        } 
        // For owners or customers, get selected restaurant
        else if (user.role === 'owner' || user.role === 'customer') {
          const restaurantsResponse = await apiClient.getRestaurants();
          if (restaurantsResponse.restaurants && restaurantsResponse.restaurants.length > 0) {
            const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
            const selectedRestaurant = restaurantsResponse.restaurants.find(r => r.id === savedRestaurantId) || 
                                      restaurantsResponse.restaurants[0];
            restaurantId = selectedRestaurant.id;
            setCurrentRestaurant(selectedRestaurant);
          }
        }

        if (restaurantId) {
          await loadMenuData(restaurantId);
        } else {
          setError('No restaurant context found');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading restaurant context:', error);
        setError('Failed to load restaurant information');
        setLoading(false);
      }
    };

    loadRestaurantContext();
  }, [router]);

  const loadMenuData = async (restaurantId) => {
    try {
      setLoading(true);
      setError('');

      // Load menu items from API
      const menuResponse = await apiClient.getMenu(restaurantId);
      setMenuItems(menuResponse.menuItems || []);

      // Extract unique categories from menu items
      const uniqueCategories = [...new Set((menuResponse.menuItems || []).map(item => item.category))];
      const categoryObjects = uniqueCategories.map(cat => ({
        id: cat,
        name: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      }));
      setCategories(categoryObjects);

      // Set default category for new items
      if (categoryObjects.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: categoryObjects[0].id }));
      }

    } catch (error) {
      console.error('Error loading menu data:', error);
      setError('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesVegFilter = selectedVegFilter === 'all' || 
      (selectedVegFilter === 'veg' && item.isVeg) ||
      (selectedVegFilter === 'non-veg' && !item.isVeg);
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.shortCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesVegFilter && matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentRestaurant) return;

    try {
      setProcessing(true);
      setError('');

      const itemData = {
        ...formData,
        price: parseFloat(formData.price),
        restaurantId: currentRestaurant.id
      };

      if (editingItem) {
        // Update existing item
        await apiClient.updateMenuItem(editingItem.id, itemData);
        setMenuItems(items => items.map(item => 
          item.id === editingItem.id ? { ...itemData, id: editingItem.id } : item
        ));
      } else {
        // Add new item
        const response = await apiClient.createMenuItem(currentRestaurant.id, itemData);
        setMenuItems(items => [...items, response.menuItem]);
      }

      resetForm();
    } catch (error) {
      console.error('Error saving menu item:', error);
      setError(`Failed to ${editingItem ? 'update' : 'add'} menu item: ${error.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      setProcessing(true);
      await apiClient.deleteMenuItem(itemId);
      setMenuItems(items => items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setError('Failed to delete menu item');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      setProcessing(true);
      const updatedData = { isAvailable: !currentStatus };
      await apiClient.updateMenuItem(itemId, updatedData);
      setMenuItems(items => items.map(item => 
        item.id === itemId ? { ...item, isAvailable: !currentStatus } : item
      ));
    } catch (error) {
      console.error('Error updating availability:', error);
      setError('Failed to update item availability');
    } finally {
      setProcessing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: categories[0]?.id || '',
      isVeg: true,
      spiceLevel: 'medium',
      shortCode: '',
      image: '',
      isAvailable: true,
      stockQuantity: null
    });
    setEditingItem(null);
    setShowAddForm(false);
  };

  const getSpiceLevel = (level) => {
    switch(level) {
      case 'mild': return { icon: '🌶️', color: '#10B981', label: 'Mild' };
      case 'medium': return { icon: '🌶️🌶️', color: '#F59E0B', label: 'Medium' };
      case 'hot': return { icon: '🌶️🌶️🌶️', color: '#EF4444', label: 'Hot' };
      default: return { icon: '🌶️', color: '#10B981', label: 'Mild' };
    }
  };

  const getCategoryEmoji = (category) => {
    const emojiMap = {
      'appetizer': '🥗',
      'main-course': '🍽️',
      'dessert': '🍰',
      'beverages': '🥤',
      'rice': '🍚',
      'bread': '🥖',
      'dal': '🍛',
      'fast-food': '🍔',
      'chinese': '🥢',
      'pizza': '🍕'
    };
    return emojiMap[category] || '🍽️';
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // For now, just show the filename - you'll implement actual upload later
      alert(`File selected: ${file.name}\nBackend upload functionality to be implemented.`);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#fef7f0' }}>
        <Navigation />
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 'calc(100vh - 80px)' 
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
            <p style={{ fontSize: '18px', color: '#6b7280', fontWeight: '600' }}>Loading menu management...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Navigation />
      
      <div style={{ padding: isClient && isMobile ? '16px' : '20px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Modern Header Bar */}
        {isClient && isMobile ? (
          // Mobile Header
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px'
            }}>
              <div>
                <h1 style={{
                  fontSize: '24px',
                  fontWeight: '800',
                  color: '#2d3748',
                  margin: 0,
                  background: 'linear-gradient(45deg, #ef4444 0%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Menu
                </h1>
                <div style={{
                  backgroundColor: '#e6fffa',
                  border: '1px solid #81e6d9',
                  borderRadius: '16px',
                  padding: '2px 8px',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#234e52',
                  marginTop: '4px',
                  display: 'inline-block'
                }}>
                  {filteredItems.length} items
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowUploadModal(true)}
                  style={{
                    background: 'linear-gradient(45deg, #f59e0b 0%, #ef4444 100%)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                    minWidth: '40px'
                  }}
                >
                  <FaUpload size={14} />
                </button>
                <button
                  onClick={() => setShowAddForm(true)}
                  style={{
                    background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    padding: '10px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)',
                    minWidth: '40px'
                  }}
                >
                  <FaPlus size={14} />
                </button>
              </div>
            </div>
            
            {/* Mobile Action Bar */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                style={{
                  background: showMobileFilters
                    ? 'linear-gradient(45deg, #3b82f6 0%, #1d4ed8 100%)'
                    : 'white',
                  color: showMobileFilters ? 'white' : '#374151',
                  border: showMobileFilters ? 'none' : '1px solid #e5e7eb',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flex: 1,
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaFilter size={12} />
                Filters
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                style={{
                  backgroundColor: 'white',
                  color: '#374151',
                  border: '1px solid #e5e7eb',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  minWidth: '48px'
                }}
              >
                {viewMode === 'grid' ? <FaList size={14} /> : <FaTh size={14} />}
              </button>
            </div>
          </div>
        ) : (
          // Desktop Header
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h1 style={{ 
              fontSize: '28px', 
              fontWeight: '800', 
              color: '#2d3748', 
              margin: 0,
              background: 'linear-gradient(45deg, #ef4444 0%, #f97316 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Menu Dashboard
            </h1>
            <div style={{
              backgroundColor: '#e6fffa',
              border: '1px solid #81e6d9',
              borderRadius: '20px',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: '600',
              color: '#234e52'
            }}>
              {filteredItems.length} items • {currentRestaurant?.name}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowUploadModal(true)}
              style={{
                background: 'linear-gradient(45deg, #f59e0b 0%, #ef4444 100%)',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
              }}
            >
              <FaUpload size={12} />
              Upload
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '25px',
                fontWeight: '600',
                fontSize: '13px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(240, 147, 251, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(240, 147, 251, 0.4)';
              }}
            >
              <FaPlus size={12} />
              New Item
            </button>
          </div>
        </div>
        )}

        {/* Mobile Filter Modal */}
        {isClient && isMobile && showMobileFilters && (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'white',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
            zIndex: 1000,
            maxHeight: '70vh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s ease-out'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0
                }}>
                  Filter Menu
                </h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '18px',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '6px'
                  }}
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* Mobile Search */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Search Dishes
                </label>
                <div style={{ position: 'relative' }}>
                  <FaSearch style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#9ca3af',
                    fontSize: '14px'
                  }} />
                  <input
                    type="text"
                    placeholder="Search dishes, codes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      paddingLeft: '40px',
                      paddingRight: '16px',
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#f8fafc'
                    }}
                  />
                </div>
              </div>
              
              {/* Mobile Veg Filter */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Food Type
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { value: 'all', label: 'All Types', icon: '🍽️' },
                    { value: 'veg', label: 'Veg', icon: '🥬' },
                    { value: 'non-veg', label: 'Non-Veg', icon: '🍖' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedVegFilter(option.value)}
                      style={{
                        flex: 1,
                        padding: '12px 8px',
                        backgroundColor: selectedVegFilter === option.value ? '#ef4444' : 'white',
                        color: selectedVegFilter === option.value ? 'white' : '#6b7280',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>{option.icon}</span>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Mobile Category Filter */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Category
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setShowMobileFilters(false);
                    }}
                    style={{
                      padding: '12px',
                      backgroundColor: selectedCategory === 'all' ? '#ef4444' : 'white',
                      color: selectedCategory === 'all' ? 'white' : '#6b7280',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>🍽️</span>
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setShowMobileFilters(false);
                      }}
                      style={{
                        padding: '12px',
                        backgroundColor: selectedCategory === category.id ? '#ef4444' : 'white',
                        color: selectedCategory === category.id ? 'white' : '#6b7280',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{getCategoryEmoji(category.id)}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Smart Control Bar - Desktop Only */}
        {(!isClient || !isMobile) && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '16px 20px',
            marginBottom: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0'
          }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px', 
            flexWrap: 'wrap'
          }}>
            {/* Search with Icon */}
            <div style={{ position: 'relative', minWidth: '240px' }}>
              <div style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#ef4444',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <FaSearch color="white" size={10} />
              </div>
              <input
                type="text"
                placeholder="Search dishes, codes, descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '45px',
                  paddingRight: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#f8fafc',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ef4444';
                  e.target.style.backgroundColor = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Modern Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Veg Filter */}
              <div className="dropdown-container" style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowFilters(showFilters === 'veg' ? false : 'veg')}
                  style={{
                    background: selectedVegFilter !== 'all' 
                      ? 'linear-gradient(45deg, #48bb78 0%, #38a169 100%)' 
                      : 'linear-gradient(45deg, #f7fafc 0%, #edf2f7 100%)',
                    color: selectedVegFilter !== 'all' ? 'white' : '#4a5568',
                    border: selectedVegFilter !== 'all' ? 'none' : '2px solid #e2e8f0',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    boxShadow: selectedVegFilter !== 'all' ? '0 2px 8px rgba(72, 187, 120, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {selectedVegFilter === 'all' ? '🍽️' : selectedVegFilter === 'veg' ? '🥬' : '🍖'}
                  {selectedVegFilter === 'all' ? 'All Types' : selectedVegFilter === 'veg' ? 'Vegetarian' : 'Non-Veg'}
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>▼</span>
                </button>
                
                {showFilters === 'veg' && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 10,
                    marginTop: '8px',
                    minWidth: '160px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0'
                  }}>
                    {[
                      { value: 'all', label: 'All Types', icon: '🍽️', color: '#ef4444' },
                      { value: 'veg', label: 'Vegetarian', icon: '🥬', color: '#48bb78' },
                      { value: 'non-veg', label: 'Non-Vegetarian', icon: '🍖', color: '#f56565' }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSelectedVegFilter(option.value);
                          setShowFilters(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          backgroundColor: selectedVegFilter === option.value ? `${option.color}15` : 'white',
                          color: '#2d3748',
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontWeight: '500',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedVegFilter !== option.value) {
                            e.currentTarget.style.backgroundColor = '#f7fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedVegFilter !== option.value) {
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>{option.icon}</span>
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="dropdown-container" style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowFilters(showFilters === 'category' ? false : 'category')}
                  style={{
                    background: selectedCategory !== 'all' 
                      ? 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)' 
                      : 'linear-gradient(45deg, #f7fafc 0%, #edf2f7 100%)',
                    color: selectedCategory !== 'all' ? 'white' : '#4a5568',
                    border: selectedCategory !== 'all' ? 'none' : '2px solid #e2e8f0',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '600',
                    boxShadow: selectedCategory !== 'all' ? '0 2px 8px rgba(240, 147, 251, 0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {getCategoryEmoji(selectedCategory)}
                  {selectedCategory === 'all' ? 'All Categories' : categories.find(c => c.id === selectedCategory)?.name || 'Category'}
                  <span style={{ fontSize: '10px', opacity: 0.7 }}>▼</span>
                </button>
                
                {showFilters === 'category' && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                    zIndex: 10,
                    marginTop: '8px',
                    minWidth: '180px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid #e2e8f0'
                  }}>
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setShowFilters(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: 'none',
                        backgroundColor: selectedCategory === 'all' ? '#ef444415' : 'white',
                        color: '#2d3748',
                        fontSize: '13px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: '500'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>🍽️</span>
                      All Categories
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setShowFilters(false);
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          border: 'none',
                          backgroundColor: selectedCategory === category.id ? '#f093fb15' : 'white',
                          color: '#2d3748',
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          fontWeight: '500',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedCategory !== category.id) {
                            e.currentTarget.style.backgroundColor = '#f7fafc';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedCategory !== category.id) {
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <span style={{ fontSize: '16px' }}>{getCategoryEmoji(category.id)}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div style={{ 
              display: 'flex', 
              backgroundColor: '#f1f5f9', 
              borderRadius: '10px', 
              padding: '4px',
              marginLeft: 'auto'
            }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  backgroundColor: viewMode === 'grid' ? 'white' : 'transparent',
                  color: viewMode === 'grid' ? '#ef4444' : '#718096',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaTh size={12} />
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  backgroundColor: viewMode === 'list' ? 'white' : 'transparent',
                  color: viewMode === 'list' ? '#ef4444' : '#718096',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaList size={12} />
                List
              </button>
            </div>
          </div>
        </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            color: '#dc2626',
            padding: '16px 20px',
            borderRadius: '16px',
            marginBottom: '24px',
            fontSize: '15px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: '2px solid #fecaca'
          }}>
            <FaExclamationTriangle size={18} />
            {error}
          </div>
        )}

        {/* Modern Menu Cards */}
        {filteredItems.length > 0 ? (
          viewMode === 'grid' ? (
            /* Sleek Card Grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: isClient && isMobile 
                ? '1fr' 
                : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: isClient && isMobile ? '16px' : '20px'
            }}>
              {filteredItems.map((item) => {
                const spiceInfo = getSpiceLevel(item.spiceLevel);
                return (
                  <div key={item.id} style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    border: '1px solid #f1f5f9',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    opacity: item.isAvailable === false ? 0.6 : 1,
                    filter: item.isAvailable === false ? 'grayscale(0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  }}>
                    
                    {/* Gradient Header with Floating Elements */}
                    <div style={{
                      height: '120px',
                      background: item.isVeg 
                        ? 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                        : 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Floating Background Shapes */}
                      <div style={{
                        position: 'absolute',
                        top: '-20px',
                        right: '-20px',
                        width: '80px',
                        height: '80px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        animation: 'float 3s ease-in-out infinite'
                      }} />
                      <div style={{
                        position: 'absolute',
                        bottom: '-30px',
                        left: '-10px',
                        width: '60px',
                        height: '60px',
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: '50%',
                        animation: 'float 4s ease-in-out infinite reverse'
                      }} />
                      
                      {/* Main Content */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px 20px',
                        height: '100%',
                        zIndex: 2,
                        position: 'relative'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            fontSize: '40px',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                            animation: 'bounce 2s ease-in-out infinite'
                          }}>
                            {getCategoryEmoji(item.category)}
                          </div>
                          
                          <div style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: 'white',
                            border: `3px solid ${item.isVeg ? '#48bb78' : '#f56565'}`,
                            borderRadius: item.isVeg ? '4px' : '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                          }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: item.isVeg ? '#48bb78' : '#f56565',
                              borderRadius: item.isVeg ? '2px' : '50%'
                            }} />
                          </div>
                        </div>
                        
                        <div style={{
                          background: 'rgba(255,255,255,0.95)',
                          backdropFilter: 'blur(10px)',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#2d3748',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          ₹{item.price}
                        </div>
                      </div>
                      
                      {/* Short Code Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '15px',
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)'
                      }}>
                        {item.shortCode}
                      </div>

                      {/* Availability Status Badge */}
                      {item.isAvailable === false && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontSize: '10px',
                          fontWeight: '700',
                          letterSpacing: '0.5px',
                          boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          🚫 OUT OF STOCK
                        </div>
                      )}
                    </div>
                    
                    {/* Content Section */}
                    <div style={{ padding: '20px' }}>
                      <div style={{ marginBottom: '12px' }}>
                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: '700',
                          color: '#2d3748',
                          margin: '0 0 6px 0',
                          lineHeight: '1.3'
                        }}>
                          {item.name}
                        </h3>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ 
                            fontSize: '14px',
                            background: `linear-gradient(45deg, ${spiceInfo.color}, ${spiceInfo.color}99)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontWeight: '600'
                          }}>
                            {spiceInfo.icon}
                          </span>
                          <div style={{
                            backgroundColor: '#f0f4f8',
                            color: '#4a5568',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: '600'
                          }}>
                            {categories.find(c => c.id === item.category)?.name || 'Main Course'}
                          </div>
                        </div>
                      </div>
                      
                      <p style={{
                        fontSize: '13px',
                        color: '#718096',
                        lineHeight: '1.5',
                        margin: '0 0 16px 0',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.description || 'A delightful dish crafted with love and finest ingredients, perfect for any occasion.'}
                      </p>
                      
                      {/* Modern Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          style={{
                            flex: 1,
                            background: 'linear-gradient(45deg, #3b82f6 0%, #1d4ed8 100%)',
                            color: 'white',
                            padding: '10px 14px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                          }}
                        >
                          <FaEdit size={11} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleAvailability(item.id, item.isAvailable);
                          }}
                          style={{
                            background: item.isAvailable 
                              ? 'linear-gradient(45deg, #f59e0b 0%, #d97706 100%)'
                              : 'linear-gradient(45deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: item.isAvailable 
                              ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                              : '0 4px 12px rgba(16, 185, 129, 0.3)',
                            transition: 'all 0.2s ease',
                            minWidth: '36px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = item.isAvailable 
                              ? '0 6px 16px rgba(245, 158, 11, 0.4)'
                              : '0 6px 16px rgba(16, 185, 129, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = item.isAvailable 
                              ? '0 4px 12px rgba(245, 158, 11, 0.3)'
                              : '0 4px 12px rgba(16, 185, 129, 0.3)';
                          }}
                          title={item.isAvailable ? 'Mark as Out of Stock' : 'Mark as Available'}
                        >
                          {item.isAvailable ? '🚫' : '✅'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                          style={{
                            background: 'linear-gradient(45deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                            transition: 'all 0.2s ease',
                            minWidth: '36px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-1px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                          }}
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View - Restaurant Menu Style */
            <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
              {/* Group by Categories like real restaurant menus */}
              {['appetizer', 'main-course', 'dessert', 'beverages', 'pizza', 'chinese', 'bread', 'rice', 'dal'].filter(cat => 
                filteredItems.some(item => item.category === cat)
              ).map(category => (
                <div key={category}>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '16px' }}>{getCategoryEmoji(category)}</span>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '700',
                      color: '#1f2937',
                      margin: 0,
                      textTransform: 'capitalize'
                    }}>
                      {category.split('-').join(' ')}
                    </h3>
                    <span style={{
                      backgroundColor: '#e2e8f0',
                      color: '#64748b',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}>
                      {filteredItems.filter(item => item.category === category).length} items
                    </span>
                  </div>
                  
                  {filteredItems.filter(item => item.category === category).map((item, index) => {
                    const spiceInfo = getSpiceLevel(item.spiceLevel);
                    return (
                      <div 
                        key={item.id} 
                        style={{
                          padding: '12px 16px',
                          borderBottom: index === filteredItems.filter(i => i.category === category).length - 1 ? 'none' : '1px solid #f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'background-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f8fafc';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {/* Menu Item Icon */}
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: item.isVeg ? '#dcfce7' : '#fecaca',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px'
                        }}>
                          {getCategoryEmoji(item.category)}
                        </div>
                        
                        {/* Veg/Non-Veg Indicator */}
                        <div style={{
                          width: '18px',
                          height: '18px',
                          backgroundColor: 'white',
                          border: `2px solid ${item.isVeg ? '#22c55e' : '#ef4444'}`,
                          borderRadius: item.isVeg ? '2px' : '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: item.isVeg ? '#22c55e' : '#ef4444',
                            borderRadius: item.isVeg ? '1px' : '50%'
                          }} />
                        </div>
                        
                        {/* Item Details */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                            <h4 style={{
                              fontSize: '14px',
                              fontWeight: '600',
                              color: item.isAvailable === false ? '#9ca3af' : '#1f2937',
                              margin: 0,
                              textDecoration: item.isAvailable === false ? 'line-through' : 'none'
                            }}>
                              {item.name}
                            </h4>
                            <span style={{ fontSize: '10px', color: spiceInfo.color }}>{spiceInfo.icon}</span>
                            <span style={{
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '9px',
                              fontWeight: '700'
                            }}>
                              {item.shortCode}
                            </span>
                            {item.isAvailable === false && (
                              <span style={{
                                backgroundColor: '#ef4444',
                                color: 'white',
                                padding: '2px 6px',
                                borderRadius: '8px',
                                fontSize: '8px',
                                fontWeight: '700',
                                letterSpacing: '0.5px'
                              }}>
                                OUT OF STOCK
                              </span>
                            )}
                          </div>
                          <p style={{
                            fontSize: '12px',
                            color: '#64748b',
                            margin: 0,
                            lineHeight: '1.4'
                          }}>
                            {item.description || 'Delicious dish prepared with finest ingredients'}
                          </p>
                        </div>
                        
                        {/* Price */}
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#ef4444',
                          minWidth: '60px',
                          textAlign: 'right'
                        }}>
                          ₹{item.price}
                        </div>
                        
                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item);
                            }}
                            style={{
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <FaEdit size={10} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleAvailability(item.id, item.isAvailable);
                            }}
                            style={{
                              backgroundColor: item.isAvailable ? '#f59e0b' : '#10b981',
                              color: 'white',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title={item.isAvailable ? 'Mark as Out of Stock' : 'Mark as Available'}
                          >
                            {item.isAvailable ? '🚫' : '✅'}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            style={{
                              backgroundColor: '#ef4444',
                              color: 'white',
                              padding: '6px 8px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <FaTrash size={10} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '1px solid #fed7aa'
          }}>
            <div style={{
              width: '120px',
              height: '120px',
              backgroundColor: '#fef7f0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              border: '3px solid #fed7aa'
            }}>
              <FaUtensils size={48} style={{ color: '#ef4444' }} />
            </div>
            <h3 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 12px 0'
            }}>
              {searchTerm ? 'No dishes found' : 'Your menu awaits!'}
            </h3>
            <p style={{
              color: '#6b7280',
              margin: '0 0 32px 0',
              fontSize: '16px',
              maxWidth: '400px',
              margin: '0 auto 32px auto'
            }}>
              {searchTerm ? 'Try searching for something else or check out all our delicious categories.' : 'Start building your amazing menu by adding your first delicious dish.'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                padding: '16px 32px',
                borderRadius: '16px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '12px',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3)';
              }}
            >
              <FaPlus size={16} />
              Add Your First Dish
            </button>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%',
            maxWidth: '500px',
            padding: '32px',
            border: '1px solid #fed7aa'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0 }}>
                📤 Upload Menu
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '20px',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }}
              >
                <FaTimes />
              </button>
            </div>
            
            <div style={{
              border: '3px dashed #fed7aa',
              borderRadius: '20px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '24px',
              backgroundColor: '#fef7f0',
              transition: 'all 0.3s ease'
            }}>
              <FaUpload size={48} style={{ color: '#ef4444', marginBottom: '16px' }} />
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                Upload Your Menu File
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
                Drag & drop or click to upload (PDF, Excel, or CSV)
              </p>
              <input
                type="file"
                accept=".pdf,.xlsx,.xls,.csv"
                onChange={handleFileUpload}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #fed7aa',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              />
            </div>
            
            <div style={{ 
              backgroundColor: '#fef7f0', 
              padding: '16px', 
              borderRadius: '12px',
              border: '1px solid #fed7aa'
            }}>
              <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', margin: 0 }}>
                💡 <strong>Coming Soon:</strong> Backend upload functionality will be implemented to automatically parse and add menu items from your file.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid #fed7aa'
          }}>
            <div style={{
              padding: '32px 32px 0 32px',
              borderBottom: '1px solid #f3f4f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#1f2937',
                  margin: 0
                }}>
                  {editingItem ? 'Edit Dish' : 'Add New Dish'}
                </h2>
                <button
                  onClick={resetForm}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                    e.currentTarget.style.color = '#ef4444';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#6b7280';
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="Enter dish name"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                
                {/* Short Code */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Short Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shortCode}
                    onChange={(e) => setFormData({...formData, shortCode: e.target.value.toUpperCase()})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="e.g., DAL, SAM"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
              </div>
              
              {/* Description */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  marginBottom: '6px'
                }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: 'white',
                    resize: 'vertical',
                    minHeight: '80px',
                    transition: 'border-color 0.2s ease'
                  }}
                  rows="3"
                  placeholder="Describe this dish..."
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* Price */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="0.00"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: 'white',
                      transition: 'border-color 0.2s ease'
                    }}
                    placeholder="e.g., appetizer, main-course"
                    onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>
                
                {/* Spice Level */}
                <div>
                  <CustomDropdown
                    label="Spice Level"
                    value={formData.spiceLevel}
                    onChange={(value) => setFormData({...formData, spiceLevel: value})}
                    options={[
                      { value: 'mild', label: 'Mild' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'hot', label: 'Hot' }
                    ]}
                    placeholder="Select spice level"
                  />
                </div>
              </div>
              
              {/* Food Type and Availability */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {/* Food Type */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Food Type
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isVeg: true})}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: formData.isVeg === true ? '#10b981' : 'white',
                        color: formData.isVeg === true ? 'white' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Veg
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isVeg: false})}
                      style={{
                        flex: 1,
                        padding: '10px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: formData.isVeg === false ? '#ef4444' : 'white',
                        color: formData.isVeg === false ? 'white' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      Non-Veg
                    </button>
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    Availability
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isAvailable: true})}
                      style={{
                        padding: '10px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: formData.isAvailable === true ? '#10b981' : 'white',
                        color: formData.isAvailable === true ? 'white' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left'
                      }}
                    >
                      Available
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, isAvailable: false})}
                      style={{
                        padding: '10px 16px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        backgroundColor: formData.isAvailable === false ? '#ef4444' : 'white',
                        color: formData.isAvailable === false ? 'white' : '#6b7280',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'left'
                      }}
                    >
                      Out of Stock
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end',
                paddingTop: '16px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: processing ? '#d1d5db' : '#3b82f6',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: processing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {processing ? 'Processing...' : editingItem ? 'Update Dish' : 'Add Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
          }
          50% { 
            transform: translateY(-10px) rotate(5deg); 
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-4px);
          }
          60% {
            transform: translateY(-2px);
          }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          .menu-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default MenuManagement;