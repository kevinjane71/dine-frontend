'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main domain login
    const mainDomainLogin = 'https://www.dineopen.com/login';
    console.log('🔄 Redirecting from subdomain login to main domain:', mainDomainLogin);
    window.location.href = mainDomainLogin;
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8fafc',
      flexDirection: 'column'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        maxWidth: '400px'
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
        <h2 style={{
          fontSize: '20px',
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>Redirecting to Login</h2>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0'
        }}>Please login on the main domain...</p>
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

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main domain login
    const mainDomainLogin = 'https://www.dineopen.com/login';
    console.log('🔄 Redirecting from subdomain login to main domain:', mainDomainLogin);
    window.location.href = mainDomainLogin;
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f8fafc',
      flexDirection: 'column'
    }}>
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        maxWidth: '400px'
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
        <h2 style={{
          fontSize: '20px',
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>Redirecting to Login</h2>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0'
        }}>Please login on the main domain...</p>
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
