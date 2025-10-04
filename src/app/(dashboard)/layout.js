'use client';

import { Suspense, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from '../../components/Navigation';

function DashboardLayoutContent({ children }) {
  const [isNavigationHidden, setIsNavigationHidden] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is dashboard
  const isDashboardPage = pathname === '/dashboard';

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
      height: isDashboardPage ? '100vh' : 'auto', // Only dashboard gets 100vh
      minHeight: isDashboardPage ? '100vh' : 'auto',
      backgroundColor: '#f9fafb',
      overflow: isDashboardPage ? 'hidden' : 'visible', // Allow scrolling on other pages
      position: 'relative'
    }}>
      {/* Fixed Navigation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: isNavigationHidden ? '0px' : 'auto',
        overflow: 'hidden',
        transition: 'height 0.3s ease'
      }}>
        <Navigation isHidden={isNavigationHidden} />
      </div>
      
      {/* Main Content with top padding for fixed nav */}
      <main style={{ 
        paddingTop: isNavigationHidden ? '0px' : '80px', // Adjust based on nav height
        minHeight: isDashboardPage ? 'calc(100vh - 80px)' : 'auto',
        overflow: isDashboardPage ? 'hidden' : 'visible', // Allow scrolling on other pages
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
      height: 'auto', // Allow scrolling in fallback too
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      overflow: 'visible', // Allow scrolling
      position: 'relative'
    }}>
      {/* Fixed Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
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
      
      {/* Main Content with top padding for fixed nav */}
      <main style={{ 
        paddingTop: '80px', // Space for fixed navigation
        minHeight: 'calc(100vh - 80px)',
        overflow: 'visible' 
      }}>
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