'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaUtensils, 
  FaPlus, 
  FaArrowRight,
  FaSpinner,
  FaCheck,
  FaBuilding,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import apiClient from '../../lib/api';

const RestaurantSelection = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  
  // New restaurant form
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    cuisine: [],
    description: ''
  });

  useEffect(() => {
    loadUserRestaurants();
  }, []);

  const loadUserRestaurants = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getRestaurants();
      console.log('Restaurants response:', response);
      console.log('Restaurants data:', response.restaurants);
      
      setRestaurants(response.restaurants || []);
      
      // If user has no restaurants, show create form
      if (!response.restaurants || response.restaurants.length === 0) {
        setShowCreateForm(true);
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setError('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleRestaurantSelect = async (restaurant) => {
    try {
      setLoading(true);
      
      console.log('Selected restaurant:', restaurant);
      console.log('Restaurant subdomain:', restaurant.subdomain);
      
      // Store selected restaurant
      localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
      localStorage.setItem('selectedRestaurantId', restaurant.id);
      
      // Redirect to subdomain dashboard if available, otherwise to main dashboard
      if (restaurant.subdomain) {
        // Use localhost subdomain for development, production subdomain for production
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname.includes('localhost');
        const subdomainUrl = isLocalhost 
          ? `http://${restaurant.subdomain}.localhost:3002/dashboard`
          : `https://${restaurant.subdomain}.dineopen.com/dashboard`;
        
        console.log('Redirecting to subdomain dashboard:', subdomainUrl);
        window.location.href = subdomainUrl;
      } else {
        console.log('No subdomain found, redirecting to main dashboard');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error selecting restaurant:', error);
      setError('Failed to select restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    
    if (!newRestaurant.name.trim()) {
      setError('Restaurant name is required');
      return;
    }

    try {
      setCreating(true);
      setError('');
      
      const response = await apiClient.createRestaurant(newRestaurant);
      
      if (response.success) {
        // Store the new restaurant
        localStorage.setItem('selectedRestaurant', JSON.stringify(response.restaurant));
        localStorage.setItem('selectedRestaurantId', response.restaurant.id);
        
        // Redirect to subdomain dashboard
        if (response.restaurant.subdomain) {
          const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname.includes('localhost');
          const subdomainUrl = isLocalhost 
            ? `http://${response.restaurant.subdomain}.localhost:3002/dashboard`
            : `https://${response.restaurant.subdomain}.dineopen.com/dashboard`;
          window.location.href = subdomainUrl;
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(response.message || 'Failed to create restaurant');
      }
    } catch (error) {
      console.error('Error creating restaurant:', error);
      setError('Failed to create restaurant');
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <FaSpinner style={{ fontSize: '32px', animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          color: 'white',
          padding: '32px',
          textAlign: 'center'
        }}>
          <FaUtensils style={{ fontSize: '48px', marginBottom: '16px' }} />
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
            Welcome to DineOpen
          </h1>
          <p style={{ fontSize: '16px', opacity: 0.9, margin: 0 }}>
            {showCreateForm ? 'Create your restaurant' : 'Select your restaurant'}
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              {error}
            </div>
          )}

          {showCreateForm ? (
            /* Create Restaurant Form */
            <form onSubmit={handleCreateRestaurant}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>
                Create New Restaurant
              </h2>
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Restaurant Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newRestaurant.name}
                  onChange={handleInputChange}
                  placeholder="Enter restaurant name"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Address
                </label>
                <textarea
                  name="address"
                  value={newRestaurant.address}
                  onChange={handleInputChange}
                  placeholder="Enter restaurant address"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={newRestaurant.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newRestaurant.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={newRestaurant.description}
                  onChange={handleInputChange}
                  placeholder="Describe your restaurant"
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: creating ? 'not-allowed' : 'pointer',
                    opacity: creating ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  {creating ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaPlus />}
                  {creating ? 'Creating...' : 'Create Restaurant'}
                </button>
              </div>
            </form>
          ) : (
            /* Restaurant Selection */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
                  Your Restaurants
                </h2>
                <button
                  onClick={() => setShowCreateForm(true)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FaPlus size={12} />
                  Add Restaurant
                </button>
              </div>

              <div style={{ display: 'grid', gap: '16px' }}>
                {restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    onClick={() => handleRestaurantSelect(restaurant)}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#ef4444';
                      e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
                          {restaurant.name}
                        </h3>
                        
                        {restaurant.subdomain && (
                          <div style={{
                            display: 'inline-block',
                            backgroundColor: '#dcfce7',
                            color: '#166534',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            marginBottom: '8px'
                          }}>
                            {restaurant.subdomain}.dineopen.com
                          </div>
                        )}
                        
                        {restaurant.address && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#6b7280' }}>
                            <FaMapMarkerAlt size={12} />
                            <span style={{ fontSize: '14px' }}>{restaurant.address}</span>
                          </div>
                        )}
                        
                        {restaurant.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: '#6b7280' }}>
                            <FaPhone size={12} />
                            <span style={{ fontSize: '14px' }}>{restaurant.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <FaArrowRight style={{ color: '#6b7280', fontSize: '16px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default RestaurantSelection;
