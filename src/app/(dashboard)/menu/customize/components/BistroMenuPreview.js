'use client';

import { useEffect, useRef, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';

const BistroMenuPreview = ({ restaurant, menu, device = 'mobile' }) => {
  const iframeRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (iframeRef.current && restaurant?.id) {
      setLoading(true);
      setError(false);
      const url = `${window.location.origin}/placeorder/bistro?restaurant=${restaurant.id}`;
      iframeRef.current.src = url;
      
      const iframe = iframeRef.current;
      const handleLoad = () => {
        setLoading(false);
      };
      const handleError = () => {
        setLoading(false);
        setError(true);
      };
      
      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);
      
      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
      };
    }
  }, [restaurant?.id, device]);

  const deviceStyles = {
    mobile: { width: '375px', height: '667px', maxWidth: '100%' },
    tablet: { width: '768px', height: '1024px', maxWidth: '100%' },
    desktop: { width: '100%', height: '800px', maxHeight: '90vh' },
  };

  const style = deviceStyles[device] || deviceStyles.mobile;

  if (!restaurant?.id) {
    return (
      <div
        style={{
          ...style,
          border: '8px solid #1f2937',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f3f4f6',
          color: '#6b7280',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p>Loading restaurant data...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        ...style,
        border: '8px solid #1f2937',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        backgroundColor: '#000',
        position: 'relative',
      }}
    >
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 10,
          }}
        >
          <div style={{ textAlign: 'center', color: 'white' }}>
            <FaSpinner size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '12px' }} />
            <p>Loading preview...</p>
          </div>
        </div>
      )}
      {error && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 10,
            color: 'white',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <p>Failed to load preview. Please try again.</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        title="Bistro Menu Preview"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        allow="camera; microphone; geolocation"
      />
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

export default BistroMenuPreview;

