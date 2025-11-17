'use client';

import { useState, useEffect } from 'react';
import apiClient from '../lib/api';
import { 
  FaStar, 
  FaQrcode, 
  FaRobot,
  FaSave,
  FaEdit,
  FaDownload,
  FaCopy,
  FaCheck,
  FaGoogle,
  FaSpinner,
  FaLink,
  FaCog
} from 'react-icons/fa';

export default function GoogleReviews({ restaurantId, restaurant }) {
  const [settings, setSettings] = useState({
    googleReviewUrl: '',
    aiEnabled: true,
    customMessage: '',
    qrCodeUrl: null
  });
  const [loading, setLoading] = useState(false);
  const [generatingQR, setGeneratingQR] = useState(false);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    customerName: '',
    rating: 5,
    reviewText: '',
    placeId: ''
  });
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (restaurantId) {
      loadSettings();
    }
  }, [restaurantId]);

  const loadSettings = async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      const response = await apiClient.getGoogleReviewSettings(restaurantId);
      if (response.success && response.settings) {
        setSettings(response.settings);
        if (response.settings.googleReviewUrl) {
          setReviewForm(prev => ({ ...prev, placeId: response.settings.googleReviewUrl }));
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!restaurantId) return;
    
    try {
      setLoading(true);
      await apiClient.updateGoogleReviewSettings(restaurantId, settings);
      alert('Settings saved successfully!');
      
      // Generate QR code if URL is provided
      if (settings.googleReviewUrl) {
        generateQRCode();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    if (!settings.googleReviewUrl) {
      alert('Please enter a Google Review URL first');
      return;
    }

    try {
      setGeneratingQR(true);
      const response = await apiClient.generateQRCode(restaurantId, settings.googleReviewUrl);
      if (response.success) {
        setSettings(prev => ({ ...prev, qrCodeUrl: response.qrCodeUrl }));
        alert('QR code generated successfully!');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code: ' + (error.message || 'Unknown error'));
    } finally {
      setGeneratingQR(false);
    }
  };

  const generateReviewContent = async () => {
    if (!settings.aiEnabled) {
      return;
    }

    if (!reviewForm.customerName) {
      alert('Please enter customer name first');
      return;
    }

    try {
      setGeneratingContent(true);
      const response = await apiClient.generateReviewContent(
        restaurantId,
        reviewForm.customerName,
        reviewForm.rating
      );
      
      if (response.success) {
        setReviewForm(prev => ({ ...prev, reviewText: response.reviewContent }));
      }
    } catch (error) {
      console.error('Error generating review content:', error);
      alert('Failed to generate review content: ' + (error.message || 'Unknown error'));
    } finally {
      setGeneratingContent(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadQRCode = () => {
    if (!settings.qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = settings.qrCodeUrl;
    link.download = `google-review-qr-${restaurantId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const constructGoogleReviewUrl = (input) => {
    if (!input) return '';
    
    // If it's already a full write review URL, return it
    if (input.includes('writereview') || input.includes('placeid=')) {
      return input;
    }
    
    // If it's already a full URL (but not write review), try to extract Place ID
    if (input.startsWith('http')) {
      // Extract Place ID from Google Maps URL
      const placeIdMatch = input.match(/place\/([^\/]+)/) || input.match(/placeid=([^&]+)/);
      if (placeIdMatch) {
        return `https://search.google.com/local/writereview?placeid=${placeIdMatch[1]}`;
      }
      // If it's a g.page short URL, return as is (it should redirect to write review)
      if (input.includes('g.page')) {
        return input;
      }
      return input;
    }
    
    // If it's a Place ID (long alphanumeric string), construct write review URL
    if (input.length > 20 && !input.includes('/') && !input.includes('?')) {
      return `https://search.google.com/local/writereview?placeid=${input}`;
    }
    
    return '';
  };

  const handleUrlChange = (url) => {
    setSettings(prev => ({ ...prev, googleReviewUrl: url }));
    setReviewForm(prev => ({ ...prev, placeId: url }));
  };

  return (
    <div style={{ 
      padding: isMobile ? '20px' : '24px', 
      backgroundColor: '#fafafa', 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '24px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: '16px'
      }}>
        <div>
          <h2 style={{ 
            fontSize: isMobile ? '24px' : '32px', 
            fontWeight: '900', 
            color: '#1f2937', 
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <FaGoogle size={28} style={{ color: '#4285F4' }} />
            Google Reviews
          </h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Generate QR codes and manage Google Review links for your restaurant
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: '24px',
        marginBottom: '24px'
      }}>
        {/* Settings Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaCog size={18} />
            Review Settings
          </h3>

          {/* Google Review URL */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Google Review URL or Place ID *
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={settings.googleReviewUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="Enter Place ID or Google Maps URL (e.g., ChIJN1t_tDeuEmsRUsoyG83frY4)"
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <button
                onClick={() => {
                  const url = constructGoogleReviewUrl(settings.googleReviewUrl);
                  if (url) {
                    window.open(url, '_blank');
                  } else {
                    alert('Please enter a valid Place ID or Google Maps URL');
                  }
                }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#4285F4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                <FaLink size={14} />
                Test
              </button>
            </div>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '6px',
              lineHeight: '1.5'
            }}>
              Enter your Google Place ID or Google Maps URL. The QR code will open the Google Review writing page where customers can directly post their review.
            </p>
            <div style={{
              marginTop: '8px',
              padding: '10px',
              backgroundColor: '#eff6ff',
              borderRadius: '6px',
              border: '1px solid #bfdbfe'
            }}>
              <p style={{
                fontSize: '11px',
                color: '#1e40af',
                margin: 0,
                lineHeight: '1.5'
              }}>
                <strong>How to find your Place ID:</strong> Go to your Google Business Profile → Share → Copy link → The Place ID is in the URL (or use the full Google Maps URL)
              </p>
            </div>
          </div>

          {/* AI Toggle */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={settings.aiEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, aiEnabled: e.target.checked }))}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaRobot size={16} style={{ color: '#ef4444' }} />
                Enable AI Review Generation
              </span>
            </label>
            <p style={{
              fontSize: '12px',
              color: '#6b7280',
              marginTop: '6px',
              marginLeft: '32px'
            }}>
              AI will generate authentic review content based on restaurant details
            </p>
          </div>

          {/* Custom Message */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Custom Message (Optional)
            </label>
            <textarea
              value={settings.customMessage}
              onChange={(e) => setSettings(prev => ({ ...prev, customMessage: e.target.value }))}
              placeholder="Add a custom message to show with QR code..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveSettings}
            disabled={loading || !settings.googleReviewUrl}
            style={{
              width: '100%',
              padding: '12px',
              background: loading || !settings.googleReviewUrl 
                ? '#9ca3af' 
                : 'linear-gradient(135deg, #4285F4, #1a73e8)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: loading || !settings.googleReviewUrl ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? (
              <>
                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FaSave size={14} />
                <span>Save Settings</span>
              </>
            )}
          </button>
        </div>

        {/* QR Code Card */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          border: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaQrcode size={18} />
            QR Code
          </h3>

          {settings.qrCodeUrl ? (
            <>
              <div style={{
                padding: '20px',
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={settings.qrCodeUrl} 
                  alt="Google Review QR Code"
                  style={{
                    width: '250px',
                    height: '250px',
                    display: 'block'
                  }}
                />
              </div>
              
              <div style={{
                display: 'flex',
                gap: '12px',
                width: '100%',
                maxWidth: '300px'
              }}>
                <button
                  onClick={downloadQRCode}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  <FaDownload size={14} />
                  Download
                </button>
                <button
                  onClick={() => copyToClipboard(settings.googleReviewUrl)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: copied ? '#10b981' : '#4285F4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  {copied ? <FaCheck size={14} /> : <FaCopy size={14} />}
                  {copied ? 'Copied!' : 'Copy URL'}
                </button>
              </div>

              {settings.customMessage && (
                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  width: '100%',
                  maxWidth: '300px'
                }}>
                  <p style={{
                    fontSize: '13px',
                    color: '#374151',
                    textAlign: 'center',
                    margin: 0,
                    lineHeight: '1.6'
                  }}>
                    {settings.customMessage}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#6b7280'
            }}>
              <FaQrcode size={48} style={{ marginBottom: '16px', color: '#d1d5db' }} />
              <p style={{ fontSize: '14px', marginBottom: '16px' }}>
                {settings.googleReviewUrl 
                  ? 'Click "Save Settings" to generate QR code that opens the Google Review writing page'
                  : 'Enter Google Place ID or URL and save to generate QR code'}
              </p>
              {settings.googleReviewUrl && (
                <button
                  onClick={generateQRCode}
                  disabled={generatingQR}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: generatingQR ? '#9ca3af' : '#4285F4',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: generatingQR ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 auto'
                  }}
                >
                  {generatingQR ? (
                    <>
                      <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <FaQrcode size={14} />
                      <span>Generate QR Code</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Form Card */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid #e5e7eb',
        marginTop: '24px'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <FaStar size={18} style={{ color: '#fbbf24' }} />
          Generate Review Content
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          {/* Customer Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Customer Name *
            </label>
            <input
              type="text"
              value={reviewForm.customerName}
              onChange={(e) => setReviewForm(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="Enter customer name"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Rating */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Rating *
            </label>
            <div style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => setReviewForm(prev => ({ ...prev, rating }))}
                  style={{
                    padding: '8px',
                    backgroundColor: reviewForm.rating >= rating ? '#fbbf24' : '#f3f4f6',
                    color: reviewForm.rating >= rating ? 'white' : '#6b7280',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '20px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (reviewForm.rating < rating) {
                      e.target.style.backgroundColor = '#fef3c7';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (reviewForm.rating < rating) {
                      e.target.style.backgroundColor = '#f3f4f6';
                    }
                  }}
                >
                  <FaStar size={20} />
                </button>
              ))}
              <span style={{
                fontSize: '14px',
                color: '#6b7280',
                marginLeft: '8px',
                fontWeight: '600'
              }}>
                {reviewForm.rating} {reviewForm.rating === 1 ? 'Star' : 'Stars'}
              </span>
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}>
              Review Text *
            </label>
            {settings.aiEnabled && (
              <button
                onClick={generateReviewContent}
                disabled={generatingContent || !reviewForm.customerName}
                style={{
                  padding: '8px 16px',
                  backgroundColor: generatingContent || !reviewForm.customerName 
                    ? '#9ca3af' 
                    : 'linear-gradient(135deg, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: generatingContent || !reviewForm.customerName ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {generatingContent ? (
                  <>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FaRobot size={12} />
                    <span>AI Generate</span>
                  </>
                )}
              </button>
            )}
          </div>
          <textarea
            value={reviewForm.reviewText}
            onChange={(e) => setReviewForm(prev => ({ ...prev, reviewText: e.target.value }))}
            placeholder={settings.aiEnabled 
              ? "Click 'AI Generate' to create review content, or type your own..."
              : "Enter your review text..."}
            rows={6}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              lineHeight: '1.6'
            }}
          />
          <p style={{
            fontSize: '12px',
            color: '#6b7280',
            marginTop: '6px'
          }}>
            {reviewForm.reviewText.length} characters (Recommended: 50-200)
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => {
              const url = constructGoogleReviewUrl(settings.googleReviewUrl);
              if (url) {
                // Open in new tab - this will take customer directly to write review page
                window.open(url, '_blank', 'noopener,noreferrer');
              } else {
                alert('Please configure Google Review URL or Place ID first in Settings');
              }
            }}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '12px 24px',
              backgroundColor: '#4285F4',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#1a73e8';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#4285F4';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <FaGoogle size={14} />
            <span>Open Google Review Writing Page</span>
          </button>
          
          <button
            onClick={() => {
              if (reviewForm.reviewText) {
                copyToClipboard(reviewForm.reviewText);
              } else {
                alert('Please enter review text first');
              }
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FaCopy size={14} />
            <span>Copy Review</span>
          </button>
        </div>

        {/* How It Works */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#1e40af',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <FaQrcode size={14} />
            How It Works
          </h4>
          <ol style={{
            fontSize: '12px',
            color: '#1e3a8a',
            margin: 0,
            paddingLeft: '20px',
            lineHeight: '1.8'
          }}>
            <li>Customer scans the QR code</li>
            <li>Google Review writing page opens directly</li>
            <li>Customer writes and posts their review on Google</li>
            <li>Review appears on your Google Business Profile</li>
          </ol>
        </div>

        {/* Google Review Guidelines */}
        <div style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #fbbf24'
        }}>
          <h4 style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#92400e',
            marginBottom: '8px'
          }}>
            Google Review Guidelines
          </h4>
          <ul style={{
            fontSize: '12px',
            color: '#78350f',
            margin: 0,
            paddingLeft: '20px',
            lineHeight: '1.8'
          }}>
            <li>Be honest and authentic</li>
            <li>Focus on your actual experience</li>
            <li>Be helpful to other customers</li>
            <li>Avoid spam, fake content, or promotional language</li>
            <li>Keep it relevant and respectful</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

