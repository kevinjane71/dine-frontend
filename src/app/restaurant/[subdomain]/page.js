'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RestaurantSubdomainPage() {
  const router = useRouter();

  // Redirect to the public menu page
  useEffect(() => {
    router.push('/placeorder');
  }, [router]);

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
        }}>Redirecting to menu...</p>
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