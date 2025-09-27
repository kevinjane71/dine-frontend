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
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        cursor: 'pointer',
        height: isMobile ? '100px' : '110px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => onAddToCart(item)}
    >
      
      {/* Veg/Non-Veg Indicator */}
      <div style={{
        position: 'absolute',
        top: '6px',
        left: '6px',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        backgroundColor: isVeg ? '#22c55e' : '#ef4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 5
      }}>
        {isVeg ? (
          <FaLeaf size={8} color="white" />
        ) : (
          <FaDrumstickBite size={7} color="white" />
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '4px'
      }}>
        {/* Dish Name */}
        <h3 style={{
          fontSize: isMobile ? '14px' : '16px',
          fontWeight: '700',
          margin: '0 0 6px 0',
          color: '#1f2937',
          lineHeight: '1.2',
          textAlign: 'center',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordWrap: 'break-word'
        }}>
          {item.name}
        </h3>
      </div>
      
      {/* Bottom Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '6px',
        borderTop: '1px solid #f3f4f6',
        marginTop: '4px'
      }}>
        {/* Price */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <span style={{
            fontSize: isMobile ? '14px' : '16px',
            color: '#ef4444',
            fontWeight: '700',
            lineHeight: 1
          }}>
            ₹{item.price}
          </span>
          <span style={{
            fontSize: '8px',
            color: '#6b7280',
            fontWeight: '500',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {isVeg ? 'VEG' : 'NON-VEG'}
          </span>
        </div>
        
        {/* Add Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: quantityInCart > 0 ? '#ef4444' : '#f3f4f6',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          {quantityInCart > 0 ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromCart(item.id);
                }}
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
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
                color: 'white',
                fontSize: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                {quantityInCart}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(item);
                }}
                style={{
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <FaPlus size={8} />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              style={{
                padding: '4px 8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6b7280',
                fontWeight: '600',
                fontSize: '10px'
              }}
            >
              <FaPlus size={8} />
              Add
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default MenuItemCard;
