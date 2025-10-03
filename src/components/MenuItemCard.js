'use client';

import { FaPlus, FaMinus, FaLeaf, FaDrumstickBite } from 'react-icons/fa';

const MenuItemCard = ({ 
  item, 
  quantityInCart, 
  onAddToCart, 
  onRemoveFromCart, 
  isMobile = false 
}) => {
  const isVeg = item.isVeg === true || item.category === 'veg';
  
  return (
    <div
      className="menu-item-card"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #f3f4f6',
        borderTop: `4px solid ${isVeg ? '#22c55e' : '#ef4444'}`,
        borderRadius: '5px',
        cursor: 'pointer',
        height: isMobile ? '100px' : '110px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'none' // Remove all transitions for stability
      }}
      onClick={() => onAddToCart(item)}
    >
      
      {/* Short Code - Top Left Corner */}
      {item.shortCode && (
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '8px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          zIndex: 5
        }}>
          {item.shortCode}
        </div>
      )}
      
      {/* Veg/Non-Veg Indicator */}
      {/* <div style={{
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
      </div> */}

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '2px'
      }}>
        {/* Dish Name */}
        <h3 style={{
          fontSize: isMobile ? '12px' : '14px',
          fontWeight: '600',
          margin: '0 0 4px 0',
          color: '#1f2937',
          lineHeight: '1.2',
          textAlign: 'center',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordWrap: 'break-word',
          maxHeight: '32px'
        }}>
          {item.name}
        </h3>
      </div>
      
      {/* Bottom Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: '1px solid #f3f4f6',
        marginTop: '6px'
      }}>
        {/* Price */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <span style={{
            fontSize: isMobile ? '12px' : '14px',
            color: '#ef4444',
            fontWeight: '700',
            lineHeight: 1
          }}>
            ₹{item.price}
          </span>
        </div>
        
        {/* Add Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: quantityInCart > 0 ? '#ef4444' : '#f8fafc',
          borderRadius: '8px',
          overflow: 'hidden',
          border: quantityInCart > 0 ? 'none' : '1px solid #e5e7eb',
          boxShadow: quantityInCart > 0 ? '0 2px 4px rgba(239, 68, 68, 0.2)' : '0 1px 2px rgba(0, 0, 0, 0.05)'
        }}>
          {quantityInCart > 0 ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromCart(item.id);
                }}
                style={{
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'none'
                }}
              >
                <FaMinus size={9} />
              </button>
              <span style={{
                width: '30px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: 'white',
                fontSize: '11px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '4px'
              }}>
                {quantityInCart}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(item);
                }}
                style={{
                  width: '26px',
                  height: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  transition: 'none'
                }}
              >
                <FaPlus size={9} />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              style={{
                padding: '6px 10px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6b7280',
                fontWeight: '600',
                fontSize: '10px',
                transition: 'none'
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
