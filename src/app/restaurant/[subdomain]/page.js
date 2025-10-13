'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRestaurant } from '../../../contexts/RestaurantContext';

export default function RestaurantSubdomainPage() {
  const { restaurant, loading, error } = useRestaurant();
  const router = useRouter();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{
            fontSize: '18px',
            color: '#6b7280',
            margin: 0
          }}>Loading restaurant menu...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '400px'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '1rem'
          }}>🍽️</div>
          <h1 style={{
            fontSize: '24px',
            color: '#1f2937',
            marginBottom: '0.5rem'
          }}>Restaurant Not Found</h1>
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '2rem'
          }}>{error}</p>
          <button
            onClick={() => router.push('/')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
            }}
          >
            Go to DineOpen
          </button>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return null;
  }

  // Redirect to the public menu page (no need for restaurant ID since we're on subdomain)
  useEffect(() => {
    if (restaurant) {
      router.push('/placeorder');
    }
  }, [restaurant, router]);

  return null;
}
