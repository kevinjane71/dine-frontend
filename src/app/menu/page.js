'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
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
  FaThLarge,
  FaList
} from 'react-icons/fa';

const MenuManagement = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('dine_cart');
    localStorage.removeItem('dine_saved_order');
    router.push('/login');
  };

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
    <div style={{ minHeight: '100vh', backgroundColor: '#fef7f0' }}>
      <Header handleLogout={handleLogout} />
      
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '24px', 
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          marginBottom: '24px',
          border: '1px solid #fed7aa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '56px', 
                height: '56px', 
                background: 'linear-gradient(135deg, #10b981, #059669)', 
                borderRadius: '16px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <FaUtensils color="white" size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>
                  Menu Management
                </h1>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>
                  Manage your restaurant menu items and categories • {filteredItems.length} items
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
              }}
            >
              <FaPlus size={14} />
              Add New Item
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '20px',
          marginBottom: '24px',
          border: '1px solid #fed7aa'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            {/* Search */}
            <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
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
                placeholder="Search menu items by name or code..."
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
                  backgroundColor: '#fef7f0',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.backgroundColor = 'white';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.backgroundColor = '#fef7f0';
                }}
              />
            </div>
            
            {/* Category Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFilter style={{ color: '#6b7280', fontSize: '14px' }} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: '#fef7f0',
                  color: '#374151',
                  fontWeight: '500',
                  minWidth: '180px'
                }}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            
            {/* Quick Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                  {menuItems.length}
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                  Total Items
                </div>
              </div>
              <div style={{ width: '1px', height: '30px', backgroundColor: '#e5e7eb' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                  {categories.length}
                </div>
                <div style={{ fontSize: '10px', color: '#6b7280', fontWeight: '500' }}>
                  Categories
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}>
          {filteredItems.map((item) => (
            <div key={item.id} style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: '1px solid #fed7aa',
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
              {/* Item Image */}
              <div style={{
                height: '180px',
                background: 'linear-gradient(135deg, #fed7aa, #fdba74)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <FaUtensils size={48} style={{ color: 'rgba(120, 113, 108, 0.3)' }} />
                
                {/* Badges */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  gap: '8px'
                }}>
                  {item.isVeg ? (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: '2px solid #10b981',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#10b981',
                        borderRadius: '50%'
                      }} />
                    </div>
                  ) : (
                    <div style={{
                      width: '24px',
                      height: '24px',
                      border: '2px solid #ef4444',
                      backgroundColor: 'white',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%'
                      }} />
                    </div>
                  )}
                  <div style={{
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {getSpiceIcon(item.spiceLevel)}
                  </div>
                </div>
                
                {/* Short Code */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px'
                }}>
                  {item.shortCode}
                </div>
              </div>
              
              {/* Item Details */}
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: '#1f2937',
                    margin: '0 0 6px 0',
                    lineHeight: '1.3'
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    lineHeight: '1.5',
                    margin: 0
                  }}>
                    {item.description}
                  </p>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px'
                }}>
                  <div>
                    <span style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#ef4444'
                    }}>
                      ₹{item.price}
                    </span>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginTop: '2px'
                    }}>
                      <FaTags size={10} style={{ color: '#9ca3af' }} />
                      <span style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        fontWeight: '500',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {categories.find(c => c.id === item.category)?.name}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleEdit(item)}
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#3b82f6';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FaEdit size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      fontWeight: '600',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#dc2626';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '80px 20px',
            backgroundColor: 'white',
            borderRadius: '20px',
            border: '1px solid #fed7aa'
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
              <FaUtensils size={32} style={{ color: '#d1d5db' }} />
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#374151',
              margin: '0 0 8px 0'
            }}>
              No menu items found
            </h3>
            <p style={{
              color: '#6b7280',
              margin: '0 0 20px 0',
              fontSize: '14px'
            }}>
              {searchTerm ? 'Try adjusting your search or filters' : 'Add some items to get started'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <FaPlus size={12} />
              Add First Item
            </button>
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
            border: '1px solid #fed7aa'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #f3f4f6',
              background: 'linear-gradient(135deg, #fef7f0, #fed7aa)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#ef4444',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FaUtensils color="white" size={18} />
                </div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: 0
                }}>
                  {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                </h2>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Name */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Item Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      transition: 'all 0.2s'
                    }}
                    placeholder="Enter item name"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.backgroundColor = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#fef7f0';
                    }}
                  />
                </div>
                
                {/* Short Code */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Short Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shortCode}
                    onChange={(e) => setFormData({...formData, shortCode: e.target.value.toUpperCase()})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      transition: 'all 0.2s'
                    }}
                    placeholder="e.g., ATB"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.backgroundColor = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#fef7f0';
                    }}
                  />
                </div>
              </div>
              
              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
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
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#fef7f0',
                    resize: 'vertical',
                    minHeight: '80px',
                    transition: 'all 0.2s'
                  }}
                  rows="3"
                  placeholder="Enter item description"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#fef7f0';
                  }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Price */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Price (₹)
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
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0',
                      transition: 'all 0.2s'
                    }}
                    placeholder="0.00"
                    onFocus={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.backgroundColor = 'white';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = '#fef7f0';
                    }}
                  />
                </div>
                
                {/* Category */}
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
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0'
                    }}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Spice Level */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Spice Level
                  </label>
                  <select
                    value={formData.spiceLevel}
                    onChange={(e) => setFormData({...formData, spiceLevel: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#fef7f0'
                    }}
                  >
                    <option value="mild">🌶️ Mild</option>
                    <option value="medium">🌶️🌶️ Medium</option>
                    <option value="hot">🌶️🌶️🌶️ Hot</option>
                  </select>
                </div>
              </div>
              
              {/* Veg/Non-Veg */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  Food Type
                </label>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: formData.isVeg === true ? '2px solid #10b981' : '2px solid #e5e7eb',
                    backgroundColor: formData.isVeg === true ? '#ecfdf5' : '#fef7f0',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="radio"
                      checked={formData.isVeg === true}
                      onChange={() => setFormData({...formData, isVeg: true})}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #10b981',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#10b981',
                        borderRadius: '50%'
                      }} />
                    </div>
                    <span style={{ fontWeight: '500', color: '#374151' }}>🥬 Vegetarian</span>
                  </label>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: formData.isVeg === false ? '2px solid #ef4444' : '2px solid #e5e7eb',
                    backgroundColor: formData.isVeg === false ? '#fef2f2' : '#fef7f0',
                    transition: 'all 0.2s'
                  }}>
                    <input
                      type="radio"
                      checked={formData.isVeg === false}
                      onChange={() => setFormData({...formData, isVeg: false})}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid #ef4444',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'white'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#ef4444',
                        borderRadius: '50%'
                      }} />
                    </div>
                    <span style={{ fontWeight: '500', color: '#374151' }}>🍖 Non-Vegetarian</span>
                  </label>
                </div>
              </div>
              
              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '12px',
                paddingTop: '20px',
                borderTop: '1px solid #f3f4f6'
              }}>
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#4b5563';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#6b7280';
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
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
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <FaSave size={14} />
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