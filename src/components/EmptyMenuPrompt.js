'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaUtensils, 
  FaPlus, 
  FaArrowRight, 
  FaSeedling,
  FaCoffee,
  FaHamburger,
  FaPizzaSlice,
  FaCarrot,
  FaStar,
  FaCloudUploadAlt,
  FaCamera,
  FaImage,
  FaSpinner,
  FaCheckCircle,
  FaTimes,
  FaMagic
} from 'react-icons/fa';
import apiClient from '../lib/api';

const EmptyMenuPrompt = ({ restaurantName, onAddMenu, onMenuItemsAdded }) => {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleAddMenu = () => {
    setIsAnimating(true);
    setTimeout(() => {
      router.push('/menu');
    }, 300);
  };

  const handleUploadClick = () => {
    setShowUploadModal(true);
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      // Call the bulk upload API
      const response = await apiClient.post('/api/menus/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadSuccess(true);
        setTimeout(() => {
          setShowUploadModal(false);
          setUploading(false);
          setUploadSuccess(false);
          if (onMenuItemsAdded) {
            onMenuItemsAdded();
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploading(false);
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleGalleryUpload = () => {
    fileInputRef.current?.click();
  };

  const sampleCategories = [
    { name: 'Appetizers', icon: FaSeedling, color: '#10b981' },
    { name: 'Main Course', icon: FaHamburger, color: '#f59e0b' },
    { name: 'Beverages', icon: FaCoffee, color: '#8b5cf6' },
    { name: 'Desserts', icon: FaPizzaSlice, color: '#ef4444' },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px',
        transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.3s ease'
      }}>
        {/* Animated Icon */}
        <div style={{
          position: 'relative',
          display: 'inline-block',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            position: 'relative',
            animation: 'bounce 2s infinite'
          }}>
            <FaUtensils size={48} style={{ color: '#f59e0b' }} />
            
            {/* Floating sparkles */}
            <div style={{
              position: 'absolute',
              top: '-10px',
              right: '10px',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <FaStar size={20} style={{ color: '#fbbf24' }} />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '5px',
              left: '-5px',
              animation: 'float 3s ease-in-out infinite 1.5s'
            }}>
              <FaStar size={16} style={{ color: '#f59e0b' }} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <h2 style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#1f2937',
          margin: '0 0 16px 0',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Ready to Create Your Menu? 🍽️
        </h2>
        
        <p style={{
          fontSize: '18px',
          color: '#6b7280',
          margin: '0 0 32px 0',
          lineHeight: '1.6'
        }}>
          Welcome to <strong style={{ color: '#1f2937' }}>{restaurantName || 'Your Restaurant'}</strong>! 
          <br />
          Let&apos;s start by uploading your menu and let AI handle the rest.
        </p>

        {/* AI Upload Section */}
        <div style={{
          backgroundColor: 'white',
          padding: '32px',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          border: '2px solid #ef4444',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* AI Badge */}
          <div style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <FaMagic size={10} />
            AI Powered
          </div>

          <h3 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 16px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FaCloudUploadAlt style={{ color: '#ef4444' }} />
            Upload Your Menu
          </h3>
          
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: '0 0 24px 0',
            lineHeight: '1.6'
          }}>
            Take a photo of your menu or upload from gallery. Our AI will automatically extract items, prices, and categories.
          </p>

          {/* Upload Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Camera Upload */}
            <button
              onClick={handleCameraCapture}
              style={{
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: 'white',
                padding: '20px',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
              }}
            >
              <FaCamera size={32} />
              <span style={{ fontWeight: '600', fontSize: '14px' }}>
                Take Photo
              </span>
              <span style={{ fontSize: '12px', opacity: 0.8 }}>
                Perfect for mobile
              </span>
            </button>

            {/* Gallery Upload */}
            <button
              onClick={handleGalleryUpload}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: 'white',
                padding: '20px',
                borderRadius: '16px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
              }}
            >
              <FaImage size={32} />
              <span style={{ fontWeight: '600', fontSize: '14px' }}>
                From Gallery
              </span>
              <span style={{ fontSize: '12px', opacity: 0.8 }}>
                Upload existing photos
              </span>
            </button>
          </div>

          {/* AI Features */}
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7, #fed7aa)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid #f59e0b'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '700',
              color: '#92400e',
              margin: '0 0 8px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <FaMagic size={12} />
              AI Features
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '8px',
              fontSize: '12px',
              color: '#92400e'
            }}>
              <div>✓ Auto-extract items</div>
              <div>✓ Detect prices</div>
              <div>✓ Categorize dishes</div>
              <div>✓ Smart descriptions</div>
            </div>
          </div>
        </div>

        {/* Alternative Action */}
        <button
          onClick={handleAddMenu}
          disabled={isAnimating}
          style={{
            background: 'transparent',
            color: '#6b7280',
            padding: '12px 24px',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '14px',
            border: '2px solid #e5e7eb',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px'
          }}
          onMouseEnter={(e) => {
            if (!isAnimating) {
              e.target.style.borderColor = '#d1d5db';
              e.target.style.color = '#374151';
            }
          }}
          onMouseLeave={(e) => {
            if (!isAnimating) {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.color = '#6b7280';
            }
          }}
        >
          <FaPlus size={14} />
          Add Items Manually
          <FaArrowRight size={12} />
        </button>

        {/* Help Text */}
        <p style={{
          fontSize: '14px',
          color: '#9ca3af',
          margin: '0',
          fontStyle: 'italic'
        }}>
          💡 Upload your menu photo and let AI do the work for you!
        </p>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '32px',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowUploadModal(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              <FaTimes />
            </button>

            {uploading ? (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #ef4444',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 24px'
                }} />
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: '0 0 16px 0' }}>
                  Processing Your Menu...
                </h3>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: '0' }}>
                  Our AI is extracting items, prices, and categories from your menu.
                </p>
              </>
            ) : uploadSuccess ? (
              <>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#10b981',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <FaCheckCircle size={40} style={{ color: 'white' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1f2937', margin: '0 0 16px 0' }}>
                  Menu Uploaded Successfully!
                </h3>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: '0' }}>
                  Your menu items have been added to your restaurant.
                </p>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 16px 0' }}>
                  Upload Your Menu
                </h3>
                <p style={{ fontSize: '16px', color: '#6b7280', margin: '0 0 32px 0' }}>
                  Choose how you&apos;d like to upload your menu
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px'
                }}>
                  <button
                    onClick={handleCameraCapture}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '16px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FaCamera size={32} />
                    <span style={{ fontWeight: '600' }}>Take Photo</span>
                  </button>

                  <button
                    onClick={handleGalleryUpload}
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                      color: 'white',
                      padding: '20px',
                      borderRadius: '16px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <FaImage size={32} />
                    <span style={{ fontWeight: '600' }}>From Gallery</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-8px);
          }
          70% {
            transform: translateY(-4px);
          }
          90% {
            transform: translateY(-2px);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default EmptyMenuPrompt;