'use client';

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Notification = ({ message, type = 'info', duration = 5000, onClose, show = true, title }) => {
  const [isVisible, setIsVisible] = useState(show && message);

  useEffect(() => {
    if (show && message) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [show, message]);

  useEffect(() => {
    if (duration > 0 && show && message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Wait for animation to complete
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, show, message]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle size={20} color="#10b981" />;
      case 'error':
        return <FaExclamationTriangle size={20} color="#ef4444" />;
      case 'warning':
        return <FaExclamationTriangle size={20} color="#f59e0b" />;
      default:
        return <FaInfoCircle size={20} color="#3b82f6" />;
    }
  };

  const getStyles = () => {
    const baseStyles = {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      minWidth: '300px',
      maxWidth: '400px',
      padding: '16px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.3s ease-in-out',
      cursor: 'pointer'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#166534'
        };
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626'
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: '#fffbeb',
          border: '1px solid #fed7aa',
          color: '#d97706'
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1d4ed8'
        };
    }
  };

  return (
    <div style={getStyles()} onClick={handleClose}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1, fontSize: '14px', lineHeight: '1.4' }}>
        {title && (
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>
            {title}
          </div>
        )}
        {message}
      </div>
      
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          padding: '4px',
          cursor: 'pointer',
          color: 'inherit',
          opacity: 0.7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FaTimes size={14} />
      </button>
    </div>
  );
};

// Notification Manager Hook
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, duration = 5000) => {
    return addNotification(message, 'success', duration);
  };

  const showError = (message, duration = 7000) => {
    return addNotification(message, 'error', duration);
  };

  const showWarning = (message, duration = 6000) => {
    return addNotification(message, 'warning', duration);
  };

  const showInfo = (message, duration = 5000) => {
    return addNotification(message, 'info', duration);
  };

  const NotificationContainer = () => (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 9999 }}>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );

  return {
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    NotificationContainer
  };
};

export default Notification;