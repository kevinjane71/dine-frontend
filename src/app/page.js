'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FaSearch, 
  FaShoppingCart, 
  FaPlus, 
  FaMinus, 
  FaCreditCard, 
  FaMoneyBillWave,
  FaPrint,
  FaSave,
  FaUtensils,
  FaCoffee,
  FaHamburger,
  FaHeart,
  FaFire,
  FaChair,
  FaEdit,
  FaTimes
} from 'react-icons/fa';

export default function RestaurantPOS() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('Fast Food');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [quickSearch, setQuickSearch] = useState('');
  const [orderType, setOrderType] = useState('dine-in');
  const [selectedTable, setSelectedTable] = useState(null);
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [manualTableNumber, setManualTableNumber] = useState('');

  const categories = [
    { id: 'fast-food', name: 'Fast Food', emoji: '🍔' },
    { id: 'beverages', name: 'Beverages', emoji: '🥤' },
    { id: 'chinese', name: 'Chinese', emoji: '🥡' },
    { id: 'pizza', name: 'Pizza', emoji: '🍕' },
    { id: 'desserts', name: 'Desserts', emoji: '🍰' },
    { id: 'main-course', name: 'Main Course', emoji: '🍛' },
  ];

  const menuItems = [
    { id: 1, name: 'Aloo Tikki Burger', price: 249, category: 'fast-food', isVeg: true, description: 'Crispy potato patty with fresh veggies' },
    { id: 2, name: 'Cheese Garlic Bread', price: 189, category: 'fast-food', isVeg: true, description: 'Buttery bread with melted cheese' },
    { id: 3, name: 'Fresh Lime Water', price: 79, category: 'beverages', isVeg: true, description: 'Refreshing lemon drink' },
    { id: 4, name: 'Masala Chai', price: 59, category: 'beverages', isVeg: true, description: 'Traditional spiced tea' },
    { id: 5, name: 'Chicken Angara', price: 349, category: 'chinese', isVeg: false, description: 'Spicy boneless chicken' },
    { id: 6, name: 'Chili Mushroom', price: 229, category: 'chinese', isVeg: true, description: 'Stir-fried mushrooms in chili sauce' },
    { id: 7, name: 'Margherita Pizza', price: 299, category: 'pizza', isVeg: true, description: 'Classic tomato and mozzarella' },
    { id: 8, name: 'Chocolate Brownie', price: 179, category: 'desserts', isVeg: true, description: 'Rich chocolate brownie with ice cream' },
    { id: 9, name: 'Butter Chicken', price: 399, category: 'main-course', isVeg: false, description: 'Creamy tomato chicken curry' },
    { id: 10, name: 'Dal Makhani', price: 249, category: 'main-course', isVeg: true, description: 'Rich black lentil curry' },
  ];

  // Handle table parameters from URL
  useEffect(() => {
    const tableParam = searchParams.get('table');
    const floorParam = searchParams.get('floor');
    const capacityParam = searchParams.get('capacity');
    
    if (tableParam) {
      setSelectedTable({
        name: tableParam,
        floor: floorParam,
        capacity: capacityParam
      });
      setOrderType('dine-in'); // Force dine-in when table is selected
    }
  }, [searchParams]);

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All Items' || 
                          item.category === categories.find(c => c.name === selectedCategory)?.id;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        // Move updated item to top
        const updatedCart = prevCart.filter(cartItem => cartItem.id !== item.id);
        return [{ ...existingItem, quantity: existingItem.quantity + 1 }, ...updatedCart];
      }
      // Add new item to top
      return [{ ...item, quantity: 1 }, ...prevCart];
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      return prevCart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0);
    });
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleQuickSearch = (e) => {
    if (e.key === 'Enter' && quickSearch.trim()) {
      const searchValue = quickSearch.trim().toLowerCase();
      const foundItem = menuItems.find(item => 
        item.shortCode.toLowerCase() === searchValue || 
        item.name.toLowerCase().includes(searchValue)
      );
      
      if (foundItem) {
        addToCart(foundItem);
        setQuickSearch('');
      }
    }
  };

  const getItemQuantityInCart = (itemId) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  const handleManualTableSelection = () => {
    if (manualTableNumber.trim()) {
      setSelectedTable({
        name: manualTableNumber.trim(),
        floor: 'Manual Entry',
        capacity: 'N/A'
      });
      setManualTableNumber('');
      setShowTableSelector(false);
    }
  };

  const clearSelectedTable = () => {
    setSelectedTable(null);
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <div style={{ height: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', padding: '12px 16px', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#e53e3e', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaUtensils color="white" size={16} />
              </div>
              <div>
                <h1 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Dine POS</h1>
                {selectedTable && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <FaChair size={12} color="#e53e3e" />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#e53e3e' }}>
                      {selectedTable.name} - {selectedTable.floor} {selectedTable.capacity !== 'N/A' && `(${selectedTable.capacity} seats)`}
                    </span>
                    <button
                      onClick={clearSelectedTable}
                      style={{
                        marginLeft: '6px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#f3f4f6',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6b7280'
                      }}
                    >
                      <FaTimes size={8} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order Type Selector */}
            <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '12px', padding: '4px' }}>
              {['dine-in', 'delivery', 'pickup'].map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: orderType === type ? 'white' : 'transparent',
                    color: orderType === type ? '#e53e3e' : '#6b7280',
                    boxShadow: orderType === type ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {type === 'dine-in' ? '🍽️ Dine In' : type === 'delivery' ? '🚚 Delivery' : '🥡 Pickup'}
                </button>
              ))}
            </div>
            
            {/* Table Selection Button - Only show for dine-in without table */}
            {orderType === 'dine-in' && !selectedTable && (
              <button
                onClick={() => setShowTableSelector(true)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '12px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <FaChair size={12} />
                Select Table
              </button>
            )}
          </div>
          
          <div style={{ color: '#374151', textAlign: 'right' }}>
            <p style={{ fontWeight: '600', margin: 0, fontSize: '14px' }}>Restaurant Name</p>
            <p style={{ fontSize: '10px', color: '#6b7280', margin: 0 }}>📞 9034142334</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Categories Sidebar */}
        <div style={{ width: '240px', backgroundColor: 'white', borderRight: '2px solid #e5e7eb', boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '12px' }}>Categories</h2>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={14} />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '36px',
                  paddingRight: '12px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: '#f9fafb',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          
          <div style={{ padding: '8px', overflowY: 'auto', height: 'calc(100% - 100px)' }}>
            <button
              onClick={() => setSelectedCategory('All Items')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: selectedCategory === 'All Items' ? '#e53e3e' : 'transparent',
                color: selectedCategory === 'All Items' ? 'white' : '#374151',
                transition: 'all 0.2s',
                fontSize: '13px'
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                backgroundColor: selectedCategory === 'All Items' ? 'rgba(255,255,255,0.2)' : '#f3f4f6'
              }}>
                🍽️
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px' }}>All Items</div>
                <div style={{ fontSize: '10px', opacity: 0.8 }}>{menuItems.length} items</div>
              </div>
            </button>
            
            {categories.map((category) => {
              const categoryItems = menuItems.filter(item => item.category === category.id);
              const isSelected = selectedCategory === category.name;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isSelected ? '#e53e3e' : 'transparent',
                    color: isSelected ? 'white' : '#374151',
                    transition: 'all 0.2s',
                    fontSize: '13px'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#f3f4f6'
                  }}>
                    {category.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{category.name}</div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>{categoryItems.length} items</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '8px 12px', backgroundColor: 'white', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                  {selectedCategory}
                </h2>
                <p style={{ color: '#6b7280', margin: '2px 0 0 0', fontSize: '11px' }}>{filteredItems.length} items</p>
              </div>
              
              {/* Quick Search */}
              <div style={{ position: 'relative', width: '240px' }}>
                <FaSearch style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} size={12} />
                <input
                  type="text"
                  placeholder="Quick add: type name or code..."
                  value={quickSearch}
                  onChange={(e) => setQuickSearch(e.target.value)}
                  onKeyPress={handleQuickSearch}
                  style={{
                    width: '100%',
                    paddingLeft: '28px',
                    paddingRight: '8px',
                    paddingTop: '6px',
                    paddingBottom: '6px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    backgroundColor: '#f9fafb',
                    fontSize: '11px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>
          
          <div style={{ flex: 1, padding: '8px', overflowY: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '8px'
            }}>
              {filteredItems.map((item) => {
                const quantityInCart = getItemQuantityInCart(item.id);
                
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      overflow: 'hidden',
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      height: '160px',
                      display: 'flex',
                      flexDirection: 'column',
                      border: quantityInCart > 0 ? '2px solid #e53e3e' : '1px solid #e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 3px 6px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Item Image */}
                    <div style={{
                      height: '60px',
                      background: 'linear-gradient(135deg, #fed7aa, #fecaca)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ fontSize: '24px', opacity: 0.3 }}>
                        {categories.find(c => c.id === item.category)?.emoji || '🍽️'}
                      </div>
                      
                      {/* Badges */}
                      <div style={{ position: 'absolute', top: '2px', left: '2px' }}>
                        <div style={{
                          padding: '1px 4px',
                          borderRadius: '8px',
                          fontSize: '7px',
                          fontWeight: 'bold',
                          backgroundColor: item.isVeg ? '#10b981' : '#ef4444',
                          color: 'white'
                        }}>
                          {item.isVeg ? 'VEG' : 'NON-VEG'}
                        </div>
                      </div>
                      
                      {/* Short Code */}
                      <div style={{ position: 'absolute', top: '2px', right: '2px', fontSize: '8px', fontWeight: 'bold', color: '#6b7280', backgroundColor: 'rgba(255,255,255,0.8)', padding: '2px 4px', borderRadius: '4px' }}>
                        {item.shortCode}
                      </div>
                    </div>
                    
                    {/* Item Details */}
                    <div style={{ padding: '8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h3 style={{ fontWeight: 'bold', fontSize: '12px', color: '#1f2937', margin: '0 0 2px 0', lineHeight: '1.2' }}>
                        {item.name.length > 18 ? item.name.substring(0, 18) + '...' : item.name}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '9px', margin: '0 0 6px 0', lineHeight: '1.3', flex: 1, overflow: 'hidden' }}>
                        {item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description}
                      </p>
                      
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                        <div>
                          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#e53e3e' }}>
                            ₹{item.price}
                          </span>
                        </div>
                        
                        {quantityInCart === 0 ? (
                          <button
                            onClick={() => addToCart(item)}
                            style={{
                              background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                              transition: 'all 0.2s',
                              fontSize: '9px'
                            }}
                          >
                            <FaPlus size={8} />
                            ADD
                          </button>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f3f4f6', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              style={{
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#e53e3e',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderRadius: '3px 0 0 3px',
                                cursor: 'pointer'
                              }}
                            >
                              <FaMinus size={8} />
                            </button>
                            <span style={{
                              width: '24px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              color: '#1f2937',
                              borderLeft: '1px solid #e5e7eb',
                              borderRight: '1px solid #e5e7eb',
                              fontSize: '10px'
                            }}>
                              {quantityInCart}
                            </span>
                            <button
                              onClick={() => addToCart(item)}
                              style={{
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#10b981',
                                backgroundColor: 'transparent',
                                border: 'none',
                                borderRadius: '0 3px 3px 0',
                                cursor: 'pointer'
                              }}
                            >
                              <FaPlus size={8} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        <div style={{ width: '300px', backgroundColor: 'white', borderLeft: '2px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
          {/* Cart Header */}
          <div style={{ background: 'linear-gradient(135deg, #e53e3e, #dc2626)', padding: '16px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaShoppingCart size={16} />
              </div>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Order Summary</h2>
                <p style={{ opacity: 0.9, margin: 0, fontSize: '12px' }}>Review items</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{cart.length}</div>
                <div style={{ fontSize: '10px', fontWeight: '600', opacity: 0.9 }}>ITEMS</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
                <div style={{ fontSize: '10px', fontWeight: '600', opacity: 0.9 }}>QTY</div>
              </div>
              <div style={{ textAlign: 'center', padding: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>₹{getTotalAmount()}</div>
                <div style={{ fontSize: '10px', fontWeight: '600', opacity: 0.9 }}>TOTAL</div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '30px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <FaShoppingCart size={16} color="#9ca3af" />
                </div>
                <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 4px 0' }}>Cart is Empty</h3>
                <p style={{ color: '#9ca3af', fontSize: '10px' }}>Add items to get started</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#f9fafb', borderRadius: '6px', padding: '8px', border: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0', fontSize: '11px', lineHeight: '1.2' }}>
                          {item.name.length > 16 ? item.name.substring(0, 16) + '...' : item.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#e53e3e' }}>₹{item.price}</span>
                          <div style={{
                            padding: '1px 4px',
                            borderRadius: '8px',
                            fontSize: '6px',
                            fontWeight: 'bold',
                            backgroundColor: item.isVeg ? '#dcfce7' : '#fee2e2',
                            color: item.isVeg ? '#166534' : '#dc2626'
                          }}>
                            {item.isVeg ? 'V' : 'N'}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e5e7eb', marginLeft: '8px' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#e53e3e',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '4px 0 0 4px',
                            cursor: 'pointer'
                          }}
                        >
                          <FaMinus size={8} />
                        </button>
                        <span style={{
                          width: '28px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: '#1f2937',
                          borderLeft: '1px solid #e5e7eb',
                          borderRight: '1px solid #e5e7eb',
                          fontSize: '11px'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          style={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10b981',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0 4px 4px 0',
                            cursor: 'pointer'
                          }}
                        >
                          <FaPlus size={8} />
                        </button>
                      </div>
                    </div>
                    
                    <div style={{ fontSize: '10px', fontWeight: '600', color: '#374151', textAlign: 'right' }}>
                      Subtotal: ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div style={{ borderTop: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              {/* Total */}
              <div style={{ padding: '12px' }}>
                <div style={{ background: 'linear-gradient(135deg, #1f2937, #111827)', color: 'white', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Grand Total</span>
                    <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{getTotalAmount()}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Actions */}
              <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '11px'
                  }}>
                    <FaMoneyBillWave size={12} />
                    Cash
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '11px'
                  }}>
                    <FaCreditCard size={12} />
                    Card/UPI
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '11px'
                  }}>
                    <FaSave size={10} />
                    Save
                  </button>
                  <button style={{
                    background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                    color: 'white',
                    padding: '8px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    fontSize: '11px'
                  }}>
                    <FaPrint size={10} />
                    Print
                  </button>
                </div>
                
                <button style={{
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  padding: '10px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Hold Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table Selector Modal */}
      {showTableSelector && (
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
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            width: '100%',
            maxWidth: '400px'
          }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Select Table</h2>
              <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '14px' }}>Choose a table for this order</p>
            </div>
            
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Enter Table Number/Name
                </label>
                <input
                  type="text"
                  value={manualTableNumber}
                  onChange={(e) => setManualTableNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualTableSelection()}
                  placeholder="e.g., T1, Table 5, VIP1"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: '#f9fafb'
                  }}
                />
              </div>

              <div style={{ padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <FaChair size={16} color="#0284c7" />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#0284c7' }}>
                    Need to manage tables?
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#075985', margin: 0, lineHeight: '1.4' }}>
                  Visit the Table Management page to set up floor layouts, add tables, and track table status.
                </p>
              </div>
            </div>
            
            <div style={{ padding: '24px', backgroundColor: '#f9fafb', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowTableSelector(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#6b7280',
                  color: 'white',
                  padding: '12px 24px',
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
                onClick={handleManualTableSelection}
                disabled={!manualTableNumber.trim()}
                style={{
                  flex: 1,
                  backgroundColor: manualTableNumber.trim() ? '#e53e3e' : '#d1d5db',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: manualTableNumber.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <FaChair size={14} />
                Select Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}