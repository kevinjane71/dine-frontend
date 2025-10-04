'use client';

import { useState, useEffect, useRef } from 'react';
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

// Custom Dropdown Component
const CustomDropdown = ({ value, onChange, options, placeholder, style = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedOption = options.find(opt => opt.value === value) || null;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  return (
    <div ref={dropdownRef} style={{ position: 'relative', ...style }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '10px 12px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          backgroundColor: '#f9fafb',
          color: '#374151',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          outline: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: '120px',
          width: '100%'
        }}
        onFocus={(e) => {
          e.target.style.backgroundColor = '#ffffff';
          e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
        }}
        onBlur={(e) => {
          e.target.style.backgroundColor = '#f9fafb';
          e.target.style.boxShadow = 'none';
        }}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <FaChevronDown 
          size={12} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            color: '#9ca3af'
          }} 
        />
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          border: '1px solid #e5e7eb',
          zIndex: 50,
          marginTop: '4px',
          overflow: 'hidden'
        }}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: 'none',
                backgroundColor: value === option.value ? '#f3f4f6' : 'transparent',
                color: '#374151',
                fontSize: '14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (value !== option.value) {
                  e.target.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option.value) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              {option.icon && <span style={{ fontSize: '12px' }}>{option.icon}</span>}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Ultra Compact Menu Item Card Component
const MenuItemCard = ({ item, categories, onEdit, onDelete, onToggleAvailability, getSpiceLevel, getCategoryEmoji, onItemClick }) => {
  const spiceInfo = getSpiceLevel(item.spiceLevel);
  
  return (
    <div 
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        opacity: !item.isAvailable ? 0.6 : 1,
        position: 'relative',
        height: '140px',
        cursor: 'pointer'
      }}
      onClick={() => onItemClick(item)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
      }}>
      {/* Main Card Content */}
      <div style={{
        height: '100px',
        background: '#ffffff',
        padding: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        transition: 'all 0.3s ease',
        borderBottom: '1px solid #f3f4f6'
      }}>
        {/* Left Side - Icon and Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <div style={{ fontSize: '16px' }}>
              {getCategoryEmoji(item.category)}
            </div>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            border: `2px solid ${item.isVeg ? '#22c55e' : '#ef4444'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff'
          }}>
            <div style={{
              width: '4px',
              height: '4px',
              backgroundColor: item.isVeg ? '#22c55e' : '#ef4444',
              borderRadius: item.isVeg ? '1px' : '50%'
            }} />
            </div>
          <div style={{ flex: 1 }}>
            <h3 style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0,
              marginBottom: '2px',
              lineHeight: '1.2'
            }}>
              {item.name}
            </h3>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{
                fontSize: '10px',
                color: spiceInfo.color
              }}>
                {spiceInfo.icon}
              </span>
              <span style={{
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                padding: '1px 4px',
                borderRadius: '4px',
                fontSize: '9px',
                fontWeight: '500'
              }}>
                {categories.find(c => c.id === item.category)?.name || 'Main Course'}
              </span>
          </div>
          </div>
        </div>
        
        {/* Right Side - Price */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '4px 8px',
          borderRadius: '6px',
          border: '1px solid #e5e7eb',
          marginLeft: '8px'
        }}>
          <span style={{
            fontSize: '14px',
            fontWeight: '700',
            color: '#ef4444'
          }}>
            ₹{item.price}
          </span>
        </div>
        
        {/* Short code badge */}
        <div style={{
          position: 'absolute',
          top: '6px',
          left: '6px',
          background: '#ef4444',
          color: 'white',
          padding: '1px 4px',
          borderRadius: '4px',
          fontSize: '8px',
          fontWeight: '600'
        }}>
          {item.shortCode}
        </div>
        
        {/* Availability badge */}
        {!item.isAvailable && (
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            background: '#dc2626',
            color: 'white',
            padding: '1px 4px',
            borderRadius: '4px',
            fontSize: '8px',
            fontWeight: '600'
          }}>
            OUT
          </div>
        )}
      </div>
      
      {/* Action buttons - Always visible */}
      <div style={{
        padding: '8px 12px',
        backgroundColor: '#ffffff',
        borderTop: '1px solid #f3f4f6',
        display: 'flex',
        gap: '6px'
      }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
          style={{
            flex: 1,
            padding: '6px 8px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
          }}
        >
          <FaEdit size={10} />
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleAvailability(item.id, item.isAvailable);
            }}
          style={{
            padding: '6px 8px',
            background: item.isAvailable 
              ? 'linear-gradient(135deg, #f97316, #ea580c)' 
              : 'linear-gradient(135deg, #22c55e, #16a34a)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px',
            boxShadow: item.isAvailable 
              ? '0 2px 4px rgba(249, 115, 22, 0.2)' 
              : '0 2px 4px rgba(34, 197, 94, 0.2)'
          }}
            title={item.isAvailable ? 'Mark as Out of Stock' : 'Mark as Available'}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            if (item.isAvailable) {
              e.target.style.boxShadow = '0 4px 8px rgba(249, 115, 22, 0.3)';
            } else {
              e.target.style.boxShadow = '0 4px 8px rgba(34, 197, 94, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            if (item.isAvailable) {
              e.target.style.boxShadow = '0 2px 4px rgba(249, 115, 22, 0.2)';
            } else {
              e.target.style.boxShadow = '0 2px 4px rgba(34, 197, 94, 0.2)';
            }
          }}
        >
          {item.isAvailable ? <FaMinus size={10} /> : <FaCheck size={10} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
          style={{
            padding: '6px 8px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '10px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '32px',
            boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
          }}
        >
          <FaTrash size={10} />
          </button>
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

// Item Detail Modal Component
const ItemDetailModal = ({ item, categories, isOpen, onClose, onEdit, onDelete, onToggleAvailability, getSpiceLevel, getCategoryEmoji }) => {
  if (!isOpen || !item) return null;

  const spiceInfo = getSpiceLevel(item.spiceLevel);
  const category = categories.find(c => c.id === item.category);

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            position: 'relative',
            animation: 'slideInFromRight 0.3s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '24px 24px 16px 24px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '24px' }}>
                {getCategoryEmoji(item.category)}
              </div>
              <div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#1f2937',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  {item.name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: `2px solid ${item.isVeg ? '#22c55e' : '#ef4444'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#ffffff'
                  }}>
                    <div style={{
                      width: '6px',
                      height: '6px',
                      backgroundColor: item.isVeg ? '#22c55e' : '#ef4444',
                      borderRadius: item.isVeg ? '1px' : '50%'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    fontWeight: '500'
                  }}>
                    {item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                color: '#9ca3af',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#9ca3af';
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px' }}>
            {/* Price */}
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#ef4444',
                marginBottom: '4px'
              }}>
                ₹{item.price}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6b7280',
                fontWeight: '500'
              }}>
                Price per serving
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0,
                marginBottom: '8px'
              }}>
                Description
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.6',
                margin: 0
              }}>
                {item.description || 'Delicious dish prepared with finest ingredients and authentic flavors.'}
              </p>
            </div>

            {/* Details */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                margin: 0,
                marginBottom: '12px'
              }}>
                Details
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Category</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {category?.name || 'Main Course'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Spice Level</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: spiceInfo.color }}>
                    {spiceInfo.icon} {spiceInfo.label}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Short Code</span>
                  <span style={{ fontSize: '14px', fontWeight: '500', color: '#1f2937' }}>
                    {item.shortCode}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Status</span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: item.isAvailable ? '#22c55e' : '#ef4444',
                    backgroundColor: item.isAvailable ? '#dcfce7' : '#fef2f2',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {item.isAvailable ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            padding: '16px 24px 24px 24px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            gap: '12px'
          }}>
            <button
              onClick={() => {
                onEdit(item);
                onClose();
              }}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
              }}
            >
              <FaEdit size={14} />
              Edit Item
            </button>
            <button
              onClick={() => {
                onToggleAvailability(item.id, item.isAvailable);
                onClose();
              }}
              style={{
                padding: '12px 16px',
                background: item.isAvailable 
                  ? 'linear-gradient(135deg, #f97316, #ea580c)'
                  : 'linear-gradient(135deg, #22c55e, #16a34a)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minWidth: '120px',
                boxShadow: item.isAvailable 
                  ? '0 2px 4px rgba(249, 115, 22, 0.2)' 
                  : '0 2px 4px rgba(34, 197, 94, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                if (item.isAvailable) {
                  e.target.style.boxShadow = '0 4px 8px rgba(249, 115, 22, 0.3)';
                } else {
                  e.target.style.boxShadow = '0 4px 8px rgba(34, 197, 94, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                if (item.isAvailable) {
                  e.target.style.boxShadow = '0 2px 4px rgba(249, 115, 22, 0.2)';
                } else {
                  e.target.style.boxShadow = '0 2px 4px rgba(34, 197, 94, 0.2)';
                }
              }}
            >
              {item.isAvailable ? <FaMinus size={14} /> : <FaCheck size={14} />}
              {item.isAvailable ? 'Mark Out' : 'Mark Available'}
            </button>
            <button
              onClick={() => {
                onDelete(item.id);
                onClose();
              }}
              style={{
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minWidth: '100px',
                boxShadow: '0 2px 4px rgba(239, 68, 68, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(239, 68, 68, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(239, 68, 68, 0.2)';
              }}
            >
              <FaTrash size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @media (max-width: 768px) {
          @keyframes slideInFromRight {
            from {
              transform: translateY(100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        }
      `}</style>
    </>
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
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);
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

  // Listen for restaurant changes from navigation
  useEffect(() => {
    const handleRestaurantChange = (event) => {
      console.log('🏪 Menu page: Restaurant changed, reloading data', event.detail);
      // Reload restaurant context and menu data
      const loadRestaurantContext = async () => {
        try {
          const userData = localStorage.getItem('user');
          if (!userData) return;

          const user = JSON.parse(userData);
          let restaurantId = null;

          if (user.restaurantId) {
            restaurantId = user.restaurantId;
          } else if (user.role === 'owner' || user.role === 'admin') {
            const restaurantsResponse = await apiClient.getRestaurants();
            const restaurants = restaurantsResponse.restaurants || [];
            const savedRestaurantId = localStorage.getItem('selectedRestaurantId');
            const selectedRestaurant = restaurants.find(r => r.id === savedRestaurantId) || restaurants[0];
            restaurantId = selectedRestaurant?.id;
            setCurrentRestaurant(selectedRestaurant);
          }

          if (restaurantId) {
            await loadMenuData(restaurantId);
          }
        } catch (error) {
          console.error('Error reloading restaurant context:', error);
        }
      };

      loadRestaurantContext();
    };

    window.addEventListener('restaurantChanged', handleRestaurantChange);

    return () => {
      window.removeEventListener('restaurantChanged', handleRestaurantChange);
    };
  }, []);

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

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleCloseModal = () => {
    setShowItemModal(false);
    setSelectedItem(null);
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
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'auto'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '20px', 
        position: 'relative',
        paddingBottom: '40px'
      }}>
        {/* Compact Header */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
              <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                margin: 0,
                marginBottom: '4px'
              }}>
                Menu Management
                </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: 0
              }}>
              {filteredItems.length} items • {currentRestaurant?.name}
              </p>
          </div>
          
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
            <button
                onClick={() => setShowBulkUpload(true)}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #f97316, #ef4444)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaCloudUploadAlt size={12} />
                Bulk Upload
            </button>
            <button
              onClick={() => setShowAddForm(true)}
                style={{
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaPlus size={12} />
              New Item
            </button>
          </div>
        </div>
              </div>
        {/* Compact Filters */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '16px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Search Bar */}
            <div style={{ flex: 1, minWidth: '250px' }}>
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
                  placeholder="Search dishes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: '#f9fafb',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = '#ffffff';
                    e.target.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                  />
                </div>
              </div>
              
            {/* Filter Buttons */}
            <div style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {/* Veg Filter */}
              <CustomDropdown
                value={selectedVegFilter}
                onChange={setSelectedVegFilter}
                options={[
                  { value: 'all', label: 'All Types', icon: '🍽️' },
                  { value: 'veg', label: 'Vegetarian', icon: '🥬' },
                  { value: 'non-veg', label: 'Non-Vegetarian', icon: '🍖' }
                ]}
                placeholder="All Types"
                style={{ minWidth: '120px' }}
              />

              {/* Category Filter */}
              <CustomDropdown
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: 'all', label: 'All Categories', icon: '🍽️' },
                  ...categories.map(category => ({ 
                    value: category.id, 
                    label: category.name, 
                    icon: category.emoji 
                  }))
                ]}
                placeholder="All Categories"
                style={{ minWidth: '140px' }}
              />
              
              {/* View Toggle */}
              <div style={{
                display: 'flex',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                padding: '2px'
              }}>
              <button
                onClick={() => setViewMode('grid')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewMode === 'grid' ? '#ef4444' : 'transparent',
                    color: viewMode === 'grid' ? 'white' : '#6b7280',
                    fontWeight: '500',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <FaTh size={12} />
                  Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: viewMode === 'list' ? '#ef4444' : 'transparent',
                    color: viewMode === 'list' ? 'white' : '#6b7280',
                    fontWeight: '500',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <FaList size={12} />
                  List
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

        {/* Ultra Compact Menu Items Grid */}
        {filteredItems.length > 0 ? (
          viewMode === 'grid' ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '12px',
              padding: '0'
            }}>
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.03}s both`
                  }}
                >
                  <MenuItemCard
                  item={item}
                  categories={categories}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleAvailability={handleToggleAvailability}
                  getSpiceLevel={getSpiceLevel}
                  getCategoryEmoji={getCategoryEmoji}
                  onItemClick={handleItemClick}
                />
                </div>
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
                🚀 Transform Your Vision 📱
              </h3>
              
              <p style={{
                fontSize: '18px',
                color: '#374151',
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                {searchTerm ? 'Try different search terms' : 'From Photo to Full Menu in Minutes!'}
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
                  : 'Transform your restaurant vision into reality! Upload your menu photo and let AI build it, or start creating dishes manually.'
                }
              </p>
              
              <div style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                alignItems: 'center'
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
                    {/* AI Upload Button - Main Action */}
                    <button
                      onClick={() => setShowBulkUpload(true)}
                      style={{
                        padding: '18px 36px',
                        background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '14px',
                        fontWeight: '700',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 6px 20px rgba(139, 92, 246, 0.3)',
                        transform: 'translateY(0)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        minWidth: '220px',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-3px)';
                        e.target.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.3)';
                      }}
                    >
                      🤖 Upload Menu & Build with AI
                    </button>
                    
                    {/* Add Item Button */}
                    <button
                      onClick={() => setShowAddForm(true)}
                      style={{
                        padding: '16px 28px',
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '15px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
                        transform: 'translateY(0)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        justifyContent: 'center'
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
                      <FaPlus size={16} />
                      Add New Item
                    </button>
                    
                    {/* Set Up Restaurant Link */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '12px 16px',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0',
                      fontSize: '14px',
                      color: '#64748b',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#ef4444';
                      e.target.style.color = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.color = '#64748b';
                    }}
                    onClick={() => router.push('/dashboard')}
                    >
                      <FaHome size={14} />
                      Set Up Restaurant First
                    </div>
                  </>
                )}
              </div>
            </div>
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

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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
      `}</style>
      
      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        categories={categories}
        isOpen={showItemModal}
        onClose={handleCloseModal}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleAvailability={handleToggleAvailability}
        getSpiceLevel={getSpiceLevel}
        getCategoryEmoji={getCategoryEmoji}
      />
    </div>
  );
};

export default MenuManagement;