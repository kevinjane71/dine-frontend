'use client';

import React from 'react';

class PrefetchErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Check if this is a prefetch-related error
    if (error?.message?.includes('prefetch') || 
        error?.message?.includes('Next-Router-Prefetch') ||
        error?.stack?.includes('prefetch')) {
      console.log('🚫 Prefetch error caught and ignored:', error.message);
      // Don't update state for prefetch errors - just ignore them
      return null;
    }
    
    // For other errors, update state to show error UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log prefetch errors but don't treat them as critical
    if (error?.message?.includes('prefetch') || 
        error?.message?.includes('Next-Router-Prefetch') ||
        error?.stack?.includes('prefetch')) {
      console.log('🚫 Prefetch error caught in error boundary:', {
        error: error.message,
        stack: error.stack,
        errorInfo
      });
      return; // Don't log to error reporting service
    }
    
    // Log other errors normally
    console.error('❌ Error caught by boundary:', error, errorInfo);
  }

  render() {
    // For prefetch errors, just render children normally
    if (this.state.error?.message?.includes('prefetch') || 
        this.state.error?.message?.includes('Next-Router-Prefetch')) {
      return this.props.children;
    }
    
    // For other errors, show error UI
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          margin: '20px',
          color: '#dc2626'
        }}>
          <h2>Something went wrong</h2>
          <p>Please refresh the page or try again.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default PrefetchErrorBoundary;
