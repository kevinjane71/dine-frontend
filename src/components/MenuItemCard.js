'use client';

import { FaPlus, FaMinus, FaLeaf, FaDrumstickBite, FaStar, FaFire, FaClock } from 'react-icons/fa';
import { getDisplayImage } from '../utils/placeholderImages';

const MenuItemCard = ({ 
  item, 
  quantityInCart, 
  onAddToCart, 
  onRemoveFromCart, 
  onItemClick, // New prop for opening customization modal
  isMobile = false,
  useModernDesign = true
}) => {
  const isVeg = item.isVeg === true || item.category === 'veg';
  const isPopular = item.isPopular || item.rating > 4.5;
  const isSpicy = item.spiceLevel === 'hot' || item.spiceLevel === 'very-hot';
  const isNew = item.isNew || item.createdAt > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  // Check if item has variants or customizations
  const hasVariants = item.variants && Array.isArray(item.variants) && item.variants.length > 0;
  const hasCustomizations = item.customizations && Array.isArray(item.customizations) && item.customizations.length > 0;
  const needsCustomization = hasVariants || hasCustomizations;
  
  // Get display price - show "From ₹X" if variants exist, otherwise show regular price
  const getDisplayPrice = () => {
    if (hasVariants && item.variants.length > 0) {
      const minPrice = Math.min(...item.variants.map(v => v.price || item.price || 0));
      return `From ₹${minPrice}`;
    }
    return `₹${item.price || 0}`;
  };
  
  // Handle card click - if needs customization, open modal; otherwise add directly
  const handleCardClick = (e) => {
    if (needsCustomization && onItemClick) {
      e.stopPropagation();
      onItemClick(item);
    } else if (!needsCustomization) {
      onAddToCart(item);
    }
  };
  
  if (!useModernDesign) {
    // Original Compact Design (Exact old style)
    return (
      <div
        className="menu-item-card"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #f3f4f6',
        borderTop: `4px solid ${isVeg ? '#22c55e' : '#ef4444'}`,
        borderRadius: '4px',
        cursor: 'pointer',
        height: isMobile ? '100px' : '110px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'none'
      }}
        onClick={handleCardClick}
      >
        {/* Short Code - Top Left Corner */}
        {item.shortCode && (
          <div style={{
            position: 'absolute',
            top: '2px',
            left: '2px',
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
              {getDisplayPrice()}
            </span>
          </div>
          
          {/* Add Button - Hidden if needs customization */}
          {!needsCustomization && (
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
          )}
        </div>
      </div>
    );
  }

  // Compact Modern Design (Professional & Efficient)
  const imageUrl = getDisplayImage(item);
  const hasImage = imageUrl !== null;

  // Full Image Overlay Design when image exists
  if (hasImage) {
    return (
      <div
        className="menu-item-card"
        style={{
          backgroundColor: '#1f2937',
          borderRadius: '8px',
          cursor: 'pointer',
          height: isMobile ? '160px' : '170px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          border: 'none'
        }}
        onClick={handleCardClick}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        }}
      >
        {/* Full Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0
        }}>
          <img
            src={imageUrl}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          
          {/* Dark Gradient Overlay for text visibility */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)',
            pointerEvents: 'none'
          }} />
        </div>

        {/* Veg/Non-Veg Badge - Top Left */}
        <div style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          backgroundColor: isVeg ? '#22c55e' : '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          border: '2px solid white'
        }}>
          {isVeg ? (
            <FaLeaf size={8} color="white" />
          ) : (
            <FaDrumstickBite size={7} color="white" />
          )}
        </div>

        {/* Top Right Badges */}
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 10
        }}>
          {item.shortCode && (
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              padding: '3px 7px',
              borderRadius: '6px',
              fontSize: '9px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              {item.shortCode}
            </div>
          )}
          
          {isPopular && (
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.95)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              padding: '3px 6px',
              borderRadius: '6px',
              fontSize: '7px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.3px',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.4)'
            }}>
              <FaStar size={6} />
              HOT
            </div>
          )}
        </div>

        {/* Bottom Content - Overlaid on image */}
        <div style={{
          position: 'relative',
          zIndex: 5,
          padding: isMobile ? '10px' : '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {/* Item Name */}
          <h3 style={{
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: '700',
            margin: 0,
            color: '#ffffff',
            lineHeight: '1.2',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            letterSpacing: '0.2px'
          }}>
            {item.name}
          </h3>
          
          {/* Price and Add Button Row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '2px'
          }}>
            {/* Price */}
            <span style={{
              fontSize: isMobile ? '15px' : '16px',
              color: '#ffffff',
              fontWeight: '800',
              lineHeight: 1,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.6)',
              letterSpacing: '0.3px'
            }}>
              {getDisplayPrice()}
            </span>
            
            {/* Add Button - Hidden if needs customization */}
            {!needsCustomization && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: quantityInCart > 0 ? '#ef4444' : 'rgba(255, 255, 255, 0.95)',
              borderRadius: '8px',
              overflow: 'hidden',
              border: quantityInCart > 0 ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: quantityInCart > 0 
                ? '0 4px 12px rgba(239, 68, 68, 0.4)' 
                : '0 2px 8px rgba(0, 0, 0, 0.3)',
              backdropFilter: 'blur(4px)'
            }}>
              {quantityInCart > 0 ? (
                <>
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
                      fontWeight: '700'
                    }}
                  >
                    <FaMinus size={9} />
                  </button>
                  <span style={{
                    width: '32px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    color: 'white',
                    fontSize: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)'
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
                      fontWeight: '700'
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
                    padding: '7px 14px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#1f2937',
                    fontWeight: '700',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  <FaPlus size={8} />
                  ADD
                </button>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Fallback design for items without images
  return (
    <div
      className="menu-item-card"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: '4px',
        cursor: 'pointer',
        height: isMobile ? '120px' : '130px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff',
        borderTop: `3px solid ${isVeg ? '#22c55e' : '#ef4444'}`,
        transition: 'all 0.2s ease'
      }}
      onClick={handleCardClick}
    >
      {/* Content Section */}
      <div style={{
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1
      }}>
      
      {/* Top Badges - Compact */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 10
      }}>
        {/* Short Code */}
        {item.shortCode && (
          <div style={{
            backgroundColor: '#6b7280',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '6px',
            fontSize: '9px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            {item.shortCode}
          </div>
        )}
        
        {/* Popular Badge */}
        {isPopular && (
          <div style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '6px',
            fontSize: '8px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            <FaStar size={6} />
            HOT
          </div>
        )}
        
        {/* New Badge */}
        {isNew && (
          <div style={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '6px',
            fontSize: '8px',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.3px'
          }}>
            NEW
          </div>
        )}
      </div>

      {/* Veg/Non-Veg Indicator - On Image */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: isVeg ? '#22c55e' : '#ef4444',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
        border: '2px solid white'
      }}>
        {isVeg ? (
          <FaLeaf size={9} color="white" />
        ) : (
          <FaDrumstickBite size={8} color="white" />
        )}
      </div>

      {/* Spicy Indicator - On Image */}
      {isSpicy && (
        <div style={{
          position: 'absolute',
          top: '32px',
          left: '8px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          boxShadow: '0 1px 4px rgba(220, 38, 38, 0.3)',
          border: '2px solid white'
        }}>
          <FaFire size={8} color="white" />
        </div>
      )}

      {/* Main Content Area - Compact */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '8px',
        paddingBottom: '8px',
        paddingLeft: '8px',
        paddingRight: '8px'
      }}>
        {/* Dish Name - Compact Typography */}
        <h3 style={{
          fontSize: isMobile ? '14px' : '15px',
          fontWeight: '600',
          margin: '0 0 4px 0',
          color: '#374151',
          lineHeight: '1.2',
          textAlign: 'center',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          wordWrap: 'break-word',
          maxHeight: '36px'
        }}>
          {item.name}
        </h3>
        
        {/* Description - Compact */}
        {item.description && (
          <p style={{
            fontSize: '10px',
            color: '#6b7280',
            margin: '0',
            lineHeight: '1.2',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            maxHeight: '12px',
            fontWeight: '400'
          }}>
            {item.description}
          </p>
        )}
      </div>
      
      {/* Bottom Section - Compact */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '8px',
        borderTop: '1px solid #f3f4f6',
        marginTop: '8px'
      }}>
        {/* Price - Compact */}
        <span style={{
          fontSize: isMobile ? '14px' : '15px',
          color: '#ef4444',
          fontWeight: '700',
          lineHeight: 1
        }}>
          {getDisplayPrice()}
        </span>
        
        {/* Add Button - Compact - Hidden if needs customization */}
        {!needsCustomization && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: quantityInCart > 0 ? '#ef4444' : '#f8fafc',
          borderRadius: '8px',
          overflow: 'hidden',
          border: quantityInCart > 0 ? 'none' : '1px solid #e5e7eb',
          boxShadow: quantityInCart > 0 
            ? '0 2px 6px rgba(239, 68, 68, 0.2)' 
            : '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          {quantityInCart > 0 ? (
            <>
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
                  borderRadius: '6px'
                }}
              >
                <FaMinus size={10} />
              </button>
              <span style={{
                width: '36px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                color: 'white',
                fontSize: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '6px'
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
                  borderRadius: '6px'
                }}
              >
                <FaPlus size={10} />
              </button>
            </>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(item);
              }}
              style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#6b7280',
                fontWeight: '600',
                fontSize: '11px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}
            >
              <FaPlus size={8} />
              ADD
            </button>
          )}
        </div>
        )}
      </div>
      </div> {/* End Content Section */}

    </div>
  );
};

export default MenuItemCard;
