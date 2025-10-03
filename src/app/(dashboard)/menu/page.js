'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BulkMenuUpload from '../../../components/BulkMenuUpload';
import apiClient from '../../../lib/api';
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
  FaSpinner,
  FaExclamationTriangle,
  FaStar,
  FaClock,
  FaHeart,
  FaTh,
  FaList,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaMinus,
  FaCheck,
  FaBars,
  FaSortAmountDown,
  FaCloudUploadAlt,
  FaTimes
} from 'react-icons/fa';

// Enhanced Dropdown Component
const EnhancedDropdown = ({ 
  label, 
  value, 
  onChange, 
  options, 
  placeholder = "Select option",
  allowAddNew = false,
  onAddNew = null,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOption, setNewOption] = useState('');

  const selectedOption = options.find(opt => opt.value === value) || null;
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleAddNew = () => {
    if (newOption.trim() && onAddNew) {
      onAddNew(newOption.trim());
      setNewOption('');
      setShowAddForm(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 flex items-center justify-between transition-all duration-200 hover:border-gray-400"
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <FaChevronDown className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={12} />
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {allowAddNew && (
            <div className="p-3 border-b border-gray-200">
              {!showAddForm ? (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full text-left text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                >
                  <FaPlus size={12} />
                  Add new category
                </button>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Enter new category name"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddNew}
                      className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewOption('');
                      }}
                      className="px-3 py-1 text-xs bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
                className="w-full px-4 py-3 text-left text-sm text-gray-900 hover:bg-gray-50 flex items-center justify-between transition-colors duration-150"
              >
                <span>{option.label}</span>
                {selectedOption?.value === option.value && (
                  <FaCheck className="text-red-500" size={12} />
                )}
            </button>
          ))}
            {filteredOptions.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Compact Menu Item Card Component
const MenuItemCard = ({ item, categories, onEdit, onDelete, onToggleAvailability, getSpiceLevel, getCategoryEmoji }) => {
  const spiceInfo = getSpiceLevel(item.spiceLevel);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
      {/* Header with gradient background */}
      <div className={`h-20 ${item.isVeg ? 'bg-gradient-to-r from-green-100 to-emerald-100' : 'bg-gradient-to-r from-orange-100 to-red-100'} relative overflow-hidden`}>
        {/* Floating shapes */}
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-3 -left-3 w-12 h-12 bg-white bg-opacity-15 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 flex items-center justify-between p-4 h-full">
          <div className="flex items-center gap-3">
            <div className="text-2xl filter drop-shadow-sm">
              {getCategoryEmoji(item.category)}
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${item.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center`}>
              <div className={`w-2 h-2 ${item.isVeg ? 'bg-green-500 rounded-sm' : 'bg-red-500 rounded-full'}`}></div>
            </div>
          </div>
          
          <div className="bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-lg font-bold text-gray-800">₹{item.price}</span>
          </div>
        </div>
        
        {/* Short code badge */}
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          {item.shortCode}
        </div>
        
        {/* Availability badge */}
        {!item.isAvailable && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            OUT
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 text-base mb-2 line-clamp-1">
            {item.name}
          </h3>
          
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm" style={{ color: spiceInfo.color }}>
              {spiceInfo.icon}
            </span>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium">
              {categories.find(c => c.id === item.category)?.name || 'Main Course'}
            </span>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {item.description || 'Delicious dish prepared with finest ingredients'}
        </p>
        
        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-1"
          >
            <FaEdit size={12} />
            Edit
          </button>
          <button
            onClick={() => onToggleAvailability(item.id, item.isAvailable)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center ${
              item.isAvailable 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
            title={item.isAvailable ? 'Mark as Out of Stock' : 'Mark as Available'}
          >
            {item.isAvailable ? <FaMinus size={12} /> : <FaCheck size={12} />}
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
          >
            <FaTrash size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

// List View Item Component
const ListViewItem = ({ item, categories, onEdit, onDelete, onToggleAvailability, getSpiceLevel, getCategoryEmoji }) => {
  const spiceInfo = getSpiceLevel(item.spiceLevel);
  
  return (
    <div className={`flex items-center gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${!item.isAvailable ? 'opacity-60' : ''}`}>
      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${
        item.isVeg ? 'bg-green-100' : 'bg-red-100'
      }`}>
        {getCategoryEmoji(item.category)}
      </div>
      
      {/* Veg indicator */}
      <div className={`w-4 h-4 rounded-full border-2 ${item.isVeg ? 'border-green-500' : 'border-red-500'} flex items-center justify-center`}>
        <div className={`w-2 h-2 ${item.isVeg ? 'bg-green-500 rounded-sm' : 'bg-red-500 rounded-full'}`}></div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-semibold text-gray-900 truncate ${!item.isAvailable ? 'line-through' : ''}`}>
            {item.name}
          </h4>
          <span className="text-xs" style={{ color: spiceInfo.color }}>
            {spiceInfo.icon}
          </span>
          <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-bold">
            {item.shortCode}
          </span>
          {!item.isAvailable && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              OUT
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 truncate">
          {item.description || 'Delicious dish prepared with finest ingredients'}
        </p>
      </div>
      
      {/* Price */}
      <div className="text-lg font-bold text-red-500 min-w-0">
        ₹{item.price}
      </div>
      
      {/* Actions */}
      <div className="flex gap-1">
        <button
          onClick={() => onEdit(item)}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
          title="Edit"
        >
          <FaEdit size={10} />
        </button>
        <button
          onClick={() => onToggleAvailability(item.id, item.isAvailable)}
          className={`p-2 rounded transition-colors duration-200 ${
            item.isAvailable 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
          title={item.isAvailable ? 'Mark as Out of Stock' : 'Mark as Available'}
        >
          {item.isAvailable ? <FaMinus size={10} /> : <FaCheck size={10} />}
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
          title="Delete"
        >
          <FaTrash size={10} />
        </button>
      </div>
    </div>
  );
};

const MenuManagement = () => {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'appetizer', name: 'Appetizers', emoji: '🥗' },
    { id: 'main-course', name: 'Main Course', emoji: '🍽️' },
    { id: 'dessert', name: 'Desserts', emoji: '🍰' },
    { id: 'beverages', name: 'Beverages', emoji: '🥤' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'chinese', name: 'Chinese', emoji: '🥢' },
    { id: 'bread', name: 'Bread', emoji: '🍞' },
    { id: 'rice', name: 'Rice', emoji: '🍚' },
    { id: 'dal', name: 'Dal', emoji: '🍛' },
    { id: 'south-indian', name: 'South Indian', emoji: '🍛' },
    { id: 'north-indian', name: 'North Indian', emoji: '🍽️' },
    { id: 'fast-food', name: 'Fast Food', emoji: '🍔' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVegFilter, setSelectedVegFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [currentRestaurant, setCurrentRestaurant] = useState({ id: 'test-restaurant', name: 'Test Restaurant' });
  const [isClient, setIsClient] = useState(false);
  const [collapsedCategories, setCollapsedCategories] = useState({});
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

  // Generic categories
  const genericCategories = [
    { id: 'appetizer', name: 'Appetizers', emoji: '🥗' },
    { id: 'main-course', name: 'Main Course', emoji: '🍽️' },
    { id: 'dessert', name: 'Desserts', emoji: '🍰' },
    { id: 'beverages', name: 'Beverages', emoji: '🥤' },
    { id: 'rice', name: 'Rice & Biryani', emoji: '🍚' },
    { id: 'bread', name: 'Bread & Roti', emoji: '🥖' },
    { id: 'dal', name: 'Dal & Curry', emoji: '🍛' },
    { id: 'fast-food', name: 'Fast Food', emoji: '🍔' },
    { id: 'chinese', name: 'Chinese', emoji: '🥢' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'south-indian', name: 'South Indian', emoji: '🍛' },
    { id: 'north-indian', name: 'North Indian', emoji: '🍽️' }
  ];

  // Mobile detection with client-side hydration safety
  useEffect(() => {
    setIsClient(true);
  }, []);


  // Get current restaurant context
  useEffect(() => {
    const loadRestaurantContext = async () => {
      try {
        console.log('Loading restaurant context...');
        const userData = localStorage.getItem('user');
        if (!userData) {
          console.log('No user data found, redirecting to login');
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
          console.log('Restaurant ID found:', restaurantId);
          await loadMenuData(restaurantId);
        } else {
          console.log('No restaurant found - showing empty state');
          setError('No restaurant found. Please set up a restaurant first.');
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
      console.log('Loading menu data for restaurant:', restaurantId);
      setLoading(true);
      setError('');

      const menuResponse = await apiClient.getMenu(restaurantId);
      setMenuItems(menuResponse.menuItems || []);

      // Extract unique categories from menu items and merge with generic categories
      const uniqueCategories = [...new Set((menuResponse.menuItems || []).map(item => item.category))];
      const existingCategories = uniqueCategories.map(cat => {
        const generic = genericCategories.find(g => g.id === cat);
        return generic || {
        id: cat,
          name: cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          emoji: '🍽️'
        };
      });
      
      // Merge with generic categories, avoiding duplicates
      const allCategories = [...genericCategories];
      existingCategories.forEach(cat => {
        if (!allCategories.find(g => g.id === cat.id)) {
          allCategories.push(cat);
        }
      });
      
      setCategories(allCategories);

      if (allCategories.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: allCategories[0].id }));
      }

    } catch (error) {
      console.error('Error loading menu data:', error);
      setError('Failed to load menu items');
    } finally {
      console.log('Setting loading to false');
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
    const categoryObj = categories.find(c => c.id === category);
    return categoryObj?.emoji || '🍽️';
  };

  const handleAddNewCategory = (categoryName) => {
    const newCategory = {
      id: categoryName.toLowerCase().replace(/\s+/g, '-'),
      name: categoryName,
      emoji: '🍽️'
    };
    setCategories(prev => [...prev, newCategory]);
    setFormData(prev => ({ ...prev, category: newCategory.id }));
  };

  const toggleCategoryCollapse = (categoryId) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };


  const handleMenuItemsAdded = async () => {
    // Reload menu data when new items are added
    if (currentRestaurant) {
      await loadMenuData(currentRestaurant.id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">Loading menu management...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Menu Management
                </h1>
              <p className="text-gray-600 mt-1">
              {filteredItems.length} items • {currentRestaurant?.name}
              </p>
          </div>
          
            <div className="flex gap-3">
            <button
                onClick={() => setShowBulkUpload(true)}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FaCloudUploadAlt size={14} />
                Bulk Upload
            </button>
            <button
              onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-red-600 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <FaPlus size={14} />
              New Item
            </button>
          </div>
        </div>
              </div>
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                  placeholder="Search dishes, codes, descriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                  />
                </div>
              </div>
              
            {/* Filters */}
            <div className="flex gap-3">
              {/* Veg Filter */}
              <select
                value={selectedVegFilter}
                onChange={(e) => setSelectedVegFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              >
                <option value="all">🍽️ All Types</option>
                <option value="veg">🥬 Vegetarian</option>
                <option value="non-veg">🍖 Non-Vegetarian</option>
              </select>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
              >
                <option value="all">🍽️ All Categories</option>
                    {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.emoji} {category.name}
                  </option>
                ))}
              </select>
              
              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-red-500 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaTh size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-red-500 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaList size={14} />
              </button>
            </div>
          </div>
        </div>
        </div>


        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <FaExclamationTriangle size={16} />
            {error}
          </div>
        )}

        {/* Menu Items */}
        {filteredItems.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  categories={categories}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleAvailability={handleToggleAvailability}
                  getSpiceLevel={getSpiceLevel}
                  getCategoryEmoji={getCategoryEmoji}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {['appetizer', 'main-course', 'dessert', 'beverages', 'pizza', 'chinese', 'bread', 'rice', 'dal', 'south-indian', 'north-indian', 'fast-food'].filter(cat => 
                filteredItems.some(item => item.category === cat)
              ).map(category => {
                const categoryItems = filteredItems.filter(item => item.category === category);
                const categoryInfo = categories.find(c => c.id === category);
                const isCollapsed = collapsedCategories[category];
                
                return (
                <div key={category}>
                    <button
                      onClick={() => toggleCategoryCollapse(category)}
                      className="w-full bg-gray-50 px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{categoryInfo?.emoji || '🍽️'}</span>
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">
                          {categoryInfo?.name || category.split('-').join(' ')}
                    </h3>
                        <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                          {categoryItems.length} items
                    </span>
                  </div>
                      {isCollapsed ? <FaChevronDown size={16} /> : <FaChevronUp size={16} />}
                    </button>
                    
                    {!isCollapsed && categoryItems.map((item) => (
                      <ListViewItem
                        key={item.id} 
                        item={item}
                        categories={categories}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleAvailability={handleToggleAvailability}
                        getSpiceLevel={getSpiceLevel}
                        getCategoryEmoji={getCategoryEmoji}
                      />
                    ))}
                      </div>
                    );
                  })}
            </div>
          )
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            background: 'linear-gradient(135deg, rgb(255 246 241) 0%, rgb(254 245 242) 50%, rgb(255 244 243) 100%)',
            borderRadius: '24px',
            border: '1px solid rgba(239, 68, 68, 0.1)',
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
                radial-gradient(circle at 20% 80%, rgba(239, 68, 68, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(239, 68, 68, 0.05) 0%, transparent 50%)
              `,
              zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{
                width: '100px',
                height: '100px',
                backgroundColor: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                animation: 'bounce 2s infinite'
              }}>
                <FaUtensils size={40} style={{ color: '#ef4444' }} />
              </div>
              
              <h3 style={{
                fontSize: '32px',
                fontWeight: 'bold',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626, #b91c1c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                {searchTerm ? 'No dishes found' : 'Menu Management Ready! 🍽️'}
              </h3>
              
              <p style={{
                fontSize: '18px',
                color: '#374151',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                {searchTerm ? 'Try different search terms' : 'Create Your Restaurant Menu'}
              </p>
              
              <p style={{
                color: '#6b7280',
                marginBottom: '32px',
                maxWidth: '500px',
                margin: '0 auto 32px auto',
                fontSize: '16px',
                lineHeight: '1.6'
              }}>
                {searchTerm 
                  ? 'Try searching for something else or check out all our delicious categories.' 
                  : 'Set up your restaurant first, then start building your amazing menu with delicious dishes, categories, and pricing.'
                }
              </p>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {searchTerm ? (
                  <button
                    onClick={() => setSearchTerm('')}
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
                    Clear Search
                  </button>
                ) : (
                  <>
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
                  </>
                )}
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
        )}
      </div>


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
                  <EnhancedDropdown
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

      {/* Bulk Upload Modal */}
      <BulkMenuUpload
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        restaurantId={currentRestaurant?.id}
        onMenuItemsAdded={handleMenuItemsAdded}
        currentMenuItems={menuItems}
      />

    </div>
  );
};

export default MenuManagement;