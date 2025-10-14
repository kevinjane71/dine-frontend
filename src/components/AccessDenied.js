'use client';

import { useRouter } from 'next/navigation';
import { FaLock, FaArrowLeft, FaHome } from 'react-icons/fa';

export default function AccessDenied() {
  const router = useRouter();

  const handleGoToMainDomain = () => {
    window.location.href = 'https://www.dineopen.com/login';
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8fafc',
      padding: '2rem'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Lock Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          backgroundColor: '#fee2e2',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 2rem',
          fontSize: '32px',
          color: '#dc2626'
        }}>
          <FaLock />
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '28px',
          color: '#1f2937',
          marginBottom: '1rem',
          fontWeight: '700'
        }}>
          Access Denied
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          You don&apos;t have permission to access this restaurant. This could be because:
        </p>

        {/* Reasons ddd*/}
        <div style={{
          textAlign: 'left',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <ul style={{
            margin: '0',
            paddingLeft: '1.5rem',
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: '1.8'
          }}>
            <li>You&apos;re not authorized to manage this restaurant</li>
            <li>The restaurant doesn&apos;t exist</li>
            <li>Your access has been revoked</li>
            <li>You&apos;re trying to access someone else&apos;s restaurant</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleGoToMainDomain}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            <FaHome />
            Go to Main Site
          </button>

          <button
            onClick={handleGoBack}
            style={{
              backgroundColor: 'white',
              color: '#6b7280',
              padding: '12px 24px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#f9fafb';
              e.target.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            <FaArrowLeft />
            Go Back
          </button>
        </div>

        {/* Security Notice */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          border: '1px solid #f59e0b',
          fontSize: '14px',
          color: '#92400e'
        }}>
          <strong>Security Notice:</strong> Attempting to access unauthorized restaurants is logged and monitored for security purposes.
        </div>
      </div>
    </div>
  );
}