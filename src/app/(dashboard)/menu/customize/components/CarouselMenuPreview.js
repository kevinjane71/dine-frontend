import React, { useEffect, useRef, useState } from 'react';

const CarouselMenuPreview = ({ restaurant, menu, device }) => {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Construct the preview URL
  // We use the restaurant ID from the restaurant object
  const restaurantId = restaurant?.id || '';
  const previewUrl = restaurantId 
    ? `/placeorder/carousel?restaurant=${restaurantId}&preview=true` 
    : '';

  useEffect(() => {
    // Reset loading state when URL changes
    setLoading(true);
    setError(false);
  }, [previewUrl]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError(true);
  };

  if (!restaurantId) {
    return (
      <div style={{ 
        width: '100%', 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        borderRadius: '12px',
      }}>
        Restaurant data not available for preview
      </div>
    );
  }

  // Device Dimensions
  const deviceStyles = {
    mobile: {
      width: '375px',
      height: '667px',
      border: '12px solid #1f2937',
      borderRadius: '32px',
    },
    tablet: {
      width: '768px',
      height: '1024px',
      border: '16px solid #1f2937',
      borderRadius: '24px',
    },
    desktop: {
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '0',
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: '#e5e7eb',
      overflow: 'auto'
    }}>
      <div style={{
        position: 'relative',
        ...deviceStyles[device],
        backgroundColor: '#fff',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}>
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            zIndex: 10
          }}>
             <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #f3f4f6',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ marginTop: '12px', fontSize: '14px', color: '#6b7280' }}>Loading preview...</p>
              <style jsx>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
          </div>
        )}
        
        {error ? (
          <div style={{
             position: 'absolute',
             inset: 0,
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'center',
             backgroundColor: '#fff',
             color: '#ef4444',
             padding: '20px',
             textAlign: 'center'
          }}>
            <p>Failed to load preview</p>
            <button 
              onClick={() => {
                if (iframeRef.current) {
                  iframeRef.current.src = iframeRef.current.src;
                  setLoading(true);
                  setError(false);
                }
              }}
              style={{
                marginTop: '12px',
                padding: '6px 12px',
                backgroundColor: '#ef4444',
                color: '#fff',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={previewUrl}
            title="Carousel Menu Preview"
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
          />
        )}
      </div>
    </div>
  );
};

export default CarouselMenuPreview;


