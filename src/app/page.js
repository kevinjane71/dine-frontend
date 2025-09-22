'use client';

import { useState, useEffect } from 'react';
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
  FaFire
} from 'react-icons/fa';

export default function RestaurantPOS() {
  const [selectedCategory, setSelectedCategory] = useState('Fast Food');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderType, setOrderType] = useState('dine-in');

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
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
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

  return (
    <div style={{ height: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ backgroundColor: 'white', padding: '20px', borderBottom: '2px solid #e5e7eb', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '50px', height: '50px', backgroundColor: '#e53e3e', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaUtensils color="white" size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>Dine POS</h1>
                <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>Restaurant Management System</p>
              </div>
            </div>
            
            {/* Order Type Selector */}
            <div style={{ display: 'flex', backgroundColor: '#f3f4f6', borderRadius: '16px', padding: '8px' }}>
              {['dine-in', 'delivery', 'pickup'].map((type) => (
                <button
                  key={type}
                  onClick={() => setOrderType(type)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: orderType === type ? 'white' : 'transparent',
                    color: orderType === type ? '#e53e3e' : '#6b7280',
                    boxShadow: orderType === type ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {type === 'dine-in' ? '🍽️ Dine In' : type === 'delivery' ? '🚚 Delivery' : '🥡 Pickup'}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ color: '#374151', textAlign: 'right' }}>
            <p style={{ fontWeight: '600', margin: 0 }}>Restaurant Name</p>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Ground Floor • 📞 9034142334</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Categories Sidebar */}
        <div style={{ width: '320px', backgroundColor: 'white', borderRight: '2px solid #e5e7eb', boxShadow: '2px 0 4px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Categories</h2>
            <div style={{ position: 'relative' }}>
              <FaSearch style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  paddingLeft: '48px',
                  paddingRight: '16px',
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  backgroundColor: '#f9fafb',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          
          <div style={{ padding: '16px', overflowY: 'auto', height: 'calc(100% - 140px)' }}>
            <button
              onClick={() => setSelectedCategory('All Items')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '16px',
                borderRadius: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: selectedCategory === 'All Items' ? '#e53e3e' : 'transparent',
                color: selectedCategory === 'All Items' ? 'white' : '#374151',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                backgroundColor: selectedCategory === 'All Items' ? 'rgba(255,255,255,0.2)' : '#f3f4f6'
              }}>
                🍽️
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>All Items</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>{menuItems.length} items</div>
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
                    padding: '16px',
                    borderRadius: '12px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: isSelected ? '#e53e3e' : 'transparent',
                    color: isSelected ? 'white' : '#374151',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#f3f4f6'
                  }}>
                    {category.emoji}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{category.name}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>{categoryItems.length} items</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ flex: 1, backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '24px', backgroundColor: 'white', borderBottom: '1px solid #f3f4f6' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              {selectedCategory}
            </h2>
            <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>{filteredItems.length} items available</p>
          </div>
          
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 15px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* Item Image */}
                  <div style={{
                    height: '160px',
                    background: 'linear-gradient(135deg, #fed7aa, #fecaca)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <div style={{ fontSize: '64px', opacity: 0.2 }}>
                      {categories.find(c => c.id === item.category)?.emoji || '🍽️'}
                    </div>
                    
                    {/* Badges */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: item.isVeg ? '#10b981' : '#ef4444',
                        color: 'white'
                      }}>
                        {item.isVeg ? '🌱 VEG' : '🍖 NON-VEG'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Item Details */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#1f2937', margin: '0 0 8px 0' }}>
                      {item.name}
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                      {item.description}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#e53e3e' }}>
                          ₹{item.price}
                        </span>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          {categories.find(c => c.id === item.category)?.name}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                          color: 'white',
                          padding: '12px 24px',
                          borderRadius: '12px',
                          fontWeight: 'bold',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <FaPlus size={14} />
                        ADD
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cart Sidebar */}
        <div style={{ width: '384px', backgroundColor: 'white', borderLeft: '2px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
          {/* Cart Header */}
          <div style={{ background: 'linear-gradient(135deg, #e53e3e, #dc2626)', padding: '24px', color: 'white' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FaShoppingCart size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Order Summary</h2>
                <p style={{ opacity: 0.9, margin: 0 }}>Review your items</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{cart.length}</div>
                <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9 }}>ITEMS</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
                <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9 }}>QTY</div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>₹{getTotalAmount()}</div>
                <div style={{ fontSize: '12px', fontWeight: '600', opacity: 0.9 }}>TOTAL</div>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', paddingTop: '80px' }}>
                <div style={{ width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <FaShoppingCart size={32} color="#9ca3af" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#6b7280', margin: '0 0 8px 0' }}>Cart is Empty</h3>
                <p style={{ color: '#9ca3af' }}>Add items from the menu to get started</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ backgroundColor: '#f9fafb', borderRadius: '16px', padding: '16px' }}>
                    <div style={{ marginBottom: '12px' }}>
                      <h4 style={{ fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>{item.name}</h4>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{item.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#e53e3e' }}>₹{item.price}</span>
                        <div style={{
                          padding: '4px 8px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          backgroundColor: item.isVeg ? '#dcfce7' : '#fee2e2',
                          color: item.isVeg ? '#166534' : '#dc2626'
                        }}>
                          {item.isVeg ? 'VEG' : 'NON-VEG'}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                        Subtotal: ₹{item.price * item.quantity}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '12px', border: '2px solid #e5e7eb' }}>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#e53e3e',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '10px 0 0 10px',
                            cursor: 'pointer'
                          }}
                        >
                          <FaMinus size={14} />
                        </button>
                        <span style={{
                          width: '48px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          color: '#1f2937',
                          borderLeft: '2px solid #e5e7eb',
                          borderRight: '2px solid #e5e7eb'
                        }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#10b981',
                            backgroundColor: 'transparent',
                            border: 'none',
                            borderRadius: '0 10px 10px 0',
                            cursor: 'pointer'
                          }}
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div style={{ borderTop: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              {/* Total */}
              <div style={{ padding: '16px', borderBottom: '2px solid #e5e7eb' }}>
                <div style={{ background: 'linear-gradient(135deg, #1f2937, #111827)', color: 'white', padding: '24px', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Grand Total</span>
                    <span style={{ fontSize: '32px', fontWeight: 'bold' }}>₹{getTotalAmount()}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Actions */}
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <FaMoneyBillWave size={18} />
                    Cash
                  </button>
                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '16px',
                    backgroundColor: 'white',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <FaCreditCard size={18} />
                    Card/UPI
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <button style={{
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <FaSave size={16} />
                    Save
                  </button>
                  <button style={{
                    background: 'linear-gradient(135deg, #e53e3e, #dc2626)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <FaPrint size={16} />
                    Print
                  </button>
                </div>
                
                <button style={{
                  width: '100%',
                  backgroundColor: '#e5e7eb',
                  color: '#374151',
                  padding: '16px',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  border: 'none',
                  cursor: 'pointer'
                }}>
                  Hold Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}