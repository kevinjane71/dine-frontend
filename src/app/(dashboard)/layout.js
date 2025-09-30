'use client';

import { Suspense } from 'react';
import Navigation from '../../components/Navigation';

function DashboardLayoutContent({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Navigation />
      <main>
        {children}
      </main>
    </div>
  );
}

function DashboardLayoutFallback({ children }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
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
      <main>
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