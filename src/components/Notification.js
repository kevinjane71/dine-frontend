'use client';

import { useEffect, useState } from 'react';
import { FaCheckCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const Notification = ({ 
  show, 
  type = 'success', 
  title, 
  message, 
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsExiting(false);
      
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleClose();
        }, duration);
        
        return () => clearTimeout(timer);
      }
    }
  }, [show, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
      if (onClose) onClose();
    }, 300);
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: FaCheckCircle,
          bgColor: '#10b981',
          borderColor: '#059669',
          textColor: '#065f46'
        };
      case 'info':
        return {
          icon: FaInfoCircle,
          bgColor: '#3b82f6',
          borderColor: '#2563eb',
          textColor: '#1e40af'
        };
      case 'warning':
        return {
          icon: FaExclamationTriangle,
          bgColor: '#f59e0b',
          borderColor: '#d97706',
          textColor: '#92400e'
        };
      case 'error':
        return {
          icon: FaExclamationTriangle,
          bgColor: '#ef4444',
          borderColor: '#dc2626',
          textColor: '#991b1b'
        };
      default:
        return {
          icon: FaInfoCircle,
          bgColor: '#6b7280',
          borderColor: '#4b5563',
          textColor: '#374151'
        };
    }
  };

  if (!show && !isVisible) return null;

  const config = getTypeConfig();
  const Icon = config.icon;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      transform: isVisible && !isExiting ? 'translateX(0)' : 'translateX(100%)',
      transition: 'all 0.3s ease-in-out',
      opacity: isVisible && !isExiting ? 1 : 0,
      minWidth: '320px',
      maxWidth: '400px'
    }}>
      <div style={{
        backgroundColor: 'white',
        border: `2px solid ${config.borderColor}`,
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Progress bar */}
        {duration > 0 && (
          <div style={{
            height: '3px',
            backgroundColor: config.bgColor
          }} />
        )}
        
        {/* Content */}
        <div style={{
          padding: '16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}>
          {/* Icon */}
          <div style={{
            width: '24px',
            height: '24px',
            backgroundColor: config.bgColor,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            <Icon size={12} color="white" />
          </div>
          
          {/* Text content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {title && (
              <div style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: config.textColor,
                marginBottom: '4px',
                lineHeight: '1.3'
              }}>
                {title}
              </div>
            )}
            {message && (
              <div style={{
                fontSize: '13px',
                color: '#6b7280',
                lineHeight: '1.4'
              }}>
                {message}
              </div>
            )}
          </div>
          
          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9ca3af',
              cursor: 'pointer',
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'color 0.2s, background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.color = '#6b7280';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#9ca3af';
            }}
          >
            <FaTimes size={10} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;