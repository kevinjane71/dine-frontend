'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaSave, 
  FaImage,
  FaUtensils,
  FaFire,
  FaLeaf
} from 'react-icons/fa';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'fast-food', name: 'Fast Food' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'chinese', name: 'Chinese' },
    { id: 'pizza', name: 'Pizza' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'starters', name: 'Starters' },
    { id: 'main-course', name: 'Main Course' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'fast-food',
    isVeg: true,
    spiceLevel: 'medium',
    shortCode: '',
    image: ''
  });

  // Mock data - replace with API calls
  useEffect(() => {
    const mockItems = [
      { id: 1, name: 'Aloo Tikki Burger', price: 249, category: 'fast-food', isVeg: true, spiceLevel: 'medium', shortCode: 'ATB', description: 'Crispy potato patty with fresh veggies' },
      { id: 2, name: 'Cheese Garlic Bread', price: 189, category: 'fast-food', isVeg: true, spiceLevel: 'mild', shortCode: 'CGB', description: 'Buttery bread with melted cheese' },
      { id: 3, name: 'Chicken Angara', price: 349, category: 'chinese', isVeg: false, spiceLevel: 'hot', shortCode: 'CAB', description: 'Spicy boneless chicken' },
      { id: 4, name: 'Chili Mushroom', price: 229, category: 'chinese', isVeg: true, spiceLevel: 'medium', shortCode: 'CM', description: 'Stir-fried mushrooms in chili sauce' },
    ];
    setMenuItems(mockItems);
  }, []);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.shortCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setMenuItems(items => items.map(item => 
        item.id === editingItem.id ? { ...formData, id: editingItem.id } : item
      ));
      setEditingItem(null);
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        price: parseFloat(formData.price)
      };
      setMenuItems(items => [...items, newItem]);
    }
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'fast-food',
      isVeg: true,
      spiceLevel: 'medium',
      shortCode: '',
      image: ''
    });
    setShowAddForm(false);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingItem(item);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(items => items.filter(item => item.id !== id));
    }
  };

  const getSpiceIcon = (level) => {
    const spiceColors = {
      mild: '#10b981',
      medium: '#f59e0b', 
      hot: '#ef4444'
    };
    return <FaFire style={{ color: spiceColors[level] }} />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Menu Management</h1>
            <p className="text-gray-600">Manage your restaurant menu items and categories</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 hover:shadow-lg"
          >
            <FaPlus size={16} />
            Add New Item
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Item Image */}
              <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center relative">
                <FaUtensils size={32} className="text-gray-400" />
                <div className="absolute top-3 right-3 flex gap-2">
                  {item.isVeg ? (
                    <div className="w-6 h-6 border-2 border-green-500 bg-white rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-red-500 bg-white rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                  )}
                  <div className="bg-white rounded-full p-1">
                    {getSpiceIcon(item.spiceLevel)}
                  </div>
                </div>
                <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
                  {item.shortCode}
                </div>
              </div>
              
              {/* Item Details */}
              <div className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary">₹{item.price}</span>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      {categories.find(c => c.id === item.category)?.name}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FaEdit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <FaUtensils size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No menu items found</h3>
            <p className="text-gray-500">Add some items to get started or adjust your filters.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter item name"
                  />
                </div>
                
                {/* Short Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Code</label>
                  <input
                    type="text"
                    required
                    value={formData.shortCode}
                    onChange={(e) => setFormData({...formData, shortCode: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., ATB"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                  placeholder="Enter item description"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Spice Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spice Level</label>
                  <select
                    value={formData.spiceLevel}
                    onChange={(e) => setFormData({...formData, spiceLevel: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="hot">Hot</option>
                  </select>
                </div>
              </div>
              
              {/* Veg/Non-Veg */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Food Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.isVeg === true}
                      onChange={() => setFormData({...formData, isVeg: true})}
                      className="text-primary focus:ring-primary"
                    />
                    <div className="w-6 h-6 border-2 border-green-500 rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span>Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.isVeg === false}
                      onChange={() => setFormData({...formData, isVeg: false})}
                      className="text-primary focus:ring-primary"
                    />
                    <div className="w-6 h-6 border-2 border-red-500 rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                    <span>Non-Vegetarian</span>
                  </label>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category: 'fast-food',
                      isVeg: true,
                      spiceLevel: 'medium',
                      shortCode: '',
                      image: ''
                    });
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaSave size={16} />
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManagement;