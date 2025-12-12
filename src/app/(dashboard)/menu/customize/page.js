'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaSave, FaSpinner, FaCheck, FaMobile, FaTablet, FaDesktop, FaCamera, FaImage } from 'react-icons/fa';
import apiClient from '../../../../lib/api';
import dynamic from 'next/dynamic';

// Dynamically import menu preview components
const DefaultMenuPreview = dynamic(() => import('./components/DefaultMenuPreview'), { ssr: false });
const BistroMenuPreview = dynamic(() => import('./components/BistroMenuPreview'), { ssr: false });
const CubeMenuPreview = dynamic(() => import('./components/CubeMenuPreview'), { ssr: false });
const BookMenuPreview = dynamic(() => import('./components/BookMenuPreview'), { ssr: false });
const CarouselMenuPreview = dynamic(() => import('./components/CarouselMenuPreview'), { ssr: false });
const ClassicMenuPreview = dynamic(() => import('./components/ClassicMenuPreview'), { ssr: false });

const MENU_THEMES = [
  { id: 'default', name: 'Default', description: 'Classic menu layout', icon: '📱' },
  { id: 'classic', name: 'Classic', description: 'Modern list view with header', icon: '📋' },
  { id: 'bistro', name: 'Bistro', description: 'Elegant book-style menu', icon: '📖' },
  { id: 'cube', name: 'Cube', description: '3D interactive cube menu', icon: '🎲' },
  { id: 'book', name: 'Book', description: '3D book flip menu', icon: '📚' },
  { id: 'carousel', name: 'Carousel', description: 'Interactive 3D Cover Flow', icon: '🎠' },
];

const MenuCustomizeContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get('restaurant') || localStorage.getItem('restaurantId');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [previewDevice, setPreviewDevice] = useState('mobile');
  const [success, setSuccess] = useState(false);
  const [headerImage, setHeaderImage] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [restaurantResponse, menuResponse, themeResponse] = await Promise.all([
          apiClient.getRestaurants(),
          apiClient.getPublicMenu(restaurantId),
          apiClient.getMenuTheme(restaurantId).catch(() => ({ success: false })),
        ]);

        if (restaurantResponse.success && restaurantResponse.restaurants) {
          const currentRestaurant = restaurantResponse.restaurants.find(r => r.id === restaurantId);
          if (currentRestaurant) {
            setRestaurant(currentRestaurant);
          } else {
            // Fallback: create restaurant object from menu response
            if (menuResponse.success && menuResponse.restaurant) {
              setRestaurant(menuResponse.restaurant);
            }
          }
        } else if (menuResponse.success && menuResponse.restaurant) {
          // Use restaurant from menu response if restaurants list fails
          setRestaurant(menuResponse.restaurant);
        }

        if (menuResponse.success && menuResponse.menu) {
          setMenu(menuResponse.menu);
        }

        if (themeResponse?.success && themeResponse.themeId) {
          setSelectedTheme(themeResponse.themeId || 'default');
          if (themeResponse.headerImage) {
            setHeaderImage(themeResponse.headerImage);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      loadData();
    }
  }, [restaurantId]);

  const handleHeaderImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size too large. Maximum 5MB allowed.');
      return;
    }

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'header'); 

      const response = await apiClient.uploadImage(formData);
      
      if (response.success && response.imageUrl) {
        setHeaderImage(response.imageUrl);
        // Also update local restaurant object to reflect change in preview immediately
        setRestaurant(prev => ({
          ...prev,
          menuTheme: { ...prev?.menuTheme, headerImage: response.imageUrl }
        }));
      } else {
        throw new Error(response.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading header image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!restaurantId) {
      alert('Restaurant ID is missing. Please refresh the page.');
      return;
    }

    try {
      setSaving(true);
      setSuccess(false);
      
      console.log('Saving theme:', { restaurantId, selectedTheme, headerImage });
      
      // Save theme setting to backend
      const response = await apiClient.saveMenuTheme(restaurantId, {
        themeId: selectedTheme,
        layoutId: selectedTheme,
        headerImage: headerImage || null
      });

      console.log('Save response:', response);

      if (response?.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(response?.error || 'Failed to save theme');
      }
    } catch (error) {
      console.error('Error saving theme:', error);
      alert(`Failed to save theme: ${error.message || 'Please try again.'}`);
    } finally {
      setSaving(false);
    }
  };

  const renderPreview = () => {
    // Pass headerImage to preview
    const previewProps = {
      restaurant: {
        ...restaurant,
        menuTheme: { ...restaurant?.menuTheme, headerImage: headerImage || restaurant?.menuTheme?.headerImage }
      },
      menu,
      device: previewDevice,
    };

    switch (selectedTheme) {
      case 'classic':
        return <ClassicMenuPreview {...previewProps} />;
      case 'bistro':
        return <BistroMenuPreview {...previewProps} />;
      case 'cube':
        return <CubeMenuPreview {...previewProps} />;
      case 'book':
        return <BookMenuPreview {...previewProps} />;
      case 'carousel':
        return <CarouselMenuPreview {...previewProps} />;
      default:
        return <DefaultMenuPreview {...previewProps} />;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <FaSpinner size={32} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => router.back()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          <FaArrowLeft size={14} />
          Back to Menu
        </button>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', margin: 0 }}>
          Customize Public Menu
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', margin: '8px 0 0 0' }}>
          Choose a theme for your public menu. Customers will see this when they scan your QR code.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        {/* Theme Selection Sidebar */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
          
          {/* Header Image Upload - Show only for Classic Theme */}
          {selectedTheme === 'classic' && (
            <div style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
                Header Image
              </h2>
              <div 
                style={{ 
                  width: '100%', 
                  height: '120px', 
                  backgroundColor: '#f3f4f6', 
                  borderRadius: '10px', 
                  backgroundImage: headerImage ? `url(${headerImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '2px dashed #d1d5db',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {!headerImage && (
                  <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <FaImage size={24} style={{ marginBottom: '4px' }} />
                    <p style={{ fontSize: '12px', margin: 0 }}>Click to upload</p>
                  </div>
                )}
                {headerImage && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    opacity: 0,
                    transition: 'opacity 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '12px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                  >
                    Change Image
                  </div>
                )}
                {uploadingImage && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <FaSpinner className="animate-spin text-blue-600" />
                  </div>
                )}
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleHeaderImageUpload} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px' }}>
                Recommended size: 1200x400px. Used in Classic theme header.
              </p>
            </div>
          )}

          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#111827' }}>
            Select Theme
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MENU_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setSelectedTheme(theme.id)}
                style={{
                  padding: '16px',
                  backgroundColor: selectedTheme === theme.id ? '#fef3c7' : '#f9fafb',
                  border: `2px solid ${selectedTheme === theme.id ? '#fbbf24' : '#e5e7eb'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedTheme !== theme.id) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTheme !== theme.id) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '24px' }}>{theme.icon}</span>
                  <span style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>
                    {theme.name}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                  {theme.description}
                </p>
              </button>
            ))}
          </div>

          {/* Device Selector */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#111827' }}>
              Preview Size
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'mobile', icon: FaMobile, label: 'Mobile' },
                { id: 'tablet', icon: FaTablet, label: 'Tablet' },
                { id: 'desktop', icon: FaDesktop, label: 'Desktop' },
              ].map((device) => {
                const Icon = device.icon;
                return (
                  <button
                    key={device.id}
                    onClick={() => setPreviewDevice(device.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: previewDevice === device.id ? '#fef3c7' : '#f9fafb',
                      border: `1px solid ${previewDevice === device.id ? '#fbbf24' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Icon size={18} color={previewDevice === device.id ? '#92400e' : '#6b7280'} />
                    <span style={{ fontSize: '11px', color: previewDevice === device.id ? '#92400e' : '#6b7280' }}>
                      {device.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Button - More Prominent */}
          <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '2px solid #e5e7eb' }}>
            <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #fbbf24' }}>
              <p style={{ fontSize: '12px', color: '#92400e', margin: 0, fontWeight: '600' }}>
                💡 Tip: Save your theme to make it live for all customers scanning your QR code
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={saving || !restaurantId}
              style={{
                width: '100%',
                padding: '14px 20px',
                background: saving || !restaurantId
                  ? '#d1d5db'
                  : success
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: saving || !restaurantId ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: saving || !restaurantId || success
                  ? 'none'
                  : '0 4px 12px rgba(245, 158, 11, 0.4)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!saving && restaurantId && !success) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!saving && restaurantId && !success) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
                }
              }}
            >
              {saving ? (
                <>
                  <FaSpinner size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  Saving Theme...
                </>
              ) : success ? (
                <>
                  <FaCheck size={18} />
                  Theme Saved Successfully!
                </>
              ) : (
                <>
                  <FaSave size={18} />
                  Save Theme for All Customers
                </>
              )}
            </button>
            {success && (
              <p style={{ fontSize: '13px', color: '#10b981', marginTop: '8px', textAlign: 'center', fontWeight: '600' }}>
                ✓ All customers will now see this theme when they scan your QR code
              </p>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#111827' }}>
            Live Preview
          </h2>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '600px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <Suspense fallback={<div>Loading preview...</div>}>{renderPreview()}</Suspense>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

const MenuCustomizePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MenuCustomizeContent />
    </Suspense>
  );
};

export default MenuCustomizePage;
