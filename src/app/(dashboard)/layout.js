'use client';

import { Suspense, useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';

function DashboardLayoutContent({ children }) {
  const [isNavigationHidden, setIsNavigationHidden] = useState(false);

  // Listen for navigation hide/show events
  useEffect(() => {
    const handleNavigationToggle = (event) => {
      setIsNavigationHidden(event.detail.hidden);
    };

    window.addEventListener('navigationToggle', handleNavigationToggle);
    return () => window.removeEventListener('navigationToggle', handleNavigationToggle);
  }, []);

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#f9fafb',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        height: isNavigationHidden ? '0px' : 'auto',
        overflow: 'visible',
        transition: 'height 0.3s ease'
      }}>
        <Navigation isHidden={isNavigationHidden} />
      </div>
      <main style={{ 
        flex: 1, 
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}>
        {children}
      </main>
    </div>
  );
}

function DashboardLayoutFallback({ children }) {
  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#f9fafb',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        padding: '12px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          width: '20px', 
          height: '20px', 
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #ef4444',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </nav>
      <main style={{ flex: 1, overflow: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardLayoutFallback>{children}</DashboardLayoutFallback>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}