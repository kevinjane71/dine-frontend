'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaStore, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaUtensils,
  FaClock,
  FaTimes,
  FaArrowRight,
  FaForward,
  FaCheckCircle,
  FaStar
} from 'react-icons/fa';
import apiClient from '../lib/api';

const Onboarding = ({ onComplete, onSkip }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    cuisine: '',
    description: '',
    operatingHours: {
      open: '09:00',
      close: '22:00'
    }
  });

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setRestaurantData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setRestaurantData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const formattedData = {
        ...restaurantData,
        cuisine: restaurantData.cuisine.split(',').map(c => c.trim()).filter(c => c)
      };
      
      const response = await apiClient.createRestaurant(formattedData);
      
      // Save restaurant to localStorage for immediate use
      localStorage.setItem('selectedRestaurantId', response.restaurant.id);
      
      // Call onComplete callback
      onComplete(response.restaurant);
      
    } catch (error) {
      console.error('Error creating restaurant:', error);
      alert(`Failed to create restaurant: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Mark onboarding as skipped
    localStorage.setItem('onboarding_skipped', 'true');
    onSkip();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          padding: '32px',
          borderRadius: '24px 24px 0 0',
          color: 'white',
          textAlign: 'center',
          position: 'relative'
        }}>
          <button
            onClick={handleSkip}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <FaForward size={12} />
            Skip Setup
          </button>
          
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            animation: 'pulse 2s infinite'
          }}>
            <FaStore size={32} />
          </div>
          
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: '800', 
            margin: '0 0 8px 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            Welcome to Dine! 🍽️
          </h1>
          <p style={{ 
            fontSize: '18px', 
            opacity: 0.9, 
            margin: 0,
            fontWeight: '500'
          }}>
            Let&apos;s set up your restaurant in just a few steps
          </p>
        </div>

        {/* Form Content */}
        <div style={{ padding: '32px' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaStore size={16} style={{ color: '#ef4444' }} />
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                value={restaurantData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your restaurant name"
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaMapMarkerAlt size={16} style={{ color: '#ef4444' }} />
                Address
              </label>
              <textarea
                value={restaurantData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Enter your restaurant's complete address"
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaPhone size={16} style={{ color: '#ef4444' }} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={restaurantData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="+91-9876543210"
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1f2937',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <FaEnvelope size={16} style={{ color: '#ef4444' }} />
                  Email
                </label>
                <input
                  type="email"
                  value={restaurantData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  placeholder="restaurant@example.com"
                  onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaUtensils size={16} style={{ color: '#ef4444' }} />
                Cuisine Types
              </label>
              <input
                type="text"
                value={restaurantData.cuisine}
                onChange={(e) => handleInputChange('cuisine', e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="Indian, Chinese, Continental (comma-separated)"
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaClock size={16} style={{ color: '#ef4444' }} />
                Operating Hours
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                    Opening Time
                  </label>
                  <input
                    type="time"
                    value={restaurantData.operatingHours.open}
                    onChange={(e) => handleInputChange('operatingHours.open', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                    Closing Time
                  </label>
                  <input
                    type="time"
                    value={restaurantData.operatingHours.close}
                    onChange={(e) => handleInputChange('operatingHours.close', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <FaStar size={16} style={{ color: '#ef4444' }} />
                Description (Optional)
              </label>
              <textarea
                value={restaurantData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                  minHeight: '80px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                placeholder="Tell customers about your restaurant..."
                onFocus={(e) => e.target.style.borderColor = '#ef4444'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                type="button"
                onClick={handleSkip}
                style={{
                  flex: 1,
                  backgroundColor: '#f3f4f6',
                  color: '#6b7280',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '16px',
                  border: '2px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.color = '#4b5563';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.color = '#6b7280';
                }}
              >
                <FaForward size={16} />
                Skip for Now
              </button>
              
              <button
                type="submit"
                disabled={loading || !restaurantData.name.trim()}
                style={{
                  flex: 2,
                  background: loading || !restaurantData.name.trim() 
                    ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' 
                    : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '16px',
                  border: 'none',
                  cursor: loading || !restaurantData.name.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: loading || !restaurantData.name.trim() 
                    ? 'none' 
                    : '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Setting Up...
                  </>
                ) : (
                  <>
                    <FaCheckCircle size={16} />
                    Complete Setup
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
};

export default Onboarding;