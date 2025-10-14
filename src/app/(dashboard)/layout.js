'use client';

import { Suspense, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { DineBotProvider } from '../../components/DineBotProvider';
import DineBotButton from '../../components/DineBotButton';

function DashboardLayoutContent({ children }) {
  const [isNavigationHidden, setIsNavigationHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [redirectChecked, setRedirectChecked] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is dashboard
  const isDashboardPage = pathname === '/dashboard';
  
  // Check if user should be redirected to their default restaurant subdomain
  useEffect(() => {
    const checkMainDomainRedirect = async () => {
      const hostname = window.location.hostname;
      const isMainDomain = hostname === 'www.dineopen.com' || hostname === 'dineopen.com' || hostname === 'localhost:3002';
      
      if (!isMainDomain) {
        setRedirectChecked(true);
        return;
      }
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        setRedirectChecked(true);
        return;
      }
      
      try {
        const userData = JSON.parse(user);
        const defaultRestaurantId = userData.defaultRestaurantId;
        
        if (defaultRestaurantId) {
          // Get user's restaurants to find the default one
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003';
          const response = await fetch(`${apiBaseUrl}/api/restaurants`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            const restaurants = data.restaurants || [];
            const defaultRestaurant = restaurants.find(r => r.id === defaultRestaurantId && r.subdomain);
            
            if (defaultRestaurant) {
              console.log('🔄 Redirecting from main domain to default restaurant subdomain');
              const redirectUrl = `https://${defaultRestaurant.subdomain}.dineopen.com${pathname}`;
              window.location.href = redirectUrl;
              return;
            }
          }
        }
        
        setRedirectChecked(true);
      } catch (error) {
        console.error('Error checking main domain redirect:', error);
        setRedirectChecked(true);
      }
    };
    
    checkMainDomainRedirect();
  }, [pathname]);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for navigation hide/show events
  useEffect(() => {
    const handleNavigationToggle = (event) => {
      setIsNavigationHidden(event.detail.hidden);
    };

    window.addEventListener('navigationToggle', handleNavigationToggle);
    return () => window.removeEventListener('navigationToggle', handleNavigationToggle);
  }, []);

  // Show loading while checking redirect
  if (!redirectChecked) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #ef4444',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading...</p>
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

  return (
    <DineBotProvider>
      <div style={{ 
        height: (isDashboardPage && !isMobile) ? '100vh' : 'auto', // Only desktop dashboard gets 100vh
        minHeight: (isDashboardPage && !isMobile) ? '100vh' : 'auto',
        backgroundColor: '#f9fafb',
        overflow: (isDashboardPage && !isMobile) ? 'hidden' : 'visible', // Allow scrolling on mobile and other pages
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
          overflow: 'visible',
          transition: 'height 0.3s ease'
        }}>
          <Navigation isHidden={isNavigationHidden} />
        </div>
        
        {/* Main Content with top padding for fixed nav */}
        <main style={{ 
          paddingTop: isNavigationHidden ? '0px' : '80px', // Adjust based on nav height
          minHeight: (isDashboardPage && !isMobile) ? 'calc(100vh - 80px)' : 'auto',
          overflow: (isDashboardPage && !isMobile) ? 'hidden' : 'visible', // Allow scrolling on mobile and other pages
          transition: 'all 0.3s ease'
        }}>
          {children}
        </main>
        
        {/* DineBot Floating Button */}
        <DineBotButton />
      </div>
    </DineBotProvider>
  );
}

function DashboardLayoutFallback({ children }) {
  return (
    <DineBotProvider>
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
        
        {/* DineBot Floating Button */}
        <DineBotButton />
      </div>
    </DineBotProvider>
  );
}

export default function DashboardLayout({ children }) {
  return (
    <Suspense fallback={<DashboardLayoutFallback>{children}</DashboardLayoutFallback>}>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </Suspense>
  );
}