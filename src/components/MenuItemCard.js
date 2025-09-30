'use client';

import { FaPlus, FaMinus, FaLeaf, FaDrumstickBite } from 'react-icons/fa';

const MenuItemCard = ({ 
  item, 
  quantityInCart, 
  onAddToCart, 
  onRemoveFromCart, 
  isMobile = false 
}) => {
  const isVeg = item.category === 'veg';
  
  return (
    <div
      className="menu-item-card"
      style={{
        backgroundColor: '#f5f5f5',
        border: 'none',
        borderTop: isVeg ? '3px solid #10b981' : '3px solid #ef4444',
        borderRadius: '0px',
        cursor: 'pointer',
        height: isMobile ? '120px' : '130px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px',
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}
      onClick={() => onAddToCart(item)}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#e5e5e5';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#f5f5f5';
      }}
    >
      
      {/* Veg/Non-Veg Indicator - Top Right */}
     

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '4px',
        paddingBottom: '4px'
      }}>
        {/* Dish Name - Prominent */}
        <h3 style={{
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: '800',
          margin: '0 0 4px 0',
          color: '#000000',
          lineHeight: '1.2',
          textAlign: 'center',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordWrap: 'break-word',
          letterSpacing: '-0.3px'
        }}>
          {item.name}
        </h3>
        
        {/* Price - Prominent */}
        <div style={{
          fontSize: isMobile ? '16px' : '18px',
          color: '#000000',
          fontWeight: '900',
          marginBottom: '4px'
        }}>
          ₹{item.price}
        </div>
      </div>
      
      {/* Add Button Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '6px'
      }}>
        {quantityInCart > 0 ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgb(219, 84, 81)',
            borderRadius: '0px',
            overflow: 'hidden'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromCart(item.id);
              }}
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(219, 84, 81, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <FaMinus size={10} />
            </button>
            <span style={{
              width: '48px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: 'white',
              fontSize: '16px',
              backgroundColor: 'rgba(219, 84, 81, 0.8)',
              borderLeft: '1px solid #555555',
              borderRight: '1px solid #555555'
            }}>
              {quantityInCart}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(219, 84, 81, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <FaPlus size={10} />
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      backgroundColor: 'rgb(219, 84, 81)',
                      border: 'none',
                      borderRadius: '0px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: '#ffffff',
                      fontWeight: '800',
                      fontSize: '14px',
                      transition: 'all 0.2s ease',
                      letterSpacing: '0.5px'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(219, 84, 81, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgb(219, 84, 81)';
                    }}
          >
            <FaPlus size={12} />
            ADD TO CART
          </button>
        )}
      </div>

    </div>
  );
};

export default MenuItemCard;
